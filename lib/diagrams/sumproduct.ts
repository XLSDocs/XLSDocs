import type { DiagramSpec } from './types';

export const sumproduct: DiagramSpec = {
  title: 'SUMPRODUCT multiplies Qty (B2:B6) by Price (C2:C6) row by row, then adds all five products together',
  formula: '=SUMPRODUCT(B2:B6, C2:C6)',
  formulaCell: 'E2',
  columns: [{ width: 100 }, { width: 70 }, { width: 80 }, { width: 30 }, { width: 150 }],
  rows: [
    ['Item', 'Qty', 'Price', null, 'Total Revenue'],
    ['Bolt', 40, '0.25', null, 348],
    ['Gasket', 15, '1.80'],
    ['Widget', 22, '4.50'],
    ['Bearing', 8, '12.75'],
    ['Valve', 5, '22.00'],
  ],
  args: [
    { name: 'array1', ref: 'B2:B6', color: 'blue', note: 'B2:B6 holds each item’s quantity.' },
    { name: 'array2', ref: 'C2:C6', color: 'purple', badgeSide: 'left', note: 'C2:C6 holds each item’s price — multiplied with array1 row by row, with no helper column needed.' },
  ],
  result: { ref: 'E2', note: '(40×0.25) + (15×1.80) + (22×4.50) + (8×12.75) + (5×22.00) = 348 — every row’s product added into one total.' },
  arrow: { from: 'C2:C6', to: 'E2' },
};
