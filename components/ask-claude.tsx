'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send } from 'lucide-react';
import type { ReactNode } from 'react';
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';


function formatMarkdown(text: string) {

  const lines = text.split('\n');
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];


// Fenced code block (```lang ... ```)
if (line.trim().startsWith('```')) {
  const codeLines: string[] = [];
  let j = i + 1;
  while (j < lines.length && !lines[j].trim().startsWith('```')) {
    codeLines.push(lines[j]);
    j++;
  }
  blocks.push(
    <CodeBlock key={key++} className="my-2">
      <Pre>{codeLines.join('\n')}</Pre>
    </CodeBlock>,
  );
  i = j + 1;
  continue;
}


    // Table: a line with | followed by a separator line of |---|---|
    if (line.trim().startsWith('|') && lines[i + 1]?.match(/^\s*\|[\s-:|]+\|\s*$/)) {
      const headerCells = line.split('|').map((c) => c.trim()).filter(Boolean);
      const rows: string[][] = [];
      let j = i + 2;
      while (j < lines.length && lines[j].trim().startsWith('|')) {
        rows.push(lines[j].split('|').map((c) => c.trim()).filter(Boolean));
        j++;
      }
      blocks.push(
        <table key={key++} className="w-full text-xs my-2 border-collapse">
          <thead>
            <tr>
              {headerCells.map((c, ci) => (
                <th key={ci} className="text-left border-b border-fd-border px-2 py-1 font-semibold">
                  {formatInline(c)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} className="border-b border-fd-border/50 px-2 py-1">
                    {formatInline(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>,
      );
      i = j;
      continue;
    }

    // Headers (## or ###)
    const headerMatch = line.match(/^#{1,3}\s+(.*)/);
    if (headerMatch) {
      blocks.push(
        <div key={key++} className="font-semibold mt-2 mb-1">
          {formatInline(headerMatch[1])}
        </div>,
      );
      i++;
      continue;
    }

    // Bullet points
    const bulletMatch = line.match(/^[-*]\s+(.*)/);
    if (bulletMatch) {
      blocks.push(
        <div key={key++} className="pl-3 flex gap-1.5">
          <span>•</span>
          <span>{formatInline(bulletMatch[1])}</span>
        </div>,
      );
      i++;
      continue;
    }

    if (line.trim() === '') {
      blocks.push(<div key={key++} className="h-2" />);
    } else {
      blocks.push(<div key={key++}>{formatInline(line)}</div>);
    }
    i++;
  }

  return blocks;
}

function formatInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="bg-fd-background px-1 py-0.5 rounded text-xs">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}














interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AskClaude({ pageTitle }: { pageTitle: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    `What does ${pageTitle} do?`,
    `Give me a real-world example using ${pageTitle}`,
    `What are common errors with ${pageTitle}?`,
  ];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const next: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ask-claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, pageTitle }),
      });
      const data = await res.json();
      if (data.error) {
        setMessages([...next, { role: 'assistant', content: `Error: ${data.error}` }]);
      } else {
        setMessages([...next, { role: 'assistant', content: data.reply }]);
      }
    } catch {
      setMessages([...next, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border bg-fd-primary/10 border-fd-primary/20 text-fd-primary hover:bg-fd-primary/20 transition-colors"
      >
        <Sparkles className="w-3.5 h-3.5" />
        Ask Claude
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-full max-w-sm bg-fd-background border-l flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-fd-primary" />
                Ask Claude about {pageTitle}
              </div>
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-fd-muted">
                <X className="w-4 h-4" />
              </button>
            </div>

            {messages.length === 0 && (
              <div className="flex flex-col gap-2 px-4 pt-4">
                <span className="text-[10px] uppercase tracking-wide text-fd-muted-foreground">
                  Quick questions
                </span>
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-left text-xs border rounded-md px-3 py-2 hover:bg-fd-muted transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
             {messages.map((m, i) => (
 <div
  key={i}
  className={`max-w-[90%] rounded-lg px-3 py-2 text-sm ${
    m.role === 'user'
      ? 'self-end bg-fd-primary/10 border border-fd-primary/20'
      : 'self-start bg-fd-muted'
  }`}
>
  {m.role === 'assistant' ? formatMarkdown(m.content) : m.content}
</div>
))}
              {loading && (
                <div className="self-start bg-fd-muted rounded-lg px-3 py-2 text-sm text-fd-muted-foreground">
                  Thinking…
                </div>
              )}
            </div>

            <div className="flex gap-2 p-3 border-t">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send(input)}
                placeholder={`Ask anything about ${pageTitle}…`}
                className="flex-1 bg-fd-muted border rounded-md px-3 py-2 text-sm outline-none focus:border-fd-primary"
              />
              <button
                onClick={() => send(input)}
                disabled={loading}
                className="p-2 rounded-md bg-fd-primary text-fd-primary-foreground disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}