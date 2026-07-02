import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, MapPin, Heart, ArrowLeft, MessageSquare, ExternalLink } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/ajuda")({
  head: () => ({
    meta: [
      { title: "Apoio | Aposta no Futuro" },
      {
        name: "description",
        content:
          "Canais de apoio gratuito e sigiloso: CVV 188 e CAPS. Você não está sozinho.",
      },
    ],
  }),
  component: AjudaPage,
});

function AjudaPage() {
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
        <h1 className="text-lg font-bold text-navy">
          Você não está sozinho(a)
        </h1>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Pedir ajuda é um ato de força. Respira. Estamos com você.
        </p>
      </section>

      {/* CVV */}
      <section className="mb-5 overflow-hidden rounded-3xl bg-gradient-to-br from-teal to-[#0fa693] text-teal-foreground shadow-soft">
        <div className="p-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider opacity-90">
            <Heart className="h-3.5 w-3.5" />
            Atendimento imediato
          </div>
          <h2 className="mt-2 text-xl font-bold">
            CVV — Centro de Valorização da Vida
          </h2>
          <p className="mt-1 text-sm opacity-95">
            Atendimento 24 horas, gratuito e sigiloso. Pode ligar ou conversar
            pelo site.
          </p>

          <a
            href="tel:188"
            className="mt-5 flex items-center gap-3 rounded-2xl bg-white/20 p-4 backdrop-blur-sm transition-transform active:scale-[0.98]"
          >
            <div className="grid h-12 w-12 place-items-center rounded-full bg-white/25">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-bold">Ligar 188</div>
              <div className="text-xs opacity-90">
                24h · gratuito · sigiloso
              </div>
            </div>
          </a>

          <a
            href="https://www.cvv.org.br"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium transition-colors hover:bg-white/20"
          >
            <MessageSquare className="h-4 w-4" />
            Acessar chat no site do CVV
            <ExternalLink className="ml-auto h-3.5 w-3.5 opacity-80" />
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
          className="rounded-full bg-navy px-6 text-navy-foreground hover:bg-navy/90"
        >
          <Link to="/comunidade">Ir para a Comunidade</Link>
        </Button>
      </div>
    </AppShell>
  );
}
