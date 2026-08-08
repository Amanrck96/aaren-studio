import { NextResponse } from "next/server";
import { getBlogSettingsStore, saveBlogSettingsStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getBlogSettingsStore();
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updated = await saveBlogSettingsStore(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
