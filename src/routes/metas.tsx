import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useEffect, useState } from "react";
import {
  Ban,
  BellOff,
  Bike,
  Calculator,
  Camera,
  Check,
  ChefHat,
  ChevronDown,
  ClipboardCheck,
  Coffee,
  Compass,
  Droplets,
  Footprints,
  Handshake,
  HandHeart,
  Headphones,
  Leaf,
  ListChecks,
  MessageCircle,
  Moon,
  MoonStar,
  Music,
  Palette,
  PenLine,
  PhoneOff,
  PiggyBank,
  Receipt,
  Smile,
  Sprout,
  Sun,
  Timer,
  Tv,
  Wallet,
  Wind,
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

/**
 * Banco de cuidados. Todo dia, à meia-noite (fuso do aparelho), entram 3
 * sugestões novas + 3 ideias extras. A ordem é embaralhada por ciclo, então
 * nenhum cuidado se repete em 5 dias seguidos e as combinações mudam sempre.
 */
const CHALLENGES: Challenge[] = [
  { id: "sem-apps-24h", icon: PhoneOff, title: "24 horas sem apps de aposta", description: "Fique um dia inteiro sem abrir nenhum app ou site de bet." },
  { id: "cofrinho-virtual", icon: PiggyBank, title: "Cofrinho virtual", description: "Cada vez que pensar em apostar hoje, anote o valor num cofrinho (papel, notas do celular ou planilha)." },
  { id: "use-simulador", icon: Calculator, title: "Descubra quanto já economizou", description: "Use o Simulador do app e veja quanto você deixou de perder esta semana." },
  { id: "conte-alguem", icon: Handshake, title: "Conte pra alguém de confiança", description: "Compartilhe seu objetivo com uma pessoa que te apoia. Falar em voz alta fortalece." },
  { id: "lista-3-sonhos", icon: ListChecks, title: "3 coisas com o dinheiro que não apostou", description: "Liste 3 coisas concretas que você faria com o dinheiro guardado. Sonhar dá direção." },
  { id: "30min-bem", icon: Headphones, title: "30 minutos que te fazem bem", description: "Esporte, música, uma conversa boa, um passeio. Escolha algo que te alimente por dentro." },
  { id: "agua-sono", icon: Droplets, title: "Água + sono cedo hoje", description: "Beba mais água ao longo do dia e tente dormir 30 minutos mais cedo. Corpo cuidado, cabeça mais leve." },
  { id: "gatilho-mapeado", icon: Compass, title: "Mapeie um gatilho", description: "Anote uma situação, horário ou emoção que costuma te levar à aposta. Reconhecer é o primeiro passo." },
  { id: "caminhada", icon: Footprints, title: "Caminhada de 20 minutos", description: "Sem placar, sem palpite: só você e a rua. Mexer o corpo baixa a ansiedade." },
  { id: "bloqueio", icon: Ban, title: "Ative um bloqueio", description: "Instale um bloqueador de sites de aposta ou ative o limite de tempo de apps no celular." },
  { id: "notificacoes", icon: BellOff, title: "Silencie as bets", description: "Saia de grupos de palpites e desative avisos de odds e promoções." },
  { id: "dinheiro-longe", icon: Wallet, title: "Deixe o dinheiro mais longe", description: "Tire o cartão salvo dos sites e apps que você usava para apostar." },
  { id: "jogo-sem-aposta", icon: Tv, title: "Assista a um jogo sem apostar", description: "Se for ver futebol hoje, combine com você: só torcer, sem bilhete." },
  { id: "respiracao", icon: Wind, title: "3 minutos de respiração", description: "Inspira em 4, segura em 4, solta em 6. Repita até o corpo desacelerar." },
  { id: "diario", icon: PenLine, title: "Escreva 3 linhas sobre o seu dia", description: "Como você se sentiu? Teve vontade de apostar? Escrever ajuda a entender o padrão." },
  { id: "mensagem", icon: MessageCircle, title: "Mande mensagem para alguém querido", description: "Não precisa falar de apostas. Só retomar contato já faz bem." },
  { id: "cozinhar", icon: ChefHat, title: "Cozinhe algo simples", description: "Uma refeição feita por você ocupa as mãos, acalma a cabeça e ainda economiza." },
  { id: "celular-longe", icon: Moon, title: "Celular longe na hora de dormir", description: "Deixe o celular fora do alcance da cama. A madrugada é hora de risco para muita gente." },
  { id: "ar-livre", icon: Leaf, title: "10 minutos ao ar livre", description: "Uma praça, uma janela aberta, um quintal. Luz do dia ajuda o humor." },
  { id: "playlist", icon: Music, title: "Uma playlist para os dias difíceis", description: "Músicas que te acalmam ou te animam, prontas para quando a vontade aparecer." },
  { id: "extrato", icon: Receipt, title: "Olhe suas contas com calma", description: "Veja o extrato do mês sem se julgar. Saber onde está o dinheiro devolve o controle." },
  { id: "aposta-futuro", icon: Sprout, title: "Alimente um objetivo seu", description: "Registre no Simulador um valor que você separou." },
  { id: "hobby", icon: Palette, title: "Volte para um hobby antigo", description: "Desenho, violão, jogo de tabuleiro, crochê. Algo que te prenda sem dinheiro em jogo." },
  { id: "algo-bom", icon: Smile, title: "Anote algo bom de hoje", description: "Uma coisa pequena que deu certo. É um treino para enxergar o que funciona." },
  { id: "regra-15", icon: Timer, title: "Regra dos 15 minutos", description: "Se a vontade aparecer, espere 15 minutos antes de qualquer decisão. Ela costuma passar." },
  { id: "exercicio", icon: Bike, title: "Um exercício que você curte", description: "Futebol com amigos, academia, dança, bike. Suor no lugar de odds." },
  { id: "cafe", icon: Coffee, title: "Um café com alguém", description: "Chame alguém para conversar ao vivo. Companhia diminui o impulso." },
  { id: "autoavaliacao", icon: ClipboardCheck, title: "Refaça a autoavaliação", description: "Veja como você está hoje. Leva uns 2 minutos e fica só no seu aparelho." },
  { id: "foto-objetivo", icon: Camera, title: "Foto do seu objetivo", description: "Salve no celular uma imagem do que você quer conquistar e olhe para ela quando bater a vontade." },
  { id: "apoio", icon: HandHeart, title: "Pesquise um apoio perto de você", description: "Procure o CAPS da sua cidade ou o serviço de apoio da sua faculdade. Só pesquisar já é um passo." },
];

const PER_DAY = 6; // 3 sugestões + 3 ideias extras
const DAYS_PER_CYCLE = Math.floor(CHALLENGES.length / PER_DAY);

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

function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Milissegundos até a próxima meia-noite no fuso do aparelho. */
function msUntilMidnight() {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);
  return next.getTime() - now.getTime();
}

/** Embaralhamento determinístico (mesma semente, mesma ordem). */
function shuffled<T>(list: T[], seed: number): T[] {
  const out = [...list];
  let s = (seed * 2654435761) >>> 0 || 1;
  const rand = () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Ciclo de referência (1º de janeiro de 2026): a fila é montada a partir dele. */
const ANCHOR_CYCLE = Math.floor(Math.floor(Date.UTC(2026, 0, 1) / 86_400_000) / DAYS_PER_CYCLE);

/**
 * Fila de cuidados de um ciclo. A cada ciclo a fila é reembaralhada e os
 * cuidados do último dia do ciclo anterior vão para o fim, para nada se
 * repetir de um dia para o outro na virada.
 */
function orderForCycle(cycle: number): Challenge[] {
  let order = shuffled(CHALLENGES, ANCHOR_CYCLE + 1);
  for (let k = ANCHOR_CYCLE + 1; k <= cycle; k++) {
    const last = new Set(
      order.slice((DAYS_PER_CYCLE - 1) * PER_DAY, DAYS_PER_CYCLE * PER_DAY).map((c) => c.id),
    );
    const fresh = shuffled(CHALLENGES, k + 1);
    order = [...fresh.filter((c) => !last.has(c.id)), ...fresh.filter((c) => last.has(c.id))];
  }
  return cycle < ANCHOR_CYCLE ? shuffled(CHALLENGES, cycle + 1) : order;
}

/** Os cuidados do dia: sempre os mesmos ao longo do dia, novos à meia-noite. */
function plansFor(day: string): { main: Challenge[]; extra: Challenge[] } {
  const [y, m, d] = day.split("-").map(Number);
  const dayIndex = Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
  const cycle = Math.floor(dayIndex / DAYS_PER_CYCLE);
  const pos = dayIndex % DAYS_PER_CYCLE;
  const order = orderForCycle(cycle);
  const slice = order.slice(pos * PER_DAY, pos * PER_DAY + PER_DAY);
  return { main: slice.slice(0, 3), extra: slice.slice(3) };
}

function Metas() {
  const [state, setState] = useLocalStorage<MetasState>("anf.desafios", INITIAL);
  const [today, setToday] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);

  // Automação da meia-noite: troca os cuidados assim que o dia vira, mesmo
  // com a tela aberta, e confere de novo quando o app volta a ficar visível.
  useEffect(() => {
    let timer = 0;
    const refresh = () => {
      setToday((prev) => {
        const key = todayKey();
        if (prev !== key) setShowMore(false);
        return key;
      });
    };
    const schedule = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        refresh();
        schedule();
      }, msUntilMidnight());
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        refresh();
        schedule();
      }
    };
    refresh();
    schedule();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, []);

  // Um novo dia começa com a lista limpa.
  const completed = today && state.day === today ? state.completed : {};
  const plan = useMemo(() => (today ? plansFor(today) : { main: [], extra: [] }), [today]);
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
      intro="Pequenos cuidados para hoje. Marque o que fizer sentido."
    >
      <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-12">
      <div className="lg:col-span-4">
      <h2 className="sr-only text-lg font-semibold text-navy lg:not-sr-only lg:block lg:text-xl">Seu dia</h2>
      {/* Resumo do dia */}
      <section className="lg:mt-3 flex items-center gap-4 rounded-3xl bg-gold-soft p-5 lg:flex-col lg:items-start lg:rounded-[2rem] lg:p-8" aria-live="polite">
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
      <p className="mt-3 flex items-center gap-2 px-1 text-sm text-muted-foreground">
        <MoonStar className="h-4 w-4 flex-none text-teal-deep" />
        Novos cuidados chegam todo dia à meia-noite.
      </p>
      </div>

      <div className="lg:col-span-8">
      <section className="mt-8 lg:mt-0" aria-labelledby="sugestoes">
        <h2 id="sugestoes" className="text-lg font-semibold text-navy lg:text-xl">
          Sugestões para hoje
        </h2>
        <ul key={today ?? "carregando"} className="rise-in mt-3 space-y-2.5 lg:grid lg:grid-cols-3 lg:gap-4 lg:space-y-0">
          {plan.main.map((c) => (
            <MissionRow key={c.id} c={c} done={!!completed[c.id]} onToggle={() => toggle(c)} />
          ))}
        </ul>
      </section>

      {showMore ? (
        <section className="rise-in mt-8" aria-labelledby="outras">
          <h2 id="outras" className="text-lg font-semibold text-navy lg:text-xl">
            Mais ideias para hoje
          </h2>
          <ul className="mt-3 space-y-2.5 lg:grid lg:grid-cols-3 lg:gap-4 lg:space-y-0">
            {plan.extra.map((c) => (
              <MissionRow key={c.id} c={c} done={!!completed[c.id]} onToggle={() => toggle(c)} />
            ))}
          </ul>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => setShowMore(true)}
          className="mt-4 inline-flex min-h-11 items-center gap-1 rounded-full px-1 text-sm font-semibold text-teal-deep hover:underline"
        >
          Mais 3 ideias para hoje
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
