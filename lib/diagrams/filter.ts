import type { DiagramSpec } from './types';

export const filterFn: DiagramSpec = {
  title: 'FILTER spills every row where Region (B2:B6) is “West” — Bolt, Widget, and Valve — into E2:G4',
  formula: '=FILTER(A2:C6, B2:B6="West")',
  formulaCell: 'E2',
  columns: [{ width: 90 }, { width: 80 }, { width: 80 }, { width: 30 }, { width: 90 }, { width: 80 }, { width: 80 }],
  rows: [
    ['Product', 'Region', 'Amount', null, 'Product', 'Region', 'Amount'],
    ['Bolt', 'West', 420, null, 'Bolt', 'West', 420],
    ['Gasket', 'East', 180, null, 'Widget', 'West', 610],
    ['Widget', 'West', 610, null, 'Valve', 'West', 275],
    ['Bearing', 'North', 90],
    ['Valve', 'West', 275],
  ],
  args: [
    { name: 'array', ref: 'A2:C6', color: 'blue', note: 'A2:C6 is the full source table FILTER pulls matching rows from.' },
    { name: 'include', ref: 'B2:B6', color: 'red', badgeAt: 'B2', note: 'B2:B6 is tested against “West” — TRUE for Bolt, Widget, and Valve.' },
  ],
  result: { ref: 'E2:G4', note: 'Three rows have Region = “West”, so FILTER spills exactly those rows into E2:G4 — compacted, with no gaps for the rows that didn’t match.' },
  arrow: { from: 'B2:B6', to: 'E2:G4' },
};
