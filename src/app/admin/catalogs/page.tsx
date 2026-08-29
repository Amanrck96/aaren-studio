"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminNav from "@/components/AdminNav";
import { PdfCatalogItem } from "@/lib/types";
import { getPdfThumbnail, resolveCatalogDetails } from "@/utils/pdfThumbnail";
import { ExternalLink, RefreshCw, Search, Eye } from "lucide-react";
import CatalogPdfGateModal from "@/components/CatalogPdfGateModal";

export default function AdminCatalogsPage() {
  const [catalogs, setCatalogs] = useState<PdfCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [previewPdf, setPreviewPdf] = useState<{ url: string; title: string; coverImage?: string } | null>(null);

  const fetchCatalogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/catalogs?t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setCatalogs(json.data);
        }
      }
    } catch (e) {
      console.error("Error fetching catalogs:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogs();
  }, []);

  const brands = ["All", ...Array.from(new Set(catalogs.map((c) => c.brand).filter(Boolean)))];

  const filtered = catalogs.filter((c) => {
    const matchesBrand = selectedBrand === "All" || c.brand === selectedBrand;
    const matchesSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.brand.toLowerCase().includes(search.toLowerCase()) ||
      (c.category && c.category.toLowerCase().includes(search.toLowerCase()));
    return matchesBrand && matchesSearch;
  });

  return (
    <div style={{ background: "#FAF8F5", color: "#1E1E1E", minHeight: "100vh" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem", background: "#FAF8F5" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.8rem" }}>📄</span>
              <h1 style={{ fontSize: "1.9rem", fontWeight: 900, color: "#81663F", margin: 0 }}>
                PDF Catalogs &amp; Architectural Brochures
              </h1>
            </div>
            <p style={{ color: "#5E5852", fontSize: "0.92rem", margin: "4px 0 0" }}>
              Live index of all brand specification PDF catalogs ({catalogs.length} active documents).
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              onClick={fetchCatalogs}
              disabled={loading}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "0.65rem 1.2rem",
                background: "#FAF8F5",
                border: "1px solid #D5CEBF",
                borderRadius: "8px",
                fontWeight: 700,
                color: "#1E1E1E",
                cursor: loading ? "wait" : "pointer",
                fontSize: "0.85rem",
              }}
            >
              <RefreshCw size={14} className={loading ? "spin" : ""} />
              <span>Refresh Live Index</span>
            </button>
            <Link
              href="/admin/brands"
              style={{
                padding: "0.65rem 1.4rem",
                background: "#81663F",
                color: "#FFFFFF",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 800,
                fontSize: "0.85rem",
                boxShadow: "0 4px 12px rgba(129,102,63,0.25)",
              }}
            >
              Manage in Brands CMS →
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div
          style={{
            background: "#FFFFFF",
            padding: "1.2rem 1.5rem",
            borderRadius: "14px",
            border: "1px solid #E2DCD2",
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "2rem",
            boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
          }}
        >
          <div style={{ flex: "1 1 280px", position: "relative" }}>
            <input
              type="text"
              placeholder="Search catalog titles, brands, or materials..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "0.65rem 1rem 0.65rem 2.2rem",
                borderRadius: "8px",
                border: "1px solid #D5CEBF",
                background: "#FAF8F5",
                color: "#1E1E1E",
                fontSize: "0.88rem",
              }}
            />
            <Search size={14} style={{ position: "absolute", left: "0.8rem", top: "50%", transform: "translateY(-50%)", color: "#81663F" }} />
          </div>

          <div style={{ minWidth: "180px" }}>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              style={{
                width: "100%",
                padding: "0.65rem 1rem",
                borderRadius: "8px",
                border: "1px solid #D5CEBF",
                background: "#FAF8F5",
                color: "#1E1E1E",
                fontSize: "0.88rem",
                fontWeight: 600,
              }}
            >
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b === "All" ? "All Brands" : b}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Catalogs Table */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "14px",
            border: "1px solid #E2DCD2",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          }}
        >
          {loading ? (
            <div style={{ padding: "4rem", textAlign: "center", color: "#81663F", fontWeight: 700 }}>
              Loading catalogs index...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "4rem", textAlign: "center", color: "#6A6359" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📂</div>
              <p style={{ margin: 0, fontWeight: 700 }}>No PDF catalogs match your query.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
                <thead>
                  <tr style={{ background: "#FAF8F5", borderBottom: "1px solid #E2DCD2", color: "#81663F", fontWeight: 800 }}>
                    <th style={{ padding: "1rem 1.2rem" }}>Cover</th>
                    <th style={{ padding: "1rem 1.2rem" }}>Title / Brochure</th>
                    <th style={{ padding: "1rem 1.2rem" }}>Brand</th>
                    <th style={{ padding: "1rem 1.2rem" }}>Category</th>
                    <th style={{ padding: "1rem 1.2rem" }}>Downloads</th>
                    <th style={{ padding: "1rem 1.2rem", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((cat, idx) => {
                    const resolved = resolveCatalogDetails({
                      catalogPdfUrl: cat.fileUrl || cat.pdfUrl,
                      title: cat.title,
                      brand: cat.brand,
                      coverImage: cat.thumbnailUrl || (cat as any).coverImage,
                    });
                    const coverThumb = resolved.coverThumb || getPdfThumbnail(cat.fileUrl || cat.pdfUrl || "", { title: cat.title, brandId: cat.brand });

                    return (
                      <tr
                        key={cat.id || idx}
                        style={{
                          borderBottom: "1px solid #F0ECE4",
                          background: idx % 2 === 0 ? "#FFFFFF" : "#FAF8F5",
                          transition: "background 0.15s ease",
                        }}
                      >
                        <td style={{ padding: "0.8rem 1.2rem" }}>
                          <div
                            style={{
                              width: "44px",
                              height: "60px",
                              borderRadius: "4px",
                              overflow: "hidden",
                              border: "1px solid #D5CEBF",
                              background: "#181920",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              position: "relative",
                            }}
                          >
                            {coverThumb ? (
                              <img
                                src={coverThumb}
                                alt={cat.title}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <span style={{ fontSize: "1.2rem" }}>📄</span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: "0.8rem 1.2rem" }}>
                          <div style={{ fontWeight: 800, color: "#1E1E1E", fontSize: "0.92rem" }}>
                            {cat.title}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "#6A6359", marginTop: "2px" }}>
                            {cat.fileName || (cat.fileUrl ? cat.fileUrl.split("/").pop() : "PDF File")}
                          </div>
                        </td>
                        <td style={{ padding: "0.8rem 1.2rem" }}>
                          <span
                            style={{
                              padding: "4px 10px",
                              borderRadius: "6px",
                              background: "rgba(129, 102, 63, 0.12)",
                              color: "#81663F",
                              fontWeight: 800,
                              fontSize: "0.8rem",
                            }}
                          >
                            {cat.brand}
                          </span>
                        </td>
                        <td style={{ padding: "0.8rem 1.2rem", color: "#5E5852", fontWeight: 600 }}>
                          {cat.category || "General"}
                        </td>
                        <td style={{ padding: "0.8rem 1.2rem", color: "#1E1E1E", fontWeight: 700 }}>
                          {cat.downloadCount || 0} Leads
                        </td>
                        <td style={{ padding: "0.8rem 1.2rem", textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: "8px" }}>
                            <button
                              onClick={() => {
                                setPreviewPdf({
                                  url: resolved.pdfUrl || cat.fileUrl || cat.pdfUrl || "",
                                  title: `${cat.brand} - ${cat.title}`,
                                  coverImage: coverThumb,
                                });
                              }}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                padding: "6px 12px",
                                background: "#FAF8F5",
                                border: "1px solid #D5CEBF",
                                borderRadius: "6px",
                                color: "#81663F",
                                fontWeight: 700,
                                fontSize: "0.78rem",
                                cursor: "pointer",
                              }}
                            >
                              <Eye size={13} /> View Preview
                            </button>
                            <a
                              href={resolved.pdfUrl || cat.fileUrl || cat.pdfUrl || "#"}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                padding: "6px 12px",
                                background: "#1E1E1E",
                                color: "#FFFFFF",
                                borderRadius: "6px",
                                textDecoration: "none",
                                fontWeight: 700,
                                fontSize: "0.78rem",
                              }}
                            >
                              <ExternalLink size={13} /> Open PDF
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Preview Modal */}
      {previewPdf && (
        <CatalogPdfGateModal
          catalogPdfUrl={previewPdf.url}
          itemTitle={previewPdf.title}
          coverImage={previewPdf.coverImage}
          onClose={() => setPreviewPdf(null)}
        />
      )}
    </div>
  );
}
