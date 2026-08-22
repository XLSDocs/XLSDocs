import Link from 'next/link';
import {
  Search,
  Calculator,
  GitBranch,
  Grid3x3,
  Type,
  Calendar,
  Info,
  Landmark,
  ChartColumn,
  FileCode,
  SquareFunction,
  type LucideIcon,
} from 'lucide-react';
import type { FunctionCategory } from '@/lib/source';

// Matches each category's own content/docs/<slug>/meta.json icon, so the
// same glyph shows here and in the docs sidebar.
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  lookup: Search,
  math: Calculator,
  logical: GitBranch,
  arrays: Grid3x3,
  text: Type,
  date: Calendar,
  info: Info,
  financial: Landmark,
  statistical: ChartColumn,
  vba: FileCode,
  'custom-functions': SquareFunction,
};

export function Categories({ categories }: { categories: FunctionCategory[] }) {
  const sorted = [...categories].sort((a, b) => b.functions.length - a.functions.length);

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-10 text-center">
        <p className="font-mono text-xs tracking-wider text-fd-primary uppercase">
          Every angle covered
        </p>
        <h2 className="mt-2 text-3xl">
          One reference for{' '}
          <span className="font-serif text-fd-primary italic">however</span> you write Excel
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-fd-muted-foreground">
          Worksheet formulas, VBA macros, and custom LAMBDA functions — not
          three separate sites stitched together.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {sorted.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.slug] ?? FileCode;
          return (
            <Link
              key={cat.slug}
              href={`/docs/${cat.slug}`}
              className="category-card group relative rounded-xl bg-fd-card p-5 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <Icon className="size-5 text-fd-primary" />
                <span className="font-mono text-xs text-fd-muted-foreground">
                  {cat.functions.length}
                </span>
              </div>
              <h3 className="mt-3 font-medium">{cat.title}</h3>
              {cat.description && (
                <p className="mt-1 line-clamp-2 text-xs text-fd-muted-foreground">
                  {cat.description}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
