"use client";

import { useState, useEffect } from "react";
import AdminNav from "@/components/AdminNav";
import { SiteSettingsItem } from "@/lib/types";

export default function AdminContactPage() {
  const [settings, setSettings] = useState<SiteSettingsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch("/api/site-settings");
      const json = await res.json();
      if (json.success) setSettings(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;

    if (settings.webhookUrl && !settings.webhookUrl.startsWith("https://")) {
      setMessage("Error: Webhook URL must start with https://");
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const json = await res.json();
      if (json.success) {
        setMessage("🎉 Contact info, Footer settings & Webhook URL updated!");
      } else {
        setMessage(`Error: ${json.error}`);
      }
    } catch (err: any) {
      setMessage(`Failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading || !settings) {
    return (
      <div style={{ background: "#FAF8F5", color: "#1E1E1E", minHeight: "100vh" }}>
        <AdminNav />
        <div style={{ padding: "4rem", textAlign: "center", color: "#6A6359" }}>Loading settings...</div>
      </div>
    );
  }

  return (
    <div style={{ background: "#FAF8F5", color: "#1E1E1E", minHeight: "100vh" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem", background: "#FAF8F5" }}>
        <div style={{ marginBottom: "2rem", borderBottom: "1px solid #DCD5C6", paddingBottom: "1.2rem" }}>
          <span style={{ color: "#81663F", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 800 }}>SYSTEM CONTROLS</span>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 900, margin: "0.2rem 0", color: "#1E1E1E" }}>Contact Us, Footer & Webhook Settings</h1>
          <p style={{ color: "#555555", fontSize: "0.95rem" }}>Edit official contact info, Google Map URL, footer quick links, social media URLs, and Google Sheets Webhook URL.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Section 1: Contact Page Info */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E2DCD2", borderRadius: "16px", padding: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#81663F", marginBottom: "1.2rem", borderBottom: "1px solid #EAE4D8", paddingBottom: "0.6rem" }}>Contact Us Page Info</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", marginBottom: "0.4rem", fontWeight: 700 }}>Primary Email *</label>
                  <input
                    type="email"
                    required
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", marginBottom: "0.4rem", fontWeight: 700 }}>Phone Number *</label>
                  <input
                    type="text"
                    required
                    pattern="[+0-9\s-]+"
                    value={settings.contactPhone}
                    onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                    style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", marginBottom: "0.4rem", fontWeight: 700 }}>Address *</label>
                <textarea
                  rows={2}
                  required
                  value={settings.contactAddress}
                  onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", marginBottom: "0.4rem", fontWeight: 700 }}>Google Maps Embed / Link URL</label>
                <input
                  type="text"
                  value={settings.googleMapUrl || ""}
                  onChange={(e) => setSettings({ ...settings, googleMapUrl: e.target.value })}
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Google Sheets Webhook Sync */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E2DCD2", borderRadius: "16px", padding: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#81663F", marginBottom: "0.5rem" }}>⚡ Google Sheets Webhook Real-Time Sync</h2>
            <p style={{ color: "#555555", fontSize: "0.88rem", marginBottom: "1.2rem" }}>
              Paste your Google Apps Script, Make.com, or Zapier Webhook URL here. Every lead from the Contact Form or Protected PDF Gate will immediately log into your Google Sheet!
            </p>
            <input
              type="url"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={settings.webhookUrl || ""}
              onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
              style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
            />
          </div>

          {/* Section 3: Footer Settings */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E2DCD2", borderRadius: "16px", padding: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#81663F", marginBottom: "1.2rem", borderBottom: "1px solid #EAE4D8", paddingBottom: "0.6rem" }}>Footer Options & Social Links</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", marginBottom: "0.4rem", fontWeight: 700 }}>Copyright Text *</label>
                <input
                  type="text"
                  required
                  value={settings.copyrightText}
                  onChange={(e) => setSettings({ ...settings, copyrightText: e.target.value })}
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "1rem",
              background: "#1E1E1E",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              fontWeight: 800,
              fontSize: "1rem",
              cursor: saving ? "wait" : "pointer",
              boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
            }}
          >
            {saving ? "Saving..." : "💾 Save All Contact & Footer Settings"}
          </button>

          {message && (
            <div style={{ padding: "0.9rem 1.2rem", borderRadius: "8px", background: message.startsWith("Error") || message.startsWith("Failed") ? "#FEE2E2" : "#DCFCE7", color: message.startsWith("Error") || message.startsWith("Failed") ? "#DC2626" : "#15803D", fontSize: "0.9rem", fontWeight: 700, border: message.startsWith("Error") || message.startsWith("Failed") ? "1px solid #FCA5A5" : "1px solid #86EFAC" }}>
              {message}
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
