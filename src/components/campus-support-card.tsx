import { useState } from "react";
import { ChevronDown, ExternalLink, MapPin, Phone } from "lucide-react";
import type { Partner } from "@/lib/partners";
import { track, EVENTS } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/** "Apoio no seu campus": canais oficiais da instituição + CVV 188. */
export function CampusSupportCard({
  partner,
  className,
}: {
  partner: Partner;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <section
      className={cn(
        "overflow-hidden rounded-3xl border border-teal/30 bg-card shadow-card",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => {
          if (!open) track(EVENTS.campusSupportOpened);
          setOpen((v) => !v);
        }}
        aria-expanded={open}
        className="flex w-full items-center gap-3 p-4 text-left"
      >
        <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-[#E1F5EE] text-[#0d6b60]">
          <MapPin className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold leading-tight text-navy">
            Apoio no seu campus
          </span>
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
            {partner.supportTitle}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 flex-none text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="animate-fade-in border-t border-border px-4 pb-4 pt-3">
          <p className="text-xs leading-relaxed text-muted-foreground">{partner.supportText}</p>
          <ul className="mt-3 space-y-2">
            {partner.channels.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  target={c.href?.startsWith("http") ? "_blank" : undefined}
                  rel={c.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-3 rounded-2xl bg-background px-3 py-2.5 transition-colors hover:bg-[#F0FAF7]"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#0d6b60]">
                      {c.label}
                    </span>
                    <span className="block break-words text-sm font-medium leading-snug text-navy">
                      {c.detail}
                    </span>
                  </span>
                  {c.href?.startsWith("http") && (
                    <ExternalLink className="h-4 w-4 flex-none text-muted-foreground" />
                  )}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="tel:188"
            className="mt-3 flex items-center justify-center gap-2 rounded-full bg-coral px-4 py-3 text-sm font-semibold text-coral-foreground shadow-soft transition-colors hover:bg-[#eb4436]"
          >
            <Phone className="h-4 w-4" strokeWidth={2.5} />
            Em crise? Ligue 188 (CVV, 24h)
          </a>
          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            Contatos públicos divulgados pela instituição. Confirme horários no site oficial.
          </p>
        </div>
      )}
    </section>
  );
}
