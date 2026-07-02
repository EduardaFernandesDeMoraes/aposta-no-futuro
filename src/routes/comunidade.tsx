import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { EmptyScreen } from "@/components/empty-screen";

export const Route = createFileRoute("/comunidade")({
  head: () => ({
    meta: [
      { title: "Comunidade | Aposta no Futuro" },
      {
        name: "description",
        content:
          "Histórias reais, apoio e conexão com quem também está nessa jornada.",
      },
    ],
  }),
  component: () => (
    <AppShell title="Comunidade">
      <EmptyScreen
        emoji="🤝"
        title="Você não está sozinho"
        description="Um espaço acolhedor pra ler histórias, compartilhar sua e receber apoio de quem entende."
      />
    </AppShell>
  ),
});
