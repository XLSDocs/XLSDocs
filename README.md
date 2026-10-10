# xlsdocs

The Excel function reference built for the AI era — every function
documented (Excel formulas, VBA, and the code to reproduce them in
Python/pandas), plus an AI formula builder and a searchable function
index.

**Live site:** [xlsdocs.com](https://xlsdocs.com)

Built with [Next.js](https://nextjs.org) and
[Fumadocs](https://fumadocs.dev), statically exported
(`output: 'export'`) and deployed to Cloudflare Pages. The handful of
dynamic features (AI tools, Stripe billing, feedback) run as
Cloudflare Pages Functions under `functions/`.

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000 to see the result.

```bash
npm run types:check   # typegen + tsc --noEmit
npm run build          # production Next.js build
```

## Deploying

Deployed to Cloudflare Pages, not a Node server:

```bash
npm run deploy    # next build (static export) + wrangler pages deploy
npm run preview    # next build + run the Pages build locally via wrangler
```

## Content structure

Every function page lives under `content/docs/<category>/<function>/`
as three files:

- `index.mdx` — syntax, parameters, description, common errors, FAQ,
  code examples, compatibility, and related functions
- `examples.mdx` — five worked examples
- `meta.json` — `{ "title": "<FUNCTION NAME>", "pages": [] }`

A new top-level category needs its own `meta.json` with
`"root": true` and an `index.mdx` — without an index page, the
category's sidebar entry won't appear even if function pages exist
underneath it.

Blog posts live under `content/blog/`. `lib/changelog.ts` tracks
user-facing changes shown on the `/changelog` page and the homepage
ticker.

## Project layout

| Path                       | Description                                              |
| --------------------------- | --------------------------------------------------------- |
| `app/(home)`                | Landing page, functions catalog, formula builder tool.    |
| `app/docs`                  | Documentation layout and function/category pages.         |
| `app/blog`                  | Blog layout and post pages.                                |
| `app/api/search/route.ts`   | Static search index route (Fumadocs `staticGET`).          |
| `functions/api/`            | Cloudflare Pages Functions — AI tools, Stripe billing, feedback. |
| `content/docs`               | Function reference content (MDX).                          |
| `content/blog`               | Blog post content (MDX).                                   |
| `lib/source.ts`              | Content source adapter — [`loader()`](https://fumadocs.dev/docs/headless/source-api) provides the interface to access content. |
| `lib/changelog.ts`           | Changelog entries shown on `/changelog` and the homepage.  |
| `components/`                | Shared function-page components (`QuickAnswer`, `ParametersTable`, `TryIt`, `Compatibility`, etc.). |
