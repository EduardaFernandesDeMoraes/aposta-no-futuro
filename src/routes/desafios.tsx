import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { EmptyScreen } from "@/components/empty-screen";

export const Route = createFileRoute("/desafios")({
  head: () => ({
    meta: [
      { title: "Desafios | Aposta no Futuro" },
      {
        name: "description",
        content:
          "Missões diárias e semanais pra fortalecer sua jornada e ganhar conquistas.",
      },
    ],
  }),
  component: () => (
    <AppShell title="Desafios">
      <EmptyScreen
        emoji="🏆"
        title="Missões pra você conquistar"
        description="Pequenos desafios que ajudam a criar novos hábitos e a celebrar cada passo."
      />
    </AppShell>
  ),
});
