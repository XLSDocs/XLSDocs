export type RuleType =
  | 'dropdownList'
  | 'dropdownRange'
  | 'dependentDropdown'
  | 'wholeNumber'
  | 'decimal'
  | 'dateRange'
  | 'textLength'
  | 'preventDuplicates';

export interface DataValidationOptions {
  ruleType: RuleType;
  listItems: string;
  listRange: string;
  triggerCell: string;
  min: string;
  max: string;
  startDate: string;
  endDate: string;
  maxLength: string;
  range: string;
}

export const DEFAULT_DV_OPTIONS: DataValidationOptions = {
  ruleType: 'dropdownList',
  listItems: 'Yes, No, Maybe',
  listRange: 'Lists!$A$2:$A$10',
  triggerCell: 'B2',
  min: '1',
  max: '100',
  startDate: '1/1/2027',
  endDate: '12/31/2027',
  maxLength: '50',
  range: 'A2:A100',
};

export interface DataValidationField {
  label: string;
  value: string;
}

export interface DataValidationResult {
  allow: string;
  fields: DataValidationField[];
  note: string;
}

function firstCell(range: string): string | null {
  const first = range.split(':')[0]?.trim().toUpperCase();
  return /^[A-Z]+\d+$/.test(first ?? '') ? first! : null;
}

export function buildDataValidation(opts: DataValidationOptions): DataValidationResult | null {
  switch (opts.ruleType) {
    case 'dropdownList': {
      const items = opts.listItems
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (items.length === 0) return null;
      return {
        allow: 'List',
        fields: [{ label: 'Source', value: items.join(',') }],
        note: 'Type the Source value exactly as shown (commas, no spaces after them) directly into the Source box — no range or formula needed.',
      };
    }
    case 'dropdownRange': {
      if (!opts.listRange.trim()) return null;
      return {
        allow: 'List',
        fields: [{ label: 'Source', value: `=${opts.listRange.trim()}` }],
        note: 'References an existing list elsewhere in the workbook — add or remove items from that range and the dropdown updates automatically, with nothing to edit here.',
      };
    }
    case 'dependentDropdown': {
      const cell = opts.triggerCell.trim().toUpperCase();
      if (!/^[A-Z]+\d+$/.test(cell)) return null;
      return {
        allow: 'List',
        fields: [{ label: 'Source', value: `=INDIRECT($${cell})` }],
        note: `Requires a named range for every possible value of ${cell} (Formulas → Name Manager), spelled exactly the same — "Fruit" the cell value needs a named range literally called Fruit. Named ranges can't contain spaces, so a category like "Dairy Products" needs an underscore (Dairy_Products) in both the named range and the source list's header.`,
      };
    }
    case 'wholeNumber':
    case 'decimal': {
      const min = opts.min.trim();
      const max = opts.max.trim();
      if (!min || !max) return null;
      return {
        allow: opts.ruleType === 'wholeNumber' ? 'Whole number' : 'Decimal',
        fields: [
          { label: 'Data', value: 'between' },
          { label: 'Minimum', value: min },
          { label: 'Maximum', value: max },
        ],
        note:
          opts.ruleType === 'wholeNumber'
            ? `Only accepts a whole number from ${min} to ${max}, inclusive — a decimal like 5.5 is rejected just like text or an out-of-range value.`
            : `Only accepts a number from ${min} to ${max}, inclusive, decimals included. Text and out-of-range values are rejected on entry.`,
      };
    }
    case 'dateRange': {
      const start = opts.startDate.trim();
      const end = opts.endDate.trim();
      if (!start || !end) return null;
      return {
        allow: 'Date',
        fields: [
          { label: 'Data', value: 'between' },
          { label: 'Start date', value: start },
          { label: 'End date', value: end },
        ],
        note: `Only accepts a date from ${start} to ${end}, inclusive. Typing a date outside the range, or anything that isn't a real date, is rejected.`,
      };
    }
    case 'textLength': {
      const max = opts.maxLength.trim();
      if (!max) return null;
      return {
        allow: 'Text length',
        fields: [
          { label: 'Data', value: 'less than or equal to' },
          { label: 'Maximum', value: max },
        ],
        note: `Rejects any entry longer than ${max} characters — doesn't restrict the content itself, just the length.`,
      };
    }
    case 'preventDuplicates': {
      const cell = firstCell(opts.range);
      if (!cell) return null;
      const colRow = /^([A-Z]+)(\d+)$/.exec(cell)!;
      const col = colRow[1];
      const lastRow = opts.range.split(':')[1]?.trim().toUpperCase().match(/\d+$/)?.[0] ?? colRow[2];
      const abs = `$${col}$${colRow[2]}:$${col}$${lastRow}`;
      return {
        allow: 'Custom',
        fields: [{ label: 'Formula', value: `=COUNTIF(${abs},${cell})=1` }],
        note: 'Blocks a new entry if the exact same value already exists anywhere in the range — applied to the whole range at once, with the first cell as the anchor (Excel adjusts it per cell automatically).',
      };
    }
  }
}
