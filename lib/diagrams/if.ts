import type { DiagramSpec } from './types';

export const ifFn: DiagramSpec = {
  title: 'IF checks whether B2 is "In Stock" — TRUE returns D2 (250), FALSE would return C2 (400) instead',
  formula: '=IF(B2="In Stock", D2, C2)',
  formulaCell: 'F2',
  columns: [{ width: 110 }, { width: 100 }, { width: 100 }, { width: 90 }, { width: 30 }, { width: 90 }],
  rows: [
    ['Product', 'Status', 'Backorder', 'In Stock', null, 'Result'],
    ['Widget', 'In Stock', '400', '250', null, '250'],
    ['Gasket', 'Backorder', '310', '180'],
    ['Bolt', 'In Stock', '60', '25'],
  ],
  args: [
    { name: 'logical_test', ref: 'B2', color: 'blue', note: 'B2 holds "In Stock" — the test B2="In Stock" evaluates to TRUE.' },
    { name: 'value_if_true', ref: 'D2', color: 'teal', note: 'Since the test is TRUE, IF returns this cell’s value: 250.' },
    { name: 'value_if_false', ref: 'C2', color: 'red', note: 'If B2 held anything else, IF would return this cell (400) instead — not taken here.' },
  ],
  result: { ref: 'F2', note: 'B2 is "In Stock", so F2 returns D2’s value, 250 — not C2’s.' },
  arrow: { from: 'D2', to: 'F2' },
};
