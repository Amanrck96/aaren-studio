"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/AdminNav";
import { BlogItem } from "@/lib/types";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [editing, setEditing] = useState<Partial<BlogItem> | null>(null);

  const fetchBlogs = () => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setBlogs(json.data);
      });
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.title || !editing?.content) return alert("Title and Content are required.");

    const res = await fetch("/api/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editing,
        category: editing.category || "Surfaces",
        tags: typeof editing.tags === "string" ? (editing.tags as string).split(",").map((t) => t.trim()) : editing.tags || [],
        status: editing.status || "Published",
        author: editing.author || "Aaren Studio",
        featuredImage: editing.featuredImage || "",
      }),
    });
    const json = await res.json();
    if (json.success) {
      alert("Blog article saved successfully!");
      setEditing(null);
      fetchBlogs();
    } else alert("Error: " + json.error);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/blogs?id=${id}`, { method: "DELETE" });
    fetchBlogs();
  };

  return (
    <div style={{ background: "#0a0a0c", color: "#f0f0f2", minHeight: "100vh" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid #222", paddingBottom: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>✍️ Blog Articles CMS</h1>
            <p style={{ color: "#aaa", fontSize: "0.9rem" }}>Write and publish material guides & design blogs.</p>
          </div>
          <button
            onClick={() => setEditing({ title: "", content: "", category: "Surfaces", author: "Aaren Studio", status: "Published" })}
            style={{ padding: "0.7rem 1.4rem", background: "#6366f1", color: "#fff", border: "none", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}
          >
            + Create Blog Post
          </button>
        </div>

        {editing && (
          <form onSubmit={handleSave} style={{ background: "#141418", padding: "2rem", borderRadius: "10px", border: "1px solid #333", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.2rem" }}>{editing.id ? "Edit Blog Article" : "Create Blog Article"}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Title *</label>
                <input
                  type="text"
                  required
                  value={editing.title || ""}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Category</label>
                <input
                  type="text"
                  value={editing.category || "Surfaces"}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>
            </div>

            <div style={{ marginTop: "1rem" }}>
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
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0] && editing) {
                      const formData = new FormData();
                      formData.append("file", e.target.files[0]);
                      formData.append("folder", "Blogs");
                      const res = await fetch("/api/upload", { method: "POST", body: formData });
                      const json = await res.json();
                      if (json.success && json.url) setEditing({ ...editing, featuredImage: json.dataUrl || json.url });
                    }
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
                  💻 Upload Image
                </label>
              </div>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Article Content *</label>
              <textarea
                rows={6}
                required
                value={editing.content || ""}
                onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <button type="submit" style={{ padding: "0.7rem 1.5rem", background: "#6366f1", color: "#fff", border: "none", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}>
                Publish Article
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
                  ✏️ Edit
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
