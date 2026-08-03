import { ExcelCode } from './excel-code';

interface ExampleCardProps {
  number: string;
  label: string;
  formula: string;
  children: React.ReactNode;
}

export function ExampleCard({ number, label, formula, children }: ExampleCardProps) {
  return (
    <div className="not-prose rounded-xl border bg-fd-card overflow-hidden my-4">
      <div className="flex items-center justify-between px-4 py-2 border-b text-[11px] font-mono uppercase tracking-wider text-fd-muted-foreground">
        <span>{number}</span>
        <span className="truncate pl-4">{label}</span>
      </div>
      <div className="px-4 pt-2">
        <ExcelCode>{formula}</ExcelCode>
      </div>
      <div className="px-4 pb-4 -mt-2 text-sm text-fd-muted-foreground">{children}</div>
    </div>
  );
}
