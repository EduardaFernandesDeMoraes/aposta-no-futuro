import { createFileRoute, Link } from "@tanstack/react-router";
import { Calculator, ClipboardCheck } from "lucide-react";
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
      "Apostar demais não é falha de caráter: é um comportamento que vicia. Perceber é o primeiro passo. Você pode começar fazendo a autoavaliação PGSI aqui no app.",
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
      "Contar pra uma pessoa querida tira o peso do segredo. Você não precisa detalhar tudo, basta dizer 'estou tentando parar de apostar' já muda o jogo.",
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
      "Use o Simulador pra ver quanto você deixa de perder por semana, mês e ano. Direcione parte disso pra uma meta concreta, mesmo que pequena. Ver o valor crescer motiva a continuar.",
  },
  {
    n: 6,
    title: "Busque apoio profissional quando precisar",
    text:
      "Ligue 188 (CVV, 24h e gratuito) se estiver em crise. Para acompanhamento, procure o CAPS mais próximo pelo SUS, com atendimento gratuito e sigiloso.",
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
    <AppShell
      title="Como parar de apostar online"
      intro="Sete passos, sem julgamento, para quem decidiu sair do ciclo das bets. Vai no seu ritmo: cada passo já conta."
    >
      <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-16">
      <ol className="relative lg:col-span-7">
        <span
          aria-hidden="true"
          className="absolute bottom-6 left-[17px] top-4 w-[2px] rounded-full bg-border lg:left-[21px]"
        />
        {STEPS.map((s) => (
          <li key={s.n} id={`passo-${s.n}`} className="relative flex scroll-mt-28 gap-4 pb-8 last:pb-0 lg:gap-6 lg:pb-12">
            <span className="tabular relative z-10 grid h-9 w-9 flex-none place-items-center rounded-full border-2 border-teal-deep bg-background text-sm font-semibold text-teal-deep lg:h-11 lg:w-11 lg:text-base">
              {s.n}
            </span>
            <div className="min-w-0 pt-1">
              <h2 className="text-[1.1rem] font-semibold leading-snug text-navy lg:text-[1.5rem] lg:tracking-[-0.01em]">{s.title}</h2>
              <p className="mt-2 max-w-[62ch] leading-relaxed text-navy/80 lg:mt-3 lg:text-lg lg:leading-[1.7]">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <aside className="lg:sticky lg:top-28 lg:col-span-5">
      <nav aria-label="Passos do guia" className="hidden rounded-[2rem] border border-border bg-card p-6 lg:block">
        <p className="text-sm font-semibold text-navy">Neste guia</p>
        <ol className="mt-3 space-y-1">
          {STEPS.map((s) => (
            <li key={s.n}>
              <a
                href={`#passo-${s.n}`}
                className="flex min-h-10 items-center gap-3 rounded-xl px-2 text-sm text-navy/80 transition-colors hover:bg-teal-soft hover:text-navy"
              >
                <span className="tabular w-5 text-right font-semibold text-teal-deep">{s.n}</span>
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <section className="mt-12 rounded-3xl bg-teal-soft p-6 lg:mt-6 lg:rounded-[2rem] lg:p-8" aria-labelledby="comece">
        <p className="font-script text-[1.75rem] font-bold leading-none text-teal-deep">
          Um passo só
        </p>
        <h2 id="comece" className="mt-2 text-[1.3rem] font-semibold leading-snug text-navy">
          Não precisa fazer tudo hoje.
        </h2>
        <p className="mt-2 leading-relaxed text-navy/80">
          Um bom começo é entender onde você está agora.
        </p>
        <Button
          asChild
          className="mt-5 min-h-12 w-full rounded-full bg-teal-deep text-sm font-semibold text-white hover:bg-teal-ink"
        >
          <Link to="/autoavaliacao">
            <ClipboardCheck className="mr-1 h-4 w-4" />
            Fazer a autoavaliação
          </Link>
        </Button>
        <Link
          to="/simulador"
          className="mt-2 flex min-h-11 items-center justify-center gap-1.5 text-sm font-semibold text-teal-ink hover:underline"
        >
          <Calculator className="h-4 w-4" />
          Ou ver o que seu dinheiro pode virar
        </Link>
      </section>

      </aside>
      </div>
    </AppShell>
  );
}
