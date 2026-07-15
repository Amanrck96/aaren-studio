"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
  },
  {
    client: "Taj Hotels",
    sub: "Spa & Wellness Sanctuary",
    year: "2025",
    code: "TJ",
    num: "02",
    slug: "taj-spa",
    img: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=900&q=80",
  },
  {
    client: "Ratan Group",
    sub: "Corporate Headquarters — Mumbai",
    year: "2025",
    code: "RG",
    num: "03",
    slug: "ratan-hq",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
  },
  {
    client: "Godrej Properties",
    sub: "Luxury Showflat — Worli",
    year: "2024",
    code: "GP",
    num: "04",
    slug: "godrej-worli",
    img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80",
  },
  {
    client: "Private Villa",
    sub: "Bespoke Residence — Alibaug",
    year: "2024",
    code: "PV",
    num: "05",
    slug: "alibaug-villa",
    img: "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=900&q=80",
  },
  {
    client: "Nykaa",
    sub: "Flagship Retail Experience",
    year: "2023",
    code: "NK",
    num: "06",
    slug: "nykaa-retail",
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80",
  },
  {
    client: "Lodha Group",
    sub: "Club Lounge & Amenity Deck",
    year: "2023",
    code: "LG",
    num: "07",
    slug: "lodha-club",
    img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
  },
  {
    client: "Birla Estates",
    sub: "Penthouse Interiors — Delhi",
    year: "2023",
    code: "BE",
    num: "08",
    slug: "birla-penthouse",
    img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",
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
  "Plywood",
  "Decorative surfaces",
  "Cladding & Declining",
  "Wooden flooring",
  "Screens",
  "Doors",
  "Windows",
  "Kitchen",
  "Wardrobe",
  "Hardware",
  "Partition",
  "Ffne",
  "Tiles",
  "Wellness",
];

/* ─── Logo letters for staggered reveal ─── */
const LOGO_LETTERS = ["A", "A", "R", "E", "N"];

const CATEGORIES = [
  { title: "Flooring Systems", img: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=800&q=80" },
  { title: "Architectural Surfaces", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" },
  { title: "Lighting Design", img: "https://images.unsplash.com/photo-1565538810844-1e119d81a207?auto=format&fit=crop&w=800&q=80" },
  { title: "Joinery & Millwork", img: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80" },
  { title: "Bathroom & Wellness", img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80" },
  { title: "Facade & Cladding", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80" },
];

/* ─── Hook: scroll-triggered class ─── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
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

  /* ── Client 3D scroll refs ── */
  const containerRef = useRef<HTMLDivElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const clientsContainerRef = useRef<HTMLUListElement>(null);
  const clientsRef = useRef<(HTMLLIElement | null)[]>([]);

  /* ── Scroll observer refs ── */
  const introRef = useInView(0.1);
  const projectsRef = useInView(0.05);
  const newsletterRef = useInView(0.2);

  /* ── Category Carousel State and Auto-loop ── */
  const [categoryIndex, setCategoryIndex] = useState(0);

  const scrollCategories = (direction: "left" | "right") => {
    if (direction === "left") {
      setCategoryIndex((prev) => (prev - 1 + CATEGORIES.length) % CATEGORIES.length);
    } else {
      setCategoryIndex((prev) => (prev + 1) % CATEGORIES.length);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCategoryIndex((prev) => (prev + 1) % CATEGORIES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

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

  /* ── Client 3D Cylinder Scroll Animation (Sturdy.co UX) ── */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      const clients = clientsRef.current.filter(Boolean) as HTMLLIElement[];

      if (clients.length === 0) return;

      // 1. Heading Scroll Reveal Entrance Animation
      const heading = containerRef.current?.querySelector(".t-tag");
      if (heading) {
        gsap.fromTo(heading,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              toggleActions: "play none none none"
            }
          }
        );
      }

      // If user prefers reduced motion, implement a simple fade trigger instead of 3D cylinder rotation
      if (prefersReducedMotion) {
        gsap.fromTo(clients,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.05,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 75%",
              toggleActions: "play none none none"
            }
          }
        );
        return;
      }

      // ── Responsive MatchMedia cylinder ──
      // Define ranges for Mobile (< 768px), Tablet (768px - 1239px), and Desktop (>= 1240px)
      const setups = [
        { query: "(max-width: 767px)", radius: 120 },
        { query: "(min-width: 768px) and (max-width: 1239px)", radius: 200 },
        { query: "(min-width: 1240px)", radius: 280 }
      ];

      setups.forEach(({ query, radius }) => {
        mm.add(query, () => {
          const origin = `50% 50% -${radius}px`;

          // Position each client item on the 3D cylinder
          clients.forEach((el, i) => {
            const rotationX = -18 * i;
            gsap.set(el, {
              z: radius,
              rotationX: rotationX,
              transformOrigin: origin,
              force3D: true,
              scale: 0.8,
              opacity: 0.3,
              color: "#c8cbd0"
            });
          });

          // Highlight the first client initially
          if (clients[0]) {
            gsap.set(clients[0], {
              scale: 1.15,
              opacity: 1,
              color: "#1e1e1e"
            });
          }

          const lastRotation = -18 * (clients.length - 1) - 90;

          // Toggle visibility of absolute container when section is active in viewport
          const sectionTrigger = ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top-=5%",
            toggleClass: "home-clients--visible",
          });

          // Map progress (0.135 to 0.79) to client index
          const mapper = gsap.utils.pipe(
            gsap.utils.mapRange(0.135, 0.79, 0, clients.length - 1),
            gsap.utils.snap(1)
          );

          // Timeline for rotating the cylinder container
          const tl = gsap.timeline({
            paused: true,
            scrollTrigger: {
              trigger: listContainerRef.current,
              start: "top top-=30%",
              end: "bottom bottom",
              scrub: true,
              onUpdate: (self) => {
                const progress = +self.progress.toFixed(3);
                const activeIdx = mapper(progress);

                // Smoothly update scales, opacities, and colors of active/inactive elements via GSAP
                clients.forEach((el, idx) => {
                  if (idx === activeIdx) {
                    gsap.to(el, {
                      color: "#1e1e1e",
                      opacity: 1,
                      scale: 1.15,
                      duration: 0.35,
                      ease: "power2.out",
                      overwrite: "auto"
                    });
                  } else {
                    gsap.to(el, {
                      color: "#c8cbd0",
                      opacity: 0.3,
                      scale: 0.8,
                      duration: 0.35,
                      ease: "power2.out",
                      overwrite: "auto"
                    });
                  }
                });
              },
            },
          });

          tl.fromTo(
            clientsContainerRef.current,
            { rotationX: -80 },
            {
              rotationX: -lastRotation,
              ease: "none",
              transformOrigin: "50% 50%",
              force3D: true,
            }
          );

          return () => {
            sectionTrigger.kill();
            tl.kill();
            gsap.set(clients, { clearProps: "all" });
            if (clientsContainerRef.current) {
              gsap.set(clientsContainerRef.current, { clearProps: "all" });
            }
          };
        });
      });
    });

    return () => ctx.revert();
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
            alignItems: "flex-start",
            paddingTop: "2rem",
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
          {/* Right-aligned large text block ── */}
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
          BROWSE BY CATEGORY SECTION WITH ARROWS (2 LOOPING IMAGES)
          ══════════════════════════════════════ */}
      <section
        className="theme-light"
        style={{
          paddingTop: "6rem",
          paddingBottom: "8rem",
          paddingLeft: "0.8rem",
          paddingRight: "0.8rem",
          borderBottom: "1px dashed rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ maxWidth: "140rem", margin: "0 auto", position: "relative" }}>
          {/* Centered Category Title */}
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <span className="t-tag" style={{ color: "rgba(0,0,0,0.6)", fontSize: "1.4rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Browse by Category
            </span>
          </div>

          {/* Left Arrow Button */}
          <button
            onClick={() => scrollCategories("left")}
            className="btn btn--primary btn--blur"
            style={{
              position: "absolute",
              left: "-1rem",
              top: "calc(50% + 2rem)",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: "4.5rem",
              height: "4.5rem",
              borderRadius: "50%",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.8rem",
              color: "#000",
              border: "0.1rem solid rgba(0,0,0,0.15)",
              backgroundColor: "rgba(255,255,255,0.85)",
              cursor: "pointer",
            }}
            aria-label="Scroll left"
          >
            ←
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={() => scrollCategories("right")}
            className="btn btn--primary btn--blur"
            style={{
              position: "absolute",
              right: "-1rem",
              top: "calc(50% + 2rem)",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: "4.5rem",
              height: "4.5rem",
              borderRadius: "50%",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.8rem",
              color: "#000",
              border: "0.1rem solid rgba(0,0,0,0.15)",
              backgroundColor: "rgba(255,255,255,0.85)",
              cursor: "pointer",
            }}
            aria-label="Scroll right"
          >
            →
          </button>

          {/* Grid showing exactly 2 items side-by-side */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2rem",
              padding: "0 1.2rem 1.6rem",
            }}
          >
            {[
              CATEGORIES[categoryIndex],
              CATEGORIES[(categoryIndex + 1) % CATEGORIES.length],
            ].map((cat) => (
              <div
                key={cat.title}
                style={{
                  position: "relative",
                  borderRadius: "1.2rem",
                  overflow: "hidden",
                  height: "38rem",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.img}
                  alt={cat.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                {/* Category Title Overlay */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    padding: "3rem 2rem",
                    background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                >
                  <span
                    style={{
                      fontSize: "2rem",
                      fontWeight: 600,
                      color: "#eaeef4",
                      textTransform: "uppercase",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {cat.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          SECTION 3: PROJECTS — light #eaeef4
          ══════════════════════════════════════ */}
      <section
        className="project-list"
        style={{
          paddingTop: "8rem",
          paddingBottom: "8rem",
          borderBottom: "1px dashed rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ maxWidth: "140rem", margin: "0 auto" }}>
          {/* Centered Selected Projects Heading */}
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <span className="t-tag" style={{ color: "rgba(0,0,0,0.6)", fontSize: "1.4rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Selected Projects
            </span>
          </div>

          {/* Grid showing exactly 4 cards side-by-side, matching Brands style */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "2rem",
              padding: "0 1.2rem",
            }}
            ref={projectsRef.ref}
          >
            {PROJECTS.slice(0, 4).map((project) => (
              <div
                key={project.slug}
                style={{
                  borderRadius: "1.2rem",
                  overflow: "hidden",
                  backgroundColor: "transparent",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div style={{ width: "100%", height: "26rem", borderRadius: "1.2rem", overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.img}
                    alt={project.client}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ margin: 0, fontSize: "1.4rem", fontWeight: 700, color: "#000", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {project.client}
                  </p>
                  <p style={{ margin: "0.2rem 0 0", fontSize: "1.2rem", color: "rgba(0,0,0,0.5)" }}>
                    {project.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Project Banners (2 Horizontal Banners, same style & size) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2rem",
              padding: "0 1.2rem",
              marginTop: "6rem",
            }}
          >
            <div style={{ height: "45rem", borderRadius: "1.2rem", overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
                alt="Project Banner 1"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={{ height: "45rem", borderRadius: "1.2rem", overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="Project Banner 2"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 4: CLIENTS — light #eaeef4 (like Sturdy)
          ══════════════════════════════════════ */}
      <section
        ref={containerRef}
        className="home-clients"
        style={{
          padding: "0",
        }}
      >
        {/* Title */}
        <div className="home-clients__title-wrapper">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "2rem 0.8rem",
            }}
          >
            <span className="t-tag" style={{ color: "rgba(0,0,0,0.45)" }}>
              Featured Clients
            </span>
          </div>
        </div>

        {/* Wrapper */}
        <div className="home-clients__wrapper">
          {/* Arrow overlay */}
          <div className="home-clients__arrow-wrapper">
            <div className="home-clients__arrow">
              <svg viewBox="0 0 16 13" xmlns="http://www.w3.org/2000/svg" role="presentation" className="home-clients__arrow-svg">
                <path d="M8.01 13 15.5 0H.5l7.51 13Z"></path>
              </svg>
              <svg viewBox="0 0 16 13" xmlns="http://www.w3.org/2000/svg" role="presentation" className="home-clients__arrow-svg">
                <path d="M8.01 13 15.5 0H.5l7.51 13Z"></path>
              </svg>
            </div>
          </div>

          {/* Hidden list to push wrapper height naturally (Sturdy layout trick) */}
          <div aria-hidden="true" className="home-clients__hidden-list">
            {CLIENTS.map((client) => (
              <div key={client} className="home-clients__label ttu">
                {client}
              </div>
            ))}
          </div>

          {/* 3D sliding list container */}
          <div className="home-clients__list-container" ref={listContainerRef}>
            <div className="home-clients__list-sticky">
              <ul ref={clientsContainerRef} className="home-clients__list">
                {CLIENTS.map((client, i) => (
                  <li
                    key={client}
                    ref={(el) => { clientsRef.current[i] = el; }}
                    className="home-clients__item home-clients__label ttu"
                  >
                    {client}
                  </li>
                ))}
              </ul>
            </div>
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
const OBEROI_SLIDES = [
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80"
];

const COLLAGE_LAYOUTS = [
  // Layout 0: 2x2 Grid (4 items)
  [
    { top: "0%", left: "0%", width: "50%", height: "50%", opacity: 1 },
    { top: "0%", left: "50%", width: "50%", height: "50%", opacity: 1 },
    { top: "50%", left: "0%", width: "50%", height: "50%", opacity: 1 },
    { top: "50%", left: "50%", width: "50%", height: "50%", opacity: 1 },
  ],
  // Layout 1: Large Left, 2 Small Right (3 items)
  [
    { top: "0%", left: "0%", width: "60%", height: "100%", opacity: 1 },
    { top: "0%", left: "60%", width: "40%", height: "50%", opacity: 1 },
    { top: "50%", left: "60%", width: "40%", height: "50%", opacity: 1 },
    { top: "0%", left: "100%", width: "0%", height: "0%", opacity: 0 },
  ],
  // Layout 2: 2 Small Left, Large Right (3 items)
  [
    { top: "0%", left: "0%", width: "40%", height: "50%", opacity: 1 },
    { top: "50%", left: "0%", width: "40%", height: "50%", opacity: 1 },
    { top: "0%", left: "40%", width: "60%", height: "100%", opacity: 1 },
    { top: "0%", left: "100%", width: "0%", height: "0%", opacity: 0 },
  ],
  // Layout 3: 2 Vertical Columns (2 items)
  [
    { top: "0%", left: "0%", width: "50%", height: "100%", opacity: 1 },
    { top: "0%", left: "50%", width: "50%", height: "100%", opacity: 1 },
    { top: "0%", left: "100%", width: "0%", height: "0%", opacity: 0 },
    { top: "0%", left: "100%", width: "0%", height: "0%", opacity: 0 },
  ],
  // Layout 4: 3 Vertical Columns (3 items)
  [
    { top: "0%", left: "0%", width: "33.33%", height: "100%", opacity: 1 },
    { top: "0%", left: "33.33%", width: "33.34%", height: "100%", opacity: 1 },
    { top: "0%", left: "66.67%", width: "33.33%", height: "100%", opacity: 1 },
    { top: "0%", left: "100%", width: "0%", height: "0%", opacity: 0 },
  ],
  // Layout 5: Large Top, 2 Small Bottom (3 items)
  [
    { top: "0%", left: "0%", width: "100%", height: "60%", opacity: 1 },
    { top: "60%", left: "0%", width: "50%", height: "40%", opacity: 1 },
    { top: "60%", left: "50%", width: "50%", height: "40%", opacity: 1 },
    { top: "0%", left: "100%", width: "0%", height: "0%", opacity: 0 },
  ]
];

function CollageSlot({ src, style }: { src: string; style: React.CSSProperties }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (src !== imgSrc) {
      setFade(false);
      const t = setTimeout(() => {
        setImgSrc(src);
        setFade(true);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [src, imgSrc]);

  return (
    <div
      style={{
        position: "absolute",
        overflow: "hidden",
        border: "0.1rem solid var(--color-bg)",
        transition: "top 1.2s cubic-bezier(0.25, 1, 0.5, 1), left 1.2s cubic-bezier(0.25, 1, 0.5, 1), width 1.2s cubic-bezier(0.25, 1, 0.5, 1), height 1.2s cubic-bezier(0.25, 1, 0.5, 1), opacity 1.2s ease",
        ...style,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt="Collage segment"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: fade ? 1 : 0,
          transform: fade ? "scale(1)" : "scale(1.05)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      />
    </div>
  );
}

function ProjectSlideshow() {
  const [layoutIdx, setLayoutIdx] = useState(0);
  const [activeImages, setActiveImages] = useState<string[]>([
    OBEROI_SLIDES[0],
    OBEROI_SLIDES[1],
    OBEROI_SLIDES[2],
    OBEROI_SLIDES[3]
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      // 1. Choose new layout
      setLayoutIdx((prev) => {
        let next = Math.floor(Math.random() * COLLAGE_LAYOUTS.length);
        while (next === prev) {
          next = Math.floor(Math.random() * COLLAGE_LAYOUTS.length);
        }
        return next;
      });

      // 2. Select 4 random unique images
      setActiveImages(() => {
        const shuffled = [...OBEROI_SLIDES].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 4);
      });
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: "#eaeef4" }}>
      {COLLAGE_LAYOUTS[layoutIdx].map((slotStyle, i) => (
        <CollageSlot
          key={i}
          src={activeImages[i] || OBEROI_SLIDES[i]}
          style={{
            top: slotStyle.top,
            left: slotStyle.left,
            width: slotStyle.width,
            height: slotStyle.height,
            opacity: slotStyle.opacity,
          }}
        />
      ))}
    </div>
  );
}

interface ProjectCardProps {
  project: typeof PROJECTS[0];
  onHover: (slug: string | null) => void;
  visible: boolean;
  delay: number;
}

function ProjectCard({
  project,
  onHover,
  visible,
  delay,
}: ProjectCardProps) {
  const isSlideshow = project.slug === "oberoi-lobby";

  return (
    <div className="cursor-trigger project-item project-item--project">
      <Link
        href={`/work/${project.slug}`}
        className="project-item__link"
        onMouseEnter={() => onHover(project.slug)}
        onMouseLeave={() => onHover(null)}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(3rem)",
          transition: `opacity 0.8s ease ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        }}
      >
        {/* Image / Slideshow */}
        <div className="project-item__fig-wrapper">
          <figure className="project-item__fig">
            {isSlideshow ? (
              <ProjectSlideshow />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.img}
                alt={`${project.client} — ${project.sub}`}
              />
            )}
          </figure>
        </div>

        {/* Content */}
        <div className="project-item__content">
          <div className="project-item__inner">
            <h3 className="projec-item__title">
              {project.client}
            </h3>
            <p className="project-item__info">{project.sub}</p>
            <p className="project-item__info">{project.year}</p>
          </div>
          <div className="project-item__inner unicode">
            <p>{project.code}</p>
            <p>{project.num}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
