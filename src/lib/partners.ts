/**
 * Instituições parceiras do AF People / AF Campus.
 *
 * Parceira não é cliente: a FIPECAFI é a faculdade da equipe e autorizou o uso
 * do nome. O painel do AF Campus continua sendo uma demonstração.
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
];

export function findPartner(code?: string | null): Partner | undefined {
  if (!code) return undefined;
  return PARTNERS.find((p) => p.code === code);
}
