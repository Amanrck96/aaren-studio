import { NextResponse } from "next/server";
import { getServicesStore, saveServiceStore, deleteServiceStore } from "@/lib/store";

export async function GET() {
  try {
    const services = await getServicesStore();
    return NextResponse.json({ success: true, count: services.length, data: services });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.description) {
      return NextResponse.json({ success: false, error: "Title and Description are required" }, { status: 400 });
    }
    const saved = await saveServiceStore(body);
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

    await deleteServiceStore(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
