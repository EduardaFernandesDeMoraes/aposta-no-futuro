import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Home,
  Calculator,
  Users,
  Trophy,
  User,
  LifeBuoy,
  MessageCircle,
  Phone,
  X,
  RotateCcw,
  Wind,
  Timer,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
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
};

const TABS: Tab[] = [
  { to: "/", label: "Início", icon: Home },
  { to: "/simulador", label: "Simulador", icon: Calculator },
  { to: "/comunidade", label: "Comunidade", icon: Users },
  { to: "/desafios", label: "Desafios", icon: Trophy },
  { to: "/perfil", label: "Perfil", icon: User },
];

export function AppShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [chatOpen, setChatOpen] = useState(false);
  const [fabVisible, setFabVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollTimeoutRef = useRef<number | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastScrollY.current && y > 20) {
        setFabVisible(false);
      } else {
        setFabVisible(true);
      }
      lastScrollY.current = y;
      if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = window.setTimeout(() => setFabVisible(true), 300);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    setFabVisible(true);
  }, [location.pathname]);





  return (
    <div className="min-h-dvh bg-background text-navy flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-navy text-navy-foreground shadow-soft">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3 px-4 py-3">
          <h1 className="truncate text-lg font-semibold tracking-tight">
            {title}
          </h1>
          <button
            onClick={() => navigate({ to: "/ajuda" })}
            className="inline-flex items-center gap-1.5 rounded-full bg-coral px-3 py-1.5 text-xs font-semibold text-coral-foreground shadow-soft transition-transform active:scale-95"
          >
            <LifeBuoy className="h-3.5 w-3.5" />
            Preciso de ajuda
          </button>
        </div>
      </header>

      {/* Content */}
      <main
        key={location.pathname}
        className="mx-auto w-full max-w-md flex-1 px-4 pb-[calc(10rem+env(safe-area-inset-bottom))] pt-4 animate-fade-in"
      >

        {children}
      </main>


      {/* Floating chat button */}
      <button
        onClick={() => setChatOpen(true)}
        aria-label="Abrir assistente virtual"
        aria-hidden={!fabVisible}
        className="fixed bottom-24 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-teal text-teal-foreground shadow-[0_8px_24px_-6px_rgba(22,191,172,0.6)] transition-all duration-300 ease-out active:scale-95"
        style={fabVisible ? {} : { transform: "translateY(2rem)", opacity: 0, pointerEvents: "none" }}
      >
        <MessageCircle className="h-6 w-6" />
      </button>



      {/* Bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-navy text-navy-foreground pb-[env(safe-area-inset-bottom)]">
        <ul className="mx-auto grid max-w-md grid-cols-5">
          {TABS.map((tab) => {
            const active =
              tab.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(tab.to);
            const Icon = tab.icon;
            return (
              <li key={tab.to}>
                <Link
                  to={tab.to}
                  className={cn(
                    "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                    active ? "text-teal" : "text-white/70",
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
                  {tab.label}
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

// NOTA (dev): Neste protótipo o Xande usa respostas pré-programadas.
// Na versão completa, este assistente se conectará a uma IA real
// (Lovable AI Gateway) mantendo o mesmo tom acolhedor e as mesmas
// rotas de encaminhamento (Simulador, Comunidade, CVV/CAPS, contador).

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

  function handleQuick(id: QuickId) {
    const label = INITIAL_QUICK.find((q) => q.id === id)?.label ?? "";
    pushUser(label);

    if (id === "vontade") {
      respondAfter(700, () => {
        pushXande({
          text:
            "Que bem que você veio falar comigo antes. Esse impulso passa — a gente só precisa segurar juntos por alguns minutos. 💚",
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
                onCom={() => {
                  onOpenChange(false);
                  navigate({ to: "/comunidade" });
                }}
              />
            ),
          });
          setQuick(INITIAL_QUICK);
        }, 500);
      });
      return;
    }

    if (id === "recaida") {
      respondAfter(700, () => {
        pushXande({
          text:
            "Respira. Isso não apaga o seu esforço. Recaída faz parte do processo pra muita gente — e você teve coragem de me contar. 💚",
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[80dvh] rounded-t-3xl border-0 p-0 sm:h-[85dvh]"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Xande — assistente virtual</SheetTitle>
          <SheetDescription>
            Converse com o Xande, o assistente acolhedor do Aposta no Futuro.
          </SheetDescription>
        </SheetHeader>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-3xl border-b border-border bg-navy px-4 py-3 text-navy-foreground">
            <div className="flex items-center gap-2.5">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-teal text-lg font-bold text-teal-foreground">
                X
              </div>
              <div>
                <div className="text-sm font-semibold">Xande</div>
                <div className="flex items-center gap-1.5 text-[11px] text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal" />
                  Aqui com você, sem julgamento.
                </div>
              </div>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="inline-flex h-11 w-11 items-center justify-center text-white transition-colors hover:text-white/80"
              aria-label="Fechar"
            >
              <X className="h-6 w-6" strokeWidth={2.5} />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-4 overflow-y-auto bg-background p-4 pb-8"
          >
            {messages.map((m) => (
              <MessageBubble key={m.id} from={m.from}>
                {m.render ?? m.text}
              </MessageBubble>
            ))}

            {typing && (
              <div className="flex w-fit max-w-[80%] items-center gap-1.5 rounded-2xl rounded-tl-sm bg-card p-3 shadow-card">
                <Dot />
                <Dot delay={0.15} />
                <Dot delay={0.3} />
              </div>
            )}
            <div className="h-1" />
          </div>

          {/* Quick replies */}
          {quick.length > 0 && !typing && (
            <div className="border-t border-border bg-card px-3 py-3">
              <div className="mb-2 text-[11px] font-medium text-muted-foreground">
                Toque numa resposta rápida:
              </div>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                {quick.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => handleQuick(q.id)}
                    className="rounded-full border border-teal/40 bg-teal/10 px-3 py-2 text-xs font-semibold text-teal transition-colors active:scale-95 sm:w-auto"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="border-t border-border bg-background px-4 py-2 text-center text-[10px] text-muted-foreground">
            Sou um apoio, não substituo um profissional de saúde.
          </div>
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
          "max-w-[92%] rounded-2xl p-3.5 text-sm leading-relaxed shadow-card break-words whitespace-pre-wrap sm:max-w-[85%]",
          isUser
            ? "rounded-tr-sm bg-[#0d6b60] text-white"
            : "rounded-tl-sm bg-card text-navy",
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
      className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60"
      style={{ animationDelay: `${delay}s` }}
    />
  );
}

function StrategiesCard({
  onBreathe,
  onWait,
  onSim,
  onCom,
}: {
  onBreathe: () => void;
  onWait: () => void;
  onSim: () => void;
  onCom: () => void;
}) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold text-navy">
        Quer tentar uma dessas comigo?
      </div>
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
        <StrategyBtn
          onClick={onCom}
          icon={<Users className="h-4 w-4" />}
          title="Desabafar na Comunidade"
          desc="Você não está sozinho(a)."
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
      className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3 text-left transition-transform active:scale-[0.98]"
    >
      <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl bg-teal/10 text-teal">
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold text-navy">{title}</div>
        <div className="text-[11px] text-muted-foreground">{desc}</div>
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
      <div className="flex items-center gap-2 text-sm font-semibold text-navy">
        <Heart className="h-4 w-4 text-coral" />
        Todo recomeço conta
      </div>
      <div className="text-xs text-muted-foreground">
        Se quiser, eu reinicio seu contador de dias livres agora — do jeito
        certo, sem culpa.
      </div>
      <div className="flex flex-col gap-2">
        <Button
          onClick={onRestart}
          className="w-full rounded-full bg-coral text-coral-foreground hover:bg-coral/90"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reiniciar meu contador
        </Button>
        <Button
          onClick={onLater}
          variant="ghost"
          className="w-full rounded-full text-muted-foreground"
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
        className="flex items-center gap-3 rounded-2xl bg-coral p-3 text-coral-foreground shadow-soft"
      >
        <div className="grid h-10 w-10 place-items-center rounded-full bg-white/20">
          <Phone className="h-4 w-4" />
        </div>
        <div>
          <div className="text-sm font-semibold">CVV — Ligar 188</div>
          <div className="text-[11px] opacity-90">
            24h · gratuito · sigiloso
          </div>
        </div>
      </a>
      <div className="rounded-2xl border border-border bg-background p-3">
        <div className="text-sm font-semibold text-navy">
          CAPS — Centro de Atenção Psicossocial
        </div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">
          Atendimento gratuito do SUS, incluindo dependências. Procure a
          unidade do seu município.
        </div>
      </div>
    </div>
  );
}
