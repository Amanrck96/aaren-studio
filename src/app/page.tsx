import { getSiteSettingsStore, getCategoriesStore, getBrandsStore, getAllProjectsStore } from "@/lib/store";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

const CATEGORY_BRAND_LOGOS: Record<string, string> = {
  "plywood": "/brands/logos/peelply_logo.png",
  "peelply": "/brands/logos/peelply_logo.png",
  "cat-pw": "/brands/logos/peelply_logo.png",
  "laminate": "/brands/logos/formica_logo.png",
  "laminates": "/brands/logos/formica_logo.png",
  "formica": "/brands/logos/formica_logo.png",
  "cat-lm": "/brands/logos/formica_logo.png",
  "facade": "/brands/logos/newtechwood_logo.png",
  "cladding": "/brands/logos/newtechwood_logo.png",
  "decking": "/brands/logos/newtechwood_logo.png",
  "newtech": "/brands/logos/newtechwood_logo.png",
  "newtechwood": "/brands/logos/newtechwood_logo.png",
  "cat-fc": "/brands/logos/newtechwood_logo.png",
  "wooden-flooring": "/brands/logos/mafi_logo.png",
  "flooring": "/brands/logos/mafi_logo.png",
  "mafi": "/brands/logos/mafi_logo.png",
  "cat-wf": "/brands/logos/mafi_logo.png",
  "screens": "/brands/logos/freedom_screens_logo.jpg",
  "freedom-screens": "/brands/logos/freedom_screens_logo.jpg",
  "cat-ss": "/brands/logos/freedom_screens_logo.jpg",
  "door-system": "/brands/logos/waltz_logo.png",
  "doorsystem": "/brands/logos/waltz_logo.png",
  "waltz": "/brands/logos/waltz_logo.png",
  "cat-ds": "/brands/logos/waltz_logo.png",
  "doors": "/brands/logos/slashform_logo.png",
  "cat-wd": "/brands/logos/slashform_logo.png",
  "windows": "/brands/logos/slashform_logo.png",
  "cat-ww": "/brands/logos/slashform_logo.png",
  "kitchen": "/brands/logos/slashform_logo.png",
  "slashform": "/brands/logos/slashform_logo.png",
  "cat-kk": "/brands/logos/slashform_logo.png",
  "wardrobe": "/brands/logos/slashform_logo.png",
  "cat-wrd": "/brands/logos/slashform_logo.png",
  "furniture": "/brands/logos/loco_logo.png",
  "loco": "/brands/logos/loco_logo.png",
  "inclass": "/brands/logos/inclass_logo.png",
  "cat-ff": "/brands/logos/loco_logo.png",
  "tiles": "/brands/logos/mirage_logo.png",
  "mirage": "/brands/logos/mirage_logo.png",
  "wow": "/brands/logos/wow_logo.png",
  "cat-tl": "/brands/logos/mirage_logo.png",
  "bathroom-fittings": "/brands/logos/fima_logo.png",
  "fima": "/brands/logos/fima_logo.png",
  "cat-bf": "/brands/logos/fima_logo.png",
  "sanitary-ware": "/brands/logos/falper_logo.png",
  "sanitaryware": "/brands/logos/falper_logo.png",
  "falper": "/brands/logos/falper_logo.png",
  "cat-sw": "/brands/logos/falper_logo.png",
  "mirrors": "/brands/logos/waltz_logo.png",
  "cat-mr": "/brands/logos/waltz_logo.png",
  "wallpapers": "/brands/logos/inkiostro_bianco_logo.png",
  "wall-covering": "/brands/logos/inkiostro_bianco_logo.png",
  "inkiostro": "/brands/logos/inkiostro_bianco_logo.png",
  "inkiostro-bianco": "/brands/logos/inkiostro_bianco_logo.png",
  "joinery": "/brands/logos/iww_logo.png",
  "iww": "/brands/logos/iww_logo.png",
};

const BRAND_LOGOS: Record<string, string> = {
  "slashform": "/brands/logos/slashform_logo.png",
  "waltz": "/brands/logos/waltz_logo.png",
  "newtech": "/brands/logos/newtechwood_logo.png",
  "newtech-wood": "/brands/logos/newtechwood_logo.png",
  "newtechwood": "/brands/logos/newtechwood_logo.png",
  "formica": "/brands/logos/formica_logo.png",
  "loco": "/brands/logos/loco_logo.png",
  "falper": "/brands/logos/falper_logo.png",
  "fima": "/brands/logos/fima_logo.png",
  "inkiostro": "/brands/logos/inkiostro_bianco_logo.png",
  "inkiostro-bianco": "/brands/logos/inkiostro_bianco_logo.png",
  "mafi": "/brands/logos/mafi_logo.png",
  "mirage": "/brands/logos/mirage_logo.png",
  "freedom-screens": "/brands/logos/freedom_screens_logo.jpg",
  "peelply": "/brands/logos/peelply_logo.png",
  "inclass": "/brands/logos/inclass_logo.png",
  "wow": "/brands/logos/wow_logo.png",
  "iww": "/brands/logos/iww_logo.png",
};

export default async function HomePage() {
  const [siteSettings, rawCategories, rawBrands, rawProjects] = await Promise.all([
    getSiteSettingsStore(),
    getCategoriesStore(),
    getBrandsStore(),
    getAllProjectsStore(),
  ]);

  const norm = (s: string) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

  const categoriesList = (rawCategories || []).map((c: any) => {
    const rawId = (c.id || "").toLowerCase();
    const rawName = norm(c.name || "");
    const logo = CATEGORY_BRAND_LOGOS[rawId] || CATEGORY_BRAND_LOGOS[rawName] || CATEGORY_BRAND_LOGOS[c.shortCode?.toLowerCase()] || "";
    return {
      id: c.id,
      code: c.shortCode ? c.shortCode.split(" ")[0] : "CAT",
      num: c.sequenceNumber ? String(c.sequenceNumber).padStart(2, "0") : "01",
      name: c.name,
      sub: c.description || "Architectural Surface",
      img: c.coverImage || "/categories/cat_1.png",
      logo,
    };
  });

  const brandsList = (rawBrands || []).map((b: any) => {
    const explicitLogo = b.logoUrl && !b.logoUrl.includes("brand_") && !b.logoUrl.endsWith("_2.png") ? b.logoUrl : "";
    const rawId = (b.id || "").toLowerCase();
    const rawName = norm(b.name || "");
    const logo = explicitLogo || BRAND_LOGOS[rawId] || BRAND_LOGOS[rawName] || "";
    return {
      id: b.id,
      code: b.shortCode ? b.shortCode.split(" ")[0] : "BR",
      num: b.sequenceNumber ? String(b.sequenceNumber).padStart(2, "0") : (b.shortCode && b.shortCode.split(" ")[1] ? b.shortCode.split(" ")[1] : "01"),
      name: b.name,
      sub: b.description || b.tagline || "Partner Brand",
      img: b.bannerUrl || b.imageUrl || "/brands/brand_1_1.png",
      logo,
    };
  });

  const projectsList = (rawProjects || []).map((p: any, idx: number) => ({
    client: p.client || p.title,
    sub: p.title || p.description || "Architectural Project",
    year: p.year || "2025",
    code: p.code || (p.client ? p.client.slice(0, 2).toUpperCase() : "PR"),
    num: String(idx + 1).padStart(2, "0"),
    slug: p.slug || p.id,
    img: p.image || p.imageUrl || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80",
  }));

  return (
    <HomeClient
      initialSettings={siteSettings}
      initialCategories={categoriesList}
      initialBrands={brandsList}
      initialProjects={projectsList}
    />
  );
}
