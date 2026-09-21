import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  getCategoryFoldersStore,
  saveCategoryFolderStore,
  deleteCategoryFolderStore,
} from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const folders = await getCategoryFoldersStore();
    return NextResponse.json({
      success: true,
      count: folders.length,
      data: folders,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch category folders" },
      { status: 500 }
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

    return NextResponse.json({
      success: true,
      data: saved,
      publicUrl: `/category-downloads/${saved.slug}`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to save category folder" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get("aaren_admin_session")?.value;
    if (sessionCookie !== "authenticated") {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin session required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Category folder ID is required" },
        { status: 400 }
      );
    }

    const deleted = await deleteCategoryFolderStore(id);

    try {
      revalidatePath("/downloads");
      revalidatePath("/categories");
      revalidatePath("/category-downloads");
      revalidatePath("/admin/category-downloads");
    } catch (_) {}

    return NextResponse.json({ success: deleted });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete category folder" },
      { status: 500 }
    );
  }
}
