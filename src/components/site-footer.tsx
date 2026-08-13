import { Link } from "@tanstack/react-router";

/** Rodapé legal/contato exibido em todas as telas do app. */
export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-border pt-4 text-center text-xs leading-relaxed text-muted-foreground">
      <nav className="flex items-center justify-center gap-3">
        <Link to="/privacidade" className="font-medium underline underline-offset-2">
          Privacidade
        </Link>
        <span aria-hidden="true">·</span>
        <Link to="/termos" className="font-medium underline underline-offset-2">
          Termos de uso
        </Link>
      </nav>
      <p className="mt-2">
        Contato:{" "}
        <a
          href="mailto:contato@apostanofuturo.online"
          className="font-medium underline underline-offset-2"
        >
          contato@apostanofuturo.online
        </a>
      </p>
      <p className="mt-1">Este e-mail não é um canal de emergência.</p>
    </footer>
  );
}
