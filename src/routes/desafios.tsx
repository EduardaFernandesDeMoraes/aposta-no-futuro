import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * A aba "Desafios" virou "Metas". A rota antiga continua funcionando e
 * redireciona para /metas, para não quebrar links já compartilhados.
 */
export const Route = createFileRoute("/desafios")({
  beforeLoad: () => {
    throw redirect({ to: "/metas", replace: true });
  },
});
