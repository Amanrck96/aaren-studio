import { NextResponse } from "next/server";
import { getBrandsStore, saveBrandStore } from "@/lib/store";
import { getPdfThumbnail } from "@/utils/pdfThumbnail";

export const dynamic = "force-dynamic";

function resolveGoogleDriveThumbnail(url: string): string | null {
  if (!url) return null;
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;
  }
  return null;
}

export async function POST() {
  try {
    const brands = await getBrandsStore();
    let updatedBrandsCount = 0;
    let updatedCatalogsCount = 0;

    for (const brand of brands) {
      let brandChanged = false;
      const pdfCatalogs = Array.isArray(brand.pdfCatalogs) ? [...brand.pdfCatalogs] : [];

      // 1. Process pdfCatalogs array
      for (let i = 0; i < pdfCatalogs.length; i++) {
        const cat = pdfCatalogs[i];
        const rawPdf = cat.pdfUrl || "";
        const currentCover = cat.coverImage;

        const isMissingOrGeneric =
          !currentCover ||
          currentCover.trim() === "" ||
          currentCover.startsWith("/categories/cat_");

        if (rawPdf && isMissingOrGeneric) {
          // Check Google Drive
          const driveThumb = resolveGoogleDriveThumbnail(rawPdf);
          if (driveThumb) {
            pdfCatalogs[i] = { ...cat, coverImage: driveThumb };
            brandChanged = true;
            updatedCatalogsCount++;
            continue;
          }

          // Check standard local thumbnail maps
          const mappedThumb = getPdfThumbnail(rawPdf, {
            title: cat.title,
            brandId: brand.id,
          });

          if (mappedThumb && !mappedThumb.startsWith("/categories/cat_")) {
            pdfCatalogs[i] = { ...cat, coverImage: mappedThumb };
            brandChanged = true;
            updatedCatalogsCount++;
          }
        }
      }

      // 2. Process primary catalogPdfUrl if present
      if (brand.catalogPdfUrl && (!brand.pdfCatalogs || brand.pdfCatalogs.length === 0)) {
        const driveThumb = resolveGoogleDriveThumbnail(brand.catalogPdfUrl);
        const mappedThumb = driveThumb || getPdfThumbnail(brand.catalogPdfUrl, { title: brand.name, brandId: brand.id });
        if (mappedThumb) {
          pdfCatalogs.push({
            id: `cat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            title: `${brand.name} Specification Catalog`,
            pdfUrl: brand.catalogPdfUrl,
            coverImage: mappedThumb,
          });
          brandChanged = true;
          updatedCatalogsCount++;
        }
      }

      if (brandChanged) {
        await saveBrandStore({
          ...brand,
          pdfCatalogs,
        });
        updatedBrandsCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Backfilled covers for ${updatedCatalogsCount} catalog(s) across ${updatedBrandsCount} brand(s).`,
      updatedBrandsCount,
      updatedCatalogsCount,
    });
  } catch (err: any) {
    console.error("Backfill covers error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to backfill covers" },
      { status: 500 }
    );
  }
}
