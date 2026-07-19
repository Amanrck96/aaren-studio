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
      <div className="footer-wordmark" style={{ paddingTop: "4rem", paddingBottom: "2rem" }}>
        <svg
          viewBox="0 0 1200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          aria-label="AAREN"
          role="img"
          style={{ width: "100%", height: "auto" }}
        >
          {/* A */}
          <text
            x="0"
            y="190"
            fontFamily="var(--font-geist), Helvetica, Arial, sans-serif"
            fontSize="200"
            fontWeight="700"
            letterSpacing="-15"
            fill="rgba(0,0,0,0.08)"
          >
            AAREN
          </text>
        </svg>
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
          gap: "0.8rem",
        }}
      >
        <span style={{ fontSize: "1.1rem", color: "rgba(0,0,0,0.3)", letterSpacing: "0.04em" }}>
          AAREN.© {new Date().getFullYear()}
        </span>
        <span style={{ fontSize: "1.1rem", color: "rgba(0,0,0,0.3)", letterSpacing: "0.01em" }}>
          Creative Studio &amp; Material House — Mumbai
        </span>
      </div>
    </footer>
  );
}
