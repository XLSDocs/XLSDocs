interface CompatibilityProps {
  items: { label: string; supported: boolean }[];
}

export function Compatibility({ items }: CompatibilityProps) {
  return (
    <div className="not-prose grid grid-cols-5 gap-2 my-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border bg-fd-card flex flex-col items-center gap-2 py-4"
        >
          <span className="text-xs font-mono uppercase tracking-wider text-fd-muted-foreground">
            {item.label}
          </span>
          <span
            className={`text-lg ${item.supported ? 'text-fd-primary' : 'text-fd-muted-foreground'}`}
          >
            {item.supported ? '✓' : '✕'}
          </span>
        </div>
      ))}
    </div>
  );
}
