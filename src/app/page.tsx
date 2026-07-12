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
          SECTION 3: PROJECTS — light #eaeef4
          ══════════════════════════════════════ */}
      <section
        className="project-list"
        style={{ borderTop: "0.1rem solid var(--color-border)" }}
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

        {/* ── Project cards in exact Sturdy layout (2 -> 4 -> 2) ── */}
        <div className="project-list__grid" ref={projectsRef.ref}>
          {PROJECTS.map((project, idx) => (
            <ProjectCard
              key={project.slug}
              project={project}
              onHover={setHovered}
              visible={projectsRef.visible}
              delay={idx * 0.05}
            />
          ))}
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

function ProjectSlideshow() {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % OBEROI_SLIDES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      {OBEROI_SLIDES.map((slide, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={slide}
          src={slide}
          alt={`Oberoi Slide ${i + 1}`}
          className={`slideshow-img${currentIdx === i ? " active" : ""}`}
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
