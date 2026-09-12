import { NextRequest, NextResponse } from "next/server";
import {
  getIntroPagesStore,
  saveIntroPageStore,
  deleteIntroPageStore,
  generateUniqueIntroSlug,
} from "@/lib/store";
import { IntroPageCtaButton } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

function checkAdminAuth(request: NextRequest): boolean {
  const sessionCookie = request.cookies.get("aaren_admin_session")?.value;
  return sessionCookie === "authenticated";
}

function getBaseSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
  }
  return "https://aarenstudio.vercel.app";
}

// Security: Validate that a CTA destination is a safe internal path or safe http(s) URL
function isSafeDestination(dest: string): boolean {
  if (!dest || typeof dest !== "string") return false;
  const trimmed = dest.trim();

  // Safe internal path: starts with single '/', no protocol-relative '//' or backslashes
  if (trimmed.startsWith("/") && !trimmed.startsWith("//") && !trimmed.startsWith("/\\")) {
    return true;
  }

  // Safe external URL: strictly http: or https:
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin session required" },
        { status: 401, headers: NO_CACHE_HEADERS }
      );
    }

    const pages = await getIntroPagesStore();
    return NextResponse.json(
      { success: true, count: pages.length, data: pages },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    console.error("[API GET /api/admin/intro-page Error]:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch intro pages" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin session required" },
        { status: 401, headers: NO_CACHE_HEADERS }
      );
    }

    const body = await request.json();

    // 1. Validate title
    if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json(
        { success: false, error: "Title is required (1-120 characters)" },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }
    const cleanTitle = body.title.trim().slice(0, 120);

    // 2. Validate tagline (optional)
    const cleanTagline = body.tagline && typeof body.tagline === "string" ? body.tagline.trim().slice(0, 300) : undefined;

    // 3. Validate banner image URL
    if (!body.bannerImageUrl || typeof body.bannerImageUrl !== "string" || !body.bannerImageUrl.trim()) {
      return NextResponse.json(
        { success: false, error: "Banner image is required" },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }
    const cleanBannerUrl = body.bannerImageUrl.trim();
    if (!isSafeDestination(cleanBannerUrl)) {
      return NextResponse.json(
        { success: false, error: "Banner image URL must be a valid HTTP/HTTPS URL or path" },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    // 4. Validate CTA buttons (max 3)
    const sanitizedButtons: IntroPageCtaButton[] = [];
    if (Array.isArray(body.ctaButtons)) {
      for (const btn of body.ctaButtons.slice(0, 3)) {
        if (btn && typeof btn === "object") {
          const label = String(btn.label || "").trim().slice(0, 40);
          const destination = String(btn.destination || "").trim();
          if (label && destination) {
            if (!isSafeDestination(destination)) {
              return NextResponse.json(
                {
                  success: false,
                  error: `CTA destination "${destination}" is unsafe. Must be an internal path (e.g. /projects) or an https:// URL.`,
                },
                { status: 400, headers: NO_CACHE_HEADERS }
              );
            }
            sanitizedButtons.push({ label, destination });
          }
        }
      }
    }

    // 5. Generate collision-free slug
    const customSlug = body.slug ? String(body.slug).trim().toLowerCase() : undefined;
    const finalSlug = customSlug || (await generateUniqueIntroSlug(cleanTitle, body.id));

    // 6. Save intro page
    const saved = await saveIntroPageStore({
      id: body.id,
      slug: finalSlug,
      title: cleanTitle,
      tagline: cleanTagline,
      bannerImageUrl: cleanBannerUrl,
      ctaButtons: sanitizedButtons,
    });

    const baseSiteUrl = getBaseSiteUrl();
    const publicUrl = `${baseSiteUrl}/intro/${saved.slug}`;

    return NextResponse.json(
      {
        success: true,
        data: saved,
        publicUrl,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    console.error("[API POST /api/admin/intro-page Error]:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create intro page" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin session required" },
        { status: 401, headers: NO_CACHE_HEADERS }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing required query parameter: id" },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    await deleteIntroPageStore(id);
    return NextResponse.json(
      { success: true, message: "Intro page deleted successfully" },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    console.error("[API DELETE /api/admin/intro-page Error]:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete intro page" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
