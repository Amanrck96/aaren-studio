import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  getBrandFoldersStore,
  saveBrandFolderStore,
  deleteBrandFolderStore,
} from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const folders = await getBrandFoldersStore();
    return NextResponse.json({
      success: true,
      count: folders.length,
      data: folders,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch brand folders" },
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
        { success: false, error: "Brand name is required" },
        { status: 400 }
      );
    }

    const saved = await saveBrandFolderStore(body);

    try {
      revalidatePath("/downloads");
      revalidatePath(`/downloads/${saved.slug}`);
      revalidatePath("/admin/downloads");
    } catch (_) {}

    return NextResponse.json({
      success: true,
      data: saved,
      publicUrl: `/downloads/${saved.slug}`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to save brand folder" },
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
        { success: false, error: "Brand folder ID is required" },
        { status: 400 }
      );
    }

    const deleted = await deleteBrandFolderStore(id);

    try {
      revalidatePath("/downloads");
      revalidatePath("/admin/downloads");
    } catch (_) {}

    return NextResponse.json({ success: deleted });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete brand folder" },
      { status: 500 }
    );
  }
}
