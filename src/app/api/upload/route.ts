import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { saveMediaStore } from "@/lib/store";

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
    const filename = `${Date.now()}-${cleanName}`;
    let publicUrl = "";

    // Try writing to public/uploads
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, buffer);
      publicUrl = `/uploads/${filename}`;
    } catch (fsErr) {
      console.warn("FS write failed, using data URL fallback:", fsErr);
    }

    let fileType: "PDF" | "Image" | "Video" | "Document" = "Document";
    const isImage = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"].includes(ext);
    if (isImage) fileType = "Image";
    else if (ext === ".pdf") fileType = "PDF";
    else if ([".mp4", ".webm", ".mov", ".mkv"].includes(ext)) fileType = "Video";

    const kbSize = (file.size / 1024).toFixed(1) + " KB";

    // Generate base64 data URL fallback if filesystem write failed or for permanent availability
    let dataUrl = "";
    if (buffer.length < 25 * 1024 * 1024) {
      let mime = file.type;
      if (!mime || mime === "application/octet-stream") {
        if (ext === ".pdf") mime = "application/pdf";
        else if (ext === ".png") mime = "image/png";
        else if (ext === ".jpg" || ext === ".jpeg") mime = "image/jpeg";
        else if (ext === ".webp") mime = "image/webp";
        else mime = "application/octet-stream";
      }
      dataUrl = `data:${mime};base64,${buffer.toString("base64")}`;
      if (!publicUrl) publicUrl = dataUrl;
    }

    const finalUrl = publicUrl || dataUrl;

    if (!finalUrl) {
      return NextResponse.json({ success: false, error: "Failed to store uploaded file" }, { status: 500 });
    }

    // Register in Media Store
    try {
      await saveMediaStore({
        fileName: cleanName,
        fileUrl: finalUrl,
        fileType,
        folder,
        size: kbSize,
      });
    } catch (storeErr) {
      console.warn("Media store save note:", storeErr);
    }

    return NextResponse.json({
      success: true,
      url: finalUrl,
      dataUrl: dataUrl || publicUrl,
      fileName: cleanName,
      fileType,
      size: kbSize,
    });
  } catch (err: any) {
    console.error("File upload error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
