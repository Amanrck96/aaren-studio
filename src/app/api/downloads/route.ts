import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  getDownloadFoldersStore,
  saveDownloadFoldersStore,
  addPdfToBrandFolderStore,
  deletePdfFromBrandFolderStore,
  updateBrandFolderStore,
} from "@/lib/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get("brandId");

    const folders = await getDownloadFoldersStore();

    if (brandId) {
      const folder = folders.find((f) => f.id === brandId || f.brandName.toLowerCase() === brandId.toLowerCase());
      if (!folder) {
        return NextResponse.json({ success: false, error: "Brand folder not found" }, { status: 404, headers: NO_CACHE_HEADERS });
      }
      return NextResponse.json({ success: true, data: folder }, { headers: NO_CACHE_HEADERS });
    }

    return NextResponse.json({
      success: true,
      count: folders.length,
      data: folders,
    }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Bulk replace folders
    if (body.folders && Array.isArray(body.folders)) {
      const saved = await saveDownloadFoldersStore(body.folders);
      try {
        revalidatePath("/downloads");
        revalidatePath("/admin/downloads");
      } catch (_) {}
      return NextResponse.json({ success: true, data: saved }, { headers: NO_CACHE_HEADERS });
    }

    // 2. Add or update single PDF inside a brand folder
    const { brandId, pdf } = body;
    if (!brandId || !pdf) {
      return NextResponse.json({ success: false, error: "brandId and pdf object are required" }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    if (!pdf.fileUrl) {
      return NextResponse.json({ success: false, error: "Firebase PDF URL (fileUrl) is required" }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    const savedPdf = await addPdfToBrandFolderStore(brandId, pdf);

    try {
      revalidatePath("/downloads");
      revalidatePath("/admin/downloads");
    } catch (_) {}

    return NextResponse.json({ success: true, data: savedPdf }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (body.folder) {
      const savedFolder = await updateBrandFolderStore(body.folder);
      try {
        revalidatePath("/downloads");
        revalidatePath("/admin/downloads");
      } catch (_) {}
      return NextResponse.json({ success: true, data: savedFolder }, { headers: NO_CACHE_HEADERS });
    }

    const { brandId, pdf } = body;
    if (!brandId || !pdf) {
      return NextResponse.json({ success: false, error: "brandId and pdf object are required" }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    const savedPdf = await addPdfToBrandFolderStore(brandId, pdf);

    try {
      revalidatePath("/downloads");
      revalidatePath("/admin/downloads");
    } catch (_) {}

    return NextResponse.json({ success: true, data: savedPdf }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get("brandId");
    const pdfId = searchParams.get("pdfId");

    if (!brandId || !pdfId) {
      return NextResponse.json({ success: false, error: "brandId and pdfId are required" }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    const ok = await deletePdfFromBrandFolderStore(brandId, pdfId);

    try {
      revalidatePath("/downloads");
      revalidatePath("/admin/downloads");
    } catch (_) {}

    return NextResponse.json({ success: ok, message: ok ? "PDF deleted successfully" : "PDF not found" }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
