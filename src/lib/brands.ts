export type BrandCatalogue = {
  title: string;
  subtitle?: string;
  file: string; // path under /public/catalogues/
};

export type BrandProduct = {
  id: string;
  name: string;
  collection?: string;
  finish?: string;
  tag?: string;
};

export type Brand = {
  id: string;
  name: string;
  code: string;
  num: string;
  hero: string;
  logo: string;
  category: string;
  origin: string;
  tagline: string;
  description: string;
  founded?: string;
  website?: string;
  collections: string[]; // filter chips
  products: BrandProduct[];
  catalogues: BrandCatalogue[];
};

const BRANDS: Brand[] = [
  {
    id: "slashform",
    name: "Slashform",
    code: "SF",
    num: "01",
    hero: "/brands/brand_1_1.png",
    logo: "/brands/brand_1_2.png",
    category: "Kitchen & Wardrobe",
    origin: "Italy",
    tagline: "Precision living systems",
    description:
      "Slashform engineers kitchens and wardrobe systems where Italian craft meets architectural rigour. Every component is resolved to the millimetre — flush profiles, integrated hardware, and surfaces that age with grace. The result is a living system that disappears into the architecture and reveals itself only in use.",
    founded: "2003",
    collections: ["All", "Kitchen", "Wardrobe", "Door Systems"],
    products: [
      { id: "sf-01", name: "K+W Kitchen System", collection: "Kitchen", finish: "Matte Lacquer" },
      { id: "sf-02", name: "D+W Wardrobe Frame", collection: "Wardrobe", finish: "Anodised Aluminium" },
      { id: "sf-03", name: "Pivoting Door", collection: "Door Systems", finish: "Smoked Glass" },
      { id: "sf-04", name: "Linear Handle", collection: "Kitchen", finish: "Brushed Brass" },
      { id: "sf-05", name: "Island Unit", collection: "Kitchen", finish: "Calacatta Stone" },
      { id: "sf-06", name: "Walk-In Frame", collection: "Wardrobe", finish: "Graphite" },
    ],
    catalogues: [],
  },
  {
    id: "waltz",
    name: "Waltz by JB Glass",
    code: "WB",
    num: "02",
    hero: "/brands/brand_2_1.png",
    logo: "/brands/brand_2_2.png",
    category: "Screens & Partitions",
    origin: "India",
    tagline: "Architectural glass solutions",
    description:
      "Waltz by JB Glass redefines how space is divided. Born from decades of precision glass manufacturing in India, the brand offers frameless partitions, zipline screens, and bespoke shower enclosures that command attention through their clarity and structural confidence. Each panel is a conversation between light and transparency.",
    founded: "1998",
    collections: ["All", "Partitions", "Shower Enclosures", "Balustrades", "Zipline"],
    products: [
      { id: "wb-01", name: "Frameless Partition", collection: "Partitions", finish: "10mm Tempered" },
      { id: "wb-02", name: "Zipline Screen", collection: "Zipline", finish: "Frosted" },
      { id: "wb-03", name: "Shower Enclosure", collection: "Shower Enclosures", finish: "Clear" },
      { id: "wb-04", name: "Glass Balustrade", collection: "Balustrades", finish: "Bronze Tint" },
      { id: "wb-05", name: "Pivot Door Panel", collection: "Partitions", finish: "Acid-etched" },
      { id: "wb-06", name: "Walk-in Shower Wall", collection: "Shower Enclosures", finish: "Smoked" },
    ],
    catalogues: [],
  },
  {
    id: "newtech-wood",
    name: "Newtech Wood",
    code: "NW",
    num: "03",
    hero: "/brands/brand_3_1.png",
    logo: "/brands/brand_3_2.png",
    category: "Cladding & Decking",
    origin: "USA",
    tagline: "WPC composite excellence",
    description:
      "Newtech Wood pioneers wood-plastic composite technology that outlasts timber without compromising on natural beauty. Their WPC profiles resist moisture, insects, and UV degradation — making them ideal for facades, decks, and outdoor living spaces across India's challenging climate. Beauty that is built to endure.",
    founded: "2005",
    collections: ["All", "Decking", "Cladding", "Screens", "Fencing"],
    products: [
      { id: "nw-01", name: "Naturale Solid Board (US01)", collection: "Decking", finish: "Flat Grain (138x22.5mm)", tag: "Flagship" },
      { id: "nw-02", name: "Naturale Hollow Board (UH02)", collection: "Decking", finish: "Wood Grain (138x22.5mm)" },
      { id: "nw-03", name: "Naturale Wide Solid Board (US54)", collection: "Decking", finish: "Flat Grain (210x22.5mm)" },
      { id: "nw-04", name: "Naturale Wide Hollow Board (UH22)", collection: "Decking", finish: "Wood Grain (210x22.5mm)" },
      { id: "nw-05", name: "Marina Heavy Commercial Board (US71)", collection: "Decking", finish: "Anti-Slip Grain (210x36mm)", tag: "36 PTV Wet Slip" },
      { id: "nw-06", name: "Old World Rustic Board (US54)", collection: "Decking", finish: "Weathered / Flat Grain (210x22.5mm)" },
      { id: "nw-07", name: "Essentials Convex Drainage Board (US94)", collection: "Decking", finish: "Handscrapped Grain (138x23.5mm)", tag: "Better Drainage" },
      { id: "nw-08", name: "Essentials Cathedral Board (UH100)", collection: "Decking", finish: "Cathedral Grain (140x25mm)" },
      { id: "nw-09", name: "Decking Bullnose Finisher (US33)", collection: "Decking", finish: "Flat Grain (138x22.5mm)" },
      { id: "nw-10", name: "Decking Fascia Board (US08 / US06 / US07 / US03 / US05)", collection: "Decking", finish: "Multiple Widths (138-285mm)" },
      { id: "nw-11", name: "Standard & Breaker Hidden Clip Systems", collection: "Decking", finish: "304 Stainless Steel & Torx Head" },
      { id: "nw-12", name: "End Caps, Plugs & Color Screws", collection: "Decking", finish: "TPO UV-Stable / Stainless Steel" },
    ],
    catalogues: [
      { title: "NewTechWood Product Catalog 2025", subtitle: "Complete Decking, Cladding & Systems Range", file: "NewTechWood/NewTechWood-Product-Catalog-2025.pdf" },
    ],
  },
  {
    id: "formica",
    name: "Formica",
    code: "FC",
    num: "04",
    hero: "/brands/brand_4_1.png",
    logo: "/brands/brand_4_2.png",
    category: "Laminates",
    origin: "USA",
    tagline: "Iconic surface solutions",
    description:
      "For over a century, Formica has defined the language of surfaces. From postmodern kitchens to landmark public spaces, Formica laminates carry an unmatched breadth of finishes — including the revolutionary FENIX nano-tech matte, the mineral richness of Decometal, and the organic warmth of wood-effect collections. A surface for every vision.",
    founded: "1913",
    collections: ["All", "Fenix", "VIS", "Homapal"],
    products: [
      { id: "fc-01", name: "FENIX NTM® Surface", collection: "Fenix", finish: "Matte Nano-tech", tag: "Bestseller" },
      { id: "fc-02", name: "Formica VIS High-Gloss", collection: "VIS", finish: "High Gloss Lacquer" },
      { id: "fc-03", name: "Homapal Metal Laminate", collection: "Homapal", finish: "Brushed Aluminium" },
      { id: "fc-04", name: "FENIX NTA® Surface", collection: "Fenix", finish: "Metal Matte Nano-tech" },
      { id: "fc-05", name: "Formica VIS Matte", collection: "VIS", finish: "Wood Effect Matt" },
      { id: "fc-06", name: "FENIX Bianco Kos", collection: "Fenix", finish: "Arctic White Matte" },
      { id: "fc-07", name: "Homapal Magnetic Surface", collection: "Homapal", finish: "Magnetic Chalkboard" },
      { id: "fc-08", name: "Formica VIS Textured", collection: "VIS", finish: "Stone Effect" },
    ],
    catalogues: [
      { title: "FENIX Brochure", subtitle: "2024 Digital Edition", file: "Formica/2024-FENIX-brochure-digital.pdf" },
      { title: "Cora Printed Collection", subtitle: "Arrangement EN TH25", file: "Formica/Cora-Printed-Brochure-Arrangement-EN-TH25.pdf" },
      { title: "Decometal Catalogue", subtitle: "Full Collection", file: "Formica/Decometal-Catalogue-Final.pdf" },
      { title: "Formica Global Catalogue", subtitle: "V2 — Complete Range", file: "Formica/Formica-Global-Catalogue-V2.pdf" },
      { title: "ARPA Vis Brochure", subtitle: "2025 Edition", file: "Formica/arpa-vis-brochure_250122.pdf" },
    ],
  },
  {
    id: "loco",
    name: "Loco",
    code: "LC",
    num: "05",
    hero: "/brands/brand_5_1.png",
    logo: "/brands/brand_5_2.png",
    category: "FF&E",
    origin: "Italy",
    tagline: "Bespoke millwork & furniture",
    description:
      "Loco approaches furniture and millwork as spatial sculpture. Each piece is drawn from a rigorous Italian design process — where proportion, joinery, and material selection converge into objects that transcend trend. From bespoke reception counters to residential cabinetry, Loco delivers furniture with the permanence of architecture.",
    founded: "2010",
    collections: ["All", "Seating", "Tables", "Storage", "Millwork", "Lighting"],
    products: [
      { id: "lc-01", name: "Millwork Counter", collection: "Millwork", finish: "Walnut & Brass" },
      { id: "lc-02", name: "Lounge Chair", collection: "Seating", finish: "Bouclé" },
      { id: "lc-03", name: "Dining Table", collection: "Tables", finish: "Travertine Top" },
      { id: "lc-04", name: "Cabinet System", collection: "Storage", finish: "Lacquered" },
      { id: "lc-05", name: "Side Table", collection: "Tables", finish: "Marble & Steel" },
      { id: "lc-06", name: "Floor Lamp", collection: "Lighting", finish: "Matte Black" },
    ],
    catalogues: [],
  },
  {
    id: "falper",
    name: "Falper",
    code: "FP",
    num: "06",
    hero: "/brands/brand_6_1.png",
    logo: "/brands/brand_6_2.png",
    category: "Bathroom Fittings",
    origin: "Italy",
    tagline: "Luxury bath environments",
    description:
      "Falper transforms the bathroom into an intimate destination. Their complete bath collections — vanities, bathtubs, shower systems, and accessories — are conceived as unified environments rather than isolated fixtures. Italian manufacturing precision and a restrained material palette result in spaces of uncommon calm.",
    founded: "1990",
    collections: ["All", "Senzafine", "Minimum", "Edge Metal"],
    products: [
      { id: "fp-01", name: "Senzafine Vanity Cabinet", collection: "Senzafine", finish: "Matte Lacquer", tag: "Flagship" },
      { id: "fp-02", name: "Minimum Wall-mount Basin", collection: "Minimum", finish: "Solid Surface" },
      { id: "fp-03", name: "Edge Metal Sink Unit", collection: "Edge Metal", finish: "Stainless Steel" },
      { id: "fp-04", name: "Senzafine Freestanding Tub", collection: "Senzafine", finish: "Mineral Composite" },
      { id: "fp-05", name: "Minimum Mirror Cabinet", collection: "Minimum", finish: "Backlit LED" },
      { id: "fp-06", name: "Edge Metal Basin Shelf", collection: "Edge Metal", finish: "Brushed Brass" },
    ],
    catalogues: [],
  },
  {
    id: "fima",
    name: "Fima Carlo Frattini",
    code: "FM",
    num: "07",
    hero: "/brands/brand_7_1.png",
    logo: "/brands/brand_7_2.png",
    category: "Sanitary Fittings",
    origin: "Italy",
    tagline: "Refined tapware & accessories",
    description:
      "Fima Carlo Frattini has been sculpting water since 1945. Their tapware collections — basin mixers, thermostatic shower systems, and bath fillers — are machined from solid brass and finished by hand. The brand bridges Italian industrial heritage with contemporary minimalism, producing objects worthy of museum display.",
    founded: "1945",
    collections: ["All", "Basin Mixers", "Shower Systems", "Bath Fillers", "Accessories"],
    products: [
      { id: "fm-01", name: "Spillo Basin Mixer", collection: "Basin Mixers", finish: "Brushed Nickel" },
      { id: "fm-02", name: "Luce Thermostatic", collection: "Shower Systems", finish: "Chrome" },
      { id: "fm-03", name: "Bird Bath Filler", collection: "Bath Fillers", finish: "Matte Black" },
      { id: "fm-04", name: "Shower Head 300", collection: "Shower Systems", finish: "Rose Gold" },
      { id: "fm-05", name: "Soap Dispenser", collection: "Accessories", finish: "Polished Chrome" },
      { id: "fm-06", name: "Towel Rail", collection: "Accessories", finish: "Brushed Gold" },
    ],
    catalogues: [],
  },
  {
    id: "inkiostro-bianco",
    name: "Inkiostro Bianco",
    code: "IB",
    num: "08",
    hero: "/brands/brand_8_1.png",
    logo: "/brands/brand_8_2.png",
    category: "Decorative Surfaces",
    origin: "Italy",
    tagline: "Creative thinking surfaces",
    description:
      "Inkiostro Bianco is where art meets architecture. Their decorative wallcoverings, printed surfaces, and bespoke installations transform flat planes into narrative environments. With the 2026 Materia Prima collection, the brand pushes further into the territory of raw material — celebrating concrete, mineral, and organic textures rendered with extraordinary depth and resolution.",
    founded: "2008",
    collections: ["All", "Materia Prima", "Architectural", "Floral", "Geometric", "Bespoke"],
    products: [
      { id: "ib-01", name: "Materia Prima — Calce", collection: "Materia Prima", finish: "Mineral Matt", tag: "New 2026" },
      { id: "ib-02", name: "Materia Prima — Ferro", collection: "Materia Prima", finish: "Oxidised Metal" },
      { id: "ib-03", name: "Materia Prima — Pietra", collection: "Materia Prima", finish: "Natural Stone" },
      { id: "ib-04", name: "Botanical Wall", collection: "Floral", finish: "Digital Print" },
      { id: "ib-05", name: "Concrete Grid", collection: "Architectural", finish: "Raw Texture" },
      { id: "ib-06", name: "Hexagonal Pattern", collection: "Geometric", finish: "Metallic Ink" },
      { id: "ib-07", name: "Bespoke Mural", collection: "Bespoke", finish: "Custom", tag: "Custom" },
      { id: "ib-08", name: "Materia Prima — Legno", collection: "Materia Prima", finish: "Wood Grain" },
    ],
    catalogues: [
      { title: "Materia Prima 2026", subtitle: "Complete Surface Collection", file: "Inkiastro Bianco/CATALOGO_MATERIAPRIMA_2026_2a.pdf" },
    ],
  },
  {
    id: "mafi",
    name: "Mafi",
    code: "MF",
    num: "09",
    hero: "/brands/brand_9_1.png",
    logo: "/brands/brand_9_2.png",
    category: "Wooden Flooring",
    origin: "Austria",
    tagline: "Natural wood flooring",
    description:
      "Mafi brings the forest indoors. Their Austrian engineered wood floors are produced with painstaking attention to the grain, knot, and character of each plank — never homogenised, never fake. The Unique collection pairs ancient timber species with hand-rubbed natural oil finishes that develop a living patina. Flooring that improves with age.",
    founded: "1975",
    collections: ["All", "Solid", "Engineered", "Unique", "SPC"],
    products: [
      { id: "mf-01", name: "Mafi Oak Unique", collection: "Unique", finish: "Natural Oil", tag: "Bestseller" },
      { id: "mf-02", name: "Walnut Engineered", collection: "Engineered", finish: "Brushed + Oiled" },
      { id: "mf-03", name: "White Oak Solid", collection: "Solid", finish: "White Oil" },
      { id: "mf-04", name: "SPC Becker", collection: "SPC", finish: "Stone Polymer" },
      { id: "mf-05", name: "Ash Herringbone", collection: "Engineered", finish: "Smoked + Oiled" },
      { id: "mf-06", name: "Parkavanue Designer", collection: "Unique", finish: "Custom Inlay" },
    ],
    catalogues: [],
  },
  {
    id: "mirage",
    name: "Mirage",
    code: "MG",
    num: "10",
    hero: "/brands/brand_10_1.png",
    logo: "/brands/brand_10_2.png",
    category: "Tiles",
    origin: "Italy",
    tagline: "Porcelain tile mastery",
    description:
      "Mirage is Italy's benchmark for high-performance porcelain. Their collections push the limits of digital print technology to recreate the nuanced beauty of natural stone, clay, and mineral surfaces — with the durability and consistency that only porcelain can provide. From intimate residential floors to monumental public facades, Mirage tiles command space.",
    founded: "1992",
    collections: ["All", "Clay", "Elysian", "Elysian Travertini", "Glocal", "Indomita", "Izumi", "Jewels", "Jurupa"],
    products: [
      { id: "mg-01", name: "Clay — Terre", collection: "Clay", finish: "Natural", tag: "Earthy" },
      { id: "mg-02", name: "Elysian — Bianco", collection: "Elysian", finish: "Polished" },
      { id: "mg-03", name: "Elysian Travertini", collection: "Elysian Travertini", finish: "Structured" },
      { id: "mg-04", name: "Glocal Concrete", collection: "Glocal", finish: "Lappato" },
      { id: "mg-05", name: "Indomita Marmo", collection: "Indomita", finish: "Silktech", tag: "Bestseller" },
      { id: "mg-06", name: "Izumi Japanese", collection: "Izumi", finish: "Matt" },
      { id: "mg-07", name: "Jewels Onyx", collection: "Jewels", finish: "Glossy", tag: "Premium" },
      { id: "mg-08", name: "Jurupa Raw", collection: "Jurupa", finish: "Anti-slip" },
      { id: "mg-09", name: "Clay — Argilla", collection: "Clay", finish: "Soft" },
      { id: "mg-10", name: "Glocal Steel", collection: "Glocal", finish: "Brushed" },
    ],
    catalogues: [
      { title: "Clay Collection", file: "Mirage/catalogue-clay-pdf.pdf" },
      { title: "Elysian Collection", file: "Mirage/catalogue-elysian-pdf.pdf" },
      { title: "Elysian Travertini", file: "Mirage/catalogue-elysian-travertini-pdf.pdf" },
      { title: "Glocal Collection", file: "Mirage/catalogue-glocal-pdf.pdf" },
      { title: "Indomita Collection", file: "Mirage/catalogue-indomita-pdf.pdf" },
      { title: "Izumi Collection", file: "Mirage/catalogue-izumi-pdf.pdf" },
      { title: "Jewels 2.0", subtitle: "Precious Stone Series", file: "Mirage/catalogue-jewels-2-0-pdf.pdf" },
      { title: "Jurupa Collection", file: "Mirage/catalogue-jurupa-pdf.pdf" },
    ],
  },
];

export function getAllBrands(): Brand[] {
  return BRANDS;
}

export function getBrandById(id: string): Brand | undefined {
  return BRANDS.find((b) => b.id === id);
}

export function getBrandSlugs(): string[] {
  return BRANDS.map((b) => b.id);
}
