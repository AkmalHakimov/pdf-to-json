/**
 * Generic anchor + widget extractor — Path B for unknown form types.
 *
 * Discovers fields dynamically from any PDF layout — no prior schema required:
 *
 *  Pass 1 (Widget)  — every AcroForm widget is paired with its nearest label
 *                     text via spatial proximity (left-of or above the widget).
 *                     Checkboxes go through the full 3-step resolver
 *                     (widget value → symbol scan → pixel density).
 *
 *  Pass 2 (Anchor)  — text lines matching "Label: Value" or "Label:" patterns
 *                     fill gaps not covered by the widget pass.
 *
 *  Pass 3 (LLM)     — Gemini Vision is called for any text widget still empty
 *                     after passes 1–2 (only if GEMINI_API_KEY is set).
 *
 * Fields are partitioned into sections using all-caps header heuristics.
 * Output is a self-describing JSON usable without any prior knowledge of the
 * form layout.
 */

import { resolveCheckbox } from '../checkboxes.ts';
import { llmFallback } from '../llm.ts';
import type { PDFExtraction, TextLine, PDFWidget, FieldResult } from '../types.ts';

// ─── Output types ─────────────────────────────────────────────────────────────

export interface GenericField {
  label: string;
  value: string | boolean | null;
  type: 'text' | 'checkbox' | 'textarea';
  confidence: number;
  method: 'widget' | 'anchor' | 'llm' | 'default';
  page: number;
  /** Top-Y coordinate (PDF points) used for section ordering */
  y: number;
  widgetName?: string;
}

export interface GenericExtractionOutput {
  /** Best-guess form title extracted from page 0 */
  formTitle: string | null;
  /** Flat map: label → value (convenient for lookup) */
  fields: Record<string, string | boolean | null>;
  /** Fields grouped by detected section header */
  sections: Record<string, Record<string, string | boolean | null>>;
  /** Full per-field metadata including confidence and extraction method */
  rawFields: GenericField[];
}

export interface GenericExtractionResult {
  output: GenericExtractionOutput;
  fieldResults: FieldResult[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

/** Max horizontal gap (pts) between a label's right edge and the widget's left edge */
const LEFT_LABEL_MAX_GAP = 220;
/** Max vertical gap (pts) for a label sitting directly above a widget */
const ABOVE_LABEL_MAX_GAP = 28;
/** Vertical tolerance (pts) for "same row" comparison */
const ROW_TOLERANCE = 10;

/** "Label: Value" or "Label:" — label ≤ 80 chars, must start with a letter */
const LABEL_COLON_RE = /^([A-Za-z\u00C0-\u024F][^:\n]{1,80}?):\s*(.*)$/;

/**
 * Section header heuristic: all-caps string 4–60 chars long.
 * Allows digits, spaces, hyphens, slashes, ampersands, commas, dots.
 * Must begin and end with an uppercase letter or digit.
 */
const SECTION_HEADER_RE = /^[A-Z][A-Z0-9 \-\/&,.]{2,58}[A-Z0-9]$/;

// ─── Label utilities ──────────────────────────────────────────────────────────

function stripTrailing(text: string): string {
  return text.replace(/[:\s.]+$/, '').trim();
}

/**
 * Convert a widget path like "SC-100[0].Page2[0].PlaintiffName1[0]"
 * into a readable label "Plaintiff Name 1".
 */
function widgetNameToLabel(name: string): string {
  const parts = name.split('.');
  const last = (parts[parts.length - 1] ?? name).replace(/\[\d+\]$/, '');
  return last
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')  // ABCDef → ABC Def
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')         // camelCase → camel Case
    .replace(/[_\-]+/g, ' ')
    .trim();
}

/**
 * Ensure every label is unique in the output.
 * Subsequent occurrences of the same label become "Name (2)", "Name (3)", …
 */
function uniqueLabel(label: string, seen: Map<string, number>): string {
  const count = seen.get(label) ?? 0;
  seen.set(label, count + 1);
  return count === 0 ? label : `${label} (${count + 1})`;
}

// ─── Spatial proximity: widget → label ───────────────────────────────────────

/**
 * Scan text lines on the same page to find the best label for a widget.
 *
 * Scoring:
 *   Left-of-widget, same row  →  200 − gap   (higher = closer)
 *   Above-widget, same margin →  100 − gap
 *
 * Returns the stripped label text, or null if no suitable candidate is found.
 */
function findLabelForWidget(
  widget: PDFWidget,
  pageLines: TextLine[],
): string | null {
  const [wx1, wy1, , wy2] = widget.bbox;
  const wMidY = (wy1 + wy2) / 2;

  let bestLabel: string | null = null;
  let bestScore = -Infinity;

  for (const line of pageLines) {
    const text = line.text.trim();
    if (!text || text.length < 2 || text.length > 120) continue;

    const [lx1, ly1, lx2, ly2] = line.bbox;
    const lMidY = (ly1 + ly2) / 2;

    // ── Left-of-widget, same row ──────────────────────────────────────────────
    if (lx2 <= wx1 + 4 && Math.abs(lMidY - wMidY) <= ROW_TOLERANCE) {
      const gap = wx1 - lx2;
      if (gap >= 0 && gap <= LEFT_LABEL_MAX_GAP) {
        const score = 200 - gap;
        if (score > bestScore) {
          bestScore = score;
          bestLabel = text;
        }
      }
    }

    // ── Above-widget, same left margin (±80 pt) ───────────────────────────────
    if (ly2 <= wy1 + 2 && lx1 >= wx1 - 80 && lx1 <= wx1 + 80) {
      const gap = wy1 - ly2;
      if (gap >= 0 && gap <= ABOVE_LABEL_MAX_GAP) {
        const score = 100 - gap;
        if (score > bestScore) {
          bestScore = score;
          bestLabel = text;
        }
      }
    }
  }

  return bestLabel !== null ? stripTrailing(bestLabel) : null;
}

// ─── Section header detection ─────────────────────────────────────────────────

interface SectionHeader {
  label: string;
  page: number;
  y: number;
}

function detectSectionHeaders(textLines: TextLine[]): SectionHeader[] {
  const headers: SectionHeader[] = [];
  for (const line of textLines) {
    const text = line.text.trim();
    if (SECTION_HEADER_RE.test(text)) {
      headers.push({ label: text, page: line.page, y: line.bbox[1] });
    }
  }
  return headers;
}

/**
 * Return the section label that most recently precedes this field
 * in document reading order (page × 100 000 + y).
 */
function assignSection(field: GenericField, headers: SectionHeader[]): string {
  const fieldPos = field.page * 100_000 + field.y;
  let bestLabel = 'General';
  let bestPos = -Infinity;

  for (const h of headers) {
    const hPos = h.page * 100_000 + h.y;
    if (hPos <= fieldPos && hPos > bestPos) {
      bestPos = hPos;
      bestLabel = h.label;
    }
  }

  return bestLabel;
}

// ─── Form title heuristic ─────────────────────────────────────────────────────

/**
 * Attempt to detect the form title from page 0.
 * Scores candidates by all-caps flag, font size, and length.
 * Only considers text in the top third of the page.
 */
function detectFormTitle(textLines: TextLine[]): string | null {
  const page0 = textLines.filter(
    (l) => l.page === 0 && l.text.trim().length >= 8,
  );
  if (page0.length === 0) return null;

  const ys = page0.map((l) => l.bbox[1]);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const topThird = minY + (maxY - minY) / 3;

  const candidates = page0.filter(
    (l) =>
      l.bbox[1] <= topThird &&
      l.text.trim().length <= 120 &&
      /[A-Za-z]/.test(l.text),
  );

  if (candidates.length === 0) return null;

  const scored = candidates.map((l) => {
    const text = l.text.trim();
    const isAllCaps = text === text.toUpperCase() && /[A-Z]/.test(text);
    const fontSize = l.fontSize ?? 10;
    return {
      text,
      score: text.length * 0.4 + (isAllCaps ? 30 : 0) + fontSize * 1.5,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.text ?? null;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Extract any PDF using purely spatial analysis — no prior schema required.
 *
 * Accepts a `PDFExtraction` (already produced by Layer 1) so this extractor
 * does not need to re-open the file except for the checkbox pixel fallback.
 */
export async function extractGeneric(
  extraction: PDFExtraction,
): Promise<GenericExtractionResult> {
  const fields: GenericField[] = [];
  const seenLabels = new Map<string, number>();

  /** Lower-cased label keys already claimed by the widget pass */
  const widgetLabelKeys = new Set<string>();

  /** Pre-group text lines by page for O(1) lookups in the widget loop */
  const linesByPage = new Map<number, TextLine[]>();
  for (const line of extraction.textLines) {
    const arr = linesByPage.get(line.page) ?? [];
    arr.push(line);
    linesByPage.set(line.page, arr);
  }

  const headers = detectSectionHeaders(extraction.textLines);

  // ── Pass 1: Widget pass ────────────────────────────────────────────────────
  // Pair every AcroForm widget with a label and extract its value.

  for (const widget of extraction.widgets) {
    const pageLines = linesByPage.get(widget.page) ?? [];

    const proximityLabel = findLabelForWidget(widget, pageLines);
    const fallbackLabel = widget.name
      ? widgetNameToLabel(widget.name)
      : `Field ${fields.length + 1}`;
    const rawLabel = proximityLabel ?? fallbackLabel;
    const label = uniqueLabel(rawLabel, seenLabels);
    widgetLabelKeys.add(rawLabel.toLowerCase());

    const type: GenericField['type'] =
      widget.fieldType === 'checkbox' ? 'checkbox' : 'text';

    let value: string | boolean | null = null;
    let confidence: number;
    let method: GenericField['method'];

    if (widget.fieldType === 'checkbox') {
      // Full 3-step cascade: widget value → symbol scan → pixel density
      const nearbyText = pageLines
        .filter((l) => {
          const [, ly1, , ly2] = l.bbox;
          const [, wy1, , wy2] = widget.bbox;
          return Math.abs((ly1 + ly2) / 2 - (wy1 + wy2) / 2) < 20;
        })
        .map((l) => l.text);

      const result = await resolveCheckbox(
        widget,
        nearbyText,
        extraction.filePath,
        widget.page,
        widget.bbox,
      );

      value = result.checked;
      method = 'widget';
      confidence =
        result.method === 'widget' ? 1.0
        : result.method === 'symbol' ? 0.85
        : result.method === 'pixel' ? 0.7
        : 0.4;
    } else {
      // Text / unknown widget — prefer the widget value directly
      const raw = widget.value.trim();
      value = raw || null;
      method = value !== null ? 'widget' : 'default';
      confidence = value !== null ? 1.0 : 0.4;
    }

    fields.push({
      label,
      value,
      type,
      confidence,
      method,
      page: widget.page,
      y: widget.bbox[1],
      widgetName: widget.name,
    });
  }

  // ── Pass 2: Anchor-colon pass ──────────────────────────────────────────────
  // Scan text lines for "Label: Value" patterns not already covered by widgets.

  for (let i = 0; i < extraction.textLines.length; i++) {
    const line = extraction.textLines[i];
    if (!line) continue; // noUncheckedIndexedAccess guard

    const text = line.text.trim();
    const m = LABEL_COLON_RE.exec(text);
    if (!m) continue;

    const rawLabel = stripTrailing(m[1] ?? ''); // m[1] is string | undefined
    if (widgetLabelKeys.has(rawLabel.toLowerCase())) continue;

    // Value may appear after the colon on the same line…
    let value: string | null = (m[2] ?? '').trim() || null;

    // …or on the very next line (continuation with no leading colon)
    if (!value) {
      const next = extraction.textLines[i + 1];
      if (
        next &&
        next.page === line.page &&
        next.bbox[1] - line.bbox[3] < 20 &&
        !LABEL_COLON_RE.test(next.text.trim())
      ) {
        value = next.text.trim() || null;
      }
    }

    const label = uniqueLabel(rawLabel, seenLabels);
    widgetLabelKeys.add(rawLabel.toLowerCase());

    fields.push({
      label,
      value,
      type: 'text',
      confidence: value !== null ? 0.65 : 0.3,
      method: value !== null ? 'anchor' : 'default',
      page: line.page,
      y: line.bbox[1],
    });
  }

  // ── Pass 3: LLM fallback for empty text fields ────────────────────────────
  // Ask Gemini to fill only the fields that are still null after passes 1–2.

  const apiKey = process.env['GEMINI_API_KEY'];
  const emptyTextFields = fields.filter(
    (f) => f.value === null && f.type !== 'checkbox',
  );

  if (apiKey && emptyTextFields.length > 0) {
    const toAsk = emptyTextFields.slice(0, 20).map((f) => ({
      question: f.label,
      page: f.page,
    }));

    try {
      const llmResult = await llmFallback({
        filePath: extraction.filePath,
        formType: 'unknown',
        flaggedFields: toAsk,
      });

      for (const f of fields) {
        const llmValue = llmResult.values.get(f.label);
        if (llmValue !== undefined && llmValue !== null) {
          f.value = llmValue;
          f.confidence = 0.8;
          f.method = 'llm';
        }
      }

      console.log(`  ✓ LLM resolved ${llmResult.values.size} previously empty fields`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`  ⚠  LLM fallback skipped: ${msg}`);
    }
  } else if (!apiKey && emptyTextFields.length > 0) {
    console.warn(
      `  ⚠  ${emptyTextFields.length} empty fields remain — set GEMINI_API_KEY to enable LLM fallback`,
    );
  }

  // ── Build structured output ───────────────────────────────────────────────

  const flatFields: Record<string, string | boolean | null> = {};
  const sectionedFields: Record<string, Record<string, string | boolean | null>> = {};

  for (const f of fields) {
    flatFields[f.label] = f.value;
    const section = assignSection(f, headers);
    const sec = sectionedFields[section] ?? (sectionedFields[section] = {});
    sec[f.label] = f.value;
  }

  const output: GenericExtractionOutput = {
    formTitle: detectFormTitle(extraction.textLines),
    fields: flatFields,
    sections: sectionedFields,
    rawFields: fields,
  };

  // ── Convert to FieldResult[] for the confidence scorer ───────────────────

  const fieldResults: FieldResult[] = fields.map((f, i) => ({
    fieldId: f.widgetName ?? `anchor-${i}`,
    question: f.label,
    mapping: f.widgetName ?? '',
    value: f.value,
    confidence: f.confidence,
    method: f.method,
  }));

  return { output, fieldResults };
}
