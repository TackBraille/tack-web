// Client-side PDF text extraction using pdfjs-dist (lazy-imported)
export async function extractTextFromPdf(file: File): Promise<string> {
  try {
    // Use the legacy build which works better with modern bundlers (vite/webpack)
    const pdfjsLib: any = await import('pdfjs-dist/legacy/build/pdf');

    // Set worker src so pdfjs can spawn worker in the browser when needed.
    // We resolve the worker file relative to the current module so bundlers can pick it up.
    try {
      // @ts-ignore
      if (pdfjsLib?.GlobalWorkerOptions) {
        // eslint-disable-next-line no-undef
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/legacy/build/pdf.worker.min.js', import.meta.url).toString();
      }
    } catch (workerErr) {
      // Non-fatal: some environments may not allow URL resolution; continue without explicit worker
      console.warn('Could not set pdfjs workerSrc, continuing without explicit worker:', workerErr);
    }

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((it: any) => (it.str || '')).join(' ');
        fullText += `\n\n${pageText}`;
      } catch (pageErr) {
        console.warn(`Failed to extract text from page ${i}:`, pageErr);
      }
    }

    const out = fullText.trim();
    if (!out) throw new Error('No extractable text was found in the PDF.');
    return out;
  } catch (err) {
    console.error('extractTextFromPdf error:', err);
    // Provide a clearer error message for the UI
    throw new Error(err instanceof Error ? err.message : String(err));
  }
}
