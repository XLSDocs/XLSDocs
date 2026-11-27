import type { DiagramSpec } from './types';

export const unique: DiagramSpec = {
  title: 'UNIQUE pulls the 3 distinct values — West, East, North — out of 6 rows with repeats, into C2:C4',
  formula: '=UNIQUE(A2:A7)',
  formulaCell: 'C2',
  columns: [{ width: 90 }, { width: 30 }, { width: 90 }],
  rows: [
    ['Region', null, 'Region'],
    ['West', null, 'West'],
    ['East', null, 'East'],
    ['West', null, 'North'],
    ['North'],
    ['East'],
    ['West'],
  ],
  args: [
    { name: 'array', ref: 'A2:A7', color: 'blue', note: 'A2:A7 has 6 values, with West and East each repeated.' },
  ],
  result: { ref: 'C2:C4', note: 'UNIQUE keeps the first occurrence of each value — West, East, North — and drops every repeat, spilling just the 3 distinct values into C2:C4.' },
  arrow: { from: 'A2:A7', to: 'C2:C4' },
};
