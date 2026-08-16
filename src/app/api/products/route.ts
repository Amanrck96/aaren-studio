import { NextResponse } from "next/server";
import { getAllProductsStore, getProductByIdStore, addProductStore, updateProductStore, deleteProductStore } from "@/lib/store";

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
    const id = searchParams.get("id");
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const query = searchParams.get("q");

    if (id) {
      const product = await getProductByIdStore(id);
      if (!product) {
        return NextResponse.json({ success: false, error: "Product not found" }, { status: 404, headers: NO_CACHE_HEADERS });
      }
      return NextResponse.json({ success: true, data: product }, { headers: NO_CACHE_HEADERS });
    }

    let products = await getAllProductsStore();

    if (category && category !== "All") {
      products = products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (brand && brand !== "All") {
      products = products.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
    }

    if (query) {
      const qLower = query.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(qLower) ||
          p.brand.toLowerCase().includes(qLower) ||
          p.category.toLowerCase().includes(qLower) ||
          (p.subcategory && p.subcategory.toLowerCase().includes(qLower)) ||
          (p.shortCode && p.shortCode.toLowerCase().includes(qLower)) ||
          p.description.toLowerCase().includes(qLower)
      );
    }

    return NextResponse.json({ success: true, count: products.length, data: products }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.brand || !body.category) {
      return NextResponse.json(
        { success: false, error: "Name, Brand, and Category are required" },
        { status: 400 }
      );
    }

    const created = await addProductStore(body);
    return NextResponse.json({ success: true, data: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const id = body.id;
    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID is required for updates" }, { status: 400 });
    }

    const updated = await updateProductStore(id, body);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });

    await deleteProductStore(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
