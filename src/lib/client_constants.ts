import { ProductItem } from "./types";

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
