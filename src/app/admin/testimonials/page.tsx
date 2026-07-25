"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/AdminNav";
import { TestimonialItem } from "@/lib/types";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [editing, setEditing] = useState<Partial<TestimonialItem> | null>(null);

  const fetchTestimonials = () => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setTestimonials(json.data);
      });
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.clientName || !editing?.review) return alert("Client Name and Review are required.");

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
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/testimonials?id=${id}`, { method: "DELETE" });
    fetchTestimonials();
  };

  return (
    <div style={{ background: "#0a0a0c", color: "#f0f0f2", minHeight: "100vh" }}>
      <AdminNav />

      <div style={{ maxWidth: "1300px", margin: "2rem auto", padding: "0 2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid #222", paddingBottom: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>💬 Testimonials CMS</h1>
            <p style={{ color: "#aaa", fontSize: "0.9rem" }}>Manage client feedback and reviews.</p>
          </div>
          <button
            onClick={() => setEditing({ clientName: "", company: "", rating: 5, review: "", sequenceNumber: testimonials.length + 1 })}
            style={{ padding: "0.7rem 1.4rem", background: "#14b8a6", color: "#fff", border: "none", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}
          >
            + Add Testimonial
          </button>
        </div>

        {editing && (
          <form onSubmit={handleSave} style={{ background: "#141418", padding: "2rem", borderRadius: "10px", border: "1px solid #333", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.2rem" }}>{editing.id ? "Edit Testimonial" : "Add Testimonial"}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Client Name *</label>
                <input
                  type="text"
                  required
                  value={editing.clientName || ""}
                  onChange={(e) => setEditing({ ...editing, clientName: e.target.value })}
                  style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Company / Designation</label>
                <input
                  type="text"
                  value={editing.company || ""}
                  onChange={(e) => setEditing({ ...editing, company: e.target.value })}
                  style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Review Message *</label>
              <textarea
                rows={3}
                required
                value={editing.review || ""}
                onChange={(e) => setEditing({ ...editing, review: e.target.value })}
                style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <button type="submit" style={{ padding: "0.7rem 1.5rem", background: "#14b8a6", color: "#fff", border: "none", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}>
                Save Review
              </button>
              <button type="button" onClick={() => setEditing(null)} style={{ padding: "0.7rem 1.5rem", background: "#333", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {testimonials.map((t) => (
            <div key={t.id} style={{ background: "#141418", border: "1px solid #222", borderRadius: "10px", padding: "1.5rem" }}>
              <div style={{ color: "#f59e0b", fontSize: "1.1rem", marginBottom: "0.5rem" }}>{"★".repeat(t.rating || 5)}</div>
              <p style={{ color: "#ddd", fontSize: "0.95rem", fontStyle: "italic", marginBottom: "1rem" }}>"{t.review}"</p>
              <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{t.clientName}</div>
              <div style={{ color: "#888", fontSize: "0.85rem", marginBottom: "1.2rem" }}>{t.company}</div>
              <div style={{ display: "flex", gap: "0.8rem" }}>
                <button onClick={() => setEditing(t)} style={{ padding: "0.4rem 0.9rem", background: "#333", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(t.id)} style={{ padding: "0.4rem 0.9rem", background: "rgba(239,68,68,0.2)", color: "#f87171", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
