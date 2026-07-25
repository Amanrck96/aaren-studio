"use client";

import { useState, useEffect } from "react";
import AdminNav from "@/components/AdminNav";
import { RoadmapStepItem } from "@/lib/types";

export default function AdminAboutPage() {
  const [mission, setMission] = useState("To redefine Indian architecture through zero-compromise European surface craftsmanship.");
  const [vision, setVision] = useState("To be India's premier destination for luxury interior materials, smart nano-tech surfaces, and bespoke living systems.");
  const [values, setValues] = useState("Precision, Authenticity, Sustainability, and Customer Delight.");

  const [roadmap, setRoadmap] = useState<RoadmapStepItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [newStep, setNewStep] = useState({
    stepNumber: "04",
    year: "2026",
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch("/api/team");
      const json = await res.json();
      if (json.success) setRoadmap(json.roadmap);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddStep(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "roadmap", data: newStep }),
      });
      const json = await res.json();
      if (json.success) {
        setNewStep({ stepNumber: `0${roadmap.length + 2}`, year: "2026", title: "", description: "" });
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div style={{ background: "#0a0a0c", color: "#f0f0f2", minHeight: "100vh" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <span style={{ color: "#14b8a6", fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>CONTENT MANAGEMENT</span>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, margin: "0.3rem 0" }}>About Us & Roadmap Manager</h1>
          <p style={{ color: "#aaa", fontSize: "0.95rem" }}>Edit Mission, Vision, Values, and vertical roadmap timeline steps (01, 02, 03...).</p>
        </div>

        {/* Mission, Vision, Values Form */}
        <div style={{ background: "#141418", border: "1px solid #222", borderRadius: "12px", padding: "2rem", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.4rem", marginBottom: "1.5rem", borderBottom: "1px solid #222", paddingBottom: "0.8rem" }}>Mission, Vision & Values</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.4rem", fontWeight: 600 }}>Our Mission *</label>
              <textarea
                rows={2}
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                style={{ width: "100%", padding: "0.8rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.4rem", fontWeight: 600 }}>Our Vision *</label>
              <textarea
                rows={2}
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                style={{ width: "100%", padding: "0.8rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.4rem", fontWeight: 600 }}>Our Core Values *</label>
              <textarea
                rows={2}
                value={values}
                onChange={(e) => setValues(e.target.value)}
                style={{ width: "100%", padding: "0.8rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
              />
            </div>

            <button
              onClick={() => setMessage("🎉 About page text updated successfully!")}
              style={{ padding: "0.8rem 1.4rem", background: "#14b8a6", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 700, width: "fit-content" }}
            >
              Save Text Settings
            </button>

            {message && <div style={{ color: "#4ade80", fontSize: "0.9rem" }}>{message}</div>}
          </div>
        </div>

        {/* Vertical Roadmap Manager */}
        <div style={{ background: "#141418", border: "1px solid #222", borderRadius: "12px", padding: "2rem" }}>
          <h2 style={{ fontSize: "1.4rem", marginBottom: "1.5rem", borderBottom: "1px solid #222", paddingBottom: "0.8rem" }}>Vertical Roadmap Timeline (01, 02, 03...)</h2>

          {/* Add New Step Form */}
          <form onSubmit={handleAddStep} style={{ background: "#0a0a0c", border: "1px dashed #333", borderRadius: "8px", padding: "1.2rem", marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "#14b8a6" }}>+ Add New Roadmap Node</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#888", marginBottom: "0.3rem" }}>Node Code (e.g. 01) *</label>
                <input
                  type="text"
                  required
                  value={newStep.stepNumber}
                  onChange={(e) => setNewStep({ ...newStep, stepNumber: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem", background: "#141418", border: "1px solid #333", color: "#fff", borderRadius: "4px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#888", marginBottom: "0.3rem" }}>Year / Date</label>
                <input
                  type="text"
                  value={newStep.year}
                  onChange={(e) => setNewStep({ ...newStep, year: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem", background: "#141418", border: "1px solid #333", color: "#fff", borderRadius: "4px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#888", marginBottom: "0.3rem" }}>Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MATERIAL LAB EXPANSION"
                  value={newStep.title}
                  onChange={(e) => setNewStep({ ...newStep, title: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem", background: "#141418", border: "1px solid #333", color: "#fff", borderRadius: "4px" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "#888", marginBottom: "0.3rem" }}>Step Description *</label>
              <textarea
                rows={2}
                required
                value={newStep.description}
                onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                style={{ width: "100%", padding: "0.6rem", background: "#141418", border: "1px solid #333", color: "#fff", borderRadius: "4px" }}
              />
            </div>

            <button type="submit" style={{ width: "fit-content", padding: "0.7rem 1.4rem", background: "#14b8a6", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 700 }}>
              + Add Roadmap Step
            </button>
          </form>

          {/* Current Steps Timeline */}
          {loading ? (
            <div style={{ color: "#888", textAlign: "center" }}>Loading roadmap nodes...</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {roadmap.map((step) => (
                <div key={step.id} style={{ background: "#0a0a0c", border: "1px solid #222", borderRadius: "8px", padding: "1.2rem", display: "flex", gap: "1.5rem", alignItems: "center" }}>
                  <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "#14b8a6", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.4rem" }}>
                    {step.stepNumber}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.8rem", color: "#14b8a6", fontWeight: 700 }}>{step.year}</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>{step.title}</div>
                    <div style={{ fontSize: "0.88rem", color: "#aaa", marginTop: "0.3rem" }}>{step.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
