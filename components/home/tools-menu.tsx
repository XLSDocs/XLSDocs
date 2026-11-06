'use client';

import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import Link from 'next/link';
import { ChevronDown, Sparkles, Wrench, Hash, Palette, Sheet, ListChecks, ArrowRightLeft } from 'lucide-react';

const GENERATORS = [
  {
    href: '/tools/vlookup-converter',
    label: 'VLOOKUP → XLOOKUP Converter',
    description: 'Paste a VLOOKUP, get the exact XLOOKUP equivalent.',
    icon: ArrowRightLeft,
  },
  {
    href: '/tools/number-format-builder',
    label: 'Number Format Builder',
    description: 'Build a custom number format code with a form.',
    icon: Hash,
  },
  {
    href: '/tools/conditional-format-builder',
    label: 'Conditional Format Builder',
    description: 'Generate the formula for a highlighting rule.',
    icon: Palette,
  },
  {
    href: '/tools/data-validation-builder',
    label: 'Data Validation Builder',
    description: 'Dropdown lists, dependent dropdowns, and range limits.',
    icon: ListChecks,
  },
  {
    href: '/tools/large-file-viewer',
    label: 'Large File Viewer',
    description: "Open CSV/Parquet files bigger than Excel's row limit.",
    icon: Sheet,
  },
];

export function ToolsMenu() {
  return (
    <NavigationMenu.Root className="relative" delayDuration={100}>
      <NavigationMenu.List className="flex">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="group flex items-center gap-1 text-sm text-fd-muted-foreground outline-none transition-colors hover:text-fd-foreground data-[state=open]:text-fd-foreground">
            Tools
            <ChevronDown className="size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content
            className="absolute top-full left-1/2 mt-3 w-[600px] -translate-x-1/2 rounded-xl border border-fd-border bg-fd-card p-4 shadow-lg data-[motion=from-end]:animate-in data-[motion=from-end]:fade-in data-[motion=from-start]:animate-in data-[motion=from-start]:fade-in data-[motion=to-end]:animate-out data-[motion=to-end]:fade-out data-[motion=to-start]:animate-out data-[motion=to-start]:fade-out"
          >
            <div className="grid grid-cols-[1.1fr_1fr] gap-4">
              <div>
                <span className="px-2.5 text-[10px] font-mono uppercase tracking-wider text-fd-muted-foreground">
                  Generators
                </span>
                <ul className="mt-1.5 flex flex-col gap-0.5">
                  {GENERATORS.map((tool) => (
                    <li key={tool.href}>
                      <NavigationMenu.Link asChild>
                        <Link
                          href={tool.href}
                          className="flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-fd-background"
                        >
                          <tool.icon className="mt-0.5 size-4 shrink-0 text-fd-primary" />
                          <span className="flex flex-col">
                            <span className="text-sm font-medium text-fd-foreground">{tool.label}</span>
                            <span className="text-xs text-fd-muted-foreground">{tool.description}</span>
                          </span>
                        </Link>
                      </NavigationMenu.Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="px-2.5 text-[10px] font-mono uppercase tracking-wider text-fd-muted-foreground">
                  AI-powered
                </span>
                <div className="mt-1.5 flex flex-col gap-2">
                  <NavigationMenu.Link asChild>
                    <Link
                      href="/tools/formula-builder"
                      className="flex flex-col gap-1.5 rounded-lg border border-fd-primary/30 bg-fd-primary/5 p-3 transition-colors hover:bg-fd-primary/10"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="size-4 text-fd-primary" />
                        <span className="text-sm font-medium text-fd-foreground">AI Formula Builder</span>
                      </div>
                      <span className="text-xs text-fd-muted-foreground">
                        Describe a formula in plain English and get a working result.
                      </span>
                      <span className="text-xs font-medium text-fd-primary">
                        Free to try · $5/mo for unlimited
                      </span>
                    </Link>
                  </NavigationMenu.Link>

                  <NavigationMenu.Link asChild>
                    <Link
                      href="/tools/quick-fix"
                      className="flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-fd-background"
                    >
                      <Wrench className="mt-0.5 size-4 shrink-0 text-fd-primary" />
                      <span className="flex flex-col">
                        <span className="text-sm font-medium text-fd-foreground">Quick Fix</span>
                        <span className="text-xs text-fd-muted-foreground">
                          Paste a broken formula, get it corrected.
                        </span>
                      </span>
                    </Link>
                  </NavigationMenu.Link>
                </div>
              </div>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
