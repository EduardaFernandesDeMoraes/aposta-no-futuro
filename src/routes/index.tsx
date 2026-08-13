import { track, trackOnce, EVENTS } from "@/lib/analytics";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import {
  ClipboardCheck,
  Calculator,
  Trophy,
  Users,
  RefreshCw,
  Sparkles,
  Lock,
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
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { OnboardingGate } from "@/components/onboarding-gate";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "Aposta no Futuro | Apoio anônimo e gratuito contra o vício em apostas",
      },
      {
        name: "description",
        content:
          "Aplicativo gratuito e anônimo que ajuda jovens a prevenir e enfrentar o vício em apostas online. Contador de dias livres, simulador financeiro, autoavaliação e comunidade de apoio.",
      },
      {
        property: "og:title",
        content:
          "Aposta no Futuro | Apoio anônimo e gratuito contra o vício em apostas",
      },
      {
        property: "og:description",
        content:
          "Aplicativo gratuito e anônimo que ajuda jovens a prevenir e enfrentar o vício em apostas online. Contador de dias livres, simulador financeiro, autoavaliação e comunidade de apoio.",
      },
      { property: "og:url", content: "https://apostanofuturo.online/" },
      {
        property: "og:image",
        content: "https://apostanofuturo.online/og-image.jpg",
      },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content:
          "Aposta no Futuro | Apoio anônimo e gratuito contra o vício em apostas",
      },
      {
        name: "twitter:description",
        content:
          "Aplicativo gratuito e anônimo que ajuda jovens a prevenir e enfrentar o vício em apostas online. Contador de dias livres, simulador financeiro, autoavaliação e comunidade de apoio.",
      },
      {
        name: "twitter:image",
        content: "https://apostanofuturo.online/og-image.jpg",
      },
    ],
    links: [{ rel: "canonical", href: "https://apostanofuturo.online/" }],
  }),
  component: HomeRoute,
});

function HomeRoute() {
  return (
    <OnboardingGate expect="onboarded">
      <Home />
    </OnboardingGate>
  );
}

type Profile = {
  name: string;
  firstFreeDay: string;
  onboarded: boolean;
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

function encourage(totalMinutes: number) {
  if (totalMinutes < 60) return "Cada minuto é uma vitória. Respira, você consegue.";
  if (totalMinutes < 60 * 24) return "Você está mais forte a cada hora que passa.";
  if (totalMinutes < 60 * 24 * 7) return "Siga firme, valerá a pena.";
  if (totalMinutes < 60 * 24 * 30) return "Uma semana muda muita coisa. Continua assim!";
  if (totalMinutes < 60 * 24 * 90) return "Você está transformando sua história 💚";
  return "Você é inspiração pra muita gente. Continue!";
}

function celebrate() {
  const end = Date.now() + 900;
  const colors = ["#16BFAC", "#F5A623", "#E8197E", "#1CA0D8"];
  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.7 },
      colors,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

function Home() {
  const [profile, setProfile] = useLocalStorage<Profile>("anf.profile", {
    name: "",
    firstFreeDay: "",
    onboarded: false,
  });
  const [lastMilestone, setLastMilestone] = useLocalStorage<number>(
    "anf.lastMilestone",
    0,
  );
  const [now, setNow] = useState(() => Date.now());
  const [restartOpen, setRestartOpen] = useState(false);
  const [celebration, setCelebration] = useState<Milestone | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000 * 30);
    return () => window.clearInterval(id);
  }, []);

  const startMs = profile.firstFreeDay
    ? new Date(profile.firstFreeDay).getTime()
    : now;
  const elapsed = Math.max(0, now - startMs);
  const totalMinutes = Math.floor(elapsed / 60000);
  const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
  const hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((elapsed / (1000 * 60)) % 60);

  // Detect newly hit milestone
  useEffect(() => {
    const reached = [...MILESTONES]
      .reverse()
      .find((m) => days >= m.days);
    if (reached && reached.days > lastMilestone) {
      setLastMilestone(reached.days);
      setCelebration(reached);
      celebrate();
    }
  }, [days, lastMilestone, setLastMilestone]);

  const phrase = useMemo(() => encourage(totalMinutes), [totalMinutes]);

  useEffect(() => {
    trackOnce(EVENTS.homeView);
  }, []);

  function handleRestart() {
    const iso = new Date().toISOString();
    setProfile({ ...profile, firstFreeDay: iso });
    track(EVENTS.counterStarted);
    setLastMilestone(0);
    setNow(Date.now());
    setRestartOpen(false);
  }

  return (
    <AppShell title="Aposta no Futuro" titleAs="p">

      {/* Título principal da página */}
      <div className="pb-5">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-navy sm:text-2xl">
          Menos apostas. Mais futuro. Essa é a nossa aposta.
        </h1>
      </div>

      {/* Greeting */}
      <div className="flex items-center gap-2 pb-1">
        <Sparkles className="h-4 w-4 text-magenta" />
        <p className="text-sm font-medium text-navy">
          Olá{profile.name ? `, ${profile.name}` : ""}!
        </p>
      </div>

      {/* Counter card */}
      <section className="mt-3 overflow-hidden rounded-3xl bg-gradient-to-br from-[#0d6b60] to-[#094e46] p-6 text-white shadow-soft animate-fade-in">
        <div className="text-xs font-semibold uppercase tracking-wider opacity-90">
          Você está sem apostar há:
        </div>

        <div className="mt-4 flex items-end justify-between gap-2">
          <TimeBlock value={days} label={days === 1 ? "dia" : "dias"} big />
          <span className="pb-3 text-3xl font-light opacity-60">:</span>
          <TimeBlock value={hours} label="h" />
          <span className="pb-3 text-3xl font-light opacity-60">:</span>
          <TimeBlock value={minutes} label="min" />
        </div>

        <p className="mt-5 text-sm leading-snug opacity-95">{phrase}</p>

        <button
          onClick={() => setRestartOpen(true)}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-coral px-4 py-2 text-sm font-semibold text-coral-foreground shadow-soft transition-all duration-200 ease-out hover:bg-[#eb4436] active:scale-95"
        >
          <RefreshCw className="h-4 w-4" />
          Recomecei hoje
        </button>
      </section>

      {/* Milestones */}
      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-navy">Seus marcos</h2>
          <span className="text-xs text-muted-foreground">
            {MILESTONES.filter((m) => days >= m.days).length}/{MILESTONES.length}
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
          {MILESTONES.map((m) => {
            const achieved = days >= m.days;
            return (
              <div
                key={m.days}
                className={cn(
                  "min-w-[92px] flex-1 rounded-2xl border p-3 text-center transition",
                  achieved
                    ? "border-gold/40 bg-gradient-to-b from-gold/15 to-gold/5 shadow-card"
                    : "border-border bg-card/60",
                )}
              >
                <div
                  className={cn(
                    "mx-auto grid h-12 w-12 place-items-center rounded-full text-xl",
                    achieved
                      ? "bg-gold text-gold-foreground shadow-soft"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {achieved ? m.emoji : <Lock className="h-4 w-4" />}
                </div>
                <div
                  className={cn(
                    "mt-2 text-xs font-semibold",
                    achieved ? "text-navy" : "text-muted-foreground",
                  )}
                >
                  {m.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Shortcuts */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-navy">
          Continue sua jornada
        </h2>
        <div className="grid grid-cols-2 items-stretch gap-3">
          <ShortcutCard
            to="/autoavaliacao"
            color="bg-magenta/10 text-magenta"
            hover="hover:bg-magenta/5 hover:border-magenta/30"
            icon={<ClipboardCheck className="h-5 w-5" />}
            title="Autoavaliação"
          />
          <ShortcutCard
            to="/simulador"
            color="bg-teal/10 text-teal"
            hover="hover:bg-teal/5 hover:border-teal/30"
            icon={<Calculator className="h-5 w-5" />}
            title="Ver simulador"
          />
          <ShortcutCard
            to="/metas"
            color="bg-gold/15 text-gold"
            hover="hover:bg-gold/10 hover:border-gold/30"
            icon={<Trophy className="h-5 w-5" />}
            title="Ver meta de hoje"
          />
          <ShortcutCard
            to="/comunidade"
            color="bg-cyan/10 text-cyan"
            hover="hover:bg-cyan/5 hover:border-cyan/30"
            icon={<Users className="h-5 w-5" />}
            title="Falar com a comunidade"
          />
        </div>
      </section>

      <InstallCard className="mt-4" />

      {/* Restart dialog */}
      <Dialog open={restartOpen} onOpenChange={setRestartOpen}>
        <DialogContent className="max-w-sm rounded-3xl">
          <DialogHeader>
            <div className="mx-auto mb-2 grid h-14 w-14 place-items-center rounded-full bg-coral/10 text-2xl">
              💚
            </div>
            <DialogTitle className="text-center text-navy">
              Todo recomeço conta
            </DialogTitle>
            <DialogDescription className="text-center">
              Recaída não apaga seu progresso. Orgulho de você por continuar
              tentando. Vamos reiniciar seu contador a partir de agora?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-2 flex-col gap-2 sm:flex-col">
            <Button
              onClick={handleRestart}
              className="w-full rounded-full bg-teal text-teal-foreground transition-all duration-200 hover:bg-[#14ac9b]"
            >
              Sim, recomeçar agora
            </Button>
            <Button
              variant="ghost"
              onClick={() => setRestartOpen(false)}
              className="w-full rounded-full text-muted-foreground"
            >
              Agora não
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Milestone celebration dialog */}
      <Dialog
        open={celebration !== null}
        onOpenChange={(v) => !v && setCelebration(null)}
      >
        <DialogContent className="max-w-sm rounded-3xl text-center">
          <DialogHeader>
            <div className="mx-auto mb-2 grid h-20 w-20 place-items-center rounded-full bg-gold text-4xl shadow-soft">
              {celebration?.emoji}
            </div>
            <DialogTitle className="text-center text-navy">
              Você conquistou {celebration?.label}!
            </DialogTitle>
            <DialogDescription className="text-center">
              Isso é muito grande. Respira, sente esse orgulho, você merece.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => setCelebration(null)}
            className="mt-2 w-full rounded-full bg-teal text-teal-foreground transition-all duration-200 hover:bg-[#14ac9b]"
          >
            Obrigado 💚
          </Button>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function TimeBlock({
  value,
  label,
  big = false,
}: {
  value: number;
  label: string;
  big?: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col items-center">
      <span
        className={cn(
          "font-bold leading-none tabular-nums",
          big ? "text-6xl" : "text-4xl",
        )}
      >
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[11px] uppercase tracking-wider opacity-80">
        {label}
      </span>
    </div>
  );
}

function ShortcutCard({
  to,
  color,
  hover,
  icon,
  title,
}: {
  to: string;
  color: string;
  hover?: string;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "group flex h-full min-h-[124px] flex-col rounded-2xl border border-border bg-card p-4 text-left shadow-card transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-soft active:translate-y-0 active:scale-[0.98]",
        hover,
      )}
    >
      <div
        className={cn(
          "grid h-10 w-10 place-items-center rounded-xl transition-colors duration-200",
          color,
        )}
      >
        {icon}
      </div>
      <div className="mt-3 text-sm font-semibold leading-tight text-navy">
        {title}
      </div>
    </Link>
  );
}
