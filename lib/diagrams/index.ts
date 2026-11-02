import type { DiagramSpec } from './types';
import { xlookup } from './xlookup';
import { vlookup } from './vlookup';
import { hlookup } from './hlookup';
import { indexMatch } from './index-match';
import { sumifs } from './sumifs';
import { countifs } from './countifs';
import { averageifs } from './averageifs';
import { sumif } from './sumif';
import { countif } from './countif';
import { averageif } from './averageif';
import { maxifs } from './maxifs';
import { minifs } from './minifs';

/** Keyed by lowercase function name. Add one line per new spec file. */
export const diagrams: Record<string, DiagramSpec> = {
  xlookup,
  vlookup,
  hlookup,
  'index-match': indexMatch,
  sumifs,
  countifs,
  averageifs,
  sumif,
  countif,
  averageif,
  maxifs,
  minifs,
};
