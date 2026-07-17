"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="contact-page">
      {/* ── Page Header ── */}
      <div className="contact-header">
        <div className="contact-header__inner">
          <div className="contact-header__meta t-tag" style={{ color: "rgba(0,0,0,0.4)", marginBottom: "2.4rem" }}>
            GET IN TOUCH — 24/7 Response
          </div>
          <h1 className="contact-header__title">Contact Us</h1>
          <p className="contact-header__desc t-body" style={{ color: "rgba(0,0,0,0.5)", maxWidth: "52rem" }}>
            Ready to construct something unreal? Fill out the project form, or reach out to our primary creative office directly.
          </p>
        </div>
      </div>

      <div className="contact-container">
        {/* Left Side: Contact Information & Mock Map */}
        <div className="contact-info">
          <div className="info-block">
            <h4 className="info-block__title t-tag">PRIMARY DIRECTORY</h4>
            
            <div className="info-item">
              <div className="info-item__icon"><Mail size={16} /></div>
              <div className="info-item__content">
                <span className="info-item__label">Email Address</span>
                <a href="mailto:hello@aarenstudio.com" className="info-item__value">hello@aarenstudio.com</a>
              </div>
            </div>

            <div className="info-item">
              <div className="info-item__icon"><Phone size={16} /></div>
              <div className="info-item__content">
                <span className="info-item__label">Phone Number</span>
                <span className="info-item__value">+91-9876543210</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-item__icon"><MapPin size={16} /></div>
              <div className="info-item__content">
                <span className="info-item__label">Creative Office</span>
                <span className="info-item__value">Bangalore, Karnataka, India</span>
              </div>
            </div>
          </div>

          {/* Premium Abstract Map Block */}
          <div className="mock-map">
            <div className="mock-map__grid"></div>
            <div className="mock-map__overlay">
              <span className="mock-map__tag">MAP NAVIGATION ROUTE</span>
              <span className="mock-map__address">Aaren Studio, Tech Park Road, Bangalore</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="contact-form-wrapper">
          <h2 className="form-title">PROJECT DEBRIEF</h2>
          
          {sent ? (
            <div className="success-message">
              <span className="success-message__title">Message Received</span>
              <p className="success-message__text">
                Thank you! A creative director will verify your details and respond within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
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
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="form-input"
                  placeholder="Project inquiry / Partnerships"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Details</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="form-input form-textarea"
                  placeholder="Describe your design parameters..."
                />
              </div>

              <button type="submit" className="form-submit-btn">
                Send Message <Send size={14} style={{ marginLeft: "0.8rem" }} />
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .contact-page {
          background: #eaeef4;
          color: #000;
          min-height: 100vh;
          padding-top: 8rem;
        }

        .contact-header {
          padding: 6rem 0.8rem 4rem;
          border-bottom: 0.1rem solid rgba(0,0,0,0.12);
        }

        @media (min-width: 768px) {
          .contact-header {
            padding: 8rem 1.2rem 4rem;
          }
        }

        .contact-header__title {
          font-size: clamp(6rem, 15vw, 22rem);
          font-weight: 700;
          letter-spacing: -0.05em;
          line-height: 0.88;
          text-transform: uppercase;
          color: #000;
          margin-bottom: 3.2rem;
        }

        .contact-header__desc {
          font-size: 1.5rem;
          line-height: 1.5;
          letter-spacing: -0.01em;
        }

        /* ── Container Layout ── */
        .contact-container {
          display: flex;
          flex-direction: column;
          border-bottom: 0.1rem solid rgba(0,0,0,0.12);
        }

        @media (min-width: 992px) {
          .contact-container {
            flex-direction: row;
          }
        }

        /* ── Info Side ── */
        .contact-info {
          flex: 1;
          border-bottom: 0.1rem solid rgba(0,0,0,0.12);
          display: flex;
          flex-direction: column;
        }

        @media (min-width: 992px) {
          .contact-info {
            border-bottom: none;
            border-right: 0.1rem solid rgba(0,0,0,0.12);
          }
        }

        .info-block {
          padding: 4rem 2.4rem;
          display: flex;
          flex-direction: column;
          gap: 2.4rem;
          border-bottom: 0.1rem solid rgba(0,0,0,0.12);
        }

        .info-block__title {
          color: rgba(0,0,0,0.45);
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 1.6rem;
        }

        .info-item__icon {
          width: 4rem;
          height: 4rem;
          background: #dfe3e9;
          border: 0.1rem solid rgba(0,0,0,0.08);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
        }

        .info-item__content {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .info-item__label {
          font-size: 1.1rem;
          text-transform: uppercase;
          color: rgba(0,0,0,0.4);
          letter-spacing: 0.05em;
          font-weight: 700;
        }

        .info-item__value {
          font-size: 1.4rem;
          font-weight: 700;
          color: #000;
          text-decoration: none;
        }

        /* Map Mock */
        .mock-map {
          height: 28rem;
          position: relative;
          background: #111;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
          padding: 2.4rem;
        }

        .mock-map__grid {
          position: absolute;
          inset: 0;
          opacity: 0.15;
          background-image: radial-gradient(circle, #fff 0.1rem, transparent 0.1rem);
          background-size: 1.6rem 1.6rem;
        }

        .mock-map__overlay {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .mock-map__tag {
          font-size: 1.1rem;
          color: #eaeef4;
          opacity: 0.5;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .mock-map__address {
          font-size: 1.4rem;
          font-weight: 700;
          color: #fff;
          text-transform: uppercase;
        }

        /* ── Form Side ── */
        .contact-form-wrapper {
          flex: 1;
          padding: 4rem 2.4rem;
          display: flex;
          flex-direction: column;
          gap: 3.2rem;
        }

        .form-title {
          font-size: clamp(2.4rem, 4vw, 3.6rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          text-transform: uppercase;
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
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 700;
          color: rgba(0,0,0,0.5);
        }

        .form-input {
          width: 100%;
          background: transparent;
          border: 0.1rem solid rgba(0,0,0,0.12);
          padding: 1.6rem;
          font-size: 1.4rem;
          color: #000;
          outline: none;
          transition: border-color 0.2s;
        }

        .form-input:focus {
          border-color: #000;
        }

        .form-textarea {
          resize: none;
        }

        .form-submit-btn {
          width: 100%;
          padding: 1.8rem;
          background: #000;
          color: #fff;
          border: none;
          font-size: 1.2rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .form-submit-btn:hover {
          background: #222;
        }

        /* Success Message */
        .success-message {
          padding: 4rem 2.4rem;
          background: #dfe3e9;
          border: 0.1rem solid rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .success-message__title {
          font-size: 1.8rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .success-message__text {
          font-size: 1.4rem;
          color: rgba(0,0,0,0.6);
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
