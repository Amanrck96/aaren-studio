"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/AdminNav";
import { MediaAsset } from "@/lib/types";
import { uploadFileToFirebase } from "@/lib/firebaseStorage";

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<MediaAsset> | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [uploading, setUploading] = useState(false);

  const fetchMedia = () => {
    setLoading(true);
    fetch("/api/media?t=" + Date.now())
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) setMedia(json.data);
      })
      .finally(() => setLoading(false));
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
      alert("✅ Media Asset added to Central Library!");
      setEditing(null);
      fetchMedia();
    } else alert("Error: " + json.error);
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadFileToFirebase(file);
      if (res && res.url) {
        const type = file.type.includes("pdf") ? "PDF" : file.type.includes("video") ? "Video" : "Image";
        await fetch("/api/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            fileUrl: res.url,
            fileType: type,
            folder: "Uploaded Files",
            size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          }),
        });
        alert("✅ File uploaded & saved to Central Media Library!");
        fetchMedia();
      }
    } catch (err: any) {
      alert("❌ Upload failed: " + (err.message || err));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media asset?")) return;
    await fetch(`/api/media?id=${id}`, { method: "DELETE" });
    fetchMedia();
  };

  const filteredMedia = media.filter((m) => {
    const matchesType =
      selectedType === "All" ||
      (selectedType === "PDF" && m.fileType === "PDF") ||
      (selectedType === "Video" && m.fileType === "Video") ||
      (selectedType === "Image" && m.fileType === "Image");

    const qLower = searchQuery.toLowerCase();
    const matchesQuery =
      !searchQuery ||
      m.fileName.toLowerCase().includes(qLower) ||
      (m.folder && m.folder.toLowerCase().includes(qLower)) ||
      m.fileUrl.toLowerCase().includes(qLower);

    return matchesType && matchesQuery;
  });

  return (
    <div style={{ background: "#0a0a0c", color: "#f0f0f2", minHeight: "100vh" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>📁 Central Media Library</h1>
              <span style={{ padding: "0.25rem 0.65rem", background: "#eab30822", color: "#eab308", border: "1px solid #eab30844", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 700 }}>
                {media.length} Assets Live
              </span>
            </div>
            <p style={{ color: "#aaa", fontSize: "0.9rem", marginTop: "0.4rem" }}>
              Central repository of all PDF brochures, MP4 videos, images, brand catalogs & site documents.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.8rem" }}>
            <input
              type="file"
              id="centralMediaUpload"
              style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) handleFileUpload(e.target.files[0]);
              }}
            />
            <label
              htmlFor="centralMediaUpload"
              style={{
                padding: "0.7rem 1.4rem",
                background: "#2563eb",
                color: "#ffffff",
                borderRadius: "6px",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              {uploading ? "Uploading..." : "💻 Upload File From Computer"}
            </label>
            <button
              onClick={() => setEditing({ fileName: "", fileUrl: "", fileType: "PDF", folder: "Catalogs" })}
              style={{ padding: "0.7rem 1.4rem", background: "#eab308", color: "#000", border: "none", borderRadius: "6px", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}
            >
              + Add URL Asset
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.8rem", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Search documents, PDFs, videos, or brand catalogs by name or folder..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, padding: "0.75rem 1rem", background: "#141418", border: "1px solid #333", color: "#fff", borderRadius: "6px", fontSize: "0.9rem" }}
          />

          <div style={{ display: "flex", gap: "0.5rem" }}>
            {["All", "PDF", "Video", "Image"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                style={{
                  padding: "0.75rem 1.2rem",
                  background: selectedType === type ? "#eab308" : "#141418",
                  color: selectedType === type ? "#000" : "#aaa",
                  border: `1px solid ${selectedType === type ? "#eab308" : "#333"}`,
                  borderRadius: "6px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                {type === "All" ? "All Assets" : type === "PDF" ? "📄 PDF Catalogues" : type === "Video" ? "🎥 Videos" : "🖼️ Images"}
              </button>
            ))}
          </div>
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

        {loading ? (
          <div style={{ padding: "4rem", textAlign: "center", color: "#888" }}>Loading central media assets...</div>
        ) : filteredMedia.length === 0 ? (
          <div style={{ padding: "4rem", textAlign: "center", color: "#888", background: "#141418", borderRadius: "8px", border: "1px solid #222" }}>
            No media assets found matching current search.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {filteredMedia.map((m) => (
              <div key={m.id} style={{ background: "#141418", border: "1px solid #222", borderRadius: "10px", padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                    <span style={{ fontSize: "0.75rem", background: m.fileType === "PDF" ? "#3b82f6" : m.fileType === "Video" ? "#ec4899" : "#eab308", color: "#fff", padding: "0.25rem 0.65rem", borderRadius: "4px", fontWeight: 800 }}>
                      {m.fileType}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "#888", background: "#222", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                      {m.folder}
                    </span>
                  </div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "0.4rem 0", color: "#fff", lineHeight: 1.4 }}>{m.fileName}</h3>
                  <p style={{ color: "#888", fontSize: "0.8rem", wordBreak: "break-all", marginBottom: "1rem", lineHeight: 1.3 }}>{m.fileUrl}</p>
                </div>
                <div style={{ display: "flex", gap: "0.8rem", borderTop: "1px solid #222", paddingTop: "0.8rem" }}>
                  <a href={m.fileUrl} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: "0.4rem 0.8rem", background: "#222", color: "#fff", border: "1px solid #333", borderRadius: "4px", textDecoration: "none", fontSize: "0.8rem", fontWeight: 600, textAlign: "center" }}>
                    🔗 Open Asset ↗
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(m.fileUrl);
                      alert("Copied URL to clipboard!");
                    }}
                    style={{ padding: "0.4rem 0.8rem", background: "#1e293b", color: "#94a3b8", border: "1px solid #334155", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem" }}
                  >
                    📋 Copy
                  </button>
                  <button onClick={() => handleDelete(m.id)} style={{ padding: "0.4rem 0.8rem", background: "rgba(239,68,68,0.2)", color: "#f87171", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem" }}>
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
