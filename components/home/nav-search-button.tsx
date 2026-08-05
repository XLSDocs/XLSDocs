'use client';

import { Search } from 'lucide-react';
import { useSearchContext } from 'fumadocs-ui/contexts/search';

export function NavSearchButton() {
  const { setOpenSearch } = useSearchContext();

  return (
    <button
      onClick={() => setOpenSearch(true)}
      aria-label="Search"
      className="flex items-center gap-2 rounded-full border border-fd-border px-3 py-1.5 text-sm text-fd-muted-foreground transition-colors hover:border-fd-foreground/20 hover:text-fd-foreground"
    >
      <Search className="size-4" />
      <span className="hidden sm:inline">Search</span>
      <kbd className="hidden rounded border border-fd-border bg-fd-muted px-1.5 py-0.5 font-mono text-[10px] sm:inline">
        ⌘K
      </kbd>
    </button>
  );
}
