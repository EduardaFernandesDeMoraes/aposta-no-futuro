import { cn } from "@/lib/utils";

/**
 * Assinatura do produto: "AF" em Poppins + "People" ou "Campus" em cursiva,
 * com selo opcional da instituição parceira ("+ FIPECAFI").
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
    <Tag className={cn("flex min-w-0 items-center gap-2", className)}>
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
            dark ? "text-[#7fe6da]" : "text-teal-deep",
          )}
        >
          {product}
        </span>
      </span>
      {partner ? (
        <span
          className={cn(
            "truncate rounded-full border px-2 py-0.5 text-xs font-semibold tracking-wide",
            dark
              ? "border-white/25 bg-white/10 text-white"
              : "border-border bg-card text-navy",
          )}
        >
          + {partner}
        </span>
      ) : null}
      <span className="sr-only">Aposta no Futuro</span>
    </Tag>
  );
}
