import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getBlogsStore, saveBlogStore, deleteBlogStore, reorderBlogsStore } from "@/lib/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

export async function GET() {
  try {
    const blogs = await getBlogsStore();
    // Sort by sequenceNumber if available
    const sorted = [...blogs].sort((a: any, b: any) => (a.sequenceNumber || 9999) - (b.sequenceNumber || 9999));
    return NextResponse.json({ success: true, count: sorted.length, data: sorted }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if bulk reorder action
    if (body.type === "reorder" && Array.isArray(body.blogs)) {
      const reordered = await reorderBlogsStore(body.blogs);
      return NextResponse.json({ success: true, data: reordered });
    }

    if (!body.title || !body.content) {
      return NextResponse.json({ success: false, error: "Title and Content are required" }, { status: 400 });
    }
    const saved = await saveBlogStore(body);
    try {
      revalidatePath("/blog");
      revalidatePath("/blog/[slug]", "page");
      if (saved.slug) revalidatePath(`/blog/${saved.slug}`);
      revalidatePath("/admin/blogs");
      revalidatePath("/");
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

    await deleteBlogStore(id);
    try {
      revalidatePath("/blog");
      revalidatePath("/blog/[slug]", "page");
      revalidatePath("/admin/blogs");
      revalidatePath("/");
    } catch (_) {}
    return NextResponse.json({ success: true }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
