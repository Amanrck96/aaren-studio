import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { saveMediaStore } from "@/lib/store";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "General Uploads";

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let cleanName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
    if (cleanName.toLowerCase().endsWith(".pdp")) {
      cleanName = cleanName.slice(0, -4) + ".pdf";
    }

    let ext = path.extname(cleanName).toLowerCase();
    const cleanFolder = folder.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "_");
    const storagePath = `${cleanFolder}/${Date.now()}_${cleanName}`;
    let publicUrl = "";

    let mime = file.type;
    if (!mime || mime === "application/octet-stream") {
      if (ext === ".pdf") mime = "application/pdf";
      else if (ext === ".png") mime = "image/png";
      else if (ext === ".jpg" || ext === ".jpeg") mime = "image/jpeg";
      else if (ext === ".webp") mime = "image/webp";
      else if (ext === ".svg") mime = "image/svg+xml";
      else if (ext === ".avif") mime = "image/avif";
      else mime = "application/octet-stream";
    }

    // 1. Primary: Upload directly to Google Firebase Storage
    try {
      const storageRef = ref(storage, storagePath);
      const snapshot = await uploadBytes(storageRef, buffer, {
        contentType: mime,
        cacheControl: "public, max-age=31536000",
      });
      publicUrl = await getDownloadURL(snapshot.ref);
    } catch (fbErr) {
      console.warn("[Server /api/upload] Direct Firebase Storage write notice:", fbErr);
    }

    // 2. Secondary fallback: Local disk write if Firebase failed
    if (!publicUrl) {
      try {
        const filename = `${Date.now()}-${cleanName}`;
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const filePath = path.join(uploadsDir, filename);
        fs.writeFileSync(filePath, buffer);
        publicUrl = `/uploads/${filename}`;
      } catch (fsErr) {
        console.warn("[Server /api/upload] Local FS fallback write notice:", fsErr);
      }
    }

    // 3. Base64 fallback if both failed
    let dataUrl = "";
    if (!publicUrl && buffer.length < 25 * 1024 * 1024) {
      dataUrl = `data:${mime};base64,${buffer.toString("base64")}`;
      publicUrl = dataUrl;
    }

    let fileType: "PDF" | "Image" | "Video" | "Document" = "Document";
    const isImage = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"].includes(ext);
    if (isImage) fileType = "Image";
    else if (ext === ".pdf") fileType = "PDF";
    else if ([".mp4", ".webm", ".mov", ".mkv"].includes(ext)) fileType = "Video";

    const kbSize = (file.size / 1024).toFixed(1) + " KB";
    const finalUrl = publicUrl;

    if (!finalUrl) {
      return NextResponse.json({ success: false, error: "Failed to store uploaded file" }, { status: 500 });
    }

    // Register in Media Store asynchronously
    saveMediaStore({
      fileName: cleanName,
      fileUrl: finalUrl,
      fileType,
      folder,
      size: kbSize,
    }).catch((storeErr) => {
      console.warn("[Server /api/upload] Media store register note:", storeErr);
    });

    return NextResponse.json({
      success: true,
      url: finalUrl,
      dataUrl: finalUrl,
      fileName: cleanName,
      fileType,
      size: kbSize,
    });
  } catch (err: any) {
    console.error("[Server /api/upload] File upload error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
