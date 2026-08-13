import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, MapPin, Heart, ArrowLeft, MessageSquare, ExternalLink } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { SensitiveFooter } from "@/components/sensitive-footer";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { track, EVENTS } from "@/lib/analytics";

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
    track(EVENTS.helpClick);
  }, []);

  return (
    <AppShell title="Apoio">
      <Link
        to="/"
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-navy"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Voltar ao início
      </Link>

      {/* Welcome */}
      <section className="mb-6 text-center">
        <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-teal/10 text-2xl">
          💚
        </div>
        <h2 className="text-lg font-bold text-navy">
          Você não está sozinho(a)
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Pedir ajuda é um ato de força. Respira. Estamos com você.
        </p>
      </section>

      {/* CVV */}
      <section className="mb-5 overflow-hidden rounded-3xl bg-gradient-to-br from-[#0d6b60] to-[#094e46] text-white shadow-soft">
        <div className="p-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/90">
            <Heart className="h-3.5 w-3.5" />
            Atendimento imediato
          </div>
          <h2 className="mt-2 text-xl font-bold text-white">
            CVV — Centro de Valorização da Vida
          </h2>
          <p className="mt-1 text-sm text-white/95">
            Atendimento 24 horas, gratuito e sigiloso. Pode ligar ou conversar
            pelo site.
          </p>

          <a
            href="tel:188"
            className="mt-5 flex items-center gap-3 rounded-2xl bg-white/20 p-4 text-white backdrop-blur-sm transition-transform active:scale-[0.98]"
            aria-label="Ligar para o CVV 188"
          >
            <div className="grid h-12 w-12 place-items-center rounded-full bg-white/25">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-extrabold tracking-tight">Ligar 188</div>
              <div className="text-xs text-white/90">
                24h · gratuito · sigiloso
              </div>
            </div>
          </a>

          <a
            href="https://www.cvv.org.br"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/20"
          >
            <MessageSquare className="h-4 w-4" />
            Acessar chat no site do CVV
            <ExternalLink className="ml-auto h-3.5 w-3.5 text-white/80" />
          </a>
        </div>
      </section>

      {/* CAPS */}
      <section className="mb-5 rounded-3xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-cyan/10 text-cyan">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-navy">
              CAPS — Centros de Atenção Psicossocial
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Gratuito pelo SUS
            </p>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Os CAPS oferecem atendimento psicossocial gratuito, incluindo
          acompanhamento para dependências. Procure a unidade mais próxima do
          seu município — você pode buscar no site da Prefeitura ou na UBS da
          sua região.
        </p>

        <div className="mt-4 rounded-2xl bg-secondary p-4">
          <p className="text-xs leading-relaxed text-secondary-foreground">
            <strong className="text-navy">Como encontrar:</strong> ligue para a
            UBS (Unidade Básica de Saúde) do seu bairro e peça o endereço do
            CAPS mais próximo. Ou busque no site da Prefeitura da sua cidade
            por “CAPS + nome do seu município”.
          </p>
        </div>

        <a
          href="https://www.google.com/search?q=CAPS+mais+pr%C3%B3ximo+de+mim"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center gap-2 rounded-2xl border border-cyan/40 bg-cyan/5 px-4 py-3 text-sm font-semibold text-cyan transition-colors hover:bg-cyan/10"
        >
          <MapPin className="h-4 w-4" />
          Buscar o CAPS mais próximo
          <ExternalLink className="ml-auto h-3.5 w-3.5 opacity-80" />
        </a>
      </section>

      {/* Emergência */}
      <section className="mb-5 rounded-3xl border border-coral/40 bg-coral/10 p-5">
        <p className="text-sm font-semibold leading-relaxed text-navy">
          Se for uma emergência, ligue 192 ou vá ao pronto-socorro mais próximo.
        </p>
        <a
          href="tel:192"
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-coral-foreground shadow-soft transition-transform active:scale-[0.98]"
          aria-label="Ligar para o SAMU 192"
        >
          <Phone className="h-4 w-4" />
          Ligar 192
        </a>
      </section>


      {/* Disclaimer */}
      <section className="rounded-3xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-gold/10 text-gold">
            <Heart className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-navy">
              Lembrete gentil
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Este app é um apoio e não substitui o atendimento de um
              profissional de saúde. Se você está em crise ou precisa de ajuda
              especializada, os canais acima estão preparados para te
              acolher.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-8 text-center">
        <Button
          asChild
          className="rounded-full bg-navy px-6 text-navy-foreground transition-all duration-200 hover:bg-navy/90"
        >
          <Link to="/comunidade">Ir para a Comunidade</Link>
        </Button>
      </div>
      <SensitiveFooter />
    </AppShell>
  );
}
