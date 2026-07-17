"use client";

import Image from "next/image";
import Link from "next/link";

const SHOP_ITEMS = [
  { id: "oak-veneer", name: "Premium Oak Veneer", category: "Veneers", code: "OV", num: "01", price: "$140 / sqm", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80" },
  { id: "terrazzo-slab", name: "Terrazzo Outdoor Slab", category: "Tiles", code: "TO", num: "02", price: "$210 / slab", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" },
  { id: "brushed-gold-tap", name: "Brushed Gold Tap", category: "Fittings", code: "BG", num: "03", price: "$380 / unit", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80" },
  { id: "acoustic-panel", name: "Acoustic Wool Panel", category: "Screens", code: "AW", num: "04", price: "$95 / panel", image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80" },
  { id: "fluted-panel", name: "Fluted Wall Panel", category: "Surfaces", code: "FW", num: "05", price: "$120 / sqm", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80" },
  { id: "pivot-door", name: "Minimalist Pivot Door", category: "Doors", code: "PD", num: "06", price: "$1,250 / unit", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80" },
];

export default function ShopPage() {
  return (
    <div className="shop-page">
      {/* ── Page Header ── */}
      <div className="shop-header">
        <div className="shop-header__inner">
          <div className="shop-header__meta t-tag" style={{ color: "rgba(0,0,0,0.4)", marginBottom: "2.4rem" }}>
            ONLINE CATALOG — {SHOP_ITEMS.length} Curated items
          </div>
          <h1 className="shop-header__title">Shop</h1>
          <p className="shop-header__desc t-body" style={{ color: "rgba(0,0,0,0.5)", maxWidth: "52rem" }}>
            Direct access to source materials, fixtures, and custom components compiled for luxury architectural projects.
          </p>
        </div>
      </div>

      {/* ── Shop Grid ── */}
      <div className="shop-grid">
        {SHOP_ITEMS.map((item) => (
          <Link
            key={item.id}
            href="/contact"
            className="shop-card"
            id={`shop-card-${item.id}`}
          >
            <div className="shop-card__fig-wrapper">
              <div className="shop-card__fig">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="shop-card__img"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="shop-card__price-badge t-tag">
                {item.price}
              </div>
            </div>
            <div className="shop-card__caption">
              <div className="shop-card__caption-left">
                <span className="shop-card__caption-name">{item.name}</span>
                <span className="shop-card__caption-cat t-tag">{item.category}</span>
              </div>
              <div className="shop-card__caption-right">
                <span className="shop-card__caption-code">{item.code}</span>
                <span className="shop-card__caption-num">{item.num}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        .shop-page {
          background: #eaeef4;
          color: #000;
          min-height: 100vh;
          padding-top: 8rem;
        }

        .shop-header {
          padding: 6rem 0.8rem 4rem;
          border-bottom: 0.1rem solid rgba(0,0,0,0.12);
        }

        @media (min-width: 768px) {
          .shop-header {
            padding: 8rem 1.2rem 4rem;
          }
        }

        .shop-header__title {
          font-size: clamp(6rem, 15vw, 22rem);
          font-weight: 700;
          letter-spacing: -0.05em;
          line-height: 0.88;
          text-transform: uppercase;
          color: #000;
          margin-bottom: 3.2rem;
        }

        .shop-header__desc {
          font-size: 1.5rem;
          line-height: 1.5;
          letter-spacing: -0.01em;
        }

        /* ── Shop Grid ── */
        .shop-grid {
          display: flex;
          flex-wrap: wrap;
          width: 100%;
        }

        .shop-card {
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
          .shop-card {
            flex: 0 0 50%;
            width: 50%;
            border-right: 0.1rem solid rgba(0,0,0,0.12);
          }
          .shop-card:nth-child(2n) {
            border-right: none;
          }
        }

        .shop-card__fig-wrapper {
          position: relative;
          overflow: hidden;
          height: 26rem;
          background: #111;
        }

        @media (min-width: 768px) {
          .shop-card__fig-wrapper {
            height: 38rem;
          }
        }

        .shop-card__fig {
          position: absolute;
          inset: 0;
        }

        .shop-card__img {
          transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
        }

        .shop-card:hover .shop-card__img {
          transform: scale(1.04);
        }

        .shop-card__price-badge {
          position: absolute;
          bottom: 1.6rem;
          right: 1.6rem;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          color: #fff;
          padding: 0.6rem 1.2rem;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .shop-card__caption {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1.6rem;
          padding: 1.6rem 2.4rem;
          background: #eaeef4;
          transition: background 0.25s ease;
        }

        .shop-card:hover .shop-card__caption {
          background: #dfe3e9;
        }

        .shop-card__caption-left {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .shop-card__caption-name {
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.0;
          text-transform: uppercase;
        }

        .shop-card__caption-cat {
          font-size: 1.1rem;
          color: rgba(0,0,0,0.4);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .shop-card__caption-right {
          display: flex;
          align-items: center;
          gap: 1.6rem;
          flex-shrink: 0;
        }

        .shop-card__caption-code {
          font-size: 3rem;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1;
        }

        .shop-card__caption-num {
          font-size: 2.6rem;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1;
          color: rgba(0,0,0,0.25);
        }
      `}</style>
    </div>
  );
}
