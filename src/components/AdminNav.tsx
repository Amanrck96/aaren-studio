"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("aaren_sidebar_open");
    if (saved !== null) {
      setIsOpen(saved === "true");
    }
  }, []);

  const toggleSidebar = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    localStorage.setItem("aaren_sidebar_open", nextState ? "true" : "false");
  };

  const navItems = [
    { label: "📊 Dashboard", href: "/admin/dashboard" },
    { label: "📄 Page Builder", href: "/admin/pages" },
    { label: "🏠 Hero Section", href: "/admin/hero" },
    { label: "🛠️ Services", href: "/admin/services" },
    { label: "🏷️ Categories", href: "/admin/categories" },
    { label: "🗃️ Collections / Groups", href: "/admin/collections" },
    { label: "🏢 Brands", href: "/admin/brands" },
    { label: "🖼️ Showcase Projects", href: "/admin/projects" },
    { label: "📦 Products", href: "/admin/products" },
    { label: "❓ FAQ Management", href: "/admin/faq" },
    { label: "💬 Testimonials", href: "/admin/testimonials" },
    { label: "✍️ Blogs", href: "/admin/blogs" },
    { label: "⏱️ Designer Time & Activity Audit", href: "/admin/analytics" },
    { label: "🚀 Launch Designer OS (Programa)", href: "/workspace" },
    { label: "📁 Media Library", href: "/admin/media" },
    { label: "🗂️ Dropdowns", href: "/admin/dropdowns" },
    { label: "ℹ️ About & Roadmap", href: "/admin/about" },
    { label: "👥 Team", href: "/admin/team" },
    { label: "📞 Contact & Footer", href: "/admin/contact" },
    { label: "📥 Inquiries & Leads", href: "/admin/inquiries" },
  ];

  if (!mounted) return null;

  return (
    <>
      {/* Floating Re-Open Button when Sidebar is Collapsed */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            top: "16px",
            left: "16px",
            zIndex: 9999,
            background: "linear-gradient(135deg, #81663F 0%, #684F2E 100%)",
            color: "#ffffff",
            border: "none",
            borderRadius: "10px",
            padding: "0.8rem 1.4rem",
            fontWeight: 800,
            fontSize: "1.05rem",
            cursor: "pointer",
            boxShadow: "0 6px 20px rgba(129, 102, 63, 0.35)",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            transition: "all 0.2s ease-in-out",
          }}
        >
          ☰ Show Menu
        </button>
      )}

      {/* Sidebar Container — Main Website Warm Sand / Linen Background */}
      <aside
        style={{
          width: "300px",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          background: "#FAF8F5",
          borderRight: "1px solid #DCD5C6",
          display: "flex",
          flexDirection: "column",
          padding: "1.2rem 1rem",
          zIndex: 1000,
          boxShadow: "4px 0 25px rgba(0,0,0,0.06)",
          transform: isOpen ? "translateX(0)" : "translateX(-300px)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Brand Header */}
        <div style={{ flexShrink: 0, marginBottom: "1rem", padding: "0 0.4rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "1.35rem", fontWeight: 900, color: "#81663F", letterSpacing: "0.12em" }}>
              AAREN CMS
            </span>
            <button
              onClick={toggleSidebar}
              title="Hide Sidebar Menu"
              style={{
                background: "#EAE4D8",
                color: "#1E1E1E",
                border: "1px solid #D5CEBF",
                borderRadius: "8px",
                padding: "0.3rem 0.7rem",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: 800,
              }}
            >
              ✕ Hide
            </button>
          </div>
          <div style={{ color: "#6A6359", fontSize: "0.85rem", marginTop: "0.2rem", fontWeight: 600 }}>Luxury Control Center</div>
        </div>

        {/* Scrollable Nav List filling entire height */}
        <nav
          className="admin-sidebar-nav"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
            overflowY: "auto",
            paddingRight: "0.4rem",
            scrollbarWidth: "thin",
            scrollbarColor: "#81663F #EAE4D8",
          }}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0.65rem 0.9rem",
                  borderRadius: "8px",
                  fontSize: "0.95rem",
                  fontWeight: isActive ? 800 : 600,
                  textDecoration: "none",
                  color: isActive ? "#81663F" : "#3D3730",
                  background: isActive ? "linear-gradient(90deg, rgba(129, 102, 63, 0.15) 0%, rgba(129, 102, 63, 0.04) 100%)" : "transparent",
                  borderLeft: isActive ? "4px solid #81663F" : "4px solid transparent",
                  transition: "all 0.15s ease-in-out",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer / User Controls */}
        <div style={{ flexShrink: 0, borderTop: "1px solid #DCD5C6", paddingTop: "0.8rem", marginTop: "0.8rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <Link
            href="/"
            target="_blank"
            style={{
              fontSize: "0.95rem",
              color: "#81663F",
              textDecoration: "none",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.3rem 0.4rem",
            }}
          >
            🌐 View Live Site ↗
          </Link>

          <button
            onClick={() => {
              document.cookie = "aaren_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
              localStorage.removeItem("aaren_admin_session");
              window.location.href = "/admin/login";
            }}
            style={{
              width: "100%",
              padding: "0.65rem",
              background: "#FEE2E2",
              color: "#DC2626",
              border: "1px solid #FCA5A5",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: 800,
              transition: "all 0.2s",
            }}
          >
            🔒 Logout
          </button>
        </div>
      </aside>

      {/* Scoped CSS for Admin Sidebar */}
      <style jsx>{`
        .admin-sidebar-nav::-webkit-scrollbar {
          width: 6px;
        }
        .admin-sidebar-nav::-webkit-scrollbar-track {
          background: #EAE4D8;
          border-radius: 4px;
        }
        .admin-sidebar-nav::-webkit-scrollbar-thumb {
          background: #81663F;
          border-radius: 4px;
        }
        :global(main.admin-main-content) {
          margin-left: ${isOpen ? "300px" : "0px"} !important;
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          min-height: 100vh;
          box-sizing: border-box;
          background-color: #FAF8F5 !important;
          color: #1E1E1E !important;
        }
      `}</style>
    </>
  );
}
