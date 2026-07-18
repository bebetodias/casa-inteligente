# Casa Inteligente — Documento Oficial do Projeto

> **Status:** Em desenvolvimento · **Tipo:** PWA (Progressive Web App)
> **Stack:** React 18 + Vite + Zustand · **Persistência atual:** localStorage (mock)

---

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Personas e Casos de Uso](#2-personas-e-casos-de-uso)
3. [Arquitetura Técnica](#3-arquitetura-técnica)
4. [Modelo de Dados](#4-modelo-de-dados)
5. [Design System](#5-design-system)
6. [Roteamento](#6-roteamento)
7. [Auth Store](#7-auth-store-zustand)
8. [Estado Atual do Projeto](#8-estado-atual-do-projeto)
9. [Convenções de Código](#9-convenções-de-código)
10. [Atalhos de Teclado](#10-atalhos-de-teclado)
11. [Fluxo de Convite](#11-fluxo-de-convite)
12. [Checklist Antes de Commitar](#12-checklist-antes-de-commitar)
13. [Roadmap](#13-roadmap)
14. [Decisões Tomadas](#14-decisões-tomadas)

---

## 1. Visão Geral

**Casa Inteligente** é um PWA que ajuda uma família a organizar a casa em **módulos temáticos colaborativos** . Cada módulo é independente e pode ser ativado/desativado pela casa.

### Princípios Fundamentais

1. **Compartilhado, não centralizado** — Tudo pertence à **casa** , não a um usuário.
2. **Aprovação social implícita** — Não bloqueamos ações (UX simples), mas mostramos autor ("Adicionado por Maria").
3. **Offline-first** — Funciona sem internet (PWA + service worker).
4. **Mobile-first** — Layout prioritariamente desenhado para celular.
5. **Sem frameworks pesados de UI** — Sistema próprio baseado em tokens para controle total.

### Objetivos do MVP (Módulo de Compras)

- Lista de compras compartilhada em tempo real (mock)
- Adicionar, marcar como comprado, remover itens
- Histórico de compras com preços
- Estatísticas por produto (preço médio, frequência, previsão)
- Sugestões automáticas baseadas em padrão de consumo
- Autenticação e convites por link compartilhável
- Sincronização real (Supabase) — próxima fase
- Notificações push — próxima fase

---

## 2. Personas e Casos de Uso

### Personas Primárias

| Persona           | Descrição                         | Necessidade Principal              |
| ----------------- | --------------------------------- | ---------------------------------- |
| **Maria (Mãe)**   | Organiza a casa, quer visão geral | Lista clara, histórico de preços   |
| **Pedro (Filho)** | Adolescente, usa o celular        | Marcar como comprado rápido        |
| **João (Pai)**    | Faz compras no mercado            | Preço sugerido, histórico          |
| **Avó**           | Lista escrita à mão               | Interface simples, sem complicação |

### Casos de Uso — Módulo de Compras

| #   | Ação                   | Fluxo                                                            |
| --- | ---------------------- | ---------------------------------------------------------------- |
| 1   | Adicionar item à lista | Botão + → modal → preenche nome/categoria/qtd → salva            |
| 2   | Marcar como comprado   | Clica no item → modal de compra → informa preço/local → confirma |
| 3   | Ver histórico          | Aba histórico → filtra por período/produto → vê evolução         |
| 4   | Ver estatísticas       | Clica no item da lista → drawer com gráficos e previsão          |
| 5   | Receber sugestão       | Sistema sugere itens baseado no padrão de consumo                |
| 6   | Convidar membro        | Botão "Convidar" → gera link → compartilha via WhatsApp/etc.     |

---

## 3. Arquitetura Técnica

### Stack

| Camada            | Tecnologia                                  |
| ----------------- | ------------------------------------------- |
| Frontend          | React 18 + Vite 5                           |
| Roteamento        | react-router-dom v6                         |
| Estado global     | Zustand                                     |
| Estilização       | CSS Modules + Design Tokens (CSS Variables) |
| PWA               | vite-plugin-pwa                             |
| Persistência      | localStorage (mock) → Supabase (futuro)     |
| Auth (futuro)     | Supabase Auth                               |
| Realtime (futuro) | Supabase Realtime                           |
| Charts            | SVG puro (sem libs externas)                |
| Node              | >= 18                                       |

### Estrutura de Pastas

```
casa-inteligente/
├── public/
│ └── logo.svg
├── src/
│ ├── main.jsx
│ ├── App.jsx
│ ├── routes.jsx
│ ├── styles/
│ │ ├── tokens.css
│ │ ├── reset.css
│ │ └── globals.css
│ ├── components/
│ │ ├── primitives/
│ │ │ ├── Button.jsx + .css
│ │ │ ├── Input.jsx + .css
│ │ │ ├── Select.jsx + .css
│ │ │ ├── Card.jsx + .css
│ │ │ ├── Badge.jsx + .css
│ │ │ ├── Avatar.jsx + .css
│ │ │ ├── Modal.jsx + .css
│ │ │ ├── Drawer.jsx + .css
│ │ │ ├── ConfirmDialog.jsx
│ │ │ ├── EmptyState.jsx + .css
│ │ │ ├── Toast.jsx + .css
│ │ │ └── Spinner.jsx + .css
│ │ ├── layout/
│ │ │ ├── AppShell.jsx + .css
│ │ │ └── BottomNav.jsx + .css
│ │ └── PrivateRoute.jsx
│ ├── pages/
│ │ ├── Splash/
│ │ │ └── Splash.jsx + .css
│ │ ├── Auth/
│ │ │ ├── Login.jsx + .css
│ │ │ ├── Register.jsx + .css
│ │ │ ├── InviteLanding.jsx + .css
│ │ │ └── InviteShare.jsx + .css
│ │ ├── Modules/
│ │ │ ├── Modules.jsx + .css
│ │ │ └── ModuleIcon.jsx
│ │ └── Shopping/
│ │ ├── Shopping.jsx + .css
│ │ ├── ShoppingItem.jsx + .css
│ │ ├── AddItemModal.jsx + .css
│ │ ├── BuyItemModal.jsx + .css
│ │ ├── ProductDrawer.jsx + .css
│ │ ├── PriceChart.jsx + .css
│ │ ├── History.jsx + .css
│ │ ├── SuggestionsPanel.jsx + .css
│ │ └── ShoppingIcons.jsx
│ ├── hooks/
│ │ ├── useShoppingList.js
│ │ ├── useExitConfirm.js
│ │ ├── useKeyboardShortcuts.js
│ │ └── useToast.js
│ ├── stores/
│ │ └── authStore.js
│ └── services/
│ └── mock/
│ ├── catalog.js
│ ├── schema.js
│ ├── seed.js
│ ├── shoppingService.js
│ └── modulesMock.js
├── index.html
├── vite.config.js
├── package.json
└── PROJETO.md
```

---

## 4. Modelo de Dados

### Entidades Principais

```typescript
// =========================================================================
// SCHEMA — Espelho fiel do futuro banco Supabase
// =========================================================================

Casa {
id: string // "casa-abc123"
nome: string // "Casa da Maria"
codigoConvite: string // "CASA-ABC123" (6 chars)
criadoEm: Date
ativa: boolean
}

Membro {
id: string // uuid
casaId: string // FK -> Casa
nome: string
email: string // único global
avatarUrl?: string
papel: 'admin' | 'membro' // admin pode remover membros e casa
entrouEm: Date
ativo: boolean
}

Modulo {
id: string // "shopping", "tasks", "bills"
nome: string
descricao: string
icon: string
ativoNaCasa: boolean
}

Produto {
id: string // "p-abc123"
casaId: string // FK -> Casa
nome: string // "Arroz"
categoria: CategoriaId
unidadePadrao: UnidadeId
ativo: boolean
criadoEm: Date
}

ItemLista {
id: string // "i-xyz"
casaId: string // FK -> Casa
produtoId: string // FK -> Produto
adicionadoPorId: string // FK -> Membro
adicionadoEm: Date
quantidade: number // 2
unidade: UnidadeId // "kg"
status: 'pendente' | 'comprado'
observacao?: string // "marca X", "sem lactose"
compraId?: string // FK -> Compra (quando status = comprado)
compradoPorId?: string // FK -> Membro
compradoEm?: Date
}

Compra {
id: string // "c-123"
casaId: string // FK -> Casa
produtoId: string // FK -> Produto
quantidade: number
unidade: UnidadeId
precoTotal: number // em reais
precoUnitario?: number // precoTotal / quantidade
local?: string // "Mercado Central"
compradoPorId: string // FK -> Membro
data: Date
}

Convite {
id: string
casaId: string // FK -> Casa
codigo: string // 6 chars alfanuméricos
token: string // JWT-like para link compartilhável
criadoPorId: string // FK -> Membro
criadoEm: Date
expiraEm: Date // +7 dias
usado: boolean
usadoPorId?: string
usadoEm?: Date
}

// Tipos auxiliares
type CategoriaId =
| 'hortifruti' | 'acougue' | 'laticinios' | 'paes'
| 'mercearia' | 'bebidas' | 'limpeza' | 'higiene'
| 'outros';

type UnidadeId =
| 'un' | 'kg' | 'g' | 'l' | 'ml' | 'dz' | 'pct' | 'cx';
```

### Regras de Negócio Importantes

1. **Produto é sempre da casa** — Não há catálogo global na casa. Cada casa tem seus próprios produtos.
2. **ItemLista.status muda, não deleta** — Quando comprado, vira `status: 'comprado'` + cria `Compra`.
3. **Histórico é imutável** — `Compra` nunca é editada, apenas referenciada.
4. **Convite tem expiração** — 7 dias. Após isso, precisa gerar novo.
5. **Apenas admin remove membros** — Mas qualquer membro pode sair da casa.

### Mapeamento Service ↔ Hook ↔ UI

| Service (`shoppingService.js`) | Hook (`useShoppingList.js`) | UI                             |
| ------------------------------ | --------------------------- | ------------------------------ |
| `listarItens(casaId)`          | `carregar()` → `itens`      | `Shopping.jsx` renderiza lista |
| `adicionarItem(...)`           | `adicionar()`               | `AddItemModal.jsx`             |
| `atualizarItem(id, patch)`     | `atualizar()`               | edição inline                  |
| `removerItem(itemId)`          | `remover()`                 | botão lixeira                  |
| `marcarComoComprado(...)`      | `marcar()`                  | `BuyItemModal.jsx`             |
| `desfazerCompra(itemId)`       | `desfazer()`                | botão "desfazer" no item       |
| `getEstatisticasProduto(id)`   | (direto no drawer)          | `ProductDrawer.jsx`            |
| `getHistorico({produtoId})`    | (direto no drawer)          | `ProductDrawer.jsx`            |

> **REGRA DE OURO:** Toda função do service deve estar com `export`. Se criar uma nova, exportar imediatamente.

> **REGRA DE JOIN:** `listarItens` já retorna os itens com `produto` embutido (resultado do `produtos.find()`). O hook NÃO precisa fazer join novamente.

---

## 5. Design System

### Tokens de Cor (modo claro)

```css
/* src/styles/tokens.css */
:root {
  /* === CORES BASE === */
  --color-brand: #0052cc;
  --color-brand-hover: #0747a6;
  --color-brand-subtle: #deebff;

  /* === SUPERFÍCIES === */
  --color-bg: #f4f5f7;
  --color-surface: #ffffff;
  --color-surface-hover: #fafbfc;
  --color-bg-subtle: #f4f5f7;

  /* === TEXTO === */
  --color-text: #172b4d;
  --color-text-subtle: #5e6c84;
  --color-text-subtlest: #7a869a;
  --color-text-inverse: #ffffff;

  /* === BORDAS === */
  --color-border: #dfe1e6;
  --color-border-bold: #c1c7d0;

  /* === FEEDBACK === */
  --color-success: #00875a;
  --color-success-subtle: #e3fcef;
  --color-warning: #ff8b00;
  --color-warning-subtle: #fff7e6;
  --color-danger: #de350b;
  --color-danger-subtle: #ffebe6;
  --color-info: #0065ff;
  --color-info-subtle: #e9f2ff;

  /* === OVERLAY === */
  --color-overlay: rgba(9, 30, 66, 0.54);
}
```

### Tokens de Espaçamento (escala 4px)

```css
:root {
  --space-0: 0;
  --space-100: 4px;
  --space-200: 8px;
  --space-300: 12px;
  --space-400: 16px;
  --space-500: 20px;
  --space-600: 24px;
  --space-700: 32px;
  --space-800: 40px;
  --space-900: 48px;
  --space-1000: 64px;
}
```

### Tokens de Tipografia

```css
:root {
  --font-family-base:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-size-200: 12px;
  --font-size-300: 14px;
  --font-size-400: 16px;
  --font-size-500: 20px;
  --font-size-600: 24px;
  --font-size-700: 32px;

  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --line-height-200: 1.25;
  --line-height-300: 1.5;
  --line-height-400: 1.625;
}
```

### Tokens de Forma e Movimento

```css
:root {
  --radius-small: 4px;
  --radius-medium: 8px;
  --radius-large: 12px;
  --radius-xlarge: 16px;
  --radius-full: 9999px;

  --shadow-elevation-100: 0 1px 2px rgba(9, 30, 66, 0.08);
  --shadow-elevation-200: 0 4px 8px rgba(9, 30, 66, 0.12);
  --shadow-elevation-300: 0 8px 24px rgba(9, 30, 66, 0.18);

  --duration-fast: 120ms;
  --duration-medium: 240ms;
  --duration-slow: 360ms;
  --easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Componentes Primitivos — Contratos

| Componente      | Props principais                                                                           | Variantes                                                  |
| --------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| `Button`        | `variant`, `size`, `isLoading`, `isDisabled`, `iconBefore`, `iconAfter`, `onClick`, `type` | `primary` \| `subtle` \| `danger` \| `ghost`               |
| `Input`         | `label`, `hint`, `error`, `iconBefore`, `isRequired`, `type`, `value`, `onChange`          | —                                                          |
| `Select`        | `label`, `options[]`, `placeholder`, `isRequired`, `value`, `onChange`                     | —                                                          |
| `Card`          | `elevated`, `padding`, `onClick`                                                           | —                                                          |
| `Badge`         | `variant`, `icon`, `children`                                                              | `neutral` \| `brand` \| `success` \| `warning` \| `danger` |
| `Avatar`        | `name`, `src`, `size`                                                                      | `small` \| `medium` \| `large`                             |
| `Modal`         | `open`, `onClose`, `title`, `footer`, `size`, `children`                                   | `small` \| `medium` \| `large`                             |
| `Drawer`        | `open`, `onClose`, `title`, `footer`, `width`, `children`                                  | `small` \| `medium` \| `large`                             |
| `ConfirmDialog` | `open`, `onClose`, `onConfirm`, `title`, `message`, `variant`                              | `danger` \| `warning` \| `info`                            |
| `EmptyState`    | `icon`, `title`, `description`, `action`                                                   | —                                                          |
| `Toast`         | (via hook `useToast().showToast()`)                                                        | `success` \| `error` \| `warning` \| `info`                |
| `Spinner`       | `size`                                                                                     | —                                                          |

---

## 6. Roteamento

```jsx
// src/routes.jsx
const routes = [
  { path: "/", element: <Splash /> }, // 1.8s → redirect
  { path: "/login", element: <Login /> },
  { path: "/cadastro", element: <Register /> },
  { path: "/convite/:token", element: <InviteLanding /> }, // link compartilhável

  {
    element: <PrivateRoute />,
    children: [
      { path: "/modulos", element: <Modules /> },
      { path: "/compras", element: <Shopping /> },
      { path: "/compras/historico", element: <History /> },
      // Futuras
      // { path: '/tarefas', element: <Tarefas /> },
      // { path: '/contas', element: <Contas /> },
    ],
  },

  { path: "\*", element: <NotFound /> },
];
```

---

## 7. Auth Store (Zustand)

```javascript
// src/stores/authStore.js
{
user: null | {
id, nome, email, avatarUrl, casaId, papel
},
casa: null | {
id, nome, codigoConvite
},
isAuthenticated: boolean,

// Ações
login(email, senha): Promise<void>
register(dados): Promise<void>
logout(): void
aceitarConvite(token): Promise<void>
atualizarPerfil(dados): Promise<void>
}
```

**Persistência:** `localStorage` com chave `@casa-inteligente:auth`
**Regras:** - `login` aceita qualquer combinação no mock (apenas para dev)

- `register` cria automaticamente uma Casa e vincula o usuário como `admin`
- `aceitarConvite(token)` valida expiração e adiciona membro à casa

---

## 8. Estado Atual do Projeto

### ✅ Implementado e Funcionando

- [x] Sistema de design (tokens, primitivos)
- [x] Splash screen
- [x] Login / Cadastro / Convite por código (mock)
- [x] AppShell com navegação
- [x] Tela de Módulos
- [x] Tela principal de Compras (lista, busca, métricas)
- [x] Adicionar item à lista
- [x] Sugestões automáticas
- [x] Drawer de detalhes do produto (estatísticas, gráfico, histórico)
- [x] Persistência em localStorage
- [x] Toast feedback

### 🔧 Em Andamento (Fase 2 — Polimento UX)

- [x] Modal de compra (BuyItemModal) — finalizar
- [x] Tela de histórico dedicada
- [x] Atalhos de teclado (N, /, Esc, Enter, Ctrl+Z)
- [x] Confirmação de saída sem salvar
- [x] Animações de feedback (item riscado, slide-in)
- [x] Convite por **link compartilhável** (substituir código manual)

### 📋 Próximas Fases

| Fase  | Escopo                                          | Estimativa  |
| ----- | ----------------------------------------------- | ----------- |
| **3** | Backend (Supabase + Auth + Realtime)            | 3–5 dias    |
| **4** | PWA completo (service worker, offline, install) | 2 dias      |
| **5** | Novos módulos (Tarefas, Contas, Receitas)       | 2–3 semanas |

---

## 9. Convenções de Código

### Nomenclatura

| Tipo          | Padrão                        | Exemplo                  |
| ------------- | ----------------------------- | ------------------------ |
| Componentes   | `PascalCase`                  | `AddItemModal.jsx`       |
| Hooks         | `camelCase` com prefixo `use` | `useShoppingList.js`     |
| Services      | `camelCase`                   | `shoppingService.js`     |
| Stores        | `camelCase` + sufixo `Store`  | `authStore.js`           |
| Constantes    | `UPPER_SNAKE_CASE`            | `CATEGORIAS`, `UNIDADES` |
| Variáveis CSS | `kebab-case`                  | `--color-brand`          |
| Classes CSS   | BEM simplificado              | `.add-form__error`       |

### Imports — Ordem Obrigatória

```jsx
// 1. React e bibliotecas externas
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 2. Componentes locais
import { Button } from "../../components/primitives/Button";
import { Modal } from "../../components/primitives/Modal";

// 3. Hooks e stores
import { useShoppingList } from "../../hooks/useShoppingList";
import { useAuthStore } from "../../stores/authStore";

// 4. Services e utilitários
import { adicionarItem } from "../../services/mock/shoppingService";

// 5. Estilos (sempre por último)
import "./AddItemModal.css";
```

### CSS

- **Sempre usar tokens** (`var(--color-brand)`, nunca `#0052cc`)
- Mobile-first (começa com mobile, `@media (min-width:)` para desktop)
- BEM simplificado: `.component`, `.component__element`, `.component--modifier`

### Exports do Service — Nomes Padronizados

```javascript
// LEITURA
listarItens(casaId); // Lista completa com produto embutido
getEstatisticasProduto(produtoId);
getHistorico({ produtoId, limite });

// ESCRITA
adicionarItem({ nome, categoria, quantidade, unidade, observacao, membroId });
atualizarItem(itemId, patch);
removerItem(itemId);
marcarComoComprado(itemId, {
  membroId,
  quantidade,
  unidade,
  precoTotal,
  local,
});
desfazerCompra(itemId);

// CONVITE
gerarConvite(casaId, criadoPorId); // retorna { codigo, token, link, expiraEm }
validarConvite(token);
aceitarConvite(token, membroId);
```

> **Não criar aliases.** Se mudar o nome de uma função, mudar em TODOS os lugares (service, hook, UI).

---

## 10. Atalhos de Teclado (Planejados)

| Atalho          | Ação                        |
| --------------- | --------------------------- |
| `N`             | Novo item                   |
| `/`             | Focar busca                 |
| `Esc`           | Fechar modal/drawer         |
| `Enter` em item | Marcar como comprado        |
| `Ctrl+Z`        | Desfazer última ação        |
| `?`             | Mostrar atalhos disponíveis |

Implementação: `src/hooks/useKeyboardShortcuts.js`

---

## 11. Fluxo de Convite

### Como funciona (link compartilhável)

1. **Membro admin** clica em "Convidar" (no menu da casa ou módulos)
2. Sistema chama `gerarConvite(casaId, criadoPorId)`:
   - Gera código de 6 caracteres (ex: `ABC123`) — fallback manual
   - Gera token único longo (ex: `tk_aB3xZ9...`) — para o link
   - Define `expiraEm = now + 7 dias`
3. UI exibe:
   - **Link completo:** `https://app.com/convite/tk_aB3xZ9...`
   - Botão "Copiar link"
   - Botão "Compartilhar no WhatsApp" (`whatsapp://send?text=...`)
   - Botão "Compartilhar por e-mail" (`mailto:?subject=...`)
   - Código curto `ABC123` para digitar manualmente
4. **Pessoa convidada** clica no link → cai em `/convite/:token`
5. `InviteLanding`:
   - Se **não autenticado** : mostra preview da casa + botão "Entrar com Google" / "Cadastrar"
   - Se **autenticado** : chama `aceitarConvite(token, user.id)` e redireciona para a casa
6. Após aceitar: novo membro aparece na lista da casa

### Estrutura visual da InviteLanding

```
┌─────────────────────────┐
│ Logo da casa            │
│ "Casa da Maria"         │
│ 3 membros               │
│                         │
│ Você foi convidado!     │
│                         │
│ [Cadastrar e entrar]    │
│ [Já tenho conta]        │
└─────────────────────────┘
```

---

## 12. Checklist Antes de Commitar

### Service

- [ ] Todas as funções estão com `export`?
- [ ] Nomes batem com a seção 9 (padrão)?
- [ ] Não há `console.log` esquecido?
- [ ] `persistir()` é chamado após toda mutação?

### Hooks

- [ ] Importa do service com os nomes corretos?
- [ ] `useCallback` para funções retornadas?
- [ ] Cleanup em `useEffect` (timers, listeners)?

### UI

- [ ] Tokens CSS usados (zero hardcode de cor)?
- [ ] Modal/Drawer fecham em Esc e clique fora?
- [ ] Estados de loading, empty e error tratados?
- [ ] Toast aparece em ações destrutivas?
- [ ] Responsivo em 375px (iPhone SE)?
- [ ] Sem warnings no console?

### Geral

- [ ] `npm run build` passa sem erros?
- [ ] `npm run lint` passa?
- [ ] Nenhum arquivo novo ficou sem `.css` companion?

---

## 13. Roadmap

```
┌─────────────────┐
│ FASE 1 (MVP)    │ ✅ Concluída
│ Shopping mock   │
└────────┬────────┘
         │
┌────────▼────────┐
│ FASE 2 (UX)     │ 🔧 Em andamento
│ Polimento +     │
│ convite por     │
│ link            │
└────────┬────────┘
         │
┌────────▼────────┐
│ FASE 3 (BACK)   │ 📋 Próxima
│ Supabase +      │
│ Auth +          │
│ Realtime        │
└────────┬────────┘
         │
┌────────▼────────┐
│ FASE 4 (PWA)    │ 📋
│ Offline +       │
│ install         │
└────────┬────────┘
         │
┌────────▼────────┐
│ FASE 5 (ESCALA) │ 📋
│ Mais módulos    │
└─────────────────┘
```

---

## 14. Decisões Tomadas

| Data       | Decisão                                                          | Motivo                                          |
| ---------- | ---------------------------------------------------------------- | ----------------------------------------------- |
| Inicial    | Sistema próprio de design (sem Material/Chakra)                  | Controle total, bundle menor                    |
| Inicial    | Zustand em vez de Redux                                          | Menos boilerplate, suficiente para o escopo     |
| Inicial    | localStorage como mock                                           | Acelerar desenvolvimento, fácil migração depois |
| Inicial    | Charts em SVG puro                                               | Sem dependências externas                       |
| Inicial    | PWA em vez de nativo                                             | Compartilhamento de link, sem App Store         |
| Confirmado | Exports: `listarItens`, `adicionarItem`, `marcarComoComprado`    | Nomes consistentes entre camadas                |
| Confirmado | `listarItens` retorna produto embutido                           | Reduzir trabalho no hook e UI                   |
| Confirmado | Convite por **link compartilhável** (token longo) + código curto | Melhor UX, também serve para "avô sem app"      |
| Confirmado | Toast próprio (sem lib como react-toastify)                      | Controle visual e zero dependência              |

---

## Como Usar Este Documento

1. **Antes de criar/modificar código:** Leia a seção relevante.
2. **Antes de pedir ajuda:** Releia a seção 14 (Decisões) para evitar refazer.
3. **Antes de commitar:** Rode o Checklist da seção 12.
4. **Ao integrar Supabase:** O schema da seção 4 está pronto para mapear 1:1.
5. **Ao adicionar módulo novo:** Siga o padrão da seção 3 (estrutura de pastas).

---

**Última atualização:** Consolidação pós-correção de bugs do MVP de Compras. **Próxima revisão:** Ao iniciar Fase 3 (Backend Supabase).
