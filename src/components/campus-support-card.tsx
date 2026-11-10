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
        "overflow-hidden rounded-3xl border border-border bg-card",
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
        className="flex min-h-16 w-full items-center gap-3 p-4 text-left"
      >
        <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-teal-soft text-teal-deep">
          <MapPin className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold leading-tight text-navy">
            Apoio no seu campus
          </span>
          <span className="mt-0.5 block truncate text-sm text-muted-foreground">
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
          <p className="text-sm leading-relaxed text-muted-foreground">{partner.supportText}</p>
          <ul className="mt-3 space-y-2">
            {partner.channels.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  target={c.href?.startsWith("http") ? "_blank" : undefined}
                  rel={c.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-3 rounded-2xl bg-background px-3 py-2.5 transition-colors hover:bg-teal-soft"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-medium text-muted-foreground">
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
            className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-full bg-coral-soft px-4 text-sm font-semibold text-coral-deep transition-colors hover:bg-coral-soft-hover"
          >
            <Phone className="h-4 w-4" strokeWidth={2.5} />
            Em crise? Ligue 188 (CVV, 24h)
          </a>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Contatos públicos divulgados pela instituição. Confirme horários no site oficial.
          </p>
        </div>
      )}
    </section>
  );
}
