import { useState } from "react";
import {
  GraduationCap,
  Heart,
  Home,
  Pencil,
  PiggyBank,
  Plane,
  Plus,
  ShieldCheck,
  Smartphone,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { track, EVENTS } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * "Minhas apostas no futuro": objetivos pessoais de planejamento.
 * Tudo fica só no aparelho. O app não guarda, movimenta nem rende dinheiro.
 */
export type FutureBet = {
  id: string;
  name: string;
  icon: IconKey;
  target: number;
  /** Valor que a pessoa declara já ter separado (sem verificação). */
  saved: number;
  createdAt: string;
};

const ICONS = {
  reserva: { icon: ShieldCheck, label: "Reserva" },
  estudos: { icon: GraduationCap, label: "Estudos" },
  viagem: { icon: Plane, label: "Viagem" },
  celular: { icon: Smartphone, label: "Celular" },
  casa: { icon: Home, label: "Casa" },
  cofre: { icon: PiggyBank, label: "Outro" },
  pessoal: { icon: Heart, label: "Pessoal" },
} as const;
type IconKey = keyof typeof ICONS;

export const FUTURE_BETS_KEY = "anf.apostas.v1";

const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function parseBRL(raw: string): number {
  const n = Number(
    raw
      .replace(/[^\d,.]/g, "")
      .replace(/\./g, "")
      .replace(",", "."),
  );
  return Number.isFinite(n) ? n : NaN;
}

export function useFutureBets() {
  return useLocalStorage<FutureBet[]>(FUTURE_BETS_KEY, []);
}

export function MinhasApostas({
  weekly,
  suggestedTarget,
}: {
  /** Valor semanal informado no simulador (para estimar o prazo). */
  weekly: number | null;
  suggestedTarget: number;
}) {
  const [bets, setBets] = useFutureBets();
  const [creating, setCreating] = useState(false);

  return (
    <section id="minhas-apostas" className="mt-12 scroll-mt-24 lg:mt-20" aria-labelledby="apostas-titulo">
      <h2
        id="apostas-titulo"
        className="text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] text-navy lg:text-[2.25rem]"
      >
        Minhas apostas{" "}
        <span className="font-script text-[1.9rem] font-bold text-teal-deep lg:text-[2.75rem]">no futuro</span>
      </h2>
      <p className="mt-2 max-w-[60ch] text-[0.95rem] leading-relaxed text-muted-foreground lg:text-lg">
        A única aposta que nunca vira dívida.
      </p>

      {!creating && bets.length === 0 && (
        <div className="mt-5 rounded-3xl border-2 border-dashed border-border px-5 py-7 text-center lg:flex lg:items-center lg:gap-6 lg:px-8 lg:text-left">
          <span className="mx-auto grid h-14 w-14 flex-none place-items-center rounded-full bg-gold-soft text-gold-deep lg:mx-0">
            <PiggyBank className="h-6 w-6" />
          </span>
          <p className="mx-auto mt-4 max-w-[30ch] text-[0.95rem] leading-relaxed text-navy lg:mx-0 lg:mt-0 lg:max-w-none lg:flex-1 lg:text-lg">
            Uma reserva, um curso, uma viagem. O que você quer construir?
          </p>
          <Button
            onClick={() => setCreating(true)}
            className="mt-5 min-h-12 flex-none rounded-full bg-teal-deep px-6 text-sm font-semibold text-white hover:bg-teal-ink lg:mt-0"
          >
            <Plus className="mr-1 h-4 w-4" /> Criar minha primeira aposta
          </Button>
        </div>
      )}
      {!creating && bets.length > 0 && (
        <Button
          onClick={() => setCreating(true)}
          variant="outline"
          className="mt-4 min-h-11 rounded-full border-teal-deep/30 bg-card px-5 text-sm font-semibold text-teal-deep hover:bg-teal-soft"
        >
          <Plus className="mr-1 h-4 w-4" /> Nova aposta no futuro
        </Button>
      )}

      {creating && (
        <BetForm
          suggestedTarget={suggestedTarget}
          onCancel={() => setCreating(false)}
          onSave={(b) => {
            setBets([...bets, b]);
            setCreating(false);
            track(EVENTS.futureBetCreated);
          }}
        />
      )}

      {bets.length > 0 && (
        <ul className="mt-4 space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
          {bets.map((b) => (
            <BetCard
              key={b.id}
              bet={b}
              weekly={weekly}
              onChange={(nb) => setBets(bets.map((x) => (x.id === nb.id ? nb : x)))}
              onDelete={() => setBets(bets.filter((x) => x.id !== b.id))}
            />
          ))}
        </ul>
      )}

    </section>
  );
}

function BetForm({
  suggestedTarget,
  onSave,
  onCancel,
  initial,
}: {
  suggestedTarget: number;
  onSave: (b: FutureBet) => void;
  onCancel: () => void;
  initial?: FutureBet;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [icon, setIcon] = useState<IconKey>(initial?.icon ?? "reserva");
  const [target, setTarget] = useState(
    initial
      ? String(initial.target)
      : suggestedTarget > 0
        ? String(Math.round(suggestedTarget))
        : "",
  );
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const t = parseBRL(target);
    if (!name.trim()) return setError("Dê um nome para o seu objetivo");
    if (!Number.isFinite(t) || t <= 0) return setError("Informe um valor maior que zero");
    if (t > 10_000_000) return setError("Valor muito alto");
    onSave({
      id: initial?.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim().slice(0, 40),
      icon,
      target: t,
      saved: initial?.saved ?? 0,
      createdAt: initial?.createdAt ?? new Date().toISOString(),
    });
  }

  return (
    <form onSubmit={submit} className="rise-in mt-5 rounded-3xl border border-border bg-card p-5 lg:max-w-2xl lg:p-8">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-navy">
          {initial ? "Editar objetivo" : "Novo objetivo"}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cancelar"
          className="-mr-2 grid h-11 w-11 place-items-center rounded-full text-muted-foreground hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <label className="mt-3 block">
        <span className="mb-1.5 block text-sm font-medium text-navy">Qual é o objetivo?</span>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError(null);
          }}
          maxLength={40}
          placeholder="Ex.: Reserva de emergência, curso de inglês…"
          className="min-h-12 w-full rounded-2xl border border-input bg-background px-4 text-base outline-none focus:border-teal-deep focus:ring-2 focus:ring-teal-deep/20"
        />
      </label>

      <div className="mt-3">
        <span className="mb-1.5 block text-sm font-medium text-navy">Escolha um ícone</span>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(ICONS) as IconKey[]).map((k) => {
            const I = ICONS[k].icon;
            return (
              <button
                type="button"
                key={k}
                onClick={() => setIcon(k)}
                aria-pressed={icon === k}
                className={cn(
                  "flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors",
                  icon === k
                    ? "border-teal-deep bg-teal-soft text-teal-ink"
                    : "border-border bg-background text-navy hover:border-teal-deep/40",
                )}
              >
                <I className="h-3.5 w-3.5" /> {ICONS[k].label}
              </button>
            );
          })}
        </div>
      </div>

      <label className="mt-3 block">
        <span className="mb-1.5 block text-sm font-medium text-navy">Quanto você quer juntar?</span>
        <span className="flex min-h-12 items-center gap-2 rounded-2xl border border-input bg-background px-4 focus-within:border-teal-deep focus-within:ring-2 focus-within:ring-teal-deep/20">
          <span className="text-sm font-semibold text-muted-foreground">R$</span>
          <input
            inputMode="decimal"
            value={target}
            onChange={(e) => {
              setTarget(e.target.value.replace(/[^0-9,.]/g, ""));
              setError(null);
            }}
            className="w-full bg-transparent py-3 text-base tabular-nums outline-none"
          />
        </span>
        {suggestedTarget > 0 && !initial && (
          <span className="mt-1.5 block text-xs text-muted-foreground">
            Sugestão: {brl(suggestedTarget)}, 1 ano no simulador.
          </span>
        )}
      </label>

      {error && <p className="mt-2 text-sm font-medium text-destructive">{error}</p>}

      <Button
        type="submit"
        className="mt-5 min-h-12 w-full rounded-full bg-teal-deep text-sm font-semibold text-white hover:bg-teal-ink"
      >
        {initial ? "Salvar alterações" : "Criar minha aposta no futuro"}
      </Button>
    </form>
  );
}

function BetCard({
  bet,
  weekly,
  onChange,
  onDelete,
}: {
  bet: FutureBet;
  weekly: number | null;
  onChange: (b: FutureBet) => void;
  onDelete: () => void;
}) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(false);
  const [amount, setAmount] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const I = ICONS[bet.icon]?.icon ?? PiggyBank;
  const pct = Math.min(100, Math.round((bet.saved / bet.target) * 100));
  const remaining = Math.max(0, bet.target - bet.saved);
  const weeks = weekly && weekly > 0 ? Math.ceil(remaining / weekly) : null;

  if (editing) {
    return (
      <li>
        <BetForm
          initial={bet}
          suggestedTarget={0}
          onCancel={() => setEditing(false)}
          onSave={(b) => {
            onChange(b);
            setEditing(false);
          }}
        />
      </li>
    );
  }

  return (
    <li className="rounded-3xl border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-gold-soft text-gold-deep">
          <I className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-navy">{bet.name}</p>
          <p className="text-sm text-muted-foreground">
            Meta: <span className="font-semibold tabular-nums text-navy">{brl(bet.target)}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(true)}
          aria-label={`Editar ${bet.name}`}
          className="grid h-11 w-11 place-items-center rounded-full text-muted-foreground hover:bg-muted"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setConfirmDelete(true)}
          aria-label={`Excluir ${bet.name}`}
          className="-mr-2 grid h-11 w-11 place-items-center rounded-full text-muted-foreground hover:bg-muted"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div
        className="mt-3 h-2.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-gold transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-2xl bg-background p-3">
          <p className="text-muted-foreground">Registrado por você</p>
          <p className="mt-0.5 font-semibold tabular-nums text-navy">
            {brl(bet.saved)} <span className="font-normal text-muted-foreground">({pct}%)</span>
          </p>
        </div>
        <div className="rounded-2xl bg-background p-3">
          <p className="text-muted-foreground">Estimado</p>
          <p className="mt-0.5 font-semibold text-navy">
            {remaining === 0
              ? "Objetivo alcançado!"
              : weeks
                ? `~${weeks} ${weeks === 1 ? "semana" : "semanas"}`
                : "Use o simulador"}
          </p>
        </div>
      </div>

      {confirmDelete ? (
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-coral-soft p-2.5">
          <p className="flex-1 pl-1 text-sm font-medium text-navy">Excluir este objetivo?</p>
          <button
            type="button"
            onClick={onDelete}
            className="min-h-11 rounded-full bg-coral-deep px-4 text-sm font-semibold text-white"
          >
            Excluir
          </button>
          <button
            type="button"
            onClick={() => setConfirmDelete(false)}
            className="min-h-11 rounded-full px-3 text-sm font-semibold text-navy"
          >
            Cancelar
          </button>
        </div>
      ) : adding ? (
        <form
          className="mt-3 flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const v = parseBRL(amount);
            if (!Number.isFinite(v) || v <= 0) return;
            onChange({ ...bet, saved: Math.min(bet.saved + v, 10_000_000) });
            setAmount("");
            setAdding(false);
          }}
        >
          <span className="flex min-h-11 flex-1 items-center gap-1.5 rounded-full border border-input bg-background px-3 focus-within:border-teal-deep">
            <span className="text-sm font-semibold text-muted-foreground">R$</span>
            <input
              autoFocus
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9,.]/g, ""))}
              placeholder="Quanto você separou?"
              aria-label="Valor separado"
              className="w-full bg-transparent py-2 text-base outline-none"
            />
          </span>
          <button
            type="submit"
            className="min-h-11 rounded-full bg-teal-deep px-4 text-sm font-semibold text-white"
          >
            Registrar
          </button>
          <button
            type="button"
            onClick={() => setAdding(false)}
            aria-label="Cancelar"
            className="grid h-11 w-11 place-items-center rounded-full text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </form>
      ) : (
        remaining > 0 && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="mt-3 min-h-11 w-full rounded-full border border-teal-deep/30 px-4 text-sm font-semibold text-teal-deep transition-colors hover:bg-teal-soft"
          >
            + Registrar um valor que separei
          </button>
        )
      )}
    </li>
  );
}
