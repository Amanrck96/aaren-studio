"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import AdminNav from "@/components/AdminNav";

export default function AdminCareers() {
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [newRole, setNewRole] = useState({ title: "", department: "", location: "", type: "Full-Time" });

  const fetchCareers = async () => {
    try {
      const res = await fetch("/api/careers?t=" + Date.now(), { cache: "no-store" });
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data)) {
        setPositions(data.data);
      }
    } catch (e: any) {
      console.error(e);
      alert("Error fetching positions: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole.title || !newRole.department) return;
    setSaving(true);
    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRole),
      });
      const data = await res.json();
      if (data.success) {
        setNotice("Role successfully created and saved to Google Firebase!");
        setTimeout(() => setNotice(null), 3000);
        setNewRole({ title: "", department: "", location: "", type: "Full-Time" });
        fetchCareers();
      }
    } catch (err: any) {
      alert("Error saving: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this position?")) return;
    try {
      const res = await fetch(`/api/careers?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setPositions((prev) => prev.filter((pos) => pos.id !== id));
      }
    } catch (err: any) {
      alert("Error deleting: " + err.message);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#FAF8F5", color: "#1E1E1E" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem", background: "#FAF8F5" }}>
        <div className="max-w-6xl mx-auto">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid #DCD5C6", paddingBottom: "1.2rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <span style={{ color: "#81663F", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 800 }}>HUMAN RESOURCES & RECRUITMENT</span>
              <h1 style={{ fontSize: "2.2rem", fontWeight: 900, color: "#1E1E1E", margin: "0.2rem 0" }}>MANAGE OPEN ROLES</h1>
              <p style={{ color: "#555555", fontSize: "0.95rem" }}>Live Google Firebase Cloud Store</p>
            </div>
            <Link href="/admin/dashboard" style={{ background: "#F4EFE6", border: "1px solid #D5CEBF", color: "#1E1E1E", padding: "0.6rem 1.2rem", borderRadius: "8px", fontWeight: 800, fontSize: "0.85rem" }}>
              ← Dashboard
            </Link>
          </div>

          {notice && (
            <div style={{ marginBottom: "1.5rem", padding: "1rem 1.2rem", background: "#DCFCE7", border: "1px solid #86EFAC", color: "#15803D", borderRadius: "12px", display: "flex", alignItems: "center", gap: "0.75rem", fontWeight: 700, fontSize: "0.9rem" }}>
              <CheckCircle2 size={18} className="text-emerald-600" />
              {notice}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Add form */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E2DCD2", borderRadius: "16px", padding: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "1.2rem", paddingBottom: "0.6rem", borderBottom: "1px solid #EAE4D8", color: "#81663F" }}>Create Open Role</h2>
              <form onSubmit={handleAdd} className="space-y-5">
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#1E1E1E", marginBottom: "0.4rem" }}>Job Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Creative Developer"
                    value={newRole.title}
                    onChange={(e) => setNewRole({ ...newRole, title: e.target.value })}
                    style={{ background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", width: "100%", padding: "0.8rem", borderRadius: "8px", fontSize: "0.9rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#1E1E1E", marginBottom: "0.4rem" }}>Department</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Engineering / Motion"
                    value={newRole.department}
                    onChange={(e) => setNewRole({ ...newRole, department: e.target.value })}
                    style={{ background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", width: "100%", padding: "0.8rem", borderRadius: "8px", fontSize: "0.9rem" }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#1E1E1E", marginBottom: "0.4rem" }}>Location</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bangalore / Remote"
                      value={newRole.location}
                      onChange={(e) => setNewRole({ ...newRole, location: e.target.value })}
                      style={{ background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", width: "100%", padding: "0.8rem", borderRadius: "8px", fontSize: "0.9rem" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#1E1E1E", marginBottom: "0.4rem" }}>Job Type</label>
                    <select
                      value={newRole.type}
                      onChange={(e) => setNewRole({ ...newRole, type: e.target.value })}
                      style={{ background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", width: "100%", padding: "0.8rem", borderRadius: "8px", fontSize: "0.9rem" }}
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ background: "#1E1E1E", color: "#FFFFFF", width: "100%", padding: "0.9rem", borderRadius: "8px", fontWeight: 800, cursor: saving ? "wait" : "pointer", boxShadow: "0 4px 14px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                >
                  {saving ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />} Add Position
                </button>
              </form>
            </div>

            {/* List panel */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#81663F" }}>Active Job Positions ({positions.length})</h2>
              </div>
              {loading ? (
                <div style={{ padding: "2rem", textAlign: "center", color: "#6A6359" }}>Loading live positions...</div>
              ) : (
                <div className="space-y-3.5">
                  {positions.map((pos) => (
                    <div key={pos.id} style={{ background: "#FFFFFF", border: "1px solid #E2DCD2", borderRadius: "16px", padding: "1.4rem 1.6rem", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
                      <div>
                        <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#1E1E1E" }}>{pos.title}</h3>
                        <p style={{ fontSize: "0.82rem", color: "#555555", marginTop: "0.3rem", fontWeight: 700 }}>
                          {pos.department} • <span style={{ color: "#81663F", fontWeight: 800 }}>{pos.location}</span> ({pos.type})
                        </p>
                      </div>
                      <button 
                        onClick={() => handleDelete(pos.id)} 
                        style={{ padding: "0.5rem 0.8rem", background: "#FEE2E2", color: "#DC2626", border: "1px solid #FCA5A5", borderRadius: "8px", cursor: "pointer" }}
                        title="Delete Role"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
