import type { DiagramSpec } from './types';

export const averageifs: DiagramSpec = {
  title: 'AVERAGEIFS averages the Amount in C2:C6 for rows where Region (A2:A6) is "West" and Quarter (B2:B6) is "Q4"',
  formula: '=AVERAGEIFS(C2:C6, A2:A6, E2, B2:B6, F2)',
  formulaCell: 'G2',
  columns: [
    { width: 100 },
    { width: 90 },
    { width: 90 },
    { width: 30 },
    { width: 90 },
    { width: 90 },
    { width: 90 },
  ],
  rows: [
    ['Region', 'Quarter', 'Amount', null, 'Region', 'Quarter', 'Average'],
    ['West', 'Q4', '1200', null, 'West', 'Q4', '900'],
    ['West', 'Q4', '600'],
    ['East', 'Q4', '800'],
    ['West', 'Q3', '950'],
    ['North', 'Q4', '400'],
  ],
  args: [
    { name: 'average_range', ref: 'C2:C6', color: 'blue', badgeSide: 'left', note: 'C2:C6 holds the amounts AVERAGEIFS might average.' },
    { name: 'criteria_range1', ref: 'A2:A6', color: 'red', note: 'A2:A6 is checked against E2 — the row’s Region must be "West".' },
    { name: 'criteria1', ref: 'E2', color: 'purple', note: 'E2 holds the first condition’s value: "West".' },
    { name: 'criteria_range2', ref: 'B2:B6', color: 'amber', note: 'B2:B6 is checked against F2 — the row’s Quarter must be "Q4".' },
    { name: 'criteria2', ref: 'F2', color: 'teal', note: 'F2 holds the second condition’s value: "Q4".' },
  ],
  match: 'A2:C3',
  result: { ref: 'G2', note: 'Only rows 2 and 3 match both conditions. G2 averages their Amounts: (1200 + 600) / 2 = 900.' },
  arrow: { from: 'C2:C3', to: 'G2' },
};
