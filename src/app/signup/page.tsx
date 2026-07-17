"use client";

import { useState } from "react";
import Link from "next/link";
import { UserPlus, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: "", email: "", sector: "Architect", password: "" });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
  };

  return (
    <div className="signup-page">
      {/* ── Page Header ── */}
      <div className="signup-header">
        <div className="signup-header__inner">
          <div className="signup-header__meta t-tag" style={{ color: "rgba(0,0,0,0.4)", marginBottom: "2.4rem" }}>
            MEMBER DIRECTORY — Join Aaren Studio
          </div>
          <h1 className="signup-header__title">Sign Up</h1>
          <p className="signup-header__desc t-body" style={{ color: "rgba(0,0,0,0.5)", maxWidth: "52rem" }}>
            Register as a trade member or designer to access premium material specifications, CAD/BIM resources, and priority sampling.
          </p>
        </div>
      </div>

      <div className="signup-container">
        {/* Left Side: Membership Perks */}
        <div className="signup-perks">
          <div className="perks-block">
            <h4 className="perks-block__title t-tag">MEMBERSHIP BENEFITS</h4>
            
            <div className="perk-item">
              <span className="perk-item__num">01</span>
              <div className="perk-item__content">
                <span className="perk-item__title">Direct Sampling</span>
                <p className="perk-item__text">Request physical samples of wood veneers, facades, and tiles with zero shipping overhead.</p>
              </div>
            </div>

            <div className="perk-item">
              <span className="perk-item__num">02</span>
              <div className="perk-item__content">
                <span className="perk-item__title">CAD & BIM Library</span>
                <p className="perk-item__text">Download production-ready digital textures and profiles directly into Revit/SketchUp projects.</p>
              </div>
            </div>

            <div className="perk-item">
              <span className="perk-item__num">03</span>
              <div className="perk-item__content">
                <span className="perk-item__title">Trade Pricing</span>
                <p className="perk-item__text">Exclusive access to quantity-based trade pricing and premium direct manufacturing sourcing.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="signup-form-wrapper">
          <h2 className="form-title">REGISTRATION DEBRIEF</h2>

          {success ? (
            <div className="success-message">
              <span className="success-message__title">Account Formulated</span>
              <p className="success-message__text">
                Your profile has been created successfully. Welcome to Aaren Studio. A verification link has been sent to your email.
              </p>
              <Link href="/" className="back-home-link t-tag">
                Return to home <ArrowRight size={12} style={{ marginLeft: "0.4rem" }} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="signup-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
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
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                  placeholder="name@studio.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Professional Sector</label>
                <select
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  className="form-input form-select"
                >
                  <option value="Architect">Architect</option>
                  <option value="Interior Designer">Interior Designer</option>
                  <option value="Contractor / Builder">Contractor / Builder</option>
                  <option value="Product Sourcing">Product Sourcing</option>
                  <option value="Design Student">Design Student</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="form-input"
                  placeholder="••••••••"
                />
              </div>

              <button type="submit" className="form-submit-btn">
                Register Profile <UserPlus size={14} style={{ marginLeft: "0.8rem" }} />
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .signup-page {
          background: #eaeef4;
          color: #000;
          min-height: 100vh;
          padding-top: 8rem;
        }

        .signup-header {
          padding: 6rem 0.8rem 4rem;
          border-bottom: 0.1rem solid rgba(0,0,0,0.12);
        }

        @media (min-width: 768px) {
          .signup-header {
            padding: 8rem 1.2rem 4rem;
          }
        }

        .signup-header__title {
          font-size: clamp(6rem, 15vw, 22rem);
          font-weight: 700;
          letter-spacing: -0.05em;
          line-height: 0.88;
          text-transform: uppercase;
          color: #000;
          margin-bottom: 3.2rem;
        }

        .signup-header__desc {
          font-size: 1.5rem;
          line-height: 1.5;
          letter-spacing: -0.01em;
        }

        /* ── Container Layout ── */
        .signup-container {
          display: flex;
          flex-direction: column;
          border-bottom: 0.1rem solid rgba(0,0,0,0.12);
        }

        @media (min-width: 992px) {
          .signup-container {
            flex-direction: row;
          }
        }

        /* ── Perks Side ── */
        .signup-perks {
          flex: 1;
          border-bottom: 0.1rem solid rgba(0,0,0,0.12);
          display: flex;
          flex-direction: column;
        }

        @media (min-width: 992px) {
          .signup-perks {
            border-bottom: none;
            border-right: 0.1rem solid rgba(0,0,0,0.12);
          }
        }

        .perks-block {
          padding: 4rem 2.4rem;
          display: flex;
          flex-direction: column;
          gap: 3.2rem;
        }

        .perks-block__title {
          color: rgba(0,0,0,0.45);
        }

        .perk-item {
          display: flex;
          align-items: flex-start;
          gap: 2rem;
        }

        .perk-item__num {
          font-size: 2.4rem;
          font-weight: 700;
          color: rgba(0,0,0,0.25);
          font-family: var(--font-geist-mono), monospace;
          line-height: 1.0;
        }

        .perk-item__content {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .perk-item__title {
          font-size: 1.6rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: -0.01em;
        }

        .perk-item__text {
          font-size: 1.3rem;
          line-height: 1.5;
          color: rgba(0,0,0,0.5);
        }

        /* ── Form Side ── */
        .signup-form-wrapper {
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

        .signup-form {
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

        .form-select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23000000' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
          background-position: right 1.6rem center;
          background-repeat: no-repeat;
          background-size: 1.6rem;
          padding-right: 4.8rem;
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
          gap: 1.6rem;
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

        .back-home-link {
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          color: #000;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}
