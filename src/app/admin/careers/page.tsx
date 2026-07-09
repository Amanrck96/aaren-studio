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
    <div className="min-h-screen bg-[#080808] text-white pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black uppercase tracking-tight mb-12">MANAGE OPEN ROLES</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Add form */}
          <div className="border border-neutral-900 bg-neutral-950 p-8">
            <h2 className="text-xl font-bold uppercase mb-6">Create Open Role</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold mb-2">Job Title</label>
                <input
                  type="text"
                  required
                  value={newRole.title}
                  onChange={(e) => setNewRole({ ...newRole, title: e.target.value })}
                  className="w-full bg-[#080808] border border-neutral-800 p-4 text-white text-sm outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold mb-2">Department</label>
                <input
                  type="text"
                  required
                  value={newRole.department}
                  onChange={(e) => setNewRole({ ...newRole, department: e.target.value })}
                  className="w-full bg-[#080808] border border-neutral-800 p-4 text-white text-sm outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold mb-2">Location</label>
                <input
                  type="text"
                  required
                  value={newRole.location}
                  onChange={(e) => setNewRole({ ...newRole, location: e.target.value })}
                  className="w-full bg-[#080808] border border-neutral-800 p-4 text-white text-sm outline-none focus:border-accent"
                />
              </div>
              <button type="submit" className="w-full py-4 bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-accent hover:text-white transition-colors flex items-center justify-center gap-2">
                <Plus size={16} /> Add Position
              </button>
            </form>
          </div>

          {/* List panel */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold uppercase mb-6">Active Job Positions ({positions.length})</h2>
            <div className="space-y-4">
              {positions.map((pos) => (
                <div key={pos.id} className="border border-neutral-900 bg-neutral-950 p-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold uppercase">{pos.title}</h3>
                    <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">
                      {pos.department} • {pos.location}
                    </p>
                  </div>
                  <button onClick={() => handleDelete(pos.id)} className="text-red-500 hover:text-red-400 p-2">
                    <Trash2 size={18} />
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
