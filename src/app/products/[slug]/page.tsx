"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import { getCategoryById } from "@/lib/products";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default function ProductDetailPage({ params }: Props) {
  const { slug } = use(params);
  const category = getCategoryById(slug);

  if (!category) notFound();

  const [activeFilter, setActiveFilter] = useState("All");
  const [activeFinish, setActiveFinish] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredLines = category.lines.filter((line) => {
    const subMatch = activeFilter === "All" || line.subcategory === activeFilter;
    const finishMatch = activeFinish === "All" || line.finish === activeFinish;
    return subMatch && finishMatch;
  });

  const allFinishes = ["All", ...category.finishes];

  return (
    <div className="product-detail">

      {/* ── Hero ── */}
      <div className="pd-hero">
        <div className="pd-hero__img-wrap">
          <Image
            src={category.hero}
            alt={category.name}
            fill
            priority
            sizes="100vw"
            className="pd-hero__img"
            style={{ objectFit: "cover" }}
          />
          <div className="pd-hero__gradient" />
        </div>

        <div className="pd-hero__content">
          <div className="pd-hero__breadcrumb">
            <Link href="/products" className="pd-hero__breadcrumb-link">Products</Link>
            <span className="pd-hero__breadcrumb-sep">→</span>
            <span>{category.name}</span>
          </div>

          <div className="pd-hero__meta">
            <span className="pd-hero__num">{category.num}</span>
            <span className="pd-hero__code">{category.code}</span>
          </div>

          <h1 className="pd-hero__title">{category.name}</h1>

          <div className="pd-hero__tags">
            <span className="pd-hero__tag">{category.lines.length} Product Lines</span>
            <span className="pd-hero__tag">{category.subcategories.length - 1} Subcategories</span>
            {category.relatedBrands.length > 0 && (
              <span className="pd-hero__tag">{category.relatedBrands.length} Brand{category.relatedBrands.length > 1 ? "s" : ""}</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Layout: Sidebar + Grid ── */}
      <div className="pd-main">

        {/* Mobile filter toggle */}
        <button
          className="pd-filter-toggle"
          onClick={() => setSidebarOpen((v) => !v)}
          aria-expanded={sidebarOpen}
          id="product-filter-toggle"
        >
          <span>{sidebarOpen ? "Hide Filters" : "Show Filters"}</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            style={{ transform: sidebarOpen ? "rotate(180deg)" : "none", transition: "transform 0.25s ease" }}
          >
            <path d="M2 4h12M4 8h8M6 12h4" />
          </svg>
        </button>

        {/* ── LEFT: Sidebar ── */}
        <aside className={`pd-sidebar${sidebarOpen || mounted && window?.innerWidth >= 1024 ? " is-open" : ""}`} id="product-sidebar">

          {/* Description */}
          <div className="pd-sidebar__desc-block">
            <p className="pd-sidebar__desc">{category.description}</p>
          </div>

          {/* Subcategory filter */}
          <div className="pd-sidebar__section">
            <span className="pd-sidebar__section-label">Subcategory</span>
            <div className="pd-sidebar__options">
              {category.subcategories.map((sub) => (
                <button
                  key={sub}
                  className={`pd-sidebar__option${activeFilter === sub ? " is-active" : ""}`}
                  onClick={() => setActiveFilter(sub)}
                  id={`filter-sub-${sub.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <span className="pd-sidebar__option-dot" />
                  <span>{sub}</span>
                  {sub !== "All" && (
                    <span className="pd-sidebar__option-count">
                      {category.lines.filter((l) => l.subcategory === sub).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Finish filter */}
          {category.finishes.length > 0 && (
            <div className="pd-sidebar__section">
              <span className="pd-sidebar__section-label">Finish</span>
              <div className="pd-sidebar__options">
                {allFinishes.map((finish) => (
                  <button
                    key={finish}
                    className={`pd-sidebar__option${activeFinish === finish ? " is-active" : ""}`}
                    onClick={() => setActiveFinish(finish)}
                    id={`filter-finish-${finish.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <span className="pd-sidebar__option-dot" />
                    <span>{finish}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Related Brands */}
          {category.relatedBrands.length > 0 && (
            <div className="pd-sidebar__section">
              <span className="pd-sidebar__section-label">Brands</span>
              <div className="pd-sidebar__brands">
                {category.relatedBrands.map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/brands/${brand.id}`}
                    className="pd-sidebar__brand-link"
                    id={`related-brand-${brand.id}`}
                  >
                    <div className="pd-sidebar__brand-logo-wrap">
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        width={80}
                        height={32}
                        style={{ objectFit: "contain", objectPosition: "left center" }}
                      />
                    </div>
                    <span className="pd-sidebar__brand-arrow">→</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA in sidebar */}
          <div className="pd-sidebar__cta">
            <Link href="/contact" className="pd-sidebar__cta-btn" id="product-sidebar-cta">
              Request Sample
            </Link>
          </div>
        </aside>

        {/* ── RIGHT: Product Grid ── */}
        <div className="pd-grid-area">

          {/* Active filter indicator */}
          <div className="pd-grid-header">
            <span className="pd-grid-count">
              {filteredLines.length} {filteredLines.length === 1 ? "line" : "lines"}
              {activeFilter !== "All" && ` in ${activeFilter}`}
            </span>
            {(activeFilter !== "All" || activeFinish !== "All") && (
              <button
                className="pd-grid-clear"
                onClick={() => { setActiveFilter("All"); setActiveFinish("All"); }}
                id="filter-clear-all"
              >
                Clear filters ✕
              </button>
            )}
          </div>

          <div className={`pd-product-grid${mounted ? " is-mounted" : ""}`}>
            {filteredLines.length === 0 ? (
              <div className="pd-empty">
                <p>No product lines match the current filters.</p>
                <button onClick={() => { setActiveFilter("All"); setActiveFinish("All"); }} className="pd-empty__reset">
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredLines.map((line, i) => (
                <div
                  key={line.id}
                  className="pd-product-tile"
                  style={{ animationDelay: `${i * 0.08}s` }}
                  id={`product-line-${line.id}`}
                >
                  {/* Image / Visual */}
                  <div className="pd-product-tile__visual">
                    <div className="pd-product-tile__img-wrap">
                      <Image
                        src={category.hero}
                        alt={line.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="pd-product-tile__img"
                        style={{ objectFit: "cover" }}
                      />
                      <div className="pd-product-tile__overlay" />
                    </div>

                    {line.tag && (
                      <span className="pd-product-tile__badge">{line.tag}</span>
                    )}

                    {/* Hover reveal */}
                    <div className="pd-product-tile__hover-info">
                      <p>{line.description || line.name}</p>
                    </div>
                  </div>

                  {/* Caption */}
                  <div className="pd-product-tile__caption">
                    <div className="pd-product-tile__caption-top">
                      <span className="pd-product-tile__name">{line.name}</span>
                      <span className="pd-product-tile__sub-label">{line.subcategory}</span>
                    </div>
                    <div className="pd-product-tile__caption-bottom">
                      <span className="pd-product-tile__brand">
                        {line.brand}
                        {line.brandId && (
                          <Link
                            href={`/brands/${line.brandId}`}
                            className="pd-product-tile__brand-link"
                            onClick={(e) => e.stopPropagation()}
                          >
                            ↗
                          </Link>
                        )}
                      </span>
                      {line.finish && (
                        <span className="pd-product-tile__finish">{line.finish}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Related Brands Strip ── */}
      {category.relatedBrands.length > 0 && (
        <div className="pd-brands-strip">
          <div className="pd-brands-strip__inner">
            <p className="pd-brands-strip__label">Partner Brands</p>
            <div className="pd-brands-strip__logos">
              {category.relatedBrands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.id}`}
                  className="pd-brands-strip__logo-wrap"
                  id={`brands-strip-${brand.id}`}
                >
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={120}
                    height={48}
                    style={{ objectFit: "contain", objectPosition: "center" }}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CTA ── */}
      <div className="pd-cta">
        <div className="pd-cta__inner">
          <div className="pd-cta__left">
            <p className="pd-cta__label t-tag" style={{ color: "rgba(0,0,0,0.35)", marginBottom: "1.2rem" }}>
              Explore with us
            </p>
            <p className="pd-cta__text">
              Interested in {category.name} for your project? Let&apos;s discuss specifications, samples, and timelines.
            </p>
          </div>
          <div className="pd-cta__actions">
            <Link href="/contact" className="ul-link t-cta-1" id={`product-${category.id}-cta`}>
              Request Consultation →
            </Link>
            <Link href="/products" className="pd-cta__back">
              ← All Categories
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        /* ── Product Detail Page ── */
        .product-detail {
          background: #eaeef4;
          color: #000;
          min-height: 100vh;
          padding-top: 8rem;
        }

        /* ── Hero ── */
        .pd-hero {
          position: relative;
          height: 70vh;
          min-height: 48rem;
          max-height: 80rem;
          overflow: hidden;
        }

        .pd-hero__img-wrap {
          position: absolute;
          inset: 0;
        }

        .pd-hero__img {
          transition: transform 8s ease !important;
        }

        .product-detail:hover .pd-hero__img {
          transform: scale(1.04);
        }

        .pd-hero__gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.05) 0%,
            rgba(0,0,0,0.45) 100%
          );
        }

        .pd-hero__content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 3.2rem 0.8rem;
        }

        @media (min-width: 768px) {
          .pd-hero__content {
            padding: 4rem 1.2rem;
          }
        }

        .pd-hero__breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          font-size: 1.1rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
          margin-bottom: 2rem;
        }

        .pd-hero__breadcrumb-link {
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          transition: color 0.2s;
        }

        .pd-hero__breadcrumb-link:hover {
          color: #fff;
        }

        .pd-hero__breadcrumb-sep {
          color: rgba(255,255,255,0.3);
        }

        .pd-hero__meta {
          display: flex;
          align-items: center;
          gap: 1.6rem;
          margin-bottom: 1.2rem;
        }

        .pd-hero__num {
          font-size: 1.0rem;
          letter-spacing: 0.12em;
          color: rgba(255,255,255,0.35);
          font-weight: 700;
          text-transform: uppercase;
        }

        .pd-hero__code {
          font-size: clamp(1.2rem, 2vw, 1.6rem);
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.4);
          font-weight: 700;
          text-transform: uppercase;
          border: 0.1rem solid rgba(255,255,255,0.2);
          padding: 0.3rem 0.8rem;
        }

        .pd-hero__title {
          font-size: clamp(5rem, 12vw, 18rem) !important;
          font-weight: 700;
          letter-spacing: -0.05em;
          line-height: 0.88;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 2.4rem;
        }

        .pd-hero__tags {
          display: flex;
          gap: 0.8rem;
          flex-wrap: wrap;
        }

        .pd-hero__tag {
          font-size: 1.1rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.65);
          border: 0.1rem solid rgba(255,255,255,0.2);
          padding: 0.4rem 1rem;
        }

        /* ── Main Layout ── */
        .pd-main {
          display: block;
        }

        @media (min-width: 1024px) {
          .pd-main {
            display: grid;
            grid-template-columns: 28rem 1fr;
            grid-template-rows: auto 1fr;
            align-items: start;
          }
        }

        /* Mobile filter toggle */
        .pd-filter-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 1.6rem 0.8rem;
          border: none;
          border-bottom: 0.1rem solid rgba(0,0,0,0.12);
          background: transparent;
          font-family: inherit;
          font-size: 1.2rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.6);
          cursor: pointer;
        }

        @media (min-width: 1024px) {
          .pd-filter-toggle {
            display: none;
          }
        }

        /* ── Sidebar ── */
        .pd-sidebar {
          display: none;
          flex-direction: column;
          gap: 0;
          border-right: 0.1rem solid rgba(0,0,0,0.1);
          position: sticky;
          top: 8rem;
          max-height: calc(100vh - 8rem);
          overflow-y: auto;
          grid-row: 1 / 3;
        }

        .pd-sidebar.is-open {
          display: flex;
        }

        @media (min-width: 1024px) {
          .pd-sidebar {
            display: flex !important;
          }
        }

        .pd-sidebar__desc-block {
          padding: 2.4rem 1.6rem;
          border-bottom: 0.1rem solid rgba(0,0,0,0.08);
        }

        .pd-sidebar__desc {
          font-size: 1.3rem;
          line-height: 1.6;
          color: rgba(0,0,0,0.55);
          letter-spacing: -0.01em;
        }

        .pd-sidebar__section {
          padding: 2rem 1.6rem;
          border-bottom: 0.1rem solid rgba(0,0,0,0.08);
        }

        .pd-sidebar__section-label {
          display: block;
          font-size: 0.95rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.3);
          margin-bottom: 1.2rem;
        }

        .pd-sidebar__options {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .pd-sidebar__option {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.7rem 0;
          border: none;
          background: transparent;
          font-family: inherit;
          font-size: 1.3rem;
          letter-spacing: -0.01em;
          color: rgba(0,0,0,0.5);
          cursor: pointer;
          text-align: left;
          transition: color 0.2s;
        }

        .pd-sidebar__option:hover {
          color: #000;
        }

        .pd-sidebar__option.is-active {
          color: #000;
          font-weight: 700;
        }

        .pd-sidebar__option-dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          background: rgba(0,0,0,0.2);
          flex-shrink: 0;
          transition: background 0.2s;
        }

        .pd-sidebar__option.is-active .pd-sidebar__option-dot {
          background: #000;
        }

        .pd-sidebar__option-count {
          margin-left: auto;
          font-size: 1.0rem;
          color: rgba(0,0,0,0.25);
          font-weight: 400;
        }

        .pd-sidebar__brands {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .pd-sidebar__brand-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.2rem;
          border: 0.1rem solid rgba(0,0,0,0.1);
          text-decoration: none;
          transition: background 0.2s;
        }

        .pd-sidebar__brand-link:hover {
          background: rgba(0,0,0,0.03);
        }

        .pd-sidebar__brand-logo-wrap {
          height: 2.8rem;
          display: flex;
          align-items: center;
        }

        .pd-sidebar__brand-arrow {
          font-size: 1.2rem;
          color: rgba(0,0,0,0.3);
          transition: color 0.2s, transform 0.2s;
        }

        .pd-sidebar__brand-link:hover .pd-sidebar__brand-arrow {
          color: #000;
          transform: translate(0.2rem, -0.2rem);
        }

        .pd-sidebar__cta {
          padding: 2rem 1.6rem;
        }

        .pd-sidebar__cta-btn {
          display: block;
          width: 100%;
          padding: 1.2rem 1.6rem;
          background: #000;
          color: #eaeef4;
          text-align: center;
          font-size: 1.2rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          text-decoration: none;
          font-family: inherit;
          font-weight: 600;
          transition: background 0.2s;
        }

        .pd-sidebar__cta-btn:hover {
          background: #1a1a1a;
        }

        /* ── Product Grid ── */
        .pd-grid-area {
          display: flex;
          flex-direction: column;
          min-height: 40rem;
        }

        .pd-grid-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.6rem 0.8rem;
          border-bottom: 0.1rem solid rgba(0,0,0,0.1);
        }

        @media (min-width: 1024px) {
          .pd-grid-header {
            padding: 1.6rem 1.6rem;
          }
        }

        .pd-grid-count {
          font-size: 1.1rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.35);
        }

        .pd-grid-clear {
          font-size: 1.0rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.45);
          background: none;
          border: 0.1rem solid rgba(0,0,0,0.15);
          padding: 0.4rem 0.8rem;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }

        .pd-grid-clear:hover {
          color: #000;
          border-color: rgba(0,0,0,0.4);
        }

        .pd-product-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          padding: 0;
        }

        @media (min-width: 640px) {
          .pd-product-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .pd-product-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        /* Product tile */
        .pd-product-tile {
          display: flex;
          flex-direction: column;
          border: 0.05rem solid rgba(0,0,0,0.08);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          animation: pdFadeIn 0.4s ease both;
        }

        @keyframes pdFadeIn {
          from { opacity: 0; transform: translateY(1.6rem); }
          to { opacity: 1; transform: translateY(0); }
        }

        .pd-product-tile:hover {
          z-index: 2;
          box-shadow: 0 0.8rem 3.2rem rgba(0,0,0,0.12);
          transform: translateY(-0.3rem);
        }

        .pd-product-tile__visual {
          position: relative;
          overflow: hidden;
          height: 22rem;
        }

        @media (min-width: 768px) {
          .pd-product-tile__visual {
            height: 28rem;
          }
        }

        .pd-product-tile__img-wrap {
          position: absolute;
          inset: 0;
        }

        .pd-product-tile__img {
          transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
        }

        .pd-product-tile:hover .pd-product-tile__img {
          transform: scale(1.06);
        }

        .pd-product-tile__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.5) 100%);
          transition: opacity 0.3s;
        }

        /* Badge */
        .pd-product-tile__badge {
          position: absolute;
          top: 1.2rem;
          left: 1.2rem;
          font-size: 0.95rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: rgba(0,0,0,0.75);
          color: rgba(255,255,255,0.9);
          padding: 0.3rem 0.8rem;
          backdrop-filter: blur(4px);
          z-index: 2;
        }

        /* Hover reveal info */
        .pd-product-tile__hover-info {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          padding: 1.6rem;
          background: rgba(0,0,0,0.6);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 3;
        }

        .pd-product-tile:hover .pd-product-tile__hover-info {
          opacity: 1;
        }

        .pd-product-tile__hover-info p {
          font-size: 1.2rem;
          color: rgba(255,255,255,0.85);
          line-height: 1.5;
          letter-spacing: -0.01em;
        }

        /* Caption */
        .pd-product-tile__caption {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          padding: 1.4rem 1.2rem;
          background: #eaeef4;
          transition: background 0.2s;
        }

        .pd-product-tile:hover .pd-product-tile__caption {
          background: #dfe3e9;
        }

        .pd-product-tile__caption-top {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .pd-product-tile__name {
          font-size: clamp(1.2rem, 1.4vw, 1.4rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #000;
          line-height: 1.2;
        }

        .pd-product-tile__sub-label {
          font-size: 0.95rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.3);
        }

        .pd-product-tile__caption-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.8rem;
          margin-top: 0.2rem;
          padding-top: 0.8rem;
          border-top: 0.1rem solid rgba(0,0,0,0.07);
        }

        .pd-product-tile__brand {
          font-size: 1.1rem;
          letter-spacing: -0.01em;
          color: rgba(0,0,0,0.45);
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .pd-product-tile__brand-link {
          font-size: 1.0rem;
          color: rgba(0,0,0,0.3);
          text-decoration: none;
          transition: color 0.2s;
        }

        .pd-product-tile__brand-link:hover {
          color: #000;
        }

        .pd-product-tile__finish {
          font-size: 1.0rem;
          color: rgba(0,0,0,0.3);
          letter-spacing: 0.03em;
          text-align: right;
        }

        /* Empty state */
        .pd-empty {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          padding: 8rem 2rem;
          text-align: center;
          color: rgba(0,0,0,0.4);
          font-size: 1.4rem;
        }

        .pd-empty__reset {
          border: 0.1rem solid rgba(0,0,0,0.2);
          padding: 0.8rem 2rem;
          background: none;
          font-family: inherit;
          font-size: 1.2rem;
          color: rgba(0,0,0,0.5);
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .pd-empty__reset:hover {
          color: #000;
          border-color: #000;
        }

        /* ── Related Brands Strip ── */
        .pd-brands-strip {
          border-top: 0.1rem solid rgba(0,0,0,0.1);
          border-bottom: 0.1rem solid rgba(0,0,0,0.1);
          padding: 3.2rem 0.8rem;
        }

        @media (min-width: 768px) {
          .pd-brands-strip {
            padding: 3.2rem 1.2rem;
          }
        }

        .pd-brands-strip__inner {
          display: flex;
          align-items: center;
          gap: 3.2rem;
          flex-wrap: wrap;
        }

        .pd-brands-strip__label {
          font-size: 1.0rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.3);
          white-space: nowrap;
        }

        .pd-brands-strip__logos {
          display: flex;
          align-items: center;
          gap: 2.4rem;
          flex-wrap: wrap;
        }

        .pd-brands-strip__logo-wrap {
          display: flex;
          align-items: center;
          height: 4rem;
          opacity: 0.5;
          transition: opacity 0.2s;
          text-decoration: none;
        }

        .pd-brands-strip__logo-wrap:hover {
          opacity: 1;
        }

        /* ── CTA ── */
        .pd-cta {
          padding: 8rem 0.8rem 10rem;
          border-top: 0.1rem solid rgba(0,0,0,0.1);
        }

        @media (min-width: 768px) {
          .pd-cta {
            padding: 8rem 1.2rem 10rem;
          }
        }

        .pd-cta__inner {
          display: flex;
          flex-direction: column;
          gap: 3.2rem;
        }

        @media (min-width: 768px) {
          .pd-cta__inner {
            flex-direction: row;
            align-items: flex-end;
            justify-content: space-between;
          }
        }

        .pd-cta__text {
          font-size: clamp(1.6rem, 2.5vw, 2.4rem);
          font-weight: 600;
          letter-spacing: -0.03em;
          line-height: 1.3;
          color: #000;
          max-width: 52rem;
        }

        .pd-cta__actions {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1.6rem;
          flex-shrink: 0;
        }

        @media (min-width: 768px) {
          .pd-cta__actions {
            align-items: flex-end;
          }
        }

        .pd-cta__back {
          font-size: 1.2rem;
          letter-spacing: 0.02em;
          color: rgba(0,0,0,0.35);
          text-decoration: none;
          text-transform: uppercase;
          transition: color 0.2s;
        }

        .pd-cta__back:hover {
          color: rgba(0,0,0,0.7);
        }
      `}</style>
    </div>
  );
}
