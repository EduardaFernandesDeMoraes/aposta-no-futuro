import { useEffect, useState } from "react";
import { Download, Share, PlusSquare, Check, Smartphone } from "lucide-react";
import { track, trackOnce } from "@/lib/analytics";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "anf.instalar.dispensado";
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

function isStandalone() {
  if (typeof window === "undefined") return true;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIOS() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (/Macintosh/.test(ua) && (navigator as Navigator).maxTouchPoints > 1)
  );
}

function dismissedRecently() {
  try {
    const raw = window.localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    return Date.now() - Number(raw) < SEVEN_DAYS;
  } catch {
    return false;
  }
}

/** Card que ajuda a instalar o app na tela inicial (Android nativo / iOS passo a passo). */
export function InstallCard({ className = "" }: { className?: string }) {
  const [visible, setVisible] = useState(false);
  const [ios, setIos] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );

  useEffect(() => {
    if (isStandalone() || dismissedRecently()) return;

    const onInstalled = () => {
      track("instalar_concluido");
      setVisible(false);
    };
    window.addEventListener("appinstalled", onInstalled);

    if (isIOS()) {
      setIos(true);
      setVisible(true);
      window.addEventListener("appinstalled", onInstalled);
      return () => window.removeEventListener("appinstalled", onInstalled);
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  useEffect(() => {
    if (visible) trackOnce("instalar_card_exibido");
  }, [visible]);

  if (!visible) return null;

  function dismiss() {
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignora */
    }
    setVisible(false);
  }

  async function install() {
    track("instalar_clicado");
    if (!deferred) return;
    try {
      await deferred.prompt();
      await deferred.userChoice;
    } catch {
      /* ignora */
    }
    setDeferred(null);
    setVisible(false);
  }

  return (
    <section
      className={`rounded-2xl bg-card p-4 shadow-card ${className}`}
      aria-label="Instalar o app na tela inicial"
    >
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-teal/15 text-teal">
          <Smartphone className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-navy">
            Deixe o app na sua tela inicial
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            Fica igual a um aplicativo, abre mais rápido e continua sem ocupar
            espaço no celular.
          </p>
        </div>
      </div>

      {ios ? (
        <ol className="mt-4 space-y-2">
          <Step
            icon={<Share className="h-4 w-4" />}
            text="Toque no botão Compartilhar (ícone de quadrado com seta para cima) na barra do Safari."
          />
          <Step
            icon={<PlusSquare className="h-4 w-4" />}
            text="Role e toque em “Adicionar à Tela de Início”."
          />
          <Step
            icon={<Check className="h-4 w-4" />}
            text="Toque em “Adicionar”."
          />
        </ol>
      ) : (
        <button
          type="button"
          onClick={install}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-teal px-4 py-3 text-sm font-semibold text-teal-foreground transition-all duration-200 hover:bg-[#14ac9b] active:scale-95"
        >
          <Download className="h-4 w-4" />
          Adicionar agora
        </button>
      )}

      <button
        type="button"
        onClick={dismiss}
        className="mt-2 w-full rounded-full py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-navy"
      >
        Agora não
      </button>
    </section>
  );
}

function Step({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-start gap-3 rounded-xl bg-[#E1F5EE] p-3">
      <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-white text-teal">
        {icon}
      </span>
      <span className="text-sm leading-relaxed text-slate-600">{text}</span>
    </li>
  );
}
