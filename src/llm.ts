/**
 * Layer 6 — LLM Fallback (Google Gemini Vision API)
 *
 * Triggered only when:
 *   - No text layer detected in the PDF, OR
 *   - Overall confidence score < 0.7, OR
 *   - flaggedFields.length > 3
 *
 * Never called as first resort — only as targeted fallback for flagged fields.
 *
 * Renders each PDF page as a PNG image, sends it to the Gemini vision API,
 * and asks it to fill in only the specific flagged fields.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync } from 'fs';
import type { FieldResult } from './types.ts';
import { ExtractionError } from './types.ts';
import mupdf from 'mupdf';

const VISION_MODEL = 'gemini-2.0-flash';

// ─── Page count helper ────────────────────────────────────────────────────────

function getPageCount(filePath: string): number {
  const buf = readFileSync(filePath);
  const doc = mupdf.Document.openDocument(buf, 'application/pdf') as {
    countPages(): number;
  };
  return doc.countPages();
}

// ─── PNG renderer (uses mupdf Pixmap.asPNG) ───────────────────────────────────

function renderPageAsPNG(filePath: string, pageIndex: number): Buffer {
  const buf = readFileSync(filePath);
  const doc = mupdf.Document.openDocument(buf, 'application/pdf') as {
    loadPage(n: number): {
      toPixmap(
        matrix: number[],
        colorspace: unknown,
        alpha: boolean,
      ): { asPNG(): Uint8Array };
    };
  };
  const page = doc.loadPage(pageIndex);
  // Render at 1.5× for a good balance of quality vs. token cost
  const pixmap = page.toPixmap([1.5, 0, 0, 1.5, 0, 0], mupdf.ColorSpace.DeviceRGB, false);
  return Buffer.from(pixmap.asPNG());
}

// ─── Single-page LLM extraction ──────────────────────────────────────────────

async function extractPageWithLLM(
  genAI: GoogleGenerativeAI,
  pngBuffer: Buffer,
  questions: string[],
  formType: string,
): Promise<Map<string, string | null>> {
  const model = genAI.getGenerativeModel({ model: VISION_MODEL });

  const prompt =
    `You are extracting data from a California ${formType} small claims court form.\n` +
    `Extract ONLY the following fields from the image. ` +
    `If a field is blank or cannot be found, return null for that field.\n\n` +
    `Fields to extract:\n` +
    questions.map((q, i) => `${i + 1}. ${q}`).join('\n') +
    `\n\nReturn ONLY a valid JSON object like:\n` +
    `{"field name": "value", "other field": null}\n` +
    `No explanation, no markdown fences.`;

  const result = await model.generateContent([
    prompt,
    { inlineData: { mimeType: 'image/png', data: pngBuffer.toString('base64') } },
  ]);

  const rawText = result.response.text();

  // Strip any accidental markdown fences
  const json = rawText.replace(/```json?|```/g, '').trim();

  let parsed: Record<string, string | null>;
  try {
    parsed = JSON.parse(json) as Record<string, string | null>;
  } catch {
    console.warn('[llm] JSON parse failed for response:', rawText.slice(0, 200));
    parsed = {};
  }

  return new Map(Object.entries(parsed));
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface LLMFallbackOptions {
  filePath: string;
  formType: string;
  flaggedFields: Array<{ question: string; page?: number }>;
}

export interface LLMFallbackResult {
  /** Maps question → extracted value */
  values: Map<string, string | null>;
  /** Which pages were sent to the LLM */
  pagesUsed: number[];
}

/**
 * Run the LLM fallback for the given flagged fields.
 *
 * Groups fields by page (defaulting to page 1) to minimise API calls —
 * each unique page index becomes one vision API request.
 */
export async function llmFallback(
  opts: LLMFallbackOptions,
): Promise<LLMFallbackResult> {
  const apiKey = process.env['GEMINI_API_KEY'];
  if (!apiKey) {
    throw new ExtractionError(
      'LLMFallbackFailed',
      'GEMINI_API_KEY environment variable is not set',
    );
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const allValues = new Map<string, string | null>();
  const pagesUsed = new Set<number>();

  const pageCount = getPageCount(opts.filePath);
  const lastPage = pageCount - 1;

  // Group flagged fields by page.
  // Default to page index 0 (first page) and clamp to the document's last page
  // so a field hint of e.g. 1 never crashes a single-page PDF like SC-103.
  const byPage = new Map<number, string[]>();
  for (const field of opts.flaggedFields) {
    const raw = field.page ?? 0;
    const page = Math.min(raw, lastPage);
    const existing = byPage.get(page) ?? [];
    existing.push(field.question);
    byPage.set(page, existing);
  }

  for (const [pageIndex, questions] of byPage) {
    try {
      const png = renderPageAsPNG(opts.filePath, pageIndex);
      const pageValues = await extractPageWithLLM(
        genAI,
        png,
        questions,
        opts.formType,
      );
      for (const [k, v] of pageValues) {
        allValues.set(k, v);
      }
      pagesUsed.add(pageIndex);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(
        `[llm] Failed on page ${pageIndex} of ${opts.filePath}: ${msg}`,
      );
      throw new ExtractionError(
        'LLMFallbackFailed',
        `LLM fallback failed on page ${pageIndex}: ${msg}`,
        { filePath: opts.filePath, pageIndex, questions },
      );
    }
  }

  return { values: allValues, pagesUsed: [...pagesUsed] };
}

/**
 * Merge LLM-extracted values back into a fieldResults array.
 * Updates any field whose question appears in the LLM result map with
 * the LLM value and a confidence of 0.8.
 */
export function mergeLLMResults(
  fieldResults: FieldResult[],
  llmValues: Map<string, string | null>,
): FieldResult[] {
  return fieldResults.map((f) => {
    const llmValue = llmValues.get(f.question);
    if (llmValue === undefined) return f; // LLM didn't answer this field
    if (llmValue === null) return f;       // LLM returned null — keep original

    return {
      ...f,
      value: llmValue,
      confidence: 0.8,
      method: 'llm' as const,
    };
  });
}
