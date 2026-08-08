"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo, use } from "react";
import { getBrandById } from "@/lib/brands";
import { notFound } from "next/navigation";
import CatalogPdfGateModal from "@/components/CatalogPdfGateModal";

type Props = { params: Promise<{ slug: string }> };

export default function BrandDetailPage({ params }: Props) {
  const { slug } = use(params);
  const brand = getBrandById(slug);

  if (!brand) notFound();

  const [activeCollection, setActiveCollection] = useState("All");
  const [mounted, setMounted] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<{ url: string; title: string } | null>(null);
  const [apiProducts, setApiProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    setMounted(true);
    fetch(`/api/products?brand=${encodeURIComponent(brand.name)}&t=${Date.now()}`)
      .then((res) => res.json())
      .then((json) => {
        if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
          setApiProducts(json.data);
        }
      })
      .catch((e) => console.error("Brand products API error:", e));
  }, [brand.name]);

  // Combine hardcoded samples with API products
  const allBrandProducts = useMemo(() => {
    if (apiProducts.length > 0) {
      return apiProducts.map((p) => ({
        id: p.id,
        name: p.name,
        collection: p.subcategory || p.category || "Collection",
        finish: p.finish || p.description || "",
        image: p.imageUrl,
        tag: p.shortCode || p.category,
      }));
    }
    return brand.products;
  }, [apiProducts, brand.products]);

  const filteredProducts = useMemo(() => {
    if (activeCollection === "All") return allBrandProducts;
    return allBrandProducts.filter((p) => p.collection.toLowerCase() === activeCollection.toLowerCase());
  }, [activeCollection, allBrandProducts]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage]);

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
    "freedom-screens": "#6b9e7a",
    peelply: "#a07850",
    inclass: "#7a8fa0",
    wow: "#c87a5a",
    iww: "#8a7aab",
    "living-ceramica": "#9ab08a",
    florim: "#7a9ab0",
    gelli: "#b09a7a",
    jacuzzi: "#6a9ab0",
    "alex-turco": "#c8a06a",
  };
  const accent = accentMap[brand.id] || "#d4af37";


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
            <span className="bd-info-stat__value">{allBrandProducts.length}</span>
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
      {allBrandProducts.length > 0 && (
        <div className="bd-products">
          <div className="bd-products__header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 className="bd-products__heading">Collection</h2>
            <span style={{ fontSize: "0.9rem", color: "#64748b", fontWeight: 600 }}>
              Showing {paginatedProducts.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}–
              {Math.min(currentPage * pageSize, filteredProducts.length)} of {filteredProducts.length} Products
            </span>
          </div>

          {/* Circular Category Cards Row */}
          <div className="bd-category-circles-bar">
            {brand.collections.map((col) => {
              const catSampleProduct = allBrandProducts.find((p) => col === "All" || p.collection.toLowerCase() === col.toLowerCase());
              const thumbUrl = catSampleProduct?.image || brand.hero;
              const count =
                col === "All"
                  ? allBrandProducts.length
                  : allBrandProducts.filter((p) => p.collection.toLowerCase() === col.toLowerCase()).length;

              const isActive = activeCollection === col;

              return (
                <button
                  key={col}
                  onClick={() => {
                    setActiveCollection(col);
                    setCurrentPage(1);
                  }}
                  className={`bd-cat-circle-card${isActive ? " is-active" : ""}`}
                  id={`brand-filter-${brand.id}-${col.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div
                    className="bd-cat-circle__img-wrap"
                    style={isActive ? { borderColor: accent, boxShadow: `0 0 0 3px ${accent}33` } : {}}
                  >
                    <Image
                      src={thumbUrl}
                      alt={col}
                      fill
                      sizes="80px"
                      className="bd-cat-circle__img"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <span className="bd-cat-circle__title">{col}</span>
                  <span className="bd-cat-circle__count">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Product grid (4 items per row, 20 items per page) */}
          {paginatedProducts.length > 0 ? (
            <>
              <div
                className={`bd-product-grid${mounted ? " is-mounted" : ""}`}
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.5rem" }}
              >
                {paginatedProducts.map((product, i) => (
                  <Link
                    href={`/products/${product.id}`}
                    key={product.id}
                    className="bd-product-card"
                    style={{ animationDelay: `${i * 0.04}s`, textDecoration: "none", color: "inherit" }}
                    id={`brand-product-${product.id}`}
                  >
                    {/* Image area */}
                    <div className="bd-product-card__swatch" style={{ height: "260px", position: "relative" }}>
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          className="bd-product-card__swatch-inner"
                          style={{
                            background: `linear-gradient(135deg, ${accent}22 0%, ${accent}44 100%)`,
                          }}
                        >
                          <div className="bd-product-card__swatch-pattern" />
                        </div>
                      )}
                      {product.tag && (
                        <span className="bd-product-card__tag">{product.tag}</span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="bd-product-card__info" style={{ padding: "1rem" }}>
                      <span className="bd-product-card__collection" style={{ fontSize: "0.75rem", color: "#8c764b", fontWeight: 700, textTransform: "uppercase" }}>{product.collection}</span>
                      <h3 className="bd-product-card__name" style={{ fontSize: "0.95rem", fontWeight: 700, margin: "0.2rem 0" }}>{product.name}</h3>
                      {product.finish && (
                        <span className="bd-product-card__finish" style={{ fontSize: "0.8rem", color: "#64748b" }}>{product.finish}</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination (20 products per page) */}
              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", marginTop: "2.5rem" }}>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    style={{ padding: "0.6rem 1.2rem", background: currentPage === 1 ? "#e2e8f0" : "#0f172a", color: currentPage === 1 ? "#94a3b8" : "#fff", border: "none", borderRadius: "6px", cursor: currentPage === 1 ? "not-allowed" : "pointer", fontWeight: 700 }}
                  >
                    ← Prev
                  </button>
                  <span style={{ fontSize: "0.9rem", color: "#475569", fontWeight: 700, padding: "0 0.8rem" }}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    style={{ padding: "0.6rem 1.2rem", background: currentPage === totalPages ? "#e2e8f0" : "#0f172a", color: currentPage === totalPages ? "#94a3b8" : "#fff", border: "none", borderRadius: "6px", cursor: currentPage === totalPages ? "not-allowed" : "pointer", fontWeight: 700 }}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bd-empty-collection" style={{ padding: "4rem 1.2rem", textAlign: "center", color: "rgba(0,0,0,0.4)" }}>
              <p style={{ fontSize: "1.4rem" }}>No items listed in <strong>{activeCollection}</strong> for this brand.</p>
            </div>
          )}
        </div>
      )}

      {/* ── Catalogues (Archiproducts Luxury PDF Card Display) ── */}
      {brand.catalogues.length > 0 && (
        <div className="bd-catalogues">
          <div className="bd-catalogues__header">
            <h2 className="bd-catalogues__heading">Catalogues</h2>
            <p className="bd-catalogues__sub">Explore & view official luxury product catalogues online (Enquiry required to unlock viewing access).</p>
          </div>

          <div className="bd-catalogue-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "2rem" }}>
            {brand.catalogues.map((cat, i) => {
              const rawPdf = (cat as any).url || cat.file || "";
              const pdfUrl = rawPdf.startsWith("http") ? rawPdf : (rawPdf.startsWith("/") ? rawPdf : `/catalogues/${rawPdf}`);

              // Extract 1st Page Cover Thumbnail Image from Google Drive ID
              const driveMatch = rawPdf.match(/\/d\/([a-zA-Z0-9_-]+)/) || rawPdf.match(/id=([a-zA-Z0-9_-]+)/);
              const driveId = driveMatch ? driveMatch[1] : null;
              const coverThumbUrl = driveId ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w800` : null;

              return (
                <div
                  key={i}
                  className="bd-pdf-luxury-card"
                  onClick={() => {
                    setSelectedPdf({ url: pdfUrl, title: `${brand.name} - ${cat.title}` });
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    background: "#ffffff",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid rgba(0,0,0,0.12)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                    position: "relative",
                    cursor: "pointer",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                >
                  {/* Click Overlay - Prevents direct PDF opening */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      zIndex: 15,
                      cursor: "pointer",
                    }}
                  />

                  {/* Luxury Catalogue Badge */}
                  <span
                    style={{
                      position: "absolute",
                      top: "14px",
                      right: "14px",
                      background: "linear-gradient(135deg, #d4af37 0%, #aa820a 100%)",
                      color: "#000000",
                      fontSize: "0.75rem",
                      fontWeight: 900,
                      padding: "0.28rem 0.75rem",
                      borderRadius: "6px",
                      letterSpacing: "0.08em",
                      boxShadow: "0 4px 14px rgba(212, 175, 55, 0.4)",
                      zIndex: 25,
                    }}
                  >
                    OFFICIAL CATALOGUE
                  </span>

                  {/* 1st Page Cover Preview Image Container */}
                  <div
                    style={{
                      height: "320px",
                      background: "linear-gradient(145deg, #181920 0%, #0b0c10 100%)",
                      position: "relative",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {coverThumbUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={coverThumbUrl}
                        alt={`${cat.title} Cover 1st Page`}
                        onError={(e) => {
                          // Try alternative Google Drive direct thumbnail URL if primary thumbnail fails
                          if (driveId && !(e.currentTarget as any).dataset.triedSecondary) {
                            (e.currentTarget as any).dataset.triedSecondary = "true";
                            e.currentTarget.src = `https://lh3.googleusercontent.com/d/${driveId}=s800`;
                          } else if ((brand as any).bannerUrl) {
                            e.currentTarget.src = (brand as any).bannerUrl;
                          }
                        }}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "top center",
                          transition: "transform 0.5s ease",
                        }}
                      />
                    ) : (cat as any).coverImage || (brand as any).bannerUrl ? (
                      <div style={{ position: "relative", width: "100%", height: "100%" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={(cat as any).coverImage || (brand as any).bannerUrl}
                          alt={`${cat.title} Cover`}
                          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.65)" }}
                        />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.85) 100%)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "1.2rem" }}>
                          <span style={{ fontSize: "0.72rem", color: "#d4af37", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>{brand.name}</span>
                          <span style={{ fontSize: "1.05rem", fontWeight: 800, color: "#ffffff", marginTop: "0.2rem" }}>{cat.title}</span>
                          <span style={{ fontSize: "0.72rem", color: "#cbd5e1", marginTop: "0.3rem" }}>Official Specification PDF</span>
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "linear-gradient(135deg, #1e2235 0%, #0b0c10 100%)",
                          color: "#ffffff",
                          padding: "2rem",
                          textAlign: "center",
                          position: "relative",
                        }}
                      >
                        {(brand as any).logoUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={(brand as any).logoUrl} alt={brand.name} style={{ maxHeight: "45px", objectFit: "contain", marginBottom: "1rem", filter: "brightness(0) invert(1)" }} />
                        )}
                        <span style={{ fontSize: "0.75rem", color: "#d4af37", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>{brand.name}</span>
                        <span style={{ fontSize: "1.1rem", fontWeight: 800, marginTop: "0.3rem", color: "#fff" }}>{cat.title}</span>
                        <span style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "0.5rem" }}>Official Architectural Specification PDF</span>
                      </div>
                    )}
                  </div>

                  {/* Card Title & Meta Info */}
                  <div style={{ padding: "1.4rem 1.2rem", background: "#ffffff", display: "flex", flexDirection: "column", gap: "0.4rem", position: "relative", zIndex: 20 }}>
                    <span style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", lineHeight: 1.3 }}>
                      {cat.title}
                    </span>
                    {cat.subtitle && (
                      <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 500 }}>
                        {cat.subtitle}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPdf({ url: pdfUrl, title: `${brand.name} - ${cat.title}` });
                      }}
                      style={{
                        fontSize: "0.85rem",
                        color: "#ffffff",
                        background: "linear-gradient(135deg, #1e2235 0%, #12141f 100%)",
                        border: "1px solid rgba(212,175,55,0.3)",
                        borderRadius: "6px",
                        padding: "0.7rem 1rem",
                        fontWeight: 800,
                        cursor: "pointer",
                        marginTop: "0.6rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        boxShadow: "0 4px 12px rgba(15, 23, 42, 0.2)",
                      }}
                    >
                      View Catalog ↗
                    </button>
                  </div>
                </div>
              );
            })}
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

      {/* ── PDF Gate Modal ── */}
      {selectedPdf && (
        <CatalogPdfGateModal
          catalogPdfUrl={selectedPdf.url}
          itemTitle={selectedPdf.title}
          onClose={() => setSelectedPdf(null)}
        />
      )}

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

        /* Category Circle Cards Bar (Image 1 & user layout) */
        .bd-category-circles-bar {
          display: flex;
          align-items: center;
          gap: 2.4rem;
          padding: 0 0.8rem 3.2rem;
          border-bottom: 0.1rem solid rgba(0,0,0,0.08);
          margin-bottom: 3.2rem;
          overflow-x: auto;
        }

        @media (min-width: 768px) {
          .bd-category-circles-bar {
            padding: 0 1.2rem 3.2rem;
            gap: 3.6rem;
          }
        }

        .bd-cat-circle-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: inherit;
          padding: 0;
          transition: transform 0.2s ease;
        }

        .bd-cat-circle-card:hover {
          transform: translateY(-3px);
        }

        .bd-cat-circle__img-wrap {
          width: 7.2rem;
          height: 7.2rem;
          border-radius: 50%;
          overflow: hidden;
          position: relative;
          border: 0.2rem solid rgba(0,0,0,0.12);
          background: #e2e8f0;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        @media (min-width: 768px) {
          .bd-cat-circle__img-wrap {
            width: 8.8rem;
            height: 8.8rem;
          }
        }

        .bd-cat-circle-card.is-active .bd-cat-circle__img-wrap {
          border-width: 0.25rem;
        }

        .bd-cat-circle__title {
          font-size: 1.2rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: rgba(0,0,0,0.7);
          text-transform: capitalize;
        }

        .bd-cat-circle-card.is-active .bd-cat-circle__title {
          color: #000;
          font-weight: 700;
        }

        .bd-cat-circle__count {
          font-size: 1.1rem;
          color: rgba(0,0,0,0.4);
          font-weight: 500;
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
