"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, ArrowRight, KeyRound, AlertCircle } from "lucide-react";
import { loginWithEmail, signInWithGoogle, resetUserPassword } from "@/lib/firebaseAuth";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Admin Access Rule: Admin Console is strictly exclusive to /admin/login
    if (formData.email.trim().toLowerCase() === "info@aarenintpro.com") {
      setError("🔒 Master Admin Console is strictly exclusive to https://aarenstudio.vercel.app/admin/login. Please sign in at /admin/login.");
      return;
    }

    setLoading(true);

    const res = await loginWithEmail(formData.email, formData.password);
    setLoading(false);

    if (res.success) {
      router.push("/");
    } else {
      setError(res.error || "Login failed. Please check your credentials.");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);

    const res = await signInWithGoogle();
    setGoogleLoading(false);

    if (res.success) {
      router.push("/");
    } else {
      setError(res.error || "Google Sign-In failed.");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;

    const res = await resetUserPassword(resetEmail);
    if (res.success) {
      setResetSuccess(true);
    } else {
      alert("Error: " + res.error);
    }
  };

  return (
    <div className="login-page">
      {/* ── Page Header ── */}
      <div className="login-header">
        <div className="login-header__inner">
          <div className="login-header__meta t-tag" style={{ color: "rgba(0,0,0,0.4)", marginBottom: "2.4rem" }}>
            MEMBER PORTAL — Welcome Back
          </div>
          <h1 className="login-header__title">Sign In</h1>
          <p className="login-header__desc t-body" style={{ color: "rgba(0,0,0,0.5)", maxWidth: "52rem" }}>
            Access trade member specifications, saved projects, priority sampling, and direct architectural concierge services.
          </p>
        </div>
      </div>

      <div className="login-container">
        {/* Left Side: Brand Perks & Google Sign In */}
        <div className="login-perks">
          <div className="perks-block">
            <h4 className="perks-block__title t-tag">QUICK SIGN IN</h4>
            
            <p className="perk-intro">
              Sign in instantly with your Google account to access your Aaren Studio member workspace.
            </p>

            {/* GOOGLE SIGN IN BUTTON */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="google-signin-btn"
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
              <span>{googleLoading ? "Connecting Google..." : "Continue with Google"}</span>
            </button>

            <div className="divider-line">
              <span>OR EMAIL SIGN IN</span>
            </div>

            <div className="login-benefits-list">
              <div className="benefit-item">
                <span className="benefit-dot" />
                <span>Instant access to BIM & CAD files</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-dot" />
                <span>Direct sample cart request tracking</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-dot" />
                <span>Exclusive trade pricing discounts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Email Password Form */}
        <div className="login-form-wrapper">
          <h2 className="form-title">ACCOUNT CREDENTIALS</h2>

          {error && (
            <div className="error-alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="login-form">
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
              <div className="form-label-row">
                <label className="form-label">Password</label>
                <button
                  type="button"
                  onClick={() => setShowResetModal(true)}
                  className="forgot-pass-btn"
                >
                  Forgot Password?
                </button>
              </div>
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
              {loading ? "Authenticating..." : "Sign In to Member Portal"}{" "}
              <LogIn size={14} style={{ marginLeft: "0.8rem" }} />
            </button>
          </form>

          <div className="signup-prompt">
            <span>Don't have a member profile yet?</span>
            <Link href="/signup" className="signup-link">
              Create an Account <ArrowRight size={12} style={{ marginLeft: "0.4rem" }} />
            </Link>
          </div>
        </div>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">RESET PASSWORD</h3>
            <p className="modal-desc">
              Enter your registered email address and we'll send you a password reset link.
            </p>

            {resetSuccess ? (
              <div className="modal-success">
                ✅ Password reset link has been sent to your email address!
                <button
                  onClick={() => {
                    setShowResetModal(false);
                    setResetSuccess(false);
                  }}
                  className="modal-close-btn"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="modal-form">
                <input
                  type="email"
                  required
                  placeholder="name@studio.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="form-input"
                />
                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => setShowResetModal(false)}
                    className="modal-cancel-btn"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="modal-submit-btn">
                    Send Reset Link <KeyRound size={12} style={{ marginLeft: "0.4rem" }} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <style>{`
        .login-page {
          background: #eaeef4;
          color: #000;
          min-height: 100vh;
          padding-top: 8rem;
        }

        .login-header {
          padding: 6rem 0.8rem 4rem;
          border-bottom: 0.1rem solid rgba(0,0,0,0.12);
        }

        @media (min-width: 768px) {
          .login-header {
            padding: 8rem 1.2rem 4rem;
          }
        }

        .login-header__title {
          font-size: clamp(6rem, 15vw, 22rem);
          font-weight: 700;
          letter-spacing: -0.05em;
          line-height: 0.88;
          text-transform: uppercase;
          color: #000;
          margin-bottom: 3.2rem;
        }

        .login-header__desc {
          font-size: 1.5rem;
          line-height: 1.5;
          letter-spacing: -0.01em;
        }

        .login-container {
          display: flex;
          flex-direction: column;
          border-bottom: 0.1rem solid rgba(0,0,0,0.12);
        }

        @media (min-width: 992px) {
          .login-container {
            flex-direction: row;
          }
        }

        .login-perks {
          flex: 1;
          border-bottom: 0.1rem solid rgba(0,0,0,0.12);
          display: flex;
          flex-direction: column;
        }

        @media (min-width: 992px) {
          .login-perks {
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

        .perk-intro {
          font-size: 1.4rem;
          line-height: 1.5;
          color: rgba(0,0,0,0.6);
        }

        .google-signin-btn {
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

        .google-signin-btn:hover {
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

        .login-benefits-list {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          margin-top: 1rem;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 1.3rem;
          color: rgba(0,0,0,0.7);
        }

        .benefit-dot {
          width: 0.6rem;
          height: 0.6rem;
          border-radius: 50%;
          background: #000;
        }

        .login-form-wrapper {
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

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 2.4rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .form-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .form-label {
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 700;
          color: rgba(0,0,0,0.5);
        }

        .forgot-pass-btn {
          background: none;
          border: none;
          font-size: 1.1rem;
          color: #80673f;
          font-weight: 700;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .forgot-pass-btn:hover {
          text-decoration: underline;
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

        .signup-prompt {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 2rem;
          border-top: 0.1rem solid rgba(0,0,0,0.1);
          font-size: 1.3rem;
          color: rgba(0,0,0,0.6);
        }

        .signup-link {
          color: #000;
          font-weight: 700;
          text-decoration: none;
          display: flex;
          align-items: center;
          text-transform: uppercase;
          font-size: 1.1rem;
          letter-spacing: 0.05em;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 2rem;
        }

        .modal-content {
          background: #eaeef4;
          border: 0.1rem solid #000;
          padding: 3.2rem;
          max-width: 48rem;
          width: 100%;
          box-shadow: 0 1rem 3rem rgba(0,0,0,0.2);
        }

        .modal-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .modal-desc {
          font-size: 1.3rem;
          color: rgba(0,0,0,0.6);
          margin-bottom: 2rem;
          line-height: 1.5;
        }

        .modal-actions {
          display: flex;
          gap: 1.2rem;
          margin-top: 2rem;
          justify-content: flex-end;
        }

        .modal-cancel-btn {
          padding: 1.2rem 2rem;
          background: transparent;
          border: 0.1rem solid rgba(0,0,0,0.2);
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
        }

        .modal-submit-btn {
          padding: 1.2rem 2rem;
          background: #000;
          color: #fff;
          border: none;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .modal-success {
          font-size: 1.4rem;
          color: #03543f;
          background: #def7ec;
          padding: 2rem;
          border: 0.1rem solid #84e1bc;
          display: flex;
          flex-direction: column;
          gap: 1.6rem;
        }

        .modal-close-btn {
          padding: 1rem 1.6rem;
          background: #03543f;
          color: #fff;
          border: none;
          font-weight: 700;
          cursor: pointer;
          align-self: flex-start;
        }
      `}</style>
    </div>
  );
}
