'use client';

import { useRef, useState, type ReactNode } from 'react';
import { TextWrap } from 'lucide-react';

/**
 * Wraps a rendered code block (ExcelCode or a Shiki-highlighted <pre>) with a
 * wrap/no-wrap toggle button. Code blocks wrap by default (see global.css);
 * this flips a `no-wrap` class on the block's own <figure> to fall back to
 * the original horizontal-scroll behavior.
 */
export function CodeWrapToggle({ children }: { children: ReactNode }) {
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
