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

      {/* ── Client Review Layout Switcher Banner ── */}
      <div className="client-review-banner">
        <div className="client-review-banner__content">
          <span className="client-review-banner__tag">Client Review Mode</span>
          <h2 className="client-review-banner__title">Preview Layout Grid Options</h2>
          <p className="client-review-banner__desc">
            Select one of the 5 custom product listing layouts below. Once approved by the client, we will implement this look across all category catalog pages.
          </p>
          <div className="client-review-banner__grid">
            <Link href="/products/demo-archiproducts" className="layout-preview-card">
              <span className="layout-num">01</span>
              <span className="layout-name">Archiproducts Style</span>
              <span className="layout-sub">Shower Panels Grid</span>
            </Link>
            <Link href="/products/demo-undomus" className="layout-preview-card">
              <span className="layout-num">02</span>
              <span className="layout-name">Undomus Style</span>
              <span className="layout-sub">Ceramic Tiles Grid</span>
            </Link>
            <Link href="/products/demo-madheke" className="layout-preview-card">
              <span className="layout-num">03</span>
              <span className="layout-name">Madheke Style</span>
              <span className="layout-sub">Sofas Editorial Grid</span>
            </Link>
            <Link href="/products/demo-taamaa" className="layout-preview-card">
              <span className="layout-num">04</span>
              <span className="layout-name">Taamaa Style</span>
              <span className="layout-sub">Lighting Studio Grid</span>
            </Link>
            <Link href="/products/demo-thecollective" className="layout-preview-card">
              <span className="layout-num">05</span>
              <span className="layout-name">The Collective Style</span>
              <span className="layout-sub">Women Shirts Grid</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Category Grid ── */}
      <div className="products-grid">
        {PRODUCT_CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/products/${cat.id}`}
            className="product-card"
            id={`product-card-${cat.id}`}
          >
            {/* Hero Image */}
            <div className="product-card__fig-wrapper">
              <div className="product-card__fig">
                <Image
                  src={cat.hero}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="product-card__img"
                  style={{ objectFit: "cover" }}
                />
              </div>

              {/* Subcategories count badge */}
              <div className="product-card__badge t-tag">
                {cat.subcategories.length} Lines
              </div>
            </div>

            {/* Bottom caption bar — ticket style */}
            <div className="product-card__caption">
              <div className="product-card__caption-left">
                <span className="product-card__caption-name">{cat.name}</span>
                <span className="product-card__caption-subs t-tag">
                  {cat.subcategories.slice(0, 2).join(" · ")}{cat.subcategories.length > 2 ? ` +${cat.subcategories.length - 2}` : ""}
                </span>
              </div>
              <div className="product-card__caption-right">
                <span className="product-card__caption-code">{cat.code}</span>
                <span className="product-card__caption-num">{cat.num}</span>
              </div>
            </div>
          </Link>
        ))}
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
        /* ── Products Page ── */
        .products-page {
          background: #eaeef4;
          color: #000;
          min-height: 100vh;
          padding-top: 8rem;
        }

        .products-header {
          padding: 6rem 0.8rem 4rem;
          border-bottom: 0.1rem solid rgba(0,0,0,0.12);
        }

        @media (min-width: 768px) {
          .products-header {
            padding: 8rem 1.2rem 4rem;
          }
        }

        .products-header__title {
          font-size: clamp(6rem, 15vw, 22rem);
          font-weight: 700;
          letter-spacing: -0.05em;
          line-height: 0.88;
          text-transform: uppercase;
          color: #000;
          margin-bottom: 3.2rem;
        }

        .products-header__desc {
          font-size: 1.5rem;
          line-height: 1.5;
          letter-spacing: -0.01em;
        }

        /* ── Grid ── */
        .products-grid {
          display: flex;
          flex-wrap: wrap;
          width: 100%;
        }

        /* ── Product Card ── */
        .product-card {
          display: flex;
          flex-direction: column;
          flex: 0 0 100%;
          width: 100%;
          border-bottom: 0.1rem solid rgba(0,0,0,0.12);
          text-decoration: none;
          color: inherit;
          overflow: hidden;
        }

        @media (min-width: 768px) {
          .product-card {
            flex: 0 0 50%;
            width: 50%;
            border-right: 0.1rem solid rgba(0,0,0,0.12);
          }
          .product-card:nth-child(2n) {
            border-right: none;
          }
        }

        /* Image wrapper */
        .product-card__fig-wrapper {
          position: relative;
          overflow: hidden;
          height: 26rem;
          background: #1a1a1a;
        }

        @media (min-width: 768px) {
          .product-card__fig-wrapper {
            height: 38rem;
          }
        }

        @media (min-width: 1240px) {
          .product-card__fig-wrapper {
            height: 44vw;
            max-height: 64rem;
          }
        }

        .product-card__fig {
          position: absolute;
          inset: 0;
        }

        .product-card__img {
          transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
        }

        .product-card:hover .product-card__img {
          transform: scale(1.04);
        }

        /* Badge */
        .product-card__badge {
          position: absolute;
          top: 1.6rem;
          right: 1.6rem;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          color: rgba(255,255,255,0.8);
          padding: 0.5rem 1rem;
          font-size: 1.0rem;
          letter-spacing: 0.08em;
        }

        /* Caption bar — ticket style */
        .product-card__caption {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1.6rem;
          padding: 1.6rem 0.8rem;
          background: #eaeef4;
          transition: background 0.25s ease;
        }

        @media (min-width: 1240px) {
          .product-card__caption {
            padding: 1.2rem 0.71429vw;
          }
        }

        .product-card:hover .product-card__caption {
          background: #dfe3e9;
        }

        .product-card__caption-left {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .product-card__caption-name {
          font-size: clamp(1.3rem, 1.6vw, 1.5rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.0;
          text-transform: uppercase;
          color: #000;
        }

        .product-card__caption-subs {
          font-size: 1.1rem;
          color: rgba(0,0,0,0.4);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .product-card__caption-right {
          display: flex;
          align-items: center;
          gap: 2rem;
          flex-shrink: 0;
        }

        .product-card__caption-code {
          font-size: clamp(2rem, 4vw, 4rem);
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1;
          color: #000;
          font-family: var(--font-geist), sans-serif;
        }

        .product-card__caption-num {
          font-size: clamp(1.8rem, 3.5vw, 3.6rem);
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1;
          color: rgba(0,0,0,0.2);
          font-family: var(--font-geist), sans-serif;
        }

        /* ── CTA ── */
        .products-cta {
          padding: 8rem 0.8rem 10rem;
          border-top: 0.1rem solid rgba(0,0,0,0.12);
          display: flex;
          flex-direction: column;
          gap: 2.4rem;
        }

        @media (min-width: 768px) {
          .products-cta {
            padding: 8rem 1.2rem 10rem;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        .products-cta__text {
          font-size: clamp(1.4rem, 2vw, 2rem);
          font-weight: 600;
          letter-spacing: -0.02em;
          color: #000;
          max-width: 48rem;
          line-height: 1.3;
        }

        /* ── Client Review Banner ── */
        .client-review-banner {
          background: #0f172a;
          color: #fff;
          padding: 4rem 1.2rem;
          border-bottom: 0.1rem solid rgba(255,255,255,0.1);
        }

        @media (min-width: 768px) {
          .client-review-banner {
            padding: 6rem 2.4rem;
          }
        }

        .client-review-banner__content {
          max-width: 1320px;
          margin: 0 auto;
        }

        .client-review-banner__tag {
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #38bdf8;
          display: inline-block;
          margin-bottom: 1.6rem;
        }

        .client-review-banner__title {
          font-size: clamp(2.4rem, 4vw, 4rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 1.6rem;
          color: #fff;
        }

        .client-review-banner__desc {
          font-size: clamp(1.4rem, 1.8vw, 1.6rem);
          line-height: 1.5;
          color: #94a3b8;
          max-width: 72rem;
          margin-bottom: 4rem;
        }

        .client-review-banner__grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1.6rem;
        }

        @media (max-width: 1024px) {
          .client-review-banner__grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .client-review-banner__grid {
            grid-template-columns: 1fr;
          }
        }

        .layout-preview-card {
          background: #1e293b;
          border: 0.1rem solid rgba(255,255,255,0.08);
          padding: 2.4rem 2rem;
          text-decoration: none;
          color: #fff;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .layout-preview-card:hover {
          background: #38bdf8;
          transform: translateY(-0.4rem);
          border-color: #38bdf8;
        }

        .layout-preview-card:hover .layout-num {
          color: rgba(255,255,255,0.6);
        }

        .layout-preview-card:hover .layout-sub {
          color: #ffffff;
        }

        .layout-num {
          font-family: var(--font-geist-mono), monospace;
          font-size: 2.4rem;
          font-weight: 800;
          color: rgba(255,255,255,0.15);
          transition: color 0.3s;
        }

        .layout-name {
          font-size: 1.45rem;
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        .layout-sub {
          font-size: 1.2rem;
          color: #94a3b8;
          transition: color 0.3s;
        }
      `}</style>
    </div>
  );
}
