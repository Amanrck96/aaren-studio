"use client";

import { useState, useEffect } from "react";
import AdminNav from "@/components/AdminNav";
import { SiteSettingsItem } from "@/lib/types";
import { uploadFileWithCompression } from "@/lib/uploadHelper";

export default function AdminHeroPage() {
  const [settings, setSettings] = useState<SiteSettingsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [categoryInput, setCategoryInput] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch("/api/site-settings");
      const json = await res.json();
      if (json.success) {
        setSettings(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;

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
        setMessage("🎉 Hero section settings updated & synced live!");
      } else {
        setMessage(`Error: ${json.error}`);
      }
    } catch (err: any) {
      setMessage(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  function addCategoryTag() {
    if (!categoryInput.trim() || !settings) return;
    if (!settings.heroCategories.some(c => c.toLowerCase() === categoryInput.trim().toLowerCase())) {
      setSettings({ ...settings, heroCategories: [...settings.heroCategories, categoryInput.trim()] });
    }
    setCategoryInput("");
  }

  function removeCategoryTag(tag: string) {
    if (!settings) return;
    setSettings({ ...settings, heroCategories: settings.heroCategories.filter((c) => c !== tag) });
  }

  const handleVideoUpload = async (file: File) => {
    if (!file || !settings) return;
    setIsUploading(true);
    try {
      const result = await uploadFileWithCompression(file, "Hero Videos");
      if (result.success && (result.url || result.dataUrl)) {
        setSettings((prev) => (prev ? { ...prev, heroVideoUrl: result.dataUrl || result.url || "" } : null));
        alert("✅ Background MP4 Video uploaded successfully to Google Firebase Storage!");
      } else {
        alert("Upload failed: " + (result.error || "Upload error"));
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading || !settings) {
    return (
      <div style={{ background: "#FAF8F5", color: "#1E1E1E", minHeight: "100vh" }}>
        <AdminNav />
        <div style={{ padding: "4rem", textAlign: "center", color: "#6A6359" }}>Loading Hero settings...</div>
      </div>
    );
  }

  return (
    <div style={{ background: "#FAF8F5", color: "#1E1E1E", minHeight: "100vh" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem", background: "#FAF8F5" }}>
        <div style={{ marginBottom: "2rem", borderBottom: "1px solid #DCD5C6", paddingBottom: "1.2rem" }}>
          <span style={{ color: "#81663F", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 800 }}>HOMEPAGE CONTROLS</span>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 900, margin: "0.3rem 0", color: "#1E1E1E" }}>Hero Section Editor</h1>
          <p style={{ color: "#555555", fontSize: "0.95rem" }}>Update main header title, tagline, background MP4 video URL, and hero category tags.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ background: "#FFFFFF", border: "1px solid #E2DCD2", borderRadius: "16px", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", marginBottom: "0.4rem", fontWeight: 700 }}>Main Header Title *</label>
            <input
              type="text"
              required
              value={settings.heroTitle}
              onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
              style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px", fontSize: "1rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", marginBottom: "0.4rem", fontWeight: 700 }}>Hero Tagline *</label>
            <input
              type="text"
              required
              value={settings.heroTagline}
              onChange={(e) => setSettings({ ...settings, heroTagline: e.target.value })}
              style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px", fontSize: "1rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", marginBottom: "0.4rem", fontWeight: 700 }}>Hero Subtext Description</label>
            <textarea
              rows={3}
              value={settings.heroSubtext}
              onChange={(e) => setSettings({ ...settings, heroSubtext: e.target.value })}
              style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px", fontSize: "0.95rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", marginBottom: "0.4rem", fontWeight: 700 }}>Background MP4 Video URL *</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                required
                value={settings.heroVideoUrl}
                onChange={(e) => setSettings({ ...settings, heroVideoUrl: e.target.value })}
                style={{ flex: 1, padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px", fontSize: "0.95rem" }}
              />
              <input
                type="file"
                accept="video/mp4,video/webm,video/*"
                id="heroVideoUpload"
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) handleVideoUpload(e.target.files[0]);
                }}
              />
              <label
                htmlFor="heroVideoUpload"
                style={{
                  padding: "0.8rem 1.4rem",
                  background: isUploading ? "#9ca3af" : "#1E1E1E",
                  color: "#fff",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  cursor: isUploading ? "wait" : "pointer",
                  whiteSpace: "nowrap",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
                }}
              >
                {isUploading ? "Uploading..." : "💻 Upload Video From Computer"}
              </label>
            </div>
            <p style={{ fontSize: "0.8rem", color: "#6A6359", marginTop: "0.4rem" }}>Direct link to MP4 video file or select any MP4 video directly from your computer.</p>
          </div>

          {/* Categories Bar Control */}
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", marginBottom: "0.6rem", fontWeight: 700 }}>Categories Bar Tags (Displayed under Hero)</label>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
              <input
                type="text"
                placeholder="Add category tag (e.g. Laminate)"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                style={{ flex: 1, padding: "0.7rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px", fontSize: "0.9rem" }}
              />
              <button
                type="button"
                onClick={addCategoryTag}
                style={{ padding: "0.7rem 1.2rem", background: "#F4EFE6", color: "#1E1E1E", border: "1px solid #D5CEBF", borderRadius: "8px", cursor: "pointer", fontWeight: 700 }}
              >
                + Add Tag
              </button>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
              {settings.heroCategories.map((tag) => (
                <span
                  key={tag}
                  style={{
                    background: "rgba(129, 102, 63, 0.12)",
                    border: "1px solid rgba(129, 102, 63, 0.25)",
                    color: "#81663F",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "20px",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeCategoryTag(tag)}
                    style={{ background: "none", border: "none", color: "#DC2626", cursor: "pointer", fontSize: "0.9rem", padding: 0 }}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              marginTop: "1rem",
              padding: "1rem",
              background: "#1E1E1E",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: 800,
              fontSize: "1rem",
              cursor: saving ? "wait" : "pointer",
              boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
            }}
          >
            {saving ? "Saving Changes..." : "💾 Save & Sync Live Homepage"}
          </button>

          {message && (
            <div style={{ padding: "0.9rem", borderRadius: "8px", background: message.startsWith("Error") ? "#FEE2E2" : "#D1FAE5", color: message.startsWith("Error") ? "#B91C1C" : "#065F46", fontSize: "0.9rem", fontWeight: 700, border: "1px solid #DCD5C6" }}>
              {message}
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
