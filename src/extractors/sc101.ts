/**
 * SC-101 — Attorney Fee Dispute (After Arbitration)
 *
 * SC-101 is always attached to SC-100 (item 7). Its fields are nested inside
 * the SC-100 schema's attorney-fee-dispute branch, but we also provide a
 * standalone extractor for when SC-101 is processed independently.
 */

import type { PDFExtraction, FieldResult } from '../types.ts';
import { resolveCheckboxFast } from '../checkboxes.ts';
import { scoreField, inferYesNo } from '../validator.ts';

// ─── Field definitions ────────────────────────────────────────────────────────

interface SC101Field {
  id: string;
  question: string;
  mapping: string;
  type: 'string' | 'boolean' | 'mcq';
}

const SC101_FIELDS: SC101Field[] = [
  {
    id: 'sc101-case-number',
    question: 'Case number',
    mapping: 'SC-101[0].Page1[0].Header[0].CaseNumber_ft[0]',
    type: 'string',
  },
  {
    id: 'sc101-dispute-amount',
    question: 'How much money is in dispute',
    mapping: 'SC-101[0].Page1[0].List1[0].item1[0].Amount1[0]',
    type: 'string',
  },
  {
    id: 'sc101-notice-award-date',
    question: 'Date of notice of award',
    mapping: 'SC-101[0].Page1[0].List4[0].item4[0].FillText4[0]',
    type: 'string',
  },
  {
    id: 'sc101-explain-b',
    question: 'Explain reason for correction of award',
    mapping: 'SC-101[0].Page1[0].List5[0].Lib[0].SubLib[0].FillText4[0]',
    type: 'string',
  },
  {
    id: 'sc101-explain-b2',
    question: 'Further explanation for correction',
    mapping: 'SC-101[0].Page1[0].List5[0].Lib[0].SubLib[0].FillText5[0]',
    type: 'string',
  },
  {
    id: 'sc101-explain-c',
    question: 'Explain reason to vacate award',
    mapping: 'SC-101[0].Page1[0].List5[0].Lic[0].FillText7[0]',
    type: 'string',
  },
  {
    id: 'sc101-explain-c2',
    question: 'Further explanation to vacate award',
    mapping: 'SC-101[0].Page1[0].List5[0].Lic[0].FillText8[0]',
    type: 'string',
  },
  {
    id: 'sc101-no-attend-explain',
    question: 'Explain why you or your attorney did not attend the hearing',
    mapping: 'SC-101[0].Page1[0].List6[0].item6[0].FillText12[0]',
    type: 'string',
  },
  {
    id: 'sc101-attachment-explain',
    question: 'Explain why arbitration agreement and notice of award are not attached',
    mapping: 'SC-101[0].Page1[0].List7[0].item7[0].FillText15[0]',
    type: 'string',
  },
  {
    id: 'sc101-date',
    question: 'Signature date (SC-101)',
    mapping: 'SC-101[0].Page1[0].Sign[0].FillText32[0]',
    type: 'string',
  },
  {
    id: 'sc101-name',
    question: 'Printed name (SC-101)',
    mapping: 'SC-101[0].Page1[0].Sign[0].FillText31[0]',
    type: 'string',
  },
];

// ─── MCQ resolution ───────────────────────────────────────────────────────────

interface MCQResult {
  id: string;
  question: string;
  value: string | null;
  confidence: number;
}

function resolveSC101MCQs(extraction: PDFExtraction): MCQResult[] {
  const w = extraction.widgetsByName;
  const results: MCQResult[] = [];

  // Are you the attorney or the client?
  const attorney = w.get('SC-101[0].Page1[0].List2[0].item2[0].Ch1[0]');
  const client = w.get('SC-101[0].Page1[0].List2[0].item2[0].Ch1[1]');
  let role: string | null = null;
  if (attorney && resolveCheckboxFast(attorney, []).checked) role = 'attorney';
  else if (client && resolveCheckboxFast(client, []).checked) role = 'client';
  results.push({
    id: 'sc101-role',
    question: 'Are you the attorney or client',
    value: role,
    confidence: role ? 0.9 : 0.4,
  });

  // What did the arbitrator decide?
  const attyOwes = w.get('SC-101[0].Page1[0].List3[0].Lia[0].Ch3[0]');
  const clientOwes = w.get('SC-101[0].Page1[0].List3[0].Lia[0].ch2[0]');
  const neither = w.get('SC-101[0].Page1[0].List3[0].Lia[0].ch2[1]');
  let arbitratorDecision: string | null = null;
  if (attyOwes && resolveCheckboxFast(attyOwes, []).checked)
    arbitratorDecision = 'attorney-pays';
  else if (clientOwes && resolveCheckboxFast(clientOwes, []).checked)
    arbitratorDecision = 'client-pays';
  else if (neither && resolveCheckboxFast(neither, []).checked)
    arbitratorDecision = 'neither';
  results.push({
    id: 'sc101-arbitrator-decision',
    question: 'What did the arbitrator decide',
    value: arbitratorDecision,
    confidence: arbitratorDecision ? 0.9 : 0.4,
  });

  // Amount from arbitrator decision
  const decisionAmount = w.get(
    'SC-101[0].Page1[0].List3[0].Lia[0].FillText3[0]',
  );
  results.push({
    id: 'sc101-decision-amount',
    question: 'How much did the arbitrator decide must be paid',
    value: decisionAmount?.value.trim() ?? null,
    confidence: decisionAmount?.value.trim() ? 1.0 : 0.4,
  });

  // Why are you filing? (5a–5d)
  const confirmAward = w.get(
    'SC-101[0].Page1[0].List5[0].Lia[0].CheckBox1[0]',
  );
  const correctAward = w.get(
    'SC-101[0].Page1[0].List5[0].Lib[0].CheckBox2[0]',
  );
  const vacateAward = w.get(
    'SC-101[0].Page1[0].List5[0].Lic[0].CheckBox3[0]',
  );
  const trialRequest = w.get(
    'SC-101[0].Page1[0].List5[0].Lid[0].CheckBox9[0]',
  );
  let filingReason: string | null = null;
  if (confirmAward && resolveCheckboxFast(confirmAward, []).checked)
    filingReason = 'confirm';
  else if (correctAward && resolveCheckboxFast(correctAward, []).checked)
    filingReason = 'correct';
  else if (vacateAward && resolveCheckboxFast(vacateAward, []).checked)
    filingReason = 'vacate';
  else if (trialRequest && resolveCheckboxFast(trialRequest, []).checked)
    filingReason = 'trial';
  results.push({
    id: 'sc101-filing-reason',
    question: 'Why are you filing in small claims court',
    value: filingReason,
    confidence: filingReason ? 0.9 : 0.4,
  });

  // Requesting new arbitration?
  const newArb = w.get(
    'SC-101[0].Page1[0].List5[0].Lic[0].CheckBox8[0]',
  );
  results.push({
    id: 'sc101-new-arbitration',
    question: 'Are you asking for a new arbitration hearing',
    value:
      newArb !== undefined
        ? resolveCheckboxFast(newArb, []).checked
          ? 'yes'
          : 'no'
        : null,
    confidence: newArb !== undefined ? 0.9 : 0.4,
  });

  // Did you attend the arbitration?
  const attended = inferYesNo(
    w.get('SC-101[0].Page1[0].List6[0].item6[0].ch15[0]'),
    w.get('SC-101[0].Page1[0].List6[0].item6[0].ch15[1]'),
  );
  results.push({
    id: 'sc101-attended',
    question: 'Did you or your attorney attend the arbitration hearing',
    value: attended,
    confidence: attended ? 0.9 : 0.4,
  });

  return results;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface SC101ExtractionResult {
  data: Record<string, unknown>;
  fieldResults: FieldResult[];
}

export function extractSC101(extraction: PDFExtraction): SC101ExtractionResult {
  const data: Record<string, unknown> = {};
  const fieldResults: FieldResult[] = [];

  // Extract text and checkbox fields
  for (const field of SC101_FIELDS) {
    const widget = extraction.widgetsByName.get(field.mapping);
    let value: string | boolean | null;

    if (widget) {
      value = widget.value.trim();
    } else {
      // Anchor fallback for key labels
      value = null;
    }

    const result = scoreField(
      field.id,
      field.question,
      field.mapping,
      value,
      widget ? 'widget' : 'default',
    );
    fieldResults.push(result);
    data[field.id] = value;
  }

  // Resolve MCQs
  const mcqResults = resolveSC101MCQs(extraction);
  for (const m of mcqResults) {
    data[m.id] = m.value;
    fieldResults.push({
      fieldId: m.id,
      question: m.question,
      mapping: '',
      value: m.value,
      confidence: m.confidence,
      method: 'widget',
    });
  }

  return { data, fieldResults };
}
