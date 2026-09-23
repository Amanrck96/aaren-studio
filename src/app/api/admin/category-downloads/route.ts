import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  getCategoryFoldersStore,
  saveCategoryFolderStore,
  deleteCategoryFolderStore,
} from "@/lib/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "Pragma": "no-cache",
  "Expires": "0",
};

export async function GET() {
  try {
    const folders = await getCategoryFoldersStore();
    return NextResponse.json(
      {
        success: true,
        count: folders.length,
        data: folders,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch category folders" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get("aaren_admin_session")?.value;
    if (sessionCookie !== "authenticated") {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin session required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    if (!body || !body.name || typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json(
        { success: false, error: "Category name is required" },
        { status: 400 }
      );
    }

    const saved = await saveCategoryFolderStore(body);

    try {
      revalidatePath("/downloads");
      revalidatePath("/categories");
      revalidatePath("/category-downloads");
      revalidatePath(`/category-downloads/${saved.slug}`);
      revalidatePath("/admin/category-downloads");
    } catch (_) {}

    return NextResponse.json(
      {
        success: true,
        data: saved,
        publicUrl: `/category-downloads/${saved.slug}`,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to save category folder" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get("aaren_admin_session")?.value;
    if (sessionCookie !== "authenticated") {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin session required" },
        { status: 401, headers: NO_CACHE_HEADERS }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Category folder ID is required" },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const deleted = await deleteCategoryFolderStore(id);

    try {
      revalidatePath("/downloads");
      revalidatePath("/categories");
      revalidatePath("/category-downloads");
      revalidatePath("/admin/category-downloads");
    } catch (_) {}

    return NextResponse.json({ success: deleted }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete category folder" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
