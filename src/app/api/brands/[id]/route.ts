import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getBrandByIdStore, saveBrandStore, deleteBrandStore } from "@/lib/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

type Props = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing brand ID" }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    const brand = await getBrandByIdStore(id);
    if (!brand) {
      return NextResponse.json({ success: false, error: "Brand not found" }, { status: 404, headers: NO_CACHE_HEADERS });
    }

    return NextResponse.json({ success: true, data: brand }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function PUT(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();

    const saved = await saveBrandStore({ ...body, id });

    // On-demand revalidation: Purge edge/server cache immediately
    try {
      revalidatePath("/brands");
      revalidatePath(`/brands/${id}`);
      revalidatePath("/brands/[slug]", "page");
      revalidatePath("/admin/brands");
      revalidatePath(`/admin/brands/${id}`);
      revalidatePath("/admin/brands/[id]", "page");
      revalidatePath("/");
    } catch (_) {}

    return NextResponse.json({ success: true, data: saved }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function PATCH(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();

    const saved = await saveBrandStore({ ...body, id });

    // On-demand revalidation: Purge edge/server cache immediately
    try {
      revalidatePath("/brands");
      revalidatePath(`/brands/${id}`);
      revalidatePath("/brands/[slug]", "page");
      revalidatePath("/admin/brands");
      revalidatePath(`/admin/brands/${id}`);
      revalidatePath("/admin/brands/[id]", "page");
      revalidatePath("/");
    } catch (_) {}

    return NextResponse.json({ success: true, data: saved }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function DELETE(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing brand ID" }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    await deleteBrandStore(id);

    // On-demand revalidation: Purge edge/server cache immediately
    try {
      revalidatePath("/brands");
      revalidatePath(`/brands/${id}`);
      revalidatePath("/brands/[slug]", "page");
      revalidatePath("/admin/brands");
      revalidatePath(`/admin/brands/${id}`);
      revalidatePath("/admin/brands/[id]", "page");
      revalidatePath("/");
    } catch (_) {}

    return NextResponse.json({ success: true, message: `Brand ${id} deleted successfully` }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

