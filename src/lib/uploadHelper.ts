/**
 * Client-side file uploader with automatic image compression to prevent Vercel 413 Request Entity Too Large errors.
 */
export async function uploadFileWithCompression(
  file: File,
  folder: string = "General Uploads"
): Promise<{ success: boolean; url?: string; dataUrl?: string; error?: string }> {
  try {
    let fileToUpload: File = file;

    // If file is an image and larger than 800KB, compress it client-side via HTML5 Canvas
    if (file.type.startsWith("image/") && file.size > 800 * 1024) {
      try {
        fileToUpload = await compressImageClient(file, 1920, 0.82);
      } catch (cErr) {
        console.warn("Client image compression fallback:", cErr);
      }
    }

    const formData = new FormData();
    formData.append("file", fileToUpload);
    formData.append("folder", folder);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const text = await res.text();
      if (res.status === 413 || text.includes("Request Entity Too Large")) {
        throw new Error("File is too large for upload. Please select a smaller file (under 5MB).");
      }
      throw new Error(`Upload server error (${res.status}): ${text.substring(0, 100)}`);
    }

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "File upload failed.");
    }

    return { success: true, url: json.url || json.dataUrl, dataUrl: json.dataUrl || json.url };
  } catch (err: any) {
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
