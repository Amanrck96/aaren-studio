"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";

const productCategories = [
  {
    id: "plywood",
    name: "Plywood",
    icon: "🪵",
    subcategories: [
      { name: "Plywood PEEL PLY", description: "High-quality structural plywood for premium interiors." },
      { name: "Blockboard PEEL PLY", description: "Lightweight core blockboard for furniture and partitions." },
    ],
  },
  {
    id: "decorative-surfaces",
    name: "Decorative Surfaces",
    icon: "✦",
    subcategories: [
      { name: "Veneers INCLASS", description: "Curated natural wood veneers for refined architectural surfaces." },
      { name: "Veneers ALPI", description: "Engineered and exotic veneers in premium collections." },
      { name: "Laminates INCLASS", description: "High-pressure laminates with stunning texture and depth." },
      { name: "Decoratives INCLASS", description: "Designer surface finishing solutions for luxury spaces." },
    ],
  },
  {
    id: "cladding-decking",
    name: "Cladding & Decking",
    icon: "▦",
    subcategories: [
      { name: "Wood Thermory", description: "Thermally modified timber for durable indoor/outdoor cladding." },
      { name: "Wood Tali Deck", description: "Premium tropical hardwood decking for exteriors." },
      { name: "WPC NEWTECH", description: "Wood Plastic Composite for modern decking systems." },
    ],
  },
  {
    id: "wooden-flooring",
    name: "Wooden Flooring",
    icon: "▬",
    subcategories: [
      { name: "Solid Curated", description: "Handpicked solid wood flooring for luxury residences." },
      { name: "Laminated Unique", description: "Premium laminated wood flooring with authentic textures." },
      { name: "SPC Becker", description: "Stone Polymer Composite flooring — waterproof and durable." },
      { name: "Engineered Mafi", description: "European engineered hardwood with natural oil finishes." },
      { name: "Designer Parkavanue", description: "Bespoke designer flooring patterns and inlays." },
    ],
  },
  {
    id: "screens",
    name: "Screens",
    icon: "⊟",
    subcategories: [
      { name: "Zipline", description: "Precision-engineered screen systems for interiors and facades." },
    ],
  },
  {
    id: "doors-windows",
    name: "Doors + Windows",
    icon: "□",
    subcategories: [
      { name: "Wooden Doors", description: "Solid and engineered wooden door systems." },
      { name: "Laminated Doors", description: "High-gloss and matte laminated door collections." },
      { name: "Wooden Windows", description: "Timber frame windows with superior insulation." },
      { name: "Aluminum Windows", description: "Slim-profile aluminum window systems." },
    ],
  },
  {
    id: "kitchen-wardrobe",
    name: "Kitchen & Wardrobe",
    icon: "⊞",
    subcategories: [
      { name: "K+W", description: "Complete kitchen and wardrobe fitout solutions." },
      { name: "Freedom Screen", description: "Modular wardrobe screening systems." },
      { name: "Slashform D+W", description: "Contemporary door and wardrobe design systems." },
      { name: "Slashform K+W", description: "Integrated kitchen and wardrobe design collections." },
    ],
  },
  {
    id: "hardware",
    name: "Hardware",
    icon: "⚙",
    subcategories: [
      { name: "Custom Hardware", description: "Bespoke architectural hardware and fittings." },
    ],
  },
  {
    id: "doors-partitions",
    name: "Doors + Partitions",
    icon: "⊡",
    subcategories: [
      { name: "Aluminum System", description: "Modular aluminum partition and door frame systems." },
    ],
  },
  {
    id: "ffne",
    name: "FF&E",
    icon: "◈",
    subcategories: [
      { name: "Furniture Madheke", description: "Bespoke furniture solutions for hospitality and residential." },
      { name: "Furniture Tammma", description: "Artisan furniture collections in natural materials." },
      { name: "Millwork LOCO", description: "Custom millwork for luxury interiors and retail." },
    ],
  },
  {
    id: "lighting",
    name: "Lighting",
    icon: "✦",
    subcategories: [
      { name: "Architectural Lighting", description: "Precision lighting systems for spaces and structures." },
      { name: "Decorative Lighting", description: "Statement lighting pieces for luxury interiors." },
      { name: "Arteffects", description: "Art-inspired lighting installations and sculptural fixtures." },
      { name: "Carpets", description: "Handcrafted and machine-tufted luxury carpet collections." },
    ],
  },
  {
    id: "bagno-tiles",
    name: "BAGNO — Tiles",
    icon: "◻",
    subcategories: [
      { name: "Floorings & Walls", description: "Premium tiles for floors and wall surfaces." },
      { name: "Decorative", description: "Artistic decorative tile collections and patterns." },
      { name: "20mm Outdoor", description: "Large format 20mm tiles for outdoor terraces." },
      { name: "Terrazzo & Terracotta Tempesta", description: "Handcrafted terrazzo and terracotta tile systems." },
      { name: "Swimming Pool Wow", description: "Specialist pool and water feature tiles." },
      { name: "Façade", description: "Exterior facade cladding tile solutions." },
    ],
  },
  {
    id: "bagno-sf",
    name: "BAGNO — Sanitaryware & Fittings",
    icon: "◇",
    subcategories: [
      { name: "FIMA", description: "Italian luxury tap and mixer collections." },
      { name: "IWW", description: "Designer sanitaryware and bathroom suites." },
      { name: "FALPER", description: "Contemporary Italian bathroom furniture." },
      { name: "MILDUE", description: "Minimalist bath and shower solutions." },
      { name: "FLAMINIA", description: "Premium ceramic sanitaryware from Italy." },
    ],
  },
  {
    id: "bagno-wellness",
    name: "BAGNO — Wellness",
    icon: "◎",
    subcategories: [
      { name: "Tub BULLFROG", description: "Freestanding therapeutic bathtub systems." },
      { name: "Steam", description: "Steam room systems and enclosures." },
      { name: "WALTZ by JB G", description: "Wellness shower and hydrotherapy systems." },
      { name: "ANTONIOLUPI", description: "Luxury Italian bathroom wellness collections." },
    ],
  },
  {
    id: "bagno-mirrors",
    name: "BAGNO — Mirrors & Accessories",
    icon: "○",
    subcategories: [
      { name: "Mira", description: "Designer illuminated mirror collections." },
      { name: "Accessories GELLI", description: "Premium bathroom accessories and storage systems." },
    ],
  },
];

export default function Products() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const filteredCategories =
    activeCategory
      ? productCategories.filter((c) => c.id === activeCategory)
      : productCategories;

  return (
    <div className="bg-[#080808] text-white pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h4 className="text-accent uppercase tracking-wider font-bold text-xs mb-4">CATALOG</h4>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tight mb-6">
            OUR PRODUCTS<span className="text-accent">.</span>
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl font-light leading-relaxed">
            A curated collection of premium architectural materials, surfaces, hardware, and wellness solutions for luxury interiors.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-3 mb-16 border-b border-neutral-900 pb-8">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-5 py-2 text-xs font-bold uppercase tracking-widest border transition-all duration-300 ${
              activeCategory === null
                ? "bg-white text-black border-white"
                : "border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600"
            }`}
          >
            All Categories
          </button>
          {productCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              className={`px-5 py-2 text-xs font-bold uppercase tracking-widest border transition-all duration-300 ${
                activeCategory === cat.id
                  ? "bg-white text-black border-white"
                  : "border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid — Accordion Style */}
        <div className="space-y-4">
          {filteredCategories.map((category, idx) => (
            <div
              key={category.id}
              className="border border-neutral-900 bg-neutral-950 overflow-hidden transition-all duration-500"
            >
              {/* Category Header */}
              <button
                onClick={() =>
                  setExpandedCategory(expandedCategory === category.id ? null : category.id)
                }
                className="w-full flex items-center justify-between p-8 text-left group hover:bg-neutral-900 transition-colors duration-300"
              >
                <div className="flex items-center gap-6">
                  <span className="text-2xl opacity-40 group-hover:opacity-100 transition-opacity">
                    {category.icon}
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">
                      Category {String(idx + 1).padStart(2, "0")}
                    </p>
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight group-hover:text-accent transition-colors">
                      {category.name}
                    </h2>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-neutral-500">
                  <span className="text-xs uppercase tracking-widest">
                    {category.subcategories.length} Products
                  </span>
                  {expandedCategory === category.id ? (
                    <ChevronDown size={20} className="text-accent" />
                  ) : (
                    <ChevronRight size={20} />
                  )}
                </div>
              </button>

              {/* Subcategories */}
              {expandedCategory === category.id && (
                <div className="border-t border-neutral-900 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
                  {category.subcategories.map((sub, subIdx) => (
                    <div
                      key={subIdx}
                      className="p-6 border-b border-r border-neutral-900 hover:bg-neutral-900 transition-colors duration-200 group cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-xs font-bold text-accent uppercase tracking-widest">
                          {String(subIdx + 1).padStart(2, "0")}
                        </span>
                        <ChevronRight
                          size={14}
                          className="text-neutral-600 group-hover:text-accent group-hover:translate-x-1 transition-all"
                        />
                      </div>
                      <h3 className="text-base font-bold uppercase tracking-tight mb-2 group-hover:text-accent transition-colors">
                        {sub.name}
                      </h3>
                      <p className="text-xs text-neutral-500 font-light leading-relaxed">
                        {sub.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-24 border border-neutral-900 bg-neutral-950 p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-3xl font-black uppercase tracking-tight mb-2">
              INTERESTED IN OUR PRODUCTS?
            </h3>
            <p className="text-neutral-400 text-sm font-light">
              Reach out to our team for specifications, samples, and project consultations.
            </p>
          </div>
          <div className="flex gap-4 flex-shrink-0">
            <Link
              href="/contact"
              className="px-8 py-4 bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-accent hover:text-white transition-colors"
            >
              Request Consultation
            </Link>
            <Link
              href="/work"
              className="px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-wider text-xs hover:border-accent hover:text-accent transition-colors"
            >
              View Projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
