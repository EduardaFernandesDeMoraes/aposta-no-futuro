import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  ChevronRight,
  Globe,
  GraduationCap,
  Phone,
  Search,
  ShieldCheck,
} from "lucide-react";
import { PARTNERS, type Partner } from "@/lib/partners";

export type AccessChoice =
  | { kind: "student"; partner: string }
  | { kind: "free" }
  | { kind: "manager" };

/**
 * Tela 0 (perfil) + Tela 1A (instituição) do AF 2.0.
 * O estudante nunca informa e-mail, matrícula ou senha: só escolhe a
 * instituição, e o código dela fica salvo no próprio aparelho.
 */
export function AccessChooser({
  onDone,
  variant = "welcome",
}: {
  onDone: (c: AccessChoice) => void;
  /** "switch": usado em /acesso, para quem já usa o app e quer trocar de perfil. */
  variant?: "welcome" | "switch";
}) {
  const [step, setStep] = useState<"profile" | "institution">("profile");

  return step === "profile" ? (
    <ProfileStep
      variant={variant}
      onStudent={() => setStep("institution")}
      onFree={() => onDone({ kind: "free" })}
      onManager={() => onDone({ kind: "manager" })}
    />
  ) : (
    <InstitutionStep
      onBack={() => setStep("profile")}
      onPick={(p) => onDone({ kind: "student", partner: p.code })}
      onNotPartner={() => onDone({ kind: "free" })}
    />
  );
}

function ProfileStep({
  variant,
  onStudent,
  onFree,
  onManager,
}: {
  variant: "welcome" | "switch";
  onStudent: () => void;
  onFree: () => void;
  onManager: () => void;
}) {
  return (
    <div className="rise-in flex flex-1 flex-col">
      {variant === "welcome" && (
        <>
          <div className="flex items-center gap-2.5 lg:hidden">
            <img
              src="/logo-maos-coracao.svg"
              alt=""
              aria-hidden="true"
              width={44}
              height={44}
              className="h-11 w-11 select-none"
              draggable={false}
            />
            <p className="text-lg font-bold tracking-tight text-navy">
              Aposta no <span className="text-teal-deep">Futuro</span>
            </p>
          </div>

          <h2 className="mt-10 text-balance text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.02em] text-navy lg:mt-0 lg:text-[2.5rem]">
            Que bom que você chegou.
          </h2>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
            Um espaço sem julgamento para cuidar da sua relação com as apostas e do seu dinheiro.
            Gratuito e anônimo.
          </p>
        </>
      )}

      <p
        className={
          variant === "welcome" ? "mt-8 font-semibold text-navy" : "font-semibold text-navy"
        }
      >
        {variant === "welcome" ? "Como você quer entrar?" : "Como você quer usar o app agora?"}
      </p>
      <div className="mt-3 space-y-2.5">
        <ProfileCard
          onClick={onStudent}
          icon={<GraduationCap className="h-5 w-5" />}
          title="Sou estudante universitário"
          text="Com o apoio do seu campus. Sem cadastro."
        />
        <ProfileCard
          onClick={onFree}
          icon={<Globe className="h-5 w-5" />}
          title="Quero entrar sem vínculo"
          text="Acesso livre, totalmente anônimo."
        />
      </div>

      <div className="mt-auto pt-10 lg:pt-8">
        <Link
          to="/ajuda"
          className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-coral-soft px-4 text-sm font-semibold text-coral-deep transition-colors hover:bg-coral-soft-hover"
        >
          <Phone className="h-4 w-4" strokeWidth={2.4} />
          Preciso de ajuda agora
        </Link>
        <button
          type="button"
          onClick={onManager}
          className="mt-3 flex min-h-11 w-full items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-navy"
        >
          <Building2 className="h-4 w-4" />
          Sou gestor de uma instituição
        </button>
      </div>
    </div>
  );
}

function ProfileCard({
  onClick,
  icon,
  title,
  text,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-[4.75rem] w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:border-teal-deep/40 hover:bg-teal-soft/50"
    >
      <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-teal-soft text-teal-deep">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold leading-snug text-navy">{title}</span>
        <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">{text}</span>
      </span>
      <ChevronRight className="h-5 w-5 flex-none text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function InstitutionStep({
  onBack,
  onPick,
  onNotPartner,
}: {
  onBack: () => void;
  onPick: (p: Partner) => void;
  onNotPartner: () => void;
}) {
  const [query, setQuery] = useState("");
  const list = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return PARTNERS;
    return PARTNERS.filter((p) => normalize(`${p.shortName} ${p.name} ${p.city}`).includes(q));
  }, [query]);

  return (
    <div className="rise-in">
      <button
        type="button"
        onClick={onBack}
        className="-ml-2 inline-flex min-h-11 items-center gap-1 rounded-full px-2 text-sm font-medium text-muted-foreground hover:text-navy"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>
      <h2 className="mt-3 text-balance text-[1.6rem] font-semibold leading-[1.2] tracking-[-0.02em] text-navy">
        Em qual instituição de ensino você estuda?
      </h2>
      <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">
        Assim a gente mostra os canais de apoio do seu campus.
      </p>

      {/* A busca só aparece quando a lista fica longa. */}
      {PARTNERS.length > 4 && (
        <label className="mt-5 flex min-h-12 items-center gap-2 rounded-2xl border border-input bg-card px-4 focus-within:border-teal-deep focus-within:ring-2 focus-within:ring-teal-deep/20">
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Buscar instituição</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar faculdade ou universidade"
            className="w-full bg-transparent py-3 text-base outline-none md:text-sm"
          />
        </label>
      )}

      <ul className={PARTNERS.length > 4 ? "mt-4 space-y-2.5" : "mt-5 space-y-2.5"}>
        {list.map((p) => (
          <li key={p.code}>
            <button
              type="button"
              onClick={() => onPick(p)}
              className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3.5 text-left transition-colors hover:border-teal-deep/40 hover:bg-teal-soft/50"
            >
              <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-teal-soft text-teal-deep">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold leading-snug text-navy">{p.name}</span>
                <span className="block text-sm text-muted-foreground">{p.city}</span>
              </span>
              <ChevronRight className="h-5 w-5 flex-none text-muted-foreground" />
            </button>
          </li>
        ))}
        {list.length === 0 && (
          <li className="rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
            Nenhuma instituição parceira encontrada com esse nome.
          </li>
        )}
      </ul>

      <button
        type="button"
        onClick={onNotPartner}
        className="mt-4 min-h-12 w-full rounded-full border border-teal-deep/30 bg-card px-4 text-sm font-semibold text-teal-deep transition-colors hover:bg-teal-soft"
      >
        Minha instituição ainda não é parceira
      </button>

      <div className="mt-6 flex items-start gap-3 px-1">
        <ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-teal-deep" strokeWidth={2.2} />
        <p className="text-sm leading-relaxed text-muted-foreground">
          Não pedimos e-mail, senha nem matrícula.
        </p>
      </div>
    </div>
  );
}
