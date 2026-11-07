import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Instagram } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { track, trackOnce } from "@/lib/analytics";
import eduardaPhoto from "@/assets/eduarda.webp";
import luizPhoto from "@/assets/luiz.webp";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre nós — Aposta no Futuro" },
      {
        name: "description",
        content:
          "Como o Aposta no Futuro surgiu e quem faz o projeto: um app gratuito e anônimo de apoio para quem quer parar de apostar.",
      },
      { property: "og:title", content: "Sobre nós — Aposta no Futuro" },
      {
        property: "og:description",
        content:
          "A história por trás do Aposta no Futuro e as pessoas que constroem o projeto.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Sobre,
});

type Person = {
  photo: string;
  name: string;
  role: string;
  rolePill: string;
  text: string;
};

const PEOPLE: Person[] = [
  {
    photo: eduardaPhoto,
    name: "Eduarda Fernandes de Moraes",
    role: "Idealizadora",
    rolePill: "bg-teal-deep text-white",
    text: "22 anos, de Uberlândia. Jovem Aprendiz Espro e estudante do último ano de Ciências Contábeis. Idealizou o Aposta no Futuro e cuidou das telas, dos textos e da lógica do app.",
  },
  {
    photo: luizPhoto,
    name: "Luiz Santis",
    role: "Idealizador Operacional",
    rolePill: "bg-navy text-white",
    text: "23 anos. Graduando em Gestão Financeira pela FIPECAFI, com background em TI. Ajuda a traduzir a ideia em estrutura e execução.",
  },
];

function Sobre() {
  useEffect(() => {
    trackOnce("sobre_nos_visitada");
  }, []);

  return (
    <AppShell title="Sobre nós" intro="A história por trás do app e quem constrói ele.">
      <section className="max-w-[68ch]">
        <h2 className="text-lg font-semibold text-navy lg:text-xl">
          Como o Aposta no Futuro surgiu
        </h2>
        <div className="mt-2 space-y-3 leading-relaxed text-navy/80 lg:text-[1.05rem]">
          <p>
            O Aposta no Futuro começou com uma história real: alguém muito
            próximo de mim entrou no vício em apostas, e eu acompanhei essa
            luta de perto.
          </p>
          <p>
            Quando ele procurava ajuda, só encontrava aplicativos de bloqueio.
            Nenhum que acolhesse.
          </p>
          <p>
            O Aposta no Futuro nasceu daí: da diferença entre uma tranca e uma
            mão estendida. É gratuito, anônimo e feito para quem quer parar de
            apostar e para quem quer não começar.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-navy lg:text-xl">Quem faz</h2>
        <div className="mt-4 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2">
          {PEOPLE.map((p) => (
            <article
              key={p.name}
              className="flex h-full flex-col items-center rounded-3xl border border-border bg-card p-6 text-center"
            >
              <div className="rounded-full bg-teal-soft p-1.5">
                <img
                  src={p.photo}
                  alt={`Foto de ${p.name}`}
                  width={96}
                  height={96}
                  decoding="async"
                  className="h-24 w-24 rounded-full object-cover"
                />
              </div>
              <div className="mt-3 flex h-10 items-center justify-center">
                <h3 className="font-semibold leading-5 text-navy">
                  {p.name}
                </h3>
              </div>
              <span
                className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${p.rolePill}`}
              >
                {p.role}
              </span>
              <p className="mt-3 text-sm leading-relaxed text-navy/80">
                {p.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 flex flex-col gap-4 rounded-3xl bg-navy p-6 text-white sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Acompanhe o projeto</h2>
        <div className="sm:w-72">
          <a
            href="https://instagram.com/apostanofuturo.oficial"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("instagram_clicado")}
            aria-label="Abrir o Instagram do Aposta no Futuro"
            className="flex min-h-12 w-full items-center gap-3 rounded-full bg-white px-5 text-sm font-semibold text-navy transition-colors hover:bg-teal-soft"
          >
            <Instagram className="h-6 w-6 flex-none" />
            <span>@apostanofuturo.oficial</span>
          </a>
        </div>
      </section>

    </AppShell>
  );
}
