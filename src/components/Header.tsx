"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { subscribeToAuth, logoutUser } from "@/lib/firebaseAuth";
import { User } from "firebase/auth";
import { LogOut, User as UserIcon, Search, Menu, X, ArrowUpRight } from "lucide-react";
import GlobalSearchModal from "./GlobalSearchModal";

type NavLink = {
  label: string;
  href: string;
  badge?: string;
};

// Navigation Links for Mobile Drawer (Services and Showcase Projects removed as requested)
const ALL_NAV_LINKS: NavLink[] = [
  { label: "About Us", href: "/about" },
  { label: "Our Team", href: "/team" },
  { label: "Contact Us", href: "/contact" },
  { label: "Shop", href: "/shop" },
  { label: "Products", href: "/products" },
  { label: "Brands", href: "/brands" },
  { label: "Catalogs", href: "/catalogs" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog & Journal", href: "/blog" },
];

const DESKTOP_PRIMARY_LINKS: NavLink[] = [
  { label: "About Us", href: "/about" },
  { label: "Our Team", href: "/team" },
  { label: "Contact Us", href: "/contact" },
  { label: "Shop", href: "/shop" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const path = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Keyboard shortcut (Cmd+K / Ctrl+K) to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  /* Close menu on route change */
  useEffect(() => {
    setOpen(false);
    setShowProfileMenu(false);
    setShowSearch(false);
  }, [path]);

  /* Lock body scroll when menu open */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (path?.startsWith("/admin")) {
    return null;
  }

  const handleLogout = async () => {
    await logoutUser();
    setShowProfileMenu(false);
    router.push("/");
  };

  return (
    <>
      <GlobalSearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />

      {/* ── Fixed Header ── */}
      <header className="aaren-header">
        {/* Logo */}
        <Link
          href="/"
          className="aaren-header__logo"
          aria-label="Aaren Home Page"
        >
          AAREN
        </Link>

        {/* Desktop Nav Links (Hidden on Mobile) */}
        <nav className="aaren-header__desktop-nav">
          {DESKTOP_PRIMARY_LINKS.map((l) => {
            const isActive = path === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`aaren-header__nav-btn ${isActive ? "active" : ""}`}
              >
                {l.label}
              </Link>
            );
          })}

          {/* Search Trigger Button */}
          <button
            type="button"
            onClick={() => setShowSearch(true)}
            className="aaren-header__nav-btn search-icon-btn"
            aria-label="Search products, brands and projects"
            title="Search (Cmd+K / Ctrl+K)"
          >
            <Search size={14} />
          </button>

          {/* User Auth or Profile Button */}
          {user ? (
            <div style={{ position: "relative", display: "inline-block" }}>
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="aaren-header__nav-btn profile-btn"
              >
                <UserIcon size={13} />
                <span>{user.displayName?.split(" ")[0] || "Account"}</span>
              </button>

              {showProfileMenu && (
                <div className="aaren-header__profile-dropdown">
                  <div className="dropdown-user-info">
                    <p className="user-name">{user.displayName || "Member"}</p>
                    <p className="user-email">{user.email}</p>
                  </div>

                  <Link
                    href="/login"
                    onClick={() => setShowProfileMenu(false)}
                    className="dropdown-workspace-link"
                  >
                    <span>🏛️ Designer Workspace</span>
                    <ArrowUpRight size={14} />
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="dropdown-signout-btn"
                  >
                    <LogOut size={13} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/signup"
              className="aaren-header__nav-btn signup-btn"
            >
              Sign up
            </Link>
          )}
        </nav>

        {/* Mobile Controls (Visible ONLY on Mobile < 1024px) */}
        <div className="aaren-header__mobile-controls">
          {/* Mobile Search Button */}
          <button
            type="button"
            onClick={() => setShowSearch(true)}
            className="aaren-header__mobile-btn"
            aria-label="Search"
          >
            <Search size={16} />
          </button>

          {/* Mobile Full Menu Toggle Button */}
          <button
            type="button"
            className={`aaren-header__mobile-btn menu-toggle ${open ? "is-open" : ""}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? (
              <>
                <X size={16} />
                <span>CLOSE</span>
              </>
            ) : (
              <>
                <Menu size={16} />
                <span>MENU</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* ── Mobile Full-Screen Overlay Navigation (Guaranteed hidden on page open) ── */}
      <div
        className={`aaren-mobile-overlay ${open ? "is-active" : ""}`}
        ref={menuRef}
        style={{ display: open ? "block" : "none" }}
      >
        <div className="aaren-mobile-overlay__inner">
          <div className="aaren-mobile-overlay__header">
            <span className="overlay-meta">ALL SECTIONS & EXPLORER</span>
            <button
              onClick={() => setShowSearch(true)}
              className="overlay-search-bar-btn"
            >
              <Search size={14} />
              <span>Search materials, brands, projects...</span>
            </button>
          </div>

          <nav className="aaren-mobile-overlay__nav">
            {ALL_NAV_LINKS.map((l, idx) => {
              const isActive = path === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`overlay-nav-link ${isActive ? "active" : ""}`}
                  onClick={() => setOpen(false)}
                  style={{
                    animationDelay: `${0.04 * (idx + 1)}s`,
                  }}
                >
                  <span className="link-num">0{idx + 1}</span>
                  <span className="link-text">{l.label}</span>
                  <ArrowUpRight size={18} className="link-arrow" />
                </Link>
              );
            })}
          </nav>

          {/* User Auth & Workspace Section on Mobile */}
          <div className="aaren-mobile-overlay__footer">
            {user ? (
              <div className="overlay-user-card">
                <div className="overlay-user-details">
                  <span className="user-label">Signed in as:</span>
                  <strong className="user-name">{user.displayName || user.email}</strong>
                </div>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="overlay-workspace-btn"
                >
                  <span>🏛️ Launch Designer Workspace</span>
                  <ArrowUpRight size={16} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="overlay-signout-btn"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            ) : (
              <div className="overlay-auth-buttons">
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="overlay-signup-btn"
                >
                  Sign Up / Register
                </Link>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="overlay-login-btn"
                >
                  Sign In
                </Link>
              </div>
            )}

            <div className="overlay-contact-info">
              <p>Direct Inquiries: <a href="tel:+918884464444">+91 88844 64444</a></p>
              <p>Email: <a href="mailto:info@aarenintpro.com">info@aarenintpro.com</a></p>
              <span className="overlay-copyright">AAREN INTPRO © {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Scoped Header & Mobile Menu Styles ── */}
      <style jsx global>{`
        .aaren-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          box-sizing: border-box;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.2rem 1.6rem;
          background: rgba(10, 12, 16, 0.35);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.3s ease;
        }

        @media (min-width: 1024px) {
          .aaren-header {
            padding: 1.2rem 2.8rem;
          }
        }

        .aaren-header__logo {
          font-family: var(--font-jost), 'Jost', sans-serif;
          font-weight: 500;
          font-size: 1.4rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #ffffff;
          text-decoration: none;
          display: flex;
          align-items: center;
          transition: opacity 0.2s ease;
        }

        .aaren-header__logo:hover {
          opacity: 0.85;
        }

        /* Desktop Nav: Hidden on mobile screens < 1024px */
        .aaren-header__desktop-nav {
          display: none;
          align-items: center;
          gap: 0.5rem;
          margin-left: auto;
        }

        @media (min-width: 1024px) {
          .aaren-header__desktop-nav {
            display: flex;
          }
        }

        .aaren-header__nav-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1.4rem;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #f1f5f9;
          font-size: 1.1rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
          white-space: nowrap;
          vertical-align: middle;
          line-height: 1;
        }

        .aaren-header__nav-btn:hover {
          background: rgba(255, 255, 255, 0.18);
          border-color: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }

        .aaren-header__nav-btn.active {
          background: rgba(212, 175, 55, 0.22);
          border-color: rgba(212, 175, 55, 0.6);
          color: #fce8a5;
        }

        .aaren-header__nav-btn.search-icon-btn {
          padding: 0.75rem 1.1rem;
        }

        .aaren-header__nav-btn.profile-btn {
          background: #80673f;
          border-color: #9e8254;
          color: #ffffff;
        }

        .aaren-header__nav-btn.signup-btn {
          background: #81663F;
          border-color: #81663F;
          color: #ffffff;
        }

        .aaren-header__nav-btn.signup-btn:hover {
          background: #96774a;
        }

        /* Profile Dropdown Menu */
        .aaren-header__profile-dropdown {
          position: absolute;
          right: 0;
          top: 100%;
          margin-top: 0.8rem;
          background: #18191c;
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 1.2rem;
          border-radius: 0.8rem;
          min-width: 22rem;
          box-shadow: 0 1.2rem 3.5rem rgba(0, 0, 0, 0.5);
          z-index: 9999;
        }

        .dropdown-user-info {
          padding-bottom: 0.8rem;
          margin-bottom: 0.8rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .dropdown-user-info .user-name {
          color: #ffffff;
          font-size: 1.2rem;
          font-weight: 700;
          margin: 0;
        }

        .dropdown-user-info .user-email {
          color: #94a3b8;
          font-size: 1rem;
          margin: 0.2rem 0 0;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dropdown-workspace-link {
          width: 100%;
          background: #80673f;
          color: #ffffff;
          border: none;
          padding: 0.8rem 1.2rem;
          border-radius: 0.5rem;
          font-size: 1.1rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-transform: uppercase;
          margin-bottom: 0.6rem;
          text-decoration: none;
          box-sizing: border-box;
        }

        .dropdown-signout-btn {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          color: #e2e8f0;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.8rem 1.2rem;
          border-radius: 0.5rem;
          font-size: 1.1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          cursor: pointer;
        }

        /* Mobile Controls: Visible ONLY on screens < 1024px */
        .aaren-header__mobile-controls {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        @media (min-width: 1024px) {
          .aaren-header__mobile-controls {
            display: none !important;
          }
        }

        .aaren-header__mobile-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.7rem 1.2rem;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: #ffffff;
          font-size: 1.15rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 0.2s ease;
        }

        .aaren-header__mobile-btn.menu-toggle.is-open {
          background: #81663F;
          border-color: #81663F;
          color: #ffffff;
        }

        /* ── Fullscreen Mobile Navigation Drawer ── */
        .aaren-mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          height: 100dvh;
          background: #0d0f12;
          z-index: 9999;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          transform: translateY(-100%);
          opacity: 0;
          pointer-events: none;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
        }

        .aaren-mobile-overlay.is-active {
          transform: translateY(0);
          opacity: 1;
          pointer-events: auto;
        }

        .aaren-mobile-overlay__inner {
          padding: 8.5rem 2rem 4rem;
          max-width: 600px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .aaren-mobile-overlay__header {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 1.8rem;
        }

        .overlay-meta {
          font-size: 1.05rem;
          font-weight: 800;
          letter-spacing: 0.15em;
          color: #81663F;
          text-transform: uppercase;
        }

        .overlay-search-bar-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          padding: 1.2rem 1.4rem;
          color: #94a3b8;
          font-size: 1.25rem;
          cursor: pointer;
          text-align: left;
          transition: background 0.2s ease;
        }

        .overlay-search-bar-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .aaren-mobile-overlay__nav {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .overlay-nav-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.4rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          color: #e2e8f0;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .overlay-nav-link:hover,
        .overlay-nav-link.active {
          color: #d4af37;
          background: rgba(212, 175, 55, 0.05);
          padding-left: 1.6rem;
        }

        .overlay-nav-link .link-num {
          font-size: 1.1rem;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.3);
          font-family: monospace;
          margin-right: 1.4rem;
        }

        .overlay-nav-link .link-text {
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          flex: 1;
        }

        .overlay-nav-link .link-arrow {
          color: rgba(255, 255, 255, 0.3);
          transition: transform 0.2s ease, color 0.2s ease;
        }

        .overlay-nav-link:hover .link-arrow {
          color: #d4af37;
          transform: translate(2px, -2px);
        }

        .aaren-mobile-overlay__footer {
          margin-top: 1.5rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .overlay-auth-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .overlay-signup-btn {
          background: #81663F;
          color: #ffffff;
          padding: 1.2rem;
          border-radius: 8px;
          font-size: 1.25rem;
          font-weight: 700;
          text-align: center;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .overlay-login-btn {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #f1f5f9;
          padding: 1.2rem;
          border-radius: 8px;
          font-size: 1.25rem;
          font-weight: 700;
          text-align: center;
          text-decoration: none;
          text-transform: uppercase;
        }

        .overlay-user-card {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1.6rem;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .overlay-user-details .user-label {
          display: block;
          font-size: 1.05rem;
          color: #94a3b8;
          margin-bottom: 0.2rem;
        }

        .overlay-user-details .user-name {
          font-size: 1.4rem;
          color: #ffffff;
        }

        .overlay-workspace-btn {
          background: #80673f;
          color: #ffffff;
          padding: 1rem 1.4rem;
          border-radius: 6px;
          font-size: 1.2rem;
          font-weight: 700;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-transform: uppercase;
        }

        .overlay-signout-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ef4444;
          padding: 0.9rem;
          border-radius: 6px;
          font-size: 1.15rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          cursor: pointer;
        }

        .overlay-contact-info {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          font-size: 1.2rem;
          color: #94a3b8;
        }

        .overlay-contact-info a {
          color: #d4af37;
          text-decoration: none;
        }

        .overlay-copyright {
          margin-top: 0.8rem;
          font-size: 1.05rem;
          color: rgba(255, 255, 255, 0.3);
          letter-spacing: 0.05em;
        }
      `}</style>
    </>
  );
}
