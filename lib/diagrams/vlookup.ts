import type { DiagramSpec } from './types';

export const vlookup: DiagramSpec = {
  title: 'VLOOKUP finds “Widget” in the first column of A2:C7 and returns its price, 4.50, from column 3',
  formula: '=VLOOKUP(E2, A2:C7, 3, FALSE)',
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
    { name: 'table_array', ref: 'A2:C7', color: 'red', badgeAt: 'A4', note: 'VLOOKUP searches the first column of A2:C7 (column A) and finds a match in row 4.' },
    { name: 'col_index_num = 3', ref: 'C2:C7', color: 'purple', badgeAt: 'C4', badgeSide: 'left', note: '3 means the 3rd column of table_array — column C — which is where the result comes from.' },
  ],
  match: 'A4:C4',
  result: { ref: 'F2', note: 'F2 returns 4.50. With no match (and range_lookup FALSE), it would return #N/A.' },
  arrow: { from: 'C4', to: 'F2' },
};
