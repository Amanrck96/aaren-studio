import { uploadFileToFirebase } from "./firebaseStorage";

export async function uploadFileWithCompression(
  file: File,
  folder: string = "General Uploads"
): Promise<{ success: boolean; url?: string; dataUrl?: string; error?: string }> {
  try {
    let fileToUpload: File = file;

    // Compress images client-side if > 800KB for fast uploads (1980x1020 standard)
    if (file.type.startsWith("image/") && file.size > 800 * 1024) {
      try {
        fileToUpload = await compressImageClient(file, 1980, 0.88);
      } catch (cErr) {
        console.warn("Client image compression fallback:", cErr);
      }
    }

    // 1. Direct Google Firebase Storage Upload via Client SDK (Zero Vercel Limits)
    try {
      const fbResult = await uploadFileToFirebase(fileToUpload, folder);
      if (fbResult && fbResult.url) {
        // Register in Media Store non-blockingly
        fetch("/api/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            fileUrl: fbResult.url,
            fileType: file.type.startsWith("image/") ? "Image" : file.name.endsWith(".pdf") ? "PDF" : "Document",
            folder: folder,
            size: (file.size / 1024).toFixed(1) + " KB",
          }),
        }).catch(() => {});

        return { success: true, url: fbResult.url, dataUrl: fbResult.url };
      }
    } catch (fbErr: any) {
      console.warn("Direct Firebase Storage client SDK upload failed, attempting fallback:", fbErr);
    }

    // 2. Fallback to /api/upload if Firebase Storage direct SDK was blocked by local network
    console.warn("Attempting fallback api endpoint...");
    const formData = new FormData();
    formData.append("file", fileToUpload);
    formData.append("folder", folder);

    const fallbackRes = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (fallbackRes.status === 413) {
      return {
        success: false,
        error: "File is too large for fallback upload (>4.5MB). Please use Google Firebase Storage or paste a Google Drive link.",
      };
    }

    const text = await fallbackRes.text();
    let json: any = null;
    try {
      json = JSON.parse(text);
    } catch {
      return {
        success: false,
        error: `Upload server returned an unexpected error (${fallbackRes.status}). Please check your internet connection or use a Google Drive link.`,
      };
    }

    if (!fallbackRes.ok || !json?.success) {
      throw new Error(json?.error || "File upload failed.");
    }

    return { success: true, url: json.url || json.dataUrl, dataUrl: json.dataUrl || json.url };
  } catch (err: any) {
    console.error("Upload helper exception:", err);
    return { success: false, error: err.message || "Upload error" };
  }
}

/**
 * Compress an image file using HTML5 Canvas.
 */
function compressImageClient(file: File, maxWidth: number, quality: number): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.src = url;

    img.onload = () => {
      URL.revokeObjectURL(url);
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(file);

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return resolve(file);
          const compressedFile = new File([blob], file.name, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
  });
}
