import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  getShopItemsStore,
  saveShopItemStore,
  deleteShopItemStore,
  getShopSettingsStore,
  saveShopSettingsStore,
} from "@/lib/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

export async function GET() {
  try {
    const [items, settings] = await Promise.all([
      getShopItemsStore(),
      getShopSettingsStore(),
    ]);
    return NextResponse.json(
      {
        success: true,
        count: items.length,
        data: items,
        settings,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if updating settings
    if (body.type === "settings" || body.settings) {
      const settingsPayload = body.settings || body;
      const updated = await saveShopSettingsStore(settingsPayload);
      try {
        revalidatePath("/shop");
        revalidatePath("/admin/shop");
      } catch (_) {}
      return NextResponse.json(
        { success: true, settings: updated },
        { headers: NO_CACHE_HEADERS }
      );
    }

    // Otherwise updating or creating a Shop item
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: "Specimen / Product name is required" },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const saved = await saveShopItemStore(body);
    try {
      revalidatePath("/shop");
      revalidatePath("/admin/shop");
    } catch (_) {}
    return NextResponse.json(
      { success: true, data: saved },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    await deleteShopItemStore(id);
    try {
      revalidatePath("/shop");
      revalidatePath("/admin/shop");
    } catch (_) {}
    return NextResponse.json({ success: true }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
