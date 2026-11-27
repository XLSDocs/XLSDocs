import type { DiagramSpec } from './types';

export const textjoin: DiagramSpec = {
  title: 'TEXTJOIN joins A2:A5 with ", " between each item, skipping the blank at A4',
  formula: '=TEXTJOIN(", ", TRUE, A2:A5)',
  formulaCell: 'C2',
  columns: [{ width: 90 }, { width: 30 }, { width: 220 }],
  rows: [
    ['Ingredient', null, 'Result'],
    ['Flour', null, 'Flour, Sugar, Eggs'],
    ['Sugar'],
    [null],
    ['Eggs'],
  ],
  args: [
    { name: 'text1', ref: 'A2:A5', color: 'blue', note: 'A2:A5 holds 4 cells, including one blank at A4.' },
  ],
  result: { ref: 'C2', note: 'TRUE for ignore_empty skips the blank A4 instead of adding an extra separator — joining just Flour, Sugar, and Eggs with ", " between each.' },
  arrow: { from: 'A2:A5', to: 'C2' },
};
