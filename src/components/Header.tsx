"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

/* Exact replica of Sturdy.co nav links */
const LINKS = [
  { label: "Work",         href: "/work" },
  { label: "Products",     href: "/products" },
  { label: "Instagram",    href: "https://www.instagram.com", ext: true },
  { label: "Contact",      href: "/contact" },
  { label: "Join Our Team",href: "/careers" },
];

const MOBILE_LINKS = [
  { label: "Work",         href: "/work" },
  { label: "Products",     href: "/products" },
  { label: "About",        href: "/about" },
  { label: "Services",     href: "/services" },
  { label: "Contact",      href: "/contact" },
  { label: "Blog",         href: "/blog" },
  { label: "Careers",      href: "/careers" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const linkStyle = {
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: ".06em",
    textTransform: "uppercase" as const,
    color: "#fff",
    opacity: .75,
    transition: "opacity .2s",
  };

  return (
    <>
      {/* ── Fixed Header Bar ── */}
      <header style={{
        position: "fixed", top: 0, left: 0, width: "100%",
        zIndex: 1000, display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 24px",
        mixBlendMode: "difference",
      }}>
        {/* Logo */}
        <Link href="/" style={{ fontSize: "13px", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "#fff" }}>
          AAREN.
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex" style={{ display: "flex", alignItems: "center", gap: "26px" }}>
          {LINKS.map(l => (
            <a
              key={l.href}
              href={l.href}
              target={l.ext ? "_blank" : undefined}
              rel={l.ext ? "noopener noreferrer" : undefined}
              className="ul-link"
              style={{ ...linkStyle, opacity: path === l.href ? 1 : .65 }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={e => (e.currentTarget.style.opacity = path === l.href ? "1" : ".65")}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden"
          style={{ fontSize: "12px", fontWeight: 500, letterSpacing: ".06em", textTransform: "uppercase", color: "#fff" }}
          aria-label="Toggle menu"
        >
          {open ? "Close" : "Menu"}
        </button>
      </header>

      {/* ── Full-screen mobile menu ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: .35 }}
            style={{ position: "fixed", inset: 0, background: "#000", zIndex: 999,
              display: "flex", flexDirection: "column", justifyContent: "center",
              padding: "100px 24px 40px" }}
          >
            <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {MOBILE_LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * .06, duration: .45, ease: [.25,.46,.45,.94] }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    style={{
                      display: "block",
                      fontSize: "clamp(2.2rem,9vw,5.5rem)",
                      fontWeight: 700,
                      letterSpacing: "-.025em",
                      lineHeight: 1.05,
                      color: path === l.href ? "#fff" : "rgba(255,255,255,.25)",
                      textTransform: "uppercase",
                      transition: "color .15s",
                      borderTop: "1px solid rgba(255,255,255,.08)",
                      paddingTop: "8px",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = path === l.href ? "#fff" : "rgba(255,255,255,.25)")}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .55 }}
              style={{ position: "absolute", bottom: "28px", left: "24px", right: "24px",
                display: "flex", justifyContent: "space-between" }}
            >
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,.25)", letterSpacing: ".05em" }}>
                AAREN.© {new Date().getFullYear()}
              </span>
              <a
                href="https://www.instagram.com"
                target="_blank" rel="noopener noreferrer"
                className="ul-link"
                style={{ fontSize: "11px", color: "rgba(255,255,255,.45)", letterSpacing: ".05em" }}
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
