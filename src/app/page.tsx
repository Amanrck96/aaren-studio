"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

/* ─── Aaren projects (replaces Drake / Bad Bunny / Adobe etc.) ─── */
const PROJECTS = [
  { client: "The Oberoi",        sub: "Presidential Suite — Lobby Renovation",  year: "2025", code: "OB", num: "01", slug: "oberoi-lobby",   img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80" },
  { client: "Taj Hotels",        sub: "Spa & Wellness Sanctuary",                year: "2025", code: "TJ", num: "02", slug: "taj-spa",        img: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=900&q=80" },
  { client: "Ratan Group",       sub: "Corporate Headquarters — Mumbai",         year: "2025", code: "RG", num: "03", slug: "ratan-hq",       img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80" },
  { client: "Godrej Properties", sub: "Luxury Showflat — Worli",                 year: "2024", code: "GP", num: "04", slug: "godrej-worli",   img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80" },
  { client: "Private Villa",     sub: "Bespoke Residence — Alibaug",             year: "2024", code: "PV", num: "05", slug: "alibaug-villa",  img: "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=900&q=80" },
  { client: "Nykaa",             sub: "Flagship Retail Experience",               year: "2023", code: "NK", num: "06", slug: "nykaa-retail",   img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80" },
  { client: "Lodha Group",       sub: "Club Lounge & Amenity Deck",              year: "2023", code: "LG", num: "07", slug: "lodha-club",     img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80" },
  { client: "Birla Estates",     sub: "Penthouse Interiors — Delhi",             year: "2023", code: "BE", num: "08", slug: "birla-penthouse",img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80" },
];

/* ─── Client marquee names (replaces Drake / Bad Bunny scroll) ─── */
const CLIENTS = [
  "The Oberoi","Taj Hotels","Godrej Properties","Nykaa","Ratan Group",
  "Hiranandani","Lodha Group","Piramal Realty","Birla Estates","Mahindra",
  "ITC Hotels","Leela Group","DLF","Prestige Group","Embassy Group",
];

/* ─── Services (replaces Creative Direction / Show Design etc.) ─── */
const SERVICES = [
  "Interior Design","Space Planning","Material Curation","Furniture Design",
  "Architectural Surfaces","Lighting Design","Joinery & Millwork",
  "Bathroom & Wellness","Flooring Systems","Facade & Cladding",
];

export default function Home() {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [pos, setPos]   = useState({ x: 0, y: 0 });
  const [flip, setFlip] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent]   = useState(false);

  const onMove = useCallback((e: MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
    setFlip(e.clientX > window.innerWidth / 2);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [onMove]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Description text lines slide up */
      gsap.from(".s-desc span", {
        y: "105%", opacity: 0, duration: 1.1,
        ease: "power4.out", stagger: .1, delay: .1,
      });
      /* Services fade in */
      gsap.from(".s-svc", {
        opacity: 0, y: 10, duration: .8,
        ease: "power3.out", stagger: .04, delay: .6,
      });
      /* Project names slide up */
      gsap.from(".s-name", {
        y: 50, opacity: 0, duration: .9,
        ease: "power3.out", stagger: .06, delay: .2,
        scrollTrigger: { trigger: ".s-projects", start: "top 80%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const hovPrj = PROJECTS.find(p => p.slug === hovered);

  return (
    <div ref={ref} style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>

      {/* ══ FLOATING HOVER IMAGE — Drake/Bad Bunny exact clone ══ */}
      <div style={{
        position: "fixed", pointerEvents: "none", zIndex: 900,
        left: flip ? "auto" : pos.x + 30,
        right: flip ? `calc(100vw - ${pos.x}px + 30px)` : "auto",
        top: pos.y - 150,
        width: 340, height: 260,
        opacity: hovered ? 1 : 0,
        transform: hovered ? "translateY(0) scale(1)" : "translateY(14px) scale(.96)",
        transition: "opacity .28s ease, transform .32s ease",
        overflow: "hidden",
        background: "#111",
      }}>
        {hovPrj && (
          <img src={hovPrj.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        )}
      </div>

      {/* ══ HERO ══
          Structure: exactly like Sturdy.co
          - Description paragraph at top-left
          - Services list below description
          - Then the project name list fills rest of viewport
      */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "100px 24px 32px" }}>

        {/* ── Top: description + services ── */}
        <div>
          {/* Description — same as Sturdy's opening line */}
          <div className="s-desc" style={{ maxWidth: 580, marginBottom: 32, overflow: "hidden" }}>
            {[
              "A creative studio and material house",
              "dedicated to designing and producing",
              "immersive spatial experiences —",
              "meant to evoke feeling.",
            ].map((line, i) => (
              <div key={i} style={{ overflow: "hidden" }}>
                <span style={{ display: "block", fontSize: "clamp(.9rem,1.3vw,1.15rem)", lineHeight: 1.55, color: "rgba(255,255,255,.55)", fontWeight: 400 }}>
                  {line}
                </span>
              </div>
            ))}
          </div>

          {/* Visual innovation subline — Sturdy has "Visual innovation and experiences for world class artists and brands." */}
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,.3)", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 20 }}>
            Visual innovation and spatial experiences for world class clients and brands.
          </p>

          {/* Services list — exactly like Sturdy's service tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 0", borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: 16 }}>
            {SERVICES.map((s, i) => (
              <span key={i} className="s-svc" style={{
                fontSize: "12px", color: "rgba(255,255,255,.4)",
                paddingRight: 16, marginBottom: 6,
                borderRight: i < SERVICES.length - 1 ? "1px solid rgba(255,255,255,.1)" : "none",
                paddingLeft: i > 0 ? 16 : 0,
              }}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* ── Bottom: description repeated (Sturdy does this) ── */}
        <div style={{ maxWidth: 480, marginBottom: 16 }}>
          <p style={{ fontSize: "clamp(.85rem,1.1vw,1rem)", color: "rgba(255,255,255,.35)", lineHeight: 1.6 }}>
            A creative studio and material house dedicated to designing and producing immersive spatial experiences — meant to evoke feeling. Our work spans disciplines, unified by the singular drive of crafting unforgettable environments.
          </p>
        </div>
      </section>

      {/* ══ PROJECT NAME LIST — Exact Sturdy.co layout ══
          Each row: project image card + client name + subtitle + year + code
          On hover: floating image follows cursor (Drake/Bad Bunny feature)
      */}
      <section className="s-projects" style={{ borderTop: "1px solid rgba(255,255,255,.08)" }}>

        {PROJECTS.map((p, i) => (
          <Link
            key={p.slug}
            href={`/work/${p.slug}`}
            className="s-name"
            onMouseEnter={() => setHovered(p.slug)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              alignItems: "center",
              padding: "14px 24px",
              borderBottom: "1px solid rgba(255,255,255,.08)",
              textDecoration: "none",
              gap: 24,
              transition: "background .15s",
              background: "transparent",
            }}
            onMouseOver={e => (e.currentTarget.style.background = "rgba(255,255,255,.03)")}
            onMouseOut={e => (e.currentTarget.style.background = "transparent")}
          >
            {/* Left: client name (large) + subtitle */}
            <div>
              <h2 style={{
                fontSize: "clamp(1.6rem, 4.5vw, 5rem)",
                fontWeight: 700,
                letterSpacing: "-.025em",
                lineHeight: 1.0,
                color: hovered === null ? "rgba(255,255,255,.88)"
                     : hovered === p.slug ? "#fff"
                     : "rgba(255,255,255,.12)",
                transition: "color .18s",
                textTransform: "uppercase",
              }}>
                {p.client}
              </h2>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,.35)", marginTop: 4 }}>
                {p.sub}
              </p>
            </div>

            {/* Right: year + code — exactly like Sturdy */}
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,.25)", letterSpacing: ".04em", marginBottom: 2 }}>{p.year}</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,.1)", letterSpacing: "-.01em" }}>
                {p.code}&nbsp;{p.num}
              </p>
            </div>
          </Link>
        ))}
      </section>

      {/* ══ CLIENT NAMES MARQUEE — Drake · Bad Bunny · Adobe scroll ══ */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,.08)", padding: "18px 0", overflow: "hidden" }}>
        <div className="mq-wrap">
          <div className="mq-track" style={{ gap: 0 }}>
            {[...CLIENTS, ...CLIENTS].map((c, i) => (
              <span key={i} style={{
                fontSize: 12, color: "rgba(255,255,255,.3)",
                letterSpacing: ".08em", textTransform: "uppercase",
                padding: "0 24px", whiteSpace: "nowrap",
                borderRight: "1px solid rgba(255,255,255,.08)",
              }}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ NEWSLETTER — exact Sturdy.co copy ══ */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,.08)", padding: "60px 24px" }}>
        <p style={{ fontSize: "clamp(.85rem,1.1vw,1rem)", color: "rgba(255,255,255,.45)", marginBottom: 24, maxWidth: 420 }}>
          Keep up with the latest, for all things AAREN. Drop your email below, and let&apos;s stay connected.
        </p>
        {sent ? (
          <p style={{ fontSize: 13, color: "rgba(255,255,255,.5)" }}>Thank you — we&apos;ll be in touch.</p>
        ) : (
          <form
            onSubmit={e => { e.preventDefault(); if (email) setSent(true); }}
            style={{ display: "flex", maxWidth: 380 }}
          >
            <input
              type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email address"
              required
              style={{
                flex: 1, background: "transparent",
                border: "1px solid rgba(255,255,255,.2)",
                borderRight: "none", padding: "10px 14px",
                fontSize: 12, color: "#fff", outline: "none",
                letterSpacing: ".02em",
              }}
            />
            <button
              type="submit"
              style={{
                background: "#fff", color: "#000",
                border: "1px solid #fff",
                padding: "10px 18px",
                fontSize: 11, fontWeight: 600,
                letterSpacing: ".07em", textTransform: "uppercase",
                flexShrink: 0,
              }}
            >
              Subscribe
            </button>
          </form>
        )}
      </section>

    </div>
  );
}
