"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { SiteSettingsItem, DEFAULT_SETTINGS } from "@/lib/types";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<SiteSettingsItem>(DEFAULT_SETTINGS);

  useEffect(() => {
    fetch("/api/site-settings")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) setSettings(json.data);
      })
      .catch((e) => console.error(e));
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="site-footer">
      {/* ── Top row: nav + contact ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem 2rem",
          paddingTop: "6rem",
          paddingBottom: "4rem",
          borderBottom: "0.1rem solid var(--color-border)",
        }}
      >
        {/* Left — 3-column navigation links */}
        <nav>
          {(() => {
            const allLinks = Array.from(new Set([...(settings.footerLinks || []), "All Projects", "Brands", "Products", "FAQ", "Blog", "Privacy Policy"])).filter(l => l.toLowerCase() !== "instagram");
            const getHref = (l: string) => {
              const lower = l.toLowerCase();
              return lower.includes("project")
                ? "/projects"
                : lower.includes("brand")
                ? "/brands"
                : lower.includes("product")
                ? "/products"
                : lower.includes("history")
                ? "/about"
                : lower.includes("faq")
                ? "/faq"
                : lower.includes("blog")
                ? "/blog"
                : lower.includes("privacy")
                ? "/privacy-policy"
                : "#";
            };

            const col1 = ["All Projects", "Privacy Policy", "Products"];
            const col2 = ["Brands", "Blog", "FAQ"];

            return (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(130px, 1fr))",
                  gap: "2rem 4rem",
                  maxWidth: "400px",
                }}
              >
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "1.4rem" }}>
                  {col1.map((l) => (
                    <li key={l}>
                      <Link href={getHref(l)} className="ul-link" style={{ fontSize: "1.4rem", color: "rgba(0,0,0,0.5)", letterSpacing: "-0.01em" }}>
                        {l}
                      </Link>
                    </li>
                  ))}
                </ul>

                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "1.4rem" }}>
                  {col2.map((l) => (
                    <li key={l}>
                      <Link href={getHref(l)} className="ul-link" style={{ fontSize: "1.4rem", color: "rgba(0,0,0,0.5)", letterSpacing: "-0.01em" }}>
                        {l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })()}
        </nav>

        {/* Right — contact */}
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(0,0,0,0.35)", marginBottom: "0.6rem" }}>
            Contact Us
          </p>
          <p style={{ fontSize: "1.3rem", fontWeight: 700, letterSpacing: "0.02em", color: "#000", marginBottom: "0.4rem" }}>
            AAREN INTPRO
          </p>
          <p style={{ fontSize: "1.2rem", color: "rgba(0,0,0,0.6)", lineHeight: 1.4, marginBottom: "0.4rem" }}>
            {settings.contactAddress}
          </p>
          <p style={{ fontSize: "1.2rem", color: "rgba(0,0,0,0.7)", lineHeight: 1.4, marginBottom: "0.4rem" }}>
            Phone: <a href={`tel:${settings.contactPhone}`} className="ul-link" style={{ color: "#000", fontWeight: 600 }}>{settings.contactPhone}</a>
          </p>
          <a
            href={`mailto:${settings.contactEmail}`}
            className="ul-link"
            style={{ fontSize: "1.2rem", color: "#000", fontWeight: 500, letterSpacing: "-0.01em", display: "inline-block" }}
          >
            {settings.contactEmail}
          </a>
        </div>
      </div>

      {/* ── Large AAREN wordmark — fills the footer ── */}
      <div
        className="footer-wordmark"
        style={{
          fontFamily: "var(--font-jost), sans-serif",
          fontSize: "clamp(4.5rem, 14vw, 24rem)",
          fontWeight: 200,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "rgba(0,0,0,0.06)",
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          overflow: "hidden",
          lineHeight: 0.8,
          userSelect: "none",
          paddingTop: "4rem",
          paddingBottom: "2rem",
        }}
      >
        <span>A</span>
        <span>A</span>
        <span>R</span>
        <span>E</span>
        <span>N</span>
      </div>

      {/* ── Bottom copyright ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "2rem",
          paddingBottom: "2.4rem",
          borderTop: "0.1rem solid var(--color-border)",
          flexWrap: "wrap",
          gap: "1.6rem",
        }}
      >
        <span style={{ fontSize: "1.1rem", color: "rgba(0,0,0,0.4)", letterSpacing: "0.04em" }}>
          {settings.copyrightText}
        </span>

        {/* Social media icons redirecting to official channels */}
        <div style={{ display: "flex", gap: "1.8rem", alignItems: "center" }}>
          <a href={settings.socialLinks?.[0] || "https://www.instagram.com/aaren_intpro/"} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="footer-social-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a href={settings.socialLinks?.[1] || "https://www.facebook.com/aarenintpro/"} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="footer-social-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
          </a>
          <a href={settings.socialLinks?.[2] || "https://www.linkedin.com/company/aaren-intpro/"} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="footer-social-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
          <a href={settings.socialLinks?.[3] || "https://www.youtube.com/@aarenintpro"} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="footer-social-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
            </svg>
          </a>
        </div>

        <span style={{ fontSize: "1.1rem", color: "rgba(0,0,0,0.4)", letterSpacing: "0.01em" }}>
          Creative Studio &amp; Material House
        </span>
      </div>
    </footer>
  );
}
