import type { DiagramSpec } from './types';

export const hlookup: DiagramSpec = {
  title: 'HLOOKUP finds “Q3” in the first row of A1:D2 and returns the revenue, $47,200, from row 2',
  formula: '=HLOOKUP(F1, A1:D2, 2, FALSE)',
  formulaCell: 'G1',
  columns: [{ width: 90 }, { width: 90 }, { width: 90 }, { width: 90 }, { width: 40 }, { width: 110 }, { width: 110 }],
  rows: [
    ['Q1', 'Q2', 'Q3', 'Q4', null, 'Q3', '$47,200'],
    ['$42,000', '$51,500', '$47,200', '$63,900'],
  ],
  args: [
    { name: 'lookup_value', ref: 'F1', color: 'blue', note: 'F1 holds the value to find: “Q3”.' },
    { name: 'table_array', ref: 'A1:D2', color: 'red', badgeAt: 'C1', note: 'HLOOKUP searches the first row of A1:D2 and finds a match in column C.' },
    { name: 'row_index_num = 2', ref: 'A2:D2', color: 'purple', badgeAt: 'C2', badgeSide: 'left', note: '2 means the 2nd row of table_array — row 2 — which is where the result comes from.' },
  ],
  match: 'C1:C2',
  result: { ref: 'G1', note: 'G1 returns $47,200. With no match (and range_lookup FALSE), it would return #N/A.' },
  arrow: { from: 'C2', to: 'G1' },
};
