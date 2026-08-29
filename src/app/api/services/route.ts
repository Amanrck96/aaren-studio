import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServicesStore, saveServiceStore, deleteServiceStore } from "@/lib/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

export async function GET() {
  try {
    const services = await getServicesStore();
    return NextResponse.json({ success: true, count: services.length, data: services }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.description) {
      return NextResponse.json({ success: false, error: "Title and Description are required" }, { status: 400 });
    }
    const saved = await saveServiceStore(body);
    try {
      revalidatePath("/");
      revalidatePath("/services");
      revalidatePath("/admin/services");
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
    if (!id) return NextResponse.json({ success: false, error: "ID is required" }, { status: 400, headers: NO_CACHE_HEADERS });

    await deleteServiceStore(id);
    try {
      revalidatePath("/");
      revalidatePath("/services");
      revalidatePath("/admin/services");
    } catch (_) {}
    return NextResponse.json({ success: true }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
