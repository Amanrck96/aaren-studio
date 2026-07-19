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

const HOME_CATEGORIES = [
  { id: "plywood", code: "PW", num: "01", name: "Plywood", sub: "Structural Panels", img: "/categories/cat_1.png" },
  { id: "laminate", code: "LM", num: "02", name: "Laminate", sub: "Decorative Surfaces", img: "/categories/cat_2.png" },
  { id: "facade", code: "FC", num: "03", name: "Facade", sub: "Cladding & Decking", img: "/categories/cat_3.png" },
  { id: "wooden-flooring", code: "WF", num: "04", name: "Wooden Flooring", sub: "Engineered & Solid", img: "/categories/cat_4.png" },
  { id: "screens", code: "SS", num: "05", name: "Screens", sub: "Zipline Systems", img: "/categories/cat_5.png" },
  { id: "door-system", code: "DS", num: "06", name: "Door System", sub: "Aluminum & Slashform", img: "/categories/cat_6.png" },
  { id: "doors", code: "WD", num: "07", name: "Doors", sub: "Wood & Laminate", img: "/categories/cat_7.png" },
  { id: "windows", code: "WW", num: "08", name: "Windows", sub: "Timber & Aluminum", img: "/categories/cat_8.png" },
  { id: "kitchen", code: "KK", num: "09", name: "Kitchen", sub: "Slashform K+W", img: "/categories/cat_9.png" },
  { id: "wardrobe", code: "WW", num: "10", name: "Wardrobe", sub: "Freedom & Slashform", img: "/categories/cat_10.png" },
  { id: "furniture", code: "FF", num: "11", name: "Furniture", sub: "Millwork & Bespoke", img: "/categories/cat_11.png" },
  { id: "tiles", code: "TL", num: "12", name: "Tiles", sub: "Floors, Walls & Facades", img: "/categories/cat_12.png" },
  { id: "bathroom-fittings", code: "BF", num: "13", name: "Bathroom Fittings", sub: "Fima · Falper · Mildue", img: "/categories/cat_13.png" },
  { id: "sanitary-ware", code: "SW", num: "14", name: "Sanitary Ware", sub: "IWW · Flaminia", img: "/categories/cat_14.png" },
  { id: "mirrors", code: "MR", num: "15", name: "Mirrors", sub: "Mira · Waltz", img: "/categories/cat_15.png" },
];

const HOME_BRANDS = [
  { id: "slashform", code: "SF", num: "01", name: "Slashform", sub: "Doors · Windows · Kitchens", img: "/brands/brand_1_1.png" },
  { id: "waltz", code: "WB", num: "02", name: "Waltz by JB Glass", sub: "Mirrors · Glass Systems", img: "/brands/brand_2_1.png" },
  { id: "newtech", code: "NW", num: "03", name: "Newtech Wood", sub: "WPC · Facade", img: "/brands/brand_3_1.png" },
  { id: "formica", code: "FC", num: "04", name: "Formica", sub: "Laminates · Surfaces", img: "/brands/brand_4_1.png" },
  { id: "loco", code: "LC", num: "05", name: "Loco", sub: "Furniture · Millwork", img: "/brands/brand_5_1.png" },
  { id: "falper", code: "FP", num: "06", name: "Falper", sub: "Bathroom Fittings", img: "/brands/brand_6_1.png" },
  { id: "fima", code: "FM", num: "07", name: "Fima Carlo Frattini", sub: "Tapware · Showers", img: "/brands/brand_7_1.png" },
  { id: "inkiostro", code: "IB", num: "08", name: "Inkiostro Bianco", sub: "Wallcoverings · Decor", img: "/brands/brand_8_1.png" },
  { id: "mafi", code: "MF", num: "09", name: "Mafi", sub: "Engineered Wood Floors", img: "/brands/brand_9_1.png" },
  { id: "mirage", code: "MG", num: "10", name: "Mirage", sub: "Porcelain Tiles", img: "/brands/brand_10_1.png" },
];

/* ── Top brand carousel images (fast slideshow for first 2 brands) ── */
const BRAND_CAROUSEL_IMGS = [
  [
    "/brands/brand_1_1.png",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=900&q=80",
  ],
  [
    "/brands/brand_2_1.png",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
  ],
];

const INTRO_SENTENCES = [
  "One Stop Destination for World<br />Class Interior Solutions",
  "Window to the world of interior products",
  "Incredible products of world renowned brands",
  "Carefully curated products focused on unique experience",
  "The experience you've only dreamt about",
  "To see the unseen"
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

  /* ── Category full-width carousel state ── */
  const [catIdx, setCatIdx] = useState(0);
  const catTotal = HOME_CATEGORIES.length;
  useEffect(() => {
    const t = setInterval(() => setCatIdx((p) => (p + 1) % catTotal), 2800);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Brand carousel slide state ── */
  const [brandSlides, setBrandSlides] = useState([0, 0]);

  useEffect(() => {
    const t = setInterval(() => {
      setBrandSlides((prev) => [
        (prev[0] + 1) % BRAND_CAROUSEL_IMGS[0].length,
        (prev[1] + 1) % BRAND_CAROUSEL_IMGS[1].length,
      ]);
    }, 900);
    return () => clearInterval(t);
  }, []);

  /* ── Client 3D scroll refs ── */
  const containerRef = useRef<HTMLDivElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const clientsContainerRef = useRef<HTMLUListElement>(null);
  const clientsRef = useRef<(HTMLLIElement | null)[]>([]);

  /* ── Intro scroll-driven text refs ── */
  const introSectionRef = useRef<HTMLDivElement>(null);
  const introTextContainerRef = useRef<HTMLDivElement>(null);
  const introLinesRef = useRef<(HTMLParagraphElement | null)[]>([]);


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

      // 0. Intro Section Scroll-driven 3D Drum Text Animation
      const introLines = introLinesRef.current.filter(Boolean) as HTMLParagraphElement[];
      if (introLines.length > 0 && introSectionRef.current && introTextContainerRef.current) {
        if (prefersReducedMotion) {
          gsap.set(introLines, {
            opacity: 1,
            scale: 1,
            z: 0,
            rotationX: 0,
            color: "#eaeef4"
          });
        } else {
          // Define radius matching the viewport
          const introSetups = [
            { query: "(max-width: 767px)", radius: 140 },
            { query: "(min-width: 768px) and (max-width: 1239px)", radius: 240 },
            { query: "(min-width: 1240px)", radius: 360 }
          ];

          introSetups.forEach(({ query, radius }) => {
            mm.add(query, () => {
              const origin = `50% 50% -${radius}px`;
              const angleStep = 55; // spacing in degrees for each segment

              // Position each sentence on the 3D drum cylinder
              introLines.forEach((el, i) => {
                const rotationX = -angleStep * i;
                gsap.set(el, {
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  xPercent: -50,
                  yPercent: -50,
                  z: radius,
                  rotationX: rotationX,
                  transformOrigin: origin,
                  force3D: true,
                  scale: 0.8,
                  opacity: 0.15,
                  color: "rgba(234, 238, 244, 0.4)",
                  width: "100%",
                  textAlign: "center"
                });
              });

              // Initial state for the first item
              if (introLines[0]) {
                gsap.set(introLines[0], {
                  scale: 1.15,
                  opacity: 1,
                  color: "#eaeef4"
                });
              }

              const lastRotation = -angleStep * (introLines.length - 1);

              const introMapper = gsap.utils.pipe(
                gsap.utils.mapRange(0, 1, 0, introLines.length - 1),
                gsap.utils.snap(1)
              );

              // Timeline for rotating the cylinder container
              const tl = gsap.timeline({
                scrollTrigger: {
                  trigger: introSectionRef.current,
                  start: "top top",
                  end: "bottom bottom",
                  scrub: true,
                  onUpdate: (self) => {
                    const activeIdx = introMapper(self.progress);
                    introLines.forEach((el, i) => {
                      const diff = Math.abs(i - activeIdx);
                      if (diff === 0) {
                        gsap.to(el, {
                          opacity: 1,
                          scale: 1.15,
                          color: "#eaeef4",
                          duration: 0.35,
                          ease: "power1.out",
                          overwrite: "auto"
                        });
                      } else {
                        gsap.to(el, {
                          opacity: 0.15,
                          scale: 0.8,
                          color: "rgba(234, 238, 244, 0.4)",
                          duration: 0.35,
                          ease: "power1.out",
                          overwrite: "auto"
                        });
                      }
                    });
                  }
                }
              });

              tl.fromTo(introTextContainerRef.current,
                { rotationX: 0 },
                {
                  rotationX: -lastRotation,
                  ease: "none",
                  transformOrigin: "50% 50%",
                  force3D: true,
                }
              );

              return () => {
                tl.kill();
                gsap.set(introLines, { clearProps: "all" });
                if (introTextContainerRef.current) {
                  gsap.set(introTextContainerRef.current, { clearProps: "all" });
                }
              };
            });
          });
        }
      }

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
        className="theme-dark hero-section"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "0 0.8rem",
          paddingTop: "7rem",
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
            paddingTop: "0.5rem",
          }}
        >
          <div
            className="hero-wordmark"
            style={{
              fontFamily: "var(--font-jost), sans-serif",
              fontSize: "clamp(6rem, 18vw, 35rem)",
              fontWeight: 800,
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
      {/* ══════════════════════════════════════
          SECTION 2: INTRO — with showroom background image & scroll-driven typography
          ══════════════════════════════════════ */}
      <section
        ref={introSectionRef}
        className="theme-dark"
        style={{
          position: "relative",
          height: "280vh",
          overflow: "visible",
        }}
      >
        {/* Sticky container to pin viewport */}
        <div
          style={{
            position: "sticky",
            top: 0,
            left: 0,
            right: 0,
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Blurred background image */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: "url('/showroom.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(6px) brightness(0.4)",
              zIndex: 1,
              transform: "scale(1.05)",
            }}
          />

          {/* Perspective container */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              maxWidth: "110rem",
              width: "100%",
              padding: "0 2.4rem",
              textAlign: "center",
              height: "45rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              perspective: "1000px",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Scrollable text wrapper */}
            <div
              ref={introTextContainerRef}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "100%",
                height: "100%",
                transformStyle: "preserve-3d",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {INTRO_SENTENCES.map((line, idx) => (
                <p
                  key={idx}
                  ref={(el) => { introLinesRef.current[idx] = el; }}
                  className={idx === 0 ? "intro-drum-label intro-drum-label--first" : "intro-drum-label"}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontFamily: "var(--font-jost), sans-serif",
                    margin: 0,
                    width: "100%",
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                    color: "#eaeef4",
                    willChange: "transform, opacity",
                  }}
                  dangerouslySetInnerHTML={{ __html: line }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BROWSE BY CATEGORY — 2-card carousel
          ══════════════════════════════════════ */}
      <section className="theme-light" style={{ borderBottom: "0.1rem solid rgba(0,0,0,0.12)" }}>

        {/* Centered Header bar */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "1.2rem 2rem", borderBottom: "0.1rem solid rgba(0,0,0,0.12)", position: "relative", minHeight: "5.4rem" }}>
          {/* Left pagination & controls */}
          <div style={{ position: "absolute", left: "2rem", display: "flex", alignItems: "center", gap: "1.6rem" }}>
            <span style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: "1.1rem", fontWeight: 600, color: "rgba(0,0,0,0.4)", letterSpacing: "0.04em" }}>
              {String(catIdx + 1).padStart(2, "0")} / {String(catTotal).padStart(2, "0")}
            </span>
            <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
              {HOME_CATEGORIES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCatIdx(i)}
                  aria-label={`Category ${i + 1}`}
                  style={{ width: catIdx === i ? "2.4rem" : "0.5rem", height: "0.5rem", borderRadius: "0.25rem", background: catIdx === i ? "#000" : "rgba(0,0,0,0.18)", border: "none", cursor: "pointer", padding: 0, transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)" }}
                />
              ))}
            </div>
          </div>

          {/* Centered Title */}
          <span style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: "1.1rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(0,0,0,0.75)", textAlign: "center" }}>Browse by Category</span>

          {/* Right link */}
          <Link href="/products" id="cat-view-all" className="t-tag ul-link" style={{ position: "absolute", right: "2rem", color: "rgba(0,0,0,0.5)", letterSpacing: "0.08em", fontSize: "1.1rem" }}>View all</Link>
        </div>

        {/* 2-card carousel — overflow hidden, slides via CSS transform */}
        <div style={{ position: "relative", overflow: "hidden", width: "100%" }}>

          {/* Slide track — shifts by 50% per step (showing 2 cards) */}
          <div
            style={{
              display: "flex",
              width: `${catTotal * 50}%`,
              transform: `translateX(-${(catIdx * 100) / catTotal}%)`,
              transition: "transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {HOME_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href="/products"
                id={`home-cat-${cat.id}`}
                style={{
                  flex: `0 0 ${100 / catTotal}%`,
                  display: "flex",
                  flexDirection: "column",
                  textDecoration: "none",
                  color: "inherit",
                  borderRight: "0.1rem solid rgba(0,0,0,0.12)",
                }}
                className="home-ticket-card"
              >
                {/* Large Image (same height limit and transition) */}
                <div style={{ position: "relative", overflow: "hidden", height: "clamp(30rem, 44vw, 68rem)", background: "#111" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="home-ticket-img"
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)" }}
                  />
                </div>

                {/* Caption Bar: Category Name (Left), Short Code & Serial Number side-by-side (Right) */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2.4rem", padding: "1.8rem 2.4rem", background: "#eaeef4", transition: "background 0.25s ease" }} className="home-ticket-caption">
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", textAlign: "left" }}>
                    <span style={{ fontSize: "clamp(1.3rem, 1.6vw, 2rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1, textTransform: "uppercase", color: "#000" }}>{cat.name}</span>
                    <span style={{ fontSize: "1.1rem", color: "rgba(0,0,0,0.4)", letterSpacing: "0.05em", textTransform: "uppercase", lineHeight: 1.2 }}>{cat.sub}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1.6rem", flexShrink: 0 }}>
                    <span style={{ fontSize: "clamp(2rem, 2.8vw, 3.8rem)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1, color: "#000" }}>{cat.code}</span>
                    <span style={{ fontSize: "clamp(1.6rem, 2.2vw, 3rem)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1, color: "rgba(0,0,0,0.18)" }}>{cat.num}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* LEFT arrow — large, always visible */}
          <button
            onClick={() => setCatIdx((p) => (p - 1 + catTotal) % catTotal)}
            aria-label="Previous category"
            style={{
              position: "absolute", left: "1.6rem", top: "50%", transform: "translateY(-50%)",
              zIndex: 10, width: "5rem", height: "5rem", borderRadius: "50%",
              background: "rgba(255,255,255,0.92)", border: "0.1rem solid rgba(0,0,0,0.1)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2rem", color: "#000", boxShadow: "0 0.4rem 2rem rgba(0,0,0,0.15)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              backdropFilter: "blur(8px)",
            }}
            className="cat-nav-btn"
          >←</button>

          {/* RIGHT arrow — large, always visible */}
          <button
            onClick={() => setCatIdx((p) => (p + 1) % catTotal)}
            aria-label="Next category"
            style={{
              position: "absolute", right: "1.6rem", top: "50%", transform: "translateY(-50%)",
              zIndex: 10, width: "5rem", height: "5rem", borderRadius: "50%",
              background: "rgba(255,255,255,0.92)", border: "0.1rem solid rgba(0,0,0,0.1)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2rem", color: "#000", boxShadow: "0 0.4rem 2rem rgba(0,0,0,0.15)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              backdropFilter: "blur(8px)",
            }}
            className="cat-nav-btn"
          >→</button>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BROWSE BY BRANDS — 4-col small top + 2-col large bottom
          ══════════════════════════════════════ */}
      <section className="theme-light" style={{ borderBottom: "0.1rem solid rgba(0,0,0,0.12)" }}>

        {/* Centered Header bar */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "1.2rem 2rem", borderBottom: "0.1rem solid rgba(0,0,0,0.12)", position: "relative", minHeight: "5.4rem" }}>
          <span style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: "1.1rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(0,0,0,0.75)", textAlign: "center" }}>Browse by Brands</span>
          <Link href="/brands" className="t-tag ul-link" style={{ position: "absolute", right: "2rem", color: "rgba(0,0,0,0.6)", letterSpacing: "0.08em", fontSize: "1.1rem" }}>View all</Link>
        </div>

        {/* TOP ROW: 4 small columns */}
        <div className="brands-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", width: "100%", borderBottom: "0.1rem solid rgba(0,0,0,0.12)" }}>
          {HOME_BRANDS.slice(0, 4).map((brand, i) => (
            <Link
              key={brand.id}
              href="/brands"
              id={`home-brand-top-${brand.id}`}
              style={{
                display: "flex",
                flexDirection: "column",
                borderRight: i < 3 ? "0.1rem solid rgba(0,0,0,0.12)" : "none",
                textDecoration: "none",
                color: "inherit",
                overflow: "hidden",
              }}
              className="home-ticket-card"
            >
              <div style={{ overflow: "hidden", height: "clamp(14rem, 18vw, 30rem)", background: "#111", flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={brand.img} alt={brand.name} className="home-ticket-img" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)" }} />
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.8rem", padding: "1.2rem 0.8rem", background: "#eaeef4", transition: "background 0.25s ease" }} className="home-ticket-caption">
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  <span style={{ fontSize: "clamp(1.0rem, 1.1vw, 1.3rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1, textTransform: "uppercase", color: "#000" }}>{brand.name}</span>
                  <span style={{ fontSize: "1.0rem", color: "rgba(0,0,0,0.4)", letterSpacing: "0.04em", textTransform: "uppercase", lineHeight: 1.2 }}>{brand.sub}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }}>
                  <span style={{ fontSize: "clamp(1.4rem, 2.2vw, 3rem)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1, color: "#000" }}>{brand.code}</span>
                  <span style={{ fontSize: "clamp(1.2rem, 1.8vw, 2.6rem)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1, color: "rgba(0,0,0,0.18)" }}>{brand.num}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* BOTTOM ROW: 2 large columns with fast photo carousel */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", width: "100%" }}>
          {HOME_BRANDS.slice(4, 6).map((brand, i) => (
            <Link
              key={brand.id}
              href="/brands"
              id={`home-brand-bot-${brand.id}`}
              style={{
                display: "flex",
                flexDirection: "column",
                borderRight: i === 0 ? "0.1rem solid rgba(0,0,0,0.12)" : "none",
                textDecoration: "none",
                color: "inherit",
                overflow: "hidden",
                position: "relative",
              }}
              className="home-ticket-card"
            >
              {/* Fast photo carousel */}
              <div style={{ position: "relative", overflow: "hidden", height: "clamp(28rem, 42vw, 64rem)", background: "#111", flexShrink: 0 }}>
                {BRAND_CAROUSEL_IMGS[i].map((src, si) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={si}
                    src={src}
                    alt={brand.name}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: brandSlides[i] === si ? 1 : 0,
                      transition: "opacity 0.35s ease",
                      transform: brandSlides[i] === si ? "scale(1.03)" : "scale(1)",
                      transitionProperty: "opacity, transform",
                      transitionDuration: "0.35s",
                    }}
                  />
                ))}
                {/* Slide dots */}
                <div style={{ position: "absolute", bottom: "1.2rem", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "0.5rem", zIndex: 5 }}>
                  {BRAND_CAROUSEL_IMGS[i].map((_, si) => (
                    <div key={si} style={{ width: "0.5rem", height: "0.5rem", borderRadius: "50%", background: brandSlides[i] === si ? "#fff" : "rgba(255,255,255,0.35)", transition: "background 0.3s" }} />
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1.6rem", padding: "1.6rem 1.4rem", background: "#eaeef4", transition: "background 0.25s ease" }} className="home-ticket-caption">
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <span style={{ fontSize: "clamp(1.3rem, 1.6vw, 1.8rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1, textTransform: "uppercase", color: "#000" }}>{brand.name}</span>
                  <span style={{ fontSize: "1.1rem", color: "rgba(0,0,0,0.4)", letterSpacing: "0.05em", textTransform: "uppercase" }}>{brand.sub}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1.4rem", flexShrink: 0 }}>
                  <span style={{ fontSize: "clamp(2.8rem, 5vw, 7rem)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1, color: "#000" }}>{brand.code}</span>
                  <span style={{ fontSize: "clamp(2.4rem, 4vw, 6rem)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1, color: "rgba(0,0,0,0.18)" }}>{brand.num}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>


      {/* ══════════════════════════════════════
          SELECTED PROJECTS — 4-across ticket grid
          ══════════════════════════════════════ */}
      <section className="theme-light" style={{ borderBottom: "0.1rem solid rgba(0,0,0,0.12)" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "2.4rem 0.8rem", borderBottom: "0.1rem solid rgba(0,0,0,0.12)" }}>
          <span style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: "1.1rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(0,0,0,0.75)" }}>Selected Projects</span>
          <Link href="/work" className="t-tag ul-link" style={{ color: "rgba(0,0,0,0.6)", letterSpacing: "0.08em", fontSize: "1.1rem" }}>View all</Link>
        </div>

        {/* 4-across on desktop, 2-across on mobile */}
        <div className="home-projects-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", width: "100%" }}>
          {PROJECTS.slice(0, 4).map((project, i) => (
            <Link
              key={project.slug}
              href="/work"
              id={`home-proj-${project.slug}`}
              style={{
                display: "flex",
                flexDirection: "column",
                borderRight: i < 3 ? "0.1rem solid rgba(0,0,0,0.12)" : "none",
                textDecoration: "none",
                color: "inherit",
                overflow: "hidden",
              }}
              className="home-ticket-card"
            >
              <div style={{ overflow: "hidden", height: "clamp(18rem, 22vw, 36rem)", background: "#111", flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={project.img} alt={project.client} className="home-ticket-img" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)" }} />
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.8rem", padding: "1.2rem 0.8rem", background: "#eaeef4", transition: "background 0.25s ease" }} className="home-ticket-caption">
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  <span style={{ fontSize: "clamp(1.0rem, 1.1vw, 1.3rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1, textTransform: "uppercase", color: "#000" }}>{project.client}</span>
                  <span style={{ fontSize: "1.0rem", color: "rgba(0,0,0,0.4)", letterSpacing: "0.04em", textTransform: "uppercase", lineHeight: 1.2 }}>{project.sub}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", flexShrink: 0 }}>
                  <span style={{ fontSize: "clamp(1.4rem, 2.2vw, 2.8rem)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1, color: "#000" }}>{project.code}</span>
                  <span style={{ fontSize: "clamp(1.2rem, 1.8vw, 2.4rem)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1, color: "rgba(0,0,0,0.18)" }}>{project.num}</span>
                </div>
              </div>
            </Link>
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
            <span style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: "1.1rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(0,0,0,0.75)" }}>
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
