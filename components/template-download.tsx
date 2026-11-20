import { Download, FileSpreadsheet } from 'lucide-react';
import { getTemplates } from '@/lib/templates';
import { SpreadsheetPreview } from './templates/spreadsheet-preview';

/**
 * A static-file download link, not a generated-on-click export — the .xlsx
 * already exists under public/templates/ at build time, so this needs no
 * client-side JS. `slug` looks up title/description/size/preview from
 * lib/templates.ts so the same data backs this inline card, the /templates
 * index page, and the preview grid on both.
 */
export function TemplateDownload({ slug }: { slug: string }) {
  const template = getTemplates().find((t) => t.slug === slug);
  if (!template) return null;

  return (
    <a
      href={`/templates/${template.slug}.xlsx`}
      download
      className="not-prose group my-6 block rounded-xl border bg-fd-card p-4 transition-colors hover:border-fd-primary/40"
    >
      <div className="flex items-center gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-fd-primary/10 text-fd-primary">
          <FileSpreadsheet className="size-5" />
        </span>
        <span className="flex-1">
          <span className="block font-medium text-fd-card-foreground">
            Download the starter workbook — {template.title}
          </span>
          <span className="block text-sm text-fd-muted-foreground">
            {template.description}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1.5 rounded-lg border border-fd-border px-3 py-1.5 text-sm font-medium text-fd-foreground group-hover:border-fd-primary/40 group-hover:text-fd-primary">
          <Download className="size-3.5" />
          .xlsx · {template.fileSize}
        </span>
      </div>
      <div className="mt-4 max-w-md">
        <SpreadsheetPreview {...template.preview} />
      </div>
    </a>
  );
}
