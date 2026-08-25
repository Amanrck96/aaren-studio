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

function resolveGoogleDriveDownloadUrl(url: string): string {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }
  return url;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let targetUrl = searchParams.get("url");

    if (!targetUrl) {
      return NextResponse.json(
        { success: false, error: "Missing 'url' parameter" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    targetUrl = decodeURIComponent(targetUrl.trim());

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

    // 2. Transform Google Drive Links
    if (targetUrl.includes("drive.google.com")) {
      targetUrl = resolveGoogleDriveDownloadUrl(targetUrl);
    }

    // 3. Fetch Remote URL via Node.js Server (Bypasses Browser CORS)
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/pdf,*/*",
      },
    });

    if (!response.ok) {
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
  } catch (err: any) {
    console.error("PDF Proxy Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to proxy PDF" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
