"use client";

import { useState } from "react";

const positions = [
  { id: "1", title: "3D Generalist", department: "Motion Design", location: "Remote / Bangalore" },
  { id: "2", title: "Senior Creative Developer", department: "Engineering", location: "Bangalore, India" },
  { id: "3", title: "Art Director", department: "Creative", location: "Hybrid / Bangalore" },
];

export default function Careers() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    position: "1",
    portfolio: "",
    resume: "",
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
  };

  return (
    <div className="bg-[#080808] text-white pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h4 className="text-accent uppercase tracking-wider font-bold text-xs mb-4">JOIN US</h4>
        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tight mb-16">
          CAREERS<span className="text-accent">.</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Job listings */}
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight mb-8">OPEN POSITIONS</h2>
            <div className="space-y-6">
              {positions.map((pos) => (
                <div key={pos.id} className="border border-neutral-900 bg-neutral-950 p-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold uppercase">{pos.title}</h3>
                    <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">
                      {pos.department} • {pos.location}
                    </p>
                  </div>
                  <button
                    onClick={() => setFormData({ ...formData, position: pos.id })}
                    className="px-4 py-2 border border-white/20 text-xs font-bold uppercase hover:border-accent hover:text-accent transition-colors"
                  >
                    Apply
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="border border-neutral-900 bg-neutral-950 p-10">
            <h2 className="text-3xl font-black uppercase tracking-tight mb-8">APPLY NOW</h2>
            {success ? (
              <div className="p-6 bg-accent/20 border border-accent text-center">
                <h3 className="text-xl font-bold uppercase">Application Submitted</h3>
                <p className="text-neutral-400 text-sm mt-2">Thank you! Our recruitment team will be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#080808] border border-neutral-800 p-4 text-white text-sm focus:border-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#080808] border border-neutral-800 p-4 text-white text-sm focus:border-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold mb-2">Select Position</label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full bg-[#080808] border border-neutral-800 p-4 text-white text-sm focus:border-accent outline-none"
                  >
                    {positions.map((pos) => (
                      <option key={pos.id} value={pos.id} className="bg-neutral-950">
                        {pos.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold mb-2">Portfolio Link</label>
                  <input
                    type="url"
                    placeholder="https://"
                    value={formData.portfolio}
                    onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                    className="w-full bg-[#080808] border border-neutral-800 p-4 text-white text-sm focus:border-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold mb-2">Resume Drive Link</label>
                  <input
                    type="url"
                    placeholder="https://"
                    required
                    value={formData.resume}
                    onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                    className="w-full bg-[#080808] border border-neutral-800 p-4 text-white text-sm focus:border-accent outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-white text-black font-bold uppercase tracking-wider hover:bg-accent hover:text-white transition-colors"
                >
                  Submit Application
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
