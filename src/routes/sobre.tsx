import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Instagram, Heart } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { SensitiveFooter } from "@/components/sensitive-footer";
import { track, trackOnce } from "@/lib/analytics";
import eduardaPhoto from "@/assets/eduarda.png.asset.json";
import luizPhoto from "@/assets/luiz.png.asset.json";

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
    photo: eduardaPhoto.url,
    name: "Eduarda Fernandes de Moraes",
    role: "Idealizadora",
    rolePill: "bg-teal text-white",
    text: "22 anos, de Uberlândia. Jovem Aprendiz Espro e estudante do último ano de Ciências Contábeis. Idealizou o Aposta no Futuro e cuidou das telas, dos textos e da lógica do app.",
  },
  {
    photo: luizPhoto.url,
    name: "Luiz Santis",
    role: "Idealizador Operacional",
    rolePill: "bg-cyan text-white",
    text: "23 anos. Graduando em Gestão Financeira pela FIPECAFI, com background em TI. Ajuda a traduzir a ideia em estrutura e execução.",
  },
];

function Sobre() {
  useEffect(() => {
    trackOnce("sobre_nos_visitada");
  }, []);

  return (
    <AppShell title="Sobre nós">
      <div className="flex items-start gap-3 rounded-2xl border border-[#16BFAC] bg-[#E1F5EE] p-4">
        <Heart className="mt-0.5 h-5 w-5 flex-none text-[#16BFAC]" />
        <div>
          <h1 className="font-semibold text-[#16233C]">Sobre nós</h1>
          <p className="mt-1 text-sm text-slate-600">
            A história por trás do app e quem constrói ele todo dia.
          </p>
        </div>
      </div>

      <section className="mt-5 rounded-2xl bg-card p-4 shadow-card">
        <h2 className="text-sm font-semibold text-navy">
          Como o Aposta no Futuro surgiu
        </h2>
        <div className="mt-2 space-y-3 text-sm leading-relaxed text-slate-600">
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

      <section className="mt-5">
        <h2 className="text-sm font-semibold text-navy">Criadores</h2>
        <div className="mt-3 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2">
          {PEOPLE.map((p) => (
            <article
              key={p.name}
              className="flex h-full flex-col items-center rounded-2xl bg-card p-4 text-center shadow-card"
            >
              <div className="rounded-full bg-[#E1F5EE] p-1.5">
                <img
                  src={p.photo}
                  alt={`Foto de ${p.name}`}
                  width={96}
                  height={96}
                  loading="lazy"
                  className="h-24 w-24 rounded-full object-cover"
                />
              </div>
              <div className="mt-3 flex h-10 items-center justify-center">
                <h3 className="text-sm font-semibold leading-5 text-navy">
                  {p.name}
                </h3>
              </div>
              <span
                className={`mt-2 inline-block rounded-full px-3 py-1 text-[11px] font-semibold ${p.rolePill}`}
              >
                {p.role}
              </span>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {p.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-5 rounded-2xl bg-[#16233C] p-5 text-white shadow-card">
        <h2 className="text-sm font-semibold">Acompanhe o projeto</h2>
        <p className="mt-0.5 text-sm text-white/80">
          Conteúdo e apoio todos os dias.
        </p>
        <div className="mt-4">
          <a
            href="https://instagram.com/apostanofuturo.oficial"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("instagram_clicado")}
            aria-label="Abrir o Instagram do Aposta no Futuro"
            className="flex min-h-[52px] w-full items-center gap-3 rounded-full bg-teal px-4 text-sm font-semibold text-teal-foreground transition-all duration-200 hover:bg-[#14ac9b] active:scale-95"
          >
            <Instagram className="h-6 w-6 flex-none" />
            <span>@apostanofuturo.oficial</span>
          </a>
        </div>
      </section>

      <SensitiveFooter />
    </AppShell>
  );
}
