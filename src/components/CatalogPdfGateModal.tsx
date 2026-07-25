"use client";

import { useState } from "react";

type Props = {
  catalogPdfUrl: string;
  itemTitle: string; // Product Name or Brand Name
  onClose: () => void;
};

export default function CatalogPdfGateModal({ catalogPdfUrl, itemTitle, onClose }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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
          type: "Catalog PDF Gate",
          productOrBrand: itemTitle,
          subject: `Catalog PDF Requested for ${itemTitle}`,
        }),
      });

      setUnlocked(true);

      // Trigger instant PDF download
      setTimeout(() => {
        window.open(catalogPdfUrl, "_blank");
      }, 300);
    } catch (e) {
      console.error("Lead submission failed:", e);
      window.open(catalogPdfUrl, "_blank");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "1rem" }}>
      <div style={{ background: "#141418", border: "1px solid #333", borderRadius: "12px", width: "100%", maxWidth: "480px", padding: "2.2rem", color: "#fff", position: "relative" }}>
        <button
          onClick={onClose}
          style={{ position: "absolute", top: "15px", right: "15px", background: "none", border: "none", color: "#888", fontSize: "1.2rem", cursor: "pointer" }}
        >
          ✕
        </button>

        {!unlocked ? (
          <>
            <div style={{ fontSize: "0.8rem", color: "#3b82f6", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.4rem" }}>
              PROTECTED CATALOG ACCESS
            </div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.6rem" }}>
              Download {itemTitle} Catalog PDF
            </h3>
            <p style={{ color: "#aaa", fontSize: "0.88rem", lineHeight: 1.5, marginBottom: "1.5rem" }}>
              Please provide your contact details below to instantly unlock and download the complete high-resolution specification catalog.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#888", marginBottom: "0.3rem" }}>Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: "100%", padding: "0.75rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#888", marginBottom: "0.3rem" }}>Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rajesh@architecture.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: "100%", padding: "0.75rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#888", marginBottom: "0.3rem" }}>Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98800 12345"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{ width: "100%", padding: "0.75rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  marginTop: "0.5rem",
                  padding: "0.9rem",
                  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: submitting ? "wait" : "pointer",
                }}
              >
                {submitting ? "Unlocking Catalog PDF..." : "🔓 Unlock & Download Catalog PDF"}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🎉</div>
            <h3 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.5rem" }}>Catalog PDF Unlocked!</h3>
            <p style={{ color: "#aaa", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              Your download should start automatically. If it doesn&apos;t start, click the button below:
            </p>
            <a
              href={catalogPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "0.8rem 1.6rem",
                background: "#3b82f6",
                color: "#fff",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              📄 Direct Download PDF
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
