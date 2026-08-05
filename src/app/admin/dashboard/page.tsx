"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminNav from "@/components/AdminNav";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    projects: 0,
    categories: 0,
    brands: 0,
    products: 0,
    services: 0,
    testimonials: 0,
    blogs: 0,
    media: 0,
    inquiries: 0,
    catalogs: 0,
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/projects").then((res) => res.json()),
      fetch("/api/categories").then((res) => res.json()),
      fetch("/api/brands").then((res) => res.json()),
      fetch("/api/products").then((res) => res.json()),
      fetch("/api/services").then((res) => res.json()),
      fetch("/api/testimonials").then((res) => res.json()),
      fetch("/api/blogs").then((res) => res.json()),
      fetch("/api/media").then((res) => res.json()),
      fetch("/api/inquiries").then((res) => res.json()),
      fetch("/api/catalogs").then((res) => res.json()),
    ]).then(([p, c, b, pr, s, t, bl, m, inq, cat]) => {
      setStats({
        projects: p.count || p.data?.length || 0,
        categories: c.count || c.data?.length || 0,
        brands: b.count || b.data?.length || 0,
        products: pr.count || pr.data?.length || 0,
        services: s.count || s.data?.length || 0,
        testimonials: t.count || t.data?.length || 0,
        blogs: bl.count || bl.data?.length || 0,
        media: m.count || m.data?.length || 0,
        inquiries: inq.count || inq.data?.length || 0,
        catalogs: cat.count || cat.data?.length || 0,
      });
    }).catch((e) => console.error(e));
  }, []);

  const statCards = [
    { label: "Total PDF Catalogs", count: stats.catalogs, color: "#8c764b", href: "/catalogs" },
    { label: "Inquiries & PDF Leads", count: stats.inquiries, color: "#f43f5e", href: "/admin/inquiries" },
    { label: "Total Projects", count: stats.projects, color: "#d4af37", href: "/admin/projects" },
    { label: "Total Categories", count: stats.categories, color: "#10b981", href: "/admin/categories" },
    { label: "Total Partner Brands", count: stats.brands, color: "#a855f7", href: "/admin/brands" },
    { label: "Total Catalog Products", count: stats.products, color: "#ec4899", href: "/admin/products" },
    { label: "Total Services", count: stats.services, color: "#f59e0b", href: "/admin/services" },
    { label: "Client Testimonials", count: stats.testimonials, color: "#14b8a6", href: "/admin/testimonials" },
    { label: "Blog Articles", count: stats.blogs, color: "#6366f1", href: "/admin/blogs" },
  ];

  const modules = [
    { title: "🏠 Homepage Hero Section", desc: "Header text, tagline, subtext, background MP4 video URL, category tags bar.", href: "/admin/hero", color: "#d4af37" },
    { title: "🛠️ Services Management", desc: "Add/edit unlimited services, icons, descriptions, category tags, button URLs.", href: "/admin/services", color: "#f59e0b" },
    { title: "🏷️ Category Management", desc: "Manage categories with cover images, descriptions, short codes (DS 06), sequence numbers.", href: "/admin/categories", color: "#10b981" },
    { title: "🏢 Brand Management", desc: "Manage brands, logo & banner uploads, descriptions, short codes (SF 01), sequence, PDF catalogs.", href: "/admin/brands", color: "#a855f7" },
    { title: "🖼️ Showcase Projects", desc: "Manage homepage showcase projects, project codes (OB 01), main images, sequence numbers.", href: "/admin/projects", color: "#3b82f6" },
    { title: "📦 Product Catalog & Import", desc: "Upload Excel product list (.xlsx), edit product details, finishes, dimensions, middle gallery photos.", href: "/admin/products", color: "#ec4899" },
    { title: "💬 Testimonials CMS", desc: "Manage client reviews, star ratings, company names, and client profile photos.", href: "/admin/testimonials", color: "#14b8a6" },
    { title: "✍️ Blog Articles CMS", desc: "Write & publish blog posts, material guides, tags, categories, and author details.", href: "/admin/blogs", color: "#6366f1" },
    { title: "📁 Central Media Library", desc: "Upload & organize images, MP4 videos, PDF catalogs, search assets, copy URLs.", href: "/admin/media", color: "#eab308" },
    { title: "🗂️ Dynamic Dropdowns", desc: "Code-free dropdown taxonomies: Categories, Technologies, Project Types, Tags.", href: "/admin/dropdowns", color: "#a855f7" },
    { title: "ℹ️ About Us & Timeline", desc: "Edit Mission, Vision, Values, and vertical roadmap timeline steps (01, 02, 03...).", href: "/admin/about", color: "#06b6d4" },
    { title: "👥 Team Members", desc: "Manage team member photos, designations, member codes (MM 01), bios, socials.", href: "/admin/team", color: "#6366f1" },
    { title: "📞 Contact & Footer Settings", desc: "Primary email, phone, address, map embed, footer links, social icons, Google Sheet Webhook URL.", href: "/admin/contact", color: "#f43f5e" },
    { title: "📥 Inquiries & PDF Leads", desc: "View form leads & catalog PDF downloads, export to CSV/Excel, trigger Google Sheets sync.", href: "/admin/inquiries", color: "#84cc16" },
  ];

  return (
    <div style={{ background: "#ffffff", color: "#111111", minHeight: "100vh", display: "flex" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem", background: "#ffffff" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <span style={{ color: "#8c764b", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 800 }}>LUXURY CONTROL CENTER</span>
          <h1 style={{ fontSize: "2.6rem", fontWeight: 800, margin: "0.3rem 0", color: "#8c764b" }}>Aaren Studio Master Admin</h1>
          <p style={{ color: "#475569", fontSize: "0.95rem" }}>Code-free website management. Edits saved here update the live website immediately.</p>
        </div>

        {/* Real-time Counter Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.2rem", marginBottom: "3rem" }}>
          {statCards.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              style={{
                background: "#f8f9fa",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "1.4rem 1.6rem",
                textDecoration: "none",
                color: "#111111",
                display: "block",
                transition: "all 0.2s ease-in-out",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{c.label}</div>
              <div style={{ fontSize: "2.4rem", fontWeight: 900, color: "#8c764b", marginTop: "0.3rem" }}>{c.count}</div>
            </Link>
          ))}
        </div>

        {/* Modules Grid */}
        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1.5rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.8rem", color: "#8c764b" }}>CMS Management Modules</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.4rem" }}>
          {modules.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              style={{
                background: "#f8f9fa",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "1.6rem",
                textDecoration: "none",
                color: "#111111",
                transition: "all 0.2s ease-in-out",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <div>
                <div style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.5rem", color: "#8c764b" }}>{m.title}</div>
                <p style={{ color: "#475569", fontSize: "0.88rem", lineHeight: 1.5, margin: 0 }}>{m.desc}</p>
              </div>
              <div style={{ marginTop: "1.4rem", fontSize: "0.85rem", fontWeight: 700, color: "#8c764b", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                Manage Module →
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
