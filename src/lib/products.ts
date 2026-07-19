export type ProductLine = {
  id: string;
  name: string;
  brand: string;
  brandId: string;
  subcategory: string;
  finish?: string;
  tag?: string;
  description?: string;
};

export type RelatedBrand = {
  id: string;
  name: string;
  logo: string;
};

export type ProductCategory = {
  id: string;
  code: string;
  num: string;
  name: string;
  hero: string;
  description: string;
  subcategories: string[];
  finishes: string[];
  relatedBrands: RelatedBrand[];
  lines: ProductLine[];
};

const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: "plywood",
    code: "PW",
    num: "01",
    name: "Plywood",
    hero: "/categories/cat_1.png",
    description:
      "Precision-engineered plywood and blockboard solutions for structural, furniture, and interior applications. Each sheet is selected for consistency of core, face veneer clarity, and long-term dimensional stability.",
    subcategories: ["All", "Plywood", "Blockboard"],
    finishes: ["PEEL PLY", "BWR", "Birch"],
    relatedBrands: [],
    lines: [
      { id: "pw-01", name: "Plywood PEEL PLY", brand: "Curated", brandId: "", subcategory: "Plywood", finish: "PEEL PLY", description: "High-grade plywood with peel-ply surface for adhesive bonding" },
      { id: "pw-02", name: "Blockboard PEEL PLY", brand: "Curated", brandId: "", subcategory: "Blockboard", finish: "PEEL PLY", description: "Solid blockboard core with peel-ply face, ideal for shuttering" },
    ],
  },
  {
    id: "laminate",
    code: "LM",
    num: "02",
    name: "Laminate",
    hero: "/categories/cat_2.png",
    description:
      "A curated selection of high-pressure laminates, veneers, and decorative surfaces from the world's leading manufacturers. From the nano-tech perfection of FENIX to the organic warmth of ALPI veneer — every finish tells a material story.",
    subcategories: ["All", "Veneers", "Laminates", "Decoratives"],
    finishes: ["Matte", "Gloss", "Texture", "Metallic", "Wood Effect"],
    relatedBrands: [
      { id: "formica", name: "Formica", logo: "/brands/brand_4_2.png" },
    ],
    lines: [
      { id: "lm-01", name: "Veneers INCLASS", brand: "INCLASS", brandId: "", subcategory: "Veneers", finish: "Natural", description: "Real wood veneer sheets in curated species" },
      { id: "lm-02", name: "Veneers ALPI", brand: "ALPI", brandId: "", subcategory: "Veneers", finish: "Engineered", description: "Sustainably engineered wood veneers in exotic patterns" },
      { id: "lm-03", name: "Laminates INCLASS", brand: "INCLASS", brandId: "", subcategory: "Laminates", finish: "HPL", description: "High-pressure laminates in 200+ finishes" },
      { id: "lm-04", name: "Decoratives INCLASS", brand: "INCLASS", brandId: "", subcategory: "Decoratives", finish: "Specialty", description: "Decorative surfaces with unique visual effects" },
      { id: "lm-05", name: "FENIX NTM®", brand: "Formica", brandId: "formica", subcategory: "Laminates", finish: "Nano-tech Matte", tag: "Premium", description: "Revolutionary anti-fingerprint matte laminate surface" },
      { id: "lm-06", name: "Decometal", brand: "Formica", brandId: "formica", subcategory: "Decoratives", finish: "Metallic", description: "Hyper-realistic metal effect laminates" },
    ],
  },
  {
    id: "facade",
    code: "FC",
    num: "03",
    name: "Facade",
    hero: "/categories/cat_3.png",
    description:
      "Exterior facade systems that balance architectural ambition with material endurance. WPC composites, thermally modified timber, and engineered cladding profiles designed to perform beautifully through decades of weather.",
    subcategories: ["All", "Timber", "WPC", "Composite"],
    finishes: ["Charcoal", "Natural", "Teak", "Grey", "Antique"],
    relatedBrands: [
      { id: "newtech-wood", name: "Newtech Wood", logo: "/brands/brand_3_2.png" },
    ],
    lines: [
      { id: "fc-01", name: "Wood Thermory", brand: "Thermory", brandId: "", subcategory: "Timber", finish: "Thermally Modified", description: "Nordic thermally modified timber for exterior cladding" },
      { id: "fc-02", name: "Wood Tali Deck", brand: "Newtech Wood", brandId: "newtech-wood", subcategory: "Timber", finish: "Hardwood", description: "Dense hardwood decking with natural oils" },
      { id: "fc-03", name: "WPC NEWTECH", brand: "Newtech Wood", brandId: "newtech-wood", subcategory: "WPC", finish: "Composite", tag: "Weather-Proof", description: "High-durability WPC for facades and decks" },
    ],
  },
  {
    id: "wooden-flooring",
    code: "WF",
    num: "04",
    name: "Wooden Flooring",
    hero: "/categories/cat_4.png",
    description:
      "From solid hardwood to engineered planks and stone-polymer cores — our flooring collection spans the full spectrum of wood aesthetics and technical performance. Every floor is selected for its visual authenticity and long-term stability.",
    subcategories: ["All", "Solid", "Engineered", "SPC", "Laminated", "Designer"],
    finishes: ["Natural Oil", "White Oil", "Smoked", "Brushed", "UV Lacquer"],
    relatedBrands: [
      { id: "mafi", name: "Mafi", logo: "/brands/brand_9_2.png" },
    ],
    lines: [
      { id: "wf-01", name: "Solid Curated", brand: "Curated", brandId: "", subcategory: "Solid", finish: "Natural Oil", description: "Hand-selected solid wood planks in premium species" },
      { id: "wf-02", name: "Laminated Unique", brand: "Mafi", brandId: "mafi", subcategory: "Laminated", finish: "Brushed", description: "Mafi's unique laminated boards with natural oil finish" },
      { id: "wf-03", name: "SPC Becker", brand: "Becker", brandId: "", subcategory: "SPC", finish: "Stone Polymer", description: "100% waterproof SPC core with realistic wood visuals" },
      { id: "wf-04", name: "Engineered Mafi", brand: "Mafi", brandId: "mafi", subcategory: "Engineered", finish: "White Oil", tag: "Bestseller", description: "Mafi engineered planks — Austrian precision, natural beauty" },
      { id: "wf-05", name: "Designer Parkavanue", brand: "Parkavanue", brandId: "", subcategory: "Designer", finish: "Custom Inlay", description: "Bespoke parquet patterns and custom wood inlay" },
    ],
  },
  {
    id: "screens",
    code: "SS",
    num: "05",
    name: "Screens",
    hero: "/categories/cat_5.png",
    description:
      "Architectural screen solutions that redefine the boundary between inside and outside, private and public. Zipline tensioned fabric systems create dynamic, lightweight enclosures that breathe with the breeze.",
    subcategories: ["All", "Zipline", "Fabric", "Tensile"],
    finishes: ["White", "Charcoal", "Custom"],
    relatedBrands: [
      { id: "waltz", name: "Waltz by JB Glass", logo: "/brands/brand_2_2.png" },
    ],
    lines: [
      { id: "ss-01", name: "Zipline System", brand: "Waltz", brandId: "waltz", subcategory: "Zipline", finish: "Tensile Fabric", tag: "Custom Sizes", description: "Motorised or manual tensile screen system for terraces and windows" },
    ],
  },
  {
    id: "door-system",
    code: "DS",
    num: "06",
    name: "Door System",
    hero: "/categories/cat_6.png",
    description:
      "Integrated door systems that merge structure with aesthetics. Whether aluminium profiles for commercial scale or Slashform's precision-engineered residential pivots, every system is designed to disappear into the wall.",
    subcategories: ["All", "Aluminium", "Timber"],
    finishes: ["Anodised", "Powder Coat", "Smoked Glass", "Lacquered"],
    relatedBrands: [
      { id: "slashform", name: "Slashform", logo: "/brands/brand_1_2.png" },
    ],
    lines: [
      { id: "ds-01", name: "Aluminum System", brand: "Curated", brandId: "", subcategory: "Aluminium", finish: "Anodised", description: "Commercial-grade aluminium door frames and profiles" },
      { id: "ds-02", name: "Slashform System", brand: "Slashform", brandId: "slashform", subcategory: "Timber", finish: "Lacquered", tag: "Precision", description: "Slashform integrated door systems with flush profile detailing" },
    ],
  },
  {
    id: "doors",
    code: "WD",
    num: "07",
    name: "Doors",
    hero: "/categories/cat_7.png",
    description:
      "Entry statements and interior partitions — our door collection spans hand-crafted timber, flush-lacquered panels, and veneered units that complement the broader interior narrative.",
    subcategories: ["All", "Wooden", "Laminated"],
    finishes: ["Solid Timber", "Veneer", "Lacquered", "Textured"],
    relatedBrands: [],
    lines: [
      { id: "wd-01", name: "Wooden Doors", brand: "Curated", brandId: "", subcategory: "Wooden", finish: "Solid Timber", description: "Solid wood doors in premium hardwood species" },
      { id: "wd-02", name: "Laminated Doors", brand: "Curated", brandId: "", subcategory: "Laminated", finish: "HPL Face", description: "HPL-faced flush doors for contemporary interiors" },
    ],
  },
  {
    id: "windows",
    code: "WW",
    num: "08",
    name: "Windows",
    hero: "/categories/cat_8.png",
    description:
      "Window systems engineered for India's climate — combining thermal efficiency, acoustic performance, and architectural elegance. Timber and aluminium profiles in heritage and contemporary profiles.",
    subcategories: ["All", "Wooden", "Aluminium"],
    finishes: ["Natural Timber", "Painted", "Anodised", "Powder Coat"],
    relatedBrands: [],
    lines: [
      { id: "ww-01", name: "Wooden Windows", brand: "Curated", brandId: "", subcategory: "Wooden", finish: "Natural Timber", description: "Hardwood window frames with double-glazing options" },
      { id: "ww-02", name: "Aluminum Windows", brand: "Curated", brandId: "", subcategory: "Aluminium", finish: "Anodised", description: "Slim-profile aluminium windows for contemporary facades" },
    ],
  },
  {
    id: "kitchen",
    code: "KK",
    num: "09",
    name: "Kitchen",
    hero: "/categories/cat_9.png",
    description:
      "Kitchen systems where culinary function meets spatial precision. Slashform's K+W programme brings Italian engineering to Indian homes — with integrated appliance bays, flush-pull handles, and surfaces selected to withstand serious cooking.",
    subcategories: ["All", "K+W", "Island", "Handles"],
    finishes: ["Matte Lacquer", "High Gloss", "Stone", "Timber", "Metal"],
    relatedBrands: [
      { id: "slashform", name: "Slashform", logo: "/brands/brand_1_2.png" },
    ],
    lines: [
      { id: "kk-01", name: "K+W Kitchen", brand: "K+W", brandId: "", subcategory: "K+W", finish: "Matte Lacquer", description: "Full modular kitchen system with European hardware" },
      { id: "kk-02", name: "Slashform K+W", brand: "Slashform", brandId: "slashform", subcategory: "K+W", finish: "FENIX NTM®", tag: "Premium", description: "Slashform-designed kitchen with FENIX nano-tech surfaces" },
    ],
  },
  {
    id: "wardrobe",
    code: "WW",
    num: "10",
    name: "Wardrobe",
    hero: "/categories/cat_10.png",
    description:
      "Walk-in wardrobes and integrated closet systems conceived as extensions of the bedroom architecture. Every component — rail, shelf, mirror, and lighting — is resolved into a unified spatial experience.",
    subcategories: ["All", "Walk-In", "Sliding", "Swing"],
    finishes: ["Lacquered", "Veneer", "Glass", "Fabric"],
    relatedBrands: [
      { id: "slashform", name: "Slashform", logo: "/brands/brand_1_2.png" },
    ],
    lines: [
      { id: "wrd-01", name: "Freedom Screen", brand: "Curated", brandId: "", subcategory: "Sliding", finish: "Glass", description: "Sliding glass-door wardrobe with integrated lighting" },
      { id: "wrd-02", name: "Slashform D+W", brand: "Slashform", brandId: "slashform", subcategory: "Walk-In", finish: "Lacquered", tag: "Flagship", description: "Slashform walk-in wardrobe — precision Italian engineering" },
    ],
  },
  {
    id: "furniture",
    code: "FF",
    num: "11",
    name: "Furniture",
    hero: "/categories/cat_11.png",
    description:
      "Furniture as architecture — pieces that hold space with the same authority as the walls they inhabit. From Madheke's handcrafted sofas to Taamaa's considered lighting and Loco's bespoke millwork, each piece is a deliberate material statement.",
    subcategories: ["All", "Sofas", "Tables", "Lighting", "Storage", "Millwork"],
    finishes: ["Fabric", "Leather", "Timber", "Metal", "Marble"],
    relatedBrands: [
      { id: "loco", name: "Loco", logo: "/brands/brand_5_2.png" },
    ],
    lines: [
      { id: "ff-01", name: "Furniture Madheke", brand: "Madheke", brandId: "", subcategory: "Sofas", finish: "Fabric & Leather", description: "Handcrafted sofas and seating from Madheke" },
      { id: "ff-02", name: "Furniture Taamaa", brand: "Taamaa", brandId: "", subcategory: "Lighting", finish: "Custom", description: "Considered lighting objects from Taamaa" },
      { id: "ff-03", name: "Millwork LOCO", brand: "Loco", brandId: "loco", subcategory: "Millwork", finish: "Walnut & Brass", tag: "Bespoke", description: "Bespoke millwork and furniture from Italian brand Loco" },
    ],
  },
  {
    id: "tiles",
    code: "TL",
    num: "12",
    name: "Tiles",
    hero: "/categories/cat_12.png",
    description:
      "Porcelain, ceramic, and natural stone tiles curated for floors, walls, and facades. Mirage's digital print mastery recreates the depth of marble, travertine, and mineral surfaces with the technical precision of Italian porcelain.",
    subcategories: ["All", "Floorings & Walls", "Decorative", "20mm Outdoor", "Terrazzo & Terracotta", "Swimming Pool", "Façade"],
    finishes: ["Polished", "Lappato", "Natural", "Structured", "Anti-slip"],
    relatedBrands: [
      { id: "mirage", name: "Mirage", logo: "/brands/brand_10_2.png" },
    ],
    lines: [
      { id: "tl-01", name: "Floorings & Walls", brand: "Mirage", brandId: "mirage", subcategory: "Floorings & Walls", finish: "Polished", description: "Full range of floor and wall tiles in porcelain" },
      { id: "tl-02", name: "Decorative", brand: "Mirage", brandId: "mirage", subcategory: "Decorative", finish: "Lappato", description: "Accent and decorative tile collections" },
      { id: "tl-03", name: "20mm Outdoor", brand: "Mirage", brandId: "mirage", subcategory: "20mm Outdoor", finish: "Anti-slip", tag: "Outdoor", description: "20mm porcelain slabs for outdoor terraces and paths" },
      { id: "tl-04", name: "Terrazzo & Terracotta", brand: "Curated", brandId: "", subcategory: "Terrazzo & Terracotta", finish: "Natural", description: "Handcrafted terrazzo and terracotta tiles" },
      { id: "tl-05", name: "Swimming Pool", brand: "Curated", brandId: "", subcategory: "Swimming Pool", finish: "Anti-slip Mosaic", description: "Pool-grade mosaic and porcelain tiles" },
      { id: "tl-06", name: "Façade Tiles", brand: "Mirage", brandId: "mirage", subcategory: "Façade", finish: "Structured", description: "Large-format porcelain slabs for exterior facades" },
    ],
  },
  {
    id: "bathroom-fittings",
    code: "BF",
    num: "13",
    name: "Bathroom Fittings",
    hero: "/categories/cat_13.png",
    description:
      "A curated collection of bathroom furniture, basins, bathtubs, and accessories from Italy's finest. Falper, FIMA, and MILDUE represent the pinnacle of bath environment design — where function dissolves into ritual.",
    subcategories: ["All", "Vanities", "Bathtubs", "Shower", "Accessories"],
    finishes: ["Chrome", "Brushed Nickel", "Matte Black", "Brushed Gold", "Brass"],
    relatedBrands: [
      { id: "falper", name: "Falper", logo: "/brands/brand_6_2.png" },
      { id: "fima", name: "Fima Carlo Frattini", logo: "/brands/brand_7_2.png" },
    ],
    lines: [
      { id: "bf-01", name: "FIMA Tapware", brand: "Fima Carlo Frattini", brandId: "fima", subcategory: "Shower", finish: "Brushed Nickel", tag: "Flagship", description: "Complete tapware range from Fima Carlo Frattini" },
      { id: "bf-02", name: "FALPER Vanities", brand: "Falper", brandId: "falper", subcategory: "Vanities", finish: "Lacquered", description: "Italian bathroom furniture and vanity systems" },
      { id: "bf-03", name: "MILDUE Accessories", brand: "MILDUE", brandId: "", subcategory: "Accessories", finish: "Brass", description: "Luxury bathroom accessories and hardware" },
    ],
  },
  {
    id: "sanitary-ware",
    code: "SW",
    num: "14",
    name: "Sanitary Ware",
    hero: "/categories/cat_14.png",
    description:
      "Sanitary ware elevated to the status of sculptural objects. IWW, Flaminia, and Antonio Lupi approach the basin, WC, and bidet as opportunities for form — each piece resolved with the rigour of contemporary design thinking.",
    subcategories: ["All", "Basins", "WC", "Bidet", "Baths"],
    finishes: ["White", "Matte", "Coloured Glaze", "Solid Surface"],
    relatedBrands: [],
    lines: [
      { id: "sw-01", name: "IWW Collection", brand: "IWW", brandId: "", subcategory: "Basins", finish: "White Ceramic", description: "IWW ceramic basins and sanitary ware" },
      { id: "sw-02", name: "FLAMINIA", brand: "Flaminia", brandId: "", subcategory: "WC", finish: "Matte", description: "Italian designer WC and bidet from Flaminia" },
      { id: "sw-03", name: "ANTONIOLUPI", brand: "Antonio Lupi", brandId: "", subcategory: "Baths", finish: "Solid Surface", tag: "Luxury", description: "Sculptural baths and basins from Antonio Lupi" },
    ],
  },
  {
    id: "mirrors",
    code: "MR",
    num: "15",
    name: "Mirrors",
    hero: "/categories/cat_15.png",
    description:
      "Mirrors that expand space and define light. From GELLI's precision accessories to Waltz's architectural glass mirrors, each piece is considered as a spatial element — not a mere reflective surface.",
    subcategories: ["All", "Framed", "Frameless", "LED", "Accessories"],
    finishes: ["Clear", "Bronze", "Smoked", "Backlit"],
    relatedBrands: [
      { id: "waltz", name: "Waltz by JB Glass", logo: "/brands/brand_2_2.png" },
    ],
    lines: [
      { id: "mr-01", name: "Mira Mirrors", brand: "Mira", brandId: "", subcategory: "Frameless", finish: "Clear", description: "Frameless architectural mirrors in custom sizes" },
      { id: "mr-02", name: "Accessories GELLI", brand: "GELLI", brandId: "", subcategory: "Accessories", finish: "Brushed Brass", description: "Precision glass accessories and mirror frames" },
      { id: "mr-03", name: "WALTZ Glass Mirrors", brand: "Waltz by JB Glass", brandId: "waltz", subcategory: "Frameless", finish: "Bronze", tag: "Architectural", description: "Architectural glass mirrors from Waltz by JB Glass" },
    ],
  },
];

export function getAllCategories(): ProductCategory[] {
  return PRODUCT_CATEGORIES;
}

export function getCategoryById(id: string): ProductCategory | undefined {
  return PRODUCT_CATEGORIES.find((c) => c.id === id);
}

export function getCategorySlugs(): string[] {
  return PRODUCT_CATEGORIES.map((c) => c.id);
}
