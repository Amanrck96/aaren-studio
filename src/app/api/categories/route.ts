import { NextResponse } from "next/server";
import { getCategoriesStore, saveCategoryStore, deleteCategoryStore } from "@/lib/store";

export async function GET() {
  try {
    const categories = await getCategoriesStore();
    return NextResponse.json({ success: true, count: categories.length, data: categories });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.coverImage) {
      return NextResponse.json({ success: false, error: "Name and Cover Image are required" }, { status: 400 });
    }
    const saved = await saveCategoryStore(body);
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

    await deleteCategoryStore(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
