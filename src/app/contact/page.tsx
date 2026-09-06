"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { DEFAULT_SETTINGS, SiteSettingsItem } from "@/lib/types";
import { applyTextCase } from "@/lib/textCase";

const AAREN_GOOGLE_MAPS_URL = "https://www.google.com/maps/place/AAREN+INTPRO/@12.9550672,77.5447602,3a,75y,90t/data=!3m8!1e2!3m6!1sCIABIhD2EhoinjIZh3Syp3OicPPw!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAHRPTWl_AU36ZyrQTK7EcxMbajbN0jfOCRK_ADmORimg0uI-JDz7HQRi529z6gDxsUCxVggHHdxC1EuDrEZFW34I3Kh9wo3GDipgUxr9OAZCjk1FYJ_wegO3rXtXxVtBE62Huz8f93bmkNgGEHxN%3Dw152-h86-k-no!7i1920!8i1080!4m13!1m2!2m1!1saaren+studio!3m9!1s0x3bae3e0dde119581:0x66f104a2c0fa658b!8m2!3d12.9552407!4d77.5446118!10e5!14m1!1BCgIgAQ!15sCgxhYXJlbiBzdHVkaW9aDiIMYWFyZW4gc3R1ZGlvkgEWaG9tZV9pbXByb3ZlbWVudF9zdG9yZeABAA!16s%2Fg%2F11c1qrvx5l?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [settings, setSettings] = useState<SiteSettingsItem>(DEFAULT_SETTINGS);

  useEffect(() => {
    fetch("/api/site-settings?t=" + Date.now(), { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) setSettings(json.data);
      })
      .catch((e) => console.error(e));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || "Not provided",
          subject: formData.subject,
          message: formData.message,
          type: "Project Inquiry",
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSent(true);
      } else {
        setErrorMsg(json.error || "Failed to submit message. Please try again.");
      }
    } catch (err: any) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      {/* ── Page Header ── */}
      <div className="contact-header page-header">
        <div className="contact-header__inner page-header__inner">
          <div className="contact-header__meta page-meta">
            GET IN TOUCH
          </div>
          <h1 className="contact-header__title page-title">CONTACT US</h1>
          <p className="contact-header__desc page-desc">
            Ready to construct something unreal? Fill out the project form, or reach out to our primary creative office directly.
          </p>
        </div>
      </div>

      <div className="contact-container">
        {/* Left Side: Contact Information & Mock Map */}
        <div className="contact-info">
          <div className="info-block">
            <h4 className="info-block__title page-meta" style={{ marginBottom: 0 }}>PRIMARY DIRECTORY</h4>
            
            <div className="info-item">
              <div className="info-item__icon"><Mail size={16} /></div>
              <div className="info-item__content">
                <span className="info-item__label label-text">Email Address</span>
                <a href={`mailto:${settings.contactEmail || "info@aarenintpro.com"}`} className="info-item__value value-text">
                  {settings.contactEmail || "info@aarenintpro.com"}
                </a>
              </div>
            </div>

            <div className="info-item">
              <div className="info-item__icon"><Phone size={16} /></div>
              <div className="info-item__content">
                <span className="info-item__label label-text">Phone Number</span>
                <a href={`tel:${settings.contactPhone || "8884464444"}`} className="info-item__value value-text">
                  {settings.contactPhone || "8884464444"}
                </a>
              </div>
            </div>

            <div className="info-item">
              <div className="info-item__icon"><MapPin size={16} /></div>
              <div className="info-item__content">
                <span className="info-item__label label-text">Creative Office &amp; Showroom</span>
                <a
                  href={settings.googleMapUrl && settings.googleMapUrl.includes("google.com/maps") && !settings.googleMapUrl.includes("output=embed") ? settings.googleMapUrl : AAREN_GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="info-item__value value-text"
                  style={{ textDecoration: "none" }}
                >
                  {settings.contactAddress || "#342/8, NTY Layout, Mysore Road, Bangalore - 560026"}
                </a>
              </div>
            </div>
          </div>

          {/* Live Google Map Embedded Block */}
          <div className="google-map-wrapper">
            <div className="google-map-container" style={{ position: "relative", height: "26rem", width: "100%", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.12)", boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
              <iframe
                title="AAREN INTPRO Google Map Location"
                src={
                  settings.googleMapUrl?.includes("output=embed")
                    ? settings.googleMapUrl
                    : `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d971.1234567!2d77.5446118!3d12.9552407!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3e0dde119581%3A0x66f104a2c0fa658b!2sAAREEN%20INTPRO!5e0!3m2!1sen!2sin!4v1725000000000!5m2!1sen!2sin`
                }
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div style={{ position: "absolute", bottom: "12px", left: "12px", right: "12px", background: "rgba(17, 17, 17, 0.94)", backdropFilter: "blur(8px)", padding: "0.9rem 1.2rem", borderRadius: "6px", color: "#ffffff", display: "flex", justifyContent: "space-between", alignItems: "center", pointerEvents: "auto", flexWrap: "wrap", gap: "0.6rem" }}>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#c8a96e", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>SHOWROOM &amp; MATERIAL LAB</div>
                  <div style={{ fontSize: "0.86rem", fontWeight: 700, marginTop: "2px" }}>#342/8, NTY Layout, Mysore Road, Bangalore - 560026</div>
                  <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.7)", marginTop: "1px" }}>342/8, Mysore Rd, New Guddadahalli, Bengaluru - 560026</div>
                </div>
                <a
                  href={settings.googleMapUrl && settings.googleMapUrl.includes("google.com/maps") && !settings.googleMapUrl.includes("output=embed") ? settings.googleMapUrl : AAREN_GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ padding: "0.5rem 1rem", background: "#8c764b", color: "#ffffff", borderRadius: "4px", fontSize: "0.78rem", fontWeight: 800, textDecoration: "none", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: "4px" }}
                >
                  <span>📍 Open Directions</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="contact-form-wrapper">
          <h2 className="form-title section-title" style={{ margin: 0 }}>PROJECT INQUIRY</h2>
          
          {sent ? (
            <div className="success-message">
              <span className="success-message__title">Message Received</span>
              <p className="success-message__text">
                Thank you! A creative director will verify your details and respond within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              {errorMsg && (
                <div style={{ padding: "0.8rem", background: "#fee2e2", color: "#dc2626", borderRadius: "6px", fontSize: "0.9rem", marginBottom: "1rem" }}>
                  {errorMsg}
                </div>
              )}
              
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  placeholder="Your Name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                  placeholder="your.email@domain.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="form-input"
                  placeholder="+91 98800 12345"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="form-input"
                  placeholder="Project Inquiry / Consultation"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="form-input form-textarea"
                  placeholder="Tell us about your project requirements..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="form-submit-btn"
              >
                {loading ? "TRANSMITTING..." : (
                  <>
                    <span>SUBMIT</span>
                    <Send size={14} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        /* ── Contact Page Styles ── */
        .contact-page {
          background: #E6E2D8;
          color: #1e1e1e;
          min-height: 100vh;
          padding-top: 8rem;
        }

        .contact-header {
          padding-top: 6rem;
          padding-bottom: 3.5rem;
          padding-left: 0;
          padding-right: 0;
          border-bottom: 0.1rem solid rgba(129,102,63,0.18);
        }

        @media (min-width: 768px) {
          .contact-header {
            padding-top: 8rem;
            padding-bottom: 4rem;
          }
        }

        .contact-header__meta {
          color: #81663F;
          font-weight: 700;
          letter-spacing: 0.12em;
          margin-bottom: 1.6rem;
          font-size: 1.3rem;
          text-transform: uppercase;
        }

        .contact-header__title {
          font-size: clamp(6rem, 15vw, 22rem);
          font-weight: 700;
          letter-spacing: -0.05em;
          line-height: 0.88;
          text-transform: uppercase;
          color: #81663F;
          margin-bottom: 2.8rem;
        }

        .contact-header__desc {
          font-size: 1.6rem;
          line-height: 1.6;
          max-width: 58rem;
          color: rgba(0,0,0,0.65);
        }

        /* ── Container Layout ── */
        .contact-container {
          display: flex;
          flex-direction: column;
          border-bottom: 0.1rem solid rgba(129,102,63,0.18);
          max-width: 1600px;
          margin: 0 auto;
        }

        @media (min-width: 992px) {
          .contact-container {
            flex-direction: row;
          }
        }

        /* ── Info Side ── */
        .contact-info {
          flex: 1;
          border-bottom: 0.1rem solid rgba(129, 102, 63, 0.18);
          display: flex;
          flex-direction: column;
        }

        @media (min-width: 992px) {
          .contact-info {
            border-bottom: none;
            border-right: 0.1rem solid rgba(129, 102, 63, 0.18);
          }
        }

        .info-block {
          padding: 4rem 4rem 2.4rem;
          display: flex;
          flex-direction: column;
          gap: 2.4rem;
        }

        @media (max-width: 1024px) {
          .info-block {
            padding: 3.5rem 3rem 2rem;
          }
        }

        @media (max-width: 768px) {
          .info-block {
            padding: 3rem 2rem 2rem;
          }
        }

        .google-map-wrapper {
          padding: 0 4rem 4rem;
        }

        @media (max-width: 1024px) {
          .google-map-wrapper {
            padding: 0 3rem 3.5rem;
          }
        }

        @media (max-width: 768px) {
          .google-map-wrapper {
            padding: 0 2rem 3rem;
          }
        }

        .info-block__title {
          color: #81663F;
          font-size: 1.3rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 1.6rem;
        }

        .info-item__icon {
          width: 4rem;
          height: 4rem;
          background: #FAF9F6;
          border: 0.1rem solid rgba(129, 102, 63, 0.25);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #81663F;
          flex-shrink: 0;
        }

        .info-item__content {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .info-item__label {
          font-size: 1.2rem;
          text-transform: uppercase;
          color: #5E5852;
          letter-spacing: 0.05em;
          font-weight: 700;
        }

        .info-item__value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #81663F;
          text-decoration: none;
          line-height: 1.4;
        }

        /* ── Form Side ── */
        .contact-form-wrapper {
          flex: 1;
          padding: 4rem 4rem;
          display: flex;
          flex-direction: column;
          gap: 2.4rem;
        }

        @media (max-width: 1024px) {
          .contact-form-wrapper {
            padding: 3.5rem 3rem;
          }
        }

        @media (max-width: 768px) {
          .contact-form-wrapper {
            padding: 3rem 2rem;
          }
        }

        .form-title {
          font-size: clamp(2.4rem, 4vw, 3.6rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          color: #81663F !important;
          margin: 0;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 2.4rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .form-label {
          font-size: 1.2rem;
          letter-spacing: 0.02em;
          font-weight: 700;
          color: #5E5852;
        }

        .form-input {
          width: 100%;
          background: #FAF9F6;
          border: 0.1rem solid rgba(129, 102, 63, 0.25);
          border-radius: 4px;
          padding: 1.6rem;
          font-size: 1.4rem;
          color: #1C1917;
          outline: none;
          transition: border-color 0.2s;
        }

        .form-input:focus {
          border-color: #81663F;
        }

        .form-textarea {
          resize: none;
        }

        .form-submit-btn {
          width: 100%;
          padding: 1.8rem;
          background: #81663F;
          color: #fff;
          border: none;
          border-radius: 4px;
          font-size: 1.2rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(129, 102, 63, 0.25);
        }

        .form-submit-btn:hover {
          background: #6a5332;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(129, 102, 63, 0.35);
        }

        /* Success Message */
        .success-message {
          padding: 4rem 2.4rem;
          background: #FAF9F6;
          border: 0.1rem solid rgba(129, 102, 63, 0.25);
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .success-message__title {
          font-size: 1.8rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #81663F;
        }

        .success-message__text {
          font-size: 1.4rem;
          color: #5E5852;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
