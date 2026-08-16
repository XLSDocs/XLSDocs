# xlsdocs

The Excel function reference built for the AI era — every function
documented (Excel formulas, VBA, and the code to reproduce them in
Python/pandas), plus an AI formula builder and a searchable function
index.

**Live site:** [xlsdocs.com](https://xlsdocs.com)

Built with [Next.js](https://nextjs.org) and
[Fumadocs](https://fumadocs.dev), deployed to Cloudflare Workers via
[OpenNext](https://opennext.js.org/cloudflare).

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

Deployed to Cloudflare Workers, not a Node server — the build and
deploy steps go through `@opennextjs/cloudflare`:

```bash
npm run deploy    # build + deploy to Cloudflare Workers
npm run preview    # build + run the Workers build locally
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
| `app/api/search/route.ts`   | Route handler for site search.                             |
| `app/api/formula-builder`   | Route handler for the AI formula builder.                  |
| `content/docs`               | Function reference content (MDX).                          |
| `content/blog`               | Blog post content (MDX).                                   |
| `lib/source.ts`              | Content source adapter — [`loader()`](https://fumadocs.dev/docs/headless/source-api) provides the interface to access content. |
| `lib/changelog.ts`           | Changelog entries shown on `/changelog` and the homepage.  |
| `components/`                | Shared function-page components (`QuickAnswer`, `ParametersTable`, `TryIt`, `Compatibility`, etc.). |
