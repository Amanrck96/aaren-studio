"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/AdminNav";
import { TaxonomyItem } from "@/lib/types";

export default function AdminDropdownsPage() {
  const [items, setItems] = useState<TaxonomyItem[]>([]);
  const [editing, setEditing] = useState<Partial<TaxonomyItem> | null>(null);

  const fetchDropdowns = () => {
    fetch("/api/dropdowns")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setItems(json.data);
      });
  };

  useEffect(() => {
    fetchDropdowns();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.name || !editing?.type) return alert("Name and Type are required.");

    const res = await fetch("/api/dropdowns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    const json = await res.json();
    if (json.success) {
      alert("Dropdown taxonomy saved!");
      setEditing(null);
      fetchDropdowns();
    } else alert("Error: " + json.error);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/dropdowns?id=${id}`, { method: "DELETE" });
    fetchDropdowns();
  };

  return (
    <div style={{ background: "#0a0a0c", color: "#f0f0f2", minHeight: "100vh" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid #222", paddingBottom: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>🗂️ Dynamic Dropdowns & Taxonomies</h1>
            <p style={{ color: "#aaa", fontSize: "0.9rem" }}>Manage dynamic categories, technologies, project types, and status options.</p>
          </div>
          <button
            onClick={() => setEditing({ name: "", type: "Category", code: "", sequenceNumber: items.length + 1 })}
            style={{ padding: "0.7rem 1.4rem", background: "#a855f7", color: "#fff", border: "none", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}
          >
            + Add Dropdown Option
          </button>
        </div>

        {editing && (
          <form onSubmit={handleSave} style={{ background: "#141418", padding: "2rem", borderRadius: "10px", border: "1px solid #333", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.2rem" }}>Add Taxonomy Option</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Taxonomy Type *</label>
                <select
                  value={editing.type || "Category"}
                  onChange={(e) => setEditing({ ...editing, type: e.target.value as any })}
                  style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                >
                  <option value="Category">Category</option>
                  <option value="Collection">Collection / Subcategory</option>
                  <option value="Technology">Technology</option>
                  <option value="ProjectType">ProjectType</option>
                  <option value="Status">Status</option>
                  <option value="Tag">Tag</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Name / Label *</label>
                <input
                  type="text"
                  required
                  value={editing.name || ""}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Short Code</label>
                <input
                  type="text"
                  value={editing.code || ""}
                  onChange={(e) => setEditing({ ...editing, code: e.target.value })}
                  placeholder="e.g. FNT"
                  style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <button type="submit" style={{ padding: "0.7rem 1.5rem", background: "#a855f7", color: "#fff", border: "none", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}>
                Save Option
              </button>
              <button type="button" onClick={() => setEditing(null)} style={{ padding: "0.7rem 1.5rem", background: "#333", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {items.map((item) => (
            <div key={item.id} style={{ background: "#141418", border: "1px solid #222", borderRadius: "10px", padding: "1.2rem 1.5rem" }}>
              <span style={{ fontSize: "0.75rem", background: "#a855f7", color: "#fff", padding: "0.2rem 0.6rem", borderRadius: "4px", fontWeight: 700 }}>{item.type}</span>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0.5rem 0" }}>{item.name}</h3>
              {item.code && <div style={{ color: "#888", fontSize: "0.85rem", marginBottom: "1rem" }}>Code: {item.code}</div>}
              <button onClick={() => handleDelete(item.id)} style={{ padding: "0.3rem 0.8rem", background: "rgba(239,68,68,0.2)", color: "#f87171", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem" }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
