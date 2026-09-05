import { Card, Cards } from 'fumadocs-ui/components/card';
import { getFunctionCatalog } from '@/lib/source';

// Replaces content/docs/index.mdx's old hand-written <Cards> list, which
// silently dropped Database and Web when they were added (caught live on
// production 2026-09-04, the second time this exact class of bug hit —
// see xlsdocs_gotchas.md). getFunctionCatalog() is the same real,
// build-time-derived data source /functions and components/home/
// categories.tsx already use, so a new category folder shows up here
// automatically the moment it has at least one function page — nothing
// to remember to update.
export function CategoryCards() {
  const categories = getFunctionCatalog();

  return (
    <Cards className="grid-cols-3">
      {categories.map((category) => (
        <Card
          key={category.slug}
          title={category.title}
          description={category.description}
          href={`/docs/${category.slug}`}
        />
      ))}
    </Cards>
  );
}
