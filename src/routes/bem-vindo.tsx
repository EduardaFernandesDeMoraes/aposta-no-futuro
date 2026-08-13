import { track, EVENTS } from "@/lib/analytics";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Calendar, HandHeart, PiggyBank, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OnboardingGate } from "@/components/onboarding-gate";
import { useLocalStorage } from "@/hooks/use-local-storage";

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
    </OnboardingGate>
  );
}

type Profile = {
  name: string;
  firstFreeDay: string;
  onboarded: boolean;
};

const STEPS = [
  {
    icon: Calendar,
    color: "bg-teal",
    title: "Acompanhe seus dias livres",
    text: "Cada dia sem apostar é uma conquista sua. A gente celebra junto.",
  },
  {
    icon: PiggyBank,
    color: "bg-magenta",
    title: "Veja quanto você economiza",
    text: "Descubra o poder do dinheiro que voltou pro seu bolso.",
  },
  {
    icon: HandHeart,
    color: "bg-coral",
    title: "Você não caminha sozinho",
    text: "Uma comunidade acolhedora, desafios e apoio quando precisar.",
  },
] as const;

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useLocalStorage<Profile>("anf.profile", {
    name: "",
    firstFreeDay: "",
    onboarded: false,
  });
  const [name, setName] = useState(profile.name);
  const [date, setDate] = useState(
    profile.firstFreeDay || new Date().toISOString().slice(0, 10),
  );

  const isLast = step === STEPS.length;

  function next() {
    if (isLast) {
      setProfile({ name: name.trim(), firstFreeDay: date, onboarded: true });
      track(EVENTS.onboardingDone);
      track(EVENTS.counterStarted);
      navigate({ to: "/" });
    } else {
      setStep((s) => s + 1);
    }
  }

  return (
    <div className="min-h-dvh bg-background">
      <main className="mx-auto flex min-h-dvh max-w-md flex-col px-6 pb-8 pt-10">
        <h1 className="sr-only">Bem-vindo ao Aposta no Futuro</h1>
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`h-1.5 w-8 rounded-full ${
                  i <= step ? "bg-teal" : "bg-border"
                }`}
              />
            ))}
          </div>
          {!isLast && (
            <button
              onClick={() => setStep(STEPS.length)}
              className="text-xs font-medium text-navy/80 underline underline-offset-2"
            >
              Pular
            </button>
          )}
        </div>

        <div className={isLast ? "mt-6" : "mt-10 flex-1"}>
          {!isLast ? (
            <StepView step={step} />
          ) : (
            <FinalStep
              name={name}
              date={date}
              onName={setName}
              onDate={setDate}
            />
          )}
        </div>

        <Button
          onClick={next}
          className="mt-8 h-12 w-full rounded-full bg-[#0d6b60] text-base font-semibold text-white shadow-soft transition-all duration-200 hover:bg-[#0a5a51] active:scale-[0.97] active:opacity-90"
        >
          {isLast ? "Começar minha jornada" : "Continuar"}
          <ArrowRight className="ml-1 h-5 w-5" />
        </Button>


        <p className="mt-4 text-center text-[11px] text-muted-foreground">
          Este app é um apoio e não substitui tratamento profissional. Em
          crise, ligue 188 (CVV).
        </p>
      </main>
    </div>
  );
}

function StepView({ step }: { step: number }) {
  const s = STEPS[step];
  const Icon = s.icon;
  return (
    <div className="flex flex-col items-center text-center">
      <div
        className={`grid h-28 w-28 place-items-center rounded-3xl ${s.color} text-white shadow-soft`}
      >
        <Icon className="h-12 w-12" strokeWidth={2.2} />
      </div>
      <h2 className="mt-8 text-2xl font-bold leading-tight text-navy">
        {s.title}
      </h2>
      <p className="mt-3 max-w-xs text-sm text-muted-foreground">{s.text}</p>
    </div>
  );
}

function FinalStep({
  name,
  date,
  onName,
  onDate,
}: {
  name: string;
  date: string;
  onName: (v: string) => void;
  onDate: (v: string) => void;
}) {
  const isAnonymous = name.trim() === "";

  return (
    <div>
      <h2 className="text-2xl font-bold leading-tight text-navy">
        Vamos nos conhecer?
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Você pode continuar de forma anônima, do seu jeito.
      </p>

      <div className="mt-4 flex items-start gap-3 rounded-2xl bg-[#E1F5EE] p-4">
        <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-white/70">
          <ShieldCheck className="h-5 w-5 text-[#16BFAC]" strokeWidth={2.4} />
        </span>
        <p className="text-sm font-medium leading-snug text-navy">
          Seu nome é opcional. Ele não é salvo em nenhum servidor e não é
          enviado a ninguém: fica só no seu aparelho.
        </p>
      </div>

      <div className="mt-5 space-y-4">
        <label className="block" htmlFor="onboarding-name">
          <span className="mb-1.5 flex items-center gap-2 text-sm font-medium text-navy">
            Como podemos te chamar?
            <span className="rounded-full bg-[#E1F5EE] px-2 py-0.5 text-[11px] font-semibold text-[#0d6b60]">
              opcional
            </span>
          </span>
          <input
            id="onboarding-name"
            value={name}
            onChange={(e) => onName(e.target.value)}
            placeholder="Ex.: Alex (ou deixe em branco)"
            aria-describedby="name-help"
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-base outline-none md:text-sm transition-colors duration-200 focus:border-teal"
          />
          {isAnonymous && (
            <span
              id="name-help"
              className="mt-1.5 block text-xs font-medium text-[#0d6b60]"
            >
              Tudo certo, você vai continuar no anonimato ✓
            </span>
          )}
        </label>

        <label className="block" htmlFor="primeiro-dia-livre">
          <span className="mb-1.5 block text-sm font-medium text-navy">
            Meu primeiro dia livre de apostas
          </span>
          <input
            id="primeiro-dia-livre"
            type="date"
            value={date}
            onChange={(e) => onDate(e.target.value)}
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-base outline-none md:text-sm focus:border-teal"
          />
        </label>
      </div>

      <ul className="mt-6 space-y-2.5">
        {[
          { icon: Calendar, text: "Contador dos seus dias livres, em tempo real" },
          { icon: PiggyBank, text: "Simulador do quanto você deixa de perder" },
          { icon: HandHeart, text: "Comunidade anônima e acolhedora" },
        ].map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-3 text-sm text-navy/80">
            <span className="grid h-8 w-8 flex-none place-items-center rounded-xl bg-[#E1F5EE]">
              <Icon className="h-4 w-4 text-[#16BFAC]" strokeWidth={2.4} />
            </span>
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}

