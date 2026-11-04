'use client';

import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import Link from 'next/link';
import { ChevronDown, Sparkles, Wrench, Hash, Palette, Sheet } from 'lucide-react';

const TOOLS = [
  {
    href: '/tools/formula-builder',
    label: 'AI Formula Builder',
    description: 'Describe what you need, get a working formula.',
    icon: Sparkles,
  },
  {
    href: '/tools/quick-fix',
    label: 'Quick Fix',
    description: 'Paste a broken formula, get it corrected.',
    icon: Wrench,
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
            className="absolute top-full left-1/2 mt-3 w-[340px] -translate-x-1/2 rounded-xl border border-fd-border bg-fd-card p-2 shadow-lg data-[motion=from-end]:animate-in data-[motion=from-end]:fade-in data-[motion=from-start]:animate-in data-[motion=from-start]:fade-in data-[motion=to-end]:animate-out data-[motion=to-end]:fade-out data-[motion=to-start]:animate-out data-[motion=to-start]:fade-out"
          >
            <ul className="flex flex-col gap-0.5">
              {TOOLS.map((tool) => (
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
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
