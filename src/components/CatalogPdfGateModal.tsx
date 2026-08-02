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

      // Trigger instant PDF download / view in new tab
      setTimeout(() => {
        window.open(catalogPdfUrl, "_blank");
      }, 300);
    } catch (e) {
      console.error("Enquiry submission error:", e);
      window.open(catalogPdfUrl, "_blank");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
        padding: "1.2rem",
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
          maxWidth: "520px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "2.4rem",
          color: "#ffffff",
          position: "relative",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.8)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
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
              Download {itemTitle}
            </h3>
            <p
              style={{
                color: "#94a3b8",
                fontSize: "0.9rem",
                lineHeight: 1.5,
                marginBottom: "1.8rem",
              }}
            >
              Please submit your enquiry details below to instantly view and download the full high-resolution PDF catalogue.
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
                {submitting ? "Submitting Enquiry..." : "📩 Submit Enquiry & View PDF"}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "0.5rem" }}>📄✨</div>
            <h3 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: "0.5rem", color: "#ffffff" }}>
              Enquiry Submitted!
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: 1.5, marginBottom: "1.8rem" }}>
              Thank you, <strong>{formData.name}</strong>. Your enquiry has been received and the PDF catalogue is opening in a new tab.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <a
                href={catalogPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  padding: "0.9rem 1.8rem",
                  background: "#d4af37",
                  color: "#000000",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: 800,
                  fontSize: "1rem",
                  boxShadow: "0 8px 20px rgba(212, 175, 55, 0.3)",
                }}
              >
                ⬇️ Re-open PDF Catalogue
              </a>
              <button
                onClick={onClose}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#aaa",
                  padding: "0.7rem",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

