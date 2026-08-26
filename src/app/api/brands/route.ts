import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getBrandsStore, getBrandByIdStore, saveBrandStore, deleteBrandStore } from "@/lib/store";

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
    const id = searchParams.get("id") || searchParams.get("slug");

    if (id) {
      const brand = await getBrandByIdStore(id);
      if (!brand) {
        return NextResponse.json({ success: false, error: "Brand not found" }, { status: 404, headers: NO_CACHE_HEADERS });
      }
      return NextResponse.json({ success: true, data: brand }, { headers: NO_CACHE_HEADERS });
    }

    const brands = await getBrandsStore();
    return NextResponse.json({ success: true, count: brands.length, data: brands }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ success: false, error: "Brand Name is required" }, { status: 400 });
    }
    const saved = await saveBrandStore(body);

    // On-demand revalidation: Purge edge/server cache immediately
    try {
      revalidatePath("/brands");
      revalidatePath("/brands/[slug]", "page");
      if (saved.id) revalidatePath(`/brands/${saved.id}`);
      revalidatePath("/admin/brands");
      revalidatePath("/admin/brands/[id]", "page");
      revalidatePath("/");
    } catch (_) {}

    return NextResponse.json({ success: true, data: saved }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id && !body.name) {
      return NextResponse.json({ success: false, error: "Brand ID or Name is required for updates" }, { status: 400 });
    }
    const saved = await saveBrandStore(body);

    // On-demand revalidation: Purge edge/server cache immediately
    try {
      revalidatePath("/brands");
      revalidatePath("/brands/[slug]", "page");
      if (saved.id) revalidatePath(`/brands/${saved.id}`);
      revalidatePath("/admin/brands");
      revalidatePath("/admin/brands/[id]", "page");
      revalidatePath("/");
    } catch (_) {}

    return NextResponse.json({ success: true, data: saved }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });

    await deleteBrandStore(id);

    // On-demand revalidation: Purge edge/server cache immediately
    try {
      revalidatePath("/brands");
      revalidatePath("/brands/[slug]", "page");
      revalidatePath(`/brands/${id}`);
      revalidatePath("/admin/brands");
      revalidatePath("/admin/brands/[id]", "page");
      revalidatePath("/");
    } catch (_) {}

    return NextResponse.json({ success: true }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

