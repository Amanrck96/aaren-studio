"use client";

import { useState, useEffect, useMemo } from "react";
import AdminNav from "@/components/AdminNav";
import { CollectionItem, BrandItem, ProductItem } from "@/lib/types";
import { Plus, Trash2, Edit2, Image as ImageIcon, CheckCircle, RefreshCw, Eye, Sparkles, Filter } from "lucide-react";

export default function CollectionsAdminPage() {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("slashform");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [formBrandId, setFormBrandId] = useState("slashform");
  const [description, setDescription] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [iconPreview, setIconPreview] = useState("");

  // Storefront preview active filter
  const [previewFilter, setPreviewFilter] = useState("all");

  // Quick add product state
  const [quickProdName, setQuickProdName] = useState("");
  const [quickProdCollection, setQuickProdCollection] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [colRes, brRes, prRes] = await Promise.all([
        fetch("/api/collections?includeCounts=true&t=" + Date.now(), { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/brands?t=" + Date.now(), { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/products?t=" + Date.now(), { cache: "no-store" }).then((r) => r.json()),
      ]);

      if (colRes.success && Array.isArray(colRes.data)) {
        setCollections(colRes.data);
      }
      if (brRes.success && Array.isArray(brRes.data)) {
        setBrands(brRes.data);
        if (brRes.data.length > 0 && !selectedBrand) {
          setSelectedBrand(brRes.data[0].id);
          setFormBrandId(brRes.data[0].id);
        }
      }
      if (prRes.success && Array.isArray(prRes.data)) {
        setProducts(prRes.data);
      }
    } catch (e) {
      console.error("Failed to load collections data:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleBrandChange = (brandId: string) => {
    setSelectedBrand(brandId);
    setFormBrandId(brandId);
    setPreviewFilter("all");
  };

  // Filter collections for selected brand
  const filteredCollections = useMemo(() => {
    if (selectedBrand === "all") return collections;
    const norm = (s: string) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const target = norm(selectedBrand);
    return collections.filter((c) => norm(c.brandId) === target || norm(c.brandName || "") === target);
  }, [collections, selectedBrand]);

  // Filter products for preview
  const brandProducts = useMemo(() => {
    if (selectedBrand === "all") return products;
    const norm = (s: string) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const target = norm(selectedBrand);
    return products.filter((p) => norm(p.brand || "") === target || norm(p.brand || "").includes(target));
  }, [products, selectedBrand]);

  const countFor = (colId: string) => {
    const norm = (s: string) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    if (colId === "all") return brandProducts.length;
    const col = collections.find((c) => c.id === colId);
    const targetId = norm(colId);
    const targetName = norm(col?.name || "");
    return brandProducts.filter((p) => {
      const pCol = norm(p.subcategory || p.category || "");
      return pCol === targetId || pCol === targetName;
    }).length;
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setIconPreview(result);
      setIconUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setMessage(null);

    const slug = editingId || name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const currentBrand = brands.find((b) => b.id === formBrandId);

    const payload: Partial<CollectionItem> = {
      id: slug,
      name: name.trim(),
      brandId: formBrandId,
      brandName: currentBrand?.name || formBrandId,
      description: description.trim(),
      iconUrl: iconUrl.trim(),
    };

    try {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: `Collection "${payload.name}" saved successfully!`, type: "success" });
        // Reset form
        setName("");
        setDescription("");
        setIconUrl("");
        setIconPreview("");
        setEditingId(null);
        await loadData();
      } else {
        setMessage({ text: data.error || "Failed to save collection", type: "error" });
      }
    } catch (e: any) {
      setMessage({ text: e.message || "Network error", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (col: CollectionItem) => {
    setEditingId(col.id);
    setName(col.name);
    setFormBrandId(col.brandId);
    setDescription(col.description || "");
    setIconUrl(col.iconUrl || "");
    setIconPreview(col.iconUrl || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string, colName: string) => {
    if (!confirm(`Are you sure you want to delete collection "${colName}"?`)) return;

    try {
      const res = await fetch(`/api/collections?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: `Collection "${colName}" removed.`, type: "success" });
        if (editingId === id) {
          setEditingId(null);
          setName("");
        }
        await loadData();
      }
    } catch (e) {
      console.error("Delete error:", e);
    }
  };

  const handleQuickAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickProdName.trim() || !quickProdCollection) return;

    const brandObj = brands.find((b) => b.id === selectedBrand);
    const colObj = collections.find((c) => c.id === quickProdCollection);

    const newProd = {
      id: `prod-${Date.now()}`,
      name: quickProdName.trim(),
      brand: brandObj?.name || selectedBrand,
      category: "Architectural Products",
      subcategory: colObj?.name || quickProdCollection,
      description: `Product in ${colObj?.name || quickProdCollection} collection`,
      imageUrl: "/brands/brand_1_1.png",
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProd),
      });
      if (res.ok) {
        setQuickProdName("");
        setMessage({ text: `Product "${newProd.name}" added to ${colObj?.name}!`, type: "success" });
        await loadData();
      }
    } catch (e) {}
  };

  const activeBrandName = brands.find((b) => b.id === selectedBrand)?.name || selectedBrand;

  const previewVisibleProducts = useMemo(() => {
    if (previewFilter === "all") return brandProducts;
    const norm = (s: string) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const col = collections.find((c) => c.id === previewFilter);
    const targetId = norm(previewFilter);
    const targetName = norm(col?.name || "");
    return brandProducts.filter((p) => {
      const pCol = norm(p.subcategory || p.category || "");
      return pCol === targetId || pCol === targetName;
    });
  }, [brandProducts, previewFilter, collections]);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0b0c10", color: "#e2e8f0" }}>
      <AdminNav />

      <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        {/* Top Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <span style={{ fontSize: "1.8rem" }}>🗃️</span>
              <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff", margin: 0 }}>
                Brand-Scoped Collection Management
              </h1>
            </div>
            <p style={{ color: "#94a3b8", fontSize: "0.95rem", margin: "0.4rem 0 0" }}>
              Manage brand-specific collections (categories) with circular icons, automatic storefront filter bar sync, and live product counts.
            </p>
          </div>

          <button
            onClick={loadData}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "#1e293b",
              color: "#cbd5e1",
              border: "1px solid #334155",
              padding: "0.6rem 1.2rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            <RefreshCw size={14} /> Refresh Data
          </button>
        </div>

        {/* Feedback Alert */}
        {message && (
          <div
            style={{
              padding: "0.9rem 1.2rem",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              fontSize: "0.95rem",
              fontWeight: 600,
              background: message.type === "success" ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
              border: `1px solid ${message.type === "success" ? "#22c55e" : "#ef4444"}`,
              color: message.type === "success" ? "#4ade80" : "#f87171",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
            }}
          >
            <CheckCircle size={16} /> {message.text}
          </div>
        )}

        {/* Brand Selector Filter Bar */}
        <div
          style={{
            background: "#161b26",
            border: "1px solid #232d3f",
            borderRadius: "12px",
            padding: "1.2rem 1.5rem",
            marginBottom: "2rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "1.2rem",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#81663F", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Active Brand:
            </span>
            <select
              value={selectedBrand}
              onChange={(e) => handleBrandChange(e.target.value)}
              style={{
                background: "#0d1117",
                border: "1px solid #3b82f6",
                color: "#ffffff",
                padding: "0.6rem 1.2rem",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: 700,
                cursor: "pointer",
                minWidth: "220px",
              }}
            >
              <option value="all">🌐 All Brands (Global Overview)</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  🏢 {b.name} ({b.id})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.85rem", color: "#94a3b8" }}>
            <span>
              Collections for <strong>{activeBrandName}</strong>: <strong style={{ color: "#38bdf8" }}>{filteredCollections.length}</strong>
            </span>
            <span>•</span>
            <span>
              Total Products: <strong style={{ color: "#38bdf8" }}>{brandProducts.length}</strong>
            </span>
          </div>
        </div>

        {/* Main 2-Column Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "2rem", alignItems: "start" }}>
          
          {/* LEFT PANEL: ADMIN CRUD */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Add / Edit Form Card */}
            <div style={{ background: "#161b26", border: "1px solid #232d3f", borderRadius: "14px", padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {editingId ? "✏️ Edit Collection" : "➕ Add New Collection"}
                </h2>
                {editingId && (
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setName("");
                      setDescription("");
                      setIconUrl("");
                      setIconPreview("");
                    }}
                    style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "0.8rem", cursor: "pointer", textDecoration: "underline" }}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveCollection} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#94a3b8", marginBottom: "0.4rem" }}>
                    Collection Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kitchen, Wardrobe, Door Systems"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      background: "#0d1117",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "0.95rem",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#94a3b8", marginBottom: "0.4rem" }}>
                    Target Brand *
                  </label>
                  <select
                    value={formBrandId}
                    onChange={(e) => setFormBrandId(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      background: "#0d1117",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "0.95rem",
                      boxSizing: "border-box",
                    }}
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#94a3b8", marginBottom: "0.4rem" }}>
                    Description / Subtitle (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Modular systems & pantries"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      background: "#0d1117",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "0.95rem",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                {/* Circular Icon Image Upload */}
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#94a3b8", marginBottom: "0.4rem" }}>
                    Circular Icon Image
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        background: "#1e293b",
                        border: "2px solid #81663F",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      {iconPreview ? (
                        <img src={iconPreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#81663F" }}>
                          {name ? name.slice(0, 1).toUpperCase() : "C"}
                        </span>
                      )}
                    </div>

                    <div style={{ flex: 1 }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        style={{
                          fontSize: "0.8rem",
                          color: "#94a3b8",
                          width: "100%",
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Or paste Image URL..."
                        value={iconUrl}
                        onChange={(e) => {
                          setIconUrl(e.target.value);
                          setIconPreview(e.target.value);
                        }}
                        style={{
                          marginTop: "0.4rem",
                          width: "100%",
                          padding: "0.4rem 0.6rem",
                          background: "#0d1117",
                          border: "1px solid #334155",
                          borderRadius: "6px",
                          color: "#fff",
                          fontSize: "0.8rem",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    marginTop: "0.5rem",
                    padding: "0.85rem",
                    background: "#81663F",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    cursor: saving ? "not-allowed" : "pointer",
                    transition: "background 0.2s",
                  }}
                >
                  {saving ? "Saving to Cloud..." : editingId ? "Update Collection ✓" : "Add Collection +"}
                </button>
              </form>
            </div>

            {/* Collection List for Brand */}
            <div style={{ background: "#161b26", border: "1px solid #232d3f", borderRadius: "14px", padding: "1.5rem" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 1rem" }}>
                {activeBrandName} Collections ({filteredCollections.length})
              </h2>

              {filteredCollections.length === 0 ? (
                <p style={{ color: "#64748b", fontSize: "0.85rem", textAlign: "center", padding: "1.5rem 0" }}>
                  No collections defined yet for this brand. Create one above!
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  {filteredCollections.map((col) => {
                    const count = countFor(col.id);
                    return (
                      <div
                        key={col.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "0.8rem 1rem",
                          background: "#0d1117",
                          border: "1px solid #232d3f",
                          borderRadius: "10px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              background: "#1e293b",
                              border: "1px solid #81663F",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "hidden",
                              fontSize: "0.85rem",
                              fontWeight: 700,
                              color: "#81663F",
                            }}
                          >
                            {col.iconUrl ? (
                              <img src={col.iconUrl} alt={col.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                              col.name.slice(0, 1)
                            )}
                          </div>
                          <div>
                            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff" }}>{col.name}</div>
                            <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                              {count} {count === 1 ? "product" : "products"} • <span style={{ color: "#81663F" }}>{col.brandName || col.brandId}</span>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <button
                            onClick={() => handleEdit(col)}
                            title="Edit Collection"
                            style={{ background: "#1e293b", color: "#38bdf8", border: "none", padding: "0.4rem 0.6rem", borderRadius: "6px", cursor: "pointer" }}
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(col.id, col.name)}
                            title="Delete Collection"
                            style={{ background: "#1e293b", color: "#f87171", border: "none", padding: "0.4rem 0.6rem", borderRadius: "6px", cursor: "pointer" }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Product-to-Collection Assignment (Demo Counts) */}
            <div style={{ background: "#161b26", border: "1px dashed #334155", borderRadius: "14px", padding: "1.5rem" }}>
              <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#cbd5e1", margin: "0 0 0.8rem" }}>
                ⚡ Quick Product Assignment
              </h2>
              <form onSubmit={handleQuickAddProduct} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                <input
                  type="text"
                  required
                  placeholder="Product name (e.g. Slashform K+W Modular)"
                  value={quickProdName}
                  onChange={(e) => setQuickProdName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.8rem",
                    background: "#0d1117",
                    border: "1px solid #334155",
                    borderRadius: "6px",
                    color: "#fff",
                    fontSize: "0.85rem",
                    boxSizing: "border-box",
                  }}
                />
                <select
                  required
                  value={quickProdCollection}
                  onChange={(e) => setQuickProdCollection(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.8rem",
                    background: "#0d1117",
                    border: "1px solid #334155",
                    borderRadius: "6px",
                    color: "#fff",
                    fontSize: "0.85rem",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="">Select Collection</option>
                  {filteredCollections.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={filteredCollections.length === 0}
                  style={{
                    padding: "0.6rem",
                    background: "#334155",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    cursor: filteredCollections.length === 0 ? "not-allowed" : "pointer",
                  }}
                >
                  Link & Add Product
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT PANEL: STOREFRONT LIVE PREVIEW */}
          <div style={{ background: "#ffffff", color: "#1b2036", borderRadius: "16px", padding: "2rem", border: "1px solid #e2e8f0", boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "1rem" }}>
              <div>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#81663F", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Live Storefront Preview
                </span>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", margin: "0.2rem 0 0" }}>
                  {activeBrandName} — Brand Storefront
                </h2>
              </div>
              <span style={{ fontSize: "0.8rem", background: "#f1f5f9", color: "#475569", padding: "0.3rem 0.8rem", borderRadius: "999px", fontWeight: 600 }}>
                Dynamic Filter Bar Active
              </span>
            </div>

            {/* Banner */}
            <div
              style={{
                background: "linear-gradient(135deg, #81663F 0%, #574427 100%)",
                borderRadius: "12px",
                padding: "2.5rem 2rem",
                color: "#ffffff",
                marginBottom: "2rem",
              }}
            >
              <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.85, fontWeight: 700 }}>
                {activeBrandName} ARCHITECTURAL SOLUTIONS
              </span>
              <h1 style={{ fontSize: "2.4rem", fontWeight: 900, textTransform: "uppercase", margin: "0.4rem 0 0", letterSpacing: "-0.02em" }}>
                Collection
              </h1>
            </div>

            {/* Circular Filter Row (Exactly as in user demo) */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.8rem", marginBottom: "2.5rem" }}>
              {/* "All" Option */}
              <button
                type="button"
                onClick={() => setPreviewFilter("all")}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <div
                  style={{
                    width: "74px",
                    height: "74px",
                    borderRadius: "50%",
                    background: previewFilter === "all" ? "#81663F" : "#f1f5f9",
                    border: previewFilter === "all" ? "3px solid #81663F" : "3px solid #e2e8f0",
                    boxShadow: previewFilter === "all" ? "0 0 0 4px rgba(129, 102, 63, 0.25)" : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: previewFilter === "all" ? "#ffffff" : "#64748b",
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    transition: "all 0.2s ease",
                  }}
                >
                  ALL
                </div>
                <span
                  style={{
                    background: previewFilter === "all" ? "#81663F" : "#e2e8f0",
                    color: previewFilter === "all" ? "#ffffff" : "#475569",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "6px",
                  }}
                >
                  All
                </span>
                <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700 }}>
                  {countFor("all")}
                </span>
              </button>

              {/* Dynamic Brand Collections */}
              {filteredCollections.map((col) => {
                const isActive = previewFilter === col.id;
                const count = countFor(col.id);

                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setPreviewFilter(col.id)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.5rem",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    <div
                      style={{
                        width: "74px",
                        height: "74px",
                        borderRadius: "50%",
                        background: "linear-gradient(145deg, #81663F, #574427)",
                        border: isActive ? "3px solid #81663F" : "3px solid #e2e8f0",
                        boxShadow: isActive ? "0 0 0 4px rgba(129, 102, 63, 0.3)" : "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {col.iconUrl ? (
                        <img src={col.iconUrl} alt={col.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <span style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 800 }}>
                          {col.name.slice(0, 1).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span
                      style={{
                        background: isActive ? "#81663F" : "#f1f5f9",
                        color: isActive ? "#ffffff" : "#475569",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        padding: "3px 10px",
                        borderRadius: "6px",
                      }}
                    >
                      {col.name}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700 }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Filtered Products Grid Preview */}
            <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>
                  Products in {previewFilter === "all" ? "All Collections" : filteredCollections.find((c) => c.id === previewFilter)?.name || previewFilter} ({previewVisibleProducts.length})
                </h3>
              </div>

              {previewVisibleProducts.length === 0 ? (
                <div style={{ padding: "3rem 1rem", textAlign: "center", color: "#94a3b8", background: "#f8fafc", borderRadius: "10px" }}>
                  <p style={{ margin: 0, fontSize: "0.95rem" }}>No products linked to this collection yet.</p>
                  <p style={{ margin: "0.4rem 0 0", fontSize: "0.8rem", color: "#cbd5e1" }}>
                    Use the "Quick Product Assignment" on the left or edit products in the Products CMS to link them.
                  </p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem" }}>
                  {previewVisibleProducts.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: "10px",
                        padding: "0.9rem",
                        background: "#ffffff",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                      }}
                    >
                      <div
                        style={{
                          height: "110px",
                          borderRadius: "8px",
                          background: "#f1f5f9",
                          marginBottom: "0.8rem",
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: "0.8rem" }}>
                            No Image
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.2rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#81663F", fontWeight: 600 }}>
                        {p.subcategory || p.category || "Unsorted"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
