import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { WaitlistCard } from "@/components/waitlist-card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/comunidade")({
  head: () => ({
    meta: [
      { title: "Comunidade | Aposta no Futuro" },
      {
        name: "description",
        content:
          "Comunidade anônima por tempo sem apostar, com mentores voluntários. Entre na lista de espera.",
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
};

const ROOMS: Room[] = [
  { id: "0-7", label: "Primeiros passos (0 a 7 dias)", short: "0–7d" },
  { id: "1s", label: "1 semana ou mais", short: "1 sem+" },
  { id: "1m", label: "1 mês ou mais", short: "1 mês+" },
  { id: "3m", label: "3 meses ou mais", short: "3 meses+" },
  { id: "6m", label: "6 meses ou mais", short: "6 meses+" },
  { id: "1a", label: "1 ano ou mais", short: "1 ano+" },
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

const MENTOR_INITIALS = ["RA", "JU", "MA", "BI"];

function Comunidade() {
  const [mentor, setMentor] = useState(false);
  const [activeRoom, setActiveRoom] = useState<string>(ROOMS[0].id);
  const room = ROOMS.find((r) => r.id === activeRoom)!;
  const messages = SEED[activeRoom] ?? [];

  return (
    <AppShell
      title="Comunidade"
      intro="Um espaço anônimo para conversar com quem entende. Está quase pronto."
    >
      <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-12">
        {/* Lista de espera: a única ação da página */}
        <section
          aria-labelledby="lista"
          className="rounded-[1.75rem] bg-teal-ink p-6 text-white shadow-soft lg:sticky lg:top-28 lg:order-2 lg:col-span-5 lg:rounded-[2rem] lg:p-8"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7fe6da]" aria-hidden="true" />
            Em construção
          </span>
          <h2 id="lista" className="mt-4 text-[1.5rem] font-semibold leading-tight tracking-[-0.02em]">
            Seja avisado quando abrir
          </h2>
          <label className="mt-5 flex min-h-11 cursor-pointer items-center gap-3 text-sm text-white/90">
            <input
              type="checkbox"
              checked={mentor}
              onChange={(e) => setMentor(e.target.checked)}
              className="h-5 w-5 flex-none cursor-pointer rounded accent-[#7fe6da]"
            />
            Quero ser mentor (estou há 1 ano ou mais sem apostar)
          </label>
          <div className="mt-3">
            <WaitlistCard
              tone="dark"
              wantsToMentor={mentor}
              cta={mentor ? "Quero ser mentor" : "Me avise quando abrir"}
              successText={
                mentor
                  ? "Quando a rede de mentores começar, a gente te chama."
                  : "Assim que a comunidade abrir, a gente te avisa."
              }
            />
          </div>
        </section>

        <div className="lg:order-1 lg:col-span-7">
          {/* Como vai funcionar */}
          <section className="mt-10 lg:mt-0" aria-labelledby="como">
            <h2 id="como" className="text-lg font-semibold text-navy lg:text-2xl">
              Como vai funcionar
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-border bg-card p-5 sm:col-span-2">
                <p className="font-semibold text-navy">Salas pelo seu momento</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Você conversa com quem está na mesma fase.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5" aria-hidden="true">
                  {ROOMS.map((r) => (
                    <span
                      key={r.id}
                      className="rounded-full bg-teal-soft px-3 py-1 text-xs font-semibold text-teal-ink"
                    >
                      {r.short}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl bg-gold-soft p-5">
                <div className="flex -space-x-2" aria-hidden="true">
                  {MENTOR_INITIALS.map((ini) => (
                    <span
                      key={ini}
                      className="grid h-10 w-10 place-items-center rounded-full bg-gold-deep text-xs font-semibold text-white ring-2 ring-gold-soft"
                    >
                      {ini}
                    </span>
                  ))}
                </div>
                <p className="mt-4 font-semibold text-navy">Mentores voluntários</p>
                <p className="mt-1 text-sm text-gold-deep">
                  Gente com 1 ano ou mais sem apostar. Escuta, não atendimento profissional.
                </p>
              </div>
              <div className="rounded-3xl bg-navy p-5 text-white">
                <ShieldCheck className="h-6 w-6 text-[#7fe6da]" />
                <p className="mt-4 font-semibold">Anônimo e moderado</p>
                <p className="mt-1 text-sm text-white/75">
                  Só apelido. Proibido divulgar apostas, casas ou palpites.
                </p>
              </div>
            </div>
          </section>

          {/* Prévia */}
          <section className="mt-10" aria-labelledby="previa">
            <div className="flex items-baseline justify-between gap-3">
              <h2 id="previa" className="text-lg font-semibold text-navy lg:text-2xl">
                Uma prévia
              </h2>
              <span className="text-sm text-muted-foreground">Mensagens de exemplo</span>
            </div>

            <div
              className="-mx-4 mt-4 overflow-x-auto no-scrollbar lg:mx-0"
              role="group"
              aria-label="Escolha uma sala"
            >
              <div className="flex w-max gap-2 px-4 lg:px-0">
                {ROOMS.map((r) => {
                  const active = r.id === activeRoom;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setActiveRoom(r.id)}
                      className={cn(
                        "min-h-11 whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition-colors",
                        active
                          ? "border-teal-deep bg-teal-deep text-white"
                          : "border-border bg-card text-navy hover:border-teal-deep/40",
                      )}
                    >
                      {r.short}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 rounded-3xl bg-muted/60 p-4" aria-live="polite">
              <p className="px-1 text-sm font-medium text-navy">{room.label}</p>
              <ul key={activeRoom} className="rise-in mt-3 space-y-3">
                {messages.map((m, i) => (
                  <li key={`${m.nick}-${i}`} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="grid h-9 w-9 flex-none place-items-center rounded-full bg-card text-xs font-semibold text-teal-deep"
                    >
                      {m.nick.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm bg-card px-4 py-3 shadow-card">
                      <p className="flex items-baseline justify-between gap-2 text-sm">
                        <span className="font-semibold text-navy">{m.nick}</span>
                        <span className="text-xs text-muted-foreground">{m.when}</span>
                      </p>
                      <p className="mt-1 text-[0.95rem] leading-relaxed text-navy/85">{m.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
