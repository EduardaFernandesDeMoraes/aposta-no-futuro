import { SiteFooter } from "@/components/site-footer";
import { AutoGrowTextarea } from "@/components/auto-grow-textarea";
import { Link, useLocation, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import {
  Home,
  Calculator,
  HeartHandshake,
  Flag,
  User,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Phone,
  Send,
  RotateCcw,
  Wind,
  Timer,
  Heart,
} from "lucide-react";
import logoMark from "@/assets/logo-maos-coracao.svg";
import { BrandLockup } from "@/components/brand-lockup";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useAccess } from "@/lib/access";
import { findPartner } from "@/lib/partners";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

type Tab = {
  to: string;
  label: string;
  icon: typeof Home;
  /** Outras rotas que pertencem a esta aba. */
  match?: string[];
};

const TABS: Tab[] = [
  { to: "/", label: "Início", icon: Home },
  { to: "/simulador", label: "Simulador", icon: Calculator },
  {
    to: "/cuidar",
    label: "Cuidar",
    icon: HeartHandshake,
    match: ["/autoavaliacao", "/guia", "/ajuda", "/comunidade"],
  },
  { to: "/metas", label: "Metas", icon: Flag },
  { to: "/perfil", label: "Perfil", icon: User },
];

const ROOT_PATHS = TABS.map((t) => t.to);

export const OPEN_XANDE_EVENT = "anf:abrir-xande";

/** Abre a conversa com o Xande a partir de qualquer tela dentro do AppShell. */
export function openXande() {
  window.dispatchEvent(new Event(OPEN_XANDE_EVENT));
}

/* A dica do Xande nunca divide a tela com outro aviso (ex.: a comemoração
   de marco na home). Uma tela "segura" a dica com useHoldXandeTip(true). */
const tipHolds = new Set<symbol>();
const tipListeners = new Set<() => void>();
function emitTipHolds() {
  tipListeners.forEach((l) => l());
}
function subscribeTipHolds(listener: () => void) {
  tipListeners.add(listener);
  return () => tipListeners.delete(listener);
}

export function useHoldXandeTip(hold: boolean) {
  useEffect(() => {
    if (!hold) return;
    const id = Symbol("hold");
    tipHolds.add(id);
    emitTipHolds();
    return () => {
      tipHolds.delete(id);
      emitTipHolds();
    };
  }, [hold]);
}

export function AppShell({
  title,
  titleAs = "h1",
  brand,
  intro,
  children,
}: {
  title: string;
  /** O topo sempre mostra a assinatura da marca; aqui dá para trocar o produto ou a instituição. */
  brand?: { product: "People" | "Campus"; partner?: string };
  /** Use "p" quando a página já define o seu próprio <h1> no conteúdo. */
  titleAs?: "h1" | "p";
  /** Frase curta logo abaixo do título da página. */
  intro?: ReactNode;
  children: ReactNode;
}) {
  const [chatOpen, setChatOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const router = useRouter();
  const [access] = useAccess();
  const accessPartner =
    access.mode === "student" ? findPartner(access.partner)?.shortName : undefined;
  const partner = brand?.partner ?? accessPartner;
  // Com a instituição na assinatura, o topo usa os rótulos curtos e menos
  // espaço entre os grupos, para caber tudo em 1152px.
  const compact = Boolean(partner);
  const isRoot = ROOT_PATHS.includes(location.pathname);

  const [tipSeen, setTipSeen] = useLocalStorage<boolean>("anf.dicaXande", false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const tipHeld = useSyncExternalStore(
    subscribeTipHolds,
    () => tipHolds.size > 0,
    () => false,
  );
  const showTip = mounted && !tipSeen && !tipHeld && location.pathname === "/";

  // Ao trocar de tela, o foco vai para o conteúdo (leitor de tela e teclado
  // começam do título, não do topo). Na primeira carga, nada muda.
  const firstPath = useRef(true);
  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    document.getElementById("conteudo")?.focus({ preventScroll: true });
  }, [location.pathname]);

  function openChat() {
    setTipSeen(true);
    setChatOpen(true);
  }

  // Qualquer tela pode abrir o Xande com openXande().
  useEffect(() => {
    const handler = () => openChat();
    window.addEventListener(OPEN_XANDE_EVENT, handler);
    return () => window.removeEventListener(OPEN_XANDE_EVENT, handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function goBack() {
    if (window.history.length > 1) router.history.back();
    else navigate({ to: "/" });
  }

  return (
    <div className="min-h-dvh bg-background text-navy flex flex-col">
      {/* Topo azul-escuro: marca + navegação (desktop) + Xande + Ajuda */}
      {/* Fixo (não sticky): o Safari do iOS 26 só pinta a faixa do relógio
          com a cor de elementos fixos no topo; com sticky, a página aparecia
          rolando acima do header. O espaçador reserva a mesma altura. */}
      <div aria-hidden="true" className="h-[calc(4rem+env(safe-area-inset-top))] flex-none lg:h-[calc(4.5rem+env(safe-area-inset-top))]" />
      <header className="fixed inset-x-0 top-0 z-30 bg-navy text-white shadow-[0_1px_0_rgb(255_255_255/0.06),0_8px_24px_-16px_rgb(0_0_0/0.5)] pt-[env(safe-area-inset-top)]">
        <div
          className={cn(
            "relative mx-auto flex h-16 w-full max-w-md items-center justify-between gap-3 px-4 py-2 sm:max-w-2xl lg:h-[4.5rem] lg:max-w-6xl lg:px-8",
            compact ? "lg:gap-5" : "lg:gap-8",
          )}
        >
          <Link
            to="/"
            className={cn(
              "flex min-h-11 min-w-0 items-center gap-2 rounded-lg max-lg:flex-1 lg:shrink-0 lg:border-r lg:border-white/10",
              compact ? "lg:pr-5" : "lg:mr-2 lg:pr-8",
            )}
            aria-label="Aposta no Futuro, ir para o início"
          >
            <img
              src={logoMark}
              alt=""
              aria-hidden="true"
              width={30}
              height={30}
              className="h-[30px] w-[30px] shrink-0 select-none lg:h-9 lg:w-9"
              draggable={false}
            />
            <BrandLockup tone="dark" product={brand?.product ?? "People"} partner={partner} />
          </Link>

          {/* Navegação principal no desktop */}
          <nav aria-label="Navegação principal" className="hidden flex-1 lg:block">
            <ul className="flex items-center gap-1">
              {TABS.map((tab) => {
                const active = isActive(tab, location.pathname);
                const Icon = tab.icon;
                return (
                  <li key={tab.to}>
                    <Link
                      to={tab.to}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative inline-flex h-11 items-center gap-2 rounded-full px-3 text-[0.95rem] font-medium transition-colors",
                        !compact && "xl:px-4",
                        active
                          ? "bg-white/10 text-white"
                          : "text-white/70 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <Icon
                        className={cn("h-[18px] w-[18px]", compact && "lg:max-xl:hidden")}
                        strokeWidth={active ? 2.3 : 1.9}
                      />
                      {tab.label}
                      {active && (
                        <span
                          aria-hidden="true"
                          className={cn(
                            "absolute inset-x-3 -bottom-[13px] h-[3px] rounded-full bg-teal",
                            !compact && "xl:inset-x-4",
                          )}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 lg:gap-2">
            <button
              onClick={openChat}
              aria-label="Conversar com o Xande"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full transition-colors max-lg:w-11 hover:bg-white/10 lg:bg-white/10 lg:px-4 lg:hover:bg-white/15"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-teal/20 text-mint lg:h-auto lg:w-auto lg:bg-transparent">
                <Sparkles className="h-[18px] w-[18px]" strokeWidth={2.2} />
              </span>
              <span className={cn("hidden text-sm font-semibold lg:inline", !compact && "xl:hidden")}>
                Xande
              </span>
              {!compact && (
                <span className="hidden text-sm font-semibold xl:inline">Falar com o Xande</span>
              )}
            </button>
            <Link
              to="/ajuda"
              aria-label="Preciso de ajuda agora"
              className="inline-flex h-11 items-center gap-1.5 rounded-full bg-coral px-3.5 text-sm font-semibold text-navy transition-colors hover:bg-[#ff7466] lg:px-4"
            >
              <Phone className="h-4 w-4" strokeWidth={2.4} />
              <span className={cn(!compact && "xl:hidden")}>Ajuda</span>
              {!compact && <span className="hidden xl:inline">Preciso de ajuda</span>}
            </Link>
          </div>

          {showTip && (
            <div
              role="status"
              className={cn(
                "rise-in absolute right-[4.5rem] top-[calc(100%+6px)] z-40 w-64 rounded-2xl bg-card p-4 text-sm leading-snug text-navy shadow-soft ring-1 ring-border lg:right-[7.5rem]",
                !compact && "xl:right-[13.5rem]",
              )}
            >
              <span
                aria-hidden="true"
                className="absolute -top-1.5 right-3 h-3 w-3 rotate-45 bg-card ring-1 ring-border [clip-path:polygon(0_0,100%_0,0_100%)] lg:right-16"
              />
              <p>
                Este é o <strong>Xande</strong>. Quando bater vontade de apostar,
                toque aqui e a gente segura junto.
              </p>
              <button
                onClick={() => setTipSeen(true)}
                className="mt-3 inline-flex min-h-11 items-center rounded-full bg-teal-soft px-4 text-xs font-semibold text-teal-ink hover:bg-[#cfe9e1]"
              >
                Entendi
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Conteúdo */}
      <main
        key={location.pathname}
        id="conteudo"
        tabIndex={-1}
        className="mx-auto flex outline-none w-full max-w-md flex-1 flex-col px-4 pb-[calc(var(--nav-h)+env(safe-area-inset-bottom)+1.5rem)] pt-5 sm:max-w-2xl lg:max-w-6xl lg:px-8 lg:pb-12 lg:pt-10"
      >
        {!isRoot && (
          <button
            onClick={goBack}
            className="-ml-2 mb-2 inline-flex min-h-11 w-fit items-center gap-1 rounded-full px-2 text-sm font-medium text-muted-foreground transition-colors hover:text-navy"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </button>
        )}
        {titleAs === "h1" && (
          <div className="mb-6 lg:mb-10">
            <h1 className="text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.02em] text-navy sm:text-[2rem] lg:text-[2.75rem] lg:tracking-[-0.03em]">
              {title}
            </h1>
            {intro ? (
              <p className="mt-2 max-w-[60ch] text-[0.95rem] leading-relaxed text-muted-foreground lg:mt-3 lg:text-lg">
                {intro}
              </p>
            ) : null}
          </div>
        )}
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </main>

      {/* Navegação inferior (celular e tablet) */}
      <nav
        aria-label="Navegação principal"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <ul className="mx-auto grid h-[var(--nav-h)] w-full max-w-md grid-cols-5 items-stretch px-1 sm:max-w-2xl">
          {TABS.map((tab) => {
            const active = isActive(tab, location.pathname);
            const Icon = tab.icon;
            return (
              <li key={tab.to} className="flex min-w-0">
                <Link
                  to={tab.to}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex w-full min-w-0 flex-col items-center justify-center gap-1 text-xs font-medium leading-none transition-colors",
                    active ? "text-teal-deep" : "text-muted-foreground hover:text-navy",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-7 w-12 place-items-center rounded-full transition-colors",
                      active && "bg-teal-soft",
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" strokeWidth={active ? 2.3 : 1.9} />
                  </span>
                  <span className="block w-full truncate text-center">{tab.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <ChatSheet open={chatOpen} onOpenChange={setChatOpen} />
    </div>
  );
}

function isActive(tab: Tab, pathname: string) {
  if (tab.to === "/") return pathname === "/";
  return pathname.startsWith(tab.to) || (tab.match ?? []).some((m) => pathname.startsWith(m));
}

// NOTA (dev): Neste protótipo o Xande usa respostas pré-programadas.
// Numa versão futura ele poderá se conectar a uma IA real, mantendo o
// mesmo tom acolhedor e as mesmas rotas de encaminhamento (Simulador,
// Cuidar, CVV/CAPS, contador).

type QuickId = "vontade" | "recaida" | "progresso" | "ajuda";

type ChatMsg = {
  id: string;
  from: "xande" | "user";
  text?: string;
  render?: ReactNode;
};

type QuickReply = { id: QuickId; label: string };

const INITIAL_QUICK: QuickReply[] = [
  { id: "vontade", label: "Estou com vontade de apostar" },
  { id: "recaida", label: "Tive uma recaída" },
  { id: "progresso", label: "Quero ver meu progresso" },
  { id: "ajuda", label: "Preciso de ajuda" },
];

type Profile = {
  name: string;
  firstFreeDay: string;
  onboarded: boolean;
};

function ChatSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const navigate = useNavigate();
  const [profile, setProfile] = useLocalStorage<Profile>("anf.profile", {
    name: "",
    firstFreeDay: "",
    onboarded: false,
  });

  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: "hello",
      from: "xande",
      text: "Oi, eu sou o Xande. Estou aqui com você. Como você está agora?",
    },
  ]);
  const [quick, setQuick] = useState<QuickReply[]>(INITIAL_QUICK);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  function pushUser(text: string) {
    setMessages((m) => [
      ...m,
      { id: `u-${Date.now()}`, from: "user", text },
    ]);
  }

  function pushXande(msg: Omit<ChatMsg, "id" | "from">) {
    setMessages((m) => [
      ...m,
      { id: `x-${Date.now()}-${m.length}`, from: "xande", ...msg },
    ]);
  }

  function respondAfter(delay: number, cb: () => void) {
    setTyping(true);
    setQuick([]);
    window.setTimeout(() => {
      setTyping(false);
      cb();
    }, delay);
  }

  function handleQuick(id: QuickId, userText?: string) {
    const label = userText ?? INITIAL_QUICK.find((q) => q.id === id)?.label ?? "";
    pushUser(label);

    if (id === "vontade") {
      respondAfter(700, () => {
        pushXande({
          text:
            "Que bem que você veio falar comigo antes. Esse impulso passa: a gente só precisa segurar juntos por alguns minutos. 💚",
        });
        window.setTimeout(() => {
          pushXande({
            render: (
              <StrategiesCard
                onBreathe={() => {
                  pushUser("Vou respirar fundo");
                  respondAfter(500, () =>
                    pushXande({
                      text:
                        "Isso. Inspira em 4, segura em 4, solta em 6. Faz 4 rodadas comigo e me conta como ficou.",
                    }),
                  );
                }}
                onWait={() => {
                  pushUser("Vou esperar 15 minutos");
                  respondAfter(500, () =>
                    pushXande({
                      text:
                        "Perfeito. Vai fazer algo bem simples nesses 15 minutos: água, uma volta, uma música. Eu fico aqui.",
                    }),
                  );
                }}
                onSim={() => {
                  onOpenChange(false);
                  navigate({ to: "/simulador" });
                }}
              />
            ),
          });
          // No momento da vontade, poucas escolhas: as 3 estratégias + ajuda.
          setQuick(INITIAL_QUICK.filter((q) => q.id === "ajuda"));
        }, 500);
      });
      return;
    }

    if (id === "recaida") {
      respondAfter(700, () => {
        pushXande({
          text:
            "Respira. Isso não apaga o seu esforço. Recaída faz parte do processo pra muita gente, e você teve coragem de me contar. 💚",
        });
        window.setTimeout(() => {
          pushXande({
            render: (
              <RestartCard
                onRestart={() => {
                  setProfile({
                    ...profile,
                    firstFreeDay: new Date().toISOString(),
                  });
                  pushUser("Quero reiniciar meu contador");
                  respondAfter(500, () =>
                    pushXande({
                      text:
                        "Pronto. Seu contador começa agora, do zero, sem julgamento. Cada recomeço conta. 🌱",
                    }),
                  );
                }}
                onLater={() => {
                  pushUser("Agora não");
                  respondAfter(400, () =>
                    pushXande({
                      text:
                        "Tá bom. Quando quiser reiniciar, é só me chamar ou tocar em ‘Recomecei hoje’ na tela inicial.",
                    }),
                  );
                }}
              />
            ),
          });
          setQuick(INITIAL_QUICK);
        }, 500);
      });
      return;
    }

    if (id === "progresso") {
      respondAfter(500, () => {
        pushXande({
          text:
            "Bora ver o quanto você já caminhou. Vou te levar para o seu Perfil.",
        });
        window.setTimeout(() => {
          onOpenChange(false);
          navigate({ to: "/perfil" });
        }, 600);
      });
      return;
    }

    if (id === "ajuda") {
      respondAfter(500, () => {
        pushXande({
          text:
            "Você não está sozinho(a). Essas duas opções são gratuitas e sigilosas:",
        });
        window.setTimeout(() => {
          pushXande({ render: <HelpCard /> });
          setQuick(INITIAL_QUICK);
        }, 400);
      });
      return;
    }
  }

  function normalize(text: string) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  const RISK_RE =
    /(suicid|me matar|me mata|tirar a minha vida|tirar minha vida|acabar com tudo|acabar com a minha vida|nao quero mais viver|nao aguento mais viver|queria morrer|quero morrer|vou morrer|me machucar|autolesao|me cortar|me cortando|sumir do mundo|desapareer|nao vejo saida|sem saida|desesperad)/;

  function matchIntent(text: string): QuickId | null {
    const t = normalize(text);
    if (/(vontade|apostar|jogar|impulso|fissura|tentac)/.test(t)) return "vontade";
    if (/(recai|apostei|joguei|recaida|escorreg|voltei a apostar)/.test(t))
      return "recaida";
    if (/(progresso|contador|quantos dias|conquista|evolu)/.test(t)) return "progresso";
    if (/(ajuda|socorro|cvv|caps|sozinh)/.test(t)) return "ajuda";
    return null;
  }

  function pushCrisis(intro: string) {
    respondAfter(500, () => {
      pushXande({ text: intro });
      window.setTimeout(() => {
        pushXande({ render: <HelpCard /> });
        setQuick(INITIAL_QUICK);
      }, 300);
    });
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");

    // Risco imediato: resposta única, sem simular conversa terapêutica.
    if (RISK_RE.test(normalize(text))) {
      pushUser(text);
      pushCrisis(
        "Sinto muito que você esteja passando por isso. Você merece apoio de gente preparada agora. Ligue para o CVV 188 (24h, gratuito e sigiloso) ou procure um CAPS.",
      );
      return;
    }

    const intent = matchIntent(text);
    if (intent) {
      handleQuick(intent, text);
      return;
    }

    // Sem correspondência: acolher com honestidade e oferecer os caminhos.
    // A resposta de crise fica só para o padrão de risco acima.
    pushUser(text);
    respondAfter(500, () => {
      pushXande({
        text:
          "Obrigado por escrever. Eu sou um guia automático e ainda não entendo tudo o que as pessoas digitam. Escolhe uma dessas opções que eu te acompanho:",
      });
      setQuick(INITIAL_QUICK);
    });
  }




  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="fixed inset-0 z-[100] h-[100dvh] w-full max-w-none overflow-hidden border-0 bg-background p-0 sm:left-auto sm:w-[420px] sm:max-w-md [&>button]:hidden"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Xande: guia automático</SheetTitle>
          <SheetDescription>
            Converse com o Xande, o guia acolhedor do Aposta no Futuro.
          </SheetDescription>
        </SheetHeader>
        <div className="flex h-[100dvh] flex-col overflow-hidden">
          {/* Topo */}
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border bg-background px-3 py-2 pt-[calc(env(safe-area-inset-top)+0.5rem)]">
            <div className="flex min-w-0 items-center gap-1">
              <button
                onClick={() => onOpenChange(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-navy transition-colors hover:bg-muted"
                aria-label="Fechar conversa"
              >
                <ChevronRight className="h-6 w-6" strokeWidth={2.2} />
              </button>
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-teal-soft text-teal-deep">
                <Sparkles className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <div className="ml-1.5 min-w-0">
                <div className="truncate text-[0.95rem] font-semibold text-navy">Xande</div>
                <div className="text-xs text-muted-foreground">
                  Guia automático, sem julgamento
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                onOpenChange(false);
                navigate({ to: "/ajuda" });
              }}
              className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-coral-soft px-3.5 text-sm font-semibold text-coral-deep transition-colors hover:bg-coral-soft-hover"
              aria-label="Preciso de ajuda agora"
            >
              <Phone className="h-4 w-4" strokeWidth={2.4} />
              Ajuda
            </button>
          </div>

          {/* Mensagens */}
          <div
            ref={scrollRef}
            className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-muted/60 p-4 pb-6"
          >
            {/* Aviso sobre a natureza do guia, no começo da conversa */}
            <p className="mx-auto max-w-[34ch] text-center text-xs leading-relaxed text-muted-foreground">
              Respostas prontas, ninguém está lendo esta conversa. O Xande não
              substitui atendimento profissional.
            </p>

            {messages.map((m) => (
              <MessageBubble key={m.id} from={m.from}>
                {m.render ?? m.text}
              </MessageBubble>
            ))}

            {typing && (
              <div
                className="flex w-fit max-w-[80%] items-center gap-1.5 rounded-2xl rounded-tl-sm bg-card p-3 shadow-card"
                aria-label="Xande está escrevendo"
              >
                <Dot />
                <Dot delay={0.15} />
                <Dot delay={0.3} />
              </div>
            )}

            {/* Respostas rápidas, logo abaixo da mensagem do Xande */}
            {quick.length > 0 && !typing && (
              <div className="flex flex-col items-start gap-2 pl-1">
                {quick.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => handleQuick(q.id)}
                    className={cn(
                      "min-h-11 max-w-[90%] rounded-full px-4 py-2.5 text-left text-sm font-medium transition-colors",
                      q.id === "ajuda"
                        ? "bg-coral-soft text-coral-deep hover:bg-coral-soft-hover"
                        : "border border-teal-deep/25 bg-card text-teal-ink hover:bg-teal-soft",
                    )}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            )}
            <div className="h-1" />
          </div>

          {/* Campo de digitação */}
          <form
            onSubmit={handleSend}
            className="flex shrink-0 items-center gap-2 border-t border-border bg-card px-4 py-2.5 pb-[calc(env(safe-area-inset-bottom)+0.625rem)]"
          >
            <AutoGrowTextarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e as unknown as React.FormEvent);
                }
              }}
              placeholder="Como você está?"
              aria-label="Escreva sua mensagem para o Xande"
              className="min-w-0 flex-1 rounded-3xl border border-input bg-background px-4 py-3 outline-none placeholder:text-muted-foreground focus:border-teal-deep focus:ring-2 focus:ring-teal-deep/20"
            />
            <button
              type="submit"
              aria-label="Enviar mensagem"
              disabled={!draft.trim()}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-deep text-white transition-colors hover:bg-teal-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="h-5 w-5" strokeWidth={2.2} />
            </button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MessageBubble({
  from,
  children,
}: {
  from: "xande" | "user";
  children: ReactNode;
}) {
  const isUser = from === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[92%] rounded-2xl p-3.5 text-[0.95rem] leading-relaxed break-words whitespace-pre-wrap sm:max-w-[85%]",
          isUser
            ? "rounded-tr-sm bg-teal-deep text-white"
            : "rounded-tl-sm bg-card text-navy shadow-card",
        )}
      >
        {children}
      </div>
    </div>
  );
}

function Dot({ delay = 0 }: { delay?: number }) {
  return (
    <span
      className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground/60"
      style={{ animationDelay: `${delay}s` }}
    />
  );
}

function StrategiesCard({
  onBreathe,
  onWait,
  onSim,
}: {
  onBreathe: () => void;
  onWait: () => void;
  onSim: () => void;
}) {
  return (
    <div className="space-y-2.5">
      <div className="font-semibold text-navy">Quer tentar uma dessas comigo?</div>
      <div className="grid gap-2">
        <StrategyBtn
          onClick={onBreathe}
          icon={<Wind className="h-4 w-4" />}
          title="Respirar fundo"
          desc="4 rodadas de respiração guiada."
        />
        <StrategyBtn
          onClick={onWait}
          icon={<Timer className="h-4 w-4" />}
          title="Esperar 15 minutos"
          desc="Antes de qualquer decisão."
        />
        <StrategyBtn
          onClick={onSim}
          icon={<Calculator className="h-4 w-4" />}
          title="Abrir o Simulador"
          desc="Lembrar o que está em jogo."
        />
      </div>
    </div>
  );
}

function StrategyBtn({
  onClick,
  icon,
  title,
  desc,
}: {
  onClick: () => void;
  icon: ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3 text-left transition-colors hover:border-teal-deep/30 hover:bg-teal-soft"
    >
      <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-teal-soft text-teal-deep">
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold text-navy">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </button>
  );
}

function RestartCard({
  onRestart,
  onLater,
}: {
  onRestart: () => void;
  onLater: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 font-semibold text-navy">
        <Heart className="h-4 w-4 text-teal-deep" />
        Todo recomeço conta
      </div>
      <div className="text-sm text-muted-foreground">
        Se quiser, eu reinicio seu contador de dias livres agora, do jeito
        certo, sem culpa.
      </div>
      <div className="flex flex-col gap-2">
        <Button
          onClick={onRestart}
          className="min-h-11 w-full rounded-full bg-teal-deep text-white hover:bg-teal-ink"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reiniciar meu contador
        </Button>
        <Button
          onClick={onLater}
          variant="ghost"
          className="min-h-11 w-full rounded-full text-muted-foreground"
        >
          Agora não
        </Button>
      </div>
    </div>
  );
}

function HelpCard() {
  return (
    <div className="space-y-2">
      <a
        href="tel:188"
        className="flex items-center gap-3 rounded-2xl bg-teal-ink p-3 text-white transition-colors hover:bg-navy"
      >
        <div className="grid h-10 w-10 place-items-center rounded-full bg-white/15">
          <Phone className="h-4 w-4" />
        </div>
        <div>
          <div className="text-sm font-semibold">CVV: ligar 188</div>
          <div className="text-xs text-white/85">24h · gratuito · sigiloso</div>
        </div>
      </a>
      <a
        href="https://www.google.com/search?q=CAPS+mais+pr%C3%B3ximo+de+mim"
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-2xl border border-border bg-background p-3"
      >
        <div className="text-sm font-semibold text-navy">
          CAPS: encontrar a unidade mais próxima
        </div>
        <div className="mt-0.5 text-xs text-muted-foreground">
          Atendimento gratuito do SUS, incluindo dependências. Procure a
          unidade do seu município.
        </div>
      </a>
      <p className="px-1 text-xs leading-snug text-muted-foreground">
        Se for uma emergência, ligue 192 ou vá ao pronto-socorro mais próximo.
      </p>
    </div>
  );
}
