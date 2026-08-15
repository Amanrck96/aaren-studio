export const BRAND_EXCEL_CATALOGS: Record<string, { title: string; subtitle?: string; file: string; url?: string; coverImage?: string; image?: string }[]> = {
  "mirage": [
    {
      "title": "Clay Collection Porcelain Slabs",
      "subtitle": "Resin Effect Porcelain Slabs (1200x2780mm)",
      "file": "/catalogs/catalogue-clay-pdf.pdf",
      "url": "/catalogs/catalogue-clay-pdf.pdf"
    },
    {
      "title": "Elysian Travertine Porcelain Slabs",
      "subtitle": "Italian Marble & Stone Porcelain Slabs",
      "file": "/catalogs/catalogue-clay-pdf.pdf",
      "url": "/catalogs/catalogue-clay-pdf.pdf"
    }
  ],
  "mafi": [
    {
      "title": "Mafi Austrian Natural Wood Flooring",
      "subtitle": "Hand-rubbed Natural Oil Timber Planks",
      "file": "/catalogs/catalogo60grados.pdf",
      "url": "/catalogs/catalogo60grados.pdf"
    }
  ],
  "inkiostrobianco": [
    {
      "title": "Materia Prima 2026 Wallcoverings",
      "subtitle": "Line-Art, Botanica & Wabi Sabi Murals",
      "file": "/catalogs/catalogo_materiaprima_2026_2a.pdf",
      "url": "/catalogs/catalogo_materiaprima_2026_2a.pdf"
    }
  ],
  "fima": [
    {
      "title": "Fima Carlo Frattini Tapware Suite",
      "subtitle": "Architectural Italian Thermostatic Shower Systems",
      "file": "/catalogs/catalogo-terre.pdf",
      "url": "/catalogs/catalogo-terre.pdf"
    }
  ],
  "falper": [
    {
      "title": "Falper Senzafine Luxury Vanities",
      "subtitle": "Italian Bath Environments & Cristalplant Basins",
      "file": "/catalogs/catalogo-sabil.pdf",
      "url": "/catalogs/catalogo-sabil.pdf"
    }
  ],
  "loco": [
    {
      "title": "Loco Bespoke Italian Millwork",
      "subtitle": "Spatial Sculpture & Craft Furniture",
      "file": "/catalogs/catalogo-vestige.pdf",
      "url": "/catalogs/catalogo-vestige.pdf"
    }
  ],
  "formica": [
    {
      "title": "FENIX Nano-Tech Surfaces",
      "subtitle": "Anti-Fingerprint Thermal Healing Laminates",
      "file": "/catalogs/arpa-vis-brochure_250122.pdf",
      "url": "/catalogs/arpa-vis-brochure_250122.pdf"
    },
    {
      "title": "ARPA VIS Technology High-Wear Surfaces",
      "subtitle": "20x Wear Resistant Mineral Engineered Surfaces",
      "file": "/catalogs/arpa-vis-brochure_250122.pdf",
      "url": "/catalogs/arpa-vis-brochure_250122.pdf"
    }
  ],
  "newtechwood": [
    {
      "title": "NewTechWood Outdoor WPC Decking",
      "subtitle": "360° Co-Extruded Capped Composite Cladding & Decking",
      "file": "/catalogs/arpa-vis-brochure_250122.pdf",
      "url": "/catalogs/arpa-vis-brochure_250122.pdf"
    }
  ],
  "waltz": [
    {
      "title": "Waltz Architectural Glass & Screens",
      "subtitle": "Frameless Partitions & Zipline Systems",
      "file": "/catalogs/catalogo60grados.pdf",
      "url": "/catalogs/catalogo60grados.pdf"
    }
  ],
  "slashform": [
    {
      "title": "Slashform Kitchen & Wardrobe Systems",
      "subtitle": "Italian Precision Architectural Living Systems",
      "file": "/catalogs/aquarelle.pdf",
      "url": "/catalogs/aquarelle.pdf"
    }
  ],
  "wow": [
    {
      "title": "60 Degrees Ceramic Tile Collection",
      "subtitle": "Contemporary Rhombus & Geometric Hexagon Series",
      "file": "/catalogs/catalogo60grados.pdf",
      "url": "/catalogs/catalogo60grados.pdf",
      "coverImage": "/catalogs/thumbnails/catalogo60grados_thumb.jpg"
    },
    {
      "title": "Bejmat Handcrafted Moroccan Tile Collection",
      "subtitle": "Traditional Glossy & Matte Hand-Moulded Zellige Series",
      "file": "/catalogs/catalogobejmat.pdf",
      "url": "/catalogs/catalogobejmat.pdf",
      "coverImage": "/catalogs/thumbnails/catalogobejmat_thumb.jpg"
    },
    {
      "title": "Nouvelle Inja Ceramic Collection",
      "subtitle": "Subtle Pastels, Relief Textures & Architectural Wall Finishes",
      "file": "/catalogs/catalogo-nouvelle.pdf",
      "url": "/catalogs/catalogo-nouvelle.pdf",
      "coverImage": "/catalogs/thumbnails/catalogo-nouvelle_thumb.jpg"
    },
    {
      "title": "Sabil Inja Luxury Wall Tile Collection",
      "subtitle": "Artisanal Glazes & Organic Earth Tone Surface Finishes",
      "file": "/catalogs/catalogo-sabil.pdf",
      "url": "/catalogs/catalogo-sabil.pdf",
      "coverImage": "/catalogs/thumbnails/catalogo-sabil_thumb.jpg"
    },
    {
      "title": "Terre Volumetric Architectural Tile Collection",
      "subtitle": "3D Sculptural Clay & Terracotta Expression Tiles",
      "file": "/catalogs/catalogo-terre.pdf",
      "url": "/catalogs/catalogo-terre.pdf",
      "coverImage": "/catalogs/thumbnails/catalogo-terre_thumb.jpg"
    },
    {
      "title": "Aquarelle & Bits Decorative Series",
      "subtitle": "Watercolour Washes & Contemporary Speckled Porcelain",
      "file": "/catalogs/aquarelle.pdf",
      "url": "/catalogs/aquarelle.pdf",
      "coverImage": "/catalogs/thumbnails/aquarelle_thumb.jpg"
    }
  ]
};

export type BrandCatalogue = {
  title: string;
  subtitle?: string;
  file: string; // path under /public/catalogues/
  url?: string;
  coverImage?: string;
  image?: string;
};

export type BrandProduct = {
  id: string;
  name: string;
  collection?: string;
  finish?: string;
  tag?: string;
  image?: string;
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
  accentColor?: string;
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
    catalogues: [
      { title: "Slashform Kitchen & Wardrobe Systems 2025", subtitle: "Italian Precision Architectural Living Systems", file: "Formica/Formica-Global-Catalogue-V2.pdf" },
    ],
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
    catalogues: [
      { title: "Waltz Architectural Glass & Screens 2025", subtitle: "Partitions, Zipline & Shower Systems", file: "NewTechWood/NewTechWood-Product-Catalog-2025.pdf" },
    ],
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
      { id: "nw-p7-01", name: "Antique Decking Board", collection: "Decking", finish: "Antique Wood Grain", tag: "PDF Page 7", image: "/brands/newtechwood/product_p7.png" },
      { id: "nw-p8-01", name: "Ipe Composite Decking", collection: "Decking", finish: "Ipe Wood Grain", tag: "PDF Page 8", image: "/brands/newtechwood/product_p8.png" },
      { id: "nw-p9-01", name: "Ipe Architectural Deck Board", collection: "Decking", finish: "Ipe Finish", tag: "PDF Page 9", image: "/brands/newtechwood/product_p9_ipe.png" },
      { id: "nw-p9-02", name: "Teak Composite Deck Plank", collection: "Decking", finish: "Teak Finish", tag: "PDF Page 9", image: "/brands/newtechwood/product_p9_teak.png" },
      { id: "nw-p10-01", name: "Antique Outdoor Pool Decking", collection: "Decking", finish: "Antique Finish", tag: "PDF Page 10", image: "/brands/newtechwood/product_p10_sa.png" },
      { id: "nw-p10-02", name: "Antique Patio Decking Board", collection: "Decking", finish: "Antique Grain", tag: "PDF Page 10", image: "/brands/newtechwood/product_p10_aus.png" },
      { id: "nw-p13-01", name: "UltraShield Capped Decking", collection: "Decking", finish: "360° Co-Extruded Cap", tag: "PDF Page 13", image: "/brands/newtechwood/product_p13.png" },
      { id: "nw-p13-02", name: "LEED Certified Composite Decking", collection: "Decking", finish: "Certified Eco WPC", tag: "PDF Page 13", image: "/brands/newtechwood/product_p13.png" },
      { id: "nw-p14-01", name: "Eco-Composite Recycled Decking", collection: "Decking", finish: "Recycled PE & Wood Fiber", tag: "PDF Page 14", image: "/brands/newtechwood/product_p14_eco.png" },
      { id: "nw-p14-02", name: "Ocean-Safe Closed-Loop Deck Plank", collection: "Decking", finish: "100% Recyclable WPC", tag: "PDF Page 14", image: "/brands/newtechwood/product_p14_ocean.png" },
      { id: "nw-01", name: "Naturale Solid Board (US01)", collection: "Decking", finish: "Flat Grain (138x22.5mm)", tag: "Flagship", image: "/brands/newtechwood/product_p216.png" },
      { id: "nw-05", name: "Marina Heavy Commercial Board (US71)", collection: "Decking", finish: "Anti-Slip Grain (210x36mm)", tag: "36 PTV Wet Slip", image: "/brands/newtechwood/product_p44.png" },
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
    catalogues: [
      { title: "Loco Bespoke Furniture & Millwork", subtitle: "Spatial Sculpture & Craft Architecture", file: "Formica/Decometal-Catalogue-Final.pdf" },
    ],
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
    catalogues: [
      { title: "Falper Luxury Bath Environments 2025", subtitle: "Italian Bathroom Furniture & Sanitaryware", file: "Mirage/catalogue-elysian-travertini-pdf.pdf" },
    ],
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
    catalogues: [
      { title: "Fima Carlo Frattini Tapware & Shower Systems", subtitle: "Sculpted Italian Water Architecture", file: "Mirage/catalogue-glocal-pdf.pdf" },
    ],
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
      { title: "Materia Prima 2026", subtitle: "Complete Surface Collection", file: "Formica/Formica-Global-Catalogue-V2.pdf" },
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
    catalogues: [
      { title: "Mafi Natural Wood Flooring Collection", subtitle: "Austrian Hand-crafted Natural Timber", file: "NewTechWood/NewTechWood-Product-Catalog-2025.pdf" },
    ],
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
      { title: "Elysian Collection", file: "Mirage/catalogue-elysian-travertini-pdf.pdf" },
      { title: "Elysian Travertini", file: "Mirage/catalogue-elysian-travertini-pdf.pdf" },
      { title: "Glocal Collection", file: "Mirage/catalogue-glocal-pdf.pdf" },
      { title: "Indomita Collection", file: "Mirage/catalogue-indomita-pdf.pdf" },
      { title: "Izumi Collection", file: "Mirage/catalogue-izumi-pdf.pdf" },
      { title: "Jewels 2.0", subtitle: "Precious Stone Series", file: "Mirage/catalogue-jewels-2-0-pdf.pdf" },
      { title: "Jurupa Collection", file: "Mirage/catalogue-jurupa-pdf.pdf" },
    ],
  },
  {
    id: "freedom-screens",
    name: "Freedom Screens",
    code: "FS",
    num: "11",
    hero: "/brands/brand_1_1.png",
    logo: "",
    category: "Outdoor Screens",
    origin: "Australia",
    tagline: "Infinite Zipline retractable screen systems",
    description:
      "Freedom Screens is Australia's leading innovator in motorised and manual retractable screen systems. The Infinite Zipline collection delivers architectural-grade outdoor screens for patios, pergolas, and facade applications — providing seamless control over light, privacy, and ventilation. Smart motorised and manual options available across residential and hospitality projects.",
    founded: "2008",
    collections: ["All", "Infinite Zip line", "Smart Motorised", "Smart Manual"],
    products: [
      { id: "fs-01", name: "Infinite Zipline Screen", collection: "Infinite Zip line", finish: "Charcoal Mesh" },
      { id: "fs-02", name: "Smart Motorised Outdoor Screen", collection: "Smart Motorised", finish: "White Mesh" },
      { id: "fs-03", name: "Manual Retractable Screen", collection: "Smart Manual", finish: "Grey Weave" },
      { id: "fs-04", name: "Zipline Patio Screen", collection: "Infinite Zip line", finish: "Bronze Mesh" },
    ],
    catalogues: [],
  },
  {
    id: "peelply",
    name: "Peelply",
    code: "PP",
    num: "12",
    hero: "/brands/brand_2_1.png",
    logo: "",
    category: "Plywood & Panels",
    origin: "India",
    tagline: "Premium plywood and engineered panel solutions",
    description:
      "Peelply offers a comprehensive range of high-quality plywood, blockboard, veneer, and flush door solutions engineered for premium interior applications. Their products meet the most demanding structural and aesthetic requirements, combining natural timber beauty with superior manufacturing precision for residential and commercial projects.",
    founded: "2000",
    collections: ["All", "Plywood", "Blockboard", "Veneer", "Flush Door"],
    products: [
      { id: "pp-01", name: "Calibrated Plywood", collection: "Plywood", finish: "Calibrated Sanded" },
      { id: "pp-02", name: "Blockboard Panel", collection: "Blockboard", finish: "Smooth Face" },
      { id: "pp-03", name: "Natural Veneer Sheet", collection: "Veneer", finish: "Natural Grain" },
      { id: "pp-04", name: "Premium Flush Door", collection: "Flush Door", finish: "Painted Ready" },
    ],
    catalogues: [],
  },
  {
    id: "inclass",
    name: "Inclass",
    code: "IC",
    num: "13",
    hero: "/brands/brand_3_1.png",
    logo: "",
    category: "Furniture",
    origin: "Spain",
    tagline: "Innovative seating and MillWork solutions",
    description:
      "Inclass is a Spanish furniture brand celebrated for its architectural approach to seating and millwork. Rooted in a design-first philosophy, their collections bridge the gap between sculptural craft and functional precision — making them the choice for premium hospitality, corporate, and residential environments seeking furniture with genuine character.",
    founded: "1995",
    collections: ["All", "Seating", "MillWork", "Lounge"],
    products: [
      { id: "ic-01", name: "Arco Chair", collection: "Seating", finish: "Natural Oak" },
      { id: "ic-02", name: "Milwork Wall Panel", collection: "MillWork", finish: "White Lacquer" },
      { id: "ic-03", name: "Lounge Armchair", collection: "Lounge", finish: "Fabric Upholstery" },
      { id: "ic-04", name: "Conference Chair", collection: "Seating", finish: "Black Mesh" },
    ],
    catalogues: [],
  },
  {
    id: "wow",
    name: "WOW",
    code: "WW",
    num: "14",
    hero: "/brands/brand_4_1.png",
    logo: "",
    category: "Tiles",
    origin: "Spain",
    tagline: "Architectural 3D decorative ceramic collections",
    description:
      "WOW is a Spanish ceramic tile brand that has redefined the language of wall surfaces. Combining traditional craft with digital precision, WOW produces 3D dimensional tiles, handcrafted bejmat tiles, and bold geometric collections that transform walls into architectural statements. Their Highlighter Tiles collection is especially sought-after for feature walls and facade accents.",
    founded: "2010",
    collections: ["All", "3D Tiles", "Highlighter Tiles", "Bejmat", "Pool Area"],
    products: [
      { id: "ww-01", name: "3D Bars Ceramic Tile", collection: "3D Tiles", finish: "Gloss Terracotta", tag: "Bestseller" },
      { id: "ww-02", name: "Highlighter Feature Tile", collection: "Highlighter Tiles", finish: "Matte Gold" },
      { id: "ww-03", name: "Bejmat Classic", collection: "Bejmat", finish: "Handcrafted Gloss" },
      { id: "ww-04", name: "Pool Area Tile", collection: "Pool Area", finish: "Anti-slip Aqua" },
      { id: "ww-05", name: "Chevron Geometric", collection: "Highlighter Tiles", finish: "White Matte" },
    ],
    catalogues: [],
  },
  {
    id: "iww",
    name: "IWW",
    code: "IW",
    num: "15",
    hero: "/brands/brand_5_1.png",
    logo: "",
    category: "Tiles & Surfaces",
    origin: "Italy",
    tagline: "Premium Italian stone surface collections",
    description:
      "IWW delivers premium Italian stone-effect porcelain surfaces, large-format tiles, and architectural wall covering systems for both residential and commercial interiors. Their Décor Tiles and 3mm ultra-thin slab collections represent the forefront of Italian ceramic engineering — combining extraordinary visual fidelity with lightweight installation advantages.",
    founded: "2005",
    collections: ["All", "Surface Tiles", "Décor Tiles", "3mm Tiles", "Façade Tiles"],
    products: [
      { id: "iw-01", name: "Large Format Surface Tile", collection: "Surface Tiles", finish: "Polished Marble Effect" },
      { id: "iw-02", name: "Décor Feature Tile", collection: "Décor Tiles", finish: "Textured Matte" },
      { id: "iw-03", name: "3mm Ultra-Thin Slab", collection: "3mm Tiles", finish: "Stone Matte" },
      { id: "iw-04", name: "Façade Cladding Tile", collection: "Façade Tiles", finish: "Outdoor Grip" },
    ],
    catalogues: [],
  },
  {
    id: "living-ceramica",
    name: "Living Ceramica",
    code: "LC",
    num: "16",
    hero: "/brands/brand_6_1.png",
    logo: "",
    category: "Tiles & Sanitaryware",
    origin: "Italy",
    tagline: "Contemporary Italian ceramic surface collections",
    description:
      "Living Ceramica is an Italian ceramic specialist offering a refined portfolio of surface tiles and sanitaryware for premium residential and hospitality environments. Their collections are characterised by considered proportions, natural material references, and a restrained Italian aesthetic that integrates effortlessly into architectural interiors.",
    founded: "1988",
    collections: ["All", "Surface Tiles", "Sanitaryware", "Outdoor Tiles"],
    products: [
      { id: "lc-01", name: "Travertine Surface Tile", collection: "Surface Tiles", finish: "Honed Natural" },
      { id: "lc-02", name: "Wall Basin", collection: "Sanitaryware", finish: "Gloss White" },
      { id: "lc-03", name: "Outdoor Terrace Tile", collection: "Outdoor Tiles", finish: "Anti-slip Stone" },
      { id: "lc-04", name: "Marble Effect Floor Tile", collection: "Surface Tiles", finish: "Polished" },
    ],
    catalogues: [],
  },
  {
    id: "florim",
    name: "Florim",
    code: "FL",
    num: "17",
    hero: "/brands/brand_7_1.png",
    logo: "",
    category: "Tiles",
    origin: "Italy",
    tagline: "Large format Italian porcelain slab mastery",
    description:
      "Florim is one of Italy's most innovative porcelain manufacturers, producing large-format slabs and architectural tiles with an emphasis on sustainable production. Their Surface Tiles and Décor Tiles collections offer extraordinary material fidelity — from natural stone reproductions to abstract mineral effects — suited to residential floors, walls, and monumental facades.",
    founded: "1962",
    collections: ["All", "Surface Tiles", "Décor Tiles", "Outdoor Tiles"],
    products: [
      { id: "fl-01", name: "Platinum Stone Slab", collection: "Surface Tiles", finish: "Polished Marble" },
      { id: "fl-02", name: "Décor Feature Tile", collection: "Décor Tiles", finish: "Relief Texture" },
      { id: "fl-03", name: "Outdoor Gravity Tile", collection: "Outdoor Tiles", finish: "Grip Finish" },
      { id: "fl-04", name: "Large Format Porcelain", collection: "Surface Tiles", finish: "Lappato" },
    ],
    catalogues: [],
  },
  {
    id: "gelli",
    name: "Gelli",
    code: "GL",
    num: "18",
    hero: "/brands/brand_8_1.png",
    logo: "",
    category: "Bathroom Accessories",
    origin: "Italy",
    tagline: "Premium Italian bathroom accessories",
    description:
      "Gelli specialises in meticulously crafted Italian bathroom accessories and wellness products. Their collections bring refined details to the bathroom environment — from precision-engineered towel rails and robe hooks to bespoke mirror frames and vanity accessories — completing the luxury bathroom experience with Italian manufacturing excellence.",
    founded: "2001",
    collections: ["All", "Bathroom Accessories", "Wellness"],
    products: [
      { id: "gl-01", name: "Towel Rail Set", collection: "Bathroom Accessories", finish: "Brushed Gold" },
      { id: "gl-02", name: "Robe Hook", collection: "Bathroom Accessories", finish: "Matte Black" },
      { id: "gl-03", name: "Wellness Shower Panel", collection: "Wellness", finish: "Polished Chrome" },
      { id: "gl-04", name: "Vanity Mirror Frame", collection: "Bathroom Accessories", finish: "Brushed Nickel" },
    ],
    catalogues: [],
  },
  {
    id: "jacuzzi",
    name: "Jacuzzi",
    code: "JZ",
    num: "19",
    hero: "/brands/brand_9_1.png",
    logo: "",
    category: "Wellness",
    origin: "USA",
    tagline: "World-class wellness and whirlpool systems",
    description:
      "Jacuzzi is the world's original wellness brand — inventor of the whirlpool bath and pioneer of hydrotherapy design. From freestanding soaking tubs and chromotherapy shower systems to full spa installations, Jacuzzi products transform the bathroom into a sanctuary of restoration. Trusted by luxury hospitality groups and discerning homeowners for over 60 years.",
    founded: "1956",
    collections: ["All", "Wellness", "Bathtub", "Sanitaryware"],
    products: [
      { id: "jz-01", name: "J-LH5943 Hydrotherapy Tub", collection: "Wellness", finish: "Gloss White", tag: "Flagship" },
      { id: "jz-02", name: "Chromotherapy Bath System", collection: "Wellness", finish: "LED Integrated" },
      { id: "jz-03", name: "Freestanding Soaking Tub", collection: "Bathtub", finish: "Matte White" },
      { id: "jz-04", name: "Compact Walk-in Bath", collection: "Bathtub", finish: "Gloss White" },
      { id: "jz-05", name: "Integrated Sanitaryware Suite", collection: "Sanitaryware", finish: "White Ceramic" },
    ],
    catalogues: [],
  },
  {
    id: "alex-turco",
    name: "Alex Turco",
    code: "AT",
    num: "20",
    hero: "/brands/brand_10_1.png",
    logo: "",
    category: "Wall Art Panels",
    origin: "Italy",
    tagline: "Exclusive Italian wall art and decorative panels",
    description:
      "Alex Turco creates bespoke Italian wall art panels that occupy the intersection of architecture and fine art. Each piece is produced using a proprietary aluminium composite technology that allows extraordinary dimensional detail, vibrant colour depth, and architectural-scale installations. From residential feature walls to luxury hotel lobbies, Alex Turco transforms flat surfaces into immersive spatial experiences.",
    founded: "2009",
    collections: ["All", "Wall Art Panels", "Feature Walls", "Custom"],
    products: [
      { id: "at-01", name: "Geometric Relief Panel", collection: "Wall Art Panels", finish: "Brushed Gold Leaf", tag: "Signature" },
      { id: "at-02", name: "Abstract Surface Artwork", collection: "Feature Walls", finish: "Metallic Print" },
      { id: "at-03", name: "Custom Mural Panel", collection: "Custom", finish: "Bespoke Finish" },
      { id: "at-04", name: "Architectural Relief Installation", collection: "Wall Art Panels", finish: "Matte Lacquer" },
    ],
    catalogues: [],
  },
];


export function getAllBrands(): Brand[] {
  return BRANDS;
}

export function getBrandById(id: string): Brand | undefined {
  const brand = BRANDS.find((b) => b.id === id || b.name.toLowerCase() === id.toLowerCase());
  if (!brand) return undefined;
  const key = brand.name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const excelCats = BRAND_EXCEL_CATALOGS[key] || BRAND_EXCEL_CATALOGS[id.toLowerCase().replace(/[^a-z0-9]/g, "")];
  if (excelCats && excelCats.length > 0) {
    return {
      ...brand,
      catalogues: excelCats,
    };
  }
  return brand;
}

export function getBrandSlugs(): string[] {
  return BRANDS.map((b) => b.id);
}
