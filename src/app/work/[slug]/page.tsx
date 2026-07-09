"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

const ALL_PROJECTS = [
  {
    slug: "oberoi-lobby",
    client: "The Oberoi",
    code: "OB 01",
    title: "Presidential Suite — Lobby Renovation",
    year: "2025",
    category: "Hospitality",
    team: ["Aaren Studio", "Thermory", "FIMA", "MAFI Flooring"],
    description:
      "A complete transformation of The Oberoi's grand lobby and Presidential Suite, integrating hand-selected Thermory wood cladding, Italian marble surfaces, and bespoke millwork to create a sanctuary of understated luxury. Every material was curated for tactile resonance and long-term durability.",
    images: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1631048835658-40e3ca47e846?auto=format&fit=crop&w=1600&q=85",
    ],
  },
  {
    slug: "ratan-hq",
    client: "Ratan Group",
    code: "RG 02",
    title: "Corporate Headquarters — Mumbai",
    year: "2025",
    category: "Commercial",
    team: ["Aaren Studio", "INCLASS Laminates", "Zipline Screens", "Aluminum Systems"],
    description:
      "A 40,000 sq.ft. corporate headquarters redefining the modern workplace. Featuring engineered Alpi veneers, precision aluminum partition systems, and Zipline screen installations. The space balances executive gravitas with collaborative openness.",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=85",
    ],
  },
  {
    slug: "alibaug-villa",
    client: "Private Villa",
    code: "PV 03",
    title: "Bespoke Residence — Alibaug",
    year: "2024",
    category: "Residential",
    team: ["Aaren Studio", "MAFI Flooring", "BULLFROG", "ANTONIOLUPI"],
    description:
      "A coastal residence where the boundary between structure and nature dissolves. Engineered MAFI flooring runs continuously from interior to exterior. The master bathroom features an ANTONIOLUPI soaking tub framed by floor-to-ceiling openings onto the Arabian Sea.",
    images: [
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85",
    ],
  },
  {
    slug: "taj-spa",
    client: "Taj Hotels",
    code: "TJ 04",
    title: "Spa & Wellness Sanctuary",
    year: "2024",
    category: "Hospitality",
    team: ["Aaren Studio", "BULLFROG Tubs", "Tempesta Terrazzo", "Arteffects Lighting"],
    description:
      "A subterranean wellness sanctuary beneath the Taj's historic property. Tempesta terrazzo floors, hand-plastered walls, and Arteffects bespoke lighting create a meditative atmosphere. BULLFROG hydrotherapy tubs anchor the treatment suites.",
    images: [
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=85",
    ],
  },
  {
    slug: "godrej-worli",
    client: "Godrej Properties",
    code: "GP 05",
    title: "Luxury Showflat — Worli",
    year: "2024",
    category: "Residential",
    team: ["Aaren Studio", "FALPER", "INCLASS Veneers", "Madheke Furniture"],
    description:
      "A 3,200 sq.ft. luxury showflat designed to communicate aspirational living in South Mumbai's most coveted address. Madheke furniture, INCLASS veneers, and FALPER bathroom fittings demonstrate the full potential of Godrej's flagship residential offering.",
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=85",
    ],
  },
  {
    slug: "nykaa-retail",
    client: "Nykaa",
    code: "NK 06",
    title: "Flagship Retail Experience",
    year: "2023",
    category: "Retail",
    team: ["Aaren Studio", "LOCO Millwork", "Arteffects Lighting", "INCLASS Surfaces"],
    description:
      "A flagship retail environment that transforms the beauty shopping experience. LOCO custom millwork creates sculptural display systems. Arteffects pendant lighting punctuates the space with warm pools of light against a palette of warm ivory and natural wood.",
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=85",
    ],
  },
  {
    slug: "birla-penthouse",
    client: "Birla Estates",
    code: "BE 07",
    title: "Penthouse Interiors — Delhi",
    year: "2023",
    category: "Residential",
    team: ["Aaren Studio", "MAFI Engineered Flooring", "Tammma Furniture", "FLAMINIA"],
    description: "A Delhi penthouse where Tammma's artisan furniture and MAFI engineered flooring create an atmosphere of warm minimalism. FLAMINIA ceramic sanitaryware completes the private spa level.",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=85",
    ],
  },
  {
    slug: "lodha-club",
    client: "Lodha Group",
    code: "LG 08",
    title: "Club Lounge & Amenity Deck",
    year: "2023",
    category: "Commercial",
    team: ["Aaren Studio", "Thermory Decking", "INCLASS Laminates", "Zipline Screens"],
    description: "A residents-only club lounge and outdoor amenity deck for Lodha's ultra-luxury residential tower. Thermory decking, bespoke millwork, and Zipline privacy screens define the 8,000 sq.ft. amenity level.",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=85",
    ],
  },
  {
    slug: "hiranandani-atrium",
    client: "Hiranandani",
    code: "HI 09",
    title: "Mixed-Use Lobby & Atrium",
    year: "2022",
    category: "Commercial",
    team: ["Aaren Studio", "WPC NEWTECH", "Aluminum System", "Arteffects Lighting"],
    description: "A monumental atrium at Hiranandani's Powai flagship blending WPC cladding, aluminum partition systems, and custom Arteffects lighting installations across 6 levels of interconnected retail and office space.",
    images: [
      "https://images.unsplash.com/photo-1504615755583-2916b52192a3?auto=format&fit=crop&w=1600&q=85",
    ],
  },
  {
    slug: "piramal-gallery",
    client: "Piramal Realty",
    code: "PR 10",
    title: "Sales Gallery — Lower Parel",
    year: "2022",
    category: "Retail",
    team: ["Aaren Studio", "INCLASS Veneers", "Madheke Furniture", "Custom Hardware"],
    description: "A 2,500 sq.ft. sales gallery designed to communicate the pinnacle of Mumbai residential development. INCLASS veneers, Madheke bespoke furniture, and precision custom hardware throughout.",
    images: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=85",
    ],
  },
];

export default function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const project = ALL_PROJECTS.find((p) => p.slug === slug);
  const currentIdx = ALL_PROJECTS.findIndex((p) => p.slug === slug);
  const prevProject = currentIdx > 0 ? ALL_PROJECTS[currentIdx - 1] : null;
  const nextProject = currentIdx < ALL_PROJECTS.length - 1 ? ALL_PROJECTS[currentIdx + 1] : null;

  if (!project) {
    return (
      <div style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "80px" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "2rem", color: "#ffffff", marginBottom: "16px" }}>Project not found</h1>
          <Link href="/work" style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>← Back to Work</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#0a0a0a", color: "#f0f0f0", paddingTop: "80px" }}>

      {/* ── Hero Image ── */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/7", overflow: "hidden", background: "#111" }}>
        <img
          src={project.images[0]}
          alt={project.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* ── Project Header ── */}
      <div
        style={{
          padding: "60px 28px 40px",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "40px",
          alignItems: "flex-start",
          borderBottom: "1px solid #1a1a1a",
        }}
      >
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "16px" }}>
            {project.client} &nbsp;·&nbsp; {project.category} &nbsp;·&nbsp; {project.year}
          </p>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 5rem)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.0,
              color: "#ffffff",
            }}
          >
            {project.title}
          </h1>
        </div>
        <p
          style={{
            fontSize: "clamp(3rem, 6vw, 7rem)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            color: "rgba(255,255,255,0.06)",
            lineHeight: 1,
            textAlign: "right",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          {project.code}
        </p>
      </div>

      {/* ── Meta Grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          borderBottom: "1px solid #1a1a1a",
        }}
      >
        {[
          { label: "Client", value: project.client },
          { label: "Year", value: project.year },
          { label: "Category", value: project.category },
          { label: "Project Code", value: project.code },
        ].map((item) => (
          <div key={item.label} style={{ padding: "28px", borderRight: "1px solid #1a1a1a" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "8px" }}>
              {item.label}
            </p>
            <p style={{ fontSize: "15px", color: "#ffffff", fontWeight: 500 }}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* ── Description ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", padding: "60px 28px", borderBottom: "1px solid #1a1a1a" }}>
        <p
          style={{
            fontSize: "clamp(1rem, 2vw, 1.5rem)",
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.55,
            letterSpacing: "-0.005em",
            fontWeight: 400,
          }}
        >
          {project.description}
        </p>
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "16px" }}>
            Partners & Brands
          </p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
            {project.team.map((member) => (
              <li key={member} style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", borderBottom: "1px solid #1a1a1a", paddingBottom: "8px" }}>
                {member}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Additional Images ── */}
      {project.images.slice(1).map((img, i) => (
        <div key={i} style={{ width: "100%", aspectRatio: i % 2 === 0 ? "16/9" : "21/9", overflow: "hidden", background: "#111", borderBottom: "1px solid #1a1a1a" }}>
          <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      ))}

      {/* ── Prev / Next ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid #1a1a1a" }}>
        {prevProject ? (
          <Link
            href={`/work/${prevProject.slug}`}
            style={{ padding: "40px 28px", borderRight: "1px solid #1a1a1a", display: "flex", alignItems: "center", gap: "16px", textDecoration: "none" }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#111")}
            onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <ArrowLeft size={18} style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "6px" }}>Previous</p>
              <p style={{ fontSize: "16px", fontWeight: 600, color: "#ffffff" }}>{prevProject.client}</p>
            </div>
          </Link>
        ) : <div />}

        {nextProject ? (
          <Link
            href={`/work/${nextProject.slug}`}
            style={{ padding: "40px 28px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "16px", textDecoration: "none" }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#111")}
            onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "6px" }}>Next</p>
              <p style={{ fontSize: "16px", fontWeight: 600, color: "#ffffff" }}>{nextProject.client}</p>
            </div>
            <ArrowRight size={18} style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }} />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
