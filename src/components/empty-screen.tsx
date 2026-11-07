import { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function EmptyScreen({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="mt-6 px-2 py-10 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal-soft text-teal-deep">
        <Icon className="h-7 w-7" strokeWidth={1.8} />
      </div>
      <h2 className="mt-5 text-xl font-semibold text-navy">{title}</h2>
      <p className="mx-auto mt-2 max-w-[38ch] text-[0.95rem] leading-relaxed text-muted-foreground">
        {description}
      </p>
      {children ? <div className="mt-6">{children}</div> : null}
    </div>
  );
}
