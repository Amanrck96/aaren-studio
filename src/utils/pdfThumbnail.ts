/**
 * Cloudinary Automatic Page-1 PDF Thumbnail Utility
 * 
 * Automatically generates a standardized, crisp Page-1 cover image for any PDF.
 * Uses Cloudinary on-the-fly transformations:
 * - pg_1 : extract page 1 as an image
 * - w_500,h_650,c_fill : crop and size consistently across all catalog cards
 * - q_auto,f_jpg : automatic quality and JPEG format delivery
 * 
 * Works for:
 * 1. Cloudinary public_ids (e.g. 'catalogs/slashform_2025', 'brochures/fenix_spec')
 * 2. Full Cloudinary URLs (e.g. 'https://res.cloudinary.com/.../upload/.../catalog.pdf')
 * 3. Google Drive links (extracts Google thumbnail)
 * 4. Local catalog assets (maps known catalogs to high-res cover thumbs)
 */

export function getPdfThumbnail(
  publicIdOrUrl: string,
  options?: {
    width?: number;
    height?: number;
    cloudName?: string;
    crop?: "fill" | "fit" | "limit" | "pad";
    title?: string;
  }
): string {
  if (!publicIdOrUrl) return "/catalogs/thumbnails/aquarelle_thumb.jpg";

  const cloudName =
    options?.cloudName ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME ||
    "aaren-studio";

  const width = options?.width || 500;
  const height = options?.height || 650;
  const crop = options?.crop || "fill";
  const transform = `pg_1,w_${width},h_${height},c_${crop},q_auto,f_jpg`;

  // 1. If it's a full Cloudinary URL:
  if (publicIdOrUrl.includes("res.cloudinary.com")) {
    // If it already has the transform, return as-is
    if (publicIdOrUrl.includes("pg_1")) {
      return publicIdOrUrl;
    }
    // Inject the page-1 transform into the Cloudinary upload URL
    const urlPattern = /(https:\/\/res\.cloudinary\.com\/[^/]+\/(?:image|raw)\/upload\/)(?:v\d+\/)?(.+?)(\.pdf)?$/i;
    const match = publicIdOrUrl.match(urlPattern);
    if (match) {
      const baseUrl = match[1].replace("/raw/", "/image/");
      const assetPath = match[2];
      return `${baseUrl}${transform}/${assetPath}.jpg`;
    }
  }

  // 2. If it's a Google Drive preview/file link:
  const driveMatch = publicIdOrUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || publicIdOrUrl.match(/id=([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w800`;
  }

  // 3. If it's a Cloudinary Public ID (not starting with http or /):
  if (!publicIdOrUrl.startsWith("http://") && !publicIdOrUrl.startsWith("https://") && !publicIdOrUrl.startsWith("/")) {
    const cleanPublicId = publicIdOrUrl.replace(/\.pdf$/i, "");
    return `https://res.cloudinary.com/${cloudName}/image/upload/${transform}/${cleanPublicId}.jpg`;
  }

  // 4. Local Catalog Asset Mapping fallback:
  const combined = `${publicIdOrUrl} ${options?.title || ""}`.toLowerCase();
  if (combined.includes("aquarelle")) return "/catalogs/thumbnails/aquarelle_thumb.jpg";
  if (combined.includes("bits")) return "/catalogs/thumbnails/bits_thumb.jpg";
  if (combined.includes("nouvelle") || combined.includes("nouveau")) return "/catalogs/thumbnails/catalogo-nouvelle_thumb.jpg";
  if (combined.includes("sabil")) return "/catalogs/thumbnails/catalogo-sabil_thumb.jpg";
  if (combined.includes("terre")) return "/catalogs/thumbnails/catalogo-terre_thumb.jpg";
  if (combined.includes("vestige")) return "/catalogs/thumbnails/catalogo-vestige_thumb.jpg";
  if (combined.includes("60 degree") || combined.includes("60grados") || combined.includes("60 grados")) return "/catalogs/thumbnails/catalogo60grados_thumb.jpg";
  if (combined.includes("materia") || combined.includes("prima") || combined.includes("inkiostro")) return "/catalogs/thumbnails/catalogo_materiaprima_2026_2a_thumb.jpg";
  if (combined.includes("bejmat")) return "/catalogs/thumbnails/catalogobejmat_thumb.jpg";
  if (combined.includes("clay") || combined.includes("elysian") || combined.includes("mirage")) return "/catalogs/thumbnails/catalogue-clay-pdf_thumb.jpg";
  if (combined.includes("arpa") || combined.includes("vis") || combined.includes("fenix") || combined.includes("formica")) return "/catalogs/thumbnails/arpa-vis-brochure_250122_thumb.jpg";
  if (combined.includes("slashform")) return "/catalogs/thumbnails/aquarelle_thumb.jpg";
  if (combined.includes("waltz")) return "/catalogs/thumbnails/bits_thumb.jpg";
  if (combined.includes("newtech")) return "/catalogs/thumbnails/catalogo-terre_thumb.jpg";

  // Default fallback
  return "/catalogs/thumbnails/aquarelle_thumb.jpg";
}
