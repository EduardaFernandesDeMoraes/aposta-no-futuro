import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  Lock,
  Phone,
  Sparkles,
  Users,
} from "lucide-react";
import { AppShell, openXande } from "@/components/app-shell";
import { CampusSupportCard } from "@/components/campus-support-card";
import { useAccess } from "@/lib/access";
import { findPartner } from "@/lib/partners";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";

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

const TIERS = ["Sem risco", "Leve", "Moderado", "Alto"];
function tierIndex(score: number) {
  if (score === 0) return 0;
  if (score <= 2) return 1;
  if (score <= 7) return 2;
  return 3;
}

const GUIDE_PREVIEW = [
  "Reconheça o padrão sem se julgar",
  "Corte o acesso imediato",
  "Diga em voz alta pra alguém de confiança",
];

function CuidarPage() {
  const [access] = useAccess();
  const partner = access.mode === "student" ? findPartner(access.partner) : undefined;
  const [assessment] = useLocalStorage<{ score: number; at: string } | null>(
    "anf.autoavaliacao",
    null,
  );
  const tier = assessment ? tierIndex(assessment.score) : null;

  return (
    <AppShell
      title="Cuidar de você"
      intro="Entender, pausar e pedir apoio. No seu ritmo."
    >
      <div className="grid gap-4 lg:grid-cols-12 lg:gap-6">
        {/* 1. Ajuda agora: o caminho mais curto */}
        <Link
          to="/ajuda"
          className="group flex items-center gap-4 rounded-3xl bg-coral p-5 text-navy transition-colors hover:bg-[#ff7466] lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:flex-col lg:items-start lg:justify-between lg:rounded-[2rem] lg:p-7"
        >
          <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-navy text-white">
            <Phone className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span className="min-w-0 flex-1 lg:flex-none">
            <span className="block text-lg font-semibold leading-snug lg:text-2xl">
              Preciso de ajuda agora
            </span>
            <span className="mt-0.5 block text-sm text-navy/80 lg:mt-1 lg:text-base">
              CVV 188, CAPS e emergência. Gratuito e sigiloso.
            </span>
          </span>
          <ArrowRight className="h-5 w-5 flex-none transition-transform group-hover:translate-x-0.5" />
        </Link>

        {/* 2. Autoavaliação: o destaque da tela */}
        <Link
          to="/autoavaliacao"
          className="group relative flex flex-col overflow-hidden rounded-[1.75rem] bg-teal-ink p-6 text-white shadow-soft transition-colors hover:bg-[#0c5c52] lg:col-span-7 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:rounded-[2.25rem] lg:p-10"
        >
          <span className="flex items-center gap-2 text-sm text-white/80">
            <ClipboardCheck className="h-4 w-4" />
            Autoavaliação · 9 perguntas · 2 min
          </span>
          <span className="mt-4 text-[1.6rem] font-semibold leading-tight tracking-[-0.02em] lg:mt-6 lg:max-w-[18ch] lg:text-[2.5rem]">
            Como está sua relação com as apostas?
          </span>
          <span className="mt-3 max-w-[40ch] text-[0.95rem] leading-relaxed text-white/80 lg:text-lg">
            Anônima e rápida. As respostas ficam só com você.
          </span>

          <span className="mt-6 block lg:mt-auto lg:pt-10" aria-hidden="true">
            <span className="grid grid-cols-4 gap-1.5">
              {TIERS.map((t, i) => (
                <span
                  key={t}
                  className={cn("h-2 rounded-full", tier === i ? "bg-teal" : "bg-white/15")}
                />
              ))}
            </span>
            <span className="mt-2 grid grid-cols-4 gap-1.5 text-xs text-white/70">
              {TIERS.map((t, i) => (
                <span key={t} className={cn(tier === i && "font-semibold text-white")}>
                  {t}
                </span>
              ))}
            </span>
          </span>

          <span className="mt-6 inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-teal-ink transition-colors group-hover:bg-teal-soft">
            {assessment ? "Refazer a autoavaliação" : "Começar agora"}
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>

        {/* 3. Xande: uma prévia da conversa */}
        <button
          type="button"
          onClick={openXande}
          className="group flex flex-col rounded-3xl bg-teal-soft p-5 text-left transition-colors hover:bg-[#cfe9e1] lg:col-span-5 lg:col-start-8 lg:row-start-2 lg:rounded-[2rem] lg:p-7"
        >
          <span className="flex items-center gap-3">
            <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-card text-teal-deep shadow-card">
              <Sparkles className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-semibold text-navy">Conversar com o Xande</span>
              <span className="block text-sm text-teal-ink">Para quando bater a vontade</span>
            </span>
          </span>
          <span className="mt-4 space-y-2" aria-hidden="true">
            <span className="block w-fit max-w-[85%] rounded-2xl rounded-tl-sm bg-card px-3.5 py-2.5 text-sm text-navy shadow-card">
              Oi, eu sou o Xande. Estou aqui com você.
            </span>
            <span className="ml-auto block w-fit rounded-2xl rounded-tr-sm bg-teal-deep px-3.5 py-2.5 text-sm text-white">
              Estou com vontade de apostar
            </span>
          </span>
        </button>

        {/* 4. Guia: os primeiros passos à vista */}
        <Link
          to="/guia/parar-de-apostar"
          className="group flex flex-col rounded-3xl border border-border bg-card p-5 transition-colors hover:border-teal-deep/40 lg:col-span-7 lg:col-start-1 lg:row-start-3 lg:rounded-[2rem] lg:p-8"
        >
          <span className="flex items-center justify-between gap-3">
            <span>
              <span className="block text-sm text-muted-foreground">Guia em 7 passos</span>
              <span className="mt-0.5 block text-xl font-semibold leading-snug text-navy lg:text-2xl">
                Como parar de apostar
              </span>
            </span>
            <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-navy text-[#7fe6da]">
              <BookOpen className="h-5 w-5" />
            </span>
          </span>
          <ol className="mt-4 space-y-2.5">
            {GUIDE_PREVIEW.map((step, i) => (
              <li key={step} className="flex items-center gap-3 text-[0.95rem] text-navy/85">
                <span className="tabular grid h-7 w-7 flex-none place-items-center rounded-full border-2 border-teal-deep text-xs font-semibold text-teal-deep">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-deep">
            Ler os 7 passos
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>

        {/* 5. Comunidade: em construção */}
        <Link
          to="/comunidade"
          className="group flex items-start gap-4 rounded-3xl border-2 border-dashed border-border p-5 transition-colors hover:border-teal-deep/40 lg:col-span-5 lg:col-start-8 lg:row-start-3 lg:flex-col lg:rounded-[2rem] lg:p-7"
        >
          <span className="relative grid h-11 w-11 flex-none place-items-center rounded-full bg-muted text-navy/70">
            <Users className="h-5 w-5" />
            <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-card ring-1 ring-border">
              <Lock className="h-3 w-3" />
            </span>
          </span>
          <span className="min-w-0">
            <span className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-navy">Comunidade</span>
              <span className="rounded-full bg-gold-soft px-2 py-0.5 text-xs font-semibold text-gold-deep">
                Em breve
              </span>
            </span>
            <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
              Um espaço anônimo para trocar com quem entende.
            </span>
          </span>
        </Link>
      </div>

      {partner && <CampusSupportCard partner={partner} className="mt-6" />}
    </AppShell>
  );
}
