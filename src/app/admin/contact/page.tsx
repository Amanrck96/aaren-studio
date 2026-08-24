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
      <div style={{ background: "#0a0a0c", color: "#fff", minHeight: "100vh" }}>
        <AdminNav />
        <div style={{ padding: "4rem", textAlign: "center", color: "#888" }}>Loading settings...</div>
      </div>
    );
  }

  return (
    <div style={{ background: "#0a0a0c", color: "#f0f0f2", minHeight: "100vh" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <span style={{ color: "#f43f5e", fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>SYSTEM CONTROLS</span>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, margin: "0.3rem 0" }}>Contact Us, Footer & Webhook Settings</h1>
          <p style={{ color: "#aaa", fontSize: "0.95rem" }}>Edit official contact info, Google Map URL, footer quick links, social media URLs, and Google Sheets Webhook URL.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Section 1: Contact Page Info */}
          <div style={{ background: "#141418", border: "1px solid #222", borderRadius: "12px", padding: "2rem" }}>
            <h2 style={{ fontSize: "1.3rem", color: "#f43f5e", marginBottom: "1.2rem", borderBottom: "1px solid #222", paddingBottom: "0.6rem" }}>4. Contact Us Page Info</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem", fontWeight: 600 }}>Primary Email *</label>
                  <input
                    type="email"
                    required
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    style={{ width: "100%", padding: "0.8rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem", fontWeight: 600 }}>Phone Number *</label>
                  <input
                    type="text"
                    required
                    pattern="[+0-9\s-]+"
                    value={settings.contactPhone}
                    onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                    style={{ width: "100%", padding: "0.8rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem", fontWeight: 600 }}>Address *</label>
                <textarea
                  rows={2}
                  required
                  value={settings.contactAddress}
                  onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                  style={{ width: "100%", padding: "0.8rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem", fontWeight: 600 }}>Google Maps Embed / Link URL</label>
                <input
                  type="text"
                  value={settings.googleMapUrl || ""}
                  onChange={(e) => setSettings({ ...settings, googleMapUrl: e.target.value })}
                  style={{ width: "100%", padding: "0.8rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Google Sheets Webhook Sync */}
          <div style={{ background: "#141418", border: "1px solid #222", borderRadius: "12px", padding: "2rem" }}>
            <h2 style={{ fontSize: "1.3rem", color: "#84cc16", marginBottom: "0.5rem" }}>⚡ Google Sheets Webhook Real-Time Sync</h2>
            <p style={{ color: "#aaa", fontSize: "0.88rem", marginBottom: "1.2rem" }}>
              Paste your Google Apps Script, Make.com, or Zapier Webhook URL here. Every lead from the Contact Form or Protected PDF Gate will immediately log into your Google Sheet!
            </p>
            <input
              type="url"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={settings.webhookUrl || ""}
              onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
              style={{ width: "100%", padding: "0.8rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
            />
          </div>

          {/* Section 3: Footer Settings */}
          <div style={{ background: "#141418", border: "1px solid #222", borderRadius: "12px", padding: "2rem" }}>
            <h2 style={{ fontSize: "1.3rem", color: "#3b82f6", marginBottom: "1.2rem", borderBottom: "1px solid #222", paddingBottom: "0.6rem" }}>5. Footer Options & Social Links</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem", fontWeight: 600 }}>Copyright Text *</label>
                <input
                  type="text"
                  required
                  value={settings.copyrightText}
                  onChange={(e) => setSettings({ ...settings, copyrightText: e.target.value })}
                  style={{ width: "100%", padding: "0.8rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "1rem",
              background: "linear-gradient(135deg, #f43f5e 0%, #be123c 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: saving ? "wait" : "pointer",
            }}
          >
            {saving ? "Saving..." : "💾 Save All Contact & Footer Settings"}
          </button>

          {message && (
            <div style={{ padding: "0.9rem", borderRadius: "6px", background: message.startsWith("Error") ? "rgba(239, 68, 68, 0.2)" : "rgba(34, 197, 94, 0.2)", color: message.startsWith("Error") ? "#f87171" : "#4ade80", fontSize: "0.9rem" }}>
              {message}
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
