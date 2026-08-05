import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import type { ReactNode } from 'react';

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
 */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <Accordions>
      {items.map((item) => (
        <Accordion key={item.question} title={item.question}>
          {renderInline(item.answer)}
        </Accordion>
      ))}
    </Accordions>
  );
}
