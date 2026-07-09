"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const PRODUCT_CATEGORIES = [
  {
    id: "plywood",
    code: "PL",
    num: "01",
    name: "Plywood",
    subcategories: ["Plywood PEEL PLY", "Blockboard PEEL PLY"],
  },
  {
    id: "decorative-surfaces",
    code: "DS",
    num: "02",
    name: "Decorative Surfaces",
    subcategories: ["Veneers INCLASS", "Veneers ALPI", "Laminates INCLASS", "Decoratives INCLASS"],
  },
  {
    id: "cladding-decking",
    code: "CD",
    num: "03",
    name: "Cladding & Decking",
    subcategories: ["Wood Thermory", "Wood Tali Deck", "WPC NEWTECH"],
  },
  {
    id: "wooden-flooring",
    code: "WF",
    num: "04",
    name: "Wooden Flooring",
    subcategories: ["Solid Curated", "Laminated Unique", "SPC Becker", "Engineered Mafi", "Designer Parkavanue"],
  },
  {
    id: "screens",
    code: "SC",
    num: "05",
    name: "Screens",
    subcategories: ["Zipline"],
  },
  {
    id: "doors-windows",
    code: "DW",
    num: "06",
    name: "Doors + Windows",
    subcategories: ["Wooden Doors", "Laminated Doors", "Wooden Windows", "Aluminum Windows"],
  },
  {
    id: "kitchen-wardrobe",
    code: "KW",
    num: "07",
    name: "Kitchen & Wardrobe",
    subcategories: ["K+W", "Freedom Screen", "Slashform D+W", "Slashform K+W"],
  },
  {
    id: "hardware",
    code: "HW",
    num: "08",
    name: "Hardware",
    subcategories: ["Custom Hardware"],
  },
  {
    id: "doors-partitions",
    code: "DP",
    num: "09",
    name: "Doors + Partitions",
    subcategories: ["Aluminum System"],
  },
  {
    id: "ffne",
    code: "FF",
    num: "10",
    name: "FF&E",
    subcategories: ["Furniture Madheke", "Furniture Tammma", "Millwork LOCO"],
  },
  {
    id: "lighting",
    code: "LT",
    num: "11",
    name: "Lighting",
    subcategories: ["Architectural Lighting", "Decorative Lighting", "Arteffects", "Carpets"],
  },
  {
    id: "bagno-tiles",
    code: "BT",
    num: "12",
    name: "BAGNO — Tiles",
    subcategories: ["Floorings & Walls", "Decorative", "20mm Outdoor", "Terrazzo & Terracotta Tempesta", "Swimming Pool Wow", "Façade"],
  },
  {
    id: "bagno-sf",
    code: "BS",
    num: "13",
    name: "BAGNO — Sanitaryware & Fittings",
    subcategories: ["FIMA", "IWW", "FALPER", "MILDUE", "FLAMINIA"],
  },
  {
    id: "bagno-wellness",
    code: "BW",
    num: "14",
    name: "BAGNO — Wellness",
    subcategories: ["Tub BULLFROG", "Steam", "WALTZ by JB G", "ANTONIOLUPI"],
  },
  {
    id: "bagno-mirrors",
    code: "BM",
    num: "15",
    name: "BAGNO — Mirrors & Accessories",
    subcategories: ["Mira", "Accessories GELLI"],
  },
];

export default function ProductsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div style={{ background: "#0a0a0a", color: "#f0f0f0", minHeight: "100vh", paddingTop: "80px" }}>

      {/* Page Header */}
      <div style={{ padding: "60px 28px 0", borderBottom: "1px solid #1a1a1a" }}>
        <h1
          style={{
            fontSize: "clamp(2.5rem, 8vw, 8rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.0,
            color: "#ffffff",
            marginBottom: "40px",
          }}
        >
          Products
        </h1>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "0" }}>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", maxWidth: "480px" }}>
            A curated catalog of premium architectural materials, surfaces, hardware, and wellness solutions.
          </p>
          <p style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
            {PRODUCT_CATEGORIES.length} Categories
          </p>
        </div>

        {/* Column headers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "60px 1fr auto",
            padding: "20px 0 16px",
            borderTop: "1px solid #1a1a1a",
            marginTop: "40px",
          }}
        >
          <span style={{ fontSize: "11px", letterSpacing: "0.08em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>#</span>
          <span style={{ fontSize: "11px", letterSpacing: "0.08em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>Category</span>
          <span style={{ fontSize: "11px", letterSpacing: "0.08em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>Products</span>
        </div>
      </div>

      {/* Product Category List — Sturdy work list style */}
      <div>
        {PRODUCT_CATEGORIES.map((cat) => (
          <div key={cat.id} style={{ borderBottom: "1px solid #1a1a1a" }}>
            {/* Row */}
            <button
              onClick={() => setExpanded(expanded === cat.id ? null : cat.id)}
              onMouseEnter={() => setHoveredId(cat.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: "60px 1fr auto",
                alignItems: "center",
                padding: "24px 28px",
                gap: "24px",
                background: hoveredId === cat.id ? "#111111" : "transparent",
                border: "none",
                textAlign: "left",
                transition: "background 0.2s",
              }}
            >
              {/* Index */}
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.05em" }}>
                {cat.num}
              </span>

              {/* Name */}
              <div>
                <p style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "4px" }}>
                  {cat.code}
                </p>
                <h2 style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)", fontWeight: 600, letterSpacing: "-0.01em", color: "#ffffff" }}>
                  {cat.name}
                </h2>
              </div>

              {/* Right — count + expand */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
                <span style={{ fontSize: "11px", letterSpacing: "0.05em", color: "rgba(255,255,255,0.3)" }}>
                  {cat.subcategories.length} Items
                </span>
                <ChevronDown
                  size={16}
                  style={{
                    color: "rgba(255,255,255,0.35)",
                    transition: "transform 0.3s ease",
                    transform: expanded === cat.id ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </div>
            </button>

            {/* Expanded subcategories */}
            {expanded === cat.id && (
              <div style={{ borderTop: "1px solid #1a1a1a", background: "#0d0d0d" }}>
                {cat.subcategories.map((sub, i) => (
                  <div
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "60px 1fr auto",
                      alignItems: "center",
                      padding: "16px 28px",
                      borderBottom: i < cat.subcategories.length - 1 ? "1px solid #161616" : "none",
                      gap: "24px",
                    }}
                  >
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.15)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", fontWeight: 400 }}>{sub}</p>
                    <Link
                      href="/contact"
                      style={{ fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", transition: "color 0.2s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
                    >
                      Enquire →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ padding: "80px 28px", borderTop: "1px solid #1a1a1a" }}>
        <p style={{ fontSize: "clamp(1.2rem, 3vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.02em", color: "#ffffff", marginBottom: "24px", maxWidth: "600px" }}>
          Interested in our materials? Let&apos;s talk specifications, samples, and project timelines.
        </p>
        <Link
          href="/contact"
          style={{
            display: "inline-block",
            fontSize: "13px",
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#ffffff",
            borderBottom: "1px solid rgba(255,255,255,0.4)",
            paddingBottom: "4px",
            transition: "border-color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#ffffff")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)")}
        >
          Request Consultation →
        </Link>
      </div>
    </div>
  );
}
