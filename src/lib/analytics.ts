/**
 * Analytics privacy-first (Umami): sem cookies, sem dados pessoais.
 * Configure VITE_UMAMI_WEBSITE_ID (e opcionalmente VITE_UMAMI_SRC) para ativar.
 */
export const UMAMI_WEBSITE_ID =
  (import.meta.env['VITE_UMAMI_WEBSITE_ID'] as string | undefined) ?? "";

export const UMAMI_SRC =
  (import.meta.env['VITE_UMAMI_SRC'] as string | undefined) ??
  "https://cloud.umami.is/script.js";

type Umami = { track: (event: string, data?: Record<string, unknown>) => void };

/** Dispara um evento anônimo. Silencioso quando o analytics não está ativo. */
export function track(event: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const umami = (window as unknown as { umami?: Umami }).umami;
  try {
    umami?.track(event, data);
  } catch {
    /* analytics nunca deve quebrar a experiência */
  }
}

export const EVENTS = {
  homeView: "home_visita",
  onboardingDone: "onboarding_concluido",
  assessmentDone: "autoavaliacao_concluida",
  counterStarted: "contador_iniciado",
  simulatorUsed: "simulador_usado",
  helpClick: "preciso_de_ajuda",
  waitlistSignup: "lista_espera_cadastro",
} as const;
