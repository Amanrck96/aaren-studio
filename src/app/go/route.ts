/**
 * /go — QR Code Direct Redirect
 * 
 * Provides clean redirect URLs for physical QR codes so they go directly
 * to aarenstudio.vercel.app without intermediate warning pages from
 * third-party QR services like QRCodeChimp.
 *
 * Usage: Point QR codes to https://aarenstudio.vercel.app/go
 * (or /go?to=catalogs, /go?to=contact, etc.)
 */
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl;
  const to = searchParams.get("to");

  // Whitelist of allowed destinations
  const ALLOWED_PATHS: Record<string, string> = {
    home:      "/",
    about:     "/about",
    team:      "/team",
    contact:   "/contact",
    shop:      "/shop",
    products:  "/products",
    brands:    "/brands",
    catalogs:  "/catalogs",
    faq:       "/faq",
    blog:      "/blog",
    workspace: "/workspace",
    login:     "/login",
    signup:    "/signup",
  };

  const destination = to ? (ALLOWED_PATHS[to.toLowerCase()] ?? "/") : "/";

  return NextResponse.redirect(new URL(destination, origin), {
    status: 301,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
