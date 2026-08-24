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
    <div style={{ background: "#0b0c10", color: "#f8fafc", minHeight: "100vh", display: "flex" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "1rem" }}>
          <div>
            <span style={{ color: "#d4af37", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 800 }}>PAGE BUILDER & CMS</span>
            <h1 style={{ fontSize: "2.2rem", fontWeight: 800, margin: "0.2rem 0", color: "#fff" }}>Page Manager & Section Builder</h1>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Create code-free custom pages, add/edit/hide/show sections, and configure page SEO.</p>
          </div>
          <button
            onClick={() => setEditing({ title: "", slug: "", status: "Published", sections: [] })}
            style={{ padding: "0.7rem 1.4rem", background: "linear-gradient(135deg, #d4af37 0%, #aa820a 100%)", color: "#000", border: "none", borderRadius: "8px", fontWeight: 800, cursor: "pointer" }}
          >
            + Create New Page
          </button>
        </div>

        {editing && (
          <form onSubmit={handleSave} style={{ background: "#12141c", padding: "2rem", borderRadius: "12px", border: "1px solid rgba(212,175,55,0.25)", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "1.2rem", color: "#d4af37" }}>{editing.id ? "Edit Page & Sections" : "Create New Custom Page"}</h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.3rem" }}>Page Title *</label>
                <input
                  type="text"
                  required
                  value={editing.title || ""}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  style={{ width: "100%", padding: "0.75rem", background: "#0b0c10", border: "1px solid #1e2230", color: "#fff", borderRadius: "6px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.3rem" }}>Page Slug / URL (e.g. villa-collection)</label>
                <input
                  type="text"
                  value={editing.slug || ""}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
                  style={{ width: "100%", padding: "0.75rem", background: "#0b0c10", border: "1px solid #1e2230", color: "#fff", borderRadius: "6px" }}
                />
              </div>
            </div>

            {/* SEO Meta Fields */}
            <div style={{ background: "#0b0c10", padding: "1.2rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)", marginBottom: "1.5rem" }}>
              <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#d4af37", marginBottom: "0.8rem" }}>🔍 Page SEO Settings</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#aaa", marginBottom: "0.2rem" }}>SEO Meta Title</label>
                  <input
                    type="text"
                    value={editing.seoTitle || ""}
                    onChange={(e) => setEditing({ ...editing, seoTitle: e.target.value })}
                    style={{ width: "100%", padding: "0.6rem", background: "#12141c", border: "1px solid #1e2230", color: "#fff", borderRadius: "4px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#aaa", marginBottom: "0.2rem" }}>SEO Meta Description</label>
                  <input
                    type="text"
                    value={editing.seoDescription || ""}
                    onChange={(e) => setEditing({ ...editing, seoDescription: e.target.value })}
                    style={{ width: "100%", padding: "0.6rem", background: "#12141c", border: "1px solid #1e2230", color: "#fff", borderRadius: "4px" }}
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Sections Manager */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>🧩 Page Sections ({editing.sections?.length || 0})</h3>
                <button
                  type="button"
                  onClick={addSection}
                  style={{ padding: "0.5rem 1rem", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "6px", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem" }}
                >
                  + Add Section
                </button>
              </div>

              {editing.sections?.map((sec, idx) => (
                <div key={sec.id || idx} style={{ background: "#0b0c10", padding: "1.2rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "0.8rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                      <span style={{ fontWeight: 800, color: "#d4af37" }}>#{idx + 1}</span>
                      <select
                        value={sec.type}
                        onChange={(e) => updateSection(idx, { type: e.target.value as any })}
                        style={{ padding: "0.4rem", background: "#12141c", border: "1px solid #1e2230", color: "#fff", borderRadius: "4px", fontWeight: 700 }}
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
                      <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={sec.isVisible}
                          onChange={(e) => updateSection(idx, { isVisible: e.target.checked })}
                        />
                        {sec.isVisible ? "👁️ Visible" : "🙈 Hidden"}
                      </label>
                      <button type="button" onClick={() => removeSection(idx)} style={{ padding: "0.3rem 0.6rem", background: "rgba(239,68,68,0.2)", color: "#f87171", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem" }}>
                        Remove
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Section Title"
                    value={sec.title}
                    onChange={(e) => updateSection(idx, { title: e.target.value })}
                    style={{ width: "100%", padding: "0.6rem", background: "#12141c", border: "1px solid #1e2230", color: "#fff", borderRadius: "4px" }}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button type="submit" disabled={isSaving} style={{ padding: "0.75rem 1.6rem", background: "#d4af37", color: "#000", border: "none", borderRadius: "6px", fontWeight: 800, cursor: isSaving ? "wait" : "pointer" }}>
                {isSaving ? "Saving..." : "Save Page & Layout"}
              </button>
              <button type="button" onClick={() => setEditing(null)} style={{ padding: "0.75rem 1.6rem", background: "#1e2230", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {pages.map((p) => (
            <div key={p.id} style={{ background: "#12141c", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                <span style={{ fontSize: "0.75rem", background: "rgba(212,175,55,0.15)", color: "#d4af37", border: "1px solid rgba(212,175,55,0.3)", padding: "0.2rem 0.6rem", borderRadius: "4px", fontWeight: 800 }}>
                  /{p.slug}
                </span>
                <span style={{ color: "#10b981", fontSize: "0.8rem", fontWeight: 700 }}>● {p.status}</span>
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#fff" }}>{p.title}</h3>
              <p style={{ color: "#94a3b8", fontSize: "0.88rem", margin: "0.5rem 0 1.2rem" }}>Sections: {p.sections?.length || 0} active modules</p>
              <div style={{ display: "flex", gap: "0.8rem" }}>
                <button onClick={() => setEditing(p)} style={{ padding: "0.45rem 1rem", background: "#1e2230", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}>
                  Edit Sections
                </button>
                <button onClick={() => handleDelete(p.id)} style={{ padding: "0.45rem 1rem", background: "rgba(239, 68, 68, 0.15)", color: "#f87171", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}>
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
