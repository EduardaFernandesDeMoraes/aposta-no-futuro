import { track, EVENTS } from "@/lib/analytics";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ClipboardCheck,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  LifeBuoy,
  Users,
  Phone,
  Info,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { SensitiveFooter } from "@/components/sensitive-footer";
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

type Tier = {
  min: number;
  max: number;
  label: string;
  message: string;
  color: string;
  bg: string;
  showHelp: boolean;
};

const TIERS: Tier[] = [
  {
    min: 0,
    max: 0,
    label: "Sem indícios de risco",
    message:
      "Suas respostas não indicam sinais de risco por enquanto. Continue cuidando de você e observando seus hábitos.",
    color: "text-teal",
    bg: "bg-teal/10",
    showHelp: true,
  },
  {
    min: 1,
    max: 2,
    label: "Alguns indícios de risco",
    message:
      "Suas respostas indicam alguns sinais leves. Pode ser um bom momento para refletir sobre suas apostas e conversar com alguém de confiança.",
    color: "text-cyan",
    bg: "bg-cyan/10",
    showHelp: true,
  },
  {
    min: 3,
    max: 7,
    label: "Indícios de risco moderado",
    message:
      "Suas respostas indicam sinais de risco moderado. Pode ser um bom momento para pedir apoio e conversar com alguém de confiança.",
    color: "text-gold",
    bg: "bg-gold/15",
    showHelp: true,
  },
  {
    min: 8,
    max: 27,
    label: "Indícios de risco alto",
    message:
      "Suas respostas indicam sinais de risco alto. Você não está sozinho(a). Conversar com um profissional ou acessar um canal de apoio é um ato de cuidado.",
    color: "text-coral",
    bg: "bg-coral/10",
    showHelp: true,
  },
];

function tierFor(score: number): Tier {
  return TIERS.find((t) => score >= t.min && score <= t.max) ?? TIERS[0];
}

function Autoavaliacao() {
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(QUESTIONS.length).fill(null),
  );
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const [, setSaved] = useLocalStorage<SavedResult | null>(
    "anf.autoavaliacao",
    null,
  );

  const score = useMemo(
    () => answers.reduce<number>((s, v) => s + (v ?? 0), 0),
    [answers],
  );

  const currentAnswer = answers[step];
  const isLast = step === QUESTIONS.length - 1;
  const progress = ((step + (currentAnswer !== null ? 1 : 0)) / QUESTIONS.length) * 100;

  function select(value: number) {
    const next = [...answers];
    next[step] = value;
    setAnswers(next);
  }

  function goNext() {
    if (currentAnswer === null) return;
    if (isLast) {
      const finalScore = answers.reduce<number>(
        (s, v) => s + (v ?? 0),
        0,
      );
      setSaved({
        score: finalScore,
        answers: answers.map((a) => a ?? 0),
        at: new Date().toISOString(),
      });
      track(EVENTS.assessmentDone);
      setFinished(true);
      return;
    }
    setStep((s) => s + 1);
  }

  function goBack() {
    if (step === 0) return;
    setStep((s) => s - 1);
  }

  function restart() {
    setAnswers(Array(QUESTIONS.length).fill(null));
    setStep(0);
    setFinished(false);
  }

  if (finished) {
    return <Result score={score} onRestart={restart} />;
  }

  return (
    <AppShell title="Autoavaliação">
      {/* Intro */}
      <section className="rounded-3xl bg-navy p-5 text-navy-foreground shadow-soft">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-teal/20 text-teal">
            <ClipboardCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold">Teste rápido e anônimo</div>
            <div className="text-[11px] text-white/70">
              Baseado no PGSI · 9 perguntas
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-white/85">
          Este é um teste rápido e anônimo para você se conhecer melhor. Pense
          nos últimos 12 meses.
        </p>
      </section>

      {/* Disclaimer before first question */}
      <p className="mt-5 flex items-start gap-2 rounded-2xl bg-teal/10 p-3 text-xs leading-relaxed text-navy/90">
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal" />
        Esta é uma triagem baseada em um índice internacional (PGSI). Ela ajuda
        você a enxergar sinais, mas não é um diagnóstico e não substitui a
        avaliação de um profissional de saúde.
      </p>

      {/* Progress */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>
            Pergunta {step + 1} de {QUESTIONS.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-teal transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <section className="mt-5 rounded-3xl border border-border bg-card p-5 shadow-card">
        <h2 className="text-base font-semibold leading-snug text-navy">
          {QUESTIONS[step]}
        </h2>

        <div className="mt-4 space-y-2">
          {OPTIONS.map((opt) => {
            const active = currentAnswer === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => select(opt.value)}
                className={cn(
                  "flex w-full items-center justify-between rounded-2xl border-2 px-4 py-3 text-left text-sm font-medium transition-all active:scale-[0.99]",
                  active
                    ? "border-teal bg-teal/10 text-navy"
                    : "border-border bg-background text-navy/80 hover:border-teal/50",
                )}
              >
                <span>{opt.label}</span>
                <span
                  className={cn(
                    "grid h-6 w-6 place-items-center rounded-full border-2 text-[11px] font-bold",
                    active
                      ? "border-teal bg-teal text-teal-foreground"
                      : "border-border text-muted-foreground",
                  )}
                >
                  {opt.value}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Nav buttons */}
      <div className="mt-5 flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={goBack}
          disabled={step === 0}
          className="rounded-full"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Voltar
        </Button>
        <Button
          type="button"
          onClick={goNext}
          disabled={currentAnswer === null}
          className="ml-auto rounded-full bg-teal text-teal-foreground transition-all duration-200 hover:bg-[#14ac9b]"
        >
          {isLast ? "Ver resultado" : "Próxima"}
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      <p className="mt-6 flex items-start gap-2 rounded-2xl bg-secondary p-3 text-[11px] text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
        Isto não é um diagnóstico médico. Suas respostas ficam só no seu
        aparelho.
      </p>
      <SensitiveFooter />
    </AppShell>
  );
}

function Result({
  score,
  onRestart,
}: {
  score: number;
  onRestart: () => void;
}) {
  const tier = tierFor(score);
  const isHighRisk = score >= 8;
  const helpBox = (
    <section className="space-y-3">
      <div
        className={cn(
          "rounded-3xl border p-5 shadow-card",
          isHighRisk ? "border-coral/30 bg-coral/5" : "border-border bg-card",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2",
            isHighRisk ? "text-coral" : "text-navy",
          )}
        >
          <LifeBuoy className="h-5 w-5" />
          <span className="text-sm font-bold">
            {isHighRisk ? "Cuidado de você é prioridade" : "Cuidar de você também é uma opção"}
          </span>
        </div>
        <p className="mt-2 text-xs text-navy/80">
          {isHighRisk
            ? "Suas respostas indicam sinais que merecem atenção. Conversar com um profissional de saúde ou com um canal de apoio pode fazer diferença."
            : "Se quiser conversar, o CVV e os CAPS do SUS são gratuitos, sigilosos e acolhedores. Não precisa estar em crise para pedir apoio."}
        </p>
        <div className="mt-3 space-y-2">
          <a
            href="tel:188"
            className="flex items-center gap-3 rounded-2xl bg-coral p-3 text-coral-foreground shadow-soft"
          >
            <div className="grid h-10 w-10 place-items-center rounded-full bg-white/20">
              <Phone className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold">CVV: ligar 188</div>
              <div className="text-[11px] opacity-90">
                24h · gratuito · sigiloso
              </div>
            </div>
          </a>
          <div className="rounded-2xl border border-border bg-card p-3">
            <div className="text-sm font-semibold text-navy">
              CAPS mais próximo
            </div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">
              Procure o CAPS do seu município pelo SUS.
            </div>
          </div>
        </div>
      </div>

      <Link
        to="/comunidade"
        className="flex items-center gap-3 rounded-2xl bg-magenta p-4 text-white shadow-soft active:scale-[0.99]"
      >
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/20">
          <Users className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">
            Você não precisa passar por isso sozinho(a)
          </div>
          <div className="text-[11px] opacity-90">
            Entre na lista de espera da Comunidade.
          </div>
        </div>
        <ArrowRight className="h-5 w-5" />
      </Link>
    </section>
  );

  return (
    <AppShell title="Seu resultado">
      {isHighRisk && helpBox}

      <section
        className={cn(
          "rounded-3xl border border-border p-6 shadow-card",
          tier.bg,
        )}
      >
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Sua pontuação
        </div>
        <div className="mt-2 flex items-end gap-2">
          <span className={cn("text-6xl font-bold leading-none tabular-nums", tier.color)}>
            {score}
          </span>
          <span className="pb-1 text-sm text-muted-foreground">/ 27</span>
        </div>
        <div className={cn("mt-3 text-lg font-bold", tier.color)}>
          {tier.label}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-navy/85">
          {tier.message}
        </p>
      </section>

      {!isHighRisk && <div className="mt-5">{helpBox}</div>}

      <div className="mt-5 flex flex-col gap-2">
        <Button
          onClick={onRestart}
          variant="outline"
          className="w-full rounded-full"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refazer autoavaliação
        </Button>
        <Link
          to="/"
          className="w-full rounded-full bg-navy px-4 py-2.5 text-center text-sm font-semibold text-navy-foreground shadow-soft"
        >
          Voltar para o início
        </Link>
      </div>

      <p className="mt-6 flex items-start gap-2 rounded-2xl bg-secondary p-3 text-[11px] text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
        Isto não é um diagnóstico médico. É uma ferramenta educativa baseada
        no PGSI (Problem Gambling Severity Index). Suas respostas ficam só no
        seu aparelho.
      </p>
      <SensitiveFooter />
    </AppShell>
  );
}
