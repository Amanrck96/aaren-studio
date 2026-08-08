"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/AdminNav";
import { BlogItem } from "@/lib/types";
import { uploadFileWithCompression } from "@/lib/uploadHelper";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [editing, setEditing] = useState<Partial<BlogItem> | null>(null);
  const [uploading, setUploading] = useState(false);

  // Blog Font Settings
  const [showTypographyModal, setShowTypographyModal] = useState(false);
  const [fontSettings, setFontSettings] = useState({
    articleTitleSize: "1.75rem",
    articleBodySize: "0.9rem",
    cardTitleSize: "1.05rem",
    cardBodySize: "0.85rem",
  });

  const fetchBlogs = () => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setBlogs(json.data);
      });
  };

  const fetchFontSettings = () => {
    fetch("/api/blog-settings")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) setFontSettings(json.data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchBlogs();
    fetchFontSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.title || !editing?.content) return alert("Title and Content are required.");

    const generatedSlug = editing.slug || editing.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const res = await fetch("/api/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editing,
        slug: generatedSlug,
        category: editing.category || "Surfaces",
        tags: typeof editing.tags === "string" ? (editing.tags as string).split(",").map((t) => t.trim()) : editing.tags || [],
        status: editing.status || "Published",
        author: editing.author || "Aaren Studio",
        featuredImage: editing.featuredImage || "",
      }),
    });
    const json = await res.json();
    if (json.success) {
      alert("✅ Blog article saved successfully to database!");
      setEditing(null);
      fetchBlogs();
    } else alert("❌ Error saving blog: " + json.error);
  };

  const handleSaveFontSettings = async () => {
    try {
      const res = await fetch("/api/blog-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fontSettings),
      });
      const json = await res.json();
      if (json.success) {
        alert("✅ Font Size Preferences Saved System-Wide & Synced to Firebase!");
        setShowTypographyModal(false);
      } else alert("❌ Failed to save font settings.");
    } catch (e: any) {
      alert("❌ Error: " + e.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    await fetch(`/api/blogs?id=${id}`, { method: "DELETE" });
    fetchBlogs();
  };

  const handleImageUpload = async (file: File) => {
    if (!file || !editing) return;
    setUploading(true);
    try {
      const res = await uploadFileWithCompression(file, "Blogs");
      if (res.success && res.url) {
        setEditing({ ...editing, featuredImage: res.url });
        alert("✅ Cover photo uploaded successfully: " + res.url);
      } else {
        alert("❌ Image upload failed: " + (res.error || "Unknown error"));
      }
    } catch (e: any) {
      alert("❌ Upload error: " + e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ background: "#0a0a0c", color: "#f0f0f2", minHeight: "100vh" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid #222", paddingBottom: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>✍️ Blog Articles & Journal CMS</h1>
            <p style={{ color: "#aaa", fontSize: "0.9rem" }}>Create, edit, and manage all blog articles and customize font size display across the website.</p>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={() => setShowTypographyModal(true)}
              style={{ padding: "0.7rem 1.4rem", background: "linear-gradient(135deg, #d4af37 0%, #aa820a 100%)", color: "#000", border: "none", borderRadius: "6px", fontWeight: 900, cursor: "pointer" }}
            >
              🎨 Font Size & Typography Settings
            </button>
            <button
              onClick={() => setEditing({ title: "", slug: "", content: "", category: "Surfaces & Architecture", author: "Aaren Studio", status: "Published" })}
              style={{ padding: "0.7rem 1.4rem", background: "#6366f1", color: "#fff", border: "none", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}
            >
              + Create New Blog Post
            </button>
          </div>
        </div>

        {/* TYPOGRAPHY SETTINGS MODAL */}
        {showTypographyModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
            <div style={{ background: "#141418", border: "1px solid #333", borderRadius: "12px", width: "100%", maxWidth: "600px", padding: "2rem", maxHeight: "90vh", overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.4rem", fontWeight: 800, margin: 0, color: "#d4af37" }}>🎨 Blog Font Size & Text Scale Manager</h2>
                  <p style={{ color: "#aaa", fontSize: "0.85rem", margin: "0.2rem 0 0" }}>Adjust and reduce/increase the font sizes for article titles, body paragraphs, and cards live!</p>
                </div>
                <button onClick={() => setShowTypographyModal(false)} style={{ background: "none", border: "none", color: "#aaa", fontSize: "1.5rem", cursor: "pointer" }}>✕</button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", marginBottom: "1.5rem" }}>
                {/* Article Title Font Size */}
                <div style={{ background: "#0a0a0c", padding: "1rem", borderRadius: "8px", border: "1px solid #222" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#fff", fontWeight: 700, marginBottom: "0.5rem" }}>
                    📰 Article Title Font Size (Default: 1.75rem / 28px)
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                    {[
                      { label: "Compact (1.4rem / 22px)", value: "1.4rem" },
                      { label: "Small (1.6rem / 25px)", value: "1.6rem" },
                      { label: "Standard (1.75rem / 28px)", value: "1.75rem" },
                      { label: "Medium (2.1rem / 33px)", value: "2.1rem" },
                      { label: "Large (2.5rem / 40px)", value: "2.5rem" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFontSettings({ ...fontSettings, articleTitleSize: opt.value })}
                        style={{
                          padding: "0.4rem 0.8rem",
                          borderRadius: "4px",
                          border: fontSettings.articleTitleSize === opt.value ? "2px solid #d4af37" : "1px solid #333",
                          background: fontSettings.articleTitleSize === opt.value ? "#80673f" : "#141418",
                          color: "#fff",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={fontSettings.articleTitleSize}
                    onChange={(e) => setFontSettings({ ...fontSettings, articleTitleSize: e.target.value })}
                    style={{ width: "100%", padding: "0.5rem", background: "#141418", border: "1px solid #333", color: "#fff", borderRadius: "4px", fontSize: "0.85rem" }}
                  />
                </div>

                {/* Article Content Body Text Size */}
                <div style={{ background: "#0a0a0c", padding: "1rem", borderRadius: "8px", border: "1px solid #222" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#fff", fontWeight: 700, marginBottom: "0.5rem" }}>
                    📖 Article Body Paragraph Text Size (Default: 0.9rem / 14.4px)
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                    {[
                      { label: "Very Small (0.8rem / 12.8px)", value: "0.8rem" },
                      { label: "Compact (0.875rem / 14px)", value: "0.875rem" },
                      { label: "Small / Standard (0.925rem / 14.8px)", value: "0.925rem" },
                      { label: "Medium (1.05rem / 16.8px)", value: "1.05rem" },
                      { label: "Large (1.2rem / 19px)", value: "1.2rem" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFontSettings({ ...fontSettings, articleBodySize: opt.value })}
                        style={{
                          padding: "0.4rem 0.8rem",
                          borderRadius: "4px",
                          border: fontSettings.articleBodySize === opt.value ? "2px solid #d4af37" : "1px solid #333",
                          background: fontSettings.articleBodySize === opt.value ? "#80673f" : "#141418",
                          color: "#fff",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={fontSettings.articleBodySize}
                    onChange={(e) => setFontSettings({ ...fontSettings, articleBodySize: e.target.value })}
                    style={{ width: "100%", padding: "0.5rem", background: "#141418", border: "1px solid #333", color: "#fff", borderRadius: "4px", fontSize: "0.85rem" }}
                  />
                </div>

                {/* Card Title Size */}
                <div style={{ background: "#0a0a0c", padding: "1rem", borderRadius: "8px", border: "1px solid #222" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#fff", fontWeight: 700, marginBottom: "0.5rem" }}>
                    🎴 Blog Card Title Font Size (Default: 1.05rem / 16.8px)
                  </label>
                  <input
                    type="text"
                    value={fontSettings.cardTitleSize}
                    onChange={(e) => setFontSettings({ ...fontSettings, cardTitleSize: e.target.value })}
                    style={{ width: "100%", padding: "0.5rem", background: "#141418", border: "1px solid #333", color: "#fff", borderRadius: "4px", fontSize: "0.85rem" }}
                  />
                </div>

                {/* LIVE PREVIEW BOX */}
                <div style={{ background: "#ffffff", padding: "1.2rem", borderRadius: "8px", color: "#111" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#80673f", textTransform: "uppercase" }}>Live Preview</span>
                  <h3 style={{ fontSize: fontSettings.articleTitleSize, fontWeight: 800, color: "#80673f", margin: "0.4rem 0 0.6rem", lineHeight: 1.25 }}>
                    NewTechWood Decking: Creating Beautiful Outdoor Living Spaces
                  </h3>
                  <p style={{ fontSize: fontSettings.articleBodySize, lineHeight: 1.6, color: "#444", margin: 0 }}>
                    NewTechWood represents the pinnacle of composite wood technology for luxury outdoor living spaces. Engineered with an advanced Ultrashield co-extrusion technology.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                <button type="button" onClick={() => setShowTypographyModal(false)} style={{ padding: "0.7rem 1.2rem", background: "#222", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveFontSettings}
                  style={{ padding: "0.7rem 1.5rem", background: "linear-gradient(135deg, #d4af37 0%, #aa820a 100%)", color: "#000", border: "none", borderRadius: "6px", fontWeight: 900, cursor: "pointer" }}
                >
                  💾 Save & Apply System-Wide
                </button>
              </div>
            </div>
          </div>
        )}

        {editing && (
          <form onSubmit={handleSave} style={{ background: "#141418", padding: "2rem", borderRadius: "10px", border: "1px solid #333", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#6366f1", marginBottom: "1.2rem" }}>
              {editing.id ? "✏️ Edit Blog Article Text & Content" : "✨ Create New Blog Article"}
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Article Title *</label>
                <input
                  type="text"
                  required
                  value={editing.title || ""}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>URL Slug (e.g. 5-reasons-to-choose-newtechwood-for-outdoor-spaces)</label>
                <input
                  type="text"
                  placeholder="auto-generated-from-title"
                  value={editing.slug || ""}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Category</label>
                <input
                  type="text"
                  value={editing.category || "Surfaces & Architecture"}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Author</label>
                <input
                  type="text"
                  value={editing.author || "Aaren Studio"}
                  onChange={(e) => setEditing({ ...editing, author: e.target.value })}
                  style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Publish Date</label>
                <input
                  type="text"
                  placeholder="e.g. August 8, 2026"
                  value={editing.publishDate || ""}
                  onChange={(e) => setEditing({ ...editing, publishDate: e.target.value })}
                  style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Featured Cover Image URL</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="text"
                  value={editing.featuredImage || ""}
                  onChange={(e) => setEditing({ ...editing, featuredImage: e.target.value })}
                  style={{ flex: 1, padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
                <input
                  type="file"
                  accept="image/*"
                  id="blogCoverUpload"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) handleImageUpload(e.target.files[0]);
                  }}
                />
                <label
                  htmlFor="blogCoverUpload"
                  style={{
                    padding: "0.7rem 1rem",
                    background: "#2563eb",
                    color: "#fff",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {uploading ? "⏳ Uploading..." : "💻 Upload Cover Image"}
                </label>
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Full Article Text & Content *</label>
              <textarea
                rows={10}
                required
                value={editing.content || ""}
                onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px", fontFamily: "inherit", lineHeight: 1.6 }}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <button type="submit" style={{ padding: "0.7rem 1.5rem", background: "#6366f1", color: "#fff", border: "none", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}>
                💾 Save & Publish Article
              </button>
              <button type="button" onClick={() => setEditing(null)} style={{ padding: "0.7rem 1.5rem", background: "#333", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {blogs.map((b) => (
            <div key={b.id} style={{ background: "linear-gradient(145deg, #1e2235 0%, #12141f 100%)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: "14px", padding: "1.8rem", boxShadow: "0 10px 25px rgba(0,0,0,0.4)" }}>
              <span style={{ fontSize: "0.78rem", background: "linear-gradient(135deg, #d4af37 0%, #aa820a 100%)", color: "#000", padding: "0.25rem 0.7rem", borderRadius: "4px", fontWeight: 900 }}>{b.category || "General"}</span>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 900, color: "#ffffff", margin: "0.8rem 0 0.5rem" }}>{b.title}</h3>
              <p style={{ color: "#cbd5e1", fontSize: "0.9rem", margin: "0.5rem 0 1.4rem", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{b.content}</p>
              <div style={{ display: "flex", gap: "0.8rem" }}>
                <button onClick={() => setEditing(b)} style={{ padding: "0.5rem 1.2rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.88rem", fontWeight: 700 }}>
                  ✏️ Edit Content
                </button>
                <button onClick={() => handleDelete(b.id)} style={{ padding: "0.5rem 1.2rem", background: "rgba(239,68,68,0.2)", color: "#f87171", border: "1px solid rgba(239,68,68,0.4)", borderRadius: "6px", cursor: "pointer", fontSize: "0.88rem", fontWeight: 700 }}>
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
