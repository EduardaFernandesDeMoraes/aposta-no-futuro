# Aposta no Futuro — notas para quem desenvolve

- Stack: TanStack Start (React 19) + Vite 8 + Tailwind v4, build para Cloudflare Workers via Nitro.
- Rodar local: `bun install` e `bun run dev` (porta 8080).
- Build de produção: `bun run build` → `.output/` (worker + arquivos estáticos).
- Deploy: `npx wrangler deploy --config .output/server/wrangler.json` (requer Node e login na Cloudflare).
- Variáveis: copie `.env.example` para `.env`. O `.env` não vai para o git.
- Identidade visual: tokens em `src/styles.css`, fonte Poppins, logo em `src/assets/logo-maos-coracao.svg`.
  Não altere cores, fonte ou logo sem aprovação da Eduarda.
- Dados dos usuários ficam no `localStorage` (chaves `anf.*`). Mantenha o domínio
  `apostanofuturo.online` (sem www), senão as pessoas perdem o progresso salvo.
