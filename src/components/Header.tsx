"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const NAV_LINKS = [
  { label: "Work", href: "/work" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      {/* ─── Main Header Bar ─── */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 28px",
          mixBlendMode: "difference",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontSize: "15px",
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "#ffffff",
          }}
        >
          AAREN.
        </Link>

        {/* Desktop Nav */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "28px",
          }}
          className="hidden md:flex"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-underline"
              style={{
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "#ffffff",
                opacity: pathname === link.href ? 1 : 0.7,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = pathname === link.href ? "1" : "0.7")}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/careers"
            style={{
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "#ffffff",
              opacity: 0.7,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
            className="link-underline"
          >
            Join Our Team
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden"
          style={{
            background: "none",
            border: "none",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: 0,
          }}
          aria-label="Toggle menu"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </header>

      {/* ─── Fullscreen Mobile Menu ─── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              background: "#0a0a0a",
              zIndex: 999,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "100px 28px 40px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {[...NAV_LINKS, { label: "Join Our Team", href: "/careers" }, { label: "Blog", href: "/blog" }].map(
                (link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      style={{
                        display: "block",
                        fontSize: "clamp(2.5rem, 10vw, 6rem)",
                        fontWeight: 700,
                        lineHeight: 1.05,
                        letterSpacing: "-0.02em",
                        color: pathname === link.href ? "#ffffff" : "rgba(255,255,255,0.35)",
                        transition: "color 0.2s",
                        textTransform: "uppercase",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = pathname === link.href ? "#ffffff" : "rgba(255,255,255,0.35)")}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                )
              )}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                position: "absolute",
                bottom: "32px",
                left: "28px",
                right: "28px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}>
                © {new Date().getFullYear()} AAREN CREATIVE STUDIO
              </p>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em" }}
                className="link-underline"
              >
                Instagram
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
