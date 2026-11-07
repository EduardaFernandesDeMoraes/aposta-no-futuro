# Design do Aposta no Futuro

Repaginação de 06/11/2026, direção **acolhedor e calmo**, com cores e tipografia aprovadas pela Eduarda.
Backup da versão anterior: tag `antes-redesign-2026-11-06` e branch `backup/antes-redesign`.

## Ideia

Um lugar sem julgamento. Calma em vez de alarme, uma coisa de cada vez, e o futuro (não a recaída) no centro.
Cada tela tem **uma** superfície rica (o contador na home, a revelação no Simulador, o CVV na Ajuda); o resto é fundo claro, listas e respiro.

## Cores (tokens em `src/styles.css`)

| Token | Valor | Uso |
|---|---|---|
| `background` | `#F2F6F4` | Névoa tingida pelo teal da marca. Fundo de todas as telas. |
| `card` | `#FFFFFF` | Listas e cartões. |
| `navy` | `#16233C` | Texto principal e títulos. |
| `muted-foreground` | `#526075` | Texto secundário (≥ 4,5:1 sobre o fundo). |
| `teal-deep` | `#0D6B60` | **Ação**: botões, links, foco, aba ativa. Texto branco 6,5:1. |
| `teal-ink` | `#0A5249` | Superfície rica (contador, revelação, CVV) e hover dos botões. |
| `teal` | `#16BFAC` | Só preenchimento (barras de progresso). Nunca como texto sobre claro. |
| `teal-soft` | `#DCF0EA` | Fundo de ícones e seleção. |
| `coral-deep` / `coral-soft` | `#B83427` / `#FDEBE6` | **Só ajuda e crise.** Botão "Ajuda", emergência. |
| `gold` / `gold-deep` / `gold-soft` | `#F5A623` / `#7D5200` / `#FBF0DB` | **Só conquista**: marcos, dinheiro que ficou com você, apostas no futuro. |

`magenta` e `cyan` continuam definidos por compatibilidade, mas não são usados nas telas.

## Tipografia

- **Poppins** para tudo. Título de página: 1,75rem, semibold, tracking −0,02em. Seções: 1,125rem semibold. Corpo: 1rem (0,95rem em textos de apoio). Mínimo: 12px.
- **Dancing Script** só em momentos de marca: "AF *People*", "no futuro", "Respira.", "Obrigado", "Um passo só". A saudação da home é em Poppins ("Oi, **Lucas**. Que bom te ver."), não em cursiva.
- Números que contam usam a classe `.tabular`.
- Não usar rótulo em maiúsculas acima de título (eyebrow).

## Componentes e padrões

- `AppShell`: topo **azul-escuro (navy)** em todos os tamanhos, com a assinatura da marca, o Xande e "Ajuda" (coral com texto navy) sempre rotulado; título da página grande no conteúdo; "Voltar" nas telas fora das abas; um único rodapé com o aviso "não substitui atendimento profissional".
- **Desktop (≥ 1024px)**: a navegação sobe para o topo (Início, Simulador, Cuidar, Metas, Perfil) e a barra inferior some. O conteúdo usa até 1152px (`max-w-6xl`) e cada tela tem composição própria em 12 colunas: conteúdo principal (7–8 colunas) + coluna lateral fixa (4–5 colunas, `sticky top-28`). Ex.: home = contador grande + trilha | Xande e caminhos; Simulador = formulário fixo | revelação; Autoavaliação = pergunta | progresso; Guia = artigo | índice dos passos. O onboarding vira tela dividida com painel navy da marca à esquerda.
- Tablet (768–1023px): uma coluna de até 672px, com a barra inferior.
- **Regras de alinhamento no desktop**: o título da página (e a saudação, na home; a identidade, no Perfil) fica sempre **acima** da grade, ocupando a largura toda. Grade de 12 colunas com espaçamento único de 48px (`lg:gap-12`) em todas as telas. As duas colunas começam na mesma altura: ou as duas abrem com um cabeçalho de seção (`text-lg lg:text-xl`, semibold), ou nenhuma. Nunca compensar desalinhamento com `padding-top` fixo. Título de página: 44px (`lg:text-[2.75rem]`) em todas as telas.
- Abas: Início, Simulador, **Cuidar** (autoavaliação, guia, Xande, comunidade, ajuda), Metas, Perfil.
- Listas em linhas (`divide-y` dentro de um cartão) em vez de grades de cartões iguais.
- Área de toque mínima de 44px; foco visível em teal profundo (`:focus-visible`).
- Ícones Lucide, nunca emoji como ícone.
- Movimento: um momento por tela (`.rise-in` ou a contagem do Simulador). Curvas só dos tokens `--ease-out`, `--ease-in-out` e `--ease-drawer` (em `styles.css`). Com `prefers-reduced-motion`, sem deslocamentos: só fades curtos.
- **Abertura**: fundo navy, logo de alta resolução (`/logo-af-splash.webp`, mesmo navy do fundo) e "Aposta no Futuro". Uma vez por visita (sessionStorage `anf.abertura`), ligada por um script inline antes do primeiro desenho; nunca em `/ajuda`. ~1,35s: entra em 600ms com `--ease-out`, sai em 400ms.
- **Troca AF People ⇄ AF Campus** (`src/lib/product-switch.ts`): cortina navy cobre a tela, "People" sai e "Campus" entra (ou o contrário), a rota troca com a tela coberta e a cortina revela o outro produto. ~1,9s, WAAPI, com teto de tempo em cada etapa e trava de 4s para o overlay nunca ficar preso.
- `useLocalStorage` usa `useSyncExternalStore`: o servidor renderiza o valor inicial e o aparelho troca pelo salvo depois da hidratação. Não ler `Date.now()` nem localStorage durante a renderização do servidor.
- Abrir o Xande de qualquer tela: `openXande()` de `@/components/app-shell`.

## Tom das telas sensíveis

- A home nunca abre com recaída: "Precisei recomeçar" é um link discreto, e quem ainda aposta vê "Seu contador começa quando você quiser".
- O resultado da autoavaliação começa agradecendo, mostra a faixa numa escala calma e termina com "Seu próximo passo".
- Metas não têm pontos nem medalhas (evita o ciclo de recompensa das bets): são "cuidados de hoje".

## Telas com regras próprias

- **Cuidar**: bento com uma identidade por item. Ajuda (coral), Autoavaliação (superfície rica teal-ink, com a escala de faixas), Xande (teal-soft com prévia da conversa), Guia (branco com os 3 primeiros passos) e Comunidade (tracejado, "Em breve").
- **Home, "Para continuar"**: Simulador em cartão largo dourado (mostra o valor de 5 anos se já houver cálculo), Autoavaliação em branco com a escala, Guia em navy com os 7 passos. No fim da página, "Trocar perfil" leva a `/acesso`.
- **Metas**: banco de 30 cuidados; 3 sugestões + 3 ideias extras por dia, trocadas à meia-noite do aparelho (timer até a meia-noite + nova checagem ao voltar para a aba). Nada se repete de um dia para o outro.
- **AF Campus**: abre direto no painel de demonstração, sem login; a instituição é escolhida no topo.
- **Comunidade**: uma página só (sem abas nem telas de bloqueio). Lista de espera em superfície teal-ink como única ação (com opção "quero ser mentor"), "Como vai funcionar" em três pilares (salas, mentores, anônimo e moderado) e uma prévia de conversa por sala, marcada uma vez como "Mensagens de exemplo".

## Texto

- Direto ao ponto: uma frase de introdução por tela, sem repetir o que o rodapé ou outra tela já dizem.
- O aviso "não substitui atendimento profissional" fica só no rodapé (e no onboarding e no chat do Xande, que não têm rodapé).
- Não explicar o óbvio nem repetir privacidade em cada campo; isso está em /privacidade.
