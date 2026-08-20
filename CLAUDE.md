# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

Single-page personal portfolio / digital resume for Abhineeth Srinivasa.
Static site — no backend, no database, no API calls.

Stack: Vite 5 · React 18 · TypeScript · Tailwind CSS v4 · shadcn/ui (Radix) ·
React Router · Framer Motion + GSAP · TanStack Query (provider only, unused).

## Commands

```sh
npm install          # install dependencies
npm run dev          # dev server on http://localhost:8080
npm run build        # production build to dist/
npm run preview      # serve the production build
npm run lint         # ESLint
```

There is no test suite. Verify changes with `npm run build` and `npm run lint`.

## Architecture

- `src/App.tsx` — providers (ErrorBoundary → QueryClient → ThemeProvider →
  TooltipProvider) and routes: `/`, `/style-guide`, and a `*` catch-all.
  Add new routes **above** the catch-all.
- `src/pages/Index.tsx` — composes the section components in order.
- `src/components/sections/` — one component per page section (Header, About,
  Work, Projects, Skills, Stats, Education, Contact).
- `src/components/ui/` — shadcn/ui primitives. Generated code; prefer composing
  over editing. `components.json` holds the shadcn config.
- `src/data/portfolio-data.ts` — **all portfolio content lives here.**
- `src/types/portfolio.ts` — types for that content.
- `src/hooks/` — `useActiveSection`, `useIntersectionObserver`,
  `useScrollPosition`, `use-mobile`, `use-toast`.
- `SPECIFICATION.md` — original product spec; background context, not a
  contract. Treat the code as the source of truth where they disagree.

### Content changes

To update resume text, projects, skills, or stats, edit
`src/data/portfolio-data.ts` — not the section components. Components render
from that data; hardcoding copy into JSX breaks that separation.

## Styling

Tailwind CSS **v4** — configured via the `@theme` block in `src/index.css`, not
via a JS config object. `tailwind.config.ts` exists but the design tokens are in
CSS.

- Colors are `oklch()` custom properties (`--color-background`,
  `--color-foreground`, …). Use the semantic Tailwind classes (`bg-background`,
  `text-foreground`, `border-border`) rather than raw hex or arbitrary values.
- Typography is a defined scale: `text-display`, `text-hero`, `text-section`,
  `text-large`, `text-body`, `text-small`, `text-tiny`. Each is responsive via
  `:root` media-query overrides — do **not** add `md:text-*` variants on top of
  them, the scale already handles breakpoints.
- Display type is `'Cormorant Garamond'` (serif), loaded from Google Fonts in
  `index.html`. Body/UI text uses the system sans stack.
- `/style-guide` renders the tokens and primitives — check changes there.

Use the `@` alias for imports (`@/components/...`), configured in
`vite.config.ts` and `tsconfig.app.json`.

## Deployment

Static SPA. `npm run build` emits `dist/`. The host must rewrite unmatched
routes to `index.html` or client-side routing 404s on refresh. See README for
per-platform config. If deploying to a subpath, set `base` in `vite.config.ts`.

## Conventions

- Assets in `public/` are served from the root (`/favicon.svg`,
  `/Abhineeth_Resume.pdf`). Images imported through `src/assets/` are hashed by
  Vite.
- Accessibility matters here: `SkipLink`, semantic landmarks, and focus states
  are intentional. Keep them when refactoring.
- This project came from an AI site builder and has been detached from it. Don't
  reintroduce vendor-specific plugins, tagging, or metadata.
