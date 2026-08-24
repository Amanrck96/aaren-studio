"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/AdminNav";
import { ServiceItem } from "@/lib/types";

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<ServiceItem> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/services");
      const json = await res.json();
      if (json.success) setServices(json.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.title || !editing?.description) return alert("Title and Description are required.");
    setIsSaving(true);
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      const json = await res.json();
      if (json.success) {
        alert("Service saved successfully!");
        setEditing(null);
        fetchServices();
      } else alert("Error: " + json.error);
    } catch (err) {
      console.error(err);
      alert("Error saving service.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await fetch(`/api/services?id=${id}`, { method: "DELETE" });
      fetchServices();
    } catch (err) {
      console.error(err);
      alert("Error deleting service.");
    }
  };

  return (
    <div style={{ background: "#0a0a0c", color: "#f0f0f2", minHeight: "100vh" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid #222", paddingBottom: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>🛠️ Services CMS</h1>
            <p style={{ color: "#aaa", fontSize: "0.9rem" }}>Manage services offered by Aaren Studio.</p>
          </div>
          <button
            onClick={() => setEditing({ title: "", description: "", icon: "✨", sequenceNumber: services.length + 1 })}
            style={{ padding: "0.7rem 1.4rem", background: "#f59e0b", color: "#000", border: "none", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}
          >
            + Add New Service
          </button>
        </div>

        {editing && (
          <form onSubmit={handleSave} style={{ background: "#141418", padding: "2rem", borderRadius: "10px", border: "1px solid #333", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.2rem" }}>{editing.id ? "Edit Service" : "Add New Service"}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Service Title *</label>
                <input
                  type="text"
                  required
                  value={editing.title || ""}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Icon (Emoji / Code)</label>
                <input
                  type="text"
                  value={editing.icon || "✨"}
                  onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
                  style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Description *</label>
              <textarea
                rows={3}
                required
                value={editing.description || ""}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <button type="submit" disabled={isSaving} style={{ padding: "0.7rem 1.5rem", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "6px", fontWeight: 700, cursor: isSaving ? "not-allowed" : "pointer" }}>
                {isSaving ? "Saving..." : "Save Service"}
              </button>
              <button type="button" onClick={() => setEditing(null)} style={{ padding: "0.7rem 1.5rem", background: "#333", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {services.map((s) => (
            <div key={s.id} style={{ background: "linear-gradient(145deg, #1e2235 0%, #12141f 100%)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: "14px", padding: "1.8rem", boxShadow: "0 10px 25px rgba(0,0,0,0.4)" }}>
              <div style={{ fontSize: "2.4rem", marginBottom: "0.8rem" }}>{s.icon || "✨"}</div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 900, color: "#ffffff", margin: "0.4rem 0" }}>{s.title}</h3>
              <p style={{ color: "#cbd5e1", fontSize: "0.92rem", margin: "0.6rem 0 1.5rem", lineHeight: 1.6 }}>{s.description}</p>
              <div style={{ display: "flex", gap: "0.8rem" }}>
                <button onClick={() => setEditing(s)} style={{ padding: "0.5rem 1.2rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.88rem", fontWeight: 700 }}>
                  ✏️ Edit
                </button>
                <button onClick={() => handleDelete(s.id)} style={{ padding: "0.5rem 1.2rem", background: "rgba(239,68,68,0.2)", color: "#f87171", border: "1px solid rgba(239,68,68,0.4)", borderRadius: "6px", cursor: "pointer", fontSize: "0.88rem", fontWeight: 700 }}>
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
