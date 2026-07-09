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
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85",
    slug: "oberoi-lobby",
    large: true,
  },
  {
    client: "Ratan Group",
    code: "RG",
    num: "02",
    title: "Corporate Headquarters — Mumbai",
    year: "2025",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=85",
    slug: "ratan-hq",
    large: false,
  },
  {
    client: "Private Villa",
    code: "PV",
    num: "03",
    title: "Bespoke Residence — Alibaug",
    year: "2024",
    category: "Residential",
    image: "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=800&q=85",
    slug: "alibaug-villa",
    large: false,
  },
  {
    client: "Taj Hotels",
    code: "TJ",
    num: "04",
    title: "Spa & Wellness Sanctuary",
    year: "2024",
    category: "Hospitality",
    image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=85",
    slug: "taj-spa",
    large: true,
  },
  {
    client: "Godrej Properties",
    code: "GP",
    num: "05",
    title: "Luxury Showflat — Worli",
    year: "2024",
    category: "Residential",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=85",
    slug: "godrej-worli",
    large: false,
  },
  {
    client: "Nykaa",
    code: "NK",
    num: "06",
    title: "Flagship Retail Experience",
    year: "2023",
    category: "Retail",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=85",
    slug: "nykaa-retail",
    large: false,
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
      gsap.utils.toArray<HTMLElement>(".proj-card").forEach((card) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none none",
          },
          y: 48,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} style={{ background: "#0a0a0a", color: "#f0f0f0", minHeight: "100vh" }}>

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

          {/* Services tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px", marginTop: "48px", borderTop: "1px solid #1a1a1a", paddingTop: "24px" }}>
            {SERVICES.map((s, i) => (
              <span key={i} className="hero-meta" style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>
                {s}
              </span>
            ))}
          </div>
        </div>

        <div style={{ position: "absolute", bottom: "32px", right: "28px" }} className="hero-meta">
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            AAREN.© {new Date().getFullYear()}
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SELECTED WORK — Image Cards Grid
          (large/small alternating like Sturdy)
      ══════════════════════════════════════ */}
      <section style={{ borderTop: "1px solid #1a1a1a" }}>

        {/* Section label */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 28px", borderBottom: "1px solid #1a1a1a" }}>
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

        {/* ── Image card grid ── */}
        <div>
          {PROJECTS.map((project) => (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className="proj-card project-item"
              onMouseEnter={() => setHoveredSlug(project.slug)}
              onMouseLeave={() => setHoveredSlug(null)}
              style={{
                display: "grid",
                gridTemplateColumns: project.large ? "1fr" : "1fr 1fr",
                borderBottom: "1px solid #1a1a1a",
                textDecoration: "none",
              }}
            >
              {/* Image */}
              <div style={{ position: "relative", aspectRatio: project.large ? "21/9" : "4/3", overflow: "hidden", background: "#111" }}>
                <img
                  src={project.image}
                  alt={project.title}
                  className="project-img"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: hoveredSlug === project.slug ? "grayscale(0%)" : "grayscale(30%)",
                    transform: hoveredSlug === project.slug ? "scale(1.04)" : "scale(1)",
                    transition: "filter 0.6s ease, transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)",
                  }}
                />
              </div>

              {/* Text info */}
              <div
                style={{
                  padding: project.large ? "24px 28px" : "28px",
                  display: "flex",
                  flexDirection: project.large ? "row" : "column",
                  justifyContent: project.large ? "space-between" : "flex-end",
                  alignItems: project.large ? "flex-end" : "flex-start",
                  gap: "12px",
                  background: hoveredSlug === project.slug ? "#111" : "transparent",
                  transition: "background 0.2s",
                }}
              >
                <div>
                  <p style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "8px" }}>
                    {project.year} &nbsp;·&nbsp; {project.category}
                  </p>
                  <h3
                    style={{
                      fontSize: project.large ? "clamp(1.4rem, 2.5vw, 2.5rem)" : "1.15rem",
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.1,
                      color: "#ffffff",
                    }}
                  >
                    {project.client}
                  </h3>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginTop: "5px" }}>
                    {project.title}
                  </p>
                </div>
                <p
                  style={{
                    fontSize: "clamp(2.5rem, 5vw, 6rem)",
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                    color: "rgba(255,255,255,0.05)",
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  {project.code}
                  <br />
                  {project.num}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          CLIENT MARQUEE
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
