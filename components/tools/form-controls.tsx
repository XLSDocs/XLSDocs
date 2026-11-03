'use client';

import type { ReactNode } from 'react';

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-fd-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

export function PillGroup<T extends string>({
  value,
  options,
  labels,
  onChange,
}: {
  value: T;
  options: readonly T[];
  labels: Record<T, string>;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
            value === opt
              ? 'border-fd-primary bg-fd-primary/10 text-fd-primary'
              : 'border-fd-border bg-fd-card text-fd-muted-foreground hover:border-fd-primary/50 hover:text-fd-foreground'
          }`}
        >
          {labels[opt]}
        </button>
      ))}
    </div>
  );
}

export function Select<T extends string>({
  value,
  options,
  labels,
  onChange,
}: {
  value: T;
  options: readonly T[];
  labels: Record<T, string>;
  onChange: (v: T) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="w-full rounded-lg border border-fd-border bg-fd-card px-3 py-2 text-sm outline-none focus:border-fd-primary"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {labels[opt]}
        </option>
      ))}
    </select>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  maxLength,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(maxLength ? e.target.value.slice(0, maxLength) : e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-fd-border bg-fd-card px-3 py-2 text-sm outline-none placeholder:text-fd-muted-foreground focus:border-fd-primary"
    />
  );
}
