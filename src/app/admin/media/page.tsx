"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/AdminNav";
import { MediaAsset } from "@/lib/types";

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [editing, setEditing] = useState<Partial<MediaAsset> | null>(null);

  const fetchMedia = () => {
    fetch("/api/media")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setMedia(json.data);
      });
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.fileName || !editing?.fileUrl) return alert("File Name and URL are required.");

    const res = await fetch("/api/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editing,
        fileType: editing.fileType || "PDF",
        folder: editing.folder || "General",
      }),
    });
    const json = await res.json();
    if (json.success) {
      alert("Media Asset added!");
      setEditing(null);
      fetchMedia();
    } else alert("Error: " + json.error);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/media?id=${id}`, { method: "DELETE" });
    fetchMedia();
  };

  return (
    <div style={{ background: "#0a0a0c", color: "#f0f0f2", minHeight: "100vh" }}>
      <AdminNav />

      <div style={{ maxWidth: "1300px", margin: "2rem auto", padding: "0 2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid #222", paddingBottom: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>📁 Central Media Library</h1>
            <p style={{ color: "#aaa", fontSize: "0.9rem" }}>Manage PDF brochures, MP4 videos, images, and brand catalogs.</p>
          </div>
          <button
            onClick={() => setEditing({ fileName: "", fileUrl: "", fileType: "PDF", folder: "Catalogs" })}
            style={{ padding: "0.7rem 1.4rem", background: "#eab308", color: "#000", border: "none", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}
          >
            + Add Media Asset
          </button>
        </div>

        {editing && (
          <form onSubmit={handleSave} style={{ background: "#141418", padding: "2rem", borderRadius: "10px", border: "1px solid #333", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.2rem" }}>Add Media Asset</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>File Name *</label>
                <input
                  type="text"
                  required
                  value={editing.fileName || ""}
                  onChange={(e) => setEditing({ ...editing, fileName: e.target.value })}
                  style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>File URL / Path *</label>
                <input
                  type="text"
                  required
                  value={editing.fileUrl || ""}
                  onChange={(e) => setEditing({ ...editing, fileUrl: e.target.value })}
                  placeholder="/catalogues/Slashform/Slashform_2025.pdf"
                  style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <button type="submit" style={{ padding: "0.7rem 1.5rem", background: "#eab308", color: "#000", border: "none", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}>
                Save Asset
              </button>
              <button type="button" onClick={() => setEditing(null)} style={{ padding: "0.7rem 1.5rem", background: "#333", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {media.map((m) => (
            <div key={m.id} style={{ background: "#141418", border: "1px solid #222", borderRadius: "10px", padding: "1.5rem" }}>
              <span style={{ fontSize: "0.75rem", background: "#eab308", color: "#000", padding: "0.2rem 0.6rem", borderRadius: "4px", fontWeight: 800 }}>{m.fileType}</span>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0.6rem 0" }}>{m.fileName}</h3>
              <p style={{ color: "#888", fontSize: "0.85rem", wordBreak: "break-all", marginBottom: "1rem" }}>{m.fileUrl}</p>
              <div style={{ display: "flex", gap: "0.8rem" }}>
                <a href={m.fileUrl} target="_blank" style={{ padding: "0.4rem 0.9rem", background: "#333", color: "#fff", borderRadius: "4px", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600 }}>
                  View Asset
                </a>
                <button onClick={() => handleDelete(m.id)} style={{ padding: "0.4rem 0.9rem", background: "rgba(239,68,68,0.2)", color: "#f87171", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
