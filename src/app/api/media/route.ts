import { NextResponse } from "next/server";
import { getMediaStore, saveMediaStore, deleteMediaStore } from "@/lib/store";

export async function GET() {
  try {
    const media = await getMediaStore();
    return NextResponse.json({ success: true, count: media.length, data: media });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.fileName || !body.fileUrl) {
      return NextResponse.json({ success: false, error: "File Name and URL are required" }, { status: 400 });
    }
    const saved = await saveMediaStore(body);
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

    await deleteMediaStore(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
