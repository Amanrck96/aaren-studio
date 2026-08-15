import { NextResponse } from "next/server";
import { getBrandsStore, getBrandByIdStore, saveBrandStore, deleteBrandStore } from "@/lib/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") || searchParams.get("slug");

    if (id) {
      const brand = await getBrandByIdStore(id);
      if (!brand) {
        return NextResponse.json({ success: false, error: "Brand not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: brand });
    }

    const brands = await getBrandsStore();
    return NextResponse.json({ success: true, count: brands.length, data: brands });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ success: false, error: "Brand Name is required" }, { status: 400 });
    }
    const saved = await saveBrandStore(body);
    return NextResponse.json({ success: true, data: saved });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id && !body.name) {
      return NextResponse.json({ success: false, error: "Brand ID or Name is required for updates" }, { status: 400 });
    }
    const saved = await saveBrandStore(body);
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

    await deleteBrandStore(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
