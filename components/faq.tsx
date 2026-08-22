'use client';

import { useState, type ReactNode } from 'react';

export interface FaqItem {
  question: string;
  answer: string;
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

/**
 * Renders FAQ accordions from plain data instead of hand-written JSX, so the
 * same `items` can also be used to emit FAQPage structured data (see
 * app/docs/[[...slug]]/page.tsx) without parsing markdown back out of MDX.
 *
 * Self-contained rather than built on fumadocs-ui's Accordion — that
 * component hardcodes a rotating chevron with no icon-override prop, and a
 * +/- toggle is easier to own outright than to fight via CSS against a
 * third party's internal markup. Multiple items can be open at once,
 * matching the fumadocs Accordions default this replaces.
 */
export function Faq({ items }: { items: FaqItem[] }) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  function toggle(question: string) {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(question)) next.delete(question);
      else next.add(question);
      return next;
    });
  }

  return (
    <div className="not-prose divide-y divide-fd-border overflow-hidden rounded-lg border bg-fd-card">
      {items.map((item) => {
        const isOpen = openItems.has(item.question);
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => toggle(item.question)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left font-medium text-fd-card-foreground"
            >
              <span>{item.question}</span>
              <span
                aria-hidden
                className="flex size-5 shrink-0 items-center justify-center rounded-full border border-fd-border font-mono text-sm text-fd-muted-foreground"
              >
                {isOpen ? '−' : '+'}
              </span>
            </button>
            {isOpen && (
              <div className="px-4 pb-3 text-[0.9375rem] text-fd-muted-foreground">
                {renderInline(item.answer)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
