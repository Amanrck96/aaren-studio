import { NextResponse } from "next/server";
import { getTaxonomiesStore, saveTaxonomyStore, deleteTaxonomyStore } from "@/lib/store";

export async function GET() {
  try {
    const taxonomies = await getTaxonomiesStore();
    return NextResponse.json({ success: true, count: taxonomies.length, data: taxonomies });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.type) {
      return NextResponse.json({ success: false, error: "Dropdown Name and Type are required" }, { status: 400 });
    }
    const saved = await saveTaxonomyStore(body);
    return NextResponse.json({ success: true, data: saved });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });

    await deleteTaxonomyStore(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
