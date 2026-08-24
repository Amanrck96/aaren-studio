"use client";

import { useState, useEffect } from "react";
import AdminNav from "@/components/AdminNav";
import { RoadmapStepItem } from "@/lib/types";
import { Edit2, Trash2, ArrowUp, ArrowDown, X, Save } from "lucide-react";

export default function AdminAboutPage() {
  const [mission, setMission] = useState("To provide premium, elite, and high-quality lifestyle products under one roof for the global Indian customer.");
  const [vision, setVision] = useState("To remain the primary one-stop destination for architects, interior designers, builders, and homeowners seeking world-class materials.");
  const [values, setValues] = useState("Uniting as a family, prioritizing robust value systems, and providing curated designs focusing on unique client experiences.");
  const [aboutTitle, setAboutTitle] = useState("About Us");
  const [aboutSubtitle, setAboutSubtitle] = useState("Aaren Intpro is Bengaluru's premier material house and luxury lifestyle curator, dedicated to providing world-class interior products under one roof.");

  const [roadmap, setRoadmap] = useState<RoadmapStepItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Form State for Adding / Editing a step
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [stepForm, setStepForm] = useState({
    stepNumber: "04",
    year: "2026",
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3500);
  };

  async function fetchData() {
    setLoading(true);
    try {
      const [teamRes, settingsRes] = await Promise.all([
        fetch(`/api/team?t=${Date.now()}`, { cache: "no-store" }),
        fetch(`/api/site-settings?t=${Date.now()}`, { cache: "no-store" }),
      ]);
      const teamJson = await teamRes.json();
      const settingsJson = await settingsRes.json();

      if (teamJson.success && teamJson.roadmap) {
        setRoadmap(teamJson.roadmap);
        if (!editingStepId) {
          setStepForm((prev) => ({
            ...prev,
            stepNumber: `0${teamJson.roadmap.length + 1}`,
          }));
        }
      }

      if (settingsJson.success && settingsJson.data) {
        const d = settingsJson.data;
        if (d.aboutMission) setMission(d.aboutMission);
        if (d.aboutVision) setVision(d.aboutVision);
        if (d.aboutValues) setValues(d.aboutValues);
        if (d.aboutTitle) setAboutTitle(d.aboutTitle);
        if (d.aboutSubtitle) setAboutSubtitle(d.aboutSubtitle);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveAboutTexts() {
    setSaving(true);
    try {
      const currentRes = await fetch("/api/site-settings");
      const currentJson = await currentRes.json();
      const currentSettings = currentJson.success ? currentJson.data : {};

      const payload = {
        ...currentSettings,
        aboutTitle,
        aboutSubtitle,
        aboutMission: mission,
        aboutVision: vision,
        aboutValues: values,
      };

      const res = await fetch("/api/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        showToast("🎉 About page text updated & synced live!");
      } else {
        showToast("Error: " + (json.error || "Failed to save"));
      }
    } catch (e: any) {
      showToast("Error: " + e.message);
    } finally {
      setSaving(false);
    }
  }

  // Add or Update Step
  async function handleSubmitStep(e: React.FormEvent) {
    e.preventDefault();
    const yearNum = Number(stepForm.year);
    if (isNaN(yearNum) || yearNum < 1800 || yearNum > 2100) {
      showToast("Please enter a valid year (e.g. 2024).");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        type: "roadmap",
        data: {
          id: editingStepId || undefined,
          stepNumber: stepForm.stepNumber,
          year: stepForm.year,
          title: stepForm.title,
          description: stepForm.description,
        },
      };

      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        showToast(editingStepId ? `✓ Updated roadmap step ${stepForm.stepNumber}!` : `✓ Added roadmap step ${stepForm.stepNumber}!`);
        handleCancelEdit();
        fetchData();
      } else {
        showToast("Error: " + (json.error || "Failed to save step"));
      }
    } catch (e: any) {
      showToast("Error: " + e.message);
    } finally {
      setSaving(false);
    }
  }

  // Start Editing Step
  function handleStartEdit(step: RoadmapStepItem) {
    setEditingStepId(step.id);
    setStepForm({
      stepNumber: step.stepNumber,
      year: step.year || "",
      title: step.title,
      description: step.description,
    });
    // Scroll form into view
    const formEl = document.getElementById("roadmap-form-section");
    if (formEl) {
      formEl.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Cancel Editing
  function handleCancelEdit() {
    setEditingStepId(null);
    setStepForm({
      stepNumber: `0${roadmap.length + 1}`,
      year: new Date().getFullYear().toString(),
      title: "",
      description: "",
    });
  }

  // Delete Step
  async function handleDeleteStep(id: string, stepNumber: string) {
    if (!confirm(`Are you sure you want to delete roadmap node ${stepNumber}?`)) return;
    try {
      const res = await fetch(`/api/team?id=${encodeURIComponent(id)}&type=roadmap`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        showToast(`✓ Deleted roadmap step ${stepNumber}.`);
        if (editingStepId === id) handleCancelEdit();
        fetchData();
      } else {
        showToast("Error deleting: " + json.error);
      }
    } catch (e: any) {
      showToast("Error: " + e.message);
    }
  }

  // Reorder Step (Move Up / Move Down)
  async function handleMove(index: number, direction: "up" | "down") {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= roadmap.length) return;

    const updated = [...roadmap];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    setRoadmap(updated);

    try {
      await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "reorder_roadmap", roadmap: updated }),
      });
      showToast("✓ Timeline order updated.");
    } catch (e: any) {
      showToast("Error updating order: " + e.message);
      fetchData();
    }
  }

  return (
    <div style={{ background: "#0a0a0c", color: "#f0f0f2", minHeight: "100vh" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem", maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <span style={{ color: "#14b8a6", fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>
            CONTENT MANAGEMENT
          </span>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, margin: "0.3rem 0" }}>About Us & Roadmap Manager</h1>
          <p style={{ color: "#aaa", fontSize: "0.95rem" }}>
            Edit Mission, Vision, Values, and manage vertical roadmap timeline steps (01, 02, 03...).
          </p>
        </div>

        {/* Mission, Vision, Values Form */}
        <div style={{ background: "#141418", border: "1px solid #222", borderRadius: "12px", padding: "2rem", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.4rem", marginBottom: "1.5rem", borderBottom: "1px solid #222", paddingBottom: "0.8rem" }}>
            About Page Text & Mission, Vision, Values
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.4rem", fontWeight: 600 }}>
                  Page Header Title *
                </label>
                <input
                  type="text"
                  value={aboutTitle}
                  onChange={(e) => setAboutTitle(e.target.value)}
                  style={{ width: "100%", padding: "0.8rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.4rem", fontWeight: 600 }}>
                  Page Subtitle Description *
                </label>
                <input
                  type="text"
                  value={aboutSubtitle}
                  onChange={(e) => setAboutSubtitle(e.target.value)}
                  style={{ width: "100%", padding: "0.8rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.4rem", fontWeight: 600 }}>
                Our Mission *
              </label>
              <textarea
                rows={2}
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                style={{ width: "100%", padding: "0.8rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.4rem", fontWeight: 600 }}>
                Our Vision *
              </label>
              <textarea
                rows={2}
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                style={{ width: "100%", padding: "0.8rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.4rem", fontWeight: 600 }}>
                Our Core Values *
              </label>
              <textarea
                rows={2}
                value={values}
                onChange={(e) => setValues(e.target.value)}
                style={{ width: "100%", padding: "0.8rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
              />
            </div>

            <button
              onClick={handleSaveAboutTexts}
              disabled={saving}
              style={{
                padding: "0.8rem 1.4rem",
                background: "#14b8a6",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: saving ? "wait" : "pointer",
                fontWeight: 700,
                width: "fit-content",
              }}
            >
              {saving ? "Saving Changes..." : "💾 Save About Us Text Settings"}
            </button>
          </div>
        </div>

        {/* Vertical Roadmap Manager */}
        <div id="roadmap-form-section" style={{ background: "#141418", border: "1px solid #222", borderRadius: "12px", padding: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #222", paddingBottom: "0.8rem", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.4rem", margin: 0 }}>Vertical Roadmap Timeline (01, 02, 03...)</h2>
            <span style={{ fontSize: "0.85rem", color: "#14b8a6", fontWeight: 700 }}>
              {roadmap.length} Timeline Nodes
            </span>
          </div>

          {/* Add / Edit Form */}
          <form
            onSubmit={handleSubmitStep}
            style={{
              background: editingStepId ? "#132320" : "#0a0a0c",
              border: editingStepId ? "1px solid #14b8a6" : "1px dashed #333",
              borderRadius: "8px",
              padding: "1.5rem",
              marginBottom: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.2rem",
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "1.05rem", fontWeight: 800, color: editingStepId ? "#2dd4bf" : "#14b8a6" }}>
                {editingStepId ? `✏️ Editing Roadmap Node: Step ${stepForm.stepNumber}` : "+ Add New Roadmap Node"}
              </div>
              {editingStepId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "none",
                    color: "#cbd5e1",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <X size={13} /> Cancel Edit
                </button>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#888", marginBottom: "0.3rem", fontWeight: 600 }}>
                  Node Code (e.g. 01, 02) *
                </label>
                <input
                  type="text"
                  required
                  value={stepForm.stepNumber}
                  onChange={(e) => setStepForm({ ...stepForm, stepNumber: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem", background: "#141418", border: "1px solid #333", color: "#fff", borderRadius: "4px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#888", marginBottom: "0.3rem", fontWeight: 600 }}>
                  Year / Date *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2013, 2019, 2024"
                  value={stepForm.year}
                  onChange={(e) => setStepForm({ ...stepForm, year: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem", background: "#141418", border: "1px solid #333", color: "#fff", borderRadius: "4px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#888", marginBottom: "0.3rem", fontWeight: 600 }}>
                  Step Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FOUNDATION & ITALIAN PARTNERSHIPS"
                  value={stepForm.title}
                  onChange={(e) => setStepForm({ ...stepForm, title: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem", background: "#141418", border: "1px solid #333", color: "#fff", borderRadius: "4px" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "#888", marginBottom: "0.3rem", fontWeight: 600 }}>
                Step Description *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Detailed milestones, showroom expansions, partnership launches..."
                value={stepForm.description}
                onChange={(e) => setStepForm({ ...stepForm, description: e.target.value })}
                style={{ width: "100%", padding: "0.6rem", background: "#141418", border: "1px solid #333", color: "#fff", borderRadius: "4px" }}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  width: "fit-content",
                  padding: "0.7rem 1.6rem",
                  background: "#14b8a6",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Save size={15} />
                <span>{saving ? "Saving..." : editingStepId ? `Update Step ${stepForm.stepNumber} ✓` : "+ Add Roadmap Step"}</span>
              </button>

              {editingStepId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  style={{
                    padding: "0.7rem 1.2rem",
                    background: "#27272a",
                    color: "#cbd5e1",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Current Steps Timeline List with EDIT / DELETE / REORDER */}
          {loading ? (
            <div style={{ color: "#888", textAlign: "center", padding: "2rem" }}>Loading roadmap nodes...</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {roadmap.map((step, idx) => {
                const isCurrentEditing = editingStepId === step.id;
                return (
                  <div
                    key={step.id || idx}
                    style={{
                      background: isCurrentEditing ? "rgba(20, 184, 166, 0.1)" : "#0a0a0c",
                      border: isCurrentEditing ? "1px solid #14b8a6" : "1px solid #222",
                      borderRadius: "10px",
                      padding: "1.2rem 1.5rem",
                      display: "flex",
                      gap: "1.5rem",
                      alignItems: "center",
                      transition: "border-color 0.2s",
                    }}
                  >
                    {/* Circle Node Code */}
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        background: "#14b8a6",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 900,
                        fontSize: "1.4rem",
                        flexShrink: 0,
                      }}
                    >
                      {step.stepNumber}
                    </div>

                    {/* Step Details */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "0.85rem", color: "#14b8a6", fontWeight: 800, letterSpacing: "0.05em" }}>
                          {step.year}
                        </span>
                        {isCurrentEditing && (
                          <span style={{ background: "#14b8a6", color: "#000", fontSize: "10px", fontWeight: 800, padding: "2px 6px", borderRadius: "4px" }}>
                            CURRENTLY EDITING
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#fff", margin: "2px 0 4px" }}>
                        {step.title}
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "#aaa", lineHeight: 1.5 }}>
                        {step.description}
                      </div>
                    </div>

                    {/* Actions: Reorder, Edit, Delete */}
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
                      <button
                        onClick={() => handleMove(idx, "up")}
                        disabled={idx === 0}
                        title="Move Step Up"
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "6px",
                          border: "1px solid #333",
                          background: "#141418",
                          color: idx === 0 ? "#444" : "#fff",
                          cursor: idx === 0 ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ArrowUp size={14} />
                      </button>

                      <button
                        onClick={() => handleMove(idx, "down")}
                        disabled={idx === roadmap.length - 1}
                        title="Move Step Down"
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "6px",
                          border: "1px solid #333",
                          background: "#141418",
                          color: idx === roadmap.length - 1 ? "#444" : "#fff",
                          cursor: idx === roadmap.length - 1 ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ArrowDown size={14} />
                      </button>

                      <button
                        onClick={() => handleStartEdit(step)}
                        style={{
                          padding: "0.5rem 0.9rem",
                          borderRadius: "6px",
                          border: "none",
                          background: "#1e293b",
                          color: "#38bdf8",
                          fontWeight: 700,
                          fontSize: "0.8rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <Edit2 size={13} />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteStep(step.id, step.stepNumber)}
                        style={{
                          padding: "0.5rem 0.9rem",
                          borderRadius: "6px",
                          border: "none",
                          background: "rgba(239, 68, 68, 0.15)",
                          color: "#f87171",
                          fontWeight: 700,
                          fontSize: "0.8rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Floating Toast */}
      {message && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            background: "#14b8a6",
            color: "#000",
            padding: "12px 20px",
            borderRadius: "8px",
            fontWeight: 800,
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            zIndex: 99999,
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}
