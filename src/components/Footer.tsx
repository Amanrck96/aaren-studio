"use client";

import { useState } from "react";
import Link from "next/link";

const AWARDS = [
  { title: "Grand Clio Winner — Clio Design 2026", href: "#" },
  { title: "Fast Company #1 Most Innovative — Interiors 2026", href: "#" },
  { title: "AD100 List 2025 — Architectural Digest", href: "#" },
];

const PRESS = [
  { title: "Architectural Digest (2024)", href: "#" },
  { title: "Dezeen (2023)", href: "#" },
  { title: "Surface Magazine (2023)", href: "#" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <footer
      style={{
        background: "#0a0a0a",
        borderTop: "1px solid #1a1a1a",
        padding: "80px 28px 32px",
        color: "rgba(255,255,255,0.9)",
      }}
    >
      {/* Top — tagline */}
      <div style={{ maxWidth: "900px", marginBottom: "72px" }}>
        <p
          style={{
            fontSize: "clamp(1.1rem, 2.5vw, 2rem)",
            fontWeight: 400,
            lineHeight: 1.4,
            color: "rgba(255,255,255,0.55)",
            letterSpacing: "-0.01em",
          }}
        >
          A creative studio dedicated to designing and producing immersive spatial experiences,
          premium material surfaces, and architectural narratives — meant to evoke feeling.
          Our work spans disciplines, unified by the singular drive of crafting unforgettable environments.
        </p>
      </div>

      {/* Middle — link columns */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "40px",
          marginBottom: "72px",
          borderTop: "1px solid #1a1a1a",
          paddingTop: "40px",
        }}
      >
        {/* Column 1 — Navigation */}
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "16px" }}>
            Navigate
          </p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { label: "All Projects", href: "/work" },
              { label: "Products", href: "/products" },
              { label: "About", href: "/about" },
              { label: "Services", href: "/services" },
              { label: "Careers", href: "/careers" },
              { label: "Blog", href: "/blog" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-underline" style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2 — Connect */}
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "16px" }}>
            Connect
          </p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { label: "Instagram", href: "https://www.instagram.com" },
              { label: "LinkedIn", href: "https://www.linkedin.com" },
              { label: "Contact", href: "/contact" },
              { label: "Privacy Policy", href: "#" },
            ].map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="link-underline"
                  style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 — Awards */}
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "16px" }}>
            Recognition
          </p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
            {AWARDS.map((a) => (
              <li key={a.title}>
                <a
                  href={a.href}
                  className="link-underline"
                  style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.4, transition: "color 0.2s", display: "block" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                >
                  {a.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4 — Press */}
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "16px" }}>
            Press
          </p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
            {PRESS.map((p) => (
              <li key={p.title}>
                <a
                  href={p.href}
                  className="link-underline"
                  style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                >
                  {p.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 5 — Contact Info */}
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "16px" }}>
            Contact Information
          </p>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
            For all inquiries, please contact<br />
            <a href="mailto:hello@aarenstudio.com" className="link-underline"
              style={{ color: "rgba(255,255,255,0.7)", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
            >
              hello@aarenstudio.com
            </a>
          </p>
        </div>
      </div>

      {/* Newsletter */}
      <div
        style={{
          borderTop: "1px solid #1a1a1a",
          paddingTop: "40px",
          marginBottom: "48px",
        }}
      >
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", marginBottom: "20px", maxWidth: "480px" }}>
          Keep up with the latest, for all things AAREN. Drop your email below, and let&apos;s stay connected.
        </p>
        {submitted ? (
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>Thank you — we&apos;ll be in touch.</p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0", maxWidth: "420px" }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              style={{
                flex: 1,
                background: "transparent",
                border: "1px solid #2a2a2a",
                borderRight: "none",
                padding: "12px 16px",
                fontSize: "13px",
                color: "#ffffff",
                outline: "none",
                letterSpacing: "0.02em",
              }}
            />
            <button
              type="submit"
              style={{
                background: "#ffffff",
                color: "#0a0a0a",
                border: "1px solid #ffffff",
                padding: "12px 20px",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              Subscribe
            </button>
          </form>
        )}
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          borderTop: "1px solid #1a1a1a",
          paddingTop: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.05em" }}>
          AAREN.© {new Date().getFullYear()}
        </p>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.05em" }}>
          CREATIVE STUDIO
        </p>
      </div>
    </footer>
  );
}
