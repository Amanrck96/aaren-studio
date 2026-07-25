import { NextResponse } from "next/server";
import { getAllFAQsStore } from "@/lib/store";

export async function GET() {
  try {
    const faqs = await getAllFAQsStore();
    return NextResponse.json({ success: true, count: faqs.length, data: faqs });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
