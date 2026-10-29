import { useCallback, useState } from "react";

/**
 * Perfil de acesso do AF People. Fica só no aparelho (localStorage):
 * nenhum e-mail, matrícula ou senha é pedido ao estudante.
 */
export type AccessMode = "student" | "free";

export type Access = {
  mode: AccessMode;
  /** Código da instituição parceira, quando o estudante escolheu uma. */
  partner?: string;
};

export const ACCESS_KEY = "anf.access";

/** Quem já usava o app antes do AF 2.0 continua no acesso livre. */
export const DEFAULT_ACCESS: Access = { mode: "free" };

function readAccess(): Access {
  if (typeof window === "undefined") return DEFAULT_ACCESS;
  try {
    const raw = window.localStorage.getItem(ACCESS_KEY);
    return raw ? (JSON.parse(raw) as Access) : DEFAULT_ACCESS;
  } catch {
    return DEFAULT_ACCESS;
  }
}

/** Diferente do useLocalStorage, só grava quando a pessoa escolhe de fato. */
export function useAccess() {
  const [access, setState] = useState<Access>(readAccess);
  const setAccess = useCallback((next: Access) => {
    setState(next);
    try {
      window.localStorage.setItem(ACCESS_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);
  return [access, setAccess] as const;
}

export function readAccessChosen(): boolean {
  try {
    return window.localStorage.getItem(ACCESS_KEY) !== null;
  } catch {
    return false;
  }
}

/** Sessão de demonstração do AF Campus (sessionStorage, some ao fechar a aba). */
export const CAMPUS_SESSION_KEY = "anf.campus";
