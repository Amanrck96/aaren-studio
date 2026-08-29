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
    <div style={{ background: "#FAF8F5", color: "#1E1E1E", minHeight: "100vh", display: "flex" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem", background: "#FAF8F5" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid #DCD5C6", paddingBottom: "1.2rem" }}>
          <div>
            <span style={{ color: "#81663F", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 800 }}>SERVICES MANAGEMENT</span>
            <h1 style={{ fontSize: "2.2rem", fontWeight: 900, margin: "0.2rem 0", color: "#1E1E1E" }}>🛠️ Services CMS</h1>
            <p style={{ color: "#555555", fontSize: "0.95rem" }}>Manage services offered by Aaren Studio.</p>
          </div>
          <button
            onClick={() => setEditing({ title: "", description: "", icon: "✨", sequenceNumber: services.length + 1 })}
            style={{ padding: "0.75rem 1.6rem", background: "#1E1E1E", color: "#FFFFFF", border: "none", borderRadius: "8px", fontWeight: 800, cursor: "pointer", fontSize: "0.95rem", boxShadow: "0 4px 14px rgba(0,0,0,0.12)" }}
          >
            + Add New Service
          </button>
        </div>

        {editing && (
          <form onSubmit={handleSave} style={{ background: "#FFFFFF", padding: "2.2rem", borderRadius: "16px", border: "1px solid #E2DCD2", marginBottom: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "1.2rem", color: "#81663F" }}>{editing.id ? "Edit Service" : "Add New Service"}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Service Title *</label>
                <input
                  type="text"
                  required
                  value={editing.title || ""}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px", fontSize: "0.95rem" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Icon (Emoji / Code)</label>
                <input
                  type="text"
                  value={editing.icon || "✨"}
                  onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px", fontSize: "0.95rem" }}
                />
              </div>
            </div>

            <div style={{ marginTop: "1.2rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Description *</label>
              <textarea
                rows={3}
                required
                value={editing.description || ""}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px", fontSize: "0.95rem" }}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.8rem" }}>
              <button type="submit" disabled={isSaving} style={{ padding: "0.8rem 1.8rem", background: "#1E1E1E", color: "#FFFFFF", border: "none", borderRadius: "8px", fontWeight: 800, cursor: isSaving ? "not-allowed" : "pointer", fontSize: "0.95rem", boxShadow: "0 4px 14px rgba(0,0,0,0.12)" }}>
                {isSaving ? "Saving..." : "Save Service"}
              </button>
              <button type="button" onClick={() => setEditing(null)} style={{ padding: "0.8rem 1.8rem", background: "#FAF8F5", color: "#1E1E1E", border: "1px solid #D5CEBF", borderRadius: "8px", cursor: "pointer", fontSize: "0.95rem", fontWeight: 700 }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {services.map((s) => (
            <div key={s.id} style={{ background: "#FFFFFF", border: "1px solid #E2DCD2", borderRadius: "16px", padding: "1.8rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: "2.4rem", marginBottom: "0.8rem" }}>{s.icon || "✨"}</div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#1E1E1E", margin: "0.4rem 0" }}>{s.title}</h3>
              <p style={{ color: "#555555", fontSize: "0.92rem", margin: "0.6rem 0 1.5rem", lineHeight: 1.6 }}>{s.description}</p>
              <div style={{ display: "flex", gap: "0.8rem" }}>
                <button onClick={() => setEditing(s)} style={{ padding: "0.5rem 1.2rem", background: "#1E1E1E", color: "#FFFFFF", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "0.88rem", fontWeight: 700 }}>
                  ✏️ Edit
                </button>
                <button onClick={() => handleDelete(s.id)} style={{ padding: "0.5rem 1.2rem", background: "#FEE2E2", color: "#DC2626", border: "1px solid #FCA5A5", borderRadius: "8px", cursor: "pointer", fontSize: "0.88rem", fontWeight: 700 }}>
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
