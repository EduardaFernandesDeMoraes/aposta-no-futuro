import { cn } from "@/lib/utils";

/**
 * Assinatura do produto: "AF" em Poppins + "People" ou "Campus" em cursiva,
 * com a instituição parceira depois de um divisor fino. No celular não cabe
 * lado a lado com o Xande e a Ajuda, então o nome dela vai para baixo.
 * `tone="dark"` para usar sobre fundo navy.
 */
export function BrandLockup({
  product,
  partner,
  className,
  tone = "light",
  as: Tag = "p",
}: {
  product: "People" | "Campus";
  partner?: string;
  className?: string;
  tone?: "light" | "dark";
  as?: "p" | "h1";
}) {
  const dark = tone === "dark";
  return (
    <Tag
      className={cn(
        "flex min-w-0",
        partner
          ? "flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-2.5"
          : "items-center",
        className,
      )}
    >
      <span className="flex items-baseline gap-1 whitespace-nowrap leading-none">
        <span
          className={cn(
            "text-lg font-extrabold tracking-tight sm:text-xl",
            dark ? "text-white" : "text-navy",
          )}
        >
          AF
        </span>
        <span
          className={cn(
            "font-script text-[1.5rem] font-bold leading-none sm:text-[1.65rem]",
            dark ? "text-mint" : "text-teal-deep",
          )}
        >
          {product}
        </span>
      </span>
      {partner ? (
        <>
          <span
            aria-hidden="true"
            className={cn(
              "hidden h-6 w-px flex-none sm:block",
              dark ? "bg-white/30" : "bg-navy/20",
            )}
          />
          <PartnerMark name={partner} className={dark ? "text-white" : "text-navy"} />
        </>
      ) : null}
      <span className="sr-only">Aposta no Futuro</span>
    </Tag>
  );
}

/**
 * Nome da instituição parceira ao lado da assinatura.
 * A FIPECAFI usa letras redesenhadas a partir do logo dela (traço fino, o
 * risco que atravessa o primeiro F e o que serve de barra do A). Se a
 * faculdade enviar o arquivo oficial, é só trocar o desenho aqui.
 */
function PartnerMark({ name, className }: { name: string; className?: string }) {
  if (name === "FIPECAFI") {
    return (
      <svg
        viewBox="-12 -4 252 48"
        role="img"
        aria-label="FIPECAFI"
        className={cn("h-3 w-auto flex-none sm:h-[18px]", className)}
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="4.4"
          strokeLinejoin="miter"
          strokeMiterlimit="6"
        >
          <path d="M14 40V2.2H34" />
          <path d="M44 0V40" />
          <path d="M58 40V2.2H69A10 10 0 0 1 69 22.2H58" />
          <path d="M108 2.2H90V37.8H108M90 20H105" />
          <path d="M146 6.6A18 18 0 1 0 146 33.4" />
          <path d="M158 40L172 3L186 40" />
          <path d="M200 40V2.2H219" />
          <path d="M230 0V40" />
        </g>
        <path fill="currentColor" d="M-10 29Q8 17.5 32 17V21Q11 21 -10 29Z" />
        <path fill="currentColor" d="M146 34Q172 22 217 20.5V24.5Q174 25.5 146 34Z" />
      </svg>
    );
  }
  return (
    <span className={cn("truncate text-sm font-normal uppercase tracking-[0.08em]", className)}>
      {name}
    </span>
  );
}
