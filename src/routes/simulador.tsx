import { track, EVENTS } from "@/lib/analytics";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { ArrowDown, ChevronDown, Info, PiggyBank } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";
import { MinhasApostas } from "@/components/minhas-apostas";

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

const weeklySchema = z
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

const brl = (n: number) =>
  n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });

// Valor futuro de depósitos mensais com taxa r por n meses
function fvMonthlyDeposits(pmt: number, months: number, r = 0.008) {
  if (r === 0) return pmt * months;
  return pmt * ((Math.pow(1 + r, months) - 1) / r);
}

function dreamFor(yearAmount: number) {
  if (yearAmount < 500) return "um kit de estudos, um livro que te inspira ou aquele passeio que você adiou.";
  if (yearAmount < 2000) return "um curso online, uma bicicleta ou o começo da sua reserva de emergência.";
  if (yearAmount < 6000) return "um curso técnico, uma viagem em família ou uma reserva de emergência sólida.";
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

type Saved = { weekly: number; calculatedAt: string };

function Simulador() {
  const [saved, setSaved] = useLocalStorage<Saved | null>("anf.simulador", null);
  const [raw, setRaw] = useState<string>("");
  const [weekly, setWeekly] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const restored = useRef(false);

  // Depois da hidratação, retoma o último valor calculado no aparelho.
  useEffect(() => {
    if (restored.current || !saved) return;
    restored.current = true;
    setRaw(String(saved.weekly).replace(".", ","));
    setWeekly(saved.weekly);
  }, [saved]);

  function calculate(input: string) {
    restored.current = true;
    const num = Number(input.replace(/\./g, "").replace(",", "."));
    const result = weeklySchema.safeParse(num);
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
    setError(null);
    setWeekly(result.data);
    setSaved({ weekly: result.data, calculatedAt: new Date().toISOString() });
    track(EVENTS.simulatorUsed);
  }

  function handleCalc(e: React.FormEvent) {
    e.preventDefault();
    calculate(raw);
  }

  function quickPick(v: number) {
    const s = String(v);
    setRaw(s);
    calculate(s);
  }

  const rows =
    weekly !== null ? PERIODS.map((p) => ({ ...p, saved: weekly * p.weeks })) : [];
  const max = rows.length ? rows[rows.length - 1].saved : 0;
  const monthly = weekly !== null ? weekly * (52 / 12) : 0;
  const fv5y = weekly !== null ? fvMonthlyDeposits(monthly, 60) : 0;
  const yearAmount = weekly !== null ? weekly * 52 : 0;
  const fiveYears = weekly !== null ? weekly * 260 : 0;
  const shown = useCountUp(fiveYears);

  return (
    <AppShell
      title="Simulador"
      intro="Veja o que o dinheiro das apostas pode virar."
    >
      <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-12">
      <div className="lg:sticky lg:top-28 lg:col-span-5">
      {/* Entrada */}
      <form
        onSubmit={handleCalc}
        noValidate
        className="lg:rounded-[2rem] lg:border lg:border-border lg:bg-card lg:p-8"
      >
        <label htmlFor="weekly" className="block font-semibold text-navy">
          Valor por semana
        </label>
        <div className="mt-2 flex min-h-14 items-center gap-2 rounded-2xl border border-input bg-card px-4 focus-within:border-teal-deep focus-within:ring-2 focus-within:ring-teal-deep/20">
          <span className="text-lg font-semibold text-muted-foreground">R$</span>
          <input
            id="weekly"
            inputMode="decimal"
            placeholder="0"
            maxLength={10}
            value={raw}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "weekly-erro" : undefined}
            onChange={(e) => setRaw(e.target.value.replace(/[^0-9,.]/g, ""))}
            className="tabular w-full bg-transparent py-3 text-2xl font-semibold text-navy outline-none placeholder:text-muted-foreground"
          />
        </div>
        {error && (
          <p id="weekly-erro" className="mt-2 text-sm font-medium text-destructive">
            {error}
          </p>
        )}
        <div className="mt-3 grid grid-cols-4 gap-2" aria-label="Valores rápidos">
          {[20, 50, 100, 200].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => quickPick(v)}
              aria-pressed={weekly === v}
              className={cn(
                "tabular min-h-11 rounded-full border text-sm font-semibold transition-colors",
                weekly === v
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
          className="mt-5 h-12 w-full rounded-full bg-teal-deep text-base font-semibold text-white hover:bg-teal-ink"
        >
          Ver o que pode virar
        </Button>
      </form>
      </div>

      <div className="lg:col-span-7">
      {weekly === null && (
        <div className="hidden h-full min-h-[26rem] flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-border px-10 text-center lg:flex">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-gold-soft text-gold-deep">
            <PiggyBank className="h-7 w-7" />
          </span>
          <p className="mt-5 max-w-[32ch] text-lg leading-relaxed text-navy">
            Escolha um valor ao lado e veja o que ele pode virar em 5 anos.
          </p>
                  </div>
      )}
      {weekly !== null && (
        <div className="rise-in" key={weekly}>
          {/* A revelação */}
          <section
            aria-live="polite"
            className="relative mt-10 overflow-hidden rounded-[1.75rem] bg-teal-ink p-6 text-white shadow-soft lg:mt-0 lg:rounded-[2.25rem] lg:p-10"
          >
            <p className="text-[0.95rem] text-white/85 lg:text-lg">
              Em 5 anos sem apostar, você teria
            </p>
            <p className="tabular mt-2 text-[2.75rem] font-semibold leading-none tracking-[-0.03em] lg:mt-3 lg:text-[5rem] lg:tracking-[-0.045em]">
              {brl(Math.round(shown))}
            </p>
            <p className="mt-5 max-w-[46ch] text-[0.95rem] leading-relaxed text-white lg:mt-6 lg:text-lg">
              Só no primeiro ano, <strong className="tabular">{brl(yearAmount)}</strong>{" "}
              já pode virar {dreamFor(yearAmount)}
            </p>
            <a
              href="#minhas-apostas"
              className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-teal-ink transition-colors hover:bg-teal-soft"
            >
              Criar uma aposta no futuro
              <ArrowDown className="h-4 w-4" />
            </a>
          </section>

          {/* Linha do tempo */}
          <section className="mt-8" aria-labelledby="tempo-titulo">
            <h2 id="tempo-titulo" className="text-lg font-semibold text-navy">
              Ao longo do tempo
            </h2>
            <ul className="mt-4 space-y-3">
              {rows.map((r) => (
                <li key={r.key} className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-3">
                  <span className="text-sm text-muted-foreground">{r.label}</span>
                  <span className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <span
                      className="block h-full rounded-full bg-teal transition-[width] duration-700 ease-out"
                      style={{ width: `${max ? Math.max(4, (r.saved / max) * 100) : 0}%` }}
                    />
                  </span>
                  <span className="tabular text-right text-sm font-semibold text-navy">
                    {brl(r.saved)}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <details className="group mt-6 rounded-2xl border border-border bg-card">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-2 px-4 text-sm font-semibold text-navy">
              <span className="flex items-center gap-2">
                <Info className="h-4 w-4 text-teal-deep" />
                Como calculamos
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <div className="space-y-2 px-4 pb-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Multiplicamos o valor por 52 semanas por ano, sem juros. Serve
                para dar noção de grandeza, não como previsão.
              </p>
              <p>
                Se você guardasse cerca de <strong className="tabular text-navy">{brl(monthly)}</strong>{" "}
                por mês rendendo uns 0,8% ao mês, em 5 anos seriam por volta de{" "}
                <strong className="tabular text-navy">{brl(fv5y)}</strong>.
              </p>
              <p>
                Projeção educativa: não é promessa de rendimento nem
                recomendação de investimento. Este app não oferece consultoria
                financeira.
              </p>
            </div>
          </details>
        </div>
      )}
      </div>
      </div>

      <MinhasApostas weekly={weekly} suggestedTarget={weekly !== null ? weekly * 52 : 0} />
    </AppShell>
  );
}
