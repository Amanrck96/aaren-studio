"use client";
import { useState } from "react";
import Link from "next/link";

/* Exact Sturdy.co footer structure */
const COL1 = [
  { label: "All Projects", href: "/work", suffix: " [12]" },
  { label: "Instagram",    href: "https://www.instagram.com", ext: true },
  { label: "Contact",      href: "/contact" },
  { label: "Privacy Policy", href: "#" },
];

const AWARDS = [
  { text: "AD100 List — Architectural Digest 2026",               href: "#" },
  { text: "Fast Company #1 Most Innovative — Interiors 2026",     href: "#" },
  { text: "Grand Clio Winner — Clio Design 2025",                 href: "#" },
];

const PRESS = [
  { text: "Architectural Digest (2024)", href: "#" },
  { text: "Dezeen (2023)",               href: "#" },
  { text: "Surface Magazine (2023)",     href: "#" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent]   = useState(false);

  const lnk = {
    fontSize: "12px",
    color: "rgba(255,255,255,.5)",
    letterSpacing: ".02em",
    transition: "color .2s",
  };

  return (
    <footer style={{ background: "#000", borderTop: "1px solid rgba(255,255,255,.08)", color: "#fff" }}>

      {/* ── Description (Sturdy repeats tagline in footer) ── */}
      <div style={{ padding: "56px 24px 40px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
        <p style={{ fontSize: "clamp(.9rem,1.5vw,1.2rem)", color: "rgba(255,255,255,.4)", lineHeight: 1.55, maxWidth: 680 }}>
          A creative studio and material house dedicated to designing and producing
          immersive spatial experiences — meant to evoke feeling. Our work spans disciplines,
          unified by the singular drive of crafting unforgettable environments.
        </p>
      </div>

      {/* ── Link columns — exactly Sturdy.co layout ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: "32px 24px",
        padding: "40px 24px",
        borderBottom: "1px solid rgba(255,255,255,.08)",
      }}>

        {/* Col 1 — Nav links */}
        <div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9 }}>
            {COL1.map(l => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target={l.ext ? "_blank" : undefined}
                  rel={l.ext ? "noopener noreferrer" : undefined}
                  className="ul-link"
                  style={lnk}
                  onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,.5)")}
                >
                  {l.label}{l.suffix ?? ""}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 2 — Awards (Sturdy shows Grand Clio etc.) */}
        <div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9 }}>
            {AWARDS.map(a => (
              <li key={a.text}>
                <a href={a.href} className="ul-link" style={{ ...lnk, lineHeight: 1.4, display: "block" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,.5)")}
                >
                  {a.text}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Press (Sturdy shows Flaunt, Variety, Billboard) */}
        <div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9 }}>
            {PRESS.map(p => (
              <li key={p.text}>
                <a href={p.href} className="ul-link" style={lnk}
                  onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,.5)")}
                >
                  {p.text}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4 — Contact info */}
        <div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.3)", lineHeight: 1.6 }}>
            Contact Information
          </p>
          <a
            href="mailto:hello@aarenstudio.com"
            className="ul-link"
            style={{ ...lnk, display: "block", marginTop: 8 }}
            onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,.5)")}
          >
            hello@aarenstudio.com
          </a>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.25)", lineHeight: 1.6, marginTop: 8 }}>
            For all inquiries, please contact hello@aarenstudio.com
          </p>
        </div>
      </div>

      {/* ── Newsletter — exact Sturdy.co copy ── */}
      <div style={{ padding: "40px 24px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,.35)", marginBottom: 18, maxWidth: 400 }}>
          For AAREN content and updates, drop in your email below. We&apos;re looking forward to connecting with you.
        </p>
        {sent ? (
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.5)" }}>Thank you — we&apos;ll be in touch.</p>
        ) : (
          <form
            onSubmit={e => { e.preventDefault(); if (email) setSent(true); }}
            style={{ display: "flex", maxWidth: 360 }}
          >
            <input
              type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email address"
              required
              style={{
                flex: 1, background: "transparent",
                border: "1px solid rgba(255,255,255,.18)",
                borderRight: "none", padding: "9px 12px",
                fontSize: 12, color: "#fff", outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                background: "#fff", color: "#000",
                border: "1px solid #fff",
                padding: "9px 16px",
                fontSize: 11, fontWeight: 600,
                letterSpacing: ".06em", textTransform: "uppercase",
              }}
            >
              Subscribe
            </button>
          </form>
        )}
      </div>

      {/* ── Copyright bar — "STURDY.co© 2026" style ── */}
      <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,.2)", letterSpacing: ".06em" }}>
          AAREN.© {new Date().getFullYear()}
        </span>
        <div style={{ display: "flex", gap: 20 }}>
          {[
            { label: "Work",      href: "/work" },
            { label: "Products",  href: "/products" },
            { label: "Instagram", href: "https://www.instagram.com", ext: true },
          ].map(l => (
            <a key={l.label} href={l.href}
              target={l.ext ? "_blank" : undefined}
              rel={l.ext ? "noopener noreferrer" : undefined}
              className="ul-link"
              style={{ fontSize: 11, color: "rgba(255,255,255,.2)", letterSpacing: ".06em", transition: "color .2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,.7)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,.2)")}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
