import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { track, EVENTS } from "@/lib/analytics";
import { AccessChooser, type AccessChoice } from "@/components/access-chooser";
import { useAccess } from "@/lib/access";

export const Route = createFileRoute("/acesso")({
  head: () => ({
    meta: [
      { title: "Alterar instituição ou perfil | Aposta no Futuro" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AcessoRoute,
});

function readOnboarded(): boolean {
  try {
    return Boolean(JSON.parse(window.localStorage.getItem("anf.profile") ?? "{}")?.onboarded);
  } catch {
    return false;
  }
}

function AcessoRoute() {
  const navigate = useNavigate();
  const [, setAccess] = useAccess();

  function handle(choice: AccessChoice) {
    if (choice.kind === "manager") {
      track(EVENTS.accessManager);
      navigate({ to: "/campus" });
      return;
    }
    if (choice.kind === "student") {
      setAccess({ mode: "student", partner: choice.partner });
      track(EVENTS.accessStudent);
    } else {
      setAccess({ mode: "free" });
      track(EVENTS.accessFree);
    }
    // Pequeno atraso para o localStorage gravar antes da navegação.
    window.setTimeout(() => navigate({ to: readOnboarded() ? "/" : "/bem-vindo" }), 0);
  }

  return (
    <div className="min-h-dvh bg-background">
      <main className="mx-auto flex min-h-dvh max-w-md flex-col px-4 pb-[calc(env(safe-area-inset-bottom)+2rem)] pt-10">
        <h1 className="sr-only">Alterar instituição ou perfil</h1>
        <AccessChooser onDone={handle} />
      </main>
    </div>
  );
}
