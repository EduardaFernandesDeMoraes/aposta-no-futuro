import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { SensitiveFooter } from "@/components/sensitive-footer";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Privacidade — Aposta no Futuro" },
      {
        name: "description",
        content:
          "Como o Aposta no Futuro trata seus dados: contador, simulador e autoavaliação ficam só no seu aparelho. Só coletamos e-mail da lista de espera.",
      },
      { property: "og:title", content: "Privacidade — Aposta no Futuro" },
      {
        property: "og:description",
        content:
          "Seus dados ficam no seu aparelho. Nenhum dado do contador, simulador ou autoavaliação é enviado para servidor.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Privacidade,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5 rounded-2xl bg-card p-4 shadow-card">
      <h2 className="text-sm font-semibold text-navy">{title}</h2>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-slate-600">
        {children}
      </div>
    </section>
  );
}

function Privacidade() {
  return (
    <AppShell title="Privacidade">
      <div className="flex items-start gap-3 rounded-2xl border border-[#16BFAC] bg-[#E1F5EE] p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-[#16BFAC]" />
        <div>
          <h1 className="font-semibold text-[#16233C]">Política de Privacidade</h1>
          <p className="mt-1 text-sm text-slate-600">
            Em linguagem simples: quase tudo o que você escreve aqui fica no seu
            próprio celular.
          </p>
        </div>
      </div>

      <Section title="O que fica só no seu aparelho">
        <p>
          O contador de dias livres, os valores do simulador, o resultado da
          autoavaliação, os desafios concluídos e o seu nome (se você escrever
          um) são salvos no armazenamento local do navegador (localStorage) do
          seu aparelho.
        </p>
        <p>
          Esses dados <strong>não são enviados para nenhum servidor</strong>, não
          são vistos por nós e não são compartilhados com ninguém. Se você
          limpar os dados do navegador ou desinstalar o app, eles somem.
        </p>
      </Section>

      <Section title="O único dado que coletamos">
        <p>
          Se você entrar voluntariamente na lista de espera da Comunidade (ou
          para ser mentor), guardamos o <strong>seu e-mail</strong> e a
          informação de que você tem interesse em ser mentor.
        </p>
        <p>
          Usamos esse e-mail apenas para avisar quando a comunidade abrir. Nada
          de spam, nada de venda ou compartilhamento com terceiros.
        </p>
      </Section>

      <Section title="Medição de uso (sem cookies)">
        <p>
          Usamos uma ferramenta de medição anônima e sem cookies (Umami) para
          saber quantas pessoas acessam o app e quais recursos são mais usados.
          Ela não coleta dados pessoais e não identifica ninguém.
        </p>
      </Section>

      <Section title="Seus direitos (LGPD)">
        <p>
          Seguimos a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Você
          pode pedir a qualquer momento a confirmação, o acesso, a correção ou a
          exclusão do seu e-mail da nossa lista, além de revogar o
          consentimento.
        </p>
        <p>
          Canal do titular:{" "}
          <a
            className="font-medium text-teal underline underline-offset-2"
            href="mailto:contato@apostanofuturo.online"
          >
            contato@apostanofuturo.online
          </a>
          . Este e-mail não é um canal de emergência.
        </p>
      </Section>

      <SensitiveFooter />
    </AppShell>
  );
}
