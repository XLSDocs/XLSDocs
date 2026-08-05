'use client';

import { useState, type ReactNode } from 'react';
import { Copy, Check } from 'lucide-react';

export interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

export function ParametersTable({ items }: { items: Parameter[] }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const text = items
      .map(
        (p) =>
          `${p.name}\t${p.type}\t${p.required ? 'Required' : 'Optional'}\t${p.description.replace(/[`*]/g, '')}`,
      )
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="not-prose my-4 overflow-hidden rounded-xl border bg-fd-card">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-fd-muted-foreground">
          Parameters
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs text-fd-muted-foreground transition-colors hover:bg-fd-muted hover:text-fd-foreground"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b text-xs text-fd-muted-foreground">
              <th className="px-4 py-2 text-left font-medium">Parameter</th>
              <th className="px-4 py-2 text-left font-medium">Type</th>
              <th className="px-4 py-2 text-left font-medium">Required</th>
              <th className="px-4 py-2 text-left font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            {items.map((param) => (
              <tr key={param.name} className="border-b last:border-b-0 transition-colors hover:bg-fd-primary/5">
                <td className="px-4 py-3 align-top">
                  <code className="font-medium text-fd-primary">{param.name}</code>
                </td>
                <td className="px-4 py-3 align-top text-fd-muted-foreground">{param.type}</td>
                <td className="px-4 py-3 align-top">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase ${
                      param.required
                        ? 'bg-fd-primary/10 text-fd-primary'
                        : 'bg-fd-muted text-fd-muted-foreground'
                    }`}
                  >
                    {param.required ? 'Required' : 'Optional'}
                  </span>
                </td>
                <td className="px-4 py-3 align-top text-fd-muted-foreground">
                  {renderInline(param.description)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
