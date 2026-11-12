// Classic 5x7 LED dot-matrix glyphs. Only digits and "+" are needed —
// every stat this renders is a plain number, no letters.
const FONT: Record<string, string[]> = {
  '0': ['.###.', '#...#', '#..##', '#.#.#', '##..#', '#...#', '.###.'],
  '1': ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  '2': ['.###.', '#...#', '....#', '...#.', '..#..', '.#...', '#####'],
  '3': ['.###.', '#...#', '....#', '..##.', '....#', '#...#', '.###.'],
  '4': ['...#.', '..##.', '.#.#.', '#..#.', '#####', '...#.', '...#.'],
  '5': ['#####', '#....', '#....', '####.', '....#', '#...#', '.###.'],
  '6': ['..##.', '.#...', '#....', '####.', '#...#', '#...#', '.###.'],
  '7': ['#####', '....#', '...#.', '..#..', '.#...', '.#...', '.#...'],
  '8': ['.###.', '#...#', '#...#', '.###.', '#...#', '#...#', '.###.'],
  '9': ['.###.', '#...#', '#...#', '.####', '....#', '...#.', '.##..'],
  '+': ['.....', '..#..', '..#..', '#####', '..#..', '..#..', '.....'],
};

export const GLYPH_ROWS = 7;
export const GLYPH_COLS = 5;
const GAP = 1;

/**
 * Lays out `text` (digits and "+" only) as a boolean grid, left-padded with
 * `padLeft` blank columns and centered vertically in `totalRows`.
 */
export function textToDotGrid(
  text: string,
  totalRows: number,
): boolean[][] {
  const chars = [...text].map((c) => FONT[c] ?? FONT['0']);
  const width = chars.length * GLYPH_COLS + (chars.length - 1) * GAP;
  const rowOffset = Math.floor((totalRows - GLYPH_ROWS) / 2);

  const grid: boolean[][] = Array.from({ length: totalRows }, () =>
    Array.from({ length: width }, () => false),
  );

  chars.forEach((glyph, ci) => {
    const colOffset = ci * (GLYPH_COLS + GAP);
    glyph.forEach((rowStr, r) => {
      const row = rowOffset + r;
      if (row < 0 || row >= totalRows) return;
      [...rowStr].forEach((ch, c) => {
        if (ch === '#') grid[row][colOffset + c] = true;
      });
    });
  });

  return grid;
}
