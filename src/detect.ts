/**
 * Layer 2 — Form Type Detection
 *
 * Identifies which Judicial Council form is in a PDF by inspecting:
 *  1. AcroForm widget names (most reliable — every field is prefixed with the form ID)
 *  2. Text content anchors (fallback for scanned or non-interactive PDFs)
 *
 * Returns 'unknown' when neither pass matches — callers route those PDFs to
 * the generic LLM extractor (src/extractors/generic.ts) rather than failing.
 */

import type { PDFExtraction, FormType } from './types.ts';

const FORM_PREFIXES: Array<[string, FormType]> = [
  ['SC-100[', 'SC-100'],
  ['SC-101[', 'SC-101'],
  ['SC-103[', 'SC-103'],
];

const FORM_TEXT_ANCHORS: Array<[RegExp, FormType]> = [
  [/\bSC-100\b/, 'SC-100'],
  [/\bSC-101\b/, 'SC-101'],
  [/\bSC-103\b/, 'SC-103'],
];

export function detectFormType(extraction: PDFExtraction): FormType {
  // ── Pass 1: widget name prefix ──────────────────────────────────────────────
  for (const widget of extraction.widgets) {
    for (const [prefix, formType] of FORM_PREFIXES) {
      if (widget.name.startsWith(prefix)) {
        return formType;
      }
    }
  }

  // ── Pass 2: text content scan ────────────────────────────────────────────────
  // Prioritise the first page — that's where the form ID header is printed
  const firstPageLines = extraction.textLines
    .filter((l) => l.page === 0)
    .map((l) => l.text);
  const allText = firstPageLines.join(' ');

  for (const [pattern, formType] of FORM_TEXT_ANCHORS) {
    if (pattern.test(allText)) {
      return formType;
    }
  }

  return 'unknown';
}
