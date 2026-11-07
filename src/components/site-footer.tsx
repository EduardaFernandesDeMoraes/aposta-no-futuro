import { Link } from "@tanstack/react-router";

/**
 * Rodapé de todas as telas do app. Reúne, num lugar só, o aviso de que o
 * app é apoio (e não atendimento) e os links legais.
 */
export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-border pt-5 text-center text-xs leading-relaxed text-muted-foreground lg:mt-16 lg:flex lg:items-center lg:justify-between lg:gap-8 lg:text-left lg:text-sm">
      <p className="mx-auto max-w-[44ch] lg:mx-0 lg:max-w-[60ch]">
        O Aposta no Futuro é um apoio e não substitui atendimento
        profissional. Em emergência, ligue{" "}
        <a href="tel:188" className="font-semibold text-navy underline">
          188
        </a>{" "}
        (CVV) ou 192.
      </p>
      <nav
        aria-label="Links institucionais"
        className="mt-2 flex flex-wrap items-center justify-center lg:mt-0 lg:flex-none lg:justify-end"
      >
        <Link to="/privacidade" className="inline-flex min-h-11 items-center px-2.5 font-medium underline">
          Privacidade
        </Link>
        <Link to="/termos" className="inline-flex min-h-11 items-center px-2.5 font-medium underline">
          Termos de uso
        </Link>
        <Link to="/sobre" className="inline-flex min-h-11 items-center px-2.5 font-medium underline">
          Sobre nós
        </Link>
        <a
          href="mailto:contato@apostanofuturo.online"
          className="inline-flex min-h-11 items-center px-2.5 font-medium underline"
        >
          Contato
        </a>
      </nav>
    </footer>
  );
}
