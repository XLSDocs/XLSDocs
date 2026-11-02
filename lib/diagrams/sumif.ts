import type { DiagramSpec } from './types';

export const sumif: DiagramSpec = {
  title: 'SUMIF sums the Amount in B2:B6 for rows where Region (A2:A6) is "West"',
  formula: '=SUMIF(A2:A6, D2, B2:B6)',
  formulaCell: 'E2',
  columns: [{ width: 100 }, { width: 90 }, { width: 30 }, { width: 90 }, { width: 90 }],
  rows: [
    ['Region', 'Amount', null, 'Region', 'Total'],
    ['West', '1200', null, 'West', '2750'],
    ['West', '600'],
    ['West', '950'],
    ['East', '800'],
    ['North', '400'],
  ],
  args: [
    { name: 'range', ref: 'A2:A6', color: 'red', note: 'A2:A6 is checked against D2 — must equal "West".' },
    { name: 'criteria', ref: 'D2', color: 'purple', note: 'D2 holds the condition’s value: "West".' },
    { name: 'sum_range', ref: 'B2:B6', color: 'blue', badgeSide: 'left', note: 'B2:B6 holds the amounts SUMIF might add up — notice it’s last and optional, unlike SUMIFS.' },
  ],
  match: 'A2:B4',
  result: { ref: 'E2', note: 'Rows 2–4 match ("West"). E2 sums their Amounts: 1200 + 600 + 950 = 2750.' },
  arrow: { from: 'B2:B4', to: 'E2' },
};
