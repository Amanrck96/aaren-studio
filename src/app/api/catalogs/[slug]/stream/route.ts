import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { getCatalogsStore } from "@/lib/store";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

// Configure Cloudinary from environment
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export async function GET(req: Request, { params }: RouteProps) {
  try {
    const { slug } = await params;
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return new Response("Unauthorized: Access token missing", { status: 401 });
    }

    const secret =
      process.env.VIEW_TOKEN_SECRET ||
      process.env.NEXTAUTH_SECRET ||
      "aaren-studio-view-token-secret-key-2026";

    let payload: any;
    try {
      payload = jwt.verify(token, secret);
    } catch (tokenErr) {
      return new Response("Unauthorized: Invalid or expired token", { status: 401 });
    }

    // Resolve Catalog
    let catalog: any = null;
    try {
      catalog = await prisma.catalog.findUnique({
        where: { slug },
      });
    } catch (dbErr) {
      console.warn("Prisma catalog stream lookup fallback:", dbErr);
    }

    if (!catalog) {
      const catalogs = await getCatalogsStore();
      catalog = catalogs.find(
        (c) =>
          (c as any).slug === slug ||
          c.id === slug ||
          c.fileName?.toLowerCase().includes(slug.toLowerCase()) ||
          c.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug
      );
    }

    if (!catalog) {
      return new Response("Catalog not found", { status: 404 });
    }

    // Token validation: Check catalog ID or slug matches token payload
    const matchesCatalog =
      payload.catalogId === catalog.id ||
      payload.slug === slug ||
      payload.slug === catalog.slug ||
      payload.catalogId === "general-catalog";

    if (!matchesCatalog) {
      return new Response("Unauthorized: Token does not match this catalog", { status: 403 });
    }

    // Delivery Strategy 1: Cloudinary Authenticated Private Delivery
    const pdfPublicId = catalog.pdfPublicId || catalog.fileUrl;

    if (
      pdfPublicId &&
      !pdfPublicId.startsWith("/") &&
      !pdfPublicId.startsWith("http") &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_KEY !== "mock_key"
    ) {
      try {
        // Mint 2-minute signed authenticated URL (never exposed to client directly)
        const signedUrl = cloudinary.url(pdfPublicId, {
          resource_type: "raw",
          type: "authenticated",
          sign_url: true,
          expires_at: Math.floor(Date.now() / 1000) + 120,
        });

        const cloudRes = await fetch(signedUrl);
        if (cloudRes.ok && cloudRes.body) {
          return new Response(cloudRes.body, {
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": `inline; filename="${slug}.pdf"`,
              "Cache-Control": "private, no-cache, no-store, must-revalidate",
              "X-Content-Type-Options": "nosniff",
            },
          });
        }
      } catch (cloudErr) {
        console.warn("Cloudinary signed stream fetch fallback:", cloudErr);
      }
    }

    // Delivery Strategy 2: Local Static File or Remote Public URL fallback
    const rawPath = catalog.fileUrl || catalog.fileName;
    if (rawPath) {
      // If full remote HTTP URL
      if (rawPath.startsWith("http://") || rawPath.startsWith("https://")) {
        const remoteRes = await fetch(rawPath);
        if (remoteRes.ok && remoteRes.body) {
          return new Response(remoteRes.body, {
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": `inline; filename="${slug}.pdf"`,
              "Cache-Control": "private, no-cache, no-store, must-revalidate",
            },
          });
        }
      }

      // If local filesystem asset (e.g. /catalogs/aquarelle.pdf or /catalogues/Formica/...)
      const cleanRelative = decodeURIComponent(rawPath.replace(/\\/g, "/").replace(/^\/+/, ""));
      const candidates = [
        path.join(process.cwd(), "public", cleanRelative),
        path.join(process.cwd(), "public", cleanRelative.startsWith("catalogs") || cleanRelative.startsWith("catalogues") ? cleanRelative : `catalogs/${cleanRelative}`),
        path.join(process.cwd(), "public", "catalogs", path.basename(cleanRelative)),
        path.join(process.cwd(), "public", "catalogues", path.basename(cleanRelative)),
      ];

      const localFilePath = candidates.find((p) => fs.existsSync(p));

      if (localFilePath) {
        const fileBuffer = fs.readFileSync(localFilePath);
        return new Response(fileBuffer, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename="${slug}.pdf"`,
            "Cache-Control": "private, no-cache, no-store, must-revalidate",
          },
        });
      }
    }

    return new Response("PDF source file not found or unavailable for streaming", { status: 404 });
  } catch (err: any) {
    console.error("GET /api/catalogs/[slug]/stream Error:", err);
    return new Response("Internal Server Error: " + (err.message || "Failed to stream PDF"), {
      status: 500,
    });
  }
}
