import { prisma } from "./prisma";
import * as xlsx from "xlsx";
import fs from "fs";
import path from "path";
import {
  SiteSettingsItem,
  CategoryItem,
  BrandItem,
  ProductItem,
  ProjectShowcaseItem,
  TeamMemberItem,
  RoadmapStepItem,
  TeamJoinBanner,
  InquiryItem,
  ServiceItem,
  TestimonialItem,
  BlogItem,
  MediaAsset,
  TaxonomyItem,
  NavItem,
  SeoItem,
  CustomPageItem,
  PdfCatalogItem,
  CatalogSettingsItem,
  FaqItem,
  CollectionItem,
  CareerItem,
  DEFAULT_SETTINGS,
  DEFAULT_CATALOG_SETTINGS,
} from "./types";
import BRANDWISE_FAQS from "./brandwise_faqs.json";

export * from "./types";

const PRIMARY_STORE_PATH = path.join(process.cwd(), "data", "master_store.json");
const TMP_STORE_PATH = path.join("/tmp", "master_store.json");

declare global {
  var __AAREN_MEMORY_STORE__: any;
}

const FIREBASE_RTDB_STORE_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://aarenintpro-1c09f-default-rtdb.firebaseio.com";

async function fetchFromFirebaseCloudStore(key: string): Promise<any> {
  try {
    // 1. Check /store/${key}.json (Primary live admin path with 2s timeout)
    const storeRes = await fetch(`${FIREBASE_RTDB_STORE_URL}/store/${key}.json`, {
      headers: { "Cache-Control": "no-cache" },
      signal: AbortSignal.timeout(2000),
      next: { revalidate: 0 },
    });
    if (storeRes.ok) {
      const data = await storeRes.json();
      if (data !== null && data !== undefined) {
        return data;
      }
    }

    // 2. Fallback to /${key}.json
    const rootRes = await fetch(`${FIREBASE_RTDB_STORE_URL}/${key}.json`, {
      headers: { "Cache-Control": "no-cache" },
      signal: AbortSignal.timeout(2000),
      next: { revalidate: 0 },
    });
    if (rootRes.ok) {
      const data = await rootRes.json();
      if (data !== null && data !== undefined) {
        return data;
      }
    }
  } catch (err) {
    // Fail-safe to local store immediately
  }
  return null;
}

const BACKUPS_DIR = path.join(process.cwd(), "data", "backups");

export async function createStoreBackup(key: string, data: any): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  try {
    if (!fs.existsSync(BACKUPS_DIR)) {
      fs.mkdirSync(BACKUPS_DIR, { recursive: true });
    }
    // 1. Entity-specific backup snapshot
    const filename = `backup_${key}_${timestamp}.json`;
    const filepath = path.join(BACKUPS_DIR, filename);
    fs.writeFileSync(
      filepath,
      JSON.stringify(
        {
          key,
          timestamp: new Date().toISOString(),
          count: Array.isArray(data) ? data.length : 1,
          data,
        },
        null,
        2
      )
    );

    // 2. Latest full master store snapshot
    const masterData = readJsonStore();
    const masterFilepath = path.join(BACKUPS_DIR, "latest_master_backup.json");
    fs.writeFileSync(masterFilepath, JSON.stringify({ timestamp: new Date().toISOString(), data: masterData }, null, 2));

    // 3. Auto-prune older backups to keep disk lean (keep latest 50)
    try {
      const allBackups = fs
        .readdirSync(BACKUPS_DIR)
        .filter((f) => f.startsWith("backup_") && f.endsWith(".json"))
        .map((f) => ({ name: f, time: fs.statSync(path.join(BACKUPS_DIR, f)).mtimeMs }))
        .sort((a, b) => b.time - a.time);
      if (allBackups.length > 50) {
        allBackups.slice(50).forEach((b) => {
          try {
            fs.unlinkSync(path.join(BACKUPS_DIR, b.name));
          } catch (_) {}
        });
      }
    } catch (_) {}

    // 4. Cloud Backup snapshot in Firebase Realtime Database (/backups/...)
    fetch(`${FIREBASE_RTDB_STORE_URL}/backups/${key}/${timestamp}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        count: Array.isArray(data) ? data.length : 1,
        data,
      }),
    }).catch(() => {});

    return filename;
  } catch (err) {
    console.error("Backup engine error:", err);
    return "";
  }
}

export async function listStoreBackups() {
  try {
    if (!fs.existsSync(BACKUPS_DIR)) return [];
    return fs
      .readdirSync(BACKUPS_DIR)
      .filter((f) => f.endsWith(".json"))
      .map((f) => {
        const stats = fs.statSync(path.join(BACKUPS_DIR, f));
        return {
          filename: f,
          size: stats.size,
          createdAt: stats.mtime.toISOString(),
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (e) {
    return [];
  }
}

async function syncToFirebaseCloudStore(key: string, data: any): Promise<void> {
  try {
    // 1. Instant Dual-write to Firebase Realtime Database (/store/ and /)
    await Promise.allSettled([
      fetch(`${FIREBASE_RTDB_STORE_URL}/store/${key}.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
      fetch(`${FIREBASE_RTDB_STORE_URL}/${key}.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    ]);

    // 2. Automated timestamped local + cloud backup creation
    await createStoreBackup(key, data);
  } catch (err) {
    // Fail-safe
  }
}

function getActiveStorePath(): string {
  try {
    const dir = path.dirname(PRIMARY_STORE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.accessSync(dir, fs.constants.W_OK);
    return PRIMARY_STORE_PATH;
  } catch (e) {
    return TMP_STORE_PATH;
  }
}

function readJsonStore() {
  if (globalThis.__AAREN_MEMORY_STORE__) {
    return globalThis.__AAREN_MEMORY_STORE__;
  }

  const targetPath = getActiveStorePath();
  try {
    if (fs.existsSync(targetPath)) {
      const data = JSON.parse(fs.readFileSync(targetPath, "utf-8"));
      globalThis.__AAREN_MEMORY_STORE__ = data;
      return data;
    }
  } catch (err) {}

  try {
    if (fs.existsSync(PRIMARY_STORE_PATH)) {
      const data = JSON.parse(fs.readFileSync(PRIMARY_STORE_PATH, "utf-8"));
      globalThis.__AAREN_MEMORY_STORE__ = data;
      return data;
    }
  } catch (err) {}

  const initial = {
    settings: DEFAULT_SETTINGS,
    categories: DEFAULT_CATEGORIES,
    brands: DEFAULT_BRANDS,
    projects: DEFAULT_PROJECTS,
    products: DEFAULT_PRODUCTS,
    team: DEFAULT_TEAM,
    roadmap: DEFAULT_ROADMAP,
    inquiries: [],
    pages: [],
  };
  globalThis.__AAREN_MEMORY_STORE__ = initial;
  return initial;
}

async function syncStoreToGitHub(data: any) {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (!token) return;

  const repo = process.env.GITHUB_REPOSITORY || "Amanrck96/aaren-studio";
  try {
    const filePath = "data/master_store.json";
    const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
      headers: { Authorization: `Bearer ${token}`, "User-Agent": "Aaren-Studio-CMS" },
    });
    const getJson = await getRes.json();
    const sha = getJson.sha;

    const content = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");
    await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "Aaren-Studio-CMS",
      },
      body: JSON.stringify({
        message: "cms: auto-sync admin content updates to master_store.json [skip ci]",
        content,
        sha,
        branch: "master",
      }),
    });
  } catch (err) {
    console.error("GitHub auto-sync error:", err);
  }
}

function writeJsonStore(data: any) {
  // ONLY update local memory and filesystem.
  // WARNING: Do NOT do a full Firebase PUT here — that would overwrite ALL collections
  // (brands, team, categories, etc.) with stale local memory data, causing data resets.
  // Firebase writes must happen via syncToFirebaseCloudStore(key, data) on individual keys.
  globalThis.__AAREN_MEMORY_STORE__ = data;

  try {
    const targetPath = getActiveStorePath();
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(targetPath, JSON.stringify(data, null, 2));
  } catch (err) {
    try {
      if (!fs.existsSync("/tmp")) fs.mkdirSync("/tmp", { recursive: true });
      fs.writeFileSync(TMP_STORE_PATH, JSON.stringify(data, null, 2));
    } catch (e) {
      console.warn("FileSystem write fallback to memory:", e);
    }
  }
  // GitHub sync intentionally removed from here too — only sync individual collection writes
}

// Default Data Definitions

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: "cat-pw", name: "Plywood", coverImage: "/categories/cat_1.png", description: "Precision engineered structural plywood", shortCode: "PW 01", sequenceNumber: 1 },
  { id: "cat-lm", name: "Laminate", coverImage: "/categories/cat_2.png", description: "FENIX nano-tech and decorative surfaces", shortCode: "LM 02", sequenceNumber: 2 },
  { id: "cat-fc", name: "Facade", coverImage: "/categories/cat_3.png", description: "Architectural exterior WPC cladding", shortCode: "FC 03", sequenceNumber: 3 },
  { id: "cat-wf", name: "Wooden Flooring", coverImage: "/categories/cat_4.png", description: "Austrian engineered natural wood floors", shortCode: "WF 04", sequenceNumber: 4 },
  { id: "cat-ss", name: "Screens", coverImage: "/categories/cat_5.png", description: "Zipline tension fabric architectural screens", shortCode: "SS 05", sequenceNumber: 5 },
  { id: "cat-ds", name: "Door System", coverImage: "/categories/cat_6.png", description: "Integrated aluminum and pivot doors", shortCode: "DS 06", sequenceNumber: 6 },
  { id: "cat-wd", name: "Doors", coverImage: "/categories/cat_7.png", description: "Solid timber and lacquered flush doors", shortCode: "WD 07", sequenceNumber: 7 },
  { id: "cat-ww", name: "Windows", coverImage: "/categories/cat_8.png", description: "Thermal efficiency aluminum window systems", shortCode: "WW 08", sequenceNumber: 8 },
  { id: "cat-kk", name: "Kitchen", coverImage: "/categories/cat_9.png", description: "Italian modular kitchen living systems", shortCode: "KK 09", sequenceNumber: 9 },
  { id: "cat-wrd", name: "Wardrobe", coverImage: "/categories/cat_10.png", description: "Walk-in closet and glass sliding systems", shortCode: "WRD 10", sequenceNumber: 10 },
  { id: "cat-ff", name: "Furniture", coverImage: "/categories/cat_11.png", description: "Madheke sofas & Loco bespoke millwork", shortCode: "FF 11", sequenceNumber: 11 },
  { id: "cat-tl", name: "Tiles", coverImage: "/categories/cat_12.png", description: "Italian porcelain marble & stone slabs", shortCode: "TL 12", sequenceNumber: 12 },
  { id: "cat-bf", name: "Bathroom Fittings", coverImage: "/categories/cat_13.png", description: "Falper and FIMA tapware and vanities", shortCode: "BF 13", sequenceNumber: 13 },
  { id: "cat-sw", name: "Sanitary Ware", coverImage: "/categories/cat_14.png", description: "Flaminia & Antonio Lupi basins", shortCode: "SW 14", sequenceNumber: 14 },
  { id: "cat-mr", name: "Mirrors", coverImage: "/categories/cat_15.png", description: "Architectural glass backlit mirrors", shortCode: "MR 15", sequenceNumber: 15 },
];

export const DEFAULT_BRANDS: BrandItem[] = [
  { id: "slashform", name: "Slashform", logoUrl: "/brands/logos/slashform_logo.png", bannerUrl: "/brands/brand_1_1.png", description: "Italian precision kitchen and wardrobes.", shortCode: "SF 01", sequenceNumber: 1, category: "Kitchen & Wardrobe", origin: "Italy", tagline: "Precision living systems", founded: "2003", collections: ["All", "Kitchen", "Wardrobe", "Door Systems", "Doors", "Windows"], catalogPdfUrl: "https://firebasestorage.googleapis.com/v0/b/aarenintpro-1c09f.firebasestorage.app/o/Brand_Assets%2F1786509682231_Slashform_Kitchen.pdf?alt=media&token=6204ef83-4e8d-4173-ad37-feadc45d8537", pdfCatalogs: [{ id: "cat-1786509662646", title: "Kitchen", coverImage: "/categories/cat_1.png", pdfUrl: "https://firebasestorage.googleapis.com/v0/b/aarenintpro-1c09f.firebasestorage.app/o/Brand_Assets%2F1786509682231_Slashform_Kitchen.pdf?alt=media&token=6204ef83-4e8d-4173-ad37-feadc45d8537" }, { id: "cat-1786509691430", title: "Wardrobe", coverImage: "/categories/cat_2.png", pdfUrl: "https://firebasestorage.googleapis.com/v0/b/aarenintpro-1c09f.firebasestorage.app/o/Brand_Assets%2F1786509713565_Slasform_Wardrobe.pdf?alt=media&token=f94ecf41-5329-4c83-a47c-5f7d5d2675e5" }] },
  { id: "waltz", name: "Waltz by JB Glass", logoUrl: "/brands/logos/waltz_logo.png", bannerUrl: "/brands/brand_2_1.png", description: "Architectural glass and frameless partitions.", shortCode: "WB 02", sequenceNumber: 2, category: "Screens & Partitions", origin: "India", tagline: "Architectural glass solutions", founded: "1998", collections: ["All", "Partitions", "Shower Enclosures", "Balustrades", "Zipline"], catalogPdfUrl: "/catalogues/Waltz/Waltz_Glass.pdf" },
  { id: "newtech-wood", name: "Newtech Wood", logoUrl: "/brands/logos/newtechwood_logo.png", bannerUrl: "/brands/brand_3_1.png", description: "Premium composite cladding and decking.", shortCode: "NW 03", sequenceNumber: 3, category: "Cladding & Decking", origin: "USA", tagline: "WPC composite excellence", founded: "2005", collections: ["All", "Decking", "Cladding", "Screens", "Fencing"], catalogPdfUrl: "/catalogues/NewTechWood/NewTechWood-Product-Catalog-2025.pdf" },
  { id: "formica", name: "Formica", logoUrl: "/brands/logos/formica_logo.png", bannerUrl: "/brands/brand_4_1.png", description: "Iconic decorative and nano surfaces.", shortCode: "FC 04", sequenceNumber: 4, category: "Laminates", origin: "USA", tagline: "Iconic surface solutions", founded: "1913", collections: ["All", "Fenix", "VIS", "Homapal"], catalogPdfUrl: "/catalogues/Formica/2024-FENIX-brochure-digital.pdf" },
  { id: "loco", name: "Loco", logoUrl: "/brands/logos/loco_logo.png", bannerUrl: "/brands/brand_5_1.png", description: "Bespoke Italian furniture and millwork.", shortCode: "LC 05", sequenceNumber: 5, category: "FF&E", origin: "Italy", tagline: "Bespoke millwork & furniture", founded: "2010", collections: ["All", "Seating", "Tables", "Storage", "Millwork", "Lighting"] },
  { id: "falper", name: "Falper", logoUrl: "/brands/logos/falper_logo.png", bannerUrl: "/brands/brand_6_1.png", description: "Luxury Italian bespoke bath environments.", shortCode: "FP 06", sequenceNumber: 6, category: "Bathroom Fittings", origin: "Italy", tagline: "Luxury bath environments", founded: "1990", collections: ["All", "Senzafine", "Minimum", "Edge Metal"] },
  { id: "fima", name: "Fima Carlo Frattini", logoUrl: "/brands/logos/fima_logo.png", bannerUrl: "/brands/brand_7_1.png", description: "Mastercrafted Italian architectural luxury tapware.", shortCode: "FM 07", sequenceNumber: 7, category: "Sanitary Ware", origin: "Italy", tagline: "Italian tapware mastery", founded: "1960", collections: ["All", "Spout", "Thermostatic", "Showerhead", "Mixer"] },
  { id: "inkiostro-bianco", name: "Inkiostro Bianco", logoUrl: "/brands/logos/inkiostro_bianco_logo.png", bannerUrl: "/brands/brand_8_1.png", description: "Artistic Italian designer wallpaper murals.", shortCode: "IB 08", sequenceNumber: 8, category: "Wallpapers", origin: "Italy", tagline: "Artistic surface expressions", founded: "2013", collections: ["All", "Vinyl Wallpapers", "Golden Wall", "Raw Finish"], catalogPdfUrl: "/catalogues/Inkiastro Bianco/CATALOGO_MATERIAPRIMA_2026_2a.pdf" },
  { id: "mafi", name: "Mafi", logoUrl: "/brands/logos/mafi_logo.png", bannerUrl: "/brands/brand_9_1.png", description: "Pure natural Austrian wood flooring.", shortCode: "MF 09", sequenceNumber: 9, category: "Flooring", origin: "Austria", tagline: "Pure natural wood flooring", founded: "1919", collections: ["All", "Oak", "Beech", "Walnut", "Larch", "Ash"] },
  { id: "mirage", name: "Mirage", logoUrl: "/brands/logos/mirage_logo.png", bannerUrl: "/brands/brand_10_1.png", description: "Italian luxury large porcelain slabs.", shortCode: "MG 10", sequenceNumber: 10, category: "Tiles", origin: "Italy", tagline: "Italian porcelain stoneware", founded: "1973", collections: ["All", "Clay", "Elysian", "Glocal", "Norr", "Cosmopolitan"], catalogPdfUrl: "/catalogues/Mirage/catalogue-elysian-pdf.pdf" },
  { id: "freedom-screens", name: "Freedom Screens", logoUrl: "/brands/logos/freedom_screens_logo.jpg", bannerUrl: "/brands/brand_freedom_screens.jpg", description: "Innovative retractable architectural screen systems.", shortCode: "FS 11", sequenceNumber: 11, category: "Outdoor Screens", origin: "Australia", tagline: "Infinite Zipline retractable screen systems", founded: "2008", collections: ["All", "Infinite Zip line", "Smart Motorised", "Smart Manual"], catalogPdfUrl: "/catalogues/FreedomScreens/Freedom_Screens_2026.pdf" },
  { id: "peelply", name: "Peelply", logoUrl: "/brands/logos/peelply_logo.png", bannerUrl: "/brands/brand_2_1.png", description: "Engineered premium plywood and veneers.", shortCode: "PP 12", sequenceNumber: 12, category: "Plywood & Panels", origin: "India", tagline: "Premium plywood and engineered panel solutions", founded: "2000", collections: ["All", "Plywood", "Blockboard", "Veneer", "Flush Door"] },
  { id: "inclass", name: "Inclass", logoUrl: "/brands/logos/inclass_logo.png", bannerUrl: "/brands/brand_3_1.png", description: "Contemporary Spanish designer lifestyle furniture.", shortCode: "IC 13", sequenceNumber: 13, category: "Furniture & Seating", origin: "Spain", tagline: "Contemporary designer furniture from Spain", founded: "1997", collections: ["All", "Chairs", "Armchairs", "Sofas", "Tables"] },
  { id: "wow", name: "WOW", logoUrl: "/brands/logos/wow_logo.png", bannerUrl: "/brands/brand_4_1.png", description: "Creative 3D architectural ceramic tiles.", shortCode: "WW 14", sequenceNumber: 14, category: "Ceramics & 3D Tiles", origin: "Spain", tagline: "Creative 3D ceramic tile design studio", founded: "2001", collections: ["All", "Aquarelle", "Bejmat", "60 Degrees", "Pottery", "Melange"] },
  { id: "iww", name: "IWW", logoUrl: "/brands/logos/iww_logo.png", bannerUrl: "/brands/brand_5_1.png", description: "Custom architectural joinery and doors.", shortCode: "IW 15", sequenceNumber: 15, category: "Joinery & Doors", origin: "India", tagline: "Custom architectural wood and door systems", founded: "2005", collections: ["All", "Flush Doors", "Acoustic Panels", "Wall Cladding", "Mouldings"] },
  { id: "living-ceramica", name: "Living Ceramica", logoUrl: "", bannerUrl: "/brands/brand_6_1.png", description: "Large-format architectural porcelain surfaces.", shortCode: "LV 16", sequenceNumber: 16, category: "Porcelain Surfaces", origin: "Spain", tagline: "Large-format architectural porcelain surfaces", founded: "2012", collections: ["All", "Ductile Large Slabs", "Signature Collection", "Outdoor 20mm"] },
  { id: "florim", name: "Florim", logoUrl: "", bannerUrl: "/brands/brand_7_1.png", description: "Sustainable Italian luxury porcelain surfaces.", shortCode: "FL 17", sequenceNumber: 17, category: "Porcelain Slabs", origin: "Italy", tagline: "Italian luxury porcelain and surface innovation", founded: "1962", collections: ["All", "Magnum Oversize", "Sensi Marble", "Earth Tone Surfaces"] },
  { id: "gelli", name: "Gelli", logoUrl: "", bannerUrl: "/brands/brand_8_1.png", description: "Artisanal decorative glass and mirrors.", shortCode: "GL 18", sequenceNumber: 18, category: "Decorative Glass", origin: "Italy", tagline: "Artisanal decorative glass and custom mirrors", founded: "1985", collections: ["All", "Antique Mirrors", "Fluted Glass", "Decorative Panels"] },
  { id: "jacuzzi", name: "Jacuzzi", logoUrl: "", bannerUrl: "/brands/brand_9_1.png", description: "Pioneering luxury wellness hydrotherapy baths.", shortCode: "JC 19", sequenceNumber: 19, category: "Wellness & Baths", origin: "Italy", tagline: "The original hydrotherapy & wellness pioneer", founded: "1956", collections: ["All", "Whirlpool Baths", "Hydromassage Showers", "Spa Pools"] },
  { id: "alex-turco", name: "Alex Turco", logoUrl: "", bannerUrl: "/brands/brand_10_1.png", description: "Handcrafted waterproof decorative art panels.", shortCode: "AT 20", sequenceNumber: 20, category: "Art Panels & Surfaces", origin: "Italy", tagline: "Waterproof art panels and bespoke decorative surfaces", founded: "2006", collections: ["All", "Canvas Art Panels", "Metal Art Surfaces", "Wet-Area Panels"] },
];

export const DEFAULT_PROJECTS: ProjectShowcaseItem[] = [
  { id: "proj-01", title: "ONE BANGALORE WEST PENTHOUSE", slug: "one-bangalore-west", description: "Luxury pent-house featuring FENIX surfaces, Falper vanities and Mafi natural oak flooring.", category: "Residential", client: "Private Owner", projectCode: "OB 01", sequenceNumber: 1, imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80" },
  { id: "proj-02", title: "THE JAYAMAHAL VILLA", slug: "jayamahal-villa", description: "Contemporary villa wrapped in Newtech Wood architectural composite cladding.", category: "Architecture", client: "Jayamahal Estates", projectCode: "TJ 02", sequenceNumber: 2, imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80" },
  { id: "proj-03", title: "REPUBLIC GARDENS CLUBHOUSE", slug: "republic-gardens", description: "Commercial clubhouse with Mirage porcelain slabs and Slashform kitchen systems.", category: "Hospitality", client: "Republic Developers", projectCode: "RG 03", sequenceNumber: 3, imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80" },
  { id: "proj-04", title: "GREEN PARK VILLA", slug: "green-park-villa", description: "Modern residence with Waltz glass partitions and Madheke custom furniture.", category: "Residential", client: "Green Park Ltd", projectCode: "GP 04", sequenceNumber: 4, imageUrl: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80" },
];

export const DEFAULT_PRODUCTS: ProductItem[] = [
  {
    id: "prod-antique-decking",
    slNo: 1,
    name: "Antique Outdoor Pool Decking",
    brand: "Newtech Wood",
    category: "Cladding",
    subcategory: "Decking",
    shortCode: "NW 10",
    width: "138mm",
    height: "22.5mm",
    depth: "2900mm",
    thickness: "22.5mm",
    finish: "Antique Grain",
    description: "360-degree co-extruded capped composite decking with ultra-durable weather protection.",
    tags: ["Decking", "WPC", "Outdoor"],
    imageUrl: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    catalogPdfUrl: "/catalogues/NewTechWood/NewTechWood-Product-Catalog-2025.pdf",
    qtyInStock: 120,
    price: 680,
    finishOptions: [
      { name: "Antique Ipe", hex: "#4a3b32" },
      { name: "Teak Wood", hex: "#8c764b" },
      { name: "Charcoal Grey", hex: "#2b3a4a" }
    ]
  },
  {
    id: "prod-newtech-ultrashield",
    slNo: 2,
    name: "UltraShield Composite Facade Slat",
    brand: "Newtech Wood",
    category: "Cladding",
    subcategory: "Facade Slats",
    shortCode: "NW 14",
    width: "160mm",
    height: "25mm",
    depth: "3600mm",
    thickness: "25mm",
    finish: "Walnut Slat Grain",
    description: "Architectural outdoor composite wall cladding slat system with UV stabilization and zero maintenance requirement.",
    tags: ["Facade", "WPC", "Wall Cladding"],
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80"
    ],
    qtyInStock: 85,
    price: 820
  },
  {
    id: "prod-mirage-elysian",
    slNo: 3,
    name: "MIRAGE Elysian Travertine Slab",
    brand: "Mirage",
    category: "Tiles",
    subcategory: "Porcelain Slabs",
    shortCode: "MG 01",
    width: "1200mm",
    height: "2700mm",
    depth: "6mm",
    thickness: "6mm",
    finish: "Honed Travertine",
    description: "Italian porcelain marble slab reproducing authentic Roman travertine veining with matte honed tactile finish.",
    tags: ["Porcelain", "Travertine", "Slab"],
    imageUrl: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
    ],
    qtyInStock: 45,
    price: 1250,
    finishOptions: [
      { name: "Vein Cut Warm", hex: "#d4cfc7" },
      { name: "Cross Cut Light", hex: "#e8e2d9" }
    ]
  },
  {
    id: "prod-mirage-glocal",
    slNo: 4,
    name: "MIRAGE Glocal Concrete Slab",
    brand: "Mirage",
    category: "Tiles",
    subcategory: "Porcelain Slabs",
    shortCode: "MG 05",
    width: "1200mm",
    height: "2700mm",
    depth: "9mm",
    thickness: "9mm",
    finish: "Industrial Concrete Matte",
    description: "Minimalist Italian architectural porcelain slab capturing the raw tactile beauty of smooth poured concrete.",
    tags: ["Concrete", "Porcelain", "Italian"],
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=80"
    ],
    qtyInStock: 60,
    price: 1180
  },
  {
    id: "prod-mafi-oak",
    slNo: 5,
    name: "Mafi Oak Vulcano Natural Plank",
    brand: "mafi",
    category: "Wooden Flooring",
    subcategory: "Engineered Hardwood",
    shortCode: "MF 01",
    width: "240mm",
    height: "19mm",
    depth: "2400mm",
    thickness: "19mm",
    finish: "Natural White Oil",
    description: "Thermally treated Austrian oak plank with deep brushed texture and 100% natural oil finish.",
    tags: ["Oak", "Austrian Wood", "Flooring"],
    imageUrl: "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1200&q=80"
    ],
    qtyInStock: 80,
    price: 3400,
    finishOptions: [
      { name: "Vulcano Medium", hex: "#6F4E37" },
      { name: "White Brushed", hex: "#D7C4B7" }
    ]
  },
  {
    id: "prod-mafi-tiger",
    slNo: 6,
    name: "Mafi Tiger Oak Brushed Plank",
    brand: "mafi",
    category: "Wooden Flooring",
    subcategory: "Engineered Hardwood",
    shortCode: "MF 04",
    width: "280mm",
    height: "19mm",
    depth: "2400mm",
    thickness: "19mm",
    finish: "Brushed Grey Oil",
    description: "Deeply textured Austrian tiger oak with dark natural grain accents and non-toxic natural oil finish.",
    tags: ["Tiger Oak", "Flooring", "Austrian"],
    imageUrl: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=1200&q=80"
    ],
    qtyInStock: 55,
    price: 3800
  },
  {
    id: "prod-fima-tapware",
    slNo: 7,
    name: "FIMA Aesthetic Mixer Suite",
    brand: "fima Carlo Frattini",
    category: "Bathroom",
    subcategory: "Thermostatic Tapware",
    shortCode: "FM 02",
    width: "180mm",
    height: "220mm",
    depth: "150mm",
    thickness: "Brass",
    finish: "Rose Gold & Brushed Gunmetal",
    description: "Architectural thermostatic shower and basin mixer suite with progressive cartridge control.",
    tags: ["Faucets", "Italian Brass", "Rose Gold"],
    imageUrl: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80"
    ],
    qtyInStock: 25,
    price: 85000
  },
  {
    id: "prod-fima-shower",
    slNo: 8,
    name: "FIMA Thermostatic Rain Shower Column",
    brand: "fima Carlo Frattini",
    category: "Bathroom",
    subcategory: "Shower Fittings",
    shortCode: "FM 08",
    width: "300mm",
    height: "1100mm",
    depth: "450mm",
    thickness: "Brass",
    finish: "Matte Black & Rose Gold",
    description: "Wall-mounted thermostatic rain shower head with integrated hand shower and water-saving aerator.",
    tags: ["Shower", "Tapware", "Italian"],
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80"
    ],
    qtyInStock: 18,
    price: 115000
  },
  {
    id: "prod-waltz-glide",
    slNo: 9,
    name: "Waltz Wallways Motorized Partition",
    brand: "Waltz",
    category: "Doors",
    subcategory: "Sliding Systems",
    shortCode: "WB 05",
    width: "1500mm",
    height: "3000mm",
    depth: "45mm",
    thickness: "10mm Glass",
    finish: "Fluted Glass & Anodized Bronze",
    description: "Top-hung motorized architectural fluted glass partition system with soft magnetic closing.",
    tags: ["Glass Door", "Fluted", "Motorized"],
    imageUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80"
    ],
    qtyInStock: 12,
    price: 290000
  },
  {
    id: "prod-waltz-slide",
    slNo: 10,
    name: "Waltz Glide Fluted Glass Door",
    brand: "Waltz",
    category: "Doors",
    subcategory: "Glass Doors",
    shortCode: "WB 08",
    width: "1000mm",
    height: "2400mm",
    depth: "40mm",
    thickness: "8mm Glass",
    finish: "Smoked Fluted Glass & Black Frame",
    description: "Minimalist interior glass sliding door system with ultra-slim aluminum perimeter frame.",
    tags: ["Door", "Fluted Glass", "Interior"],
    imageUrl: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"
    ],
    qtyInStock: 20,
    price: 185000
  },
  {
    id: "prod-slashform-kitchen",
    slNo: 11,
    name: "Slashform Terraige Living System",
    brand: "slashform™",
    category: "Surfaces",
    subcategory: "Modular Systems",
    shortCode: "SF 08",
    width: "3600mm",
    height: "2400mm",
    depth: "650mm",
    thickness: "20mm Ceramic",
    finish: "Greige Silk & Smoked Oak",
    description: "Seamless architectural island and tall cabinetry unit in liquid-patterned ceramic surface.",
    tags: ["Kitchen", "Ceramic", "Italian"],
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    qtyInStock: 6,
    price: 1200000
  },
  {
    id: "prod-fenix-laminate",
    slNo: 12,
    name: "FORMICA FENIX NTM Matte Surface",
    brand: "FORMICA®",
    category: "Surfaces",
    subcategory: "Nano-Tech Laminate",
    shortCode: "FC 04",
    width: "1300mm",
    height: "3050mm",
    depth: "1.2mm",
    thickness: "1.2mm",
    finish: "Anti-Fingerprint Super Matte",
    description: "Opaque matte nanotech material with thermal healing of superficial micro-scratches.",
    tags: ["Nano Matte", "HPL", "Anti-Fingerprint"],
    imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"
    ],
    qtyInStock: 150,
    price: 4200
  },
  {
    id: "prod-inkiostro-wallpaper",
    slNo: 13,
    name: "Inkiostro Bianco Golden Wall Surface",
    brand: "Inkiostro Bianco",
    category: "Surfaces",
    subcategory: "Decorative Wallcovering",
    shortCode: "IB 03",
    width: "Custom",
    height: "3000mm",
    depth: "1mm",
    thickness: "Fiberglass",
    finish: "Gold Leaf Texture",
    description: "Custom printed fiberglass wallcovering with waterproof coating for wet areas and feature walls.",
    tags: ["Wallpaper", "Gold Leaf", "Waterproof"],
    imageUrl: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80"
    ],
    qtyInStock: 30,
    price: 18500
  },
  {
    id: "prod-wow-3dbars",
    slNo: 14,
    name: "WOW 3D Bars Decorative Ceramic Tile",
    brand: "WOW",
    category: "Tiles",
    subcategory: "3D Tiles",
    shortCode: "WW 02",
    width: "125mm",
    height: "250mm",
    depth: "15mm",
    thickness: "15mm",
    finish: "Gloss Terracotta 3D",
    description: "Spanish 3D dimensional ceramic tile with fluted bar relief effect for architectural feature walls.",
    tags: ["3D Tiles", "Spanish", "Ceramic"],
    imageUrl: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=80"
    ],
    qtyInStock: 200,
    price: 450
  },
  {
    id: "prod-falper-senzafine",
    slNo: 15,
    name: "Falper Senzafine Architectural Vanity",
    brand: "Falper",
    category: "Bathroom",
    subcategory: "Vanities",
    shortCode: "FL 01",
    width: "1400mm",
    height: "850mm",
    depth: "520mm",
    thickness: "Solid Surface",
    finish: "Matte White Cristalplant",
    description: "Italian double washbasin vanity unit in matte white solid surface material with soft-close oak drawers.",
    tags: ["Vanity", "Italian Bath", "Cristalplant"],
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80"
    ],
    qtyInStock: 8,
    price: 380000
  }
];

export const DEFAULT_TEAM: TeamMemberItem[] = [
  // LEADERSHIP (7)
  { id: "tm-01", name: "MOHANLAL MP", designation: "Founder", category: "Leadership", memberCode: "MM 01", photoUrl: "/team/about-us-4-min.jpg", phone: "+91 88844 64444", bio: "He is the face and voice of AAREN. The face that represents AAREN, the voice that tells the story of AAREN. He guides AAREN by guiding its culture, values and the well being of the team.", sequenceNumber: 1 },
  { id: "tm-02", name: "Late RAMNIKLAL M VAGADIYA", designation: "Founder & Chairman", category: "Leadership", memberCode: "RV 02", photoUrl: "/team/about-us-6-min.jpg", phone: "+91 88844 64444", bio: "A chartered accountant who is the backbone of the organization. He keeps the business focused, motivated, and sets concrete business plans for the team to achieve its vision.", sequenceNumber: 2 },
  { id: "tm-03", name: "MADHUSUDHAN MP", designation: "Envisioner & Chief Planner", category: "Leadership", memberCode: "MP 03", photoUrl: "/team/about-us-2-min.jpg", phone: "+91 88844 64444", bio: "He is the vision of AAREN. Responsible for creating the strategy, driving the business and scouting for world class products.", sequenceNumber: 3 },
  { id: "tm-04", name: "KOUSHIK", designation: "Director", category: "Leadership", memberCode: "KS 04", photoUrl: "/team/about-us-1-min.jpg", phone: "+91 88844 64444", bio: "Directs client solutions, space optimization, and luxury architectural interior curation across premium projects.", sequenceNumber: 4 },
  { id: "tm-05", name: "ASHWIN", designation: "Director", category: "Leadership", memberCode: "AW 05", photoUrl: "/team/about-us-3-min.jpg", phone: "+91 88844 64444", bio: "Directs architectural partnerships, surface technology consulting, developer alliances, and luxury material innovation.", sequenceNumber: 5 },
  { id: "tm-06", name: "MUKUND", designation: "Director", category: "Leadership", memberCode: "MK 06", photoUrl: "/team/about-us-5-min.jpg", phone: "+91 88844 64444", bio: "Directs world-class brand curation, premium material experiences, and state-of-the-art gallery displays.", sequenceNumber: 6 },
  { id: "tm-07", name: "JIGNESH", designation: "Director", category: "Leadership", memberCode: "JG 07", photoUrl: "/team/about-us-7-min.jpg", phone: "+91 88844 64444", bio: "Directs strategic channel operations, Bagno & Surface architectural solutions, and pan-India client relations.", sequenceNumber: 7 },

  // SALES (4)
  { id: "tm-16", name: "NARASIMHA PRASAD B S", designation: "Sales", category: "Sales", memberCode: "NP 16", photoUrl: "", phone: "+91 88844 64444", bio: "Proactive sales executive focused on building client relationships and driving luxury surface project conversions.", sequenceNumber: 8 },
  { id: "tm-19", name: "UTKALIKA NAYAK", designation: "Sales Executive", category: "Sales", memberCode: "UN 19", photoUrl: "", phone: "+91 88844 64444", bio: "Result-oriented sales professional dedicated to delivering exceptional architectural client experiences.", sequenceNumber: 9 },
  { id: "tm-11", name: "HARSHITHA N", designation: "Sales Executive", category: "Sales", memberCode: "HN 11", photoUrl: "", phone: "+91 88844 64444", bio: "Dedicated sales professional specializing in luxury surface presentations and material consultations.", sequenceNumber: 10 },
  { id: "tm-12", name: "VISHWAS GEORGE", designation: "Sales Consultant", category: "Sales", memberCode: "VG 12", photoUrl: "", phone: "+91 88844 64444", bio: "Experienced consultant guiding architects and homeowners through premium international collections.", sequenceNumber: 11 },

  // OPERATIONS (3)
  { id: "tm-23", name: "JABIR KHAN", designation: "Operations Staff", category: "Operations", memberCode: "JK 23", photoUrl: "", phone: "+91 88844 64444", bio: "Supports operations with efficient material logistics and project delivery coordination.", sequenceNumber: 12 },
  { id: "tm-21", name: "SAWAN VISHWAKARMA", designation: "Operations Executive", category: "Operations", memberCode: "SV 21", photoUrl: "", phone: "+91 88844 64444", bio: "Manages day-to-day operational workflows ensuring timely delivery and site coordination.", sequenceNumber: 13 },
  { id: "tm-22", name: "D S SHANKAR", designation: "Operations Coordinator", category: "Operations", memberCode: "DS 22", photoUrl: "", phone: "+91 88844 64444", bio: "Coordinates operational logistics and material handling across all ongoing projects.", sequenceNumber: 14 },

  // ACCOUNTS (1)
  { id: "tm-24", name: "NARASIMHA RAJU", designation: "Accountant", category: "Accounts", memberCode: "NR 24", photoUrl: "", phone: "+91 88844 64444", bio: "Manages financial records, billing, and supports the accounts team with diligent accounting operations.", sequenceNumber: 15 },

  // SUPPORT STAFF (6)
  { id: "tm-su-05", name: "Sumithramma", designation: "Support Staff", category: "Support Staff", memberCode: "SU 05", photoUrl: "", phone: "+91 88844 64444", bio: "Essential support staff member ensuring seamless studio operations and customer hospitality.", sequenceNumber: 16 },
  { id: "tm-sh-01", name: "Shanthamma", designation: "Support Staff", category: "Support Staff", memberCode: "SH 01", photoUrl: "", phone: "+91 88844 64444", bio: "Dedicated support staff ensuring pristine gallery environment and day-to-day coordination.", sequenceNumber: 17 },
  { id: "tm-la-05", name: "Latha", designation: "Support Staff", category: "Support Staff", memberCode: "LA 05", photoUrl: "", phone: "+91 88844 64444", bio: "Committed support staff supporting client hospitality and studio maintenance.", sequenceNumber: 18 },
  { id: "tm-sm-08", name: "Sumithra M", designation: "Support Staff", category: "Support Staff", memberCode: "SM 08", photoUrl: "", phone: "+91 88844 64444", bio: "Support staff member dedicated to smooth administrative assistance and site hospitality.", sequenceNumber: 19 },
  { id: "tm-13", name: "PRASHANTH M S", designation: "Support Staff", category: "Support Staff", memberCode: "PM 13", photoUrl: "", phone: "+91 88844 64444", bio: "Provides technical assistance and comprehensive operational support to the team.", sequenceNumber: 20 },
  { id: "tm-14", name: "LOKESH G V", designation: "Support Staff", category: "Support Staff", memberCode: "LG 14", photoUrl: "", phone: "+91 88844 64444", bio: "Ensures seamless client experience and essential studio logistical support.", sequenceNumber: 21 },
];

export const DEFAULT_ROADMAP: RoadmapStepItem[] = [
  { id: "rm-01", stepNumber: "01", year: "2015", title: "FOUNDATION & ITALIAN PARTNERSHIPS", description: "Established Aaren Intpro on Mysore Road, Bangalore as exclusive partners for luxury Italian surface brands." },
  { id: "rm-02", stepNumber: "02", year: "2019", title: "MATERIAL LAB EXPANSION", description: "Launched the 10,000 sq.ft. interactive Material Lab showcasing full-scale architectural mockups and FENIX nano-tech surfaces." },
  { id: "rm-03", stepNumber: "03", year: "2024", title: "AAREN CREATIVE STUDIO 2.0", description: "Expanded into bespoke furniture, outdoor WPC decking cladding, and automated project specification PDF generators." }
];

// SITE SETTINGS STORE
export async function getSiteSettingsStore(): Promise<SiteSettingsItem> {
  // 🔑 FIX: Always check Firebase FIRST so admin edits survive Vercel redeploys
  const fbData = await fetchFromFirebaseCloudStore("settings");
  if (fbData && typeof fbData === "object" && fbData.heroTitle) {
    const json = readJsonStore();
    json.settings = fbData;
    globalThis.__AAREN_MEMORY_STORE__ = json;
    return {
      ...fbData,
      footerLinks: Array.from(new Set([...(fbData.footerLinks || []), "All Projects", "Brands", "Products", "Instagram", "FAQ", "Blog", "Privacy Policy"])),
    };
  }

  // Fallback to local JSON if Firebase unavailable
  const json = readJsonStore();
  if (json.settings && json.settings.heroTitle) {
    return {
      ...json.settings,
      footerLinks: Array.from(new Set([...(json.settings.footerLinks || []), "All Projects", "Brands", "Products", "Instagram", "FAQ", "Blog", "Privacy Policy"])),
    };
  }

  // Fallback to Prisma
  try {
    const db = await prisma.siteSettings.findUnique({ where: { id: "default" } });
    if (db) {
      const result: SiteSettingsItem = {
        heroTitle: db.heroTitle,
        heroTagline: db.heroTagline,
        heroSubtext: db.heroSubtext,
        heroVideoUrl: db.heroVideoUrl,
        heroCategories: db.heroCategories,
        contactEmail: db.contactEmail,
        contactPhone: db.contactPhone,
        contactAddress: db.contactAddress,
        googleMapUrl: db.googleMapUrl || "",
        webhookUrl: db.webhookUrl || "",
        footerLinks: Array.from(new Set([...(db.footerLinks || []), "All Projects", "Brands", "Products", "Instagram", "FAQ", "Blog", "Privacy Policy"])),
        socialLinks: db.socialLinks,
        copyrightText: db.copyrightText || "AAREN © 2026. All rights reserved.",
      };
      json.settings = result;
      globalThis.__AAREN_MEMORY_STORE__ = json;
      return result;
    }
  } catch (e) {}

  return {
    ...DEFAULT_SETTINGS,
    footerLinks: Array.from(new Set([...(DEFAULT_SETTINGS.footerLinks || []), "All Projects", "Brands", "Products", "Instagram", "FAQ", "Blog", "Privacy Policy"])),
  };
}

export async function updateSiteSettingsStore(data: Partial<SiteSettingsItem>): Promise<SiteSettingsItem> {
  const current = await getSiteSettingsStore();
  const updated = { ...current, ...data };

  // 1. Update local memory immediately
  const json = readJsonStore();
  json.settings = updated;
  globalThis.__AAREN_MEMORY_STORE__ = json;
  writeJsonStore(json);

  // 2. Primary: Save directly to Firebase Cloud
  await syncToFirebaseCloudStore("settings", updated);

  // 3. Background Prisma
  try {
    await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: updated,
      create: { id: "default", ...updated },
    });
  } catch (e) {}

  return updated;
}

// CATALOG SETTINGS STORE
export async function getCatalogSettingsStore(): Promise<CatalogSettingsItem> {
  const json = readJsonStore();
  if (json.catalogSettings && json.catalogSettings.modalTitle) {
    return { ...DEFAULT_CATALOG_SETTINGS, ...json.catalogSettings };
  }
  const fbData = await fetchFromFirebaseCloudStore("catalogSettings");
  if (fbData && typeof fbData === "object" && fbData.modalTitle) {
    json.catalogSettings = fbData;
    globalThis.__AAREN_MEMORY_STORE__ = json;
    return { ...DEFAULT_CATALOG_SETTINGS, ...fbData };
  }
  return DEFAULT_CATALOG_SETTINGS;
}

export async function saveCatalogSettingsStore(data: Partial<CatalogSettingsItem>): Promise<CatalogSettingsItem> {
  const current = await getCatalogSettingsStore();
  const updated = { ...current, ...data };
  const json = readJsonStore();
  json.catalogSettings = updated;
  globalThis.__AAREN_MEMORY_STORE__ = json;
  writeJsonStore(json);
  await syncToFirebaseCloudStore("catalogSettings", updated);
  return updated;
}

// CATEGORIES STORE
export async function getCategoriesStore(): Promise<CategoryItem[]> {
  // 🔑 FIX: Always check Firebase FIRST so admin edits survive Vercel redeploys
  const fbData = await fetchFromFirebaseCloudStore("categories");
  if (fbData && Array.isArray(fbData) && fbData.length > 0) {
    const json = readJsonStore();
    json.categories = fbData;
    globalThis.__AAREN_MEMORY_STORE__ = json;
    return fbData;
  }

  // Fallback to local JSON if Firebase unavailable
  const json = readJsonStore();
  if (json.categories && Array.isArray(json.categories) && json.categories.length > 0) {
    return json.categories;
  }

  // Fallback to Prisma
  try {
    const dbCats = await prisma.category.findMany({ orderBy: { sequenceNumber: "asc" } });
    if (dbCats && dbCats.length > 0) {
      const mapped: CategoryItem[] = dbCats.map((c: any) => ({
        id: c.id,
        name: c.name,
        coverImage: c.coverImage || "",
        description: c.description || "",
        shortCode: c.shortCode || "",
        sequenceNumber: c.sequenceNumber || 1,
      }));
      json.categories = mapped;
      globalThis.__AAREN_MEMORY_STORE__ = json;
      return mapped;
    }
  } catch (e) {}

  return DEFAULT_CATEGORIES;
}

// BRANDS STORE
export async function getBrandsStore(): Promise<BrandItem[]> {
  // 🔑 FIX: Always check Firebase FIRST so admin edits (logos, descriptions, catalogs) survive Vercel redeploys
  const fbData = await fetchFromFirebaseCloudStore("brands");
  if (fbData && Array.isArray(fbData) && fbData.length > 0) {
    const json = readJsonStore();
    json.brands = fbData;
    globalThis.__AAREN_MEMORY_STORE__ = json;
    return fbData;
  }

  // Fallback to local JSON if Firebase unavailable
  const json = readJsonStore();
  if (json.brands && Array.isArray(json.brands) && json.brands.length > 0) {
    return json.brands;
  }

  // Fallback to Prisma
  try {
    const dbBrands = await prisma.brand.findMany({ orderBy: { sequenceNumber: "asc" } });
    if (dbBrands && dbBrands.length > 0) {
      const mapped: BrandItem[] = dbBrands.map((b: any) => ({
        id: b.id,
        name: b.name,
        logoUrl: b.logoUrl || "",
        bannerUrl: b.bannerUrl || "",
        description: b.description || "",
        shortCode: b.shortCode || "",
        sequenceNumber: b.sequenceNumber || 1,
        catalogPdfUrl: b.catalogPdfUrl || undefined,
        galleryImages: b.galleryImages || undefined,
      }));
      json.brands = mapped;
      globalThis.__AAREN_MEMORY_STORE__ = json;
      return mapped;
    }
  } catch (e) {}

  return DEFAULT_BRANDS;
}

export async function getBrandByIdStore(id: string): Promise<BrandItem | null> {
  const all = await getBrandsStore();
  const norm = (s: string) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const found = all.find(
    (b) => b.id === id || norm(b.id) === norm(id) || norm(b.name) === norm(id)
  );
  return found || null;
}

export async function saveBrandStore(brand: Omit<BrandItem, "id"> & { id?: string }): Promise<BrandItem> {
  const id = brand.id || brand.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const full: BrandItem = { ...brand, id };

  // 1. Get current brands from Firebase
  let current: BrandItem[] = [];
  const fbData = await fetchFromFirebaseCloudStore("brands");
  if (fbData && Array.isArray(fbData)) current = fbData;
  else { const j = readJsonStore(); current = j.brands || []; }

  const idx = current.findIndex((b: any) => b.id === id || b.name.toLowerCase() === full.name.toLowerCase());
  if (idx >= 0) current[idx] = { ...current[idx], ...full };
  else current.push(full);

  // 2. Save directly to Firebase
  await syncToFirebaseCloudStore("brands", current);

  // 3. Local cache
  const json = readJsonStore();
  json.brands = current;
  globalThis.__AAREN_MEMORY_STORE__ = json;

  // 4. Background Prisma
  try {
    const prismaPayload = {
      name: full.name,
      logoUrl: full.logoUrl,
      bannerUrl: full.bannerUrl,
      description: full.description,
      shortCode: full.shortCode || "BR 01",
      sequenceNumber: full.sequenceNumber || 1,
      catalogPdfUrl: full.catalogPdfUrl || null,
    };
    await prisma.brand.upsert({
      where: { id },
      update: prismaPayload,
      create: { id, ...prismaPayload },
    });
  } catch (e) {}

  return full;
}

export async function deleteBrandStore(id: string) {
  let current: BrandItem[] = [];
  const fbData = await fetchFromFirebaseCloudStore("brands");
  if (fbData && Array.isArray(fbData)) current = fbData;
  else { const j = readJsonStore(); current = j.brands || []; }

  current = current.filter((b: any) => b.id !== id);
  await syncToFirebaseCloudStore("brands", current);

  const json = readJsonStore();
  json.brands = current;
  globalThis.__AAREN_MEMORY_STORE__ = json;

  try { await prisma.brand.delete({ where: { id } }); } catch (e) {}
}

// PRODUCTS STORE
export async function getAllProductsStore(): Promise<ProductItem[]> {
  // 🔑 FIX: Always check Firebase FIRST so admin edits survive Vercel redeploys
  const fbData = await fetchFromFirebaseCloudStore("products");
  if (fbData && Array.isArray(fbData) && fbData.length > 0) {
    const json = readJsonStore();
    json.products = fbData;
    globalThis.__AAREN_MEMORY_STORE__ = json;
    return fbData;
  }

  // Fallback to local JSON if Firebase unavailable
  const json = readJsonStore();
  if (json.products && Array.isArray(json.products) && json.products.length > 0) {
    return json.products;
  }

  // Fallback to Prisma
  try {
    const dbProducts = await prisma.product.findMany({ orderBy: { slNo: "asc" } });
    if (dbProducts && dbProducts.length > 0) {
      const mapped: ProductItem[] = dbProducts.map((p: any) => ({
        id: p.id,
        slNo: p.slNo || undefined,
        name: p.name,
        brand: p.brand,
        category: p.category,
        subcategory: p.subcategory || undefined,
        shortCode: p.shortCode || undefined,
        width: p.width || undefined,
        height: p.height || undefined,
        depth: p.depth || undefined,
        measurementType: p.measurementType || undefined,
        thickness: p.thickness || undefined,
        finish: p.finish || undefined,
        description: p.description || "",
        tags: p.tags || [],
        imageUrl: p.imageUrl || "",
        galleryImages: p.galleryImages || undefined,
        catalogPdfUrl: p.catalogPdfUrl || undefined,
        qtyInStock: p.qtyInStock || 0,
        price: p.price || undefined,
        finishOptions: p.finishOptions ? (typeof p.finishOptions === "string" ? JSON.parse(p.finishOptions) : p.finishOptions) : undefined,
      }));
      json.products = mapped;
      globalThis.__AAREN_MEMORY_STORE__ = json;
      return mapped;
    }
  } catch (e) {}

  return DEFAULT_PRODUCTS;
}

export async function getProductByIdStore(id: string): Promise<ProductItem | null> {
  const all = await getAllProductsStore();
  const found = all.find(
    (p) => p.id === id || p.id.toLowerCase() === id.toLowerCase() || p.id.replace(/[^a-zA-Z0-9]/g, "") === id.replace(/[^a-zA-Z0-9]/g, "")
  );
  return found || null;
}

export async function addProductStore(product: Omit<ProductItem, "id"> & { id?: string }): Promise<ProductItem> {
  const id = product.id || `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const fullProduct: ProductItem = { ...product, id };

  // 1. Get current products from Firebase
  let current: ProductItem[] = [];
  const fbData = await fetchFromFirebaseCloudStore("products");
  if (fbData && Array.isArray(fbData)) current = fbData;
  else { const j = readJsonStore(); current = j.products || []; }

  const idx = current.findIndex((p: any) => p.id === id);
  if (idx >= 0) current[idx] = fullProduct;
  else current.unshift(fullProduct);

  // 2. Save directly to Firebase
  await syncToFirebaseCloudStore("products", current);

  // 3. Local cache
  const json = readJsonStore();
  json.products = current;
  globalThis.__AAREN_MEMORY_STORE__ = json;

  // 4. Background Prisma sync
  prisma.product.upsert({
    where: { id },
    update: {
      name: product.name, brand: product.brand, category: product.category,
      subcategory: product.subcategory, shortCode: product.shortCode,
      width: product.width, height: product.height, depth: product.depth,
      measurementType: product.measurementType, thickness: product.thickness,
      finish: product.finish, description: product.description,
      tags: product.tags || [], imageUrl: product.imageUrl,
      galleryImages: product.galleryImages || [],
      catalogPdfUrl: product.catalogPdfUrl,
      qtyInStock: product.qtyInStock || 0, price: product.price,
      finishOptions: product.finishOptions ? JSON.stringify(product.finishOptions) : null,
    },
    create: {
      id, name: product.name, brand: product.brand, category: product.category,
      subcategory: product.subcategory, shortCode: product.shortCode,
      width: product.width, height: product.height, depth: product.depth,
      measurementType: product.measurementType, thickness: product.thickness,
      finish: product.finish, description: product.description,
      tags: product.tags || [], imageUrl: product.imageUrl,
      galleryImages: product.galleryImages || [],
      catalogPdfUrl: product.catalogPdfUrl,
      qtyInStock: product.qtyInStock || 0, price: product.price,
      finishOptions: product.finishOptions ? JSON.stringify(product.finishOptions) : null,
    },
  }).catch(() => {});

  return fullProduct;
}

export async function updateProductStore(id: string, updates: Partial<ProductItem>): Promise<ProductItem | null> {
  const existing = await getProductByIdStore(id);
  const fullUpdated: ProductItem = {
    ...(existing || {
      id,
      name: updates.name || "Untitled Product",
      brand: updates.brand || "AAREN",
      category: updates.category || "General",
      description: updates.description || "",
      imageUrl: updates.imageUrl || "/brands/brand_1_1.png",
    }),
    ...updates,
    id,
  };

  return await addProductStore(fullUpdated);
}

export async function deleteProductStore(id: string) {
  let current: ProductItem[] = [];
  const fbData = await fetchFromFirebaseCloudStore("products");
  if (fbData && Array.isArray(fbData)) current = fbData;
  else { const j = readJsonStore(); current = j.products || []; }

  current = current.filter((p: any) => p.id !== id);
  await syncToFirebaseCloudStore("products", current);

  const json = readJsonStore();
  json.products = current;
  globalThis.__AAREN_MEMORY_STORE__ = json;

  try { await prisma.product.delete({ where: { id } }); } catch (e) {}
}








export function formatGoogleDriveUrl(url?: string): string {
  if (!url) return "";
  const str = String(url).trim();
  const match = str.match(/\/d\/([a-zA-Z0-9_-]+)/) || str.match(/id=([a-zA-Z0-9_-]+)/);
  return match ? `https://lh3.googleusercontent.com/d/${match[1]}` : str;
}

export async function parseAndImportExcelProducts(fileBuffer: Buffer): Promise<ProductItem[]> {
  const workbook = xlsx.read(fileBuffer, { type: "buffer" });
  const importedProducts: ProductItem[] = [];

  // 1. Process Brand Logos sheet if present
  if (workbook.SheetNames.includes("Brand Logos")) {
    try {
      const sheet = workbook.Sheets["Brand Logos"];
      const rawRows: any[] = xlsx.utils.sheet_to_json(sheet, { header: 1 });
      if (rawRows.length > 1) {
        const json = readJsonStore();
        if (!json.brands) json.brands = DEFAULT_BRANDS;
        for (let i = 1; i < rawRows.length; i++) {
          const r = rawRows[i];
          if (!r || r.length < 2) continue;
          const bName = String(r[0] || "").trim();
          const bLogo = formatGoogleDriveUrl(String(r[1] || "").trim());
          if (bName && bLogo) {
            const existingIdx = json.brands.findIndex((b: any) => b.name.toLowerCase() === bName.toLowerCase());
            if (existingIdx >= 0) {
              json.brands[existingIdx].logoUrl = bLogo;
            } else {
              json.brands.push({
                id: `brand-${Date.now()}-${i}`,
                name: bName,
                logoUrl: bLogo,
                bannerUrl: bLogo,
                description: `${bName} Premium Architectural Brand`,
                shortCode: bName.substring(0, 3).toUpperCase(),
                sequenceNumber: json.brands.length + 1,
              });
            }
          }
        }
        writeJsonStore(json);
      }
    } catch (e) {
      console.error("Brand Logos import error:", e);
    }
  }

  // 2. Process product sheets (Products, Project, or first sheet)
  const sheetsToProcess = workbook.SheetNames.filter(
    (s) => !["_VersionData", "_ProjectVersions", "Brand Logos"].includes(s)
  );

  if (sheetsToProcess.length === 0) sheetsToProcess.push(workbook.SheetNames[0]);

  for (const sheetName of sheetsToProcess) {
    const worksheet = workbook.Sheets[sheetName];
    const rawData: any[] = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    if (!rawData || rawData.length < 2) continue;

    let headerRowIndex = 0;
    for (let i = 0; i < Math.min(5, rawData.length); i++) {
      const rowStr = JSON.stringify(rawData[i]).toLowerCase();
      if (rowStr.includes("product") || rowStr.includes("brand") || rowStr.includes("category")) {
        headerRowIndex = i;
        break;
      }
    }

    const headers: string[] = rawData[headerRowIndex].map((h: any) => String(h || "").trim());

    for (let i = headerRowIndex + 1; i < rawData.length; i++) {
      const row = rawData[i];
      if (!row || row.length === 0) continue;

      const rowObj: Record<string, any> = {};
      headers.forEach((h, idx) => {
        if (h) rowObj[h] = row[idx];
      });

      const name = rowObj["Name of the Product"] || rowObj["Product Name"] || rowObj["Name"];
      if (!name || String(name).trim() === "") continue;

      const brand = rowObj["Brand"] || "Aaren";
      const category = String(rowObj["Category"] || "Plywood").trim();
      const shortCode = String(rowObj["Unique Code"] || rowObj["Short Code"] || rowObj["Code"] || "").trim();

      // Collect tags
      const tags: string[] = [];
      ["Tag 1", "Tag 2", "Tag 3", "Tag 4", "Tag 5", "Tags"].forEach((t) => {
        if (rowObj[t] && String(rowObj[t]).trim() !== "") {
          tags.push(String(rowObj[t]).trim());
        }
      });

      // Images
      const img1 = formatGoogleDriveUrl(rowObj["Image 1"] || rowObj["Image"]);
      const img2 = formatGoogleDriveUrl(rowObj["Image 2"]);
      const img3 = formatGoogleDriveUrl(rowObj["Image 3"]);
      const galleryImages = [img2, img3].filter(Boolean);

      const catalogPdfUrl = formatGoogleDriveUrl(rowObj["Catalog"] || rowObj["PDF"]);

      const newProd: Omit<ProductItem, "id"> = {
        name: String(name).trim(),
        shortCode: shortCode || undefined,
        brand: String(brand).trim(),
        category: category,
        subcategory: rowObj["Subcategory"] ? String(rowObj["Subcategory"]).trim() : undefined,
        width: String(rowObj["Width"] || rowObj["Size"] || ""),
        height: String(rowObj["Height"] || ""),
        depth: String(rowObj["Depth"] || ""),
        measurementType: String(rowObj["Measurement Type"] || "mm"),
        thickness: String(rowObj["Thickness"] || ""),
        finish: String(rowObj["Finish"] || ""),
        description: String(rowObj["Description"] || `${brand} ${name}`),
        tags: tags.length > 0 ? tags : [category],
        imageUrl: img1 || "/brands/brand_1_1.png",
        galleryImages: galleryImages.length > 0 ? galleryImages : undefined,
        catalogPdfUrl: catalogPdfUrl || undefined,
        qtyInStock: parseInt(rowObj["Qty in Stock"] || "10", 10),
        price: rowObj["Price"] ? parseFloat(rowObj["Price"]) : undefined,
      };

      // Ensure category exists in store so product has a public page
      const json = readJsonStore();
      const existingCat = (json.categories || DEFAULT_CATEGORIES).find(
        (c: any) => c.name.toLowerCase() === category.toLowerCase()
      );
      if (!existingCat) {
        if (!json.categories) json.categories = [...DEFAULT_CATEGORIES];
        json.categories.push({
          id: category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          name: category,
          coverImage: img1 || "/categories/cat_1.png",
          description: `Architectural ${category} products collection`,
          shortCode: category.substring(0, 2).toUpperCase() + " " + (json.categories.length + 1),
          sequenceNumber: json.categories.length + 1,
        });
        writeJsonStore(json);
      }

      const created = await addProductStore(newProd);
      importedProducts.push(created);
    }
  }

  return importedProducts;
}

// SHOWCASE PROJECTS STORE
export async function getAllProjectsStore(): Promise<ProjectShowcaseItem[]> {
  const fbData = await fetchFromFirebaseCloudStore("projects");
  if (fbData && Array.isArray(fbData) && fbData.length > 0) {
    const json = readJsonStore();
    json.projects = fbData;
    globalThis.__AAREN_MEMORY_STORE__ = json;
    return fbData;
  }

  const json = readJsonStore();
  if (json.projects && Array.isArray(json.projects) && json.projects.length > 0) {
    return json.projects;
  }

  return DEFAULT_PROJECTS;
}

export async function saveCategoryStore(cat: Omit<CategoryItem, "id"> & { id?: string }): Promise<CategoryItem> {
  const id = cat.id || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const full: CategoryItem = { ...cat, id };

  // 1. Get current from Firebase
  let current: CategoryItem[] = [];
  const fbData = await fetchFromFirebaseCloudStore("categories");
  if (fbData && Array.isArray(fbData)) current = fbData;
  else { const j = readJsonStore(); current = j.categories || []; }

  const idx = current.findIndex((c: any) => c.id === id);
  if (idx >= 0) current[idx] = full;
  else current.push(full);

  // 2. Save to Firebase directly
  await syncToFirebaseCloudStore("categories", current);

  // 3. Local cache update
  const json = readJsonStore();
  json.categories = current;
  globalThis.__AAREN_MEMORY_STORE__ = json;

  // 4. Background Prisma
  try { await prisma.category.upsert({ where: { id }, update: cat, create: { id, ...cat } }); } catch (e) {}

  return full;
}

export async function deleteCategoryStore(id: string) {
  let current: CategoryItem[] = [];
  const fbData = await fetchFromFirebaseCloudStore("categories");
  if (fbData && Array.isArray(fbData)) current = fbData;
  else { const j = readJsonStore(); current = j.categories || []; }

  current = current.filter((c: any) => c.id !== id);
  await syncToFirebaseCloudStore("categories", current);

  const json = readJsonStore();
  json.categories = current;
  globalThis.__AAREN_MEMORY_STORE__ = json;

  try { await prisma.category.delete({ where: { id } }); } catch (e) {}
}

export async function saveProjectStore(projectData: Omit<ProjectShowcaseItem, "id"> & { id?: string }): Promise<ProjectShowcaseItem> {
  const id = projectData.id || `proj-${Date.now()}`;
  const slug = projectData.slug || projectData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const mainImg = projectData.imageUrl || "";
  const galleryImgs = projectData.gallery || (mainImg ? [mainImg] : []);
  const full: ProjectShowcaseItem = { ...projectData, id, slug, imageUrl: mainImg, gallery: galleryImgs };

  // 1. Get current from Firebase
  let current: ProjectShowcaseItem[] = [];
  const fbData = await fetchFromFirebaseCloudStore("projects");
  if (fbData && Array.isArray(fbData)) current = fbData;
  else { const j = readJsonStore(); current = j.projects || []; }
  const idx = current.findIndex((p: any) => p.id === id);
  if (idx >= 0) current[idx] = full; else current.push(full);

  // 2. Save to Firebase directly
  await syncToFirebaseCloudStore("projects", current);

  // 3. Local memory
  const json = readJsonStore(); json.projects = current; globalThis.__AAREN_MEMORY_STORE__ = json;

  // 4. Background Prisma
  try { await prisma.project.upsert({ where: { id }, update: { title: projectData.title, slug, description: projectData.description, category: projectData.category, client: projectData.client, projectCode: projectData.projectCode || "OB 01", sequenceNumber: projectData.sequenceNumber || 1, imageUrl: mainImg, gallery: galleryImgs }, create: { id, title: projectData.title, slug, description: projectData.description, category: projectData.category, client: projectData.client, projectCode: projectData.projectCode || "OB 01", sequenceNumber: projectData.sequenceNumber || 1, imageUrl: mainImg, gallery: galleryImgs } }); } catch (err) {}

  return full;
}

export async function deleteProjectStore(id: string) {
  let current: ProjectShowcaseItem[] = [];
  const fbData = await fetchFromFirebaseCloudStore("projects");
  if (fbData && Array.isArray(fbData)) current = fbData;
  else { const j = readJsonStore(); current = j.projects || []; }
  current = current.filter((p: any) => p.id !== id);
  await syncToFirebaseCloudStore("projects", current);
  const json = readJsonStore(); json.projects = current; globalThis.__AAREN_MEMORY_STORE__ = json;
  try { await prisma.project.delete({ where: { id } }); } catch (e) {}
}

// CAREERS STORE
export const DEFAULT_CAREERS: CareerItem[] = [
  { id: "cr-1", title: "3D Generalist", department: "Motion Design", location: "Remote / Bangalore", type: "Full-Time", description: "Lead architectural visualization, spatial CGI rendering, and product mockups." },
  { id: "cr-2", title: "Senior Creative Developer", department: "Engineering", location: "Bangalore, India", type: "Full-Time", description: "Build interactive digital material catalogs, WebGL configurators, and luxury design tools." },
  { id: "cr-3", title: "Art Director", department: "Creative", location: "Hybrid / Bangalore", type: "Full-Time", description: "Direct visual language, spatial narratives, and brand installations." },
];

export async function getCareersStore(): Promise<CareerItem[]> {
  const fbData = await fetchFromFirebaseCloudStore("careers");
  if (fbData && Array.isArray(fbData) && fbData.length > 0) {
    const json = readJsonStore();
    json.careers = fbData;
    globalThis.__AAREN_MEMORY_STORE__ = json;
    return fbData;
  }
  const json = readJsonStore();
  if (json.careers && Array.isArray(json.careers) && json.careers.length > 0) {
    return json.careers;
  }
  return DEFAULT_CAREERS;
}

export async function saveCareerStore(career: Omit<CareerItem, "id"> & { id?: string }): Promise<CareerItem> {
  const id = career.id || `cr-${Date.now()}`;
  const full: CareerItem = { ...career, id, createdAt: new Date().toISOString() };
  let current: CareerItem[] = await getCareersStore();
  const idx = current.findIndex((c) => c.id === id);
  if (idx >= 0) current[idx] = full;
  else current.unshift(full);
  await syncToFirebaseCloudStore("careers", current);
  const json = readJsonStore();
  json.careers = current;
  globalThis.__AAREN_MEMORY_STORE__ = json;
  writeJsonStore(json);
  return full;
}

export async function deleteCareerStore(id: string) {
  let current: CareerItem[] = await getCareersStore();
  current = current.filter((c) => c.id !== id);
  await syncToFirebaseCloudStore("careers", current);
  const json = readJsonStore();
  json.careers = current;
  globalThis.__AAREN_MEMORY_STORE__ = json;
  writeJsonStore(json);
}





// TEAM & ROADMAP STORE
// Leadership IDs that must always have category="Leadership" even if Firebase has stale data
const LEADERSHIP_IDS = ["tm-01", "tm-02", "tm-03"];

export async function getTeamStore(): Promise<TeamMemberItem[]> {
  const fbData = await fetchFromFirebaseCloudStore("team");
  if (fbData && Array.isArray(fbData)) {
    const json = readJsonStore();
    json.team = fbData;
    globalThis.__AAREN_MEMORY_STORE__ = json;
    return fbData;
  }

  const json = readJsonStore();
  if (json.team && Array.isArray(json.team)) {
    return json.team;
  }

  return DEFAULT_TEAM;
}

export async function reorderTeamStore(teamList: TeamMemberItem[]): Promise<TeamMemberItem[]> {
  await syncToFirebaseCloudStore("team", teamList);
  const json = readJsonStore();
  json.team = teamList;
  globalThis.__AAREN_MEMORY_STORE__ = json;
  return teamList;
}

export async function saveTeamMemberStore(member: Omit<TeamMemberItem, "id"> & { id?: string }) {
  // 1. Get complete current team (defaults + custom additions)
  let currentTeam = await getTeamStore();

  let targetId = member.id;
  let idx = -1;
  if (targetId) {
    idx = currentTeam.findIndex((t: any) => t.id === targetId);
  }
  if (idx === -1 && member.name) {
    idx = currentTeam.findIndex((t: any) => t.name.trim().toLowerCase() === member.name.trim().toLowerCase());
  }

  if (idx >= 0) {
    targetId = currentTeam[idx].id;
  } else {
    targetId = targetId || `tm-${Date.now()}`;
  }

  const full: TeamMemberItem = { ...(currentTeam[idx] || {}), ...member, id: targetId };
  if (idx >= 0) {
    currentTeam[idx] = full;
  } else {
    currentTeam.push(full);
  }

  // 2. PRIMARY SAVE: Directly sync updated team to Firebase Cloud (immediate, permanent)
  await syncToFirebaseCloudStore("team", currentTeam);

  // 3. Update local memory cache
  const json = readJsonStore();
  json.team = currentTeam;
  globalThis.__AAREN_MEMORY_STORE__ = json;

  // 4. Background: try Prisma (will fail on Vercel with local DB, that's OK)
  try {
    await prisma.teamMember.upsert({
      where: { id: targetId },
      update: full,
      create: full,
    });
  } catch (e) {}

  return full;
}

export async function deleteTeamMemberStore(id: string) {
  // 1. Get current team from Firebase
  let currentTeam: TeamMemberItem[] = [];
  const fbTeam = await fetchFromFirebaseCloudStore("team");
  if (fbTeam && Array.isArray(fbTeam) && fbTeam.length > 0) {
    currentTeam = fbTeam;
  } else {
    const json = readJsonStore();
    currentTeam = json.team || [];
  }

  currentTeam = currentTeam.filter((t: any) => t.id !== id);

  // 2. Sync deleted list back to Firebase immediately
  await syncToFirebaseCloudStore("team", currentTeam);

  // 3. Update local memory
  const json = readJsonStore();
  json.team = currentTeam;
  globalThis.__AAREN_MEMORY_STORE__ = json;

  // 4. Background Prisma (fails silently on Vercel)
  try { await prisma.teamMember.delete({ where: { id } }); } catch (e) {}
}

export async function getRoadmapStore(): Promise<RoadmapStepItem[]> {
  const fbData = await fetchFromFirebaseCloudStore("roadmap");
  if (fbData && Array.isArray(fbData)) return fbData;
  const json = readJsonStore();
  if (json.roadmap && Array.isArray(json.roadmap) && json.roadmap.length > 0) {
    return json.roadmap;
  }
  return DEFAULT_ROADMAP;
}

export async function saveRoadmapStepStore(step: Omit<RoadmapStepItem, "id"> & { id?: string }) {
  const id = step.id || `rm-${Date.now()}`;
  const full = { ...step, id };
  let current: RoadmapStepItem[] = [];
  const fbData = await fetchFromFirebaseCloudStore("roadmap");
  if (fbData && Array.isArray(fbData)) current = fbData;
  else { const j = readJsonStore(); current = j.roadmap || [...DEFAULT_ROADMAP]; }

  const idx = current.findIndex((r: any) => r.id === id);
  if (idx >= 0) current[idx] = full;
  else current.push(full);

  await syncToFirebaseCloudStore("roadmap", current);
  const json = readJsonStore();
  json.roadmap = current;
  globalThis.__AAREN_MEMORY_STORE__ = json;

  try { await prisma.roadmapStep.upsert({ where: { id }, update: step, create: { id, ...step } }); } catch (e) {}
  return full;
}

export async function deleteRoadmapStepStore(id: string) {
  let current: RoadmapStepItem[] = [];
  const fbData = await fetchFromFirebaseCloudStore("roadmap");
  if (fbData && Array.isArray(fbData)) current = fbData;
  else { const j = readJsonStore(); current = j.roadmap || [...DEFAULT_ROADMAP]; }

  current = current.filter((r: any) => r.id !== id);
  await syncToFirebaseCloudStore("roadmap", current);
  const json = readJsonStore();
  json.roadmap = current;
  globalThis.__AAREN_MEMORY_STORE__ = json;

  try { await prisma.roadmapStep.delete({ where: { id } }); } catch (e) {}
}

export async function reorderRoadmapStore(steps: RoadmapStepItem[]): Promise<RoadmapStepItem[]> {
  await syncToFirebaseCloudStore("roadmap", steps);
  const json = readJsonStore();
  json.roadmap = steps;
  globalThis.__AAREN_MEMORY_STORE__ = json;
  return steps;
}

export const DEFAULT_TEAM_JOIN_BANNER: TeamJoinBanner = {
  title: "DO YOU WANT TO JOIN THE CREATIVE TEAM?",
  fontSize: "medium",
  hoursText: "Open 9am to 9pm (All days)",
  phone: "+91 88844 64444",
  email: "info@aarenintpro.com",
  address: "NO. 342/8, NTY LAYOUT, MYSORE ROAD, BENGALURU - 560026",
};

export async function getTeamJoinBannerStore(): Promise<TeamJoinBanner> {
  const fbData = await fetchFromFirebaseCloudStore("joinBanner");
  if (fbData && typeof fbData === "object" && fbData.title) return fbData;
  const json = readJsonStore();
  return json.joinBanner || DEFAULT_TEAM_JOIN_BANNER;
}

export async function saveTeamJoinBannerStore(banner: TeamJoinBanner): Promise<TeamJoinBanner> {
  const current = await getTeamJoinBannerStore();
  const updated = { ...DEFAULT_TEAM_JOIN_BANNER, ...current, ...banner };
  await syncToFirebaseCloudStore("joinBanner", updated);
  const json = readJsonStore();
  json.joinBanner = updated;
  globalThis.__AAREN_MEMORY_STORE__ = json;
  return updated;
}

declare global {
  var __AAREN_MEMORY_STORE__: any;
  var __AAREN_INQUIRIES_CACHE__: InquiryItem[];
}

const FIREBASE_RTDB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://aarenintpro-1c09f-default-rtdb.firebaseio.com";

// INQUIRIES STORE (LEADS & PROTECTED CATALOG GATE)
export async function getInquiriesStore(): Promise<InquiryItem[]> {
  const json = readJsonStore();
  const fileInquiries: InquiryItem[] = json.inquiries || [];
  const memoryInquiries: InquiryItem[] = globalThis.__AAREN_INQUIRIES_CACHE__ || [];

  let firebaseInquiries: InquiryItem[] = [];
  try {
    const res = await fetch(`${FIREBASE_RTDB_URL}/inquiries.json`, { cache: "no-store" });
    if (res.ok) {
      const fbData = await res.json();
      if (fbData && typeof fbData === "object") {
        firebaseInquiries = Object.values(fbData).filter((i: any) => i && i.id && i.name) as InquiryItem[];
      }
    }
  } catch (e) {
    console.error("Firebase RTDB fetch inquiries error:", e);
  }

  let dbInquiries: InquiryItem[] = [];
  try {
    const dbPromise = prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });
    const timeoutPromise = new Promise<any>((_, reject) => setTimeout(() => reject(new Error("DB Timeout")), 1200));
    const db = await Promise.race([dbPromise, timeoutPromise]);
    if (db && db.length > 0) {
      dbInquiries = db.map((i: any) => ({
        id: i.id,
        name: i.name,
        email: i.email,
        phone: i.phone,
        type: i.type,
        subject: i.subject || undefined,
        message: i.message || undefined,
        productOrBrand: i.productOrBrand || undefined,
        createdAt: typeof i.createdAt === "string" ? i.createdAt : i.createdAt.toISOString(),
      }));
    }
  } catch (e) {}

  const map = new Map<string, InquiryItem>();
  fileInquiries.forEach((item) => map.set(item.id, item));
  memoryInquiries.forEach((item) => map.set(item.id, item));
  firebaseInquiries.forEach((item) => map.set(item.id, item));
  dbInquiries.forEach((item) => map.set(item.id, item));

  const all = Array.from(map.values());
  all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return all;
}

export async function logInquiryStore(data: {
  name: string;
  email: string;
  phone: string;
  type?: string;
  subject?: string;
  message?: string;
  productOrBrand?: string;
}): Promise<InquiryItem> {
  const id = `inq-${Date.now()}`;
  const full: InquiryItem = {
    id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    type: data.type || "Contact Form",
    subject: data.subject,
    message: data.message,
    productOrBrand: data.productOrBrand,
    createdAt: new Date().toISOString(),
  };

  // 1. Memory Cache
  if (!globalThis.__AAREN_INQUIRIES_CACHE__) {
    globalThis.__AAREN_INQUIRIES_CACHE__ = [];
  }
  globalThis.__AAREN_INQUIRIES_CACHE__.unshift(full);

  // 2. JSON Store File (Local + /tmp)
  const json = readJsonStore();
  if (!json.inquiries) json.inquiries = [];
  json.inquiries.unshift(full);
  writeJsonStore(json);

  // 3. Firebase Realtime Database Cloud Sync (Ensures leads persist across Vercel serverless cold-starts)
  try {
    await fetch(`${FIREBASE_RTDB_URL}/inquiries/${id}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(full),
    });
  } catch (fbErr) {
    console.error("Firebase inquiry insert error:", fbErr);
  }

  // 4. Prisma DB Insert (Local PostgreSQL if available)
  try {
    await prisma.inquiry.create({
      data: {
        id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        type: data.type || "Contact Form",
        subject: data.subject,
        message: data.message,
        productOrBrand: data.productOrBrand,
      },
    });
  } catch (e) {
    console.error("Prisma inquiry insert error:", e);
  }

  // Trigger Google Sheet Webhook if configured
  try {
    const settings = json.settings || DEFAULT_SETTINGS;
    if (settings.webhookUrl && settings.webhookUrl.startsWith("http")) {
      fetch(settings.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(full),
      }).catch((e) => console.error("Webhook trigger failed:", e));
    }
  } catch (e) {}

  return full;
}

export async function deleteInquiryStore(id: string): Promise<boolean> {
  // Delete from Firebase Cloud DB
  try {
    await fetch(`${FIREBASE_RTDB_URL}/inquiries/${id}.json`, { method: "DELETE" });
  } catch (e) {}

  // Delete from Prisma DB
  try {
    await prisma.inquiry.delete({ where: { id } });
  } catch (e) {}

  // Delete from Memory Cache
  if (globalThis.__AAREN_INQUIRIES_CACHE__) {
    globalThis.__AAREN_INQUIRIES_CACHE__ = globalThis.__AAREN_INQUIRIES_CACHE__.filter((i) => i.id !== id);
  }

  // Delete from JSON file
  const json = readJsonStore();
  if (json.inquiries) {
    json.inquiries = json.inquiries.filter((i: any) => i.id !== id);
    writeJsonStore(json);
  }
  return true;
}

export function generateInquiriesCSV(inquiries: InquiryItem[]): string {
  const headers = ["ID", "Name", "Email", "Phone", "Type", "Product / Brand", "Subject", "Message", "Created Date"];
  const rows = inquiries.map((i) => [
    i.id,
    `"${i.name.replace(/"/g, '""')}"`,
    `"${i.email.replace(/"/g, '""')}"`,
    `"${i.phone.replace(/"/g, '""')}"`,
    `"${i.type}"`,
    `"${(i.productOrBrand || "").replace(/"/g, '""')}"`,
    `"${(i.subject || "").replace(/"/g, '""')}"`,
    `"${(i.message || "").replace(/"/g, '""')}"`,
    `"${i.createdAt}"`,
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

export const createProjectStore = saveProjectStore;

export async function getAllFAQsStore(): Promise<FaqItem[]> {
  const fbData = await fetchFromFirebaseCloudStore("faqs");
  if (fbData && Array.isArray(fbData) && fbData.length > 0) {
    const json = readJsonStore();
    json.faqs = fbData;
    globalThis.__AAREN_MEMORY_STORE__ = json;
    return fbData;
  }
  const json = readJsonStore();
  if (json.faqs && Array.isArray(json.faqs) && json.faqs.length > 0) {
    return json.faqs;
  }
  return BRANDWISE_FAQS as FaqItem[];
}

export async function saveFAQStore(faq: Partial<FaqItem>): Promise<FaqItem> {
  const id = faq.id || `faq-${Date.now()}`;
  const full: FaqItem = {
    id,
    category: faq.category || "General",
    question: faq.question || "",
    answer: faq.answer || "",
    brand: faq.brand,
    sequenceNumber: faq.sequenceNumber || 1,
  };

  let current = await getAllFAQsStore();
  const idx = current.findIndex((f: any) => f.id === id);
  if (idx >= 0) current[idx] = full;
  else current.unshift(full);

  await syncToFirebaseCloudStore("faqs", current);
  const json = readJsonStore();
  json.faqs = current;
  globalThis.__AAREN_MEMORY_STORE__ = json;
  return full;
}

export async function deleteFAQStore(id: string): Promise<void> {
  let current = await getAllFAQsStore();
  current = current.filter((f: any) => f.id !== id);
  await syncToFirebaseCloudStore("faqs", current);
  const json = readJsonStore();
  json.faqs = current;
  globalThis.__AAREN_MEMORY_STORE__ = json;
}

export async function importFAQsBulkStore(faqs: FaqItem[]): Promise<FaqItem[]> {
  await syncToFirebaseCloudStore("faqs", faqs);
  const json = readJsonStore();
  json.faqs = faqs;
  globalThis.__AAREN_MEMORY_STORE__ = json;
  return faqs;
}

// SERVICES STORE
export async function getServicesStore(): Promise<ServiceItem[]> {
  // 1. Firebase Cloud
  const fbData = await fetchFromFirebaseCloudStore("services");
  if (fbData && Array.isArray(fbData)) return fbData;
  // 2. JSON fallback
  const json = readJsonStore();
  if (json.services && Array.isArray(json.services) && json.services.length > 0) return json.services;
  return [
    { id: "srv-1", title: "Material Curation & Sourcing", description: "Exclusive European surfaces, FENIX nano-laminates, and natural wood cladding.", icon: "💎", sequenceNumber: 1 },
    { id: "srv-2", title: "Architectural Specification & Detailing", description: "Bespoke CAD drawings, technical joinery, and material sample kits.", icon: "📐", sequenceNumber: 2 },
    { id: "srv-3", title: "Italian Modular Living Systems", description: "Precision engineered Slashform kitchen and wardrobe systems.", icon: "🏛️", sequenceNumber: 3 },
  ];
}

export async function saveServiceStore(service: Omit<ServiceItem, "id"> & { id?: string }): Promise<ServiceItem> {
  const id = service.id || `srv-${Date.now()}`;
  const full = { ...service, id };
  let current: ServiceItem[] = [];
  const fbData = await fetchFromFirebaseCloudStore("services");
  if (fbData && Array.isArray(fbData)) current = fbData;
  else { const j = readJsonStore(); current = j.services || []; }
  const idx = current.findIndex((s: any) => s.id === id);
  if (idx >= 0) current[idx] = full; else current.push(full);
  await syncToFirebaseCloudStore("services", current);
  const json = readJsonStore(); json.services = current; globalThis.__AAREN_MEMORY_STORE__ = json;
  try { await prisma.service.upsert({ where: { id }, update: service, create: { id, ...service } }); } catch (e) {}
  return full;
}

export async function deleteServiceStore(id: string) {
  let current: ServiceItem[] = [];
  const fbData = await fetchFromFirebaseCloudStore("services");
  if (fbData && Array.isArray(fbData)) current = fbData;
  else { const j = readJsonStore(); current = j.services || []; }
  current = current.filter((s: any) => s.id !== id);
  await syncToFirebaseCloudStore("services", current);
  const json = readJsonStore(); json.services = current; globalThis.__AAREN_MEMORY_STORE__ = json;
  try { await prisma.service.delete({ where: { id } }); } catch (e) {}
}

export async function getTestimonialsStore(): Promise<TestimonialItem[]> {
  // 1. Firebase Cloud
  const fbData = await fetchFromFirebaseCloudStore("testimonials");
  if (fbData && Array.isArray(fbData)) return fbData;
  // 2. Prisma fallback
  try {
    const dbT = await prisma.testimonial.findMany({ orderBy: { sequenceNumber: "asc" } });
    if (dbT && dbT.length > 0) {
      const mapped: TestimonialItem[] = dbT.map((t: any) => ({ id: t.id, clientName: t.clientName, company: t.company || "", rating: t.rating || 5, review: t.review || "", sequenceNumber: t.sequenceNumber || 1 }));
      syncToFirebaseCloudStore("testimonials", mapped);
      return mapped;
    }
  } catch (e) {}
  // 3. JSON fallback
  const json = readJsonStore();
  if (json.testimonials && Array.isArray(json.testimonials) && json.testimonials.length > 0) return json.testimonials;
  return [
    { id: "t-1", clientName: "Vikramaditya Rao", company: "Oberoi Penthouse Owner", rating: 5, review: "Aaren Studio transformed our penthouse with incredible FENIX surfaces and Mafi oak floors.", sequenceNumber: 1 },
    { id: "t-2", clientName: "Ananya Deshmukh", company: "Principal Architect, Studio AD", rating: 5, review: "The material sample kits and Italian joinery precision from Aaren are unmatched in India.", sequenceNumber: 2 },
  ];
}

export async function saveTestimonialStore(testimonial: Omit<TestimonialItem, "id"> & { id?: string }): Promise<TestimonialItem> {
  const id = testimonial.id || `t-${Date.now()}`;
  const full = { ...testimonial, id };
  let current: TestimonialItem[] = [];
  const fbData = await fetchFromFirebaseCloudStore("testimonials");
  if (fbData && Array.isArray(fbData)) current = fbData;
  else { const j = readJsonStore(); current = j.testimonials || []; }
  const idx = current.findIndex((t: any) => t.id === id);
  if (idx >= 0) current[idx] = full; else current.push(full);
  await syncToFirebaseCloudStore("testimonials", current);
  const json = readJsonStore(); json.testimonials = current; globalThis.__AAREN_MEMORY_STORE__ = json;
  try { await prisma.testimonial.upsert({ where: { id }, update: testimonial, create: { id, ...testimonial } }); } catch (e) {}
  return full;
}

export async function deleteTestimonialStore(id: string) {
  let current: TestimonialItem[] = [];
  const fbData = await fetchFromFirebaseCloudStore("testimonials");
  if (fbData && Array.isArray(fbData)) current = fbData;
  else { const j = readJsonStore(); current = j.testimonials || []; }
  current = current.filter((t: any) => t.id !== id);
  await syncToFirebaseCloudStore("testimonials", current);
  const json = readJsonStore(); json.testimonials = current; globalThis.__AAREN_MEMORY_STORE__ = json;
  try { await prisma.testimonial.delete({ where: { id } }); } catch (e) {}
}




export async function getBlogsStore(): Promise<BlogItem[]> {
  // 1. Firebase Cloud
  const fbData = await fetchFromFirebaseCloudStore("blogs");
  if (fbData && Array.isArray(fbData)) return fbData;
  // 2. Prisma fallback
  try {
    const dbBlogs = await prisma.blog.findMany({ orderBy: { publishDate: "desc" } });
    if (dbBlogs && dbBlogs.length > 0) {
      const mapped: BlogItem[] = dbBlogs.map((b: any) => ({ id: b.id, title: b.title, slug: b.slug, category: b.category || "", tags: b.tags || [], content: b.content || "", featuredImage: b.featuredImage || "", author: b.author || "Aaren Studio", publishDate: b.publishDate || "", status: b.status || "Draft" }));
      syncToFirebaseCloudStore("blogs", mapped);
      return mapped;
    }
  } catch (e) {}
  // 3. JSON fallback
  const json = readJsonStore();
  if (json.blogs && Array.isArray(json.blogs) && json.blogs.length > 0) return json.blogs;
  return [{ id: "b-1", title: "The Evolution of FENIX Nano-Tech Surfaces in Indian Homes", slug: "fenix-surfaces-guide", category: "Surfaces", tags: ["FENIX", "Laminate", "Interior Design"], content: "FENIX nano-technology represents a breakthrough in thermal healing and ultra-matte surface aesthetics...", featuredImage: "/brands/brand_4_1.png", author: "Aaren Studio", publishDate: "2026-02-15", status: "Published" }];
}

export async function saveBlogStore(blog: Omit<BlogItem, "id"> & { id?: string }): Promise<BlogItem> {
  const id = blog.id || `blog-${Date.now()}`;
  const slug = blog.slug || blog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const full = { ...blog, id, slug };
  let current: BlogItem[] = [];
  const fbData = await fetchFromFirebaseCloudStore("blogs");
  if (fbData && Array.isArray(fbData)) current = fbData;
  else { const j = readJsonStore(); current = j.blogs || []; }
  const idx = current.findIndex((b: any) => b.id === id);
  if (idx >= 0) current[idx] = full; else current.unshift(full);
  await syncToFirebaseCloudStore("blogs", current);
  const json = readJsonStore(); json.blogs = current; globalThis.__AAREN_MEMORY_STORE__ = json;
  try { await prisma.blog.upsert({ where: { id }, update: full, create: full }); } catch (e) {}
  return full;
}

export async function deleteBlogStore(id: string) {
  let current: BlogItem[] = [];
  const fbData = await fetchFromFirebaseCloudStore("blogs");
  if (fbData && Array.isArray(fbData)) current = fbData;
  else { const j = readJsonStore(); current = j.blogs || []; }
  current = current.filter((b: any) => b.id !== id);
  await syncToFirebaseCloudStore("blogs", current);
  const json = readJsonStore(); json.blogs = current; globalThis.__AAREN_MEMORY_STORE__ = json;
  try { await prisma.blog.delete({ where: { id } }); } catch (e) {}
}

export async function reorderBlogsStore(blogsList: BlogItem[]): Promise<BlogItem[]> {
  const indexed = blogsList.map((b, idx) => ({ ...b, sequenceNumber: idx + 1 }));
  await syncToFirebaseCloudStore("blogs", indexed);
  const json = readJsonStore();
  json.blogs = indexed;
  globalThis.__AAREN_MEMORY_STORE__ = json;
  return indexed;
}

// MEDIA LIBRARY STORE (AGGREGATES ALL PDFS, VIDEOS, SWATCHES, LOGOS & SITE ASSETS)
export async function getMediaStore(): Promise<MediaAsset[]> {
  const json = readJsonStore();
  const manualMedia: MediaAsset[] = json.media || [];

  let dbMedia: MediaAsset[] = [];
  try {
    const db = await prisma.mediaItem.findMany({ orderBy: { createdAt: "desc" } });
    if (db && db.length > 0) dbMedia = db as any;
  } catch (e) {}

  const assets: MediaAsset[] = [];
  const addedUrls = new Set<string>();

  function addAsset(fileName: string, url: string, fileType: string, folder: string, size?: string) {
    if (!url || addedUrls.has(url)) return;
    addedUrls.add(url);
    assets.push({
      id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      fileName,
      fileUrl: url,
      fileType: fileType as any,
      folder,
      size: size || "Cloud Asset",
      createdAt: new Date().toISOString(),
    });
  }

  // 1. Manual & DB Media Items
  manualMedia.forEach((m) => addAsset(m.fileName, m.fileUrl, m.fileType, m.folder, m.size));
  dbMedia.forEach((m) => addAsset(m.fileName, m.fileUrl, m.fileType, m.folder, m.size));

  // 2. All Brand Catalog PDFs & Logos/Banners
  (json.brands || DEFAULT_BRANDS || []).forEach((b: any) => {
    if (b.catalogPdfUrl) addAsset(`${b.name} Catalog PDF`, b.catalogPdfUrl, "PDF", "Brand Catalogs");
    if (b.catalogues) {
      b.catalogues.forEach((c: any) => addAsset(c.title || `${b.name} Catalog PDF`, c.url || c.file, "PDF", "Brand Catalogs"));
    }
    if (b.logoUrl) addAsset(`${b.name} Logo`, b.logoUrl, "Image", "Logos & Banners");
    if (b.bannerUrl) addAsset(`${b.name} Banner Photo`, b.bannerUrl, "Image", "Logos & Banners");
  });

  // 3. Products
  (json.products || DEFAULT_PRODUCTS || []).forEach((p: any) => {
    if (p.catalogPdfUrl) addAsset(`${p.name} Catalog PDF`, p.catalogPdfUrl, "PDF", "Product Catalogs");
    if (p.imageUrl) addAsset(`${p.name} Main Photo`, p.imageUrl, "Image", "Products");
    if (p.galleryImages) p.galleryImages.forEach((g: string, idx: number) => addAsset(`${p.name} Photo ${idx + 1}`, g, "Image", "Products"));
  });

  // 4. Hero Videos & Settings
  const settings = json.settings || DEFAULT_SETTINGS;
  if (settings.heroVideoUrl) {
    addAsset("Hero Video Banner (MP4)", settings.heroVideoUrl, "Video", "Hero & Videos");
  }

  // 5. Showcase Projects
  (json.projects || DEFAULT_PROJECTS || []).forEach((pr: any) => {
    if (pr.imageUrl) addAsset(`${pr.title} Cover Photo`, pr.imageUrl, "Image", "Projects");
    if (pr.pdfUrl) addAsset(`${pr.title} Specification PDF`, pr.pdfUrl, "PDF", "Projects");
  });

  // 6. Categories
  (json.categories || DEFAULT_CATEGORIES || []).forEach((c: any) => {
    if (c.coverImage) addAsset(`${c.name} Category Cover`, c.coverImage, "Image", "Categories");
  });

  // 7. Team
  (json.team || DEFAULT_TEAM || []).forEach((t: any) => {
    if (t.photoUrl) addAsset(`${t.name} Member Profile Photo`, t.photoUrl, "Image", "Team");
  });

  // 8. Architectural PDF Catalogs & Thumbnails
  (json.pdfCatalogs || []).forEach((pc: any) => {
    if (pc.fileUrl) addAsset(`${pc.title || pc.fileName} (Official Catalogue)`, pc.fileUrl, "PDF", "PDF Catalogues", pc.fileSize);
    if (pc.thumbnailUrl) addAsset(`${pc.title || pc.fileName} Cover Preview`, pc.thumbnailUrl, "Image", "Catalog Thumbnails");
  });

  // 9. Read Fallback Catalogs from data/catalogs.json if not present
  try {
    const catalogsPath = path.join(process.cwd(), "data", "catalogs.json");
    if (fs.existsSync(catalogsPath)) {
      const catalogsData = JSON.parse(fs.readFileSync(catalogsPath, "utf-8"));
      if (Array.isArray(catalogsData)) {
        catalogsData.forEach((pc: any) => {
          if (pc.fileUrl) addAsset(`${pc.title || pc.fileName} (Official Catalogue)`, pc.fileUrl.replace(/\\/g, "/"), "PDF", "PDF Catalogues", pc.fileSize);
          if (pc.thumbnailUrl) addAsset(`${pc.title || pc.fileName} Cover Preview`, pc.thumbnailUrl.replace(/\\/g, "/"), "Image", "Catalog Thumbnails");
        });
      }
    }
  } catch (e) {}

  return assets;
}

export async function saveMediaStore(media: Omit<MediaAsset, "id"> & { id?: string }): Promise<MediaAsset> {
  const id = media.id || `med-${Date.now()}`;
  const full = { ...media, id, createdAt: new Date().toISOString() };
  try {
    await prisma.mediaItem.upsert({
      where: { id },
      update: full,
      create: full,
    });
  } catch (e) {}
  const json = readJsonStore();
  if (!json.media) json.media = [];
  json.media.unshift(full);
  writeJsonStore(json);
  await syncToFirebaseCloudStore("media", json.media);
  return full;
}

export async function deleteMediaStore(id: string) {
  try {
    await prisma.mediaItem.delete({ where: { id } });
  } catch (e) {}
  const json = readJsonStore();
  if (json.media) json.media = json.media.filter((m: any) => m.id !== id);
  writeJsonStore(json);
  await syncToFirebaseCloudStore("media", json.media || []);
}

// TAXONOMIES & DROPDOWNS STORE
export async function getTaxonomiesStore(): Promise<TaxonomyItem[]> {
  const fbData = await fetchFromFirebaseCloudStore("taxonomies");
  if (fbData && Array.isArray(fbData)) return fbData;

  try {
    const db = await prisma.taxonomy.findMany({ orderBy: { sequenceNumber: "asc" } });
    if (db && db.length > 0) return db as any;
  } catch (e) {}
  const json = readJsonStore();
  return json.taxonomies || [
    { id: "tax-1", type: "Category", name: "Surfaces", code: "SRF", sequenceNumber: 1 },
    { id: "tax-2", type: "Technology", name: "FENIX Nano-Tech", code: "FNT", sequenceNumber: 1 },
    { id: "tax-3", type: "ProjectType", name: "Penthouse Residence", code: "PR", sequenceNumber: 1 },
  ];
}

export async function saveTaxonomyStore(taxonomy: Omit<TaxonomyItem, "id"> & { id?: string }): Promise<TaxonomyItem> {
  const id = taxonomy.id || `tax-${Date.now()}`;
  const full = { ...taxonomy, id };
  let current: TaxonomyItem[] = [];
  const fbData = await fetchFromFirebaseCloudStore("taxonomies");
  if (fbData && Array.isArray(fbData)) current = fbData;
  else { const j = readJsonStore(); current = j.taxonomies || []; }

  const idx = current.findIndex((t: any) => t.id === id);
  if (idx >= 0) current[idx] = full;
  else current.push(full);

  await syncToFirebaseCloudStore("taxonomies", current);
  const json = readJsonStore(); json.taxonomies = current; globalThis.__AAREN_MEMORY_STORE__ = json;
  try { await prisma.taxonomy.upsert({ where: { id }, update: full, create: full }); } catch (e) {}
  return full;
}

export async function deleteTaxonomyStore(id: string) {
  let current: TaxonomyItem[] = [];
  const fbData = await fetchFromFirebaseCloudStore("taxonomies");
  if (fbData && Array.isArray(fbData)) current = fbData;
  else { const j = readJsonStore(); current = j.taxonomies || []; }
  current = current.filter((t: any) => t.id !== id);
  await syncToFirebaseCloudStore("taxonomies", current);
  const json = readJsonStore(); json.taxonomies = current; globalThis.__AAREN_MEMORY_STORE__ = json;
  try { await prisma.taxonomy.delete({ where: { id } }); } catch (e) {}
}

// DYNAMIC PAGE BUILDER STORE
export async function getPagesStore(): Promise<CustomPageItem[]> {
  const fbData = await fetchFromFirebaseCloudStore("pages");
  if (fbData && Array.isArray(fbData)) return fbData;
  const json = readJsonStore();
  return json.pages || [
    {
      id: "page-home",
      title: "Homepage",
      slug: "home",
      status: "Published",
      seoTitle: "AAREN Studio | Luxury Architectural Surfaces",
      seoDescription: "Aaren Studio curates European surfaces, FENIX laminates, Mafi wood flooring, and Falper vanities.",
      sections: [
        { id: "sec-1", type: "Hero", title: "Main Hero Video Banner", isVisible: true, order: 1 },
        { id: "sec-2", type: "Services", title: "Material Curation & Services", isVisible: true, order: 2 },
        { id: "sec-3", type: "Portfolio", title: "Showcase Projects", isVisible: true, order: 3 },
        { id: "sec-4", type: "Testimonials", title: "Client Feedback", isVisible: true, order: 4 },
      ],
    },
  ];
}

export async function savePageStore(page: Omit<CustomPageItem, "id"> & { id?: string }): Promise<CustomPageItem> {
  const id = page.id || `pg-${Date.now()}`;
  const slug = page.slug || page.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const full = { ...page, id, slug, createdAt: new Date().toISOString() };

  let current: CustomPageItem[] = [];
  const fbData = await fetchFromFirebaseCloudStore("pages");
  if (fbData && Array.isArray(fbData)) current = fbData;
  else { const j = readJsonStore(); current = j.pages || []; }

  const idx = current.findIndex((p: any) => p.id === id);
  if (idx >= 0) current[idx] = full;
  else current.push(full);

  await syncToFirebaseCloudStore("pages", current);
  const json = readJsonStore(); json.pages = current; globalThis.__AAREN_MEMORY_STORE__ = json;
  return full;
}

export async function deletePageStore(id: string) {
  let current: CustomPageItem[] = [];
  const fbData = await fetchFromFirebaseCloudStore("pages");
  if (fbData && Array.isArray(fbData)) current = fbData;
  else { const j = readJsonStore(); current = j.pages || []; }
  current = current.filter((p: any) => p.id !== id);
  await syncToFirebaseCloudStore("pages", current);
  const json = readJsonStore(); json.pages = current; globalThis.__AAREN_MEMORY_STORE__ = json;
}

// PDF CATALOGS STORE
export async function getCatalogsStore(): Promise<PdfCatalogItem[]> {
  const fbData = await fetchFromFirebaseCloudStore("pdfCatalogs");
  if (fbData && Array.isArray(fbData)) return fbData;
  const json = readJsonStore();
  if (json.pdfCatalogs && Array.isArray(json.pdfCatalogs) && json.pdfCatalogs.length > 0) {
    return json.pdfCatalogs;
  }

  // Fallback read from data/catalogs.json if available
  const catalogsPath = path.join(process.cwd(), "data", "catalogs.json");
  try {
    if (fs.existsSync(catalogsPath)) {
      const data = JSON.parse(fs.readFileSync(catalogsPath, "utf-8"));
      json.pdfCatalogs = data;
      syncToFirebaseCloudStore("pdfCatalogs", data);
      return data;
    }
  } catch (e) {}

  return [];
}

export async function saveCatalogStore(catalog: PdfCatalogItem): Promise<PdfCatalogItem> {
  let current: PdfCatalogItem[] = [];
  const fbData = await fetchFromFirebaseCloudStore("pdfCatalogs");
  if (fbData && Array.isArray(fbData)) current = fbData;
  else { const j = readJsonStore(); current = j.pdfCatalogs || []; }

  const idx = current.findIndex((c: any) => c.id === catalog.id);
  if (idx >= 0) current[idx] = catalog;
  else current.push(catalog);

  await syncToFirebaseCloudStore("pdfCatalogs", current);
  const json = readJsonStore(); json.pdfCatalogs = current; globalThis.__AAREN_MEMORY_STORE__ = json;
  return catalog;
}

export async function incrementCatalogDownloadCount(id: string): Promise<number> {
  let current: PdfCatalogItem[] = [];
  const fbData = await fetchFromFirebaseCloudStore("pdfCatalogs");
  if (fbData && Array.isArray(fbData)) current = fbData;
  else { const j = readJsonStore(); current = j.pdfCatalogs || []; }

  let count = 1;
  const idx = current.findIndex((c: any) => c.id === id);
  if (idx >= 0) {
    current[idx].downloadCount = (current[idx].downloadCount || 0) + 1;
    count = current[idx].downloadCount;
    await syncToFirebaseCloudStore("pdfCatalogs", current);
  }
  const json = readJsonStore(); json.pdfCatalogs = current; globalThis.__AAREN_MEMORY_STORE__ = json;
  return count;
}

// BLOG SETTINGS STORE
export async function getBlogSettingsStore(): Promise<any> {
  const fbData = await fetchFromFirebaseCloudStore("blogSettings");
  if (fbData && typeof fbData === "object" && !Array.isArray(fbData)) return fbData;
  const json = readJsonStore();
  if (json.blogSettings) return json.blogSettings;
  return {
    articleTitleSize: "1.75rem",
    articleBodySize: "0.95rem",
    cardTitleSize: "1.1rem",
    cardBodySize: "0.85rem",
    articleImageHeight: "320px",
    cardImageHeight: "200px",
  };
}

export async function saveBlogSettingsStore(settings: any): Promise<any> {
  await syncToFirebaseCloudStore("blogSettings", settings);
  const json = readJsonStore();
  json.blogSettings = settings;
  globalThis.__AAREN_MEMORY_STORE__ = json;
  return settings;
}

// ─── BRAND-SCOPED COLLECTIONS STORE ──────────────────────────

export const DEFAULT_COLLECTIONS: CollectionItem[] = [
  { id: "kitchen", name: "Kitchen", brandId: "slashform", brandName: "Slashform", iconUrl: "", description: "Modular kitchen, island units & pantries", sequenceNumber: 1 },
  { id: "wardrobe", name: "Wardrobe", brandId: "slashform", brandName: "Slashform", iconUrl: "", description: "Custom wardrobe systems & walk-in closets", sequenceNumber: 2 },
  { id: "door-systems", name: "Door Systems", brandId: "slashform", brandName: "Slashform", iconUrl: "", description: "Architectural sliding & partition doors", sequenceNumber: 3 },
  { id: "retractable-screens", name: "Retractable Screens", brandId: "freedom-screens", brandName: "Freedom Screens", iconUrl: "", description: "Infinity zipline retractable insect screens", sequenceNumber: 1 },
  { id: "sliding-screens", name: "Sliding Screens", brandId: "freedom-screens", brandName: "Freedom Screens", iconUrl: "", description: "Smooth glide screen panels for large spans", sequenceNumber: 2 },
  { id: "motorized-drop", name: "Motorized Screens", brandId: "freedom-screens", brandName: "Freedom Screens", iconUrl: "", description: "Automated patio & balcony drop screens", sequenceNumber: 3 },
  { id: "washbasins", name: "Washbasins", brandId: "falper", brandName: "Falper", iconUrl: "", description: "LivingTec & marble countertop basins", sequenceNumber: 1 },
  { id: "bathtubs", name: "Bathtubs", brandId: "falper", brandName: "Falper", iconUrl: "", description: "Freestanding Italian luxury bathtubs", sequenceNumber: 2 },
  { id: "bathroom-furniture", name: "Bathroom Furniture", brandId: "falper", brandName: "Falper", iconUrl: "", description: "Minimalist vanity cabinets & mirrors", sequenceNumber: 3 },
  { id: "faucets-taps", name: "Faucets & Taps", brandId: "fima", brandName: "FIMA Carlo Frattini", iconUrl: "", description: "Italian designer basin mixers and taps", sequenceNumber: 1 },
  { id: "shower-systems", name: "Shower Systems", brandId: "fima", brandName: "FIMA Carlo Frattini", iconUrl: "", description: "Thermostatic rainfall ceiling showers", sequenceNumber: 2 },
  { id: "composite-decking", name: "Composite Decking", brandId: "newtech-wood", brandName: "NewTechWood", iconUrl: "", description: "UltraShield natural timber texture decking", sequenceNumber: 1 },
  { id: "wall-cladding", name: "Wall Cladding", brandId: "newtech-wood", brandName: "NewTechWood", iconUrl: "", description: "Exterior facade and fluted siding panels", sequenceNumber: 2 },
  { id: "natural-timber", name: "Natural Oak Flooring", brandId: "mafi", brandName: "Mafi", iconUrl: "", description: "All-natural Austrian hardwood planks", sequenceNumber: 1 },
  { id: "architectural-hardware", name: "Concealed Hinges & Hardware", brandId: "waltz", brandName: "Waltz", iconUrl: "", description: "Precision engineering architectural hardware", sequenceNumber: 1 },
  { id: "highlighter-tiles", name: "Highlighter Tiles", brandId: "wow", brandName: "WOW", iconUrl: "", description: "Handcrafted & 3D accent wall tiles", sequenceNumber: 1 },
  { id: "pool-area-tiles", name: "Pool Area Tiles", brandId: "wow", brandName: "WOW", iconUrl: "", description: "Anti-slip luxury porcelain & ceramic surfaces", sequenceNumber: 2 },
  { id: "terracotta-jali-tiles", name: "Terracotta Jali Tiles", brandId: "wow", brandName: "WOW", iconUrl: "", description: "Architectural clay screen & jali blocks", sequenceNumber: 3 },
  { id: "ceramic-surfaces", name: "3D Feature Surfaces", brandId: "wow", brandName: "WOW", iconUrl: "", description: "Geometric decorative wall tiles", sequenceNumber: 4 },
];

export async function getAllCollectionsStore(brandId?: string): Promise<CollectionItem[]> {
  const fbData = await fetchFromFirebaseCloudStore("collections");
  let list: CollectionItem[] = [];
  if (fbData && Array.isArray(fbData) && fbData.length > 0) {
    list = fbData;
  } else {
    const json = readJsonStore();
    if (json.collections && Array.isArray(json.collections) && json.collections.length > 0) {
      list = json.collections;
    } else {
      list = DEFAULT_COLLECTIONS;
    }
  }

  if (brandId && brandId !== "all") {
    const norm = (s: string) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const target = norm(brandId);
    return list.filter((c) => norm(c.brandId) === target || norm(c.brandName || "") === target || target.includes(norm(c.brandId)));
  }
  return list;
}

export async function getCollectionByIdStore(id: string): Promise<CollectionItem | null> {
  const list = await getAllCollectionsStore();
  return list.find((c) => c.id === id) || null;
}

export async function saveCollectionStore(item: Partial<CollectionItem>): Promise<CollectionItem> {
  const slug = item.id || (item.name ? item.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : `collection-${Date.now()}`);
  const full: CollectionItem = {
    id: slug,
    name: item.name || "Untitled Collection",
    brandId: item.brandId || "general",
    brandName: item.brandName || "",
    iconUrl: item.iconUrl || "",
    description: item.description || "",
    sequenceNumber: item.sequenceNumber || 1,
    featured: !!item.featured,
  };

  let list = await getAllCollectionsStore();
  const idx = list.findIndex((c) => c.id === slug);
  if (idx >= 0) {
    list[idx] = full;
  } else {
    list.push(full);
  }

  await syncToFirebaseCloudStore("collections", list);
  const json = readJsonStore();
  json.collections = list;
  writeJsonStore(json);
  globalThis.__AAREN_MEMORY_STORE__ = json;
  return full;
}

export async function deleteCollectionStore(id: string): Promise<void> {
  let list = await getAllCollectionsStore();
  list = list.filter((c) => c.id !== id);
  await syncToFirebaseCloudStore("collections", list);
  const json = readJsonStore();
  json.collections = list;
  writeJsonStore(json);
  globalThis.__AAREN_MEMORY_STORE__ = json;
}

export const DEFAULT_WORKSPACE_PROJECTS: any[] = [
  {
    id: "proj-ws-01",
    title: "Oberoi Presidential Penthouse & Suite",
    slug: "oberoi-presidential-penthouse",
    description: "Spatial overhaul featuring custom Italian marble cladding, bespoke veneer panelling, and integrated indirect lighting.",
    category: "Hospitality Architecture",
    client: "Midas Touch Architecture & Interiors",
    clientId: "client-midas",
    projectCode: "OB 01",
    imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    gallery: ["/brands/brand_1_1.png", "/brands/brand_2_1.png"],
    status: "IN_PROGRESS",
    budget: 6500000,
    createdAt: "2026-08-20T10:00:00.000Z",
    scheduleItems: [
      {
        id: "item-01",
        projectId: "proj-ws-01",
        name: "Mirage Italian Calacatta Marble Slabs (120x240cm)",
        room: "Master Bathroom",
        category: "Surface Tiles",
        supplier: "Mirage Italy",
        tradePrice: 1200000,
        clientPrice: 1450000,
        price: 1450000,
        status: "APPROVED",
        imageUrl: "/brands/brand_10_1.png",
        specs: "Polished Bookmatch Finish, 9mm Porcelain Slim Slab",
        dimensions: "1200mm x 2400mm x 9mm",
        quantity: 32,
        unit: "Slabs",
        approvedAt: "2026-08-20T10:00:00Z",
        approvedBy: "Lead Architect",
        comments: [
          {
            id: "com-01",
            scheduleItemId: "item-01",
            authorName: "Aaren Studio Architect",
            authorEmail: "studio@aarenstudio.com",
            authorRole: "ARCHITECT",
            content: "Samples inspected at Bangalore lab. Veining direction aligns with master elevation.",
            createdAt: "2026-08-19T14:30:00Z",
          },
        ],
      },
      {
        id: "item-02",
        projectId: "proj-ws-01",
        name: "Slashform Bespoke Acoustic Pivot Glass Door",
        room: "Grand Foyer",
        category: "Door Systems",
        supplier: "Slashform Living",
        tradePrice: 580000,
        clientPrice: 680000,
        price: 680000,
        status: "PENDING",
        imageUrl: "/brands/brand_1_1.png",
        specs: "Matte Bronze Anodized Aluminum Frame with Fluted Soundproof Glass",
        dimensions: "1500mm x 2800mm",
        quantity: 1,
        unit: "Set",
        comments: [],
      },
      {
        id: "item-03",
        projectId: "proj-ws-01",
        name: "Mafi Austrian Natural Volcano Oak Flooring",
        room: "Living Area & Library",
        category: "Wooden Flooring",
        supplier: "Mafi Austria",
        tradePrice: 950000,
        clientPrice: 1120000,
        price: 1120000,
        status: "NEEDS_REVIEW",
        imageUrl: "/brands/brand_9_1.png",
        specs: "Naturally oiled wide plank, engineered 3-layer symmetry",
        dimensions: "300mm x 2400mm x 16mm",
        quantity: 140,
        unit: "sq.m",
        comments: [
          {
            id: "com-02",
            scheduleItemId: "item-03",
            authorName: "Midas Touch (Client)",
            authorEmail: "client@midastouch.com",
            authorRole: "CLIENT",
            content: "Please provide moisture barrier specification test for the monsoon season.",
            createdAt: "2026-08-22T09:15:00Z",
          },
        ],
      },
      {
        id: "item-04",
        projectId: "proj-ws-01",
        name: "FIMA Carlo Frattini Gold Thermostatic Bath Mixer Suite",
        room: "Powder Room",
        category: "Bathroom Fittings",
        supplier: "FIMA Carlo Frattini",
        tradePrice: 350000,
        clientPrice: 430000,
        price: 430000,
        status: "APPROVED",
        imageUrl: "/brands/brand_7_1.png",
        specs: "Brushed Pale Gold PVD Finish, Concealed Body included",
        dimensions: "Standard Wall Mounted",
        quantity: 3,
        unit: "Sets",
        approvedAt: "2026-08-21T16:00:00Z",
        approvedBy: "Client Sign-off",
        comments: [],
      },
    ],
    documents: [
      {
        id: "doc-01",
        projectId: "proj-ws-01",
        name: "Oberoi-Penthouse-Elevations-RevC.pdf",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        fileType: "Architectural Drawing (PDF)",
        fileSize: 4200000,
        uploadedBy: "Aaren Lead CAD Team",
        createdAt: "2026-08-20T12:00:00Z",
      },
      {
        id: "doc-02",
        projectId: "proj-ws-01",
        name: "Foyer-Slashform-Pivot-Detail.dwg",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        fileType: "Shop Drawing (DWG)",
        fileSize: 8500000,
        uploadedBy: "Slashform Technical Desk",
        createdAt: "2026-08-18T10:00:00Z",
      },
      {
        id: "doc-03",
        projectId: "proj-ws-01",
        name: "Master-Specification-Schedule-v4.xlsx",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        fileType: "BOQ / Material Spec (Excel)",
        fileSize: 1200000,
        uploadedBy: "Project PM",
        createdAt: "2026-08-22T15:00:00Z",
      },
    ],
    invoices: [
      {
        id: "inv-01",
        invoiceNumber: "INV-AA-2026-001",
        projectId: "proj-ws-01",
        clientId: "client-midas",
        title: "Milestone 1: Advance Material Sourcing & Italian Reservation (40%)",
        amount: 1800000,
        currency: "INR",
        status: "PAID",
        dueDate: "2026-08-15T00:00:00Z",
        paidAt: "2026-08-14T11:00:00Z",
        createdAt: "2026-08-01T00:00:00Z",
      },
      {
        id: "inv-02",
        invoiceNumber: "INV-AA-2026-002",
        projectId: "proj-ws-01",
        clientId: "client-midas",
        title: "Milestone 2: Custom Millwork Fabrication & Dispatch Sign-off (30%)",
        amount: 1350000,
        currency: "INR",
        status: "UNPAID",
        dueDate: "2026-09-01T00:00:00Z",
        stripePaymentLink: "https://checkout.stripe.com/demo",
        createdAt: "2026-08-20T00:00:00Z",
      },
    ],
  },
  {
    id: "proj-ws-02",
    title: "Ratan Corporate Headquarters — BKC",
    slug: "ratan-corporate-hq",
    description: "Multi-floor workspace featuring acoustic wooden partitions, aluminum frame systems, and custom executive suites.",
    category: "Commercial Architecture",
    client: "Midas Touch Architecture & Interiors",
    clientId: "client-midas",
    projectCode: "RG 02",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    gallery: ["/brands/brand_3_1.png", "/brands/brand_4_1.png"],
    status: "IN_PROGRESS",
    budget: 12000000,
    createdAt: "2026-08-18T10:00:00.000Z",
    scheduleItems: [
      {
        id: "item-05",
        projectId: "proj-ws-02",
        name: "NewtechWood Exterior Composite Louvers",
        room: "Atrium Facade",
        category: "Decking & Cladding",
        supplier: "NewtechWood USA",
        tradePrice: 1800000,
        clientPrice: 2200000,
        price: 2200000,
        status: "APPROVED",
        imageUrl: "/brands/brand_3_1.png",
        specs: "UltraShield All-Weather Co-extrusion Technology",
        dimensions: "100mm x 50mm x 3000mm",
        quantity: 180,
        unit: "Profiles",
        approvedAt: "2026-08-15T12:00:00Z",
        approvedBy: "Lead Facade Consultant",
        comments: [],
      },
    ],
    documents: [],
    invoices: [
      {
        id: "inv-03",
        invoiceNumber: "INV-AA-2026-003",
        projectId: "proj-ws-02",
        clientId: "client-midas",
        title: "Milestone 1: Architectural Facade Retainer (50%)",
        amount: 3000000,
        currency: "INR",
        status: "PAID",
        dueDate: "2026-08-10T00:00:00Z",
        paidAt: "2026-08-09T15:00:00Z",
        createdAt: "2026-08-01T00:00:00Z",
      },
    ],
  },
];

export async function getAllWorkspaceProjectsStore(): Promise<any[]> {
  const json = readJsonStore();
  if (Array.isArray(json.workspace_projects) && json.workspace_projects.length > 0) {
    return json.workspace_projects;
  }

  // Try Firebase
  const fb = await fetchFromFirebaseCloudStore("workspace_projects");
  if (Array.isArray(fb) && fb.length > 0) {
    json.workspace_projects = fb;
    writeJsonStore(json);
    return fb;
  }

  // Default
  json.workspace_projects = DEFAULT_WORKSPACE_PROJECTS;
  writeJsonStore(json);
  syncToFirebaseCloudStore("workspace_projects", DEFAULT_WORKSPACE_PROJECTS).catch(() => {});
  return DEFAULT_WORKSPACE_PROJECTS;
}

export async function getWorkspaceProjectsByClientIdStore(clientId: string): Promise<any[]> {
  const all = await getAllWorkspaceProjectsStore();
  if (!clientId || clientId === "admin-scope" || clientId === "admin") {
    return all;
  }
  return all.filter((p: any) => p.clientId === clientId);
}

export async function getWorkspaceProjectByIdStore(projectId: string, clientId?: string): Promise<any | null> {
  const all = await getAllWorkspaceProjectsStore();
  const found = all.find((p: any) => p.id === projectId || p.slug === projectId);
  if (!found) return null;
  if (clientId && clientId !== "admin-scope" && clientId !== "admin" && found.clientId && found.clientId !== clientId) {
    return null;
  }
  return found;
}

export async function saveWorkspaceProjectStore(project: any): Promise<any> {
  const all = await getAllWorkspaceProjectsStore();
  const idx = all.findIndex((p: any) => p.id === project.id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...project };
  } else {
    all.unshift(project);
  }

  const json = readJsonStore();
  json.workspace_projects = all;
  writeJsonStore(json);
  globalThis.__AAREN_MEMORY_STORE__ = json;
  syncToFirebaseCloudStore("workspace_projects", all).catch(() => {});
  return project;
}

export async function updateWorkspaceScheduleStatusStore(
  itemId: string,
  status: string,
  comment?: string,
  authorName?: string,
  authorRole?: string
): Promise<any> {
  const all = await getAllWorkspaceProjectsStore();
  let updatedItem: any = null;

  for (const proj of all) {
    if (Array.isArray(proj.scheduleItems)) {
      const it = proj.scheduleItems.find((i: any) => i.id === itemId);
      if (it) {
        it.status = status;
        if (status === "APPROVED") {
          it.approvedAt = new Date().toISOString();
          it.approvedBy = authorName || "Client Sign-off";
        }
        if (comment) {
          if (!Array.isArray(it.comments)) it.comments = [];
          it.comments.push({
            id: "c-" + Date.now(),
            scheduleItemId: itemId,
            authorName: authorName || "You (Client)",
            authorRole: authorRole || "CLIENT",
            content: `Status updated to ${status}: ${comment.trim()}`,
            createdAt: new Date().toISOString(),
          });
        }
        updatedItem = it;
        break;
      }
    }
  }

  if (updatedItem) {
    const json = readJsonStore();
    json.workspace_projects = all;
    writeJsonStore(json);
    globalThis.__AAREN_MEMORY_STORE__ = json;
    syncToFirebaseCloudStore("workspace_projects", all).catch(() => {});
  }

  return updatedItem || { id: itemId, status };
}

export async function addWorkspaceCommentStore(
  itemId: string,
  content: string,
  authorName: string,
  authorRole: string
): Promise<any> {
  const all = await getAllWorkspaceProjectsStore();
  let newComment: any = null;

  for (const proj of all) {
    if (Array.isArray(proj.scheduleItems)) {
      const it = proj.scheduleItems.find((i: any) => i.id === itemId);
      if (it) {
        if (!Array.isArray(it.comments)) it.comments = [];
        newComment = {
          id: "com-" + Date.now(),
          scheduleItemId: itemId,
          authorName: authorName || "You (Client)",
          authorRole: authorRole || "CLIENT",
          content: content.trim(),
          createdAt: new Date().toISOString(),
        };
        it.comments.push(newComment);
        break;
      }
    }
  }

  if (newComment) {
    const json = readJsonStore();
    json.workspace_projects = all;
    writeJsonStore(json);
    globalThis.__AAREN_MEMORY_STORE__ = json;
    syncToFirebaseCloudStore("workspace_projects", all).catch(() => {});
  }

  return newComment || { id: "com-" + Date.now(), content, authorName, createdAt: new Date().toISOString() };
}

export async function addWorkspaceDocumentStore(doc: any): Promise<any> {
  const all = await getAllWorkspaceProjectsStore();
  const proj = all.find((p: any) => p.id === doc.projectId);
  if (proj) {
    if (!Array.isArray(proj.documents)) proj.documents = [];
    proj.documents.unshift(doc);
    const json = readJsonStore();
    json.workspace_projects = all;
    writeJsonStore(json);
    globalThis.__AAREN_MEMORY_STORE__ = json;
    syncToFirebaseCloudStore("workspace_projects", all).catch(() => {});
  }
  return doc;
}

export async function deleteWorkspaceDocumentStore(docId: string, projectId?: string): Promise<boolean> {
  const all = await getAllWorkspaceProjectsStore();
  let found = false;
  for (const proj of all) {
    if (projectId && proj.id !== projectId) continue;
    if (Array.isArray(proj.documents)) {
      const idx = proj.documents.findIndex((d: any) => d.id === docId);
      if (idx !== -1) {
        proj.documents.splice(idx, 1);
        found = true;
        break;
      }
    }
  }
  if (found) {
    const json = readJsonStore();
    json.workspace_projects = all;
    writeJsonStore(json);
    globalThis.__AAREN_MEMORY_STORE__ = json;
    syncToFirebaseCloudStore("workspace_projects", all).catch(() => {});
  }
  return found;
}

export async function updateWorkspaceInvoiceStatusStore(invoiceId: string, status: string): Promise<any> {
  const all = await getAllWorkspaceProjectsStore();
  let updatedInv: any = null;

  for (const proj of all) {
    if (Array.isArray(proj.invoices)) {
      const inv = proj.invoices.find((i: any) => i.id === invoiceId);
      if (inv) {
        inv.status = status;
        if (status === "PAID") inv.paidAt = new Date().toISOString();
        updatedInv = inv;
        break;
      }
    }
  }

  if (updatedInv) {
    const json = readJsonStore();
    json.workspace_projects = all;
    writeJsonStore(json);
    globalThis.__AAREN_MEMORY_STORE__ = json;
    syncToFirebaseCloudStore("workspace_projects", all).catch(() => {});
  }

  return updatedInv || { id: invoiceId, status, paidAt: new Date().toISOString() };
}




