'use client';

import { useState, useMemo } from 'react';

interface TryItProps {
  data: Record<string, string>;
  defaultValue?: string;
  label?: string;
  fieldLabel?: string;
}

export function TryIt({ data, defaultValue = '', label = 'Live preview', fieldLabel = 'lookup_value' }: TryItProps) {
  const [value, setValue] = useState(defaultValue);

  const result = useMemo(() => {
    const match = data[value.trim().toLowerCase()];
    return match ?? '#N/A';
  }, [value, data]);

  const found = result !== '#N/A';
  const tryValues = Object.keys(data)
    .map((k) => k.charAt(0).toUpperCase() + k.slice(1))
    .join(', ');

  return (
    <div className="not-prose rounded-xl border bg-fd-card overflow-hidden my-4">
      <div className="flex items-center gap-2 px-3.5 py-2 bg-fd-muted border-b text-[11px] font-mono uppercase tracking-wider text-fd-muted-foreground">
        <span className="w-1.5 h-1.5 rounded-full bg-fd-primary" />
        {label}
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div className="grid grid-cols-[110px_1fr] items-center gap-2">
          <span className="font-mono text-xs text-fd-primary">{fieldLabel}</span>
          <input
            className="bg-fd-muted border rounded px-2.5 py-1.5 font-mono text-xs outline-none focus:border-fd-primary"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <p className="pl-[118px] text-[11px] text-fd-muted-foreground">
          Edit the field above — try {tryValues}
        </p>
        <div className="grid grid-cols-[110px_1fr] items-center gap-2 border-t pt-2.5 mt-1">
          <span className="font-mono text-[10px] uppercase tracking-wide text-fd-muted-foreground">
            Result
          </span>
          <span className={`font-mono text-sm ${found ? 'text-fd-primary' : 'text-red-400'}`}>
            {result}
          </span>
        </div>
      </div>
    </div>
  );
}
