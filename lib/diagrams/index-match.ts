import type { DiagramSpec } from './types';

export const indexMatch: DiagramSpec = {
  title: 'INDEX and MATCH together find “Widget” in A2:A7 and return its price, 4.50, from C2:C7',
  formula: '=INDEX(C2:C7, MATCH(E2, A2:A7, 0))',
  formulaCell: 'F2',
  columns: [{ width: 130 }, { width: 120 }, { width: 100 }, { width: 40 }, { width: 130 }, { width: 130 }],
  rows: [
    ['Product', 'Category', 'Price', null, 'Lookup', 'Result'],
    ['Bolt', 'Hardware', '0.25', null, 'Widget', '4.50'],
    ['Gasket', 'Seals', '1.80'],
    ['Widget', 'Parts', '4.50'],
    ['Bearing', 'Parts', '12.75'],
    ['Valve', 'Fluid', '22.00'],
    ['Hose', 'Fluid', '8.40'],
  ],
  args: [
    { name: 'lookup_value (in MATCH)', ref: 'E2', color: 'blue', note: 'E2 holds the value to find: “Widget”.' },
    { name: 'lookup_array (in MATCH)', ref: 'A2:A7', color: 'red', badgeAt: 'A4', note: 'MATCH searches A2:A7 and finds “Widget” at position 3.' },
    { name: 'array (in INDEX)', ref: 'C2:C7', color: 'purple', badgeAt: 'C4', badgeSide: 'left', note: 'INDEX returns the 3rd item of C2:C7 — the same position MATCH found — which is row 4: 4.50.' },
  ],
  match: 'A4:C4',
  result: { ref: 'F2', note: 'F2 returns 4.50. With no match, MATCH would return #N/A, and INDEX would pass it through unchanged.' },
  arrow: { from: 'C4', to: 'F2' },
};
