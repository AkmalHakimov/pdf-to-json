/**
 * Layer 7 — Orchestrator
 *
 * Wires all layers together for each PDF in src/data/:
 *
 *   extractPDF → detectFormType → per-form extractor
 *     → confidence scoring → (optional LLM fallback)
 *     → write output JSON
 *
 * Errors in a single form do NOT abort the run — they are captured in the
 * extraction report so the other forms can still be processed.
 */

import { writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

import { extractPDF } from './extract.ts';
import { detectFormType } from './detect.ts';
import { extractSC100 } from './extractors/sc100.ts';
import { extractSC101 } from './extractors/sc101.ts';
import { extractSC103 } from './extractors/sc103.ts';
import { extractGeneric } from './extractors/generic.ts';
import {
  computeOverallConfidence,
  flagLowConfidenceFields,
} from './validator.ts';
import { llmFallback, mergeLLMResults } from './llm.ts';
import type {
  FormType,
  FieldResult,
  ExtractionOutput,
  ReportEntry,
  ExtractionReport,
} from './types.ts';
import { ExtractionError } from './types.ts';

// ─── Paths ────────────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, 'data');
const OUTPUT_DIR = join(__dirname, '..', 'output');

const PDF_FILES: Array<{ name: string; file: string }> = readdirSync(DATA_DIR)
  .filter((f) => f.toLowerCase().endsWith('.pdf'))
  .map((f) => ({ name: basename(f, '.pdf'), file: join(DATA_DIR, f) }));

// ─── LLM trigger thresholds ───────────────────────────────────────────────────

const LLM_CONFIDENCE_THRESHOLD = 0.7;
const LLM_FLAGGED_COUNT_THRESHOLD = 3;

// ─── Per-form processing ──────────────────────────────────────────────────────

async function processForm(
  pdfPath: string,
  outputBaseName: string,
): Promise<ReportEntry> {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`Processing: ${pdfPath}`);

  // ── Layer 1: Extract ─────────────────────────────────────────────────────
  const extraction = await extractPDF(pdfPath);
  console.log(
    `  Pages: ${extraction.pageCount}  |  ` +
      `Text lines: ${extraction.textLines.length}  |  ` +
      `Widgets: ${extraction.widgets.length}  |  ` +
      `Has text layer: ${extraction.hasTextLayer}`,
  );

  if (!extraction.hasTextLayer) {
    console.warn('  ⚠  No text layer detected — LLM fallback will be used');
  }

  // ── Layer 2: Detect form type ────────────────────────────────────────────
  const formType = detectFormType(extraction);
  console.log(`  Form type: ${formType}`);

  // ── Layer 3: Per-form extraction ─────────────────────────────────────────
  let data: unknown;
  let fieldResults: FieldResult[];

  if (formType === 'unknown') {
    // ── Path B: Dynamic anchor + widget extraction ───────────────────────────
    // Form type could not be determined — discover all fields spatially from
    // the PDF layout itself (no predefined schema required).
    // LLM vision is used only to fill fields still empty after text extraction.
    console.log('  → Path B: anchor + widget extraction (LLM fallback for empty fields)');
    const result = await extractGeneric(extraction);
    data = result.output;
    fieldResults = result.fieldResults;
    const confidence = computeOverallConfidence(fieldResults);
    const flagged = flagLowConfidenceFields(fieldResults);
    console.log(
      `  ✓ Generic extracted ${fieldResults.length} fields  |  ` +
        `confidence=${(confidence * 100).toFixed(1)}%  flagged=${flagged.length}`,
    );
    const output: ExtractionOutput = {
      formType: 'unknown',
      extractedAt: new Date().toISOString(),
      confidence,
      flaggedFields: flagged,
      data,
    };
    const outputFile = join(OUTPUT_DIR, `${outputBaseName}.json`);
    writeFileSync(outputFile, JSON.stringify(output, null, 2));
    console.log(`  ✓ Saved: ${outputFile}`);
    return { formType: 'unknown', outputFile, confidence, flaggedFields: flagged, status: 'success' };
  }

  // ── Path A: Deterministic extraction for known Judicial Council forms ──────
  console.log('  → Path A: deterministic extraction');
  if (formType === 'SC-100') {
    const result = extractSC100(extraction);
    data = result.schema;
    fieldResults = result.fieldResults;
  } else if (formType === 'SC-101') {
    const result = extractSC101(extraction);
    data = result.data;
    fieldResults = result.fieldResults;
  } else {
    const result = extractSC103(extraction);
    data = result.data;
    fieldResults = result.fieldResults;
  }

  // ── Layer 5: Score ───────────────────────────────────────────────────────
  let confidence = computeOverallConfidence(fieldResults);
  let flagged = flagLowConfidenceFields(fieldResults);

  console.log(
    `  Confidence: ${(confidence * 100).toFixed(1)}%  |  ` +
      `Flagged fields: ${flagged.length}`,
  );

  // ── Layer 6: LLM fallback for low-confidence fields ───────────────────────
  const needsLLM =
    !extraction.hasTextLayer ||
    confidence < LLM_CONFIDENCE_THRESHOLD ||
    flagged.length > LLM_FLAGGED_COUNT_THRESHOLD;

  if (needsLLM && process.env['GEMINI_API_KEY']) {
    console.log(
      `  → LLM fallback triggered ` +
        `(confidence=${confidence.toFixed(2)}, flagged=${flagged.length})`,
    );

    // Only ask LLM about the flagged questions, limiting to avoid huge prompts
    const toAsk = fieldResults
      .filter((f) => f.confidence < LLM_CONFIDENCE_THRESHOLD && f.mapping)
      .slice(0, 20) // cap at 20 fields per call
      .map((f) => ({ question: f.question, page: 1 }));

    if (toAsk.length > 0) {
      try {
        const llmResult = await llmFallback({
          filePath: pdfPath,
          formType,
          flaggedFields: toAsk,
        });
        fieldResults = mergeLLMResults(fieldResults, llmResult.values);
        console.log(
          `  ✓ LLM filled ${llmResult.values.size} fields ` +
            `(pages used: ${llmResult.pagesUsed.join(', ')})`,
        );

        // Re-score after LLM merge
        confidence = computeOverallConfidence(fieldResults);
        flagged = flagLowConfidenceFields(fieldResults);
      } catch (err) {
        if (err instanceof ExtractionError) {
          console.error(`  ✗ LLM fallback failed: ${err.message}`);
        } else {
          console.error(`  ✗ LLM fallback unexpected error:`, err);
        }
        // Continue with deterministic results — do not abort
      }
    }
  } else if (needsLLM && !process.env['GEMINI_API_KEY']) {
    console.warn(
      '  ⚠  LLM fallback would help but GEMINI_API_KEY is not set',
    );
  }

  // ── Layer 7: Write output ────────────────────────────────────────────────
  const output: ExtractionOutput = {
    formType,
    extractedAt: new Date().toISOString(),
    confidence,
    flaggedFields: flagged,
    data,
  };

  const outputFile = join(OUTPUT_DIR, `${outputBaseName}.json`);
  writeFileSync(outputFile, JSON.stringify(output, null, 2));
  console.log(`  ✓ Saved: ${outputFile}`);

  return {
    formType,
    outputFile,
    confidence,
    flaggedFields: flagged,
    status: 'success',
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('California Small Claims PDF Extractor');
  console.log('======================================');

  mkdirSync(OUTPUT_DIR, { recursive: true });

  const report: ExtractionReport = {
    generatedAt: new Date().toISOString(),
    forms: [],
  };

  for (const { name, file } of PDF_FILES) {
    try {
      const entry = await processForm(file, name);
      report.forms.push(entry);
    } catch (err) {
      const isTyped = err instanceof ExtractionError;
      const message = err instanceof Error ? err.message : String(err);
      const code = isTyped ? err.code : 'UnknownError';

      console.error(`\n✗ Failed to process ${name}: [${code}] ${message}`);
      if (isTyped && err.context) {
        console.error('  Context:', JSON.stringify(err.context, null, 2));
      }

      report.forms.push({
        formType: name.toUpperCase() as FormType,
        outputFile: join(OUTPUT_DIR, `${name}.json`),
        confidence: 0,
        flaggedFields: [],
        status: 'failed',
        error: `[${code}] ${message}`,
      });
    }
  }

  // ── Write extraction report ───────────────────────────────────────────────
  const reportFile = join(OUTPUT_DIR, 'extraction-report.json');
  writeFileSync(reportFile, JSON.stringify(report, null, 2));

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log(`\n${'═'.repeat(60)}`);
  console.log('Extraction complete');
  console.log('─'.repeat(60));
  for (const form of report.forms) {
    const icon = form.status === 'success' ? '✓' : '✗';
    const pct = (form.confidence * 100).toFixed(1);
    console.log(
      `  ${icon} ${form.formType.padEnd(8)} ` +
        `confidence=${pct}%  flagged=${form.flaggedFields.length}  ` +
        `status=${form.status}`,
    );
  }
  console.log(`\n  Report: ${reportFile}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
