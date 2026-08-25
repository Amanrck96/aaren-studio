const fs = require("fs");
const path = require("path");

const LOCAL_THUMBNAILS = {
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
  "swingnxt": "/catalogs/thumbnails/swingnxt_thumb.jpg",
  "wallways": "/catalogs/thumbnails/wallways_thumb.jpg",
  "closenxt": "/catalogs/thumbnails/closenxt_thumb.jpg",
  "glidenxt": "/catalogs/thumbnails/glidenxt_thumb.jpg",
  "slidenxt": "/catalogs/thumbnails/slidenxt_thumb.jpg",
};

function resolveThumb(pdfUrl, title, brandId) {
  if (!pdfUrl) return "";
  const driveMatch = pdfUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || pdfUrl.match(/id=([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w800`;
  }

  const filename = pdfUrl.split("/").pop() || pdfUrl;
  const baseKey = filename.replace(/\.pdf$/i, "").toLowerCase().replace(/[\s_]+/g, "-");
  if (LOCAL_THUMBNAILS[baseKey]) return LOCAL_THUMBNAILS[baseKey];

  const combined = `${pdfUrl} ${title || ""} ${brandId || ""}`.toLowerCase();
  if (combined.includes("newtech")) return "/catalogs/thumbnails/newtechwood-product-catalog-2025_thumb.jpg";
  if (combined.includes("fenix")) return "/catalogs/thumbnails/2024-fenix-brochure-digital_thumb.jpg";
  if (combined.includes("cora")) return "/catalogs/thumbnails/cora-printed-brochure-arrangement-en-th25_thumb.jpg";
  if (combined.includes("decometal")) return "/catalogs/thumbnails/decometal-catalogue-final_thumb.jpg";
  if (combined.includes("formica")) return "/catalogs/thumbnails/formica-global-catalogue-v2_thumb.jpg";
  if (combined.includes("arpa") || combined.includes("vis")) return "/catalogs/thumbnails/arpa-vis-brochure-250122_thumb.jpg";
  if (combined.includes("materia") || combined.includes("prima") || combined.includes("inkiostro")) return "/catalogs/thumbnails/catalogo-materiaprima-2026-2a_thumb.jpg";
  if (combined.includes("travertini")) return "/catalogs/thumbnails/catalogue-elysian-travertini-pdf_thumb.jpg";
  if (combined.includes("elysian")) return "/catalogs/thumbnails/catalogue-elysian-pdf_thumb.jpg";
  if (combined.includes("glocal")) return "/catalogs/thumbnails/catalogue-glocal-pdf_thumb.jpg";
  if (combined.includes("indomita")) return "/catalogs/thumbnails/catalogue-indomita-pdf_thumb.jpg";
  if (combined.includes("izumi")) return "/catalogs/thumbnails/catalogue-izumi-pdf_thumb.jpg";
  if (combined.includes("jewels")) return "/catalogs/thumbnails/catalogue-jewels-2-0-pdf_thumb.jpg";
  if (combined.includes("jurupa")) return "/catalogs/thumbnails/catalogue-jurupa-pdf_thumb.jpg";
  if (combined.includes("clay") || (combined.includes("mirage") && !combined.includes("waltz"))) return "/catalogs/thumbnails/catalogue-clay-pdf_thumb.jpg";
  if (combined.includes("aquarelle")) return "/catalogs/thumbnails/aquarelle_thumb.jpg";
  if (combined.includes("bits")) return "/catalogs/thumbnails/bits_thumb.jpg";
  if (combined.includes("60grados") || combined.includes("60 degrees") || combined.includes("60 degree")) return "/catalogs/thumbnails/catalogo60grados_thumb.jpg";
  if (combined.includes("bejmat")) return "/catalogs/thumbnails/catalogobejmat_thumb.jpg";
  if (combined.includes("nouvelle") || combined.includes("nouveau")) return "/catalogs/thumbnails/catalogo-nouvelle_thumb.jpg";
  if (combined.includes("sabil")) return "/catalogs/thumbnails/catalogo-sabil_thumb.jpg";
  if (combined.includes("terre")) return "/catalogs/thumbnails/catalogo-terre_thumb.jpg";
  if (combined.includes("vestige")) return "/catalogs/thumbnails/catalogo-vestige_thumb.jpg";
  if (combined.includes("swing")) return "/catalogs/thumbnails/swingnxt_thumb.jpg";
  if (combined.includes("wallway")) return "/catalogs/thumbnails/wallways_thumb.jpg";
  if (combined.includes("close")) return "/catalogs/thumbnails/closenxt_thumb.jpg";
  if (combined.includes("glide")) return "/catalogs/thumbnails/glidenxt_thumb.jpg";
  if (combined.includes("slide")) return "/catalogs/thumbnails/slidenxt_thumb.jpg";

  return "";
}

function runBackfill() {
  const filePath = path.join(process.cwd(), "data", "master_store.json");
  if (!fs.existsSync(filePath)) {
    console.error("master_store.json not found");
    return;
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(raw);

  let updatedCount = 0;

  if (Array.isArray(data.brands)) {
    data.brands.forEach((brand) => {
      if (Array.isArray(brand.pdfCatalogs)) {
        brand.pdfCatalogs.forEach((cat) => {
          const isMissing = !cat.coverImage || cat.coverImage.startsWith("/categories/cat_");
          if (isMissing && cat.pdfUrl) {
            const mapped = resolveThumb(cat.pdfUrl, cat.title, brand.id);
            if (mapped) {
              cat.coverImage = mapped;
              updatedCount++;
              console.log(`[Backfill] Updated "${brand.name}" -> "${cat.title}": ${mapped}`);
            }
          }
        });
      }
    });
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  console.log(`✅ [Backfill Complete] Updated ${updatedCount} catalog covers in data/master_store.json`);
}

runBackfill();
