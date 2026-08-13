/**
 * Analytics privacy-first (Umami): sem cookies, sem dados pessoais.
 * Configure VITE_UMAMI_WEBSITE_ID (e opcionalmente VITE_UMAMI_SRC) para ativar.
 */
export const UMAMI_WEBSITE_ID =
  (import.meta.env['VITE_UMAMI_WEBSITE_ID'] as string | undefined) ??
  "7b5f960a-7f16-4358-ba39-6edb0d107da4";


export const UMAMI_SRC =
  (import.meta.env['VITE_UMAMI_SRC'] as string | undefined) ??
  "https://cloud.umami.is/script.js";

type Umami = { track: (event: string, data?: Record<string, unknown>) => void };

/**
 * Dispara um evento anônimo (apenas o nome do evento — nunca dados pessoais).
 * Silencioso quando o analytics não está ativo.
 */
export function track(event: string) {
  if (typeof window === "undefined") return;
  const umami = (window as unknown as { umami?: Umami }).umami;
  try {
    umami?.track(event);
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
  helpClick: "ajuda_acessada",
  waitlistSignup: "lista_espera_cadastro",
  communityPreview: "previa_comunidade_aberta",
} as const;
