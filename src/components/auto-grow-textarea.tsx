import { forwardRef, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const MIN_H = 48;
const MAX_H = 120;

export type AutoGrowTextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

/** Textarea de altura automática: 1 linha (48px) até 4 linhas (120px),
 *  rolando internamente depois disso, sempre sem barra de rolagem visível. */
export const AutoGrowTextarea = forwardRef<
  HTMLTextAreaElement,
  AutoGrowTextareaProps
>(function AutoGrowTextarea({ className, value, onChange, ...props }, ref) {
  const innerRef = useRef<HTMLTextAreaElement | null>(null);

  const resize = useCallback(() => {
    const el = innerRef.current;
    if (!el) return;
    el.style.height = "auto";
    const next = Math.min(Math.max(el.scrollHeight, MIN_H), MAX_H);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > MAX_H ? "auto" : "hidden";
  }, []);

  useEffect(() => {
    resize();
  }, [value, resize]);

  return (
    <textarea
      ref={(node) => {
        innerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      rows={1}
      value={value}
      onChange={(e) => {
        onChange?.(e);
        resize();
      }}
      className={cn(
        "no-scrollbar block w-full resize-none overflow-y-auto text-base leading-6 md:text-base",
        className,
      )}
      style={{ height: MIN_H, maxHeight: MAX_H, ...props.style }}
      {...props}
    />
  );
});
