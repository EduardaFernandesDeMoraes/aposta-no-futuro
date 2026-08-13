import { SiteFooter } from "@/components/site-footer";
import { track, EVENTS } from "@/lib/analytics";
import { AutoGrowTextarea } from "@/components/auto-grow-textarea";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Home,
  Calculator,
  Users,
  Trophy,
  User,
  
  Sparkles,
  ChevronRight,
  Phone,
  Send,

  RotateCcw,
  Wind,
  Timer,
  Heart,
} from "lucide-react";
import logoMark from "@/assets/logo-maos-coracao.svg.asset.json";
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
  titleAs = "h1",
  children,
}: {
  title: string;
  /** Use "p" quando a página já define o seu próprio <h1> no conteúdo. */
  titleAs?: "h1" | "p";
  children: ReactNode;
}) {
  const TitleTag = titleAs;
  const [chatOpen, setChatOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-background text-navy flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-navy text-navy-foreground shadow-soft pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex min-h-14 w-full max-w-md items-center justify-between gap-3 px-4 py-2 sm:max-w-[1100px]">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <img
              src={logoMark.url}
              alt=""
              aria-hidden="true"
              width={28}
              height={28}
              className="h-7 w-7 shrink-0 select-none"
              draggable={false}
            />
            <TitleTag className="min-w-0 truncate text-base font-semibold tracking-tight sm:text-lg">
              {title}
            </TitleTag>
          </div>

          <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => setChatOpen(true)}
              aria-label="Falar com a Xande"
              className="relative inline-flex h-11 w-11 items-center justify-center transition-all duration-200 ease-out hover:opacity-90 active:scale-95"
            >
              <span className="grid h-[34px] w-[34px] place-items-center rounded-full bg-teal">
                <Sparkles className="h-4 w-4 text-[#E1F5EE]" strokeWidth={2.2} />
              </span>
            </button>
            <button
              onClick={() => {
                track(EVENTS.helpClick);
                navigate({ to: "/ajuda" });
              }}
              aria-label="Preciso de ajuda agora"
              className="relative inline-flex h-11 w-11 items-center justify-center transition-transform active:scale-95 sm:h-auto sm:w-auto sm:gap-1.5 sm:rounded-full sm:bg-coral sm:px-4 sm:py-2 sm:text-sm sm:font-semibold sm:text-coral-foreground sm:shadow-soft sm:hover:bg-[#eb4436]"
            >
              <span className="grid h-[38px] w-[38px] place-items-center rounded-full bg-coral animate-[pulse-scale_3.5s_ease-in-out_infinite] sm:animate-none sm:contents">
                <Phone className="h-[18px] w-[18px] text-white sm:h-4 sm:w-4" strokeWidth={2.5} />
              </span>
              <span className="hidden whitespace-nowrap sm:inline">Preciso de ajuda</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main
        key={location.pathname}
        className="mx-auto w-full max-w-md flex-1 px-4 pb-[calc(var(--nav-h)+env(safe-area-inset-bottom)+1rem)] pt-4 animate-fade-in"
      >
        {children}
        <SiteFooter />
      </main>






      {/* Bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-navy text-navy-foreground pb-[env(safe-area-inset-bottom)]">
        <ul className="grid w-full grid-cols-5 items-center gap-0 px-2">
          {TABS.map((tab) => {
            const active =
              tab.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(tab.to);
            const Icon = tab.icon;
            return (
              <li
                key={tab.to}
                className="flex min-w-0 w-full flex-col items-center justify-center"
              >
                <Link
                  to={tab.to}
                  className={cn(
                    "flex h-full w-full min-w-0 flex-col items-center justify-center gap-1 px-0 py-2 text-[10px] font-medium leading-none transition-all duration-200 ease-out hover:text-teal active:scale-95 sm:text-xs",
                    active ? "text-teal" : "text-white/70 hover:text-white",
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" strokeWidth={active ? 2.4 : 2} />
                  <span className="block w-full whitespace-nowrap text-center">
                    {tab.label}
                  </span>
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
    if (/(progresso|contador|dias|conquista|evolu)/.test(t)) return "progresso";
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
        "Sinto muito que você esteja passando por isso — você merece apoio de gente preparada agora. Ligue para o CVV 188 (24h, gratuito e sigiloso) ou procure um CAPS.",
      );
      return;
    }

    const intent = matchIntent(text);
    if (intent) {
      handleQuick(intent, text);
      return;
    }

    // Sem correspondência: acolher e direcionar para CVV/CAPS.
    pushUser(text);
    pushCrisis(
      "Obrigado por escrever. Eu sou automático e não consigo entender tudo, então não quero te dar uma resposta pronta que não ajude. Quem pode te escutar de verdade agora:",
    );
  }




  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="fixed inset-0 z-[100] h-[100dvh] w-full max-w-none overflow-hidden border-0 bg-background p-0 sm:left-auto sm:w-[420px] sm:max-w-md [&>button]:hidden"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Xande IA — assistente virtual</SheetTitle>
          <SheetDescription>
            Converse com o Xande, o assistente acolhedor do Aposta no Futuro.
          </SheetDescription>
        </SheetHeader>
        <div className="flex h-[100dvh] flex-col overflow-hidden">
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border bg-navy px-4 py-3 pt-[calc(env(safe-area-inset-top)+0.75rem)] text-navy-foreground">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-teal">
                <Sparkles className="h-5 w-5" color="#E1F5EE" strokeWidth={2.2} />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">Xande</div>
                <div className="flex items-center gap-1.5 text-[11px] text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal" />
                  Aqui com você, sem julgamento.
                </div>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                onClick={() => {
                  track(EVENTS.helpClick);
                  onOpenChange(false);
                  navigate({ to: "/ajuda" });
                }}
                className="inline-flex items-center gap-1.5 rounded-full bg-coral px-3 py-2 text-xs font-semibold text-coral-foreground transition-all active:scale-95"
                aria-label="Preciso de ajuda agora"
              >
                <Phone className="h-4 w-4" strokeWidth={2.5} />
                <span className="hidden sm:inline">Preciso de ajuda</span>
              </button>
              <button
                onClick={() => onOpenChange(false)}
                className="inline-flex h-11 w-11 items-center justify-center text-white transition-colors hover:text-white/80"
                aria-label="Fechar"
              >
                <ChevronRight className="h-6 w-6" strokeWidth={2.5} />
              </button>
            </div>
          </div>


          {/* Aviso permanente sobre a natureza do guia */}
          <div className="shrink-0 border-b border-border bg-[#F5A623]/15 px-4 py-2 text-[11px] leading-snug text-[#5c3a00]">
            Sou um guia automático com respostas prontas. Não sou uma pessoa e
            ninguém está lendo esta conversa.
          </div>




          {/* Messages */}
          <div
            ref={scrollRef}
            className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-[#F0FAF7] p-4 pb-6"
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

            {/* Quick replies — inline, logo abaixo da mensagem do Xande */}
            {quick.length > 0 && !typing && (
              <div className="flex flex-col items-start gap-2 pl-1">
                {quick.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => handleQuick(q.id)}
                    className={cn(
                      "max-w-[90%] rounded-full px-4 py-2 text-left text-xs font-semibold transition-all duration-200 ease-out active:scale-95",
                      q.id === "ajuda"
                        ? "bg-coral text-white shadow-card hover:bg-[#eb4436]"
                        : "border border-teal/40 bg-white text-teal hover:bg-[#E1F5EE]",
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
            className="flex shrink-0 items-center gap-2 border-t border-border bg-card px-4 py-2.5"
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
              className="min-w-0 flex-1 rounded-3xl border border-border bg-background px-4 py-3 outline-none placeholder:text-muted-foreground focus:border-teal"
            />
            <button
              type="submit"
              aria-label="Enviar mensagem"
              disabled={!draft.trim()}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal text-white transition-all duration-150 ease-out hover:bg-[#12A896] hover:shadow-lg active:scale-[0.92] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="h-5 w-5" strokeWidth={2.2} />
            </button>
          </form>


          {/* Disclaimer */}
          <div className="shrink-0 border-t border-border bg-background px-4 py-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] text-center text-[10px] leading-snug text-muted-foreground">
            O Aposta no Futuro não substitui atendimento profissional e não
            oferece apoio em tempo real.
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
      className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3 text-left transition-all duration-200 ease-out hover:bg-[#E1F5EE] hover:border-teal/40 active:scale-[0.98]"
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
          className="w-full rounded-full bg-coral text-coral-foreground transition-all duration-200 hover:bg-[#eb4436]"
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
        className="flex items-center gap-3 rounded-2xl bg-coral p-3 text-coral-foreground shadow-soft transition-all duration-200 hover:bg-[#eb4436]"
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
      <a
        href="https://www.google.com/search?q=CAPS+mais+pr%C3%B3ximo+de+mim"
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-2xl border border-border bg-background p-3"
      >
        <div className="text-sm font-semibold text-navy">
          CAPS — encontrar a unidade mais próxima
        </div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">
          Atendimento gratuito do SUS, incluindo dependências. Procure a
          unidade do seu município.
        </div>
      </a>
      <p className="px-1 text-[11px] leading-snug text-muted-foreground">
        Se for uma emergência, ligue 192 ou vá ao pronto-socorro mais próximo.
      </p>

    </div>
  );
}
