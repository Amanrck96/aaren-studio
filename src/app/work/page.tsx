"use client";

import { useState } from "react";
import Link from "next/link";

const ALL_PROJECTS = [
  { client: "The Oberoi", code: "OB", num: "01", title: "Presidential Suite — Lobby Renovation", year: "2025", category: "Hospitality", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80", slug: "oberoi-lobby" },
  { client: "Ratan Group", code: "RG", num: "02", title: "Corporate Headquarters — Mumbai", year: "2025", category: "Commercial", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80", slug: "ratan-hq" },
  { client: "Private Villa", code: "PV", num: "03", title: "Bespoke Residence — Alibaug", year: "2024", category: "Residential", image: "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=800&q=80", slug: "alibaug-villa" },
  { client: "Taj Hotels", code: "TJ", num: "04", title: "Spa & Wellness Sanctuary", year: "2024", category: "Hospitality", image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80", slug: "taj-spa" },
  { client: "Godrej Properties", code: "GP", num: "05", title: "Luxury Showflat — Worli", year: "2024", category: "Residential", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80", slug: "godrej-worli" },
  { client: "Nykaa", code: "NK", num: "06", title: "Flagship Retail Experience", year: "2023", category: "Retail", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80", slug: "nykaa-retail" },
  { client: "Birla Estates", code: "BE", num: "07", title: "Penthouse Interiors — Delhi", year: "2023", category: "Residential", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80", slug: "birla-penthouse" },
  { client: "Lodha Group", code: "LG", num: "08", title: "Club Lounge & Amenity Deck", year: "2023", category: "Commercial", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80", slug: "lodha-club" },
  { client: "Hiranandani", code: "HI", num: "09", title: "Mixed-Use Lobby & Atrium", year: "2022", category: "Commercial", image: "https://images.unsplash.com/photo-1504615755583-2916b52192a3?auto=format&fit=crop&w=800&q=80", slug: "hiranandani-atrium" },
  { client: "Piramal Realty", code: "PR", num: "10", title: "Sales Gallery — Lower Parel", year: "2022", category: "Retail", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80", slug: "piramal-gallery" },
];

const CATEGORIES = ["All", "Hospitality", "Residential", "Commercial", "Retail"];

export default function WorkPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const filtered =
    activeFilter === "All"
      ? ALL_PROJECTS
      : ALL_PROJECTS.filter((p) => p.category === activeFilter);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      style={{ background: "#0a0a0a", color: "#f0f0f0", minHeight: "100vh", paddingTop: "80px" }}
      onMouseMove={handleMouseMove}
    >
      {/* Floating hover preview image */}
      {hoveredProject && (
        <div
          style={{
            position: "fixed",
            left: mousePos.x + 20,
            top: mousePos.y - 80,
            width: "240px",
            height: "160px",
            pointerEvents: "none",
            zIndex: 500,
            overflow: "hidden",
            transition: "opacity 0.2s ease",
          }}
        >
          <img
            src={ALL_PROJECTS.find((p) => p.slug === hoveredProject)?.image}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}

      {/* Page Header */}
      <div
        style={{
          padding: "60px 28px 0",
          borderBottom: "1px solid #1a1a1a",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2.5rem, 8vw, 8rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.0,
            color: "#ffffff",
            marginBottom: "40px",
          }}
        >
          Work
        </h1>

        {/* Filter tabs — exactly like Sturdy */}
        <div style={{ display: "flex", gap: "0", marginBottom: "0" }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              style={{
                background: "none",
                border: "none",
                borderRight: "1px solid #1a1a1a",
                padding: "14px 20px",
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: activeFilter === cat ? "#ffffff" : "rgba(255,255,255,0.35)",
                transition: "color 0.2s",
                borderBottom: activeFilter === cat ? "1px solid #ffffff" : "1px solid transparent",
              }}
              onMouseEnter={(e) => { if (activeFilter !== cat) (e.currentTarget.style.color = "rgba(255,255,255,0.7)"); }}
              onMouseLeave={(e) => { if (activeFilter !== cat) (e.currentTarget.style.color = "rgba(255,255,255,0.35)"); }}
            >
              {cat} {cat === "All" ? `[${ALL_PROJECTS.length}]` : `[${ALL_PROJECTS.filter(p => p.category === cat).length}]`}
            </button>
          ))}
        </div>
      </div>

      {/* Project List — exact Sturdy.co row style */}
      <div>
        {filtered.map((project, idx) => (
          <Link
            key={project.slug}
            href={`/work/${project.slug}`}
            onMouseEnter={() => setHoveredProject(project.slug)}
            onMouseLeave={() => setHoveredProject(null)}
            style={{
              display: "grid",
              gridTemplateColumns: "60px 1fr auto",
              alignItems: "center",
              padding: "24px 28px",
              borderBottom: "1px solid #1a1a1a",
              gap: "24px",
              textDecoration: "none",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#111111")}
            onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
          >
            {/* Index */}
            <span
              style={{
                fontSize: "12px",
                color: "rgba(255,255,255,0.2)",
                letterSpacing: "0.05em",
                fontWeight: 500,
              }}
            >
              {String(idx + 1).padStart(2, "0")}
            </span>

            {/* Client + title */}
            <div>
              <p style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "4px" }}>
                {project.client}
              </p>
              <h2
                style={{
                  fontSize: "clamp(1rem, 2vw, 1.5rem)",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  color: "#ffffff",
                }}
              >
                {project.title}
              </h2>
            </div>

            {/* Right meta */}
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{ fontSize: "11px", letterSpacing: "0.05em", color: "rgba(255,255,255,0.3)", marginBottom: "4px" }}>
                {project.year}
              </p>
              <p style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
                {project.code} {project.num}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
