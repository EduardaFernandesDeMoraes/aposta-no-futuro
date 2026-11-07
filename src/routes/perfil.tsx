import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeftRight,
  Check,
  ChevronRight,
  Copy,
  PiggyBank,
  Share2,
  Sprout,
} from "lucide-react";
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
import { InstallCard } from "@/components/install-card";
import { useAccess } from "@/lib/access";
import { findPartner } from "@/lib/partners";
import { useFutureBets } from "@/components/minhas-apostas";

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
          "Veja o dinheiro que ficou com você e o caminho que você já fez sem apostar.",
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

type MetasState = {
  completed: Record<string, boolean>;
  careDays?: string[];
};

const MILESTONE_DAYS = [1, 7, 30, 90, 180, 365];

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
  const [access] = useAccess();
  const partner = access.mode === "student" ? findPartner(access.partner) : undefined;
  const [bets] = useFutureBets();
  const betsSaved = bets.reduce((a, b) => a + b.saved, 0);
  const betsTarget = bets.reduce((a, b) => a + b.target, 0);
  const [metas] = useLocalStorage<MetasState>("anf.desafios", { completed: {} });

  // `now` só no aparelho, para o HTML do servidor bater com o do navegador.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), []);

  const started = Boolean(profile.firstFreeDay);
  const startMs = started ? new Date(profile.firstFreeDay).getTime() : (now ?? 0);
  const elapsed = now === null ? 0 : Math.max(0, now - startMs);
  const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));

  const weekly = saved?.weekly ?? 0;
  const moneySaved = Math.round((weekly * days) / 7);
  const careDays = metas.careDays?.length ?? 0;
  const milestones = started ? MILESTONE_DAYS.filter((d) => days >= d).length : 0;

  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareText = `Estou há ${days} ${days === 1 ? "dia" : "dias"} sem apostar 💚\nUm dia de cada vez. Aposta no Futuro.`;

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({ title: "Minha conquista", text: shareText });
        return;
      }
    } catch {
      // segue para o cartão
    }
    setShareOpen(true);
  }

  async function copyText() {
    try {
      await navigator.clipboard.writeText(shareText.replace("\n", " · "));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignora
    }
  }

  const initial = profile.name.trim().charAt(0).toUpperCase();

  return (
    <AppShell title="Perfil" titleAs="p">
      <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-12">
      <div className="lg:sticky lg:top-28 lg:col-span-5">
      {/* Quem */}
      <div className="flex items-center gap-4 pb-6 lg:pb-8">
        <span className="grid h-16 w-16 flex-none place-items-center rounded-full bg-teal-soft text-2xl font-semibold text-teal-deep lg:h-20 lg:w-20 lg:text-3xl">
          {initial || <Sprout className="h-7 w-7" />}
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-[1.6rem] font-semibold leading-tight tracking-[-0.02em] text-navy lg:text-[2.5rem] lg:tracking-[-0.03em]">
            {profile.name.trim() || "Você"}
          </h1>
          <p className="mt-0.5 text-[0.95rem] text-muted-foreground lg:text-lg">
            {!started
              ? "Seu contador ainda não começou"
              : now === null
                ? " "
                : days === 0
                  ? "Começando agora"
                  : `${days} ${days === 1 ? "dia" : "dias"} sem apostar`}
          </p>
        </div>
      </div>

      {/* Dinheiro que ficou com você */}
      <section className="rounded-3xl bg-gold-soft p-5 lg:rounded-[2rem] lg:p-8" aria-labelledby="dinheiro">
        <h2 id="dinheiro" className="text-[0.95rem] font-medium text-gold-deep">
          Dinheiro que ficou com você
        </h2>
        {weekly > 0 && started ? (
          <>
            <p className="tabular mt-1 text-[2.5rem] font-semibold leading-none tracking-[-0.03em] text-navy lg:mt-3 lg:text-[4rem] lg:tracking-[-0.04em]">
              {now === null ? "–" : brl(moneySaved)}
            </p>
            <p className="mt-2 text-sm text-gold-deep">
              Com base em {brl(weekly)} por semana, em {days} {days === 1 ? "dia" : "dias"} sem apostar.
            </p>
          </>
        ) : (
          <>
            <p className="mt-1 text-[0.95rem] leading-relaxed text-navy">
              {started
                ? "Diga no Simulador quanto você apostava por semana e a gente mostra aqui o que já ficou com você."
                : "Quando o contador começar, a gente mostra aqui o dinheiro que ficou com você."}
            </p>
            <Link
              to={started ? "/simulador" : "/"}
              className="mt-3 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-gold-deep underline underline-offset-4"
            >
              {started ? "Abrir o Simulador" : "Ir para o contador"}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </>
        )}
      </section>
      </div>

      <div className="lg:col-span-7 lg:pt-[7.5rem]">
      {/* Números do caminho */}
      <dl className="mt-4 grid grid-cols-2 gap-3 lg:mt-0 lg:gap-4">
        <div className="rounded-3xl border border-border bg-card p-4">
          <dt className="text-sm text-muted-foreground">Marcos da trilha</dt>
          <dd className="tabular mt-1 text-2xl font-semibold text-navy">
            {milestones} <span className="text-base font-normal text-muted-foreground">de 6</span>
          </dd>
        </div>
        <div className="rounded-3xl border border-border bg-card p-4">
          <dt className="text-sm text-muted-foreground">Dias em que se cuidou</dt>
          <dd className="tabular mt-1 text-2xl font-semibold text-navy">{careDays}</dd>
        </div>
      </dl>

      <ul className="mt-6 divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card">
        <li>
          <Link
            to="/simulador"
            hash="minhas-apostas"
            className="flex min-h-[4.5rem] items-center gap-4 px-4 py-3 transition-colors hover:bg-background"
          >
            <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-gold-soft text-gold-deep">
              <PiggyBank className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-medium text-navy">Minhas apostas no futuro</span>
              <span className="block text-sm text-muted-foreground">
                {bets.length === 0
                  ? "Crie seu primeiro objetivo"
                  : `${bets.length} ${bets.length === 1 ? "objetivo" : "objetivos"} · ${brl(betsSaved)} de ${brl(betsTarget)}`}
              </span>
            </span>
            <ChevronRight className="h-5 w-5 flex-none text-muted-foreground" />
          </Link>
        </li>
        <li>
          <Link
            to="/acesso"
            className="flex min-h-[4.5rem] items-center gap-4 px-4 py-3 transition-colors hover:bg-background"
          >
            <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-teal-soft text-teal-deep">
              <ArrowLeftRight className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-medium text-navy">
                AF People{partner ? ` + ${partner.shortName}` : " · acesso livre"}
              </span>
              <span className="block text-sm text-muted-foreground">
                Trocar instituição ou perfil
              </span>
            </span>
            <ChevronRight className="h-5 w-5 flex-none text-muted-foreground" />
          </Link>
        </li>
      </ul>

      {/* Compartilhar */}
      {started && (
        <section className="mt-6">
          <Button
            onClick={handleShare}
            className="min-h-12 w-full rounded-full bg-teal-deep text-base font-semibold text-white hover:bg-teal-ink"
          >
            <Share2 className="mr-2 h-5 w-5" />
            Compartilhar minha conquista
          </Button>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Só você decide. Nada é publicado sem você tocar aqui.
          </p>
        </section>
      )}

      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="max-w-sm rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-navy">Sua conquista</DialogTitle>
            <DialogDescription className="text-center">
              Faça uma captura de tela para mandar para quem você quiser.
            </DialogDescription>
          </DialogHeader>

          <div className="relative mx-auto mt-2 aspect-[4/5] w-full overflow-hidden rounded-3xl bg-teal-ink p-6 text-white">
            <img
              src="/logo-maos-coracao.svg"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-12 -right-10 h-56 w-56 opacity-[0.12] brightness-[3] grayscale"
            />
            <div className="relative flex h-full flex-col">
              <p className="text-sm font-semibold">
                Aposta no <span className="text-[#7fe6da]">Futuro</span>
              </p>
              <div className="mt-auto">
                <p className="text-[0.95rem] text-white/85">Estou há</p>
                <p className="mt-1 flex items-baseline gap-2">
                  <span className="tabular text-7xl font-semibold leading-none tracking-[-0.03em] text-gold">
                    {days}
                  </span>
                  <span className="text-lg font-semibold">{days === 1 ? "dia" : "dias"}</span>
                </p>
                <p className="mt-1 text-lg font-semibold">sem apostar</p>
                {weekly > 0 && moneySaved > 0 && (
                  <p className="mt-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-sm">
                    {brl(moneySaved)} ficaram comigo
                  </p>
                )}
                <p className="mt-6 font-script text-2xl text-white/85">Um dia de cada vez.</p>
              </div>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <Button
              variant="outline"
              onClick={copyText}
              className="min-h-11 flex-1 rounded-full border-border"
            >
              {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
              {copied ? "Copiado" : "Copiar texto"}
            </Button>
            <Button
              onClick={() => setShareOpen(false)}
              className="min-h-11 flex-1 rounded-full bg-teal-deep text-white hover:bg-teal-ink"
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <InstallCard className="mt-6" />
      </div>
      </div>
    </AppShell>
  );
}
