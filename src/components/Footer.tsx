"use client";
import Link from "next/link";

const NAV_LINKS = [
  { label: "All Projects", href: "/work" },
  { label: "Brands",       href: "/brands" },
  { label: "Products",     href: "/products" },
  { label: "Instagram",    href: "https://www.instagram.com/aaren.studio/", ext: true },
  { label: "Privacy Policy", href: "#" },
];

export default function Footer() {
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
        {/* Left — navigation links */}
        <nav>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                {l.ext ? (
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ul-link"
                    style={{ fontSize: "1.4rem", color: "rgba(0,0,0,0.5)", letterSpacing: "-0.01em" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#000"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(0,0,0,0.5)"; }}
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link
                    href={l.href}
                    className="ul-link"
                    style={{ fontSize: "1.4rem", color: "rgba(0,0,0,0.5)", letterSpacing: "-0.01em" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#000"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(0,0,0,0.5)"; }}
                  >
                    {l.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Right — contact */}
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(0,0,0,0.35)", marginBottom: "0.8rem" }}>
            Contact
          </p>
          <a
            href="mailto:hello@aarenstudio.com"
            className="ul-link"
            style={{ fontSize: "1.4rem", color: "#000", letterSpacing: "-0.01em", display: "block", marginBottom: "0.4rem" }}
          >
            hello@aarenstudio.com
          </a>
          <p style={{ fontSize: "1.2rem", color: "rgba(0,0,0,0.4)", lineHeight: 1.5 }}>
            Mumbai, India
          </p>
        </div>
      </div>

      {/* ── Large AAREN wordmark — fills the footer ── */}
      <div
        className="footer-wordmark"
        style={{
          fontFamily: "var(--font-jost), sans-serif",
          fontSize: "clamp(6rem, 18vw, 35rem)",
          fontWeight: 800,
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
        <span style={{ fontSize: "1.1rem", color: "rgba(0,0,0,0.3)", letterSpacing: "0.04em" }}>
          AAREN.© {new Date().getFullYear()}
        </span>

        {/* Social media icons redirecting to official channels */}
        <div style={{ display: "flex", gap: "1.8rem", alignItems: "center" }}>
          <a href="https://www.instagram.com/aaren_intpro/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="footer-social-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a href="https://www.facebook.com/aarenintpro/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="footer-social-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
          </a>
          <a href="https://www.linkedin.com/company/aaren-intpro/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="footer-social-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
          <a href="https://www.youtube.com/@aarenintpro" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="footer-social-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
            </svg>
          </a>
        </div>

        <span style={{ fontSize: "1.1rem", color: "rgba(0,0,0,0.3)", letterSpacing: "0.01em" }}>
          Creative Studio &amp; Material House — Mumbai
        </span>
      </div>
    </footer>
  );
}
