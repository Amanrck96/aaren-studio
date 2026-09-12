import { NextRequest, NextResponse } from "next/server";
import { uploadMedia } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

const MAX_LOGO_SIZE_BYTES = 5 * 1024 * 1024; // 5MB limit
const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/svg+xml",
];

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

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No image file was provided" },
        { status: 400 }
      );
    }

    // 3. Validate file MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file type. Please upload a PNG, JPEG, WebP, or SVG image.",
        },
        { status: 400 }
      );
    }

    // 4. Validate file size (max 5MB)
    if (file.size > MAX_LOGO_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: `Logo size exceeds the 5MB maximum limit (uploaded: ${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
        },
        { status: 400 }
      );
    }

    // 5. Convert file buffer to base64 Data URI for server-side Cloudinary upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mime = file.type || "image/png";
    const dataUri = `data:${mime};base64,${buffer.toString("base64")}`;

    // 6. Upload via existing Cloudinary integration (secrets remain server-side)
    const folder = (formData.get("folder") as string) || "aaren_qr_logos";
    const widthParam = formData.get("width") as string | null;
    const width = widthParam ? parseInt(widthParam, 10) || 1200 : 800;

    const result = await uploadMedia(dataUri, {
      folder,
      width,
    });

    if (!result || !result.secure_url) {
      return NextResponse.json(
        { success: false, error: "Failed to upload image to Cloudinary" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      fileName: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
    });
  } catch (err: any) {
    console.error("[QR Logo Upload Error]:", err);
    return NextResponse.json(
      { success: false, error: err.message || "An error occurred during upload" },
      { status: 500 }
    );
  }
}
