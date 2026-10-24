interface Shortcut {
  action: string;
  win: string;
  mac: string;
}

export interface ShortcutGroup {
  category: string;
  shortcuts: Shortcut[];
}

function Keys({ combo }: { combo: string }) {
  const keys = combo.split('+');
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      {keys.map((key, i) => (
        <span key={i} className="inline-flex items-center gap-1">
          <kbd className="rounded border border-fd-border bg-fd-muted px-1.5 py-0.5 font-mono text-xs whitespace-nowrap">
            {key}
          </kbd>
          {i < keys.length - 1 && <span className="text-fd-muted-foreground">+</span>}
        </span>
      ))}
    </span>
  );
}

export function ShortcutTable({ groups }: { groups: ShortcutGroup[] }) {
  return (
    <div className="not-prose my-6 flex flex-col gap-6">
      {groups.map((group) => (
        <div key={group.category} className="overflow-hidden rounded-xl border bg-fd-card">
          <div className="border-b px-4 py-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-fd-muted-foreground">
              {group.category}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b text-xs text-fd-muted-foreground">
                  <th className="px-4 py-2 text-left font-medium">Action</th>
                  <th className="px-4 py-2 text-left font-medium">Windows</th>
                  <th className="px-4 py-2 text-left font-medium">Mac</th>
                </tr>
              </thead>
              <tbody>
                {group.shortcuts.map((s) => (
                  <tr key={s.action} className="border-b last:border-b-0 transition-colors hover:bg-fd-primary/5">
                    <td className="px-4 py-3 align-middle">{s.action}</td>
                    <td className="px-4 py-3 align-middle">
                      <Keys combo={s.win} />
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <Keys combo={s.mac} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
