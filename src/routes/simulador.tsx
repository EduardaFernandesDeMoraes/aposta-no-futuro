import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { Calculator, Sparkles, Info, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";

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
  { key: "6m", label: "Em 6 meses", weeks: 26, months: 6 },
  { key: "1a", label: "Em 1 ano", weeks: 52, months: 12 },
  { key: "3a", label: "Em 3 anos", weeks: 156, months: 36 },
  { key: "5a", label: "Em 5 anos", weeks: 260, months: 60 },
] as const;

const BAR_COLORS = ["#1CA0D8", "#16BFAC", "#E8197E", "#F5A623"];

const brl = (n: number) =>
  n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });

// Future value of monthly deposits at rate r for n months
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

type Saved = { weekly: number; calculatedAt: string };

function Simulador() {
  const [saved, setSaved] = useLocalStorage<Saved | null>(
    "anf.simulador",
    null,
  );
  const [raw, setRaw] = useState<string>(
    saved ? String(saved.weekly).replace(".", ",") : "",
  );
  const [weekly, setWeekly] = useState<number | null>(
    saved ? saved.weekly : null,
  );
  const [error, setError] = useState<string | null>(null);

  function handleCalc(e: React.FormEvent) {
    e.preventDefault();
    const num = Number(raw.replace(/\./g, "").replace(",", "."));
    const result = weeklySchema.safeParse(num);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Valor inválido");
      setWeekly(null);
      return;
    }
    setError(null);
    setWeekly(result.data);
    setSaved({ weekly: result.data, calculatedAt: new Date().toISOString() });
  }

  const rows = weekly !== null
    ? PERIODS.map((p, i) => ({
        ...p,
        saved: weekly * p.weeks,
        color: BAR_COLORS[i],
      }))
    : [];

  const monthly = weekly !== null ? weekly * (52 / 12) : 0;
  const fv1y = weekly !== null ? fvMonthlyDeposits(monthly, 12) : 0;
  const fv5y = weekly !== null ? fvMonthlyDeposits(monthly, 60) : 0;
  const yearAmount = weekly !== null ? weekly * 52 : 0;

  return (
    <AppShell title="Simulador">
      {/* Intro */}
      <div className="rounded-3xl bg-gradient-to-br from-navy to-[#0f1a2c] p-5 text-white shadow-soft">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider opacity-90">
          <Calculator className="h-4 w-4" />
          Simulador de economia
        </div>
        <p className="mt-2 text-sm opacity-95">
          Veja quanto dinheiro volta pro seu bolso quando você não aposta.
        </p>
      </div>

      {/* Input */}
      <form
        onSubmit={handleCalc}
        className="mt-4 rounded-3xl bg-card p-5 shadow-card"
      >
        <label htmlFor="weekly" className="block text-sm font-semibold text-navy">
          Quanto você costumava apostar por semana?
        </label>
        <div className="mt-2 flex items-center gap-2 rounded-2xl border border-border bg-background px-4 focus-within:border-teal">
          <span className="text-sm font-semibold text-muted-foreground">R$</span>
          <input
            id="weekly"
            inputMode="decimal"
            placeholder="0,00"
            maxLength={10}
            value={raw}
            onChange={(e) => setRaw(e.target.value.replace(/[^0-9,.]/g, ""))}
            className="w-full bg-transparent py-3 text-base outline-none tabular-nums"
          />
        </div>
        {error && (
          <p className="mt-2 text-xs font-medium text-destructive">{error}</p>
        )}
        <Button
          type="submit"
          className="mt-4 h-12 w-full rounded-full bg-teal text-base font-semibold text-teal-foreground transition-all duration-200 hover:bg-[#14ac9b]"
        >
          Calcular
        </Button>
      </form>

      {weekly !== null && (
        <div className="animate-fade-in">
          {/* Result cards */}
          <section className="mt-6">
            <h2 className="mb-3 text-sm font-semibold text-navy">
              Quanto você deixa de perder
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {rows.map((r, i) => (
                <div
                  key={r.key}
                  className={cn(
                    "rounded-2xl border border-border bg-card p-4 shadow-card",
                  )}
                >
                  <div
                    className="h-1 w-8 rounded-full"
                    style={{ backgroundColor: r.color }}
                  />
                  <div className="mt-2 text-xs font-medium text-muted-foreground">
                    {r.label}
                  </div>
                  <div className="mt-1 text-xl font-bold text-navy tabular-nums">
                    {brl(r.saved)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Chart */}
          <section className="mt-6 rounded-3xl bg-card p-4 shadow-card">
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-teal" />
              <h2 className="text-sm font-semibold text-navy">
                Seu dinheiro ao longo do tempo
              </h2>
            </div>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={rows.map((r) => ({
                    name: r.label.replace("Em ", ""),
                    valor: Math.round(r.saved),
                    color: r.color,
                  }))}
                  margin={{ top: 10, right: 8, left: -12, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e3e8ef" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#5b6b83" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#5b6b83" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) =>
                      v >= 1000 ? `${Math.round(v / 1000)}k` : String(v)
                    }
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(22,191,172,0.08)" }}
                    formatter={(v: number) => [brl(v), "Economia"]}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #e3e8ef",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="valor" radius={[8, 8, 0, 0]}>
                    {rows.map((r) => (
                      <Cell key={r.key} fill={r.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Compound scenario */}
          <section className="mt-6 rounded-3xl bg-gradient-to-br from-cyan to-[#0f7fb0] p-5 text-white shadow-soft">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider opacity-90">
              <Sparkles className="h-4 w-4" />E se você guardasse?
            </div>
            <p className="mt-2 text-sm opacity-95">
              Depositando{" "}
              <strong className="tabular-nums">{brl(monthly)}</strong> por mês,
              rendendo cerca de 0,8% ao mês:
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
                <div className="text-[11px] opacity-90">Em 1 ano</div>
                <div className="mt-1 text-lg font-bold tabular-nums">
                  {brl(fv1y)}
                </div>
              </div>
              <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
                <div className="text-[11px] opacity-90">Em 5 anos</div>
                <div className="mt-1 text-lg font-bold tabular-nums">
                  {brl(fv5y)}
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-white/10 p-3 text-[11px] leading-snug opacity-95">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                Estimativa educativa. Não é promessa de rendimento nem
                recomendação de investimento.
              </span>
            </div>
          </section>

          {/* Motivational message */}
          <section className="mt-6 rounded-3xl border border-magenta/20 bg-magenta/5 p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-magenta">
              Isso pode virar
            </div>
            <p className="mt-2 text-sm leading-relaxed text-navy">
              Em 1 ano,{" "}
              <strong className="tabular-nums">{brl(yearAmount)}</strong> pode
              ser {dreamFor(yearAmount)}
            </p>
          </section>

          <p className="mt-4 text-center text-[11px] text-muted-foreground">
            Conteúdo educativo. Este app não oferece consultoria financeira.
          </p>
        </div>
      )}
    </AppShell>
  );
}
