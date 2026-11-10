# Product

Aposta no Futuro (AF): apoio gratuito e anônimo para quem quer cuidar da relação com as apostas online, e um programa de prevenção que instituições de ensino oferecem aos seus estudantes.

Escrito em 10/11/2026 a partir do histórico do projeto. Regras visuais ficam em `DESIGN.md`.

## Platform

web (app web progressivo: abre no navegador, pode ser instalado na tela inicial).

## Stack

TanStack Start, React 19, Vite 8, Tailwind v4, bun. Hospedagem em Cloudflare Workers. Supabase só para a lista de espera. Umami para eventos anônimos. Os dados de uso ficam no aparelho (`localStorage`).

## Users

- **Quem aposta ou está em risco.** Universitários de 18 a 24 anos, no celular, muitas vezes sozinhos e com vergonha. Não pedem ajuda porque acham que resolvem sozinhos, têm vergonha ou não reconhecem os sinais.
- **Rede de apoio.** Colegas, amigos e familiares de quem aposta. São a primeira porta procurada e não sabem como ajudar.
- **Gestores de instituições de ensino.** Pró-reitorias e diretorias de assuntos estudantis, no computador, avaliando um programa de prevenção.
- **Banca do Sebrae Supernova.** Abre o app pelo link do BMC e do vídeo e navega por poucos minutos.

## Product Purpose

Ser a mão estendida, não a tranca: ajudar a pessoa a entender a própria relação com as apostas, contar os dias livres, enxergar o que o dinheiro pode virar e chegar à ajuda humana certa. Para a instituição, ser a ponte anônima até o apoio que ela já oferece.

## Positioning

- **AF People:** gratuito, anônimo, sem cadastro. Nunca será cobrado do estudante.
- **AF Campus:** painel institucional com indicadores agregados. Hoje é uma demonstração com dados fictícios.
- Modelo B2B2C: a instituição paga, o estudante usa de graça. Nenhum dado é vendido.
- A FIPECAFI é instituição parceira e a faculdade da equipe. **Não é cliente.**
- Bloqueadores e autoexclusão restringem o acesso; o AF cuida do antes e do depois.

## Operating Context

- As bets foram proibidas no Brasil pela MP 1.394/2026. Quem já estava dentro continua precisando de apoio, e o mercado ilegal segue ativo. O tom é apartidário.
- O projeto disputa o Sebrae Supernova 2026 (BMC até 01/12, vídeo até 03/12). O produto congela em 20/11.
- Autoria pública: Eduarda Fernandes de Moraes (criadora). Luiz Santis no apoio técnico e operacional.

## Capabilities and Constraints

- Ferramentas: contador de dias livres, autoavaliação (PGSI), simulador financeiro com "Minhas apostas no futuro", Xande (orientação automatizada), guias, cuidados do dia, ajuda (CVV 188, CAPS), comunidade em lista de espera.
- Não é atendimento clínico: não diagnostica, não trata, não promete cura. O PGSI é triagem.
- Não há humano lendo mensagens em tempo real.
- Nenhum dado individual sai do aparelho. A instituição nunca vê pessoa, resposta ou valor.
- Sem marcas de bet, odds, links de aposta ou linguagem que glamourize o jogo.
- Projeções financeiras são educativas: não são promessa de rendimento nem recomendação de investimento.

## Brand Commitments

- Slogan: "Menos apostas. Mais futuro. Essa é a nossa aposta."
- Tese: "A diferença entre uma tranca e uma mão estendida."
- "Recomeçar também é progresso." Recaída nunca é tratada com culpa.
- Sempre "rede de apoio" para falar de colegas, amigos e familiares.
- Painel institucional sempre marcado como demonstração enquanto os dados forem fictícios.

## Evidence on Hand

- Pesquisa própria com 69 universitários (out/2026): 49% conhecem alguém próximo com dificuldade; barreiras são achar que resolve sozinho (84%), vergonha (75%) e não reconhecer sinais (61%); 54% buscariam ajuda primeiro com amigos e família; 85% acham importante a faculdade oferecer o recurso.
- Recursos mais valorizados: acesso à ajuda, metas e contador. O simulador vem depois.
- Uso até 27/09/2026: 144 visitantes, 34 contadores iniciados, 5 autoavaliações, 3 pedidos de ajuda.

## Product Principles

1. Sem julgamento, sempre. Calma em vez de alarme.
2. O futuro no centro, não a perda.
3. Uma coisa de cada vez, com um próximo passo claro.
4. O caminho para a ajuda humana está sempre a um toque.
5. Privacidade por padrão.
6. Nada inventado: nenhum cliente, número ou resultado sem lastro.

## Accessibility & Inclusion

- Contraste de texto ≥ 4,5:1; texto mínimo de 12px; toque mínimo de 44px.
- Navegação completa por teclado, com foco visível e link para pular ao conteúdo.
- Respeita `prefers-reduced-motion`.
- Linguagem simples, direta e sem marcação de gênero quando possível.
