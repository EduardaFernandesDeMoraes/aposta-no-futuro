import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Home,
  Calculator,
  Users,
  Trophy,
  User,
  LifeBuoy,
  MessageCircle,
  Phone,
  X,
  RotateCcw,
  Wind,
  Timer,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

type Tab = {
  to: string;
  label: string;
  icon: typeof Home;
};

const TABS: Tab[] = [
  { to: "/", label: "Início", icon: Home },
  { to: "/simulador", label: "Simulador", icon: Calculator },
  { to: "/comunidade", label: "Comunidade", icon: Users },
  { to: "/desafios", label: "Desafios", icon: Trophy },
  { to: "/perfil", label: "Perfil", icon: User },
];

export function AppShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [helpOpen, setHelpOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-dvh bg-background text-navy flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-navy text-navy-foreground shadow-soft">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3 px-4 py-3">
          <h1 className="truncate text-lg font-semibold tracking-tight">
            {title}
          </h1>
          <button
            onClick={() => setHelpOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-coral px-3 py-1.5 text-xs font-semibold text-coral-foreground shadow-soft transition-transform active:scale-95"
          >
            <LifeBuoy className="h-3.5 w-3.5" />
            Preciso de ajuda
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto w-full max-w-md flex-1 px-4 pb-28 pt-4">
        {children}
      </main>

      {/* Floating chat button */}
      <button
        onClick={() => setChatOpen(true)}
        aria-label="Abrir assistente virtual"
        className="fixed bottom-24 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-teal text-teal-foreground shadow-[0_8px_24px_-6px_rgba(22,191,172,0.6)] transition-transform active:scale-95"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-navy text-navy-foreground">
        <ul className="mx-auto grid max-w-md grid-cols-5">
          {TABS.map((tab) => {
            const active =
              tab.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(tab.to);
            const Icon = tab.icon;
            return (
              <li key={tab.to}>
                <Link
                  to={tab.to}
                  className={cn(
                    "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                    active ? "text-teal" : "text-white/70",
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <HelpSheet open={helpOpen} onOpenChange={setHelpOpen} />
      <ChatSheet open={chatOpen} onOpenChange={setChatOpen} />
    </div>
  );
}

function HelpSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl border-0 p-6">
        <SheetHeader className="text-left">
          <SheetTitle className="text-navy text-xl">
            Você não está sozinho 💚
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Se precisar conversar agora, essas pessoas podem te ajudar,
            gratuitamente e sem julgamento.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-5 space-y-3">
          <a
            href="tel:188"
            className="flex items-center gap-3 rounded-2xl bg-coral p-4 text-coral-foreground shadow-soft"
          >
            <div className="grid h-11 w-11 place-items-center rounded-full bg-white/20">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold">CVV — Ligar 188</div>
              <div className="text-xs opacity-90">
                24h, gratuito, sigiloso.
              </div>
            </div>
          </a>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
            <div className="text-sm font-semibold text-navy">
              CAPS mais próximo
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Os Centros de Atenção Psicossocial (CAPS) do SUS oferecem
              atendimento gratuito para questões de saúde mental, incluindo
              dependências.
            </p>
          </div>

          <div className="rounded-2xl bg-secondary p-4 text-xs text-muted-foreground">
            Lembre: este app é um apoio, não substitui acompanhamento
            profissional.
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ChatSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [input, setInput] = useState("");
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[85dvh] rounded-t-3xl border-0 p-0"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border bg-navy px-4 py-3 text-navy-foreground rounded-t-3xl">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-teal">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold">Assistente Aposta no Futuro</div>
                <div className="text-[11px] text-white/60">Aqui pra te ouvir, sem julgamento.</div>
              </div>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-full p-1 text-white/70 hover:text-white"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-background p-4">
            <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-card p-3 text-sm shadow-card">
              Oi! Eu sou seu assistente. Como você está se sentindo hoje?
            </div>
            <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-card p-3 text-sm shadow-card">
              Se quiser, me conta o que está passando. Também posso te lembrar
              dos seus dias livres 💚
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setInput("");
            }}
            className="flex items-center gap-2 border-t border-border bg-card p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escreva uma mensagem…"
              className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-teal"
            />
            <Button
              type="submit"
              size="icon"
              className="h-10 w-10 rounded-full bg-teal text-teal-foreground hover:bg-teal/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
