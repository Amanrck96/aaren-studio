import { NextResponse } from "next/server";
import { getCareersStore, saveCareerStore, deleteCareerStore } from "@/lib/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET() {
  try {
    const careers = await getCareersStore();
    return NextResponse.json({ success: true, count: careers.length, data: careers }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.department) {
      return NextResponse.json({ success: false, error: "Title and department are required" }, { status: 400 });
    }

    const saved = await saveCareerStore({
      id: body.id,
      title: body.title,
      department: body.department,
      location: body.location || "Bengaluru / Hybrid",
      type: body.type || "Full-Time",
      description: body.description || "",
    });

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
      return NextResponse.json({ success: false, error: "Missing ID" }, { status: 400 });
    }

    await deleteCareerStore(id);
    return NextResponse.json({ success: true, message: "Deleted" }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
