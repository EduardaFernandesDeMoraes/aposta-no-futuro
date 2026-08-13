import { useState } from "react";
import { CheckCircle2, Mail } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const emailSchema = z
  .string()
  .trim()
  .email({ message: "Digite um e-mail válido" })
  .max(254, { message: "E-mail muito longo" });

export function WaitlistCard({
  title,
  description,
  wantsToMentor = false,
  cta = "Entrar na lista",
}: {
  title: string;
  description: string;
  wantsToMentor?: boolean;
  cta?: string;
}) {
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
    const { error: dbError } = await supabase
      .from("community_waitlist")
      .insert({ email: parsed.data, wants_to_mentor: wantsToMentor });
    setSending(false);
    if (dbError) {
      setError("Não consegui salvar agora. Tente de novo em instantes.");
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-[#16BFAC] bg-[#E1F5EE] p-4">
        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-[#16BFAC]" />
        <div>
          <p className="font-semibold text-[#16233C]">Pronto! Você está na lista.</p>
          <p className="mt-1 text-sm text-slate-600">
            Assim que a comunidade abrir com pessoas de verdade, eu te aviso.
          </p>
        </div>
      </div>
    );
  }

  const inputId = wantsToMentor ? "waitlist-mentor-email" : "waitlist-email";

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-[#16BFAC] bg-[#E1F5EE] p-4"
    >
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4 flex-none text-[#16BFAC]" />
        <h3 className="font-semibold text-[#16233C]">{title}</h3>
      </div>
      <p className="mt-1 text-sm text-slate-600">{description}</p>

      <label htmlFor={inputId} className="sr-only">
        Seu e-mail
      </label>
      <input
        id={inputId}
        type="email"
        inputMode="email"
        autoComplete="email"
        maxLength={254}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="seu@email.com"
        className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base outline-none placeholder:text-slate-400 focus:border-[#16BFAC]"
      />
      {error && <p className="mt-1.5 text-xs text-[#FF5B4C]">{error}</p>}

      <Button
        type="submit"
        disabled={sending}
        className="mt-3 w-full rounded-full bg-[#16BFAC] text-white hover:bg-[#14ac9b]"
      >
        {sending ? "Enviando…" : cta}
      </Button>

      <p className="mt-2 text-xs text-slate-500">
        Só uso seu e-mail para esse aviso. Nada de spam.
      </p>
    </form>
  );
}
