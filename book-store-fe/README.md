# Book Store Frontend

Next.js (App Router) frontend for the Book Store app. Uses React Query for data fetching, React Hook Form + Zod for forms, and a small UI kit.

## Requirements
- Node 20+
- pnpm 9+
- Backend running at http://localhost:3000 (Next dev server runs on 3001 by default). API calls use same-origin `/api` proxies; set `NEXT_PUBLIC_API_BASE` if you host the backend elsewhere.

## Quick Start
```bash
pnpm install
pnpm dev          # start dev server on http://localhost:3001
```

## Environment (.env)
NEXT_PUBLIC_API_URL=http://localhost:3000/api

## Scripts
- `pnpm dev` — run dev server
- `pnpm build` — production build
- `pnpm start` — start built app
- `pnpm lint` — Next.js ESLint
- `pnpm test` — Vitest unit tests (jsdom)
- `pnpm test:watch` — Vitest watch mode
- `pnpm test:coverage` — Vitest with coverage (text/html/lcov in coverage/)
- `pnpm format` — Prettier write
- `pnpm format:check` — Prettier check

## Testing
- Framework: Vitest + @testing-library/react (jsdom).
- Setup: `vitest.setup.ts` mocks Next Link/Image and registers jest-dom matchers.
- Path alias: `@` resolves to `src/` (see vitest.config.ts / tsconfig.json).
- Coverage reports: `coverage/` (ignored by git). Open `coverage/index.html` after running `pnpm test:coverage`.

## Project Structure
- `src/app` — Next.js routes/layouts; auth and main sections
- `src/components` — UI components (cards, filters, forms, UI primitives)
- `src/hooks` — React Query hooks (books)
- `src/lib` — API client, utilities, validation schemas, constants
- `src/types` — shared TypeScript types

## API Expectations
- Frontend calls `/api/...` which should proxy to the backend API. Configure `NEXT_PUBLIC_API_BASE` if deploying with a different origin.

## Notes
- Dev server port: 3001 (set in package.json script). Change with `pnpm dev -- -p <port>` if needed.
