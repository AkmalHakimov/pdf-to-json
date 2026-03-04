/**
 * Layer 5 — Schema Validator + Confidence Scorer
 *
 * Assigns a confidence score to each extracted field:
 *
 *   1.0  field found via anchor/widget match and value is non-empty
 *   0.7  field found but value looks malformed or unexpected
 *   0.4  field was missing; a default / null was used
 *   0.0  field is required but not found at all
 *
 * Also collects all low-confidence fields (< 0.7) into flaggedFields.
 */

import type { FieldResult, ExtractionMethod } from './types.ts';

// ─── Per-field scorer ─────────────────────────────────────────────────────────

export function scoreField(
  fieldId: string,
  question: string,
  mapping: string,
  value: string | boolean | number | null,
  method: ExtractionMethod,
): FieldResult {
  let confidence: number;

  if (value === null || value === undefined) {
    // Field is required but completely absent
    confidence = 0.0;
  } else if (
    value === '' ||
    (typeof value === 'string' && value.trim() === '')
  ) {
    // Field present but empty — common for unfilled template PDFs
    confidence = 0.4;
  } else if (typeof value === 'boolean') {
    // Boolean checkboxes are always definitive when a widget is found
    confidence = method === 'widget' ? 1.0 : 0.7;
  } else if (method === 'llm') {
    confidence = 0.8;
  } else if (method === 'widget') {
    // Widget values are the gold standard — check for plausible content
    confidence = looksWellFormed(value) ? 1.0 : 0.7;
  } else if (method === 'anchor') {
    confidence = looksWellFormed(value) ? 0.7 : 0.5;
  } else {
    // 'default' method — value was inferred or defaulted
    confidence = 0.4;
  }

  return { fieldId, question, mapping, value, confidence, method };
}

/** Heuristic: a value "looks well-formed" if it contains at least one letter or digit */
function looksWellFormed(value: string | number | boolean): boolean {
  if (typeof value === 'boolean') return true;
  if (typeof value === 'number') return !isNaN(value);
  return /[a-zA-Z0-9]/.test(String(value));
}

// ─── Aggregate scorers ────────────────────────────────────────────────────────

export function computeOverallConfidence(fields: FieldResult[]): number {
  if (fields.length === 0) return 0;
  const total = fields.reduce((sum, f) => sum + f.confidence, 0);
  return Math.round((total / fields.length) * 1000) / 1000;
}

export function flagLowConfidenceFields(
  fields: FieldResult[],
  threshold = 0.7,
): string[] {
  return fields
    .filter((f) => f.confidence < threshold)
    .map((f) => f.question);
}

// ─── MCQ inference helpers ────────────────────────────────────────────────────

/**
 * Infer the answer to a yes/no MCQ from a pair of checkbox widgets.
 * widgetYes / widgetNo are the [0] and [1] variants of the radio group.
 * Returns 'yes' | 'no' | null (unknown).
 */
export function inferYesNo(
  widgetYes: { value: string } | undefined,
  widgetNo: { value: string } | undefined,
): 'yes' | 'no' | null {
  const UNCHECKED = new Set(['', 'Off', 'No', 'false']);
  if (widgetYes && !UNCHECKED.has(widgetYes.value)) return 'yes';
  if (widgetNo && !UNCHECKED.has(widgetNo.value)) return 'no';
  return null;
}
