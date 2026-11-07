import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronRight,
  ClipboardCheck,
  Phone,
  Sparkles,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { AppShell, openXande } from "@/components/app-shell";
import { CampusSupportCard } from "@/components/campus-support-card";
import { useAccess } from "@/lib/access";
import { findPartner } from "@/lib/partners";

export const Route = createFileRoute("/cuidar")({
  head: () => ({
    meta: [
      { title: "Cuidar de você | Aposta no Futuro" },
      {
        name: "description",
        content:
          "Autoavaliação anônima, guia para parar de apostar, conversa com o Xande e canais de apoio gratuitos, num só lugar.",
      },
      { property: "og:title", content: "Cuidar de você | Aposta no Futuro" },
      { property: "og:url", content: "https://apostanofuturo.online/cuidar" },
    ],
    links: [{ rel: "canonical", href: "https://apostanofuturo.online/cuidar" }],
  }),
  component: CuidarPage,
});

function CuidarPage() {
  const [access] = useAccess();
  const partner = access.mode === "student" ? findPartner(access.partner) : undefined;

  return (
    <AppShell
      title="Cuidar de você"
      intro="Tudo o que pode te ajudar a entender, pausar e pedir apoio. No seu ritmo."
    >
      <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-12">
      <div className="lg:sticky lg:top-28 lg:col-span-5">
      <Link
        to="/ajuda"
        className="flex items-center gap-4 rounded-3xl bg-coral-soft p-4 transition-colors hover:bg-[#fbdcd4] lg:flex-col lg:items-start lg:gap-5 lg:rounded-[2rem] lg:p-8"
      >
        <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-card text-coral-deep lg:h-14 lg:w-14">
          <Phone className="h-5 w-5 lg:h-6 lg:w-6" strokeWidth={2.2} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-navy lg:text-2xl">Preciso de ajuda agora</span>
          <span className="mt-0.5 block text-sm text-coral-deep lg:mt-2 lg:text-base">
            CVV 188, CAPS e emergência. Gratuito e sigiloso.
          </span>
        </span>
        <ChevronRight className="h-5 w-5 flex-none text-coral-deep lg:hidden" />
        <span className="hidden min-h-11 items-center gap-1 rounded-full bg-coral-deep px-5 text-sm font-semibold text-white lg:inline-flex">
          Ver canais de apoio
          <ChevronRight className="h-4 w-4" />
        </span>
      </Link>
      {partner && <CampusSupportCard partner={partner} className="mt-6 max-lg:hidden" />}
      </div>

      <div className="lg:col-span-7">

      <section className="mt-8 lg:mt-0" aria-labelledby="entender">
        <h2 id="entender" className="text-lg font-semibold text-navy">
          Entender e agir
        </h2>
        <ul className="mt-3 divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card">
          <Row
            to="/autoavaliacao"
            icon={<ClipboardCheck className="h-5 w-5" />}
            title="Autoavaliação"
            desc="9 perguntas sobre sua relação com as apostas. Anônimo."
          />
          <Row
            to="/guia/parar-de-apostar"
            icon={<BookOpen className="h-5 w-5" />}
            title="Como parar de apostar"
            desc="Um guia passo a passo, sem sermão."
          />
          <li>
            <button
              onClick={openXande}
              className="flex min-h-[4.5rem] w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-background lg:min-h-24 lg:px-6"
            >
              <Icon>
                <Sparkles className="h-5 w-5" />
              </Icon>
              <span className="min-w-0 flex-1">
                <span className="block font-medium leading-snug text-navy">
                  Conversar com o Xande
                </span>
                <span className="mt-0.5 block text-sm text-muted-foreground">
                  Para o momento em que bate a vontade.
                </span>
              </span>
              <ChevronRight className="h-5 w-5 flex-none text-muted-foreground" />
            </button>
          </li>
          <Row
            to="/comunidade"
            icon={<Users className="h-5 w-5" />}
            title="Comunidade"
            desc="Em breve: um espaço anônimo para trocar com quem entende."
          />
        </ul>
      </section>

      {partner && <CampusSupportCard partner={partner} className="mt-6 lg:hidden" />}
      </div>
      </div>
    </AppShell>
  );
}

function Icon({ children }: { children: ReactNode }) {
  return (
    <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-teal-soft text-teal-deep">
      {children}
    </span>
  );
}

function Row({
  to,
  icon,
  title,
  desc,
}: {
  to: string;
  icon: ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <li>
      <Link
        to={to}
        className="flex min-h-[4.5rem] items-center gap-4 px-4 py-3 transition-colors hover:bg-background lg:min-h-24 lg:px-6"
      >
        <Icon>{icon}</Icon>
        <span className="min-w-0 flex-1">
          <span className="block font-medium leading-snug text-navy">{title}</span>
          <span className="mt-0.5 block text-sm text-muted-foreground">{desc}</span>
        </span>
        <ChevronRight className="h-5 w-5 flex-none text-muted-foreground" />
      </Link>
    </li>
  );
}
