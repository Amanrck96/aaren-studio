import { prisma } from "./prisma";
import * as xlsx from "xlsx";
import fs from "fs";
import path from "path";

export type ProductItem = {
  id: string;
  slNo?: number;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  width?: string;
  height?: string;
  depth?: string;
  measurementType?: string;
  thickness?: string;
  finish?: string;
  description: string;
  tags?: string[];
  imageUrl: string;
  catalog?: string;
  qtyInStock?: number;
  price?: number;
  finishOptions?: { name: string; hex?: string; image?: string }[];
};

export type ProjectItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  client: string;
  imageUrl: string;
  gallery?: string[];
  pdfUrl?: string;
  selectedProducts: {
    productId?: string;
    productName: string;
    brand: string;
    category: string;
    finish?: string;
    dimensions?: string;
    quantity: number;
    notes?: string;
    imageUrl?: string;
  }[];
  createdAt: string;
};

const JSON_STORE_PATH = path.join(process.cwd(), "data", "store.json");

function ensureDataDirectory() {
  const dir = path.dirname(JSON_STORE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(JSON_STORE_PATH)) {
    fs.writeFileSync(
      JSON_STORE_PATH,
      JSON.stringify(
        {
          products: [],
          projects: [],
          faqs: [],
        },
        null,
        2
      )
    );
  }
}

function readJsonStore() {
  ensureDataDirectory();
  try {
    const data = fs.readFileSync(JSON_STORE_PATH, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return { products: [], projects: [], faqs: [] };
  }
}

function writeJsonStore(data: any) {
  ensureDataDirectory();
  fs.writeFileSync(JSON_STORE_PATH, JSON.stringify(data, null, 2));
}

// Initial default products from Excel format
const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: "prod-01",
    slNo: 1,
    name: "Falper Senzafine Vanity",
    brand: "Falper",
    category: "Sanitary Fittings",
    subcategory: "Vanities",
    width: "1200mm",
    height: "850mm",
    depth: "500mm",
    measurementType: "mm",
    thickness: "18mm",
    finish: "Matte White Lacquer",
    description: "Architectural Italian double vanity unit with integrated washbasin and soft-close drawers.",
    tags: ["Luxury", "Bathroom", "Falper"],
    imageUrl: "/brands/brand_6_1.png",
    qtyInStock: 5,
    price: 345000,
    finishOptions: [
      { name: "Matte White", hex: "#FFFFFF" },
      { name: "Brushed Black", hex: "#222222" },
      { name: "Walnut Wood", hex: "#8B4513" }
    ]
  },
  {
    id: "prod-02",
    slNo: 2,
    name: "NewTechWood Antique Deck Board",
    brand: "Newtech Wood",
    category: "Cladding & Decking",
    subcategory: "Decking",
    width: "138mm",
    height: "22.5mm",
    depth: "2900mm",
    measurementType: "mm",
    thickness: "22.5mm",
    finish: "Antique Grain",
    description: "360-degree co-extruded capped composite decking with ultra-durable weather protection.",
    tags: ["Decking", "WPC", "Outdoor"],
    imageUrl: "/brands/newtechwood/product_p10_sa.png",
    qtyInStock: 120,
    price: 680,
    finishOptions: [
      { name: "Antique Grain", hex: "#5A4D41" },
      { name: "Teak Finish", hex: "#A5682A" },
      { name: "Ipe Wood", hex: "#3B271A" }
    ]
  },
  {
    id: "prod-03",
    slNo: 3,
    name: "FENIX NTM Nano-Tech Slab",
    brand: "Formica",
    category: "Laminates",
    subcategory: "Fenix",
    width: "3050mm",
    height: "1300mm",
    depth: "0.9mm",
    measurementType: "mm",
    thickness: "0.9mm",
    finish: "Nano-tech Super Matte",
    description: "Anti-fingerprint thermal healing high pressure smart surface for modern kitchens and furniture.",
    tags: ["Laminates", "Nano-Tech", "Fenix"],
    imageUrl: "/brands/brand_4_1.png",
    qtyInStock: 45,
    price: 18500,
    finishOptions: [
      { name: "Bianco Kos", hex: "#F5F5F5" },
      { name: "Nero Ingo", hex: "#1C1C1C" },
      { name: "Grigio Efeso", hex: "#9E9E9E" }
    ]
  },
  {
    id: "prod-04",
    slNo: 4,
    name: "Madheke Queen Sofa",
    brand: "Madheke",
    category: "Furniture",
    subcategory: "Sofas",
    width: "2800mm",
    height: "750mm",
    depth: "1050mm",
    measurementType: "mm",
    thickness: "N/A",
    finish: "Boucle Fabric & Solid Walnut",
    description: "Handcrafted curved luxury sofa embodying harmony of proportions and ultimate seating comfort.",
    tags: ["Living", "Sofa", "Madheke"],
    imageUrl: "/brands/brand_5_1.png",
    qtyInStock: 2,
    price: 520000,
    finishOptions: [
      { name: "Cream Bouclé", hex: "#F3EFE6" },
      { name: "Tobacco Leather", hex: "#6F4E37" },
      { name: "Charcoal Velvet", hex: "#36454F" }
    ]
  }
];

export async function getAllProductsStore(): Promise<ProductItem[]> {
  try {
    // Try database first if configured
    const dbProducts = await prisma.product.findMany({
      orderBy: { createdAt: "desc" }
    });
    if (dbProducts && dbProducts.length > 0) {
      return dbProducts.map((p) => ({
        id: p.id,
        slNo: p.slNo || undefined,
        name: p.name,
        brand: p.brand,
        category: p.category,
        subcategory: p.subcategory || undefined,
        width: p.width || undefined,
        height: p.height || undefined,
        depth: p.depth || undefined,
        measurementType: p.measurementType || undefined,
        thickness: p.thickness || undefined,
        finish: p.finish || undefined,
        description: p.description,
        tags: p.tags,
        imageUrl: p.imageUrl,
        catalog: p.catalog || undefined,
        qtyInStock: p.qtyInStock || 0,
        price: p.price || undefined,
        finishOptions: p.finishOptions ? JSON.parse(p.finishOptions) : undefined,
      }));
    }
  } catch (err) {
    // Fallback to JSON store
  }

  const json = readJsonStore();
  if (!json.products || json.products.length === 0) {
    json.products = INITIAL_PRODUCTS;
    writeJsonStore(json);
  }
  return json.products;
}

export async function addProductStore(product: Omit<ProductItem, "id">): Promise<ProductItem> {
  const newId = `prod-${Date.now()}`;
  const fullProduct: ProductItem = {
    ...product,
    id: newId,
  };

  try {
    await prisma.product.create({
      data: {
        name: product.name,
        brand: product.brand,
        category: product.category,
        subcategory: product.subcategory,
        width: product.width,
        height: product.height,
        depth: product.depth,
        measurementType: product.measurementType,
        thickness: product.thickness,
        finish: product.finish,
        description: product.description,
        tags: product.tags || [],
        imageUrl: product.imageUrl || "/brands/brand_1_1.png",
        catalog: product.catalog,
        qtyInStock: product.qtyInStock || 0,
        price: product.price,
        finishOptions: product.finishOptions ? JSON.stringify(product.finishOptions) : null,
      }
    });
  } catch (err) {
    // DB error fallback to JSON store
  }

  const json = readJsonStore();
  json.products.unshift(fullProduct);
  writeJsonStore(json);
  return fullProduct;
}

export async function parseAndImportExcelProducts(fileBuffer: Buffer): Promise<ProductItem[]> {
  const workbook = xlsx.read(fileBuffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rawData: any[] = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

  if (!rawData || rawData.length < 2) {
    throw new Error("Invalid or empty Excel file");
  }

  // Row 0 or 1 might be headers
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

    const name = rowObj["Name of the Product"] || rowObj["Product Name"] || rowObj["Name"] || rowObj["Title"];
    if (!name) continue;

    const brand = rowObj["Brand"] || "Aaren";
    const category = rowObj["Category"] || "General";
    const subcategory = rowObj["Subcategory"] || rowObj["Sub Category"];
    const width = String(rowObj["Width"] || rowObj["Size"] || "");
    const height = String(rowObj["Height"] || "");
    const depth = String(rowObj["Depth"] || "");
    const measurementType = String(rowObj["Measurement Type"] || "mm");
    const thickness = String(rowObj["Thickness"] || "");
    const finish = String(rowObj["Finish"] || "");
    const description = String(rowObj["Description"] || `${brand} ${name} in ${finish || category}`);
    const imageUrl = String(rowObj["Image"] || rowObj["Image URL"] || "/brands/brand_1_1.png");
    const catalog = String(rowObj["Catalog"] || "");
    const qtyInStock = parseInt(rowObj["Qty in Stock"] || rowObj["Stock"] || "10", 10);
    const slNo = parseInt(rowObj["Sl No"] || rowObj["Sl No "] || String(i), 10);

    const tags: string[] = [];
    ["Tag 1", "Tag 2", "Tag 3", "Tag 4", "Tag 5"].forEach((tKey) => {
      if (rowObj[tKey]) tags.push(String(rowObj[tKey]));
    });

    const newProd: Omit<ProductItem, "id"> = {
      slNo: isNaN(slNo) ? undefined : slNo,
      name: String(name),
      brand: String(brand),
      category: String(category),
      subcategory: subcategory ? String(subcategory) : undefined,
      width: width || undefined,
      height: height || undefined,
      depth: depth || undefined,
      measurementType: measurementType || undefined,
      thickness: thickness || undefined,
      finish: finish || undefined,
      description: description,
      tags: tags.length > 0 ? tags : [brand, category],
      imageUrl: imageUrl.startsWith("http") || imageUrl.startsWith("/") ? imageUrl : `/brands/${imageUrl}`,
      catalog: catalog || undefined,
      qtyInStock: isNaN(qtyInStock) ? 0 : qtyInStock,
    };

    const created = await addProductStore(newProd);
    importedProducts.push(created);
  }

  return importedProducts;
}

// Projects Store
export async function getAllProjectsStore(): Promise<ProjectItem[]> {
  try {
    const dbProjects = await prisma.project.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    if (dbProjects && dbProjects.length > 0) {
      return dbProjects.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        description: p.description,
        category: p.category,
        client: p.client,
        imageUrl: p.imageUrl,
        gallery: p.gallery,
        pdfUrl: p.pdfUrl || undefined,
        selectedProducts: p.items.map((it) => ({
          productId: it.productId || undefined,
          productName: it.productName,
          brand: it.brand,
          category: it.category,
          finish: it.finish || undefined,
          dimensions: it.dimensions || undefined,
          quantity: it.quantity,
          notes: it.notes || undefined,
        })),
        createdAt: p.createdAt.toISOString(),
      }));
    }
  } catch (err) {}

  const json = readJsonStore();
  return json.projects || [];
}

export async function createProjectStore(projectData: {
  title: string;
  client: string;
  category: string;
  description: string;
  imageUrl?: string;
  selectedProducts: {
    productId?: string;
    productName: string;
    brand: string;
    category: string;
    finish?: string;
    dimensions?: string;
    quantity: number;
    notes?: string;
    imageUrl?: string;
  }[];
}): Promise<ProjectItem> {
  const slug = projectData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();
  const newProject: ProjectItem = {
    id: `proj-${Date.now()}`,
    title: projectData.title,
    slug,
    client: projectData.client,
    category: projectData.category,
    description: projectData.description,
    imageUrl: projectData.imageUrl || "/brands/brand_1_1.png",
    selectedProducts: projectData.selectedProducts,
    createdAt: new Date().toISOString(),
  };

  try {
    await prisma.project.create({
      data: {
        title: projectData.title,
        slug,
        client: projectData.client,
        category: projectData.category,
        description: projectData.description,
        imageUrl: projectData.imageUrl || "/brands/brand_1_1.png",
        gallery: [projectData.imageUrl || "/brands/brand_1_1.png"],
        items: {
          create: projectData.selectedProducts.map((p) => ({
            productName: p.productName,
            brand: p.brand,
            category: p.category,
            finish: p.finish,
            dimensions: p.dimensions,
            quantity: p.quantity,
            notes: p.notes,
            productId: p.productId,
          })),
        },
      },
    });
  } catch (err) {}

  const json = readJsonStore();
  if (!json.projects) json.projects = [];
  json.projects.unshift(newProject);
  writeJsonStore(json);

  return newProject;
}

// FAQs Store
export async function getAllFAQsStore() {
  const json = readJsonStore();
  if (json.faqs && json.faqs.length > 0) return json.faqs;

  // Initial FAQs from Aaren FAQ.xlsx
  const defaultFaqs = [
    { id: "faq-1", question: "What is Aaren Intpro?", answer: "Aaren Intpro is a premium interior solutions company in Bangalore providing world-class architectural surfaces, furniture, doors, kitchens, and decorative finishes." },
    { id: "faq-2", question: "Where is Aaren Intpro located?", answer: "Aaren Intpro is located on Mysore Road, Bangalore, India." },
    { id: "faq-3", question: "Which interior products company works with interior designers in Bangalore?", answer: "Aaren Intpro collaborates closely with interior designers and architects to provide customized solutions and luxury materials." },
    { id: "faq-4", question: "Where can I find luxury home improvement products in Bangalore?", answer: "Aaren Intpro offers a wide range of luxury home improvement products for modern living spaces including Falper, Fenix, Mirage, and Newtech Wood." },
    { id: "faq-5", question: "Why do architects recommend Aaren Intpro?", answer: "Architects prefer Aaren Intpro for its premium product range, quality standards, trusted international brands, and expert technical customer support." }
  ];

  json.faqs = defaultFaqs;
  writeJsonStore(json);
  return defaultFaqs;
}
