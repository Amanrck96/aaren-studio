import { NextResponse } from "next/server";
import { getSiteSettingsStore, updateSiteSettingsStore } from "@/lib/store";

export async function GET() {
  try {
    const settings = await getSiteSettingsStore();
    return NextResponse.json({ success: true, data: settings });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updated = await updateSiteSettingsStore(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
