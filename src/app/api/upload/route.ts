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

    let publicUrl = "";
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const filename = `${Date.now()}-${sanitizedName}`;
    const ext = path.extname(file.name).toLowerCase();

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

    // For images, if under 4MB, generate a base64 data URL to guarantee permanent display on Vercel serverless
    let dataUrl = "";
    if (isImage && buffer.length < 4 * 1024 * 1024) {
      const mime = file.type || (ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg");
      dataUrl = `data:${mime};base64,${buffer.toString("base64")}`;
      if (!publicUrl) publicUrl = dataUrl;
    }

    const finalUrl = dataUrl || publicUrl;

    // Register in Media Store
    await saveMediaStore({
      fileName: file.name,
      fileUrl: finalUrl,
      fileType,
      folder,
      size: kbSize,
    });

    return NextResponse.json({
      success: true,
      url: finalUrl,
      dataUrl: dataUrl || publicUrl,
      fileName: file.name,
      fileType,
      size: kbSize,
    });
  } catch (err: any) {
    console.error("File upload error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
