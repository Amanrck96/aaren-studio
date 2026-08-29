"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/AdminNav";
import { CustomPageItem, CustomPageSection } from "@/lib/types";

export default function AdminPagesPage() {
  const [pages, setPages] = useState<CustomPageItem[]>([]);
  const [editing, setEditing] = useState<Partial<CustomPageItem> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchPages = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/pages");
      const json = await res.json();
      if (json.success) setPages(json.data);
    } catch (error) {
      console.error("Error fetching pages:", error);
      alert("Failed to fetch pages.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.title) return alert("Page Title is required.");

    try {
      setIsSaving(true);
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      const json = await res.json();
      if (json.success) {
        alert("Page and section layout saved!");
        setEditing(null);
        fetchPages();
      } else alert("Error: " + json.error);
    } catch (error) {
      console.error("Error saving page:", error);
      alert("Failed to save page.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/pages?id=${id}`, { method: "DELETE" });
      fetchPages();
    } catch (error) {
      console.error("Error deleting page:", error);
      alert("Failed to delete page.");
    }
  };

  const addSection = () => {
    if (!editing) return;
    const currentSections = editing.sections || [];
    const newSec: CustomPageSection = {
      id: `sec-${Date.now()}`,
      type: "Banner",
      title: "New Architectural Section",
      content: "",
      isVisible: true,
      order: currentSections.length + 1,
    };
    setEditing({ ...editing, sections: [...currentSections, newSec] });
  };

  const updateSection = (idx: number, updated: Partial<CustomPageSection>) => {
    if (!editing || !editing.sections) return;
    const list = [...editing.sections];
    list[idx] = { ...list[idx], ...updated };
    setEditing({ ...editing, sections: list });
  };

  const removeSection = (idx: number) => {
    if (!editing || !editing.sections) return;
    const list = editing.sections.filter((_, i) => i !== idx);
    setEditing({ ...editing, sections: list });
  };

  return (
    <div style={{ background: "#FAF8F5", color: "#1E1E1E", minHeight: "100vh", display: "flex" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem", background: "#FAF8F5" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid #DCD5C6", paddingBottom: "1.2rem" }}>
          <div>
            <span style={{ color: "#81663F", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 800 }}>PAGE BUILDER & CMS</span>
            <h1 style={{ fontSize: "2.2rem", fontWeight: 900, margin: "0.2rem 0", color: "#1E1E1E" }}>Page Manager & Section Builder</h1>
            <p style={{ color: "#555555", fontSize: "0.95rem" }}>Create code-free custom pages, add/edit/hide/show sections, and configure page SEO.</p>
          </div>
          <button
            onClick={() => setEditing({ title: "", slug: "", status: "Published", sections: [] })}
            style={{ padding: "0.75rem 1.6rem", background: "#1E1E1E", color: "#FFFFFF", border: "none", borderRadius: "8px", fontWeight: 800, cursor: "pointer", fontSize: "0.9rem", boxShadow: "0 4px 14px rgba(0,0,0,0.12)" }}
          >
            + Create New Page
          </button>
        </div>

        {editing && (
          <form onSubmit={handleSave} style={{ background: "#FFFFFF", padding: "2rem", borderRadius: "16px", border: "1px solid #E2DCD2", marginBottom: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "1.2rem", color: "#81663F" }}>{editing.id ? "Edit Page & Sections" : "Create New Custom Page"}</h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Page Title *</label>
                <input
                  type="text"
                  required
                  value={editing.title || ""}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Page Slug / URL (e.g. villa-collection)</label>
                <input
                  type="text"
                  value={editing.slug || ""}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                />
              </div>
            </div>

            {/* SEO Meta Fields */}
            <div style={{ background: "#FAF8F5", padding: "1.2rem", borderRadius: "10px", border: "1px solid #E2DCD2", marginBottom: "1.5rem" }}>
              <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#81663F", marginBottom: "0.8rem" }}>🔍 Page SEO Settings</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.3rem" }}>SEO Meta Title</label>
                  <input
                    type="text"
                    value={editing.seoTitle || ""}
                    onChange={(e) => setEditing({ ...editing, seoTitle: e.target.value })}
                    style={{ width: "100%", padding: "0.6rem", background: "#FFFFFF", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "6px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.3rem" }}>SEO Meta Description</label>
                  <input
                    type="text"
                    value={editing.seoDescription || ""}
                    onChange={(e) => setEditing({ ...editing, seoDescription: e.target.value })}
                    style={{ width: "100%", padding: "0.6rem", background: "#FFFFFF", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "6px" }}
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Sections Manager */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1E1E1E" }}>🧩 Page Sections ({editing.sections?.length || 0})</h3>
                <button
                  type="button"
                  onClick={addSection}
                  style={{ padding: "0.5rem 1rem", background: "#1E1E1E", color: "#FFFFFF", border: "none", borderRadius: "6px", fontWeight: 800, cursor: "pointer", fontSize: "0.85rem" }}
                >
                  + Add Section
                </button>
              </div>

              {editing.sections?.map((sec, idx) => (
                <div key={sec.id || idx} style={{ background: "#FAF8F5", padding: "1.2rem", borderRadius: "10px", border: "1px solid #E2DCD2", marginBottom: "0.8rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                      <span style={{ fontWeight: 800, color: "#81663F" }}>#{idx + 1}</span>
                      <select
                        value={sec.type}
                        onChange={(e) => updateSection(idx, { type: e.target.value as any })}
                        style={{ padding: "0.4rem 0.8rem", background: "#FFFFFF", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "6px", fontWeight: 700 }}
                      >
                        <option value="Hero">Hero Section</option>
                        <option value="Banner">Banner Section</option>
                        <option value="Services">Services Grid</option>
                        <option value="Portfolio">Portfolio Grid</option>
                        <option value="Gallery">Media Gallery</option>
                        <option value="Testimonials">Testimonials</option>
                        <option value="FAQ">FAQ Accordion</option>
                        <option value="RichText">Rich Text Content</option>
                      </select>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", cursor: "pointer", fontWeight: 600, color: "#1E1E1E" }}>
                        <input
                          type="checkbox"
                          checked={sec.isVisible}
                          onChange={(e) => updateSection(idx, { isVisible: e.target.checked })}
                        />
                        {sec.isVisible ? "👁️ Visible" : "🙈 Hidden"}
                      </label>
                      <button type="button" onClick={() => removeSection(idx)} style={{ padding: "0.3rem 0.6rem", background: "#FEE2E2", color: "#DC2626", border: "1px solid #FCA5A5", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 700 }}>
                        Remove
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Section Title"
                    value={sec.title}
                    onChange={(e) => updateSection(idx, { title: e.target.value })}
                    style={{ width: "100%", padding: "0.6rem", background: "#FFFFFF", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "6px" }}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button type="submit" disabled={isSaving} style={{ padding: "0.75rem 1.6rem", background: "#1E1E1E", color: "#FFFFFF", border: "none", borderRadius: "8px", fontWeight: 800, cursor: isSaving ? "wait" : "pointer", boxShadow: "0 4px 14px rgba(0,0,0,0.12)" }}>
                {isSaving ? "Saving..." : "Save Page & Layout"}
              </button>
              <button type="button" onClick={() => setEditing(null)} style={{ padding: "0.75rem 1.6rem", background: "#FAF8F5", color: "#1E1E1E", border: "1px solid #D5CEBF", borderRadius: "8px", cursor: "pointer", fontWeight: 700 }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {pages.map((p) => (
            <div key={p.id} style={{ background: "#FFFFFF", border: "1px solid #E2DCD2", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                <span style={{ fontSize: "0.75rem", background: "rgba(129, 102, 63, 0.12)", color: "#81663F", border: "1px solid rgba(129, 102, 63, 0.25)", padding: "0.2rem 0.6rem", borderRadius: "6px", fontWeight: 800 }}>
                  /{p.slug}
                </span>
                <span style={{ color: "#16A34A", fontSize: "0.8rem", fontWeight: 800 }}>● {p.status}</span>
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#1E1E1E" }}>{p.title}</h3>
              <p style={{ color: "#555555", fontSize: "0.88rem", margin: "0.5rem 0 1.2rem" }}>Sections: {p.sections?.length || 0} active modules</p>
              <div style={{ display: "flex", gap: "0.8rem" }}>
                <button onClick={() => setEditing(p)} style={{ padding: "0.45rem 1rem", background: "#1E1E1E", color: "#FFFFFF", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700 }}>
                  Edit Sections
                </button>
                <button onClick={() => handleDelete(p.id)} style={{ padding: "0.45rem 1rem", background: "#FEE2E2", color: "#DC2626", border: "1px solid #FCA5A5", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700 }}>
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
