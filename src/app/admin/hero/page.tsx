"use client";

import { useState, useEffect } from "react";
import AdminNav from "@/components/AdminNav";
import { SiteSettingsItem } from "@/lib/types";

export default function AdminHeroPage() {
  const [settings, setSettings] = useState<SiteSettingsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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
    if (!settings.heroCategories.includes(categoryInput.trim())) {
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
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "Hero Videos");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (json.success && json.url) {
        setSettings((prev) => (prev ? { ...prev, heroVideoUrl: json.url } : null));
        alert("✅ Background MP4 Video uploaded successfully to " + json.url);
      } else alert("Upload failed: " + json.error);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  if (loading || !settings) {
    return (
      <div style={{ background: "#0a0a0c", color: "#fff", minHeight: "100vh" }}>
        <AdminNav />
        <div style={{ padding: "4rem", textAlign: "center", color: "#888" }}>Loading Hero settings...</div>
      </div>
    );
  }

  return (
    <div style={{ background: "#0a0a0c", color: "#f0f0f2", minHeight: "100vh" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <span style={{ color: "#3b82f6", fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>HOMEPAGE CONTROLS</span>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, margin: "0.3rem 0" }}>Hero Section Editor</h1>
          <p style={{ color: "#aaa", fontSize: "0.95rem" }}>Update main header title, tagline, background MP4 video URL, and hero category tags.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ background: "#141418", border: "1px solid #222", borderRadius: "12px", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.4rem", fontWeight: 600 }}>Main Header Title *</label>
            <input
              type="text"
              required
              value={settings.heroTitle}
              onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
              style={{ width: "100%", padding: "0.8rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px", fontSize: "1rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.4rem", fontWeight: 600 }}>Hero Tagline *</label>
            <input
              type="text"
              required
              value={settings.heroTagline}
              onChange={(e) => setSettings({ ...settings, heroTagline: e.target.value })}
              style={{ width: "100%", padding: "0.8rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px", fontSize: "1rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.4rem", fontWeight: 600 }}>Hero Subtext Description</label>
            <textarea
              rows={3}
              value={settings.heroSubtext}
              onChange={(e) => setSettings({ ...settings, heroSubtext: e.target.value })}
              style={{ width: "100%", padding: "0.8rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px", fontSize: "0.95rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.4rem", fontWeight: 600 }}>Background MP4 Video URL *</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                required
                value={settings.heroVideoUrl}
                onChange={(e) => setSettings({ ...settings, heroVideoUrl: e.target.value })}
                style={{ flex: 1, padding: "0.8rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px", fontSize: "0.95rem" }}
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
                  padding: "0.8rem 1.2rem",
                  background: "#2563eb",
                  color: "#fff",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                💻 Upload Video From Computer
              </label>
            </div>
            <p style={{ fontSize: "0.8rem", color: "#777", marginTop: "0.4rem" }}>Direct link to MP4 video file or select any MP4 video directly from your computer.</p>
          </div>

          {/* Categories Bar Control */}
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.6rem", fontWeight: 600 }}>Categories Bar Tags (Displayed under Hero)</label>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
              <input
                type="text"
                placeholder="Add category tag (e.g. Laminate)"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                style={{ flex: 1, padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px", fontSize: "0.9rem" }}
              />
              <button
                type="button"
                onClick={addCategoryTag}
                style={{ padding: "0.7rem 1.2rem", background: "#222", color: "#fff", border: "1px solid #444", borderRadius: "6px", cursor: "pointer", fontWeight: 600 }}
              >
                + Add Tag
              </button>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
              {settings.heroCategories.map((tag) => (
                <span
                  key={tag}
                  style={{
                    background: "#222",
                    border: "1px solid #333",
                    color: "#eee",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "20px",
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeCategoryTag(tag)}
                    style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: "0.9rem", padding: 0 }}
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
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: saving ? "wait" : "pointer",
            }}
          >
            {saving ? "Saving Changes..." : "💾 Save & Sync Live Homepage"}
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
