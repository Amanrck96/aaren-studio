/**
 * Client-Side PDF Page-1 Cover Extractor
 * Automatically renders page 1 of any uploaded PDF file or remote PDF URL to a crisp JPEG image.
 * Features:
 * - Direct memory arrayBuffer parsing for uploaded File objects (instant, zero CORS)
 * - Automatic proxy fallback for remote Firebase / external URLs when direct browser fetch hits CORS
 * - Google Drive thumbnail extraction support
 * - Rich step-level instrumentation & error diagnosis
 * - 1x Automatic retry on transient failures
 */

export interface ExtractionResult {
  file: File | null;
  error?: string;
  step?: "INPUT_RESOLUTION" | "FETCH_DIRECT" | "FETCH_PROXY" | "PDFJS_INIT" | "DOCUMENT_PARSE" | "PAGE_RENDER" | "IMAGE_BLOB";
  details?: any;
}

/**
 * Check if a URL points to Google Drive and extract the file ID.
 */
function getGoogleDriveId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  return match && match[1] ? match[1] : null;
}

/**
 * Fetch a Google Drive high-resolution thumbnail and convert to a File object.
 */
async function fetchGoogleDriveThumbnailAsFile(driveId: string, baseName: string): Promise<File | null> {
  const thumbUrl = `https://drive.google.com/thumbnail?id=${driveId}&sz=w1200`;
  try {
    let res = await fetch(thumbUrl, { mode: "cors" }).catch(() => null);
    if (!res || !res.ok) {
      // Fallback via proxy
      res = await fetch(`/api/proxy-pdf?url=${encodeURIComponent(thumbUrl)}`);
    }
    if (!res || !res.ok) return null;
    const blob = await res.blob();
    return new File([blob], `${baseName}_page1_cover.jpg`, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch (err) {
    console.warn("[PDF Cover Extractor] Google Drive thumbnail fetch fallback notice:", err);
    return null;
  }
}

/**
 * Detailed extractor with step tracking
 */
export async function extractFirstPageWithDetails(
  pdfInput: File | ArrayBuffer | string,
  fileName?: string
): Promise<ExtractionResult> {
  if (typeof window === "undefined") {
    return { file: null, error: "Window is not defined (Server environment)", step: "INPUT_RESOLUTION" };
  }

  let currentStep: ExtractionResult["step"] = "INPUT_RESOLUTION";
  let baseName = fileName ? fileName.replace(/\.[^/.]+$/, "") : "catalog";

  try {
    let arrayBuffer: ArrayBuffer | null = null;

    // ── STEP 1: RESOLVE INPUT BINARY DATA ──
    if (pdfInput instanceof File) {
      currentStep = "INPUT_RESOLUTION";
      console.log(`[PDF Cover Extractor] Processing local File object: "${pdfInput.name}" (${(pdfInput.size / 1024).toFixed(1)} KB)`);
      baseName = pdfInput.name.replace(/\.[^/.]+$/, "");
      arrayBuffer = await pdfInput.arrayBuffer();
    } else if (pdfInput instanceof ArrayBuffer) {
      currentStep = "INPUT_RESOLUTION";
      console.log(`[PDF Cover Extractor] Processing ArrayBuffer (${(pdfInput.byteLength / 1024).toFixed(1)} KB)`);
      arrayBuffer = pdfInput;
    } else if (typeof pdfInput === "string") {
      const trimmedUrl = pdfInput.trim();
      if (!trimmedUrl) {
        return { file: null, error: "Empty PDF URL or file input provided", step: "INPUT_RESOLUTION" };
      }

      // Check if it's a Google Drive link
      const driveId = getGoogleDriveId(trimmedUrl);
      if (driveId) {
        console.log(`[PDF Cover Extractor] Detected Google Drive URL (ID: ${driveId}). Fetching direct cover thumbnail...`);
        const gDriveCover = await fetchGoogleDriveThumbnailAsFile(driveId, baseName);
        if (gDriveCover) {
          console.log(`[PDF Cover Extractor] ✅ Successfully extracted Google Drive cover thumbnail (${(gDriveCover.size / 1024).toFixed(1)} KB)`);
          return { file: gDriveCover };
        }
      }

      // Determine absolute or local target URL
      let targetUrl = trimmedUrl;
      if (trimmedUrl.startsWith("/")) {
        targetUrl = `${window.location.origin}${trimmedUrl}`;
      }

      // Try Step 2a: Direct Fetch
      currentStep = "FETCH_DIRECT";
      console.log(`[PDF Cover Extractor] Attempting direct fetch for: ${targetUrl}`);
      try {
        const directRes = await fetch(targetUrl, { mode: "cors" });
        if (directRes.ok) {
          arrayBuffer = await directRes.arrayBuffer();
          console.log(`[PDF Cover Extractor] Direct fetch successful (${(arrayBuffer.byteLength / 1024).toFixed(1)} KB)`);
        } else {
          console.warn(`[PDF Cover Extractor] Direct fetch returned status ${directRes.status} ${directRes.statusText}`);
        }
      } catch (directErr: any) {
        console.warn(`[PDF Cover Extractor] Direct fetch failed (likely CORS or network): ${directErr.message}`);
      }

      // Step 2b: Fallback to Server Proxy if Direct Fetch Failed
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        currentStep = "FETCH_PROXY";
        console.log(`[PDF Cover Extractor] Falling back to server-side PDF proxy for: ${trimmedUrl}`);
        const proxyUrl = `/api/proxy-pdf?url=${encodeURIComponent(trimmedUrl)}`;
        const proxyRes = await fetch(proxyUrl);
        if (!proxyRes.ok) {
          const errText = await proxyRes.text().catch(() => "");
          throw new Error(`Failed to load PDF via proxy (HTTP ${proxyRes.status}): ${errText || proxyRes.statusText}`);
        }
        arrayBuffer = await proxyRes.arrayBuffer();
        console.log(`[PDF Cover Extractor] Proxy fetch successful (${(arrayBuffer.byteLength / 1024).toFixed(1)} KB)`);
      }
    }

    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      return { file: null, error: "PDF binary data is empty or could not be loaded", step: currentStep };
    }

    // ── STEP 3: INITIALIZE PDF.JS & WORKER ──
    currentStep = "PDFJS_INIT";
    const pdfjsLib = await import("pdfjs-dist");
    const pdfjs = (pdfjsLib as any).getDocument ? pdfjsLib : ((pdfjsLib as any).default || pdfjsLib);

    // Set same-origin absolute worker URL to prevent cross-origin worker SecurityErrors
    if (pdfjs.GlobalWorkerOptions) {
      const workerOrigin = window.location.origin;
      pdfjs.GlobalWorkerOptions.workerSrc = `${workerOrigin}/pdf.worker.min.js`;
    }

    // ── STEP 4: PARSE PDF DOCUMENT ──
    currentStep = "DOCUMENT_PARSE";
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(arrayBuffer),
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
      cMapUrl: "https://unpkg.com/pdfjs-dist@3.11.174/cmaps/",
      cMapPacked: true,
      standardFontDataUrl: "https://unpkg.com/pdfjs-dist@3.11.174/standard_fonts/",
    });

    const pdf = await loadingTask.promise;
    if (!pdf || pdf.numPages === 0) {
      return { file: null, error: "PDF parsed successfully but contains 0 pages", step: "DOCUMENT_PARSE" };
    }

    console.log(`[PDF Cover Extractor] PDF parsed successfully (${pdf.numPages} total pages). Extracting Page 1...`);

    // ── STEP 5: RENDER PAGE 1 TO HIGH-DPI CANVAS ──
    currentStep = "PAGE_RENDER";
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.5 }); // High resolution crisp cover

    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      return { file: null, error: "Failed to create 2D canvas context", step: "PAGE_RENDER" };
    }

    // Fill clean white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };

    await page.render(renderContext).promise;

    // ── STEP 6: EXPORT CANVAS AS JPEG BLOB / FILE ──
    currentStep = "IMAGE_BLOB";
    const coverFile = await new Promise<File | null>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return resolve(null);
          const safeName = baseName.replace(/[^a-zA-Z0-9_-]/g, "_");
          const file = new File([blob], `${safeName}_page1_cover.jpg`, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          resolve(file);
        },
        "image/jpeg",
        0.92
      );
    });

    if (!coverFile) {
      return { file: null, error: "Canvas toBlob() failed to produce an image", step: "IMAGE_BLOB" };
    }

    console.log(`[PDF Cover Extractor] ✅ Page 1 cover generated successfully: ${coverFile.name} (${(coverFile.size / 1024).toFixed(1)} KB)`);
    return { file: coverFile };
  } catch (err: any) {
    console.error(`[PDF Cover Extractor] ❌ Error at step [${currentStep}]:`, err);
    return {
      file: null,
      error: err.message || "Unknown error during PDF cover extraction",
      step: currentStep,
      details: err,
    };
  }
}

/**
 * Extract first page as image with automatic 1x retry on transient failures
 */
export async function extractFirstPageAsImage(
  pdfInput: File | ArrayBuffer | string,
  fileName?: string
): Promise<File | null> {
  // First attempt
  const result = await extractFirstPageWithDetails(pdfInput, fileName);
  if (result.file) {
    return result.file;
  }

  // If first attempt failed, retry once with a small delay
  console.warn(`[PDF Cover Extractor] First attempt failed at [${result.step}]: ${result.error}. Retrying extraction in 400ms...`);
  await new Promise((resolve) => setTimeout(resolve, 400));

  const retryResult = await extractFirstPageWithDetails(pdfInput, fileName);
  if (retryResult.file) {
    console.log(`[PDF Cover Extractor] ✅ Retry succeeded! Page 1 cover extracted.`);
    return retryResult.file;
  }

  console.error(`[PDF Cover Extractor] ❌ Extraction failed after retry at [${retryResult.step}]: ${retryResult.error}`);
  return null;
}
