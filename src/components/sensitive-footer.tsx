/** Aviso padrão no rodapé de telas com conteúdo sensível. */
export function SensitiveFooter({ className = "" }: { className?: string }) {
  return (
    <p
      className={`mt-8 rounded-2xl bg-secondary p-3 text-center text-xs leading-relaxed text-muted-foreground ${className}`}
    >
      O Aposta no Futuro não substitui atendimento profissional e não oferece
      apoio em tempo real.
    </p>
  );
}
