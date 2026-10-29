import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowLeft,
  Download,
  Eye,
  HeartHandshake,
  Lock,
  LogOut,
  PiggyBank,
  ShieldCheck,
  Users,
  ClipboardCheck,
  Info,
} from "lucide-react";
import logoMark from "@/assets/logo-maos-coracao.svg.asset.json";
import { BrandLockup } from "@/components/brand-lockup";
import { Button } from "@/components/ui/button";
import { PARTNERS, findPartner, type Partner } from "@/lib/partners";
import { CAMPUS_SESSION_KEY } from "@/lib/access";
import { track, EVENTS } from "@/lib/analytics";

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
  const [partnerCode, setPartnerCode] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPartnerCode(readSession());
    setReady(true);
  }, []);

  const partner = findPartner(partnerCode);

  if (!ready) return <div className="min-h-dvh bg-background" />;

  return partner ? (
    <Dashboard
      partner={partner}
      onLogout={() => {
        try {
          window.sessionStorage.removeItem(CAMPUS_SESSION_KEY);
        } catch {
          /* ignore */
        }
        setPartnerCode(null);
      }}
    />
  ) : (
    <Login
      onEnter={(code) => {
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
/* Tela 1B · Login                                                     */
/* ------------------------------------------------------------------ */

function Login({ onEnter }: { onEnter: (code: string) => void }) {
  const [code, setCode] = useState(PARTNERS[0].code);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Informe um e-mail corporativo válido.");
      return;
    }
    if (password.length < 4) {
      setError("Informe sua senha de acesso.");
      return;
    }
    // Ambiente de demonstração: nenhuma credencial é enviada ou armazenada.
    setPassword("");
    onEnter(code);
  }

  const selected = findPartner(code);

  return (
    <div className="min-h-dvh bg-background">
      <header className="bg-navy text-white shadow-soft">
        <div className="mx-auto flex min-h-14 max-w-md items-center gap-2 px-4 py-2 sm:max-w-[1100px]">
          <img src={logoMark.url} alt="" aria-hidden="true" className="h-7 w-7" />
          <BrandLockup product="Campus" as="p" />
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 pb-12 pt-8">
        <Link
          to="/acesso"
          className="-ml-1 inline-flex items-center gap-1 rounded-full px-1 py-1 text-xs font-semibold text-navy/80 hover:text-navy"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
        <h1 className="mt-3 text-2xl font-bold leading-tight text-navy">
          Acesso Gestor — AF Campus
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Selecione sua instituição e insira suas credenciais corporativas:
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4 rounded-3xl bg-card p-5 shadow-card">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy">Instituição</span>
            <select
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-base outline-none focus:border-teal md:text-sm"
            >
              {PARTNERS.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy">E-mail corporativo</span>
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              placeholder={`nome@${selected?.emailDomain ?? "instituicao.edu.br"}`}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-base outline-none focus:border-teal md:text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy">Senha de acesso</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-base outline-none focus:border-teal md:text-sm"
            />
          </label>
          {error && <p className="text-xs font-medium text-destructive">{error}</p>}
          <Button
            type="submit"
            className="h-12 w-full rounded-full bg-navy text-base font-semibold text-white hover:bg-[#0f1a2c]"
          >
            <Lock className="mr-1.5 h-4 w-4" /> Entrar no Painel AF Campus
          </Button>
        </form>

        <div className="mt-4 flex items-start gap-3 rounded-2xl bg-[#F5A623]/15 p-4">
          <Info className="mt-0.5 h-5 w-5 flex-none text-[#8a5a00]" />
          <p className="text-xs leading-snug text-[#5c3a00]">
            <strong>Ambiente de demonstração.</strong> O AF Campus está em fase piloto: nenhuma
            credencial é enviada ou armazenada, e o painel exibe dados fictícios.
          </p>
        </div>
      </main>
    </div>
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
      { name: "Risco baixo", value: r(22, 28), color: "#1CA0D8" },
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

function Dashboard({ partner, onLogout }: { partner: Partner; onLogout: () => void }) {
  const d = useDemoData(partner);

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
      tone: "bg-teal/10 text-[#0d6b60]",
    },
    {
      icon: Eye,
      label: "Usos de ferramentas",
      value: d.tools.toLocaleString("pt-BR"),
      tone: "bg-cyan/10 text-[#0f6f99]",
    },
    {
      icon: ClipboardCheck,
      label: "Autoavaliações concluídas",
      value: d.assessments.toLocaleString("pt-BR"),
      tone: "bg-magenta/10 text-magenta",
    },
    {
      icon: HeartHandshake,
      label: "Acessos aos canais de ajuda",
      value: d.help.toLocaleString("pt-BR"),
      tone: "bg-coral/10 text-[#c2392c]",
    },
  ];

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-30 bg-navy text-white shadow-soft">
        <div className="mx-auto flex min-h-14 max-w-[1100px] items-center justify-between gap-3 px-4 py-2">
          <div className="flex min-w-0 items-center gap-2">
            <img src={logoMark.url} alt="" aria-hidden="true" className="h-7 w-7" />
            <BrandLockup product="Campus" partner={partner.shortName} as="h1" />
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/acesso"
              className="hidden rounded-full px-3 py-2 text-xs font-semibold text-white/80 hover:text-white sm:inline"
            >
              Alterar perfil
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-white/15"
            >
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px] px-4 pb-16 pt-5">
        <div className="flex items-start gap-3 rounded-2xl bg-[#E1F5EE] p-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-[#0d6b60]" strokeWidth={2.4} />
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

        <div className="mt-3 rounded-2xl border-2 border-dashed border-[#F5A623] bg-[#F5A623]/10 px-4 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-[#8a5a00]">
          Demonstração — dados fictícios
        </div>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#0d6b60]">
              {partner.name}
            </p>
            <h2 className="text-xl font-bold text-navy sm:text-2xl">Visão geral do mês</h2>
          </div>
          <Button
            onClick={exportReport}
            className="h-11 rounded-full bg-navy px-5 text-sm font-semibold text-white hover:bg-[#0f1a2c]"
          >
            <Download className="mr-1.5 h-4 w-4" />
            Exportar Relatório ESG / Assistência Estudantil
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
          <section className="rounded-3xl bg-card p-5 shadow-card lg:col-span-3">
            <h3 className="text-sm font-semibold text-navy">Engajamento no campus por semana</h3>
            <p className="text-xs text-muted-foreground">Acessos ao AF People vindos da campanha</p>
            <div className="mt-3 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={d.weeks} margin={{ top: 10, right: 12, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e3e8ef" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#5b6b83" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#5b6b83" }}
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
                    stroke="#16BFAC"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-3xl bg-card p-5 shadow-card lg:col-span-2">
            <h3 className="text-sm font-semibold text-navy">
              Autoavaliação (PGSI) — distribuição agregada
            </h3>
            <p className="text-xs text-muted-foreground">
              % dos estudantes que concluíram a triagem
            </p>
            <div className="mt-3 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={d.pgsi}
                  layout="vertical"
                  margin={{ top: 0, right: 28, left: 8, bottom: 0 }}
                >
                  <XAxis type="number" hide domain={[0, 100]} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={104}
                    tick={{ fontSize: 11, fill: "#16233c" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(v: number) => [`${v}%`, "Estudantes"]}
                    contentStyle={{ borderRadius: 12, border: "1px solid #e3e8ef", fontSize: 12 }}
                  />
                  <Bar
                    dataKey="value"
                    radius={[0, 8, 8, 0]}
                    label={{
                      position: "right",
                      fontSize: 11,
                      fill: "#16233c",
                      formatter: (v: number) => `${v}%`,
                    }}
                  >
                    {d.pgsi.map((p) => (
                      <Cell key={p.name} fill={p.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Triagem, não diagnóstico. Serve para planejar ações preventivas.
            </p>
          </section>
        </div>

        <section className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-navy p-5 text-white shadow-soft">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10">
              <PiggyBank className="h-5 w-5 text-[#0AF0FB]" />
            </span>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-[#0AF0FB]">
              Metas financeiras simbólicas acumuladas
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums">{brl(d.goalsValue)}</p>
            <p className="mt-1 text-sm text-white/75">
              planejados em {d.goals} “apostas no futuro” criadas pelos estudantes.
            </p>
          </div>
          <div className="rounded-3xl bg-card p-5 shadow-card">
            <h3 className="text-sm font-semibold text-navy">Canais de apoio divulgados no app</h3>
            <ul className="mt-3 space-y-2">
              {partner.channels.map((c) => (
                <li key={c.label} className="rounded-2xl bg-background px-3 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#0d6b60]">
                    {c.label}
                  </p>
                  <p className="truncate text-sm text-navy">{c.detail}</p>
                </li>
              ))}
              <li className="rounded-2xl bg-coral/10 px-3 py-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#c2392c]">
                  Crise
                </p>
                <p className="text-sm text-navy">CVV 188 · 24h, gratuito e sigiloso</p>
              </li>
            </ul>
          </div>
        </section>

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          AF Campus · Aposta no Futuro. Os estudantes usam o AF People de forma gratuita e anônima;
          a instituição vê apenas indicadores agregados.
        </p>
      </main>
    </div>
  );
}
