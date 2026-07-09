"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play, ArrowUpRight } from "lucide-react";

import WebGLCanvas from "@/components/WebGLCanvas";

gsap.registerPlugin(ScrollTrigger);

// Custom mock values to avoid blank UI pages
const featuredProjects = [
  {
    title: "VIRTUAL HORIZONS",
    category: "3D Animation / Motion Graphics",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    slug: "virtual-horizons",
  },
  {
    title: "NEON SYNAPSE",
    category: "Brand Identity / Creative Direction",
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80",
    slug: "neon-synapse",
  },
  {
    title: "CHRONO CLOUD",
    category: "Web Design / Interactive Dev",
    image: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=800&q=80",
    slug: "chrono-cloud",
  },
];

const clientBrands = [
  "AETHER CORP", "APEX LABS", "VERTEX CO", "ZEPHYR MEDIA", "NEXUS INTERACTIVE", "GRAVITY DESIGN"
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Premium loading screen timeout animation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) return;

    // GSAP ScrollTrigger intro fade animations
    const ctx = gsap.context(() => {
      gsap.from(heroTextRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out",
      });

      gsap.utils.toArray(".project-card").forEach((card: any) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [loading]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#080808] z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-black tracking-widest text-white">AAREN</h1>
          <div className="w-16 h-[2px] bg-accent mx-auto mt-4 animate-pulse" />
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="bg-[#080808] text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center px-6 md:px-12">
        <div className="absolute inset-0 bg-black/60 z-10" />
        {/* WebGL Canvas background points */}
        <WebGLCanvas />
        {/* Placeholder video background (premium dark gradient look) */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-purple-900/20 via-black to-red-900/20" />
        
        <div className="relative z-20 text-center max-w-5xl">
          <h1 ref={heroTextRef} className="text-huge text-white font-black tracking-tighter mb-8 leading-none">
            WE MAKE<br />IT UNREAL<span className="text-accent">.</span>
          </h1>
          <p className="text-neutral-400 text-lg md:text-2xl max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Aaren Creative Studio is a global powerhouse of design, interactive production, and immersive brand stories.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/work"
              className="px-8 py-4 bg-white text-black font-bold uppercase tracking-wider text-sm hover:bg-accent hover:text-white transition-all flex items-center gap-2 group"
            >
              Explore Portfolio
              <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-wider text-sm hover:border-accent transition-colors"
            >
              Start A Project
            </Link>
          </div>
        </div>
      </section>

      {/* Infinite Marquee Section */}
      <section className="py-12 bg-accent/90 text-white border-y border-neutral-900">
        <div className="infinite-marquee">
          <div className="marquee-content font-black text-4xl md:text-7xl uppercase tracking-tighter space-x-12 py-2">
            <span>AAREN CREATIVE STUDIO • NEXT GEN IMMERSIVE EXPERIENCES • BRANDING • MOTION GRAPHICS • 3D ANIMATION • UI UX DESIGN • </span>
            <span>AAREN CREATIVE STUDIO • NEXT GEN IMMERSIVE EXPERIENCES • BRANDING • MOTION GRAPHICS • 3D ANIMATION • UI UX DESIGN • </span>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-20">
          <div>
            <h4 className="text-accent uppercase tracking-wider font-bold text-xs mb-4">SELECTED WORKS</h4>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight">FEATURED CREATIONS</h2>
          </div>
          <Link href="/work" className="text-sm font-bold uppercase tracking-wider hover:text-accent transition-colors mt-4 md:mt-0">
            View All Projects →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {featuredProjects.map((project, idx) => (
            <Link href={`/work/${project.slug}`} key={idx} className="project-card group block">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900 mb-6">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight group-hover:text-accent transition-colors">
                {project.title}
              </h3>
              <p className="text-neutral-400 text-xs mt-2 uppercase tracking-widest">{project.category}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Clients Section */}
      <section className="py-24 bg-[#0c0c0c] px-6 md:px-12 border-y border-neutral-900">
        <div className="max-w-7xl mx-auto">
          <h4 className="text-accent uppercase tracking-wider font-bold text-xs text-center mb-16">TRUSTED BY WORLD CLASS BRANDS</h4>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center text-center">
            {clientBrands.map((brand, idx) => (
              <div key={idx} className="text-neutral-500 font-bold uppercase tracking-widest text-lg hover:text-white transition-colors duration-300">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
