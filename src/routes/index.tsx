import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Sparkles, Flame } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Início | Aposta no Futuro" },
      {
        name: "description",
        content:
          "Acompanhe seus dias livres de apostas e sua jornada de recuperação.",
      },
    ],
  }),
  component: Home,
});

type Profile = {
  name: string;
  firstFreeDay: string;
  onboarded: boolean;
};

function Home() {
  const navigate = useNavigate();
  const [profile] = useLocalStorage<Profile>("anf.profile", {
    name: "",
    firstFreeDay: "",
    onboarded: false,
  });

  useEffect(() => {
    if (!profile.onboarded) navigate({ to: "/bem-vindo" });
  }, [profile.onboarded, navigate]);

  const days = profile.firstFreeDay
    ? Math.max(
        0,
        Math.floor(
          (Date.now() - new Date(profile.firstFreeDay).getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : 0;

  return (
    <AppShell title="Aposta no Futuro">
      <div className="rounded-3xl bg-gradient-to-br from-teal to-cyan p-6 text-teal-foreground shadow-soft">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider opacity-90">
          <Sparkles className="h-4 w-4" />
          Olá{profile.name ? `, ${profile.name}` : ""} 👋
        </div>
        <div className="mt-4 flex items-end gap-2">
          <span className="text-6xl font-bold leading-none">{days}</span>
          <span className="pb-1 text-sm opacity-90">
            {days === 1 ? "dia livre" : "dias livres"}
          </span>
        </div>
        <p className="mt-3 text-sm opacity-95">
          Cada dia é uma vitória sua. Continue, você está indo muito bem.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-magenta/10 text-magenta">
            <Flame className="h-4 w-4" />
          </div>
          <div className="mt-3 text-2xl font-bold text-navy">R$ 0</div>
          <div className="text-xs text-muted-foreground">Economizado</div>
        </div>
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gold/15 text-gold">
            🏅
          </div>
          <div className="mt-3 text-2xl font-bold text-navy">0</div>
          <div className="text-xs text-muted-foreground">Conquistas</div>
        </div>
      </div>

      <section className="mt-6">
        <h2 className="mb-2 text-sm font-semibold text-navy">Pra hoje</h2>
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-6 text-center text-sm text-muted-foreground">
          Suas dicas, desafios do dia e histórias da comunidade aparecerão
          aqui em breve.
        </div>
      </section>
    </AppShell>
  );
}
