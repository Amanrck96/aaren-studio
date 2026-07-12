"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function AdminCareers() {
  const [positions, setPositions] = useState([
    { id: "1", title: "3D Generalist", department: "Motion Design", location: "Remote / Bangalore" },
    { id: "2", title: "Senior Creative Developer", department: "Engineering", location: "Bangalore, India" },
  ]);

  const [newRole, setNewRole] = useState({ title: "", department: "", location: "" });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole.title) return;
    setPositions([...positions, { id: String(positions.length + 1), ...newRole }]);
    setNewRole({ title: "", department: "", location: "" });
  };

  const handleDelete = (id: string) => {
    setPositions(positions.filter((pos) => pos.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#eaeef4] text-[#1e1e1e] pt-32 pb-24 px-6 md:px-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <a href="/admin/dashboard" className="text-xs font-black uppercase tracking-widest px-4 py-2 bg-white/80 border border-black/10 hover:bg-black hover:text-white rounded-lg transition-all">
            ← Dashboard
          </a>
          <div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-[#1e1e1e]">MANAGE OPEN ROLES</h1>
            <p className="text-xs uppercase tracking-wider text-black/40 font-mono mt-0.5">Database records</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Add form */}
          <div className="bg-white border border-black/10 rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-black uppercase tracking-tight mb-6 pb-2 border-b border-black/5">Create Open Role</h2>
            <form onSubmit={handleAdd} className="space-y-5">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-black text-black/55 mb-2">Job Title</label>
                <input
                  type="text"
                  required
                  value={newRole.title}
                  onChange={(e) => setNewRole({ ...newRole, title: e.target.value })}
                  className="w-full bg-[#eaeef4]/50 border border-black/10 rounded-lg p-3.5 text-black text-sm outline-none focus:border-black/30 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-black text-black/55 mb-2">Department</label>
                <input
                  type="text"
                  required
                  value={newRole.department}
                  onChange={(e) => setNewRole({ ...newRole, department: e.target.value })}
                  className="w-full bg-[#eaeef4]/50 border border-black/10 rounded-lg p-3.5 text-black text-sm outline-none focus:border-black/30 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-black text-black/55 mb-2">Location</label>
                <input
                  type="text"
                  required
                  value={newRole.location}
                  onChange={(e) => setNewRole({ ...newRole, location: e.target.value })}
                  className="w-full bg-[#eaeef4]/50 border border-black/10 rounded-lg p-3.5 text-black text-sm outline-none focus:border-black/30 focus:bg-white transition-all"
                />
              </div>
              <button type="submit" className="w-full py-4 bg-black text-white font-black uppercase tracking-widest text-xs hover:bg-black/80 rounded-lg transition-all flex items-center justify-center gap-2">
                <Plus size={14} /> Add Position
              </button>
            </form>
          </div>

          {/* List panel */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black uppercase tracking-tight">Active Job Positions ({positions.length})</h2>
            </div>
            <div className="space-y-3.5">
              {positions.map((pos) => (
                <div key={pos.id} className="bg-white border border-black/10 rounded-xl p-5 flex justify-between items-center shadow-sm hover:shadow-md transition-all duration-300">
                  <div>
                    <h3 className="text-base font-black uppercase tracking-tight text-[#1e1e1e]">{pos.title}</h3>
                    <p className="text-xs text-black/40 mt-1 uppercase font-bold tracking-wider">
                      {pos.department} • <span className="text-black/60 font-black">{pos.location}</span>
                    </p>
                  </div>
                  <button 
                    onClick={() => handleDelete(pos.id)} 
                    className="text-red-500 hover:bg-red-50 hover:text-red-600 p-2.5 rounded-lg border border-transparent hover:border-red-100 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
