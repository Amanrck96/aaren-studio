/**
 * Client-Side PDF Page-1 Cover Extractor
 * Automatically renders page 1 of any uploaded PDF file or remote PDF URL to a crisp JPEG image.
 */

export async function extractFirstPageAsImage(
  pdfInput: File | ArrayBuffer | string,
  fileName?: string
): Promise<File | null> {
  if (typeof window === "undefined") return null;

  try {
    const pdfjsLib = await import("pdfjs-dist");

    // Use same-origin local worker to prevent cross-origin worker SecurityErrors
    if (pdfjsLib.GlobalWorkerOptions) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
    }

    let arrayBuffer: ArrayBuffer;
    let baseName = "catalog";

    if (typeof pdfInput === "string") {
      if (!pdfInput || !pdfInput.startsWith("http")) return null;
      const res = await fetch(pdfInput);
      if (!res.ok) throw new Error(`Could not fetch PDF: ${res.statusText}`);
      arrayBuffer = await res.arrayBuffer();
      baseName = fileName || "catalog_remote";
    } else if (pdfInput instanceof File) {
      arrayBuffer = await pdfInput.arrayBuffer();
      baseName = pdfInput.name.replace(/\.[^/.]+$/, "");
    } else {
      arrayBuffer = pdfInput;
      if (fileName) baseName = fileName.replace(/\.[^/.]+$/, "");
    }

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    });

    const pdf = await loadingTask.promise;
    if (!pdf || pdf.numPages === 0) return null;

    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.5 }); // High resolution crisp cover

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Fill clean white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };

    await page.render(renderContext).promise;

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return resolve(null);
          const coverFile = new File(
            [blob],
            `${baseName}_page1_cover.jpg`,
            { type: "image/jpeg", lastModified: Date.now() }
          );
          resolve(coverFile);
        },
        "image/jpeg",
        0.9
      );
    });
  } catch (err) {
    console.warn("Automatic PDF Page-1 capture note:", err);
    return null;
  }
}
