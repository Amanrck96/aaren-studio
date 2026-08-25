import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

function normalizeFirebaseStorageUrl(url: string): string {
  if (!url.includes("firebasestorage.googleapis.com") || !url.includes("/o/")) {
    return url;
  }
  try {
    const parts = url.split("/o/");
    if (parts.length < 2) return url;
    const baseUrl = parts[0] + "/o/";
    const rest = parts[1];
    const queryIndex = rest.indexOf("?");
    const pathPart = queryIndex >= 0 ? rest.slice(0, queryIndex) : rest;
    let queryPart = queryIndex >= 0 ? rest.slice(queryIndex) : "";

    if (!queryPart) {
      queryPart = "?alt=media";
    } else if (!queryPart.includes("alt=media")) {
      queryPart += "&alt=media";
    }

    // Decode first to prevent double-encoding, then re-encode segments with %2F
    const rawSegments = decodeURIComponent(pathPart).split("/");
    const encodedPath = rawSegments.map((s) => encodeURIComponent(s)).join("%2F");
    return `${baseUrl}${encodedPath}${queryPart}`;
  } catch {
    return url;
  }
}

function sanitizeAndEncodeUrl(urlStr: string): string {
  try {
    const urlObj = new URL(urlStr);
    return urlObj.toString();
  } catch {
    return encodeURI(urlStr);
  }
}

function resolveGoogleDriveDownloadUrl(url: string): string {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.usercontent.google.com/download?id=${match[1]}&export=download&authuser=0&confirm=t`;
  }
  return url;
}

async function handlePdfProxy(rawUrl: string | null) {
  if (!rawUrl || !rawUrl.trim()) {
    return NextResponse.json(
      { success: false, error: "Missing 'url' parameter" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  let targetUrl = rawUrl.trim();

  // 1. Handle Local Filesystem Paths (e.g. /catalogs/... or /catalogues/... or localhost URLs)
  const isLocalOrigin =
    targetUrl.startsWith("/") ||
    targetUrl.includes("localhost:") ||
    targetUrl.includes("127.0.0.1:") ||
    (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://"));

  if (isLocalOrigin) {
    let cleanPath = targetUrl.replace(/^https?:\/\/[^/]+/, "").replace(/^[/\\]+/, "").replace(/\\/g, "/");
    cleanPath = decodeURIComponent(cleanPath);
    const candidates = [
      path.join(process.cwd(), "public", cleanPath),
      path.join(process.cwd(), "public", "catalogs", path.basename(cleanPath)),
      path.join(process.cwd(), "public", "catalogues", path.basename(cleanPath)),
      path.join(process.cwd(), "public", "uploads", path.basename(cleanPath)),
    ];

    const localFile = candidates.find((p) => fs.existsSync(p));
    if (localFile) {
      const fileBuffer = fs.readFileSync(localFile);
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Length": fileBuffer.length.toString(),
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
          ...CORS_HEADERS,
        },
      });
    }
  }

  // 2. Normalize Firebase Storage URL (Ensure %2F in /o/ paths and alt=media is preserved)
  if (targetUrl.includes("firebasestorage.googleapis.com")) {
    targetUrl = normalizeFirebaseStorageUrl(targetUrl);
  }

  // 3. Transform Google Drive Links
  if (targetUrl.includes("drive.google.com")) {
    targetUrl = resolveGoogleDriveDownloadUrl(targetUrl);
  }

  // 4. Safely encode any unencoded spaces or symbols in the URL
  targetUrl = sanitizeAndEncodeUrl(targetUrl);

  // Outgoing Request Diagnostic Details
  const isCloudinary = targetUrl.includes("res.cloudinary.com");
  const isFirebase = targetUrl.includes("firebasestorage.googleapis.com");
  const isGoogleDrive = targetUrl.includes("drive.google.com") || targetUrl.includes("drive.usercontent.google.com");
  const cloudinaryType = isCloudinary ? (targetUrl.includes("/raw/") ? "raw" : "image") : "N/A";
  const hasPageTransform = isCloudinary && targetUrl.includes("pg_1");

  const outgoingHeaders = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept: "application/pdf,*/*",
  };

  // 5. Fetch Remote URL via Node.js Server (Bypasses Browser CORS)
  console.log(`[PDF Proxy Outgoing Request]`, {
    method: "GET",
    url: targetUrl,
    headers: outgoingHeaders,
    diagnostics: {
      isCloudinary,
      cloudinaryType,
      hasPageTransform,
      isFirebase,
      isGoogleDrive,
    },
  });

  let response = await fetch(targetUrl, { headers: outgoingHeaders });

  // Cloudinary fallback: If image/upload PDF failed (due to restricted PDF delivery), try raw/upload
  if (!response.ok && isCloudinary && targetUrl.includes("/image/upload/")) {
    const rawFallbackUrl = targetUrl.replace("/image/upload/", "/raw/upload/");
    console.warn(`[PDF Proxy] Cloudinary image fetch failed (${response.status}). Retrying via raw endpoint: ${rawFallbackUrl}`);
    const fallbackRes = await fetch(rawFallbackUrl, { headers: outgoingHeaders });
    if (fallbackRes.ok) {
      response = fallbackRes;
      targetUrl = rawFallbackUrl;
    }
  }

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    const cldError = response.headers.get("x-cld-error");
    console.error(`[PDF Proxy] Remote fetch failed for ${targetUrl}: HTTP ${response.status} ${response.statusText}`, {
      errorBody: errorBody.slice(0, 500),
      cloudinaryError: cldError,
      responseHeaders: Object.fromEntries(response.headers.entries()),
    });
    return NextResponse.json(
      {
        success: false,
        error: `Failed to fetch remote PDF: HTTP ${response.status} ${response.statusText}${cldError ? ` (${cldError})` : errorBody ? `: ${errorBody.slice(0, 200)}` : ""}`,
        details: errorBody,
      },
      { status: response.status, headers: CORS_HEADERS }
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  const contentType = response.headers.get("content-type") || "application/pdf";

  return new NextResponse(arrayBuffer, {
    status: 200,
    headers: {
      "Content-Type": contentType.includes("pdf") ? "application/pdf" : contentType,
      "Content-Length": arrayBuffer.byteLength.toString(),
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
      ...CORS_HEADERS,
    },
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get("url");
    return await handlePdfProxy(targetUrl);
  } catch (err: any) {
    console.error("PDF Proxy GET Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to proxy PDF" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const targetUrl = body?.url;
    return await handlePdfProxy(targetUrl);
  } catch (err: any) {
    console.error("PDF Proxy POST Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to proxy PDF" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
