import type { DiagramSpec } from './types';

export const averageif: DiagramSpec = {
  title: 'AVERAGEIF averages the Amount in B2:B6 for rows where Region (A2:A6) is "West"',
  formula: '=AVERAGEIF(A2:A6, D2, B2:B6)',
  formulaCell: 'E2',
  columns: [{ width: 100 }, { width: 90 }, { width: 30 }, { width: 90 }, { width: 90 }],
  rows: [
    ['Region', 'Amount', null, 'Region', 'Average'],
    ['West', '1200', null, 'West', '1000'],
    ['West', '1000'],
    ['West', '800'],
    ['East', '700'],
    ['North', '500'],
  ],
  args: [
    { name: 'range', ref: 'A2:A6', color: 'red', note: 'A2:A6 is checked against D2 — must equal "West".' },
    { name: 'criteria', ref: 'D2', color: 'purple', note: 'D2 holds the condition’s value: "West".' },
    { name: 'average_range', ref: 'B2:B6', color: 'blue', badgeSide: 'left', note: 'B2:B6 holds the amounts AVERAGEIF might average — notice it’s last and optional, unlike AVERAGEIFS.' },
  ],
  match: 'A2:B4',
  result: { ref: 'E2', note: 'Rows 2–4 match ("West"). E2 averages their Amounts: (1200 + 1000 + 800) / 3 = 1000.' },
  arrow: { from: 'B2:B4', to: 'E2' },
};
