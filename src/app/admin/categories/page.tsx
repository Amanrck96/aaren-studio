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
    <div style={{ background: "#FAF8F5", color: "#1E1E1E", minHeight: "100vh", display: "flex" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem", background: "#FAF8F5" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid #DCD5C6", paddingBottom: "1rem" }}>
          <div>
            <span style={{ color: "#81663F", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 800 }}>CATEGORY MANAGEMENT</span>
            <h1 style={{ fontSize: "2.2rem", fontWeight: 800, margin: "0.2rem 0", color: "#1E1E1E" }}>Browse by Category CMS</h1>
            <p style={{ color: "#555555", fontSize: "0.95rem" }}>Add, edit, or delete categories displayed on the website.</p>
          </div>
          <button
            onClick={() => setEditingCat({ name: "", coverImage: "/categories/cat_1.jpg", description: "", shortCode: "DS 06", sequenceNumber: categories.length + 1 })}
            style={{ padding: "0.75rem 1.5rem", background: "#1E1E1E", color: "#FFFFFF", border: "none", borderRadius: "8px", fontWeight: 800, cursor: "pointer", fontSize: "0.95rem", boxShadow: "0 4px 14px rgba(0,0,0,0.12)" }}
          >
            + Add New Category
          </button>
        </div>

        {editingCat && (
          <form onSubmit={handleSave} style={{ background: "#FFFFFF", padding: "2.2rem", borderRadius: "16px", border: "1px solid #E2DCD2", boxShadow: "0 4px 20px rgba(0,0,0,0.04)", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "1.2rem", color: "#81663F" }}>{editingCat.id ? "Edit Category" : "Add Category"}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Category Name *</label>
                <input
                  type="text"
                  required
                  value={editingCat.name || ""}
                  onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })}
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px", fontSize: "0.95rem" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Short Code (e.g. DS 06)</label>
                <input
                  type="text"
                  value={editingCat.shortCode || ""}
                  onChange={(e) => setEditingCat({ ...editingCat, shortCode: e.target.value })}
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px", fontSize: "0.95rem" }}
                />
              </div>
            </div>

            <div style={{ marginTop: "1.2rem" }}>
              <label style={{ display: "block", fontSize: "0.9rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Cover Image URL</label>
              <div style={{ display: "flex", gap: "0.6rem" }}>
                <input
                  type="text"
                  value={editingCat.coverImage || ""}
                  onChange={(e) => setEditingCat({ ...editingCat, coverImage: e.target.value })}
                  style={{ flex: 1, padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px", fontSize: "0.95rem" }}
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
                    padding: "0.8rem 1.4rem",
                    background: "#1E1E1E",
                    color: "#FFFFFF",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  💻 Upload Image From Computer
                </label>
              </div>
            </div>

            <div style={{ marginTop: "1.2rem" }}>
              <label style={{ display: "block", fontSize: "0.9rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Description</label>
              <textarea
                rows={3}
                value={editingCat.description || ""}
                onChange={(e) => setEditingCat({ ...editingCat, description: e.target.value })}
                style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px", fontSize: "0.95rem" }}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.8rem" }}>
              <button type="submit" disabled={isSaving} style={{ padding: "0.8rem 1.8rem", background: "#1E1E1E", color: "#FFFFFF", border: "none", borderRadius: "8px", fontWeight: 800, cursor: "pointer", fontSize: "0.95rem" }}>
                {isSaving ? "Saving..." : "Save Category"}
              </button>
              <button type="button" onClick={() => setEditingCat(null)} style={{ padding: "0.8rem 1.8rem", background: "#FFFFFF", color: "#1E1E1E", border: "1px solid #D5CEBF", borderRadius: "8px", cursor: "pointer", fontSize: "0.95rem" }}>
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
                background: "#FFFFFF",
                border: "1px solid #E2DCD2",
                borderRadius: "16px",
                padding: "1.8rem",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                transition: "all 0.3s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <span
                  style={{
                    fontSize: "0.8rem",
                    background: "rgba(129,102,63,0.12)",
                    color: "#81663F",
                    border: "1px solid rgba(129,102,63,0.25)",
                    padding: "0.3rem 0.8rem",
                    borderRadius: "6px",
                    fontWeight: 800,
                    letterSpacing: "0.05em",
                  }}
                >
                  {cat.shortCode || "CAT"}
                </span>
                <span style={{ color: "#81663F", fontSize: "0.85rem", fontWeight: 700 }}>Order: #{cat.sequenceNumber}</span>
              </div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#1E1E1E", letterSpacing: "0.02em", margin: "0.5rem 0", textTransform: "uppercase" }}>
                {cat.name}
              </h3>
              <p style={{ color: "#555555", fontSize: "0.95rem", margin: "0.6rem 0 1.5rem", lineHeight: 1.6, fontWeight: 400 }}>
                {cat.description || "Architectural interior product category."}
              </p>
              <div style={{ display: "flex", gap: "0.8rem" }}>
                <button
                  onClick={() => setEditingCat(cat)}
                  style={{
                    padding: "0.5rem 1.2rem",
                    background: "#1E1E1E",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  style={{
                    padding: "0.5rem 1.2rem",
                    background: "#FEE2E2",
                    color: "#DC2626",
                    border: "1px solid #FCA5A5",
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
