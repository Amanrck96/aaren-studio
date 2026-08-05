"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AdminNav from "@/components/AdminNav";
import { BrandItem } from "@/lib/types";
import { uploadFileToFirebase } from "@/lib/firebaseStorage";

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

  const [editingBrand, setEditingBrand] = useState<Partial<BrandItem>>({
    name: "",
    logoUrl: "/brands/brand_1_2.png",
    bannerUrl: "/brands/brand_1_1.png",
    description: "",
    shortCode: "SF 01",
    sequenceNumber: 1,
    catalogPdfUrl: "",
  });

  useEffect(() => {
    fetchBrands();
  }, []);

  async function fetchBrands() {
    setLoading(true);
    try {
      const res = await fetch("/api/brands?t=" + Date.now());
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
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
      };
      const res = await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedBrand),
      });
      const json = await res.json();
      if (json.success) {
        setShowModal(false);
        fetchBrands();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this brand?")) return;
    try {
      await fetch(`/api/brands?id=${id}`, { method: "DELETE" });
      fetchBrands();
    } catch (e) {
      console.error(e);
    }
  }

  async function handleFileUpload(file: File, fieldName: "logoUrl" | "bannerUrl" | "catalogPdfUrl", brandId?: string) {
    if (!file) return;
    setUploadingPdf(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "Brand Assets");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (json.success && json.url) {
        if (brandId) {
          setBulkPdfMap((prev) => ({ ...prev, [brandId]: json.url }));
        } else {
          setEditingBrand((prev) => ({ ...prev, [fieldName]: json.url }));
        }
        alert("✅ File uploaded successfully from computer to storage: " + json.url);
      } else {
        alert("❌ Upload failed: " + (json.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("❌ Upload error: " + err.message);
    } finally {
      setUploadingPdf(false);
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
          <div style={{ display: "flex", gap: "0.8rem" }}>
            <button
              onClick={() => setShowBulkPdfModal(true)}
              style={{ padding: "0.8rem 1.4rem", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 700 }}
            >
              📁 Bulk PDF Catalogs Manager
            </button>
            <button
              onClick={() => {
                setEditingBrand({ name: "", logoUrl: "/brands/brand_1_2.png", bannerUrl: "/brands/brand_1_1.png", description: "", shortCode: "SF 01", sequenceNumber: brands.length + 1, catalogPdfUrl: "" });
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
            {brands.map((b) => (
              <div key={b.id} style={{ background: "#141418", border: "1px solid #222", borderRadius: "10px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ position: "relative", height: "140px", background: "#1a1a20" }}>
                  <Image src={b.bannerUrl || "/brands/brand_1_1.png"} alt={b.name} fill style={{ objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
                  <div style={{ position: "absolute", bottom: "10px", left: "15px", background: "rgba(255,255,255,0.9)", padding: "0.4rem 0.8rem", borderRadius: "4px" }}>
                    <Image src={b.logoUrl} alt={b.name} width={80} height={28} style={{ objectFit: "contain" }} />
                  </div>
                  <span style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(0,0,0,0.8)", color: "#8b5cf6", padding: "0.3rem 0.6rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700 }}>
                    {b.shortCode}
                  </span>
                </div>
                <div style={{ padding: "1.2rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 0.4rem" }}>{b.name}</h3>
                    <p style={{ color: "#888", fontSize: "0.85rem", lineHeight: 1.4, margin: "0 0 0.8rem" }}>{b.description}</p>
                    {b.catalogPdfUrl ? (
                      <div style={{ fontSize: "0.78rem", color: "#60a5fa", marginBottom: "0.8rem", wordBreak: "break-all" }}>
                        📄 <a href={b.catalogPdfUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#60a5fa", textDecoration: "underline" }}>Catalog PDF Active</a>
                      </div>
                    ) : (
                      <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginBottom: "0.8rem" }}>⚠️ No PDF catalog linked</div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "0.8rem", borderTop: "1px solid #222", paddingTop: "0.8rem" }}>
                    <button
                      onClick={() => {
                        setEditingBrand(b);
                        setShowModal(true);
                      }}
                      style={{ flex: 1, padding: "0.5rem", background: "#222", color: "#fff", border: "1px solid #333", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      style={{ padding: "0.5rem 0.8rem", background: "rgba(239,68,68,0.2)", color: "#f87171", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add / Edit Brand Modal */}
        {showModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
            <div style={{ background: "#141418", border: "1px solid #333", borderRadius: "12px", width: "100%", maxWidth: "550px", padding: "2rem", maxHeight: "90vh", overflowY: "auto" }}>
              <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>{editingBrand.id ? "Edit Brand" : "Add New Brand"}</h2>
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

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Short Code (e.g. SF 01) *</label>
                    <input
                      type="text"
                      required
                      value={editingBrand.shortCode || ""}
                      onChange={(e) => setEditingBrand({ ...editingBrand, shortCode: e.target.value })}
                      style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Sequence Number *</label>
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

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>
                    Catalog PDF (Google Drive Link or Direct URL)
                  </label>
                  <input
                    type="text"
                    placeholder="https://drive.google.com/file/d/.../view or /uploads/pdf"
                    value={editingBrand.catalogPdfUrl || ""}
                    onChange={(e) => setEditingBrand({ ...editingBrand, catalogPdfUrl: parseGoogleDriveUrl(e.target.value) })}
                    style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px", marginBottom: "0.4rem" }}
                  />
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.8rem", color: "#888" }}>OR Upload PDF from computer:</span>
                    <input
                      type="file"
                      accept=".pdf"
                      id="brandPdfUpload"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) handleFileUpload(e.target.files[0], "catalogPdfUrl");
                      }}
                    />
                    <label
                      htmlFor="brandPdfUpload"
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
                      💻 Select PDF File
                    </label>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Description</label>
                  <textarea
                    rows={3}
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
      </main>
    </div>
  );
}
