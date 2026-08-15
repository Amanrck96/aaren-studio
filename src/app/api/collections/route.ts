import { NextResponse } from "next/server";
import {
  getAllCollectionsStore,
  saveCollectionStore,
  deleteCollectionStore,
  getAllProductsStore,
} from "@/lib/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
      return NextResponse.json({ success: true, data: withCounts });
    }

    return NextResponse.json({ success: true, data: collections });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ success: false, error: "Collection name is required" }, { status: 400 });
    }
    const saved = await saveCollectionStore(body);
    return NextResponse.json({ success: true, data: saved });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }
    await deleteCollectionStore(id);
    return NextResponse.json({ success: true, message: "Collection deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
