"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { SiteSettingsItem, DEFAULT_SETTINGS } from "@/lib/types";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─── Services ─── */
const SERVICES = [
  "Plywood",
  "Decorative surfaces",
  "Cladding & Decking",
  "Wooden flooring",
  "Screens",
  "Doors",
  "Windows",
  "Kitchen",
  "Wardrobe",
  "Hardware",
  "Partition",
  "FF&E",
  "Tiles",
  "Wellness",
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
  "Window to the world<br />of interior products",
  "Incredible products of<br />world renowned brands",
  "Carefully curated products<br />focused on unique experience",
  "The experience you've only<br />dreamt about",
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

interface HomeClientProps {
  initialSettings: SiteSettingsItem;
  initialCategories: any[];
  initialBrands: any[];
  initialProjects: any[];
}

export default function HomeClient({
  initialSettings,
  initialCategories,
  initialBrands,
  initialProjects,
}: HomeClientProps) {
  const siteSettings = initialSettings || DEFAULT_SETTINGS;
  const categoriesList = initialCategories || [];
  const brandsList = initialBrands || [];
  const projectsList = initialProjects || [];

  const logoLetters = (siteSettings?.heroTitle || "AAREN").split("");

  /* ── Logo reveal state ── */
  const [lettersRevealed, setLettersRevealed] = useState<boolean[]>(
    Array(12).fill(false)
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
  const [catPaused, setCatPaused] = useState(false);
  const catTotal = categoriesList.length;
  useEffect(() => {
    if (catTotal <= 1 || catPaused) return;
    const t = setInterval(() => setCatIdx((p) => (p + 1) % catTotal), 6000);
    return () => clearInterval(t);
  }, [catTotal, catPaused]);

  /* ── Brands full-width carousel state ── */
  const [brandIdx, setBrandIdx] = useState(0);
  const [brandPaused, setBrandPaused] = useState(false);
  const brandTotal = brandsList.length;
  useEffect(() => {
    if (brandTotal <= 1 || brandPaused) return;
    const t = setInterval(() => setBrandIdx((p) => (p + 1) % brandTotal), 6000);
    return () => clearInterval(t);
  }, [brandTotal, brandPaused]);

  /* ── Fast inner image slideshow for first 2 brand cards ── */
  const [slideA, setSlideA] = useState(0);
  const [slideB, setSlideB] = useState(0);
  useEffect(() => {
    const tA = setInterval(
      () => setSlideA((p) => (p + 1) % BRAND_CAROUSEL_IMGS[0].length),
      3500
    );
    const tB = setInterval(
      () => setSlideB((p) => (p + 1) % BRAND_CAROUSEL_IMGS[1].length),
      4000
    );
    return () => {
      clearInterval(tA);
      clearInterval(tB);
    };
  }, []);

  /* ── Staggered letter reveal on mount ── */
  useEffect(() => {
    const len = logoLetters.length;
    const timers = Array.from({ length: len }, (_, i) =>
      setTimeout(() => {
        setLettersRevealed((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 150 + i * 80)
    );
    return () => timers.forEach(clearTimeout);
  }, [logoLetters.length]);

  /* ── Track mouse for floating hover preview ── */
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const imgW = 280;
    const imgH = 200;
    const pad = 24;
    let x = e.clientX + pad;
    let y = e.clientY - imgH / 2;

    const shouldFlip = x + imgW > window.innerWidth - 20;
    if (shouldFlip) {
      x = e.clientX - imgW - pad;
    }
    if (y < 20) y = 20;
    if (y + imgH > window.innerHeight - 20) {
      y = window.innerHeight - imgH - 20;
    }

    setFlip(shouldFlip);
    setPos({ x, y });
  }, []);

  /* ── GSAP horizontal scroll ── */
  const trackRef = useRef<HTMLDivElement>(null);
  const sliderSectionRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const section = sliderSectionRef.current;
    if (!track || !section) return;

    let ctx = gsap.context(() => {
      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

      gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [projectsList]);

  /* ── Scroll hooks ── */
  const introView = useInView(0.2);
  const statementView = useInView(0.2);

  const heroCats = siteSettings?.heroCategories || [
    "Decorative Surfaces",
    "Flooring Solutions",
    "Architectural Hardware",
    "Sanitaryware",
    "Wellness Systems",
    "Bespoke Furniture",
  ];

  return (
    <div
      className="home-root"
      onMouseMove={handleMouseMove}
      style={{
        backgroundColor: "#E6E2D8",
        color: "#1e1e1e",
        fontFamily: "var(--font-primary, sans-serif)",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {/* ─── Hero Section ─── */}
      <section
        ref={heroRef}
        className="home-hero"
        style={{
          position: "relative",
          minHeight: "92vh",
          paddingTop: "7.5rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "7.5rem 3rem 3rem",
          borderBottom: "1px solid rgba(0,0,0,0.12)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "2rem" }}>
          <div>
            <span style={{ fontSize: "0.85rem", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#81663F", display: "block", marginBottom: "0.8rem" }}>
              AAREN INTPRO — MATERIAL HOUSE
            </span>
            <div style={{ display: "flex", gap: "0.4rem", fontSize: "clamp(4.5rem, 12vw, 13rem)", fontWeight: 900, lineHeight: 0.85, letterSpacing: "-0.04em", color: "#1e1e1e" }}>
              {logoLetters.map((l, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    opacity: lettersRevealed[i] ? 1 : 0,
                    transform: lettersRevealed[i] ? "translateY(0)" : "translateY(24px)",
                    transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  {l}
                </span>
              ))}
            </div>
          </div>

          <div style={{ maxWidth: "420px", textAlign: "right" }}>
            <p style={{ fontSize: "1.25rem", lineHeight: 1.45, fontWeight: 500, color: "rgba(0,0,0,0.75)", margin: 0 }}>
              {siteSettings?.heroTagline || "Bengaluru's premier material house and luxury lifestyle curator."}
            </p>
            <p style={{ fontSize: "0.95rem", color: "rgba(0,0,0,0.5)", marginTop: "1rem" }}>
              {siteSettings?.heroSubtext || "Representing 20+ world-class European & global architectural brands under one roof."}
            </p>
          </div>
        </div>

        {/* Hero Video / Imagery */}
        {siteSettings?.heroVideoUrl ? (
          <div style={{ position: "relative", width: "100%", height: "48vh", marginTop: "3rem", borderRadius: "16px", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}>
            <video
              src={siteSettings.heroVideoUrl}
              autoPlay
              muted
              loop
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        ) : null}

        {/* Hero Bottom Categories ticker */}
        <div style={{ display: "flex", gap: "2rem", overflowX: "auto", padding: "2rem 0 0", borderTop: "1px solid rgba(0,0,0,0.08)", marginTop: "2rem" }}>
          {heroCats.map((cat, idx) => (
            <span key={idx} style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap", color: "rgba(0,0,0,0.6)" }}>
              • {cat}
            </span>
          ))}
        </div>
      </section>

      {/* ─── Intro Statements Section ─── */}
      <section
        className={`home-intro ${introView.visible ? "is-visible" : ""}`}
        ref={introView.ref}
        style={{
          padding: "8rem 3rem",
          background: "#ffffff",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#81663F", display: "block", marginBottom: "2rem" }}>
            OUR PHILOSOPHY
          </span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "3rem" }}>
            {INTRO_SENTENCES.map((sent, idx) => (
              <div
                key={idx}
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 700,
                  lineHeight: 1.3,
                  color: "#1e1e1e",
                  letterSpacing: "-0.02em",
                  borderLeft: "2px solid #d4af37",
                  paddingLeft: "1.5rem",
                }}
                dangerouslySetInnerHTML={{ __html: sent }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Categories Showcase Carousel ─── */}
      {categoriesList.length > 0 && (
        <section style={{ padding: "6rem 3rem", background: "#E6E2D8", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
          <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <span style={{ fontSize: "0.85rem", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#81663F" }}>
                  CURATED MATERIAL SPECTRUM
                </span>
                <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 800, margin: "0.4rem 0 0", letterSpacing: "-0.03em" }}>
                  Categories ({categoriesList.length})
                </h2>
              </div>
              <Link href="/products" style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1e1e1e", textDecoration: "none", borderBottom: "2px solid #1e1e1e", paddingBottom: "2px" }}>
                Explore Full Directory →
              </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
              {categoriesList.slice(0, 8).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${encodeURIComponent(cat.name)}`}
                  style={{
                    background: "#ffffff",
                    borderRadius: "14px",
                    overflow: "hidden",
                    border: "1px solid rgba(0,0,0,0.06)",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.3s ease",
                  }}
                >
                  <div style={{ position: "relative", height: "240px", background: "#eee" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cat.img}
                      alt={cat.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    {cat.logo && (
                      <div style={{ position: "absolute", bottom: "12px", left: "12px", background: "rgba(255,255,255,0.92)", padding: "0.3rem 0.8rem", borderRadius: "4px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={cat.logo} alt="Brand logo" style={{ maxHeight: "24px", maxWidth: "80px", objectFit: "contain" }} />
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "1.4rem" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#81663F", letterSpacing: "0.1em" }}>
                      {cat.code} {cat.num}
                    </span>
                    <h3 style={{ fontSize: "1.3rem", fontWeight: 800, margin: "0.3rem 0 0.2rem" }}>{cat.name}</h3>
                    <p style={{ fontSize: "0.85rem", color: "rgba(0,0,0,0.6)", margin: 0 }}>{cat.sub}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Brands Showcase Grid ─── */}
      {brandsList.length > 0 && (
        <section style={{ padding: "6rem 3rem", background: "#ffffff", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
          <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <span style={{ fontSize: "0.85rem", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#81663F" }}>
                  INTERNATIONAL PARTNERS
                </span>
                <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 800, margin: "0.4rem 0 0", letterSpacing: "-0.03em" }}>
                  Exclusive Brands ({brandsList.length})
                </h2>
              </div>
              <Link href="/brands" style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1e1e1e", textDecoration: "none", borderBottom: "2px solid #1e1e1e", paddingBottom: "2px" }}>
                View All Brands →
              </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2.5rem" }}>
              {brandsList.slice(0, 6).map((b) => (
                <Link
                  key={b.id}
                  href={`/brands/${b.id}`}
                  style={{
                    borderRadius: "14px",
                    overflow: "hidden",
                    background: "#E6E2D8",
                    border: "1px solid rgba(0,0,0,0.08)",
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ position: "relative", height: "260px", background: "#dcd8ce" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={b.img} alt={b.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    {b.logo && (
                      <div style={{ position: "absolute", bottom: "14px", left: "14px", background: "rgba(255,255,255,0.92)", padding: "0.4rem 0.9rem", borderRadius: "4px", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={b.logo} alt={b.name} style={{ maxHeight: "28px", maxWidth: "90px", objectFit: "contain" }} />
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <h3 style={{ fontSize: "1.4rem", fontWeight: 800, margin: 0 }}>{b.name}</h3>
                      <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#81663F" }}>{b.code} {b.num}</span>
                    </div>
                    <p style={{ fontSize: "0.9rem", color: "rgba(0,0,0,0.65)", margin: "0.4rem 0 0" }}>{b.sub}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Projects Horizontal Scroll Section ─── */}
      {projectsList.length > 0 && (
        <section ref={sliderSectionRef} style={{ background: "#0a0a0c", color: "#f0f0f2", overflow: "hidden" }}>
          <div style={{ padding: "5rem 3rem 2rem", maxWidth: "1600px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <span style={{ color: "#d4af37", fontSize: "0.85rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 800 }}>
                SPATIAL SPECIFICATIONS
              </span>
              <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, color: "#fff", margin: "0.4rem 0 0" }}>
                Selected Projects
              </h2>
            </div>
            <Link href="/projects" style={{ color: "#d4af37", fontSize: "1rem", fontWeight: 700, textDecoration: "none" }}>
              All Projects Archive →
            </Link>
          </div>

          <div
            ref={trackRef}
            style={{
              display: "flex",
              gap: "3rem",
              padding: "2rem 3rem 6rem",
              width: "max-content",
            }}
          >
            {projectsList.map((p, idx) => (
              <Link
                key={idx}
                href="/projects"
                style={{
                  width: "480px",
                  flexShrink: 0,
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div style={{ height: "360px", borderRadius: "16px", overflow: "hidden", position: "relative", background: "#1a1a20", marginBottom: "1.2rem" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.client} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <span style={{ position: "absolute", top: "14px", left: "14px", background: "rgba(0,0,0,0.7)", color: "#fff", padding: "0.3rem 0.7rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700 }}>
                    {p.code} {p.num}
                  </span>
                </div>
                <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff", margin: "0 0 0.3rem" }}>{p.client}</h3>
                <p style={{ fontSize: "0.9rem", color: "#94a3b8", margin: 0 }}>{p.sub} — {p.year}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── Footer CTA ─── */}
      <footer style={{ background: "#E6E2D8", padding: "8rem 3rem", borderTop: "1px solid rgba(0,0,0,0.1)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#81663F", display: "block", marginBottom: "1rem" }}>
            START A SPECIFICATION
          </span>
          <h2 style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.03em", margin: "0 0 2rem", color: "#1e1e1e" }}>
            LET&apos;S CRAFT TOGETHER.
          </h2>
          <p style={{ fontSize: "1.2rem", color: "rgba(0,0,0,0.7)", maxWidth: "560px", margin: "0 auto 3rem", lineHeight: 1.5 }}>
            Schedule an appointment at our Mysore Road Material Lab or request sample kits for your architectural project.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap" }}>
            <Link
              href="/contact"
              style={{
                background: "#1e1e1e",
                color: "#E6E2D8",
                padding: "1.2rem 2.8rem",
                borderRadius: "4px",
                fontWeight: 800,
                fontSize: "1rem",
                textDecoration: "none",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Book Studio Consultation →
            </Link>
            <Link
              href="/catalogs"
              style={{
                background: "transparent",
                color: "#1e1e1e",
                border: "2px solid #1e1e1e",
                padding: "1.2rem 2.8rem",
                borderRadius: "4px",
                fontWeight: 800,
                fontSize: "1rem",
                textDecoration: "none",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Download PDF Catalogues
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
