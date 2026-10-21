import type { DiagramSpec } from './types';

export const xlookup: DiagramSpec = {
  title: 'XLOOKUP finds “Widget” in A2:A7 and returns its price, 4.50, from C2:C7',
  formula: '=XLOOKUP(E2, A2:A7, C2:C7, "Not found")',
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
    { name: 'lookup_value', ref: 'E2', color: 'blue', note: 'E2 holds the value to find: “Widget”.' },
    { name: 'lookup_array', ref: 'A2:A7', color: 'red', badgeAt: 'A4', note: 'XLOOKUP scans A2:A7 and finds a match in row 4.' },
    { name: 'return_array', ref: 'C2:C7', color: 'purple', badgeAt: 'C4', badgeSide: 'left', note: 'It takes the value from the same position in C2:C7.' },
  ],
  match: 'A4:C4',
  result: { ref: 'F2', note: 'F2 returns 4.50. With no match, it would show “Not found”.' },
  arrow: { from: 'C4', to: 'F2' },
};
