import { useCallback, useSyncExternalStore } from "react";

/**
 * Estado guardado no localStorage, sem erro de hidratação.
 *
 * O servidor e a primeira renderização no navegador usam o valor inicial;
 * logo depois da hidratação o React troca pelo valor salvo no aparelho.
 * Nada é gravado só por abrir a tela: o valor vai para o localStorage
 * apenas quando a pessoa muda alguma coisa.
 */

type Entry = { raw: string | null; value: unknown };

const cache = new Map<string, Entry>();
const serverCache = new Map<string, unknown>();
const listeners = new Map<string, Set<() => void>>();

function emit(key: string) {
  listeners.get(key)?.forEach((fn) => fn());
}

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function read<T>(key: string, initial: T): T {
  const raw = readRaw(key);
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.value as T;
  let value: unknown = initial;
  if (raw !== null) {
    try {
      value = JSON.parse(raw);
    } catch {
      value = initial;
    }
  }
  cache.set(key, { raw, value });
  return value as T;
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key) emit(e.key);
  });
}

export function useLocalStorage<T>(key: string, initial: T) {
  const subscribe = useCallback(
    (fn: () => void) => {
      let set = listeners.get(key);
      if (!set) {
        set = new Set();
        listeners.set(key, set);
      }
      set.add(fn);
      return () => {
        set?.delete(fn);
      };
    },
    [key],
  );

  const value = useSyncExternalStore(
    subscribe,
    () => read<T>(key, initial),
    () => {
      if (!serverCache.has(key)) serverCache.set(key, initial);
      return serverCache.get(key) as T;
    },
  );

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = read<T>(key, initial);
      const resolved =
        typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      const raw = JSON.stringify(resolved);
      try {
        window.localStorage.setItem(key, raw);
      } catch {
        // armazenamento indisponível (aba anônima, cota): fica só na memória
      }
      cache.set(key, { raw, value: resolved });
      emit(key);
    },
    // `initial` muda de identidade a cada render; só a chave importa aqui.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  return [value, setValue] as const;
}
