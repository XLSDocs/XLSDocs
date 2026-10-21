import type { DiagramSpec } from './types';
import { xlookup } from './xlookup';

/** Keyed by lowercase function name. Add one line per new spec file. */
export const diagrams: Record<string, DiagramSpec> = {
  xlookup,
};
