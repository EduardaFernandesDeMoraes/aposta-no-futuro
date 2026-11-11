import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, ChevronRight, HeartHandshake, Phone, Users } from "lucide-react";
import { AppShell, openXande } from "@/components/app-shell";
import { XandeAvatar } from "@/components/xande-avatar";
import { useLocalStorage } from "@/hooks/use-local-storage";

export const Route = createFileRoute("/cuidar")({
  head: () => ({
    meta: [
      { title: "Cuidar de você | Aposta no Futuro" },
      {
        name: "description",
        content:
          "Autoavaliação anônima, guia para parar de apostar, guia para a rede de apoio, conversa com o Xande e canais de ajuda gratuitos, num só lugar.",
      },
      { property: "og:title", content: "Cuidar de você | Aposta no Futuro" },
      { property: "og:url", content: "https://apostanofuturo.online/cuidar" },
    ],
    links: [{ rel: "canonical", href: "https://apostanofuturo.online/cuidar" }],
  }),
  component: CuidarPage,
});

function tierLabel(score: number) {
  if (score === 0) return "Sem risco";
  if (score <= 2) return "Risco leve";
  if (score <= 7) return "Risco moderado";
  return "Risco alto";
}

const ROW =
  "group flex min-h-[4.5rem] w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-teal-soft/60 lg:px-6";
const ROW_ICON =
  "grid h-11 w-11 flex-none place-items-center rounded-full bg-teal-soft text-teal-deep";
const ROW_ARROW =
  "h-5 w-5 flex-none text-muted-foreground transition-transform group-hover:translate-x-0.5";

/**
 * Três blocos e nada mais: a ajuda imediata, a autoavaliação (a superfície
 * rica da tela) e uma lista com os outros caminhos. Sem prévias de conversa
 * ou de passos: cada linha diz o que é e leva até lá.
 */
function CuidarPage() {
  const [assessment] = useLocalStorage<{ score: number; at: string } | null>(
    "anf.autoavaliacao",
    null,
  );

  return (
    <AppShell title="Cuidar de você" intro="Entender, pausar e pedir apoio. No seu ritmo.">
      {/* Celular: ajuda, autoavaliação, lista. Desktop: autoavaliação à esquerda,
          ajuda e lista à direita, terminando na mesma linha. */}
      <div className="grid gap-4 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:gap-y-4">
        <Link
          to="/autoavaliacao"
          className="group order-2 flex flex-col rounded-[1.75rem] bg-teal-ink p-6 text-white shadow-soft transition-colors hover:bg-[#0c5c52] lg:order-none lg:col-span-7 lg:row-span-2 lg:rounded-[2.25rem] lg:p-10"
        >
          <span className="text-sm text-white/80">
            {assessment
              ? `Seu último resultado: ${tierLabel(assessment.score)}`
              : "Autoavaliação · 9 perguntas · 2 min"}
          </span>
          <span className="mt-3 text-[1.6rem] font-semibold leading-tight tracking-[-0.02em] lg:mt-4 lg:max-w-[18ch] lg:text-[2.5rem]">
            Como está sua relação com as apostas?
          </span>
          <span className="mt-3 max-w-[40ch] text-[0.95rem] leading-relaxed text-white/80 lg:text-lg">
            Anônima e rápida. As respostas ficam só com você.
          </span>
          <span className="mt-6 inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-teal-ink transition-colors group-hover:bg-teal-soft lg:mt-auto">
            {assessment ? "Refazer a autoavaliação" : "Começar agora"}
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>

        <Link
          to="/ajuda"
          className="group order-1 flex min-h-[4.5rem] items-center gap-4 rounded-3xl bg-coral px-5 py-4 text-navy transition-colors hover:bg-[#ff7466] lg:order-none lg:col-span-5 lg:rounded-[2rem] lg:px-6"
        >
          <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-navy text-white">
            <Phone className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-lg font-semibold leading-snug">Preciso de ajuda agora</span>
            <span className="block text-sm text-navy/80">CVV 188, CAPS e emergência</span>
          </span>
          <ArrowRight className="h-5 w-5 flex-none transition-transform group-hover:translate-x-0.5" />
        </Link>

        <ul className="order-3 divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card lg:order-none lg:col-span-5 lg:rounded-[2rem]">
          <li>
            <button type="button" onClick={openXande} className={ROW}>
              <XandeAvatar className="h-11 w-11" />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-navy">Conversar com o Xande</span>
                <span className="block text-sm text-muted-foreground">
                  Para quando bater a vontade
                </span>
              </span>
              <ChevronRight className={ROW_ARROW} />
            </button>
          </li>
          <li>
            <Link to="/guia/parar-de-apostar" className={ROW}>
              <span className={ROW_ICON}>
                <BookOpen className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-navy">Como parar de apostar</span>
                <span className="block text-sm text-muted-foreground">Guia em 7 passos</span>
              </span>
              <ChevronRight className={ROW_ARROW} />
            </Link>
          </li>
          <li>
            <Link to="/guia/rede-de-apoio" className={ROW}>
              <span className={ROW_ICON}>
                <HeartHandshake className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-navy">Como ajudar alguém que aposta</span>
                <span className="block text-sm text-muted-foreground">
                  Guia para a rede de apoio
                </span>
              </span>
              <ChevronRight className={ROW_ARROW} />
            </Link>
          </li>
          <li>
            <Link to="/comunidade" className={ROW}>
              <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-muted text-navy/70">
                <Users className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-navy">Comunidade</span>
                  <span className="rounded-full bg-gold-soft px-2 py-0.5 text-xs font-semibold text-gold-deep">
                    Em breve
                  </span>
                </span>
                <span className="block text-sm text-muted-foreground">
                  Entre na lista de espera
                </span>
              </span>
              <ChevronRight className={ROW_ARROW} />
            </Link>
          </li>
        </ul>
      </div>
    </AppShell>
  );
}
