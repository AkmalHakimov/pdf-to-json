/**
 * Layer 1 — MuPDF Extraction
 *
 * Wraps the mupdf npm package to extract:
 *  - Text blocks with x/y bounding boxes from every page
 *  - AcroForm widget data (field names, values, types)
 *  - Whether the PDF has a machine-readable text layer
 */

import mupdf from 'mupdf';
import { readFileSync } from 'fs';
import type { TextLine, PDFWidget, PDFExtraction } from './types.ts';
import { ExtractionError } from './types.ts';

// ─── Internal JSON shapes returned by mupdf StructuredText.asJSON() ──────────

interface MuPDFBBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface MuPDFLine {
  text?: string;
  bbox: MuPDFBBox;
  font?: { name?: string; size?: number };
}

interface MuPDFBlock {
  type: string;
  lines?: MuPDFLine[];
}

interface MuPDFPage {
  blocks: MuPDFBlock[];
}

// ─── Main extraction function ─────────────────────────────────────────────────

export async function extractPDF(pdfPath: string): Promise<PDFExtraction> {
  let buf: Buffer;
  try {
    buf = readFileSync(pdfPath);
  } catch (err) {
    throw new ExtractionError(
      'NoTextLayer',
      `Cannot read PDF file: ${pdfPath}`,
      err,
    );
  }

  // Open two handles: one for text extraction, one for AcroForm widgets
  const doc = mupdf.Document.openDocument(buf, 'application/pdf') as {
    countPages(): number;
    loadPage(n: number): MuPDFDocPage;
  };
  const pdfDoc = new mupdf.PDFDocument(buf) as {
    loadPage(n: number): MuPDFPdfPage;
  };

  const pageCount = doc.countPages();
  const textLines: TextLine[] = [];
  const allWidgets: PDFWidget[] = [];
  let hasTextLayer = false;

  for (let p = 0; p < pageCount; p++) {
    // ── Text extraction ──────────────────────────────────────────────────────
    const page = doc.loadPage(p);
    const stext = page.toStructuredText('preserve-whitespace') as {
      asJSON(): string;
    };
    const pageJson = JSON.parse(stext.asJSON()) as MuPDFPage;

    for (const block of pageJson.blocks) {
      if (block.type !== 'text') continue;
      for (const line of block.lines ?? []) {
        const text = (line.text ?? '').trim();
        if (!text) continue;

        hasTextLayer = true;
        const b = line.bbox;
        textLines.push({
          text,
          bbox: [b.x, b.y, b.x + b.w, b.y + b.h],
          page: p,
          fontSize: line.font?.size,
          fontName: line.font?.name,
        });
      }
    }

    // ── Widget extraction ────────────────────────────────────────────────────
    const pdfPage = pdfDoc.loadPage(p);
    const pageWidgets = (pdfPage.getWidgets() as MuPDFWidget[] | null) ?? [];

    for (const w of pageWidgets) {
      try {
        const rect = w.getBounds() as [number, number, number, number];
        const ft = w.getFieldType() as string;
        const name = (w.getName?.() as string | undefined) ?? '';
        const rawValue = (w.getValue?.() as string | undefined) ?? '';

        const fieldType: PDFWidget['fieldType'] =
          ft === 'text'
            ? 'text'
            : ft === 'checkbox'
              ? 'checkbox'
              : ft === 'button'
                ? 'button'
                : 'unknown';

        allWidgets.push({
          name,
          fieldType,
          value: String(rawValue),
          bbox: rect,
          page: p,
        });
      } catch {
        // Skip malformed widget entries
      }
    }
  }

  // Exclude link/action buttons from the lookup map — they carry no form data
  const widgets = allWidgets.filter((w) => w.fieldType !== 'button');
  const widgetsByName = new Map<string, PDFWidget>(
    widgets.filter((w) => w.name !== '').map((w) => [w.name, w]),
  );

  return {
    filePath: pdfPath,
    pageCount,
    hasTextLayer,
    textLines,
    widgets,
    widgetsByName,
  };
}

// ─── Pixel renderer for checkbox fallback ────────────────────────────────────

/**
 * Renders a single PDF page to a greyscale pixmap and returns raw pixel bytes.
 * Used by the checkbox resolver when the widget value is ambiguous.
 */
export function renderPageGrayscale(
  filePath: string,
  pageIndex: number,
  scale = 2,
): { pixels: Uint8ClampedArray; width: number; height: number } {
  const buf = readFileSync(filePath);
  const doc = mupdf.Document.openDocument(buf, 'application/pdf') as {
    loadPage(n: number): MuPDFDocPage;
  };
  const page = doc.loadPage(pageIndex);
  const pixmap = (
    page as unknown as {
      toPixmap(
        matrix: number[],
        colorspace: unknown,
        alpha: boolean,
      ): MuPDFPixmap;
    }
  ).toPixmap([scale, 0, 0, scale, 0, 0], mupdf.ColorSpace.DeviceGray, false);

  return {
    pixels: pixmap.getPixels() as Uint8ClampedArray,
    width: pixmap.getWidth() as number,
    height: pixmap.getHeight() as number,
  };
}

// ─── Internal mupdf interface shims (avoid importing private types) ───────────

interface MuPDFDocPage {
  toStructuredText(flags: string): unknown;
  toPixmap(matrix: number[], colorspace: unknown, alpha: boolean): unknown;
}

interface MuPDFPdfPage {
  getWidgets(): unknown[] | null;
}

interface MuPDFWidget {
  getBounds(): unknown;
  getFieldType(): unknown;
  getName?(): unknown;
  getValue?(): unknown;
}

interface MuPDFPixmap {
  getPixels(): Uint8ClampedArray;
  getWidth(): number;
  getHeight(): number;
}
