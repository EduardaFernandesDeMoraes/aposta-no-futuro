import { cn } from "@/lib/utils";

/**
 * Assinatura do produto: "AF" em Poppins + "People" ou "Campus" em cursiva,
 * com selo opcional da instituição parceira ("+ FIPECAFI").
 */
export function BrandLockup({
  product,
  partner,
  className,
  as: Tag = "p",
}: {
  product: "People" | "Campus";
  partner?: string;
  className?: string;
  as?: "p" | "h1";
}) {
  return (
    <Tag className={cn("flex min-w-0 items-center gap-2", className)}>
      <span className="flex items-baseline gap-1 whitespace-nowrap leading-none">
        <span className="text-lg font-extrabold tracking-tight sm:text-xl">AF</span>
        <span className="font-script text-[1.45rem] font-bold leading-none text-[#0AF0FB] sm:text-[1.6rem]">
          {product}
        </span>
      </span>
      {partner ? (
        <span className="truncate rounded-full border border-white/25 bg-white/10 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-white">
          + {partner}
        </span>
      ) : null}
      <span className="sr-only">Aposta no Futuro</span>
    </Tag>
  );
}
