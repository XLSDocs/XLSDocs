import fs from 'node:fs';
import path from 'node:path';
import { loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { docsContentRoute, docsImageRoute, docsRoute } from './shared';
import { defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
    lastModified: true,
  },
  meta: {
    schema: metaSchema,
  },
});

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
  pageTree: {
    transformers: [
      {
        // Every function page (e.g. content/docs/date/datedif/) is a folder
        // containing a single index.mdx, but its meta.json sets `"pages": []`
        // so that file isn't also listed as a redundant sidebar child under
        // its own folder. That leaves an empty-children folder node, which
        // fumadocs-ui still renders with a chevron even though expanding it
        // reveals nothing. Category folders always have real children, so
        // this only ever collapses function (leaf) nodes into a plain link.
        folder(node) {
          // Must be a fresh object, not `node.index` itself: fumadocs tracks
          // node ownership by object identity to dedupe a file appearing in
          // two places, and `node.index` is already "owned" by this folder
          // at the same priority the parent would claim it at — reusing the
          // reference makes the parent's ownership claim lose, silently
          // dropping this item from the parent's children.
          if (node.children.length === 0 && node.index) {
            const idx = node.index;
            return {
              type: 'page',
              name: idx.name,
              url: idx.url,
              description: idx.description,
              icon: idx.icon,
              external: idx.external,
              $ref: idx.$ref,
            } as unknown as typeof node;
          }
          return node;
        },
      },
    ],
  },
});

export function getPageImageUrl(page: (typeof source)['$inferPage']) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: '/' + [page.locale, ...docsImageRoute.split('/'), ...segments].filter(Boolean).join('/'),
  };
}

export function getPageMarkdownUrl(page: (typeof source)['$inferPage']) {
  const segments = [...page.slugs, 'content.md'];

  return {
    segments,
    url: '/' + [page.locale, ...docsContentRoute.split('/'), ...segments].filter(Boolean).join('/'),
  };
}

export async function getLLMText(page: (typeof source)['$inferPage']) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${processed}`;
}

export interface FunctionCategory {
  slug: string;
  title: string;
  description?: string;
  functions: {
    slug: string;
    title: string;
    description?: string;
    url: string;
    is365Exclusive: boolean;
  }[];
}

// Perpetual (boxed/one-time-purchase) version labels a function's own
// Compatibility table can mark as supported. A function is "365 exclusive"
// when it's supported in 365 but in none of these — i.e. it never shipped
// in any perpetual release, only the subscription.
const PERPETUAL_LABELS = new Set(['2024', '2021', '2019', '2016']);

/**
 * Reads a function page's own `export const compatibility = [...]` array
 * straight out of its raw MDX source (not the compiled page — MDX `export`
 * statements are evaluated away by the time fumadocs' page data is
 * available, so there's no post-compile way to read this back out). Safe to
 * do at build/catalog time: this only ever runs server-side during
 * `next build`/page generation, never in the browser.
 */
function is365ExclusiveFunction(categorySlug: string, fnSlug: string): boolean {
  const filePath = path.join(process.cwd(), 'content', 'docs', categorySlug, fnSlug, 'index.mdx');
  let source: string;
  try {
    source = fs.readFileSync(filePath, 'utf8');
  } catch {
    return false;
  }

  const block = source.match(/export const compatibility = (\[[\s\S]*?\]);/)?.[1];
  if (!block) return false;

  let supports365 = false;
  let supportsPerpetual = false;
  const entryPattern = /label:\s*'([^']+)',\s*supported:\s*(true|false)/g;
  for (const [, label, supported] of block.matchAll(entryPattern)) {
    if (supported !== 'true') continue;
    if (label === '365') supports365 = true;
    if (PERPETUAL_LABELS.has(label)) supportsPerpetual = true;
  }

  return supports365 && !supportsPerpetual;
}

/**
 * Real function/category data derived from the docs source, not hardcoded —
 * grows automatically as more `content/docs/<category>/<fn>/` folders are
 * added. A "category" page is a top-level docs page (`slugs.length === 1`,
 * e.g. `content/docs/lookup/index.mdx`); a "function" page is one folder
 * level deeper (`slugs.length === 2`, e.g. `.../lookup/xlookup/index.mdx`).
 * The docs root and the `test` placeholder page are excluded.
 */
export function getFunctionCatalog(): FunctionCategory[] {
  const pages = source.getPages();
  const categoryPages = pages.filter((p) => p.slugs.length === 1 && p.slugs[0] !== 'test');
  const functionPages = pages.filter((p) => p.slugs.length === 2);

  return categoryPages
    .map((cat) => ({
      slug: cat.slugs[0],
      title: cat.data.title,
      description: cat.data.description,
      functions: functionPages
        .filter((fn) => fn.slugs[0] === cat.slugs[0])
        .map((fn) => ({
          slug: fn.slugs[1],
          title: fn.data.title,
          description: fn.data.description,
          url: fn.url,
          is365Exclusive: is365ExclusiveFunction(fn.slugs[0], fn.slugs[1]),
        })),
    }))
    .filter((cat) => cat.functions.length > 0)
    // source.getPages() order isn't guaranteed alphabetical for top-level
    // category folders (Statistical was landing last, after Web, since it
    // reflects filesystem/build discovery order, not category name) — sort
    // explicitly so /functions and any other consumer of this list don't
    // inherit that incidental ordering.
    .sort((a, b) => a.title.localeCompare(b.title));
}
