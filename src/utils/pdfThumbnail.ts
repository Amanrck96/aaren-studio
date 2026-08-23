/**
 * Cloudinary & Exact Page-1 PDF Thumbnail Utility
 * 
 * Automatically generates or maps the standardized, crisp Page-1 cover image for any PDF.
 * - Cloudinary on-the-fly transformations: pg_1,w_500,h_650,c_fill,q_auto,f_jpg
 * - Exact Page-1 extracted covers for all local catalog PDFs
 * - Google Drive thumbnail support
 */

const LOCAL_THUMBNAILS: Record<string, string> = {
  "newtechwood-product-catalog-2025": "/catalogs/thumbnails/newtechwood-product-catalog-2025_thumb.jpg",
  "2024-fenix-brochure-digital": "/catalogs/thumbnails/2024-fenix-brochure-digital_thumb.jpg",
  "arpa-vis-brochure-250122": "/catalogs/thumbnails/arpa-vis-brochure-250122_thumb.jpg",
  "arpa-vis-brochure_250122": "/catalogs/thumbnails/arpa-vis-brochure-250122_thumb.jpg",
  "cora-printed-brochure-arrangement-en-th25": "/catalogs/thumbnails/cora-printed-brochure-arrangement-en-th25_thumb.jpg",
  "decometal-catalogue-final": "/catalogs/thumbnails/decometal-catalogue-final_thumb.jpg",
  "formica-global-catalogue-v2": "/catalogs/thumbnails/formica-global-catalogue-v2_thumb.jpg",
  "catalogo-materiaprima-2026-2a": "/catalogs/thumbnails/catalogo-materiaprima-2026-2a_thumb.jpg",
  "catalogo_materiaprima_2026_2a": "/catalogs/thumbnails/catalogo-materiaprima-2026-2a_thumb.jpg",
  "catalogue-clay-pdf": "/catalogs/thumbnails/catalogue-clay-pdf_thumb.jpg",
  "catalogue-elysian-pdf": "/catalogs/thumbnails/catalogue-elysian-pdf_thumb.jpg",
  "catalogue-elysian-travertini-pdf": "/catalogs/thumbnails/catalogue-elysian-travertini-pdf_thumb.jpg",
  "catalogue-glocal-pdf": "/catalogs/thumbnails/catalogue-glocal-pdf_thumb.jpg",
  "catalogue-indomita-pdf": "/catalogs/thumbnails/catalogue-indomita-pdf_thumb.jpg",
  "catalogue-izumi-pdf": "/catalogs/thumbnails/catalogue-izumi-pdf_thumb.jpg",
  "catalogue-jewels-2-0-pdf": "/catalogs/thumbnails/catalogue-jewels-2-0-pdf_thumb.jpg",
  "catalogue-jurupa-pdf": "/catalogs/thumbnails/catalogue-jurupa-pdf_thumb.jpg",
  "aquarelle": "/catalogs/thumbnails/aquarelle_thumb.jpg",
  "bits": "/catalogs/thumbnails/bits_thumb.jpg",
  "catalogo-nouvelle": "/catalogs/thumbnails/catalogo-nouvelle_thumb.jpg",
  "catalogo-sabil": "/catalogs/thumbnails/catalogo-sabil_thumb.jpg",
  "catalogo-terre": "/catalogs/thumbnails/catalogo-terre_thumb.jpg",
  "catalogo-vestige": "/catalogs/thumbnails/catalogo-vestige_thumb.jpg",
  "catalogo60grados": "/catalogs/thumbnails/catalogo60grados_thumb.jpg",
  "catalogobejmat": "/catalogs/thumbnails/catalogobejmat_thumb.jpg",
};

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
  if (!publicIdOrUrl) return "/catalogs/thumbnails/newtechwood-product-catalog-2025_thumb.jpg";

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
    if (publicIdOrUrl.includes("pg_1")) {
      return publicIdOrUrl;
    }
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

  // 4. Exact Local PDF File Match:
  const filename = publicIdOrUrl.split("/").pop() || publicIdOrUrl;
  const baseKey = filename.replace(/\.pdf$/i, "").toLowerCase().replace(/[\s_]+/g, "-");
  
  if (LOCAL_THUMBNAILS[baseKey]) {
    return LOCAL_THUMBNAILS[baseKey];
  }

  // 5. Keyword Fuzzy Match:
  const combined = `${publicIdOrUrl} ${options?.title || ""}`.toLowerCase();
  if (combined.includes("newtech") || combined.includes("wood")) return "/catalogs/thumbnails/newtechwood-product-catalog-2025_thumb.jpg";
  if (combined.includes("fenix")) return "/catalogs/thumbnails/2024-fenix-brochure-digital_thumb.jpg";
  if (combined.includes("cora")) return "/catalogs/thumbnails/cora-printed-brochure-arrangement-en-th25_thumb.jpg";
  if (combined.includes("decometal")) return "/catalogs/thumbnails/decometal-catalogue-final_thumb.jpg";
  if (combined.includes("formica")) return "/catalogs/thumbnails/formica-global-catalogue-v2_thumb.jpg";
  if (combined.includes("arpa") || combined.includes("vis")) return "/catalogs/thumbnails/arpa-vis-brochure-250122_thumb.jpg";
  if (combined.includes("materia") || combined.includes("prima") || combined.includes("inkiastro")) return "/catalogs/thumbnails/catalogo-materiaprima-2026-2a_thumb.jpg";
  if (combined.includes("travertini")) return "/catalogs/thumbnails/catalogue-elysian-travertini-pdf_thumb.jpg";
  if (combined.includes("elysian")) return "/catalogs/thumbnails/catalogue-elysian-pdf_thumb.jpg";
  if (combined.includes("glocal")) return "/catalogs/thumbnails/catalogue-glocal-pdf_thumb.jpg";
  if (combined.includes("indomita")) return "/catalogs/thumbnails/catalogue-indomita-pdf_thumb.jpg";
  if (combined.includes("izumi")) return "/catalogs/thumbnails/catalogue-izumi-pdf_thumb.jpg";
  if (combined.includes("jewels")) return "/catalogs/thumbnails/catalogue-jewels-2-0-pdf_thumb.jpg";
  if (combined.includes("jurupa")) return "/catalogs/thumbnails/catalogue-jurupa-pdf_thumb.jpg";
  if (combined.includes("clay") || combined.includes("mirage")) return "/catalogs/thumbnails/catalogue-clay-pdf_thumb.jpg";
  if (combined.includes("aquarelle") || combined.includes("slashform")) return "/catalogs/thumbnails/aquarelle_thumb.jpg";
  if (combined.includes("bits") || combined.includes("waltz")) return "/catalogs/thumbnails/bits_thumb.jpg";
  if (combined.includes("nouvelle") || combined.includes("nouveau")) return "/catalogs/thumbnails/catalogo-nouvelle_thumb.jpg";
  if (combined.includes("sabil")) return "/catalogs/thumbnails/catalogo-sabil_thumb.jpg";
  if (combined.includes("terre")) return "/catalogs/thumbnails/catalogo-terre_thumb.jpg";
  if (combined.includes("vestige")) return "/catalogs/thumbnails/catalogo-vestige_thumb.jpg";
  if (combined.includes("60grados") || combined.includes("60 grados") || combined.includes("60 degree")) return "/catalogs/thumbnails/catalogo60grados_thumb.jpg";
  if (combined.includes("bejmat")) return "/catalogs/thumbnails/catalogobejmat_thumb.jpg";

  return "/catalogs/thumbnails/newtechwood-product-catalog-2025_thumb.jpg";
}

