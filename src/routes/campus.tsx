import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Download,
  Eye,
  HeartHandshake,
  LogOut,
  PiggyBank,
  ShieldCheck,
  Users,
  ClipboardCheck,
} from "lucide-react";
import logoMark from "@/assets/logo-maos-coracao.svg";
import { BrandLockup } from "@/components/brand-lockup";
import { Button } from "@/components/ui/button";
import { PARTNERS, findPartner, type Partner } from "@/lib/partners";
import { CAMPUS_SESSION_KEY } from "@/lib/access";
import { track, EVENTS } from "@/lib/analytics";
import { playProductSwitch } from "@/lib/product-switch";

export const Route = createFileRoute("/campus")({
  head: () => ({
    meta: [
      { title: "AF Campus | Painel institucional — Aposta no Futuro" },
      {
        name: "description",
        content:
          "Painel institucional do Aposta no Futuro com indicadores agregados e anônimos de campanhas de prevenção.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CampusRoute,
});

function readSession(): string | null {
  try {
    return window.sessionStorage.getItem(CAMPUS_SESSION_KEY);
  } catch {
    return null;
  }
}

function CampusRoute() {
  // Sem login: o painel abre direto (demonstração com dados fictícios).
  // A instituição escolhida fica só nesta aba (sessionStorage).
  const [partnerCode, setPartnerCode] = useState<string>(PARTNERS[0].code);

  useEffect(() => {
    const saved = readSession();
    if (saved && findPartner(saved)) setPartnerCode(saved);
  }, []);

  const partner = findPartner(partnerCode) ?? PARTNERS[0];

  return (
    <Dashboard
      partner={partner}
      onChangePartner={(code) => {
        try {
          window.sessionStorage.setItem(CAMPUS_SESSION_KEY, code);
        } catch {
          /* ignore */
        }
        setPartnerCode(code);
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Tela 2B · Dashboard (dados fictícios)                               */
/* ------------------------------------------------------------------ */

function seeded(code: string) {
  let h = 0;
  for (const ch of code) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return (min: number, max: number) => {
    h = (h * 1103515245 + 12345) >>> 0;
    return Math.round(min + ((h % 1000) / 1000) * (max - min));
  };
}

function useDemoData(partner: Partner) {
  return useMemo(() => {
    const r = seeded(partner.code);
    const students = r(320, 520);
    const weeks = ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6", "Sem 7", "Sem 8"].map(
      (name, i) => ({ name, acessos: r(30, 60) + i * r(4, 9) }),
    );
    const pgsi = [
      { name: "Sem risco", value: r(48, 56), color: "#16BFAC" },
      { name: "Risco baixo", value: r(22, 28), color: "#0D6B60" },
      { name: "Risco moderado", value: r(12, 16), color: "#F5A623" },
    ];
    pgsi.push({
      name: "Risco alto",
      value: 100 - pgsi.reduce((a, b) => a + b.value, 0),
      color: "#FF5B4C",
    });
    return {
      students,
      tools: r(1100, 1600),
      assessments: r(110, 170),
      help: r(30, 60),
      goals: r(80, 130),
      goalsValue: r(140, 220) * 1000,
      weeks,
      pgsi,
    };
  }, [partner.code]);
}

const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function Dashboard({
  partner,
  onChangePartner,
}: {
  partner: Partner;
  onChangePartner: (code: string) => void;
}) {
  const d = useDemoData(partner);
  const navigate = useNavigate();
  const narrow = useIsMobile();

  useEffect(() => {
    track(EVENTS.campusDashboardView);
  }, []);

  function exportReport() {
    const rows = [
      ["Relatório AF Campus — DEMONSTRAÇÃO (dados fictícios)"],
      ["Instituição", partner.name],
      ["Gerado em", new Date().toLocaleString("pt-BR")],
      [],
      ["Indicador", "Valor"],
      ["Estudantes que acessaram no mês", String(d.students)],
      ["Usos de ferramentas", String(d.tools)],
      ["Autoavaliações concluídas", String(d.assessments)],
      ["Acessos aos canais de ajuda", String(d.help)],
      ["Apostas no futuro criadas", String(d.goals)],
      ["Metas financeiras simbólicas acumuladas (R$)", String(d.goalsValue)],
      [],
      ["Distribuição agregada da autoavaliação (PGSI)", "%"],
      ...d.pgsi.map((p) => [p.name, String(p.value)]),
      [],
      ["Nota", "Dados agregados e anônimos. Nenhuma informação individual é coletada."],
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";"))
      .join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `af-campus-${partner.code.toLowerCase()}-relatorio-demo.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const kpis = [
    {
      icon: Users,
      label: "Estudantes que acessaram no mês",
      value: d.students.toLocaleString("pt-BR"),
      tone: "bg-teal/10 text-teal-deep",
    },
    {
      icon: Eye,
      label: "Usos de ferramentas",
      value: d.tools.toLocaleString("pt-BR"),
      tone: "bg-teal-soft text-[#0f6f99]",
    },
    {
      icon: ClipboardCheck,
      label: "Autoavaliações concluídas",
      value: d.assessments.toLocaleString("pt-BR"),
      tone: "bg-teal-soft text-teal-deep",
    },
    {
      icon: HeartHandshake,
      label: "Acessos aos canais de ajuda",
      value: d.help.toLocaleString("pt-BR"),
      tone: "bg-coral-soft text-[#c2392c]",
    },
  ];

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-30 bg-navy text-white shadow-soft">
        <div className="mx-auto flex min-h-14 max-w-[1100px] items-center justify-between gap-3 px-4 py-2">
          <div className="flex min-w-0 items-center gap-2">
            <img src={logoMark} alt="" aria-hidden="true" className="h-7 w-7" />
            <BrandLockup product="Campus" tone="dark" partner={narrow ? undefined : partner.shortName} as="h1" />
          </div>
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="campus-instituicao">
              Instituição
            </label>
            <select
              id="campus-instituicao"
              value={partner.code}
              onChange={(e) => onChangePartner(e.target.value)}
              className="h-11 max-w-[9.5rem] cursor-pointer rounded-full border border-white/20 bg-white/10 px-3 text-sm font-semibold text-white outline-none hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/60 sm:max-w-none"
            >
              {PARTNERS.map((p) => (
                <option key={p.code} value={p.code} className="text-navy">
                  {p.shortName}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => void playProductSwitch("People", () => navigate({ to: "/acesso" }))}
              className="inline-flex h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair do Campus</span>
              <span className="sr-only sm:hidden">Sair do Campus</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px] px-4 pb-16 pt-5">
        <div className="flex items-start gap-3 rounded-2xl bg-teal-soft p-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-teal-deep" strokeWidth={2.4} />
          <div>
            <p className="text-sm font-semibold text-navy">
              Painel de Indicadores Agregados — Proteção Total de Dados (LGPD)
            </p>
            <p className="mt-0.5 text-xs text-navy/75">
              Nenhum nome, e-mail, matrícula ou resposta individual é exibido. Faixas com menos de
              10 estudantes são ocultadas.
            </p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border-2 border-dashed border-[#F5A623] bg-gold-soft px-4 py-2.5 text-center text-xs font-bold text-[#8a5a00]">
          Demonstração — dados fictícios
        </div>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-teal-deep">
              {partner.name}
            </p>
            <h2 className="text-xl font-bold text-navy sm:text-2xl">Visão geral do mês</h2>
          </div>
          <Button
            onClick={exportReport}
            className="h-11 w-full rounded-full bg-navy px-5 text-sm font-semibold text-white hover:bg-[#0f1a2c] sm:w-auto"
          >
            <Download className="mr-1.5 h-4 w-4" />
            <span className="sm:hidden">Exportar relatório</span>
            <span className="hidden sm:inline">Exportar Relatório ESG / Assistência Estudantil</span>
          </Button>
        </div>

        <section className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {kpis.map((k) => {
            const I = k.icon;
            return (
              <div key={k.label} className="rounded-3xl bg-card p-4 shadow-card">
                <span className={`grid h-10 w-10 place-items-center rounded-xl ${k.tone}`}>
                  <I className="h-5 w-5" />
                </span>
                <p className="mt-3 text-2xl font-bold tabular-nums text-navy sm:text-3xl">
                  {k.value}
                </p>
                <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{k.label}</p>
              </div>
            );
          })}
        </section>

        <div className="mt-4 grid gap-4 lg:grid-cols-5">
          <section className="min-w-0 rounded-3xl bg-card p-5 shadow-card lg:col-span-3 lg:p-6">
            <h3 className="font-semibold text-navy">Engajamento no campus por semana</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">Acessos ao AF People vindos da campanha</p>
            <div className="mt-5 h-64 lg:h-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={d.weeks} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
                  <CartesianGrid stroke="#e6edea" vertical={false} />
                  <XAxis
                    dataKey="name"
                    interval={0}
                    tickFormatter={(v: string) => (narrow ? v.replace("Sem ", "S") : v)}
                    tick={{ fontSize: 12, fill: "#526075" }}
                    tickMargin={10}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    width={32}
                    tickCount={5}
                    tick={{ fontSize: 12, fill: "#526075" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #e3e8ef", fontSize: 12 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="acessos"
                    name="Acessos"
                    stroke="#0D6B60"
                    strokeWidth={2.5}
                    dot={{ r: 3.5, fill: "#0D6B60", stroke: "#fff", strokeWidth: 2 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="min-w-0 rounded-3xl bg-card p-5 shadow-card lg:col-span-2 lg:p-6">
            <h3 className="font-semibold text-navy">Autoavaliação (PGSI)</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Distribuição de quem concluiu a triagem
            </p>
            <ul className="mt-5 space-y-4">
              {d.pgsi.map((p) => (
                <li key={p.name}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="text-navy">{p.name}</span>
                    <span className="tabular font-semibold text-navy">{p.value}%</span>
                  </div>
                  <div
                    className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-muted"
                    role="img"
                    aria-label={`${p.name}: ${p.value}%`}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${p.value}%`, backgroundColor: p.color }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-muted-foreground">
              Triagem, não diagnóstico. Serve para planejar ações preventivas.
            </p>
          </section>
        </div>

        <section className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="min-w-0 rounded-3xl bg-navy p-5 text-white shadow-soft">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10">
              <PiggyBank className="h-5 w-5 text-[#7fe6da]" />
            </span>
            <p className="mt-3 text-xs font-semibold text-[#7fe6da]">
              Metas financeiras simbólicas acumuladas
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums">{brl(d.goalsValue)}</p>
            <p className="mt-1 text-sm text-white/75">
              planejados em {d.goals} “apostas no futuro” criadas pelos estudantes.
            </p>
          </div>
          <div className="min-w-0 rounded-3xl bg-card p-5 shadow-card">
            <h3 className="text-sm font-semibold text-navy">Canais de apoio divulgados no app</h3>
            <ul className="mt-3 space-y-2">
              {partner.channels.map((c) => (
                <li key={c.label} className="rounded-2xl bg-background px-3 py-2">
                  <p className="text-xs font-semibold text-teal-deep">
                    {c.label}
                  </p>
                  <p className="break-words text-sm text-navy">{c.detail}</p>
                </li>
              ))}
              <li className="rounded-2xl bg-coral-soft px-3 py-2">
                <p className="text-xs font-semibold text-[#c2392c]">
                  Crise
                </p>
                <p className="text-sm text-navy">CVV 188 · 24h, gratuito e sigiloso</p>
              </li>
            </ul>
          </div>
        </section>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          AF Campus · Aposta no Futuro. Os estudantes usam o AF People de forma gratuita e anônima;
          a instituição vê apenas indicadores agregados.
        </p>
      </main>
    </div>
  );
}
