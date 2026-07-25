"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate exact admin credentials requested by owner
    if (email.trim().toLowerCase() === "info@aarenintpro.com" && password === "Admin012345") {
      // Set session cookie for Middleware protection
      document.cookie = "aaren_admin_session=authenticated; path=/; max-age=86400; SameSite=Lax";
      localStorage.setItem("aaren_admin_session", "authenticated");

      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 300);
    } else {
      setError("Invalid Administrative Email or Password.");
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#0a0a0c", color: "#fff", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
      <div style={{ width: "100%", maxWidth: "440px", background: "#141418", border: "1px solid #222", borderRadius: "12px", padding: "2.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <span style={{ color: "#3b82f6", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 800 }}>AAREN STUDIO</span>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: "0.4rem 0" }}>Master Admin Login</h1>
          <p style={{ color: "#888", fontSize: "0.85rem" }}>Enter official credentials to access the control panel.</p>
        </div>

        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.2)", border: "1px solid #f87171", color: "#f87171", padding: "0.8rem", borderRadius: "6px", fontSize: "0.85rem", textAlign: "center", marginBottom: "1.5rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", color: "#aaa", marginBottom: "0.4rem", fontWeight: 600 }}>Admin Email ID</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="info@aarenintpro.com"
              style={{ width: "100%", padding: "0.8rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px", fontSize: "0.95rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", color: "#aaa", marginBottom: "0.4rem", fontWeight: 600 }}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              style={{ width: "100%", padding: "0.8rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px", fontSize: "0.95rem" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "0.5rem",
              padding: "0.9rem",
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: loading ? "wait" : "pointer",
            }}
          >
            {loading ? "Authenticating..." : "🔒 Log In to Admin Panel"}
          </button>
        </form>

        <div style={{ marginTop: "2rem", borderTop: "1px solid #222", paddingTop: "1rem", textAlign: "center", fontSize: "0.75rem", color: "#666" }}>
          Protected Administrative Portal — Aaren Studio © 2026
        </div>
      </div>
    </div>
  );
}
