import { NextRequest, NextResponse } from "next/server";
import { uploadMedia } from "@/lib/cloudinary";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const dynamic = "force-dynamic";

const MAX_BANNER_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_PDF_SIZE_BYTES = 30 * 1024 * 1024; // 30MB

const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/svg+xml",
  "image/avif",
];

const ALLOWED_PDF_TYPES = [
  "application/pdf",
  "application/x-pdf",
  "application/acrobat",
  "applications/vnd.pdf",
  "text/pdf",
  "text/x-pdf",
];

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate admin session
    const sessionCookie = request.cookies.get("aaren_admin_session")?.value;
    if (sessionCookie !== "authenticated") {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin session required" },
        { status: 401 }
      );
    }

    // 2. Read multipart form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const fileTypeHint = (formData.get("type") as string) || ""; // "banner" or "pdf"

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file was provided" },
        { status: 400 }
      );
    }

    const mime = (file.type || "").toLowerCase();
    const fileName = file.name || "document.pdf";
    const isPdf =
      ALLOWED_PDF_TYPES.includes(mime) ||
      fileName.toLowerCase().endsWith(".pdf") ||
      fileTypeHint === "pdf";
    const isImage =
      ALLOWED_IMAGE_TYPES.includes(mime) ||
      /\.(jpg|jpeg|png|webp|svg|avif)$/i.test(fileName) ||
      fileTypeHint === "banner";

    if (!isPdf && !isImage) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file type. Please upload a PDF document or an image (PNG, JPEG, WebP, SVG).",
        },
        { status: 400 }
      );
    }

    // Size limit check
    if (isPdf && file.size > MAX_PDF_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: `PDF file size exceeds the 30MB maximum limit (${formatBytes(file.size)}).`,
        },
        { status: 400 }
      );
    }

    if (isImage && !isPdf && file.size > MAX_BANNER_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: `Banner image exceeds the 10MB maximum limit (${formatBytes(file.size)}).`,
        },
        { status: 400 }
      );
    }

    // Convert file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const resolvedMime = isPdf ? "application/pdf" : mime || "image/jpeg";
    const cleanFolder = (formData.get("folder") as string) || (isPdf ? "Catalogues" : "Categories");

    let publicUrl = "";

    // 1. Primary: Direct Google Firebase Storage Upload
    try {
      const cleanName = fileName.replace(/[^a-zA-Z0-9_.-]/g, "_");
      const storagePath = `${cleanFolder}/${Date.now()}_${cleanName}`;
      const storageRef = ref(storage, storagePath);
      const snapshot = await uploadBytes(storageRef, buffer, {
        contentType: resolvedMime,
        cacheControl: "public, max-age=31536000",
      });
      publicUrl = await getDownloadURL(snapshot.ref);
    } catch (fbErr) {
      console.warn("[Category Downloads Upload] Firebase Storage write notice:", fbErr);
    }

    // 2. Secondary fallback: Cloudinary upload
    let publicId = "";
    if (!publicUrl) {
      const dataUri = `data:${resolvedMime};base64,${buffer.toString("base64")}`;
      const resource_type: "raw" | "image" | "auto" = isPdf ? "raw" : "image";
      const result = await uploadMedia(dataUri, {
        folder: cleanFolder,
        resource_type,
        width: isImage ? 1600 : undefined,
      });
      if (result && result.secure_url) {
        publicUrl = result.secure_url;
        publicId = result.public_id;
      }
    }

    if (!publicUrl) {
      return NextResponse.json(
        { success: false, error: "Failed to upload file to storage" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      publicId,
      fileName,
      fileSize: formatBytes(file.size),
    });
  } catch (err: any) {
    console.error("[Category Downloads Upload Error]:", err);
    return NextResponse.json(
      { success: false, error: err.message || "An error occurred during upload" },
      { status: 500 }
    );
  }
}
