# MC Lorenzo Store — Loja Pública

Storefront público do MC Lorenzo conectado à API em `https://api.mclorenzo.com/api/v1/public`.

## Run & Operate

- `pnpm --filter @workspace/dos-rosa run dev` — frontend (porta 5000)
- `pnpm --filter @workspace/api-server run dev` — API server (porta 8081)
- `pnpm run typecheck` — typecheck completo
- `pnpm run build` — build de todos os pacotes
- `pnpm --filter @workspace/db run push` — push do schema do banco (apenas dev)
- Env obrigatória: `DATABASE_URL` — connection string Postgres

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + TailwindCSS + shadcn/ui
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- State: TanStack Query (server state), React Context (carrinho)
- Validação: Zod (`zod/v4`), `drizzle-zod`
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/dos-rosa/` — frontend React (loja pública)
- `artifacts/dos-rosa/src/lib/publicApi.ts` — cliente da API pública (axios)
- `artifacts/dos-rosa/src/contexts/CartContext.tsx` — estado do carrinho
- `artifacts/dos-rosa/src/components/CartDrawer.tsx` — drawer de carrinho + checkout
- `artifacts/dos-rosa/src/components/HeroSlider.tsx` — slider de banners (API + fallback)
- `artifacts/dos-rosa/src/components/CategoryGrid.tsx` — categorias (API + fallback, clicável)
- `artifacts/dos-rosa/src/components/ProductsSection.tsx` — grid de produtos (API + fallback, paginação)
- `artifacts/dos-rosa/src/pages/Home.tsx` — página principal, orquestra filtro de categorias
- `artifacts/api-server/` — servidor Express
- `artifacts/api-server/src/routes/proxy.ts` — proxy reverso para a API externa (resolve CORS)

## Architecture decisions

- **Proxy reverso no Vite (dev)** — em dev, chamadas à API usam `/api-proxy/...` via proxy Vite para evitar CORS. Em produção, aponta direto para `https://api.mclorenzo.com`.
- **Fallback estático** — enquanto a loja não estiver cadastrada na API (slug `mclorenzo`), todos os componentes mostram dados estáticos hardcoded sem quebrar.
- **STORE_SLUG** — configurável via `VITE_STORE_SLUG` no `.env`; padrão `"mclorenzo"`.
- **CartProvider** envolve o app inteiro no `App.tsx`; `CartDrawer` vive em `Home.tsx` dentro do provider.
- **Sem admin panel** — arquivos admin ainda existem em `src/pages/admin/` mas não estão roteados; foco total na loja pública.

## Product

- Slider de banners automático com paginação
- Grid de categorias clicável que filtra os produtos
- Grid de produtos com paginação, badge de destaque e desconto
- Carrinho lateral (sheet) com quantidade, remoção e total
- Checkout completo: nome, telefone, tipo (entrega/retirada/mesa), endereço, pagamento, cupom, observações
- Integração total com `https://api.mclorenzo.com/api/v1/public`

## User preferences

- Usar `.env` para variáveis de ambiente (não Replit Secrets)
- Foco na loja pública, não no painel admin
- API externa: `https://api.mclorenzo.com/api/v1/public`
- Slug da loja: `mclorenzo` (variável `VITE_STORE_SLUG`)

## Gotchas

- A loja `mclorenzo` ainda não está cadastrada na API — todos os endpoints retornam 404. Os componentes tratam isso com fallback estático.
- Em dev, o proxy Vite (`/api-proxy`) resolve CORS. Em produção, a API precisa ter CORS liberado para o domínio do app.
- Firebase keys estão no `.env` mas não são usadas pela loja pública.
- Arquivos admin em `src/pages/admin/` existem mas não estão roteados.

## Pointers

- Veja o skill `pnpm-workspace` para estrutura do workspace, TypeScript e detalhes dos pacotes.
