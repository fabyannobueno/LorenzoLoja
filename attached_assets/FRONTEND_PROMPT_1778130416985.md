# Prompt para o Frontend — Loja Online API

Você está construindo o frontend (painel administrativo + vitrine pública) de uma plataforma de loja online. O backend é uma API REST Node.js + Express já pronta e documentada abaixo. Siga todas as instruções com precisão.

---

## Stack recomendada

- **Framework**: React (Vite) ou Next.js 14+ (App Router)
- **Auth**: Firebase SDK (autenticação no cliente)
- **HTTP**: axios ou fetch nativo com interceptors
- **Estado**: Zustand ou React Query (TanStack Query v5)
- **UI**: Tailwind CSS + shadcn/ui ou similar
- **Forms**: React Hook Form + Zod (mesma validação do backend)
- **Linguagem**: TypeScript obrigatório

---

## Autenticação — Fluxo obrigatório

O backend usa **Firebase Auth**. O frontend NUNCA chama o Supabase diretamente.

### Passo a passo após login Firebase:

```typescript
// 1. Usuário faz login via Firebase
const userCredential = await signInWithEmailAndPassword(auth, email, password);

// 2. Pega o ID token
const idToken = await userCredential.user.getIdToken();

// 3. Sincroniza com o backend (SEMPRE após login)
await api.post("/auth/sync", {
  name: userCredential.user.displayName ?? "Usuário",
  email: userCredential.user.email,
  phone: userCredential.user.phoneNumber ?? undefined,
});

// 4. Busca o perfil completo
const { data } = await api.get("/auth/me");
// data = { id, firebase_uid, store_id, name, email, role, permissions, status }
```

### Configuração do cliente HTTP (axios):

```typescript
// src/lib/api.ts
import axios from "axios";
import { getAuth } from "firebase/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api/v1",
});

// Injeta o token Firebase em toda requisição
api.interceptors.request.use(async (config) => {
  const user = getAuth().currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Trata erros globalmente
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // redirecionar para login
    }
    return Promise.reject(err);
  }
);

export default api;
```

### Variáveis de ambiente do frontend:

```env
VITE_API_URL=https://api.seudominio.com
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=mc-lorenzo-store.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mc-lorenzo-store
```

---

## Formato das respostas

Todas as respostas seguem este padrão:

```typescript
// Sucesso
{ success: true, data: T, message?: string }

// Paginado
{ success: true, data: T[], pagination: { page, limit, total, totalPages } }

// Erro
{ success: false, error: { code: string, message: string, details?: any } }
```

### Tipo utilitário:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

---

## Sistema de Roles e Permissões

O usuário autenticado tem um `role` e um array `permissions`.

### Roles disponíveis:
| Role | Descrição |
|------|-----------|
| `owner` | Dono — acesso total, ignora permissions |
| `manager` | Gerente — acesso quase total |
| `cashier` | Caixa — pedidos e pagamentos |
| `kitchen` | Cozinha — leitura e atualização de pedidos |
| `delivery` | Entregador — leitura e atualização de pedidos |
| `support` | Suporte — leitura de pedidos, clientes e produtos |

### Permissões disponíveis:
```
products.read      products.create    products.update    products.delete
orders.read        orders.update      orders.cancel
customers.read     customers.update
coupons.manage     payments.read      payments.update
reports.read       team.manage        settings.manage    store.manage
```

### Como verificar permissão no frontend:

```typescript
function hasPermission(user: User, permission: string): boolean {
  if (user.role === "owner") return true;
  return user.permissions.includes(permission);
}

// Uso:
if (hasPermission(user, "products.create")) {
  // mostrar botão de criar produto
}
```

---

## Endpoints — Painel Administrativo

Base URL: `{API_URL}/api/v1`

Todas as rotas abaixo exigem `Authorization: Bearer {firebase_id_token}`.

---

### AUTH
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/auth/me` | Perfil do usuário logado |
| POST | `/auth/sync` | Sincronizar após login (obrigatório) |
| POST | `/auth/logout` | Invalidar sessão |

**POST /auth/sync — body:**
```json
{ "name": "string", "email": "string", "phone": "string (opcional)" }
```

---

### DASHBOARD (só owner)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/owner/dashboard` | Resumo: pedidos do dia, faturamento, produtos ativos |
| GET | `/owner/store` | Dados da loja |
| PUT | `/owner/store` | Atualizar dados da loja |
| PUT | `/owner/store/status` | Abrir/fechar/pausar loja |

**PUT /owner/store/status — body:**
```json
{ "status": "open" | "closed" | "paused" }
```

---

### CONFIGURAÇÕES
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/store/settings` | Configurações gerais |
| PUT | `/store/settings` | Atualizar configurações |
| GET | `/store/business-hours` | Horários de funcionamento |
| POST | `/store/business-hours` | Criar horário |
| PUT | `/store/business-hours/:id` | Atualizar horário |
| DELETE | `/store/business-hours/:id` | Remover horário |

---

### CATEGORIAS
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/categories` | Listar (query: `page`, `limit`, `search`) |
| GET | `/categories/:id` | Buscar por ID |
| POST | `/categories` | Criar |
| PUT | `/categories/:id` | Atualizar |
| DELETE | `/categories/:id` | Remover |
| PATCH | `/categories/:id/status` | Ativar/desativar |
| PUT | `/categories/reorder` | Reordenar |

**POST /categories — body:**
```json
{
  "name": "string (obrigatório)",
  "description": "string (opcional)",
  "image_url": "string (opcional)",
  "sort_order": 0,
  "is_active": true
}
```

---

### PRODUTOS
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/products` | Listar (query: `page`, `limit`, `search`, `category_id`, `is_active`) |
| GET | `/products/:id` | Buscar por ID |
| POST | `/products` | Criar |
| PUT | `/products/:id` | Atualizar |
| DELETE | `/products/:id` | Soft delete |
| PATCH | `/products/:id/status` | Ativar/desativar |
| PATCH | `/products/:id/stock` | Atualizar estoque |
| PATCH | `/products/:id/price` | Atualizar preços |
| PUT | `/products/reorder` | Reordenar |
| GET | `/products/:productId/variations` | Listar variações |
| POST | `/products/:productId/variations` | Criar variação |
| PUT | `/products/:productId/variations/:variationId` | Atualizar variação |
| DELETE | `/products/:productId/variations/:variationId` | Remover variação |
| GET | `/products/:productId/addons` | Listar adicionais |
| POST | `/products/:productId/addons` | Criar adicional |
| PUT | `/products/:productId/addons/:addonId` | Atualizar adicional |
| DELETE | `/products/:productId/addons/:addonId` | Remover adicional |

**POST /products — body:**
```json
{
  "name": "string (obrigatório)",
  "sale_price": 29.90,
  "category_id": "uuid (opcional)",
  "description": "string (opcional)",
  "image_url": "string url (opcional)",
  "cost_price": 10.00,
  "promotional_price": 24.90,
  "stock_quantity": 100,
  "manage_stock": false,
  "min_stock_alert": 10,
  "is_active": true,
  "is_featured": false,
  "sort_order": 0
}
```

---

### PEDIDOS
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/orders` | Listar (query: `page`, `limit`, `status`, `payment_status`, `search`, `date_from`, `date_to`) |
| GET | `/orders/:id` | Buscar por ID |
| POST | `/orders` | Criar pedido manualmente |
| PATCH | `/orders/:id/status` | Atualizar status |
| PATCH | `/orders/:id/payment-status` | Atualizar status de pagamento |
| POST | `/orders/:id/accept` | Aceitar pedido |
| POST | `/orders/:id/cancel` | Cancelar pedido |
| POST | `/orders/:id/complete` | Concluir pedido |

**Status possíveis (em ordem):**
```
pending → accepted → preparing → ready → out_for_delivery → delivered → completed
                                                         ↓
                                                      canceled / refunded
```

**PATCH /orders/:id/status — body:**
```json
{ "status": "accepted", "notes": "string (opcional)" }
```

**POST /orders — body:**
```json
{
  "order_type": "delivery" | "pickup" | "dine_in",
  "payment_method": "cash" | "pix" | "card_on_delivery" | "card_online" | "transfer" | "other",
  "customer_name": "João Silva",
  "customer_phone": "11999999999",
  "customer_id": "uuid (opcional)",
  "delivery_address": { "street": "...", "number": "...", "city": "...", "state": "SP", "zip_code": "..." },
  "coupon_code": "PROMO10",
  "notes": "Sem cebola",
  "items": [
    {
      "product_id": "uuid",
      "product_name": "X-Burguer",
      "quantity": 2,
      "unit_price": 29.90,
      "notes": "Sem cebola",
      "addons": [{ "name": "Bacon extra", "price": 5.00 }],
      "variation": { "name": "Grande", "price": 32.00 }
    }
  ]
}
```

---

### CLIENTES
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/customers` | Listar (query: `page`, `limit`, `search`) |
| GET | `/customers/:id` | Buscar por ID |
| POST | `/customers` | Criar cliente |
| PUT | `/customers/:id` | Atualizar |
| DELETE | `/customers/:id` | Remover |
| GET | `/customers/:id/orders` | Pedidos do cliente |
| GET | `/customers/:customerId/addresses` | Listar endereços |
| POST | `/customers/:customerId/addresses` | Criar endereço |
| PUT | `/customers/:customerId/addresses/:addressId` | Atualizar endereço |
| DELETE | `/customers/:customerId/addresses/:addressId` | Remover endereço |

---

### CUPONS
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/coupons` | Listar |
| GET | `/coupons/:id` | Buscar por ID |
| POST | `/coupons` | Criar |
| PUT | `/coupons/:id` | Atualizar |
| DELETE | `/coupons/:id` | Remover |
| PATCH | `/coupons/:id/status` | Ativar/desativar |
| POST | `/coupons/validate` | Validar código |

**POST /coupons — body:**
```json
{
  "code": "PROMO10",
  "type": "percentage" | "fixed",
  "value": 10,
  "min_order_value": 50.00,
  "max_discount": 30.00,
  "usage_limit": 100,
  "starts_at": "2024-01-01T00:00:00Z",
  "expires_at": "2024-12-31T23:59:59Z",
  "is_active": true
}
```

---

### ZONAS DE ENTREGA
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/delivery-zones` | Listar |
| GET | `/delivery-zones/:id` | Buscar por ID |
| POST | `/delivery-zones` | Criar |
| PUT | `/delivery-zones/:id` | Atualizar |
| DELETE | `/delivery-zones/:id` | Remover |
| PATCH | `/delivery-zones/:id/status` | Ativar/desativar |
| POST | `/delivery/calculate` | Calcular frete |

---

### PAGAMENTOS
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/payments` | Listar |
| GET | `/payments/:id` | Buscar por ID |
| GET | `/orders/:orderId/payments` | Pagamentos de um pedido |
| POST | `/payments/manual` | Registrar pagamento manual |
| PATCH | `/payments/:id/status` | Atualizar status |

---

### EQUIPE (só owner)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/team` | Listar membros |
| GET | `/team/:id` | Buscar membro |
| POST | `/team/invite` | Convidar funcionário |
| PUT | `/team/:id` | Atualizar dados |
| PATCH | `/team/:id/role` | Alterar cargo |
| PATCH | `/team/:id/status` | Ativar/desativar |
| PUT | `/team/:id/permissions` | Definir permissões granulares |
| DELETE | `/team/:id` | Remover da equipe |

---

### RELATÓRIOS
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/reports/sales` | Relatório de vendas (query: `period`, `date_from`, `date_to`) |
| GET | `/reports/products` | Produtos mais vendidos |
| GET | `/reports/customers` | Melhores clientes |
| GET | `/reports/overview` | Visão geral |

---

### BANNERS
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/banners` | Listar |
| POST | `/banners` | Criar |
| PUT | `/banners/:id` | Atualizar |
| DELETE | `/banners/:id` | Remover |
| PATCH | `/banners/:id/status` | Ativar/desativar |
| PUT | `/banners/reorder` | Reordenar |

---

### AVALIAÇÕES
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/reviews` | Listar |
| GET | `/reviews/:id` | Buscar |
| POST | `/reviews` | Criar avaliação |
| PATCH | `/reviews/:id/visibility` | Tornar pública/privada |
| DELETE | `/reviews/:id` | Remover |

---

### NOTIFICAÇÕES
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/notifications` | Listar notificações do usuário |
| PATCH | `/notifications/:id/read` | Marcar como lida |
| POST | `/notifications/read-all` | Marcar todas como lidas |
| DELETE | `/notifications/:id` | Remover |

---

### AUDITORIA
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/audit-logs` | Listar logs (query: `page`, `limit`, `entity`, `action`, `date_from`, `date_to`) |

---

### UPLOADS
| Método | Rota | Descrição | Bucket |
|--------|------|-----------|--------|
| POST | `/uploads/image` | Upload genérico | `images` |
| POST | `/uploads/product` | Imagem de produto | `products` |
| POST | `/uploads/logo` | Logo da loja | `logos` |
| POST | `/uploads/banner` | Imagem de banner | `banners` |

**Como fazer upload:**
```typescript
const formData = new FormData();
formData.append("file", file); // campo obrigatório: "file"

const { data } = await api.post("/uploads/product", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});
// data.url = "https://...supabase.co/storage/v1/object/public/products/uuid.jpg"
// Use essa URL no campo image_url do produto
```

---

## Endpoints — Vitrine Pública

Estas rotas **NÃO precisam de autenticação**. Use para o app/site do cliente final.

Base URL: `{API_URL}/api/v1/public`

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/stores/:slug` | Dados públicos da loja |
| GET | `/stores/:slug/products` | Cardápio completo |
| GET | `/stores/:slug/categories` | Categorias ativas |
| GET | `/stores/:slug/business-hours` | Horários de funcionamento |
| GET | `/stores/:slug/delivery-zones` | Zonas de entrega disponíveis |
| POST | `/stores/:slug/orders` | Criar pedido (pelo cliente) |
| POST | `/stores/:slug/coupons/validate` | Validar cupom |

**POST /stores/:slug/coupons/validate — body:**
```json
{ "code": "PROMO10", "order_value": 89.90 }
```

---

## Erros comuns e como tratar

| Código HTTP | Código de erro | Causa | Ação no frontend |
|-------------|---------------|-------|-----------------|
| 401 | `UNAUTHORIZED` | Token inválido ou expirado | Redirecionar para login |
| 403 | `FORBIDDEN` | Sem permissão para esta ação | Mostrar mensagem, ocultar botão |
| 404 | `NOT_FOUND` | Recurso não encontrado | Mostrar tela de erro |
| 422 | `VALIDATION_ERROR` | Dados inválidos | Mostrar erros nos campos (details) |
| 429 | `RATE_LIMIT` | Muitas requisições | Aguardar e tentar novamente |
| 500 | `INTERNAL_ERROR` | Erro no servidor | Mostrar mensagem genérica |

---

## Boas práticas obrigatórias

1. **NUNCA** armazene o `store_id` no frontend — ele vem sempre do backend via `/auth/me`
2. **NUNCA** chame o Supabase diretamente — toda comunicação é via API
3. **SEMPRE** chame `/auth/sync` após o primeiro login ou criação de conta
4. **SEMPRE** renove o token Firebase antes de chamar rotas protegidas (o interceptor cuida disso)
5. Use o campo `permissions` para mostrar/esconder elementos de UI — mas o backend também valida
6. Uploads: envie o arquivo primeiro, pegue a URL, depois salve o produto/banner com a URL
7. Paginação: use `page` e `limit` nas queries (padrão: page=1, limit=20)

---

## Estrutura de pastas sugerida para o painel

```
src/
  lib/
    api.ts          # cliente axios configurado
    firebase.ts     # inicialização Firebase
  hooks/
    useAuth.ts      # contexto de autenticação
    useProducts.ts  # queries TanStack Query
    useOrders.ts
  pages/
    dashboard/
    products/
    orders/
    customers/
    team/
    settings/
  components/
    ui/             # shadcn components
    layout/         # sidebar, header, breadcrumb
    orders/         # KanbanBoard, OrderCard
    products/       # ProductTable, ProductForm
```
