import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Calendar, HandHeart, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  component: Onboarding,
});

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

  useEffect(() => {
    if (profile.onboarded) navigate({ to: "/" });
  }, [profile.onboarded, navigate]);

  const isLast = step === STEPS.length;

  function next() {
    if (isLast) {
      setProfile({ name: name.trim(), firstFreeDay: date, onboarded: true });
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

        <div className="mt-10 flex-1">
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
          className="h-12 w-full rounded-full bg-[#0d6b60] text-base font-semibold text-white shadow-soft transition-all duration-200 hover:bg-[#0a5a51]"
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
  return (
    <div>
      <h2 className="text-2xl font-bold leading-tight text-navy">
        Vamos nos conhecer?
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Nome é opcional. Nada sai do seu aparelho. É tudo anônimo.
      </p>

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-1.5 flex items-center gap-2 text-sm font-medium text-navy">
            Como podemos te chamar?
            <OptionalTooltip />
          </span>
          <input
            value={name}
            onChange={(e) => onName(e.target.value)}
            placeholder="Como quer ser chamado?"
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none transition-colors duration-200 focus:border-teal"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy">
            Meu primeiro dia livre de apostas
          </span>
          <input
            type="date"
            value={date}
            onChange={(e) => onDate(e.target.value)}
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-teal"
          />
        </label>
      </div>
    </div>
  );
}

function OptionalTooltip() {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="inline-flex items-center gap-1 rounded-full bg-teal/10 px-2 py-0.5 text-[10px] font-semibold text-teal outline-none transition-all duration-200 hover:bg-teal/20 focus-visible:ring-2 focus-visible:ring-teal/40"
        aria-describedby="opcional-tooltip"
      >
        opcional
        <HelpCircle className="h-3 w-3" aria-hidden="true" />
      </button>

      <span
        id="opcional-tooltip"
        role="tooltip"
        className={`pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-44 -translate-x-1/2 rounded-xl bg-[#0d6b60] px-3 py-2 text-center text-xs leading-snug text-white shadow-soft transition-all duration-200 ${
          open
            ? "translate-y-0 opacity-100"
            : "-translate-y-1 opacity-0"
        }`}
      >
        Pode deixar em branco. Só você vê isso.
        <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-[#0d6b60]" />
      </span>
    </span>
  );
}
