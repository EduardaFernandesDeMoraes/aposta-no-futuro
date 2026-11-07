import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ShieldAlert, Info, Eye, Lock, Users, ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { WaitlistCard } from "@/components/waitlist-card";
import { track, EVENTS } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/comunidade")({
  head: () => ({
    meta: [
      { title: "Comunidade | Aposta no Futuro" },
      {
        name: "description",
        content:
          "Prévia da comunidade: veja exemplos de salas anônimas por tempo sem apostar e entre na lista de espera.",
      },
      { property: "og:title", content: "Comunidade — Aposta no Futuro" },
      {
        property: "og:description",
        content:
          "Prévia da comunidade anônima por tempo de abstinência e da rede de mentores voluntários em formação.",
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
  { id: "0-7", label: "Primeiros passos (0 a 7 dias)", short: "0–7d", color: "#B83427" },
  { id: "1s", label: "1 semana ou mais", short: "1 sem+", color: "#7D5200" },
  { id: "1m", label: "1 mês ou mais", short: "1 mês+", color: "#0A5249" },
  { id: "3m", label: "3 meses ou mais", short: "3 meses+", color: "#0D6B60" },
  { id: "6m", label: "6 meses ou mais", short: "6 meses+", color: "#0D6B60" },
  { id: "1a", label: "1 ano ou mais", short: "1 ano+", color: "#16233C" },
];

type Msg = { nick: string; text: string; when: string };

const SEED: Record<string, Msg[]> = {
  "0-7": [
    {
      nick: "Colibri82",
      text: "Cheguei hoje. Faz 2 dias que não abri o app. Tá difícil mas tô aqui.",
      when: "há 20 min",
    },
    {
      nick: "RaioDeSol",
      text: "Bem-vindo(a)! Os primeiros dias são os mais pesados mesmo. Um dia de cada vez 💚",
      when: "há 12 min",
    },
    {
      nick: "MarLivre",
      text: "Ontem quase recaí. Fui caminhar 20 minutos e passou. Deixo a dica.",
      when: "há 5 min",
    },
    {
      nick: "PassoLeve",
      text: "Estou no dia 4. Nunca achei que fosse chegar aqui. Obrigado por existirem.",
      when: "agora",
    },
  ],
  "1s": [
    {
      nick: "VentoNorte",
      text: "Fechei 10 dias hoje! Pequeno pra alguns, gigante pra mim.",
      when: "há 1 h",
    },
    {
      nick: "LuaCheia",
      text: "Parabéns!! Cada dia conta demais. Segue firme 🙌",
      when: "há 55 min",
    },
    {
      nick: "TrilhaNova",
      text: "Tive um dia difícil no trabalho e a vontade voltou. Vim aqui em vez de abrir o app.",
      when: "há 30 min",
    },
    {
      nick: "AuroraAzul",
      text: "Isso aí, TrilhaNova. Vir aqui já é uma vitória. Respira que passa.",
      when: "há 22 min",
    },
  ],
  "1m": [
    {
      nick: "PedraFirme",
      text: "35 dias. Comecei a guardar o dinheiro que ia pras bets numa conta separada. Já dá pra ver a diferença.",
      when: "há 2 h",
    },
    {
      nick: "BrisaMansa",
      text: "Que máximo! Eu tô no 40 e também tô guardando. Motiva demais ver o valor crescendo.",
      when: "há 1 h",
    },
    {
      nick: "NovoRumo",
      text: "Ontem sonhei que apostava e acordei aliviado por ser só sonho. Sinal de que a cabeça tá mudando.",
      when: "há 40 min",
    },
  ],
  "3m": [
    {
      nick: "SolPoente",
      text: "3 meses hoje. Chorei quando vi o contador. Valeu cada dia.",
      when: "há 3 h",
    },
    {
      nick: "CaminhoLeve",
      text: "Parabéns, Sol! Eu tô no 4º mês e a ansiedade diminuiu MUITO. Dá esperança pra quem tá começando.",
      when: "há 2 h",
    },
    {
      nick: "FolhaVerde",
      text: "Retomei os estudos com a grana que sobrou. Coisa que eu tinha largado por causa das bets.",
      when: "há 1 h",
    },
    { nick: "PortoSeguro", text: "Que lindo ler vocês. Segue firme, gente. 💚", when: "há 25 min" },
  ],
  "6m": [
    {
      nick: "MonteAlto",
      text: "6 meses e 3 dias. A vida ficou mais silenciosa, no melhor sentido.",
      when: "há 5 h",
    },
    {
      nick: "RioCalmo",
      text: "Assinei matrícula do curso técnico com o dinheiro guardado. Nunca imaginei.",
      when: "há 3 h",
    },
    {
      nick: "PassoCerto",
      text: "Ainda tenho dias em que penso, mas sei o que fazer agora. Obrigado a essa comunidade.",
      when: "há 1 h",
    },
  ],
  "1a": [
    {
      nick: "EstrelaGuia",
      text: "1 ano e 2 meses. Se eu consegui, você também consegue. Um dia de cada vez, sempre.",
      when: "há 6 h",
    },
    {
      nick: "HorizonteNovo",
      text: "Fez 1 ano semana passada. Voltei aqui pra retribuir o apoio que recebi lá no começo.",
      when: "há 4 h",
    },
    {
      nick: "AlmaLeve",
      text: "13 meses. A relação com dinheiro, sono e família mudou totalmente. Vale demais.",
      when: "há 2 h",
    },
    {
      nick: "CéuAberto",
      text: "Se estiver difícil hoje, respira. Aqui do outro lado é possível. 💚",
      when: "há 30 min",
    },
  ],
};

function PreviewBanner() {
  return (
    <div className="sticky top-[calc(4rem+1px+env(safe-area-inset-top))] z-20 -mx-4 flex items-start gap-2 border-b border-gold/30 bg-gold-soft px-4 py-3 text-sm text-gold-deep shadow-sm">
      <Eye className="mt-0.5 h-4 w-4 flex-none text-gold-deep" />
      <p>
        <strong>Prévia:</strong> estas conversas são exemplos. A comunidade ainda não está aberta e
        ninguém está lendo.
      </p>
    </div>
  );
}

function ExampleTag() {
  return (
    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
      exemplo
    </span>
  );
}

function LockScreen({ mentor = false, onPreview }: { mentor?: boolean; onPreview: () => void }) {
  return (
    <div className="-mx-4 flex min-h-[calc(100dvh-var(--nav-h,62px)-190px)] flex-col items-center justify-center bg-background px-6 py-10 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-soft">
        {mentor ? (
          <Users className="h-8 w-8 text-teal-deep" />
        ) : (
          <Lock className="h-8 w-8 text-teal-deep" />
        )}
      </div>

      <h2 className="mt-5 text-xl font-semibold text-navy">
        {mentor ? "A rede de mentores está em construção" : "A comunidade está em construção"}
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-navy/80">
        A gente está formando a rede de pessoas e mentores voluntários. Deixe seu e-mail e a gente
        avisa assim que ela abrir, com gente de verdade do outro lado.
      </p>

      <div className="mt-5 w-full max-w-sm">
        <WaitlistCard
          plain
          wantsToMentor={mentor}
          cta={mentor ? "Quero ser mentor" : "Entrar na lista"}
          successText={
            mentor
              ? "Assim que a rede de mentores começar, a gente te chama."
              : "Assim que a comunidade abrir com pessoas de verdade, a gente te avisa."
          }
        />
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={onPreview}
          className="min-h-11 text-sm text-muted-foreground underline underline-offset-2"
        >
          {mentor
            ? "Ver uma prévia fictícia de como serão os mentores"
            : "Ver uma prévia fictícia de como será a comunidade"}
        </button>
      </div>
    </div>
  );
}

function BackToLock({ onBack }: { onBack: () => void }) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="-ml-2 flex min-h-11 items-center gap-1.5 rounded-full px-2 text-sm font-semibold text-navy"
    >
      <ArrowLeft className="h-4 w-4" />
      Voltar
    </button>
  );
}

function Comunidade() {
  const [previewForum, setPreviewForum] = useState(false);
  const [previewMentores, setPreviewMentores] = useState(false);

  return (
    <AppShell
      title="Comunidade"
      intro="Um espaço anônimo para trocar com quem entende. Ainda em construção."
    >
      <Tabs defaultValue="forum" className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-full bg-muted p-1">
          <TabsTrigger
            value="forum"
            className="min-h-10 rounded-full data-[state=active]:bg-teal-deep data-[state=active]:text-white"
          >
            Fórum
          </TabsTrigger>
          <TabsTrigger
            value="mentores"
            className="min-h-10 rounded-full data-[state=active]:bg-teal-deep data-[state=active]:text-white"
          >
            Mentores
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forum" className="mt-4">
          {previewForum ? (
            <Forum onBack={() => setPreviewForum(false)} />
          ) : (
            <LockScreen
              onPreview={() => {
                track(EVENTS.communityPreview);
                setPreviewForum(true);
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="mentores" className="mt-4">
          {previewMentores ? (
            <Mentores onBack={() => setPreviewMentores(false)} />
          ) : (
            <LockScreen
              mentor
              onPreview={() => {
                track(EVENTS.communityPreview);
                setPreviewMentores(true);
              }}
            />
          )}
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

function Forum({ onBack }: { onBack: () => void }) {
  const [activeRoom, setActiveRoom] = useState<string>(ROOMS[0].id);
  const listRef = useRef<HTMLDivElement>(null);
  const navH = useRef<number>(62);

  const room = ROOMS.find((r) => r.id === activeRoom)!;
  const messages = SEED[activeRoom] ?? [];

  useEffect(() => {
    const nav = document.querySelector("nav");
    if (nav) navH.current = nav.getBoundingClientRect().height;
  }, []);

  return (
    <div className="isolate space-y-4">
      <PreviewBanner />
      <BackToLock onBack={onBack} />

      {/* Aviso de convivência */}
      <div className="flex items-start gap-2 rounded-2xl bg-gold-soft p-3 text-sm text-gold-deep">
        <ShieldAlert className="mt-0.5 h-4 w-4 flex-none text-gold-deep" />
        <p>
          <strong>Espaço anônimo e de respeito.</strong> Proibido divulgar apostas, casas de bet ou
          links de jogos.
        </p>
      </div>

      {/* Seletor de salas */}
      <div className="-mx-4 overflow-x-auto overscroll-x-contain scroll-smooth no-scrollbar">
        <div className="flex w-max gap-2 px-4 pb-1">
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
                    : "border-border bg-card text-navy/80 hover:border-border",
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
        className="w-full rounded-2xl border border-transparent p-4 text-white shadow-sm"
        style={{ backgroundColor: room.color }}
      >
        <p className="text-xs opacity-80">Sala</p>
        <h2 className="text-lg font-bold">{room.label}</h2>
        <p className="mt-1 text-xs opacity-90">Quando abrir, tudo será anônimo</p>
      </div>

      {/* Mensagens de exemplo */}
      <div ref={listRef} className="flex flex-col gap-3">
        {messages.map((m, i) => (
          <div
            key={`${m.nick}-${i}`}
            className="w-full rounded-2xl border border-border bg-card p-3 opacity-85"
          >
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-navy">{m.nick}</span>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{m.when}</span>
                <ExampleTag />
              </div>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-navy/80">{m.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

type Mentor = {
  id: string;
  name: string;
  timeLabel: string;
  bio: string;
  color: string;
  initials: string;
};

const MENTORES: Mentor[] = [
  {
    id: "rafa",
    name: "Rafa",
    timeLabel: "2 anos livre",
    bio: "Já estive onde você está. Bora conversar.",
    color: "#0D6B60",
    initials: "RA",
  },
  {
    id: "juliana",
    name: "Juliana",
    timeLabel: "1 ano e 4 meses livre",
    bio: "Um dia de cada vez também funcionou pra mim.",
    color: "#0D6B60",
    initials: "JU",
  },
  {
    id: "marcos",
    name: "Marcos",
    timeLabel: "3 anos livre",
    bio: "Recaí várias vezes antes de conseguir. Tá tudo bem recomeçar.",
    color: "#0A5249",
    initials: "MA",
  },
  {
    id: "bia",
    name: "Bia",
    timeLabel: "1 ano e 8 meses livre",
    bio: "A vida do outro lado é mais leve. Vem conversar.",
    color: "#7D5200",
    initials: "BI",
  },
];

function Mentores({ onBack }: { onBack: () => void }) {
  return (
    <div className="isolate space-y-4">
      <PreviewBanner />
      <BackToLock onBack={onBack} />

      <div className="flex items-start gap-2 rounded-2xl bg-teal-soft p-3 text-sm text-teal-ink">
        <Info className="mt-0.5 h-4 w-4 flex-none text-teal-deep" />
        <p>
          Estamos formando a rede de mentores voluntários (pessoas com 1 ano ou mais livres das
          apostas). Mentores oferecem escuta e apoio, mas{" "}
          <strong>não substituem atendimento profissional</strong> de saúde.
        </p>
      </div>

      <div className="space-y-3">
        {MENTORES.map((m) => (
          <div
            key={m.id}
            className="rounded-2xl border border-border bg-card p-4 opacity-85 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div
                className="flex h-14 w-14 flex-none items-center justify-center rounded-full text-lg font-bold text-white"
                style={{ backgroundColor: m.color }}
              >
                {m.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-navy">
                    {m.name} · <span className="font-normal text-navy/80">{m.timeLabel}</span>
                  </p>
                  <ExampleTag />
                </div>
                <p className="mt-0.5 text-sm text-navy/80">{m.bio}</p>
              </div>
            </div>
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="mt-3 w-full cursor-not-allowed rounded-full bg-teal-deep py-2.5 text-sm font-semibold text-white opacity-40"
            >
              Em breve
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
