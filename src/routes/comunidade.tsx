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
      { property: "og:title", content: "Comunidade — Aposta no Futuro" },
      {
        property: "og:description",
        content:
          "Fórum anônimo por tempo de abstinência e mentores voluntários pra você não caminhar sozinho.",
      },
      { property: "og:url", content: "https://apostanofuturo.online/comunidade" },
    ],
    links: [{ rel: "canonical", href: "https://apostanofuturo.online/comunidade" }],
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
          <Mentores />
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
      <div className="-mx-4 overflow-x-auto no-scrollbar px-4">
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
      <div className="sticky bottom-[calc(var(--nav-h)+env(safe-area-inset-bottom))] z-20 -mx-4 -mb-4 bg-background px-4 pb-3 pt-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_4px_20px_-6px_rgba(22,35,60,0.18)]">



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
            className="h-11 rounded-full bg-[#16BFAC] px-4 text-white transition-all duration-200 hover:bg-[#14ac9b] disabled:opacity-50"
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

    </div>
  );
}

type Mentor = {
  id: string;
  name: string;
  timeLabel: string;
  bio: string;
  intro: string;
  color: string;
  initials: string;
};

const MENTORES: Mentor[] = [
  {
    id: "rafa",
    name: "Rafa",
    timeLabel: "2 anos livre",
    bio: "Já estive onde você está. Bora conversar.",
    intro:
      "Oi! Sou o Rafa, faz 2 anos que parei. Se hoje tá pesado, me conta como você tá chegando aqui — sem julgamento nenhum.",
    color: "#16BFAC",
    initials: "RA",
  },
  {
    id: "juliana",
    name: "Juliana",
    timeLabel: "1 ano e 4 meses livre",
    bio: "Um dia de cada vez também funcionou pra mim.",
    intro:
      "Oi, sou a Juliana. Comecei igualzinho a você, achando que não ia dar. Me conta um pouco do seu momento — a gente vai devagar.",
    color: "#E8197E",
    initials: "JU",
  },
  {
    id: "marcos",
    name: "Marcos",
    timeLabel: "3 anos livre",
    bio: "Recaí várias vezes antes de conseguir. Tá tudo bem recomeçar.",
    intro:
      "E aí, sou o Marcos. Antes de firmar esses 3 anos eu recomecei umas 6 vezes. Se você recaiu ou tá com medo de recair, pode desabafar.",
    color: "#1CA0D8",
    initials: "MA",
  },
  {
    id: "bia",
    name: "Bia",
    timeLabel: "1 ano e 8 meses livre",
    bio: "A vida do outro lado é mais leve. Vem conversar.",
    intro:
      "Oi, sou a Bia 💚 Faz quase 2 anos. Me conta o que te trouxe aqui hoje — pode ser qualquer coisa, até só um oi.",
    color: "#F5A623",
    initials: "BI",
  },
];

type ChatMsg = { from: "mentor" | "me"; text: string };

function Mentores() {
  const [active, setActive] = useState<Mentor | null>(null);
  const [chats, setChats] = useLocalStorage<Record<string, ChatMsg[]>>(
    "anf.comunidade.mentores.chats",
    {},
  );

  if (active) {
    return (
      <MentorChat
        mentor={active}
        messages={chats[active.id] ?? [{ from: "mentor", text: active.intro }]}
        onSend={(text) =>
          setChats((c) => {
            const prev = c[active.id] ?? [{ from: "mentor", text: active.intro }];
            return { ...c, [active.id]: [...prev, { from: "me", text }] };
          })
        }
        onBack={() => setActive(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 rounded-2xl bg-[#1CA0D8]/10 p-3 text-sm text-[#0b4f6c]">
        <Info className="mt-0.5 h-4 w-4 flex-none text-[#1CA0D8]" />
        <p>
          Mentores são <strong>voluntários</strong> com pelo menos 1 ano sem
          apostar. Eles oferecem escuta e apoio, mas <strong>não substituem
          atendimento profissional</strong> de saúde.
        </p>
      </div>

      <div className="space-y-3">
        {MENTORES.map((m) => (
          <div
            key={m.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-14 w-14 flex-none items-center justify-center rounded-full text-lg font-bold text-white"
                style={{ backgroundColor: m.color }}
              >
                {m.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[#16233C]">
                  {m.name} — <span className="font-normal text-slate-600">{m.timeLabel}</span>
                </p>
                <p className="mt-0.5 text-sm text-slate-600">{m.bio}</p>
              </div>
            </div>
            <Button
              type="button"
              onClick={() => setActive(m)}
              className="mt-3 w-full rounded-full bg-[#16BFAC] text-white transition-all duration-200 hover:bg-[#14ac9b]"
            >
              Conversar
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function MentorChat({
  mentor,
  messages,
  onSend,
  onBack,
}: {
  mentor: Mentor;
  messages: ChatMsg[];
  onSend: (text: string) => void;
  onBack: () => void;
}) {
  const [draft, setDraft] = useState("");

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft("");
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#16BFAC]"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar para mentores
      </button>

      <div
        className="flex items-center gap-3 rounded-2xl p-3 text-white shadow-sm"
        style={{ backgroundColor: mentor.color }}
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 font-bold">
          {mentor.initials}
        </div>
        <div>
          <p className="font-semibold">{mentor.name}</p>
          <p className="text-xs opacity-90">{mentor.timeLabel} · voluntário(a)</p>
        </div>
      </div>

      <div className="space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
              m.from === "mentor"
                ? "bg-slate-100 text-slate-800"
                : "ml-auto bg-[#16BFAC] text-white",
            )}
          >
            {m.text}
          </div>
        ))}
      </div>

      <p className="rounded-xl bg-slate-50 p-2 text-center text-[11px] text-slate-500">
        Mentores são voluntários e não substituem atendimento profissional.
      </p>

      <div className="sticky bottom-[calc(var(--nav-h)+env(safe-area-inset-bottom))] z-20 -mx-4 -mb-4 bg-background px-4 pb-3 pt-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_4px_20px_-6px_rgba(22,35,60,0.18)]">
        <div className="flex items-end gap-2">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Escreva para ${mentor.name}…`}
            rows={2}
            className="min-h-[44px] resize-none rounded-2xl border-slate-200 text-sm"
          />
          <Button
            type="button"
            onClick={send}
            disabled={!draft.trim()}
            className="h-11 rounded-full bg-[#16BFAC] px-4 text-white transition-all duration-200 hover:bg-[#14ac9b] disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
