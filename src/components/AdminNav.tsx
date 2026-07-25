"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "📊 Dashboard", href: "/admin/dashboard" },
    { label: "🏠 Hero Section", href: "/admin/hero" },
    { label: "🏷️ Categories", href: "/admin/categories" },
    { label: "🏢 Brands", href: "/admin/brands" },
    { label: "🖼️ Showcase Projects", href: "/admin/projects" },
    { label: "📦 Products", href: "/admin/products" },
    { label: "ℹ️ About & Roadmap", href: "/admin/about" },
    { label: "👥 Team", href: "/admin/team" },
    { label: "📞 Contact & Footer", href: "/admin/contact" },
    { label: "📥 Inquiries & Leads", href: "/admin/inquiries" },
  ];

  return (
    <div style={{ background: "#111116", borderBottom: "1px solid #222", padding: "0.8rem 2rem" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#fff", letterSpacing: "0.05em" }}>AAREN ADMIN</span>
          <span style={{ fontSize: "0.75rem", background: "#3b82f6", color: "#fff", padding: "0.2rem 0.6rem", borderRadius: "4px", fontWeight: 700 }}>LIVE SYNC</span>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", padding: "0.2rem 0" }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: "0.5rem 0.9rem",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  fontWeight: isActive ? 700 : 500,
                  textDecoration: "none",
                  color: isActive ? "#fff" : "#888",
                  background: isActive ? "#222" : "transparent",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/" target="_blank" style={{ fontSize: "0.85rem", color: "#60a5fa", textDecoration: "none", fontWeight: 600 }}>
            View Live Site ↗
          </Link>

          <button
            onClick={() => {
              document.cookie = "aaren_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
              localStorage.removeItem("aaren_admin_session");
              window.location.href = "/admin/login";
            }}
            style={{
              padding: "0.4rem 0.8rem",
              background: "rgba(239, 68, 68, 0.2)",
              color: "#f87171",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: 700,
            }}
          >
            🔒 Logout
          </button>
        </div>
      </div>
    </div>
  );
}
