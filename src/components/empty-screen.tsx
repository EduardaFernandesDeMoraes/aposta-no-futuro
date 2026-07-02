import { ReactNode } from "react";

export function EmptyScreen({
  emoji,
  title,
  description,
  children,
}: {
  emoji: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="mt-6 rounded-3xl border border-border bg-card p-8 text-center shadow-card">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-secondary text-3xl">
        {emoji}
      </div>
      <h2 className="mt-4 text-lg font-semibold text-navy">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      {children ? <div className="mt-4">{children}</div> : null}
      <p className="mt-6 text-[11px] text-muted-foreground">
        Em breve, mais conteúdo por aqui 💚
      </p>
    </div>
  );
}
