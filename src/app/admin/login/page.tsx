"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        document.cookie = "aaren_admin_session=authenticated; path=/; max-age=86400; SameSite=Lax";
        localStorage.setItem("aaren_admin_session", "authenticated");

        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 300);
      } else {
        setError(data.error || "Invalid Administrative Email or Password.");
        setLoading(false);
      }
    } catch (err) {
      setError("Network or authentication error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#FAF8F5", color: "#1E1E1E", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
      <div style={{ width: "100%", maxWidth: "440px", background: "#FFFFFF", border: "1px solid #DCD5C6", borderRadius: "16px", padding: "2.5rem", boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <span style={{ color: "#81663F", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 800 }}>AAREN STUDIO</span>
          <h1 style={{ fontSize: "2rem", fontWeight: 900, margin: "0.4rem 0", color: "#1E1E1E" }}>Master Admin Login</h1>
          <p style={{ color: "#555555", fontSize: "0.9rem" }}>Enter official credentials to access the control panel.</p>
        </div>

        {error && (
          <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", color: "#DC2626", padding: "0.8rem", borderRadius: "8px", fontSize: "0.85rem", textAlign: "center", marginBottom: "1.5rem", fontWeight: 700 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", marginBottom: "0.4rem", fontWeight: 700 }}>Admin Email ID</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="info@aarenintpro.com"
              style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px", fontSize: "0.95rem", outline: "none" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", marginBottom: "0.4rem", fontWeight: 700 }}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px", fontSize: "0.95rem", outline: "none" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "0.5rem",
              padding: "0.9rem",
              background: "#1E1E1E",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              fontWeight: 800,
              fontSize: "0.95rem",
              cursor: loading ? "wait" : "pointer",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.12)",
            }}
          >
            {loading ? "Authenticating..." : "🔒 Log In to Admin Panel"}
          </button>
        </form>

        <div style={{ marginTop: "2rem", borderTop: "1px solid #EAE4D8", paddingTop: "1rem", textAlign: "center", fontSize: "0.8rem", color: "#6A6359", fontWeight: 600 }}>
          Protected Administrative Portal — Aaren Studio © 2026
        </div>
      </div>
    </div>
  );
}
