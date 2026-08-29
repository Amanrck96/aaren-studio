"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/AdminNav";
import { TaxonomyItem } from "@/lib/types";

export default function AdminDropdownsPage() {
  const [items, setItems] = useState<TaxonomyItem[]>([]);
  const [editing, setEditing] = useState<Partial<TaxonomyItem> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchDropdowns = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/dropdowns");
      const json = await res.json();
      if (json.success) setItems(json.data);
    } catch (error) {
      console.error("Error fetching dropdowns:", error);
      alert("Failed to fetch dropdowns.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdowns();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.name || !editing?.type) return alert("Name and Type are required.");

    try {
      setIsSaving(true);
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
    } catch (error) {
      console.error("Error saving dropdown:", error);
      alert("Failed to save dropdown.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/dropdowns?id=${id}`, { method: "DELETE" });
      fetchDropdowns();
    } catch (error) {
      console.error("Error deleting dropdown:", error);
      alert("Failed to delete dropdown.");
    }
  };

  return (
    <div style={{ background: "#FAF8F5", color: "#1E1E1E", minHeight: "100vh" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem", background: "#FAF8F5" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid #DCD5C6", paddingBottom: "1.2rem" }}>
          <div>
            <span style={{ color: "#81663F", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 800 }}>TAXONOMY & ATTRIBUTES</span>
            <h1 style={{ fontSize: "2.2rem", fontWeight: 900, color: "#1E1E1E", margin: "0.2rem 0" }}>🗂️ Dynamic Dropdowns & Taxonomies</h1>
            <p style={{ color: "#555555", fontSize: "0.95rem" }}>Manage dynamic categories, technologies, project types, and status options.</p>
          </div>
          <button
            onClick={() => setEditing({ name: "", type: "Category", code: "", sequenceNumber: (items.length > 0 ? Math.max(...items.map((i: any) => i.sequenceNumber || 0)) : 0) + 1 })}
            style={{ padding: "0.75rem 1.6rem", background: "#1E1E1E", color: "#FFFFFF", border: "none", borderRadius: "8px", fontWeight: 800, cursor: "pointer", fontSize: "0.9rem", boxShadow: "0 4px 14px rgba(0,0,0,0.12)" }}
          >
            + Add Dropdown Option
          </button>
        </div>

        {editing && (
          <form onSubmit={handleSave} style={{ background: "#FFFFFF", padding: "2rem", borderRadius: "16px", border: "1px solid #E2DCD2", marginBottom: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "1.2rem", color: "#81663F" }}>Add Taxonomy Option</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Taxonomy Type *</label>
                <select
                  value={editing.type || "Category"}
                  onChange={(e) => setEditing({ ...editing, type: e.target.value as any })}
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
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
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Name / Label *</label>
                <input
                  type="text"
                  required
                  value={editing.name || ""}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Short Code</label>
                <input
                  type="text"
                  value={editing.code || ""}
                  onChange={(e) => setEditing({ ...editing, code: e.target.value })}
                  placeholder="e.g. FNT"
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <button type="submit" disabled={isSaving} style={{ padding: "0.75rem 1.6rem", background: "#1E1E1E", color: "#FFFFFF", border: "none", borderRadius: "8px", fontWeight: 800, cursor: isSaving ? "wait" : "pointer", boxShadow: "0 4px 14px rgba(0,0,0,0.12)" }}>
                {isSaving ? "Saving..." : "Save Option"}
              </button>
              <button type="button" onClick={() => setEditing(null)} style={{ padding: "0.75rem 1.6rem", background: "#FAF8F5", color: "#1E1E1E", border: "1px solid #D5CEBF", borderRadius: "8px", cursor: "pointer", fontWeight: 700 }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {items.map((item) => (
            <div key={item.id} style={{ background: "#FFFFFF", border: "1px solid #E2DCD2", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
              <span style={{ fontSize: "0.75rem", background: "rgba(129, 102, 63, 0.12)", color: "#81663F", border: "1px solid rgba(129, 102, 63, 0.25)", padding: "0.2rem 0.6rem", borderRadius: "6px", fontWeight: 800 }}>{item.type}</span>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#1E1E1E", margin: "0.6rem 0" }}>{item.name}</h3>
              {item.code && <div style={{ color: "#555555", fontSize: "0.85rem", marginBottom: "1rem" }}>Code: {item.code}</div>}
              <button onClick={() => handleDelete(item.id)} style={{ padding: "0.4rem 0.9rem", background: "#FEE2E2", color: "#DC2626", border: "1px solid #FCA5A5", borderRadius: "6px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 700 }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
