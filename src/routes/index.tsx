import { track, trackOnce, EVENTS } from "@/lib/analytics";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import {
  ClipboardCheck,
  Calculator,
  BookOpen,
  RefreshCw,
  Sparkles,
  ChevronRight,
  PiggyBank,
  ArrowLeftRight,
  Heart,
  Sprout,
  Leaf,
  Star,
  Mountain,
  Gem,
  Award,
  type LucideIcon,
} from "lucide-react";
import { AppShell, openXande } from "@/components/app-shell";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { OnboardingGate } from "@/components/onboarding-gate";
import { CampusSupportCard } from "@/components/campus-support-card";
import { useAccess } from "@/lib/access";
import { findPartner } from "@/lib/partners";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "Aposta no Futuro | Apoio anônimo e gratuito contra o vício em apostas",
      },
      {
        name: "description",
        content:
          "Aplicativo gratuito e anônimo que ajuda jovens a prevenir e enfrentar o vício em apostas online. Contador de dias livres, simulador financeiro, autoavaliação e comunidade de apoio.",
      },
      {
        property: "og:title",
        content:
          "Aposta no Futuro | Apoio anônimo e gratuito contra o vício em apostas",
      },
      {
        property: "og:description",
        content:
          "Aplicativo gratuito e anônimo que ajuda jovens a prevenir e enfrentar o vício em apostas online. Contador de dias livres, simulador financeiro, autoavaliação e comunidade de apoio.",
      },
      { property: "og:url", content: "https://apostanofuturo.online/" },
      {
        property: "og:image",
        content: "https://apostanofuturo.online/og-image.jpg",
      },
      {
        property: "og:image:secure_url",
        content: "https://apostanofuturo.online/og-image.jpg",
      },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "640" },
      {
        property: "og:image:alt",
        content: "Aposta no Futuro: apoio anônimo e gratuito contra o vício em apostas",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },

      {
        name: "twitter:title",
        content:
          "Aposta no Futuro | Apoio anônimo e gratuito contra o vício em apostas",
      },
      {
        name: "twitter:description",
        content:
          "Aplicativo gratuito e anônimo que ajuda jovens a prevenir e enfrentar o vício em apostas online. Contador de dias livres, simulador financeiro, autoavaliação e comunidade de apoio.",
      },
      {
        name: "twitter:image",
        content: "https://apostanofuturo.online/og-image.jpg",
      },
    ],
    links: [{ rel: "canonical", href: "https://apostanofuturo.online/" }],
  }),
  component: HomeRoute,
});

function HomeRoute() {
  return (
    <OnboardingGate expect="onboarded">
      <Home />
    </OnboardingGate>
  );
}

type Profile = {
  name: string;
  firstFreeDay: string;
  onboarded: boolean;
};

type Milestone = { days: number; label: string; short: string; icon: LucideIcon };

const MILESTONES: Milestone[] = [
  { days: 1, label: "1 dia", short: "1 dia", icon: Sprout },
  { days: 7, label: "1 semana", short: "1 sem.", icon: Leaf },
  { days: 30, label: "1 mês", short: "1 mês", icon: Star },
  { days: 90, label: "3 meses", short: "3 meses", icon: Mountain },
  { days: 180, label: "6 meses", short: "6 meses", icon: Gem },
  { days: 365, label: "1 ano", short: "1 ano", icon: Award },
];

function encourage(totalMinutes: number) {
  if (totalMinutes < 60) return "Cada minuto conta. Respira, você está fazendo isso.";
  if (totalMinutes < 60 * 24) return "Você está mais forte a cada hora que passa.";
  if (totalMinutes < 60 * 24 * 7) return "Siga com calma. Um dia de cada vez.";
  if (totalMinutes < 60 * 24 * 30) return "Uma semana muda muita coisa. Continua assim.";
  if (totalMinutes < 60 * 24 * 90) return "Você está reescrevendo a sua história.";
  return "Você é inspiração pra muita gente. Continue.";
}

function celebrate() {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  confetti({
    particleCount: 60,
    spread: 70,
    startVelocity: 28,
    gravity: 0.8,
    origin: { y: 0.45 },
    colors: ["#16BFAC", "#F5A623", "#0D6B60"],
    disableForReducedMotion: true,
  });
}

function Home() {
  const [profile, setProfile] = useLocalStorage<Profile>("anf.profile", {
    name: "",
    firstFreeDay: "",
    onboarded: false,
  });
  const [lastMilestone, setLastMilestone] = useLocalStorage<number>(
    "anf.lastMilestone",
    0,
  );
  const [access] = useAccess();
  const partner = access.mode === "student" ? findPartner(access.partner) : undefined;
  // `now` só existe no aparelho: evita HTML diferente entre servidor e navegador.
  const [now, setNow] = useState<number | null>(null);
  const [restartOpen, setRestartOpen] = useState(false);
  const [celebration, setCelebration] = useState<Milestone | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000 * 30);
    return () => window.clearInterval(id);
  }, []);

  const started = Boolean(profile.firstFreeDay);
  const startMs = started ? new Date(profile.firstFreeDay).getTime() : (now ?? 0);
  const elapsed = now === null ? 0 : Math.max(0, now - startMs);
  const totalMinutes = Math.floor(elapsed / 60000);
  const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
  const hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((elapsed / (1000 * 60)) % 60);

  const reachedCount = started ? MILESTONES.filter((m) => days >= m.days).length : 0;
  const next = MILESTONES.find((m) => !started || days < m.days);

  // Comemora um marco recém-alcançado
  useEffect(() => {
    if (!started || now === null) return;
    const reached = [...MILESTONES].reverse().find((m) => days >= m.days);
    if (reached && reached.days > lastMilestone) {
      setLastMilestone(reached.days);
      setCelebration(reached);
      celebrate();
    }
  }, [days, lastMilestone, setLastMilestone, started, now]);

  const phrase = useMemo(() => encourage(totalMinutes), [totalMinutes]);

  useEffect(() => {
    trackOnce(EVENTS.homeView);
  }, []);

  function startCounter() {
    const iso = new Date().toISOString();
    setProfile({ ...profile, firstFreeDay: iso });
    track(EVENTS.counterStarted);
    setLastMilestone(0);
    setNow(Date.now());
    setRestartOpen(false);
  }

  const firstName = profile.name.trim().split(/\s+/)[0];
  const [sim] = useLocalStorage<{ weekly: number } | null>("anf.simulador", null);
  const [assessment] = useLocalStorage<{ score: number } | null>("anf.autoavaliacao", null);

  return (
    <AppShell title="Aposta no Futuro" titleAs="p">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
      <div className="lg:col-span-7">
      {/* Saudação + título da página */}
      <div className="pb-6 lg:pb-8">
        <p className="text-lg leading-snug text-muted-foreground lg:text-xl">
          {firstName ? (
            <>
              Oi, <span className="font-semibold text-teal-deep">{firstName}</span>. Que bom
              te ver.
            </>
          ) : (
            "Que bom te ver por aqui."
          )}
        </p>
        <h1 className="mt-2 text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.02em] text-navy lg:text-[3.25rem] lg:leading-[1.05] lg:tracking-[-0.035em]">
          Menos apostas. Mais futuro.
        </h1>
      </div>

      {/* Contador: a peça central */}
      <section
        aria-label="Seu contador de dias sem apostar"
        className="relative overflow-hidden rounded-[1.75rem] bg-teal-ink p-6 text-white shadow-soft lg:rounded-[2.25rem] lg:p-10"
      >
        <HandsWatermark />
        {started ? (
          <>
            <p className="relative text-[0.95rem] text-white/85 lg:text-lg">Você está sem apostar há</p>
            <div className="relative mt-3 flex items-end gap-5 lg:mt-4 lg:gap-10">
              <div>
                <span className="tabular block text-[4.5rem] font-semibold leading-[0.9] tracking-[-0.03em] lg:text-[8.5rem] lg:tracking-[-0.045em]">
                  {now === null ? "–" : days}
                </span>
                <span className="mt-2 block text-sm text-white/85 lg:mt-3 lg:text-base">
                  {days === 1 ? "dia" : "dias"}
                </span>
              </div>
              <div className="flex gap-4 text-white/85 lg:gap-8">
                <div>
                  <span className="tabular block text-2xl font-semibold leading-none text-white lg:text-[2.75rem]">
                    {now === null ? "–" : String(hours).padStart(2, "0")}
                  </span>
                  <span className="mt-2 block text-sm lg:mt-3 lg:text-base">horas</span>
                </div>
                <div>
                  <span className="tabular block text-2xl font-semibold leading-none text-white lg:text-[2.75rem]">
                    {now === null ? "–" : String(minutes).padStart(2, "0")}
                  </span>
                  <span className="mt-2 block text-sm lg:mt-3 lg:text-base">min</span>
                </div>
              </div>
            </div>
            <p className="relative mt-5 max-w-[30ch] text-[0.95rem] leading-snug text-white lg:mt-8 lg:text-xl">
              {phrase}
            </p>
            <button
              onClick={() => setRestartOpen(true)}
              className="relative -ml-1 mt-4 inline-flex min-h-11 items-center gap-2 rounded-full px-1 text-sm font-medium text-white/85 underline decoration-white/40 underline-offset-4 transition-colors hover:text-white"
            >
              <RefreshCw className="h-4 w-4" />
              Precisei recomeçar
            </button>
          </>
        ) : (
          <>
            <p className="relative text-xl font-semibold leading-snug lg:text-[2rem] lg:leading-tight">
              Seu contador começa quando você quiser.
            </p>
            <p className="relative mt-2 max-w-[34ch] text-[0.95rem] leading-relaxed text-white/85 lg:mt-3 lg:text-lg"> 
              Não precisa ter parado de vez. Começar hoje já é um passo, e você
              pode recomeçar quantas vezes precisar.
            </p>
            <button
              onClick={startCounter}
              className="relative mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-5 text-[0.95rem] font-semibold text-teal-ink transition-colors hover:bg-teal-soft"
            >
              <Sprout className="h-4 w-4" />
              Começar a contar hoje
            </button>
          </>
        )}
      </section>

      {/* Trilha de marcos */}
      <section className="mt-8 lg:mt-12" aria-labelledby="marcos-titulo">
        <div className="flex items-baseline justify-between">
          <h2 id="marcos-titulo" className="text-lg font-semibold text-navy">
            Sua trilha
          </h2>
          <span className="tabular text-sm text-muted-foreground">
            {reachedCount} de {MILESTONES.length} marcos
          </span>
        </div>
        <ol className="relative mt-5 grid grid-cols-6">
          <span
            aria-hidden="true"
            className="absolute left-[8.33%] right-[8.33%] top-[18px] h-[3px] rounded-full bg-border lg:top-[23px]"
          />
          <span
            aria-hidden="true"
            className="absolute left-[8.33%] top-[18px] h-[3px] rounded-full bg-gold transition-[width] duration-700 lg:top-[23px]"
            style={{
              width: `${reachedCount <= 1 ? 0 : ((reachedCount - 1) / (MILESTONES.length - 1)) * 83.33}%`,
            }}
          />
          {MILESTONES.map((m) => {
            const achieved = started && days >= m.days;
            const isNext = next?.days === m.days;
            const Icon = m.icon;
            return (
              <li key={m.days} className="relative flex flex-col items-center text-center">
                <span
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-full border-2 lg:h-12 lg:w-12",
                    achieved
                      ? "border-gold bg-gold text-navy"
                      : isNext
                        ? "border-teal-deep bg-card text-teal-deep"
                        : "border-border bg-background text-muted-foreground",
                  )}
                >
                  <Icon className="h-4 w-4 lg:h-5 lg:w-5" strokeWidth={2} />
                </span>
                <span
                  className={cn(
                    "mt-2 text-xs leading-tight lg:mt-3 lg:text-sm",
                    achieved || isNext ? "font-semibold text-navy" : "text-muted-foreground",
                  )}
                >
                  {m.short}
                </span>
                <span className="sr-only">{achieved ? "alcançado" : "ainda não"}</span>
              </li>
            );
          })}
        </ol>
        {started && next && now !== null && (
          <p className="mt-4 text-sm text-muted-foreground">
            Próximo marco: <span className="font-semibold text-navy">{next.label}</span>
            {" · "}
            {next.days - days === 1 ? "falta 1 dia" : `faltam ${next.days - days} dias`}
          </p>
        )}
      </section>

      </div>

      {/* Coluna lateral no desktop */}
      <aside className="lg:col-span-5 lg:pt-[11.25rem]">
      {/* Para o momento da vontade: perto do polegar */}
      <button
        onClick={openXande}
        className="mt-8 lg:mt-0 flex w-full items-center gap-4 rounded-3xl bg-teal-soft p-4 text-left transition-colors hover:bg-[#cfe9e1]"
      >
        <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-card text-teal-deep shadow-card">
          <Sparkles className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-navy">Bateu vontade de apostar?</span>
          <span className="mt-0.5 block text-sm text-teal-ink">
            O Xande te ajuda a segurar o impulso.
          </span>
        </span>
        <ChevronRight className="h-5 w-5 flex-none text-teal-deep" />
      </button>

      {/* Caminhos */}
      <section className="mt-8" aria-labelledby="caminhos-titulo">
        <h2 id="caminhos-titulo" className="text-lg font-semibold text-navy">
          Para continuar
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {/* Simulador: cartão largo, com o número como protagonista */}
          <Link
            to="/simulador"
            className="col-span-2 flex flex-col rounded-3xl bg-gold-soft p-5 transition-colors hover:bg-[#f7e6c4]"
          >
            <span className="flex items-center justify-between">
              <span className="text-sm font-medium text-gold-deep">Simulador</span>
              <PiggyBank className="h-5 w-5 text-gold-deep" />
            </span>
            {sim ? (
              <>
                <span className="mt-3 text-[0.95rem] text-navy/80">
                  Seus {brl(sim.weekly)} por semana viram
                </span>
                <span className="tabular mt-1 text-[2.25rem] font-semibold leading-none tracking-[-0.03em] text-navy">
                  {brl(sim.weekly * 260)}
                </span>
                <span className="mt-1 text-sm text-gold-deep">em 5 anos</span>
              </>
            ) : (
              <>
                <span className="mt-3 text-[1.35rem] font-semibold leading-snug text-navy">
                  O que o dinheiro das apostas pode virar?
                </span>
                <span className="mt-1 text-sm text-gold-deep">Descubra em 10 segundos</span>
              </>
            )}
          </Link>

          {/* Autoavaliação: com a escala de resultado */}
          <Link
            to="/autoavaliacao"
            className="flex flex-col rounded-3xl border border-border bg-card p-4 transition-colors hover:border-teal-deep/40"
          >
            <ClipboardCheck className="h-5 w-5 text-teal-deep" />
            <span className="mt-3 font-semibold leading-snug text-navy">
              {assessment ? "Sua autoavaliação" : "Como está sua relação com as bets?"}
            </span>
            <span className="mt-1 text-sm leading-snug text-muted-foreground">
              {assessment
                ? `${tierShort(assessment.score)} · refazer`
                : "9 perguntas · 2 min"}
            </span>
            <span className="mt-auto grid grid-cols-4 gap-1 pt-4" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full",
                    assessment && tierIndex(assessment.score) === i ? "bg-teal-deep" : "bg-muted",
                  )}
                />
              ))}
            </span>
          </Link>

          {/* Guia: com os 7 passos */}
          <Link
            to="/guia/parar-de-apostar"
            className="flex flex-col rounded-3xl bg-navy p-4 text-white transition-colors hover:bg-[#1d2d4c]"
          >
            <BookOpen className="h-5 w-5 text-[#7fe6da]" />
            <span className="mt-3 font-semibold leading-snug">Como parar de apostar</span>
            <span className="mt-1 text-sm leading-snug text-white/75">Guia em 7 passos</span>
            <span className="tabular mt-auto grid grid-cols-7 gap-1 pt-4 text-[0.65rem] font-semibold" aria-hidden="true">
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <span
                  key={n}
                  className="grid aspect-square place-items-center rounded-full bg-white/10 text-white/80"
                >
                  {n}
                </span>
              ))}
            </span>
          </Link>
        </div>
      </section>

      {partner && <CampusSupportCard partner={partner} className="mt-6" />}
      </aside>
      </div>

      {/* Trocar perfil */}
      <Link
        to="/acesso"
        className="mt-10 flex items-center gap-4 rounded-3xl border border-border bg-card p-4 transition-colors hover:border-teal-deep/40 lg:mt-14 lg:p-5"
      >
        <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-teal-soft text-teal-deep">
          <ArrowLeftRight className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-navy">Trocar perfil</span>
          <span className="block text-sm text-muted-foreground">
            AF People{partner ? ` + ${partner.shortName}` : " · acesso livre"}
          </span>
        </span>
        <ChevronRight className="h-5 w-5 flex-none text-muted-foreground" />
      </Link>

      {/* Recomeçar */}
      <Dialog open={restartOpen} onOpenChange={setRestartOpen}>
        <DialogContent className="max-w-sm rounded-3xl">
          <DialogHeader>
            <div className="mx-auto mb-2 grid h-14 w-14 place-items-center rounded-full bg-teal-soft text-teal-deep">
              <Heart className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center text-xl text-navy">
              Todo recomeço conta
            </DialogTitle>
            <DialogDescription className="text-center text-[0.95rem] leading-relaxed">
              Recaída não apaga o que você já construiu. Orgulho de você por
              continuar tentando. Vamos recomeçar o contador a partir de agora?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-2 flex-col gap-2 sm:flex-col">
            <Button
              onClick={startCounter}
              className="min-h-12 w-full rounded-full bg-teal-deep text-white hover:bg-teal-ink"
            >
              Sim, recomeçar agora
            </Button>
            <Button
              variant="ghost"
              onClick={() => setRestartOpen(false)}
              className="min-h-12 w-full rounded-full text-muted-foreground"
            >
              Agora não
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Comemoração de marco */}
      <Dialog
        open={celebration !== null}
        onOpenChange={(v) => !v && setCelebration(null)}
      >
        <DialogContent className="max-w-sm rounded-3xl text-center">
          <DialogHeader>
            <div className="mx-auto mb-2 grid h-20 w-20 place-items-center rounded-full bg-gold text-navy shadow-soft">
              {celebration ? <celebration.icon className="h-9 w-9" strokeWidth={1.8} /> : null}
            </div>
            <DialogTitle className="text-center text-xl text-navy">
              Você chegou a {celebration?.label}
            </DialogTitle>
            <DialogDescription className="text-center text-[0.95rem] leading-relaxed">
              Isso é muito grande. Respira e sente esse orgulho: foi você que fez.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => setCelebration(null)}
            className="mt-2 min-h-12 w-full rounded-full bg-teal-deep text-white hover:bg-teal-ink"
          >
            Seguir em frente
          </Button>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

/** Marca d'água com o logo das mãos, discreta, no canto do contador. */
function HandsWatermark() {
  return (
    <img
      src="/logo-maos-coracao.svg"
      alt=""
      aria-hidden="true"
      width={180}
      height={180}
      className="pointer-events-none absolute -bottom-10 -right-8 h-44 w-44 select-none opacity-[0.12] grayscale brightness-[3] lg:-bottom-16 lg:-right-10 lg:h-80 lg:w-80"
      draggable={false}
    />
  );
}

const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

/** Mesmas faixas do PGSI usadas na tela de autoavaliação. */
function tierIndex(score: number) {
  if (score === 0) return 0;
  if (score <= 2) return 1;
  if (score <= 7) return 2;
  return 3;
}
function tierShort(score: number) {
  return ["Sem risco", "Risco leve", "Risco moderado", "Risco alto"][tierIndex(score)];
}
