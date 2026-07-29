import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Share2, Sparkles, Trophy, Lock, Download } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil | Aposta no Futuro" },
      {
        name: "description",
        content:
          "Seu progresso, conquistas, economia e evolução na jornada sem apostas.",
      },
      { property: "og:title", content: "Meu perfil — Aposta no Futuro" },
      {
        property: "og:description",
        content:
          "Veja sua economia, medalhas conquistadas e evolução ao longo dos dias sem apostar.",
      },
      { property: "og:url", content: "https://apostanofuturo.online/perfil" },
    ],
    links: [{ rel: "canonical", href: "https://apostanofuturo.online/perfil" }],
  }),
  component: Perfil,
});

type Profile = {
  name: string;
  firstFreeDay: string;
  onboarded: boolean;
};

type Saved = { weekly: number; calculatedAt: string } | null;

type DesafiosState = {
  completed: Record<string, boolean>;
  points: number;
  medals: number;
};

type Milestone = { days: number; label: string; emoji: string };

const MILESTONES: Milestone[] = [
  { days: 1, label: "1 dia", emoji: "🌱" },
  { days: 7, label: "1 semana", emoji: "🌿" },
  { days: 30, label: "1 mês", emoji: "⭐" },
  { days: 90, label: "3 meses", emoji: "🔥" },
  { days: 180, label: "6 meses", emoji: "💎" },
  { days: 365, label: "1 ano", emoji: "👑" },
];

const brl = (n: number) =>
  n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });

function Perfil() {
  const [profile] = useLocalStorage<Profile>("anf.profile", {
    name: "",
    firstFreeDay: "",
    onboarded: false,
  });
  const [saved] = useLocalStorage<Saved>("anf.simulador", null);
  const [desafios] = useLocalStorage<DesafiosState>("anf.desafios", {
    completed: {},
    points: 0,
    medals: 0,
  });

  const now = Date.now();
  const startMs = profile.firstFreeDay
    ? new Date(profile.firstFreeDay).getTime()
    : now;
  const elapsed = Math.max(0, now - startMs);
  const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));

  const weekly = saved?.weekly ?? 0;
  const moneySaved = Math.round((weekly * days) / 7);

  const completedCount = Object.values(desafios.completed).filter(Boolean)
    .length;
  const totalChallenges = 8;
  const challengeProgress = Math.round((completedCount / totalChallenges) * 100);

  const achieved = MILESTONES.filter((m) => days >= m.days);

  // Simple evolution chart (up to 12 evenly spaced points from start to today)
  const chartData = useMemo(() => {
    if (!profile.firstFreeDay || days < 1) {
      return [{ label: "hoje", dias: days }];
    }
    const points = Math.min(12, days + 1);
    return Array.from({ length: points }, (_, i) => {
      const d = Math.round((days * i) / (points - 1));
      return { label: `${d}d`, dias: d };
    });
  }, [profile.firstFreeDay, days]);

  const [shareOpen, setShareOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  async function handleShare() {
    const text = `Estou há ${days} ${days === 1 ? "dia" : "dias"} sem apostar 💚\nUm dia de cada vez — Aposta no Futuro.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Minha conquista", text });
        return;
      }
    } catch {
      // fall through to dialog
    }
    setShareOpen(true);
  }

  async function copyText() {
    const text = `Estou há ${days} ${days === 1 ? "dia" : "dias"} sem apostar 💚 — Aposta no Futuro.`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
  }

  return (
    <AppShell title="Perfil">
      {/* Header */}
      <section className="rounded-3xl bg-gradient-to-br from-navy to-[#0f1a2e] p-6 text-white shadow-soft">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-[#0d6b60] text-4xl leading-none text-white shadow-[inset_0_2px_6px_rgba(0,0,0,0.25)] ring-2 ring-white/10">
            <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
              {profile.name ? profile.name.charAt(0).toUpperCase() : "🌱"}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-lg font-semibold">
              {profile.name || "Você"}
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 text-sm text-white/80">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              <span>
                {days === 0
                  ? "Começando agora"
                  : `${days} ${days === 1 ? "dia" : "dias"} sem apostar`}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Money saved */}
      <section className="mt-4 overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/15 via-gold/5 to-transparent p-5 shadow-card">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-gold">
          Dinheiro que você não perdeu
        </div>
        {weekly > 0 ? (
          <>
            <div className="mt-1 text-4xl font-bold text-navy tabular-nums">
              {brl(moneySaved)}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Baseado em {brl(weekly)}/semana × {days}{" "}
              {days === 1 ? "dia" : "dias"} livres.
            </div>
          </>
        ) : (
          <>
            <div className="mt-1 text-2xl font-bold text-navy">—</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Use o Simulador para registrar quanto você apostava por semana e
              ver o valor economizado aqui.
            </div>
          </>
        )}
      </section>

      {/* Challenges */}
      <section className="mt-4 rounded-3xl bg-card p-5 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-teal">
              Desafios concluídos
            </div>
            <div className="mt-1 text-2xl font-bold text-navy tabular-nums">
              {completedCount}
              <span className="text-base font-medium text-muted-foreground">
                /{totalChallenges}
              </span>
            </div>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-full bg-teal/10 text-teal">
            <Trophy className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal to-cyan transition-all"
            style={{ width: `${challengeProgress}%` }}
          />
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          {desafios.points} pontos · {Math.floor(completedCount / 3)} medalhas
          de missão
        </div>
      </section>

      {/* Achievements */}
      <section className="mt-4">
        <h2 className="mb-3 text-sm font-semibold text-navy">
          Minhas conquistas
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {MILESTONES.map((m) => {
            const done = days >= m.days;
            return (
              <div
                key={m.days}
                className={cn(
                  "rounded-2xl border p-3 text-center transition",
                  done
                    ? "border-gold/40 bg-gradient-to-b from-gold/15 to-gold/5 shadow-card"
                    : "border-border bg-card/60",
                )}
              >
                <div
                  className={cn(
                    "mx-auto grid h-11 w-11 place-items-center rounded-full text-xl",
                    done
                      ? "bg-gold text-gold-foreground shadow-soft"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {done ? m.emoji : <Lock className="h-4 w-4" />}
                </div>
                <div
                  className={cn(
                    "mt-2 text-[11px] font-semibold",
                    done ? "text-navy" : "text-muted-foreground",
                  )}
                >
                  {m.label}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          {achieved.length} de {MILESTONES.length} marcos conquistados.
        </div>
      </section>

      {/* Evolution chart */}
      <section className="mt-4 rounded-3xl bg-card p-5 shadow-card">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-navy">Sua evolução</h2>
          <span className="text-xs text-muted-foreground">
            dias livres ao longo do tempo
          </span>
        </div>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 8, left: -12, bottom: 0 }}
            >
              <defs>
                <linearGradient id="perfilArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16BFAC" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="#16BFAC" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#7280A0" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#7280A0" }}
                tickLine={false}
                axisLine={false}
                width={28}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  fontSize: 12,
                }}
                formatter={(v: number) => [`${v} dias`, "Livre"]}
                labelFormatter={() => ""}
              />
              <Area
                type="monotone"
                dataKey="dias"
                stroke="#16BFAC"
                strokeWidth={2.5}
                fill="url(#perfilArea)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Share */}
      <section className="mt-5">
        <Button
          onClick={handleShare}
          className="w-full rounded-full bg-magenta py-6 text-base font-semibold text-white shadow-soft transition-all duration-200 hover:bg-[#d11570]"
        >
          <Share2 className="mr-2 h-5 w-5" />
          Compartilhar minha conquista
        </Button>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Você escolhe se quer compartilhar. Nada é publicado sem você tocar aqui.
        </p>
      </section>

      {/* Share card dialog */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="max-w-sm rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-center text-navy">
              Sua conquista
            </DialogTitle>
            <DialogDescription className="text-center">
              Faça uma captura de tela pra compartilhar com quem você quiser.
            </DialogDescription>
          </DialogHeader>

          <div
            ref={cardRef}
            className="relative mx-auto mt-2 aspect-[4/5] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-[#173154] to-teal p-6 text-white shadow-soft"
          >
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-magenta/30 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-gold/25 blur-3xl" />

            <div className="relative flex h-full flex-col">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest opacity-90">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                Aposta no Futuro
              </div>

              <div className="mt-auto">
                <div className="text-sm opacity-90">Estou há</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-7xl font-bold leading-none tabular-nums text-gold">
                    {days}
                  </span>
                  <span className="text-lg font-semibold">
                    {days === 1 ? "dia" : "dias"}
                  </span>
                </div>
                <div className="mt-1 text-lg font-semibold">sem apostar 💚</div>
                {weekly > 0 && moneySaved > 0 && (
                  <div className="mt-4 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs backdrop-blur">
                    Já não perdi {brl(moneySaved)}
                  </div>
                )}
                <div className="mt-6 text-[11px] uppercase tracking-widest opacity-70">
                  Um dia de cada vez.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <Button
              variant="outline"
              onClick={copyText}
              className="flex-1 rounded-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Copiar texto
            </Button>
            <Button
              onClick={() => setShareOpen(false)}
              className="flex-1 rounded-full bg-teal text-teal-foreground transition-all duration-200 hover:bg-[#14ac9b]"
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
