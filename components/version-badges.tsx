export interface CompatibilityItem {
  label: string;
  supported: boolean;
}

/**
 * Compact pill row shown next to the page title — derived from the same
 * `compatibility` data as the full <Compatibility> table further down the
 * page, so there's one source of truth per function instead of two.
 */
export function VersionBadges({ items }: { items: CompatibilityItem[] }) {
  const supported = items.filter((item) => item.supported);
  const allSupported = supported.length === items.length;

  const badges = allSupported
    ? ['All versions']
    : supported.map((item) => (item.label === 'Web' ? 'Excel Web' : `Excel ${item.label}`));

  if (badges.length === 0) return null;

  return (
    <div className="not-prose flex flex-wrap gap-1.5">
      {badges.map((badge) => (
        <span
          key={badge}
          className="rounded-full border border-fd-primary/30 bg-fd-primary/10 px-2.5 py-0.5 text-xs font-medium text-fd-primary"
        >
          {badge}
        </span>
      ))}
    </div>
  );
}
