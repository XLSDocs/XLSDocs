import { ExcelCode } from './excel-code';

export interface QuickAnswerFact {
  text: string;
  type?: 'check' | 'warn';
}

export interface QuickAnswerMigration {
  prompt: string;
  from: string;
  to: string;
  explanation: string;
}

interface QuickAnswerProps {
  formula: string;
  facts: QuickAnswerFact[];
  migration?: QuickAnswerMigration;
}

export function QuickAnswer({ formula, facts, migration }: QuickAnswerProps) {
  return (
    <div className="not-prose my-4 overflow-hidden rounded-xl border-l-4 border-fd-primary bg-fd-primary/5">
      <div className="p-4">
        <div className="text-xs font-mono font-semibold uppercase tracking-wider text-fd-primary">
          Quick answer
        </div>
        <div className="mt-2">
          <ExcelCode>{formula}</ExcelCode>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {facts.map((fact) => (
            <span
              key={fact.text}
              className={`rounded-full border px-2.5 py-0.5 text-xs ${
                fact.type === 'warn'
                  ? 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'border-fd-primary/30 bg-fd-primary/10 text-fd-primary'
              }`}
            >
              {fact.type === 'warn' ? '⚠ ' : '✓ '}
              {fact.text}
            </span>
          ))}
        </div>
      </div>
      {migration && (
        <div className="border-t border-fd-primary/20 bg-fd-primary/10 p-4">
          <p className="text-sm font-medium">{migration.prompt}</p>
          <div className="mt-2 space-y-1 font-mono text-xs">
            <div className="text-fd-muted-foreground line-through decoration-red-500/60">
              {migration.from}
            </div>
            <div className="text-fd-foreground">{migration.to}</div>
          </div>
          <p className="mt-2 text-xs text-fd-muted-foreground">{migration.explanation}</p>
        </div>
      )}
    </div>
  );
}
