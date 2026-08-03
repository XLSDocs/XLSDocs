import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';

const FN_LIST = [
  'XLOOKUP', 'VLOOKUP', 'HLOOKUP', 'INDEX', 'MATCH', 'XMATCH', 'FILTER',
  'SORT', 'SORTBY', 'UNIQUE', 'SEQUENCE', 'SUMIFS', 'SUMIF', 'COUNTIFS',
  'COUNTIF', 'AVERAGEIFS', 'IF', 'IFS', 'IFERROR', 'IFNA', 'SWITCH',
];

function highlightLine(line: string) {
  const nodes: React.ReactNode[] = [];
  let i = 0;
  let key = 0;
  const push = (color: string, text: string, weight?: string) =>
    nodes.push(
      <span key={key++} style={{ color, fontWeight: weight }}>
        {text}
      </span>,
    );

  while (i < line.length) {
    const rest = line.slice(i);
    if (line[i] === '"') {
      const end = line.indexOf('"', i + 1);
      const str = end === -1 ? rest : line.slice(i, end + 1);
      push('var(--excel-string)', str);
      i += str.length;
      continue;
    }
    const fnMatch = FN_LIST.find((fn) => rest.startsWith(fn) && rest[fn.length] === '(');
    if (fnMatch) {
      push('var(--excel-fn)', fnMatch, '500');
      i += fnMatch.length;
      continue;
    }
    const refMatch = rest.match(/^(\$?[A-Za-z]{1,3}\$?\d+(:\$?[A-Za-z]{1,3}\$?\d+)?|[A-Za-z_]\w*\[[^\]]+\])/);
    if (refMatch && rest[refMatch[0].length] !== '(') {
      push('var(--excel-ref)', refMatch[0]);
      i += refMatch[0].length;
      continue;
    }
    const numMatch = rest.match(/^-?\d+(\.\d+)?/);
    if (numMatch) {
      push('var(--excel-number)', numMatch[0]);
      i += numMatch[0].length;
      continue;
    }
    if ('()'.includes(line[i]) || '<>=!&,;'.includes(line[i])) {
      push('var(--excel-punct)', line[i]);
      i++;
      continue;
    }
    nodes.push(line[i]);
    i++;
  }
  return nodes;
}

export function ExcelCode({ children }: { children: string }) {
  const lines = children.split('\n');
  const showLineNumbers = lines.length > 1;

  return (
    <CodeBlock>
      <Pre>
        <code className="font-mono text-[13px] leading-relaxed">
          {lines.map((line, i) => (
            <div key={i} className={`px-4 ${showLineNumbers ? 'flex gap-4' : ''}`}>
              {showLineNumbers && (
                <span className="w-4 shrink-0 text-right text-fd-muted-foreground/60 select-none">
                  {i + 1}
                </span>
              )}
              <span>{highlightLine(line)}</span>
            </div>
          ))}
        </code>
      </Pre>
    </CodeBlock>
  );
}