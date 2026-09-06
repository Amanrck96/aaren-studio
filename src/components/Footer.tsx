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
      .catch(() => {});
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="site-footer" style={{ background: "#E6E2D8", borderTop: "1px solid #D8D0BE" }}>
      <div className="page-container">
        {/* ── Top row: nav + contact ── */}
        <div className="footer-top-row">
        {/* Left — 2-column navigation links */}
        <nav>
          {(() => {
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
                  gridTemplateColumns: "repeat(2, minmax(110px, 1fr))",
                  gap: "1.5rem 3rem",
                  maxWidth: "380px",
                }}
              >
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "1.2rem", padding: 0, margin: 0 }}>
                  {col1.map((l) => (
                    <li key={l}>
                      <Link href={getHref(l)} className="ul-link footer-nav-link">
                        {l}
                      </Link>
                    </li>
                  ))}
                </ul>

                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "1.2rem", padding: 0, margin: 0 }}>
                  {col2.map((l) => (
                    <li key={l}>
                      <Link href={getHref(l)} className="ul-link footer-nav-link">
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
        <div className="footer-contact-block">
          <p style={{ fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#81663F", fontWeight: 800, marginBottom: "0.5rem" }}>
            CONTACT US
          </p>
          <p style={{ fontSize: "1.35rem", fontWeight: 800, letterSpacing: "0.02em", color: "#81663F", marginBottom: "0.4rem" }}>
            AAREN INTPRO
          </p>
          <p style={{ fontSize: "1.15rem", color: "#5E5852", lineHeight: 1.5, marginBottom: "0.4rem", maxWidth: "340px", wordBreak: "break-word" }}>
            {settings.contactAddress}
          </p>
          <p style={{ fontSize: "1.15rem", color: "#5E5852", lineHeight: 1.5, marginBottom: "0.4rem" }}>
            Phone:{" "}
            <a href={`tel:${settings.contactPhone}`} className="ul-link" style={{ color: "#81663F", fontWeight: 700 }}>
              {settings.contactPhone}
            </a>
          </p>
          <a
            href={`mailto:${settings.contactEmail}`}
            className="ul-link"
            style={{ fontSize: "1.15rem", color: "#81663F", fontWeight: 700, letterSpacing: "-0.01em", display: "inline-block" }}
          >
            {settings.contactEmail}
          </a>
        </div>
      </div>

      {/* ── Large AAREN wordmark — fills the footer ── */}
      <div
        className="footer-wordmark"
        style={{
          fontFamily: "var(--font-jost), 'Jost', sans-serif",
          fontSize: "clamp(4.5rem, 14vw, 24rem)",
          fontWeight: 400,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "#81663F",
          opacity: 0.38,
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
      <div className="footer-bottom-row">
        <span style={{ fontSize: "1.1rem", color: "#8A8279", letterSpacing: "0.04em", fontWeight: 600 }}>
          {settings.copyrightText || "AAREN © 2026. All rights reserved."}
        </span>

        {/* Social media icons redirecting to official channels */}
        <div style={{ display: "flex", gap: "1.8rem", alignItems: "center" }}>
          {/* Instagram */}
          <a href={settings.socialLinks?.[0] || "https://www.instagram.com/aaren_intpro"} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="footer-social-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#81663F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>

          {/* Facebook */}
          <a href={settings.socialLinks?.[1] || "https://www.facebook.com/@aarenintproindia"} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="footer-social-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#81663F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
          </a>

          {/* LinkedIn */}
          <a href={settings.socialLinks?.[2] || "https://www.linkedin.com/company/aaren-intpro/"} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="footer-social-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#81663F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>

          {/* X (Twitter) */}
          <a href={settings.socialLinks?.[3] || "https://x.com/mustbeaaren"} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="footer-social-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#81663F">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </svg>
          </a>

          {/* YouTube */}
          <a href={settings.socialLinks?.[4] || "https://youtube.com/@aaren_intpro"} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="footer-social-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#81663F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
            </svg>
          </a>
        </div>

        {/* Right - Studio Tagline & Created By Attribution */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.25rem" }}>
          <span style={{ fontSize: "1.1rem", color: "#8A8279", letterSpacing: "0.02em", fontWeight: 600 }}>
            Creative Studio &amp; Material House
          </span>
          <span style={{ fontSize: "0.85rem", color: "#81663F", letterSpacing: "0.04em", fontWeight: 600, opacity: 0.9 }}>
            Created by Midas Touch Enterprises
          </span>
        </div>
      </div>
      </div>

      <style jsx>{`
        .footer-top-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem 2rem;
          padding-top: 5rem;
          padding-bottom: 3.5rem;
          border-bottom: 1px solid #D8D0BE;
        }
        @media (min-width: 768px) {
          .footer-top-row {
            grid-template-columns: 1fr 1fr;
            gap: 4rem 2rem;
            padding-top: 6rem;
            padding-bottom: 4rem;
          }
        }
        .footer-nav-link {
          font-size: 1.35rem;
          color: #5E5852;
          letter-spacing: -0.01em;
          text-decoration: none;
          transition: color 0.2s ease;
          font-weight: 500;
        }
        .footer-nav-link:hover {
          color: #81663F;
        }
        .footer-contact-block {
          text-align: left;
        }
        @media (min-width: 768px) {
          .footer-contact-block {
            text-align: right;
            margin-left: auto;
          }
        }
        .footer-bottom-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 2rem;
          padding-bottom: 2.4rem;
          border-top: 1px solid #D8D0BE;
          flex-wrap: wrap;
          gap: 1.6rem;
        }
        @media (max-width: 640px) {
          .footer-bottom-row {
            flex-direction: column;
            text-align: center;
            gap: 1.2rem;
          }
        }
      `}</style>
    </footer>
  );
}
