"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { loginWithEmail, signInWithGoogle, resetUserPassword } from "@/lib/firebaseAuth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // If already logged in, go straight to workspace
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        // Persist auth state so getLoggedInUser() works site-wide (e.g. catalog gate)
        try {
          localStorage.setItem("aaren_firebase_authed", "true");
          localStorage.setItem("aaren_firebase_user", JSON.stringify({
            email: user.email || "",
            displayName: user.displayName || user.email?.split("@")[0] || "Studio Member",
            uid: user.uid,
          }));
        } catch (_) {}
        window.location.href = "/modules/aaren-intpro-designer-workspace.html";
      } else {
        // Clear Firebase auth flag on sign-out
        try {
          localStorage.removeItem("aaren_firebase_authed");
          localStorage.removeItem("aaren_firebase_user");
        } catch (_) {}
        setCheckingAuth(false);
      }
    });
    return () => unsub();
  }, []);

  const redirect = () => {
    window.location.href = "/modules/aaren-intpro-designer-workspace.html";
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // Block admin email from user login
    if (formData.email.trim().toLowerCase() === "info@aarenintpro.com") {
      setError("Admin login is at aarenstudio.vercel.app/admin/login");
      return;
    }
    setLoading(true);
    const res = await loginWithEmail(formData.email, formData.password);
    setLoading(false);
    if (res.success) redirect();
    else setError(res.error || "Login failed. Check your credentials.");
  };

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    const res = await signInWithGoogle();
    setGoogleLoading(false);
    if (res.success) redirect();
    else setError(res.error || "Google sign-in failed.");
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await resetUserPassword(resetEmail);
    if (res.success) setResetSent(true);
    else setError(res.error || "Failed to send reset email.");
  };

  if (checkingAuth) {
    return (
      <div style={{ background: "#FFFFFF", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 36, height: 36, border: "3px solid rgba(200,169,110,.25)", borderTopColor: "#C8A96E", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
      </div>
    );
  }

  return (
    <>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'Inter',sans-serif;background:#FFFFFF;color:#1C1917;}
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .os-login{min-height:100vh;background:#FFFFFF;display:flex;flex-direction:column;}
        .os-topbar{display:flex;align-items:center;justify-content:space-between;padding:18px 28px;border-bottom:1px solid #E8E3D7;background:#FFFFFF;}
        .os-brand{display:flex;align-items:center;gap:10px;font-weight:800;font-size:15px;color:#81663F;text-decoration:none;}
        .os-brand-mark{width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#D4B67D,#C8A96E);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;color:#fff;}
        .os-center{flex:1;display:flex;align-items:center;justify-content:center;padding:28px 20px;background:#FFFFFF;}
        .os-card{width:100%;max-width:420px;background:#FFFFFF;border:1px solid #E8E3D7;border-radius:20px;padding:36px;box-shadow:0 10px 40px rgba(0,0,0,.05);}
        .os-card-title{font-size:22px;font-weight:800;color:#81663F;margin-bottom:4px;}
        .os-card-sub{font-size:13px;color:#5E5852;margin-bottom:28px;}
        .os-field{margin-bottom:16px;}
        .os-label{display:block;font-size:11.5px;font-weight:600;color:#5E5852;margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em;}
        .os-input{width:100%;padding:12px 14px;border-radius:10px;border:1px solid #D8D0BE;background:#FAF9F6;color:#1C1917;font-size:13.5px;outline:none;transition:border-color .2s,box-shadow .2s;font-family:inherit;}
        .os-input:focus{border-color:#C8A96E;box-shadow:0 0 0 3px rgba(200,169,110,0.15);}
        .os-input::placeholder{color:#8A8279;}
        .os-btn-primary{width:100%;padding:13px;border-radius:10px;border:none;background:linear-gradient(135deg,#D4B67D 0%,#C8A96E 40%,#B38E46 100%) !important;color:#fff !important;font-size:13.5px;font-weight:700;cursor:pointer;box-shadow:0 6px 20px rgba(184,147,85,.35) !important;transition:all .15s;font-family:inherit;}
        .os-btn-primary:hover{background:linear-gradient(135deg,#DFCA9B 0%,#D4B67D 40%,#C29B52 100%) !important;transform:translateY(-1px);box-shadow:0 8px 24px rgba(184,147,85,.45) !important;}
        .os-btn-primary:disabled{opacity:.6;cursor:not-allowed;transform:none;}
        .os-btn-google{width:100%;padding:12px;border-radius:10px;border:1px solid #D8D0BE;background:#FFFFFF;color:#81663F;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:20px;transition:border-color .2s,background-color .2s;font-family:inherit;}
        .os-btn-google:hover{border-color:#C8A96E;background:#FAF9F6;}
        .os-divider{display:flex;align-items:center;gap:12px;margin-bottom:20px;}
        .os-divider::before,.os-divider::after{content:'';flex:1;height:1px;background:#E8E3D7;}
        .os-divider span{font-size:11px;color:#8A8279;font-weight:600;text-transform:uppercase;letter-spacing:.06em;}
        .os-error{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.25);border-radius:9px;padding:11px 14px;font-size:12.5px;color:#EF4444;margin-bottom:16px;font-weight:600;}
        .os-forgot{background:none;border:none;color:#81663F;font-size:12px;font-weight:600;cursor:pointer;padding:0;font-family:inherit;}
        .os-forgot:hover{color:#C8A96E;text-decoration:underline;}
        .os-field-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;}
        .os-footer{text-align:center;margin-top:20px;font-size:12.5px;color:#5E5852;}
        .os-footer a{color:#81663F;font-weight:600;text-decoration:none;}
        .os-footer a:hover{color:#C8A96E;text-decoration:underline;}
        .os-modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;z-index:100;padding:20px;}
        .os-modal{background:#FFFFFF;border:1px solid #E8E3D7;border-radius:20px;padding:28px;width:100%;max-width:400px;box-shadow:0 12px 40px rgba(0,0,0,.12);}
        .os-modal h3{font-size:16px;font-weight:800;color:#81663F;margin-bottom:4px;}
        .os-modal p{font-size:12.5px;color:#5E5852;margin-bottom:20px;line-height:1.6;}
        .os-modal-btns{display:flex;gap:10px;margin-top:16px;}
        .os-btn-ghost{padding:10px 16px;border-radius:9px;border:1px solid #D8D0BE;background:#FFFFFF;color:#81663F;font-size:12.5px;font-weight:600;cursor:pointer;font-family:inherit;}
        .os-btn-ghost:hover{border-color:#C8A96E;background:#FAF9F6;}
        .os-success{background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.25);border-radius:9px;padding:12px 14px;font-size:12.5px;color:#15803D;font-weight:600;}
        @keyframes spin{to{transform:rotate(360deg);}}
        .spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;display:inline-block;margin-right:8px;}
      `}</style>

      <div className="os-login">
        {/* Top bar */}
        <div className="os-topbar">
          <a href="/" className="os-brand">
            <div className="os-brand-mark">A</div>
            <span>Aaren IntPro OS</span>
          </a>
          <div style={{ fontSize: 12, color: "#5E5852" }}>
            New user?{" "}
            <Link href="/signup" style={{ color: "#81663F", fontWeight: 700, textDecoration: "none" }}>
              Create account →
            </Link>
          </div>
        </div>

        {/* Card */}
        <div className="os-center">
          <div className="os-card">
            <div className="os-card-title">Welcome back</div>
            <div className="os-card-sub">Sign in to your Designer Workspace</div>

            {error && <div className="os-error">{error}</div>}

            {/* Google */}
            <button className="os-btn-google" onClick={handleGoogle} disabled={googleLoading}>
              {googleLoading ? <span className="spinner" /> : (
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              )}
              {googleLoading ? "Connecting…" : "Continue with Google"}
            </button>

            <div className="os-divider"><span>or</span></div>

            {/* Email form */}
            <form onSubmit={handleEmailLogin}>
              <div className="os-field">
                <label className="os-label">Email</label>
                <input
                  className="os-input"
                  type="email"
                  required
                  placeholder="you@studio.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="os-field">
                <div className="os-field-row">
                  <label className="os-label" style={{ margin: 0 }}>Password</label>
                  <button type="button" className="os-forgot" onClick={() => setShowReset(true)}>
                    Forgot password?
                  </button>
                </div>
                <input
                  className="os-input"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <button type="submit" className="os-btn-primary" disabled={loading} style={{ marginTop: 8 }}>
                {loading ? <><span className="spinner" />Signing in…</> : "Sign In to Workspace →"}
              </button>
            </form>

            <div className="os-footer" style={{ marginTop: 24 }}>
              <span>Don't have an account? </span>
              <Link href="/signup">Create one free →</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Modal */}
      {showReset && (
        <div className="os-modal-bg" onClick={() => setShowReset(false)}>
          <div className="os-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Reset Password</h3>
            <p>Enter your registered email and we'll send a reset link.</p>
            {resetSent ? (
              <div className="os-success">✓ Reset link sent! Check your inbox.</div>
            ) : (
              <form onSubmit={handleReset}>
                <input
                  className="os-input"
                  type="email"
                  required
                  placeholder="you@studio.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
                <div className="os-modal-btns">
                  <button type="button" className="os-btn-ghost" onClick={() => setShowReset(false)}>Cancel</button>
                  <button type="submit" className="os-btn-primary" style={{ flex: 1 }}>Send Reset Link</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
