"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AdminNav from "@/components/AdminNav";
import { BrandFolderItem, BrandFolderPdf } from "@/lib/types";
import { generateQrWithLogo, downloadQrCanvas, BRAND_LOGOS } from "@/utils/qrWithLogo";
import {
  FileText, Plus, Trash2, Edit, ExternalLink,
  RefreshCw, Search, Upload, Check, QrCode,
  Download, Copy, X, ArrowUp, ArrowDown,
  Building2, AlertCircle,
} from "lucide-react";

// ─── Shared style tokens ───────────────────────────────────────
const C = {
  gold: "#81663F", goldDark: "#684F2E", goldLight: "#E8DFC8",
  bg: "#F7F5F0", white: "#FFFFFF", text: "#1E1E1E",
  textMuted: "#6A6359", textFaint: "#8A8275",
  border: "#E4DCCE", borderLight: "#D5CEBF",
  surface: "#FAF8F5", accent: "#B89C74",
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 14px", borderRadius: 12,
  border: `1px solid ${C.borderLight}`, backgroundColor: C.surface,
  fontSize: 13, color: C.text, outline: "none", boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 10, fontWeight: 700,
  textTransform: "uppercase", letterSpacing: "0.1em",
  color: C.textMuted, marginBottom: 6,
};

const btnGold: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6,
  padding: "8px 16px", borderRadius: 12, backgroundColor: C.gold,
  color: C.white, fontSize: 12, fontWeight: 600, border: "none",
  cursor: "pointer", whiteSpace: "nowrap" as const, textDecoration: "none",
};

const btnOutline: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6,
  padding: "8px 14px", borderRadius: 12, backgroundColor: C.white,
  color: C.textMuted, fontSize: 12, fontWeight: 500,
  border: `1px solid ${C.borderLight}`, cursor: "pointer",
  whiteSpace: "nowrap" as const, textDecoration: "none",
};

export default function AdminBrandDownloadsPage() {
  return (
    <Suspense fallback={<div style={{ padding: 32, textAlign: "center", color: C.gold }}>Loading...</div>}>
      <AdminBrandDownloadsContent />
    </Suspense>
  );
}

function AdminBrandDownloadsContent() {
  const router = useRouter();
  const [brands, setBrands] = useState<BrandFolderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [editingBrand, setEditingBrand] = useState<BrandFolderItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [savingBrand, setSavingBrand] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [deletingBrand, setDeletingBrand] = useState<string | null>(null);
  const [qrModal, setQrModal] = useState<{ isOpen: boolean; brand: BrandFolderItem; url: string } | null>(null);
  const [copiedQr, setCopiedQr] = useState(false);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const session = cookies.find((r) => r.startsWith("aaren_admin_session="));
    if (!session || !session.includes("authenticated")) router.push("/admin/login");
  }, [router]);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/brand-downloads?t=${Date.now()}`, { cache: "no-store" });
      if (res.ok) { const json = await res.json(); if (json.success && Array.isArray(json.data)) setBrands(json.data); }
    } catch { showToast("Failed to load brand folders", "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBrands(); }, []);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type }); setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (qrModal && qrCanvasRef.current) {
      const match = BRAND_LOGOS.find((b) => qrModal.brand.name.toLowerCase().includes(b.name.toLowerCase()));
      generateQrWithLogo(qrCanvasRef.current, {
        url: qrModal.url, size: 1000, color: "#1E1E1E", bgColor: "#FFFFFF",
        logoType: match ? "brand" : "aaren", logoUrl: match?.file,
        brandName: qrModal.brand.name, logoShape: "rounded", badgeBorderColor: C.gold,
      }).catch(() => {});
    }
  }, [qrModal]);

  const filteredBrands = brands.filter((b) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return b.name.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q);
  });
  const totalPdfs = brands.reduce((acc, b) => acc + (b.files?.length || 0), 0);

  const handleOpenEdit = (brand: BrandFolderItem) => { setEditingBrand(JSON.parse(JSON.stringify(brand))); setIsDrawerOpen(true); };
  const handleCloseDrawer = () => { if (!savingBrand && !uploadingBanner && !uploadingPdf && !uploadingLogo) { setEditingBrand(null); setIsDrawerOpen(false); } };

  const handleAddNewBrand = () => {
    setEditingBrand({ id: `bf-new-${Date.now()}`, name: "New Brand", slug: `new-brand-${Date.now()}`, description: "", tagline: "", bannerImageUrl: undefined, logoUrl: undefined, files: [], ctaButtons: [] });
    setIsDrawerOpen(true);
  };

  const handleDeleteBrand = async (brand: BrandFolderItem) => {
    if (!confirm(`Delete "${brand.name}"? This cannot be undone.`)) return;
    setDeletingBrand(brand.id || brand.slug);
    try {
      const res = await fetch(`/api/admin/brand-downloads?id=${encodeURIComponent(brand.id || brand.slug)}`, { method: "DELETE" });
      const json = await res.json();
      if (res.ok && json.success) { showToast(`"${brand.name}" deleted.`); fetchBrands(); }
      else showToast(json.error || "Delete failed", "error");
    } catch (err: any) { showToast(err.message || "Delete failed", "error"); }
    finally { setDeletingBrand(null); }
  };

  const doUpload = async (file: File, type: "banner" | "pdf" | "logo") => {
    const folder = type === "pdf" ? "aaren_brand_catalogs" : type === "logo" ? "aaren_brand_logos" : "aaren_brand_banners";
    const formData = new FormData();
    formData.append("file", file); formData.append("type", type === "pdf" ? "pdf" : "banner"); formData.append("folder", folder);
    const res = await fetch("/api/admin/brand-downloads/upload", { method: "POST", body: formData });
    return res.json();
  };

  const handleBannerFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file || !editingBrand) return;
    setUploadingBanner(true);
    try { const json = await doUpload(file, "banner"); if (json.success) { setEditingBrand({ ...editingBrand, bannerImageUrl: json.url }); showToast("Banner uploaded!"); } else showToast(json.error || "Failed", "error"); }
    catch (err: any) { showToast(err.message, "error"); } finally { setUploadingBanner(false); if (bannerInputRef.current) bannerInputRef.current.value = ""; }
  };

  const handleLogoFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file || !editingBrand) return;
    setUploadingLogo(true);
    try { const json = await doUpload(file, "logo"); if (json.success) { setEditingBrand({ ...editingBrand, logoUrl: json.url }); showToast("Logo uploaded!"); } else showToast(json.error || "Failed", "error"); }
    catch (err: any) { showToast(err.message, "error"); } finally { setUploadingLogo(false); if (logoInputRef.current) logoInputRef.current.value = ""; }
  };

  const handlePdfFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file || !editingBrand) return;
    setUploadingPdf(true);
    try {
      const json = await doUpload(file, "pdf");
      if (json.success) {
        const cleanTitle = file.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " ");
        const newPdf: BrandFolderPdf = { name: cleanTitle, url: json.url, publicId: json.publicId, order: (editingBrand.files?.length || 0) + 1, fileSize: json.fileSize || "PDF" };
        setEditingBrand({ ...editingBrand, files: [...(editingBrand.files || []), newPdf] }); showToast(`Added "${cleanTitle}"!`);
      } else showToast(json.error || "Failed", "error");
    } catch (err: any) { showToast(err.message, "error"); } finally { setUploadingPdf(false); if (pdfInputRef.current) pdfInputRef.current.value = ""; }
  };

  const handleMovePdf = (index: number, dir: "up" | "down") => {
    if (!editingBrand?.files) return;
    const f = [...editingBrand.files]; const t = dir === "up" ? index - 1 : index + 1;
    if (t < 0 || t >= f.length) return;
    [f[index], f[t]] = [f[t], f[index]]; f.forEach((x, i) => { x.order = i + 1; });
    setEditingBrand({ ...editingBrand, files: f });
  };

  const handleDeletePdf = (index: number) => {
    if (!editingBrand?.files) return;
    const f = editingBrand.files.filter((_, i) => i !== index); f.forEach((x, i) => { x.order = i + 1; });
    setEditingBrand({ ...editingBrand, files: f });
  };

  const handlePdfTitleChange = (index: number, title: string) => {
    if (!editingBrand?.files) return;
    const f = [...editingBrand.files]; f[index] = { ...f[index], name: title }; setEditingBrand({ ...editingBrand, files: f });
  };

  const handleAddCta = () => {
    if (!editingBrand) return; const cur = editingBrand.ctaButtons || [];
    if (cur.length >= 3) { showToast("Max 3 CTA buttons", "error"); return; }
    setEditingBrand({ ...editingBrand, ctaButtons: [...cur, { label: "Explore Projects", destination: "/projects" }] });
  };

  const handleRemoveCta = (i: number) => { if (!editingBrand?.ctaButtons) return; setEditingBrand({ ...editingBrand, ctaButtons: editingBrand.ctaButtons.filter((_, j) => j !== i) }); };
  const handleUpdateCta = (i: number, field: "label" | "destination", val: string) => {
    if (!editingBrand?.ctaButtons) return; const c = [...editingBrand.ctaButtons]; c[i] = { ...c[i], [field]: val }; setEditingBrand({ ...editingBrand, ctaButtons: c });
  };

  const handleSaveBrand = async () => {
    if (!editingBrand) return;
    if (!editingBrand.name.trim()) { showToast("Brand name required", "error"); return; }
    if (!editingBrand.slug.trim()) { showToast("Slug required", "error"); return; }
    setSavingBrand(true);
    try {
      const res = await fetch("/api/admin/brand-downloads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingBrand) });
      const json = await res.json();
      if (res.ok && json.success) { showToast(`Saved ${editingBrand.name}!`); setIsDrawerOpen(false); setEditingBrand(null); fetchBrands(); }
      else showToast(json.error || "Save failed", "error");
    } catch (err: any) { showToast(err.message || "Save failed", "error"); } finally { setSavingBrand(false); }
  };

  const handleOpenQrModal = (brand: BrandFolderItem) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://aarenstudio.vercel.app";
    setQrModal({ isOpen: true, brand, url: `${origin}/downloads/${brand.slug}` }); setCopiedQr(false);
  };

  const handleCopyUrl = async () => {
    if (!qrModal) return;
    try { await navigator.clipboard.writeText(qrModal.url); setCopiedQr(true); setTimeout(() => setCopiedQr(false), 2000); showToast("URL copied!"); } catch {}
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: C.bg, color: C.text }}>
      <AdminNav />
      <div style={{ flex: 1, overflowX: "hidden", padding: "40px 32px", marginLeft: 256 }}>

        {/* Toast */}
        {toast && (
          <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", borderRadius: 14, backgroundColor: toast.type === "success" ? C.text : "#7F1D1D", color: C.white, fontSize: 13, fontWeight: 500, border: `1px solid ${toast.type === "success" ? C.gold : "#991B1B"}`, boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
            {toast.type === "success" ? <Check style={{ width: 16, height: 16, color: C.accent }} /> : <AlertCircle style={{ width: 16, height: 16, color: "#FCA5A5" }} />}
            {toast.message}
          </div>
        )}

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, paddingBottom: 32, borderBottom: `1px solid ${C.border}`, flexWrap: "wrap", marginBottom: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ padding: "2px 10px", borderRadius: 9999, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", backgroundColor: C.goldLight, color: C.gold }}>Digital Showroom CMS</span>
              <span style={{ fontSize: 11, color: C.textFaint }}>Cloudinary-Powered</span>
            </div>
            <h1 style={{ fontSize: 30, fontWeight: 700, color: C.text, margin: 0 }}>Brand Downloads &amp; QR Showrooms</h1>
            <p style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>Manage 20 luxury brands — banners, logos, PDF catalogs, QR codes, CTA buttons.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <button onClick={fetchBrands} style={btnOutline}>
              <RefreshCw style={{ width: 14, height: 14 }} /> Refresh
            </button>
            <button onClick={handleAddNewBrand} style={{ ...btnGold, backgroundColor: "#1E1E1E" }}>
              <Plus style={{ width: 14, height: 14 }} /> Add Brand
            </button>
            <Link href="/admin/qr-code" style={btnGold}>
              <QrCode style={{ width: 14, height: 14 }} /> QR Studio
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Total Brands", value: String(brands.length), sub: "All verified & seeded" },
            { label: "Total PDFs", value: String(totalPdfs), sub: "Cloudinary downloads" },
            { label: "URL Format", value: "/downloads/[slug]", sub: "QRCodeChimp luxury layout", mono: true },
          ].map((s) => (
            <div key={s.label} style={{ backgroundColor: C.white, padding: 20, borderRadius: 16, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.gold }}>{s.label}</div>
              <div style={{ fontSize: s.mono ? 12 : 28, fontWeight: 700, color: C.text, marginTop: 4, fontFamily: s.mono ? "monospace" : undefined, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: C.textFaint, marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 20 }}>
          <div style={{ position: "relative", flex: 1, maxWidth: 400 }}>
            <Search style={{ width: 14, height: 14, color: C.textFaint, position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
            <input type="text" placeholder="Search brands or slugs..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ ...inputStyle, paddingLeft: 38 }} />
          </div>
          <span style={{ fontSize: 12, color: C.textFaint }}>Showing {filteredBrands.length} of {brands.length}</span>
        </div>

        {/* Brand Grid */}
        {loading ? (
          <div style={{ padding: "80px 0", textAlign: "center", color: C.gold }}>
            <RefreshCw style={{ width: 24, height: 24, margin: "0 auto 8px" }} />
            <div style={{ fontSize: 13, fontWeight: 500 }}>Loading Brand Folders...</div>
          </div>
        ) : filteredBrands.length === 0 ? (
          <div style={{ backgroundColor: C.white, borderRadius: 20, border: `1px solid ${C.border}`, padding: 48, textAlign: "center" }}>
            <Building2 style={{ width: 40, height: 40, color: C.accent, margin: "0 auto 12px", strokeWidth: 1.5 }} />
            <div style={{ fontSize: 16, fontWeight: 600 }}>No brands found</div>
            <div style={{ fontSize: 12, color: C.textFaint, marginTop: 4 }}>Try a different search or click "Add Brand".</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 20 }}>
            {filteredBrands.map((brand, idx) => {
              const count = brand.files?.length || 0;
              const isDeleting = deletingBrand === (brand.id || brand.slug);
              return (
                <div key={brand.id} style={{ backgroundColor: C.white, borderRadius: 20, border: `1px solid ${C.border}`, overflow: "hidden", display: "flex", flexDirection: "column", opacity: isDeleting ? 0.5 : 1 }}>
                  {/* Banner */}
                  <div style={{ position: "relative", width: "100%", paddingTop: "43.75%", backgroundColor: "#EAE4D9", overflow: "hidden" }}>
                    {brand.bannerImageUrl
                      ? <Image src={brand.bannerImageUrl} alt={brand.name} fill sizes="400px" style={{ objectFit: "cover" }} />
                      : <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#F3EDE3" }}><Building2 style={{ width: 32, height: 32, color: C.accent, strokeWidth: 1.5 }} /></div>
                    }
                    <div style={{ position: "absolute", top: 10, right: 10, padding: "2px 8px", borderRadius: 9999, fontSize: 10, fontWeight: 700, backgroundColor: "rgba(0,0,0,0.7)", color: "#fff" }}>#{idx + 1}</div>
                    {brand.logoUrl && (
                      <div style={{ position: "absolute", bottom: 8, left: 10, width: 48, height: 24, backgroundColor: "#fff", borderRadius: 6, overflow: "hidden", padding: 3, boxSizing: "border-box" }}>
                        <Image src={brand.logoUrl} alt="" fill sizes="48px" style={{ objectFit: "contain" }} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: "16px 20px", flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                      <div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: 0 }}>{brand.name}</h3>
                        <div style={{ fontSize: 11, fontFamily: "monospace", color: C.gold, marginTop: 2 }}>/downloads/{brand.slug}</div>
                      </div>
                      <span style={{ padding: "2px 10px", borderRadius: 9999, fontSize: 11, fontWeight: 600, flexShrink: 0, backgroundColor: count > 0 ? "#EAF3EA" : "#F7EFE2", color: count > 0 ? "#2E6A38" : C.gold, border: `1px solid ${count > 0 ? "#D0E6D2" : "#EADAC5"}` }}>
                        {count} {count === 1 ? "PDF" : "PDFs"}
                      </span>
                    </div>
                    {brand.description && <p style={{ fontSize: 12, color: C.textMuted, marginTop: 8, lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any, overflow: "hidden" }}>{brand.description}</p>}
                  </div>

                  {/* Actions */}
                  <div style={{ padding: "12px 20px", backgroundColor: C.surface, borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <Link href={`/downloads/${brand.slug}`} target="_blank" style={{ fontSize: 11, fontWeight: 600, color: C.gold, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                      Showroom <ExternalLink style={{ width: 11, height: 11 }} />
                    </Link>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={() => handleOpenQrModal(brand)} style={{ ...btnOutline, padding: "5px 10px" }}>
                        <QrCode style={{ width: 13, height: 13, color: C.gold }} /> <span style={{ fontSize: 11 }}>QR</span>
                      </button>
                      <button onClick={() => handleDeleteBrand(brand)} disabled={isDeleting} style={{ padding: "6px 8px", borderRadius: 10, border: "1px solid #FCA5A5", backgroundColor: C.white, color: "#DC2626", cursor: "pointer", opacity: isDeleting ? 0.4 : 1 }}>
                        <Trash2 style={{ width: 13, height: 13 }} />
                      </button>
                      <button onClick={() => handleOpenEdit(brand)} style={{ ...btnGold, padding: "6px 12px", fontSize: 11 }}>
                        <Edit style={{ width: 13, height: 13 }} /> Manage
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══ EDIT MODAL ══ */}
        {isDrawerOpen && editingBrand && (
          <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
            <div style={{ backgroundColor: C.white, width: "100%", maxWidth: 680, maxHeight: "92vh", borderRadius: 24, boxShadow: "0 24px 64px rgba(0,0,0,0.25)", border: `1px solid ${C.borderLight}`, display: "flex", flexDirection: "column", overflow: "hidden" }}>

              {/* Modal header */}
              <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: C.surface, flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: C.gold, display: "inline-block" }} />
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: 0 }}>
                    {editingBrand.id?.startsWith("bf-new-") ? "Add New Brand" : `Edit: ${editingBrand.name}`}
                  </h2>
                </div>
                <button onClick={handleCloseDrawer} style={{ width: 32, height: 32, borderRadius: "50%", border: "none", backgroundColor: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.textMuted }}>
                  <X style={{ width: 18, height: 18 }} />
                </button>
              </div>

              {/* Modal body */}
              <div style={{ padding: 24, overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>

                {/* Name + Slug */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Brand Name *</label>
                    <input style={inputStyle} value={editingBrand.name} onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })} />
                  </div>
                  <div>
                    <label style={labelStyle}>Clean Slug *</label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: C.textFaint, fontFamily: "monospace", pointerEvents: "none" }}>/downloads/</span>
                      <input style={{ ...inputStyle, paddingLeft: 100, fontFamily: "monospace", color: C.gold, fontWeight: 600 }}
                        value={editingBrand.slug}
                        onChange={(e) => setEditingBrand({ ...editingBrand, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} />
                    </div>
                  </div>
                </div>

                {/* Tagline */}
                <div>
                  <label style={labelStyle}>Short Tagline (Mobile Showroom Subtitle)</label>
                  <input style={inputStyle} value={editingBrand.tagline || ""} onChange={(e) => setEditingBrand({ ...editingBrand, tagline: e.target.value })} placeholder="e.g. Official Catalogues & Specifications" />
                </div>

                {/* Description */}
                <div>
                  <label style={labelStyle}>Brand Description</label>
                  <textarea rows={3} style={{ ...inputStyle, resize: "vertical" } as React.CSSProperties} value={editingBrand.description || ""} onChange={(e) => setEditingBrand({ ...editingBrand, description: e.target.value })} placeholder="Describe the brand..." />
                </div>

                {/* Hero Banner */}
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
                  <label style={labelStyle}>Hero Banner Image (Cloudinary — 10MB max)</label>
                  <div style={{ position: "relative", width: "100%", paddingTop: "43.75%", borderRadius: 12, border: `1px solid ${C.borderLight}`, overflow: "hidden", backgroundColor: "#F3EDE3" }}>
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {editingBrand.bannerImageUrl
                        ? <Image src={editingBrand.bannerImageUrl} alt="Banner" fill style={{ objectFit: "cover" }} />
                        : <div style={{ textAlign: "center", color: C.textFaint }}><Building2 style={{ width: 28, height: 28, margin: "0 auto 4px" }} /><div style={{ fontSize: 11 }}>No banner uploaded</div></div>
                      }
                      {uploadingBanner && <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: C.white, fontSize: 12 }}><RefreshCw style={{ width: 16, height: 16 }} /> Uploading...</div>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                    <input ref={bannerInputRef} type="file" accept="image/*" onChange={handleBannerFileSelected} style={{ display: "none" }} />
                    <button type="button" disabled={uploadingBanner} onClick={() => bannerInputRef.current?.click()} style={btnOutline}><Upload style={{ width: 13, height: 13, color: C.gold }} /> {editingBrand.bannerImageUrl ? "Replace Banner" : "Upload Banner"}</button>
                    {editingBrand.bannerImageUrl && <button type="button" onClick={() => setEditingBrand({ ...editingBrand, bannerImageUrl: undefined })} style={{ fontSize: 12, color: "#DC2626", background: "none", border: "none", cursor: "pointer" }}>Remove</button>}
                  </div>
                </div>

                {/* Brand Logo */}
                <div>
                  <label style={labelStyle}>Brand Logo (Shown on Hub Card)</label>
                  <div style={{ position: "relative", height: 80, borderRadius: 12, border: `1px solid ${C.borderLight}`, overflow: "hidden", backgroundColor: "#F3EDE3", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {editingBrand.logoUrl ? <Image src={editingBrand.logoUrl} alt="Logo" fill style={{ objectFit: "contain", padding: 12 }} /> : <span style={{ fontSize: 12, color: C.textFaint }}>No logo uploaded</span>}
                    {uploadingLogo && <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: C.white, fontSize: 12 }}><RefreshCw style={{ width: 14, height: 14 }} /> Uploading...</div>}
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                    <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoFileSelected} style={{ display: "none" }} />
                    <button type="button" disabled={uploadingLogo} onClick={() => logoInputRef.current?.click()} style={btnOutline}><Upload style={{ width: 13, height: 13, color: C.gold }} /> {editingBrand.logoUrl ? "Replace Logo" : "Upload Logo"}</button>
                    {editingBrand.logoUrl && <button type="button" onClick={() => setEditingBrand({ ...editingBrand, logoUrl: undefined })} style={{ fontSize: 12, color: "#DC2626", background: "none", border: "none", cursor: "pointer" }}>Remove</button>}
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <label style={{ ...labelStyle, marginBottom: 4 }}>Or paste logo URL directly</label>
                    <input type="url" style={{ ...inputStyle, fontFamily: "monospace", fontSize: 12, color: C.gold }} value={editingBrand.logoUrl || ""} onChange={(e) => setEditingBrand({ ...editingBrand, logoUrl: e.target.value })} placeholder="https://cdn.example.com/logo.png" />
                  </div>
                </div>

                {/* PDFs */}
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div>
                      <h4 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: 0 }}>PDF Catalogs &amp; Specifications</h4>
                      <p style={{ fontSize: 11, color: C.textFaint, marginTop: 2 }}>Served from Cloudinary (30MB max per file)</p>
                    </div>
                    <div>
                      <input ref={pdfInputRef} type="file" accept="application/pdf" onChange={handlePdfFileSelected} style={{ display: "none" }} />
                      <button type="button" disabled={uploadingPdf} onClick={() => pdfInputRef.current?.click()} style={btnGold}>
                        {uploadingPdf ? <><RefreshCw style={{ width: 13, height: 13 }} /> Uploading...</> : <><Plus style={{ width: 13, height: 13 }} /> Add PDF</>}
                      </button>
                    </div>
                  </div>
                  {!editingBrand.files?.length ? (
                    <div style={{ padding: 24, borderRadius: 16, border: `2px dashed ${C.borderLight}`, backgroundColor: C.surface, textAlign: "center" }}>
                      <FileText style={{ width: 28, height: 28, color: C.accent, margin: "0 auto 6px", strokeWidth: 1.5 }} />
                      <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>No PDFs yet</div>
                      <p style={{ fontSize: 11, color: C.textFaint, marginTop: 4 }}>Click "Add PDF" to upload to Cloudinary.</p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {editingBrand.files.map((file, fIdx) => (
                        <div key={`${file.url}-${fIdx}`} style={{ padding: 12, backgroundColor: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 10, fontFamily: "monospace", fontWeight: 700, color: C.gold, flexShrink: 0 }}>#{fIdx + 1}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <input type="text" value={file.name} onChange={(e) => handlePdfTitleChange(fIdx, e.target.value)} style={{ ...inputStyle, fontSize: 12, padding: "6px 10px" }} placeholder="PDF Title" />
                            <div style={{ display: "flex", gap: 8, marginTop: 4, fontSize: 11, color: C.textFaint }}>
                              <span>{file.fileSize || "PDF"}</span>
                              <span>·</span>
                              <a href={file.url} target="_blank" rel="noopener noreferrer" style={{ color: C.gold, textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>Preview <ExternalLink style={{ width: 10, height: 10 }} /></a>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                            <button type="button" disabled={fIdx === 0} onClick={() => handleMovePdf(fIdx, "up")} style={{ ...btnOutline, padding: "4px 8px", opacity: fIdx === 0 ? 0.3 : 1 }}><ArrowUp style={{ width: 12, height: 12 }} /></button>
                            <button type="button" disabled={fIdx === (editingBrand.files?.length || 0) - 1} onClick={() => handleMovePdf(fIdx, "down")} style={{ ...btnOutline, padding: "4px 8px", opacity: fIdx === (editingBrand.files?.length || 0) - 1 ? 0.3 : 1 }}><ArrowDown style={{ width: 12, height: 12 }} /></button>
                            <button type="button" onClick={() => handleDeletePdf(fIdx)} style={{ padding: "4px 8px", borderRadius: 8, border: "1px solid #FCA5A5", backgroundColor: C.white, color: "#DC2626", cursor: "pointer" }}><Trash2 style={{ width: 12, height: 12 }} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* CTA Buttons */}
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div>
                      <h4 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: 0 }}>Optional CTA Buttons (max 3)</h4>
                      <p style={{ fontSize: 11, color: C.textFaint, marginTop: 2 }}>Action buttons shown on mobile showroom below resources.</p>
                    </div>
                    {(!editingBrand.ctaButtons || editingBrand.ctaButtons.length < 3) && (
                      <button type="button" onClick={handleAddCta} style={btnOutline}><Plus style={{ width: 13, height: 13, color: C.gold }} /> Add Button</button>
                    )}
                  </div>
                  {!editingBrand.ctaButtons?.length ? (
                    <div style={{ padding: 14, borderRadius: 12, border: `2px dashed ${C.borderLight}`, backgroundColor: C.surface, textAlign: "center", fontSize: 12, color: C.textFaint }}>No CTA buttons configured.</div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {editingBrand.ctaButtons.map((cta, cIdx) => (
                        <div key={cIdx} style={{ padding: 12, backgroundColor: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 10, fontFamily: "monospace", fontWeight: 700, color: C.gold }}>#{cIdx + 1}</span>
                          <input type="text" value={cta.label} onChange={(e) => handleUpdateCta(cIdx, "label", e.target.value)} placeholder="Button Label" style={{ ...inputStyle, flex: 1, minWidth: 120, padding: "6px 10px", fontSize: 12 }} />
                          <input type="text" value={cta.destination} onChange={(e) => handleUpdateCta(cIdx, "destination", e.target.value)} placeholder="/projects or URL" style={{ ...inputStyle, flex: 1, minWidth: 140, padding: "6px 10px", fontSize: 12, fontFamily: "monospace" }} />
                          <button type="button" onClick={() => handleRemoveCta(cIdx)} style={{ padding: "6px 8px", borderRadius: 8, border: "1px solid #FCA5A5", backgroundColor: C.white, color: "#DC2626", cursor: "pointer" }}><Trash2 style={{ width: 12, height: 12 }} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Modal footer */}
              <div style={{ padding: "14px 24px", borderTop: `1px solid ${C.border}`, backgroundColor: C.surface, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                <Link href={`/downloads/${editingBrand.slug}`} target="_blank" style={{ fontSize: 12, fontWeight: 600, color: C.gold, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                  Test Public Link <ExternalLink style={{ width: 12, height: 12 }} />
                </Link>
                <div style={{ display: "flex", gap: 10 }}>
                  <button type="button" disabled={savingBrand} onClick={handleCloseDrawer} style={btnOutline}>Cancel</button>
                  <button type="button" disabled={savingBrand} onClick={handleSaveBrand} style={btnGold}>
                    {savingBrand ? <><RefreshCw style={{ width: 13, height: 13 }} /> Saving...</> : <><Check style={{ width: 13, height: 13 }} /> Save Changes</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ QR MODAL ══ */}
        {qrModal?.isOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
            <div style={{ backgroundColor: C.white, width: "100%", maxWidth: 400, borderRadius: 24, boxShadow: "0 24px 64px rgba(0,0,0,0.25)", border: `1px solid ${C.borderLight}`, padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <span style={{ padding: "3px 12px", borderRadius: 9999, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", backgroundColor: "#F0EAE1", color: C.gold }}>Branded QR Code</span>
                <button onClick={() => setQrModal(null)} style={{ width: 30, height: 30, borderRadius: "50%", border: "none", backgroundColor: "transparent", cursor: "pointer", color: C.textMuted }}><X style={{ width: 16, height: 16 }} /></button>
              </div>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: 0 }}>{qrModal.brand.name}</h3>
                <p style={{ fontSize: 12, color: C.textFaint, marginTop: 4 }}>Scan to open the luxury digital showroom</p>
              </div>
              <div style={{ padding: 16, backgroundColor: C.white, borderRadius: 16, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <canvas ref={qrCanvasRef} style={{ width: 216, height: 216, maxWidth: "100%", borderRadius: 10 }} />
              </div>
              <div style={{ padding: 10, backgroundColor: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontFamily: "monospace", color: C.gold, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{qrModal.url}</span>
                <button onClick={handleCopyUrl} style={{ ...btnOutline, padding: "4px 10px", fontSize: 11, flexShrink: 0 }}>
                  {copiedQr ? <><Check style={{ width: 11, height: 11 }} /><span style={{ color: "#16A34A" }}>Copied</span></> : <><Copy style={{ width: 11, height: 11 }} /> Copy</>}
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <button onClick={() => { if (qrCanvasRef.current) { downloadQrCanvas(qrCanvasRef.current, `Aaren_${qrModal.brand.slug}_QR.png`); showToast("Downloaded!"); } }} style={{ ...btnGold, justifyContent: "center" }}>
                  <Download style={{ width: 13, height: 13 }} /> Download PNG
                </button>
                <Link href={`/admin/qr-code?url=${encodeURIComponent(qrModal.url)}&brand=${encodeURIComponent(qrModal.brand.name)}`} style={{ ...btnOutline, justifyContent: "center" }}>
                  <QrCode style={{ width: 13, height: 13, color: C.gold }} /> Full QR Studio
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
