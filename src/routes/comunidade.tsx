import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ShieldAlert, Send, ArrowLeft, Info } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/comunidade")({
  head: () => ({
    meta: [
      { title: "Comunidade | Aposta no Futuro" },
      {
        name: "description",
        content:
          "Salas anônimas por tempo sem apostar e mentores pra você não caminhar sozinho.",
      },
    ],
  }),
  component: Comunidade,
});

type Room = {
  id: string;
  label: string;
  short: string;
  color: string;
};

const ROOMS: Room[] = [
  { id: "0-7", label: "Primeiros passos (0 a 7 dias)", short: "0–7d", color: "#FF5B4C" },
  { id: "1s", label: "1 semana ou mais", short: "1 sem+", color: "#F5A623" },
  { id: "1m", label: "1 mês ou mais", short: "1 mês+", color: "#1CA0D8" },
  { id: "3m", label: "3 meses ou mais", short: "3 meses+", color: "#16BFAC" },
  { id: "6m", label: "6 meses ou mais", short: "6 meses+", color: "#E8197E" },
  { id: "1a", label: "1 ano ou mais", short: "1 ano+", color: "#16233C" },
];

type Msg = { nick: string; text: string; when: string };

const SEED: Record<string, Msg[]> = {
  "0-7": [
    { nick: "Colibri82", text: "Cheguei hoje. Faz 2 dias que não abri o app. Tá difícil mas tô aqui.", when: "há 20 min" },
    { nick: "RaioDeSol", text: "Bem-vindo(a)! Os primeiros dias são os mais pesados mesmo. Um dia de cada vez 💚", when: "há 12 min" },
    { nick: "MarLivre", text: "Ontem quase recaí. Fui caminhar 20 minutos e passou. Deixo a dica.", when: "há 5 min" },
    { nick: "PassoLeve", text: "Estou no dia 4. Nunca achei que fosse chegar aqui. Obrigado por existirem.", when: "agora" },
  ],
  "1s": [
    { nick: "VentoNorte", text: "Fechei 10 dias hoje! Pequeno pra alguns, gigante pra mim.", when: "há 1 h" },
    { nick: "LuaCheia", text: "Parabéns!! Cada dia conta demais. Segue firme 🙌", when: "há 55 min" },
    { nick: "TrilhaNova", text: "Tive um dia difícil no trabalho e a vontade voltou. Vim aqui em vez de abrir o app.", when: "há 30 min" },
    { nick: "AuroraAzul", text: "Isso aí, TrilhaNova. Vir aqui já é uma vitória. Respira que passa.", when: "há 22 min" },
  ],
  "1m": [
    { nick: "PedraFirme", text: "35 dias. Comecei a guardar o dinheiro que ia pras bets numa conta separada. Já dá pra ver a diferença.", when: "há 2 h" },
    { nick: "BrisaMansa", text: "Que máximo! Eu tô no 40 e também tô guardando. Motiva demais ver o valor crescendo.", when: "há 1 h" },
    { nick: "NovoRumo", text: "Ontem sonhei que apostava e acordei aliviado por ser só sonho. Sinal de que a cabeça tá mudando.", when: "há 40 min" },
  ],
  "3m": [
    { nick: "SolPoente", text: "3 meses hoje. Chorei quando vi o contador. Valeu cada dia.", when: "há 3 h" },
    { nick: "CaminhoLeve", text: "Parabéns, Sol! Eu tô no 4º mês e a ansiedade diminuiu MUITO. Dá esperança pra quem tá começando.", when: "há 2 h" },
    { nick: "FolhaVerde", text: "Retomei os estudos com a grana que sobrou. Coisa que eu tinha largado por causa das bets.", when: "há 1 h" },
    { nick: "PortoSeguro", text: "Que lindo ler vocês. Segue firme, gente. 💚", when: "há 25 min" },
  ],
  "6m": [
    { nick: "MonteAlto", text: "6 meses e 3 dias. A vida ficou mais silenciosa, no melhor sentido.", when: "há 5 h" },
    { nick: "RioCalmo", text: "Assinei matrícula do curso técnico com o dinheiro guardado. Nunca imaginei.", when: "há 3 h" },
    { nick: "PassoCerto", text: "Ainda tenho dias em que penso, mas sei o que fazer agora. Obrigado a essa comunidade.", when: "há 1 h" },
  ],
  "1a": [
    { nick: "EstrelaGuia", text: "1 ano e 2 meses. Se eu consegui, você também consegue. Um dia de cada vez, sempre.", when: "há 6 h" },
    { nick: "HorizonteNovo", text: "Fez 1 ano semana passada. Voltei aqui pra retribuir o apoio que recebi lá no começo.", when: "há 4 h" },
    { nick: "AlmaLeve", text: "13 meses. A relação com dinheiro, sono e família mudou totalmente. Vale demais.", when: "há 2 h" },
    { nick: "CéuAberto", text: "Se estiver difícil hoje, respira. Aqui do outro lado é possível. 💚", when: "há 30 min" },
  ],
};

const NICKS = [
  "Colibri82", "MarLivre", "RaioDeSol", "VentoNorte", "LuaCheia",
  "PedraFirme", "BrisaMansa", "NovoRumo", "SolPoente", "CaminhoLeve",
  "AuroraAzul", "PassoLeve", "TrilhaNova",
];

function pickNick(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return NICKS[h % NICKS.length];
}

function Comunidade() {
  const [posts, setPosts] = useLocalStorage<Record<string, Msg[]>>(
    "anf.comunidade.posts",
    {},
  );
  const [nick] = useLocalStorage<string>(
    "anf.comunidade.nick",
    pickNick(String(Date.now())),
  );

  return (
    <AppShell title="Comunidade">
      <Tabs defaultValue="forum" className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-full bg-slate-100 p-1">
          <TabsTrigger
            value="forum"
            className="rounded-full data-[state=active]:bg-[#16BFAC] data-[state=active]:text-white"
          >
            Fórum
          </TabsTrigger>
          <TabsTrigger
            value="mentores"
            className="rounded-full data-[state=active]:bg-[#16BFAC] data-[state=active]:text-white"
          >
            Mentores
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forum" className="mt-4">
          <Forum posts={posts} setPosts={setPosts} nick={nick} />
        </TabsContent>

        <TabsContent value="mentores" className="mt-4">
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <Users className="h-10 w-10 text-[#1CA0D8]" />
            <h2 className="text-lg font-semibold text-[#16233C]">
              Mentores em breve
            </h2>
            <p className="text-sm text-slate-600">
              Vamos conectar você com quem já passou por essa jornada e quer
              caminhar junto.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

function Forum({
  posts,
  setPosts,
  nick,
}: {
  posts: Record<string, Msg[]>;
  setPosts: (u: (p: Record<string, Msg[]>) => Record<string, Msg[]>) => void;
  nick: string;
}) {
  const [activeRoom, setActiveRoom] = useState<string>(ROOMS[0].id);
  const [draft, setDraft] = useState("");

  const room = ROOMS.find((r) => r.id === activeRoom)!;
  const messages = useMemo(() => {
    return [...(SEED[activeRoom] ?? []), ...(posts[activeRoom] ?? [])];
  }, [activeRoom, posts]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setPosts((p) => ({
      ...p,
      [activeRoom]: [...(p[activeRoom] ?? []), { nick, text, when: "agora" }],
    }));
    setDraft("");
  };

  return (
    <div className="space-y-4">
      {/* Aviso */}
      <div className="flex items-start gap-2 rounded-2xl bg-[#F5A623]/10 p-3 text-sm text-[#7a4e00]">
        <ShieldAlert className="mt-0.5 h-4 w-4 flex-none text-[#F5A623]" />
        <p>
          <strong>Espaço anônimo e de respeito.</strong> Proibido divulgar
          apostas, casas de bet ou links de jogos.
        </p>
      </div>

      {/* Seletor de salas */}
      <div className="-mx-4 overflow-x-auto px-4">
        <div className="flex gap-2 pb-1">
          {ROOMS.map((r) => {
            const active = r.id === activeRoom;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setActiveRoom(r.id)}
                className={cn(
                  "whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                  active
                    ? "border-transparent text-white shadow"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                )}
                style={active ? { backgroundColor: r.color } : undefined}
              >
                {r.short}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cabeçalho da sala */}
      <div
        className="rounded-2xl p-4 text-white shadow-sm"
        style={{ backgroundColor: room.color }}
      >
        <p className="text-xs uppercase tracking-wide opacity-80">Sala</p>
        <h2 className="text-lg font-bold">{room.label}</h2>
        <p className="mt-1 text-xs opacity-90">
          Você entra como <strong>{nick}</strong> · tudo anônimo
        </p>
      </div>

      {/* Mensagens */}
      <div className="space-y-3">
        {messages.map((m, i) => (
          <div
            key={`${m.nick}-${i}`}
            className="rounded-2xl border border-slate-200 bg-white p-3"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#16233C]">{m.nick}</span>
              <span className="text-slate-400">{m.when}</span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
              {m.text}
            </p>
          </div>
        ))}
      </div>

      {/* Composer */}
      <div className="sticky bottom-0 -mx-4 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="flex items-end gap-2">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Escreva algo acolhedor pra sala "${room.short}"…`}
            rows={2}
            className="min-h-[44px] resize-none rounded-2xl border-slate-200 text-sm"
          />
          <Button
            type="button"
            onClick={send}
            disabled={!draft.trim()}
            className="h-11 rounded-full bg-[#16BFAC] px-4 text-white hover:bg-[#12a595] disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-1.5 text-[11px] text-slate-400">
          Você aparece como <strong>{nick}</strong>. Nada de dados pessoais nem
          links, tá?
        </p>
      </div>
    </div>
  );
}
