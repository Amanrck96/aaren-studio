"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/AdminNav";
import { TestimonialItem } from "@/lib/types";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [editing, setEditing] = useState<Partial<TestimonialItem> | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/testimonials");
      const json = await res.json();
      if (json.success) setTestimonials(json.data);
    } catch (e: any) {
      alert("Error fetching testimonials: " + e.message);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.clientName || !editing?.review) return alert("Client Name and Review are required.");
    setIsSaving(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      const json = await res.json();
      if (json.success) {
        alert("Testimonial saved!");
        setEditing(null);
        fetchTestimonials();
      } else alert("Error: " + json.error);
    } catch (e: any) {
      alert("Error saving testimonial: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/testimonials?id=${id}`, { method: "DELETE" });
      fetchTestimonials();
    } catch (e: any) {
      alert("Error deleting testimonial: " + e.message);
    }
  };

  return (
    <div style={{ background: "#FAF8F5", color: "#1E1E1E", minHeight: "100vh" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem", background: "#FAF8F5" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid #DCD5C6", paddingBottom: "1.2rem" }}>
          <div>
            <span style={{ color: "#81663F", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 800 }}>TESTIMONIALS MANAGEMENT</span>
            <h1 style={{ fontSize: "2.2rem", fontWeight: 900, color: "#1E1E1E", margin: "0.2rem 0" }}>💬 Testimonials CMS</h1>
            <p style={{ color: "#555555", fontSize: "0.95rem" }}>Manage client feedback and reviews.</p>
          </div>
          <button
            onClick={() => setEditing({ clientName: "", company: "", rating: 5, review: "", sequenceNumber: testimonials.length + 1 })}
            style={{ padding: "0.75rem 1.6rem", background: "#1E1E1E", color: "#FFFFFF", border: "none", borderRadius: "8px", fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 14px rgba(0,0,0,0.12)" }}
          >
            + Add Testimonial
          </button>
        </div>

        {editing && (
          <form onSubmit={handleSave} style={{ background: "#FFFFFF", padding: "2rem", borderRadius: "16px", border: "1px solid #E2DCD2", marginBottom: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#81663F", marginBottom: "1.2rem" }}>{editing.id ? "Edit Testimonial" : "Add Testimonial"}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Client Name *</label>
                <input
                  type="text"
                  required
                  value={editing.clientName || ""}
                  onChange={(e) => setEditing({ ...editing, clientName: e.target.value })}
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Company / Designation</label>
                <input
                  type="text"
                  value={editing.company || ""}
                  onChange={(e) => setEditing({ ...editing, company: e.target.value })}
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Rating (1-5)</label>
                <select
                  value={editing.rating || 5}
                  onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })}
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                >
                  <option value={1}>1 Star</option>
                  <option value={2}>2 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={5}>5 Stars</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Sequence Number</label>
                <input
                  type="number"
                  value={editing.sequenceNumber || ""}
                  onChange={(e) => setEditing({ ...editing, sequenceNumber: Number(e.target.value) })}
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                />
              </div>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Review Message *</label>
              <textarea
                rows={3}
                required
                value={editing.review || ""}
                onChange={(e) => setEditing({ ...editing, review: e.target.value })}
                style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <button type="submit" disabled={isSaving} style={{ padding: "0.8rem 1.8rem", background: "#1E1E1E", color: "#FFFFFF", border: "none", borderRadius: "8px", fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 14px rgba(0,0,0,0.12)" }}>
                {isSaving ? "Saving..." : "Save Review"}
              </button>
              <button type="button" onClick={() => setEditing(null)} style={{ padding: "0.8rem 1.8rem", background: "#FAF8F5", color: "#1E1E1E", border: "1px solid #D5CEBF", borderRadius: "8px", cursor: "pointer", fontWeight: 700 }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {testimonials.map((t) => (
            <div key={t.id} style={{ background: "#FFFFFF", border: "1px solid #E2DCD2", borderRadius: "16px", padding: "1.8rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
              <div style={{ color: "#81663F", fontSize: "1.2rem", marginBottom: "0.8rem", letterSpacing: "0.1em" }}>{"★".repeat(Math.max(1, Math.min(5, Math.floor(Number(t.rating || 5)))))}</div>
              <p style={{ color: "#555555", fontSize: "0.98rem", fontStyle: "italic", marginBottom: "1.2rem", lineHeight: 1.6 }}>&ldquo;{t.review}&rdquo;</p>
              <div style={{ fontWeight: 800, fontSize: "1.2rem", color: "#1E1E1E" }}>{t.clientName}</div>
              <div style={{ color: "#81663F", fontSize: "0.88rem", fontWeight: 700, marginBottom: "1.4rem" }}>{t.company}</div>
              <div style={{ display: "flex", gap: "0.8rem" }}>
                <button onClick={() => setEditing(t)} style={{ padding: "0.5rem 1.2rem", background: "#1E1E1E", color: "#FFFFFF", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "0.88rem", fontWeight: 700 }}>
                  ✏️ Edit
                </button>
                <button onClick={() => handleDelete(t.id)} style={{ padding: "0.5rem 1.2rem", background: "#FEE2E2", color: "#DC2626", border: "1px solid #FCA5A5", borderRadius: "8px", cursor: "pointer", fontSize: "0.88rem", fontWeight: 700 }}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
