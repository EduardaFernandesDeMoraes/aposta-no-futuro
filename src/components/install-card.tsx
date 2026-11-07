import { useEffect, useState, useSyncExternalStore } from "react";
import {
  Download,
  Share,
  PlusSquare,
  Check,
  Smartphone,
  MoreVertical,
  X,
  ChevronDown,
} from "lucide-react";
import { track, trackOnce } from "@/lib/analytics";
import {
  getInstallPrompt,
  getInstalled,
  runInstallPrompt,
  subscribeInstallPrompt,
} from "@/lib/install-prompt";

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

/** Card que ajuda a instalar o app na tela inicial. */
export function InstallCard({ className = "" }: { className?: string }) {
  // Estado global: o evento pode ter sido capturado antes desta tela montar.
  const prompt = useSyncExternalStore(
    subscribeInstallPrompt,
    getInstallPrompt,
    () => null,
  );
  const installedNow = useSyncExternalStore(
    subscribeInstallPrompt,
    getInstalled,
    () => false,
  );

  const [mounted, setMounted] = useState(false);
  const [ios, setIos] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setIos(isIOS());
    setDismissed(isStandalone() || dismissedRecently());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (installedNow) track("instalar_concluido");
  }, [installedNow]);

  // O card aparece sempre que o app não está instalado nem dispensado.
  // Sem o evento nativo, mostramos as instruções manuais (fallback).
  const visible = mounted && !dismissed && !installedNow;

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
    setDismissed(true);
  }

  async function install() {
    track("instalar_clicado");
    await runInstallPrompt();
  }

  return (
    <section
      className={`rounded-3xl border border-border bg-card ${className}`}
      aria-label="Instalar o app na tela inicial"
    >
      <div className="flex items-center gap-3 p-4">
        <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-teal-soft text-teal-deep">
          <Smartphone className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold leading-snug text-navy">
            Deixe o app na tela inicial
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Abre mais rápido e não ocupa espaço.
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dispensar por 7 dias"
          className="grid h-11 w-11 flex-none place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-navy"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {!open && !(prompt && !ios) ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={false}
          className="flex min-h-12 w-full items-center justify-center gap-1.5 border-t border-border text-sm font-semibold text-teal-deep transition-colors hover:bg-background"
        >
          Ver como fazer
          <ChevronDown className="h-4 w-4" />
        </button>
      ) : null}

      <div className={!open && !(prompt && !ios) ? "hidden" : "px-4 pb-4"}>
      {!open && !(prompt && !ios) ? null : ios ? (
        <ol className="space-y-2">
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
      ) : prompt ? (
        <button
          type="button"
          onClick={install}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-teal-deep px-4 text-sm font-semibold text-white transition-colors hover:bg-teal-ink"
        >
          <Download className="h-4 w-4" />
          Adicionar agora
        </button>
      ) : (
        <ol className="space-y-2">
          <Step
            icon={<MoreVertical className="h-4 w-4" />}
            text="Toque no menu do navegador (três pontos, no canto superior)."
          />
          <Step
            icon={<PlusSquare className="h-4 w-4" />}
            text="Escolha “Adicionar à tela inicial” (ou “Instalar aplicativo”)."
          />
          <Step
            icon={<Check className="h-4 w-4" />}
            text="Confirme em “Adicionar”."
          />
        </ol>
      )}
      </div>
    </section>
  );
}

function Step({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-start gap-3 rounded-2xl bg-background p-3">
      <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-teal-soft text-teal-deep">
        {icon}
      </span>
      <span className="text-sm leading-relaxed text-navy">{text}</span>
    </li>
  );
}
