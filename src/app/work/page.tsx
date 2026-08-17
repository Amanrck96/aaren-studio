"use client";

import { useEffect, useState } from "react";
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
  const [projectsList, setProjectsList] = useState(ALL_PROJECTS);
  const [activeFilter, setActiveFilter] = useState("All");
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [flipImage, setFlipImage] = useState(false);

  useEffect(() => {
    fetch("/api/projects?t=" + Date.now(), { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
          setProjectsList(
            json.data.map((p: any, idx: number) => ({
              client: p.client || p.title,
              code: p.client ? p.client.substring(0, 2).toUpperCase() : "PR",
              num: idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`,
              title: p.title,
              year: p.year || "2025",
              category: p.category || "Commercial",
              image: p.imageUrl || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
              slug: p.slug || p.id || `project-${idx + 1}`,
            }))
          );
        }
      })
      .catch((e) => console.error(e));
  }, []);

  const filtered =
    activeFilter === "All"
      ? projectsList
      : projectsList.filter((p) => p.category === activeFilter);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    setFlipImage(e.clientX > window.innerWidth / 2);
  };

  const hoveredData = ALL_PROJECTS.find((p) => p.slug === hoveredProject);

  return (
    <div
      style={{ background: "#E6E2D8", color: "#1e1e1e", minHeight: "100vh", paddingTop: "80px" }}
      onMouseMove={handleMouseMove}
    >
      {/* ── Floating hover preview image — Sturdy.co style ── */}
      <div
        style={{
          position: "fixed",
          pointerEvents: "none",
          zIndex: 800,
          left: flipImage ? "auto" : mousePos.x + 28,
          right: flipImage ? window.innerWidth - mousePos.x + 28 : "auto",
          top: mousePos.y - 130,
          width: "320px",
          height: "240px",
          opacity: hoveredProject ? 1 : 0,
          transform: hoveredProject ? "translateY(0) scale(1)" : "translateY(12px) scale(0.97)",
          transition: "opacity 0.25s ease, transform 0.3s ease",
          overflow: "hidden",
          borderRadius: "6px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          border: "1px solid rgba(129, 102, 63, 0.3)",
        }}
      >
        {hoveredData && (
          <img
            src={hoveredData.image}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        )}
      </div>

      {/* Page Header */}
      <div
        style={{
          padding: "60px 28px 0",
          borderBottom: "1px solid rgba(129, 102, 63, 0.2)",
        }}
      >
        <div style={{ fontSize: "1.1rem", fontWeight: 700, letterSpacing: "0.12em", color: "#81663F", marginBottom: "1.2rem", textTransform: "uppercase" }}>
          PORTFOLIO ARCHIVE
        </div>
        <h1
          style={{
            fontSize: "clamp(2.5rem, 8vw, 8rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.0,
            color: "#81663F",
            marginBottom: "40px",
            textTransform: "uppercase",
          }}
        >
          Work
        </h1>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: "0", marginBottom: "0", overflowX: "auto" }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              style={{
                background: "none",
                border: "none",
                borderRight: "1px solid rgba(129, 102, 63, 0.18)",
                padding: "14px 20px",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: activeFilter === cat ? "#81663F" : "rgba(129, 102, 63, 0.5)",
                transition: "color 0.2s",
                borderBottom: activeFilter === cat ? "2px solid #81663F" : "2px solid transparent",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => { if (activeFilter !== cat) (e.currentTarget.style.color = "#81663F"); }}
              onMouseLeave={(e) => { if (activeFilter !== cat) (e.currentTarget.style.color = "rgba(129, 102, 63, 0.5)"); }}
            >
              {cat} {cat === "All" ? `[${projectsList.length}]` : `[${projectsList.filter(p => p.category === cat).length}]`}
            </button>
          ))}
        </div>
      </div>

      {/* Project List */}
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
              borderBottom: "1px solid rgba(129, 102, 63, 0.15)",
              gap: "24px",
              textDecoration: "none",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#FAF9F6")}
            onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
          >
            {/* Index */}
            <span
              style={{
                fontSize: "12px",
                color: "rgba(129, 102, 63, 0.4)",
                letterSpacing: "0.05em",
                fontWeight: 700,
              }}
            >
              {String(idx + 1).padStart(2, "0")}
            </span>

            {/* Client + title */}
            <div>
              <p style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#5E5852", marginBottom: "4px", fontWeight: 600 }}>
                {project.client}
              </p>
              <h2
                style={{
                  fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  color: "#81663F",
                  margin: 0,
                }}
              >
                {project.title}
              </h2>
            </div>

            {/* Right meta */}
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{ fontSize: "11px", letterSpacing: "0.05em", color: "#5E5852", marginBottom: "4px", fontWeight: 600 }}>
                {project.year}
              </p>
              <p style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#81663F", fontWeight: 700 }}>
                {project.code} {project.num}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
