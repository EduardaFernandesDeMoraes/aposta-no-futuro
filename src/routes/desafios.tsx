import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Check, Trophy, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/desafios")({
  head: () => ({
    meta: [
      { title: "Desafios | Aposta no Futuro" },
      {
        name: "description",
        content:
          "Missões pra fortalecer novos hábitos e celebrar cada conquista da sua jornada.",
      },
      { property: "og:title", content: "Desafios — Aposta no Futuro" },
      {
        property: "og:description",
        content:
          "Missões diárias pra fortalecer novos hábitos e celebrar cada passo sem apostar.",
      },
      { property: "og:url", content: "https://apostanofuturo.online/desafios" },
    ],
    links: [{ rel: "canonical", href: "https://apostanofuturo.online/desafios" }],
  }),
  component: Desafios,
});

type Challenge = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  points: number;
};

const CHALLENGES: Challenge[] = [
  {
    id: "sem-apps-24h",
    emoji: "📵",
    title: "24 horas sem apps de aposta",
    description: "Fique um dia inteiro sem abrir nenhum app ou site de bet.",
    points: 20,
  },
  {
    id: "cofrinho-virtual",
    emoji: "🐷",
    title: "Cofrinho virtual",
    description:
      "Cada vez que pensar em apostar hoje, anote o valor num cofrinho (papel, notas do celular ou planilha).",
    points: 10,
  },
  {
    id: "use-simulador",
    emoji: "📊",
    title: "Descubra quanto já economizou",
    description:
      "Use o Simulador do app e veja quanto você deixou de perder esta semana.",
    points: 10,
  },
  {
    id: "conte-alguem",
    emoji: "🤝",
    title: "Conte pra alguém de confiança",
    description:
      "Compartilhe seu objetivo com uma pessoa que te apoia. Falar em voz alta fortalece.",
    points: 25,
  },
  {
    id: "lista-3-sonhos",
    emoji: "✨",
    title: "3 coisas com o dinheiro que não apostou",
    description:
      "Liste 3 coisas concretas que você faria com o dinheiro guardado. Sonhar dá direção.",
    points: 15,
  },
  {
    id: "30min-bem",
    emoji: "🎧",
    title: "30 minutos que te fazem bem",
    description:
      "Esporte, música, uma conversa boa, um passeio. Escolha algo que te alimente por dentro.",
    points: 15,
  },
  {
    id: "agua-sono",
    emoji: "💧",
    title: "Água + sono cedo hoje",
    description:
      "Beba mais água ao longo do dia e tente dormir 30 minutos mais cedo. Corpo cuidado, cabeça mais leve.",
    points: 10,
  },
  {
    id: "gatilho-mapeado",
    emoji: "🧭",
    title: "Mapeie um gatilho",
    description:
      "Anote uma situação, horário ou emoção que costuma te levar à aposta. Reconhecer é o primeiro passo.",
    points: 15,
  },
];

type DesafiosState = {
  completed: Record<string, boolean>;
  points: number;
  medals: number;
};

const INITIAL: DesafiosState = { completed: {}, points: 0, medals: 0 };

function Desafios() {
  const [state, setState] = useLocalStorage<DesafiosState>(
    "anf.desafios",
    INITIAL,
  );


  const completedCount = useMemo(
    () => Object.values(state.completed).filter(Boolean).length,
    [state.completed],
  );
  const total = CHALLENGES.length;
  const progress = Math.round((completedCount / total) * 100);

  // Marcos das medalhas: a cada 3 desafios + uma final ao completar todos.
  const milestones = useMemo(() => {
    const marks: number[] = [];
    for (let n = 3; n < total; n += 3) marks.push(n);
    marks.push(total);
    return marks;
  }, [total]);

  const earnedMedals = milestones.filter((m) => completedCount >= m).length;
  const allDone = completedCount === total && total > 0;

  const prevMedals = useRef(state.medals);
  useEffect(() => {
    if (earnedMedals > prevMedals.current) {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.3 },
        colors: ["#F5A623", "#16BFAC", "#E8197E", "#1CA0D8"],
      });
      setState((s) => ({ ...s, medals: earnedMedals }));
    }
    prevMedals.current = earnedMedals;
  }, [earnedMedals, setState]);

  const toggle = (c: Challenge) => {
    setState((s) => {
      const wasDone = !!s.completed[c.id];
      const completed = { ...s.completed, [c.id]: !wasDone };
      const points = Math.max(0, s.points + (wasDone ? -c.points : c.points));
      return { ...s, completed, points };
    });
  };

  return (
    <AppShell title="Desafios">
      <div className="space-y-6 pb-6">
        {/* Progresso */}
        <section className="rounded-3xl bg-gradient-to-br from-[#16BFAC] to-[#1CA0D8] p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm/5 opacity-90">Seu progresso</p>
              <p className="mt-1 text-3xl font-bold">
                {completedCount}
                <span className="text-lg font-medium opacity-80">
                  {" "}
                  / {total}
                </span>
              </p>
              <p className="mt-1 text-sm opacity-90">
                {state.points} pontos conquistados
              </p>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-2">
              <Trophy className="h-5 w-5 text-[#F5A623]" />
              <span className="text-sm font-semibold">
                {earnedMedals} {earnedMedals === 1 ? "medalha" : "medalhas"}
              </span>
            </div>
          </div>

          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Medalhas por trio */}
          <div className="mt-4 flex items-center gap-2">
            {milestones.map((m, i) => {
              const unlocked = completedCount >= m;
              return (
                <div
                  key={m}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 text-lg transition",
                    unlocked
                      ? "border-[#F5A623] bg-[#F5A623] text-white shadow"
                      : "border-white/40 bg-white/10 text-white/60",
                  )}
                  title={
                    unlocked
                      ? `Medalha ${i + 1} conquistada`
                      : `Complete ${m} desafios`
                  }
                >
                  🏅
                </div>
              );
            })}
          </div>

          <p className="mt-3 flex items-center gap-1 text-xs opacity-90">
            <Sparkles className="h-3.5 w-3.5" />
            Medalhas a cada 3 desafios — e uma dourada ao completar todos.
          </p>

          {allDone && (
            <p className="mt-3 rounded-2xl bg-white/15 px-3 py-2 text-sm font-semibold">
              🎉 Você completou todos os desafios. Isso é muito!
            </p>
          )}
        </section>

        {/* Lista */}
        <section className="space-y-3">
          <h2 className="px-1 text-sm font-semibold text-[#16233C]">
            Missões pra hoje
          </h2>

          {CHALLENGES.map((c) => {
            const done = !!state.completed[c.id];
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggle(c)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition active:scale-[0.99]",
                  done
                    ? "border-[#16BFAC]/40 bg-[#16BFAC]/5"
                    : "border-slate-200 bg-white hover:border-[#16BFAC]/40",
                )}
              >
                <div
                  className={cn(
                    "flex h-6 w-6 flex-none items-center justify-center rounded-md border-2 transition",
                    done
                      ? "border-[#16BFAC] bg-[#16BFAC] text-white"
                      : "border-slate-300 bg-white",
                  )}
                  aria-hidden
                >
                  {done && <Check className="h-4 w-4" strokeWidth={3} />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl leading-none">{c.emoji}</span>
                    <h3
                      className={cn(
                        "text-base font-semibold text-[#16233C]",
                        done && "line-through opacity-60",
                      )}
                    >
                      {c.title}
                    </h3>
                  </div>
                  <p
                    className={cn(
                      "mt-1 text-sm text-slate-600",
                      done && "opacity-70",
                    )}
                  >
                    {c.description}
                  </p>
                  <span
                    className={cn(
                      "mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                      done
                        ? "bg-[#16BFAC]/15 text-[#0f8577]"
                        : "bg-[#F5A623]/15 text-[#a06a04]",
                    )}
                  >
                    +{c.points} pts
                  </span>
                </div>
              </button>
            );
          })}
        </section>

        <p className="px-2 text-center text-xs text-slate-500">
          Vá no seu ritmo. Cada missão marcada é um passo real. 💚
        </p>
      </div>
    </AppShell>
  );
}
