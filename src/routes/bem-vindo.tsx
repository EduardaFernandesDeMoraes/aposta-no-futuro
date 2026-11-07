import { track, EVENTS } from "@/lib/analytics";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { OnboardingGate } from "@/components/onboarding-gate";
import { IntroSplash } from "@/components/intro-splash";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { AccessChooser, type AccessChoice } from "@/components/access-chooser";
import { readAccessChosen, useAccess } from "@/lib/access";

export const Route = createFileRoute("/bem-vindo")({
  head: () => ({
    meta: [
      { title: "Bem-vindo | Aposta no Futuro" },
      {
        name: "description",
        content:
          "Comece sua jornada livre das apostas com o Aposta no Futuro.",
      },
      { property: "og:title", content: "Bem-vindo ao Aposta no Futuro" },
      {
        property: "og:description",
        content:
          "Um app acolhedor pra você começar sua jornada livre das apostas online.",
      },
      { property: "og:url", content: "https://apostanofuturo.online/bem-vindo" },
    ],
    links: [{ rel: "canonical", href: "https://apostanofuturo.online/bem-vindo" }],
  }),
  component: OnboardingRoute,
});

function OnboardingRoute() {
  return (
    <OnboardingGate expect="new">
      <Onboarding />
      <IntroSplash />
    </OnboardingGate>
  );
}

type Profile = {
  name: string;
  firstFreeDay: string;
  onboarded: boolean;
};

type Stage = "parei" | "diminuir" | "entender";

const STAGES: { id: Stage; title: string; text: string }[] = [
  {
    id: "parei",
    title: "Já parei de apostar",
    text: "Quero contar meus dias e não voltar.",
  },
  {
    id: "diminuir",
    title: "Ainda aposto e quero diminuir",
    text: "O contador começa quando você quiser.",
  },
  {
    id: "entender",
    title: "Só quero entender melhor",
    text: "Sem compromisso. Explore no seu ritmo.",
  },
];

/** Data de hoje no fuso do aparelho, no formato do <input type="date">. */
function todayLocal() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/** "2026-11-06" → meia-noite local desse dia, em ISO. */
function localMidnightIso(ymd: string) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1).toISOString();
}

function Onboarding() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"access" | "intro">("access");
  const [, setAccess] = useAccess();

  useEffect(() => {
    if (readAccessChosen()) setPhase("intro");
  }, []);

  function handleAccess(choice: AccessChoice) {
    if (choice.kind === "manager") {
      track(EVENTS.accessManager);
      navigate({ to: "/campus" });
      return;
    }
    if (choice.kind === "student") {
      setAccess({ mode: "student", partner: choice.partner });
      track(EVENTS.accessStudent);
    } else {
      setAccess({ mode: "free" });
      track(EVENTS.accessFree);
    }
    setPhase("intro");
  }

  const [profile, setProfile] = useLocalStorage<Profile>("anf.profile", {
    name: "",
    firstFreeDay: "",
    onboarded: false,
  });
  const [name, setName] = useState(profile.name);
  const [stage, setStage] = useState<Stage | null>(null);
  const [date, setDate] = useState("");
  const today = useMemo(() => (phase === "intro" ? todayLocal() : ""), [phase]);

  useEffect(() => {
    if (phase === "intro" && !date) setDate(todayLocal());
  }, [phase, date]);

  function finish() {
    const startsNow = stage === "parei";
    const safeDate = date && date <= todayLocal() ? date : todayLocal();
    setProfile({
      name: name.trim(),
      firstFreeDay: startsNow ? localMidnightIso(safeDate) : "",
      onboarded: true,
    });
    track(EVENTS.onboardingDone);
    if (startsNow) track(EVENTS.counterStarted);
    navigate({ to: "/" });
  }

  if (phase === "access") {
    return (
      <OnboardingFrame>
        <main className="mx-auto flex min-h-dvh max-w-md flex-col px-5 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-[calc(env(safe-area-inset-top)+2.5rem)] lg:min-h-0 lg:w-full lg:py-16">
          <h1 className="sr-only">Bem-vindo ao Aposta no Futuro</h1>
          <AccessChooser onDone={handleAccess} />
        </main>
      </OnboardingFrame>
    );
  }

  return (
    <OnboardingFrame>
      <main className="mx-auto flex min-h-dvh max-w-md flex-col px-5 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-[calc(env(safe-area-inset-top)+1rem)] lg:min-h-0 lg:w-full lg:py-16">
        <button
          type="button"
          onClick={() => setPhase("access")}
          className="-ml-2 inline-flex min-h-11 w-fit items-center gap-1 rounded-full px-2 text-sm font-medium text-muted-foreground hover:text-navy"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>

        <div className="rise-in mt-4">
          <p className="font-script text-[2rem] font-bold leading-none text-teal-deep">
            Do seu jeito,
          </p>
          <h1 className="mt-2 text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.02em] text-navy">
            no seu tempo.
          </h1>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
            Aqui ninguém te julga. Você conta seus dias, vê o que seu dinheiro
            pode virar e encontra apoio quando precisar.
          </p>
        </div>

        <fieldset className="mt-8">
          <legend className="text-lg font-semibold text-navy">Onde você está hoje?</legend>
          <div className="mt-3 space-y-2.5" role="radiogroup">
            {STAGES.map((s) => {
              const selected = stage === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setStage(s.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border-2 bg-card p-4 text-left transition-colors",
                    selected
                      ? "border-teal-deep bg-teal-soft"
                      : "border-border hover:border-teal-deep/40",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid h-5 w-5 flex-none place-items-center rounded-full border-2",
                      selected ? "border-teal-deep" : "border-input",
                    )}
                  >
                    {selected && <span className="h-2.5 w-2.5 rounded-full bg-teal-deep" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold leading-snug text-navy">{s.title}</span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">{s.text}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {stage === "parei" && (
          <label className="rise-in mt-5 block" htmlFor="primeiro-dia-livre">
            <span className="mb-1.5 block font-medium text-navy">
              Desde quando você está sem apostar?
            </span>
            <input
              id="primeiro-dia-livre"
              type="date"
              value={date}
              max={today}
              onChange={(e) => setDate(e.target.value)}
              className="min-h-12 w-full rounded-2xl border border-input bg-card px-4 text-base outline-none focus:border-teal-deep focus:ring-2 focus:ring-teal-deep/20"
            />
          </label>
        )}

        <label className="mt-6 block" htmlFor="onboarding-name">
          <span className="mb-1.5 flex items-center gap-2 font-medium text-navy">
            Como podemos te chamar?
            <span className="text-sm font-normal text-muted-foreground">(opcional)</span>
          </span>
          <input
            id="onboarding-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Um apelido, ou deixe em branco"
            aria-describedby="name-help"
            autoComplete="nickname"
            className="min-h-12 w-full rounded-2xl border border-input bg-card px-4 text-base outline-none focus:border-teal-deep focus:ring-2 focus:ring-teal-deep/20"
          />
          <span id="name-help" className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-teal-deep" />
            Fica só no seu aparelho. Não vai para nenhum servidor.
          </span>
        </label>

        <div className="mt-auto pt-8">
          <Button
            onClick={finish}
            disabled={!stage}
            className="h-12 w-full rounded-full bg-teal-deep text-base font-semibold text-white hover:bg-teal-ink disabled:opacity-40"
          >
            Começar
            <ArrowRight className="ml-1 h-5 w-5" />
          </Button>
          {!stage && (
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Escolha uma opção acima para continuar.
            </p>
          )}
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Este app é um apoio e não substitui tratamento profissional. Em
            crise, ligue <a href="tel:188" className="font-semibold text-navy underline">188</a> (CVV).
          </p>
        </div>
      </main>
    </OnboardingFrame>
  );
}

/**
 * No celular, só o conteúdo. No desktop, tela dividida: painel azul-escuro
 * com a marca à esquerda e o passo atual à direita.
 */
function OnboardingFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <aside className="relative hidden overflow-hidden bg-navy text-white lg:flex lg:min-h-dvh lg:flex-col lg:justify-between lg:p-14 xl:p-20">
        <img
          src="/logo-maos-coracao.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -right-24 h-[30rem] w-[30rem] select-none opacity-[0.08] grayscale brightness-[3]"
          draggable={false}
        />
        <div className="relative flex items-center gap-3">
          <img
            src="/logo-maos-coracao.svg"
            alt=""
            aria-hidden="true"
            width={48}
            height={48}
            className="h-12 w-12 select-none"
            draggable={false}
          />
          <p className="text-xl font-bold tracking-tight">
            Aposta no <span className="text-[#7fe6da]">Futuro</span>
          </p>
        </div>

        <div className="relative">
          <p className="font-script text-[3rem] font-bold leading-none text-[#7fe6da]">
            Menos apostas.
          </p>
          <p className="mt-2 text-[3.25rem] font-semibold leading-[1.05] tracking-[-0.035em]">
            Mais futuro.
          </p>
          <ul className="mt-10 max-w-[36ch] space-y-4 text-lg leading-snug text-white/85">
            <li>Conte seus dias sem apostar, no seu ritmo.</li>
            <li>Veja o que o seu dinheiro pode virar.</li>
            <li>Encontre apoio quando precisar, sem julgamento.</li>
          </ul>
        </div>

        <p className="relative text-sm text-white/70">
          Gratuito e anônimo. Nada do que você registra sai do seu aparelho.
        </p>
      </aside>
      <div className="lg:flex lg:min-h-dvh lg:items-center lg:justify-center lg:px-12">
        {children}
      </div>
    </div>
  );
}
