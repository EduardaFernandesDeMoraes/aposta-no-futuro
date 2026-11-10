import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Phone, MapPin, MessageSquare, ExternalLink } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useEffect } from "react";
import { trackOnce, EVENTS } from "@/lib/analytics";

export const Route = createFileRoute("/ajuda")({
  head: () => ({
    meta: [
      { title: "Apoio | Aposta no Futuro" },
      {
        name: "description",
        content:
          "Canais de apoio gratuito e sigiloso: CVV 188 e CAPS. Você não está sozinho.",
      },
      { property: "og:title", content: "Apoio — Aposta no Futuro" },
      {
        property: "og:description",
        content:
          "Canais gratuitos e sigilosos de apoio emocional: CVV 188 e CAPS. Pedir ajuda é um ato de força.",
      },
      { property: "og:url", content: "https://apostanofuturo.online/ajuda" },
    ],
    links: [{ rel: "canonical", href: "https://apostanofuturo.online/ajuda" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "O que é o CVV e como funciona o 188?",
              acceptedAnswer: {
                "@type": "Answer",
                text:
                  "O CVV (Centro de Valorização da Vida) oferece apoio emocional gratuito e sigiloso 24 horas por dia pelo telefone 188 e pelo chat no site cvv.org.br.",
              },
            },
            {
              "@type": "Question",
              name: "Como encontrar o CAPS mais próximo?",
              acceptedAnswer: {
                "@type": "Answer",
                text:
                  "Ligue para a UBS (Unidade Básica de Saúde) do seu bairro e peça o endereço do CAPS mais próximo, ou busque no site da sua Prefeitura por 'CAPS + nome do município'. O atendimento é gratuito pelo SUS.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: AjudaPage,
});

function AjudaPage() {
  useEffect(() => {
    trackOnce(EVENTS.helpClick);
  }, []);

  return (
    <AppShell title="Apoio" titleAs="p">
      {/* Acolhimento */}
      <div className="pb-6 lg:pb-10">
        <p className="font-script text-[2rem] font-bold leading-none text-teal-deep lg:text-[2.75rem]">
          Respira.
        </p>
        <h1 className="mt-2 text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.02em] text-navy lg:text-[2.75rem] lg:tracking-[-0.03em]">
          Você não está sozinho(a).
        </h1>
        <p className="mt-2 max-w-[56ch] text-[0.95rem] leading-relaxed text-muted-foreground lg:mt-3 lg:text-lg">
          Canais gratuitos, sigilosos e preparados para te ouvir.
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-12">
      {/* CVV */}
      <section
        aria-labelledby="cvv"
        className="overflow-hidden rounded-[1.75rem] bg-teal-ink p-6 text-white shadow-soft lg:col-span-7 lg:rounded-[2.25rem] lg:p-10"
      >
        <h2 id="cvv" className="text-xl font-semibold leading-snug lg:text-[1.75rem]">
          CVV: Centro de Valorização da Vida
        </h2>

        <a
          href="tel:188"
          className="mt-5 flex items-center gap-4 rounded-2xl bg-white p-4 text-teal-ink transition-colors hover:bg-teal-soft lg:mt-8 lg:p-6"
          aria-label="Ligar para o CVV 188"
        >
          <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-teal-soft">
            <Phone className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-2xl font-bold tracking-tight lg:text-[2.25rem]">Ligar 188</span>
            <span className="block text-sm text-teal-ink/80">24h · gratuito · sigiloso</span>
          </span>
        </a>

        <a
          href="https://www.cvv.org.br"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex min-h-12 items-center gap-2 rounded-2xl px-4 text-sm font-semibold text-white ring-1 ring-white/30 transition-colors hover:bg-white/10"
        >
          <MessageSquare className="h-4 w-4" />
          Conversar pelo chat do CVV
          <ExternalLink className="ml-auto h-4 w-4 text-white/80" />
        </a>
      </section>

      <div className="lg:col-span-5">
      {/* CAPS */}
      <section aria-labelledby="caps" className="mt-8 lg:mt-0 lg:rounded-[2rem] lg:border lg:border-border lg:bg-card lg:p-8">
        <h2 id="caps" className="text-lg font-semibold text-navy lg:text-xl">
          CAPS: atendimento pelo SUS
        </h2>
        <p className="mt-2 leading-relaxed text-navy/80">
          Acompanhamento gratuito, inclusive para dependências. A UBS do seu
          bairro indica o CAPS mais próximo.
        </p>
        <a
          href="https://www.google.com/search?q=CAPS+mais+pr%C3%B3ximo+de+mim"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex min-h-12 items-center gap-2 rounded-2xl border border-border bg-card px-4 text-sm font-semibold text-teal-deep transition-colors hover:bg-teal-soft"
        >
          <MapPin className="h-4 w-4" />
          Buscar o CAPS mais próximo
          <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground" />
        </a>
      </section>

      {/* Emergência */}
      <section aria-labelledby="emergencia" className="mt-8 rounded-3xl bg-coral-soft p-5">
        <h2 id="emergencia" className="font-semibold leading-snug text-navy">
          Emergência médica
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-navy/80">
          Ligue 192 (SAMU) ou vá ao pronto-socorro mais próximo.
        </p>
        <a
          href="tel:192"
          className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-full bg-coral-deep px-5 text-sm font-semibold text-white transition-colors hover:bg-[#9c2b20]"
          aria-label="Ligar para o SAMU 192"
        >
          <Phone className="h-4 w-4" />
          Ligar 192
        </a>
      </section>

      </div>
      </div>

      <Link
        to="/guia/rede-de-apoio"
        className="mt-8 flex min-h-16 items-center gap-3 rounded-3xl border border-border bg-card px-5 py-4 transition-colors hover:border-teal-deep/40 lg:mt-12 lg:px-8"
      >
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-navy">A ajuda é para outra pessoa?</span>
          <span className="block text-sm text-muted-foreground">
            Veja o guia para a rede de apoio: sinais, como conversar e para onde levar.
          </span>
        </span>
        <ArrowRight className="h-5 w-5 flex-none text-teal-deep" />
      </Link>
    </AppShell>
  );
}
