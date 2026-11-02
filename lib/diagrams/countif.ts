import type { DiagramSpec } from './types';

export const countif: DiagramSpec = {
  title: 'COUNTIF counts rows in A2:A6 where Region is "West"',
  formula: '=COUNTIF(A2:A6, C2)',
  formulaCell: 'D2',
  columns: [{ width: 100 }, { width: 30 }, { width: 90 }, { width: 80 }],
  rows: [
    ['Region', null, 'Region', 'Count'],
    ['West', null, 'West', '3'],
    ['West'],
    ['West'],
    ['East'],
    ['North'],
  ],
  args: [
    { name: 'range', ref: 'A2:A6', color: 'red', note: 'A2:A6 is checked against C2 — must equal "West".' },
    { name: 'criteria', ref: 'C2', color: 'purple', note: 'C2 holds the condition’s value: "West".' },
  ],
  match: 'A2:A4',
  result: { ref: 'D2', note: 'Rows 2–4 match ("West"). D2 counts them: 3.' },
  arrow: { from: 'A2:A4', to: 'D2' },
};
