import { track, EVENTS } from "@/lib/analytics";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const emailSchema = z
  .string()
  .trim()
  .email({ message: "Digite um e-mail válido" })
  .max(254, { message: "E-mail muito longo" });

/**
 * Lista de espera da Comunidade (tabela `lista_espera` no Supabase, só INSERT).
 * `tone="dark"` para usar sobre uma superfície escura (teal-ink).
 */
export function WaitlistCard({
  wantsToMentor = false,
  cta = "Me avise quando abrir",
  tone = "light",
  successText = "Assim que a comunidade abrir com pessoas de verdade, a gente te avisa.",
  onDone,
}: {
  wantsToMentor?: boolean;
  cta?: string;
  tone?: "light" | "dark";
  successText?: string;
  onDone?: () => void;
}) {
  const dark = tone === "dark";
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setError(null);
    setSending(true);
    const { error: dbError } = await supabase.from("lista_espera").insert({
      email: parsed.data.toLowerCase(),
      origem: wantsToMentor ? "mentor" : "comunidade",
    });
    setSending(false);
    // 23505 = e-mail já cadastrado: tratamos como sucesso.
    if (dbError && dbError.code !== "23505") {
      setError("Não consegui salvar agora. Verifique sua conexão e tente de novo.");
      return;
    }
    track(EVENTS.waitlistSignup);
    setDone(true);
    onDone?.();
  };

  if (done) {
    return (
      <div className="flex items-start gap-3 text-left" role="status">
        <CheckCircle2 className={cn("mt-0.5 h-5 w-5 flex-none", dark ? "text-[#7fe6da]" : "text-teal-deep")} />
        <div>
          <p className={cn("font-semibold", dark ? "text-white" : "text-navy")}>
            Pronto! Você está na lista.
          </p>
          <p className={cn("mt-1 text-sm", dark ? "text-white/80" : "text-navy/80")}>{successText}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full text-left" noValidate>
      <label htmlFor="waitlist-email" className="sr-only">
        Seu e-mail
      </label>
      <input
        id="waitlist-email"
        type="email"
        inputMode="email"
        autoComplete="email"
        maxLength={254}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="seu@email.com"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "waitlist-erro" : undefined}
        className="min-h-12 w-full rounded-2xl border border-input bg-card px-4 text-base text-navy outline-none placeholder:text-muted-foreground focus:border-teal-deep focus:ring-2 focus:ring-teal-deep/20"
      />
      {error && (
        <p
          id="waitlist-erro"
          role="alert"
          className={cn("mt-2 text-sm font-medium", dark ? "text-[#ffd2cb]" : "text-destructive")}
        >
          {error}
        </p>
      )}
      <Button
        type="submit"
        disabled={sending}
        className={cn(
          "mt-3 min-h-12 w-full rounded-full font-semibold",
          dark ? "bg-white text-teal-ink hover:bg-teal-soft" : "bg-teal-deep text-white hover:bg-teal-ink",
        )}
      >
        {sending ? "Enviando…" : cta}
      </Button>
      <p className={cn("mt-2 text-xs", dark ? "text-white/70" : "text-muted-foreground")}>
        Só para esse aviso. Nada de spam.
      </p>
    </form>
  );
}
