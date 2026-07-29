<div align="center">

# 🎯 Aposta no Futuro

**Tecnologia e inteligência artificial no apoio a jovens para a prevenção e o enfrentamento do vício em apostas online.**

[![Status](https://img.shields.io/badge/status-no%20ar-16BFAC?style=flat-square)](https://www.apostanofuturo.online)
[![React](https://img.shields.io/badge/React-19-1CA0D8?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-16233C?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![TanStack](https://img.shields.io/badge/TanStack-Start-FF5B4C?style=flat-square)](https://tanstack.com/start)
[![Licença](https://img.shields.io/badge/licença-MIT-F5A623?style=flat-square)](#-licença)

🌐 **[www.apostanofuturo.online](https://www.apostanofuturo.online)** · 📩 contato@apostanofuturo.online

</div>

---

## 📖 Sobre o projeto

O **Aposta no Futuro** é um aplicativo web gratuito que ajuda jovens a prevenir e enfrentar o vício em apostas online (*bets*). Em vez de simplesmente dizer *"não aposte"*, ele mostra — com dados personalizados — quanto a pessoa tem a **ganhar** ao retomar o controle da própria vida, e a conecta com quem está passando pela mesma luta.

Desenvolvido para o programa **Jovens Embaixadores Espro 2026**, no eixo temático **Tecnologia**.

### 💡 A origem

> No fim de 2024, uma pessoa muito próxima de mim começou a apostar. O que parecia diversão virou dívida; a dívida virou ansiedade e noites sem dormir. Acompanhei de perto cada tentativa de parar e cada recaída.
>
> E ele me disse a frase que virou o coração deste projeto: nos momentos mais difíceis da recuperação, ele só encontrava **aplicativos de bloqueio** — mas **nenhum aplicativo de apoio**, que o acolhesse e não o deixasse sozinho.
>
> Este projeto é a transformação dessa dor em solução.

---

## ⚡ O problema

O Brasil é hoje um dos maiores mercados de apostas do mundo, e a conta pesa mais para quem tem menos:

| Indicador | Dado | Fonte |
|---|---|---|
| Brasileiros que apostaram no 1º semestre de 2025 | **17,7 milhões** | Ministério da Fazenda |
| Crescimento nos atendimentos por vício (5 anos) | **+300%** | Assoc. Brasileira de Psiquiatria |
| Apostadores compulsivos que são jovens | **82%** | Índice PGSI / CPI das Bets |
| Custo social estimado por ano | **R$ 38,8 bilhões** | IEPS / Umane |

Some-se a isso o gatilho da **Copa do Mundo de 2026** — projetada como o maior evento de apostas da história, com **70% dos jovens de 18 a 24 anos** pretendendo apostar durante o torneio.

---

## ✨ Funcionalidades

| Recurso | Descrição |
|---|---|
| ⏱️ **Contador de dias livres** | Acompanha o tempo sem apostar em dias, horas e minutos, com medalhas por marco (7, 30, 90, 180 e 365 dias) e recomeço acolhedor, sem culpa. |
| 💰 **Simulador financeiro** | Calcula na hora quanto a pessoa economiza ao não apostar — em 6 meses, 1, 3 e 5 anos — com gráfico e projeção ilustrativa. |
| 📋 **Autoavaliação (PGSI)** | Questionário anônimo de triagem baseado no *Problem Gambling Severity Index*, índice internacional reconhecido. |
| 🤖 **Assistente virtual** | Orientação e acolhimento nos momentos de vontade de apostar, com estratégias saudáveis e encaminhamento responsável. |
| 🎯 **Desafios** | Missões de novos hábitos e consciência financeira, com progresso e conquistas. |
| 👥 **Comunidade por estágio** | Fórum anônimo organizado por tempo de sobriedade — quem está há 10 dias conversa com quem também está — e mentores voluntários com 1 ano ou mais sem apostar. |
| 📊 **Meu progresso** | Painel que reúne dias livres, economia acumulada, desafios e conquistas. |
| 🆘 **Preciso de ajuda** | Botão sempre visível com CVV (188) e orientação para os CAPS. |

---

## 🛠️ Stack técnica

### Core

| Tecnologia | Papel no projeto |
|---|---|
| [**React 19**](https://react.dev) | Biblioteca de interface |
| [**TypeScript**](https://www.typescriptlang.org) | Tipagem estática em todo o código |
| [**TanStack Start**](https://tanstack.com/start) | Framework full-stack React (SSR + rotas) |
| [**TanStack Router**](https://tanstack.com/router) | Roteamento com tipagem de ponta a ponta |
| [**TanStack Query**](https://tanstack.com/query) | Gerenciamento de estado assíncrono e cache |
| [**Vite 8**](https://vite.dev) | Build e servidor de desenvolvimento |
| [**Nitro**](https://nitro.build) | Camada de servidor / deploy |

### Interface

| Tecnologia | Papel no projeto |
|---|---|
| [**Tailwind CSS v4**](https://tailwindcss.com) | Estilização utilitária |
| [**Radix UI**](https://www.radix-ui.com) | Primitivos acessíveis (base do shadcn/ui) |
| [**Lucide React**](https://lucide.dev) | Ícones |
| **CVA · clsx · tailwind-merge** | Composição de variantes de componentes |
| [**Sonner**](https://sonner.emilkowal.ski) | Notificações (*toasts*) |
| [**Vaul**](https://vaul.emilkowal.ski) · **Embla** · **cmdk** | Drawers, carrosséis e paleta de comandos |

### Funcionalidades específicas

| Tecnologia | Onde é usada |
|---|---|
| [**Recharts**](https://recharts.org) | Gráficos do **simulador financeiro** e do painel de progresso |
| [**date-fns**](https://date-fns.org) | Cálculo do **contador de dias livres** |
| [**canvas-confetti**](https://github.com/catdad/canvas-confetti) | Animação de comemoração ao bater **marcos** |
| [**React Hook Form**](https://react-hook-form.com) + [**Zod**](https://zod.dev) | Formulários e validação da **autoavaliação PGSI** |

### Qualidade de código

**ESLint** · **Prettier** · **TypeScript ESLint** · `eslint-plugin-react-hooks`

> **Persistência:** a versão atual usa `localStorage` — os dados ficam no dispositivo do usuário. A migração para contas na nuvem está prevista na Fase 2 (ver [Roadmap](#-roadmap)).

---

## 🚀 Rodando localmente

**Pré-requisitos:** Node.js 20+ e npm.

```bash
# 1. Clone o repositório
git clone https://github.com/EduardaFernandesDeMoraes/aposta-no-futuro.git

# 2. Entre na pasta
cd aposta-no-futuro

# 3. Instale as dependências
npm install

# 4. Rode em modo de desenvolvimento
npm run dev
```

O endereço local aparece no terminal após iniciar.

### Outros comandos

```bash
npm run build     # build de produção
npm run preview   # pré-visualiza o build localmente
npm run lint      # verifica o código com ESLint
npm run format    # formata o código com Prettier
```

---

## 🗺️ Roadmap

- [x] **Fase 1 — Aplicativo no ar** *(concluída)*
  Desenvolvimento, publicação e domínio próprio. Dados salvos localmente no dispositivo.

- [ ] **Fase 2 — Piloto real**
  Oficina e roda de conversa na unidade Espro, grupo-piloto voluntário e migração para contas na nuvem, permitindo acompanhar resultados de forma anônima e com consentimento.

- [ ] **Fase 3 — Escala**
  Evolução da assistente para uma IA real, parcerias com universidades, incubadoras e editais de fomento.

---

## ⚠️ Responsabilidade

Este aplicativo **não substitui acompanhamento profissional de saúde**. Ele acolhe, orienta e encaminha.

Se você ou alguém próximo estiver passando por um momento difícil:

- **CVV — Centro de Valorização da Vida:** ligue **188** (24h, gratuito e sigiloso)
- **CAPS — Centros de Atenção Psicossocial:** atendimento gratuito pela rede pública de saúde do seu município

O projeto trata dados sensíveis com anonimato por padrão, consentimento e respeito à privacidade. **Nunca** incentiva apostas nem exibe marcas, *odds* ou links de casas de apostas.

---

## 🤝 Parcerias

Este é um projeto de impacto social aberto a colaborações. Instituições, profissionais de saúde, educadores e desenvolvedores interessados em apoiar a próxima fase podem entrar em contato:

📩 **contato@apostanofuturo.online**

---

## 👩‍💻 Autoria

**Eduarda Fernandes de Moraes** — [@EduardaFernandesDeMoraes](https://github.com/EduardaFernandesDeMoraes)
Idealizadora e desenvolvedora · Jovem Aprendiz Espro — Filial Uberlândia
Projeto Jovens Embaixadores Espro 2026 · Eixo Tecnologia

---

## 📄 Licença

Distribuído sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

<div align="center">

**Menos apostas. Mais futuro.**
*Essa é a nossa aposta.*

</div>
