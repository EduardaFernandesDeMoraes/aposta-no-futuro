import { Link } from "@tanstack/react-router";

/**
 * Rodapé de todas as telas do app. Reúne, num lugar só, o aviso de que o
 * app é apoio (e não atendimento) e os links legais.
 *
 * Discreto de propósito: texto de 12px, sem sublinhados, um tom abaixo do
 * texto secundário (ainda acima de 4,5:1 de contraste). Os links só ganham
 * cor ao passar o mouse ou receber foco. O 188 continua um pouco mais
 * escuro para ser achado rápido numa crise.
 */
const LINK =
  "inline-flex min-h-11 items-center rounded-md px-1 transition-colors hover:text-navy focus-visible:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-deep/30";

export function SiteFooter() {
  return (
    <footer className="mt-14 border-t border-border/60 pt-6 text-center text-xs leading-relaxed text-muted-foreground/90 lg:mt-20 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:pt-5 lg:text-left">
      <p className="mx-auto max-w-[46ch] lg:mx-0 lg:max-w-none lg:flex-1">
        O Aposta no Futuro é um apoio e não substitui atendimento profissional.{" "}
        {/* A segunda frase nunca quebra no meio: ou cabe na mesma linha, ou desce inteira. */}
        <span className="whitespace-nowrap">
          Em emergência, ligue{" "}
          {/* Número de crise: o padding vertical (inline) amplia a área de toque
            sem mudar a altura da linha. */}
          <a
            href="tel:188"
            aria-label="Ligar para o CVV, 188"
            className="-mx-1 rounded-md px-1 py-3.5 font-semibold text-navy/75 transition-colors hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-deep/30"
          >
            188
          </a>{" "}
          (CVV) ou 192.
        </span>
      </p>
      <nav
        aria-label="Links institucionais"
        className="mt-1 flex flex-wrap items-center justify-center gap-x-2.5 lg:mt-0 lg:flex-none lg:justify-end lg:gap-x-5"
      >
        <Link to="/privacidade" className={LINK}>
          Privacidade
        </Link>
        <Link to="/termos" className={LINK}>
          Termos de uso
        </Link>
        <Link to="/sobre" className={LINK}>
          Sobre nós
        </Link>
        <a href="mailto:contato@apostanofuturo.online" className={LINK}>
          Contato
        </a>
      </nav>
    </footer>
  );
}
