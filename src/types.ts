// ─── Error types ──────────────────────────────────────────────────────────────

export type ExtractionErrorCode =
  | 'FormTypeUnknown'
  | 'NoTextLayer'
  | 'SchemaValidationFailed'
  | 'LLMFallbackFailed';

export class ExtractionError extends Error {
  constructor(
    public readonly code: ExtractionErrorCode,
    message: string,
    public readonly context?: unknown,
  ) {
    super(message);
    this.name = 'ExtractionError';
  }
}

// ─── Form types ───────────────────────────────────────────────────────────────

export type FormType = 'SC-100' | 'SC-101' | 'SC-103' | 'unknown';

// ─── PDF extraction primitives ────────────────────────────────────────────────

export interface TextLine {
  text: string;
  /** [x1, y1, x2, y2] in PDF points */
  bbox: [number, number, number, number];
  page: number;
  fontSize?: number;
  fontName?: string;
}

export interface PDFWidget {
  name: string;
  fieldType: 'text' | 'checkbox' | 'button' | 'unknown';
  value: string;
  /** [x1, y1, x2, y2] in PDF points */
  bbox: [number, number, number, number];
  page: number;
}

export interface PDFExtraction {
  filePath: string;
  pageCount: number;
  hasTextLayer: boolean;
  textLines: TextLine[];
  /** All non-button widgets */
  widgets: PDFWidget[];
  /** Lookup map: widget name → widget */
  widgetsByName: Map<string, PDFWidget>;
}

// ─── Checkbox resolution ──────────────────────────────────────────────────────

export interface CheckboxResult {
  checked: boolean;
  method: 'widget' | 'symbol' | 'pixel' | 'unknown';
}

// ─── Extraction scoring ───────────────────────────────────────────────────────

export type ExtractionMethod = 'widget' | 'anchor' | 'llm' | 'default';

export interface FieldResult {
  fieldId: string;
  question: string;
  /** The PDF widget mapping path used, or empty string for MCQ/inferred fields */
  mapping: string;
  value: string | boolean | number | null;
  confidence: number;
  method: ExtractionMethod;
}

// ─── Output types ─────────────────────────────────────────────────────────────

export interface ExtractionOutput {
  formType: FormType;
  extractedAt: string;
  /** Overall average confidence (0–1) */
  confidence: number;
  flaggedFields: string[];
  data: unknown;
}

export interface ReportEntry {
  formType: FormType;
  outputFile: string;
  confidence: number;
  flaggedFields: string[];
  status: 'success' | 'failed';
  error?: string;
}

export interface ExtractionReport {
  generatedAt: string;
  forms: ReportEntry[];
}
