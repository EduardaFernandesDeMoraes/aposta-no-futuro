import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, ExternalLink, Phone, Share2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CampusSupportCard } from "@/components/campus-support-card";
import { useAccess } from "@/lib/access";
import { track, EVENTS } from "@/lib/analytics";
import { findPartner } from "@/lib/partners";

const URL = "https://apostanofuturo.online/guia/rede-de-apoio";

export const Route = createFileRoute("/guia/rede-de-apoio")({
  head: () => ({
    meta: [
      { title: "Como ajudar alguém que aposta: Guia para a rede de apoio | Aposta no Futuro" },
      {
        name: "description",
        content:
          "Guia para amigos, colegas e familiares de quem perdeu o controle nas apostas: sinais, como conversar sem julgamento e onde buscar ajuda gratuita.",
      },
      { property: "og:title", content: "Como ajudar alguém que aposta" },
      {
        property: "og:description",
        content:
          "Sinais para reparar, como puxar a conversa e para onde levar. Um guia para a rede de apoio.",
      },
      { property: "og:url", content: URL },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Como ajudar alguém que aposta — Guia para a rede de apoio",
          description:
            "Guia para amigos, colegas e familiares de quem perdeu o controle nas apostas online.",
          author: { "@type": "Organization", name: "Aposta no Futuro" },
          publisher: {
            "@type": "Organization",
            name: "Aposta no Futuro",
            logo: {
              "@type": "ImageObject",
              url: "https://apostanofuturo.online/web-app-manifest-512x512.png",
            },
          },
          mainEntityOfPage: URL,
        }),
      },
    ],
  }),
  component: GuiaRedeDeApoio,
});

const PARTS = [
  { id: "sinais", title: "Sinais para reparar" },
  { id: "conversa", title: "Como puxar a conversa" },
  { id: "nao-ajuda", title: "O que não ajuda" },
  { id: "onde", title: "Para onde levar" },
  { id: "voce", title: "Cuide de você também" },
];

const SIGNS = [
  "Pede dinheiro emprestado com frequência ou tem dívidas que não explica.",
  "Esconde o celular, muda de assunto ou mente sobre onde gastou.",
  "Demonstra irritação ou ansiedade quando não consegue apostar.",
  "Aposta de novo para tentar recuperar o que perdeu.",
  "Deixa de lado estudo, trabalho, sono ou pessoas de quem gostava.",
  "Fala das apostas como a saída para um aperto de dinheiro.",
];

const PHRASES = [
  {
    avoid: "Você está viciado.",
    say: "Tenho reparado que o dinheiro anda te preocupando. Quer conversar?",
  },
  {
    avoid: "É só parar.",
    say: "Imagino que não seja fácil. Como eu posso te ajudar?",
  },
  {
    avoid: "Olha o que você fez com a gente.",
    say: "Eu me importo com você, e isso me preocupa.",
  },
  {
    avoid: "Se apostar de novo, acabou.",
    say: "Se tiver uma recaída, me conta. A gente recomeça.",
  },
];

const DONT = [
  {
    title: "Pagar as dívidas ou emprestar dinheiro",
    text: "Alivia na hora e costuma bancar a próxima aposta. Se quiser ajudar numa conta, pague direto, nunca em mãos.",
  },
  {
    title: "Vigiar o celular ou as contas às escondidas",
    text: "Quebra a confiança, que é o que a conversa mais precisa.",
  },
  {
    title: "Dar sermão, ameaçar ou expor para outras pessoas",
    text: "A vergonha já é o que mais impede alguém de pedir ajuda.",
  },
  {
    title: "Encobrir faltas, atrasos e mentiras",
    text: "Proteger das consequências adia o momento de buscar apoio.",
  },
  {
    title: "Esperar que pare de uma vez",
    text: "Recaídas fazem parte do caminho. Cada recomeço conta.",
  },
];

function GuiaRedeDeApoio() {
  const [access] = useAccess();
  const partner = access.mode === "student" ? findPartner(access.partner) : undefined;
  const [shared, setShared] = useState<"idle" | "copied">("idle");

  async function share() {
    track(EVENTS.supportGuideShared);
    const data = {
      title: "Como ajudar alguém que aposta",
      text: "Um guia curto para quem quer ajudar alguém próximo que perdeu o controle nas apostas.",
      url: URL,
    };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(URL);
      setShared("copied");
      window.setTimeout(() => setShared("idle"), 2500);
    } catch {
      /* a pessoa fechou o compartilhamento: nada a fazer */
    }
  }

  return (
    <AppShell
      title="Como ajudar alguém que aposta"
      intro="Para colegas, amigos e familiares. Você não precisa resolver tudo: estar por perto, sem julgar, já ajuda."
    >
      <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-12">
        <article className="lg:col-span-7">
          {/* 1. Sinais */}
          <section id="sinais" aria-labelledby="sinais-t" className="scroll-mt-28">
            <h2 id="sinais-t" className="text-lg font-semibold text-navy lg:text-xl">
              Sinais para reparar
            </h2>
            <p className="mt-2 max-w-[62ch] leading-relaxed text-navy/80 lg:text-lg lg:leading-[1.7]">
              Nenhum sinal sozinho prova nada. O que conta é o conjunto e a mudança de
              comportamento.
            </p>
            <ul className="mt-4 divide-y divide-border rounded-3xl border border-border bg-card">
              {SIGNS.map((s) => (
                <li
                  key={s}
                  className="flex gap-3 px-4 py-3.5 text-[0.95rem] leading-relaxed text-navy lg:px-6 lg:text-base"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[0.6em] h-1.5 w-1.5 flex-none rounded-full bg-teal-deep"
                  />
                  {s}
                </li>
              ))}
            </ul>
          </section>

          {/* 2. Conversa: o que trocar por quê */}
          <section
            id="conversa"
            aria-labelledby="conversa-t"
            className="mt-12 scroll-mt-28 lg:mt-16"
          >
            <h2 id="conversa-t" className="text-lg font-semibold text-navy lg:text-xl">
              Como puxar a conversa
            </h2>
            <p className="mt-2 max-w-[62ch] leading-relaxed text-navy/80 lg:text-lg lg:leading-[1.7]">
              Escolha um momento calmo, a sós, longe de uma perda recente. Fale do que você percebeu
              e de como se sente, não de como a pessoa é.
            </p>
            <ul className="mt-5 space-y-5">
              {PHRASES.map((p) => (
                <li key={p.avoid} className="grid gap-2">
                  <p className="w-fit max-w-[85%] rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2.5 text-sm text-muted-foreground">
                    <span className="sr-only">Em vez de: </span>
                    <span className="line-through decoration-navy/30">{p.avoid}</span>
                  </p>
                  <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-tr-sm bg-teal-deep px-3.5 py-2.5 text-[0.95rem] text-white lg:text-base">
                    <span className="sr-only">Experimente: </span>
                    {p.say}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-5 max-w-[62ch] leading-relaxed text-navy/80 lg:text-lg lg:leading-[1.7]">
              Se a pessoa negar ou se irritar, não insista. Diga que a porta fica aberta e volte ao
              assunto outro dia.
            </p>
          </section>

          {/* 3. O que não ajuda */}
          <section
            id="nao-ajuda"
            aria-labelledby="nao-ajuda-t"
            className="mt-12 scroll-mt-28 lg:mt-16"
          >
            <h2 id="nao-ajuda-t" className="text-lg font-semibold text-navy lg:text-xl">
              O que não ajuda
            </h2>
            <dl className="mt-4 space-y-5">
              {DONT.map((d) => (
                <div key={d.title}>
                  <dt className="font-semibold leading-snug text-navy lg:text-lg">{d.title}</dt>
                  <dd className="mt-1 max-w-[62ch] leading-relaxed text-navy/80">{d.text}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* 4. Para onde levar */}
          <section id="onde" aria-labelledby="onde-t" className="mt-12 scroll-mt-28 lg:mt-16">
            <h2 id="onde-t" className="text-lg font-semibold text-navy lg:text-xl">
              Para onde levar
            </h2>
            <p className="mt-2 max-w-[62ch] leading-relaxed text-navy/80 lg:text-lg lg:leading-[1.7]">
              Ofereça companhia para o primeiro contato. Ligar junto ou ir junto faz diferença.
            </p>
            <ul className="mt-4 divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card">
              <li>
                <a
                  href="tel:188"
                  className="flex min-h-16 items-center gap-3 px-4 py-3 transition-colors hover:bg-teal-soft lg:px-6"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-navy">CVV, ligue 188</span>
                    <span className="block text-sm text-muted-foreground">
                      24h, gratuito e sigiloso. Atende quem aposta e quem está por perto.
                    </span>
                  </span>
                  <Phone className="h-5 w-5 flex-none text-teal-deep" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.google.com/search?q=CAPS+mais+pr%C3%B3ximo+de+mim"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-16 items-center gap-3 px-4 py-3 transition-colors hover:bg-teal-soft lg:px-6"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-navy">CAPS, pelo SUS</span>
                    <span className="block text-sm text-muted-foreground">
                      Acompanhamento gratuito. A UBS do bairro indica o mais próximo.
                    </span>
                  </span>
                  <ExternalLink className="h-5 w-5 flex-none text-teal-deep" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.google.com/search?q=Jogadores+An%C3%B4nimos+reuni%C3%B5es"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-16 items-center gap-3 px-4 py-3 transition-colors hover:bg-teal-soft lg:px-6"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-navy">Jogadores Anônimos</span>
                    <span className="block text-sm text-muted-foreground">
                      Grupos gratuitos de quem viveu o mesmo problema.
                    </span>
                  </span>
                  <ExternalLink className="h-5 w-5 flex-none text-teal-deep" />
                </a>
              </li>
              <li>
                <Link
                  to="/autoavaliacao"
                  className="flex min-h-16 items-center gap-3 px-4 py-3 transition-colors hover:bg-teal-soft lg:px-6"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-navy">A autoavaliação deste app</span>
                    <span className="block text-sm text-muted-foreground">
                      Anônima, em 2 minutos. Um jeito leve de a pessoa começar sozinha.
                    </span>
                  </span>
                  <ArrowRight className="h-5 w-5 flex-none text-teal-deep" />
                </Link>
              </li>
            </ul>
            {partner ? (
              <CampusSupportCard partner={partner} className="mt-4" />
            ) : (
              <p className="mt-4 max-w-[62ch] text-[0.95rem] leading-relaxed text-muted-foreground">
                Muitas faculdades têm atendimento psicológico ou de apoio ao estudante. Vale
                perguntar na secretaria.
              </p>
            )}
            <p className="mt-4 rounded-2xl bg-coral-soft px-4 py-3 text-sm leading-relaxed text-navy">
              Se houver risco imediato à vida, ligue{" "}
              <a
                href="tel:192"
                className="font-semibold text-coral-deep underline underline-offset-4"
              >
                192 (SAMU)
              </a>
              .
            </p>
          </section>

          {/* 5. Cuide de você */}
          <section
            id="voce"
            aria-labelledby="voce-t"
            className="mt-12 scroll-mt-28 rounded-3xl bg-teal-soft p-6 lg:mt-16 lg:rounded-[2rem] lg:p-10"
          >
            <p className="font-script text-[1.75rem] font-bold leading-none text-teal-deep lg:text-[2.25rem]">
              Você também conta
            </p>
            <h2
              id="voce-t"
              className="mt-2 text-[1.3rem] font-semibold leading-snug text-navy lg:text-[1.75rem] lg:tracking-[-0.01em]"
            >
              Cuide de você também
            </h2>
            <p className="mt-3 max-w-[62ch] leading-relaxed text-navy/85 lg:text-lg lg:leading-[1.7]">
              Conviver com isso cansa, e a culpa não é sua. Você não causou, não controla e não cura
              o problema de outra pessoa.
            </p>
            <p className="mt-3 max-w-[62ch] leading-relaxed text-navy/85 lg:text-lg lg:leading-[1.7]">
              Proteja o seu dinheiro: não empreste cartão, senha nem o seu nome. E procure apoio
              para você. O CVV e o CAPS também atendem a rede de apoio.
            </p>
          </section>
        </article>

        <aside className="mt-10 lg:col-span-5 lg:mt-0">
          <nav
            aria-label="Partes do guia"
            className="hidden rounded-[2rem] border border-border bg-card p-6 lg:block"
          >
            <h2 className="text-lg font-semibold text-navy lg:text-xl">Neste guia</h2>
            <ul className="mt-3 space-y-1">
              {PARTS.map((p) => (
                <li key={p.id}>
                  <a
                    href={`#${p.id}`}
                    className="flex min-h-11 items-center rounded-xl px-2 text-[0.95rem] text-navy/80 transition-colors hover:bg-teal-soft hover:text-navy"
                  >
                    {p.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <section
            aria-labelledby="enviar"
            className="rounded-3xl border border-border bg-card p-6 lg:mt-6 lg:rounded-[2rem] lg:p-8"
          >
            <h2 id="enviar" className="text-[1.15rem] font-semibold leading-snug text-navy">
              Conhece mais alguém nessa situação?
            </h2>
            <p className="mt-2 leading-relaxed text-navy/80">
              Envie este guia para quem também está por perto.
            </p>
            <button
              type="button"
              onClick={share}
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-teal-deep px-5 text-sm font-semibold text-white transition-colors hover:bg-teal-ink"
            >
              {shared === "copied" ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
              {shared === "copied" ? "Link copiado" : "Enviar este guia"}
            </button>
            <p aria-live="polite" className="sr-only">
              {shared === "copied" ? "Link copiado" : ""}
            </p>
            <Link
              to="/ajuda"
              className="mt-2 flex min-h-11 items-center justify-center gap-1.5 text-sm font-semibold text-teal-ink hover:underline"
            >
              Ver todos os canais de ajuda
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}
