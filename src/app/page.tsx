"use client";

import { useEffect, useRef } from "react";
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
    id: "AC 01",
    client: "The Oberoi",
    code: "OB",
    num: "01",
    title: "Presidential Suite — Lobby Renovation",
    year: "2025",
    category: "Hospitality",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    slug: "oberoi-lobby",
    large: true,
  },
  {
    id: "AC 02",
    client: "Ratan Group",
    code: "RG",
    num: "02",
    title: "Corporate Headquarters — Mumbai",
    year: "2025",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    slug: "ratan-hq",
    large: false,
  },
  {
    id: "AC 03",
    client: "Private Villa",
    code: "PV",
    num: "03",
    title: "Bespoke Residence — Alibaug",
    year: "2024",
    category: "Residential",
    image: "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=800&q=80",
    slug: "alibaug-villa",
    large: false,
  },
  {
    id: "AC 04",
    client: "Taj Hotels",
    code: "TJ",
    num: "04",
    title: "Spa & Wellness Sanctuary",
    year: "2024",
    category: "Hospitality",
    image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80",
    slug: "taj-spa",
    large: true,
  },
  {
    id: "AC 05",
    client: "Godrej Properties",
    code: "GP",
    num: "05",
    title: "Luxury Showflat — Worli",
    year: "2024",
    category: "Residential",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80",
    slug: "godrej-worli",
    large: false,
  },
  {
    id: "AC 06",
    client: "Nykaa",
    code: "NK",
    num: "06",
    title: "Flagship Retail Experience",
    year: "2023",
    category: "Retail",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    slug: "nykaa-retail",
    large: false,
  },
];

const CLIENTS = [
  "The Oberoi",
  "Taj Hotels",
  "Godrej Properties",
  "Nykaa",
  "Ratan Group",
  "Hiranandani",
  "Lodha Group",
  "Piramal Realty",
  "Birla Estates",
  "Mahindra",
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero text reveal
      gsap.from(".hero-line", {
        y: "105%",
        opacity: 0,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.12,
      });

      gsap.from(".hero-meta", {
        opacity: 0,
        y: 20,
        duration: 0.9,
        delay: 0.8,
        ease: "power3.out",
        stagger: 0.1,
      });

      // Project cards reveal on scroll
      gsap.utils.toArray<HTMLElement>(".proj-card").forEach((card) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
        });
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} style={{ background: "#0a0a0a", color: "#f0f0f0", minHeight: "100vh" }}>

      {/* ═══════════════════════════════════════
          HERO — exact Sturdy.co style
          Full viewport, left-aligned giant paragraph
      ═══════════════════════════════════════ */}
      <section
        style={{
          minHeight: "100vh",
          padding: "0 28px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          paddingBottom: "80px",
        }}
      >
        <div style={{ maxWidth: "1200px" }}>
          {/* Giant description text — Sturdy style */}
          <div style={{ overflow: "hidden", marginBottom: "6px" }}>
            <p
              className="hero-line"
              style={{
                fontSize: "clamp(2.2rem, 5.5vw, 5.8rem)",
                fontWeight: 700,
                lineHeight: 1.0,
                letterSpacing: "-0.03em",
                color: "#ffffff",
              }}
            >
              A creative studio and material house
            </p>
          </div>
          <div style={{ overflow: "hidden", marginBottom: "6px" }}>
            <p
              className="hero-line"
              style={{
                fontSize: "clamp(2.2rem, 5.5vw, 5.8rem)",
                fontWeight: 700,
                lineHeight: 1.0,
                letterSpacing: "-0.03em",
                color: "#ffffff",
              }}
            >
              dedicated to designing and producing
            </p>
          </div>
          <div style={{ overflow: "hidden", marginBottom: "6px" }}>
            <p
              className="hero-line"
              style={{
                fontSize: "clamp(2.2rem, 5.5vw, 5.8rem)",
                fontWeight: 700,
                lineHeight: 1.0,
                letterSpacing: "-0.03em",
                color: "rgba(255,255,255,0.35)",
              }}
            >
              immersive spatial experiences — meant
            </p>
          </div>
          <div style={{ overflow: "hidden" }}>
            <p
              className="hero-line"
              style={{
                fontSize: "clamp(2.2rem, 5.5vw, 5.8rem)",
                fontWeight: 700,
                lineHeight: 1.0,
                letterSpacing: "-0.03em",
                color: "rgba(255,255,255,0.35)",
              }}
            >
              to evoke feeling.
            </p>
          </div>

          {/* Services list — below hero text, Sturdy style */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px 24px",
              marginTop: "48px",
              borderTop: "1px solid #1a1a1a",
              paddingTop: "28px",
            }}
          >
            {SERVICES.map((s, i) => (
              <span
                key={i}
                className="hero-meta"
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.02em",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom-right: year + studio mark */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            right: "28px",
            textAlign: "right",
          }}
          className="hero-meta"
        >
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            AAREN.© {new Date().getFullYear()}
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SELECTED WORK — exact Sturdy.co grid
      ═══════════════════════════════════════ */}
      <section style={{ borderTop: "1px solid #1a1a1a", padding: "0 28px" }}>

        {/* Section header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "28px 0",
            borderBottom: "1px solid #1a1a1a",
          }}
        >
          <p style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
            Selected Work
          </p>
          <Link
            href="/work"
            className="link-underline"
            style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
          >
            All Projects [{PROJECTS.length}]
          </Link>
        </div>

        {/* Project list — Sturdy.co layout */}
        <div>
          {PROJECTS.map((project) => (
            <Link
              key={project.id}
              href={`/work/${project.slug}`}
              className="proj-card project-item"
              style={{
                display: "grid",
                gridTemplateColumns: project.large ? "1fr" : "1fr 1fr",
                borderBottom: "1px solid #1a1a1a",
                textDecoration: "none",
              }}
            >
              {/* Image */}
              <div
                style={{
                  position: "relative",
                  aspectRatio: project.large ? "16/7" : "4/3",
                  overflow: "hidden",
                  background: "#111",
                }}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="project-img"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>

              {/* Text info */}
              <div
                style={{
                  padding: project.large ? "28px 0" : "28px 28px",
                  display: "flex",
                  flexDirection: project.large ? "row" : "column",
                  justifyContent: project.large ? "space-between" : "flex-end",
                  alignItems: project.large ? "flex-end" : "flex-start",
                  gap: "12px",
                }}
              >
                <div>
                  <p style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "8px" }}>
                    {project.year} &nbsp;·&nbsp; {project.category}
                  </p>
                  <h3
                    style={{
                      fontSize: project.large ? "clamp(1.5rem, 3vw, 3rem)" : "1.2rem",
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.1,
                      color: "#ffffff",
                    }}
                  >
                    {project.client}
                  </h3>
                  <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", marginTop: "6px" }}>
                    {project.title}
                  </p>
                </div>
                <p
                  style={{
                    fontSize: "clamp(2rem, 5vw, 5rem)",
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                    color: "rgba(255,255,255,0.07)",
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

      {/* ═══════════════════════════════════════
          CLIENT MARQUEE — Sturdy.co infinite scroll
      ═══════════════════════════════════════ */}
      <section
        style={{
          borderTop: "1px solid #1a1a1a",
          padding: "24px 0",
          overflow: "hidden",
        }}
      >
        <div className="marquee-wrap">
          <div className="marquee-track" style={{ gap: "0" }}>
            {[...CLIENTS, ...CLIENTS].map((client, i) => (
              <span
                key={i}
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "0 32px",
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
