import type { DiagramSpec } from './types';

export const sortFn: DiagramSpec = {
  title: 'SORT reorders A2:B6 by Amount (column 2) descending, spilling into D2:E6',
  formula: '=SORT(A2:B6, 2, -1)',
  formulaCell: 'D2',
  columns: [{ width: 90 }, { width: 70, align: 'right' }, { width: 30 }, { width: 90 }, { width: 70, align: 'right' }],
  rows: [
    ['Product', 'Amount', null, 'Product', 'Amount'],
    ['Bolt', 420, null, 'Widget', 610],
    ['Gasket', 180, null, 'Bolt', 420],
    ['Widget', 610, null, 'Valve', 275],
    ['Bearing', 90, null, 'Gasket', 180],
    ['Valve', 275, null, 'Bearing', 90],
  ],
  args: [
    { name: 'array', ref: 'A2:B6', color: 'blue', note: 'A2:B6 is the unsorted source table.' },
  ],
  result: { ref: 'D2:E6', note: 'sort_index 2 sorts by Amount instead of Product, and sort_order -1 reverses it to descending: 610, 420, 275, 180, 90.' },
  arrow: { from: 'A2:B6', to: 'D2:E6' },
};
