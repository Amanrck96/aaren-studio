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

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/media?t=" + Date.now());
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) setMedia(json.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.fileName || !editing?.fileUrl) return alert("File Name and URL are required.");

    try {
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
    } catch (err) {
      console.error(err);
      alert("Failed to save media");
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      let finalUrl = "";
      let fileName = file.name;
      let kbSize = (file.size / 1024).toFixed(1) + " KB";
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      let fileType: "PDF" | "Image" | "Video" | "Document" = "Document";
      if (["jpg", "jpeg", "png", "webp", "gif", "svg", "avif"].includes(ext)) fileType = "Image";
      else if (ext === "pdf") fileType = "PDF";
      else if (["mp4", "webm", "mov", "mkv"].includes(ext)) fileType = "Video";

      // 1. Try direct upload to Google Firebase Storage
      try {
        const fbResult = await uploadFileToFirebase(file, "media_library");
        if (fbResult && fbResult.url) {
          finalUrl = fbResult.url;
        }
      } catch (fbErr) {
        console.warn("Firebase Storage direct upload fallback to API:", fbErr);
      }

      // 2. Fallback to /api/upload if Firebase Storage direct failed
      if (!finalUrl) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", fileType);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const json = await res.json();
        if (json.success) {
          finalUrl = json.url;
        } else {
          throw new Error(json.error || "Upload failed");
        }
      }

      // 3. Register asset in Central Media Store
      await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName,
          fileUrl: finalUrl,
          fileType,
          folder: "Firebase Storage",
          size: kbSize,
        }),
      });

      alert("✅ File uploaded successfully to " + finalUrl);
      fetchMedia();
    } catch (err: any) {
      alert("❌ Upload error: " + (err.message || err));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media asset?")) return;
    try {
      await fetch(`/api/media?id=${id}`, { method: "DELETE" });
      fetchMedia();
    } catch (err) {
      console.error(err);
      alert("Failed to delete media");
    }
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
    <div style={{ background: "#FAF8F5", color: "#1E1E1E", minHeight: "100vh" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem", background: "#FAF8F5" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem", borderBottom: "1px solid #DCD5C6", paddingBottom: "1.2rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <h1 style={{ fontSize: "2.2rem", fontWeight: 900, color: "#1E1E1E", margin: 0 }}>📁 Central Media Library</h1>
              <span style={{ padding: "0.25rem 0.65rem", background: "rgba(129, 102, 63, 0.12)", color: "#81663F", border: "1px solid rgba(129, 102, 63, 0.25)", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 800 }}>
                {media.length} Assets Live
              </span>
            </div>
            <p style={{ color: "#555555", fontSize: "0.95rem", marginTop: "0.4rem" }}>
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
                padding: "0.75rem 1.4rem",
                background: "#1E1E1E",
                color: "#ffffff",
                borderRadius: "8px",
                fontWeight: 800,
                cursor: "pointer",
                fontSize: "0.9rem",
                boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
              }}
            >
              {uploading ? "Uploading..." : "💻 Upload File From Computer"}
            </label>
            <button
              onClick={() => setEditing({ fileName: "", fileUrl: "", fileType: "PDF", folder: "Catalogs" })}
              style={{ padding: "0.75rem 1.4rem", background: "#81663F", color: "#FFFFFF", border: "none", borderRadius: "8px", fontWeight: 800, cursor: "pointer", fontSize: "0.9rem", boxShadow: "0 4px 14px rgba(129,102,63,0.2)" }}
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
            style={{ flex: 1, padding: "0.75rem 1rem", background: "#FFFFFF", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px", fontSize: "0.95rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}
          />

          <div style={{ display: "flex", gap: "0.5rem" }}>
            {["All", "PDF", "Video", "Image"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                style={{
                  padding: "0.75rem 1.2rem",
                  background: selectedType === type ? "#81663F" : "#FFFFFF",
                  color: selectedType === type ? "#FFFFFF" : "#1E1E1E",
                  border: `1px solid ${selectedType === type ? "#81663F" : "#D5CEBF"}`,
                  borderRadius: "8px",
                  fontWeight: 800,
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                }}
              >
                {type === "All" ? "All Assets" : type === "PDF" ? "📄 PDF Catalogues" : type === "Video" ? "🎥 Videos" : "🖼️ Images"}
              </button>
            ))}
          </div>
        </div>

        {editing && (
          <form onSubmit={handleSave} style={{ background: "#FFFFFF", padding: "2rem", borderRadius: "16px", border: "1px solid #E2DCD2", marginBottom: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#81663F", marginBottom: "1.2rem" }}>Add Media Asset</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", marginBottom: "0.4rem", fontWeight: 700 }}>File Name *</label>
                <input
                  type="text"
                  required
                  value={editing.fileName || ""}
                  onChange={(e) => setEditing({ ...editing, fileName: e.target.value })}
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", marginBottom: "0.4rem", fontWeight: 700 }}>File URL / Path *</label>
                <input
                  type="text"
                  required
                  value={editing.fileUrl || ""}
                  onChange={(e) => setEditing({ ...editing, fileUrl: e.target.value })}
                  placeholder="/catalogues/Slashform/Slashform_2025.pdf"
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <button type="submit" style={{ padding: "0.75rem 1.6rem", background: "#1E1E1E", color: "#FFFFFF", border: "none", borderRadius: "8px", fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 14px rgba(0,0,0,0.12)" }}>
                Save Asset
              </button>
              <button type="button" onClick={() => setEditing(null)} style={{ padding: "0.75rem 1.6rem", background: "#FAF8F5", color: "#1E1E1E", border: "1px solid #D5CEBF", borderRadius: "8px", cursor: "pointer", fontWeight: 700 }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div style={{ padding: "4rem", textAlign: "center", color: "#6A6359" }}>Loading central media assets...</div>
        ) : filteredMedia.length === 0 ? (
          <div style={{ padding: "4rem", textAlign: "center", color: "#6A6359", background: "#FFFFFF", borderRadius: "14px", border: "1px solid #E2DCD2" }}>
            No media assets found matching current search.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {filteredMedia.map((m) => (
              <div key={m.id} style={{ background: "#FFFFFF", border: "1px solid #E2DCD2", borderRadius: "16px", padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                    <span style={{ fontSize: "0.75rem", background: "rgba(129, 102, 63, 0.12)", color: "#81663F", border: "1px solid rgba(129, 102, 63, 0.25)", padding: "0.25rem 0.65rem", borderRadius: "6px", fontWeight: 800 }}>
                      {m.fileType}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "#6A6359", background: "#FAF8F5", border: "1px solid #D5CEBF", padding: "0.2rem 0.5rem", borderRadius: "6px", fontWeight: 600 }}>
                      {m.folder}
                    </span>
                  </div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 800, margin: "0.4rem 0", color: "#1E1E1E", lineHeight: 1.4 }}>{m.fileName}</h3>
                  <p style={{ color: "#81663F", fontSize: "0.8rem", wordBreak: "break-all", marginBottom: "1rem", lineHeight: 1.3, fontWeight: 600 }}>{m.fileUrl}</p>
                </div>
                <div style={{ display: "flex", gap: "0.8rem", borderTop: "1px solid #EAE4D8", paddingTop: "0.8rem" }}>
                  <a href={m.fileUrl} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: "0.5rem 0.8rem", background: "#1E1E1E", color: "#FFFFFF", border: "none", borderRadius: "6px", textDecoration: "none", fontSize: "0.8rem", fontWeight: 700, textAlign: "center" }}>
                    🔗 Open Asset ↗
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(m.fileUrl);
                      alert("Copied URL to clipboard!");
                    }}
                    style={{ padding: "0.5rem 0.8rem", background: "#F4EFE6", color: "#1E1E1E", border: "1px solid #D5CEBF", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 700 }}
                  >
                    📋 Copy
                  </button>
                  <button onClick={() => handleDelete(m.id)} style={{ padding: "0.5rem 0.8rem", background: "#FEE2E2", color: "#DC2626", border: "1px solid #FCA5A5", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 700 }}>
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
