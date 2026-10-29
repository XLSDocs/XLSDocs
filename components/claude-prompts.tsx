'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export interface ClaudePrompt {
  title: string;
  prompt: string;
}

function PromptRow({ title, prompt }: ClaudePrompt) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex items-start justify-between gap-3 border-t px-4 py-3 first:border-t-0">
      <div className="min-w-0">
        <div className="text-sm font-medium">{title}</div>
        <div className="mt-1 font-mono text-xs text-fd-muted-foreground">{prompt}</div>
      </div>
      <button
        onClick={handleCopy}
        aria-label="Copy prompt"
        className="flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-1 text-xs text-fd-muted-foreground transition-colors hover:bg-fd-muted hover:text-fd-foreground"
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

export function ClaudePrompts({ prompts }: { prompts: ClaudePrompt[] }) {
  return (
    <div className="not-prose my-4 overflow-hidden rounded-xl border-l-4 border-fd-primary bg-fd-primary/5">
      <div className="px-4 pt-4">
        <div className="text-xs font-mono font-semibold uppercase tracking-wider text-fd-primary">
          Try it in Claude for Excel
        </div>
        <p className="mt-1 text-sm text-fd-muted-foreground">
          Copy a prompt into Claude for Excel to run it against your own workbook.
        </p>
      </div>
      <div className="mt-2">
        {prompts.map((p) => (
          <PromptRow key={p.title} {...p} />
        ))}
      </div>
    </div>
  );
}
