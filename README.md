# Abhineeth Srinivasa — Portfolio

A single-page personal portfolio and digital resume. Built with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui.

## Prerequisites

- Node.js 18+ and npm

## Getting started

```sh
npm install
npm run dev
```

The dev server runs on [http://localhost:8080](http://localhost:8080).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Production build to `dist/` |
| `npm run build:dev` | Build with development mode settings |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across the project |

## Project structure

```
public/              Static assets (resume PDF, favicon, robots.txt)
src/
  components/
    sections/        Page sections (header, about, work, projects, ...)
    timeline/        Education timeline components
    ui/              shadcn/ui primitives
  data/              Portfolio content (resume data, projects, skills)
  hooks/             Custom React hooks
  lib/               Utilities
  pages/             Index, NotFound, StyleGuide routes
  types/             Shared TypeScript types
  index.css          Design tokens and global styles
```

Content lives in `src/data/` — edit those files to update the portfolio rather than the components.

## Deployment

The build output is a fully static site in `dist/`, so any static host works.

```sh
npm run build
```

Because the app is a client-side SPA (React Router), the host must rewrite all
unmatched routes to `index.html`.

**Netlify** — add `public/_redirects`:

```
/*  /index.html  200
```

**Vercel** — add `vercel.json`:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

**GitHub Pages** — either copy `dist/index.html` to `dist/404.html` after building,
or serve from a custom domain with a hosting layer that supports rewrites. If
deploying to a subpath (e.g. `username.github.io/portfolio`), set `base` in
`vite.config.ts` to `"/portfolio/"`.

**Nginx** (self-hosted) — serve `dist/` with:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## License

All rights reserved. Personal portfolio content and assets are not licensed for reuse.
