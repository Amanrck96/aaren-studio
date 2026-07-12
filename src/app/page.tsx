"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

/* ─── Projects ─── */
const PROJECTS = [
  {
    client: "The Oberoi",
    sub: "Presidential Suite — Lobby Renovation",
    year: "2025",
    code: "OB",
    num: "01",
    slug: "oberoi-lobby",
    img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80",
    wide: true,
  },
  {
    client: "Taj Hotels",
    sub: "Spa & Wellness Sanctuary",
    year: "2025",
    code: "TJ",
    num: "02",
    slug: "taj-spa",
    img: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=900&q=80",
    wide: false,
  },
  {
    client: "Ratan Group",
    sub: "Corporate Headquarters — Mumbai",
    year: "2025",
    code: "RG",
    num: "03",
    slug: "ratan-hq",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
    wide: false,
  },
  {
    client: "Godrej Properties",
    sub: "Luxury Showflat — Worli",
    year: "2024",
    code: "GP",
    num: "04",
    slug: "godrej-worli",
    img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80",
    wide: true,
  },
  {
    client: "Private Villa",
    sub: "Bespoke Residence — Alibaug",
    year: "2024",
    code: "PV",
    num: "05",
    slug: "alibaug-villa",
    img: "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=900&q=80",
    wide: false,
  },
  {
    client: "Nykaa",
    sub: "Flagship Retail Experience",
    year: "2023",
    code: "NK",
    num: "06",
    slug: "nykaa-retail",
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80",
    wide: false,
  },
  {
    client: "Lodha Group",
    sub: "Club Lounge & Amenity Deck",
    year: "2023",
    code: "LG",
    num: "07",
    slug: "lodha-club",
    img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
    wide: false,
  },
  {
    client: "Birla Estates",
    sub: "Penthouse Interiors — Delhi",
    year: "2023",
    code: "BE",
    num: "08",
    slug: "birla-penthouse",
    img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",
    wide: false,
  },
];

/* ─── Clients ─── */
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
  "ITC Hotels",
  "Leela Group",
  "DLF",
  "Prestige Group",
];

/* ─── Services ─── */
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
];

/* ─── Logo letters for staggered reveal ─── */
const LOGO_LETTERS = ["A", "A", "R", "E", "N"];

/* ─── Hook: scroll-triggered class ─── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

export default function Home() {
  /* ── Logo reveal state ── */
  const [lettersRevealed, setLettersRevealed] = useState<boolean[]>(
    LOGO_LETTERS.map(() => false)
  );

  /* ── Hover image state ── */
  const [hovered, setHovered] = useState<string | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [flip, setFlip] = useState(false);

  /* ── Email state ── */
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  /* ── Client 3D scroll ── */
  const clientSectionRef = useRef<HTMLDivElement>(null);
  const clientTrackRef = useRef<HTMLDivElement>(null);

  /* ── Scroll observer refs ── */
  const introRef = useInView(0.1);
  const projectsRef = useInView(0.05);
  const newsletterRef = useInView(0.2);

  /* ── Logo reveal on mount ── */
  useEffect(() => {
    LOGO_LETTERS.forEach((_, i) => {
      setTimeout(() => {
        setLettersRevealed((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 200 + i * 120);
    });
  }, []);

  /* ── Mouse tracking ── */
  const onMouseMove = useCallback((e: MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
    setFlip(e.clientX > window.innerWidth / 2);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [onMouseMove]);

  /* ── 3D client scroll effect ── */
  useEffect(() => {
    const section = clientSectionRef.current;
    const track = clientTrackRef.current;
    if (!section || !track) return;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, 1 - rect.bottom / (window.innerHeight + rect.height)));
      const rotateX = -8 + progress * 16;
      const translateZ = -20 + progress * 20;
      track.style.transform = `rotateX(${rotateX}deg) translateZ(${translateZ}rem)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hovProject = PROJECTS.find((p) => p.slug === hovered);

  return (
    <>
      {/* ══════════════════════════════════════
          FLOATING PROJECT HOVER IMAGE
          ══════════════════════════════════════ */}
      <div
        className={`project-hover-img${hovered ? " is-active" : ""}`}
        style={{
          left: flip ? "auto" : pos.x + 30,
          right: flip ? `calc(100vw - ${pos.x}px + 30px)` : "auto",
          top: pos.y - 150,
        }}
        aria-hidden="true"
      >
        {hovProject && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={hovProject.img} alt="" />
        )}
      </div>

      {/* ══════════════════════════════════════
          SECTION 1: HERO — dark #1e1e1e
          ══════════════════════════════════════ */}
      <section
        className="theme-dark"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "0 0.8rem",
          paddingTop: "12rem",
          paddingBottom: "4rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ── Large AAREN wordmark — letter-by-letter reveal ── */}
        <div
          aria-label="AAREN"
          style={{
            overflow: "hidden",
            lineHeight: 0.85,
            flex: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: "clamp(15rem, 25vw, 35rem)",
              fontWeight: 700,
              letterSpacing: "-0.05em",
              textTransform: "uppercase",
              color: "#eaeef4",
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              overflow: "hidden",
            }}
          >
            {LOGO_LETTERS.map((letter, i) => (
              <span
                key={i}
                className={`logo-letter${lettersRevealed[i] ? " is-revealed" : ""}`}
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                {letter}
              </span>
            ))}
          </div>
        </div>

        {/* ── Bottom: tagline + service tags ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2.4rem",
            paddingTop: "4rem",
            borderTop: "0.1rem solid rgba(255,255,255,0.1)",
          }}
        >
          {/* Tagline */}
          <p
            className="text-splitter"
            style={{
              fontSize: "clamp(1.6rem, 2.2vw, 2.4rem)",
              letterSpacing: "-0.03em",
              lineHeight: 0.9,
              color: "#eaeef4",
              textTransform: "uppercase",
              maxWidth: "60rem",
              opacity: lettersRevealed[4] ? 1 : 0,
              transform: lettersRevealed[4] ? "translateY(0)" : "translateY(2rem)",
              transition: "opacity 0.7s ease 0.7s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.7s",
            }}
          >
            Visual innovation and spatial experiences
            <br />for world class clients and brands.
          </p>

          {/* Service pill tags */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.6rem",
              opacity: lettersRevealed[4] ? 1 : 0,
              transition: "opacity 0.6s ease 1s",
            }}
          >
            {SERVICES.map((svc, i) => (
              <span
                key={i}
                className="btn btn--secondary"
                style={{
                  fontSize: "1.1rem",
                  padding: "0.6rem 1.2rem",
                }}
              >
                {svc}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 2: INTRO — light #eaeef4
          ══════════════════════════════════════ */}
      <section
        className="theme-light"
        style={{
          paddingTop: "10rem",
          paddingBottom: "15rem",
          padding: "10rem 0.8rem 15rem",
        }}
      >
        <div ref={introRef.ref}>
          {/* Right-aligned large text block — grid col 13/span 12 equivalent */}
          <div
            style={{
              marginLeft: "auto",
              maxWidth: "80rem",
            }}
          >
            <p
              className={`text-splitter${introRef.visible ? " is-visible" : ""}`}
              style={{
                fontSize: "clamp(2.4rem, 4.6vw, 4.6rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.0,
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#000",
                transitionDelay: "0s",
              }}
            >
              A creative studio and material house dedicated to designing and producing
              immersive spatial experiences — meant to evoke feeling. Our work spans
              disciplines, unified by the singular drive of crafting unforgettable
              environments.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 3: PROJECTS — light #eaeef4
          ══════════════════════════════════════ */}
      <section
        className="theme-light"
        style={{ borderTop: "0.1rem solid var(--color-border)", paddingBottom: "10rem" }}
      >
        {/* Section label row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "2rem 0.8rem",
            borderBottom: "0.1rem solid var(--color-border)",
            marginBottom: "0",
          }}
        >
          <span className="t-tag" style={{ color: "rgba(0,0,0,0.45)" }}>
            Selected Projects
          </span>
          <Link
            href="/work"
            className="btn btn--transparent"
            style={{ fontSize: "1.1rem" }}
          >
            View All
          </Link>
        </div>

        {/* ── Project cards in flex layout ── */}
        <div ref={projectsRef.ref}>
          {/* Row 1: full-width card */}
          <ProjectCard
            project={PROJECTS[0]}
            onHover={setHovered}
            visible={projectsRef.visible}
            delay={0}
            fullWidth
          />

          {/* Row 2: two half-width */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "0.1rem solid var(--color-border)" }}>
            <ProjectCard project={PROJECTS[1]} onHover={setHovered} visible={projectsRef.visible} delay={0.05} noBorder />
            <ProjectCard project={PROJECTS[2]} onHover={setHovered} visible={projectsRef.visible} delay={0.1} noBorder borderLeft />
          </div>

          {/* Row 3: full-width */}
          <ProjectCard project={PROJECTS[3]} onHover={setHovered} visible={projectsRef.visible} delay={0.05} fullWidth />

          {/* Row 4: three equal */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: "0.1rem solid var(--color-border)" }}>
            <ProjectCard project={PROJECTS[4]} onHover={setHovered} visible={projectsRef.visible} delay={0.0} noBorder />
            <ProjectCard project={PROJECTS[5]} onHover={setHovered} visible={projectsRef.visible} delay={0.05} noBorder borderLeft />
            <ProjectCard project={PROJECTS[6]} onHover={setHovered} visible={projectsRef.visible} delay={0.1} noBorder borderLeft />
          </div>

          {/* Row 5: full-width */}
          <ProjectCard project={PROJECTS[7]} onHover={setHovered} visible={projectsRef.visible} delay={0.05} fullWidth />
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 4: CLIENTS — dark #1e1e1e
          ══════════════════════════════════════ */}
      <section
        ref={clientSectionRef}
        className="theme-dark"
        style={{
          padding: "10rem 0.8rem",
          overflow: "hidden",
        }}
      >
        {/* Label */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "6rem",
            paddingBottom: "2rem",
            borderBottom: "0.1rem solid rgba(255,255,255,0.1)",
          }}
        >
          <span className="t-tag" style={{ color: "rgba(234,238,244,0.4)" }}>
            Clients
          </span>
        </div>

        {/* 3D perspective client list */}
        <div
          className="client-3d-wrap"
          style={{ perspective: "80rem" }}
        >
          <div
            ref={clientTrackRef}
            className="client-3d-track"
            style={{ transformStyle: "preserve-3d", transition: "transform 0.1s ease-out" }}
          >
            {CLIENTS.map((client, i) => (
              <div
                key={client}
                className="t-client-label"
                style={{
                  color: "#c8cbd0",
                  paddingTop: "1.2rem",
                  paddingBottom: "1.2rem",
                  borderBottom: "0.1rem solid rgba(255,255,255,0.07)",
                  display: "flex",
                  justifyContent: i % 2 === 0 ? "flex-start" : "flex-end",
                  transition: "color 0.2s ease",
                  opacity: 1,
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#eaeef4"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#c8cbd0"; }}
              >
                {client}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 5: NEWSLETTER — light #eaeef4
          ══════════════════════════════════════ */}
      <section
        className="theme-light"
        style={{
          paddingTop: "19.6rem",
          paddingBottom: "19.6rem",
          padding: "19.6rem 0.8rem",
          borderTop: "0.1rem solid var(--color-border)",
        }}
      >
        <div
          ref={newsletterRef.ref}
          style={{ marginLeft: "auto", maxWidth: "72rem" }}
        >
          <p
            className={`text-splitter${newsletterRef.visible ? " is-visible" : ""}`}
            style={{
              fontSize: "clamp(2.4rem, 3.8vw, 4.6rem)",
              letterSpacing: "-0.03em",
              fontWeight: 700,
              textTransform: "uppercase",
              lineHeight: 1.0,
              color: "#000",
              marginBottom: "6rem",
            }}
          >
            Keep up with the latest, for all things AAREN.
            Drop your email below, and let&apos;s stay connected.
          </p>

          {/* Email form with blinking cursor */}
          {sent ? (
            <p
              style={{
                fontSize: "1.4rem",
                color: "rgba(0,0,0,0.5)",
                letterSpacing: "-0.01em",
              }}
            >
              Thank you — we&apos;ll be in touch.
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setSent(true);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0",
                borderBottom: "0.1rem solid rgba(0,0,0,0.2)",
                paddingBottom: "1.2rem",
                maxWidth: "60rem",
              }}
            >
              {/* Blinking cursor before input */}
              <span className="cursor-blink" aria-hidden="true" />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: "1.4rem",
                  letterSpacing: "-0.01em",
                  color: "#000",
                  fontFamily: "var(--font-geist-mono), monospace",
                }}
              />
              <button
                type="submit"
                className="btn btn--transparent"
                style={{ flexShrink: 0, fontSize: "1.1rem" }}
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

/* ─────────────────────────────────────────────────
   PROJECT CARD COMPONENT
   ───────────────────────────────────────────────── */
interface ProjectCardProps {
  project: typeof PROJECTS[0];
  onHover: (slug: string | null) => void;
  visible: boolean;
  delay: number;
  fullWidth?: boolean;
  noBorder?: boolean;
  borderLeft?: boolean;
}

function ProjectCard({
  project,
  onHover,
  visible,
  delay,
  fullWidth,
  noBorder,
  borderLeft,
}: ProjectCardProps) {
  const [isHov, setIsHov] = useState(false);

  return (
    <Link
      href={`/work/${project.slug}`}
      onMouseEnter={() => { setIsHov(true); onHover(project.slug); }}
      onMouseLeave={() => { setIsHov(false); onHover(null); }}
      style={{
        display: "block",
        borderBottom: noBorder ? "none" : "0.1rem solid var(--color-border)",
        borderLeft: borderLeft ? "0.1rem solid var(--color-border)" : "none",
        textDecoration: "none",
        background: isHov ? "rgba(0,0,0,0.02)" : "transparent",
        transition: "background 0.2s ease",
      }}
    >
      {/* Image */}
      <div
        className="img-zoom"
        style={{
          aspectRatio: fullWidth ? "21/9" : "4/3",
          overflow: "hidden",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(3rem)",
          transition: `opacity 0.8s ease ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.img}
          alt={`${project.client} — ${project.sub}`}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Meta */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          padding: "1.6rem 0.8rem",
          gap: "1.6rem",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.0,
              color: "#000",
              textTransform: "uppercase",
              marginBottom: "0.4rem",
            }}
          >
            {project.client}
          </p>
          <p style={{ fontSize: "1.2rem", color: "rgba(0,0,0,0.4)", letterSpacing: "-0.01em" }}>
            {project.sub}
          </p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <p style={{ fontSize: "1.1rem", color: "rgba(0,0,0,0.3)", letterSpacing: "0.03em", marginBottom: "0.2rem" }}>
            {project.year}
          </p>
          <p style={{ fontSize: "1.2rem", fontWeight: 600, color: "rgba(0,0,0,0.2)", letterSpacing: "-0.01em" }}>
            {project.code}&nbsp;{project.num}
          </p>
        </div>
      </div>
    </Link>
  );
}
