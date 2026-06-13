# AI Context

This file is the fast onboarding map for AI agents and future maintainers.
Read it with `AGENTS.md` before changing code.

## Project Snapshot

BillingVault is a Next.js 16 / React 19 demo for a secure SaaS subscription
checkout flow. It showcases pricing plans, login/session handling, checkout,
payment methods, subscription management, billing history, form validation, CSP,
and maintainable App Router structure.

## Stack

- Framework: Next.js 16 App Router
- React: React 19 with React Compiler enabled
- Language: TypeScript
- Styling: Tailwind CSS 4 with shadcn/radix-luma UI conventions
- UI primitives: Radix UI, shadcn components, lucide-react icons
- Forms: React Hook Form with Zod
- Server state: TanStack Query
- Client state: Zustand
- Tests: Vitest, Testing Library, Storybook test integration, Playwright browser provider
- Security: Supabase SSR cookie flow, server-side session verification, CSP
  nonce, safe callback URL validation

## Directory Map

```txt
src/
  app/
    (public)/        Public routes: home, pricing, product detail, login
    (protected)/     Authenticated routes: checkout, payment, account, subscription
    _components/     App-level layout components such as Navbar and Footer
    layout.tsx       Root layout, providers, fonts, metadata, current user preload

  components/ui/     Shared shadcn-style UI primitives and Storybook stories
  providers/         ThemeProvider, AuthProvider, QueryProvider
  stores/            Zustand stores for client-only state
  lib/
    auth/            Server session, DAL, mock auth API, OAuth helpers
    tailwind-css/    Tailwind class utilities
  proxy/             CSP builder and callback URL safety helpers
  mocks/fixtures/    Mock plans, products, and payment methods
  settings/          App-wide configuration such as CSP and locale
```

## Route Model

- Public pages live under `src/app/(public)`.
- Protected pages live under `src/app/(protected)`.
- Route protection is enforced in `src/proxy.ts` with `protectedRoutePrefixes`.
- Keep the proxy route list aligned with actual protected route folders.

Current protected route intent:

```txt
/checkout
/payment
/account
/subscription
```

Known note: verify that `/subscription` is included in `protectedRoutePrefixes`
before relying on it as a protected page.

## State Ownership

Use React Query for server state:

- Data fetched from APIs or backend services
- Data needing loading, error, retry, cache, invalidation, or refetch behavior
- Shared remote data such as subscriptions, invoices, payment methods, plans

Use Zustand only for client state:

- UI state such as modal visibility, sidebar state, selected local filters
- Non-sensitive display state that does not require server synchronization
- Avoid async fetch actions in Zustand

The project includes a custom ESLint rule:

```txt
zustand/no-async-zustand-actions
```

## React Compiler Rules

React Compiler is enabled in `next.config.ts`.

Before editing React code, check:

- Components are named, not anonymous
- Render is pure and has no side effects
- Props and state are not mutated directly
- Hooks are only called at the top level
- `ref.current` is not read or written during render
- Prefer derived state over syncing state with `useEffect`
- Keep object and function references stable when passing them to children

After editing a component file, check the 200-line rule in
`docs/Components/CREATE_COMPONENT.md`.

## CodeGraph Usage

CodeGraph stores the structural index in:

```txt
.codegraph/codegraph.db
```

Prefer CodeGraph for structural questions:

- Where is a symbol defined?
- Who calls this function?
- What does this component import or depend on?
- What breaks if this store/action/type changes?
- Which symbols are relevant to a refactor task?

Prefer `rg` or direct file reads for literal text:

- Copy, comments, log strings, docs, config text

Useful commands:

```bash
codegraph status .
codegraph context "explain auth and protected routes"
codegraph context "migrate zustand async server state to react query"
codegraph query SomeSymbol
codegraph sync .
```

## Refactor Checklist

For risky refactors, especially Zustand to React Query:

1. Use CodeGraph to identify symbols and callers.
2. Classify data as server state or client state.
3. Add React Query hooks for server state.
4. Move components from store async actions to query hooks.
5. Keep Zustand focused on client-only state.
6. Remove unused store fields/actions.
7. Run validation commands.
8. Re-check old symbols with CodeGraph to confirm no callers remain.

## Validation Commands

```bash
pnpm lint
pnpm tsc
pnpm test:run
pnpm build
```

Use the narrowest useful validation first, then broaden based on the risk of the
change.

## Current Architecture Notes

- `src/app/layout.tsx` loads the current user on the server and passes it into
  client providers.
- `src/providers/AuthProvider.tsx` currently syncs server user data into Zustand
  with an effect. This is common, but should be revisited if strictly enforcing
  the project rule that avoids `useEffect` state synchronization.
- `src/proxy.ts` owns route guard behavior and CSP header injection.
- `src/proxy/*.test.ts` covers CSP and safe callback URL behavior.
- `docs/Plan.md` is the product and roadmap source of truth.
