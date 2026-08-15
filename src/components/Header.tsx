"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { subscribeToAuth, logoutUser } from "@/lib/firebaseAuth";
import { User } from "firebase/auth";
import { LogOut, User as UserIcon } from "lucide-react";

type NavLink = {
  label: string;
  href: string;
  ext?: boolean;
};

const BASE_NAV_LINKS: NavLink[] = [
  { label: "About us", href: "/about" },
  { label: "Our team", href: "/team" },
  { label: "Contact us", href: "/contact" },
  { label: "Shop", href: "/shop" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const path = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  /* Close menu on route change */
  useEffect(() => {
    setOpen(false);
    setShowProfileMenu(false);
  }, [path]);

  if (path?.startsWith("/admin")) {
    return null;
  }

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

  const handleLogout = async () => {
    await logoutUser();
    setShowProfileMenu(false);
    router.push("/");
  };

  const desktopNavLinks: NavLink[] = user
    ? BASE_NAV_LINKS
    : [...BASE_NAV_LINKS, { label: "Sign up", href: "/signup" }];

  const mobileNavLinks: NavLink[] = user
    ? [...BASE_NAV_LINKS]
    : [...BASE_NAV_LINKS, { label: "Sign up", href: "/signup" }];

  return (
    <>
      {/* Fixed Header */}
      <header className="site-header">
        {/* Logo */}
        <Link
          href="/"
          className="site-header__logo"
          aria-label="Aaren Home Page"
          style={{
            color: path === "/" ? "#ffffff" : "#333333",
            fontFamily: "var(--font-jost), 'Jost', sans-serif",
            mixBlendMode: "normal",
            fontWeight: 400,
            fontSize: "1.4rem",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            transition: "color 0.25s ease",
            textDecoration: "none",
          }}
        >
          AAREN
        </Link>

        {/* Desktop nav */}
        <nav className="site-header__nav">
          {desktopNavLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="btn btn--primary btn--blur"
              style={{
                fontSize: "1.2rem",
                color: "#eaeef4",
                opacity: path === l.href ? 1 : 0.85,
              }}
            >
              {l.label}
            </Link>
          ))}

          {/* User Profile Pill when logged in */}
          {user && (
            <div style={{ position: "relative", display: "inline-block" }}>
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="btn btn--primary btn--blur"
                style={{
                  fontSize: "1.2rem",
                  color: "#ffffff",
                  background: "#80673f",
                  border: "1px solid #9e8254",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  cursor: "pointer",
                }}
              >
                <UserIcon size={13} />
                <span>{user.displayName?.split(" ")[0] || "Account"}</span>
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "100%",
                    marginTop: "0.8rem",
                    background: "#1e1b16",
                    border: "1px solid #332d25",
                    padding: "1.2rem",
                    borderRadius: "0.8rem",
                    minWidth: "20rem",
                    boxShadow: "0 1rem 2.5rem rgba(0,0,0,0.4)",
                    zIndex: 999,
                  }}
                >
                  <div style={{ paddingBottom: "0.8rem", marginBottom: "0.8rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    <p style={{ color: "#ffffff", fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>
                      {user.displayName || "Member"}
                    </p>
                    <p style={{ color: "#a1988a", fontSize: "1rem", margin: 0, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {user.email}
                    </p>
                  </div>

                  {/* Direct Link to Designer Workspace */}
                  <Link
                    href="/workspace"
                    onClick={() => setShowProfileMenu(false)}
                    style={{
                      width: "100%",
                      background: "#80673f",
                      color: "#ffffff",
                      border: "none",
                      padding: "0.8rem 1.2rem",
                      borderRadius: "0.4rem",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.6rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "0.6rem",
                      textDecoration: "none",
                      boxSizing: "border-box",
                    }}
                  >
                    <span>🏛️ Designer Workspace</span>
                    <span>↗</span>
                  </Link>

                  {/* Direct Link to Admin Dashboard */}
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setShowProfileMenu(false)}
                    style={{
                      width: "100%",
                      background: "#24201a",
                      color: "#e2c99f",
                      border: "1px solid #4a3e2c",
                      padding: "0.8rem 1.2rem",
                      borderRadius: "0.4rem",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.6rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "0.6rem",
                      textDecoration: "none",
                      boxSizing: "border-box",
                    }}
                  >
                    <span>📊 Admin Dashboard</span>
                    <span>↗</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      background: "#332a1e",
                      color: "#e8c389",
                      border: "none",
                      padding: "0.8rem 1.2rem",
                      borderRadius: "0.4rem",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    <LogOut size={12} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile hamburger */}
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

      {/* Mobile full-screen menu */}
      <div ref={menuRef} className="mobile-menu" aria-hidden={!open}>
        <nav>
          {mobileNavLinks.map((l, i) => (
            <div
              key={l.href}
              style={{
                transitionDelay: open ? `${i * 0.06}s` : "0s",
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(2rem)",
                transition: "opacity 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              <Link
                href={l.href}
                className={`mobile-menu__link${path === l.href ? " is-active" : ""}`}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            </div>
          ))}

          {user && (
            <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <Link
                href="/workspace"
                onClick={() => setOpen(false)}
                className="btn btn--primary"
                style={{ background: "#80673f", color: "#fff", border: "none", padding: "1.2rem 2.4rem", cursor: "pointer", fontWeight: 700, textAlign: "center", textDecoration: "none" }}
              >
                🏛️ DESIGNER WORKSPACE (PROGRAMA OS) ↗
              </Link>
              <Link
                href="/admin/dashboard"
                onClick={() => setOpen(false)}
                className="btn btn--primary"
                style={{ background: "#24201a", color: "#e2c99f", border: "1px solid #4a3e2c", padding: "1.2rem 2.4rem", cursor: "pointer", fontWeight: 700, textAlign: "center", textDecoration: "none" }}
              >
                📊 ADMIN DASHBOARD ↗
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn--primary"
                style={{ background: "#332a1e", color: "#e8c389", border: "none", padding: "1.2rem 2.4rem", cursor: "pointer", fontWeight: 700 }}
              >
                SIGN OUT ({user.displayName?.split(" ")[0]})
              </button>
            </div>
          )}
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
            href="mailto:info@aarenintpro.com"
            style={{ fontSize: "1.1rem", color: "rgba(234,238,244,0.5)", letterSpacing: "0.03em" }}
          >
            info@aarenintpro.com
          </a>
        </div>
      </div>
    </>
  );
}
