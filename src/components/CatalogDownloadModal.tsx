"use client";

import { useState } from "react";
import { PdfCatalogItem } from "@/lib/types";
import OnScreenPdfViewer from "./OnScreenPdfViewer";

interface Props {
  catalog: PdfCatalogItem | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function getPdfCoverThumbnail(url?: string, title?: string): string {
  const combined = `${url || ""} ${title || ""}`.toLowerCase();
  if (combined.includes("aquarelle")) return "/catalogs/thumbnails/aquarelle_thumb.jpg";
  if (combined.includes("bits")) return "/catalogs/thumbnails/bits_thumb.jpg";
  if (combined.includes("nouvelle") || combined.includes("nouveau")) return "/catalogs/thumbnails/catalogo-nouvelle_thumb.jpg";
  if (combined.includes("sabil")) return "/catalogs/thumbnails/catalogo-sabil_thumb.jpg";
  if (combined.includes("terre")) return "/catalogs/thumbnails/catalogo-terre_thumb.jpg";
  if (combined.includes("vestige")) return "/catalogs/thumbnails/catalogo-vestige_thumb.jpg";
  if (combined.includes("60 degree") || combined.includes("60grados") || combined.includes("60 grados")) return "/catalogs/thumbnails/catalogo60grados_thumb.jpg";
  if (combined.includes("materia") || combined.includes("prima") || combined.includes("inkiostro")) return "/catalogs/thumbnails/catalogo_materiaprima_2026_2a_thumb.jpg";
  if (combined.includes("bejmat")) return "/catalogs/thumbnails/catalogobejmat_thumb.jpg";
  if (combined.includes("clay") || combined.includes("elysian") || combined.includes("mirage")) return "/catalogs/thumbnails/catalogue-clay-pdf_thumb.jpg";
  if (combined.includes("arpa") || combined.includes("vis") || combined.includes("fenix") || combined.includes("formica")) return "/catalogs/thumbnails/arpa-vis-brochure_250122_thumb.jpg";
  
  const driveMatch = (url || "").match(/\/d\/([a-zA-Z0-9_-]+)/) || (url || "").match(/id=([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w800`;
  }
  return "/catalogs/thumbnails/aquarelle_thumb.jpg";
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

  const thumbUrl = catalog.thumbnailUrl || getPdfCoverThumbnail(catalog.fileUrl, catalog.title);
  const pdfUrl = catalog.fileUrl || `/catalogs/${catalog.fileName}`;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.88)",
        backdropFilter: "blur(10px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: unlocked ? "0.8rem" : "1.5rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: unlocked ? "#0F1117" : "#FFFFFF",
          borderRadius: "16px",
          maxWidth: unlocked ? "1280px" : "680px",
          width: "100%",
          height: unlocked ? "94vh" : "auto",
          maxHeight: "96vh",
          overflow: "hidden",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.4)",
          display: unlocked ? "flex" : "grid",
          flexDirection: unlocked ? "column" : undefined,
          gridTemplateColumns: unlocked ? undefined : "240px 1fr",
          border: "1px solid #E8E3D7",
          position: "relative",
          padding: unlocked ? "0" : 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {!unlocked ? (
          /* Mandatory Enquiry Form with Page 1 Cover Preview */
          <>
            {/* Close Button */}
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
                  background: "#181920",
                }}
              >
                <img
                  src={thumbUrl}
                  alt={catalog.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/catalogs/thumbnails/aquarelle_thumb.jpg";
                  }}
                />
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
                  PAGE 1 COVER
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
                    {loading ? "Unlocking Preview..." : "Unlock Full Catalogue On-Screen Preview 📖"}
                  </button>
                </form>
              </div>

              <div style={{ marginTop: "1rem", borderTop: "1px solid #E8E3D7", paddingTop: "0.8rem", fontSize: "0.72rem", color: "#8A8279", textAlign: "center" }}>
                Aaren Intpro Official Protected Architectural Catalogue Portal.
              </div>
            </div>
          </>
        ) : (
          /* Unlocked On-Screen Canvas Preview Player (All Pages Scrollable, Zero Downloads) */
          <OnScreenPdfViewer
            pdfUrl={pdfUrl}
            title={`${catalog.title} — ${catalog.brand}`}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}
