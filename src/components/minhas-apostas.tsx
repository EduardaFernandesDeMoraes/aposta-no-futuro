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
    <section id="minhas-apostas" className="mt-6 scroll-mt-20">
      <div className="rounded-3xl bg-navy p-5 text-white shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#0AF0FB]">
          Minhas apostas no futuro
        </p>
        <h2 className="mt-1 text-lg font-bold leading-snug">
          E se esse dinheiro fosse para o seu futuro?
        </h2>
        <p className="mt-1.5 text-sm text-white/80">
          Transforme o valor que você deixa de apostar em objetivos reais. Esta é a única aposta que
          nunca vira dívida.
        </p>
        {!creating && (
          <Button
            onClick={() => setCreating(true)}
            className="mt-4 h-11 rounded-full bg-teal px-5 text-sm font-semibold text-navy hover:bg-[#14ac9b]"
          >
            <Plus className="mr-1 h-4 w-4" /> Criar uma aposta no futuro
          </Button>
        )}
      </div>

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
        <ul className="mt-3 space-y-3">
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

      <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
        É só um planejamento: o app não guarda, movimenta nem investe dinheiro. Seus objetivos ficam
        salvos apenas neste aparelho.
      </p>
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
    <form onSubmit={submit} className="mt-3 rounded-3xl bg-card p-5 shadow-card">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-navy">
          {initial ? "Editar objetivo" : "Novo objetivo"}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cancelar"
          className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <label className="mt-3 block">
        <span className="mb-1.5 block text-xs font-medium text-navy">Qual é o objetivo?</span>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError(null);
          }}
          maxLength={40}
          placeholder="Ex.: Reserva de emergência, curso de inglês…"
          className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-base outline-none focus:border-teal md:text-sm"
        />
      </label>

      <div className="mt-3">
        <span className="mb-1.5 block text-xs font-medium text-navy">Escolha um ícone</span>
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
                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  icon === k
                    ? "border-teal bg-[#E1F5EE] text-[#0d6b60]"
                    : "border-border bg-background text-navy/80 hover:border-teal/40",
                )}
              >
                <I className="h-3.5 w-3.5" /> {ICONS[k].label}
              </button>
            );
          })}
        </div>
      </div>

      <label className="mt-3 block">
        <span className="mb-1.5 block text-xs font-medium text-navy">Quanto você quer juntar?</span>
        <span className="flex items-center gap-2 rounded-2xl border border-border bg-background px-4 focus-within:border-teal">
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
          <span className="mt-1.5 block text-[11px] text-muted-foreground">
            Sugestão: o valor estimado de 1 ano do simulador ({brl(suggestedTarget)}).
          </span>
        )}
      </label>

      {error && <p className="mt-2 text-xs font-medium text-destructive">{error}</p>}

      <Button
        type="submit"
        className="mt-4 h-11 w-full rounded-full bg-teal text-sm font-semibold text-navy hover:bg-[#14ac9b]"
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
    <li className="rounded-3xl bg-card p-4 shadow-card">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 flex-none place-items-center rounded-2xl bg-[#E1F5EE] text-[#0d6b60]">
          <I className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-navy">{bet.name}</p>
          <p className="text-xs text-muted-foreground">
            Meta: <span className="font-semibold tabular-nums text-navy">{brl(bet.target)}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(true)}
          aria-label={`Editar ${bet.name}`}
          className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-muted"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setConfirmDelete(true)}
          aria-label={`Excluir ${bet.name}`}
          className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-muted"
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
          className="h-full rounded-full bg-teal transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl bg-background p-2.5">
          <p className="text-muted-foreground">Registrado por você</p>
          <p className="mt-0.5 font-semibold tabular-nums text-navy">
            {brl(bet.saved)} <span className="font-normal text-muted-foreground">({pct}%)</span>
          </p>
        </div>
        <div className="rounded-xl bg-background p-2.5">
          <p className="text-muted-foreground">Estimado</p>
          <p className="mt-0.5 font-semibold text-navy">
            {remaining === 0
              ? "Objetivo alcançado! 🎉"
              : weeks
                ? `~${weeks} ${weeks === 1 ? "semana" : "semanas"}`
                : "Use o simulador"}
          </p>
        </div>
      </div>
      {weeks && remaining > 0 && (
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          Se você direcionar {brl(weekly!)} por semana para este objetivo.
        </p>
      )}

      {confirmDelete ? (
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-coral/10 p-2.5">
          <p className="flex-1 text-xs font-medium text-navy">Excluir este objetivo?</p>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-full bg-coral px-3 py-1.5 text-xs font-semibold text-white"
          >
            Excluir
          </button>
          <button
            type="button"
            onClick={() => setConfirmDelete(false)}
            className="rounded-full px-3 py-1.5 text-xs font-semibold text-navy"
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
          <span className="flex flex-1 items-center gap-1.5 rounded-full border border-border bg-background px-3 focus-within:border-teal">
            <span className="text-xs font-semibold text-muted-foreground">R$</span>
            <input
              autoFocus
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9,.]/g, ""))}
              placeholder="Quanto você separou?"
              aria-label="Valor separado"
              className="w-full bg-transparent py-2 text-sm outline-none"
            />
          </span>
          <button
            type="submit"
            className="rounded-full bg-teal px-4 py-2 text-xs font-semibold text-navy"
          >
            Registrar
          </button>
          <button
            type="button"
            onClick={() => setAdding(false)}
            aria-label="Cancelar"
            className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </form>
      ) : (
        remaining > 0 && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="mt-3 w-full rounded-full border border-teal/40 px-4 py-2 text-xs font-semibold text-[#0d6b60] transition-colors hover:bg-[#E1F5EE]"
          >
            + Registrar um valor que separei
          </button>
        )
      )}
    </li>
  );
}
