import type { DiagramSpec } from './types';

export const xmatch: DiagramSpec = {
  title: 'XMATCH finds “Widget” in A2:A6 and returns its position, 3',
  formula: '=XMATCH(C2, A2:A6)',
  formulaCell: 'D2',
  columns: [{ width: 140 }, { width: 30 }, { width: 120 }, { width: 110 }],
  rows: [
    ['Product', null, 'Lookup', 'Position'],
    ['Bolt', null, 'Widget', 3],
    ['Gasket'],
    ['Widget'],
    ['Bearing'],
    ['Valve'],
  ],
  args: [
    { name: 'lookup_value', ref: 'C2', color: 'blue', note: 'C2 holds the value to find: “Widget”.' },
    { name: 'lookup_array', ref: 'A2:A6', color: 'red', badgeAt: 'A4', note: 'XMATCH scans A2:A6 and finds “Widget” at the 3rd position.' },
  ],
  match: 'A4',
  result: { ref: 'D2', note: 'D2 returns 3 — the position of “Widget” within A2:A6, not the value itself. With no match, XMATCH would return #N/A.' },
  arrow: { from: 'A4', to: 'D2' },
};
