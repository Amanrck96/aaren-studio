import { getBrandsStore } from "@/lib/store";
import BrandsClient, { MappedBrand } from "./BrandsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const LOGO_MAP: Record<string, string> = {
  "slashform": "/brands/logos/slashform_logo.png",
  "waltz": "/brands/logos/waltz_logo.png",
  "newtech-wood": "/brands/logos/newtechwood_logo.png",
  "newtechwood": "/brands/logos/newtechwood_logo.png",
  "formica": "/brands/logos/formica_logo.png",
  "loco": "/brands/logos/loco_logo.png",
  "falper": "/brands/logos/falper_logo.png",
  "fima": "/brands/logos/fima_logo.png",
  "inkiostro-bianco": "/brands/logos/inkiostro_bianco_logo.png",
  "mafi": "/brands/logos/mafi_logo.png",
  "mirage": "/brands/logos/mirage_logo.png",
  "freedom-screens": "/brands/logos/freedom_screens_logo.jpg",
  "peelply": "/brands/logos/peelply_logo.png",
  "inclass": "/brands/logos/inclass_logo.png",
  "wow": "/brands/logos/wow_logo.png",
  "iww": "/brands/logos/iww_logo.png",
  "living-ceramica": "/brands/logos/living-ceramica_logo.png",
  "florim": "/brands/logos/florim_logo.png",
  "jacuzzi": "/brands/logos/jacuzzi_logo.png",
  "alex-turco": "/brands/logos/alex-turco_logo.png",
};

export default async function BrandsPage() {
  const brands = await getBrandsStore();

  const mapped: MappedBrand[] = (brands || []).map((b: any) => {
    const isBase64 = typeof b.logoUrl === "string" && b.logoUrl.startsWith("data:");
    const explicitLogo = b.logoUrl && !isBase64 && !b.logoUrl.includes("brand_") && !b.logoUrl.endsWith("_2.png") ? b.logoUrl : "";
    const resolvedLogo = explicitLogo || LOGO_MAP[b.id] || LOGO_MAP[b.id?.toLowerCase()] || "";

    let heroUrl = b.bannerUrl || b.hero || b.imageUrl || b.image || "/brands/brand_1_1.jpg";
    if (typeof heroUrl === "string" && heroUrl.startsWith("data:")) {
      heroUrl = b.id === "peelply" ? "/brands/peelply_banner.jpg" : "/brands/brand_1_1.jpg";
    }

    return {
      id: b.id,
      name: b.name,
      code: b.shortCode ? b.shortCode.split(" ")[0] : "BR",
      num: b.sequenceNumber ? String(b.sequenceNumber).padStart(2, "0") : (b.shortCode && b.shortCode.split(" ")[1] ? b.shortCode.split(" ")[1] : "01"),
      hero: heroUrl,
      logo: resolvedLogo,
      category: b.category || b.tagline || b.description || "Architectural Brand",
      origin: b.origin || "Global",
      tagline: b.tagline || b.description || "Partner Brand",
    };
  });

  return <BrandsClient initialBrands={mapped} />;
}
