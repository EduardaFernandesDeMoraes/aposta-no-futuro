import { track, EVENTS } from "@/lib/analytics";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { ArrowDown, ChevronDown, Info, PiggyBank } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";
import { MinhasApostas, useFutureBets } from "@/components/minhas-apostas";

export const Route = createFileRoute("/simulador")({
  head: () => ({
    meta: [
      { title: "Simulador | Aposta no Futuro" },
      {
        name: "description",
        content:
          "Calcule quanto você deixa de perder ao não apostar e o que esse dinheiro pode se tornar.",
      },
      { property: "og:title", content: "Simulador — Aposta no Futuro" },
      {
        property: "og:description",
        content:
          "Descubra em tempo real quanto você deixa de perder e o que esse dinheiro pode virar.",
      },
      { property: "og:url", content: "https://apostanofuturo.online/simulador" },
    ],
    links: [{ rel: "canonical", href: "https://apostanofuturo.online/simulador" }],
  }),
  component: Simulador,
});

const amountSchema = z
  .number({ invalid_type_error: "Digite um número" })
  .finite()
  .min(0, "Não pode ser negativo")
  .max(100000, "Valor muito alto");

const PERIODS = [
  { key: "6m", label: "6 meses", weeks: 26 },
  { key: "1a", label: "1 ano", weeks: 52 },
  { key: "3a", label: "3 anos", weeks: 156 },
  { key: "5a", label: "5 anos", weeks: 260 },
] as const;
type PeriodKey = (typeof PERIODS)[number]["key"];

type Freq = "semana" | "mes";
const QUICK: Record<Freq, number[]> = {
  semana: [20, 50, 100, 200],
  mes: [100, 200, 400, 800],
};
/** Dias úteis por mês, para traduzir o valor em dias de trabalho. */
const WORK_DAYS = 22;

const brl = (n: number) =>
  n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });

function parseAmount(input: string) {
  return Number(input.replace(/\./g, "").replace(",", "."));
}

// Valor futuro de depósitos mensais com taxa r por n meses
function fvMonthlyDeposits(pmt: number, months: number, r = 0.008) {
  if (r === 0) return pmt * months;
  return pmt * ((Math.pow(1 + r, months) - 1) / r);
}

function dreamFor(yearAmount: number) {
  if (yearAmount < 500)
    return "um kit de estudos, um livro que te inspira ou aquele passeio que você adiou.";
  if (yearAmount < 2000)
    return "um curso online, uma bicicleta ou o começo da sua reserva de emergência.";
  if (yearAmount < 6000)
    return "um curso técnico, uma viagem em família ou uma reserva de emergência sólida.";
  if (yearAmount < 15000) return "uma faculdade, um intercâmbio curto ou a entrada de uma moto.";
  return "um grande sonho: sua independência, um imóvel ou o começo do seu próprio negócio.";
}

/** Conta de 0 até `target` uma vez, com desaceleração suave. */
function useCountUp(target: number, duration = 1100) {
  const [value, setValue] = useState(target);
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(2, -10 * p);
      setValue(target * (p >= 1 ? 1 : eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    setValue(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

/**
 * `weekly` é sempre o valor por semana (a home e o perfil leem esse campo).
 * `amount` e `freq` guardam o que a pessoa digitou, para retomar igual.
 */
type Saved = {
  weekly: number;
  calculatedAt: string;
  amount?: number;
  freq?: Freq;
  period?: PeriodKey;
};

function Simulador() {
  const [saved, setSaved] = useLocalStorage<Saved | null>("anf.simulador", null);
  const [income, setIncome] = useLocalStorage<number | null>("anf.simulador.renda", null);
  const [bets] = useFutureBets();
  const [raw, setRaw] = useState<string>("");
  const [freq, setFreq] = useState<Freq>("semana");
  const [weekly, setWeekly] = useState<number | null>(null);
  const [period, setPeriod] = useState<PeriodKey>("5a");
  const [incomeRaw, setIncomeRaw] = useState("");
  const [error, setError] = useState<string | null>(null);
  const restored = useRef(false);
  const incomeRestored = useRef(false);

  // Depois da hidratação, retoma o último cálculo feito no aparelho.
  useEffect(() => {
    if (restored.current || !saved) return;
    restored.current = true;
    setRaw(String(saved.amount ?? saved.weekly).replace(".", ","));
    setFreq(saved.freq ?? "semana");
    setPeriod(saved.period ?? "5a");
    setWeekly(saved.weekly);
  }, [saved]);

  useEffect(() => {
    if (incomeRestored.current || income === null) return;
    incomeRestored.current = true;
    setIncomeRaw(String(income).replace(".", ","));
  }, [income]);

  function calculate(input: string, unit: Freq) {
    restored.current = true;
    const num = parseAmount(input);
    const result = amountSchema.safeParse(num);
    if (!input.trim()) {
      setError("Digite um valor ou escolha um dos valores rápidos.");
      setWeekly(null);
      return;
    }
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Valor inválido");
      setWeekly(null);
      return;
    }
    const perWeek = unit === "mes" ? (result.data * 12) / 52 : result.data;
    setError(null);
    setWeekly(perWeek);
    setSaved({
      weekly: perWeek,
      amount: result.data,
      freq: unit,
      period,
      calculatedAt: new Date().toISOString(),
    });
    track(EVENTS.simulatorUsed);
  }

  function handleCalc(e: React.FormEvent) {
    e.preventDefault();
    calculate(raw, freq);
  }

  function quickPick(v: number, unit: Freq = freq) {
    const s = String(v);
    setRaw(s);
    setFreq(unit);
    calculate(s, unit);
  }

  function changeFreq(next: Freq) {
    if (next === freq) return;
    setFreq(next);
    // Quem já calculou vê o resultado mudar na hora, sem apertar o botão.
    if (weekly !== null && raw.trim()) calculate(raw, next);
  }

  function choosePeriod(key: PeriodKey) {
    setPeriod(key);
    if (saved) setSaved({ ...saved, period: key });
  }

  function changeIncome(value: string) {
    incomeRestored.current = true;
    const clean = value.replace(/[^0-9,.]/g, "");
    setIncomeRaw(clean);
    const n = parseAmount(clean);
    setIncome(clean.trim() && Number.isFinite(n) && n > 0 && n <= 1_000_000 ? n : null);
  }

  const demo = weekly === null;
  const perWeek = weekly ?? 50;
  const rows = PERIODS.map((p) => ({ ...p, saved: perWeek * p.weeks }));
  const max = rows[rows.length - 1].saved;
  const selected = rows.find((r) => r.key === period) ?? rows[rows.length - 1];
  const monthly = perWeek * (52 / 12);
  const yearAmount = perWeek * 52;
  const fv5y = fvMonthlyDeposits(monthly, 60);
  const shown = useCountUp(demo ? 0 : selected.saved);

  const typed = parseAmount(raw);
  const share = income ? (monthly / income) * 100 : null;
  const workDays = income ? Math.round(yearAmount / (income / WORK_DAYS)) : null;

  // A aposta no futuro mais perto de ser alcançada, para ligar o valor a um objetivo.
  const nextBet = bets
    .filter((b) => b.target - b.saved > 0)
    .sort((a, b) => a.target - a.saved - (b.target - b.saved))[0];
  const nextBetWeeks =
    nextBet && !demo && perWeek > 0 ? Math.ceil((nextBet.target - nextBet.saved) / perWeek) : null;

  return (
    <AppShell title="Simulador" intro="Veja o que o dinheiro das apostas pode virar.">
      {/* Entrada: no desktop é uma faixa na largura toda, acima do resultado. */}
      <form
        onSubmit={handleCalc}
        noValidate
        className="lg:rounded-[2rem] lg:border lg:border-border lg:bg-card lg:p-8"
      >
        <div className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              {/* O rótulo e o seletor formam uma frase: "Valor por [semana | mês]". */}
              <label htmlFor="valor" className="block font-semibold text-navy">
                Valor por<span className="sr-only"> {freq === "semana" ? "semana" : "mês"}</span>
              </label>
              <div
                role="group"
                aria-label="Valor por semana ou por mês"
                className="flex rounded-full bg-muted p-1"
              >
                {(["semana", "mes"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => changeFreq(f)}
                    aria-pressed={freq === f}
                    className={cn(
                      "min-h-11 min-w-20 rounded-full px-4 text-sm font-semibold transition-colors",
                      freq === f
                        ? "bg-card text-navy shadow-card"
                        : "text-muted-foreground hover:text-navy",
                    )}
                  >
                    {f === "semana" ? "semana" : "mês"}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-2 flex min-h-14 items-center gap-2 rounded-2xl border border-input bg-card px-4 focus-within:border-teal-deep focus-within:ring-2 focus-within:ring-teal-deep/20">
              <span className="text-lg font-semibold text-muted-foreground">R$</span>
              <input
                id="valor"
                inputMode="decimal"
                placeholder="0"
                maxLength={10}
                value={raw}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "valor-erro" : undefined}
                onChange={(e) => setRaw(e.target.value.replace(/[^0-9,.]/g, ""))}
                className="tabular w-full bg-transparent py-3 text-2xl font-semibold text-navy outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div
            className="mt-3 grid grid-cols-4 gap-2 lg:col-span-4 lg:mt-0"
            role="group"
            aria-label="Valores rápidos"
          >
            {QUICK[freq].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => quickPick(v)}
                aria-pressed={!demo && typed === v}
                className={cn(
                  "tabular min-h-11 rounded-full border text-sm font-semibold transition-colors lg:min-h-14",
                  !demo && typed === v
                    ? "border-teal-deep bg-teal-soft text-teal-ink"
                    : "border-border bg-card text-navy hover:border-teal-deep/40",
                )}
              >
                R$ {v}
              </button>
            ))}
          </div>

          <Button
            type="submit"
            className="mt-5 h-12 w-full rounded-full bg-teal-deep text-base font-semibold text-white hover:bg-teal-ink lg:col-span-3 lg:mt-0 lg:h-14"
          >
            Ver o que pode virar
          </Button>
        </div>
        {error && (
          <p id="valor-erro" className="mt-2 text-sm font-medium text-destructive">
            {error}
          </p>
        )}
      </form>

      {!demo && (
        <div className="lg:mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-12">
          <div className="lg:col-span-7">
            <div className="rise-in" key={weekly}>
              {/* A revelação */}
              <section
                aria-live="polite"
                className="relative mt-10 overflow-hidden rounded-[1.75rem] bg-teal-ink p-6 text-white shadow-soft lg:mt-0 lg:rounded-[2.25rem] lg:p-10"
              >
                <p className="text-[0.95rem] text-white/85 lg:text-lg">
                  Em {selected.label} sem apostar, você teria
                </p>
                <p className="tabular mt-2 text-[2.75rem] font-semibold leading-none tracking-[-0.03em] lg:mt-3 lg:text-[5rem] lg:tracking-[-0.04em]">
                  {brl(Math.round(shown))}
                </p>
                <p className="mt-5 max-w-[46ch] text-[0.95rem] leading-relaxed text-white lg:mt-6 lg:text-lg">
                  Só no primeiro ano, <strong className="tabular">{brl(yearAmount)}</strong> já pode
                  virar {dreamFor(yearAmount)}
                </p>
                {nextBet && nextBetWeeks ? (
                  <p className="mt-5 max-w-[46ch] rounded-2xl bg-white/10 px-4 py-3 text-[0.95rem] leading-relaxed text-white">
                    Com esse valor, sua aposta no futuro <strong>“{nextBet.name}”</strong> chega em
                    cerca de{" "}
                    <strong className="tabular">
                      {nextBetWeeks} {nextBetWeeks === 1 ? "semana" : "semanas"}
                    </strong>
                    .
                  </p>
                ) : null}
                <a
                  href="#minhas-apostas"
                  className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-teal-ink transition-colors hover:bg-teal-soft"
                >
                  {nextBet ? "Ver minhas apostas no futuro" : "Criar uma aposta no futuro"}
                  <ArrowDown className="h-4 w-4" />
                </a>
              </section>
            </div>

            <details className="group mt-6 hidden rounded-2xl border border-border bg-card lg:block">
              <HowWeCalculate monthly={monthly} fv5y={fv5y} />
            </details>
          </div>

          <div className="mt-8 lg:col-span-5 lg:mt-0 lg:rounded-[2rem] lg:border lg:border-border lg:bg-card lg:p-8">
            {/* Linha do tempo: cada período muda o número grande. */}
            <section aria-labelledby="tempo-titulo">
              <h2 id="tempo-titulo" className="text-lg font-semibold text-navy lg:text-xl">
                Ao longo do tempo
              </h2>
              <ul className="mt-3 space-y-1" aria-hidden={demo || undefined}>
                {rows.map((r) => {
                  const active = !demo && r.key === selected.key;
                  const content = (
                    <>
                      <span
                        className={cn(
                          "text-sm",
                          active ? "font-semibold text-navy" : "text-muted-foreground",
                        )}
                      >
                        {r.label}
                      </span>
                      <span className="h-2.5 overflow-hidden rounded-full bg-muted">
                        <span
                          className={cn(
                            "block h-full rounded-full transition-[width] duration-700 ease-out",
                            demo ? "bg-teal/35" : active ? "bg-teal-deep" : "bg-teal",
                          )}
                          style={{ width: `${Math.max(4, (r.saved / max) * 100)}%` }}
                        />
                      </span>
                      <span
                        className={cn(
                          "tabular text-right text-sm font-semibold",
                          demo ? "text-muted-foreground" : "text-navy",
                        )}
                      >
                        {brl(r.saved)}
                      </span>
                    </>
                  );
                  return (
                    <li key={r.key}>
                      {demo ? (
                        <div className="grid min-h-11 grid-cols-[4.5rem_1fr_auto] items-center gap-3 px-2">
                          {content}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => choosePeriod(r.key)}
                          aria-pressed={active}
                          className={cn(
                            "-mx-2 grid min-h-11 w-[calc(100%+1rem)] grid-cols-[4.5rem_1fr_auto] items-center gap-3 rounded-xl px-2 text-left transition-colors",
                            active ? "bg-teal-soft" : "hover:bg-muted/60",
                          )}
                        >
                          {content}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
              {!demo && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Escolha um período para ver o valor em destaque.
                </p>
              )}
            </section>

            {/* Peso na renda: opcional, fica só no aparelho. */}
            {!demo && (
              <section aria-labelledby="renda-titulo" className="mt-8 border-t border-border pt-6">
                <h2 id="renda-titulo" className="text-lg font-semibold text-navy lg:text-xl">
                  Quanto isso pesa na sua renda
                </h2>
                <label htmlFor="renda" className="mt-3 block text-sm font-medium text-navy">
                  Sua renda por mês
                </label>
                <div className="mt-1.5 flex min-h-12 items-center gap-2 rounded-2xl border border-input bg-card px-4 focus-within:border-teal-deep focus-within:ring-2 focus-within:ring-teal-deep/20 lg:bg-background">
                  <span className="text-sm font-semibold text-muted-foreground">R$</span>
                  <input
                    id="renda"
                    inputMode="decimal"
                    placeholder="1.500"
                    maxLength={10}
                    value={incomeRaw}
                    aria-describedby="renda-ajuda"
                    onChange={(e) => changeIncome(e.target.value)}
                    className="tabular w-full bg-transparent py-3 text-base font-semibold text-navy outline-none placeholder:font-normal placeholder:text-muted-foreground"
                  />
                </div>
                <p id="renda-ajuda" className="mt-1.5 text-sm text-muted-foreground">
                  Opcional. Fica só neste aparelho.
                </p>
                {share !== null && workDays !== null && (
                  <ul className="mt-4 space-y-3" aria-live="polite">
                    <li className="flex items-baseline gap-3">
                      <span className="tabular w-[5.5rem] flex-none text-2xl font-semibold tracking-[-0.02em] text-gold-deep">
                        {share >= 100 ? "100%" : `${share < 1 ? "<1" : Math.round(share)}%`}
                      </span>
                      <span className="text-[0.95rem] leading-snug text-navy">
                        {share >= 100
                          ? "ou mais da sua renda, de volta para você todo mês."
                          : "da sua renda, de volta para você todo mês."}
                      </span>
                    </li>
                    <li className="flex items-baseline gap-3">
                      <span className="tabular w-[5.5rem] flex-none text-2xl font-semibold tracking-[-0.02em] text-gold-deep">
                        {workDays} {workDays === 1 ? "dia" : "dias"}
                      </span>
                      <span className="text-[0.95rem] leading-snug text-navy">
                        de trabalho por ano que passam a ser seus.
                      </span>
                    </li>
                  </ul>
                )}
              </section>
            )}
          </div>

          <details className="group mt-6 rounded-2xl border border-border bg-card lg:hidden">
            <HowWeCalculate monthly={monthly} fv5y={fv5y} />
          </details>
        </div>
      )}

      {/* Desktop, antes do cálculo: o exemplo apagado ocupa o lugar do resultado. */}
      {demo && <DesktopExample rows={rows} max={max} onUse={() => quickPick(50, "semana")} />}

      <MinhasApostas weekly={weekly} suggestedTarget={weekly !== null ? weekly * 52 : 0} />
    </AppShell>
  );
}

function HowWeCalculate({ monthly, fv5y }: { monthly: number; fv5y: number }) {
  return (
    <>
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-2 px-4 text-sm font-semibold text-navy">
        <span className="flex items-center gap-2">
          <Info className="h-4 w-4 text-teal-deep" />
          Como calculamos
        </span>
        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="max-w-[75ch] space-y-2 px-4 pb-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          Multiplicamos o valor por 52 semanas por ano, sem juros. Um valor por mês vira valor por
          semana (12 meses em 52 semanas). Serve para dar noção de grandeza, não como previsão.
        </p>
        <p>
          Os dias de trabalho consideram {WORK_DAYS} dias úteis por mês na renda que você informou.
        </p>
        <p>
          Se você guardasse cerca de <strong className="tabular text-navy">{brl(monthly)}</strong>{" "}
          por mês rendendo uns 0,8% ao mês, em 5 anos seriam por volta de{" "}
          <strong className="tabular text-navy">{brl(fv5y)}</strong>.
        </p>
        <p>
          Projeção educativa: não é promessa de rendimento nem recomendação de investimento. Este
          app não oferece consultoria financeira.
        </p>
      </div>
    </>
  );
}

function DesktopExample({
  rows,
  max,
  onUse,
}: {
  rows: { key: string; label: string; saved: number }[];
  max: number;
  onUse: () => void;
}) {
  return (
    <div className="mt-12 hidden grid-cols-12 items-start gap-12 lg:grid">
      <div className="col-span-7 rounded-[2.25rem] border border-border bg-card p-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-soft px-3 py-1 text-xs font-semibold text-gold-deep">
          <PiggyBank className="h-3.5 w-3.5" />
          Exemplo com R$ 50 por semana
        </span>
        <p className="mt-6 text-lg text-muted-foreground">Em 5 anos sem apostar, você teria</p>
        <p
          className="tabular mt-3 text-[4rem] font-semibold leading-none tracking-[-0.04em] text-navy/30"
          aria-hidden="true"
        >
          {brl(max)}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-6">
          <p className="text-[0.95rem] text-navy">Agora coloque o seu valor acima.</p>
          <button
            type="button"
            onClick={onUse}
            className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold text-teal-deep underline underline-offset-4 transition-colors hover:text-teal-ink"
          >
            Usar R$ 50
          </button>
        </div>
      </div>
      <div
        className="col-span-5 rounded-[2rem] border border-border bg-card p-8"
        aria-hidden="true"
      >
        <p className="text-xl font-semibold text-navy/40">Ao longo do tempo</p>
        <ul className="mt-4 space-y-4">
          {rows.map((r) => (
            <li key={r.key} className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-3">
              <span className="text-sm text-muted-foreground">{r.label}</span>
              <span className="h-2.5 overflow-hidden rounded-full bg-muted">
                <span
                  className="block h-full rounded-full bg-teal/35"
                  style={{ width: `${Math.max(4, (r.saved / max) * 100)}%` }}
                />
              </span>
              <span className="tabular text-right text-sm font-semibold text-muted-foreground">
                {brl(r.saved)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
