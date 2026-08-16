import { NextResponse } from "next/server";
import { getAllFAQsStore, saveFAQStore, deleteFAQStore, importFAQsBulkStore } from "@/lib/store";

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
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");

    let faqs = await getAllFAQsStore();

    if (category && category !== "All") {
      faqs = faqs.filter((f) => f.category.toLowerCase() === category.toLowerCase());
    }
    if (brand) {
      faqs = faqs.filter((f) => (f.brand || "").toLowerCase() === brand.toLowerCase());
    }

    const categories = Array.from(new Set(faqs.map((f) => f.category)));
    const brands = Array.from(new Set(faqs.map((f) => f.brand).filter(Boolean)));

    return NextResponse.json({
      success: true,
      count: faqs.length,
      categories,
      brands,
      data: faqs,
    }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.question || !body.answer) {
      return NextResponse.json({ success: false, error: "Question and Answer are required." }, { status: 400 });
    }
    const saved = await saveFAQStore(body);
    return NextResponse.json({ success: true, data: saved });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (Array.isArray(body)) {
      const imported = await importFAQsBulkStore(body);
      return NextResponse.json({ success: true, count: imported.length, data: imported });
    }
    if (body.faqs && Array.isArray(body.faqs)) {
      const imported = await importFAQsBulkStore(body.faqs);
      return NextResponse.json({ success: true, count: imported.length, data: imported });
    }
    const saved = await saveFAQStore(body);
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
      return NextResponse.json({ success: false, error: "ID is required." }, { status: 400 });
    }
    await deleteFAQStore(id);
    return NextResponse.json({ success: true, message: `FAQ ${id} deleted.` });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
