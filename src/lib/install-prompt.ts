/**
 * Captura global do evento `beforeinstallprompt`.
 *
 * O Chrome dispara esse evento UMA única vez, logo no carregamento da página.
 * Se o listener estiver dentro de uma tela específica (ex.: Home), qualquer
 * outra tela (Perfil) nunca vê o evento. Por isso o listener é registrado no
 * módulo, na primeira importação, e o evento fica guardado em estado global.
 */

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let installed = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e: Event) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    emit();
  });
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    installed = true;
    emit();
  });
}

export function subscribeInstallPrompt(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getInstallPrompt() {
  return deferredPrompt;
}

export function getInstalled() {
  return installed;
}

export async function runInstallPrompt() {
  const evt = deferredPrompt;
  if (!evt) return null;
  try {
    await evt.prompt();
    const choice = await evt.userChoice;
    deferredPrompt = null;
    emit();
    return choice.outcome;
  } catch {
    return null;
  }
}
