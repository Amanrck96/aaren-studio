"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/AdminNav";
import { CategoryItem } from "@/lib/types";
import { uploadFileWithCompression } from "@/lib/uploadHelper";

const CARD_THEMES = [
  { id: "navy", label: "Midnight Navy", bg: "linear-gradient(145deg, #1e2235 0%, #12141f 100%)", border: "rgba(212,175,55,0.3)" },
  { id: "obsidian", label: "Luxury Obsidian", bg: "linear-gradient(145deg, #181920 0%, #0b0c10 100%)", border: "rgba(212,175,55,0.4)" },
  { id: "charcoal", label: "Deep Charcoal", bg: "linear-gradient(145deg, #252836 0%, #1a1c26 100%)", border: "rgba(255,255,255,0.15)" },
  { id: "gold-glow", label: "Golden Glow", bg: "linear-gradient(145deg, #2a2215 0%, #141009 100%)", border: "#d4af37" },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCat, setEditingCat] = useState<Partial<CategoryItem> | null>(null);
  const [cardTheme, setCardTheme] = useState("navy");
  const [isSaving, setIsSaving] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/categories");
      const json = await res.json();
      if (json.success) setCategories(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat?.name) return alert("Category Name is required.");
    setIsSaving(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCat),
      });
      const json = await res.json();
      if (json.success) {
        alert("Category saved successfully!");
        setEditingCat(null);
        fetchCategories();
      } else {
        alert("Error: " + json.error);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
      fetchCategories();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file || !editingCat) return;
    try {
      const result = await uploadFileWithCompression(file, "Categories");
      if (result.success && (result.url || result.dataUrl)) {
        setEditingCat((prev) => (prev ? { ...prev, coverImage: result.dataUrl || result.url } : null));
        alert("✅ Category Cover Image uploaded successfully!");
      } else {
        alert("Upload failed: " + (result.error || "Upload error"));
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const activeThemeObj = CARD_THEMES.find((t) => t.id === cardTheme) || CARD_THEMES[0];

  return (
    <div style={{ background: "#0b0c10", color: "#f8fafc", minHeight: "100vh", display: "flex" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "1rem" }}>
          <div>
            <span style={{ color: "#d4af37", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 800 }}>CATEGORY MANAGEMENT</span>
            <h1 style={{ fontSize: "2.2rem", fontWeight: 800, margin: "0.2rem 0", color: "#fff" }}>Browse by Category CMS</h1>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Add, edit, or delete categories displayed on the website.</p>
          </div>
          <button
            onClick={() => setEditingCat({ name: "", coverImage: "/categories/cat_1.jpg", description: "", shortCode: "DS 06", sequenceNumber: categories.length + 1 })}
            style={{ padding: "0.7rem 1.4rem", background: "linear-gradient(135deg, #d4af37 0%, #aa820a 100%)", color: "#000", border: "none", borderRadius: "8px", fontWeight: 800, cursor: "pointer" }}
          >
            + Add New Category
          </button>
        </div>

        {/* Card Background Theme Controls */}
        <div style={{ background: "#12141c", padding: "1rem 1.5rem", borderRadius: "10px", border: "1px solid rgba(212,175,55,0.2)", marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <span style={{ fontSize: "1.1rem" }}>🎨</span>
            <div>
              <span style={{ color: "#d4af37", fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>Card Background Theme Option:</span>
              <p style={{ color: "#94a3b8", fontSize: "0.8rem", margin: 0 }}>Choose background style & contrast for category boxes.</p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.6rem" }}>
            {CARD_THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setCardTheme(theme.id)}
                style={{
                  padding: "0.45rem 0.9rem",
                  borderRadius: "6px",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "1px solid " + (cardTheme === theme.id ? "#d4af37" : "rgba(255,255,255,0.15)"),
                  background: cardTheme === theme.id ? "#d4af37" : "#1e2230",
                  color: cardTheme === theme.id ? "#000" : "#fff",
                  transition: "all 0.2s ease",
                }}
              >
                {theme.label}
              </button>
            ))}
          </div>
        </div>

        {editingCat && (
          <form onSubmit={handleSave} style={{ background: "#12141c", padding: "2rem", borderRadius: "12px", border: "1px solid rgba(212,175,55,0.3)", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.2rem", color: "#d4af37" }}>{editingCat.id ? "Edit Category" : "Add Category"}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.3rem" }}>Category Name *</label>
                <input
                  type="text"
                  required
                  value={editingCat.name || ""}
                  onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })}
                  style={{ width: "100%", padding: "0.75rem", background: "#0b0c10", border: "1px solid #1e2230", color: "#fff", borderRadius: "6px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.3rem" }}>Short Code (e.g. DS 06)</label>
                <input
                  type="text"
                  value={editingCat.shortCode || ""}
                  onChange={(e) => setEditingCat({ ...editingCat, shortCode: e.target.value })}
                  style={{ width: "100%", padding: "0.75rem", background: "#0b0c10", border: "1px solid #1e2230", color: "#fff", borderRadius: "6px" }}
                />
              </div>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.3rem" }}>Cover Image URL</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="text"
                  value={editingCat.coverImage || ""}
                  onChange={(e) => setEditingCat({ ...editingCat, coverImage: e.target.value })}
                  style={{ flex: 1, padding: "0.75rem", background: "#0b0c10", border: "1px solid #1e2230", color: "#fff", borderRadius: "6px" }}
                />
                <input
                  type="file"
                  accept="image/*"
                  id="catCoverUpload"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) handleFileUpload(e.target.files[0]);
                  }}
                />
                <label
                  htmlFor="catCoverUpload"
                  style={{
                    padding: "0.75rem 1.2rem",
                    background: "#2563eb",
                    color: "#fff",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  💻 Upload Image From Computer
                </label>
              </div>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.3rem" }}>Description</label>
              <textarea
                rows={3}
                value={editingCat.description || ""}
                onChange={(e) => setEditingCat({ ...editingCat, description: e.target.value })}
                style={{ width: "100%", padding: "0.75rem", background: "#0b0c10", border: "1px solid #1e2230", color: "#fff", borderRadius: "6px" }}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <button type="submit" disabled={isSaving} style={{ padding: "0.75rem 1.6rem", background: "#d4af37", color: "#000", border: "none", borderRadius: "6px", fontWeight: 800, cursor: "pointer" }}>
                {isSaving ? "Saving..." : "Save Category"}
              </button>
              <button type="button" onClick={() => setEditingCat(null)} style={{ padding: "0.75rem 1.6rem", background: "#1e2230", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              style={{
                background: activeThemeObj.bg,
                border: "1px solid " + activeThemeObj.border,
                borderRadius: "14px",
                padding: "1.8rem",
                boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
                transition: "all 0.3s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <span
                  style={{
                    fontSize: "0.8rem",
                    background: "linear-gradient(135deg, #d4af37 0%, #aa820a 100%)",
                    color: "#000",
                    padding: "0.3rem 0.8rem",
                    borderRadius: "6px",
                    fontWeight: 900,
                    letterSpacing: "0.05em",
                    boxShadow: "0 2px 8px rgba(212,175,55,0.3)",
                  }}
                >
                  {cat.shortCode || "CAT"}
                </span>
                <span style={{ color: "#d4af37", fontSize: "0.85rem", fontWeight: 700 }}>Order: #{cat.sequenceNumber}</span>
              </div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 900, color: "#ffffff", letterSpacing: "0.03em", margin: "0.5rem 0", textTransform: "uppercase" }}>
                {cat.name}
              </h3>
              <p style={{ color: "#f1f5f9", fontSize: "0.95rem", margin: "0.6rem 0 1.5rem", lineHeight: 1.6, fontWeight: 500 }}>
                {cat.description || "Architectural interior product category."}
              </p>
              <div style={{ display: "flex", gap: "0.8rem" }}>
                <button
                  onClick={() => setEditingCat(cat)}
                  style={{
                    padding: "0.5rem 1.2rem",
                    background: "#2563eb",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    boxShadow: "0 2px 6px rgba(37,99,235,0.4)",
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  style={{
                    padding: "0.5rem 1.2rem",
                    background: "rgba(239, 68, 68, 0.2)",
                    color: "#f87171",
                    border: "1px solid rgba(239, 68, 68, 0.4)",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
