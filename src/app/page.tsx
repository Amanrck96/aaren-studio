"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  "Interior Design",
  "Space Planning",
  "Material Curation",
  "Furniture Design",
  "Architectural Surfaces",
  "Lighting Design",
  "Joinery & Millwork",
  "Bathroom & Wellness",
  "Flooring Systems",
  "Facade & Cladding",
  "Brand Environments",
  "Turnkey Delivery",
];

const PROJECTS = [
  {
    client: "The Oberoi",
    code: "OB",
    num: "01",
    title: "Presidential Suite — Lobby Renovation",
    year: "2025",
    category: "Hospitality",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=85",
    slug: "oberoi-lobby",
  },
  {
    client: "Ratan Group",
    code: "RG",
    num: "02",
    title: "Corporate Headquarters — Mumbai",
    year: "2025",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=85",
    slug: "ratan-hq",
  },
  {
    client: "Private Villa",
    code: "PV",
    num: "03",
    title: "Bespoke Residence — Alibaug",
    year: "2024",
    category: "Residential",
    image: "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=900&q=85",
    slug: "alibaug-villa",
  },
  {
    client: "Taj Hotels",
    code: "TJ",
    num: "04",
    title: "Spa & Wellness Sanctuary",
    year: "2024",
    category: "Hospitality",
    image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=900&q=85",
    slug: "taj-spa",
  },
  {
    client: "Godrej Properties",
    code: "GP",
    num: "05",
    title: "Luxury Showflat — Worli",
    year: "2024",
    category: "Residential",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=85",
    slug: "godrej-worli",
  },
  {
    client: "Nykaa",
    code: "NK",
    num: "06",
    title: "Flagship Retail Experience",
    year: "2023",
    category: "Retail",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=85",
    slug: "nykaa-retail",
  },
  {
    client: "Birla Estates",
    code: "BE",
    num: "07",
    title: "Penthouse Interiors — Delhi",
    year: "2023",
    category: "Residential",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=85",
    slug: "birla-penthouse",
  },
  {
    client: "Lodha Group",
    code: "LG",
    num: "08",
    title: "Club Lounge & Amenity Deck",
    year: "2023",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85",
    slug: "lodha-club",
  },
];

const CLIENTS = [
  "The Oberoi", "Taj Hotels", "Godrej Properties", "Nykaa",
  "Ratan Group", "Hiranandani", "Lodha Group", "Piramal Realty",
  "Birla Estates", "Mahindra",
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  // Track which side of screen cursor is on to flip image
  const [flipImage, setFlipImage] = useState(false);

  const handleMouseMove = (e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    setFlipImage(e.clientX > window.innerWidth / 2);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-line", {
        y: "110%",
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.1,
      });
      gsap.from(".hero-meta", {
        opacity: 0,
        y: 16,
        duration: 0.9,
        delay: 0.9,
        ease: "power3.out",
        stagger: 0.04,
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const hoveredProject = PROJECTS.find((p) => p.slug === hoveredSlug);

  return (
    <div ref={heroRef} style={{ background: "#0a0a0a", color: "#f0f0f0", minHeight: "100vh" }}>

      {/* ══════════════════════════════════════
          FLOATING HOVER IMAGE — Drake/Bad Bunny style
          Follows cursor, shows on project name hover
      ══════════════════════════════════════ */}
      <div
        style={{
          position: "fixed",
          pointerEvents: "none",
          zIndex: 800,
          // Flip to left side if cursor is on right half
          left: flipImage ? "auto" : mousePos.x + 28,
          right: flipImage ? window.innerWidth - mousePos.x + 28 : "auto",
          top: mousePos.y - 120,
          width: "320px",
          height: "240px",
          opacity: hoveredSlug ? 1 : 0,
          transform: hoveredSlug ? "translateY(0) scale(1)" : "translateY(12px) scale(0.97)",
          transition: "opacity 0.25s ease, transform 0.3s ease",
          overflow: "hidden",
        }}
      >
        {hoveredProject && (
          <img
            src={hoveredProject.image}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        )}
      </div>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section
        style={{
          minHeight: "100vh",
          padding: "0 28px 80px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          position: "relative",
        }}
      >
        <div style={{ maxWidth: "1200px" }}>
          <div style={{ overflow: "hidden", marginBottom: "4px" }}>
            <p className="hero-line" style={{ fontSize: "clamp(2.4rem, 5.8vw, 6rem)", fontWeight: 700, lineHeight: 1.0, letterSpacing: "-0.03em", color: "#ffffff" }}>
              A creative studio and material house
            </p>
          </div>
          <div style={{ overflow: "hidden", marginBottom: "4px" }}>
            <p className="hero-line" style={{ fontSize: "clamp(2.4rem, 5.8vw, 6rem)", fontWeight: 700, lineHeight: 1.0, letterSpacing: "-0.03em", color: "#ffffff" }}>
              dedicated to designing and producing
            </p>
          </div>
          <div style={{ overflow: "hidden", marginBottom: "4px" }}>
            <p className="hero-line" style={{ fontSize: "clamp(2.4rem, 5.8vw, 6rem)", fontWeight: 700, lineHeight: 1.0, letterSpacing: "-0.03em", color: "rgba(255,255,255,0.28)" }}>
              immersive spatial experiences — meant
            </p>
          </div>
          <div style={{ overflow: "hidden" }}>
            <p className="hero-line" style={{ fontSize: "clamp(2.4rem, 5.8vw, 6rem)", fontWeight: 700, lineHeight: 1.0, letterSpacing: "-0.03em", color: "rgba(255,255,255,0.28)" }}>
              to evoke feeling.
            </p>
          </div>

          {/* Services tag list */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px", marginTop: "48px", borderTop: "1px solid #1a1a1a", paddingTop: "24px" }}>
            {SERVICES.map((s, i) => (
              <span key={i} className="hero-meta" style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.01em" }}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Studio mark bottom-right */}
        <div style={{ position: "absolute", bottom: "32px", right: "28px", textAlign: "right" }} className="hero-meta">
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            AAREN.© {new Date().getFullYear()}
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SELECTED WORK — Sturdy.co list style
          Hover over client name → floating image appears
      ══════════════════════════════════════ */}
      <section style={{ borderTop: "1px solid #1a1a1a" }}>

        {/* Section label row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 28px",
            borderBottom: "1px solid #1a1a1a",
          }}
        >
          <p style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
            Selected Work
          </p>
          <Link
            href="/work"
            className="link-underline"
            style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
          >
            All Projects [{PROJECTS.length}]
          </Link>
        </div>

        {/* ── Project rows — hover to reveal floating image ── */}
        {PROJECTS.map((project, idx) => (
          <Link
            key={project.slug}
            href={`/work/${project.slug}`}
            onMouseEnter={() => setHoveredSlug(project.slug)}
            onMouseLeave={() => setHoveredSlug(null)}
            style={{
              display: "grid",
              gridTemplateColumns: "48px 1fr auto",
              alignItems: "center",
              padding: "22px 28px",
              borderBottom: "1px solid #1a1a1a",
              gap: "24px",
              textDecoration: "none",
              background: hoveredSlug === project.slug ? "#111111" : "transparent",
              transition: "background 0.2s",
            }}
          >
            {/* Row number */}
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.18)", fontWeight: 500, letterSpacing: "0.04em" }}>
              {String(idx + 1).padStart(2, "0")}
            </span>

            {/* Client name + project title */}
            <div>
              <h3
                style={{
                  fontSize: "clamp(1.1rem, 2.5vw, 2rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  color: hoveredSlug === project.slug ? "#ffffff" : "rgba(255,255,255,0.85)",
                  transition: "color 0.15s",
                  marginBottom: "4px",
                }}
              >
                {project.client}
              </h3>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.01em" }}>
                {project.title}
              </p>
            </div>

            {/* Year + code — right side */}
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.06em", marginBottom: "3px" }}>
                {project.year}
              </p>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.1)", letterSpacing: "-0.01em" }}>
                {project.code} {project.num}
              </p>
            </div>
          </Link>
        ))}
      </section>

      {/* ══════════════════════════════════════
          CLIENT MARQUEE STRIP
      ══════════════════════════════════════ */}
      <section style={{ borderTop: "1px solid #1a1a1a", padding: "20px 0", overflow: "hidden" }}>
        <div className="marquee-wrap">
          <div className="marquee-track">
            {[...CLIENTS, ...CLIENTS].map((client, i) => (
              <span
                key={i}
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.28)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "0 28px",
                  whiteSpace: "nowrap",
                  borderRight: "1px solid #1a1a1a",
                }}
              >
                {client}
              </span>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
