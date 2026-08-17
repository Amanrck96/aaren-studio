/**
 * Client-side direct Firebase Storage uploader with fallback.
 * Bypasses Vercel serverless payload limits (4.5MB) completely, allowing large PDFs (10MB, 25MB, 50MB+)
 * and high-resolution images to upload directly to Firebase Storage without errors.
 */

const FIREBASE_STORAGE_BUCKET = "aarenintpro-1c09f.firebasestorage.app";

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

    const cleanFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "_");
    const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const objectPath = `${cleanFolder}/${safeName}`;
    const encodedPath = encodeURIComponent(objectPath);

    // Direct Firebase Storage REST Upload
    const directUploadUrl = `https://firebasestorage.googleapis.com/v0/b/${FIREBASE_STORAGE_BUCKET}/o?name=${encodedPath}&uploadType=media`;

    const res = await fetch(directUploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": fileToUpload.type || "application/octet-stream",
      },
      body: fileToUpload,
    });

    if (res.ok) {
      const json = await res.json();
      const token = json.downloadTokens || json.generation || Date.now().toString();
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${FIREBASE_STORAGE_BUCKET}/o/${encodedPath}?alt=media&token=${token}`;
      return { success: true, url: publicUrl, dataUrl: publicUrl };
    }

    // Fallback to Vercel upload endpoint if direct Firebase upload fails
    console.warn("Direct Firebase upload returned non-200 status, attempting fallback api endpoint...");
    const formData = new FormData();
    formData.append("file", fileToUpload);
    formData.append("folder", folder);

    const fallbackRes = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const json = await fallbackRes.json();
    if (!fallbackRes.ok || !json.success) {
      throw new Error(json.error || "File upload failed.");
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
