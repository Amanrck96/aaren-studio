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
    const queryPart = queryIndex >= 0 ? rest.slice(queryIndex) : "";

    // Decode first to prevent double-encoding, then re-encode segments with %2F
    const rawSegments = decodeURIComponent(pathPart).split("/");
    const encodedPath = rawSegments.map((s) => encodeURIComponent(s)).join("%2F");
    return `${baseUrl}${encodedPath}${queryPart}`;
  } catch {
    return url;
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

  // 1. Handle Local Filesystem Paths (e.g. /catalogs/... or /catalogues/...)
  if (targetUrl.startsWith("/") || (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://"))) {
    const cleanPath = targetUrl.replace(/^[/\\]+/, "").replace(/\\/g, "/");
    const candidates = [
      path.join(process.cwd(), "public", cleanPath),
      path.join(process.cwd(), "public", "catalogs", path.basename(cleanPath)),
      path.join(process.cwd(), "public", "catalogues", path.basename(cleanPath)),
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

  // 2. Normalize Firebase Storage URL (Ensure %2F in /o/ paths is preserved)
  if (targetUrl.includes("firebasestorage.googleapis.com")) {
    targetUrl = normalizeFirebaseStorageUrl(targetUrl);
  }

  // 3. Transform Google Drive Links
  if (targetUrl.includes("drive.google.com")) {
    targetUrl = resolveGoogleDriveDownloadUrl(targetUrl);
  }

  // 4. Fetch Remote URL via Node.js Server (Bypasses Browser CORS)
  console.log(`[PDF Proxy] Fetching target: ${targetUrl}`);
  const response = await fetch(targetUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "application/pdf,*/*",
    },
  });

  if (!response.ok) {
    console.error(`[PDF Proxy] Remote fetch failed for ${targetUrl}: HTTP ${response.status} ${response.statusText}`);
    return NextResponse.json(
      { success: false, error: `Failed to fetch remote PDF: HTTP ${response.status} ${response.statusText}` },
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
