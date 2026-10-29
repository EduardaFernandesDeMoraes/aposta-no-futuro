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
import { cn } from "@/lib/utils";

export type AccessChoice =
  | { kind: "student"; partner: string }
  | { kind: "free" }
  | { kind: "manager" };

/**
 * Tela 0 (perfil) + Tela 1A (instituição) do AF 2.0.
 * O estudante nunca informa e-mail, matrícula ou senha: só escolhe a
 * instituição, e o código dela fica salvo no próprio aparelho.
 */
export function AccessChooser({ onDone }: { onDone: (c: AccessChoice) => void }) {
  const [step, setStep] = useState<"profile" | "institution">("profile");

  return step === "profile" ? (
    <ProfileStep
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
  onStudent,
  onFree,
  onManager,
}: {
  onStudent: () => void;
  onFree: () => void;
  onManager: () => void;
}) {
  return (
    <div className="animate-fade-in">
      <h2 className="text-balance text-center text-2xl font-bold leading-tight text-navy">
        Bem-vindo ao Aposta no Futuro 💙
      </h2>
      <p className="mt-2 text-balance text-center text-sm text-muted-foreground">
        Sua jornada de autocuidado e clareza financeira. Como você deseja acessar hoje?
      </p>

      <div className="mt-6 space-y-3">
        <ProfileCard
          onClick={onStudent}
          icon={<GraduationCap className="h-6 w-6" />}
          tone="bg-teal text-white"
          title="Sou estudante universitário"
          text="Acesso 100% gratuito, privado e sem necessidade de cadastro."
        />
        <ProfileCard
          onClick={onManager}
          icon={<Building2 className="h-6 w-6" />}
          tone="bg-navy text-white"
          title="Sou gestor ou colaborador de uma instituição"
          text="Acesso ao painel institucional de indicadores e campanhas."
        />
        <ProfileCard
          onClick={onFree}
          icon={<Globe className="h-6 w-6" />}
          tone="bg-cyan text-white"
          title="Quero fazer meu acesso livre (sem vínculo)"
          text="Acesse de forma totalmente independente e anônima."
        />
      </div>

      <Link
        to="/ajuda"
        className="mt-6 flex items-center justify-center gap-2 rounded-full bg-coral/10 px-4 py-3 text-sm font-semibold text-[#c2392c] transition-colors hover:bg-coral/15"
      >
        <Phone className="h-4 w-4" strokeWidth={2.5} />
        Preciso de ajuda agora
      </Link>
    </div>
  );
}

function ProfileCard({
  onClick,
  icon,
  tone,
  title,
  text,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  tone: string;
  title: string;
  text: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-4 rounded-3xl border border-border bg-card p-4 text-left shadow-card transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-teal/40 hover:shadow-soft active:scale-[0.98]"
    >
      <span className={cn("grid h-12 w-12 flex-none place-items-center rounded-2xl", tone)}>
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold leading-snug text-navy">{title}</span>
        <span className="mt-1 block text-xs leading-snug text-muted-foreground">{text}</span>
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
    <div className="animate-fade-in">
      <button
        type="button"
        onClick={onBack}
        className="-ml-1 inline-flex items-center gap-1 rounded-full px-1 py-1 text-xs font-semibold text-navy/80 hover:text-navy"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>
      <h2 className="mt-3 text-balance text-2xl font-bold leading-tight text-navy">
        Em qual instituição de ensino você estuda?
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Selecione sua faculdade ou universidade para carregar as redes de apoio do seu campus.
      </p>

      <label className="mt-5 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 focus-within:border-teal">
        <Search className="h-4 w-4 text-muted-foreground" />
        <span className="sr-only">Buscar instituição</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar faculdade ou universidade"
          className="w-full bg-transparent py-3 text-base outline-none md:text-sm"
        />
      </label>

      <ul className="mt-4 space-y-2.5">
        {list.map((p) => (
          <li key={p.code}>
            <button
              type="button"
              onClick={() => onPick(p)}
              className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3.5 text-left shadow-card transition-all duration-200 hover:border-teal/40 hover:bg-[#F0FAF7] active:scale-[0.98]"
            >
              <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-navy text-[#0AF0FB]">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-navy">{p.name}</span>
                <span className="block text-xs text-muted-foreground">{p.city}</span>
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
        className="mt-4 w-full rounded-full border border-teal/40 bg-white px-4 py-3 text-sm font-semibold text-[#0d6b60] transition-colors hover:bg-[#E1F5EE]"
      >
        Minha instituição ainda não é parceira
      </button>

      <div className="mt-5 flex items-start gap-3 rounded-2xl bg-[#E1F5EE] p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-[#0d6b60]" strokeWidth={2.4} />
        <p className="text-xs font-medium leading-snug text-navy">
          Não pedimos e-mail, senha nem matrícula. A instituição escolhida fica salva só no seu
          aparelho e serve apenas para mostrar o apoio do seu campus.
        </p>
      </div>
    </div>
  );
}
