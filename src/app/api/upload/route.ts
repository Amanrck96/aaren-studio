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

    // Save to public/uploads
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Sanitize file name
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const filename = `${Date.now()}-${sanitizedName}`;
    const filePath = path.join(uploadsDir, filename);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    const ext = path.extname(file.name).toLowerCase();
    let fileType: "PDF" | "Image" | "Video" | "Document" = "Document";
    if ([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"].includes(ext)) fileType = "Image";
    else if (ext === ".pdf") fileType = "PDF";
    else if ([".mp4", ".webm", ".mov", ".mkv"].includes(ext)) fileType = "Video";

    const kbSize = (file.size / 1024).toFixed(1) + " KB";

    // Register in Media Store
    await saveMediaStore({
      fileName: file.name,
      fileUrl: publicUrl,
      fileType,
      folder,
      size: kbSize,
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: file.name,
      fileType,
      size: kbSize,
    });
  } catch (err: any) {
    console.error("File upload error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
