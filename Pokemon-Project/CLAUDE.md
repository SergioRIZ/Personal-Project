# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — Production build
- `npm run lint` — ESLint
- `npm test` — Vitest in watch mode
- `npm run test:run` — Vitest single run
- `npm run deploy` — Build + deploy to GitHub Pages via gh-pages

## Tech Stack

React 19 + TypeScript + Vite (SWC plugin) + Tailwind CSS v4 (via @tailwindcss/vite). Auth and data persistence through Supabase. i18n via react-i18next (EN/ES, inline translations in `src/i18n.ts`). Testing with Vitest + Testing Library.

## Architecture

**Custom Router** — No react-router for page routing. The app uses a hand-rolled router (`src/Router/Router.tsx`) that listens to custom `pushstate`/`popstate` events. Navigation is done via `navigate()` from `src/navigation.ts` which pushes to `window.history` and dispatches events. Routes are defined as an array in `App.tsx`. Dynamic segments (e.g. `/pokemon/:id`) are matched by prefix.

**Context Providers** — Four nested providers wrap the app in `App.tsx`:
- `SettingsProvider` — Dark mode, language, generation filter, results limit. Persisted to localStorage via `useLocalStorage` hook.
- `AuthProvider` — Supabase session/user state.
- `CollectionProvider` — User's collected Pokemon IDs, synced with Supabase.
- `TeamsProvider` — Team builder data (teams, members, moves, abilities, EVs/IVs), synced with Supabase.

**Supabase** — Client initialized in `src/lib/supabase.ts`. Requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` env vars. Service modules in `src/lib/` (`auth.ts`, `collection.ts`, `teams.ts`) wrap Supabase calls.

**PokeAPI** — Pokemon data fetched directly from PokeAPI (no wrapper library). Main fetch logic in `src/components/pages/Pokedex/` — `SearchService.ts` for search, `ApiService.ts` for ability descriptions. Language-aware (fetches localized names/descriptions based on current i18n language).

**Lazy Loading** — All page components are lazy-loaded via `React.lazy()` in `App.tsx` with a shared `Suspense` fallback.

## Key Conventions

- TypeScript strict mode with `noUnusedLocals` and `noUnusedParameters` enabled.
- All translations are inline in `src/i18n.ts` (no separate JSON files). Default language is Spanish (`es`).
- Page components live under `src/components/pages/<PageName>/`. Shared components in `src/components/shared/`.
- Custom hooks in `src/hooks/` (e.g., `useLocalStorage`, `useTypeDistribution`, `useMoveDetails`, `usePokemonBaseStats`).
- Forms have co-located hooks (e.g., `Login/hooks/useLoginForm.ts`, `SignUp/hooks/useForm.ts`).
