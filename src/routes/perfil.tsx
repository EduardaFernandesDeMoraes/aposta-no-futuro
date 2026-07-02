import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { EmptyScreen } from "@/components/empty-screen";
import { useLocalStorage } from "@/hooks/use-local-storage";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil | Aposta no Futuro" },
      {
        name: "description",
        content:
          "Seu progresso, conquistas e configurações no Aposta no Futuro.",
      },
    ],
  }),
  component: Perfil,
});

type Profile = {
  name: string;
  firstFreeDay: string;
  onboarded: boolean;
};

function Perfil() {
  const [profile] = useLocalStorage<Profile>("anf.profile", {
    name: "",
    firstFreeDay: "",
    onboarded: false,
  });

  return (
    <AppShell title="Perfil">
      <div className="rounded-3xl bg-card p-6 text-center shadow-card">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-teal text-2xl font-bold text-teal-foreground">
          {profile.name ? profile.name.charAt(0).toUpperCase() : "🌱"}
        </div>
        <div className="mt-3 text-lg font-semibold text-navy">
          {profile.name || "Bem-vindo"}
        </div>
        {profile.firstFreeDay && (
          <div className="text-xs text-muted-foreground">
            Primeiro dia livre:{" "}
            {new Date(profile.firstFreeDay).toLocaleDateString("pt-BR")}
          </div>
        )}
      </div>

      <div className="mt-4">
        <EmptyScreen
          emoji="✨"
          title="Suas conquistas aparecerão aqui"
          description="Medalhas, marcos e configurações do seu app. Tudo salvo só no seu aparelho."
        />
      </div>
    </AppShell>
  );
}
