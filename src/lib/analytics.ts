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

function getUmami(): Umami | undefined {
  return (window as unknown as { umami?: Umami }).umami;
}

/** Eventos disparados antes do script (defer) terminar de carregar. */
const queue: string[] = [];
let draining = false;

function drain() {
  if (draining) return;
  draining = true;
  const tick = () => {
    const umami = getUmami();
    if (!umami) {
      window.setTimeout(tick, 300);
      return;
    }
    while (queue.length) {
      const name = queue.shift()!;
      try {
        umami.track(name);
      } catch {
        /* analytics nunca deve quebrar a experiência */
      }
    }
    draining = false;
  };
  tick();
}

/**
 * Dispara um evento anônimo (apenas o nome do evento — nunca dados pessoais).
 * Se o script ainda não carregou, o evento fica na fila e é enviado depois.
 */
export function track(event: string) {
  if (typeof window === "undefined") return;
  const umami = getUmami();
  if (umami) {
    try {
      umami.track(event);
    } catch {
      /* analytics nunca deve quebrar a experiência */
    }
    return;
  }
  queue.push(event);
  drain();
}

/** Garante que um evento dispare uma única vez por sessão de página. */
const fired = new Set<string>();
export function trackOnce(event: string) {
  if (fired.has(event)) return;
  fired.add(event);
  track(event);
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
  capsClicked: "caps_clicado",
} as const;
