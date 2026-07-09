"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const allProjects = [
  {
    title: "VIRTUAL HORIZONS",
    category: "3D",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    slug: "virtual-horizons",
  },
  {
    title: "NEON SYNAPSE",
    category: "Branding",
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80",
    slug: "neon-synapse",
  },
  {
    title: "CHRONO CLOUD",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=800&q=80",
    slug: "chrono-cloud",
  },
  {
    title: "AETHER VISION",
    category: "3D",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    slug: "aether-vision",
  },
  {
    title: "QUANTUM MATRIX",
    category: "Branding",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
    slug: "quantum-matrix",
  },
  {
    title: "APEX HORIZON",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    slug: "apex-horizon",
  },
];

const categories = ["All", "3D", "Branding", "Web Development"];

export default function Work() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProjects = selectedCategory === "All"
    ? allProjects
    : allProjects.filter((project) => project.category === selectedCategory);

  return (
    <div className="bg-[#080808] text-white pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h4 className="text-accent uppercase tracking-wider font-bold text-xs mb-4">PORTFOLIO</h4>
        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tight mb-16">
          OUR ARCHIVE<span className="text-accent">.</span>
        </h1>

        {/* Filter categories */}
        <div className="flex flex-wrap gap-4 mb-16 border-b border-neutral-900 pb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 text-xs font-bold uppercase tracking-widest border transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-white text-black border-white"
                  : "border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Portfolio grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {filteredProjects.map((project, idx) => (
            <Link href={`/work/${project.slug}`} key={idx} className="group block">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900 mb-6">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-102 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center font-bold">
                    <ArrowUpRight size={20} />
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-neutral-400 text-xs mt-2 uppercase tracking-widest">
                    {project.category}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
