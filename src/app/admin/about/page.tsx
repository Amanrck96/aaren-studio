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
    <div style={{ background: "#FAF8F5", color: "#1E1E1E", minHeight: "100vh" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem", maxWidth: "1400px", margin: "0 auto", background: "#FAF8F5" }}>
        <div style={{ marginBottom: "2rem", borderBottom: "1px solid #DCD5C6", paddingBottom: "1.2rem" }}>
          <span style={{ color: "#81663F", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 800 }}>
            CONTENT MANAGEMENT
          </span>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 900, margin: "0.3rem 0", color: "#1E1E1E" }}>About Us & Roadmap Manager</h1>
          <p style={{ color: "#555555", fontSize: "0.95rem" }}>
            Edit Mission, Vision, Values, and manage vertical roadmap timeline steps (01, 02, 03...).
          </p>
        </div>

        {/* Mission, Vision, Values Form */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E2DCD2", borderRadius: "16px", padding: "2rem", marginBottom: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#81663F", marginBottom: "1.5rem", borderBottom: "1px solid #EAE4D8", paddingBottom: "0.8rem" }}>
            About Page Text & Mission, Vision, Values
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", marginBottom: "0.4rem", fontWeight: 700 }}>
                  Page Header Title *
                </label>
                <input
                  type="text"
                  value={aboutTitle}
                  onChange={(e) => setAboutTitle(e.target.value)}
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", marginBottom: "0.4rem", fontWeight: 700 }}>
                  Page Subtitle Description *
                </label>
                <input
                  type="text"
                  value={aboutSubtitle}
                  onChange={(e) => setAboutSubtitle(e.target.value)}
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", marginBottom: "0.4rem", fontWeight: 700 }}>
                Our Mission *
              </label>
              <textarea
                rows={2}
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", marginBottom: "0.4rem", fontWeight: 700 }}>
                Our Vision *
              </label>
              <textarea
                rows={2}
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", marginBottom: "0.4rem", fontWeight: 700 }}>
                Our Core Values *
              </label>
              <textarea
                rows={2}
                value={values}
                onChange={(e) => setValues(e.target.value)}
                style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
              />
            </div>

            <button
              onClick={handleSaveAboutTexts}
              disabled={saving}
              style={{
                padding: "0.8rem 1.6rem",
                background: "#1E1E1E",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                cursor: saving ? "wait" : "pointer",
                fontWeight: 800,
                width: "fit-content",
                boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
              }}
            >
              {saving ? "Saving Changes..." : "💾 Save About Us Text Settings"}
            </button>
          </div>
        </div>

        {/* Vertical Roadmap Manager */}
        <div id="roadmap-form-section" style={{ background: "#FFFFFF", border: "1px solid #E2DCD2", borderRadius: "16px", padding: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #EAE4D8", paddingBottom: "0.8rem", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#81663F", margin: 0 }}>Vertical Roadmap Timeline (01, 02, 03...)</h2>
            <span style={{ fontSize: "0.85rem", color: "#81663F", fontWeight: 800 }}>
              {roadmap.length} Timeline Nodes
            </span>
          </div>

          {/* Add / Edit Form */}
          <form
            onSubmit={handleSubmitStep}
            style={{
              background: editingStepId ? "#FAF8F5" : "#FAF8F5",
              border: editingStepId ? "2px solid #81663F" : "1px dashed #D5CEBF",
              borderRadius: "12px",
              padding: "1.5rem",
              marginBottom: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.2rem",
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#81663F" }}>
                {editingStepId ? `✏️ Editing Roadmap Node: Step ${stepForm.stepNumber}` : "+ Add New Roadmap Node"}
              </div>
              {editingStepId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  style={{
                    background: "#EAE4D8",
                    border: "none",
                    color: "#1E1E1E",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: 700,
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
                <label style={{ display: "block", fontSize: "0.8rem", color: "#1E1E1E", marginBottom: "0.3rem", fontWeight: 700 }}>
                  Node Code (e.g. 01, 02) *
                </label>
                <input
                  type="text"
                  required
                  value={stepForm.stepNumber}
                  onChange={(e) => setStepForm({ ...stepForm, stepNumber: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem", background: "#FFFFFF", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#1E1E1E", marginBottom: "0.3rem", fontWeight: 700 }}>
                  Year / Date *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2013, 2019, 2024"
                  value={stepForm.year}
                  onChange={(e) => setStepForm({ ...stepForm, year: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem", background: "#FFFFFF", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#1E1E1E", marginBottom: "0.3rem", fontWeight: 700 }}>
                  Step Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FOUNDATION & ITALIAN PARTNERSHIPS"
                  value={stepForm.title}
                  onChange={(e) => setStepForm({ ...stepForm, title: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem", background: "#FFFFFF", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "#1E1E1E", marginBottom: "0.3rem", fontWeight: 700 }}>
                Step Description *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Detailed milestones, showroom expansions, partnership launches..."
                value={stepForm.description}
                onChange={(e) => setStepForm({ ...stepForm, description: e.target.value })}
                style={{ width: "100%", padding: "0.6rem", background: "#FFFFFF", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  width: "fit-content",
                  padding: "0.7rem 1.6rem",
                  background: "#1E1E1E",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 800,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
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
                    background: "#FFFFFF",
                    color: "#1E1E1E",
                    border: "1px solid #D5CEBF",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Current Steps Timeline List with EDIT / DELETE / REORDER */}
          {loading ? (
            <div style={{ color: "#6A6359", textAlign: "center", padding: "2rem" }}>Loading roadmap nodes...</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {roadmap.map((step, idx) => {
                const isCurrentEditing = editingStepId === step.id;
                return (
                  <div
                    key={step.id || idx}
                    style={{
                      background: isCurrentEditing ? "rgba(129, 102, 63, 0.08)" : "#FAF8F5",
                      border: isCurrentEditing ? "1px solid #81663F" : "1px solid #E2DCD2",
                      borderRadius: "14px",
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
                        background: "#81663F",
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
                        <span style={{ fontSize: "0.85rem", color: "#81663F", fontWeight: 800, letterSpacing: "0.05em" }}>
                          {step.year}
                        </span>
                        {isCurrentEditing && (
                          <span style={{ background: "rgba(129,102,63,0.15)", color: "#81663F", fontSize: "10px", fontWeight: 800, padding: "2px 6px", borderRadius: "4px" }}>
                            CURRENTLY EDITING
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#1E1E1E", margin: "2px 0 4px" }}>
                        {step.title}
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "#555555", lineHeight: 1.5 }}>
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
                          border: "1px solid #D5CEBF",
                          background: "#FFFFFF",
                          color: idx === 0 ? "#ccc" : "#1E1E1E",
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
                          border: "1px solid #D5CEBF",
                          background: "#FFFFFF",
                          color: idx === roadmap.length - 1 ? "#ccc" : "#1E1E1E",
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
                          background: "#1E1E1E",
                          color: "#FFFFFF",
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
                          border: "1px solid #FCA5A5",
                          background: "#FEE2E2",
                          color: "#DC2626",
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
            background: "#1E1E1E",
            color: "#FFFFFF",
            padding: "12px 20px",
            borderRadius: "8px",
            fontWeight: 800,
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            zIndex: 99999,
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}
