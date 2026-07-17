"use client";

import Image from "next/image";
import Link from "next/link";

const BRANDS = [
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
  },
];

export default function BrandsPage() {
  return (
    <div className="brands-page">
      {/* ── Page Header ── */}
      <div className="brands-header">
        <div className="brands-header__inner">
          <div className="brands-header__meta t-tag" style={{ color: "rgba(0,0,0,0.4)", marginBottom: "2.4rem" }}>
            Exclusive Partners — {BRANDS.length} Brands
          </div>
          <h1 className="brands-header__title">Brands</h1>
          <p className="brands-header__desc t-body" style={{ color: "rgba(0,0,0,0.5)", maxWidth: "52rem" }}>
            A curated selection of the world&apos;s finest material and design brands — each chosen for their craft, innovation, and alignment with the Aaren philosophy.
          </p>
        </div>
      </div>

      {/* ── Brand Grid ── */}
      <div className="brands-grid">
        {BRANDS.map((brand) => (
          <Link
            key={brand.id}
            href="/contact"
            className="brand-card"
            id={`brand-card-${brand.id}`}
          >
            {/* Hero Image */}
            <div className="brand-card__fig-wrapper">
              <div className="brand-card__fig">
                <Image
                  src={brand.hero}
                  alt={brand.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="brand-card__img"
                  style={{ objectFit: "cover" }}
                />
              </div>

              {/* Logo overlay — bottom-left of image */}
              <div className="brand-card__logo-wrap">
                <Image
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  width={80}
                  height={40}
                  className="brand-card__logo"
                  style={{ objectFit: "contain", objectPosition: "left center" }}
                />
              </div>
            </div>

            {/* Bottom caption bar — ticket style */}
            <div className="brand-card__caption">
              <div className="brand-card__caption-left">
                <span className="brand-card__caption-name">{brand.name}</span>
                <span className="brand-card__caption-cat t-tag">{brand.category}</span>
              </div>
              <div className="brand-card__caption-right">
                <span className="brand-card__caption-code">{brand.code}</span>
                <span className="brand-card__caption-num">{brand.num}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── CTA ── */}
      <div className="brands-cta">
        <p className="brands-cta__text">
          Interested in a specific brand or product line? Let&apos;s discuss your project requirements.
        </p>
        <Link href="/contact" className="ul-link t-cta-1" id="brands-cta-enquire">
          Enquire Now →
        </Link>
      </div>

      <style>{`
        /* ── Brands Page ── */
        .brands-page {
          background: #eaeef4;
          color: #000;
          min-height: 100vh;
          padding-top: 8rem;
        }

        .brands-header {
          padding: 6rem 0.8rem 4rem;
          border-bottom: 0.1rem solid rgba(0,0,0,0.12);
        }

        @media (min-width: 768px) {
          .brands-header {
            padding: 8rem 1.2rem 4rem;
          }
        }

        .brands-header__title {
          font-size: clamp(6rem, 15vw, 22rem);
          font-weight: 700;
          letter-spacing: -0.05em;
          line-height: 0.88;
          text-transform: uppercase;
          color: #000;
          margin-bottom: 3.2rem;
        }

        .brands-header__desc {
          font-size: 1.5rem;
          line-height: 1.5;
          letter-spacing: -0.01em;
        }

        /* ── Grid ── */
        .brands-grid {
          display: flex;
          flex-wrap: wrap;
          width: 100%;
        }

        /* ── Brand Card ── */
        .brand-card {
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
          .brand-card {
            flex: 0 0 50%;
            width: 50%;
            border-right: 0.1rem solid rgba(0,0,0,0.12);
          }
          .brand-card:nth-child(2n) {
            border-right: none;
          }
        }

        /* Image wrapper */
        .brand-card__fig-wrapper {
          position: relative;
          overflow: hidden;
          height: 26rem;
          background: #111;
        }

        @media (min-width: 768px) {
          .brand-card__fig-wrapper {
            height: 38rem;
          }
        }

        @media (min-width: 1240px) {
          .brand-card__fig-wrapper {
            height: 44vw;
            max-height: 64rem;
          }
        }

        .brand-card__fig {
          position: absolute;
          inset: 0;
        }

        .brand-card__img {
          transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
        }

        .brand-card:hover .brand-card__img {
          transform: scale(1.04);
        }

        /* Logo overlay */
        .brand-card__logo-wrap {
          position: absolute;
          bottom: 1.6rem;
          left: 1.6rem;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          padding: 0.8rem 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          max-width: 14rem;
          height: 4.8rem;
        }

        /* Caption bar — ticket style */
        .brand-card__caption {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1.6rem;
          padding: 1.6rem 0.8rem;
          background: #eaeef4;
          transition: background 0.25s ease;
        }

        @media (min-width: 1240px) {
          .brand-card__caption {
            padding: 1.2rem 0.71429vw;
          }
        }

        .brand-card:hover .brand-card__caption {
          background: #dfe3e9;
        }

        .brand-card__caption-left {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .brand-card__caption-name {
          font-size: clamp(1.3rem, 1.6vw, 1.5rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.0;
          text-transform: uppercase;
          color: #000;
        }

        .brand-card__caption-cat {
          font-size: 1.1rem;
          color: rgba(0,0,0,0.4);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .brand-card__caption-right {
          display: flex;
          align-items: center;
          gap: 2rem;
          flex-shrink: 0;
        }

        .brand-card__caption-code {
          font-size: clamp(2rem, 4vw, 4rem);
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1;
          color: #000;
          font-family: var(--font-geist), sans-serif;
        }

        .brand-card__caption-num {
          font-size: clamp(1.8rem, 3.5vw, 3.6rem);
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1;
          color: rgba(0,0,0,0.2);
          font-family: var(--font-geist), sans-serif;
        }

        /* ── CTA ── */
        .brands-cta {
          padding: 8rem 0.8rem 10rem;
          border-top: 0.1rem solid rgba(0,0,0,0.12);
          display: flex;
          flex-direction: column;
          gap: 2.4rem;
        }

        @media (min-width: 768px) {
          .brands-cta {
            padding: 8rem 1.2rem 10rem;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        .brands-cta__text {
          font-size: clamp(1.4rem, 2vw, 2rem);
          font-weight: 600;
          letter-spacing: -0.02em;
          color: #000;
          max-width: 48rem;
          line-height: 1.3;
        }
      `}</style>
    </div>
  );
}
