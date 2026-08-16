"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signUpWithEmail, signInWithGoogle } from "@/lib/firebaseAuth";
import { auth } from "@/lib/firebase";

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", sector: "Interior Designer" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        window.location.href = "/modules/aaren-intpro-designer-workspace.html";
      } else {
        setCheckingAuth(false);
      }
    });
    return () => unsub();
  }, []);

  const redirect = () => {
    window.location.href = "/modules/aaren-intpro-designer-workspace.html";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    const res = await signUpWithEmail(formData.name, formData.email, formData.password, formData.sector);
    setLoading(false);
    if (res.success) redirect();
    else setError(res.error || "Registration failed. Please try again.");
  };

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    const res = await signInWithGoogle(formData.sector);
    setGoogleLoading(false);
    if (res.success) redirect();
    else setError(res.error || "Google sign-up failed.");
  };

  const SECTORS = [
    "Interior Designer", "Architect", "Builder / Contractor",
    "Product Sourcing", "Manufacturer", "Dealer / Distributor", "Design Student"
  ];

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
        .os-signup{min-height:100vh;background:#FFFFFF;display:flex;flex-direction:column;}
        .os-topbar{display:flex;align-items:center;justify-content:space-between;padding:18px 28px;border-bottom:1px solid #E8E3D7;background:#FFFFFF;}
        .os-brand{display:flex;align-items:center;gap:10px;font-weight:800;font-size:15px;color:#81663F;text-decoration:none;}
        .os-brand-mark{width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#D4B67D,#C8A96E);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;color:#fff;}
        .os-center{flex:1;display:flex;align-items:center;justify-content:center;padding:28px 20px;background:#FFFFFF;}
        .os-card{width:100%;max-width:460px;background:#FFFFFF;border:1px solid #E8E3D7;border-radius:20px;padding:36px;box-shadow:0 10px 40px rgba(0,0,0,.05);}
        .os-card-title{font-size:22px;font-weight:800;color:#81663F;margin-bottom:4px;}
        .os-card-sub{font-size:13px;color:#5E5852;margin-bottom:28px;}
        .os-field{margin-bottom:16px;}
        .os-label{display:block;font-size:11.5px;font-weight:600;color:#5E5852;margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em;}
        .os-input{width:100%;padding:12px 14px;border-radius:10px;border:1px solid #D8D0BE;background:#FAF9F6;color:#1C1917;font-size:13.5px;outline:none;transition:border-color .2s,box-shadow .2s;font-family:inherit;}
        .os-input:focus{border-color:#C8A96E;box-shadow:0 0 0 3px rgba(200,169,110,0.15);}
        .os-input::placeholder{color:#8A8279;}
        .os-select{width:100%;padding:12px 14px;border-radius:10px;border:1px solid #D8D0BE;background:#FAF9F6;color:#1C1917;font-size:13.5px;outline:none;font-family:inherit;cursor:pointer;}
        .os-sector-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;}
        .sector-btn{padding:10px 8px;border-radius:10px;border:1px solid #D8D0BE;background:#FAF9F6;color:#5E5852;font-size:11.5px;font-weight:600;cursor:pointer;text-align:center;transition:all .15s;font-family:inherit;}
        .sector-btn.on{border-color:#C8A96E;background:rgba(200,169,110,.15);color:#81663F;font-weight:700;}
        .os-btn-primary{width:100%;padding:13px;border-radius:10px;border:none;background:linear-gradient(135deg,#D4B67D 0%,#C8A96E 40%,#B38E46 100%) !important;color:#fff !important;font-size:13.5px;font-weight:700;cursor:pointer;box-shadow:0 6px 20px rgba(184,147,85,.35) !important;transition:all .15s;font-family:inherit;}
        .os-btn-primary:hover{background:linear-gradient(135deg,#DFCA9B 0%,#D4B67D 40%,#C29B52 100%) !important;transform:translateY(-1px);box-shadow:0 8px 24px rgba(184,147,85,.45) !important;}
        .os-btn-primary:disabled{opacity:.6;cursor:not-allowed;transform:none;}
        .os-btn-google{width:100%;padding:12px;border-radius:10px;border:1px solid #D8D0BE;background:#FFFFFF;color:#81663F;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:20px;transition:border-color .2s,background-color .2s;font-family:inherit;}
        .os-btn-google:hover{border-color:#C8A96E;background:#FAF9F6;}
        .os-divider{display:flex;align-items:center;gap:12px;margin-bottom:20px;}
        .os-divider::before,.os-divider::after{content:'';flex:1;height:1px;background:#E8E3D7;}
        .os-divider span{font-size:11px;color:#8A8279;font-weight:600;text-transform:uppercase;letter-spacing:.06em;}
        .os-error{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.25);border-radius:9px;padding:11px 14px;font-size:12.5px;color:#EF4444;margin-bottom:16px;font-weight:600;}
        .os-footer{text-align:center;margin-top:20px;font-size:12.5px;color:#5E5852;}
        .os-footer a{color:#81663F;font-weight:600;text-decoration:none;}
        .os-footer a:hover{color:#C8A96E;text-decoration:underline;}
        @keyframes spin{to{transform:rotate(360deg);}}
        .spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;display:inline-block;margin-right:8px;}
      `}</style>

      <div className="os-signup">
        <div className="os-topbar">
          <a href="/" className="os-brand">
            <div className="os-brand-mark">A</div>
            <span>Aaren IntPro OS</span>
          </a>
          <div style={{ fontSize: 12, color: "#5E5852" }}>
            Have an account?{" "}
            <Link href="/login" style={{ color: "#81663F", fontWeight: 700, textDecoration: "none" }}>
              Sign in →
            </Link>
          </div>
        </div>

        <div className="os-center">
          <div className="os-card">
            <div className="os-card-title">Create your workspace</div>
            <div className="os-card-sub">Join Aaren IntPro OS — free for designers</div>

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
              {googleLoading ? "Connecting…" : "Sign up with Google"}
            </button>

            <div className="os-divider"><span>or fill in details</span></div>

            <form onSubmit={handleSubmit}>
              <div className="os-field">
                <label className="os-label">Your Role</label>
                <div className="os-sector-grid">
                  {SECTORS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`sector-btn ${formData.sector === s ? "on" : ""}`}
                      onClick={() => setFormData({ ...formData, sector: s })}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="os-field">
                <label className="os-label">Full Name</label>
                <input className="os-input" type="text" required placeholder="Ananya Sharma" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="os-field">
                <label className="os-label">Work Email</label>
                <input className="os-input" type="email" required placeholder="you@studio.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="os-field">
                <label className="os-label">Password</label>
                <input className="os-input" type="password" required placeholder="Min. 6 characters" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              </div>
              <button type="submit" className="os-btn-primary" disabled={loading} style={{ marginTop: 8 }}>
                {loading ? <><span className="spinner" />Creating workspace…</> : "Create My Workspace →"}
              </button>
            </form>

            <div className="os-footer" style={{ marginTop: 24 }}>
              <span>Already have an account? </span>
              <Link href="/login">Sign in →</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
