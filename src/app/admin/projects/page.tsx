"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function AdminProjects() {
  const [projects, setProjects] = useState([
    { id: "1", title: "VIRTUAL HORIZONS", category: "3D Animation", client: "AETHER CORP" },
    { id: "2", title: "NEON SYNAPSE", category: "Branding", client: "APEX LABS" },
    { id: "3", title: "CHRONO CLOUD", category: "Web Design", client: "VERTEX CO" },
  ]);

  const [newProj, setNewProj] = useState({ title: "", category: "", client: "" });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProj.title) return;
    setProjects([...projects, { id: String(projects.length + 1), ...newProj }]);
    setNewProj({ title: "", category: "", client: "" });
  };

  const handleDelete = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black uppercase tracking-tight mb-12">MANAGE PROJECTS</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Add form */}
          <div className="border border-neutral-900 bg-neutral-950 p-8">
            <h2 className="text-xl font-bold uppercase mb-6">Create Project</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold mb-2">Project Title</label>
                <input
                  type="text"
                  required
                  value={newProj.title}
                  onChange={(e) => setNewProj({ ...newProj, title: e.target.value })}
                  className="w-full bg-[#080808] border border-neutral-800 p-4 text-white text-sm outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold mb-2">Category</label>
                <input
                  type="text"
                  required
                  value={newProj.category}
                  onChange={(e) => setNewProj({ ...newProj, category: e.target.value })}
                  className="w-full bg-[#080808] border border-neutral-800 p-4 text-white text-sm outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold mb-2">Client Name</label>
                <input
                  type="text"
                  required
                  value={newProj.client}
                  onChange={(e) => setNewProj({ ...newProj, client: e.target.value })}
                  className="w-full bg-[#080808] border border-neutral-800 p-4 text-white text-sm outline-none focus:border-accent"
                />
              </div>
              <button type="submit" className="w-full py-4 bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-accent hover:text-white transition-colors flex items-center justify-center gap-2">
                <Plus size={16} /> Insert Record
              </button>
            </form>
          </div>

          {/* List panel */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold uppercase mb-6">Database Records ({projects.length})</h2>
            <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.id} className="border border-neutral-900 bg-neutral-950 p-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold uppercase">{proj.title}</h3>
                    <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">
                      {proj.category} • Client: {proj.client}
                    </p>
                  </div>
                  <button onClick={() => handleDelete(proj.id)} className="text-red-500 hover:text-red-400 p-2">
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
