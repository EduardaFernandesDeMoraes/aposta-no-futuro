import { useRef } from "react";
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

const MONTHS = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

/** "2026-11-07" → "7 de novembro de 2026", sem passar por UTC. */
function formatDate(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return "";
  return `${d} de ${MONTHS[m - 1]} de ${y}`;
}

/**
 * Campo de data com visual próprio.
 *
 * O <input type="date"> nativo fica invisível por cima de todo o campo:
 * o toque abre o seletor do sistema (roda no iPhone, calendário no
 * Android e no desktop), mas quem desenha o texto somos nós. Assim o
 * valor fica centralizado na altura em qualquer navegador; o Safari do
 * iOS desenha o valor nativo colado no topo quando o campo é mais alto
 * que uma linha.
 */
export function DateField({
  id,
  value,
  onChange,
  min,
  max,
  placeholder = "Escolha uma data",
  className,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  placeholder?: string;
  className?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const shown = value ? formatDate(value) : "";

  return (
    <div
      className={cn(
        "relative flex min-h-12 w-full items-center gap-3 rounded-2xl border border-input bg-card px-4 transition-colors",
        "focus-within:border-teal-deep focus-within:ring-2 focus-within:ring-teal-deep/20",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("min-w-0 flex-1 truncate text-base", shown ? "text-navy" : "text-muted-foreground")}
      >
        {shown || placeholder}
      </span>
      <CalendarDays aria-hidden="true" className="h-5 w-5 flex-none text-teal-deep" />
      <input
        ref={ref}
        id={id}
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        onClick={() => {
          // No desktop o clique no meio do campo só foca o dia/mês/ano;
          // aqui ele sempre abre o calendário.
          try {
            ref.current?.showPicker?.();
          } catch {
            /* navegador sem showPicker: o seletor nativo continua acessível */
          }
        }}
        className="date-field-native absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </div>
  );
}
