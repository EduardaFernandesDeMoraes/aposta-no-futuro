import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { SensitiveFooter } from "@/components/sensitive-footer";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos de uso — Aposta no Futuro" },
      {
        name: "description",
        content:
          "Regras de uso do Aposta no Futuro: idade mínima recomendada, caráter de apoio educativo e proibição de divulgar casas de aposta, odds ou links.",
      },
      { property: "og:title", content: "Termos de uso — Aposta no Futuro" },
      {
        property: "og:description",
        content:
          "App de apoio educativo, não de tratamento. Proibido divulgar casas de aposta, odds ou links.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Termos,
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

function Termos() {
  return (
    <AppShell title="Termos de uso">
      <div className="flex items-start gap-3 rounded-2xl border border-[#16BFAC] bg-[#E1F5EE] p-4">
        <FileText className="mt-0.5 h-5 w-5 flex-none text-[#16BFAC]" />
        <div>
          <h1 className="font-semibold text-[#16233C]">Termos de uso</h1>
          <p className="mt-1 text-sm text-slate-600">
            Regras simples para este espaço continuar sendo seguro para todo
            mundo.
          </p>
        </div>
      </div>

      <Section title="Idade recomendada">
        <p>
          O Aposta no Futuro é recomendado para pessoas a partir de 16 anos.
          Menores de 18 anos devem usar o app com acompanhamento de um
          responsável.
        </p>
      </Section>

      <Section title="Apoio, não tratamento">
        <p>
          Este app é educativo e de apoio. Ele não faz diagnóstico, não é
          tratamento de saúde e não substitui atendimento com psicólogo,
          psiquiatra ou outro profissional.
        </p>
        <p>
          A Xande é um guia automático com respostas prontas: não é uma pessoa e
          ninguém está lendo as conversas. Em crise, ligue 188 (CVV). Em
          emergência, ligue 192 ou vá ao pronto-socorro mais próximo.
        </p>
      </Section>

      <Section title="Proibido divulgar apostas">
        <p>
          É proibido, em qualquer parte do app, divulgar casas de aposta, sites,
          aplicativos, odds, “dicas”, “green”, cupons, links de indicação ou
          qualquer conteúdo que incentive apostar.
        </p>
        <p>
          Também é proibido ofender, ameaçar ou expor outras pessoas. Conteúdo
          que quebre essas regras pode ser removido e o acesso, encerrado.
        </p>
      </Section>

      <Section title="Contato">
        <p>
          Dúvidas sobre estes termos:{" "}
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
