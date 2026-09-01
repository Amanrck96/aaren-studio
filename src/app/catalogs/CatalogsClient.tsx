"use client";

import { useEffect, useState } from "react";
import CatalogDownloadModal, { getPdfCoverThumbnail } from "@/components/CatalogDownloadModal";
import { PdfCatalogItem } from "@/lib/types";
import { getPdfThumbnail, resolveCatalogDetails } from "@/utils/pdfThumbnail";

interface CatalogsClientProps {
  initialCatalogs?: PdfCatalogItem[];
}

export default function CatalogsClient({ initialCatalogs }: CatalogsClientProps) {
  const [catalogs, setCatalogs] = useState<PdfCatalogItem[]>(initialCatalogs || []);
  const [loading, setLoading] = useState(!initialCatalogs || initialCatalogs.length === 0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [activeCatalog, setActiveCatalog] = useState<PdfCatalogItem | null>(null);

  useEffect(() => {
    if (initialCatalogs && initialCatalogs.length > 0) return;
    fetchCatalogs();
  }, [initialCatalogs]);

  async function fetchCatalogs() {
    try {
      const res = await fetch("/api/catalogs");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setCatalogs(json.data);
      }
    } catch (e) {
      console.error("Failed to fetch catalogs:", e);
    } finally {
      setLoading(false);
    }
  }

  const categories = ["All", ...Array.from(new Set(catalogs.map((c) => c.category)))];
  const brands = ["All", ...Array.from(new Set(catalogs.map((c) => c.brand)))];

  const filteredCatalogs = catalogs.filter((c) => {
    const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;
    const matchesBrand = selectedBrand === "All" || c.brand === selectedBrand;
    const matchesSearch =
      !searchQuery ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesBrand && matchesSearch;
  });

  return (
    <div style={{ background: "#E6E2D8", color: "#1e1e1e", minHeight: "100vh", display: "flex", flexDirection: "column", paddingTop: "8rem" }}>
      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="page-header__inner">
          <div className="page-meta">
            ARCHITECTURAL SPECIFICATION &amp; MATERIAL LAB
          </div>
          <h1 className="page-title">
            CATALOGUES
          </h1>
          <p className="page-desc">
            Explore official product brochures, high-res finish collections, and technical joinery specification guides from top European &amp; Italian surface brands.
          </p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <section style={{ maxWidth: "1280px", margin: "-1.8rem auto 2.5rem", padding: "0 1.5rem", width: "100%", zIndex: 10 }}>
        <div
          style={{
            background: "#EDE8DF",
            borderRadius: "14px",
            padding: "1.2rem 1.6rem",
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.08)",
            border: "1px solid rgba(129,102,63,0.2)",
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Search Box */}
          <div style={{ flex: "1 1 280px", position: "relative" }}>
            <input
              type="text"
              placeholder="Search catalog titles, brands, or materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem 0.75rem 2.4rem",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "0.92rem",
                color: "#0f172a",
              }}
            />
            <span style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}>
              🔍
            </span>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", flex: "2 1 400px" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "0.5rem 0.95rem",
                  borderRadius: "20px",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  border: selectedCategory === cat ? "none" : "1px solid #e2e8f0",
                  background: selectedCategory === cat ? "#8c764b" : "#f1f5f9",
                  color: selectedCategory === cat ? "#ffffff" : "#475569",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Brand Filter */}
          <div style={{ minWidth: "160px" }}>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              style={{
                width: "100%",
                padding: "0.65rem 0.9rem",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#334155",
                background: "#ffffff",
              }}
            >
              <option value="All">All Brands</option>
              {brands.filter((b) => b !== "All").map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Main Catalogs Grid */}
      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem 4rem", flex: 1, width: "100%" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "#64748b" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⏳</div>
            Loading PDF catalog collection...
          </div>
        ) : filteredCatalogs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "#64748b", background: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📁</div>
            <h3 style={{ margin: "0 0 0.5rem 0", color: "#1e293b" }}>No PDF Catalogs Found</h3>
            <p style={{ margin: 0 }}>Try clearing your search query or choosing another category filter.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "2rem" }}>
            {filteredCatalogs.map((cat) => {
              const resolved = resolveCatalogDetails({
                catalogPdfUrl: cat.fileUrl,
                title: cat.title,
                brand: cat.brand,
                coverImage: (cat as any).coverImage || (cat as any).coverThumbUrl,
              });
              const coverThumb = resolved.coverThumb || getPdfThumbnail((cat as any).pdfPublicId || cat.fileUrl || cat.title || "", {
                title: cat.title,
                coverImage: (cat as any).coverImage || (cat as any).coverThumbUrl,
                brandId: cat.brand,
              });

              return (
                <div
                  key={cat.id}
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  {/* PDF First Page Cover Thumbnail Header */}
                  <div style={{ position: "relative", width: "100%", height: "280px", background: "#0f172a", overflow: "hidden" }}>
                    {coverThumb ? (
                      <img
                        src={coverThumb}
                        alt={cat.title}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                      />
                    ) : null}

                  {/* Gradient Overlay & Badges */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(180deg, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.85) 100%)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "1rem",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ padding: "0.3rem 0.7rem", background: "#8c764b", color: "#ffffff", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 800 }}>
                        {cat.brand}
                      </span>
                      <span style={{ padding: "0.3rem 0.75rem", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", color: "#fbbf24", borderRadius: "12px", fontSize: "0.72rem", fontWeight: 800, border: "1px solid rgba(251,191,36,0.3)" }}>
                        OFFICIAL CATALOGUE
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: "0.8rem", fontSize: "0.75rem", color: "#e2e8f0", fontWeight: 700 }}>
                      <span style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)", padding: "2px 8px", borderRadius: "4px" }}>
                        📄 {cat.pageCount} Pages
                      </span>
                      <span style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)", padding: "2px 8px", borderRadius: "4px" }}>
                        💾 {cat.fileSize}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#8c764b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.3rem" }}>
                      {cat.category} {cat.subcategory ? `• ${cat.subcategory}` : ""}
                    </div>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.5rem 0", lineHeight: 1.35 }}>
                      {cat.title}
                    </h3>
                    <p style={{ color: "#64748b", fontSize: "0.88rem", lineHeight: 1.5, margin: "0 0 1rem 0" }}>
                      {cat.description}
                    </p>
                  </div>

                  {/* Footer & Action Button */}
                  <div>
                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1.2rem" }}>
                      {(cat.tags || []).map((t) => (
                        <span key={t} style={{ background: "#f1f5f9", color: "#475569", fontSize: "0.72rem", padding: "2px 8px", borderRadius: "4px", fontWeight: 600 }}>
                          #{t}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => setActiveCatalog(cat)}
                      style={{
                        width: "100%",
                        padding: "0.85rem 1rem",
                        background: "#8c764b",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: 800,
                        fontSize: "0.92rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        boxShadow: "0 4px 12px rgba(140, 118, 75, 0.25)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <span>View Catalog ↗</span>
                    </button>
                  </div>
                </div>
              </div>
            ); })}
          </div>
        )}
      </main>

      {/* Lead Capture Modal */}
      {activeCatalog && (
        <CatalogDownloadModal
          catalog={activeCatalog}
          onClose={() => setActiveCatalog(null)}
          onSuccess={() => {
            fetchCatalogs();
          }}
        />
      )}
    </div>
  );
}
