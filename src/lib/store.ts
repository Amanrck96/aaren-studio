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
  InquiryItem,
  ServiceItem,
  TestimonialItem,
  BlogItem,
  MediaAsset,
  TaxonomyItem,
  NavItem,
  SeoItem,
  CustomPageItem,
  DEFAULT_SETTINGS,
} from "./types";

export * from "./types";

const PRIMARY_STORE_PATH = path.join(process.cwd(), "data", "master_store.json");
const TMP_STORE_PATH = path.join("/tmp", "master_store.json");

declare global {
  var __AAREN_MEMORY_STORE__: any;
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

function writeJsonStore(data: any) {
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
  { id: "slashform", name: "Slashform", logoUrl: "/brands/brand_1_2.png", bannerUrl: "/brands/brand_1_1.png", description: "Italian precision living systems for kitchen & wardrobe", shortCode: "SF 01", sequenceNumber: 1, catalogPdfUrl: "/catalogues/Slashform/Slashform_2025.pdf" },
  { id: "waltz", name: "Waltz by JB Glass", logoUrl: "/brands/brand_2_2.png", bannerUrl: "/brands/brand_2_1.png", description: "Architectural glass partitions and zipline screens", shortCode: "WB 02", sequenceNumber: 2, catalogPdfUrl: "/catalogues/Waltz/Waltz_Glass.pdf" },
  { id: "newtech-wood", name: "Newtech Wood", logoUrl: "/brands/brand_3_2.png", bannerUrl: "/brands/brand_3_1.png", description: "WPC composite outdoor decking and architectural cladding", shortCode: "NW 03", sequenceNumber: 3, catalogPdfUrl: "/catalogues/NewTechWood/NewTechWood-Product-Catalog-2025.pdf" },
  { id: "formica", name: "Formica", logoUrl: "/brands/brand_4_2.png", bannerUrl: "/brands/brand_4_1.png", description: "FENIX nano-tech surfaces and premium laminates", shortCode: "FC 04", sequenceNumber: 4, catalogPdfUrl: "/catalogues/Formica/2024-FENIX-brochure-digital.pdf" },
  { id: "loco", name: "Loco", logoUrl: "/brands/brand_5_2.png", bannerUrl: "/brands/brand_5_1.png", description: "Bespoke Italian millwork and furniture sculpture", shortCode: "LC 05", sequenceNumber: 5 },
  { id: "falper", name: "Falper", logoUrl: "/brands/brand_6_2.png", bannerUrl: "/brands/brand_6_1.png", description: "Luxury bath environments, vanities and freestanding tubs", shortCode: "FP 06", sequenceNumber: 6 },
  { id: "fima", name: "Fima Carlo Frattini", logoUrl: "/brands/brand_7_2.png", bannerUrl: "/brands/brand_7_1.png", description: "Refined Italian tapware and thermostatic shower systems", shortCode: "FM 07", sequenceNumber: 7 },
  { id: "inkiostro-bianco", name: "Inkiostro Bianco", logoUrl: "/brands/brand_8_2.png", bannerUrl: "/brands/brand_8_1.png", description: "Creative decorative wallcoverings and printed surfaces", shortCode: "IB 08", sequenceNumber: 8, catalogPdfUrl: "/catalogues/Inkiastro Bianco/CATALOGO_MATERIAPRIMA_2026_2a.pdf" },
  { id: "mafi", name: "Mafi", logoUrl: "/brands/brand_9_2.png", bannerUrl: "/brands/brand_9_1.png", description: "Austrian natural wood flooring with hand-rubbed oil finish", shortCode: "MF 09", sequenceNumber: 9 },
  { id: "mirage", name: "Mirage", logoUrl: "/brands/brand_10_2.png", bannerUrl: "/brands/brand_10_1.png", description: "Italian porcelain tile mastery and marble slabs", shortCode: "MG 10", sequenceNumber: 10, catalogPdfUrl: "/catalogues/Mirage/catalogue-elysian-pdf.pdf" },
];

export const DEFAULT_PROJECTS: ProjectShowcaseItem[] = [
  { id: "proj-01", title: "ONE BANGALORE WEST PENTHOUSE", slug: "one-bangalore-west", description: "Luxury pent-house featuring FENIX surfaces, Falper vanities and Mafi natural oak flooring.", category: "Residential", client: "Private Owner", projectCode: "OB 01", sequenceNumber: 1, imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80" },
  { id: "proj-02", title: "THE JAYAMAHAL VILLA", slug: "jayamahal-villa", description: "Contemporary villa wrapped in Newtech Wood architectural composite cladding.", category: "Architecture", client: "Jayamahal Estates", projectCode: "TJ 02", sequenceNumber: 2, imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80" },
  { id: "proj-03", title: "REPUBLIC GARDENS CLUBHOUSE", slug: "republic-gardens", description: "Commercial clubhouse with Mirage porcelain slabs and Slashform kitchen systems.", category: "Hospitality", client: "Republic Developers", projectCode: "RG 03", sequenceNumber: 3, imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80" },
  { id: "proj-04", title: "GREEN PARK VILLA", slug: "green-park-villa", description: "Modern residence with Waltz glass partitions and Madheke custom furniture.", category: "Residential", client: "Green Park Ltd", projectCode: "GP 04", sequenceNumber: 4, imageUrl: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80" },
];

export const DEFAULT_PRODUCTS: ProductItem[] = [
  {
    id: "prod-queen-sofa",
    slNo: 1,
    name: "Queen Sofa System",
    brand: "Madheke",
    category: "Furniture",
    subcategory: "Sofas",
    shortCode: "FF 01",
    width: "2800mm",
    height: "750mm",
    depth: "1050mm",
    measurementType: "mm",
    finish: "Bouclé Fabric & Solid Walnut",
    description: "The Queen sofa embodies the harmony of proportion and comfort. More stance in fabric with subtle curves, it invites conversation and repose.",
    tags: ["Living", "Sofa", "Madheke"],
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80"
    ],
    catalogPdfUrl: "/catalogues/Formica/2024-FENIX-brochure-digital.pdf",
    qtyInStock: 2,
    price: 480000,
    finishOptions: [
      { name: "Cream Bouclé", hex: "#F3EFE6" },
      { name: "Palma Teal Leather", hex: "#2B4C59" },
      { name: "Tobacco Leather", hex: "#6F4E37" }
    ]
  },
  {
    id: "prod-senzafine",
    slNo: 2,
    name: "Falper Senzafine Vanity",
    brand: "Falper",
    category: "Bathroom Fittings",
    subcategory: "Vanities",
    shortCode: "BF 01",
    width: "1200mm",
    height: "850mm",
    depth: "500mm",
    measurementType: "mm",
    finish: "Matte White Lacquer",
    description: "Architectural Italian double vanity unit with integrated washbasin and soft-close drawers.",
    tags: ["Luxury", "Bathroom", "Falper"],
    imageUrl: "/brands/brand_6_1.png",
    galleryImages: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80"
    ],
    catalogPdfUrl: "/catalogues/Formica/2024-FENIX-brochure-digital.pdf",
    qtyInStock: 5,
    price: 345000
  },
  {
    id: "prod-antique-decking",
    slNo: 3,
    name: "Antique Outdoor Pool Decking",
    brand: "Newtech Wood",
    category: "Facade",
    subcategory: "Decking",
    shortCode: "NW 10",
    width: "138mm",
    height: "22.5mm",
    depth: "2900mm",
    measurementType: "mm",
    finish: "Antique Grain",
    description: "360-degree co-extruded capped composite decking with ultra-durable weather protection.",
    tags: ["Decking", "WPC", "Outdoor"],
    imageUrl: "/brands/newtechwood/product_p10_sa.png",
    galleryImages: [
      "/brands/newtechwood/product_p14_eco.png",
      "/brands/newtechwood/product_p14_ocean.png"
    ],
    catalogPdfUrl: "/catalogues/NewTechWood/NewTechWood-Product-Catalog-2025.pdf",
    qtyInStock: 120,
    price: 680
  }
];

export const DEFAULT_TEAM: TeamMemberItem[] = [
  { id: "tm-01", name: "MOHANLAL MP", designation: "Founder", memberCode: "MM 01", photoUrl: "https://www.aarenintpro.com/wp-content/uploads/2016/08/about-us-4-min.jpg", phone: "+91 88844 64444", bio: "He is the face and voice of AAREN. The face that represents AAREN, the voice that tells the story of AAREN. He guides AAREN by guiding its culture, values and the well being of the team.", sequenceNumber: 1 },
  { id: "tm-02", name: "RAMNIKLAL M VAGADIYA", designation: "Founder & Chairman", memberCode: "RV 02", photoUrl: "https://www.aarenintpro.com/wp-content/uploads/2016/08/about-us-6-min.jpg", phone: "+91 88844 64444", bio: "A chartered accountant who is the backbone of the organization. He keeps the business focused, motivated, and sets concrete business plans for the team to achieve its vision.", sequenceNumber: 2 },
  { id: "tm-03", name: "MADHUSUDHAN MP", designation: "Envisioner & Chief Planner", memberCode: "MP 03", photoUrl: "https://www.aarenintpro.com/wp-content/uploads/2016/08/about-us-2-min.jpg", phone: "+91 88844 64444", bio: "He is the vision of AAREN. Responsible for creating the strategy, driving the business and scouting for world class products.", sequenceNumber: 3 },
  { id: "tm-04", name: "KOU SHIK", designation: "Sales", memberCode: "KS 04", photoUrl: "https://www.aarenintpro.com/wp-content/uploads/2016/08/about-us-1-min.jpg", phone: "+91 88844 64444", bio: "He guides customers to optimize the space utility, is abreast with market trends, and coordinates layouts for projects.", sequenceNumber: 4 },
  { id: "tm-05", name: "ASHWIN", designation: "Sales", memberCode: "AW 05", photoUrl: "https://www.aarenintpro.com/wp-content/uploads/2016/08/about-us-3-min.jpg", phone: "+91 88844 64444", bio: "Consults with architects and developers to find surface and material solutions, manages customer relations and outreach.", sequenceNumber: 5 },
  { id: "tm-06", name: "MUKUND", designation: "Sales", memberCode: "MK 06", photoUrl: "https://www.aarenintpro.com/wp-content/uploads/2016/08/about-us-5-min.jpg", photoUrl: "https://www.aarenintpro.com/wp-content/uploads/2016/08/about-us-5-min.jpg", phone: "+91 88844 64444", bio: "Curates the products, educates customers on the product mix and manages the store display.", sequenceNumber: 6 },
  { id: "tm-07", name: "JIGNESH", designation: "Sales", memberCode: "JG 07", photoUrl: "https://www.aarenintpro.com/wp-content/uploads/2016/08/about-us-7-min.jpg", phone: "+91 88844 64444", bio: "Maintains communication narratives, manages the sales channels, and reaches out to customers for Bagno & Surface solutions.", sequenceNumber: 7 },
];

export const DEFAULT_ROADMAP: RoadmapStepItem[] = [
  { id: "rm-01", stepNumber: "01", year: "2015", title: "FOUNDATION & ITALIAN PARTNERSHIPS", description: "Established Aaren Intpro on Mysore Road, Bangalore as exclusive partners for luxury Italian surface brands." },
  { id: "rm-02", stepNumber: "02", year: "2019", title: "MATERIAL LAB EXPANSION", description: "Launched the 10,000 sq.ft. interactive Material Lab showcasing full-scale architectural mockups and FENIX nano-tech surfaces." },
  { id: "rm-03", stepNumber: "03", year: "2024", title: "AAREN CREATIVE STUDIO 2.0", description: "Expanded into bespoke furniture, outdoor WPC decking cladding, and automated project specification PDF generators." }
];

// SITE SETTINGS STORE
export async function getSiteSettingsStore(): Promise<SiteSettingsItem> {
  try {
    const db = await prisma.siteSettings.findUnique({ where: { id: "default" } });
    if (db) {
      return {
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
        footerLinks: db.footerLinks,
        socialLinks: db.socialLinks,
        copyrightText: db.copyrightText,
      };
    }
  } catch (e) {}

  const json = readJsonStore();
  return json.settings || DEFAULT_SETTINGS;
}

export async function updateSiteSettingsStore(data: Partial<SiteSettingsItem>): Promise<SiteSettingsItem> {
  const current = await getSiteSettingsStore();
  const updated = { ...current, ...data };

  try {
    await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: updated,
      create: { id: "default", ...updated },
    });
  } catch (e) {}

  const json = readJsonStore();
  json.settings = updated;
  writeJsonStore(json);
  return updated;
}

// CATEGORIES STORE
export async function getCategoriesStore(): Promise<CategoryItem[]> {
  try {
    const db = await prisma.category.findMany({ orderBy: { sequenceNumber: "asc" } });
    if (db && db.length > 0) {
      return db.map((c: any) => ({
        id: c.id,
        name: c.name,
        coverImage: c.coverImage,
        description: c.description,
        shortCode: c.shortCode,
        sequenceNumber: c.sequenceNumber,
      }));
    }
  } catch (e) {}

  const json = readJsonStore();
  return json.categories || DEFAULT_CATEGORIES;
}

export async function saveCategoryStore(category: Omit<CategoryItem, "id"> & { id?: string }): Promise<CategoryItem> {
  const id = category.id || `cat-${Date.now()}`;
  const full: CategoryItem = { ...category, id };

  try {
    await prisma.category.upsert({
      where: { id },
      update: category,
      create: { id, ...category },
    });
  } catch (e) {}

  const json = readJsonStore();
  const idx = json.categories.findIndex((c: any) => c.id === id);
  if (idx >= 0) json.categories[idx] = full;
  else json.categories.push(full);
  writeJsonStore(json);
  return full;
}

export async function deleteCategoryStore(id: string) {
  try {
    await prisma.category.delete({ where: { id } });
  } catch (e) {}
  const json = readJsonStore();
  json.categories = json.categories.filter((c: any) => c.id !== id);
  writeJsonStore(json);
}

// BRANDS STORE
export async function getBrandsStore(): Promise<BrandItem[]> {
  try {
    const db = await prisma.brand.findMany({ orderBy: { sequenceNumber: "asc" } });
    if (db && db.length > 0) {
      return db.map((b: any) => ({
        id: b.id,
        name: b.name,
        logoUrl: b.logoUrl,
        bannerUrl: b.bannerUrl,
        description: b.description,
        shortCode: b.shortCode,
        sequenceNumber: b.sequenceNumber,
        catalogPdfUrl: b.catalogPdfUrl || undefined,
      }));
    }
  } catch (e) {}

  const json = readJsonStore();
  return json.brands || DEFAULT_BRANDS;
}

export async function saveBrandStore(brand: Omit<BrandItem, "id"> & { id?: string }): Promise<BrandItem> {
  const id = brand.id || brand.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const full: BrandItem = { ...brand, id };

  try {
    await prisma.brand.upsert({
      where: { id },
      update: brand,
      create: { id, ...brand },
    });
  } catch (e) {}

  const json = readJsonStore();
  const idx = json.brands.findIndex((b: any) => b.id === id);
  if (idx >= 0) json.brands[idx] = full;
  else json.brands.push(full);
  writeJsonStore(json);
  return full;
}

export async function deleteBrandStore(id: string) {
  try {
    await prisma.brand.delete({ where: { id } });
  } catch (e) {}
  const json = readJsonStore();
  json.brands = json.brands.filter((b: any) => b.id !== id);
  writeJsonStore(json);
}

// PRODUCTS STORE
export async function getAllProductsStore(): Promise<ProductItem[]> {
  try {
    const dbProducts = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    if (dbProducts && dbProducts.length > 0) {
      return dbProducts.map((p: any) => ({
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
        description: p.description,
        tags: p.tags,
        imageUrl: p.imageUrl,
        galleryImages: p.galleryImages,
        catalogPdfUrl: p.catalogPdfUrl || undefined,
        qtyInStock: p.qtyInStock || 0,
        price: p.price || undefined,
        finishOptions: p.finishOptions ? JSON.parse(p.finishOptions) : undefined,
      }));
    }
  } catch (err) {}

  const json = readJsonStore();
  return json.products || DEFAULT_PRODUCTS;
}

export async function addProductStore(product: Omit<ProductItem, "id"> & { id?: string }): Promise<ProductItem> {
  const id = product.id || `prod-${Date.now()}`;
  const fullProduct: ProductItem = { ...product, id };

  try {
    await prisma.product.upsert({
      where: { id },
      update: {
        name: product.name,
        brand: product.brand,
        category: product.category,
        subcategory: product.subcategory,
        shortCode: product.shortCode,
        width: product.width,
        height: product.height,
        depth: product.depth,
        measurementType: product.measurementType,
        thickness: product.thickness,
        finish: product.finish,
        description: product.description,
        tags: product.tags || [],
        imageUrl: product.imageUrl,
        galleryImages: product.galleryImages || [],
        catalogPdfUrl: product.catalogPdfUrl,
        qtyInStock: product.qtyInStock || 0,
        price: product.price,
        finishOptions: product.finishOptions ? JSON.stringify(product.finishOptions) : null,
      },
      create: {
        id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        subcategory: product.subcategory,
        shortCode: product.shortCode,
        width: product.width,
        height: product.height,
        depth: product.depth,
        measurementType: product.measurementType,
        thickness: product.thickness,
        finish: product.finish,
        description: product.description,
        tags: product.tags || [],
        imageUrl: product.imageUrl,
        galleryImages: product.galleryImages || [],
        catalogPdfUrl: product.catalogPdfUrl,
        qtyInStock: product.qtyInStock || 0,
        price: product.price,
        finishOptions: product.finishOptions ? JSON.stringify(product.finishOptions) : null,
      },
    });
  } catch (err) {}

  const json = readJsonStore();
  const idx = json.products.findIndex((p: any) => p.id === id);
  if (idx >= 0) json.products[idx] = fullProduct;
  else json.products.unshift(fullProduct);
  writeJsonStore(json);
  return fullProduct;
}

export async function parseAndImportExcelProducts(fileBuffer: Buffer): Promise<ProductItem[]> {
  const workbook = xlsx.read(fileBuffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rawData: any[] = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

  if (!rawData || rawData.length < 2) throw new Error("Invalid or empty Excel file");

  let headerRowIndex = 0;
  for (let i = 0; i < Math.min(5, rawData.length); i++) {
    const rowStr = JSON.stringify(rawData[i]).toLowerCase();
    if (rowStr.includes("product") || rowStr.includes("brand")) {
      headerRowIndex = i;
      break;
    }
  }

  const headers: string[] = rawData[headerRowIndex].map((h: any) => String(h || "").trim());
  const importedProducts: ProductItem[] = [];

  for (let i = headerRowIndex + 1; i < rawData.length; i++) {
    const row = rawData[i];
    if (!row || row.length === 0) continue;

    const rowObj: Record<string, any> = {};
    headers.forEach((h, idx) => {
      rowObj[h] = row[idx];
    });

    const name = rowObj["Name of the Product"] || rowObj["Product Name"] || rowObj["Name"];
    if (!name) continue;

    const brand = rowObj["Brand"] || "Aaren";
    const category = rowObj["Category"] || "General";

    const newProd: Omit<ProductItem, "id"> = {
      name: String(name),
      brand: String(brand),
      category: String(category),
      subcategory: rowObj["Subcategory"] ? String(rowObj["Subcategory"]) : undefined,
      width: String(rowObj["Width"] || rowObj["Size"] || ""),
      height: String(rowObj["Height"] || ""),
      depth: String(rowObj["Depth"] || ""),
      measurementType: String(rowObj["Measurement Type"] || "mm"),
      thickness: String(rowObj["Thickness"] || ""),
      finish: String(rowObj["Finish"] || ""),
      description: String(rowObj["Description"] || `${brand} ${name}`),
      imageUrl: String(rowObj["Image"] || "/brands/brand_1_1.png"),
      qtyInStock: parseInt(rowObj["Qty in Stock"] || "10", 10),
    };

    const created = await addProductStore(newProd);
    importedProducts.push(created);
  }

  return importedProducts;
}

// SHOWCASE PROJECTS STORE
export async function getAllProjectsStore(): Promise<ProjectShowcaseItem[]> {
  try {
    const dbProjects = await prisma.project.findMany({
      include: { items: true },
      orderBy: { sequenceNumber: "asc" },
    });
    if (dbProjects && dbProjects.length > 0) {
      return dbProjects.map((p: any) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        description: p.description,
        category: p.category,
        client: p.client,
        projectCode: p.projectCode || "OB 01",
        sequenceNumber: p.sequenceNumber || 1,
        imageUrl: p.imageUrl,
        gallery: p.gallery,
        pdfUrl: p.pdfUrl || undefined,
        createdAt: p.createdAt.toISOString(),
      }));
    }
  } catch (err) {}

  const json = readJsonStore();
  return json.projects || DEFAULT_PROJECTS;
}

export async function saveProjectStore(projectData: Omit<ProjectShowcaseItem, "id"> & { id?: string }): Promise<ProjectShowcaseItem> {
  const id = projectData.id || `proj-${Date.now()}`;
  const slug = projectData.slug || projectData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const mainImg = projectData.imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";
  const galleryImgs = projectData.gallery || [mainImg];
  const full: ProjectShowcaseItem = { ...projectData, id, slug, imageUrl: mainImg, gallery: galleryImgs };

  try {
    await prisma.project.upsert({
      where: { id },
      update: {
        title: projectData.title,
        slug,
        description: projectData.description,
        category: projectData.category,
        client: projectData.client,
        projectCode: projectData.projectCode || "OB 01",
        sequenceNumber: projectData.sequenceNumber || 1,
        imageUrl: mainImg,
        gallery: galleryImgs,
      },
      create: {
        id,
        title: projectData.title,
        slug,
        description: projectData.description,
        category: projectData.category,
        client: projectData.client,
        projectCode: projectData.projectCode || "OB 01",
        sequenceNumber: projectData.sequenceNumber || 1,
        imageUrl: mainImg,
        gallery: galleryImgs,
      },
    });
  } catch (err) {}

  const json = readJsonStore();
  const idx = json.projects.findIndex((p: any) => p.id === id);
  if (idx >= 0) json.projects[idx] = full;
  else json.projects.push(full);
  writeJsonStore(json);

  return full;
}

export async function deleteProjectStore(id: string) {
  try {
    await prisma.project.delete({ where: { id } });
  } catch (e) {}
  const json = readJsonStore();
  json.projects = json.projects.filter((p: any) => p.id !== id);
  writeJsonStore(json);
}

// TEAM & ROADMAP STORE
export async function getTeamStore(): Promise<TeamMemberItem[]> {
  try {
    const db = await prisma.teamMember.findMany({ orderBy: { sequenceNumber: "asc" } });
    if (db && db.length > 0) return db as any;
  } catch (e) {}
  const json = readJsonStore();
  return json.team || DEFAULT_TEAM;
}

export async function saveTeamMemberStore(member: Omit<TeamMemberItem, "id"> & { id?: string }) {
  const id = member.id || `tm-${Date.now()}`;
  const full = { ...member, id };
  try {
    await prisma.teamMember.upsert({
      where: { id },
      update: member,
      create: { id, ...member },
    });
  } catch (e) {}
  const json = readJsonStore();
  const idx = json.team.findIndex((t: any) => t.id === id);
  if (idx >= 0) json.team[idx] = full;
  else json.team.push(full);
  writeJsonStore(json);
  return full;
}

export async function deleteTeamMemberStore(id: string) {
  try {
    await prisma.teamMember.delete({ where: { id } });
  } catch (e) {}
  const json = readJsonStore();
  json.team = json.team.filter((t: any) => t.id !== id);
  writeJsonStore(json);
}

export async function getRoadmapStore(): Promise<RoadmapStepItem[]> {
  try {
    const db = await prisma.roadmapStep.findMany({ orderBy: { stepNumber: "asc" } });
    if (db && db.length > 0) return db as any;
  } catch (e) {}
  const json = readJsonStore();
  return json.roadmap || DEFAULT_ROADMAP;
}

export async function saveRoadmapStepStore(step: Omit<RoadmapStepItem, "id"> & { id?: string }) {
  const id = step.id || `rm-${Date.now()}`;
  const full = { ...step, id };
  try {
    await prisma.roadmapStep.upsert({
      where: { id },
      update: step,
      create: { id, ...step },
    });
  } catch (e) {}
  const json = readJsonStore();
  const idx = json.roadmap.findIndex((r: any) => r.id === id);
  if (idx >= 0) json.roadmap[idx] = full;
  else json.roadmap.push(full);
  writeJsonStore(json);
  return full;
}

// INQUIRIES STORE (LEADS & PROTECTED CATALOG GATE)
export async function getInquiriesStore(): Promise<InquiryItem[]> {
  try {
    const db = await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });
    if (db && db.length > 0) {
      return db.map((i: any) => ({
        id: i.id,
        name: i.name,
        email: i.email,
        phone: i.phone,
        type: i.type,
        subject: i.subject || undefined,
        message: i.message || undefined,
        productOrBrand: i.productOrBrand || undefined,
        createdAt: i.createdAt.toISOString(),
      }));
    }
  } catch (e) {}

  const json = readJsonStore();
  return json.inquiries || [];
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
  } catch (e) {}

  const json = readJsonStore();
  if (!json.inquiries) json.inquiries = [];
  json.inquiries.unshift(full);
  writeJsonStore(json);

  // Trigger Google Sheet Webhook if configured
  const settings = await getSiteSettingsStore();
  if (settings.webhookUrl && settings.webhookUrl.startsWith("http")) {
    try {
      fetch(settings.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(full),
      }).catch((e) => console.error("Webhook trigger failed:", e));
    } catch (e) {}
  }

  return full;
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

export async function getAllFAQsStore() {
  try {
    const faqs = await prisma.fAQ.findMany({ orderBy: { id: "asc" } });
    if (faqs && faqs.length > 0) return faqs;
  } catch (e) {}
  return [
    { id: "faq-1", question: "What materials does Aaren Studio specialize in?", answer: "We specialize in Italian FENIX nano-tech surfaces, Falper luxury vanities, Mafi natural wood flooring, and NewTechWood architectural cladding." },
    { id: "faq-2", question: "Where is the Aaren Studio Material Lab located?", answer: "Our Material Lab is located on Mysore Road, Bangalore, India." }
  ];
}

// SERVICES STORE
export async function getServicesStore(): Promise<ServiceItem[]> {
  try {
    const db = await prisma.service.findMany({ orderBy: { sequenceNumber: "asc" } });
    if (db && db.length > 0) return db as any;
  } catch (e) {}
  const json = readJsonStore();
  return json.services || [
    { id: "srv-1", title: "Material Curation & Sourcing", description: "Exclusive European surfaces, FENIX nano-laminates, and natural wood cladding.", icon: "💎", sequenceNumber: 1 },
    { id: "srv-2", title: "Architectural Specification & Detailing", description: "Bespoke CAD drawings, technical joinery, and material sample kits.", icon: "📐", sequenceNumber: 2 },
    { id: "srv-3", title: "Italian Modular Living Systems", description: "Precision engineered Slashform kitchen and wardrobe systems.", icon: "🏛️", sequenceNumber: 3 },
  ];
}

export async function saveServiceStore(service: Omit<ServiceItem, "id"> & { id?: string }): Promise<ServiceItem> {
  const id = service.id || `srv-${Date.now()}`;
  const full = { ...service, id };
  try {
    await prisma.service.upsert({
      where: { id },
      update: service,
      create: { id, ...service },
    });
  } catch (e) {}
  const json = readJsonStore();
  if (!json.services) json.services = [];
  const idx = json.services.findIndex((s: any) => s.id === id);
  if (idx >= 0) json.services[idx] = full;
  else json.services.push(full);
  writeJsonStore(json);
  return full;
}

export async function deleteServiceStore(id: string) {
  try {
    await prisma.service.delete({ where: { id } });
  } catch (e) {}
  const json = readJsonStore();
  if (json.services) json.services = json.services.filter((s: any) => s.id !== id);
  writeJsonStore(json);
}

// TESTIMONIALS STORE
export async function getTestimonialsStore(): Promise<TestimonialItem[]> {
  try {
    const db = await prisma.testimonial.findMany({ orderBy: { sequenceNumber: "asc" } });
    if (db && db.length > 0) return db as any;
  } catch (e) {}
  const json = readJsonStore();
  return json.testimonials || [
    { id: "t-1", clientName: "Vikramaditya Rao", company: "Oberoi Penthouse Owner", rating: 5, review: "Aaren Studio transformed our penthouse with incredible FENIX surfaces and Mafi oak floors.", sequenceNumber: 1 },
    { id: "t-2", clientName: "Ananya Deshmukh", company: "Principal Architect, Studio AD", rating: 5, review: "The material sample kits and Italian joinery precision from Aaren are unmatched in India.", sequenceNumber: 2 },
  ];
}

export async function saveTestimonialStore(testimonial: Omit<TestimonialItem, "id"> & { id?: string }): Promise<TestimonialItem> {
  const id = testimonial.id || `t-${Date.now()}`;
  const full = { ...testimonial, id };
  try {
    await prisma.testimonial.upsert({
      where: { id },
      update: testimonial,
      create: { id, ...testimonial },
    });
  } catch (e) {}
  const json = readJsonStore();
  if (!json.testimonials) json.testimonials = [];
  const idx = json.testimonials.findIndex((t: any) => t.id === id);
  if (idx >= 0) json.testimonials[idx] = full;
  else json.testimonials.push(full);
  writeJsonStore(json);
  return full;
}

export async function deleteTestimonialStore(id: string) {
  try {
    await prisma.testimonial.delete({ where: { id } });
  } catch (e) {}
  const json = readJsonStore();
  if (json.testimonials) json.testimonials = json.testimonials.filter((t: any) => t.id !== id);
  writeJsonStore(json);
}

// BLOGS STORE
export async function getBlogsStore(): Promise<BlogItem[]> {
  try {
    const db = await prisma.blog.findMany({ orderBy: { createdAt: "desc" } });
    if (db && db.length > 0) return db as any;
  } catch (e) {}
  const json = readJsonStore();
  return json.blogs || [
    { id: "b-1", title: "The Evolution of FENIX Nano-Tech Surfaces in Indian Homes", slug: "fenix-surfaces-guide", category: "Surfaces", tags: ["FENIX", "Laminate", "Interior Design"], content: "FENIX nano-technology represents a breakthrough in thermal healing and ultra-matte surface aesthetics...", featuredImage: "/brands/brand_4_1.png", author: "Aaren Studio", publishDate: "2026-02-15", status: "Published" }
  ];
}

export async function saveBlogStore(blog: Omit<BlogItem, "id"> & { id?: string }): Promise<BlogItem> {
  const id = blog.id || `blog-${Date.now()}`;
  const slug = blog.slug || blog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const full = { ...blog, id, slug };
  try {
    await prisma.blog.upsert({
      where: { id },
      update: full,
      create: full,
    });
  } catch (e) {}
  const json = readJsonStore();
  if (!json.blogs) json.blogs = [];
  const idx = json.blogs.findIndex((b: any) => b.id === id);
  if (idx >= 0) json.blogs[idx] = full;
  else json.blogs.unshift(full);
  writeJsonStore(json);
  return full;
}

export async function deleteBlogStore(id: string) {
  try {
    await prisma.blog.delete({ where: { id } });
  } catch (e) {}
  const json = readJsonStore();
  if (json.blogs) json.blogs = json.blogs.filter((b: any) => b.id !== id);
  writeJsonStore(json);
}

// MEDIA LIBRARY STORE
export async function getMediaStore(): Promise<MediaAsset[]> {
  try {
    const db = await prisma.mediaItem.findMany({ orderBy: { createdAt: "desc" } });
    if (db && db.length > 0) return db as any;
  } catch (e) {}
  const json = readJsonStore();
  return json.media || [
    { id: "m-1", fileName: "Slashform_Kitchen_Catalog.pdf", fileUrl: "/catalogues/Slashform/Slashform_2025.pdf", fileType: "PDF", folder: "Catalogs", size: "12.4 MB" },
    { id: "m-2", fileName: "FENIX_Brochure_2024.pdf", fileUrl: "/catalogues/Formica/2024-FENIX-brochure-digital.pdf", fileType: "PDF", folder: "Catalogs", size: "8.2 MB" },
  ];
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
  return full;
}

export async function deleteMediaStore(id: string) {
  try {
    await prisma.mediaItem.delete({ where: { id } });
  } catch (e) {}
  const json = readJsonStore();
  if (json.media) json.media = json.media.filter((m: any) => m.id !== id);
  writeJsonStore(json);
}

// TAXONOMIES & DROPDOWNS STORE
export async function getTaxonomiesStore(): Promise<TaxonomyItem[]> {
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
  try {
    await prisma.taxonomy.upsert({
      where: { id },
      update: full,
      create: full,
    });
  } catch (e) {}
  const json = readJsonStore();
  if (!json.taxonomies) json.taxonomies = [];
  const idx = json.taxonomies.findIndex((t: any) => t.id === id);
  if (idx >= 0) json.taxonomies[idx] = full;
  else json.taxonomies.push(full);
  writeJsonStore(json);
  return full;
}

export async function deleteTaxonomyStore(id: string) {
  try {
    await prisma.taxonomy.delete({ where: { id } });
  } catch (e) {}
  const json = readJsonStore();
  if (json.taxonomies) json.taxonomies = json.taxonomies.filter((t: any) => t.id !== id);
  writeJsonStore(json);
}

// DYNAMIC PAGE BUILDER STORE
export async function getPagesStore(): Promise<CustomPageItem[]> {
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

  const json = readJsonStore();
  if (!json.pages) json.pages = [];
  const idx = json.pages.findIndex((p: any) => p.id === id);
  if (idx >= 0) json.pages[idx] = full;
  else json.pages.push(full);
  writeJsonStore(json);
  return full;
}

export async function deletePageStore(id: string) {
  const json = readJsonStore();
  if (json.pages) json.pages = json.pages.filter((p: any) => p.id !== id);
  writeJsonStore(json);
}


