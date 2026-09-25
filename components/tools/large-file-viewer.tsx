'use client';

/**
 * Ported from reference/bigfile-viewer-v0.1.html, a standalone DuckDB-WASM
 * prototype. Behavior is kept exactly the same as that prototype: same
 * virtualization constants (28px rows, 200-row block cache, scaled scrolling
 * past ~8M px), same click-to-sort cycle (ascending -> descending -> original
 * order, NULLS LAST), and the same SQL pattern (__orig/__pos columns, sort by
 * rebuilding the table ordered by __pos, fetch rows with a WHERE __pos range).
 *
 * The row-rendering hot path (every scroll frame) stays imperative — direct
 * innerHTML writes into a ref, not React state/reconciliation — on purpose,
 * matching the original. Recreating a scroll-driven, block-cached virtual
 * grid through React state updates per visible row would be slower and would
 * change the original's actual behavior, not just its implementation.
 *
 * This component must only ever run in the browser: it's loaded by
 * app/(home)/tools/large-file-viewer/page.tsx via next/dynamic with
 * ssr: false, so none of this — including the top-level `import * as duckdb`
 * below — ever executes during the build or on the Cloudflare Worker.
 */

import { useEffect, useRef } from 'react';
import * as duckdb from '@duckdb/duckdb-wasm';
import type { AsyncDuckDB, AsyncDuckDBConnection } from '@duckdb/duckdb-wasm';

const ROW_HEIGHT = 28;
const HEADER_HEIGHT = 38;
const BLOCK_SIZE = 200;
const MAX_SCROLL_PX = 8_000_000;
const MAX_CACHE_BLOCKS = 60;
const NUMERIC_TYPE = /^(TINYINT|SMALLINT|INTEGER|BIGINT|HUGEINT|UTINYINT|USMALLINT|UINTEGER|UBIGINT|FLOAT|DOUBLE|REAL|DECIMAL)/;
const ACCEPTED_EXTENSIONS = ['csv', 'tsv', 'txt', 'parquet'];
const EXCEL_EXTENSIONS = ['xlsx', 'xls', 'xlsm'];

interface ColumnInfo {
  name: string;
  type: string;
  num: boolean;
  width: number;
}

type SortDir = 'ASC' | 'DESC' | null;

interface ViewerState {
  cols: ColumnInfo[];
  rows: number;
  sortCol: number | null;
  sortDir: SortDir;
  gen: number;
  file: string;
  size: number;
  secs: number;
}

const quoteIdent = (name: string) => '"' + name.replace(/"/g, '""') + '"';
const formatCount = (n: number) => n.toLocaleString('en-US');
const formatBytes = (b: number) =>
  b > 1e9 ? (b / 1e9).toFixed(2) + ' GB' : b > 1e6 ? (b / 1e6).toFixed(1) + ' MB' : Math.ceil(b / 1e3) + ' KB';
const escapeHtml = (s: string) => s.replace(/[&<>]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[ch] as string);

export function LargeFileViewer() {
  const dropRef = useRef<HTMLDivElement>(null);
  const gridWrapRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const hdrRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const statusBoxRef = useRef<HTMLDivElement>(null);
  const engineHintRef = useRef<HTMLSpanElement>(null);
  const openBtnRef = useRef<HTMLButtonElement>(null);
  const openBtn2Ref = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let destroyed = false;
    let db: AsyncDuckDB | null = null;
    let conn: AsyncDuckDBConnection | null = null;
    let registeredFile: string | null = null;
    let state: ViewerState | null = null;
    let cache = new Map<number, (string | null)[][]>();
    let inflight = new Set<string>();
    let raf = 0;
    let dragDepth = 0;

    const el = {
      drop: dropRef.current!,
      gridWrap: gridWrapRef.current!,
      scroller: scrollerRef.current!,
      inner: innerRef.current!,
      hdr: hdrRef.current!,
      rows: rowsRef.current!,
      stats: statsRef.current!,
      status: statusRef.current!,
      statusBox: statusBoxRef.current!,
      engineHint: engineHintRef.current!,
      openBtn: openBtnRef.current!,
      openBtn2: openBtn2Ref.current!,
      fileInput: fileInputRef.current!,
    };

    function showStatus(title: string, sub: string, isErr = false) {
      el.statusBox.className = 'rounded-lg border border-fd-border bg-fd-card p-4 min-w-[260px] max-w-[480px]' + (isErr ? ' border-fd-error/40' : '');
      el.statusBox.innerHTML = `<div class="font-medium mb-1${isErr ? ' text-fd-error' : ''}">${
        isErr ? '' : '<span class="mr-2 inline-block size-3 animate-spin rounded-full border-2 border-fd-border border-t-fd-primary align-[-1px]"></span>'
      }${escapeHtml(title)}</div><div class="text-sm text-fd-muted-foreground tabular-nums" id="lfv-status-sub">${escapeHtml(sub || '')}</div>`;
      if (isErr) {
        el.statusBox.insertAdjacentHTML(
          'beforeend',
          '<div class="mt-3"><button type="button" class="rounded-md border border-fd-border px-3 py-1.5 text-sm" id="lfv-dismiss">Dismiss</button></div>',
        );
      }
      el.status.style.display = 'grid';
      if (isErr) {
        const dismiss = el.statusBox.querySelector<HTMLButtonElement>('#lfv-dismiss');
        if (dismiss) dismiss.onclick = hideStatus;
      }
    }
    function hideStatus() {
      el.status.style.display = 'none';
    }

    async function startEngine() {
      const bundle = await duckdb.selectBundle(duckdb.getJsDelivrBundles());
      const workerUrl = URL.createObjectURL(
        new Blob([`importScripts("${bundle.mainWorker}");`], { type: 'text/javascript' }),
      );
      const worker = new Worker(workerUrl);
      const instance = new duckdb.AsyncDuckDB(new duckdb.VoidLogger(), worker);
      await instance.instantiate(bundle.mainModule, bundle.pthreadWorker);
      URL.revokeObjectURL(workerUrl);
      const connection = await instance.connect();
      return { instance, connection };
    }

    const engineReady = startEngine().then(
      ({ instance, connection }) => {
        if (destroyed) {
          connection.close();
          instance.terminate();
          return;
        }
        db = instance;
        conn = connection;
        el.engineHint.textContent = 'Or drag a file anywhere on this page.';
      },
      (e) => {
        el.engineHint.textContent = 'The engine failed to load. Check your connection and reload the page.';
        console.error(e);
        throw e;
      },
    );

    async function loadFile(file: File) {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
      if (EXCEL_EXTENSIONS.includes(ext)) {
        showStatus("Excel files aren't supported yet", 'Save the sheet as CSV from Excel, then open the CSV here.', true);
        return;
      }
      const t0 = performance.now();
      const timer = setInterval(() => {
        const sub = el.statusBox.querySelector('#lfv-status-sub');
        if (sub) sub.textContent = `${file.name} · ${formatBytes(file.size)} · ${((performance.now() - t0) / 1000).toFixed(1)} s`;
      }, 200);
      showStatus('Reading file', `${file.name} · ${formatBytes(file.size)}`);
      try {
        await engineReady;
        if (!db || !conn) throw new Error('Engine failed to start');
        await conn.query('DROP TABLE IF EXISTS data');
        if (registeredFile) {
          try {
            await db.dropFile(registeredFile);
          } catch {
            // file was never registered, or already dropped - nothing to do
          }
        }
        registeredFile = ext === 'parquet' ? 'input.parquet' : 'input.csv';
        await db.registerFileHandle(registeredFile, file, duckdb.DuckDBDataProtocol.BROWSER_FILEREADER, true);
        const reader = ext === 'parquet' ? `read_parquet('${registeredFile}')` : `read_csv_auto('${registeredFile}')`;
        await conn.query(
          `CREATE TABLE data AS SELECT __orig AS __pos, * FROM (SELECT (row_number() OVER ()) - 1 AS __orig, * FROM ${reader})`,
        );
        const desc = (await conn.query('DESCRIBE data')).toArray().map((r) => r.toJSON() as Record<string, string>);
        const countResult = await conn.query('SELECT count(*) FROM data');
        const n = Number(countResult.getChildAt(0)!.get(0));
        const cols: ColumnInfo[] = desc
          .filter((d) => d.column_name !== '__pos' && d.column_name !== '__orig')
          .map((d) => {
            const num = NUMERIC_TYPE.test(d.column_type);
            const width = Math.max(num ? 96 : 120, Math.min(280, d.column_name.length * 8.5 + 40));
            return { name: d.column_name, type: d.column_type, num, width };
          });
        const secs = (performance.now() - t0) / 1000;
        state = { cols, rows: n, sortCol: null, sortDir: null, gen: 0, file: file.name, size: file.size, secs };
        cache.clear();
        inflight.clear();
        buildGrid();
        hideStatus();
      } catch (e) {
        console.error(e);
        const msg = String((e as Error)?.message || e);
        showStatus(
          "Couldn't open this file",
          /memory|OOM|allocat/i.test(msg)
            ? 'The browser ran out of memory. Try a smaller file, close other tabs, or use a Parquet version of the data.'
            : msg.slice(0, 300),
          true,
        );
      } finally {
        clearInterval(timer);
      }
    }

    function renderStats(extra?: string) {
      const s = state!;
      el.stats.innerHTML = `<span><b class="text-fd-foreground font-medium tabular-nums">${formatCount(s.rows)}</b> rows</span><span><b class="text-fd-foreground font-medium tabular-nums">${formatCount(s.cols.length)}</b> columns</span><span>${escapeHtml(s.file)} · ${formatBytes(s.size)}</span><span>loaded in <b class="text-fd-foreground font-medium tabular-nums">${s.secs.toFixed(1)} s</b></span>${extra ? `<span>${extra}</span>` : ''}`;
    }

    const rnWidth = () => Math.max(64, String(state!.rows).length * 8 + 28);
    const totalWidth = () => rnWidth() + state!.cols.reduce((a, c) => a + c.width, 0);
    const virtualHeight = () => Math.min(state!.rows * ROW_HEIGHT, MAX_SCROLL_PX);

    function buildGrid() {
      el.drop.style.display = 'none';
      el.gridWrap.style.display = 'block';
      el.openBtn2.hidden = false;
      renderStats();
      renderHeader();
      el.inner.style.width = totalWidth() + 'px';
      el.inner.style.height = HEADER_HEIGHT + virtualHeight() + 'px';
      el.rows.style.width = totalWidth() + 'px';
      el.scroller.scrollTop = 0;
      render();
    }

    function renderHeader() {
      const s = state!;
      const h = [
        `<div class="flex flex-none flex-col justify-center overflow-hidden border-r border-fd-border px-2.5 text-fd-muted-foreground" style="width:${rnWidth()}px"><span class="flex items-center gap-1.5 truncate text-[13px] font-semibold">#</span></div>`,
      ];
      s.cols.forEach((c, i) => {
        const on = s.sortCol === i;
        const arrow = on
          ? `<span class="text-[11px] text-fd-primary" aria-hidden="true">${s.sortDir === 'ASC' ? '▲' : '▼'}</span>`
          : '';
        const sortLabel = on ? (s.sortDir === 'ASC' ? 'sorted ascending' : 'sorted descending') : 'not sorted';
        h.push(
          `<button type="button" class="lfv-hcell flex flex-none flex-col justify-center overflow-hidden border-r border-fd-border px-2.5 text-left hover:bg-fd-accent" data-i="${i}" style="width:${c.width}px" title="${escapeHtml(c.name)} · click to sort" aria-label="${escapeHtml(c.name)}, ${sortLabel}"><span class="flex items-center gap-1.5 truncate text-[13px] font-semibold">${escapeHtml(c.name)}${arrow}</span><span class="font-mono text-[11px] text-fd-muted-foreground">${escapeHtml(c.type.toLowerCase())}</span></button>`,
        );
      });
      el.hdr.innerHTML = h.join('');
    }

    function viewport() {
      const s = state!;
      const viewH = el.scroller.clientHeight - HEADER_HEIGHT;
      const visible = Math.ceil(viewH / ROW_HEIGHT) + 1;
      const vh = virtualHeight();
      let first: number, offset: number;
      if (s.rows * ROW_HEIGHT <= MAX_SCROLL_PX) {
        first = Math.floor(el.scroller.scrollTop / ROW_HEIGHT);
        offset = first * ROW_HEIGHT;
      } else {
        const maxScroll = Math.max(1, vh - viewH);
        const frac = Math.min(1, el.scroller.scrollTop / maxScroll);
        first = Math.round(frac * Math.max(0, s.rows - visible + 1));
        offset = el.scroller.scrollTop;
      }
      first = Math.max(0, Math.min(first, Math.max(0, s.rows - 1)));
      return { first, count: Math.min(visible, s.rows - first), offset };
    }

    function render() {
      if (!state) return;
      const s = state;
      const { first, count, offset } = viewport();
      const rw = rnWidth();
      const out: string[] = [];
      const need = new Set<number>();
      for (let r = first; r < first + count; r++) {
        const b = Math.floor(r / BLOCK_SIZE);
        const blk = cache.get(b);
        const row = blk ? blk[r - b * BLOCK_SIZE] : null;
        if (!blk) need.add(b);
        let cells = `<div class="c flex-none overflow-hidden whitespace-nowrap border-r border-fd-border/50 px-2.5 font-mono text-[12.5px] leading-[28px] tabular-nums text-right text-fd-muted-foreground" style="width:${rw}px">${formatCount(r + 1)}</div>`;
        s.cols.forEach((c, i) => {
          if (!row) {
            cells += `<div class="flex-none overflow-hidden whitespace-nowrap border-r border-fd-border/50 px-2.5 font-mono text-[12.5px] leading-[28px] tabular-nums opacity-50" style="width:${c.width}px;color:transparent;background:linear-gradient(90deg,transparent 10px,var(--color-fd-border) 10px,var(--color-fd-border) 60%,transparent 60%) center/100% 6px no-repeat">·</div>`;
            return;
          }
          const v = row[i];
          cells +=
            v === null
              ? `<div class="flex-none overflow-hidden whitespace-nowrap border-r border-fd-border/50 px-2.5 font-mono text-[12.5px] italic leading-[28px] tabular-nums text-fd-muted-foreground" style="width:${c.width}px">null</div>`
              : `<div class="flex-none overflow-hidden whitespace-nowrap border-r border-fd-border/50 px-2.5 font-mono text-[12.5px] leading-[28px] tabular-nums${c.num ? ' text-right' : ''}" style="width:${c.width}px" title="${escapeHtml(v).replace(/"/g, '&quot;')}">${escapeHtml(v)}</div>`;
        });
        out.push(`<div class="flex h-[28px] odd:bg-transparent even:bg-fd-muted/40 hover:bg-fd-accent">${cells}</div>`);
      }
      el.rows.innerHTML = out.join('');
      el.rows.style.transform = `translateY(${offset}px)`;
      need.forEach(fetchBlock);
      const nb = Math.floor((first + count) / BLOCK_SIZE) + 1;
      if (nb * BLOCK_SIZE < s.rows && !cache.has(nb)) fetchBlock(nb);
    }

    async function fetchBlock(b: number) {
      const s = state;
      if (!s || !conn) return;
      const key = s.gen + ':' + b;
      if (inflight.has(key)) return;
      inflight.add(key);
      const gen = s.gen;
      const sel = s.cols.map((c) => `CAST(${quoteIdent(c.name)} AS VARCHAR)`).join(', ');
      try {
        const res = await conn.query(
          `SELECT ${sel} FROM data WHERE __pos >= ${b * BLOCK_SIZE} AND __pos < ${(b + 1) * BLOCK_SIZE} ORDER BY __pos`,
        );
        if (!state || gen !== state.gen) return;
        const n = res.numRows;
        const kids = s.cols.map((_, i) => res.getChildAt(i)!);
        const blockRows: (string | null)[][] = new Array(n);
        for (let r = 0; r < n; r++) {
          blockRows[r] = kids.map((k) => {
            const v = k.get(r);
            return v == null ? null : String(v);
          });
        }
        cache.set(b, blockRows);
        if (cache.size > MAX_CACHE_BLOCKS) cache.delete(cache.keys().next().value!);
        requestAnimationFrame(render);
      } catch (e) {
        console.error(e);
      } finally {
        inflight.delete(key);
      }
    }

    async function sortBy(i: number) {
      const s = state;
      if (!s || !conn) return;
      // cycle: ascending -> descending -> original order
      let col: number | null = i;
      let dir: SortDir;
      if (s.sortCol !== i) dir = 'ASC';
      else if (s.sortDir === 'ASC') dir = 'DESC';
      else {
        col = null;
        dir = null;
      }
      const order = col === null ? '__orig' : `${quoteIdent(s.cols[col].name)} ${dir} NULLS LAST, __orig`;
      const label = col === null ? 'Restoring original order' : `Sorting by ${s.cols[col].name}`;
      showStatus(label, `${formatCount(s.rows)} rows`);
      const t0 = performance.now();
      try {
        await conn.query(
          `CREATE OR REPLACE TABLE data AS SELECT (row_number() OVER (ORDER BY ${order})) - 1 AS __pos, * EXCLUDE (__pos) FROM data ORDER BY __pos`,
        );
        s.sortCol = col;
        s.sortDir = dir;
        s.gen++;
        cache.clear();
        renderHeader();
        renderStats(col === null ? '' : `sorted in <b class="text-fd-foreground font-medium tabular-nums">${((performance.now() - t0) / 1000).toFixed(1)} s</b>`);
        render();
        hideStatus();
      } catch (e) {
        console.error(e);
        showStatus('Sort failed', String((e as Error)?.message || e).slice(0, 300), true);
      }
    }

    function onHeaderClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const h = target.closest<HTMLElement>('.lfv-hcell[data-i]');
      if (h && state) sortBy(Number(h.dataset.i));
    }
    function onScroll() {
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; render(); });
    }
    function onResize() {
      if (state) render();
    }
    function pick() {
      el.fileInput.click();
    }
    function onFileChange(e: Event) {
      const target = e.target as HTMLInputElement;
      const f = target.files?.[0];
      if (f) loadFile(f);
      target.value = '';
    }
    function onDragEnter(e: DragEvent) {
      e.preventDefault();
      dragDepth++;
      el.drop.classList.add('lfv-drop-over');
    }
    function onDragLeave() {
      if (--dragDepth <= 0) {
        dragDepth = 0;
        el.drop.classList.remove('lfv-drop-over');
      }
    }
    function onDragOver(e: DragEvent) {
      e.preventDefault();
    }
    function onDrop(e: DragEvent) {
      e.preventDefault();
      dragDepth = 0;
      el.drop.classList.remove('lfv-drop-over');
      const f = e.dataTransfer?.files?.[0];
      if (f) loadFile(f);
    }

    el.hdr.addEventListener('click', onHeaderClick);
    el.scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    el.fileInput.addEventListener('change', onFileChange);
    window.addEventListener('dragenter', onDragEnter);
    window.addEventListener('dragleave', onDragLeave);
    window.addEventListener('dragover', onDragOver);
    window.addEventListener('drop', onDrop);

    el.openBtn.addEventListener('click', pick);
    el.openBtn2.addEventListener('click', pick);

    return () => {
      destroyed = true;
      if (raf) cancelAnimationFrame(raf);
      el.hdr.removeEventListener('click', onHeaderClick);
      el.scroller.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      el.fileInput.removeEventListener('change', onFileChange);
      window.removeEventListener('dragenter', onDragEnter);
      window.removeEventListener('dragleave', onDragLeave);
      window.removeEventListener('dragover', onDragOver);
      window.removeEventListener('drop', onDrop);
      el.openBtn.removeEventListener('click', pick);
      el.openBtn2.removeEventListener('click', pick);
      conn?.close().catch(() => {});
      db?.terminate().catch(() => {});
    };
  }, []);

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-fd-border bg-fd-card">
      <header className="flex flex-wrap items-center gap-3.5 border-b border-fd-border px-4 py-2.5">
        <div ref={statsRef} className="flex flex-wrap gap-4 text-[13px] text-fd-muted-foreground" />
        <button
          ref={openBtn2Ref}
          type="button"
          hidden
          className="ml-auto rounded-md border border-fd-border px-3.5 py-1.5 text-sm font-medium"
        >
          Open another file
        </button>
      </header>

      <main className="relative min-h-0 flex-1">
        <section ref={dropRef} className="absolute inset-0 grid place-items-center p-6">
          <div className="lfv-drop-inner w-full max-w-lg rounded-2xl border-[1.5px] border-dashed border-fd-border p-8 text-left transition-colors sm:p-11">
            <div className="mb-4 flex items-baseline gap-2.5 font-mono text-[13px] font-medium text-fd-muted-foreground">
              <s className="text-fd-muted-foreground/60">1,048,576 rows</s> no row limit
            </div>
            <h2 className="m-0 mb-3 text-[26px] font-semibold leading-[1.15] tracking-tight sm:text-[32px]">
              Open files Excel can&apos;t.
            </h2>
            <p className="m-0 mb-6 max-w-[46ch] text-fd-muted-foreground">
              Drop a CSV, TSV, or Parquet file to scroll and sort it. Everything runs in your browser, and your data
              never leaves this computer.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                ref={openBtnRef}
                type="button"
                className="rounded-md bg-fd-primary px-3.5 py-2 font-semibold text-fd-primary-foreground"
              >
                Choose a file
              </button>
              <span ref={engineHintRef} className="text-[13px] text-fd-muted-foreground">
                <span className="mr-2 inline-block size-3 animate-spin rounded-full border-2 border-fd-border border-t-fd-primary align-[-1px]" />
                Starting the engine…
              </span>
            </div>
          </div>
        </section>

        <section ref={gridWrapRef} className="absolute inset-0 hidden">
          <div ref={scrollerRef} tabIndex={0} aria-label="Data grid" className="absolute inset-0 overflow-auto">
            <div ref={innerRef} className="relative">
              <div ref={hdrRef} role="row" className="sticky top-0 z-[2] flex h-[38px] bg-fd-card" />
              <div ref={rowsRef} className="absolute left-0 top-[38px] will-change-transform" />
            </div>
          </div>
        </section>

        <div
          ref={statusRef}
          role="status"
          aria-live="polite"
          className="absolute inset-0 z-[5] hidden place-items-center bg-fd-background/85"
        >
          <div ref={statusBoxRef} className="min-w-[260px] max-w-[480px] rounded-lg border border-fd-border bg-fd-card p-4" />
        </div>
      </main>

      <input ref={fileInputRef} type="file" accept=".csv,.tsv,.txt,.parquet" hidden />

      <style>{`
        .lfv-drop-over .lfv-drop-inner { border-color: var(--color-fd-primary); background: color-mix(in srgb, var(--color-fd-primary) 7%, transparent); }
      `}</style>
    </div>
  );
}
