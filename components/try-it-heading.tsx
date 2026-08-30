import { FlaskConical } from 'lucide-react';
import { Heading } from 'fumadocs-ui/components/heading';

/**
 * Swapped in for the plain markdown `## Try it` heading on every page using
 * the TryIt widget, purely to add a flask icon — reuses fumadocs-ui's own
 * Heading component directly (not a hand-rolled lookalike) so the copy-link
 * button, hover-underline anchor, and `#try-it` id stay byte-for-byte
 * identical to every other heading on the page.
 */
export function TryItHeading() {
  return (
    <Heading as="h2" id="try-it">
      <span className="inline-flex items-center gap-1.5">
        <FlaskConical className="size-[0.85em] text-fd-primary" />
        Try it
      </span>
    </Heading>
  );
}
