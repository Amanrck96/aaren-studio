"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminNav from "@/components/AdminNav";
import { BrandItem, PdfCatalogItem } from "@/lib/types";
import { uploadFileWithCompression } from "@/lib/uploadHelper";
import { extractFirstPageAsImage, extractFirstPageWithDetails } from "@/utils/pdfCoverExtractor";

function parseGoogleDriveUrl(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  const match = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/file/d/${match[1]}/view`;
  }
  return trimmed;
}

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showBulkPdfModal, setShowBulkPdfModal] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [bulkPdfMap, setBulkPdfMap] = useState<Record<string, string>>({});
  const [pdfCatalogs, setPdfCatalogs] = useState<{ id: string; title: string; pdfUrl: string; coverImage?: string }[]>([]);

  const [editingBrand, setEditingBrand] = useState<Partial<BrandItem>>({
    name: "",
    logoUrl: "",
    bannerUrl: "",
    description: "",
    shortCode: "SF 01",
    sequenceNumber: 1,
    category: "Outdoor Screens",
    origin: "Australia",
    tagline: "",
    founded: "2008",
    collections: ["All"],
    accentColor: "#6b9e7a",
    catalogPdfUrl: "",
    pdfCatalogs: [],
  });

  const [showCatalogThemeModal, setShowCatalogThemeModal] = useState(false);
  const [catalogSettings, setCatalogSettings] = useState<any>({
    modalBgColor: "linear-gradient(145deg, #181920 0%, #0b0c10 100%)",
    modalTextColor: "#ffffff",
    cardBgColor: "#ffffff",
    cardTextColor: "#0f172a",
    badgeText: "OFFICIAL CATALOGUE",
    buttonText: "View Catalog ↗",
    modalTitle: "Catalogue Enquiry",
    modalSubtext: "Submit your details below to view on-screen digital access for this official specification PDF.",
  });

  const fetchCatalogSettings = () => {
    fetch("/api/catalog-settings")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) setCatalogSettings(json.data);
      })
      .catch((e) => {
        console.error("Failed to fetch catalog settings:", e);
        alert("Failed to load catalog settings: " + e.message);
      });
  };

  useEffect(() => {
    fetchBrands();
    fetchCatalogSettings();
  }, []);

  async function fetchBrands() {
    setLoading(true);
    try {
      const res = await fetch("/api/brands");
      const json = await res.json();
      if (json.success) {
        setBrands(json.data);
        const map: Record<string, string> = {};
        json.data.forEach((b: BrandItem) => {
          map[b.id] = b.catalogPdfUrl || "";
        });
        setBulkPdfMap(map);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      const formattedBrand = {
        ...editingBrand,
        catalogPdfUrl: parseGoogleDriveUrl(editingBrand.catalogPdfUrl || ""),
        pdfCatalogs: pdfCatalogs.map((c) => ({
          ...c,
          pdfUrl: parseGoogleDriveUrl(c.pdfUrl || ""),
          coverImage: c.coverImage || "",
        })),
      };
      const res = await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedBrand),
      });
      if (!res.ok) {
        alert("Save failed: HTTP " + res.status);
        return;
      }
      const json = await res.json();
      if (json.success) {
        setShowModal(false);
        fetchBrands();
      } else {
        alert("Save failed: " + (json.error || "Unknown error"));
      }
    } catch (e: any) {
      console.error(e);
      alert("Error saving brand: " + e.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to permanently delete this brand and all its linked records?")) return;
    try {
      const res = await fetch(`/api/brands?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        alert("Delete failed: HTTP " + res.status);
        return;
      }
      const json = await res.json();
      if (json.success) {
        fetchBrands();
      } else {
        alert("Delete failed: " + (json.error || "Unknown error"));
      }
    } catch (e: any) {
      console.error(e);
      alert("Error deleting brand: " + e.message);
    }
  }

  async function handleFileUpload(
    file: File,
    fieldName: "logoUrl" | "bannerUrl" | "catalogPdfUrl" | "coverImage",
    brandId?: string,
    catalogIndex?: number,
    isCover?: boolean
  ) {
    if (!file) return;
    setUploadingPdf(true);
    try {
      const folder = isCover ? "Catalog_Covers" : "Brand Assets";
      
      // If uploading a PDF catalog, concurrently start Page 1 cover extraction
      let coverExtractPromise: Promise<string> = Promise.resolve("");
      if (!isCover && (fieldName === "catalogPdfUrl" || file.name.endsWith(".pdf") || file.type === "application/pdf")) {
        coverExtractPromise = (async () => {
          try {
            console.log(`[Admin Brands List] Auto-extracting Page 1 cover for "${file.name}"...`);
            const coverFile = await extractFirstPageAsImage(file);
            if (coverFile) {
              const coverRes = await uploadFileWithCompression(coverFile, "Catalog_Covers");
              if (coverRes.success && (coverRes.url || coverRes.dataUrl)) {
                return coverRes.url || coverRes.dataUrl || "";
              }
            }
          } catch (cErr) {
            console.warn("[Admin Brands List] Auto cover extraction note:", cErr);
          }
          return "";
        })();
      }

      const result = await uploadFileWithCompression(file, folder);
      if (result.success && (result.url || result.dataUrl)) {
        const finalUrl = result.url || result.dataUrl || "";
        const autoCoverUrl = await coverExtractPromise;

        if (typeof catalogIndex === "number") {
          setPdfCatalogs((prev) => {
            const next = [...prev];
            if (next[catalogIndex]) {
              if (isCover) {
                next[catalogIndex].coverImage = finalUrl;
              } else {
                next[catalogIndex].pdfUrl = finalUrl;
                if (autoCoverUrl && !next[catalogIndex].coverImage) {
                  next[catalogIndex].coverImage = autoCoverUrl;
                }
              }
            }
            return next;
          });
        } else if (brandId) {
          setBulkPdfMap((prev) => ({ ...prev, [brandId]: finalUrl }));
        } else {
          setEditingBrand((prev) => ({ ...prev, [fieldName]: finalUrl }));
        }
      } else {
        alert("Upload note: " + (result.error || "Could not upload file to Firebase."));
      }
    } catch (err: any) {
      alert("Upload error: " + err.message);
    } finally {
      setUploadingPdf(false);
    }
  }

  async function handleAutoExtractCoverModal(cIdx: number) {
    const cat = pdfCatalogs[cIdx];
    if (!cat?.pdfUrl) {
      alert("Please provide or upload a PDF first.");
      return;
    }
    setUploadingPdf(true);
    try {
      const details = await extractFirstPageWithDetails(cat.pdfUrl, cat.title || "catalog");
      let coverFile = details.file;
      if (!coverFile) {
        const retryDetails = await extractFirstPageWithDetails(cat.pdfUrl, cat.title || "catalog");
        coverFile = retryDetails.file;
      }
      if (coverFile) {
        const uploadRes = await uploadFileWithCompression(coverFile, "Catalog_Covers");
        if (uploadRes.success && (uploadRes.url || uploadRes.dataUrl)) {
          const finalUrl = uploadRes.url || uploadRes.dataUrl || "";
          const next = [...pdfCatalogs];
          next[cIdx].coverImage = finalUrl;
          setPdfCatalogs(next);
          alert("✅ Page 1 cover thumbnail captured successfully!");
        } else {
          alert("Cover storage error: " + (uploadRes.error || "Upload failed"));
        }
      } else {
        alert(`Could not extract page 1 (${details.step}: ${details.error}). You can upload a cover image manually.`);
      }
    } catch (e: any) {
      alert("Error extracting cover: " + e.message);
    } finally {
      setUploadingPdf(false);
    }
  }

  async function handleGlobalBackfillCovers() {
    if (!confirm("This will scan all brands in the system and automatically generate/attach Page 1 cover thumbnails for any catalog that is missing one. Proceed?")) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/backfill-covers", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        alert(`✅ Success: ${json.message}`);
        fetchBrands();
      } else {
        alert("Backfill error: " + (json.error || "Unknown error"));
      }
    } catch (e: any) {
      alert("Error during backfill: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveBulkPdf() {
    setLoading(true);
    try {
      for (const brand of brands) {
        const newPdfUrl = parseGoogleDriveUrl(bulkPdfMap[brand.id] || "");
        if (newPdfUrl !== (brand.catalogPdfUrl || "")) {
          await fetch("/api/brands", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...brand, catalogPdfUrl: newPdfUrl }),
          });
        }
      }
      setShowBulkPdfModal(false);
      fetchBrands();
      alert("✅ All Brand PDF Catalogs updated live!");
    } catch (e: any) {
      alert("Error updating bulk PDFs: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ background: "#0a0a0c", color: "#f0f0f2", minHeight: "100vh" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span style={{ color: "#8b5cf6", fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>BRAND CONTROLS</span>
            <h1 style={{ fontSize: "2.2rem", fontWeight: 800, margin: "0.3rem 0" }}>Brand Section Manager</h1>
            <p style={{ color: "#aaa", fontSize: "0.95rem" }}>Add, edit, or remove partner brands, logos, short codes (SF 01), sequence, and PDF catalogs (via Google Drive links or computer upload).</p>
          </div>
          <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
            <button
              onClick={handleGlobalBackfillCovers}
              style={{ padding: "0.8rem 1.4rem", background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 800 }}
              title="Automatically extract Page 1 cover thumbnails for all catalogs missing a cover across the entire platform"
            >
              ⚡ Auto-Generate All Missing Covers
            </button>
            <button
              onClick={() => setShowCatalogThemeModal(true)}
              style={{ padding: "0.8rem 1.4rem", background: "linear-gradient(135deg, #d4af37 0%, #aa820a 100%)", color: "#000", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 800 }}
            >
              🎨 Catalog Theme & Modal Settings
            </button>
            <button
              onClick={() => setShowBulkPdfModal(true)}
              style={{ padding: "0.8rem 1.4rem", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 700 }}
            >
              📁 Bulk PDF Catalogs Manager
            </button>
            <button
              onClick={() => {
                setEditingBrand({ name: "", logoUrl: "", bannerUrl: "", description: "", shortCode: "BR 01", sequenceNumber: brands.length + 1, catalogPdfUrl: "" });
                setShowModal(true);
              }}
              style={{ padding: "0.8rem 1.4rem", background: "#8b5cf6", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 700 }}
            >
              + Add New Brand
            </button>
          </div>
        </div>

        {/* Brands Grid */}
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#888" }}>Loading partner brands...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {brands.map((b) => {
              const bannerImg = b.bannerUrl || (b as any).hero || (b as any).imageUrl || (b as any).image || (b as any).coverImage || "/brands/brand_1_1.png";
              const logoImg = b.logoUrl || (b as any).logo || (b as any).logoImage || "/brands/brand_1_2.png";
              return (
                <div key={b.id} style={{ background: "linear-gradient(145deg, #1e2235 0%, #12141f 100%)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 10px 25px rgba(0,0,0,0.4)" }}>
                  <Link href={`/admin/brands/${b.id}`} style={{ textDecoration: "none", position: "relative", width: "100%", aspectRatio: "1980 / 1020", minHeight: "150px", background: "#1a1a20", display: "block", overflow: "hidden" }}>
                    <Image
                      src={bannerImg}
                      alt={b.name}
                      fill
                      unoptimized
                      style={{ objectFit: "cover" }}
                      onError={(e: any) => {
                        e.currentTarget.src = "/brands/brand_1_1.png";
                      }}
                    />
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" }} />
                    <div style={{ position: "absolute", bottom: "10px", left: "15px", background: "rgba(255,255,255,0.92)", padding: "0.4rem 0.8rem", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", minWidth: "60px", minHeight: "26px" }}>
                      <Image
                        src={logoImg}
                        alt={b.name}
                        width={80}
                        height={28}
                        unoptimized
                        style={{ objectFit: "contain", maxHeight: "28px" }}
                        onError={(e: any) => {
                          e.currentTarget.src = "/brands/brand_1_2.png";
                        }}
                      />
                    </div>
                    <span style={{ position: "absolute", top: "10px", right: "10px", background: "linear-gradient(135deg, #d4af37 0%, #aa820a 100%)", color: "#000", padding: "0.3rem 0.7rem", borderRadius: "4px", fontSize: "0.8rem", fontWeight: 900 }}>
                      {b.shortCode || "BR"}
                    </span>
                  </Link>
                <div style={{ padding: "1.4rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                      <Link href={`/admin/brands/${b.id}`} style={{ textDecoration: "none" }}>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#ffffff", margin: 0, letterSpacing: "0.02em" }}>{b.name}</h3>
                      </Link>
                      {b.category && <span style={{ fontSize: "0.75rem", background: "rgba(255,255,255,0.1)", color: "#cbd5e1", padding: "2px 8px", borderRadius: "4px" }}>{b.category}</span>}
                    </div>
                    {b.tagline && <div style={{ fontSize: "0.82rem", fontStyle: "italic", color: "#d4af37", marginBottom: "0.5rem" }}>&ldquo;{b.tagline}&rdquo;</div>}
                    <p style={{ color: "#cbd5e1", fontSize: "0.85rem", lineHeight: 1.5, margin: "0 0 0.8rem", fontWeight: 400, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{b.description}</p>
                    <div style={{ display: "flex", gap: "10px", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "0.8rem" }}>
                      {b.origin && <span>🌍 {b.origin}</span>}
                      {b.founded && <span>📅 Est. {b.founded}</span>}
                    </div>
                    {b.catalogPdfUrl ? (
                      <div style={{ fontSize: "0.78rem", color: "#60a5fa", marginBottom: "0.8rem", wordBreak: "break-all" }}>
                        📄 <a href={b.catalogPdfUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#60a5fa", textDecoration: "underline" }}>Catalog PDF Active</a>
                      </div>
                    ) : (
                      <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginBottom: "0.8rem" }}>⚠️ No PDF catalog linked</div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", borderTop: "1px solid #222", paddingTop: "0.8rem", flexWrap: "wrap" }}>
                    <button
                      onClick={() => {
                        setEditingBrand(b);
                        setPdfCatalogs(b.pdfCatalogs || (b.catalogPdfUrl ? [{ id: "cat-1", title: `${b.name} Specification Catalog`, pdfUrl: b.catalogPdfUrl }] : []));
                        setShowModal(true);
                      }}
                      style={{ flex: 1, padding: "0.5rem", background: "#222", color: "#fff", border: "1px solid #333", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}
                    >
                      ✏️ Quick Edit
                    </button>
                    <Link
                      href={`/admin/brands/${b.id}`}
                      style={{ padding: "0.5rem 0.7rem", background: "linear-gradient(135deg, #d4af37 0%, #aa820a 100%)", color: "#000", borderRadius: "4px", textDecoration: "none", fontSize: "0.8rem", fontWeight: 800, display: "inline-flex", alignItems: "center" }}
                    >
                      ⚙️ Full Page ↗
                    </Link>
                    <Link
                      href={`/brands/${b.id}`}
                      target="_blank"
                      style={{ padding: "0.5rem 0.7rem", background: "#334155", color: "#fff", borderRadius: "4px", textDecoration: "none", fontSize: "0.8rem", fontWeight: 600, display: "inline-flex", alignItems: "center" }}
                    >
                      👁 Live ↗
                    </Link>
                    <button
                      onClick={() => handleDelete(b.id)}
                      style={{ padding: "0.5rem 0.7rem", background: "rgba(239,68,68,0.2)", color: "#f87171", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        )}

        {/* Add / Edit Brand Modal */}
        {showModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
            <div style={{ background: "#141418", border: "1px solid #333", borderRadius: "12px", width: "100%", maxWidth: "600px", padding: "2rem", maxHeight: "90vh", overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.5rem", margin: 0 }}>{editingBrand.id ? "Edit Brand" : "Add New Brand"}</h2>
                {editingBrand.id && (
                  <Link
                    href={`/admin/brands/${editingBrand.id}`}
                    style={{ fontSize: "0.8rem", color: "#d4af37", textDecoration: "underline", fontWeight: 700 }}
                  >
                    Open Master Brand Editor Page ⚙️ ↗
                  </Link>
                )}
              </div>
              <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={editingBrand.name || ""}
                    onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
                    style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Hero Tagline / Quote (e.g. &ldquo;Infinite Zipline retractable screen systems&rdquo;)</label>
                  <input
                    type="text"
                    placeholder="Infinite Zipline retractable screen systems"
                    value={editingBrand.tagline || ""}
                    onChange={(e) => setEditingBrand({ ...editingBrand, tagline: e.target.value })}
                    style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Category *</label>
                    <input
                      type="text"
                      placeholder="e.g. Outdoor Screens"
                      value={editingBrand.category || ""}
                      onChange={(e) => setEditingBrand({ ...editingBrand, category: e.target.value })}
                      style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Country of Origin *</label>
                    <input
                      type="text"
                      placeholder="e.g. Australia"
                      value={editingBrand.origin || ""}
                      onChange={(e) => setEditingBrand({ ...editingBrand, origin: e.target.value })}
                      style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Short Code *</label>
                    <input
                      type="text"
                      required
                      value={editingBrand.shortCode || ""}
                      onChange={(e) => setEditingBrand({ ...editingBrand, shortCode: e.target.value })}
                      style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Founded Year</label>
                    <input
                      type="text"
                      placeholder="2008"
                      value={editingBrand.founded || ""}
                      onChange={(e) => setEditingBrand({ ...editingBrand, founded: e.target.value })}
                      style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Sequence #</label>
                    <input
                      type="number"
                      required
                      value={editingBrand.sequenceNumber || 1}
                      onChange={(e) => setEditingBrand({ ...editingBrand, sequenceNumber: parseInt(e.target.value, 10) || 1 })}
                      style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Logo Image URL *</label>
                  <input
                    type="text"
                    required
                    value={editingBrand.logoUrl || ""}
                    onChange={(e) => setEditingBrand({ ...editingBrand, logoUrl: e.target.value })}
                    style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px", marginBottom: "0.4rem" }}
                  />
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.8rem", color: "#888" }}>OR Upload Logo from computer:</span>
                    <input
                      type="file"
                      accept="image/*"
                      id="brandLogoUpload"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) handleFileUpload(e.target.files[0], "logoUrl");
                      }}
                    />
                    <label
                      htmlFor="brandLogoUpload"
                      style={{
                        padding: "0.4rem 0.8rem",
                        background: "#2563eb",
                        color: "#fff",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      💻 Select Logo Image
                    </label>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Banner Photo URL *</label>
                  <input
                    type="text"
                    required
                    value={editingBrand.bannerUrl || ""}
                    onChange={(e) => setEditingBrand({ ...editingBrand, bannerUrl: e.target.value })}
                    style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px", marginBottom: "0.4rem" }}
                  />
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.8rem", color: "#888" }}>OR Upload Banner from computer:</span>
                    <input
                      type="file"
                      accept="image/*"
                      id="brandBannerUpload"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) handleFileUpload(e.target.files[0], "bannerUrl");
                      }}
                    />
                    <label
                      htmlFor="brandBannerUpload"
                      style={{
                        padding: "0.4rem 0.8rem",
                        background: "#2563eb",
                        color: "#fff",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      💻 Select Banner Photo
                    </label>
                  </div>
                </div>

                {/* MULTIPLE PDF CATALOGS MANAGER */}
                <div style={{ background: "#0a0a0c", padding: "1rem", borderRadius: "8px", border: "1px solid #333", marginTop: "0.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                    <div>
                      <label style={{ fontSize: "0.9rem", color: "#60a5fa", fontWeight: 800, display: "block" }}>📚 Brand PDF Catalogs (Multiple Allowed)</label>
                      <span style={{ fontSize: "0.75rem", color: "#888" }}>Attach individual collection PDFs with custom cover thumbnails</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPdfCatalogs([...pdfCatalogs, { id: `cat-${Date.now()}`, title: `Catalog ${pdfCatalogs.length + 1}`, pdfUrl: "", coverImage: "" }])}
                      style={{ padding: "0.3rem 0.7rem", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "4px", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}
                    >
                      + Add Another PDF Catalog
                    </button>
                  </div>

                  {pdfCatalogs.length === 0 ? (
                    <div style={{ fontSize: "0.8rem", color: "#888", fontStyle: "italic", marginBottom: "0.5rem" }}>No PDF catalogs added yet. Click above to add multiple PDF catalogs!</div>
                  ) : (
                    pdfCatalogs.map((cat, cIdx) => (
                      <div key={cat.id || cIdx} style={{ background: "#141418", border: "1px solid #222", padding: "0.8rem", borderRadius: "6px", marginBottom: "0.6rem" }}>
                        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.4rem" }}>
                          <input
                            type="text"
                            placeholder="Catalog Title (e.g. Slide NXT Specification PDF)"
                            value={cat.title}
                            onChange={(e) => {
                              const next = [...pdfCatalogs];
                              next[cIdx].title = e.target.value;
                              setPdfCatalogs(next);
                            }}
                            style={{ flex: 1, padding: "0.5rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "4px", fontSize: "0.85rem" }}
                          />
                          <button
                            type="button"
                            onClick={() => setPdfCatalogs(pdfCatalogs.filter((_, i) => i !== cIdx))}
                            style={{ padding: "0.5rem", background: "rgba(239, 68, 68, 0.2)", color: "#f87171", border: "none", borderRadius: "4px", cursor: "pointer" }}
                          >
                            🗑️
                          </button>
                        </div>

                        {/* PDF Link / Upload */}
                        <div style={{ marginBottom: "0.4rem" }}>
                          <input
                            type="text"
                            placeholder="PDF Link (Google Drive / Direct URL)"
                            value={cat.pdfUrl}
                            onChange={(e) => {
                              const next = [...pdfCatalogs];
                              next[cIdx].pdfUrl = e.target.value;
                              setPdfCatalogs(next);
                            }}
                            style={{ width: "100%", padding: "0.5rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "4px", fontSize: "0.85rem", marginBottom: "0.3rem" }}
                          />
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span style={{ fontSize: "0.75rem", color: "#888" }}>OR Upload PDF:</span>
                            <input
                              type="file"
                              accept=".pdf"
                              id={`catUpload_${cIdx}`}
                              style={{ display: "none" }}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) handleFileUpload(e.target.files[0], "catalogPdfUrl", undefined, cIdx, false);
                              }}
                            />
                            <label
                              htmlFor={`catUpload_${cIdx}`}
                              style={{ padding: "0.2rem 0.6rem", background: "#2563eb", color: "#fff", borderRadius: "4px", fontSize: "0.75rem", cursor: "pointer" }}
                            >
                              💻 Upload PDF File
                            </label>
                          </div>
                        </div>

                        {/* Cover Image Thumbnail / Upload */}
                        <div>
                          <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap" }}>
                            <input
                              type="text"
                              placeholder="Cover Thumbnail Image URL (Optional)"
                              value={cat.coverImage || ""}
                              onChange={(e) => {
                                const next = [...pdfCatalogs];
                                next[cIdx].coverImage = e.target.value;
                                setPdfCatalogs(next);
                              }}
                              style={{ flex: 1, minWidth: "160px", padding: "0.5rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "4px", fontSize: "0.85rem" }}
                            />
                            <input
                              type="file"
                              accept="image/*"
                              id={`catCoverUpload_${cIdx}`}
                              style={{ display: "none" }}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) handleFileUpload(e.target.files[0], "coverImage", undefined, cIdx, true);
                              }}
                            />
                            <label
                              htmlFor={`catCoverUpload_${cIdx}`}
                              style={{ padding: "0.5rem 0.7rem", background: "#475569", color: "#fff", borderRadius: "4px", fontSize: "0.75rem", cursor: "pointer", whiteSpace: "nowrap" }}
                            >
                              🖼️ Cover
                            </label>

                            <button
                              type="button"
                              onClick={() => handleAutoExtractCoverModal(cIdx)}
                              disabled={!cat.pdfUrl}
                              style={{ padding: "0.5rem 0.7rem", background: "#8c764b", color: "#fff", border: "none", borderRadius: "4px", fontSize: "0.75rem", cursor: "pointer", whiteSpace: "nowrap", fontWeight: 700 }}
                              title="Automatically capture Page 1 from PDF"
                            >
                              ⚡ Auto Page 1
                            </button>

                            {cat.coverImage && (
                              <div style={{ width: "32px", height: "42px", borderRadius: "4px", overflow: "hidden", border: "1px solid #444", flexShrink: 0, background: "#1a1a20" }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={cat.coverImage} alt="Cover Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>About the Brand (Story Description) *</label>
                  <textarea
                    rows={4}
                    value={editingBrand.description || ""}
                    onChange={(e) => setEditingBrand({ ...editingBrand, description: e.target.value })}
                    style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                  <button type="button" onClick={() => setShowModal(false)} style={{ padding: "0.7rem 1.2rem", background: "#222", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                    Cancel
                  </button>
                  <button type="submit" style={{ padding: "0.7rem 1.4rem", background: "#8b5cf6", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 700 }}>
                    Save Brand
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Bulk PDF Catalogs Manager Modal */}
        {showBulkPdfModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
            <div style={{ background: "#141418", border: "1px solid #333", borderRadius: "12px", width: "100%", maxWidth: "750px", padding: "2rem", maxHeight: "90vh", overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0, color: "#3b82f6" }}>📁 Bulk PDF Catalog Manager</h2>
                  <p style={{ color: "#aaa", fontSize: "0.85rem", margin: "0.3rem 0 0" }}>Update PDF Catalog links for all partner brands using Google Drive links or computer uploads.</p>
                </div>
                <button onClick={() => setShowBulkPdfModal(false)} style={{ background: "none", border: "none", color: "#aaa", fontSize: "1.5rem", cursor: "pointer" }}>✕</button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", marginBottom: "1.5rem" }}>
                {brands.map((b) => (
                  <div key={b.id} style={{ background: "#0a0a0c", border: "1px solid #222", padding: "1rem", borderRadius: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <span style={{ fontWeight: 700, color: "#fff" }}>{b.name} ({b.shortCode})</span>
                      <span style={{ fontSize: "0.75rem", color: bulkPdfMap[b.id] ? "#60a5fa" : "#f59e0b" }}>
                        {bulkPdfMap[b.id] ? "📄 Catalog Linked" : "⚠️ No PDF"}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "0.6rem" }}>
                      <input
                        type="text"
                        placeholder="Paste Google Drive Link or PDF URL..."
                        value={bulkPdfMap[b.id] || ""}
                        onChange={(e) => setBulkPdfMap({ ...bulkPdfMap, [b.id]: e.target.value })}
                        style={{ flex: 1, padding: "0.6rem 0.8rem", background: "#141418", border: "1px solid #333", color: "#fff", borderRadius: "6px", fontSize: "0.85rem" }}
                      />
                      <input
                        type="file"
                        accept=".pdf"
                        id={`bulkPdf_${b.id}`}
                        style={{ display: "none" }}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) handleFileUpload(e.target.files[0], "catalogPdfUrl", b.id);
                        }}
                      />
                      <label
                        htmlFor={`bulkPdf_${b.id}`}
                        style={{
                          padding: "0.6rem 1rem",
                          background: "#2563eb",
                          color: "#fff",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}
                      >
                        💻 Computer File
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                <button type="button" onClick={() => setShowBulkPdfModal(false)} style={{ padding: "0.7rem 1.2rem", background: "#222", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                  Cancel
                </button>
                <button onClick={handleSaveBulkPdf} style={{ padding: "0.75rem 1.5rem", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 700 }}>
                  💾 Save All PDF Catalogs Live
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CATALOG THEME & MODAL SETTINGS MODAL */}
        {showCatalogThemeModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: "2rem" }}>
            <div style={{ background: "#181920", border: "1px solid rgba(212,175,55,0.4)", borderRadius: "12px", width: "100%", maxWidth: "650px", maxHeight: "90vh", overflowY: "auto", padding: "2rem", color: "#fff", boxShadow: "0 20px 50px rgba(0,0,0,0.8)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "1rem" }}>
                <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800, color: "#d4af37" }}>🎨 Catalog Theme & Modal Settings</h2>
                <button onClick={() => setShowCatalogThemeModal(false)} style={{ background: "none", border: "none", color: "#aaa", fontSize: "1.4rem", cursor: "pointer" }}>✕</button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", marginBottom: "2rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", fontWeight: 600, marginBottom: "0.4rem" }}>
                    Badge Text (e.g. OFFICIAL CATALOGUE, SPECIFICATION PDF)
                  </label>
                  <input
                    type="text"
                    value={catalogSettings.badgeText}
                    onChange={(e) => setCatalogSettings({ ...catalogSettings, badgeText: e.target.value })}
                    style={{ width: "100%", padding: "0.75rem", background: "#0b0c10", border: "1px solid #333", color: "#fff", borderRadius: "6px", fontSize: "0.95rem" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", fontWeight: 600, marginBottom: "0.4rem" }}>
                    Button Text (e.g. View Catalog ↗, Open Specification)
                  </label>
                  <input
                    type="text"
                    value={catalogSettings.buttonText}
                    onChange={(e) => setCatalogSettings({ ...catalogSettings, buttonText: e.target.value })}
                    style={{ width: "100%", padding: "0.75rem", background: "#0b0c10", border: "1px solid #333", color: "#fff", borderRadius: "6px", fontSize: "0.95rem" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", fontWeight: 600, marginBottom: "0.4rem" }}>
                    Modal Popup Header Title
                  </label>
                  <input
                    type="text"
                    value={catalogSettings.modalTitle}
                    onChange={(e) => setCatalogSettings({ ...catalogSettings, modalTitle: e.target.value })}
                    style={{ width: "100%", padding: "0.75rem", background: "#0b0c10", border: "1px solid #333", color: "#fff", borderRadius: "6px", fontSize: "0.95rem" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", fontWeight: 600, marginBottom: "0.4rem" }}>
                    Modal Subtitle Description
                  </label>
                  <textarea
                    rows={2}
                    value={catalogSettings.modalSubtext}
                    onChange={(e) => setCatalogSettings({ ...catalogSettings, modalSubtext: e.target.value })}
                    style={{ width: "100%", padding: "0.75rem", background: "#0b0c10", border: "1px solid #333", color: "#fff", borderRadius: "6px", fontSize: "0.9rem", resize: "vertical" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", fontWeight: 600, marginBottom: "0.4rem" }}>
                      Modal Background Color / Gradient
                    </label>
                    <input
                      type="text"
                      value={catalogSettings.modalBgColor}
                      onChange={(e) => setCatalogSettings({ ...catalogSettings, modalBgColor: e.target.value })}
                      placeholder="#181920 or linear-gradient(...)"
                      style={{ width: "100%", padding: "0.75rem", background: "#0b0c10", border: "1px solid #333", color: "#fff", borderRadius: "6px", fontSize: "0.9rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", fontWeight: 600, marginBottom: "0.4rem" }}>
                      Modal Text Color
                    </label>
                    <input
                      type="text"
                      value={catalogSettings.modalTextColor}
                      onChange={(e) => setCatalogSettings({ ...catalogSettings, modalTextColor: e.target.value })}
                      placeholder="#ffffff or #0f172a"
                      style={{ width: "100%", padding: "0.75rem", background: "#0b0c10", border: "1px solid #333", color: "#fff", borderRadius: "6px", fontSize: "0.9rem" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", fontWeight: 600, marginBottom: "0.4rem" }}>
                      Card Background Color
                    </label>
                    <input
                      type="text"
                      value={catalogSettings.cardBgColor}
                      onChange={(e) => setCatalogSettings({ ...catalogSettings, cardBgColor: e.target.value })}
                      placeholder="#ffffff or #12141f"
                      style={{ width: "100%", padding: "0.75rem", background: "#0b0c10", border: "1px solid #333", color: "#fff", borderRadius: "6px", fontSize: "0.9rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", fontWeight: 600, marginBottom: "0.4rem" }}>
                      Card Text Color
                    </label>
                    <input
                      type="text"
                      value={catalogSettings.cardTextColor}
                      onChange={(e) => setCatalogSettings({ ...catalogSettings, cardTextColor: e.target.value })}
                      placeholder="#0f172a or #ffffff"
                      style={{ width: "100%", padding: "0.75rem", background: "#0b0c10", border: "1px solid #333", color: "#fff", borderRadius: "6px", fontSize: "0.9rem" }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1rem" }}>
                <button type="button" onClick={() => setShowCatalogThemeModal(false)} style={{ padding: "0.7rem 1.2rem", background: "#222", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch("/api/catalog-settings", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(catalogSettings),
                      });
                      const json = await res.json();
                      if (json.success) {
                        alert("Catalog Theme & Modal Settings saved successfully!");
                        setShowCatalogThemeModal(false);
                      } else alert("Error: " + json.error);
                    } catch (e: any) {
                      alert("Error saving: " + e.message);
                    }
                  }}
                  style={{ padding: "0.75rem 1.5rem", background: "linear-gradient(135deg, #d4af37 0%, #aa820a 100%)", color: "#000", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 800 }}
                >
                  💾 Save Settings Live
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
