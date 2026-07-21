"use client";

import Image from "next/image";
import Link from "next/link";

const PRODUCT_CATEGORIES = [
  {
    id: "plywood",
    code: "PW",
    num: "01",
    name: "Plywood",
    hero: "/categories/cat_1.png",
    subcategories: ["Plywood PEEL PLY", "Blockboard PEEL PLY"],
  },
  {
    id: "laminate",
    code: "LM",
    num: "02",
    name: "Laminate",
    hero: "/categories/cat_2.png",
    subcategories: ["Veneers INCLASS", "Veneers ALPI", "Laminates INCLASS", "Decoratives INCLASS"],
  },
  {
    id: "facade",
    code: "FC",
    num: "03",
    name: "Facade",
    hero: "/categories/cat_3.png",
    subcategories: ["Wood Thermory", "Wood Tali Deck", "WPC NEWTECH"],
  },
  {
    id: "wooden-flooring",
    code: "WF",
    num: "04",
    name: "Wooden Flooring",
    hero: "/categories/cat_4.png",
    subcategories: ["Solid Curated", "Laminated Unique", "SPC Becker", "Engineered Mafi", "Designer Parkavanue"],
  },
  {
    id: "screens",
    code: "SS",
    num: "05",
    name: "Screens",
    hero: "/categories/cat_5.png",
    subcategories: ["Zipline"],
  },
  {
    id: "door-system",
    code: "DS",
    num: "06",
    name: "Door System",
    hero: "/categories/cat_6.png",
    subcategories: ["Aluminum System", "Slashform System"],
  },
  {
    id: "doors",
    code: "WD",
    num: "07",
    name: "Doors",
    hero: "/categories/cat_7.png",
    subcategories: ["Wooden Doors", "Laminated Doors"],
  },
  {
    id: "windows",
    code: "WW",
    num: "08",
    name: "Windows",
    hero: "/categories/cat_8.png",
    subcategories: ["Wooden Windows", "Aluminum Windows"],
  },
  {
    id: "kitchen",
    code: "KK",
    num: "09",
    name: "Kitchen",
    hero: "/categories/cat_9.png",
    subcategories: ["K+W", "Slashform K+W"],
  },
  {
    id: "wardrobe",
    code: "WW",
    num: "10",
    name: "Wardrobe",
    hero: "/categories/cat_10.png",
    subcategories: ["Freedom Screen", "Slashform D+W"],
  },
  {
    id: "furniture",
    code: "FF",
    num: "11",
    name: "Furniture",
    hero: "/categories/cat_11.png",
    subcategories: ["Furniture Madheke", "Furniture Tammma", "Millwork LOCO"],
  },
  {
    id: "tiles",
    code: "TL",
    num: "12",
    name: "Tiles",
    hero: "/categories/cat_12.png",
    subcategories: ["Floorings & Walls", "Decorative", "20mm Outdoor", "Terrazzo & Terracotta", "Swimming Pool", "Façade"],
  },
  {
    id: "bathroom-fittings",
    code: "BF",
    num: "13",
    name: "Bathroom Fittings",
    hero: "/categories/cat_13.png",
    subcategories: ["FIMA", "FALPER", "MILDUE"],
  },
  {
    id: "sanitary-ware",
    code: "SW",
    num: "14",
    name: "Sanitary Ware",
    hero: "/categories/cat_14.png",
    subcategories: ["IWW", "FLAMINIA", "ANTONIOLUPI"],
  },
  {
    id: "mirrors",
    code: "MR",
    num: "15",
    name: "Mirrors",
    hero: "/categories/cat_15.png",
    subcategories: ["Mira", "Accessories GELLI", "WALTZ by JB Glass"],
  },
];

export default function ProductsPage() {
  return (
    <div className="products-page">

      {/* ── Page Header ── */}
      <div className="products-header">
        <div className="products-header__inner">
          <div className="products-header__meta t-tag" style={{ color: "#8c764b", fontWeight: 700, letterSpacing: "0.12em", marginBottom: "2.4rem" }}>
            MATERIAL CATALOG — {PRODUCT_CATEGORIES.length} Categories
          </div>
          <h1 className="products-header__title">Products</h1>
          <p className="products-header__desc t-body" style={{ color: "rgba(0,0,0,0.5)", maxWidth: "52rem" }}>
            A curated catalog of premium architectural materials, surfaces, hardware, and wellness solutions — sourced from the world&apos;s finest manufacturers.
          </p>
        </div>
      </div>

      {/* ── Category Grid — Madheke Editorial 2-Column Style ── */}
      <div className="ma-container">
        <div className="ma-grid">
          {PRODUCT_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/products/${cat.id}`}
              className="ma-card"
              id={`product-card-${cat.id}`}
            >
              {/* Image with hover overlay */}
              <div className="ma-card-fig-wrap">
                <Image
                  src={cat.hero}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="ma-img"
                  style={{ objectFit: "cover" }}
                />
                <div className="ma-hover-overlay">
                  <span className="ma-view-btn">EXPLORE CATEGORY →</span>
                </div>
                <div className="ma-badge-num">{cat.num}</div>
              </div>

              {/* Editorial Info */}
              <div className="ma-card-info">
                <div className="ma-card-header">
                  <h3 className="ma-card-title">{cat.name}</h3>
                  <span className="ma-card-code">{cat.code}</span>
                </div>
                <span className="ma-card-meta">
                  {cat.subcategories.length} LINES · {cat.subcategories.slice(0, 3).join(" · ")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="products-cta">
        <p className="products-cta__text">
          Interested in our materials? Let&apos;s talk specifications, samples, and project timelines.
        </p>
        <Link href="/contact" className="ul-link t-cta-1" id="products-cta-consultation">
          Request Consultation →
        </Link>
      </div>

      <style>{`
        /* ── Approved 03 Madheke Editorial Products Page ── */
        .products-page {
          background: #faf8f5;
          color: #1e1e1e;
          min-height: 100vh;
          padding-top: 8rem;
          font-family: serif;
        }

        .products-header {
          padding: 6rem 1.6rem 3.5rem;
          border-bottom: 0.1rem solid rgba(0,0,0,0.1);
          max-width: 1320px;
          margin: 0 auto;
        }

        @media (min-width: 768px) {
          .products-header {
            padding: 8rem 2rem 4rem;
          }
        }

        .products-header__title {
          font-family: "Playfair Display", Georgia, serif;
          font-size: clamp(4.5rem, 12vw, 14rem);
          font-weight: 400;
          letter-spacing: -0.04em;
          line-height: 0.9;
          text-transform: uppercase;
          color: #1a1a1a;
          margin-bottom: 2rem;
        }

        .products-header__desc {
          font-family: serif;
          font-size: clamp(1.5rem, 2.2vw, 2.1rem);
          line-height: 1.5;
          color: rgba(0,0,0,0.6);
          font-style: italic;
          max-width: 68rem;
        }

        /* ── Madheke Grid Container ── */
        .ma-container {
          max-width: 1320px;
          margin: 0 auto;
          padding: 4rem 1.6rem 8rem;
        }

        @media (min-width: 768px) {
          .ma-container {
            padding: 5rem 2rem 8rem;
          }
        }

        .ma-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 4rem 3rem;
        }

        @media (min-width: 768px) {
          .ma-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* ── Madheke Card ── */
        .ma-card {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          background: #ffffff;
          border: 0.1rem solid rgba(0,0,0,0.08);
          overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s ease;
        }

        .ma-card:hover {
          transform: translateY(-0.4rem);
          box-shadow: 0 1.6rem 4rem rgba(0,0,0,0.08);
        }

        .ma-card-fig-wrap {
          position: relative;
          height: 32rem;
          background: #1a1a1a;
          overflow: hidden;
        }

        @media (min-width: 768px) {
          .ma-card-fig-wrap {
            height: 38rem;
          }
        }

        @media (min-width: 1200px) {
          .ma-card-fig-wrap {
            height: 44rem;
          }
        }

        .ma-img {
          transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1) !important;
        }

        .ma-card:hover .ma-img {
          transform: scale(1.05);
        }

        .ma-hover-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          backdrop-filter: blur(2px);
        }

        .ma-card:hover .ma-hover-overlay {
          opacity: 1;
        }

        .ma-view-btn {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: #ffffff;
          background: rgba(0,0,0,0.8);
          padding: 1rem 2rem;
          border: 0.1rem solid rgba(255,255,255,0.3);
          border-radius: 999px;
        }

        .ma-badge-num {
          position: absolute;
          top: 1.6rem;
          right: 1.6rem;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          background: rgba(250, 248, 245, 0.92);
          color: #000000;
          padding: 0.4rem 1rem;
          border-radius: 0.4rem;
        }

        .ma-card-info {
          padding: 2.4rem;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          background: #ffffff;
        }

        .ma-card-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 1.6rem;
        }

        .ma-card-title {
          font-family: "Playfair Display", Georgia, serif;
          font-size: clamp(2rem, 3.2vw, 2.8rem);
          font-weight: 600;
          letter-spacing: -0.02em;
          color: #1a1a1a;
          margin: 0;
        }

        .ma-card-code {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 1.4rem;
          font-weight: 800;
          color: rgba(0,0,0,0.3);
          letter-spacing: 0.05em;
        }

        .ma-card-meta {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.45);
        }

        /* ── CTA ── */
        .products-cta {
          max-width: 1320px;
          margin: 0 auto;
          padding: 6rem 1.6rem 10rem;
          border-top: 0.1rem solid rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          gap: 2.4rem;
        }

        @media (min-width: 768px) {
          .products-cta {
            padding: 8rem 2rem 10rem;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        .products-cta__text {
          font-family: serif;
          font-size: clamp(1.6rem, 2.2vw, 2.2rem);
          font-style: italic;
          color: rgba(0,0,0,0.7);
          max-width: 52rem;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
}
