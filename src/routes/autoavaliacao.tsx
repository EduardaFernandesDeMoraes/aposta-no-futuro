import { track, EVENTS } from "@/lib/analytics";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calculator,
  ChevronRight,
  History,
  MapPin,
  Phone,
  RefreshCw,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { AppShell, openXande } from "@/components/app-shell";
import { CampusSupportCard } from "@/components/campus-support-card";
import { useAccess } from "@/lib/access";
import { findPartner } from "@/lib/partners";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/autoavaliacao")({
  head: () => ({
    meta: [
      { title: "Autoavaliação | Aposta no Futuro" },
      {
        name: "description",
        content:
          "Teste rápido e anônimo baseado no PGSI para você entender melhor sua relação com apostas.",
      },
      { property: "og:title", content: "Autoavaliação PGSI — Aposta no Futuro" },
      {
        property: "og:description",
        content:
          "Questionário PGSI de 9 perguntas, anônimo e sem julgamento, pra entender sua relação com apostas.",
      },
      { property: "og:url", content: "https://apostanofuturo.online/autoavaliacao" },
    ],
    links: [{ rel: "canonical", href: "https://apostanofuturo.online/autoavaliacao" }],
  }),
  component: Autoavaliacao,
});

const OPTIONS = [
  { label: "Nunca", value: 0 },
  { label: "Às vezes", value: 1 },
  { label: "Na maioria das vezes", value: 2 },
  { label: "Quase sempre", value: 3 },
] as const;

const QUESTIONS: string[] = [
  "Você apostou mais do que poderia perder de verdade?",
  "Precisou apostar quantias cada vez maiores para sentir a mesma emoção?",
  "Voltou a apostar outro dia para tentar recuperar o dinheiro que perdeu?",
  "Pegou dinheiro emprestado ou vendeu algo para conseguir apostar?",
  "Sentiu que talvez tivesse um problema com apostas?",
  "As apostas causaram algum problema de saúde, incluindo estresse ou ansiedade?",
  "Alguém já criticou suas apostas ou disse que você tinha um problema (mesmo que você não concordasse)?",
  "Suas apostas causaram problemas financeiros para você ou sua família?",
  "Você se sentiu culpado(a) pela forma como aposta ou pelo que acontece quando aposta?",
];

type SavedResult = {
  score: number;
  answers: number[];
  at: string;
};

type TierId = "nenhum" | "leve" | "moderado" | "alto";

type Tier = {
  id: TierId;
  min: number;
  max: number;
  short: string;
  label: string;
  message: string;
};

const TIERS: Tier[] = [
  {
    id: "nenhum",
    min: 0,
    max: 0,
    short: "Sem risco",
    label: "Sem indícios de risco",
    message:
      "Suas respostas não indicam sinais de risco por enquanto. Continue cuidando de você e observando seus hábitos.",
  },
  {
    id: "leve",
    min: 1,
    max: 2,
    short: "Leve",
    label: "Alguns indícios de risco",
    message:
      "Suas respostas indicam alguns sinais leves. Pode ser um bom momento para refletir sobre suas apostas e conversar com alguém de confiança.",
  },
  {
    id: "moderado",
    min: 3,
    max: 7,
    short: "Moderado",
    label: "Indícios de risco moderado",
    message:
      "Suas respostas indicam sinais de risco moderado. Pode ser um bom momento para pedir apoio e conversar com alguém de confiança.",
  },
  {
    id: "alto",
    min: 8,
    max: 27,
    short: "Alto",
    label: "Indícios de risco alto",
    message:
      "Suas respostas indicam sinais de risco alto. Você não está sozinho(a): conversar com um profissional ou com um canal de apoio é um ato de cuidado, e muita gente sai desse lugar.",
  },
];

function tierFor(score: number): Tier {
  return TIERS.find((t) => score >= t.min && score <= t.max) ?? TIERS[0];
}

const dateFmt = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", { day: "numeric", month: "long" });

function Autoavaliacao() {
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(QUESTIONS.length).fill(null),
  );
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const [saved, setSaved] = useLocalStorage<SavedResult | null>("anf.autoavaliacao", null);
  const [shownScore, setShownScore] = useState<number | null>(null);
  const advanceTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
  }, []);

  const currentAnswer = answers[step];
  const isLast = step === QUESTIONS.length - 1;
  const answeredCount = answers.filter((a) => a !== null).length;
  const progress = (answeredCount / QUESTIONS.length) * 100;

  function select(value: number) {
    const next = [...answers];
    next[step] = value;
    setAnswers(next);
    // Avança sozinho para a próxima pergunta (menos rolagem no celular).
    if (!isLast) {
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
      advanceTimer.current = window.setTimeout(() => setStep((s) => s + 1), 260);
    }
  }

  function finish() {
    if (answers.some((a) => a === null)) return;
    const finalScore = answers.reduce<number>((s, v) => s + (v ?? 0), 0);
    setSaved({
      score: finalScore,
      answers: answers.map((a) => a ?? 0),
      at: new Date().toISOString(),
    });
    track(EVENTS.assessmentDone);
    setShownScore(finalScore);
    setFinished(true);
    window.scrollTo({ top: 0 });
  }

  function goBack() {
    if (step === 0) return;
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    setStep((s) => s - 1);
  }

  function restart() {
    setAnswers(Array(QUESTIONS.length).fill(null));
    setStep(0);
    setFinished(false);
    setShownScore(null);
    window.scrollTo({ top: 0 });
  }

  if (finished && shownScore !== null) {
    return <Result score={shownScore} onRestart={restart} />;
  }

  return (
    <AppShell
      title="Autoavaliação"
      intro="9 perguntas sobre os últimos 12 meses. Anônimo, e não é um diagnóstico."
    >
      <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-12">
      <div className="lg:sticky lg:top-28 lg:col-span-4 lg:rounded-[2rem] lg:border lg:border-border lg:bg-card lg:p-6 lg:order-1">
      {saved && answeredCount === 0 && (
        <button
          type="button"
          onClick={() => {
            setShownScore(saved.score);
            setFinished(true);
          }}
          className="mb-6 flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-teal-soft/50 lg:border-0 lg:bg-background"
        >
          <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-teal-soft text-teal-deep">
            <History className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-medium text-navy">Ver seu último resultado</span>
            <span className="block text-sm text-muted-foreground">
              {tierFor(saved.score).label}, em {dateFmt(saved.at)}
            </span>
          </span>
          <ChevronRight className="h-5 w-5 flex-none text-muted-foreground" />
        </button>
      )}

      {/* Progresso */}
      <div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-navy">
            Pergunta {step + 1} de {QUESTIONS.length}
          </span>
          {step > 0 && (
            <button
              type="button"
              onClick={goBack}
              className="-mr-2 inline-flex min-h-11 items-center gap-1 rounded-full px-2 font-medium text-muted-foreground hover:text-navy"
            >
              <ArrowLeft className="h-4 w-4" />
              Anterior
            </button>
          )}
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-label="Progresso da autoavaliação"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-teal transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <ol className="mt-5 hidden grid-cols-9 gap-1.5 lg:grid" aria-hidden="true">
          {QUESTIONS.map((_, i) => (
            <li
              key={i}
              className={cn(
                "tabular grid h-8 place-items-center rounded-lg text-xs font-semibold",
                i === step
                  ? "bg-teal-deep text-white"
                  : answers[i] !== null
                    ? "bg-teal-soft text-teal-ink"
                    : "bg-muted text-muted-foreground",
              )}
            >
              {i + 1}
            </li>
          ))}
        </ol>
      </div>
      </div>

      {/* Pergunta */}
      <section className="rise-in mt-6 lg:order-0 lg:col-span-8 lg:mt-0" key={step} aria-live="polite">
        <h2 className="text-[1.3rem] font-semibold leading-snug text-navy lg:max-w-[28ch] lg:text-[2rem] lg:leading-tight lg:tracking-[-0.02em]">
          {QUESTIONS[step]}
        </h2>

        <div className="mt-5 space-y-2.5 lg:mt-8 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0" role="radiogroup" aria-label="Com que frequência?">
          {OPTIONS.map((opt) => {
            const active = currentAnswer === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => select(opt.value)}
                className={cn(
                  "flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 bg-card px-4 text-left font-medium transition-colors lg:min-h-20 lg:px-6 lg:text-lg",
                  active
                    ? "border-teal-deep bg-teal-soft text-navy"
                    : "border-border text-navy hover:border-teal-deep/40",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid h-5 w-5 flex-none place-items-center rounded-full border-2",
                    active ? "border-teal-deep" : "border-input",
                  )}
                >
                  {active && <span className="h-2.5 w-2.5 rounded-full bg-teal-deep" />}
                </span>
                {opt.label}
              </button>
            );
          })}
        </div>

        {isLast && (
          <Button
            type="button"
            onClick={finish}
            disabled={currentAnswer === null}
            className="mt-6 h-12 w-full rounded-full bg-teal-deep text-base font-semibold text-white hover:bg-teal-ink disabled:opacity-40 lg:w-auto lg:px-10"
          >
            Ver meu resultado
            <ArrowRight className="ml-1 h-5 w-5" />
          </Button>
        )}
      </section>
      </div>
    </AppShell>
  );
}

type NextStep = {
  title: string;
  desc: string;
  icon: LucideIcon;
  to?: string;
  href?: string;
  onClick?: () => void;
  strong?: boolean;
};

function nextStepsFor(tier: TierId): NextStep[] {
  const cvv: NextStep = {
    title: "Conversar com alguém preparado",
    desc: "CVV 188, 24h, gratuito e sigiloso. Não precisa estar em crise para ligar.",
    icon: Phone,
    href: "tel:188",
    strong: true,
  };
  const guia: NextStep = {
    title: "Ler o guia para parar de apostar",
    desc: "Passos práticos: bloquear sites, cuidar do dinheiro, lidar com gatilhos.",
    icon: BookOpen,
    to: "/guia/parar-de-apostar",
  };
  const xande: NextStep = {
    title: "Quando bater vontade, chamar o Xande",
    desc: "Ele te ajuda a segurar o impulso por alguns minutos.",
    icon: Sparkles,
    onClick: openXande,
  };
  const sim: NextStep = {
    title: "Ver o que seu dinheiro pode virar",
    desc: "Um jeito concreto de enxergar o que está em jogo.",
    icon: Calculator,
    to: "/simulador",
  };
  const caps: NextStep = {
    title: "Se quiser conversar, procure um CAPS",
    desc: "Atendimento gratuito do SUS, inclusive para dependências.",
    icon: MapPin,
    href: "https://www.google.com/maps/search/CAPS+perto+de+mim",
  };
  if (tier === "alto") return [cvv, guia, xande];
  if (tier === "moderado") return [guia, xande, caps];
  return [sim, guia, xande];
}

function Result({ score, onRestart }: { score: number; onRestart: () => void }) {
  const tier = tierFor(score);
  const steps = nextStepsFor(tier.id);
  const [access] = useAccess();
  const partner = access.mode === "student" ? findPartner(access.partner) : undefined;

  return (
    <AppShell title="Seu resultado" titleAs="p">
      <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-12">
      <div className="lg:sticky lg:top-28 lg:col-span-5">
      <div className="rise-in">
        <p className="font-script text-[2rem] font-bold leading-none text-teal-deep lg:text-[2.75rem]">
          Obrigado
        </p>
        <h1 className="mt-2 text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.02em] text-navy lg:text-[2.75rem] lg:tracking-[-0.03em]">
          por responder com honestidade.
        </h1>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">
          Olhar para isso já é um passo de cuidado.
        </p>
      </div>

      {/* Resultado */}
      <section className="mt-8 rounded-3xl border border-border bg-card p-5" aria-labelledby="faixa">
        <h2 id="faixa" className="text-[1.3rem] font-semibold leading-snug text-navy">
          {tier.label}
        </h2>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-navy/85">{tier.message}</p>

        <div className="mt-5" aria-hidden="true">
          <div className="grid grid-cols-4 gap-1.5">
            {TIERS.map((t) => (
              <span
                key={t.id}
                className={cn(
                  "h-2 rounded-full",
                  t.id === tier.id ? "bg-teal-deep" : "bg-muted",
                )}
              />
            ))}
          </div>
          <div className="mt-2 grid grid-cols-4 gap-1.5 text-xs">
            {TIERS.map((t) => (
              <span
                key={t.id}
                className={cn(
                  t.id === tier.id ? "font-semibold text-navy" : "text-muted-foreground",
                )}
              >
                {t.short}
              </span>
            ))}
          </div>
        </div>
        <p className="tabular mt-4 text-sm text-muted-foreground">
          Pontuação: <span className="font-semibold text-navy">{score}</span> de 27
        </p>
      </section>
      </div>

      <div className="lg:col-span-7">
      {/* Próximo passo */}
      <section className="mt-8 lg:mt-0" aria-labelledby="proximo">
        <h2 id="proximo" className="text-lg font-semibold text-navy lg:text-2xl">
          Seu próximo passo
        </h2>
        <ol className="mt-3 space-y-2.5">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const inner = (
              <>
                <span
                  className={cn(
                    "grid h-11 w-11 flex-none place-items-center rounded-full",
                    s.strong ? "bg-white/15 text-white" : "bg-teal-soft text-teal-deep",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className={cn("block text-xs font-medium", s.strong ? "text-white/80" : "text-muted-foreground")}>
                    Passo {i + 1}
                  </span>
                  <span className={cn("block font-semibold leading-snug", s.strong ? "text-white" : "text-navy")}>
                    {s.title}
                  </span>
                  <span className={cn("mt-0.5 block text-sm leading-snug", s.strong ? "text-white/85" : "text-muted-foreground")}>
                    {s.desc}
                  </span>
                </span>
                <ChevronRight className={cn("h-5 w-5 flex-none", s.strong ? "text-white" : "text-muted-foreground")} />
              </>
            );
            const cls = cn(
              "flex w-full items-center gap-4 rounded-2xl p-4 text-left transition-colors",
              s.strong
                ? "bg-teal-ink hover:bg-navy"
                : "border border-border bg-card hover:bg-teal-soft/50",
            );
            return (
              <li key={s.title}>
                {s.to ? (
                  <Link to={s.to} className={cls}>
                    {inner}
                  </Link>
                ) : s.href ? (
                  <a
                    href={s.href}
                    className={cls}
                    {...(s.href.startsWith("http")
                      ? {
                          target: "_blank",
                          rel: "noopener noreferrer",
                          onClick: () => track(EVENTS.capsClicked),
                        }
                      : {})}
                  >
                    {inner}
                  </a>
                ) : (
                  <button type="button" onClick={s.onClick} className={cls}>
                    {inner}
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      {partner && <CampusSupportCard partner={partner} className="mt-6" />}

      <div className="mt-8 flex flex-col gap-2 lg:flex-row">
        <Button
          onClick={onRestart}
          variant="outline"
          className="min-h-12 w-full rounded-full border-border bg-card text-navy lg:w-auto lg:px-6"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refazer autoavaliação
        </Button>
        <Link
          to="/"
          className="inline-flex min-h-12 w-full items-center justify-center rounded-full text-sm font-semibold text-teal-deep hover:bg-teal-soft lg:w-auto lg:px-6"
        >
          Voltar para o início
        </Link>
      </div>

      </div>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
        Ferramenta educativa baseada no PGSI (Problem Gambling Severity Index).
        Não é diagnóstico. Suas respostas ficam só no seu aparelho.
      </p>
    </AppShell>
  );
}
