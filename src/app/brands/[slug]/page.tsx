"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import { getBrandById } from "@/lib/brands";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default function BrandDetailPage({ params }: Props) {
  const { slug } = use(params);
  const brand = getBrandById(slug);

  if (!brand) notFound();

  const [activeCollection, setActiveCollection] = useState("All");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredProducts =
    activeCollection === "All"
      ? brand.products
      : brand.products.filter((p) => p.collection === activeCollection);

  /* Accent colours per brand for subtle identity */
  const accentMap: Record<string, string> = {
    formica: "#c8a96e",
    "inkiostro-bianco": "#7b8fa3",
    mirage: "#9b8ea6",
    falper: "#8aada8",
    fima: "#a8956a",
    mafi: "#8fa07a",
    slashform: "#6b8caa",
    waltz: "#7a9bab",
    "newtech-wood": "#8a9e78",
    loco: "#b89a6e",
  };
  const accent = accentMap[brand.id] || "#888";

  return (
    <div className="brand-detail">

      {/* ── Hero ── */}
      <div className="bd-hero">
        <div className="bd-hero__img-wrap">
          <Image
            src={brand.hero}
            alt={brand.name}
            fill
            priority
            sizes="100vw"
            className="bd-hero__img"
            style={{ objectFit: "cover" }}
          />
          <div className="bd-hero__gradient" />
        </div>

        {/* Hero overlay content */}
        <div className="bd-hero__content">
          <div className="bd-hero__breadcrumb">
            <Link href="/brands" className="bd-hero__breadcrumb-link">Brands</Link>
            <span className="bd-hero__breadcrumb-sep">→</span>
            <span>{brand.name}</span>
          </div>

          <div className="bd-hero__meta-row">
            <span className="bd-hero__num">{brand.num}</span>
            <div className="bd-hero__logo-wrap">
              <Image
                src={brand.logo}
                alt={`${brand.name} logo`}
                width={120}
                height={48}
                className="bd-hero__logo"
                style={{ objectFit: "contain", objectPosition: "left center" }}
              />
            </div>
          </div>

          <h1 className="bd-hero__title">{brand.name}</h1>

          <div className="bd-hero__tags">
            <span className="bd-hero__tag">{brand.category}</span>
            <span className="bd-hero__tag">{brand.origin}</span>
            {brand.founded && <span className="bd-hero__tag">Est. {brand.founded}</span>}
          </div>
        </div>
      </div>

      {/* ── Brand Info Bar ── */}
      <div className="bd-info-bar">
        <div className="bd-info-bar__left">
          <p className="bd-info-bar__tagline">&ldquo;{brand.tagline}&rdquo;</p>
        </div>
        <div className="bd-info-bar__right">
          <div className="bd-info-stat">
            <span className="bd-info-stat__label">Category</span>
            <span className="bd-info-stat__value">{brand.category}</span>
          </div>
          <div className="bd-info-stat">
            <span className="bd-info-stat__label">Origin</span>
            <span className="bd-info-stat__value">{brand.origin}</span>
          </div>
          {brand.founded && (
            <div className="bd-info-stat">
              <span className="bd-info-stat__label">Est.</span>
              <span className="bd-info-stat__value">{brand.founded}</span>
            </div>
          )}
          <div className="bd-info-stat">
            <span className="bd-info-stat__label">Products</span>
            <span className="bd-info-stat__value">{brand.products.length}</span>
          </div>
        </div>
      </div>

      {/* ── Description ── */}
      <div className="bd-description">
        <div className="bd-description__inner">
          <div className="bd-description__label t-tag" style={{ color: "rgba(0,0,0,0.35)" }}>
            About the brand
          </div>
          <p className="bd-description__text">{brand.description}</p>
        </div>
        <div className="bd-description__accent-line" style={{ background: accent }} />
      </div>

      {/* ── Products / Collection ── */}
      {brand.products.length > 0 && (
        <div className="bd-products">
          <div className="bd-products__header">
            <h2 className="bd-products__heading">Collection</h2>
          </div>

          {/* Filter chips */}
          <div className="bd-filter-bar">
            {brand.collections.map((col) => (
              <button
                key={col}
                onClick={() => setActiveCollection(col)}
                className={`bd-filter-chip${activeCollection === col ? " is-active" : ""}`}
                style={activeCollection === col ? { borderColor: accent, color: accent } : {}}
                id={`brand-filter-${brand.id}-${col.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {col}
                {col !== "All" && (
                  <span className="bd-filter-chip__count">
                    {brand.products.filter((p) => p.collection === col).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Product grid */}
          <div className={`bd-product-grid${mounted ? " is-mounted" : ""}`}>
            {filteredProducts.map((product, i) => (
              <div
                key={product.id}
                className="bd-product-card"
                style={{ animationDelay: `${i * 0.06}s` }}
                id={`brand-product-${product.id}`}
              >
                {/* Image area — coloured swatch using accent */}
                <div className="bd-product-card__swatch">
                  <div
                    className="bd-product-card__swatch-inner"
                    style={{
                      background: `linear-gradient(135deg, ${accent}22 0%, ${accent}44 100%)`,
                    }}
                  >
                    {/* abstract pattern overlay */}
                    <div className="bd-product-card__swatch-pattern" />
                  </div>
                  {product.tag && (
                    <span className="bd-product-card__tag">{product.tag}</span>
                  )}
                </div>

                {/* Info */}
                <div className="bd-product-card__info">
                  <span className="bd-product-card__collection">{product.collection}</span>
                  <span className="bd-product-card__name">{product.name}</span>
                  {product.finish && (
                    <span className="bd-product-card__finish">{product.finish}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Catalogues ── */}
      {brand.catalogues.length > 0 && (
        <div className="bd-catalogues">
          <div className="bd-catalogues__header">
            <h2 className="bd-catalogues__heading">Catalogues</h2>
            <p className="bd-catalogues__sub">Download the full product catalogues in PDF format.</p>
          </div>

          <div className="bd-catalogue-grid">
            {brand.catalogues.map((cat, i) => (
              <a
                key={i}
                href={`/catalogues/${cat.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bd-catalogue-card"
                id={`catalogue-${brand.id}-${i}`}
              >
                <div className="bd-catalogue-card__icon" style={{ color: accent }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="12" y1="18" x2="12" y2="12"/>
                    <polyline points="9,15 12,18 15,15"/>
                  </svg>
                </div>
                <div className="bd-catalogue-card__text">
                  <span className="bd-catalogue-card__title">{cat.title}</span>
                  {cat.subtitle && (
                    <span className="bd-catalogue-card__sub">{cat.subtitle}</span>
                  )}
                </div>
                <div className="bd-catalogue-card__arrow">↗</div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── CTA ── */}
      <div className="bd-cta">
        <div className="bd-cta__inner">
          <div className="bd-cta__left">
            <p className="bd-cta__label t-tag" style={{ color: "rgba(0,0,0,0.35)", marginBottom: "1.2rem" }}>
              Let&apos;s work together
            </p>
            <p className="bd-cta__text">
              Interested in {brand.name} for your project? We&apos;ll discuss specifications, samples, and lead times.
            </p>
          </div>
          <div className="bd-cta__actions">
            <Link href="/contact" className="ul-link t-cta-1" id={`brand-${brand.id}-enquire`}>
              Enquire Now →
            </Link>
            <Link href="/brands" className="bd-cta__back">
              ← All Brands
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        /* ── Brand Detail Page ── */
        .brand-detail {
          background: #eaeef4;
          color: #000;
          min-height: 100vh;
          padding-top: 8rem;
        }

        /* ── Hero ── */
        .bd-hero {
          position: relative;
          height: 80vh;
          min-height: 52rem;
          max-height: 90rem;
          overflow: hidden;
        }

        .bd-hero__img-wrap {
          position: absolute;
          inset: 0;
        }

        .bd-hero__img {
          transition: transform 8s ease !important;
        }

        .brand-detail:hover .bd-hero__img {
          transform: scale(1.04);
        }

        .bd-hero__gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.1) 0%,
            rgba(0,0,0,0.05) 30%,
            rgba(0,0,0,0.55) 100%
          );
        }

        .bd-hero__content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 3.2rem 0.8rem;
        }

        @media (min-width: 768px) {
          .bd-hero__content {
            padding: 4rem 1.2rem;
          }
        }

        .bd-hero__breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          font-size: 1.1rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
          margin-bottom: 2.4rem;
        }

        .bd-hero__breadcrumb-link {
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          transition: color 0.2s;
        }

        .bd-hero__breadcrumb-link:hover {
          color: rgba(255,255,255,1);
        }

        .bd-hero__breadcrumb-sep {
          color: rgba(255,255,255,0.3);
        }

        .bd-hero__meta-row {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 1.6rem;
        }

        .bd-hero__num {
          font-size: 1.1rem;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.35);
          font-weight: 700;
        }

        .bd-hero__logo-wrap {
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          padding: 0.8rem 1.4rem;
          height: 4.8rem;
          display: flex;
          align-items: center;
        }

        .bd-hero__title {
          font-size: clamp(5rem, 12vw, 18rem) !important;
          font-weight: 700;
          letter-spacing: -0.05em;
          line-height: 0.88;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 2.4rem;
        }

        .bd-hero__tags {
          display: flex;
          gap: 0.8rem;
          flex-wrap: wrap;
        }

        .bd-hero__tag {
          font-size: 1.1rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
          border: 0.1rem solid rgba(255,255,255,0.25);
          padding: 0.4rem 1rem;
        }

        /* ── Info Bar ── */
        .bd-info-bar {
          display: flex;
          flex-direction: column;
          gap: 2.4rem;
          padding: 3.2rem 0.8rem;
          border-bottom: 0.1rem solid rgba(0,0,0,0.1);
        }

        @media (min-width: 768px) {
          .bd-info-bar {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding: 2.4rem 1.2rem;
          }
        }

        .bd-info-bar__tagline {
          font-size: clamp(1.6rem, 2.5vw, 2.4rem);
          font-weight: 600;
          letter-spacing: -0.03em;
          line-height: 1.2;
          color: rgba(0,0,0,0.6);
          font-style: italic;
        }

        .bd-info-bar__right {
          display: flex;
          gap: 3.2rem;
          flex-shrink: 0;
        }

        .bd-info-stat {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .bd-info-stat__label {
          font-size: 1.0rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.35);
        }

        .bd-info-stat__value {
          font-size: 1.4rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #000;
        }

        /* ── Description ── */
        .bd-description {
          position: relative;
          padding: 6rem 0.8rem;
          border-bottom: 0.1rem solid rgba(0,0,0,0.1);
          overflow: hidden;
        }

        @media (min-width: 768px) {
          .bd-description {
            padding: 6rem 1.2rem;
            display: grid;
            grid-template-columns: 1fr 2fr auto;
            gap: 4rem;
            align-items: start;
          }
        }

        .bd-description__label {
          margin-bottom: 1.6rem;
        }

        .bd-description__text {
          font-size: clamp(1.5rem, 2vw, 1.9rem);
          line-height: 1.6;
          letter-spacing: -0.01em;
          color: rgba(0,0,0,0.75);
          max-width: 72rem;
        }

        .bd-description__accent-line {
          width: 0.3rem;
          height: 100%;
          opacity: 0.5;
          border-radius: 2px;
          display: none;
        }

        @media (min-width: 768px) {
          .bd-description__accent-line {
            display: block;
          }
        }

        /* ── Products ── */
        .bd-products {
          padding: 0 0 6rem;
          border-bottom: 0.1rem solid rgba(0,0,0,0.1);
        }

        .bd-products__header {
          padding: 4rem 0.8rem 0;
        }

        @media (min-width: 768px) {
          .bd-products__header {
            padding: 4rem 1.2rem 0;
          }
        }

        .bd-products__heading {
          font-size: clamp(3.6rem, 8vw, 10rem) !important;
          font-weight: 700;
          letter-spacing: -0.05em;
          line-height: 0.9;
          text-transform: uppercase;
          color: #000;
          margin-bottom: 3.2rem;
        }

        /* Filter bar */
        .bd-filter-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
          padding: 0 0.8rem 2.4rem;
          border-bottom: 0.1rem solid rgba(0,0,0,0.08);
          margin-bottom: 3.2rem;
        }

        @media (min-width: 768px) {
          .bd-filter-bar {
            padding: 0 1.2rem 2.4rem;
          }
        }

        .bd-filter-chip {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem 1.4rem;
          border: 0.1rem solid rgba(0,0,0,0.15);
          background: transparent;
          font-size: 1.1rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.5);
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .bd-filter-chip:hover {
          border-color: rgba(0,0,0,0.4);
          color: rgba(0,0,0,0.8);
        }

        .bd-filter-chip.is-active {
          border-width: 0.15rem;
          background: rgba(0,0,0,0.03);
          font-weight: 700;
        }

        .bd-filter-chip__count {
          font-size: 1.0rem;
          color: rgba(0,0,0,0.3);
          font-weight: 400;
        }

        /* Product grid */
        .bd-product-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          padding: 0 0.8rem;
        }

        @media (min-width: 640px) {
          .bd-product-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .bd-product-grid {
            grid-template-columns: repeat(4, 1fr);
            padding: 0 1.2rem;
          }
        }

        .bd-product-card {
          display: flex;
          flex-direction: column;
          border: 0.05rem solid rgba(0,0,0,0.08);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          animation: fadeInUp 0.4s ease both;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(1.6rem); }
          to { opacity: 1; transform: translateY(0); }
        }

        .bd-product-grid.is-mounted .bd-product-card {
          animation: fadeInUp 0.4s ease both;
        }

        .bd-product-card:hover {
          z-index: 2;
          box-shadow: 0 0.8rem 3.2rem rgba(0,0,0,0.1);
          transform: translateY(-0.2rem);
        }

        .bd-product-card__swatch {
          position: relative;
          height: 16rem;
          overflow: hidden;
        }

        @media (min-width: 768px) {
          .bd-product-card__swatch {
            height: 20rem;
          }
        }

        .bd-product-card__swatch-inner {
          position: absolute;
          inset: 0;
        }

        .bd-product-card__swatch-pattern {
          position: absolute;
          inset: 0;
          background-image:
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 2rem,
              rgba(255,255,255,0.03) 2rem,
              rgba(255,255,255,0.03) 4rem
            );
        }

        .bd-product-card__tag {
          position: absolute;
          top: 1.2rem;
          right: 1.2rem;
          font-size: 0.9rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: rgba(0,0,0,0.75);
          color: rgba(255,255,255,0.9);
          padding: 0.3rem 0.8rem;
          backdrop-filter: blur(4px);
        }

        .bd-product-card__info {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          padding: 1.4rem 1.2rem;
          background: #eaeef4;
        }

        .bd-product-card__collection {
          font-size: 0.9rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.3);
        }

        .bd-product-card__name {
          font-size: clamp(1.2rem, 1.4vw, 1.4rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #000;
          line-height: 1.2;
        }

        .bd-product-card__finish {
          font-size: 1.0rem;
          color: rgba(0,0,0,0.4);
          letter-spacing: 0.03em;
        }

        /* ── Catalogues ── */
        .bd-catalogues {
          padding: 6rem 0.8rem;
          border-bottom: 0.1rem solid rgba(0,0,0,0.1);
        }

        @media (min-width: 768px) {
          .bd-catalogues {
            padding: 6rem 1.2rem;
          }
        }

        .bd-catalogues__header {
          margin-bottom: 3.2rem;
        }

        .bd-catalogues__heading {
          font-size: clamp(3.6rem, 8vw, 10rem) !important;
          font-weight: 700;
          letter-spacing: -0.05em;
          line-height: 0.9;
          text-transform: uppercase;
          color: #000;
          margin-bottom: 1.2rem;
        }

        .bd-catalogues__sub {
          font-size: 1.4rem;
          color: rgba(0,0,0,0.45);
          letter-spacing: -0.01em;
        }

        .bd-catalogue-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
        }

        @media (min-width: 640px) {
          .bd-catalogue-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (min-width: 1024px) {
          .bd-catalogue-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .bd-catalogue-card {
          display: flex;
          align-items: center;
          gap: 1.6rem;
          padding: 2rem 1.6rem;
          border: 0.1rem solid rgba(0,0,0,0.1);
          text-decoration: none;
          color: inherit;
          transition: background 0.2s ease, transform 0.2s ease;
          position: relative;
        }

        .bd-catalogue-card:hover {
          background: rgba(0,0,0,0.03);
          transform: translateX(0.4rem);
        }

        .bd-catalogue-card__icon {
          flex-shrink: 0;
          opacity: 0.8;
        }

        .bd-catalogue-card__text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .bd-catalogue-card__title {
          font-size: 1.3rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #000;
        }

        .bd-catalogue-card__sub {
          font-size: 1.0rem;
          color: rgba(0,0,0,0.35);
          letter-spacing: 0.03em;
        }

        .bd-catalogue-card__arrow {
          font-size: 1.6rem;
          color: rgba(0,0,0,0.2);
          transition: color 0.2s, transform 0.2s;
        }

        .bd-catalogue-card:hover .bd-catalogue-card__arrow {
          color: rgba(0,0,0,0.7);
          transform: translate(0.3rem, -0.3rem);
        }

        /* ── CTA ── */
        .bd-cta {
          padding: 8rem 0.8rem 10rem;
        }

        @media (min-width: 768px) {
          .bd-cta {
            padding: 8rem 1.2rem 10rem;
          }
        }

        .bd-cta__inner {
          display: flex;
          flex-direction: column;
          gap: 3.2rem;
        }

        @media (min-width: 768px) {
          .bd-cta__inner {
            flex-direction: row;
            align-items: flex-end;
            justify-content: space-between;
          }
        }

        .bd-cta__text {
          font-size: clamp(1.6rem, 2.5vw, 2.4rem);
          font-weight: 600;
          letter-spacing: -0.03em;
          line-height: 1.3;
          color: #000;
          max-width: 52rem;
        }

        .bd-cta__actions {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1.6rem;
          flex-shrink: 0;
        }

        @media (min-width: 768px) {
          .bd-cta__actions {
            align-items: flex-end;
          }
        }

        .bd-cta__back {
          font-size: 1.2rem;
          letter-spacing: 0.02em;
          color: rgba(0,0,0,0.35);
          text-decoration: none;
          text-transform: uppercase;
          transition: color 0.2s;
        }

        .bd-cta__back:hover {
          color: rgba(0,0,0,0.7);
        }
      `}</style>
    </div>
  );
}
