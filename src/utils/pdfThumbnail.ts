/**
 * Cloudinary & Exact Page-1 PDF Thumbnail Utility
 * 
 * Automatically generates or maps the standardized, crisp Page-1 cover image for any PDF.
 * - Cloudinary on-the-fly transformations: pg_1,w_500,h_650,c_fill,q_auto,f_jpg
 * - Exact Page-1 extracted covers for all local catalog PDFs
 * - Google Drive thumbnail support
 * - Dynamic Brand & Product catalog resolver
 */

const LOCAL_THUMBNAILS: Record<string, string> = {
  // NewTechWood
  "newtechwood-product-catalog-2025": "/catalogs/thumbnails/newtechwood-product-catalog-2025_thumb.jpg",
  "newtechwood": "/catalogs/thumbnails/newtechwood-product-catalog-2025_thumb.jpg",
  
  // Fenix
  "2024-fenix-brochure-digital": "/catalogs/thumbnails/2024-fenix-brochure-digital_thumb.jpg",
  "fenix": "/catalogs/thumbnails/2024-fenix-brochure-digital_thumb.jpg",

  // Arpa
  "arpa-vis-brochure-250122": "/catalogs/thumbnails/arpa-vis-brochure-250122_thumb.jpg",
  "arpa-vis-brochure_250122": "/catalogs/thumbnails/arpa-vis-brochure-250122_thumb.jpg",
  "arpa": "/catalogs/thumbnails/arpa-vis-brochure-250122_thumb.jpg",

  // Cora
  "cora-printed-brochure-arrangement-en-th25": "/catalogs/thumbnails/cora-printed-brochure-arrangement-en-th25_thumb.jpg",
  "cora": "/catalogs/thumbnails/cora-printed-brochure-arrangement-en-th25_thumb.jpg",

  // Decometal
  "decometal-catalogue-final": "/catalogs/thumbnails/decometal-catalogue-final_thumb.jpg",
  "decometal": "/catalogs/thumbnails/decometal-catalogue-final_thumb.jpg",

  // Formica
  "formica-global-catalogue-v2": "/catalogs/thumbnails/formica-global-catalogue-v2_thumb.jpg",
  "formica": "/catalogs/thumbnails/formica-global-catalogue-v2_thumb.jpg",

  // Inkiostro Bianco / Materia Prima
  "catalogo-materiaprima-2026-2a": "/catalogs/thumbnails/catalogo-materiaprima-2026-2a_thumb.jpg",
  "catalogo_materiaprima_2026_2a": "/catalogs/thumbnails/catalogo-materiaprima-2026-2a_thumb.jpg",
  "materia-prima": "/catalogs/thumbnails/catalogo-materiaprima-2026-2a_thumb.jpg",
  "inkiostro-bianco": "/catalogs/thumbnails/catalogo-materiaprima-2026-2a_thumb.jpg",

  // Mirage
  "catalogue-clay-pdf": "/catalogs/thumbnails/catalogue-clay-pdf_thumb.jpg",
  "catalogue-clay": "/catalogs/thumbnails/catalogue-clay-pdf_thumb.jpg",
  "clay": "/catalogs/thumbnails/catalogue-clay-pdf_thumb.jpg",
  "catalogue-elysian-pdf": "/catalogs/thumbnails/catalogue-elysian-pdf_thumb.jpg",
  "catalogue-elysian": "/catalogs/thumbnails/catalogue-elysian-pdf_thumb.jpg",
  "elysian": "/catalogs/thumbnails/catalogue-elysian-pdf_thumb.jpg",
  "catalogue-elysian-travertini-pdf": "/catalogs/thumbnails/catalogue-elysian-travertini-pdf_thumb.jpg",
  "catalogue-elysian-travertini": "/catalogs/thumbnails/catalogue-elysian-travertini-pdf_thumb.jpg",
  "travertini": "/catalogs/thumbnails/catalogue-elysian-travertini-pdf_thumb.jpg",
  "catalogue-glocal-pdf": "/catalogs/thumbnails/catalogue-glocal-pdf_thumb.jpg",
  "catalogue-glocal": "/catalogs/thumbnails/catalogue-glocal-pdf_thumb.jpg",
  "glocal": "/catalogs/thumbnails/catalogue-glocal-pdf_thumb.jpg",
  "catalogue-indomita-pdf": "/catalogs/thumbnails/catalogue-indomita-pdf_thumb.jpg",
  "catalogue-indomita": "/catalogs/thumbnails/catalogue-indomita-pdf_thumb.jpg",
  "indomita": "/catalogs/thumbnails/catalogue-indomita-pdf_thumb.jpg",
  "catalogue-izumi-pdf": "/catalogs/thumbnails/catalogue-izumi-pdf_thumb.jpg",
  "catalogue-izumi": "/catalogs/thumbnails/catalogue-izumi-pdf_thumb.jpg",
  "izumi": "/catalogs/thumbnails/catalogue-izumi-pdf_thumb.jpg",
  "catalogue-jewels-2-0-pdf": "/catalogs/thumbnails/catalogue-jewels-2-0-pdf_thumb.jpg",
  "catalogue-jewels": "/catalogs/thumbnails/catalogue-jewels-2-0-pdf_thumb.jpg",
  "jewels": "/catalogs/thumbnails/catalogue-jewels-2-0-pdf_thumb.jpg",
  "catalogue-jurupa-pdf": "/catalogs/thumbnails/catalogue-jurupa-pdf_thumb.jpg",
  "catalogue-jurupa": "/catalogs/thumbnails/catalogue-jurupa-pdf_thumb.jpg",
  "jurupa": "/catalogs/thumbnails/catalogue-jurupa-pdf_thumb.jpg",

  // Natucer
  "aquarelle": "/catalogs/thumbnails/aquarelle_thumb.jpg",
  "bits": "/catalogs/thumbnails/bits_thumb.jpg",
  "catalogo-nouvelle": "/catalogs/thumbnails/catalogo-nouvelle_thumb.jpg",
  "nouvelle": "/catalogs/thumbnails/catalogo-nouvelle_thumb.jpg",
  "catalogo-sabil": "/catalogs/thumbnails/catalogo-sabil_thumb.jpg",
  "sabil": "/catalogs/thumbnails/catalogo-sabil_thumb.jpg",
  "catalogo-terre": "/catalogs/thumbnails/catalogo-terre_thumb.jpg",
  "terre": "/catalogs/thumbnails/catalogo-terre_thumb.jpg",
  "catalogo-vestige": "/catalogs/thumbnails/catalogo-vestige_thumb.jpg",
  "vestige": "/catalogs/thumbnails/catalogo-vestige_thumb.jpg",
  "catalogo60grados": "/catalogs/thumbnails/catalogo60grados_thumb.jpg",
  "60grados": "/catalogs/thumbnails/catalogo60grados_thumb.jpg",
  "catalogobejmat": "/catalogs/thumbnails/catalogobejmat_thumb.jpg",
  "bejmat": "/catalogs/thumbnails/catalogobejmat_thumb.jpg",

  // Waltz by JB Glass
  "swingnxt": "/catalogs/thumbnails/swingnxt_thumb.jpg",
  "swing-nxt": "/catalogs/thumbnails/swingnxt_thumb.jpg",
  "swing": "/catalogs/thumbnails/swingnxt_thumb.jpg",
  "wallways": "/catalogs/thumbnails/wallways_thumb.jpg",
  "wallway": "/catalogs/thumbnails/wallways_thumb.jpg",
  "closenxt": "/catalogs/thumbnails/closenxt_thumb.jpg",
  "close-nxt": "/catalogs/thumbnails/closenxt_thumb.jpg",
  "close": "/catalogs/thumbnails/closenxt_thumb.jpg",
  "glidenxt": "/catalogs/thumbnails/glidenxt_thumb.jpg",
  "glide-nxt": "/catalogs/thumbnails/glidenxt_thumb.jpg",
  "glide": "/catalogs/thumbnails/glidenxt_thumb.jpg",
  "slidenxt": "/catalogs/thumbnails/slidenxt_thumb.jpg",
  "slide-nxt": "/catalogs/thumbnails/slidenxt_thumb.jpg",
  "slide": "/catalogs/thumbnails/slidenxt_thumb.jpg",
  "waltz": "/catalogs/thumbnails/slidenxt_thumb.jpg",
  "jb-glass": "/catalogs/thumbnails/slidenxt_thumb.jpg",
  "waltz-by-jb-glass": "/catalogs/thumbnails/slidenxt_thumb.jpg",
};

export function getPdfThumbnail(
  publicIdOrUrl: string,
  options?: {
    width?: number;
    height?: number;
    cloudName?: string;
    crop?: "fill" | "fit" | "limit" | "pad";
    title?: string;
    coverImage?: string;
    brandId?: string;
  }
): string {
  // 0. If explicit cover image is provided, use it directly
  if (options?.coverImage && options.coverImage.trim()) {
    return options.coverImage.trim();
  }

  const titleStr = (options?.title || "").toLowerCase();
  const brandStr = (options?.brandId || "").toLowerCase();
  const urlStr = (publicIdOrUrl || "").toLowerCase();

  // 1. High-priority Brand & Title context matching:
  // Waltz by JB Glass
  if (brandStr.includes("waltz") || brandStr.includes("jb glass") || titleStr.includes("waltz") || titleStr.includes("jb glass")) {
    if (titleStr.includes("glide") || urlStr.includes("glide")) return "/catalogs/thumbnails/glidenxt_thumb.jpg";
    if (titleStr.includes("close") || urlStr.includes("close")) return "/catalogs/thumbnails/closenxt_thumb.jpg";
    if (titleStr.includes("swing") || urlStr.includes("swing")) return "/catalogs/thumbnails/swingnxt_thumb.jpg";
    if (titleStr.includes("wallway") || urlStr.includes("wallway")) return "/catalogs/thumbnails/wallways_thumb.jpg";
    return "/catalogs/thumbnails/slidenxt_thumb.jpg";
  }

  // Fenix
  if (brandStr.includes("fenix") || titleStr.includes("fenix") || urlStr.includes("fenix")) {
    return "/catalogs/thumbnails/2024-fenix-brochure-digital_thumb.jpg";
  }

  // Cora
  if (brandStr.includes("cora") || titleStr.includes("cora") || urlStr.includes("cora")) {
    return "/catalogs/thumbnails/cora-printed-brochure-arrangement-en-th25_thumb.jpg";
  }

  // DecoMetal
  if (brandStr.includes("decometal") || titleStr.includes("decometal") || urlStr.includes("decometal")) {
    return "/catalogs/thumbnails/decometal-catalogue-final_thumb.jpg";
  }

  // Arpa / Vis
  if (brandStr.includes("arpa") || titleStr.includes("arpa") || titleStr.includes("vis") || urlStr.includes("arpa") || urlStr.includes("vis")) {
    return "/catalogs/thumbnails/arpa-vis-brochure-250122_thumb.jpg";
  }

  // Formica
  if (brandStr.includes("formica") || titleStr.includes("formica") || urlStr.includes("formica")) {
    return "/catalogs/thumbnails/formica-global-catalogue-v2_thumb.jpg";
  }

  // Inkiostro Bianco / Materia Prima
  if (brandStr.includes("inkiostro") || brandStr.includes("materia") || titleStr.includes("materia") || titleStr.includes("inkiostro") || urlStr.includes("materia")) {
    return "/catalogs/thumbnails/catalogo-materiaprima-2026-2a_thumb.jpg";
  }

  // Mirage
  if (brandStr.includes("mirage") || urlStr.includes("mirage")) {
    if (titleStr.includes("travertini") || urlStr.includes("travertini")) return "/catalogs/thumbnails/catalogue-elysian-travertini-pdf_thumb.jpg";
    if (titleStr.includes("elysian") || urlStr.includes("elysian")) return "/catalogs/thumbnails/catalogue-elysian-pdf_thumb.jpg";
    if (titleStr.includes("glocal") || urlStr.includes("glocal")) return "/catalogs/thumbnails/catalogue-glocal-pdf_thumb.jpg";
    if (titleStr.includes("indomita") || urlStr.includes("indomita")) return "/catalogs/thumbnails/catalogue-indomita-pdf_thumb.jpg";
    if (titleStr.includes("izumi") || urlStr.includes("izumi")) return "/catalogs/thumbnails/catalogue-izumi-pdf_thumb.jpg";
    if (titleStr.includes("jewels") || urlStr.includes("jewels")) return "/catalogs/thumbnails/catalogue-jewels-2-0-pdf_thumb.jpg";
    if (titleStr.includes("jurupa") || urlStr.includes("jurupa")) return "/catalogs/thumbnails/catalogue-jurupa-pdf_thumb.jpg";
    return "/catalogs/thumbnails/catalogue-clay-pdf_thumb.jpg";
  }

  // Natucer
  if (brandStr.includes("natucer") || urlStr.includes("natucer") || titleStr.includes("natucer")) {
    if (titleStr.includes("60") || urlStr.includes("60")) return "/catalogs/thumbnails/catalogo60grados_thumb.jpg";
    if (titleStr.includes("bejmat") || urlStr.includes("bejmat")) return "/catalogs/thumbnails/catalogobejmat_thumb.jpg";
    if (titleStr.includes("nouvelle") || urlStr.includes("nouvelle")) return "/catalogs/thumbnails/catalogo-nouvelle_thumb.jpg";
    if (titleStr.includes("sabil") || urlStr.includes("sabil")) return "/catalogs/thumbnails/catalogo-sabil_thumb.jpg";
    if (titleStr.includes("vestige") || urlStr.includes("vestige")) return "/catalogs/thumbnails/catalogo-vestige_thumb.jpg";
    if (titleStr.includes("aquarelle") || urlStr.includes("aquarelle")) return "/catalogs/thumbnails/aquarelle_thumb.jpg";
    if (titleStr.includes("bits") || urlStr.includes("bits")) return "/catalogs/thumbnails/bits_thumb.jpg";
    return "/catalogs/thumbnails/catalogo-terre_thumb.jpg";
  }

  // NewTechWood
  if (brandStr.includes("newtech") || titleStr.includes("newtech") || urlStr.includes("newtech")) {
    return "/catalogs/thumbnails/newtechwood-product-catalog-2025_thumb.jpg";
  }

  if (!publicIdOrUrl) return "";

  const cloudName =
    options?.cloudName ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME ||
    "aaren-studio";

  const width = options?.width || 500;
  const height = options?.height || 650;
  const crop = options?.crop || "fill";
  const transform = `pg_1,w_${width},h_${height},c_${crop},q_auto,f_jpg`;

  // 2. If it's a full Cloudinary URL:
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

  // 3. If it's a Google Drive preview/file link:
  const driveMatch = publicIdOrUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || publicIdOrUrl.match(/id=([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w800`;
  }

  // 4. If it's a Cloudinary Public ID (not starting with http or /):
  if (!publicIdOrUrl.startsWith("http://") && !publicIdOrUrl.startsWith("https://") && !publicIdOrUrl.startsWith("/")) {
    const cleanPublicId = publicIdOrUrl.replace(/\.pdf$/i, "");
    return `https://res.cloudinary.com/${cloudName}/image/upload/${transform}/${cleanPublicId}.jpg`;
  }

  // 5. Exact Local PDF File Match:
  const filename = publicIdOrUrl.split("/").pop() || publicIdOrUrl;
  const baseKey = filename.replace(/\.pdf$/i, "").toLowerCase().replace(/[\s_]+/g, "-");
  
  if (LOCAL_THUMBNAILS[baseKey]) {
    return LOCAL_THUMBNAILS[baseKey];
  }

  // 6. Generic Title Fallback Checks:
  if (titleStr.includes("slide") || urlStr.includes("slide")) return "/catalogs/thumbnails/slidenxt_thumb.jpg";
  if (titleStr.includes("glide") || urlStr.includes("glide")) return "/catalogs/thumbnails/glidenxt_thumb.jpg";
  if (titleStr.includes("close") || urlStr.includes("close")) return "/catalogs/thumbnails/closenxt_thumb.jpg";
  if (titleStr.includes("swing") || urlStr.includes("swing")) return "/catalogs/thumbnails/swingnxt_thumb.jpg";
  if (titleStr.includes("wallway") || urlStr.includes("wallway")) return "/catalogs/thumbnails/wallways_thumb.jpg";
  if (titleStr.includes("travertini") || urlStr.includes("travertini")) return "/catalogs/thumbnails/catalogue-elysian-travertini-pdf_thumb.jpg";
  if (titleStr.includes("elysian") || urlStr.includes("elysian")) return "/catalogs/thumbnails/catalogue-elysian-pdf_thumb.jpg";
  if (titleStr.includes("glocal") || urlStr.includes("glocal")) return "/catalogs/thumbnails/catalogue-glocal-pdf_thumb.jpg";
  if (titleStr.includes("indomita") || urlStr.includes("indomita")) return "/catalogs/thumbnails/catalogue-indomita-pdf_thumb.jpg";
  if (titleStr.includes("izumi") || urlStr.includes("izumi")) return "/catalogs/thumbnails/catalogue-izumi-pdf_thumb.jpg";
  if (titleStr.includes("jewels") || urlStr.includes("jewels")) return "/catalogs/thumbnails/catalogue-jewels-2-0-pdf_thumb.jpg";
  if (titleStr.includes("jurupa") || urlStr.includes("jurupa")) return "/catalogs/thumbnails/catalogue-jurupa-pdf_thumb.jpg";
  if (titleStr.includes("clay") || urlStr.includes("clay")) return "/catalogs/thumbnails/catalogue-clay-pdf_thumb.jpg";
  if (titleStr.includes("aquarelle") || urlStr.includes("aquarelle")) return "/catalogs/thumbnails/aquarelle_thumb.jpg";
  if (titleStr.includes("bits") || urlStr.includes("bits")) return "/catalogs/thumbnails/bits_thumb.jpg";
  if (titleStr.includes("60grados") || titleStr.includes("60 degrees") || urlStr.includes("60grados")) return "/catalogs/thumbnails/catalogo60grados_thumb.jpg";
  if (titleStr.includes("bejmat") || urlStr.includes("bejmat")) return "/catalogs/thumbnails/catalogobejmat_thumb.jpg";
  if (titleStr.includes("nouvelle") || urlStr.includes("nouvelle")) return "/catalogs/thumbnails/catalogo-nouvelle_thumb.jpg";
  if (titleStr.includes("sabil") || urlStr.includes("sabil")) return "/catalogs/thumbnails/catalogo-sabil_thumb.jpg";
  if (titleStr.includes("terre") || urlStr.includes("terre")) return "/catalogs/thumbnails/catalogo-terre_thumb.jpg";
  if (titleStr.includes("vestige") || urlStr.includes("vestige")) return "/catalogs/thumbnails/catalogo-vestige_thumb.jpg";

  return "";
}

/**
 * Resolves the accurate catalog PDF URL and Page 1 cover thumbnail for any product or brand item.
 */
export function resolveCatalogDetails(item: {
  catalogPdfUrl?: string;
  pdfUrl?: string;
  fileUrl?: string;
  title?: string;
  name?: string;
  brand?: string;
  coverImage?: string;
}): { pdfUrl: string; coverThumb: string; title: string } {
  const brand = (item.brand || "").trim();
  const name = (item.name || item.title || "").trim();
  const rawUrl = (item.catalogPdfUrl || item.pdfUrl || item.fileUrl || "").trim();
  const explicitCover = (item.coverImage || "").trim();

  const brandLower = brand.toLowerCase();
  const nameLower = name.toLowerCase();
  const urlLower = rawUrl.toLowerCase();

  let resolvedPdf = rawUrl;

  // If no raw URL provided or if it's a relative name, map to correct catalog
  if (!rawUrl || !rawUrl.startsWith("http")) {
    if (brandLower.includes("waltz") || brandLower.includes("jb glass") || nameLower.includes("waltz") || nameLower.includes("jb glass")) {
      if (nameLower.includes("glide") || urlLower.includes("glide")) resolvedPdf = "/catalogs/GlideNXT.pdf";
      else if (nameLower.includes("close") || urlLower.includes("close")) resolvedPdf = "/catalogs/CloseNXT.pdf";
      else if (nameLower.includes("swing") || urlLower.includes("swing")) resolvedPdf = "/catalogs/SwingNXT.pdf";
      else if (nameLower.includes("wallway") || urlLower.includes("wallway")) resolvedPdf = "/catalogs/WALLWAYS.pdf";
      else resolvedPdf = "/catalogs/SlideNXT.pdf";
    } else if (brandLower.includes("fenix") || nameLower.includes("fenix")) {
      resolvedPdf = "/catalogues/Formica/2024-FENIX-brochure-digital.pdf";
    } else if (brandLower.includes("cora") || nameLower.includes("cora")) {
      resolvedPdf = "/catalogues/Formica/Cora-Printed-Brochure-Arrangement-EN-TH25.pdf";
    } else if (brandLower.includes("decometal") || nameLower.includes("decometal")) {
      resolvedPdf = "/catalogues/Formica/Decometal-Catalogue-Final.pdf";
    } else if (brandLower.includes("arpa") || nameLower.includes("vis") || nameLower.includes("arpa")) {
      resolvedPdf = "/catalogues/Formica/arpa-vis-brochure_250122.pdf";
    } else if (brandLower.includes("formica") || nameLower.includes("formica")) {
      resolvedPdf = "/catalogues/Formica/Formica-Global-Catalogue-V2.pdf";
    } else if (brandLower.includes("inkiostro") || brandLower.includes("materia") || nameLower.includes("materia")) {
      resolvedPdf = "/catalogues/Inkiastro Bianco/CATALOGO_MATERIAPRIMA_2026_2a.pdf";
    } else if (brandLower.includes("mirage")) {
      if (nameLower.includes("travertini") || urlLower.includes("travertini")) resolvedPdf = "/catalogues/Mirage/catalogue-elysian-travertini-pdf.pdf";
      else if (nameLower.includes("elysian") || urlLower.includes("elysian")) resolvedPdf = "/catalogues/Mirage/catalogue-elysian-pdf.pdf";
      else if (nameLower.includes("glocal") || urlLower.includes("glocal")) resolvedPdf = "/catalogues/Mirage/catalogue-glocal-pdf.pdf";
      else if (nameLower.includes("indomita") || urlLower.includes("indomita")) resolvedPdf = "/catalogues/Mirage/catalogue-indomita-pdf.pdf";
      else if (nameLower.includes("izumi") || urlLower.includes("izumi")) resolvedPdf = "/catalogues/Mirage/catalogue-izumi-pdf.pdf";
      else if (nameLower.includes("jewels") || urlLower.includes("jewels")) resolvedPdf = "/catalogues/Mirage/catalogue-jewels-2-0-pdf.pdf";
      else if (nameLower.includes("jurupa") || urlLower.includes("jurupa")) resolvedPdf = "/catalogues/Mirage/catalogue-jurupa-pdf.pdf";
      else resolvedPdf = "/catalogues/Mirage/catalogue-clay-pdf.pdf";
    } else if (brandLower.includes("natucer")) {
      if (nameLower.includes("60") || urlLower.includes("60")) resolvedPdf = "/catalogs/catalogo60grados.pdf";
      else if (nameLower.includes("bejmat") || urlLower.includes("bejmat")) resolvedPdf = "/catalogs/catalogobejmat.pdf";
      else if (nameLower.includes("nouvelle") || urlLower.includes("nouvelle")) resolvedPdf = "/catalogs/catalogo-nouvelle.pdf";
      else if (nameLower.includes("sabil") || urlLower.includes("sabil")) resolvedPdf = "/catalogs/catalogo-sabil.pdf";
      else if (nameLower.includes("vestige") || urlLower.includes("vestige")) resolvedPdf = "/catalogs/catalogo-vestige.pdf";
      else if (nameLower.includes("aquarelle") || urlLower.includes("aquarelle")) resolvedPdf = "/catalogs/aquarelle.pdf";
      else if (nameLower.includes("bits") || urlLower.includes("bits")) resolvedPdf = "/catalogs/bits.pdf";
      else resolvedPdf = "/catalogs/catalogo-terre.pdf";
    } else if (brandLower.includes("freedom")) {
      resolvedPdf = "/catalogues/FreedomScreens/Freedom_Screens_2026.pdf";
    } else if (brandLower.includes("newtech")) {
      resolvedPdf = "/catalogues/NewTechWood/NewTechWood-Product-Catalog-2025.pdf";
    } else if (!resolvedPdf) {
      resolvedPdf = "/catalogues/NewTechWood/NewTechWood-Product-Catalog-2025.pdf";
    }
  }

  const coverThumb = explicitCover || getPdfThumbnail(resolvedPdf, {
    title: name,
    brandId: brand,
    coverImage: explicitCover,
  });

  const fullTitle = brand && name && !name.toLowerCase().includes(brand.toLowerCase())
    ? `${brand} - ${name}`
    : (name || brand || "Official Architectural Catalogue");

  return {
    pdfUrl: resolvedPdf,
    coverThumb,
    title: fullTitle,
  };
}

