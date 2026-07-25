"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AdminNav from "@/components/AdminNav";
import { BrandItem } from "@/lib/types";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
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
      const res = await fetch("/api/brands");
      const json = await res.json();
      if (json.success) setBrands(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingBrand),
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

  return (
    <div style={{ background: "#0a0a0c", color: "#f0f0f2", minHeight: "100vh" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <span style={{ color: "#8b5cf6", fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>BRAND CONTROLS</span>
            <h1 style={{ fontSize: "2.2rem", fontWeight: 800, margin: "0.3rem 0" }}>Brand Section Manager</h1>
            <p style={{ color: "#aaa", fontSize: "0.95rem" }}>Add, edit, or remove partner brands, logos, short codes (SF 01), sequence, and PDF catalogs.</p>
          </div>
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
                    {b.catalogPdfUrl && (
                      <div style={{ fontSize: "0.78rem", color: "#60a5fa", marginBottom: "0.8rem" }}>📄 Catalog PDF attached</div>
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
      </div>

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
                  style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Banner Photo URL *</label>
                <input
                  type="text"
                  required
                  value={editingBrand.bannerUrl || ""}
                  onChange={(e) => setEditingBrand({ ...editingBrand, bannerUrl: e.target.value })}
                  style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Catalog PDF Link / URL</label>
                <input
                  type="text"
                  placeholder="/catalogues/Formica/2024-FENIX-brochure-digital.pdf"
                  value={editingBrand.catalogPdfUrl || ""}
                  onChange={(e) => setEditingBrand({ ...editingBrand, catalogPdfUrl: e.target.value })}
                  style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
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
    </div>
  );
}
