"use client";

import { useState } from "react";
import { PdfCatalogItem } from "@/lib/types";

interface Props {
  catalog: PdfCatalogItem | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CatalogDownloadModal({ catalog, onClose, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profession, setProfession] = useState("Architect / Interior Designer");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");

  if (!catalog) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!catalog) return;

    if (!name.trim() || !email.trim() || !phone.trim()) {
      alert("Please fill in your Name, Email, and Phone number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/catalogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          profession,
          city: city.trim(),
          catalogId: catalog.id,
          catalogTitle: catalog.title,
          fileName: catalog.fileName,
          fileUrl: catalog.fileUrl,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setUnlocked(true);
        setDownloadUrl(data.fileUrl || catalog.fileUrl);

        if (onSuccess) onSuccess();
      } else {
        alert("Form submission failed: " + data.error);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          maxWidth: "680px",
          width: "100%",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
          display: "grid",
          gridTemplateColumns: "240px 1fr",
          border: "1px solid #e2e8f0",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Thumbnail & Info Bar */}
        <div
          style={{
            background: "#0f172a",
            color: "#ffffff",
            padding: "1.8rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "3/4",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
              marginBottom: "1rem",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            {/* Cover Thumbnail Image rendered from 1st page of PDF */}
            <img
              src={catalog.thumbnailUrl}
              alt={catalog.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => {
                // Fallback to placeholder if thumbnail is missing
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                background: "rgba(0,0,0,0.7)",
                color: "#d4af37",
                padding: "2px 8px",
                borderRadius: "12px",
                fontSize: "0.7rem",
                fontWeight: 800,
              }}
            >
              OFFICIAL CATALOG
            </div>
          </div>

          <div style={{ fontSize: "0.75rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
            BRAND & CATEGORY
          </div>
          <div style={{ color: "#d4af37", fontWeight: 800, fontSize: "0.95rem", marginTop: "2px" }}>{catalog.brand}</div>
          <div style={{ color: "#e2e8f0", fontSize: "0.8rem", marginTop: "2px", fontWeight: 600 }}>{catalog.category}</div>

          <div style={{ marginTop: "1rem", display: "flex", gap: "0.6rem", fontSize: "0.75rem", color: "#94a3b8" }}>
            <span>📄 {catalog.pageCount} Pages</span>
            <span>•</span>
            <span>💾 {catalog.fileSize}</span>
          </div>
        </div>

        {/* Right Form Column */}
        <div style={{ padding: "2rem 2.2rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#8c764b", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                LUXURY ARCHITECTURAL CATALOG
              </span>
              <button
                onClick={onClose}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "1.4rem",
                  cursor: "pointer",
                  color: "#64748b",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.4rem 0", lineHeight: 1.3 }}>
              {catalog.title}
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.85rem", lineHeight: 1.4, margin: "0 0 1.2rem 0" }}>
              {catalog.description}
            </p>

            {unlocked ? (
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #cbd5e1",
                  borderRadius: "10px",
                  padding: "1.2rem",
                  textAlign: "center",
                  margin: "0.8rem 0",
                }}
              >
                <div style={{ fontSize: "1.8rem", marginBottom: "0.2rem" }}>📖</div>
                <h3 style={{ color: "#0f172a", margin: "0 0 0.2rem 0", fontSize: "1.05rem", fontWeight: 800 }}>Catalog Unlocked!</h3>
                <p style={{ color: "#64748b", fontSize: "0.8rem", margin: "0 0 0.8rem 0" }}>
                  Digital view-only access activated. Explore the catalogue pages below:
                </p>

                <div style={{ width: "100%", height: "340px", background: "#000", borderRadius: "8px", overflow: "hidden", marginBottom: "0.8rem" }}>
                  <iframe
                    src={
                      downloadUrl.includes("/d/") || downloadUrl.includes("id=")
                        ? `https://drive.google.com/file/d/${(downloadUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || downloadUrl.match(/id=([a-zA-Z0-9_-]+)/))?.[1]}/preview`
                        : (downloadUrl.startsWith("http")
                            ? `https://docs.google.com/viewer?url=${encodeURIComponent(downloadUrl)}&embedded=true`
                            : (typeof window !== "undefined"
                                ? `https://docs.google.com/viewer?url=${encodeURIComponent(window.location.origin + (downloadUrl.startsWith("/") ? downloadUrl : `/${downloadUrl}`))}&embedded=true`
                                : downloadUrl))
                    }
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                  />
                </div>

                <a
                  href={
                    downloadUrl.startsWith("http")
                      ? `https://docs.google.com/viewer?url=${encodeURIComponent(downloadUrl)}`
                      : (typeof window !== "undefined"
                          ? `https://docs.google.com/viewer?url=${encodeURIComponent(window.location.origin + (downloadUrl.startsWith("/") ? downloadUrl : `/${downloadUrl}`))}`
                          : downloadUrl)
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    background: "#0f172a",
                    color: "#ffffff",
                    padding: "0.6rem 1.2rem",
                    borderRadius: "6px",
                    fontWeight: 700,
                    textDecoration: "none",
                    fontSize: "0.85rem",
                  }}
                >
                  👁️ Open Fullscreen Reader ↗
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Full Name <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.8rem",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.88rem",
                      color: "#0f172a",
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                      Work Email <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="rahul@studio.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.6rem 0.8rem",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.88rem",
                        color: "#0f172a",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                      Phone Number <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98800 12345"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.6rem 0.8rem",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.88rem",
                        color: "#0f172a",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                      Profession / Role
                    </label>
                    <select
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.6rem 0.8rem",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.85rem",
                        color: "#0f172a",
                        background: "#ffffff",
                      }}
                    >
                      <option value="Architect / Interior Designer">Architect / Interior Designer</option>
                      <option value="Builder / Developer">Builder / Developer</option>
                      <option value="Contractor / Consultant">Contractor / Consultant</option>
                      <option value="Homeowner / Private Client">Homeowner / Private Client</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                      City / Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bangalore"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.6rem 0.8rem",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.88rem",
                        color: "#0f172a",
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    marginTop: "0.5rem",
                    width: "100%",
                    padding: "0.85rem",
                    background: "#8c764b",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    cursor: loading ? "wait" : "pointer",
                    boxShadow: "0 4px 12px rgba(140, 118, 75, 0.3)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {loading ? "Loading Catalog..." : "View Catalogue On-Screen"}
                </button>
              </form>
            )}
          </div>

          <div style={{ marginTop: "1rem", borderTop: "1px solid #f1f5f9", paddingTop: "0.8rem", fontSize: "0.72rem", color: "#94a3b8", textAlign: "center" }}>
            Instant PDF access granted upon form submission. Zero spam guarantee.
          </div>
        </div>
      </div>
    </div>
  );
}
