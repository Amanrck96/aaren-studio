"use client";

import { useState } from "react";
import { PdfCatalogItem } from "@/lib/types";

interface Props {
  catalog: PdfCatalogItem | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function getProtectedPdfViewerUrl(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  const driveMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/id=([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  }
  if (trimmed.startsWith("/") || trimmed.startsWith("http")) {
    const cleanUrl = trimmed.split("#")[0];
    return `${cleanUrl}#toolbar=0&navpanes=0&scrollbar=1&page=1`;
  }
  return `/catalogs/${trimmed}#toolbar=0&navpanes=0&scrollbar=1&page=1`;
}

export default function CatalogDownloadModal({ catalog, onClose, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profession, setProfession] = useState("Architect / Interior Designer");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

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
        if (onSuccess) onSuccess();
      } else {
        alert("Submission failed: " + data.error);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  const viewerUrl = getProtectedPdfViewerUrl(catalog.fileUrl || `/catalogs/${catalog.fileName}`);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(10px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: unlocked ? "1rem" : "1.5rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          maxWidth: unlocked ? "1200px" : "680px",
          width: "100%",
          height: unlocked ? "92vh" : "auto",
          maxHeight: "94vh",
          overflow: "hidden",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.35)",
          display: unlocked ? "flex" : "grid",
          flexDirection: unlocked ? "column" : undefined,
          gridTemplateColumns: unlocked ? undefined : "240px 1fr",
          border: "1px solid #E8E3D7",
          position: "relative",
          padding: unlocked ? "1.5rem" : 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "rgba(0, 0, 0, 0.06)",
            border: "none",
            fontSize: "1.2rem",
            cursor: "pointer",
            color: "#666",
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 30,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#EF4444";
            e.currentTarget.style.color = "#FFFFFF";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(0, 0, 0, 0.06)";
            e.currentTarget.style.color = "#666";
          }}
        >
          ×
        </button>

        {unlocked ? (
          /* Unlocked On-Screen Protected Preview Player */
          <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", borderBottom: "1px solid #E8E3D7", paddingBottom: "0.8rem", flexWrap: "wrap", gap: "0.8rem" }}>
              <div>
                <span style={{ fontSize: "0.75rem", background: "rgba(200, 169, 110, 0.2)", color: "#81663F", border: "1px solid rgba(200, 169, 110, 0.4)", padding: "0.2rem 0.6rem", borderRadius: "4px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  ✓ On-Screen View-Only Access
                </span>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, margin: "0.3rem 0 0 0", color: "#81663F" }}>
                  {catalog.title} — {catalog.brand}
                </h3>
              </div>

              <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", marginRight: "45px" }}>
                <span style={{ fontSize: "0.78rem", color: "#8A8279", fontWeight: 600 }}>
                  🔒 Protected Digital Preview (Page 1)
                </span>
                <button
                  onClick={onClose}
                  style={{
                    background: "#81663F",
                    color: "#FFFFFF",
                    border: "none",
                    padding: "0.5rem 1.2rem",
                    borderRadius: "6px",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  Done
                </button>
              </div>
            </div>

            {/* Embedded View-Only PDF Viewer Starting from Page 1 */}
            <div
              onContextMenu={(e) => e.preventDefault()}
              style={{ flex: 1, minHeight: "68vh", background: "#0F172A", borderRadius: "8px", overflow: "hidden", border: "1px solid #E8E3D7", position: "relative" }}
            >
              <iframe
                title={`${catalog.title} View-Only PDF Catalogue`}
                src={viewerUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "68vh" }}
                allowFullScreen={true}
              />
            </div>
          </div>
        ) : (
          /* Gated Enquiry & 1st Page Cover View */
          <>
            {/* Left Thumbnail & Info Bar */}
            <div
              style={{
                background: "#FAF9F6",
                borderRight: "1px solid #E8E3D7",
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
                  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                  marginBottom: "1rem",
                  border: "1px solid #D8D0BE",
                  background: "#FFFFFF",
                }}
              >
                {catalog.thumbnailUrl ? (
                  <img
                    src={catalog.thumbnailUrl}
                    alt={catalog.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>
                    📖
                  </div>
                )}
                <div
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    background: "rgba(0,0,0,0.75)",
                    color: "#D4B67D",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    letterSpacing: "0.05em",
                  }}
                >
                  PAGE 1 PREVIEW
                </div>
              </div>

              <div style={{ fontSize: "0.72rem", color: "#8A8279", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
                BRAND &amp; CATEGORY
              </div>
              <div style={{ color: "#81663F", fontWeight: 800, fontSize: "0.95rem", marginTop: "2px" }}>{catalog.brand}</div>
              <div style={{ color: "#5E5852", fontSize: "0.8rem", marginTop: "2px", fontWeight: 600 }}>{catalog.category}</div>

              <div style={{ marginTop: "1rem", display: "flex", gap: "0.6rem", fontSize: "0.75rem", color: "#8A8279" }}>
                <span>📄 {catalog.pageCount} Pages</span>
                <span>•</span>
                <span>💾 {catalog.fileSize}</span>
              </div>
            </div>

            {/* Right Form Column */}
            <div style={{ padding: "2rem 2.2rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#81663F", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    LUXURY ARCHITECTURAL CATALOGUE
                  </span>
                </div>

                <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#81663F", margin: "0 0 0.4rem 0", lineHeight: 1.3 }}>
                  {catalog.title}
                </h2>
                <p style={{ color: "#5E5852", fontSize: "0.85rem", lineHeight: 1.4, margin: "0 0 1.2rem 0" }}>
                  {catalog.description}
                </p>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#5E5852", marginBottom: "4px" }}>
                      Full Name <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.8rem",
                        borderRadius: "6px",
                        border: "1px solid #D8D0BE",
                        fontSize: "0.88rem",
                        color: "#1C1917",
                        background: "#FAF9F6",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#5E5852", marginBottom: "4px" }}>
                        Work Email <span style={{ color: "#EF4444" }}>*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="rahul@studio.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.65rem 0.8rem",
                          borderRadius: "6px",
                          border: "1px solid #D8D0BE",
                          fontSize: "0.88rem",
                          color: "#1C1917",
                          background: "#FAF9F6",
                          outline: "none",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#5E5852", marginBottom: "4px" }}>
                        Phone Number <span style={{ color: "#EF4444" }}>*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98800 12345"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.65rem 0.8rem",
                          borderRadius: "6px",
                          border: "1px solid #D8D0BE",
                          fontSize: "0.88rem",
                          color: "#1C1917",
                          background: "#FAF9F6",
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#5E5852", marginBottom: "4px" }}>
                        Profession / Role
                      </label>
                      <select
                        value={profession}
                        onChange={(e) => setProfession(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.65rem 0.8rem",
                          borderRadius: "6px",
                          border: "1px solid #D8D0BE",
                          fontSize: "0.85rem",
                          color: "#1C1917",
                          background: "#FAF9F6",
                          outline: "none",
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
                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#5E5852", marginBottom: "4px" }}>
                        City / Location
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Bangalore"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.65rem 0.8rem",
                          borderRadius: "6px",
                          border: "1px solid #D8D0BE",
                          fontSize: "0.88rem",
                          color: "#1C1917",
                          background: "#FAF9F6",
                          outline: "none",
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
                      background: "linear-gradient(135deg, #D4B67D 0%, #C8A96E 40%, #B38E46 100%)",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: 800,
                      fontSize: "0.95rem",
                      cursor: loading ? "wait" : "pointer",
                      boxShadow: "0 6px 20px rgba(184, 147, 85, 0.35)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {loading ? "Unlocking Preview..." : "View Catalogue On-Screen"}
                  </button>
                </form>
              </div>

              <div style={{ marginTop: "1rem", borderTop: "1px solid #E8E3D7", paddingTop: "0.8rem", fontSize: "0.72rem", color: "#8A8279", textAlign: "center" }}>
                Aaren Intpro Official Protected Architectural Catalogue Portal.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
