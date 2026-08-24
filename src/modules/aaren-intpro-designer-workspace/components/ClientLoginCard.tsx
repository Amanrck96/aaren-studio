"use client";

import React, { useState } from "react";
import { Lock, Mail, KeyRound, ArrowRight, ShieldCheck } from "lucide-react";

interface ClientLoginCardProps {
  onLoginSuccess: (client: any, token: string) => void;
}

export default function ClientLoginCard({ onLoginSuccess }: ClientLoginCardProps) {
  const [emailOrCode, setEmailOrCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrCode.trim()) {
      setError("Please provide your registered client email or project access code.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/workspace/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrCode: emailOrCode.trim(), password: password.trim() }),
      });

      if (!res.ok) {
        setError("Authentication failed. Please check your credentials.");
        return;
      }

      let json;
      try {
        json = await res.json();
      } catch (err) {
        setError("Invalid response from server.");
        return;
      }

      if (!json.success) {
        setError(json.error || "Authentication failed. Please check your credentials.");
      } else {
        localStorage.setItem("aaren_client_token", json.token);
        localStorage.setItem("aaren_client_data", JSON.stringify(json.client));
        onLoginSuccess(json.client, json.token);
      }
    } catch (err: any) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 1.6rem",
        background: "#E6E2D8",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "#FAF9F6",
          borderRadius: "1.6rem",
          border: "1px solid rgba(129, 102, 63, 0.25)",
          boxShadow: "0 25px 60px -15px rgba(129, 102, 63, 0.15)",
          padding: "3.6rem 3.2rem",
          display: "flex",
          flexDirection: "column",
          gap: "2.4rem",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              background: "rgba(129, 102, 63, 0.1)",
              border: "1px solid rgba(129, 102, 63, 0.2)",
              padding: "0.5rem 1.2rem",
              borderRadius: "999px",
              fontSize: "1.1rem",
              fontWeight: 800,
              letterSpacing: "0.08em",
              color: "#81663F",
              textTransform: "uppercase",
              marginBottom: "1.4rem",
            }}
          >
            <ShieldCheck size={14} /> Client Portal Access
          </div>

          <h2
            style={{
              fontFamily: "var(--font-jost), 'Jost', sans-serif",
              fontSize: "2.8rem",
              fontWeight: 700,
              color: "#81663F",
              margin: "0 0 0.8rem",
              letterSpacing: "-0.02em",
            }}
          >
            Aaren Design Workspace
          </h2>
          <p style={{ fontSize: "1.35rem", color: "#5E5852", margin: 0, lineHeight: 1.5 }}>
            Sign in to review material specifications, approve drawings, and manage project milestone invoices.
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "rgba(220, 38, 38, 0.08)",
              border: "1px solid rgba(220, 38, 38, 0.3)",
              color: "#991B1B",
              padding: "1rem 1.4rem",
              borderRadius: "0.8rem",
              fontSize: "1.25rem",
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
          <div>
            <label
              htmlFor="emailOrCode"
              style={{
                display: "block",
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "#1C1917",
                marginBottom: "0.6rem",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Client Email or Project Access Code
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="emailOrCode"
                type="text"
                value={emailOrCode}
                onChange={(e) => setEmailOrCode(e.target.value)}
                placeholder="e.g. client@midastouch.com or AC-8492"
                style={{
                  width: "100%",
                  padding: "1.2rem 1.4rem 1.2rem 4rem",
                  borderRadius: "0.8rem",
                  border: "1px solid rgba(129, 102, 63, 0.3)",
                  background: "#FFFFFF",
                  fontSize: "1.35rem",
                  color: "#1C1917",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <Mail size={16} color="#81663F" style={{ position: "absolute", left: "1.4rem", top: "50%", transform: "translateY(-50%)" }} />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "#1C1917",
                marginBottom: "0.6rem",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Password or PIN (Optional)
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password if configured"
                style={{
                  width: "100%",
                  padding: "1.2rem 1.4rem 1.2rem 4rem",
                  borderRadius: "0.8rem",
                  border: "1px solid rgba(129, 102, 63, 0.3)",
                  background: "#FFFFFF",
                  fontSize: "1.35rem",
                  color: "#1C1917",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <KeyRound size={16} color="#81663F" style={{ position: "absolute", left: "1.4rem", top: "50%", transform: "translateY(-50%)" }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "0.8rem",
              width: "100%",
              background: "#81663F",
              color: "#FFFFFF",
              border: "none",
              padding: "1.2rem",
              borderRadius: "0.8rem",
              fontSize: "1.35rem",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.8rem",
              transition: "all 0.2s ease",
            }}
          >
            <span>{loading ? "Authenticating..." : "Enter Client Workspace"}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ borderTop: "1px solid rgba(129, 102, 63, 0.15)", paddingTop: "1.4rem", textAlign: "center" }}>
          <p style={{ fontSize: "1.15rem", color: "#5E5852", margin: 0 }}>
            Need access to your project? Contact your Aaren Studio project lead at{" "}
            <a href="mailto:workspace@aarenstudio.com" style={{ color: "#81663F", fontWeight: 700, textDecoration: "none" }}>
              workspace@aarenstudio.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
