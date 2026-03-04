/**
 * SC-100 — Plaintiff's Claim and ORDER to Go to Small Claims Court
 *
 * Strategy
 * ─────────
 * 1. Widget-first  : every AcroForm field name in the PDF matches a mapping
 *    path in the sampleSC100 schema exactly (e.g. "SC-100[0].Page2[0]…").
 *    We look each mapping up in the widgetsByName Map for O(1) retrieval.
 *
 * 2. Anchor-based  : for fields where the widget is absent (scanned PDFs),
 *    we scan text lines near the printed label and capture the text
 *    immediately to the right of or below the anchor string.
 *
 * 3. MCQ inference : MCQ parent fields (no direct mapping) are resolved from
 *    associated yes/no checkbox pairs or from the presence of child values.
 */

import { sampleSC100 } from '../sc100.ts';
import type { PDFExtraction, FieldResult } from '../types.ts';
import { resolveCheckboxFast } from '../checkboxes.ts';
import { scoreField, inferYesNo } from '../validator.ts';

// ─── Deep-clone the schema template ──────────────────────────────────────────

function cloneSchema(): typeof sampleSC100 {
  return JSON.parse(JSON.stringify(sampleSC100)) as typeof sampleSC100;
}

// ─── Generic schema node types (narrow from unknown) ──────────────────────────

type AnyNode = Record<string, unknown>;

function isNode(v: unknown): v is AnyNode {
  return typeof v === 'object' && v !== null;
}

function nodeMapping(node: AnyNode): string {
  const mappings = node['mappings'];
  if (!Array.isArray(mappings) || mappings.length === 0) return '';
  const first = mappings[0];
  if (!isNode(first)) return '';
  return typeof first['mapping'] === 'string' ? first['mapping'] : '';
}

// ─── Anchor-based text extraction ────────────────────────────────────────────

/**
 * Find text to the right of (or immediately below) a label anchor.
 * Returns the first match within the bounding-box threshold.
 */
function anchorExtract(
  extraction: PDFExtraction,
  labelSubstring: string,
  pageHint?: number,
): string {
  const PAGE_TOLERANCE = 40; // points: max vertical distance to look below anchor
  const HORIZONTAL_GAP = 200; // points: max x distance for "to the right"

  // Find the anchor line
  const anchor = extraction.textLines.find(
    (l) =>
      l.text.toLowerCase().includes(labelSubstring.toLowerCase()) &&
      (pageHint === undefined || l.page === pageHint),
  );
  if (!anchor) return '';

  const [ax1, ay1, , ay2] = anchor.bbox;
  const anchorMidY = (ay1 + ay2) / 2;

  // Look for a value text on the same line (to the right) or just below
  const candidates = extraction.textLines.filter((l) => {
    if (l.page !== anchor.page) return false;
    if (l === anchor) return false;
    const [lx1, ly1, , ly2] = l.bbox;
    const lMidY = (ly1 + ly2) / 2;
    const sameRow = Math.abs(lMidY - anchorMidY) < 6;
    const belowRow =
      ly1 > ay2 && ly1 - ay2 < PAGE_TOLERANCE && Math.abs(lx1 - ax1) < 50;
    const rightOfAnchor = sameRow && lx1 > ax1 && lx1 - ax1 < HORIZONTAL_GAP;
    return rightOfAnchor || belowRow;
  });

  return candidates.map((l) => l.text.trim()).join(' ').trim();
}

// ─── Field-level extractor ────────────────────────────────────────────────────

function extractLeafField(
  node: AnyNode,
  extraction: PDFExtraction,
): FieldResult {
  const mapping = nodeMapping(node);
  const fieldId = typeof node['id'] === 'string' ? node['id'] : '';
  const question = typeof node['question'] === 'string' ? node['question'] : '';
  const fieldType = typeof node['type'] === 'string' ? node['type'] : 'string';

  if (!mapping) {
    // MCQ / inferred field — no direct widget path
    const result = scoreField(fieldId, question, '', null, 'default');
    node['confidence'] = result.confidence;
    return result;
  }

  // ── Widget path (primary) ─────────────────────────────────────────────────
  const widget = extraction.widgetsByName.get(mapping);

  if (widget) {
    let value: string | boolean | number | null;

    if (fieldType === 'boolean' || widget.fieldType === 'checkbox') {
      const resolved = resolveCheckboxFast(widget, []);
      value = resolved.checked;
    } else if (fieldType === 'number') {
      const raw = widget.value.replace(/[^0-9.]/g, '');
      const parsed = parseFloat(raw);
      value = isNaN(parsed) ? (widget.value.trim() || null) : parsed;
    } else {
      value = widget.value.trim();
    }

    const result = scoreField(fieldId, question, mapping, value, 'widget');
    node['value'] = value ?? '';
    node['confidence'] = result.confidence;
    node['visited'] = true;
    return result;
  }

  // ── Anchor fallback (secondary) ────────────────────────────────────────────
  // Derive a label hint from the mapping field name (last segment before [0])
  const labelHint = deriveLabelHint(question);
  if (labelHint) {
    const anchorValue = anchorExtract(extraction, labelHint);
    if (anchorValue) {
      const result = scoreField(
        fieldId,
        question,
        mapping,
        anchorValue,
        'anchor',
      );
      node['value'] = anchorValue;
      node['confidence'] = result.confidence;
      return result;
    }
  }

  // ── Not found ──────────────────────────────────────────────────────────────
  const result = scoreField(fieldId, question, mapping, null, 'default');
  node['confidence'] = result.confidence;
  return result;
}

/** Turn "Plaintiff full name" → "plaintiff" for anchor text matching */
function deriveLabelHint(question: string): string {
  const words = question.split(/\s+/);
  return words.slice(0, 2).join(' ');
}

// ─── Recursive tree walker ────────────────────────────────────────────────────

function walkNode(node: unknown, extraction: PDFExtraction, results: FieldResult[]): void {
  if (!isNode(node)) return;

  const mapping = nodeMapping(node);
  const nodeType = typeof node['type'] === 'string' ? node['type'] : '';

  // Leaf extractable field (has a mapping path or is a typed input field)
  if (mapping || ['string', 'boolean', 'number'].includes(nodeType)) {
    results.push(extractLeafField(node, extraction));
  }

  // Recurse into children (handles MCQ options, nested documents, etc.)
  const children = node['children'];
  if (Array.isArray(children)) {
    for (const child of children) {
      walkNode(child, extraction, results);
    }
  }
}

// ─── MCQ resolution pass ──────────────────────────────────────────────────────

/**
 * After all leaf values are filled, do a second pass to resolve MCQ parent
 * fields from known checkbox widget pairs or from child value presence.
 */
function resolveMCQs(node: unknown, extraction: PDFExtraction): void {
  if (!isNode(node)) return;

  const nodeType = typeof node['type'] === 'string' ? node['type'] : '';

  if (nodeType === 'mcq') {
    const question = typeof node['question'] === 'string' ? node['question'] : '';
    node['value'] = inferMCQValue(question, node, extraction);
    node['confidence'] = node['value'] ? 0.7 : 0.4;
  }

  const children = node['children'];
  if (Array.isArray(children)) {
    for (const child of children) {
      resolveMCQs(child, extraction);
    }
  }
}

/** Map specific MCQ questions to their PDF widget checkbox pairs */
function inferMCQValue(
  question: string,
  _node: AnyNode,
  extraction: PDFExtraction,
): string | null {
  const w = extraction.widgetsByName;
  const q = question.toLowerCase();

  // ── "Have you asked the defendant to pay?" ────────────────────────────────
  if (q.includes('asked the defendant to pay')) {
    const r = inferYesNo(
      w.get('SC-100[0].Page3[0].List4[0].Item4[0].Checkbox50[0]'),
      w.get('SC-100[0].Page3[0].List4[0].Item4[0].Checkbox50[1]'),
    );
    return r;
  }

  // ── "Is your claim about an attorney-client fee dispute?" ─────────────────
  if (q.includes('attorney-client fee dispute')) {
    const r = inferYesNo(
      w.get('SC-100[0].Page3[0].List7[0].item7[0].Checkbox60[0]'),
      w.get('SC-100[0].Page3[0].List7[0].item7[0].Checkbox60[1]'),
    );
    return r;
  }

  // ── "Are you suing a public entity?" ─────────────────────────────────────
  if (q.includes('suing a public entity')) {
    const r = inferYesNo(
      w.get('SC-100[0].Page3[0].List8[0].item8[0].Checkbox61[0]'),
      w.get('SC-100[0].Page3[0].List8[0].item8[0].Checkbox61[1]'),
    );
    return r;
  }

  // ── "Is any plaintiff a licensee or deferred deposit originator" ──────────
  if (q.includes('payday lender') || q.includes('licensee')) {
    const cb = w.get('SC-100[0].Page2[0].List1[0].Item1[0].Checkbox3[0]');
    if (cb) {
      const r = resolveCheckboxFast(cb, []);
      return r.checked ? 'yes' : 'no';
    }
  }

  // ── "Is any plaintiff doing business under a fictitious business name?" ────
  if (q.includes('fictitious')) {
    const cb = w.get('SC-100[0].Page2[0].List1[0].Item1[0].Checkbox2[0]');
    if (cb) {
      return resolveCheckboxFast(cb, []).checked ? 'yes' : 'no';
    }
  }

  // ── "Is there a second plaintiff?" ────────────────────────────────────────
  if (q.includes('second plaintiff')) {
    const name2 = w.get(
      'SC-100[0].Page2[0].List1[0].Item1[0].PlaintiffName2[0]',
    );
    return name2 && name2.value.trim() ? 'yes' : 'no';
  }

  // ── "Is the defendant a corporation, limited liability company?" ───────────
  if (q.includes('corporation') || q.includes('limited liability')) {
    const agentName = w.get(
      'SC-100[0].Page2[0].List2[0].item2[0].DefendantName2[0]',
    );
    return agentName && agentName.value.trim() ? 'yes' : 'no';
  }

  // ── "Is the defendant on active military duty?" ───────────────────────────
  if (q.includes('military duty')) {
    const cb = w.get('SC-100[0].Page2[0].List2[0].item2[0].Checkbox5[0]');
    if (cb) return resolveCheckboxFast(cb, []).checked ? 'yes' : 'no';
  }

  // ── Mailing address MCQs: infer from whether mailing fields have values ───
  if (q.includes('mailing address different') && q.includes('plaintiff')) {
    const addr = w.get(
      'SC-100[0].Page2[0].List1[0].Item1[0].PlaintiffMailingAddress1[0]',
    );
    return addr && addr.value.trim() ? 'yes' : 'no';
  }
  if (q.includes('mailing address different') && q.includes('defendant')) {
    const addr = w.get(
      'SC-100[0].Page2[0].List2[0].item2[0].DefendantMailingAddress1[0]',
    );
    return addr && addr.value.trim() ? 'yes' : 'no';
  }

  // ── "Do you know the exact date?" ─────────────────────────────────────────
  if (q.includes('exact date')) {
    const exact = w.get('SC-100[0].Page3[0].List3[0].Lib[0].Date1[0]');
    return exact && exact.value.trim() ? 'yes' : 'no';
  }

  // ── "Have you filed more than 12 small claims this year?" ─────────────────
  if (q.includes('more than 12')) {
    const r = inferYesNo(
      w.get('SC-100[0].Page4[0].List9[0].Item9[0].Checkbox62[0]'),
      w.get('SC-100[0].Page4[0].List9[0].Item9[0].Checkbox62[1]'),
    );
    return r;
  }

  // ── SC-101: Are you the attorney or client? ────────────────────────────────
  if (q.includes('attorney or client') || q.includes('are you the attorney')) {
    const attorney = w.get(
      'SC-101[0].Page1[0].List2[0].item2[0].Ch1[0]',
    );
    const client = w.get(
      'SC-101[0].Page1[0].List2[0].item2[0].Ch1[1]',
    );
    if (attorney && resolveCheckboxFast(attorney, []).checked) return 'attorney';
    if (client && resolveCheckboxFast(client, []).checked) return 'client';
  }

  return null;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface SC100ExtractionResult {
  schema: typeof sampleSC100;
  fieldResults: FieldResult[];
}

export function extractSC100(extraction: PDFExtraction): SC100ExtractionResult {
  const schema = cloneSchema();
  const fieldResults: FieldResult[] = [];

  // Walk every node in the schema tree and fill values
  for (const child of schema.children) {
    walkNode(child, extraction, fieldResults);
  }

  // Second pass: resolve MCQ parent fields
  for (const child of schema.children) {
    resolveMCQs(child, extraction);
  }

  return { schema, fieldResults };
}
