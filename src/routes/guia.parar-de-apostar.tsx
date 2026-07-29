import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Phone, Users, Calculator, ClipboardCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/guia/parar-de-apostar")({
  head: () => ({
    meta: [
      { title: "Como parar de apostar online: Guia | Aposta no Futuro" },
      {
        name: "description",
        content:
          "Guia prático, passo a passo, para parar de apostar online. Estratégias reais, apoio gratuito e caminhos de recomeço.",
      },
      { property: "og:title", content: "Como parar de apostar online — Guia prático" },
      {
        property: "og:description",
        content:
          "Passo a passo acolhedor pra sair do ciclo das bets: bloqueios, apoio, autoavaliação e comunidade.",
      },
      { property: "og:url", content: "https://apostanofuturo.online/guia/parar-de-apostar" },
      { property: "og:type", content: "article" },
    ],
    links: [
      { rel: "canonical", href: "https://apostanofuturo.online/guia/parar-de-apostar" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Como parar de apostar online — Guia prático",
          description:
            "Guia passo a passo para quem quer parar de apostar online: reconhecimento, bloqueios, apoio e comunidade.",
          author: { "@type": "Organization", name: "Aposta no Futuro" },
          publisher: {
            "@type": "Organization",
            name: "Aposta no Futuro",
            logo: {
              "@type": "ImageObject",
              url: "https://apostanofuturo.online/web-app-manifest-512x512.png",
            },
          },
          mainEntityOfPage:
            "https://apostanofuturo.online/guia/parar-de-apostar",
        }),
      },
    ],
  }),
  component: GuiaPararDeApostar,
});

const STEPS = [
  {
    n: 1,
    title: "Reconheça o padrão sem se julgar",
    text:
      "Apostar demais não é falha de caráter — é um comportamento que vicia. Perceber é o primeiro passo. Você pode começar fazendo a autoavaliação PGSI aqui no app.",
  },
  {
    n: 2,
    title: "Corte o acesso imediato",
    text:
      "Desinstale os apps de bet, saia das contas, ative bloqueios de sites e remova métodos de pagamento salvos. Quanto mais fricção, mais tempo você ganha antes do impulso virar aposta.",
  },
  {
    n: 3,
    title: "Diga em voz alta pra alguém de confiança",
    text:
      "Contar pra uma pessoa querida tira o peso do segredo. Você não precisa detalhar tudo — só dizer 'estou tentando parar de apostar' já muda o jogo.",
  },
  {
    n: 4,
    title: "Tenha um plano pros gatilhos",
    text:
      "Anote as horas e situações em que a vontade aparece (dia de pagamento, jogo do time, tédio, estresse). Tenha uma resposta pronta: respirar, caminhar, abrir o Simulador, chamar o Xande.",
  },
  {
    n: 5,
    title: "Transforme o dinheiro em algo visível",
    text:
      "Use o Simulador pra ver quanto você deixa de perder por semana, mês e ano. Direcione parte disso pra uma meta concreta — mesmo pequena. Ver o valor crescer motiva a continuar.",
  },
  {
    n: 6,
    title: "Busque apoio profissional quando precisar",
    text:
      "Ligue 188 (CVV, 24h e gratuito) se estiver em crise. Para acompanhamento, procure o CAPS mais próximo pelo SUS — atendimento gratuito e sigiloso.",
  },
  {
    n: 7,
    title: "Aceite recaídas como parte do caminho",
    text:
      "Se apostar de novo, isso não apaga o que você já construiu. Reinicie o contador, respira e volta pra rota. Cada recomeço conta.",
  },
];

function GuiaPararDeApostar() {
  return (
    <AppShell title="Como parar de apostar online">
      <Link
        to="/"
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-navy"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Voltar ao início
      </Link>

      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal">
          Guia prático
        </p>
        <h2 className="mt-1 text-xl font-bold leading-tight text-navy">
          Como parar de apostar online — 7 passos pra recomeçar
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Um caminho passo a passo, sem julgamento, pra quem decidiu sair do
          ciclo das bets. Vai no seu ritmo — cada passo já é uma vitória.
        </p>
      </header>

      <ol className="space-y-4">
        {STEPS.map((s) => (
          <li
            key={s.n}
            className="rounded-3xl border border-border bg-card p-5 shadow-card"
          >
            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-teal/10 text-sm font-bold text-teal">
                {s.n}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-navy">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {s.text}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <section className="mt-8 rounded-3xl bg-gradient-to-br from-teal to-[#0fa693] p-6 text-teal-foreground shadow-soft">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider opacity-90">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Próximo passo
        </div>
        <h3 className="mt-2 text-lg font-bold">Comece agora, com um passo só</h3>
        <p className="mt-1 text-sm opacity-95">
          Escolha uma ação abaixo. Não precisa fazer tudo hoje.
        </p>
        <div className="mt-4 grid gap-2">
          <Button
            asChild
            className="h-11 rounded-full bg-white/20 text-sm font-semibold text-white hover:bg-white/30"
          >
            <Link to="/autoavaliacao">
              <ClipboardCheck className="mr-1 h-4 w-4" />
              Fazer a autoavaliação
            </Link>
          </Button>
          <Button
            asChild
            className="h-11 rounded-full bg-white/20 text-sm font-semibold text-white hover:bg-white/30"
          >
            <Link to="/simulador">
              <Calculator className="mr-1 h-4 w-4" />
              Ver quanto deixo de perder
            </Link>
          </Button>
          <Button
            asChild
            className="h-11 rounded-full bg-white/20 text-sm font-semibold text-white hover:bg-white/30"
          >
            <Link to="/comunidade">
              <Users className="mr-1 h-4 w-4" />
              Entrar na Comunidade
            </Link>
          </Button>
        </div>
      </section>

      <section className="mt-5 rounded-3xl border border-coral/30 bg-coral/5 p-5">
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-coral/15 text-coral">
            <Phone className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-navy">
              Em crise? Ligue 188 (CVV)
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Atendimento 24h, gratuito e sigiloso. Este guia é um apoio e não
              substitui acompanhamento profissional.
            </p>
            <div className="mt-3">
              <Button
                asChild
                className="h-10 rounded-full bg-coral text-coral-foreground transition-all duration-200 hover:bg-[#eb4436]"
              >
                <Link to="/ajuda">Ver canais de apoio</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
