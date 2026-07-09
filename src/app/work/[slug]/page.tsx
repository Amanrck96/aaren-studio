"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

const projectArchive: Record<string, {
  title: string;
  category: string;
  image: string;
  description: string;
  brandDetails: string;
  client: string;
  gallery: string[];
}> = {
  "virtual-horizons": {
    title: "VIRTUAL HORIZONS",
    category: "3D Animation / Motion",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    description: "An immersive 3D spatial project examining digital landscapes and virtual architecture in modern interactive formats.",
    brandDetails: "High definition 3D textures, digital skybox models, and custom synth audio design.",
    client: "AETHER CORP",
    gallery: [
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=800&q=80"
    ],
  },
  "neon-synapse": {
    title: "NEON SYNAPSE",
    category: "Branding / Creative Direction",
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80",
    description: "A complete brand restructuring including interactive visual toolkits and physical installations.",
    brandDetails: "High-contrast palette, adaptive layouts, custom display fonts.",
    client: "APEX LABS",
    gallery: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=800&q=80"
    ],
  },
  "chrono-cloud": {
    title: "CHRONO CLOUD",
    category: "Web Development / Design",
    image: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=800&q=80",
    description: "High-performance React application incorporating WebGL asset loaders and custom shaders.",
    brandDetails: "Fast bundle optimization, complex scrolling grids, reactive components.",
    client: "VERTEX CO",
    gallery: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80"
    ],
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProjectDetail({ params }: PageProps) {
  const resolvedParams = use(params);
  const project = projectArchive[resolvedParams.slug] || projectArchive["virtual-horizons"];

  return (
    <div className="bg-[#080808] text-white pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <Link href="/work" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-12 text-sm uppercase tracking-widest font-bold">
          <ArrowLeft size={16} /> Back to work
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-24">
          <div className="lg:col-span-2">
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tight mb-8">
              {project.title}
            </h1>
            <p className="text-neutral-400 text-lg md:text-xl leading-relaxed font-light">
              {project.description}
            </p>
          </div>

          <div className="border border-neutral-900 bg-neutral-950 p-8 space-y-6">
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-accent">CLIENT</h4>
              <p className="text-sm font-semibold uppercase mt-1">{project.client}</p>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-accent">SERVICES</h4>
              <p className="text-sm font-semibold uppercase mt-1">{project.category}</p>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-accent">DETAILS</h4>
              <p className="text-sm text-neutral-400 mt-1">{project.brandDetails}</p>
            </div>
          </div>
        </div>

        {/* Hero visual */}
        <div className="w-full aspect-[21/9] bg-neutral-900 overflow-hidden mb-16">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {project.gallery.map((imgUrl, index) => (
            <div key={index} className="aspect-[4/3] bg-neutral-900 overflow-hidden">
              <img src={imgUrl} alt={`gallery-${index}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
