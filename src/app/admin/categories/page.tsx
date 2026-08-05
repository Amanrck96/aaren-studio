"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/AdminNav";
import { CategoryItem } from "@/lib/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCat, setEditingCat] = useState<Partial<CategoryItem> | null>(null);

  const fetchCategories = () => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setCategories(json.data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat?.name) return alert("Category Name is required.");

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
    } else alert("Error: " + json.error);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
    fetchCategories();
  };

  const handleFileUpload = async (file: File) => {
    if (!file || !editingCat) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "Categories");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (json.success && json.url) {
        setEditingCat((prev) => (prev ? { ...prev, coverImage: json.dataUrl || json.url } : null));
        alert("✅ Category Cover Image uploaded to " + json.url);
      } else alert("Upload failed: " + json.error);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

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
            onClick={() => setEditingCat({ name: "", coverImage: "/categories/cat_1.png", description: "", shortCode: "DS 06", sequenceNumber: categories.length + 1 })}
            style={{ padding: "0.7rem 1.4rem", background: "linear-gradient(135deg, #d4af37 0%, #aa820a 100%)", color: "#000", border: "none", borderRadius: "8px", fontWeight: 800, cursor: "pointer" }}
          >
            + Add New Category
          </button>
        </div>

        {editingCat && (
          <form onSubmit={handleSave} style={{ background: "#12141c", padding: "2rem", borderRadius: "12px", border: "1px solid rgba(212,175,55,0.2)", marginBottom: "2rem" }}>
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
              <button type="submit" style={{ padding: "0.75rem 1.6rem", background: "#d4af37", color: "#000", border: "none", borderRadius: "6px", fontWeight: 800, cursor: "pointer" }}>
                Save Category
              </button>
              <button type="button" onClick={() => setEditingCat(null)} style={{ padding: "0.75rem 1.6rem", background: "#1e2230", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {categories.map((cat) => (
            <div key={cat.id} style={{ background: "#12141c", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                <span style={{ fontSize: "0.75rem", background: "rgba(212,175,55,0.15)", color: "#d4af37", border: "1px solid rgba(212,175,55,0.3)", padding: "0.2rem 0.6rem", borderRadius: "4px", fontWeight: 800 }}>
                  {cat.shortCode || "CAT"}
                </span>
                <span style={{ color: "#64748b", fontSize: "0.8rem" }}>Order: #{cat.sequenceNumber}</span>
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#fff" }}>{cat.name}</h3>
              <p style={{ color: "#94a3b8", fontSize: "0.88rem", margin: "0.5rem 0 1.2rem", lineHeight: 1.5 }}>{cat.description || "Architectural interior product category."}</p>
              <div style={{ display: "flex", gap: "0.8rem" }}>
                <button onClick={() => setEditingCat(cat)} style={{ padding: "0.45rem 1rem", background: "#1e2230", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(cat.id)} style={{ padding: "0.45rem 1rem", background: "rgba(239, 68, 68, 0.15)", color: "#f87171", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
