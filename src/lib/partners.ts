/**
 * Instituições do piloto AF People / AF Campus.
 *
 * Os contatos de apoio são os canais públicos divulgados pelas próprias
 * instituições. Confira periodicamente — telefones e horários mudam.
 */
export type SupportChannel = {
  label: string;
  detail: string;
  href?: string;
};

export type Partner = {
  code: string;
  shortName: string;
  name: string;
  city: string;
  emailDomain: string;
  supportTitle: string;
  supportText: string;
  channels: SupportChannel[];
  sourceUrl: string;
};

export const PARTNERS: Partner[] = [
  {
    code: "FIPECAFI",
    shortName: "FIPECAFI",
    name: "Faculdade FIPECAFI",
    city: "São Paulo · SP",
    emailDomain: "fipecafi.edu.br",
    supportTitle: "Atendimento ao aluno FIPECAFI",
    supportText:
      "O núcleo de atendimento ao aluno pode te orientar e indicar os caminhos de apoio dentro da faculdade.",
    channels: [
      {
        label: "Atendimento ao aluno",
        detail: "atendimentoaluno@fipecafi.edu.br",
        href: "mailto:atendimentoaluno@fipecafi.edu.br",
      },
      { label: "Telefone", detail: "(11) 2184-2000", href: "tel:+551121842000" },
      {
        label: "FIPECAFI Escuta (ouvidoria)",
        detail: "Canal para estudantes, professores e colaboradores",
        href: "https://fipecafi.edu.br/Fale_Conosco",
      },
    ],
    sourceUrl: "https://fipecafi.edu.br/Fale_Conosco",
  },
  {
    code: "UFU",
    shortName: "UFU",
    name: "Universidade Federal de Uberlândia",
    city: "Uberlândia · MG",
    emailDomain: "ufu.br",
    supportTitle: "Saúde do Estudante · PROAE/UFU",
    supportText:
      "A Divisão de Saúde (Disau) da Pró-Reitoria de Assistência Estudantil oferece acolhimento psicológico gratuito para estudantes.",
    channels: [
      { label: "E-mail Disau", detail: "disau@proae.ufu.br", href: "mailto:disau@proae.ufu.br" },
      { label: "Telefone", detail: "(34) 3230-9558", href: "tel:+553432309558" },
      {
        label: "Atendimento presencial",
        detail: "Bloco 3E, sala 125 · Campus Santa Mônica",
        href: "https://proae.ufu.br/disau",
      },
    ],
    sourceUrl: "https://proae.ufu.br/disau",
  },
];

export function findPartner(code?: string | null): Partner | undefined {
  if (!code) return undefined;
  return PARTNERS.find((p) => p.code === code);
}
