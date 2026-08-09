"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, ArrowRight, AlertCircle } from "lucide-react";
import { signUpWithEmail, signInWithGoogle, trackUserActivity } from "@/lib/firebaseAuth";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", sector: "Architect", password: "" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signUpWithEmail(formData.name, formData.email, formData.password, formData.sector);
    setLoading(false);

    if (res.success) {
      await trackUserActivity(formData.email, "Registered new member workspace profile", `Role Sector: ${formData.sector}`);
      setSuccess(true);
      setTimeout(() => {
        router.push("/workspace");
      }, 1500);
    } else {
      setError(res.error || "Registration failed.");
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setGoogleLoading(true);

    const res = await signInWithGoogle(formData.sector);
    setGoogleLoading(false);

    if (res.success) {
      await trackUserActivity(res.user?.email || "Google User", "Registered via Google OAuth to Workspace", `Role Sector: ${formData.sector}`);
      router.push("/workspace");
    } else {
      setError(res.error || "Google sign-up failed.");
    }
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
        {/* Left Side: Membership Perks & Google Auth */}
        <div className="signup-perks">
          <div className="perks-block">
            <h4 className="perks-block__title t-tag">QUICK REGISTRATION</h4>

            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={googleLoading}
              className="google-signup-btn"
            >
              <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{googleLoading ? "Connecting Google..." : "Sign up with Google"}</span>
            </button>

            <div className="divider-line">
              <span>MEMBERSHIP BENEFITS</span>
            </div>
            
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

          {error && (
            <div className="error-alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="success-message">
              <span className="success-message__title">Account Formulated</span>
              <p className="success-message__text">
                Your trade profile has been created successfully. Welcome to Aaren Studio!
              </p>
              <div className="success-actions">
                <Link href="/" className="back-home-link t-tag">
                  Return to home <ArrowRight size={12} style={{ marginLeft: "0.4rem" }} />
                </Link>
                <Link href="/login" className="login-now-btn t-tag">
                  Sign In Now →
                </Link>
              </div>
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

              <button type="submit" disabled={loading} className="form-submit-btn">
                {loading ? "Creating Profile..." : "Register Profile"}{" "}
                <UserPlus size={14} style={{ marginLeft: "0.8rem" }} />
              </button>
            </form>
          )}

          <div className="login-prompt">
            <span>Already registered as a member?</span>
            <Link href="/login" className="login-link">
              Sign In to Portal <ArrowRight size={12} style={{ marginLeft: "0.4rem" }} />
            </Link>
          </div>
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
          gap: 2.4rem;
        }

        .perks-block__title {
          color: rgba(0,0,0,0.45);
        }

        .google-signup-btn {
          width: 100%;
          padding: 1.6rem;
          background: #ffffff;
          color: #000000;
          border: 0.1rem solid rgba(0,0,0,0.18);
          font-size: 1.3rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.2rem;
          transition: all 0.2s ease;
          box-shadow: 0 0.2rem 0.6rem rgba(0,0,0,0.04);
        }

        .google-signup-btn:hover {
          background: #f7f9fc;
          border-color: #000000;
        }

        .divider-line {
          text-align: center;
          border-bottom: 0.1rem solid rgba(0,0,0,0.1);
          line-height: 0.1em;
          margin: 1rem 0;
        }

        .divider-line span {
          background: #eaeef4;
          padding: 0 1.2rem;
          font-size: 1rem;
          letter-spacing: 0.08em;
          color: rgba(0,0,0,0.4);
          font-weight: 700;
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
          font-family: var(--font-jost), 'Jost', sans-serif;
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

        .error-alert {
          background: #fde8e8;
          border: 0.1rem solid #f8b4b4;
          color: #9b1c1c;
          padding: 1.2rem 1.6rem;
          font-size: 1.3rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          font-weight: 600;
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

        .success-actions {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .login-now-btn {
          background: #000;
          color: #fff;
          padding: 1rem 1.6rem;
          font-weight: 700;
          text-decoration: none;
        }

        .login-prompt {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 2rem;
          border-top: 0.1rem solid rgba(0,0,0,0.1);
          font-size: 1.3rem;
          color: rgba(0,0,0,0.6);
        }

        .login-link {
          color: #000;
          font-weight: 700;
          text-decoration: none;
          display: flex;
          align-items: center;
          text-transform: uppercase;
          font-size: 1.1rem;
          letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  );
}
