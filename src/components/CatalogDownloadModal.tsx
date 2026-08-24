"use client";

import { useState } from "react";
import { PdfCatalogItem } from "@/lib/types";
import OnScreenPdfViewer from "./OnScreenPdfViewer";
import { getPdfThumbnail } from "@/utils/pdfThumbnail";

interface Props {
  catalog: PdfCatalogItem | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function getPdfCoverThumbnail(url?: string, title?: string, publicId?: string): string {
  return getPdfThumbnail(publicId || url || "", { title });
}

export default function CatalogDownloadModal({ catalog, onClose, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [profession, setProfession] = useState("Architect / Interior Designer");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [viewToken, setViewToken] = useState("");
  const [viewSlug, setViewSlug] = useState("");

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
      const slug = (catalog as any).slug || catalog.id;
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          company: company.trim(),
          profession,
          city: city.trim(),
          catalogId: catalog.id,
          slug,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setViewToken(data.token);
        setViewSlug(data.slug || slug);
        setUnlocked(true);
        if (onSuccess) onSuccess();
      } else {
        alert("Submission failed: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  const thumbUrl = catalog.thumbnailUrl || getPdfCoverThumbnail(catalog.fileUrl, catalog.title, (catalog as any).pdfPublicId);
  const pdfUrl = viewToken && viewSlug
    ? `/api/catalogs/${viewSlug}/stream?token=${encodeURIComponent(viewToken)}`
    : catalog.fileUrl || `/catalogs/${catalog.fileName}`;

  return (
    <div className="catalog-modal-overlay" onClick={onClose}>
      <div
        className={`catalog-modal-card ${unlocked ? "unlocked" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {!unlocked ? (
          /* Mandatory Enquiry Form with Page 1 Cover Preview */
          <>
            {/* Close Button */}
            <button
              onClick={onClose}
              className="catalog-modal-close"
              aria-label="Close dialog"
            >
              ✕
            </button>

            {/* Left Thumbnail & Info Bar */}
            <div className="catalog-modal-sidebar">
              <div className="catalog-thumb-box">
                <img
                  src={thumbUrl}
                  alt={catalog.title}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/catalogs/thumbnails/newtechwood-product-catalog-2025_thumb.jpg";
                  }}
                />
                <div className="catalog-cover-badge">PAGE 1 COVER</div>
              </div>

              <div className="catalog-meta-info">
                <span className="catalog-meta-eyebrow">OFFICIAL CATALOGUE</span>
                <h4 className="catalog-brand-title">{catalog.brand}</h4>
                <p className="catalog-category-tag">{catalog.category}</p>

                <div className="catalog-stats-row">
                  <span>📄 {catalog.pageCount} Pages</span>
                  <span>•</span>
                  <span>💾 {catalog.fileSize}</span>
                </div>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="catalog-modal-form-col">
              <div className="catalog-form-header">
                <span className="catalog-form-eyebrow">
                  LUXURY ARCHITECTURAL CATALOGUE
                </span>
                <h2 className="catalog-form-title">{catalog.title}</h2>
                <p className="catalog-form-desc">{catalog.description}</p>
              </div>

              <form onSubmit={handleSubmit} className="catalog-enquiry-form">
                <div className="catalog-form-field">
                  <label>
                    Full Name <span className="req-star">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="catalog-form-grid">
                  <div className="catalog-form-field">
                    <label>
                      Work Email <span className="req-star">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="rahul@studio.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="catalog-form-field">
                    <label>
                      Phone Number <span className="req-star">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98800 12345"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="catalog-form-grid">
                  <div className="catalog-form-field">
                    <label>Company / Studio</label>
                    <input
                      type="text"
                      placeholder="e.g. Aaren Designs"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>

                  <div className="catalog-form-field">
                    <label>City / Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Bangalore"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                </div>

                <div className="catalog-form-field">
                  <label>Profession / Role</label>
                  <select
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                  >
                    <option value="Architect / Interior Designer">Architect / Interior Designer</option>
                    <option value="Builder / Developer">Builder / Developer</option>
                    <option value="Contractor / Consultant">Contractor / Consultant</option>
                    <option value="Homeowner / Private Client">Homeowner / Private Client</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="catalog-submit-btn"
                >
                  {loading ? "Unlocking Preview..." : "Unlock Full Catalogue On-Screen Preview 📖"}
                </button>
              </form>

              <div className="catalog-form-footer">
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

      <style jsx>{`
        .catalog-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.88);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          overflow-y: auto;
        }

        .catalog-modal-card {
          background: #ffffff;
          border-radius: 16px;
          max-width: 720px;
          width: 100%;
          max-height: 94vh;
          overflow-y: auto;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
          display: grid;
          grid-template-columns: 240px 1fr;
          border: 1px solid #e8e3d7;
          position: relative;
          color: #1c1917;
          -webkit-overflow-scrolling: touch;
        }

        .catalog-modal-card.unlocked {
          background: #0f1117;
          max-width: 1280px;
          height: 94vh;
          display: flex;
          flex-direction: column;
          padding: 0;
          overflow: hidden;
        }

        .catalog-modal-close {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(0, 0, 0, 0.08);
          border: none;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          color: #475569;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          transition: all 0.2s ease;
        }

        .catalog-modal-close:hover {
          background: #ef4444;
          color: #ffffff;
        }

        .catalog-modal-sidebar {
          background: #faf9f6;
          border-right: 1px solid #e8e3d7;
          padding: 1.8rem 1.4rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .catalog-thumb-box {
          position: relative;
          width: 100%;
          max-width: 170px;
          aspect-ratio: 3/4;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          margin-bottom: 1rem;
          border: 1px solid #d8d0be;
          background: #181920;
        }

        .catalog-thumb-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top;
          display: block;
        }

        .catalog-cover-badge {
          position: absolute;
          top: 6px;
          right: 6px;
          background: rgba(0, 0, 0, 0.8);
          color: #d4b67d;
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        .catalog-meta-info {
          width: 100%;
        }

        .catalog-meta-eyebrow {
          display: block;
          font-size: 0.7rem;
          color: #8a8279;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 800;
        }

        .catalog-brand-title {
          color: #81663f;
          font-weight: 800;
          font-size: 1.05rem;
          margin: 0.2rem 0;
        }

        .catalog-category-tag {
          color: #5e5852;
          font-size: 0.82rem;
          margin: 0;
          font-weight: 600;
        }

        .catalog-stats-row {
          margin-top: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #8a8279;
          font-weight: 600;
        }

        .catalog-modal-form-col {
          padding: 2rem 2.2rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .catalog-form-eyebrow {
          display: block;
          font-size: 0.72rem;
          font-weight: 800;
          color: #81663f;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 0.3rem;
        }

        .catalog-form-title {
          font-size: 1.3rem;
          font-weight: 800;
          color: #81663f;
          margin: 0 0 0.3rem 0;
          line-height: 1.3;
        }

        .catalog-form-desc {
          color: #5e5852;
          font-size: 0.84rem;
          line-height: 1.45;
          margin: 0 0 1.2rem 0;
        }

        .catalog-enquiry-form {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .catalog-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .catalog-form-field label {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          color: #5e5852;
          margin-bottom: 4px;
        }

        .req-star {
          color: #ef4444;
        }

        .catalog-form-field input,
        .catalog-form-field select {
          width: 100%;
          padding: 0.7rem 0.85rem;
          border-radius: 8px;
          border: 1px solid #d8d0be;
          font-size: 0.9rem;
          color: #1c1917;
          background: #faf9f6;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .catalog-form-field input:focus,
        .catalog-form-field select:focus {
          border-color: #81663f;
          box-shadow: 0 0 0 3px rgba(129, 102, 63, 0.15);
          background: #ffffff;
        }

        .catalog-submit-btn {
          margin-top: 0.4rem;
          width: 100%;
          padding: 0.9rem 1rem;
          background: linear-gradient(135deg, #d4b67d 0%, #c8a96e 40%, #b38e46 100%);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-weight: 800;
          font-size: 0.95rem;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(184, 147, 85, 0.35);
          transition: all 0.2s ease;
        }

        .catalog-submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(184, 147, 85, 0.45);
        }

        .catalog-submit-btn:disabled {
          opacity: 0.7;
          cursor: wait;
        }

        .catalog-form-footer {
          margin-top: 1rem;
          border-top: 1px solid #e8e3d7;
          padding-top: 0.8rem;
          font-size: 0.72rem;
          color: #8a8279;
          text-align: center;
        }

        /* ── Mobile Viewport Overrides (<= 768px) ── */
        @media (max-width: 768px) {
          .catalog-modal-overlay {
            padding: 0.6rem;
            align-items: flex-start;
          }

          .catalog-modal-card {
            grid-template-columns: 1fr;
            max-height: 94vh;
            margin-top: 1rem;
            border-radius: 12px;
          }

          .catalog-modal-sidebar {
            border-right: none;
            border-bottom: 1px solid #e8e3d7;
            padding: 1.2rem 1rem;
            flex-direction: row;
            text-align: left;
            gap: 1rem;
            align-items: center;
          }

          .catalog-thumb-box {
            width: 70px;
            max-width: 70px;
            margin-bottom: 0;
            flex-shrink: 0;
          }

          .catalog-meta-info {
            flex: 1;
          }

          .catalog-stats-row {
            justify-content: flex-start;
            margin-top: 0.4rem;
          }

          .catalog-modal-form-col {
            padding: 1.2rem 1rem 1.6rem;
          }

          .catalog-form-title {
            font-size: 1.15rem;
          }

          .catalog-form-desc {
            font-size: 0.8rem;
            margin-bottom: 0.9rem;
          }

          .catalog-form-grid {
            grid-template-columns: 1fr;
            gap: 0.85rem;
          }

          .catalog-form-field input,
          .catalog-form-field select {
            padding: 0.8rem;
            font-size: 0.95rem;
          }

          .catalog-submit-btn {
            padding: 0.95rem;
            font-size: 0.92rem;
          }
        }
      `}</style>
    </div>
  );
}
