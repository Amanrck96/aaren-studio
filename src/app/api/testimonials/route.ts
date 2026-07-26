import { NextResponse } from "next/server";
import { getTestimonialsStore, saveTestimonialStore, deleteTestimonialStore } from "@/lib/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const testimonials = await getTestimonialsStore();
    return NextResponse.json({ success: true, count: testimonials.length, data: testimonials });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.clientName || !body.review) {
      return NextResponse.json({ success: false, error: "Client Name and Review are required" }, { status: 400 });
    }
    const saved = await saveTestimonialStore(body);
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

    await deleteTestimonialStore(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
