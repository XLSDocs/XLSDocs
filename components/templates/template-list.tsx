import Link from 'next/link';
import { Download, FileSpreadsheet } from 'lucide-react';
import type { Template } from '@/lib/templates';

export function TemplateList({ templates }: { templates: Template[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {templates.map((t) => (
        <div key={t.slug} className="flex flex-col rounded-xl border bg-fd-card p-5">
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-fd-primary/10 text-fd-primary">
              <FileSpreadsheet className="size-4.5" />
            </span>
            <h2 className="font-medium text-fd-card-foreground">{t.title}</h2>
          </div>
          <p className="mt-3 flex-1 text-sm text-fd-muted-foreground">{t.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <a
              href={`/templates/${t.slug}.xlsx`}
              download
              className="inline-flex items-center gap-1.5 rounded-lg border border-fd-primary/30 bg-fd-primary/10 px-3 py-1.5 text-sm font-medium text-fd-primary transition-colors hover:bg-fd-primary/20"
            >
              <Download className="size-3.5" />
              Download .xlsx · {t.fileSize}
            </a>
            <Link
              href={t.relatedHref}
              className="inline-flex items-center rounded-lg border border-fd-border px-3 py-1.5 text-sm text-fd-muted-foreground hover:text-fd-foreground"
            >
              {t.relatedLabel} →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
