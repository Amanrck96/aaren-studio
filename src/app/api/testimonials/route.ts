import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getTestimonialsStore, saveTestimonialStore, deleteTestimonialStore } from "@/lib/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

export async function GET() {
  try {
    const testimonials = await getTestimonialsStore();
    return NextResponse.json({ success: true, count: testimonials.length, data: testimonials }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.clientName || !body.review) {
      return NextResponse.json({ success: false, error: "Client Name and Review are required" }, { status: 400 });
    }
    const saved = await saveTestimonialStore(body);
    try {
      revalidatePath("/");
      revalidatePath("/admin/testimonials");
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

    await deleteTestimonialStore(id);
    try {
      revalidatePath("/");
      revalidatePath("/admin/testimonials");
    } catch (_) {}
    return NextResponse.json({ success: true }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
