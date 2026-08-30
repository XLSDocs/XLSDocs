'use client';

import { useRef, useState, type ReactNode } from 'react';
import { TextWrap, Sparkles } from 'lucide-react';
import { requestAskAIAboutSnippet } from '@/lib/ask-ai-events';

/**
 * Wraps a rendered code block (ExcelCode or a Shiki-highlighted <pre>) with a
 * wrap/no-wrap toggle button. Code blocks wrap by default (see global.css);
 * this flips a `no-wrap` class on the block's own <figure> to fall back to
 * the original horizontal-scroll behavior.
 *
 * `snippet`, when provided, also adds an "Ask AI about this" button — kept
 * optional and only wired up from ExcelCode (whose content is already plain
 * text). The generic `pre` override in mdx.tsx renders Shiki-highlighted
 * spans, not a plain string, so extracting a clean snippet there is a
 * separate problem left for later rather than solved here.
 */
export function CodeWrapToggle({ children, snippet }: { children: ReactNode; snippet?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [wrapped, setWrapped] = useState(true);

  function toggle() {
    const figure = containerRef.current?.querySelector('figure');
    if (!figure) return;
    figure.classList.toggle('no-wrap');
    setWrapped((w) => !w);
  }

  return (
    <div ref={containerRef} className="relative">
      {children}
      {snippet && (
        <button
          type="button"
          onClick={() => requestAskAIAboutSnippet(snippet)}
          aria-label="Ask AI about this formula"
          title="Ask AI about this formula"
          className="absolute top-2 right-[4.5rem] z-2 inline-flex items-center justify-center rounded-md p-1 text-fd-muted-foreground backdrop-blur-lg transition-colors hover:text-fd-primary [&_svg]:size-3.5"
        >
          <Sparkles />
        </button>
      )}
      <button
        type="button"
        onClick={toggle}
        aria-label={wrapped ? 'Turn off line wrapping' : 'Turn on line wrapping'}
        aria-pressed={wrapped}
        title={wrapped ? 'Turn off line wrapping' : 'Turn on line wrapping'}
        className={`absolute top-2 right-10 z-2 inline-flex items-center justify-center rounded-md p-1 backdrop-blur-lg transition-colors [&_svg]:size-3.5 hover:text-fd-accent-foreground ${
          wrapped ? 'text-fd-accent-foreground' : 'text-fd-muted-foreground'
        }`}
      >
        <TextWrap />
      </button>
    </div>
  );
}
