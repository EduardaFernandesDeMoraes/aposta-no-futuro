import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { track, EVENTS } from "@/lib/analytics";
import { playProductSwitch } from "@/lib/product-switch";
import { AccessChooser, type AccessChoice } from "@/components/access-chooser";
import { useAccess } from "@/lib/access";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/acesso")({
  head: () => ({
    meta: [
      { title: "Trocar perfil | Aposta no Futuro" },
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
      void playProductSwitch("Campus", () => navigate({ to: "/campus" }));
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
    <AppShell
      title="Trocar perfil"
      intro="Escolha como você quer usar o app agora. Seu contador, suas metas e suas apostas no futuro continuam salvos neste aparelho."
    >
      <div className="max-w-xl">
        <AccessChooser variant="switch" onDone={handle} />
      </div>
    </AppShell>
  );
}
