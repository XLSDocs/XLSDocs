import type { DiagramSpec } from './types';
import { xlookup } from './xlookup';
import { vlookup } from './vlookup';
import { hlookup } from './hlookup';
import { indexMatch } from './index-match';

/** Keyed by lowercase function name. Add one line per new spec file. */
export const diagrams: Record<string, DiagramSpec> = {
  xlookup,
  vlookup,
  hlookup,
  'index-match': indexMatch,
};
