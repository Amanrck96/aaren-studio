"use client";

import { useState } from "react";

type Props = {
  catalogPdfUrl: string;
  itemTitle: string; // Product Name or Brand Name
  onClose: () => void;
};

function getProtectedPdfViewerUrl(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  const driveMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/id=([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  }
  if (trimmed.startsWith("http")) {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(trimmed)}&embedded=true`;
  }
  if (typeof window !== "undefined") {
    const originUrl = window.location.origin + (trimmed.startsWith("/") ? trimmed : `/${trimmed}`);
    return `https://docs.google.com/viewer?url=${encodeURIComponent(originUrl)}&embedded=true`;
  }
  return trimmed;
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          profession: formData.profession,
          message: formData.message,
          type: "Catalog PDF Gate",
          productOrBrand: itemTitle,
          subject: `Catalog PDF Enquiry for ${itemTitle}`,
        }),
      });

      if (typeof window !== "undefined") {
        sessionStorage.setItem("aaren_enquiry_submitted", "true");
      }

      setUnlocked(true);

      // Extract Drive View URL or Direct PDF URL
      const trimmed = catalogPdfUrl.trim();
      const driveMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/id=([a-zA-Z0-9_-]+)/);
      const directViewUrl = driveMatch && driveMatch[1] 
        ? `https://drive.google.com/file/d/${driveMatch[1]}/view`
        : catalogPdfUrl;

      // Auto-open PDF Catalogue in View-Only Player Window
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.open(directViewUrl, "_blank");
        }
      }, 200);
    } catch (e) {
      console.error("Enquiry submission error:", e);
      setUnlocked(true);
    } finally {
      setSubmitting(false);
    }
  }

  const trimmed = catalogPdfUrl.trim();
  const driveMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/id=([a-zA-Z0-9_-]+)/);
  const driveId = driveMatch ? driveMatch[1] : null;

  const directViewUrl = driveId 
    ? `https://drive.google.com/file/d/${driveId}/view`
    : catalogPdfUrl;

  const docsEmbedUrl = driveId
    ? `https://docs.google.com/viewer?url=${encodeURIComponent(`https://drive.google.com/uc?export=download&id=${driveId}`)}&embedded=true`
    : (trimmed.startsWith("http") ? `https://docs.google.com/viewer?url=${encodeURIComponent(trimmed)}&embedded=true` : trimmed);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.92)",
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
          background: "#121316",
          border: "1px solid rgba(212, 175, 55, 0.3)",
          borderRadius: "16px",
          width: "100%",
          maxWidth: unlocked ? "1100px" : "520px",
          maxHeight: "92vh",
          overflowY: unlocked ? "hidden" : "auto",
          padding: unlocked ? "1.5rem" : "2.4rem",
          color: "#ffffff",
          position: "relative",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.9)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "rgba(255, 255, 255, 0.08)",
            border: "none",
            color: "#aaa",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            fontSize: "1.2rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#ef4444";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
            e.currentTarget.style.color = "#aaa";
          }}
        >
          ✕
        </button>

        {!unlocked ? (
          <>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#d4af37",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 800,
                marginBottom: "0.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              🔒 EXCLUSIVE CATALOGUE ENQUIRY
            </div>
            <h3
              style={{
                fontSize: "1.6rem",
                fontWeight: 700,
                lineHeight: 1.2,
                marginBottom: "0.6rem",
                color: "#ffffff",
                letterSpacing: "-0.02em",
              }}
            >
              Unlock {itemTitle} Catalogue
            </h3>
            <p
              style={{
                color: "#94a3b8",
                fontSize: "0.9rem",
                lineHeight: 1.5,
                marginBottom: "1.8rem",
              }}
            >
              Submit your details below to unlock on-screen digital viewing access for this official architectural specification PDF.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#cbd5e1", fontWeight: 600, marginBottom: "0.4rem" }}>
                  Full Name <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Architect Rajesh Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    background: "#1e2026",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    color: "#fff",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#cbd5e1", fontWeight: 600, marginBottom: "0.4rem" }}>
                  Email Address <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rajesh@studio.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    background: "#1e2026",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    color: "#fff",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#cbd5e1", fontWeight: 600, marginBottom: "0.4rem" }}>
                  Phone / WhatsApp Number <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    background: "#1e2026",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    color: "#fff",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#cbd5e1", fontWeight: 600, marginBottom: "0.4rem" }}>
                  Profession / Role
                </label>
                <select
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    background: "#1e2026",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    color: "#fff",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
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
                <label style={{ display: "block", fontSize: "0.8rem", color: "#cbd5e1", fontWeight: 600, marginBottom: "0.4rem" }}>
                  Project Details / Requirements <span style={{ fontSize: "0.75rem", color: "#64748b" }}>(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell us briefly about your project location or requirements..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    background: "#1e2026",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    color: "#fff",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  marginTop: "0.6rem",
                  padding: "1rem",
                  background: "linear-gradient(135deg, #d4af37 0%, #aa820a 100%)",
                  color: "#000000",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 800,
                  fontSize: "1rem",
                  letterSpacing: "0.02em",
                  cursor: submitting ? "wait" : "pointer",
                  boxShadow: "0 8px 24px rgba(212, 175, 55, 0.35)",
                  transition: "transform 0.2s ease, boxShadow 0.2s ease",
                }}
              >
                {submitting ? "Submitting Enquiry..." : "📩 View Catalogue On-Screen"}
              </button>
            </form>
          </>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "0.8rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <span style={{ fontSize: "0.75rem", background: "#d4af37", color: "#000", padding: "0.2rem 0.6rem", borderRadius: "4px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  🔓 Catalogue Unlocked
                </span>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "0.4rem 0 0 0", color: "#ffffff" }}>
                  {itemTitle} Official Digital Catalogue
                </h3>
              </div>
              <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", marginRight: "35px" }}>
                <a
                  href={directViewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "linear-gradient(135deg, #d4af37 0%, #aa820a 100%)",
                    color: "#000000",
                    border: "none",
                    padding: "0.55rem 1.2rem",
                    borderRadius: "6px",
                    fontWeight: 800,
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    boxShadow: "0 4px 14px rgba(212, 175, 55, 0.35)",
                  }}
                >
                  👁️ Open Full PDF Reader ↗
                </a>
                <button
                  onClick={onClose}
                  style={{
                    background: "#ef4444",
                    color: "#ffffff",
                    border: "none",
                    padding: "0.55rem 1rem",
                    borderRadius: "6px",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  Close
                </button>
              </div>
            </div>

            {/* Embedded Drive PDF Viewer Iframe */}
            <div style={{ flex: 1, minHeight: "68vh", background: "#0a0a0c", borderRadius: "8px", overflow: "hidden", border: "1px solid #333", position: "relative" }}>
              <iframe
                title={`${itemTitle} View-Only PDF Catalogue`}
                src={driveId ? `https://drive.google.com/file/d/${driveId}/preview` : catalogPdfUrl}
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

