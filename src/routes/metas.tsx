import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useEffect, useState } from "react";
import {
  Calculator,
  Check,
  ChevronDown,
  Compass,
  Droplets,
  Handshake,
  Headphones,
  ListChecks,
  PhoneOff,
  PiggyBank,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/metas")({
  head: () => ({
    meta: [
      { title: "Metas | Aposta no Futuro" },
      {
        name: "description",
        content:
          "Pequenos cuidados diários para fortalecer novos hábitos, sem pressão.",
      },
      { property: "og:title", content: "Metas — Aposta no Futuro" },
      {
        property: "og:description",
        content:
          "Missões diárias pra fortalecer novos hábitos e celebrar cada passo sem apostar.",
      },
      { property: "og:url", content: "https://apostanofuturo.online/metas" },
    ],
    links: [{ rel: "canonical", href: "https://apostanofuturo.online/metas" }],
  }),
  component: Metas,
});

type Challenge = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

const CHALLENGES: Challenge[] = [
  {
    id: "sem-apps-24h",
    icon: PhoneOff,
    title: "24 horas sem apps de aposta",
    description: "Fique um dia inteiro sem abrir nenhum app ou site de bet.",
  },
  {
    id: "cofrinho-virtual",
    icon: PiggyBank,
    title: "Cofrinho virtual",
    description:
      "Cada vez que pensar em apostar hoje, anote o valor num cofrinho (papel, notas do celular ou planilha).",
  },
  {
    id: "use-simulador",
    icon: Calculator,
    title: "Descubra quanto já economizou",
    description: "Use o Simulador do app e veja quanto você deixou de perder esta semana.",
  },
  {
    id: "conte-alguem",
    icon: Handshake,
    title: "Conte pra alguém de confiança",
    description:
      "Compartilhe seu objetivo com uma pessoa que te apoia. Falar em voz alta fortalece.",
  },
  {
    id: "lista-3-sonhos",
    icon: ListChecks,
    title: "3 coisas com o dinheiro que não apostou",
    description:
      "Liste 3 coisas concretas que você faria com o dinheiro guardado. Sonhar dá direção.",
  },
  {
    id: "30min-bem",
    icon: Headphones,
    title: "30 minutos que te fazem bem",
    description:
      "Esporte, música, uma conversa boa, um passeio. Escolha algo que te alimente por dentro.",
  },
  {
    id: "agua-sono",
    icon: Droplets,
    title: "Água + sono cedo hoje",
    description:
      "Beba mais água ao longo do dia e tente dormir 30 minutos mais cedo. Corpo cuidado, cabeça mais leve.",
  },
  {
    id: "gatilho-mapeado",
    icon: Compass,
    title: "Mapeie um gatilho",
    description:
      "Anote uma situação, horário ou emoção que costuma te levar à aposta. Reconhecer é o primeiro passo.",
  },
];

type MetasState = {
  /** Dia (fuso do aparelho) a que `completed` se refere. */
  day?: string;
  completed: Record<string, boolean>;
  /** Dias em que a pessoa marcou pelo menos um cuidado. */
  careDays?: string[];
  // Campos antigos, mantidos para quem já tinha dados salvos.
  points?: number;
  medals?: number;
};

const INITIAL: MetasState = { completed: {}, careDays: [] };

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** 3 sugestões que mudam a cada dia, sempre as mesmas no mesmo dia. */
function suggestionsFor(day: string): Challenge[] {
  const seed = day.split("-").reduce((acc, n) => acc * 31 + Number(n), 7);
  const start = Math.abs(seed) % CHALLENGES.length;
  return [0, 3, 5].map((k) => CHALLENGES[(start + k) % CHALLENGES.length]);
}

function Metas() {
  const [state, setState] = useLocalStorage<MetasState>("anf.desafios", INITIAL);
  const [today, setToday] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => setToday(todayKey()), []);

  // Um novo dia começa com a lista limpa.
  const completed = today && state.day === today ? state.completed : {};
  const suggestions = useMemo(() => (today ? suggestionsFor(today) : []), [today]);
  const others = CHALLENGES.filter((c) => !suggestions.some((s) => s.id === c.id));
  const doneToday = Object.values(completed).filter(Boolean).length;
  const careDays = state.careDays?.length ?? 0;

  function toggle(c: Challenge) {
    if (!today) return;
    setState((s) => {
      const base = s.day === today ? s.completed : {};
      const next = { ...base, [c.id]: !base[c.id] };
      const any = Object.values(next).some(Boolean);
      const days = new Set(s.careDays ?? []);
      if (any) days.add(today);
      else days.delete(today);
      return { ...s, day: today, completed: next, careDays: [...days] };
    });
  }

  return (
    <AppShell
      title="Metas"
      intro="Pequenos cuidados para hoje. Sem pontos, sem pressa: marque o que fizer sentido."
    >
      <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-12">
      <div className="lg:sticky lg:top-28 lg:col-span-4">
      {/* Resumo do dia */}
      <section className="flex items-center gap-4 rounded-3xl bg-gold-soft p-5 lg:flex-col lg:items-start lg:rounded-[2rem] lg:p-8" aria-live="polite">
        <span className="grid h-14 w-14 flex-none place-items-center rounded-full bg-card text-gold-deep lg:h-16 lg:w-16">
          <Sun className="h-6 w-6 lg:h-7 lg:w-7" />
        </span>
        <div className="min-w-0">
          <p className="tabular text-[1.3rem] font-semibold leading-tight text-navy lg:text-[1.75rem]">
            {doneToday === 0
              ? "Nenhum cuidado marcado ainda"
              : doneToday === 1
                ? "1 cuidado hoje"
                : `${doneToday} cuidados hoje`}
          </p>
          <p className="mt-1 text-sm text-gold-deep">
            {careDays === 0
              ? "Comece por um, o mais fácil."
              : careDays === 1
                ? "Você já cuidou de si em 1 dia."
                : `Você já cuidou de si em ${careDays} dias.`}
          </p>
        </div>
      </section>
      </div>

      <div className="lg:col-span-8">
      <section className="mt-8 lg:mt-0" aria-labelledby="sugestoes">
        <h2 id="sugestoes" className="text-lg font-semibold text-navy">
          Sugestões para hoje
        </h2>
        <ul className="mt-3 space-y-2.5 lg:grid lg:grid-cols-3 lg:gap-4 lg:space-y-0">
          {suggestions.map((c) => (
            <MissionRow key={c.id} c={c} done={!!completed[c.id]} onToggle={() => toggle(c)} />
          ))}
        </ul>
      </section>

      {showAll ? (
        <section className="rise-in mt-8" aria-labelledby="outras">
          <h2 id="outras" className="text-lg font-semibold text-navy">
            Outros cuidados
          </h2>
          <ul className="mt-3 space-y-2.5 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
            {others.map((c) => (
              <MissionRow key={c.id} c={c} done={!!completed[c.id]} onToggle={() => toggle(c)} />
            ))}
          </ul>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-4 inline-flex min-h-11 items-center gap-1 rounded-full px-1 text-sm font-semibold text-teal-deep hover:underline"
        >
          Ver todos os {CHALLENGES.length} cuidados
          <ChevronDown className="h-4 w-4" />
        </button>
      )}
      </div>
      </div>
    </AppShell>
  );
}

function MissionRow({
  c,
  done,
  onToggle,
}: {
  c: Challenge;
  done: boolean;
  onToggle: () => void;
}) {
  const Icon = c.icon;
  return (
    <li className="h-full">
      <button
        type="button"
        role="checkbox"
        aria-checked={done}
        onClick={onToggle}
        className={cn(
          "flex h-full w-full items-start gap-4 rounded-2xl border p-4 text-left transition-colors lg:flex-col lg:gap-4 lg:p-6",
          done
            ? "border-teal-deep/30 bg-teal-soft"
            : "border-border bg-card hover:border-teal-deep/40",
        )}
      >
        <span
          className={cn(
            "grid h-10 w-10 flex-none place-items-center rounded-full transition-colors",
            done ? "bg-teal-deep text-white" : "bg-teal-soft text-teal-deep",
          )}
        >
          {done ? <Check className="h-5 w-5" strokeWidth={2.6} /> : <Icon className="h-5 w-5" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold leading-snug text-navy">{c.title}</span>
          <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
            {c.description}
          </span>
          {done && (
            <span className="mt-2 block text-sm font-medium text-teal-ink">Feito hoje</span>
          )}
        </span>
      </button>
    </li>
  );
}
