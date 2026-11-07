import { useLocalStorage } from "@/hooks/use-local-storage";

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

/**
 * Diferente de antes, a leitura acontece depois da hidratação (sem erro de
 * HTML diferente entre servidor e aparelho), e só grava quando a pessoa
 * escolhe de fato.
 */
export function useAccess() {
  return useLocalStorage<Access>(ACCESS_KEY, DEFAULT_ACCESS);
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
