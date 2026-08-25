/**
 * Client-Side PDF Page-1 Cover Extractor
 * Automatically renders page 1 of any uploaded PDF file to a crisp JPEG image
 * without needing any backend server or third-party paid API.
 */

declare global {
  interface Window {
    pdfjsLib?: any;
  }
}

/**
 * Load pdf.js dynamically from CDN if not already present on window
 */
async function loadPdfJs(): Promise<any> {
  if (typeof window === "undefined") return null;
  if (window.pdfjsLib) return window.pdfjsLib;

  return new Promise((resolve) => {
    const existingScript = document.getElementById("pdfjs-cdn-script");
    if (existingScript) {
      const check = setInterval(() => {
        if (window.pdfjsLib) {
          clearInterval(check);
          resolve(window.pdfjsLib);
        }
      }, 50);
      setTimeout(() => {
        clearInterval(check);
        resolve(window.pdfjsLib || null);
      }, 5000);
      return;
    }

    const script = document.createElement("script");
    script.id = "pdfjs-cdn-script";
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;

    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        resolve(window.pdfjsLib);
      } else {
        resolve(null);
      }
    };

    script.onerror = (err) => {
      console.warn("Failed to load PDF.js from CDN:", err);
      resolve(null);
    };

    document.head.appendChild(script);
  });
}

/**
 * Extract Page 1 from a PDF File or ArrayBuffer and return as a JPEG File
 */
export async function extractFirstPageAsImage(
  pdfFileOrBuffer: File | ArrayBuffer,
  fileName?: string
): Promise<File | null> {
  try {
    const pdfjs = await loadPdfJs();
    if (!pdfjs) {
      console.warn("pdfjsLib is not available");
      return null;
    }

    let arrayBuffer: ArrayBuffer;
    let baseName = "catalog";

    if (pdfFileOrBuffer instanceof File) {
      arrayBuffer = await pdfFileOrBuffer.arrayBuffer();
      baseName = pdfFileOrBuffer.name.replace(/\.[^/.]+$/, "");
    } else {
      arrayBuffer = pdfFileOrBuffer;
      if (fileName) baseName = fileName.replace(/\.[^/.]+$/, "");
    }

    const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdf = await loadingTask.promise;
    if (!pdf || pdf.numPages === 0) return null;

    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 2.0 }); // 2x high resolution

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Fill white background before rendering
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
        0.92
      );
    });
  } catch (err) {
    console.warn("Automatic PDF Page-1 capture warning:", err);
    return null;
  }
}
