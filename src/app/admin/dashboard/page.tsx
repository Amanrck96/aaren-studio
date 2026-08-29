"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import AdminNav from "@/components/AdminNav";
import { SiteSettingsItem } from "@/lib/types";
import { applyTextCase } from "@/lib/textCase";
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
  Database,
  Download,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [backupsCount, setBackupsCount] = useState<number>(0);
  const [creatingBackup, setCreatingBackup] = useState<boolean>(false);
  const [backupToast, setBackupToast] = useState<string | null>(null);
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
  const [textCase, setTextCase] = useState<"proper" | "uppercase" | "lowercase">("proper");
  const [savingColors, setSavingColors] = useState(false);
  const [colorToast, setColorToast] = useState<string | null>(null);

  // Protect local user selections from being overwritten by delayed initial fetch
  const userInteractedRef = useRef({
    websiteBgColor: false,
    headingColor: false,
    textColor: false,
    accentColor: false,
    textCase: false,
  });

  const [refreshingStats, setRefreshingStats] = useState<boolean>(false);

  const fetchDashboardStats = async () => {
    setRefreshingStats(true);
    const safeFetch = async (url: string) => {
      try {
        const res = await fetch(url, {
          cache: "no-store",
          headers: { "Cache-Control": "no-store, no-cache, must-revalidate", "Pragma": "no-cache" },
        });
        if (!res.ok) return { count: 0, data: [] };
        return await res.json();
      } catch (err) {
        return { count: 0, data: [] };
      }
    };

    try {
      const [p, c, col, b, pr, s, t, bl, m, inq, cat, fq, st, bk] = await Promise.all([
        safeFetch("/api/projects?t=" + Date.now()),
        safeFetch("/api/categories?t=" + Date.now()),
        safeFetch("/api/collections?t=" + Date.now()),
        safeFetch("/api/brands?t=" + Date.now()),
        safeFetch("/api/products?t=" + Date.now()),
        safeFetch("/api/services?t=" + Date.now()),
        safeFetch("/api/testimonials?t=" + Date.now()),
        safeFetch("/api/blogs?t=" + Date.now()),
        safeFetch("/api/media?t=" + Date.now()),
        safeFetch("/api/inquiries?t=" + Date.now()),
        safeFetch("/api/catalogs?t=" + Date.now()),
        safeFetch("/api/faq?t=" + Date.now()),
        safeFetch("/api/site-settings?t=" + Date.now()),
        safeFetch("/api/admin/backups?t=" + Date.now()),
      ]);

      setStats({
        projects: typeof p?.count === "number" ? p.count : p?.data?.length || 0,
        categories: typeof c?.count === "number" ? c.count : c?.data?.length || 0,
        collections: typeof col?.count === "number" ? col.count : col?.data?.length || 0,
        brands: typeof b?.count === "number" ? b.count : b?.data?.length || 0,
        products: typeof pr?.count === "number" ? pr.count : pr?.data?.length || 0,
        services: typeof s?.count === "number" ? s.count : s?.data?.length || 0,
        testimonials: typeof t?.count === "number" ? t.count : t?.data?.length || 0,
        blogs: typeof bl?.count === "number" ? bl.count : bl?.data?.length || 0,
        media: typeof m?.count === "number" ? m.count : m?.data?.length || 0,
        inquiries: typeof inq?.count === "number" ? inq.count : inq?.data?.length || 0,
        catalogs: typeof cat?.count === "number" ? cat.count : cat?.data?.length || 0,
        faqs: typeof fq?.count === "number" ? fq.count : fq?.data?.length || 0,
      });

      if (bk && bk.success && typeof bk.count === "number") {
        setBackupsCount(bk.count);
      }

      if (st && st.success && st.data) {
        setSiteSettings(st.data);
        if (!userInteractedRef.current.websiteBgColor && st.data.websiteBgColor) setWebsiteBgColor(st.data.websiteBgColor);
        if (!userInteractedRef.current.headingColor && st.data.headingColor) setHeadingColor(st.data.headingColor);
        if (!userInteractedRef.current.textColor && st.data.textColor) setTextColor(st.data.textColor);
        if (!userInteractedRef.current.accentColor && st.data.accentColor) setAccentColor(st.data.accentColor);
        if (!userInteractedRef.current.textCase && st.data.textCase) setTextCase(st.data.textCase);
      }
    } catch (e) {
      console.error("Admin dashboard fetch error:", e);
    } finally {
      setRefreshingStats(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();

    // Auto-refresh when tab gains focus or becomes visible
    const handleFocus = () => fetchDashboardStats();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") fetchDashboardStats();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Periodic live sync every 25 seconds
    const interval = setInterval(fetchDashboardStats, 25000);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(interval);
    };
  }, []);

  const handleCreateBackup = async () => {
    setCreatingBackup(true);
    try {
      const res = await fetch("/api/admin/backups", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setBackupsCount((prev) => prev + 1);
        setBackupToast("🛡️ Full Database Snapshot & Cloud Backup Created Successfully!");
        setTimeout(() => setBackupToast(null), 5000);
      }
    } catch (e: any) {
      console.error(e);
      setBackupToast("❌ Error: " + e.message);
    } finally {
      setCreatingBackup(false);
    }
  };

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  const handleForceSync = async () => {
    setIsSyncing(true);
    setSyncToast(null);
    try {
      const res = await fetch("/api/firebase-sync", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setSyncToast("✅ All content synced to Firebase! Admin edits are now permanent.");
      } else {
        setSyncToast("❌ Sync failed: " + json.error);
      }
    } catch (e: any) {
      setSyncToast("❌ Sync error: " + e.message);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncToast(null), 6000);
    }
  };


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
          textCase,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setColorToast("✨ Website Branding & Typography Settings Saved Permanently!");
        setTimeout(() => setColorToast(null), 4000);
      }
    } catch (e: any) {
      console.error(e);
      setColorToast("❌ Error: " + e.message);
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
    { label: "📄 PDF Catalogs", count: stats.catalogs, color: "#81663F", href: "/admin/catalogs" },
    { label: "🖼️ Showcase Projects", count: stats.projects, color: "#81663F", href: "/admin/projects" },
    { label: "📥 Inquiries & Leads", count: stats.inquiries, color: "#81663F", href: "/admin/inquiries" },
    { label: "✍️ Blogs & Guides", count: stats.blogs, color: "#81663F", href: "/admin/blogs" },
  ];

  const modules = [
    { title: "🗃️ Brand-Scoped Collections", desc: "Manage brand product collections (Kitchen, Wardrobe, Door Systems) with circular icons, storefront filter bar, and live product counts.", href: "/admin/collections", icon: Layers },
    { title: "❓ FAQ & Brand Knowledge Base", desc: "Manage 150+ brand FAQs, import/export Excel spreadsheets, edit questions, answers and categories.", href: "/admin/faq", icon: HelpCircle },
    { title: "🏢 Brand Management & Individual Pages", desc: "Manage partner brands, hero banners, logos, quote taglines, country of origin, founded year, story and PDF catalogs.", href: "/admin/brands", icon: Building },
    { title: "📦 Product Catalog & Master Editors", desc: "Upload Excel product list, manage dimensions, finishes, CAD specs, warranty, and middle gallery photos.", href: "/admin/products", icon: Layers },
    { title: "📄 PDF Catalogs & Brochures", desc: "View all brand specification PDF catalogs, covers, file sizes, and download enquiry counts.", href: "/admin/catalogs", icon: BookOpen },
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
    { title: "📥 Inquiries & PDF Leads", desc: "View form leads & catalog PDF access requests.", href: "/admin/inquiries", icon: PhoneCall },
    { title: "💼 Careers & Job Openings", desc: "Manage career listings, requirements, and job vacancies.", href: "/admin/careers", icon: Users },
  ];

  return (
    <div style={{ background: "#FAF8F5", color: "#1E1E1E", minHeight: "100vh", display: "flex", fontFamily: "var(--font-jost), 'Jost', sans-serif" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem", background: "#FAF8F5", maxWidth: "1400px", margin: "0 auto" }}>
        {/* TOP HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2.5rem", borderBottom: "1px solid #DCD5C6", paddingBottom: "1.5rem" }}>
          <div>
            <span style={{ background: "rgba(129, 102, 63, 0.12)", color: "#81663F", border: "1px solid rgba(129, 102, 63, 0.25)", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 800, padding: "4px 10px", borderRadius: "6px" }}>
              LUXURY CONTROL CENTER
            </span>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 900, margin: "0.5rem 0 0.2rem", color: "#1E1E1E" }}>
              Aaren Studio Master Admin
            </h1>
            <p style={{ color: "#555555", fontSize: "0.95rem", margin: 0 }}>
              Complete code-free website management. All changes saved here update the live website permanently in real time.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            {syncToast && (
              <span style={{ background: syncToast.startsWith("✅") ? "#d1fae5" : "#fee2e2", color: syncToast.startsWith("✅") ? "#065f46" : "#b91c1c", padding: "8px 14px", borderRadius: "8px", fontSize: "0.82rem", fontWeight: 700, maxWidth: "320px", border: "1px solid #DCD5C6" }}>
                {syncToast}
              </span>
            )}
            <button
              onClick={fetchDashboardStats}
              disabled={refreshingStats}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 16px",
                background: "#FAF8F5",
                color: "#81663F",
                border: "1px solid #D5CEBF",
                borderRadius: "8px",
                cursor: refreshingStats ? "wait" : "pointer",
                fontWeight: 800,
                fontSize: "0.85rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontFamily: "inherit",
                boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
              }}
            >
              <RefreshCw size={14} className={refreshingStats ? "spin" : ""} />
              <span>{refreshingStats ? "Refreshing..." : "Refresh Live Stats"}</span>
            </button>
            <button
              onClick={handleForceSync}
              disabled={isSyncing}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 18px",
                background: isSyncing ? "#94a3b8" : "#10b981",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: isSyncing ? "not-allowed" : "pointer",
                fontWeight: 700,
                fontSize: "0.85rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontFamily: "inherit",
              }}
            >
              <RefreshCw size={14} className={isSyncing ? "spin" : ""} />
              <span>{isSyncing ? "Syncing..." : "Sync to Firebase"}</span>
            </button>
            <Link
              href="/"
              target="_blank"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 18px",
                background: "#1E1E1E",
                color: "#FFFFFF",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 800,
                fontSize: "0.85rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
              }}
            >
              <span>View Live Website</span>
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>


        {/* REAL-TIME METRICS COUNTERS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
          {statCards.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2DCD2",
                borderRadius: "14px",
                padding: "1.4rem 1.6rem",
                textDecoration: "none",
                color: "#1E1E1E",
                display: "block",
                transition: "all 0.2s ease-in-out",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ fontSize: "0.75rem", color: "#6A6359", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
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
            background: "#FFFFFF",
            border: "1px solid #E2DCD2",
            borderRadius: "16px",
            padding: "2rem",
            marginBottom: "3rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem", borderBottom: "1px solid #EAE4D8", paddingBottom: "0.8rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Palette size={20} color="#81663F" />
              <div>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0, color: "#81663F" }}>
                  Global Website Colors & Typography Branding
                </h2>
                <p style={{ fontSize: "0.85rem", color: "#555555", margin: "2px 0 0" }}>
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
                background: "#1E1E1E",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                fontWeight: 800,
                fontSize: "0.85rem",
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
              }}
            >
              <Save size={15} />
              <span>{savingColors ? "Saving..." : "Save Global Colors"}</span>
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
            {/* Website Background */}
            <div style={{ background: "#FAF8F5", padding: "1rem", borderRadius: "10px", border: "1px solid #D5CEBF" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "#1E1E1E", marginBottom: "0.5rem" }}>
                Website Background Color
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="color"
                  value={websiteBgColor}
                  onChange={(e) => {
                    userInteractedRef.current.websiteBgColor = true;
                    setWebsiteBgColor(e.target.value);
                  }}
                  style={{ width: "40px", height: "40px", borderRadius: "6px", border: "1px solid #D5CEBF", cursor: "pointer", padding: "2px", background: "transparent" }}
                />
                <input
                  type="text"
                  value={websiteBgColor}
                  onChange={(e) => {
                    userInteractedRef.current.websiteBgColor = true;
                    setWebsiteBgColor(e.target.value);
                  }}
                  style={{ flex: 1, padding: "8px 12px", border: "1px solid #D5CEBF", borderRadius: "6px", fontWeight: 700, fontSize: "0.9rem", color: "#1E1E1E", background: "#FFFFFF" }}
                />
              </div>
              <small style={{ color: "#6A6359", fontSize: "0.75rem", marginTop: "4px", display: "block" }}>
                Active Luxury Default: <b style={{ color: "#81663F" }}>#E6E2D8</b>
              </small>
            </div>

            {/* Main Headings */}
            <div style={{ background: "#FAF8F5", padding: "1rem", borderRadius: "10px", border: "1px solid #D5CEBF" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "#1E1E1E", marginBottom: "0.5rem" }}>
                Main Headings Color
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="color"
                  value={headingColor}
                  onChange={(e) => {
                    userInteractedRef.current.headingColor = true;
                    setHeadingColor(e.target.value);
                  }}
                  style={{ width: "40px", height: "40px", borderRadius: "6px", border: "1px solid #D5CEBF", cursor: "pointer", padding: "2px", background: "transparent" }}
                />
                <input
                  type="text"
                  value={headingColor}
                  onChange={(e) => {
                    userInteractedRef.current.headingColor = true;
                    setHeadingColor(e.target.value);
                  }}
                  style={{ flex: 1, padding: "8px 12px", border: "1px solid #D5CEBF", borderRadius: "6px", fontWeight: 700, fontSize: "0.9rem", color: "#1E1E1E", background: "#FFFFFF" }}
                />
              </div>
              <small style={{ color: "#6A6359", fontSize: "0.75rem", marginTop: "4px", display: "block" }}>
                Active Luxury Default: <b style={{ color: "#81663F" }}>#81663F</b>
              </small>
            </div>

            {/* Body Text */}
            <div style={{ background: "#FAF8F5", padding: "1rem", borderRadius: "10px", border: "1px solid #D5CEBF" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "#1E1E1E", marginBottom: "0.5rem" }}>
                Body Text Color
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => {
                    userInteractedRef.current.textColor = true;
                    setTextColor(e.target.value);
                  }}
                  style={{ width: "40px", height: "40px", borderRadius: "6px", border: "1px solid #D5CEBF", cursor: "pointer", padding: "2px", background: "transparent" }}
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => {
                    userInteractedRef.current.textColor = true;
                    setTextColor(e.target.value);
                  }}
                  style={{ flex: 1, padding: "8px 12px", border: "1px solid #D5CEBF", borderRadius: "6px", fontWeight: 700, fontSize: "0.9rem", color: "#1E1E1E", background: "#FFFFFF" }}
                />
              </div>
              <small style={{ color: "#6A6359", fontSize: "0.75rem", marginTop: "4px", display: "block" }}>
                Active Dark Default: <b style={{ color: "#1E1E1E" }}>#1E1E1E</b>
              </small>
            </div>

            {/* Accent Gold */}
            <div style={{ background: "#FAF8F5", padding: "1rem", borderRadius: "10px", border: "1px solid #D5CEBF" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: "#1E1E1E", marginBottom: "0.5rem" }}>
                Accent Gold / Bronze
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => {
                    userInteractedRef.current.accentColor = true;
                    setAccentColor(e.target.value);
                  }}
                  style={{ width: "40px", height: "40px", borderRadius: "6px", border: "1px solid #D5CEBF", cursor: "pointer", padding: "2px", background: "transparent" }}
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => {
                    userInteractedRef.current.accentColor = true;
                    setAccentColor(e.target.value);
                  }}
                  style={{ flex: 1, padding: "8px 12px", border: "1px solid #D5CEBF", borderRadius: "6px", fontWeight: 700, fontSize: "0.9rem", color: "#1E1E1E", background: "#FFFFFF" }}
                />
              </div>
              <small style={{ color: "#6A6359", fontSize: "0.75rem", marginTop: "4px", display: "block" }}>
                Active Accent: <b style={{ color: "#81663F" }}>#81663F</b>
              </small>
            </div>
          </div>

          {/* GLOBAL TYPOGRAPHY TEXT-CASING CONTROLLER */}
          <div style={{ marginTop: "2rem", borderTop: "1px solid #EAE4D8", paddingTop: "1.5rem" }}>
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "1.1rem" }}>🔤</span>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, margin: 0, color: "#81663F" }}>
                  Global Text-Casing Display Engine
                </h3>
              </div>
              <p style={{ fontSize: "0.85rem", color: "#555555", margin: "4px 0 0" }}>
                Controls how titles, category names, subtitles, and buttons are formatted on the live website. Stored database data is 100% safe and untouched.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
              <button
                type="button"
                onClick={() => {
                  userInteractedRef.current.textCase = true;
                  setTextCase("proper");
                }}
                style={{
                  padding: "1rem",
                  borderRadius: "8px",
                  border: textCase === "proper" ? "2px solid #81663F" : "1px solid #D5CEBF",
                  background: textCase === "proper" ? "#FAF8F5" : "#FFFFFF",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                  <span style={{ fontWeight: 800, fontSize: "0.9rem", color: textCase === "proper" ? "#81663F" : "#1E1E1E" }}>
                    ✨ Proper Case (Recommended)
                  </span>
                  {textCase === "proper" && <span style={{ color: "#81663F", fontSize: "0.8rem", fontWeight: 800 }}>✓ Active</span>}
                </div>
                <div style={{ fontSize: "0.78rem", color: "#6A6359", lineHeight: 1.4 }}>
                  • Card Title: <b style={{ color: "#1E1E1E" }}>Bathroom Fittings</b><br />
                  • Subtitle: <i style={{ color: "#555555" }}>Falper and FIMA tapware and vanities</i>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  userInteractedRef.current.textCase = true;
                  setTextCase("uppercase");
                }}
                style={{
                  padding: "1rem",
                  borderRadius: "8px",
                  border: textCase === "uppercase" ? "2px solid #81663F" : "1px solid #D5CEBF",
                  background: textCase === "uppercase" ? "#FAF8F5" : "#FFFFFF",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                  <span style={{ fontWeight: 800, fontSize: "0.9rem", color: textCase === "uppercase" ? "#81663F" : "#1E1E1E" }}>
                    🔠 ALL UPPERCASE
                  </span>
                  {textCase === "uppercase" && <span style={{ color: "#81663F", fontSize: "0.8rem", fontWeight: 800 }}>✓ Active</span>}
                </div>
                <div style={{ fontSize: "0.78rem", color: "#6A6359", lineHeight: 1.4 }}>
                  • Card Title: <b style={{ color: "#1E1E1E" }}>BATHROOM FITTINGS</b><br />
                  • Subtitle: <i style={{ color: "#555555" }}>FALPER AND FIMA TAPWARE AND VANITIES</i>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  userInteractedRef.current.textCase = true;
                  setTextCase("lowercase");
                }}
                style={{
                  padding: "1rem",
                  borderRadius: "8px",
                  border: textCase === "lowercase" ? "2px solid #81663F" : "1px solid #D5CEBF",
                  background: textCase === "lowercase" ? "#FAF8F5" : "#FFFFFF",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                  <span style={{ fontWeight: 800, fontSize: "0.9rem", color: textCase === "lowercase" ? "#81663F" : "#1E1E1E" }}>
                    🔡 all lowercase
                  </span>
                  {textCase === "lowercase" && <span style={{ color: "#81663F", fontSize: "0.8rem", fontWeight: 800 }}>✓ Active</span>}
                </div>
                <div style={{ fontSize: "0.78rem", color: "#6A6359", lineHeight: 1.4 }}>
                  • Card Title: <b style={{ color: "#1E1E1E" }}>bathroom fittings</b><br />
                  • Subtitle: <i style={{ color: "#555555" }}>falper and fima tapware and vanities</i>
                </div>
              </button>
            </div>
          </div>

          {/* Live Preview Strip */}
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1.5rem",
              borderRadius: "12px",
              background: websiteBgColor,
              border: "1px solid rgba(129,102,63,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: accentColor, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                LIVE PREVIEW ({textCase.toUpperCase()} MODE)
              </span>
              <h3 style={{
                fontSize: "1.6rem",
                fontWeight: 900,
                color: headingColor,
                margin: "2px 0 4px",
              }}>
                {applyTextCase("AAREN Creative Studio & Material House", textCase, "title")}
              </h3>
              <p style={{
                color: textColor,
                fontSize: "0.9rem",
                margin: 0,
                maxWidth: "600px",
              }}>
                {applyTextCase("Immersive spatial environments crafted with authentic European surfaces, natural wood cladding, and bespoke joinery.", textCase, "sentence")}
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
              }}
            >
              {applyTextCase("Explore Materials →", textCase, "title")}
            </button>
          </div>
        </div>

        {/* ── REAL-TIME DATABASE & AUTOMATED BACKUP CENTER ── */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2DCD2",
            borderRadius: "16px",
            padding: "1.8rem 2rem",
            marginBottom: "3rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.2rem", borderBottom: "1px solid #EAE4D8", paddingBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Database size={22} color="#10b981" />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#1E1E1E" }}>
                    Live Cloud Sync & Automated Backups
                  </h2>
                  <span style={{ background: "rgba(16, 185, 129, 0.15)", color: "#065f46", border: "1px solid rgba(16, 185, 129, 0.3)", fontSize: "0.7rem", fontWeight: 800, padding: "2px 8px", borderRadius: "999px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                    REALTIME CLOUD CONNECTED
                  </span>
                </div>
                <p style={{ fontSize: "0.85rem", color: "#555555", margin: "2px 0 0" }}>
                  Every update made in this Admin Panel syncs instantly to Google Firebase Cloud Store and generates an automated timestamped backup.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                onClick={handleCreateBackup}
                disabled={creatingBackup}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "0.65rem 1.2rem",
                  background: "#F4EFE6",
                  color: "#1E1E1E",
                  border: "1px solid #D5CEBF",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: creatingBackup ? "wait" : "pointer",
                }}
              >
                <RefreshCw size={15} className={creatingBackup ? "animate-spin" : ""} />
                {creatingBackup ? "Creating Backup..." : "Create Full Backup"}
              </button>

              <a
                href="/api/admin/backups?download=master"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "0.65rem 1.4rem",
                  background: "#10b981",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  textDecoration: "none",
                  boxShadow: "0 2px 8px rgba(16, 185, 129, 0.25)",
                }}
              >
                <Download size={15} />
                Download Database JSON
              </a>
            </div>
          </div>

          {backupToast && (
            <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#065f46", padding: "10px 14px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <ShieldCheck size={18} color="#10b981" />
              {backupToast}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
            <div style={{ background: "#FAF8F5", padding: "1rem 1.2rem", borderRadius: "10px", border: "1px solid #D5CEBF" }}>
              <span style={{ fontSize: "0.75rem", color: "#6A6359", fontWeight: 700, textTransform: "uppercase" }}>Primary Cloud Storage</span>
              <div style={{ fontSize: "1rem", fontWeight: 800, color: "#1E1E1E", marginTop: "4px" }}>Google Firebase Realtime DB</div>
              <small style={{ color: "#059669", fontSize: "0.75rem", fontWeight: 600 }}>Active at /store/*.json</small>
            </div>

            <div style={{ background: "#FAF8F5", padding: "1rem 1.2rem", borderRadius: "10px", border: "1px solid #D5CEBF" }}>
              <span style={{ fontSize: "0.75rem", color: "#6A6359", fontWeight: 700, textTransform: "uppercase" }}>Auto-Backup Engine</span>
              <div style={{ fontSize: "1rem", fontWeight: 800, color: "#1E1E1E", marginTop: "4px" }}>Dual-Disk & Cloud Snapshot</div>
              <small style={{ color: "#6A6359", fontSize: "0.75rem" }}>Auto-saved on every edit</small>
            </div>

            <div style={{ background: "#FAF8F5", padding: "1rem 1.2rem", borderRadius: "10px", border: "1px solid #D5CEBF" }}>
              <span style={{ fontSize: "0.75rem", color: "#6A6359", fontWeight: 700, textTransform: "uppercase" }}>Available Backup Files</span>
              <div style={{ fontSize: "1rem", fontWeight: 800, color: "#81663F", marginTop: "4px" }}>{backupsCount} Revisions Available</div>
              <small style={{ color: "#6A6359", fontSize: "0.75rem" }}>Stored in data/backups/</small>
            </div>
          </div>
        </div>

        {/* CMS MODULES GRID */}
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1.5rem", borderBottom: "1px solid #DCD5C6", paddingBottom: "0.8rem", color: "#81663F" }}>
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
                  background: "#FFFFFF",
                  border: "1px solid #E2DCD2",
                  borderRadius: "14px",
                  padding: "1.6rem",
                  textDecoration: "none",
                  color: "#1E1E1E",
                  transition: "all 0.2s ease-in-out",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.6rem" }}>
                    <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "rgba(129, 102, 63, 0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={18} color="#81663F" />
                    </div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1E1E1E" }}>{m.title}</div>
                  </div>
                  <p style={{ color: "#555555", fontSize: "0.88rem", lineHeight: 1.5, margin: 0 }}>{m.desc}</p>
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
            background: "#1E1E1E",
            color: "#FFFFFF",
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
