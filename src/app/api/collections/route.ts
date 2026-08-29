import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  getAllCollectionsStore,
  saveCollectionStore,
  deleteCollectionStore,
  getAllProductsStore,
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
    const brand = searchParams.get("brand") || undefined;
    const includeCounts = searchParams.get("includeCounts") === "true";

    const collections = await getAllCollectionsStore(brand);

    if (includeCounts) {
      const allProducts = await getAllProductsStore();
      const norm = (s: string) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

      const withCounts = collections.map((col) => {
        const count = allProducts.filter((p) => {
          const pCol = norm(p.subcategory || p.category || "");
          const cId = norm(col.id);
          const cName = norm(col.name);
          return pCol === cId || pCol === cName;
        }).length;
        return { ...col, productCount: count };
      });
      return NextResponse.json({ success: true, count: withCounts.length, data: withCounts }, { headers: NO_CACHE_HEADERS });
    }

    return NextResponse.json({ success: true, count: collections.length, data: collections }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ success: false, error: "Collection name is required" }, { status: 400, headers: NO_CACHE_HEADERS });
    }
    const saved = await saveCollectionStore(body);

    // On-demand revalidation: Purge edge/server cache immediately
    try {
      revalidatePath("/brands");
      revalidatePath("/brands/[slug]", "page");
      revalidatePath("/admin/collections");
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
    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400, headers: NO_CACHE_HEADERS });
    }
    await deleteCollectionStore(id);

    // On-demand revalidation: Purge edge/server cache immediately
    try {
      revalidatePath("/brands");
      revalidatePath("/brands/[slug]", "page");
      revalidatePath("/admin/collections");
      revalidatePath("/");
    } catch (_) {}

    return NextResponse.json({ success: true, message: "Collection deleted successfully" }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

