"use client";

import { useState, useEffect } from "react";

type Props = {
  catalogPdfUrl: string;
  itemTitle: string; // Product Name or Brand Name
  onClose: () => void;
};

export function getPdfCoverThumbnail(url: string, title?: string): string {
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

export function getProtectedPdfViewerUrl(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  const driveMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/id=([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  }
  if (trimmed.startsWith("/") || trimmed.startsWith("http")) {
    const cleanUrl = trimmed.split("#")[0];
    return `${cleanUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`;
  }
  return `/catalogs/${trimmed}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`;
}

export default function CatalogPdfGateModal({ catalogPdfUrl, itemTitle, onClose }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profession: "Architect",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [settings, setSettings] = useState({
    badgeText: "OFFICIAL ARCHITECTURAL CATALOGUE",
    buttonText: "Unlock Full Catalogue On-Screen Preview 📖",
    modalTitle: `${itemTitle} — Official Catalogue`,
    modalSubtext: "Please fill in your details below to unlock on-screen digital preview access for all pages of this official architectural specification PDF.",
  });

  useEffect(() => {
    // ENQUIRY FORM ALWAYS APPEARS FIRST
    fetch("/api/catalog-settings")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setSettings((prev) => ({
            ...prev,
            badgeText: json.data.badgeText ? `📋 ${json.data.badgeText}` : prev.badgeText,
            buttonText: json.data.buttonText || prev.buttonText,
            modalTitle: json.data.modalTitle ? `${json.data.modalTitle} - ${itemTitle}` : prev.modalTitle,
            modalSubtext: json.data.modalSubtext || prev.modalSubtext,
          }));
        }
      })
      .catch(() => {});
  }, [itemTitle]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      alert("Please fill in your Name, Email, and Phone number.");
      return;
    }

    setSubmitting(true);

    try {
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          profession: formData.profession,
          message: formData.message.trim(),
          type: "Catalog Enquiry",
          productOrBrand: itemTitle,
          subject: `Catalog Enquiry for ${itemTitle}`,
        }),
      });

      setUnlocked(true);
    } catch (e) {
      console.error("Enquiry submission error:", e);
      setUnlocked(true);
    } finally {
      setSubmitting(false);
    }
  }

  const coverThumb = getPdfCoverThumbnail(catalogPdfUrl, itemTitle);
  const viewerUrl = getProtectedPdfViewerUrl(catalogPdfUrl);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
        padding: unlocked ? "1rem" : "1.2rem",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8E3D7",
          borderRadius: "16px",
          width: "100%",
          maxWidth: unlocked ? "1200px" : "540px",
          height: unlocked ? "92vh" : "auto",
          maxHeight: "94vh",
          overflowY: unlocked ? "hidden" : "auto",
          padding: unlocked ? "1.5rem" : "2.2rem",
          color: "#1C1917",
          position: "relative",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.35)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "rgba(0, 0, 0, 0.06)",
            border: "none",
            color: "#666",
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            fontSize: "1.2rem",
            cursor: "pointer",
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
          ✕
        </button>

        {!unlocked ? (
          /* ── STEP 1: MANDATORY ENQUIRY FORM WITH PAGE 1 COVER THUMBNAIL ── */
          <>
            {/* Page 1 Cover Preview Header */}
            <div
              style={{
                display: "flex",
                gap: "1.2rem",
                alignItems: "center",
                background: "#FAF9F6",
                border: "1px solid #E8E3D7",
                padding: "1rem",
                borderRadius: "12px",
                marginBottom: "1.4rem",
              }}
            >
              <div
                style={{
                  width: "72px",
                  height: "96px",
                  borderRadius: "6px",
                  overflow: "hidden",
                  border: "1px solid #D8D0BE",
                  flexShrink: 0,
                  position: "relative",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  background: "#181920",
                }}
              >
                <img
                  src={coverThumb}
                  alt={`${itemTitle} Page 1 Cover`}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = "none";
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "2px",
                    left: "2px",
                    right: "2px",
                    background: "rgba(0,0,0,0.8)",
                    color: "#D4B67D",
                    fontSize: "0.55rem",
                    fontWeight: 900,
                    textAlign: "center",
                    padding: "1px 0",
                    borderRadius: "2px",
                    textTransform: "uppercase",
                  }}
                >
                  PAGE 1 COVER
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    color: "#81663F",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    fontWeight: 800,
                    marginBottom: "0.2rem",
                  }}
                >
                  📋 OFFICIAL ARCHITECTURAL CATALOGUE
                </div>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    lineHeight: 1.25,
                    margin: "0 0 0.3rem 0",
                    color: "#81663F",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {itemTitle}
                </h3>
                <p style={{ color: "#5E5852", fontSize: "0.82rem", margin: 0, lineHeight: 1.4 }}>
                  Fill details below to unlock on-screen full catalogue preview.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "#5E5852", fontWeight: 700, marginBottom: "0.3rem" }}>
                  Full Name <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Architect Rajesh Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.7rem 0.9rem",
                    background: "#FAF9F6",
                    border: "1px solid #D8D0BE",
                    color: "#1C1917",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", color: "#5E5852", fontWeight: 700, marginBottom: "0.3rem" }}>
                    Work Email <span style={{ color: "#EF4444" }}>*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="rajesh@studio.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.7rem 0.9rem",
                      background: "#FAF9F6",
                      border: "1px solid #D8D0BE",
                      color: "#1C1917",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", color: "#5E5852", fontWeight: 700, marginBottom: "0.3rem" }}>
                    Phone Number <span style={{ color: "#EF4444" }}>*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.7rem 0.9rem",
                      background: "#FAF9F6",
                      border: "1px solid #D8D0BE",
                      color: "#1C1917",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "#5E5852", fontWeight: 700, marginBottom: "0.3rem" }}>
                  Profession / Role
                </label>
                <select
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.7rem 0.9rem",
                    background: "#FAF9F6",
                    border: "1px solid #D8D0BE",
                    color: "#1C1917",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                >
                  <option value="Architect">Architect</option>
                  <option value="Interior Designer">Interior Designer</option>
                  <option value="Builder / Developer">Builder / Developer</option>
                  <option value="Homeowner">Homeowner</option>
                  <option value="Trade Partner / Consultant">Trade Partner / Consultant</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "#5E5852", fontWeight: 700, marginBottom: "0.3rem" }}>
                  Project Note <span style={{ fontSize: "0.72rem", color: "#8A8279" }}>(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Project location or requirement details..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.9rem",
                    background: "#FAF9F6",
                    border: "1px solid #D8D0BE",
                    color: "#1C1917",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  marginTop: "0.4rem",
                  padding: "0.9rem",
                  background: "linear-gradient(135deg, #D4B67D 0%, #C8A96E 40%, #B38E46 100%)",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  cursor: submitting ? "wait" : "pointer",
                  boxShadow: "0 6px 20px rgba(184, 147, 85, 0.35)",
                  transition: "all 0.2s ease",
                }}
              >
                {submitting ? "Unlocking Preview..." : "Unlock Full Catalogue On-Screen Preview 📖"}
              </button>
            </form>
          </>
        ) : (
          /* ── STEP 2: ON-SCREEN PREVIEW PLAYER (SCROLL THROUGH ALL PAGES, VIEW-ONLY, NO DOWNLOADS) ── */
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            {/* Top Bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.8rem",
                borderBottom: "1px solid #E8E3D7",
                paddingBottom: "0.6rem",
                flexWrap: "wrap",
                gap: "0.6rem",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "0.72rem",
                    background: "rgba(200, 169, 110, 0.2)",
                    color: "#81663F",
                    border: "1px solid rgba(200, 169, 110, 0.4)",
                    padding: "0.15rem 0.55rem",
                    borderRadius: "4px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  ✓ Full Catalogue On-Screen Access Unlocked
                </span>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0.25rem 0 0 0", color: "#81663F" }}>
                  {itemTitle}
                </h3>
              </div>

              <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", marginRight: "45px" }}>
                <span style={{ fontSize: "0.75rem", color: "#8A8279", fontWeight: 600 }}>
                  📄 Scroll to browse all pages • 🔒 View-Only (Downloads Disabled)
                </span>
                <button
                  onClick={onClose}
                  style={{
                    background: "#81663F",
                    color: "#FFFFFF",
                    border: "none",
                    padding: "0.45rem 1.1rem",
                    borderRadius: "6px",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "0.82rem",
                  }}
                >
                  Done / Close
                </button>
              </div>
            </div>

            {/* On-Screen View-Only PDF Viewer (All Pages Scrollable) */}
            <div
              onContextMenu={(e) => e.preventDefault()}
              style={{
                flex: 1,
                minHeight: "68vh",
                background: "#0F172A",
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid #E8E3D7",
                position: "relative",
              }}
            >
              <iframe
                title={`${itemTitle} On-Screen Catalogue Preview`}
                src={viewerUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "68vh" }}
                allowFullScreen={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
