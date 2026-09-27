import { NextResponse } from "next/server";
import { getCategoryFoldersStore, getCategoryFolderBySlugStore } from "@/lib/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "Pragma": "no-cache",
  "Expires": "0",
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug") || searchParams.get("id");
    if (slug) {
      const folder = await getCategoryFolderBySlugStore(slug);
      if (!folder) {
        return NextResponse.json(
          { success: false, error: "Category folder not found" },
          { status: 404, headers: NO_CACHE_HEADERS }
        );
      }
      return NextResponse.json({ success: true, data: folder }, { headers: NO_CACHE_HEADERS });
    }

    const folders = await getCategoryFoldersStore();
    return NextResponse.json(
      {
        success: true,
        count: folders.length,
        data: folders,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch category folders" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
