// fumadocs-ui/og's generate() renders the title at a fixed 82px and the
// description at a fixed 52px with no max-height, overflow, or line
// clamping of its own — a long enough title+description combo simply
// overlaps the row below it instead of shrinking or wrapping safely.
// Truncating what gets passed in is the only lever available without
// forking that component. These limits were picked empirically: tested
// against the actual longest title (82 chars) and description (252
// chars) on the site and adjusted until neither one overlapped at 1200x630.
export function truncateOgText(text: string, maxChars: number): string {
  const clean = text.trim();
  if (clean.length <= maxChars) return clean;
  const sliced = clean.slice(0, maxChars - 1);
  // Cut at the last word boundary within the slice instead of mid-word
  // ("...using mult..." for "multiple") — falls back to the hard cut only
  // if there's no space at all (one absurdly long first word).
  const lastSpace = sliced.lastIndexOf(' ');
  const safe = lastSpace > 0 ? sliced.slice(0, lastSpace) : sliced;
  return `${safe.trimEnd()}…`;
}

export const OG_TITLE_MAX = 34;
export const OG_DESCRIPTION_MAX = 55;
