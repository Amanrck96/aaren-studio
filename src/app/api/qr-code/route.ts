import { NextRequest, NextResponse } from "next/server";
import { getQrCodesStore, saveQrCodeStore, deleteQrCodeStore } from "@/lib/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

function checkAdminAuth(request: NextRequest): boolean {
  const sessionCookie = request.cookies.get("aaren_admin_session")?.value;
  return sessionCookie === "authenticated";
}

export async function GET(request: NextRequest) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin session required" },
        { status: 401, headers: NO_CACHE_HEADERS }
      );
    }

    const items = await getQrCodesStore();
    return NextResponse.json(
      { success: true, count: items.length, data: items },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    console.error("[API GET /api/qr-code Error]:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch QR codes" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin session required" },
        { status: 401, headers: NO_CACHE_HEADERS }
      );
    }

    const body = await request.json();
    if (!body.url || typeof body.url !== "string" || !body.url.trim()) {
      return NextResponse.json(
        { success: false, error: "Target URL or text is required" },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const saved = await saveQrCodeStore({
      id: body.id,
      title: body.title?.trim() || "QR Code",
      url: body.url.trim(),
      imageUrl: body.imageUrl || undefined,
      fgColor: body.fgColor || "#1E1E1E",
      bgColor: body.bgColor || "#FFFFFF",
      logoUrl: body.logoUrl || undefined,
    });

    return NextResponse.json(
      { success: true, data: saved },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    console.error("[API POST /api/qr-code Error]:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to save QR code" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin session required" },
        { status: 401, headers: NO_CACHE_HEADERS }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing required query parameter: id" },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    await deleteQrCodeStore(id);
    return NextResponse.json(
      { success: true, message: "QR code deleted successfully" },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    console.error("[API DELETE /api/qr-code Error]:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete QR code" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
