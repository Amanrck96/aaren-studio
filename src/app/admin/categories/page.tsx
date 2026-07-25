"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AdminNav from "@/components/AdminNav";
import { CategoryItem } from "@/lib/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<CategoryItem>>({
    name: "",
    coverImage: "/categories/cat_1.png",
    description: "",
    shortCode: "DS 06",
    sequenceNumber: 1,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      const json = await res.json();
      if (json.success) setCategories(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCategory),
      });
      const json = await res.json();
      if (json.success) {
        setShowModal(false);
        fetchCategories();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
      fetchCategories();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div style={{ background: "#0a0a0c", color: "#f0f0f2", minHeight: "100vh" }}>
      <AdminNav />

      <div style={{ maxWidth: "1200px", margin: "3rem auto", padding: "0 2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <span style={{ color: "#10b981", fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>CATEGORY CONTROLS</span>
            <h1 style={{ fontSize: "2.2rem", fontWeight: 800, margin: "0.3rem 0" }}>Category Section Manager</h1>
            <p style={{ color: "#aaa", fontSize: "0.95rem" }}>Add, edit, or remove categories with cover photos, short codes (DS 06), and sequence order.</p>
          </div>
          <button
            onClick={() => {
              setEditingCategory({ name: "", coverImage: "/categories/cat_1.png", description: "", shortCode: "DS 06", sequenceNumber: categories.length + 1 });
              setShowModal(true);
            }}
            style={{ padding: "0.8rem 1.4rem", background: "#10b981", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 700 }}
          >
            + Add New Category
          </button>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#888" }}>Loading categories...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {categories.map((cat) => (
              <div key={cat.id} style={{ background: "#141418", border: "1px solid #222", borderRadius: "10px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ position: "relative", height: "160px", background: "#222" }}>
                  <Image src={cat.coverImage} alt={cat.name} fill style={{ objectFit: "cover" }} />
                  <span style={{ position: "absolute", top: "10px", left: "10px", background: "rgba(0,0,0,0.8)", color: "#10b981", padding: "0.3rem 0.6rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700 }}>
                    {cat.shortCode}
                  </span>
                  <span style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(0,0,0,0.8)", color: "#fff", padding: "0.3rem 0.6rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700 }}>
                    Seq: #{cat.sequenceNumber}
                  </span>
                </div>
                <div style={{ padding: "1.2rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 0.4rem" }}>{cat.name}</h3>
                    <p style={{ color: "#888", fontSize: "0.85rem", lineHeight: 1.4, margin: "0 0 1rem" }}>{cat.description}</p>
                  </div>
                  <div style={{ display: "flex", gap: "0.8rem", borderTop: "1px solid #222", paddingTop: "0.8rem" }}>
                    <button
                      onClick={() => {
                        setEditingCategory(cat);
                        setShowModal(true);
                      }}
                      style={{ flex: 1, padding: "0.5rem", background: "#222", color: "#fff", border: "1px solid #333", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
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

      {/* Add / Edit Category Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ background: "#141418", border: "1px solid #333", borderRadius: "12px", width: "100%", maxWidth: "550px", padding: "2rem" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>{editingCategory.id ? "Edit Category" : "Add New Category"}</h2>
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Category Name *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ""}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Short Code (e.g. DS 06) *</label>
                  <input
                    type="text"
                    required
                    value={editingCategory.shortCode || ""}
                    onChange={(e) => setEditingCategory({ ...editingCategory, shortCode: e.target.value })}
                    style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Sequence Number *</label>
                  <input
                    type="number"
                    required
                    value={editingCategory.sequenceNumber || 1}
                    onChange={(e) => setEditingCategory({ ...editingCategory, sequenceNumber: parseInt(e.target.value, 10) || 1 })}
                    style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Cover Image URL *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.coverImage || ""}
                  onChange={(e) => setEditingCategory({ ...editingCategory, coverImage: e.target.value })}
                  style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Description</label>
                <textarea
                  rows={3}
                  value={editingCategory.description || ""}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: "0.7rem 1.2rem", background: "#222", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: "0.7rem 1.4rem", background: "#10b981", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 700 }}>
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
