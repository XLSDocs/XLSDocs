import type { DiagramSpec } from './types';

export const countifs: DiagramSpec = {
  title: 'COUNTIFS counts rows where Region (A2:A6) is "West" and Status (B2:B6) is "Paid"',
  formula: '=COUNTIFS(A2:A6, D2, B2:B6, E2)',
  formulaCell: 'F2',
  columns: [{ width: 100 }, { width: 90 }, { width: 30 }, { width: 90 }, { width: 90 }, { width: 80 }],
  rows: [
    ['Region', 'Status', null, 'Region', 'Status', 'Count'],
    ['West', 'Paid', null, 'West', 'Paid', '2'],
    ['West', 'Paid'],
    ['East', 'Paid'],
    ['West', 'Pending'],
    ['North', 'Paid'],
  ],
  args: [
    { name: 'criteria_range1', ref: 'A2:A6', color: 'red', note: 'A2:A6 is checked against D2 — the row’s Region must be "West".' },
    { name: 'criteria1', ref: 'D2', color: 'purple', note: 'D2 holds the first condition’s value: "West".' },
    { name: 'criteria_range2', ref: 'B2:B6', color: 'amber', note: 'B2:B6 is checked against E2 — the row’s Status must be "Paid".' },
    { name: 'criteria2', ref: 'E2', color: 'teal', note: 'E2 holds the second condition’s value: "Paid".' },
  ],
  match: 'A2:B3',
  result: { ref: 'F2', note: 'Only rows 2 and 3 match both conditions. F2 counts them: 2.' },
  arrow: { from: 'B2:B3', to: 'F2' },
};
