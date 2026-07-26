import { NextResponse } from "next/server";
import { getAllProductsStore, addProductStore } from "@/lib/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const query = searchParams.get("q");

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
          p.description.toLowerCase().includes(qLower)
      );
    }

    return NextResponse.json({ success: true, count: products.length, data: products });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
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
