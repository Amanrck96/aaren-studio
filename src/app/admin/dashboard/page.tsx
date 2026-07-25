"use client";

import Link from "next/link";
import AdminNav from "@/components/AdminNav";

export default function AdminDashboardPage() {
  const modules = [
    { title: "🏠 Homepage Hero Section", desc: "Header text, tagline, subtext, background MP4 video URL, category tags bar.", href: "/admin/hero", color: "#3b82f6" },
    { title: "🏷️ Category Management", desc: "Manage categories with cover images, descriptions, short codes (DS 06), sequence numbers.", href: "/admin/categories", color: "#10b981" },
    { title: "🏢 Brand Management", desc: "Manage brands, logo & banner uploads, descriptions, short codes (SF 01), sequence, PDF catalogs.", href: "/admin/brands", color: "#8b5cf6" },
    { title: "🖼️ Showcase Projects", desc: "Manage homepage showcase projects, project codes (OB 01), main images, sequence numbers.", href: "/admin/projects", color: "#f59e0b" },
    { title: "📦 Product Catalog & Import", desc: "Upload Excel product list (.xlsx), edit product details, finishes, dimensions, middle gallery photos.", href: "/admin/products", color: "#ec4899" },
    { title: "ℹ️ About Us & Timeline", desc: "Edit Mission, Vision, Values, and vertical roadmap timeline steps (01, 02, 03...).", href: "/admin/about", color: "#14b8a6" },
    { title: "👥 Team Members", desc: "Manage team member photos, designations, member codes (MM 01), bios, socials.", href: "/admin/team", color: "#6366f1" },
    { title: "📞 Contact & Footer Settings", desc: "Primary email, phone, address, map embed, footer links, social icons, Google Sheet Webhook URL.", href: "/admin/contact", color: "#f43f5e" },
    { title: "📥 Inquiries & PDF Leads", desc: "View form leads & catalog PDF downloads, export to CSV/Excel, trigger Google Sheets sync.", href: "/admin/inquiries", color: "#84cc16" },
  ];

  return (
    <div style={{ background: "#0a0a0c", color: "#f0f0f2", minHeight: "100vh" }}>
      <AdminNav />

      <div style={{ maxWidth: "1200px", margin: "3rem auto", padding: "0 2rem" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <span style={{ color: "#888", fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>MASTER CONTROL CENTER</span>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, margin: "0.4rem 0" }}>Aaren Studio Master Admin</h1>
          <p style={{ color: "#aaa", fontSize: "1rem" }}>Code-free website management. All edits saved here update the live website immediately.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem" }}>
          {modules.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              style={{
                background: "#141418",
                border: "1px solid #222",
                borderRadius: "12px",
                padding: "1.8rem",
                textDecoration: "none",
                color: "#fff",
                transition: "all 0.2s",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.6rem", color: m.color }}>{m.title}</div>
                <p style={{ color: "#999", fontSize: "0.9rem", lineHeight: 1.5, margin: 0 }}>{m.desc}</p>
              </div>
              <div style={{ marginTop: "1.5rem", fontSize: "0.85rem", fontWeight: 700, color: m.color, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                Manage Section →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
