"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminNav from "@/components/AdminNav";
import { SiteSettingsItem } from "@/lib/types";
import {
  Palette,
  Save,
  CheckCircle,
  ExternalLink,
  HelpCircle,
  FolderTree,
  Building,
  Layers,
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  MessageSquare,
  Users,
  FileText,
  PhoneCall,
  Inbox,
  LayoutTemplate,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    projects: 0,
    categories: 0,
    collections: 0,
    brands: 0,
    products: 0,
    services: 0,
    testimonials: 0,
    blogs: 0,
    media: 0,
    inquiries: 0,
    catalogs: 0,
    faqs: 0,
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettingsItem | null>(null);
  const [websiteBgColor, setWebsiteBgColor] = useState("#E6E2D8");
  const [headingColor, setHeadingColor] = useState("#81663F");
  const [textColor, setTextColor] = useState("#1E1E1E");
  const [accentColor, setAccentColor] = useState("#81663F");
  const [savingColors, setSavingColors] = useState(false);
  const [colorToast, setColorToast] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/projects?t=" + Date.now()).then((res) => res.json()),
      fetch("/api/categories?t=" + Date.now()).then((res) => res.json()),
      fetch("/api/collections?t=" + Date.now()).then((res) => res.json()),
      fetch("/api/brands?t=" + Date.now()).then((res) => res.json()),
      fetch("/api/products?t=" + Date.now()).then((res) => res.json()),
      fetch("/api/services?t=" + Date.now()).then((res) => res.json()),
      fetch("/api/testimonials?t=" + Date.now()).then((res) => res.json()),
      fetch("/api/blogs?t=" + Date.now()).then((res) => res.json()),
      fetch("/api/media?t=" + Date.now()).then((res) => res.json()),
      fetch("/api/inquiries?t=" + Date.now()).then((res) => res.json()),
      fetch("/api/catalogs?t=" + Date.now()).then((res) => res.json()),
      fetch("/api/faq?t=" + Date.now()).then((res) => res.json()),
      fetch("/api/site-settings?t=" + Date.now()).then((res) => res.json()),
    ])
      .then(([p, c, col, b, pr, s, t, bl, m, inq, cat, fq, st]) => {
        setStats({
          projects: p.count || p.data?.length || 0,
          categories: c.count || c.data?.length || 0,
          collections: col.count || col.data?.length || 0,
          brands: b.count || b.data?.length || 0,
          products: pr.count || pr.data?.length || 0,
          services: s.count || s.data?.length || 0,
          testimonials: t.count || t.data?.length || 0,
          blogs: bl.count || bl.data?.length || 0,
          media: m.count || m.data?.length || 0,
          inquiries: inq.count || inq.data?.length || 0,
          catalogs: cat.count || cat.data?.length || 0,
          faqs: fq.count || fq.data?.length || 0,
        });

        if (st && st.success && st.data) {
          setSiteSettings(st.data);
          if (st.data.websiteBgColor) setWebsiteBgColor(st.data.websiteBgColor);
          if (st.data.headingColor) setHeadingColor(st.data.headingColor);
          if (st.data.textColor) setTextColor(st.data.textColor);
          if (st.data.accentColor) setAccentColor(st.data.accentColor);
        }
      })
      .catch((e) => console.error(e));
  }, []);

  const handleSaveColors = async () => {
    setSavingColors(true);
    try {
      const res = await fetch("/api/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          websiteBgColor,
          headingColor,
          textColor,
          accentColor,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setColorToast("✨ Website Branding Colors Saved Permanently!");
        setTimeout(() => setColorToast(null), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingColors(false);
    }
  };

  const statCards = [
    { label: "❓ FAQs & Brand Help", count: stats.faqs, color: "#81663F", href: "/admin/faq" },
    { label: "🏢 Brands Registered", count: stats.brands, color: "#81663F", href: "/admin/brands" },
    { label: "📦 Products in Catalog", count: stats.products, color: "#81663F", href: "/admin/products" },
    { label: "🗃️ Brand Collections", count: stats.collections, color: "#81663F", href: "/admin/collections" },
    { label: "🏷️ Categories", count: stats.categories, color: "#81663F", href: "/admin/categories" },
    { label: "📄 PDF Catalogs", count: stats.catalogs, color: "#81663F", href: "/catalogs" },
    { label: "🖼️ Showcase Projects", count: stats.projects, color: "#81663F", href: "/admin/projects" },
    { label: "📥 Inquiries & Leads", count: stats.inquiries, color: "#81663F", href: "/admin/inquiries" },
    { label: "✍️ Blogs & Guides", count: stats.blogs, color: "#81663F", href: "/admin/blogs" },
  ];

  const modules = [
    { title: "🗃️ Brand-Scoped Collections", desc: "Manage brand product collections (Kitchen, Wardrobe, Door Systems) with circular icons, storefront filter bar, and live product counts.", href: "/admin/collections", icon: Layers },
    { title: "❓ FAQ & Brand Knowledge Base", desc: "Manage 150+ brand FAQs, import/export Excel spreadsheets, edit questions, answers and categories.", href: "/admin/faq", icon: HelpCircle },
    { title: "🏢 Brand Management & Individual Pages", desc: "Manage partner brands, hero banners, logos, quote taglines, country of origin, founded year, story and PDF catalogs.", href: "/admin/brands", icon: Building },
    { title: "📦 Product Catalog & Master Editors", desc: "Upload Excel product list, manage dimensions, finishes, CAD specs, warranty, and middle gallery photos.", href: "/admin/products", icon: Layers },
    { title: "🏷️ Categories & Filter Taxonomies", desc: "Manage categories with cover images, descriptions, short codes (DS 06), sequence numbers and subcategories.", href: "/admin/categories", icon: FolderTree },
    { title: "🏠 Homepage Hero Section", desc: "Header text, tagline, subtext, background MP4 video URL, category tags bar.", href: "/admin/hero", icon: Sparkles },
    { title: "🖼️ Showcase Projects", desc: "Manage homepage showcase projects, project codes (OB 01), main images, sequence numbers.", href: "/admin/projects", icon: LayoutTemplate },
    { title: "🛠️ Services Management", desc: "Add/edit unlimited services, icons, descriptions, category tags, button URLs.", href: "/admin/services", icon: FileText },
    { title: "💬 Testimonials CMS", desc: "Manage client reviews, star ratings, company names, and client profile photos.", href: "/admin/testimonials", icon: MessageSquare },
    { title: "✍️ Blog Articles CMS", desc: "Write & publish blog posts, material guides, tags, categories, and author details.", href: "/admin/blogs", icon: BookOpen },
    { title: "📁 Central Media Library", desc: "Upload & organize images, MP4 videos, PDF catalogs, search assets, copy URLs.", href: "/admin/media", icon: ImageIcon },
    { title: "🗂️ Dynamic Dropdowns", desc: "Code-free dropdown taxonomies: Categories, Technologies, Project Types, Tags.", href: "/admin/dropdowns", icon: Layers },
    { title: "ℹ️ About Us & Timeline", desc: "Edit Mission, Vision, Values, and vertical roadmap timeline steps (01, 02, 03...).", href: "/admin/about", icon: Users },
    { title: "👥 Team Members", desc: "Manage team member photos, designations, member codes (MM 01), bios, socials.", href: "/admin/team", icon: Users },
    { title: "📞 Contact & Footer Settings", desc: "Primary email, phone, address, map embed, footer links, social icons, Google Sheet Webhook URL.", href: "/admin/contact", icon: PhoneCall },
    { title: "📥 Inquiries & PDF Leads", desc: "View form leads & catalog PDF downloads, export to CSV/Excel, trigger Google Sheets sync.", href: "/admin/inquiries", icon: Inbox },
  ];

  return (
    <div style={{ background: "#FAF8F5", color: "#1E1E1E", minHeight: "100vh", display: "flex", fontFamily: "var(--font-jost), 'Jost', sans-serif" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem", background: "#FAF8F5", maxWidth: "1400px", margin: "0 auto" }}>
        {/* TOP HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2.5rem", borderBottom: "1px solid rgba(0,0,0,0.08)", paddingBottom: "1.5rem" }}>
          <div>
            <span style={{ background: "#81663F", color: "#fff", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 800, padding: "3px 8px", borderRadius: "4px" }}>
              LUXURY CONTROL CENTER
            </span>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 900, margin: "0.4rem 0 0.2rem", color: "#81663F" }}>
              Aaren Studio Master Admin
            </h1>
            <p style={{ color: "#565656", fontSize: "0.95rem", margin: 0 }}>
              Complete code-free website management. All changes saved here update the live website permanently in real time.
            </p>
          </div>

          <Link
            href="/"
            target="_blank"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 18px",
              background: "#1E1E1E",
              color: "#fff",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "0.85rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            <span>View Live Website</span>
            <ExternalLink size={14} />
          </Link>
        </div>

        {/* REAL-TIME METRICS COUNTERS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
          {statCards.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              style={{
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: "12px",
                padding: "1.4rem 1.6rem",
                textDecoration: "none",
                color: "#1E1E1E",
                display: "block",
                transition: "all 0.2s ease-in-out",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {c.label}
              </div>
              <div style={{ fontSize: "2.4rem", fontWeight: 900, color: "#81663F", marginTop: "0.3rem" }}>
                {c.count}
              </div>
            </Link>
          ))}
        </div>

        {/* GLOBAL COLORS & BRANDING CONTROLLER */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid rgba(129, 102, 63, 0.25)",
            borderRadius: "16px",
            padding: "2rem",
            marginBottom: "3rem",
            boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.8rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Palette size={20} color="#81663F" />
              <div>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0, color: "#81663F" }}>
                  Global Website Colors & Typography Branding
                </h2>
                <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "2px 0 0" }}>
                  Permanently change the website background and heading colors across all public pages.
                </p>
              </div>
            </div>

            <button
              onClick={handleSaveColors}
              disabled={savingColors}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                background: "#81663F",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontWeight: 800,
                fontSize: "0.85rem",
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              <Save size={15} />
              <span>{savingColors ? "Saving..." : "Save Global Colors"}</span>
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
            {/* Website Background */}
            <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "#475569", marginBottom: "0.5rem" }}>
                Website Background Color
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="color"
                  value={websiteBgColor}
                  onChange={(e) => setWebsiteBgColor(e.target.value)}
                  style={{ width: "40px", height: "40px", borderRadius: "6px", border: "1px solid #cbd5e1", cursor: "pointer", padding: "2px" }}
                />
                <input
                  type="text"
                  value={websiteBgColor}
                  onChange={(e) => setWebsiteBgColor(e.target.value)}
                  style={{ flex: 1, padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontWeight: 700, fontSize: "0.9rem", color: "#1E1E1E" }}
                />
              </div>
              <small style={{ color: "#64748b", fontSize: "0.75rem", marginTop: "4px", display: "block" }}>
                Active Luxury Default: <b style={{ color: "#81663F" }}>#E6E2D8</b>
              </small>
            </div>

            {/* Main Headings */}
            <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "#475569", marginBottom: "0.5rem" }}>
                Main Headings Color
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="color"
                  value={headingColor}
                  onChange={(e) => setHeadingColor(e.target.value)}
                  style={{ width: "40px", height: "40px", borderRadius: "6px", border: "1px solid #cbd5e1", cursor: "pointer", padding: "2px" }}
                />
                <input
                  type="text"
                  value={headingColor}
                  onChange={(e) => setHeadingColor(e.target.value)}
                  style={{ flex: 1, padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontWeight: 700, fontSize: "0.9rem", color: "#1E1E1E" }}
                />
              </div>
              <small style={{ color: "#64748b", fontSize: "0.75rem", marginTop: "4px", display: "block" }}>
                Active Luxury Default: <b style={{ color: "#81663F" }}>#81663F</b>
              </small>
            </div>

            {/* Body Text */}
            <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "#475569", marginBottom: "0.5rem" }}>
                Body Text Color
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  style={{ width: "40px", height: "40px", borderRadius: "6px", border: "1px solid #cbd5e1", cursor: "pointer", padding: "2px" }}
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  style={{ flex: 1, padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontWeight: 700, fontSize: "0.9rem", color: "#1E1E1E" }}
                />
              </div>
              <small style={{ color: "#64748b", fontSize: "0.75rem", marginTop: "4px", display: "block" }}>
                Active Dark Default: <b>#1E1E1E</b>
              </small>
            </div>

            {/* Accent Gold */}
            <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "#475569", marginBottom: "0.5rem" }}>
                Accent Gold / Bronze
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  style={{ width: "40px", height: "40px", borderRadius: "6px", border: "1px solid #cbd5e1", cursor: "pointer", padding: "2px" }}
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  style={{ flex: 1, padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontWeight: 700, fontSize: "0.9rem", color: "#1E1E1E" }}
                />
              </div>
              <small style={{ color: "#64748b", fontSize: "0.75rem", marginTop: "4px", display: "block" }}>
                Active Accent: <b style={{ color: "#81663F" }}>#81663F</b>
              </small>
            </div>
          </div>

          {/* Live Preview Strip */}
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1.5rem",
              borderRadius: "12px",
              background: websiteBgColor,
              border: "1px solid rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: accentColor, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                LIVE PREVIEW
              </span>
              <h3 style={{ fontSize: "1.6rem", fontWeight: 900, color: headingColor, margin: "2px 0 4px" }}>
                AAREN CREATIVE STUDIO & MATERIAL HOUSE
              </h3>
              <p style={{ color: textColor, fontSize: "0.9rem", margin: 0, maxWidth: "600px" }}>
                Immersive spatial environments crafted with authentic European surfaces, natural wood cladding, and bespoke joinery.
              </p>
            </div>
            <button
              style={{
                padding: "8px 18px",
                background: headingColor,
                color: "#ffffff",
                border: "none",
                borderRadius: "999px",
                fontWeight: 700,
                fontSize: "0.8rem",
                textTransform: "uppercase",
              }}
            >
              Explore Materials →
            </button>
          </div>
        </div>

        {/* CMS MODULES GRID */}
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1.5rem", borderBottom: "1px solid rgba(0,0,0,0.08)", paddingBottom: "0.8rem", color: "#81663F" }}>
          CMS Management Modules
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.4rem" }}>
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.href}
                href={m.href}
                style={{
                  background: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: "14px",
                  padding: "1.6rem",
                  textDecoration: "none",
                  color: "#1E1E1E",
                  transition: "all 0.2s ease-in-out",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.6rem" }}>
                    <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "rgba(129, 102, 63, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={18} color="#81663F" />
                    </div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#81663F" }}>{m.title}</div>
                  </div>
                  <p style={{ color: "#565656", fontSize: "0.88rem", lineHeight: 1.5, margin: 0 }}>{m.desc}</p>
                </div>
                <div style={{ marginTop: "1.4rem", fontSize: "0.85rem", fontWeight: 800, color: "#81663F", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  Manage Section →
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      {/* Floating Toast */}
      {colorToast && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            background: "#81663F",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "8px",
            fontWeight: 800,
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            zIndex: 99999,
          }}
        >
          {colorToast}
        </div>
      )}
    </div>
  );
}
