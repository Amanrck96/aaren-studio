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
  const { origin, searchParams } = req.nextUrl;
  const rawUrl = req.url;

  // 1. Extract PDF or URL parameter with full query string preservation
  // When users paste raw Firebase URLs into query params, &token= can be split into a separate param.
  let targetPdf = searchParams.get("pdf") || searchParams.get("url");

  if (targetPdf) {
    // If the raw URL contains ?pdf= or &pdf=, extract everything after it to avoid truncated tokens
    const match = rawUrl.match(/[?&](pdf|url)=([^&]+(?:\?[^#]+)?.*)/i);
    if (match && match[2]) {
      try {
        const candidate = decodeURIComponent(match[2]);
        if (candidate.startsWith("http://") || candidate.startsWith("https://") || candidate.startsWith("/")) {
          targetPdf = candidate;
        }
      } catch {
        // use targetPdf as is
      }
    }

    // Re-attach token if it got split by searchParams parser
    const separateToken = searchParams.get("token");
    if (separateToken && !targetPdf.includes(`token=${separateToken}`)) {
      const separator = targetPdf.includes("?") ? "&" : "?";
      targetPdf = `${targetPdf}${separator}token=${separateToken}`;
    }

    // Ensure Firebase Storage URLs have alt=media
    if (targetPdf.includes("firebasestorage.googleapis.com") && !targetPdf.includes("alt=media")) {
      const separator = targetPdf.includes("?") ? "&" : "?";
      targetPdf = `${targetPdf}${separator}alt=media`;
    }

    if (targetPdf.startsWith("http://") || targetPdf.startsWith("https://")) {
      return NextResponse.redirect(new URL(targetPdf), {
        status: 301,
        headers: { "Cache-Control": "no-store, must-revalidate" },
      });
    }

    const cleanPath = targetPdf.startsWith("/") ? targetPdf : `/${targetPdf}`;
    return NextResponse.redirect(new URL(cleanPath, origin), {
      status: 301,
      headers: { "Cache-Control": "no-store, must-revalidate" },
    });
  }

  // 2. Named Section Destinations
  const to = searchParams.get("to");
  const ALLOWED_PATHS: Record<string, string> = {
    home:         "/",
    about:        "/about",
    team:         "/team",
    contact:      "/contact",
    shop:         "/shop",
    products:     "/products",
    brands:       "/brands",
    catalogs:     "/catalogs",
    downloads:    "/downloads",
    faq:          "/faq",
    blog:         "/blog",
    workspace:    "/workspace",
    login:        "/login",
    signup:       "/signup",
    "qr-generator": "/admin/qr-generator",
  };

  const destination = to ? (ALLOWED_PATHS[to.toLowerCase()] ?? "/") : "/";

  return NextResponse.redirect(new URL(destination, origin), {
    status: 301,
    headers: {
      "Cache-Control": "no-store, must-revalidate",
    },
  });
}

