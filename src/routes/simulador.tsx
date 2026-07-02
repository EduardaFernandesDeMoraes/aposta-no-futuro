import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { EmptyScreen } from "@/components/empty-screen";

export const Route = createFileRoute("/simulador")({
  head: () => ({
    meta: [
      { title: "Simulador | Aposta no Futuro" },
      {
        name: "description",
        content:
          "Veja quanto você já economizou parando de apostar e o que dá pra fazer com esse dinheiro.",
      },
    ],
  }),
  component: () => (
    <AppShell title="Simulador">
      <EmptyScreen
        emoji="💰"
        title="Descubra o que seu dinheiro pode fazer"
        description="Aqui você vai ver quanto está economizando por dia, por mês e por ano — e o que dá pra realizar com isso."
      />
    </AppShell>
  ),
});
