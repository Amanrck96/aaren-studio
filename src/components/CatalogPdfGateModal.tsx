"use client";

import { useState, useEffect } from "react";

type Props = {
  catalogPdfUrl: string;
  itemTitle: string; // Product Name or Brand Name
  onClose: () => void;
};

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
    modalBgColor: "#FFFFFF",
    modalTextColor: "#1C1917",
    badgeText: "OFFICIAL CATALOGUE PREVIEW",
    buttonText: "Preview Catalogue On-Screen",
    modalTitle: `${itemTitle} — Catalogue Preview`,
    modalSubtext: "Submit your details below to unlock on-screen digital preview access for this official architectural specification PDF.",
  });

  useEffect(() => {
    // Auto-unlock if user previously submitted enquiry in this session
    if (typeof window !== "undefined") {
      const alreadySubmitted = sessionStorage.getItem("aaren_enquiry_submitted");
      if (alreadySubmitted) {
        setUnlocked(true);
      }
    }

    fetch("/api/catalog-settings")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setSettings((prev) => ({
            ...prev,
            modalBgColor: json.data.modalBgColor || prev.modalBgColor,
            modalTextColor: json.data.modalTextColor || prev.modalTextColor,
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

      if (typeof window !== "undefined") {
        sessionStorage.setItem("aaren_enquiry_submitted", "true");
      }

      setUnlocked(true);
    } catch (e) {
      console.error("Enquiry submission error:", e);
      setUnlocked(true);
    } finally {
      setSubmitting(false);
    }
  }

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
          padding: unlocked ? "1.5rem" : "2.4rem",
          color: "#1C1917",
          position: "relative",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.35)",
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
            zIndex: 20,
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
          <>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#81663F",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 800,
                marginBottom: "0.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              📋 {settings.badgeText}
            </div>
            <h3
              style={{
                fontSize: "1.6rem",
                fontWeight: 800,
                lineHeight: 1.25,
                marginBottom: "0.6rem",
                color: "#81663F",
                letterSpacing: "-0.02em",
              }}
            >
              {itemTitle}
            </h3>
            <p
              style={{
                color: "#5E5852",
                fontSize: "0.9rem",
                lineHeight: 1.5,
                marginBottom: "1.6rem",
              }}
            >
              {settings.modalSubtext}
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#5E5852", fontWeight: 700, marginBottom: "0.4rem" }}>
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
                    padding: "0.75rem 1rem",
                    background: "#FAF9F6",
                    border: "1px solid #D8D0BE",
                    color: "#1C1917",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#5E5852", fontWeight: 700, marginBottom: "0.4rem" }}>
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
                      padding: "0.75rem 1rem",
                      background: "#FAF9F6",
                      border: "1px solid #D8D0BE",
                      color: "#1C1917",
                      borderRadius: "8px",
                      fontSize: "0.95rem",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#5E5852", fontWeight: 700, marginBottom: "0.4rem" }}>
                    Phone / WhatsApp <span style={{ color: "#EF4444" }}>*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      background: "#FAF9F6",
                      border: "1px solid #D8D0BE",
                      color: "#1C1917",
                      borderRadius: "8px",
                      fontSize: "0.95rem",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#5E5852", fontWeight: 700, marginBottom: "0.4rem" }}>
                  Profession / Role
                </label>
                <select
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    background: "#FAF9F6",
                    border: "1px solid #D8D0BE",
                    color: "#1C1917",
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
                <label style={{ display: "block", fontSize: "0.8rem", color: "#5E5852", fontWeight: 700, marginBottom: "0.4rem" }}>
                  Project Details / Requirements <span style={{ fontSize: "0.75rem", color: "#8A8279" }}>(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell us briefly about your spatial requirements or project location..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    background: "#FAF9F6",
                    border: "1px solid #D8D0BE",
                    color: "#1C1917",
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
                  marginTop: "0.5rem",
                  padding: "0.95rem",
                  background: "linear-gradient(135deg, #D4B67D 0%, #C8A96E 40%, #B38E46 100%)",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 800,
                  fontSize: "1rem",
                  cursor: submitting ? "wait" : "pointer",
                  boxShadow: "0 6px 20px rgba(184, 147, 85, 0.35)",
                  transition: "all 0.2s ease",
                }}
              >
                {submitting ? "Unlocking Preview..." : "View Catalogue On-Screen"}
              </button>
            </form>
          </>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            {/* Header in Preview Mode */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", borderBottom: "1px solid #E8E3D7", paddingBottom: "0.8rem", flexWrap: "wrap", gap: "0.8rem" }}>
              <div>
                <span style={{ fontSize: "0.75rem", background: "rgba(200, 169, 110, 0.2)", color: "#81663F", border: "1px solid rgba(200, 169, 110, 0.4)", padding: "0.2rem 0.6rem", borderRadius: "4px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  ✓ On-Screen View-Only Access
                </span>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, margin: "0.3rem 0 0 0", color: "#81663F" }}>
                  {itemTitle} — Official Specification Catalogue
                </h3>
              </div>

              <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", marginRight: "35px" }}>
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
                title={`${itemTitle} View-Only PDF Catalogue`}
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
