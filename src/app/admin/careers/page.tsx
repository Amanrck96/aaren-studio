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
    <div style={{ display: "flex", minHeight: "100vh", background: "#0b0f19", color: "#f8fafc" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem", background: "#0b0f19" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-800">
            <Link href="/admin/dashboard" style={{ background: "#1e293b", border: "1px solid #334155", color: "#d4af37" }} className="text-xs font-black uppercase tracking-widest px-4 py-2 hover:bg-slate-700 rounded-lg transition-all">
              ← Dashboard
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">MANAGE OPEN ROLES</h1>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-mono mt-0.5">Live Google Firebase Cloud Store</p>
            </div>
          </div>

          {notice && (
            <div className="mb-6 p-4 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 rounded-xl flex items-center gap-3 font-semibold text-sm">
              <CheckCircle2 size={18} className="text-emerald-400" />
              {notice}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Add form */}
            <div style={{ background: "#151c2c", border: "1px solid #28334e" }} className="rounded-2xl p-8 shadow-xl">
              <h2 className="text-lg font-black uppercase tracking-tight mb-6 pb-2 border-b border-slate-700 text-[#d4af37]">Create Open Role</h2>
              <form onSubmit={handleAdd} className="space-y-5">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-slate-300 mb-2">Job Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Creative Developer"
                    value={newRole.title}
                    onChange={(e) => setNewRole({ ...newRole, title: e.target.value })}
                    style={{ background: "#0f172a", border: "1px solid #334155", color: "#ffffff" }}
                    className="w-full rounded-lg p-3.5 text-sm outline-none focus:border-[#d4af37] transition-all placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-slate-300 mb-2">Department</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Engineering / Motion"
                    value={newRole.department}
                    onChange={(e) => setNewRole({ ...newRole, department: e.target.value })}
                    style={{ background: "#0f172a", border: "1px solid #334155", color: "#ffffff" }}
                    className="w-full rounded-lg p-3.5 text-sm outline-none focus:border-[#d4af37] transition-all placeholder:text-slate-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold text-slate-300 mb-2">Location</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bangalore / Remote"
                      value={newRole.location}
                      onChange={(e) => setNewRole({ ...newRole, location: e.target.value })}
                      style={{ background: "#0f172a", border: "1px solid #334155", color: "#ffffff" }}
                      className="w-full rounded-lg p-3.5 text-sm outline-none focus:border-[#d4af37] transition-all placeholder:text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold text-slate-300 mb-2">Job Type</label>
                    <select
                      value={newRole.type}
                      onChange={(e) => setNewRole({ ...newRole, type: e.target.value })}
                      style={{ background: "#0f172a", border: "1px solid #334155", color: "#ffffff" }}
                      className="w-full rounded-lg p-3.5 text-sm outline-none focus:border-[#d4af37] transition-all"
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
                  style={{ background: "linear-gradient(135deg, #d4af37 0%, #aa820a 100%)", color: "#000000" }}
                  className="w-full py-4 font-black uppercase tracking-widest text-xs hover:brightness-110 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />} Add Position
                </button>
              </form>
            </div>

            {/* List panel */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-black uppercase tracking-tight text-[#d4af37]">Active Job Positions ({positions.length})</h2>
              </div>
              {loading ? (
                <div className="p-8 text-center text-sm font-semibold text-slate-400">Loading live positions...</div>
              ) : (
                <div className="space-y-3.5">
                  {positions.map((pos) => (
                    <div key={pos.id} style={{ background: "#151c2c", border: "1px solid #28334e" }} className="rounded-xl p-5 flex justify-between items-center shadow-lg hover:border-slate-600 transition-all duration-300">
                      <div>
                        <h3 className="text-base font-black uppercase tracking-tight text-white">{pos.title}</h3>
                        <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-wider">
                          {pos.department} • <span className="text-[#38bdf8] font-black">{pos.location}</span> ({pos.type})
                        </p>
                      </div>
                      <button 
                        onClick={() => handleDelete(pos.id)} 
                        className="text-red-400 hover:bg-red-950/40 hover:text-red-300 p-2.5 rounded-lg border border-transparent hover:border-red-800 transition-all"
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
