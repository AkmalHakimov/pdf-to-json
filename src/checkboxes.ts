/**
 * Layer 4 — Checkbox Resolver
 *
 * Resolves whether a checkbox field is checked using a three-step cascade:
 *
 *  Step 1 — Widget value inspection (fastest, most reliable for AcroForm PDFs)
 *    PDF spec: Off = unchecked; any other export value = checked.
 *
 *  Step 2 — Symbol scan in nearby text (catches symbolic checkbox characters
 *    that appear as text glyphs rather than AcroForm values)
 *
 *  Step 3 — Pixel density analysis (last resort for scanned PDFs or when the
 *    checkbox is drawn as a graphic rather than a form widget)
 */

import type { PDFWidget, CheckboxResult } from './types.ts';
import { renderPageGrayscale } from './extract.ts';

// Unicode and ASCII checkbox symbols that indicate a checked state
const CHECKED_SYMBOLS = new Set([
  'þ',
  'ý',
  '✓',
  '✔',
  '☑',
  '■',
  '●',
  '•',
  'x',
  'X',
]);

// Widget values that definitively indicate "unchecked" per the PDF spec
const UNCHECKED_VALUES = new Set(['', 'Off', 'No', 'false', 'FALSE']);

/**
 * Resolve a single checkbox.
 *
 * @param widget        The AcroForm widget for this checkbox (may be undefined
 *                      if the form has no interactive layer).
 * @param nearbyText    Text lines near the checkbox bounding box, already
 *                      extracted by the caller for anchor scanning.
 * @param filePath      Path to the PDF file — needed only for pixel fallback.
 * @param pageIndex     0-based page index — needed only for pixel fallback.
 * @param bboxPts       Checkbox bounding box in PDF points [x1,y1,x2,y2] —
 *                      needed only for pixel fallback.
 */
export async function resolveCheckbox(
  widget: PDFWidget | undefined,
  nearbyText: string[],
  filePath?: string,
  pageIndex?: number,
  bboxPts?: [number, number, number, number],
): Promise<CheckboxResult> {
  // ── Step 1: Widget value ────────────────────────────────────────────────────
  if (widget !== undefined) {
    if (UNCHECKED_VALUES.has(widget.value)) {
      return { checked: false, method: 'widget' };
    }
    // Any non-empty value that isn't a known "Off" token → checked
    if (widget.value !== '') {
      return { checked: true, method: 'widget' };
    }
  }

  // ── Step 2: Symbol scan ─────────────────────────────────────────────────────
  for (const line of nearbyText) {
    for (const ch of line) {
      if (CHECKED_SYMBOLS.has(ch)) {
        return { checked: true, method: 'symbol' };
      }
    }
  }

  // ── Step 3: Pixel density ───────────────────────────────────────────────────
  if (filePath !== undefined && pageIndex !== undefined && bboxPts !== undefined) {
    try {
      const result = analysePixels(filePath, pageIndex, bboxPts);
      return { checked: result, method: 'pixel' };
    } catch {
      // Pixel analysis failed — fall through to unknown
    }
  }

  return { checked: false, method: 'unknown' };
}

/**
 * Synchronous pixel-density check.
 * Renders the page at 3× scale, crops to the checkbox bbox, and returns true
 * if > 15 % of pixels are dark (luminance < 128).
 */
function analysePixels(
  filePath: string,
  pageIndex: number,
  bboxPts: [number, number, number, number],
): boolean {
  const scale = 3;
  const { pixels, width } = renderPageGrayscale(filePath, pageIndex, scale);

  const scaled = bboxPts.map((c) => Math.round(c * scale));
  const px1 = scaled[0] ?? 0;
  const py1 = scaled[1] ?? 0;
  const px2 = scaled[2] ?? 0;
  const py2 = scaled[3] ?? 0;

  let dark = 0;
  let total = 0;

  for (let y = Math.max(0, py1); y < py2; y++) {
    for (let x = Math.max(0, px1); x < px2; x++) {
      const idx = y * width + x;
      const lum = pixels[idx];
      if (lum === undefined) continue;
      total++;
      if (lum < 128) dark++;
    }
  }

  return total > 0 && dark / total > 0.15;
}

/**
 * Convenience wrapper that resolves a checkbox synchronously using only
 * the widget value and symbol scan (no I/O).  Used by extractors when
 * they already know the pixel fallback is unnecessary.
 */
export function resolveCheckboxFast(
  widget: PDFWidget | undefined,
  nearbyText: string[],
): CheckboxResult {
  if (widget !== undefined) {
    if (UNCHECKED_VALUES.has(widget.value)) {
      return { checked: false, method: 'widget' };
    }
    if (widget.value !== '') {
      return { checked: true, method: 'widget' };
    }
  }

  for (const line of nearbyText) {
    for (const ch of line) {
      if (CHECKED_SYMBOLS.has(ch)) {
        return { checked: true, method: 'symbol' };
      }
    }
  }

  return { checked: false, method: 'unknown' };
}
