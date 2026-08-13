import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ShieldAlert, Send, Info, Eye, Lock, Users, ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { SensitiveFooter } from "@/components/sensitive-footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AutoGrowTextarea } from "@/components/auto-grow-textarea";
import { WaitlistCard } from "@/components/waitlist-card";
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

/** Mede o composer fixo e a barra de navegação para reservar espaço na lista. */
function useComposerHeight() {
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [pad, setPad] = useState(96);
  const [navH, setNavH] = useState(62);
  const measureRef = useRef<() => void>(() => {});

  useEffect(() => {
    const el = ref.current;
    const nav = document.querySelector("nav");
    const main = document.querySelector("main");
    const update = () => {
      const composerH = el?.offsetHeight ?? 0;
      const h = nav?.getBoundingClientRect().height ?? 0;
      setNavH(h);

      const list = listRef.current;
      const lastCard = list?.lastElementChild as HTMLElement | null;
      if (!list || !lastCard) return;

      const docH = document.documentElement.scrollHeight;
      const lastBottomAbs =
        lastCard.getBoundingClientRect().bottom + window.scrollY;
      const currentPad = parseFloat(getComputedStyle(list).paddingBottom) || 0;
      const below = docH - (lastBottomAbs + currentPad);

      setPad(Math.max(0, composerH + h + 16 - below));
    };

    measureRef.current = update;
    update();
    const ro = new ResizeObserver(update);
    if (el) ro.observe(el);
    if (nav) ro.observe(nav);
    if (main) ro.observe(main);

    return () => ro.disconnect();
  }, []);

  const measure = () => measureRef.current();

  return { ref, listRef, pad, navH, measure };
}

function PreviewBanner() {
  return (
    <div className="flex items-start gap-2 rounded-2xl bg-[#F5A623]/20 p-3 text-sm text-[#5c3a00]">
      <Eye className="mt-0.5 h-4 w-4 flex-none text-[#F5A623]" />
      <p>
        <strong>Prévia:</strong> as conversas abaixo são exemplos criados para
        você ver como a comunidade vai funcionar. Ela ainda não está aberta.
      </p>
    </div>
  );
}

function ExampleTag() {
  return (
    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
      exemplo
    </span>
  );
}

function LockScreen({
  mentor = false,
  onPreview,
}: {
  mentor?: boolean;
  onPreview: () => void;
}) {
  return (
    <div className="-mx-4 flex min-h-[calc(100dvh-var(--nav-h,62px)-190px)] flex-col items-center justify-center bg-[#F7FAFC] px-6 py-10 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E1F5EE]">
        {mentor ? (
          <Users className="h-8 w-8 text-[#16BFAC]" />
        ) : (
          <Lock className="h-8 w-8 text-[#16BFAC]" />
        )}
      </div>

      <h2 className="mt-4 text-xl font-bold text-[#16233C]">
        {mentor ? "A rede de mentores está em construção" : "A comunidade está em construção"}
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-600">
        Estou formando a rede de pessoas e mentores voluntários. Deixe seu e-mail
        e eu aviso assim que ela abrir, com gente de verdade do outro lado.
      </p>

      <div className="mt-5 w-full max-w-sm">
        <WaitlistCard
          plain
          wantsToMentor={mentor}
          cta={mentor ? "Quero ser mentor" : "Entrar na lista"}
          successText={
            mentor
              ? "Assim que a rede de mentores começar, eu te chamo."
              : "Assim que a comunidade abrir com pessoas de verdade, eu te aviso."
          }
        />
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={onPreview}
          className="text-[13px] text-[#596273] underline underline-offset-2"
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
      className="flex items-center gap-1.5 text-sm font-semibold text-[#16233C]"
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
          {previewForum ? (
            <Forum onBack={() => setPreviewForum(false)} />
          ) : (
            <LockScreen onPreview={() => setPreviewForum(true)} />
          )}
        </TabsContent>

        <TabsContent value="mentores" className="mt-4">
          {previewMentores ? (
            <Mentores onBack={() => setPreviewMentores(false)} />
          ) : (
            <LockScreen mentor onPreview={() => setPreviewMentores(true)} />
          )}
        </TabsContent>
      </Tabs>
      {(previewForum || previewMentores) && <SensitiveFooter />}
    </AppShell>
  );
}

function Forum({ onBack }: { onBack: () => void }) {
  const [activeRoom, setActiveRoom] = useState<string>(ROOMS[0].id);
  const {
    ref: composerRef,
    listRef,
    pad: listPad,
    navH,
    measure,
  } = useComposerHeight();

  const room = ROOMS.find((r) => r.id === activeRoom)!;
  const messages = SEED[activeRoom] ?? [];

  useEffect(() => {
    measure();
  }, [activeRoom]);

  return (
    <div className="space-y-4">
      <PreviewBanner />
      <BackToLock onBack={onBack} />


      {/* Aviso de convivência */}
      <div className="flex items-start gap-2 rounded-2xl bg-[#F5A623]/10 p-3 text-sm text-[#7a4e00]">
        <ShieldAlert className="mt-0.5 h-4 w-4 flex-none text-[#F5A623]" />
        <p>
          <strong>Espaço anônimo e de respeito.</strong> Proibido divulgar
          apostas, casas de bet ou links de jogos.
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
        className="w-full rounded-2xl border border-transparent p-4 text-white shadow-sm"
        style={{ backgroundColor: room.color }}
      >
        <p className="text-xs uppercase tracking-wide opacity-80">Sala</p>
        <h2 className="text-lg font-bold">{room.label}</h2>
        <p className="mt-1 text-xs opacity-90">
          Quando abrir, tudo será anônimo
        </p>
      </div>

      {/* Mensagens de exemplo */}
      <div
        ref={listRef}
        className="flex flex-col gap-3"
        style={{ paddingBottom: listPad }}
      >
        {messages.map((m, i) => (
          <div
            key={`${m.nick}-${i}`}
            className="w-full rounded-2xl border border-slate-200 bg-white p-3 opacity-85"
          >
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-[#16233C]">{m.nick}</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">{m.when}</span>
                <ExampleTag />
              </div>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
              {m.text}
            </p>
          </div>
        ))}
      </div>

      {/* Composer desativado */}
      <div
        ref={composerRef}
        className="fixed inset-x-0 z-20 border-t border-slate-200 bg-white"
        style={{ bottom: navH }}
      >
        <div className="mx-auto w-full max-w-md px-4 pb-3 pt-3">
          <div className="flex items-center gap-2">
            <AutoGrowTextarea
              value=""
              readOnly
              disabled
              tabIndex={-1}
              placeholder="A comunidade abre em breve"
              aria-label="Envio de mensagens indisponível na prévia"
              className="min-w-0 flex-1 cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-400 outline-none placeholder:text-slate-400"
            />
            <button
              type="button"
              disabled
              aria-disabled="true"
              aria-label="Envio indisponível na prévia"
              className="flex h-12 w-12 flex-none cursor-not-allowed items-center justify-center rounded-full bg-[#16BFAC] text-white opacity-40"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>

          <p className="mt-1.5 text-xs leading-snug text-slate-400">
            Prévia demonstrativa · envio desativado
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
  color: string;
  initials: string;
};

const MENTORES: Mentor[] = [
  {
    id: "rafa",
    name: "Rafa",
    timeLabel: "2 anos livre",
    bio: "Já estive onde você está. Bora conversar.",
    color: "#16BFAC",
    initials: "RA",
  },
  {
    id: "juliana",
    name: "Juliana",
    timeLabel: "1 ano e 4 meses livre",
    bio: "Um dia de cada vez também funcionou pra mim.",
    color: "#E8197E",
    initials: "JU",
  },
  {
    id: "marcos",
    name: "Marcos",
    timeLabel: "3 anos livre",
    bio: "Recaí várias vezes antes de conseguir. Tá tudo bem recomeçar.",
    color: "#1CA0D8",
    initials: "MA",
  },
  {
    id: "bia",
    name: "Bia",
    timeLabel: "1 ano e 8 meses livre",
    bio: "A vida do outro lado é mais leve. Vem conversar.",
    color: "#F5A623",
    initials: "BI",
  },
];

function Mentores({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-4">
      <PreviewBanner />
      <BackToLock onBack={onBack} />

      <div className="flex items-start gap-2 rounded-2xl bg-[#1CA0D8]/10 p-3 text-sm text-[#0b4f6c]">
        <Info className="mt-0.5 h-4 w-4 flex-none text-[#1CA0D8]" />
        <p>
          Estamos formando a rede de mentores voluntários (pessoas com 1 ano ou
          mais livres das apostas). Mentores oferecem escuta e apoio, mas{" "}
          <strong>não substituem atendimento profissional</strong> de saúde.
        </p>
      </div>


      <div className="space-y-3">
        {MENTORES.map((m) => (
          <div
            key={m.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 opacity-85 shadow-sm"
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
                  <p className="font-semibold text-[#16233C]">
                    {m.name} —{" "}
                    <span className="font-normal text-slate-600">
                      {m.timeLabel}
                    </span>
                  </p>
                  <ExampleTag />
                </div>
                <p className="mt-0.5 text-sm text-slate-600">{m.bio}</p>
              </div>
            </div>
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="mt-3 w-full cursor-not-allowed rounded-full bg-[#16BFAC] py-2.5 text-sm font-semibold text-white opacity-40"
            >
              Em breve
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
