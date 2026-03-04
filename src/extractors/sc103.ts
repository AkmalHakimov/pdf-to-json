/**
 * SC-103 — Fictitious Business Name (Small Claims)
 *
 * Short single-page form. Attached to SC-100 when any plaintiff is
 * doing business under a fictitious name ("dba").
 */

import type { PDFExtraction, FieldResult } from '../types.ts';
import { resolveCheckboxFast } from '../checkboxes.ts';
import { scoreField } from '../validator.ts';

// ─── Field definitions ────────────────────────────────────────────────────────

interface SC103Field {
  id: string;
  question: string;
  mapping: string;
  type: 'string' | 'boolean';
}

const SC103_TEXT_FIELDS: SC103Field[] = [
  {
    id: 'sc103-case-number',
    question: 'Case number (SC-103)',
    mapping: 'SC-103[0].Page1[0].Header[0].case[0].CaseNumber_ft[0]',
    type: 'string',
  },
  {
    id: 'sc103-business-name',
    question: 'Business name of the person suing',
    mapping: 'SC-103[0].Page1[0].List1[0].item1[0].FillText1[0]',
    type: 'string',
  },
  {
    id: 'sc103-business-address',
    question: 'Business address (not a P.O. Box)',
    mapping: 'SC-103[0].Page1[0].List1[0].item1[0].FillText2[0]',
    type: 'string',
  },
  {
    id: 'sc103-mailing-address',
    question: 'Business mailing address (if different)',
    mapping: 'SC-103[0].Page1[0].List1[0].item1[0].FillText3[0]',
    type: 'string',
  },
  {
    id: 'sc103-business-type-other',
    question: 'Business type: other — specify',
    mapping: 'SC-103[0].Page1[0].List2[0].item2[0].FillText4[0]',
    type: 'string',
  },
  {
    id: 'sc103-county',
    question: 'Name of county where Fictitious Business Name Statement was filed',
    mapping: 'SC-103[0].Page1[0].List3[0].item3[0].FillText5[0]',
    type: 'string',
  },
  {
    id: 'sc103-statement-number',
    question: 'Fictitious Business Name Statement number',
    mapping: 'SC-103[0].Page1[0].List4[0].item4[0].FillText6[0]',
    type: 'string',
  },
  {
    id: 'sc103-expiry-date',
    question: 'Date Fictitious Business Name Statement expires',
    mapping: 'SC-103[0].Page1[0].List5[0].item5[0].FillText7[0]',
    type: 'string',
  },
  {
    id: 'sc103-signature-date',
    question: 'Signature date (SC-103)',
    mapping: 'SC-103[0].Page1[0].List6[0].item6[0].FillText9[0]',
    type: 'string',
  },
  {
    id: 'sc103-signer-name',
    question: 'Type or print name and title (SC-103)',
    mapping: 'SC-103[0].Page1[0].List6[0].item6[0].FillText10[0]',
    type: 'string',
  },
];

// Business type option checkboxes (SC-103, item 2)
// CheckBox6[0]=individual, [1]=corporation, [2]=association,
//             [3]=LLC,     [4]=partnership, [5]=other
const BUSINESS_TYPE_OPTIONS = [
  'individual',
  'corporation',
  'association',
  'limited liability company',
  'partnership',
  'other',
] as const;

type BusinessType = (typeof BUSINESS_TYPE_OPTIONS)[number] | null;

// Attachment checkboxes: which parent form SC-103 is attached to
const ATTACHMENT_OPTIONS = ['SC-100', 'SC-120', 'SC-500'] as const;
type AttachmentForm = (typeof ATTACHMENT_OPTIONS)[number] | null;

// ─── MCQ helpers ──────────────────────────────────────────────────────────────

function resolveBusinessType(extraction: PDFExtraction): BusinessType {
  for (let i = 0; i < BUSINESS_TYPE_OPTIONS.length; i++) {
    const key = `SC-103[0].Page1[0].List2[0].item2[0].CheckBox6[${i}]`;
    const widget = extraction.widgetsByName.get(key);
    if (widget && resolveCheckboxFast(widget, []).checked) {
      return BUSINESS_TYPE_OPTIONS[i] ?? null;
    }
  }
  return null;
}

function resolveAttachment(extraction: PDFExtraction): AttachmentForm {
  const keys = [
    'SC-103[0].Page1[0].Attachement[0].CheckBox1[0]', // SC-100
    'SC-103[0].Page1[0].Attachement[0].CheckBox2[0]', // SC-120
    'SC-103[0].Page1[0].Attachement[0].CheckBox3[0]', // SC-500
  ];
  for (let i = 0; i < keys.length; i++) {
    const widget = extraction.widgetsByName.get(keys[i] ?? '');
    if (widget && resolveCheckboxFast(widget, []).checked) {
      return ATTACHMENT_OPTIONS[i] ?? null;
    }
  }
  return null;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface SC103ExtractionResult {
  data: Record<string, unknown>;
  fieldResults: FieldResult[];
}

export function extractSC103(extraction: PDFExtraction): SC103ExtractionResult {
  const data: Record<string, unknown> = {};
  const fieldResults: FieldResult[] = [];

  // Text fields
  for (const field of SC103_TEXT_FIELDS) {
    const widget = extraction.widgetsByName.get(field.mapping);
    const value = widget ? widget.value.trim() : null;
    const result = scoreField(
      field.id,
      field.question,
      field.mapping,
      value,
      widget ? 'widget' : 'default',
    );
    fieldResults.push(result);
    data[field.id] = value ?? '';
  }

  // MCQ: business type
  const businessType = resolveBusinessType(extraction);
  fieldResults.push({
    fieldId: 'sc103-business-type',
    question: 'What is the business classified as',
    mapping: '',
    value: businessType,
    confidence: businessType ? 0.9 : 0.4,
    method: 'widget',
  });
  data['sc103-business-type'] = businessType;

  // MCQ: which form is SC-103 attached to
  const attachment = resolveAttachment(extraction);
  fieldResults.push({
    fieldId: 'sc103-attachment',
    question: 'This form is attached to',
    mapping: '',
    value: attachment,
    confidence: attachment ? 0.9 : 0.4,
    method: 'widget',
  });
  data['sc103-attachment'] = attachment;

  return { data, fieldResults };
}
