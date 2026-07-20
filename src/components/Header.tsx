"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = {
  label: string;
  href: string;
  ext?: boolean;
};

const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/about" },
  { label: "Our team", href: "/team" },
  { label: "Contact us", href: "/contact" },
  { label: "Shop", href: "/shop" },
  { label: "Sign up", href: "/signup" },
];

const MOBILE_LINKS: NavLink[] = NAV_LINKS;

export default function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  /* Close on route change */
  useEffect(() => {
    setOpen(false);
  }, [path]);

  /* Lock body scroll when menu open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* Slide menu in/out */
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    if (open) {
      menu.classList.add("is-open");
    } else {
      menu.classList.remove("is-open");
    }
  }, [open]);

  return (
    <>
      {/* ══ Fixed Header ══ */}
      <header className="site-header">
        {/* Logo & Dynamic High-Contrast Home Button */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
          <Link href="/" className="site-header__logo">
            AAREN
          </Link>
          {path !== "/" && (
            <Link
              href="/"
              className="header-home-btn"
              style={{
                fontSize: "1.1rem",
                color: "#ffffff",
                padding: "0.6rem 1.4rem",
                borderRadius: "2.4rem",
                textDecoration: "none",
                fontWeight: 700,
                letterSpacing: "0.06em",
                background: "#000000",
                border: "0.1rem solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 0.4rem 1.4rem rgba(0,0,0,0.3)",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "transform 0.2s ease, background 0.2s ease",
                zIndex: 1001,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
                (e.currentTarget as HTMLElement).style.background = "#1a1a1a";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLElement).style.background = "#000000";
              }}
            >
              <span>←</span>
              <span>HOME</span>
            </Link>
          )}
        </div>

        {/* Desktop nav — pill blur buttons */}
        <nav className="site-header__nav">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target={l.ext ? "_blank" : undefined}
              rel={l.ext ? "noopener noreferrer" : undefined}
              className="btn btn--primary btn--blur"
              style={{
                fontSize: "1.2rem",
                color: "#eaeef4",
                opacity: path === l.href ? 1 : 0.85,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = path === l.href ? "1" : "0.85";
              }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Mobile hamburger — MENU pill button */}
        <button
          className="site-header__menu-btn btn btn--primary btn--blur"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          style={{ fontSize: "1.2rem", color: "#eaeef4" }}
        >
          {open ? "CLOSE" : "MENU"}
        </button>
      </header>

      {/* ══ Mobile full-screen menu — slides up from bottom ══ */}
      <div ref={menuRef} className="mobile-menu" aria-hidden={!open}>
        <nav>
          {MOBILE_LINKS.map((l, i) => (
            <div
              key={l.href}
              style={{
                transitionDelay: open ? `${i * 0.06}s` : "0s",
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(2rem)",
                transition: "opacity 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              {l.ext ? (
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mobile-menu__link${path === l.href ? " is-active" : ""}`}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  href={l.href}
                  className={`mobile-menu__link${path === l.href ? " is-active" : ""}`}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "4rem",
            paddingTop: "1.6rem",
            borderTop: "0.1rem solid rgba(255,255,255,0.1)",
            opacity: open ? 1 : 0,
            transition: "opacity 0.4s ease 0.35s",
          }}
        >
          <span style={{ fontSize: "1.1rem", color: "rgba(234,238,244,0.3)", letterSpacing: "0.05em" }}>
            AAREN.© {new Date().getFullYear()}
          </span>
          <a
            href="mailto:hello@aarenstudio.com"
            style={{ fontSize: "1.1rem", color: "rgba(234,238,244,0.5)", letterSpacing: "0.03em" }}
          >
            hello@aarenstudio.com
          </a>
        </div>
      </div>
    </>
  );
}
