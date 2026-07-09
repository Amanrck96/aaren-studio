"use client";

import { useState } from "react";
import Link from "next/link";

const blogPosts = [
  {
    title: "THE FUTURE OF INTERACTIVE WEBGL SHADERS",
    slug: "future-of-interactive-webgl-shaders",
    summary: "How WebGL and modern React frameworks are shaping premium branding layouts.",
    category: "Development",
    date: "July 8, 2026",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "ESTABLISHING MINIMALIST BRAND AESTHETICS",
    slug: "establishing-minimalist-brand-aesthetics",
    summary: "Key lessons from the design architecture of premium creative portfolios.",
    category: "Design",
    date: "July 2, 2026",
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "INTRODUCING REALTIME 3D CAMERA TRIGGERS",
    slug: "introducing-realtime-3d-camera-triggers",
    summary: "Configuring fluid scroll animations with GSAP and dynamic WebGL pipelines.",
    category: "Motion Graphics",
    date: "June 24, 2026",
    image: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=800&q=80",
  },
];

export default function Blog() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) || post.summary.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-[#080808] text-white pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h4 className="text-accent uppercase tracking-wider font-bold text-xs mb-4">INSIGHTS</h4>
        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tight mb-16">
          THE JOURNAL<span className="text-accent">.</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Grid */}
          <div className="lg:col-span-3 space-y-12">
            {filteredPosts.length === 0 ? (
              <p className="text-neutral-500">No matching articles found.</p>
            ) : (
              filteredPosts.map((post) => (
                <article key={post.slug} className="group border-b border-neutral-900 pb-12 flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-full md:w-1/3 aspect-video md:aspect-[4/3] bg-neutral-900 overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-accent">{post.category} • {post.date}</span>
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mt-2 mb-4 group-hover:text-accent transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="text-neutral-400 text-sm leading-relaxed mb-6 font-light">{post.summary}</p>
                    <Link href={`/blog/${post.slug}`} className="text-xs font-bold uppercase tracking-widest hover:text-accent transition-colors">
                      Read Article →
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-10">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-4 text-accent">SEARCH</h4>
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-900 p-4 text-white text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-4 text-accent">CATEGORIES</h4>
              <div className="flex flex-col space-y-2 text-sm font-semibold uppercase">
                {["All", "Development", "Design", "Motion Graphics"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left hover:text-accent transition-colors ${
                      selectedCategory === cat ? "text-accent" : "text-neutral-400"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
