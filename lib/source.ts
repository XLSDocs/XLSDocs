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
  }[];
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
        })),
    }))
    .filter((cat) => cat.functions.length > 0);
}
