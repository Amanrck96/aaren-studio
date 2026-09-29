"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { ShopItem, ShopSettingsItem, DEFAULT_SHOP_ITEMS, DEFAULT_SHOP_SETTINGS } from "@/lib/types";

export default function ShopPage() {
  const [items, setItems] = useState<ShopItem[]>(DEFAULT_SHOP_ITEMS);
  const [settings, setSettings] = useState<ShopSettingsItem>(DEFAULT_SHOP_SETTINGS);

  useEffect(() => {
    fetch(`/api/shop?t=${Date.now()}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          if (Array.isArray(json.data) && json.data.length > 0) {
            setItems(json.data.filter((it: ShopItem) => it.available !== false));
          }
          if (json.settings) {
            setSettings(json.settings);
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="shop-page">
      {/* ── Page Header ── */}
      <div className="shop-header page-header">
        <div className="shop-header__inner page-header__inner">
          <div className="shop-header__meta page-meta">
            {settings.metaText && !settings.metaText.includes("SAMPLE SPECIMENS")
              ? settings.metaText
              : "AAREN STUDIO — CURATED SHOP"}
          </div>
          <h1 className="shop-header__title page-title">{settings.title || "SHOP"}</h1>
          <p className="shop-header__desc page-desc">
            {settings.description && !settings.description.includes("material specifications, sample sets")
              ? settings.description
              : "Direct access to curated lifestyle essentials, bespoke accessories, and signature products crafted for elevated living."}
          </p>
          <div style={{ marginTop: "2.4rem" }}>
            <Link
              href={settings.exploreCatalogLink || "/products"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.8rem",
                padding: "0.9rem 1.8rem",
                background: "#81663F",
                color: "#ffffff",
                borderRadius: "9999px",
                fontSize: "1.15rem",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              <ShoppingBag size={16} /> {settings.exploreCatalogText || "Explore All Materials in Full Catalog"}
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Shop Grid ── */}
      <div className="shop-grid">
        {items.map((item) => (
          <div key={item.id} className="shop-card">
            {/* Product Image */}
            <div className="shop-card__fig-wrapper">
              <a
                href={item.shopifyUrl || "#"}
                target={item.shopifyUrl ? "_blank" : undefined}
                rel={item.shopifyUrl ? "noopener noreferrer" : undefined}
                className="shop-card__fig-link"
                title={`Buy ${item.name}`}
              >
                <div className="shop-card__fig">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="shop-card__img"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                {item.price && (
                  <div className="shop-card__price-badge t-tag">
                    {item.price}
                  </div>
                )}
              </a>
            </div>

            {/* Product Info, Description & Buy Now CTA */}
            <div className="shop-card__caption">
              <div className="shop-card__caption-header">
                <div className="shop-card__caption-left">
                  <span className="shop-card__caption-cat t-tag">
                    {item.category || "ACCESSORIES"}
                  </span>
                  <h2 className="shop-card__caption-name">{item.name}</h2>
                </div>
                <div className="shop-card__caption-right">
                  <span className="shop-card__caption-code">{item.code}</span>
                  <span className="shop-card__caption-num">{item.num}</span>
                </div>
              </div>

              {item.spec && (
                <p className="shop-card__caption-desc">
                  {item.spec}
                </p>
              )}

              <div className="shop-card__caption-actions">
                {item.shopifyUrl ? (
                  <a
                    href={item.shopifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shop-card__buy-btn-main"
                    title={`Buy ${item.name} on Shopify`}
                  >
                    <ShoppingBag size={18} />
                    <span>{item.buyNowText || `Buy on Shopify • ${item.price}`}</span>
                    <ArrowUpRight size={18} />
                  </a>
                ) : (
                  <a
                    href={`mailto:info@aarenintpro.com?subject=Inquiry: ${encodeURIComponent(item.name)}`}
                    className="shop-card__buy-btn-main"
                  >
                    <span>Inquire for Price</span>
                    <ArrowUpRight size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .shop-page {
          background: #E6E2D8;
          color: #1e1e1e;
          min-height: 100vh;
          padding-top: 8rem;
        }

        .shop-header {
          padding-top: 8rem;
          padding-bottom: 4rem;
          padding-left: 0;
          padding-right: 0;
          border-bottom: 0.1rem solid rgba(129,102,63,0.18);
        }

        .shop-header__inner {
          max-width: 1600px;
          margin: 0 auto;
          padding-left: 4rem;
          padding-right: 4rem;
          box-sizing: border-box;
        }

        @media (max-width: 1024px) {
          .shop-header__inner {
            padding-left: 3rem;
            padding-right: 3rem;
          }
        }

        @media (max-width: 768px) {
          .shop-header__inner {
            padding-left: 2rem;
            padding-right: 2rem;
          }
        }

        .shop-header__title {
          font-size: clamp(6rem, 15vw, 22rem);
          font-weight: 700;
          letter-spacing: -0.05em;
          line-height: 0.88;
          text-transform: uppercase;
          color: #81663F;
          margin-bottom: 2.8rem;
        }

        /* ── Shop Grid ── */
        .shop-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 420px), 520px));
          gap: 3rem;
          width: 100%;
          max-width: 1600px;
          margin: 0 auto;
          padding: 4rem 4rem 8rem;
          box-sizing: border-box;
        }

        @media (max-width: 1024px) {
          .shop-grid {
            padding: 3rem 3rem 6rem;
            gap: 2.4rem;
          }
        }

        @media (max-width: 768px) {
          .shop-grid {
            grid-template-columns: 1fr;
            padding: 2.4rem 1.6rem 5rem;
            gap: 2rem;
          }
        }

        /* ── Shop Card ── */
        .shop-card {
          display: flex;
          flex-direction: column;
          background: #ECE7DE;
          border: 0.1rem solid rgba(129, 102, 63, 0.22);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .shop-card:hover {
          transform: translateY(-4px);
          border-color: #81663F;
          box-shadow: 0 16px 36px rgba(129, 102, 63, 0.12);
        }

        .shop-card__fig-wrapper {
          position: relative;
          width: 100%;
          padding-top: 70%;
          background: #111;
          overflow: hidden;
        }

        .shop-card__fig-link {
          position: absolute;
          inset: 0;
          display: block;
          text-decoration: none;
          cursor: pointer;
        }

        .shop-card__fig {
          position: absolute;
          inset: 0;
        }

        .shop-card__img {
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .shop-card:hover .shop-card__img {
          transform: scale(1.05);
        }

        .shop-card__price-badge {
          position: absolute;
          top: 1.4rem;
          left: 1.4rem;
          background: #81663F;
          color: #ffffff;
          padding: 0.5rem 1.1rem;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          border-radius: 4px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.18);
          z-index: 2;
        }

        .shop-card__caption {
          display: flex;
          flex-direction: column;
          padding: 2.2rem 2.4rem;
          background: #ECE7DE;
          flex: 1;
        }

        .shop-card__caption-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1.6rem;
          margin-bottom: 1.2rem;
        }

        .shop-card__caption-left {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .shop-card__caption-cat {
          font-size: 0.95rem;
          font-weight: 700;
          color: #81663F;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .shop-card__caption-name {
          font-size: 1.7rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.15;
          text-transform: uppercase;
          color: #1E1E1E;
          margin: 0;
        }

        .shop-card__caption-right {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          flex-shrink: 0;
        }

        .shop-card__caption-code {
          font-size: 2.2rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1;
          color: #1E1E1E;
        }

        .shop-card__caption-num {
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1;
          color: rgba(0,0,0,0.25);
        }

        .shop-card__caption-desc {
          font-size: 1.05rem;
          line-height: 1.65;
          color: #4A453F;
          margin: 0 0 2rem 0;
          background: rgba(129, 102, 63, 0.07);
          padding: 1.2rem 1.4rem;
          border-radius: 6px;
          border-left: 3px solid #81663F;
        }

        .shop-card__caption-actions {
          margin-top: auto;
        }

        .shop-card__buy-btn-main {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          width: 100%;
          padding: 1.1rem 1.8rem;
          background: #81663F;
          color: #ffffff;
          border-radius: 8px;
          font-size: 1.05rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          text-decoration: none;
          box-shadow: 0 6px 20px rgba(129, 102, 63, 0.28);
          transition: all 0.25s ease;
          cursor: pointer;
        }

        .shop-card__buy-btn-main:hover {
          background: #1E1E1E;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(30, 30, 30, 0.35);
        }
      `}</style>
    </div>
  );
}
