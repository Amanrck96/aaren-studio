"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AdminNav from "@/components/AdminNav";
import { BrandFolderItem, BrandFolderPdf, CategoryFolderItem, CategoryFolderPdf } from "@/lib/types";
import { generateQrWithLogo, BRAND_LOGOS } from "@/utils/qrWithLogo";
import {
  FileText, Plus, Trash2, Edit, ExternalLink,
  RefreshCw, Search, Upload, Check, QrCode,
  Download, Copy, X, ArrowUp, ArrowDown,
  Building2, Layers, AlertCircle, Link2, Eye, ShieldCheck,
} from "lucide-react";
import { uploadFileToFirebase } from "@/lib/firebaseStorage";

function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

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
      <AdminDownloadsHubContent />
    </Suspense>
  );
}

function AdminDownloadsHubContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"brands" | "categories">("brands");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // ── Brand State ──
  const [brands, setBrands] = useState<BrandFolderItem[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [searchBrands, setSearchBrands] = useState("");
  const [editingBrand, setEditingBrand] = useState<BrandFolderItem | null>(null);
  const [isBrandDrawerOpen, setIsBrandDrawerOpen] = useState(false);
  const [savingBrand, setSavingBrand] = useState(false);
  const [uploadingBrandBanner, setUploadingBrandBanner] = useState(false);
  const [uploadingBrandPdf, setUploadingBrandPdf] = useState(false);
  const [uploadingBrandLogo, setUploadingBrandLogo] = useState(false);
  const [deletingBrand, setDeletingBrand] = useState<string | null>(null);
  const [linkBrandPdfTitle, setLinkBrandPdfTitle] = useState("");
  const [linkBrandPdfUrl, setLinkBrandPdfUrl] = useState("");
  const [qrModal, setQrModal] = useState<{ isOpen: boolean; brand: BrandFolderItem; url: string } | null>(null);
  const [copiedQr, setCopiedQr] = useState(false);

  // ── Category State ──
  const [categories, setCategories] = useState<CategoryFolderItem[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [searchCategories, setSearchCategories] = useState("");
  const [editingCategory, setEditingCategory] = useState<CategoryFolderItem | null>(null);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);
  const [uploadingCatBanner, setUploadingCatBanner] = useState(false);
  const [uploadingCatPdf, setUploadingCatPdf] = useState(false);
  const [uploadingCatLogo, setUploadingCatLogo] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);
  const [linkCatPdfTitle, setLinkCatPdfTitle] = useState("");
  const [linkCatPdfUrl, setLinkCatPdfUrl] = useState("");

  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const brandBannerRef = useRef<HTMLInputElement>(null);
  const brandPdfRef = useRef<HTMLInputElement>(null);
  const brandLogoRef = useRef<HTMLInputElement>(null);

  const catBannerRef = useRef<HTMLInputElement>(null);
  const catPdfRef = useRef<HTMLInputElement>(null);
  const catLogoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const session = cookies.find((r) => r.startsWith("aaren_admin_session="));
    if (!session || !session.includes("authenticated")) router.push("/admin/login");
  }, [router]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchBrands = async () => {
    setLoadingBrands(true);
    try {
      const res = await fetch(`/api/admin/brand-downloads?t=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) setBrands(json.data);
      }
    } catch {
      showToast("Failed to load brand folders", "error");
    } finally {
      setLoadingBrands(false);
    }
  };

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await fetch(`/api/admin/category-downloads?t=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) setCategories(json.data);
      }
    } catch {
      showToast("Failed to load category folders", "error");
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

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

  // ── Brand Handlers ──
  const filteredBrands = brands.filter((b) => {
    const q = searchBrands.toLowerCase().trim();
    if (!q) return true;
    return b.name.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q);
  });
  const totalBrandPdfs = brands.reduce((acc, b) => acc + (b.files?.length || 0), 0);
  const filteredBrandPdfs = filteredBrands.reduce((acc, b) => acc + (b.files?.length || 0), 0);

  const handleOpenEditBrand = (brand: BrandFolderItem) => {
    setEditingBrand(JSON.parse(JSON.stringify(brand)));
    setLinkBrandPdfTitle("");
    setLinkBrandPdfUrl("");
    setIsBrandDrawerOpen(true);
  };

  const handleCloseBrandDrawer = () => {
    if (!savingBrand && !uploadingBrandBanner && !uploadingBrandPdf && !uploadingBrandLogo) {
      setEditingBrand(null);
      setLinkBrandPdfTitle("");
      setLinkBrandPdfUrl("");
      setIsBrandDrawerOpen(false);
    }
  };

  const handleAddNewBrand = () => {
    setEditingBrand({
      id: `bf-new-${Date.now()}`,
      name: "New Brand",
      slug: `new-brand-${Date.now()}`,
      description: "",
      tagline: "",
      bannerImageUrl: undefined,
      logoUrl: undefined,
      files: [],
      ctaButtons: [],
    });
    setLinkBrandPdfTitle("");
    setLinkBrandPdfUrl("");
    setIsBrandDrawerOpen(true);
  };

  const handleDeleteBrand = async (brand: BrandFolderItem) => {
    if (
      !confirm(
        `Delete "${brand.name}" from Downloads page?\n\nNOTE: This will ONLY remove it from the Downloads page (/downloads) and will NOT affect any other page or main website brands.`
      )
    ) {
      return;
    }
    const targetId = brand.id || brand.slug;
    setDeletingBrand(targetId);
    try {
      const res = await fetch(`/api/admin/brand-downloads?id=${encodeURIComponent(targetId)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast(`"${brand.name}" deleted from Downloads.`);
        fetchBrands();
      } else {
        showToast(json.error || "Delete failed", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Delete failed", "error");
    } finally {
      setDeletingBrand(null);
    }
  };

  const doUploadBrand = async (file: File, type: "banner" | "pdf" | "logo") => {
    const folder = type === "pdf" ? "Brand_Assets" : "Brands";
    try {
      const fbResult = await uploadFileToFirebase(file, folder);
      if (fbResult && fbResult.url) {
        return {
          success: true,
          url: fbResult.url,
          fileName: fbResult.fileName || file.name,
          fileSize: formatBytes(file.size),
        };
      }
    } catch (_) {}
    return { success: false, error: "Upload failed" };
  };

  const handleBrandFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: "banner" | "pdf" | "logo") => {
    const file = e.target.files?.[0];
    if (!file || !editingBrand) return;
    if (type === "banner") setUploadingBrandBanner(true);
    else if (type === "pdf") setUploadingBrandPdf(true);
    else setUploadingBrandLogo(true);

    try {
      const res = await doUploadBrand(file, type);
      if (!res.success || !res.url) {
        showToast("Upload failed", "error");
        return;
      }
      if (type === "banner") {
        setEditingBrand({ ...editingBrand, bannerImageUrl: res.url });
        showToast("Banner uploaded!");
      } else if (type === "logo") {
        setEditingBrand({ ...editingBrand, logoUrl: res.url });
        showToast("Logo uploaded!");
      } else if (type === "pdf") {
        const newPdf: BrandFolderPdf = {
          name: (res.fileName || file.name).replace(/\.[^/.]+$/, ""),
          url: res.url,
          order: (editingBrand.files || []).length + 1,
          fileSize: res.fileSize || "PDF Document",
        };
        setEditingBrand({ ...editingBrand, files: [...(editingBrand.files || []), newPdf] });
        showToast("PDF added!");
      }
    } catch (err: any) {
      showToast(err.message || "Upload failed", "error");
    } finally {
      if (type === "banner") setUploadingBrandBanner(false);
      else if (type === "pdf") setUploadingBrandPdf(false);
      else setUploadingBrandLogo(false);
      e.target.value = "";
    }
  };

  const handleSaveBrand = async () => {
    if (!editingBrand) return;
    if (!editingBrand.name.trim()) {
      showToast("Brand name is required", "error");
      return;
    }
    const filesToSave = [...(editingBrand.files || [])];
    if (linkBrandPdfUrl.trim()) {
      const cleanUrl = linkBrandPdfUrl.trim();
      let defaultTitle = "Document";
      try {
        const u = new URL(cleanUrl);
        const pathPart = u.pathname.split("/").pop();
        if (pathPart) defaultTitle = pathPart.replace(/\.pdf$/i, "").replace(/[-_]/g, " ");
      } catch (_) {}
      const title = linkBrandPdfTitle.trim() || defaultTitle;
      filesToSave.push({ name: title, url: cleanUrl, order: filesToSave.length + 1, fileSize: "PDF Document" });
      setLinkBrandPdfTitle("");
      setLinkBrandPdfUrl("");
    }
    setSavingBrand(true);
    try {
      const res = await fetch("/api/admin/brand-downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editingBrand, files: filesToSave }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast(`Saved "${editingBrand.name}" successfully!`);
        setIsBrandDrawerOpen(false);
        setEditingBrand(null);
        await fetchBrands();
      } else {
        showToast(json.error || "Save failed", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Save failed", "error");
    } finally {
      setSavingBrand(false);
    }
  };

  // ── Category Handlers ──
  const filteredCategories = categories.filter((c) => {
    const q = searchCategories.toLowerCase().trim();
    if (!q) return true;
    return c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q);
  });
  const totalCatPdfs = categories.reduce((acc, c) => acc + (c.files?.length || 0), 0);
  const filteredCatPdfs = filteredCategories.reduce((acc, c) => acc + (c.files?.length || 0), 0);

  const handleOpenEditCategory = (cat: CategoryFolderItem) => {
    setEditingCategory(JSON.parse(JSON.stringify(cat)));
    setLinkCatPdfTitle("");
    setLinkCatPdfUrl("");
    setIsCategoryDrawerOpen(true);
  };

  const handleCloseCategoryDrawer = () => {
    if (!savingCategory && !uploadingCatBanner && !uploadingCatPdf && !uploadingCatLogo) {
      setEditingCategory(null);
      setLinkCatPdfTitle("");
      setLinkCatPdfUrl("");
      setIsCategoryDrawerOpen(false);
    }
  };

  const handleAddNewCategory = () => {
    setEditingCategory({
      id: `cf-new-${Date.now()}`,
      name: "New Category",
      slug: `new-category-${Date.now()}`,
      description: "",
      tagline: "",
      bannerImageUrl: undefined,
      logoUrl: undefined,
      files: [],
      ctaButtons: [],
    });
    setLinkCatPdfTitle("");
    setLinkCatPdfUrl("");
    setIsCategoryDrawerOpen(true);
  };

  const handleDeleteCategory = async (cat: CategoryFolderItem) => {
    if (
      !confirm(
        `Delete "${cat.name}" from Downloads page?\n\nNOTE: This will ONLY remove it from the Downloads page (/downloads) and will NOT affect any other page or main website categories.`
      )
    ) {
      return;
    }
    const targetId = cat.id || cat.slug;
    setDeletingCategory(targetId);
    try {
      const res = await fetch(`/api/admin/category-downloads?id=${encodeURIComponent(targetId)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast(`"${cat.name}" deleted from Downloads.`);
        fetchCategories();
      } else {
        showToast(json.error || "Delete failed", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Delete failed", "error");
    } finally {
      setDeletingCategory(null);
    }
  };

  const doUploadCat = async (file: File, type: "banner" | "pdf" | "logo") => {
    const folder = type === "pdf" ? "Category_Assets" : "Categories";
    try {
      const fbResult = await uploadFileToFirebase(file, folder);
      if (fbResult && fbResult.url) {
        return {
          success: true,
          url: fbResult.url,
          fileName: fbResult.fileName || file.name,
          fileSize: formatBytes(file.size),
        };
      }
    } catch (_) {}
    return { success: false, error: "Upload failed" };
  };

  const handleCatFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: "banner" | "pdf" | "logo") => {
    const file = e.target.files?.[0];
    if (!file || !editingCategory) return;
    if (type === "banner") setUploadingCatBanner(true);
    else if (type === "pdf") setUploadingCatPdf(true);
    else setUploadingCatLogo(true);

    try {
      const res = await doUploadCat(file, type);
      if (!res.success || !res.url) {
        showToast("Upload failed", "error");
        return;
      }
      if (type === "banner") {
        setEditingCategory({ ...editingCategory, bannerImageUrl: res.url });
        showToast("Banner uploaded!");
      } else if (type === "logo") {
        setEditingCategory({ ...editingCategory, logoUrl: res.url });
        showToast("Logo uploaded!");
      } else if (type === "pdf") {
        const newPdf: CategoryFolderPdf = {
          name: (res.fileName || file.name).replace(/\.[^/.]+$/, ""),
          url: res.url,
          order: (editingCategory.files || []).length + 1,
          fileSize: res.fileSize || "PDF Document",
        };
        setEditingCategory({ ...editingCategory, files: [...(editingCategory.files || []), newPdf] });
        showToast("PDF added!");
      }
    } catch (err: any) {
      showToast(err.message || "Upload failed", "error");
    } finally {
      if (type === "banner") setUploadingCatBanner(false);
      else if (type === "pdf") setUploadingCatPdf(false);
      else setUploadingCatLogo(false);
      e.target.value = "";
    }
  };

  const handleSaveCategory = async () => {
    if (!editingCategory) return;
    if (!editingCategory.name.trim()) {
      showToast("Category name is required", "error");
      return;
    }
    const filesToSave = [...(editingCategory.files || [])];
    if (linkCatPdfUrl.trim()) {
      const cleanUrl = linkCatPdfUrl.trim();
      let defaultTitle = "Document";
      try {
        const u = new URL(cleanUrl);
        const pathPart = u.pathname.split("/").pop();
        if (pathPart) defaultTitle = pathPart.replace(/\.pdf$/i, "").replace(/[-_]/g, " ");
      } catch (_) {}
      const title = linkCatPdfTitle.trim() || defaultTitle;
      filesToSave.push({ name: title, url: cleanUrl, order: filesToSave.length + 1, fileSize: "PDF Document" });
      setLinkCatPdfTitle("");
      setLinkCatPdfUrl("");
    }
    setSavingCategory(true);
    try {
      const res = await fetch("/api/admin/category-downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editingCategory, files: filesToSave }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast(`Saved "${editingCategory.name}" successfully!`);
        setIsCategoryDrawerOpen(false);
        setEditingCategory(null);
        await fetchCategories();
      } else {
        showToast(json.error || "Save failed", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Save failed", "error");
    } finally {
      setSavingCategory(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: C.bg, color: C.text }}>
      <AdminNav />
      <div style={{ flex: 1, overflowX: "hidden", padding: "40px 32px", marginLeft: 256 }}>
        {/* Toast Notification */}
        {toast && (
          <div
            style={{
              position: "fixed", bottom: 24, right: 24, zIndex: 9999,
              display: "flex", alignItems: "center", gap: 10,
              padding: "12px 20px", borderRadius: 14,
              backgroundColor: toast.type === "success" ? C.text : "#7F1D1D",
              color: C.white, fontSize: 13, fontWeight: 500,
              border: `1px solid ${toast.type === "success" ? C.gold : "#991B1B"}`,
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            }}
          >
            {toast.type === "success" ? <Check style={{ width: 16, height: 16, color: C.accent }} /> : <AlertCircle style={{ width: 16, height: 16, color: "#FCA5A5" }} />}
            {toast.message}
          </div>
        )}

        {/* ── ISOLATION ALERT BANNER ── */}
        <div
          style={{
            backgroundColor: "#FFFDF9",
            border: "1px solid #E4DCCE",
            borderRadius: 16,
            padding: "16px 20px",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 260, flex: 1 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                backgroundColor: "rgba(129, 102, 63, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: C.gold,
                flexShrink: 0,
              }}
            >
              <ShieldCheck style={{ width: 22, height: 22 }} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, display: "flex", alignItems: "center", gap: 8 }}>
                <span>Dedicated Downloads Showroom Control</span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: 9999,
                    backgroundColor: "#E8F5E9",
                    color: "#2E7D32",
                  }}
                >
                  Isolated System
                </span>
              </div>
              <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>
                This section manages the <strong>Brands ({brands.length})</strong> and <strong>Categories ({categories.length})</strong> shown on{" "}
                <a href="/downloads" target="_blank" rel="noopener noreferrer" style={{ color: C.gold, fontWeight: 600, textDecoration: "underline" }}>
                  https://aarenstudio.vercel.app/downloads
                </a>
                . Deleting or modifying anything here <strong>only affects the Downloads page</strong> and will NEVER delete or change items on the Main Website (Home, Products, Shop, Main Categories, Main Brands).
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <a href="/downloads" target="_blank" rel="noopener noreferrer" style={btnOutline}>
              <ExternalLink style={{ width: 13, height: 13, color: C.gold }} />
              <span>View Public /downloads</span>
            </a>
          </div>
        </div>

        {/* ── HEADER ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, paddingBottom: 24, flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ padding: "2px 10px", borderRadius: 9999, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", backgroundColor: C.goldLight, color: C.gold }}>
                Downloads Showroom CMS
              </span>
              <span style={{ fontSize: 11, color: C.textFaint }}>Brands {brands.length} &bull; Categories {categories.length}</span>
            </div>
            <h1 style={{ fontSize: 30, fontWeight: 700, color: C.text, margin: 0 }}>
              Downloads Hub &amp; PDF Catalogues
            </h1>
            <p style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>
              Manage all digital brand folders, architectural category downloads, PDF catalogues, and QR showrooms.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={() => {
                fetchBrands();
                fetchCategories();
              }}
              style={btnOutline}
            >
              <RefreshCw style={{ width: 14, height: 14 }} /> Refresh All
            </button>
            {activeTab === "brands" ? (
              <>
                <button onClick={handleAddNewBrand} style={{ ...btnGold, backgroundColor: "#1E1E1E" }}>
                  <Plus style={{ width: 14, height: 14 }} /> Add Brand
                </button>
                <Link href="/admin/qr-code" style={btnGold}>
                  <QrCode style={{ width: 14, height: 14 }} /> QR Studio
                </Link>
              </>
            ) : (
              <button onClick={handleAddNewCategory} style={{ ...btnGold, backgroundColor: "#1E1E1E" }}>
                <Plus style={{ width: 14, height: 14 }} /> Add Category Folder
              </button>
            )}
          </div>
        </div>

        {/* ── TOP TAB SWITCHER: BRANDS vs CATEGORIES ── */}
        <div
          role="tablist"
          aria-label="Downloads Manager Tabs"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            backgroundColor: "rgba(228, 220, 206, 0.4)",
            padding: 6,
            borderRadius: 16,
            marginBottom: 24,
            border: `1px solid ${C.border}`,
          }}
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "brands"}
            onClick={() => setActiveTab("brands")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 22px",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              transition: "all 0.25s ease",
              backgroundColor: activeTab === "brands" ? C.gold : "transparent",
              color: activeTab === "brands" ? C.white : C.textMuted,
              fontWeight: 700,
              fontSize: 14,
              boxShadow: activeTab === "brands" ? "0 4px 14px rgba(129, 102, 63, 0.3)" : "none",
            }}
          >
            <Building2 style={{ width: 16, height: 16 }} />
            <span>Brands</span>
            <span
              style={{
                fontSize: 11,
                padding: "2px 8px",
                borderRadius: 9999,
                backgroundColor: activeTab === "brands" ? "rgba(255, 255, 255, 0.25)" : "rgba(129, 102, 63, 0.12)",
                color: activeTab === "brands" ? C.white : C.gold,
                fontWeight: 700,
              }}
            >
              {brands.length}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "categories"}
            onClick={() => setActiveTab("categories")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 22px",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              transition: "all 0.25s ease",
              backgroundColor: activeTab === "categories" ? C.gold : "transparent",
              color: activeTab === "categories" ? C.white : C.textMuted,
              fontWeight: 700,
              fontSize: 14,
              boxShadow: activeTab === "categories" ? "0 4px 14px rgba(129, 102, 63, 0.3)" : "none",
            }}
          >
            <Layers style={{ width: 16, height: 16 }} />
            <span>Categories</span>
            <span
              style={{
                fontSize: 11,
                padding: "2px 8px",
                borderRadius: 9999,
                backgroundColor: activeTab === "categories" ? "rgba(255, 255, 255, 0.25)" : "rgba(129, 102, 63, 0.12)",
                color: activeTab === "categories" ? C.white : C.gold,
                fontWeight: 700,
              }}
            >
              {categories.length}
            </span>
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            TAB 1: BRANDS DOWNLOADS
            ══════════════════════════════════════════════════════════════ */}
        {activeTab === "brands" && (
          <div>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
              {[
                {
                  label: searchBrands.trim() ? "Matching Brands" : "Total Brands on Downloads",
                  value: searchBrands.trim() ? `${filteredBrands.length} / ${brands.length}` : String(brands.length),
                  sub: "Shown in 'Brands' tab on /downloads",
                },
                {
                  label: searchBrands.trim() ? "PDFs in Results" : "Total Brand Catalogues",
                  value: searchBrands.trim() ? `${filteredBrandPdfs} / ${totalBrandPdfs}` : String(totalBrandPdfs),
                  sub: "Downloadable PDF specifications",
                },
                {
                  label: "Public URL Format",
                  value: "/downloads/[slug]",
                  sub: "e.g. /downloads/waltz",
                  mono: true,
                },
              ].map((s) => (
                <div key={s.label} style={{ backgroundColor: C.white, padding: 20, borderRadius: 16, border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.gold }}>{s.label}</div>
                  <div style={{ fontSize: s.mono ? 13 : 28, fontWeight: 700, color: C.text, marginTop: 4, fontFamily: s.mono ? "monospace" : undefined }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: C.textFaint, marginTop: 2 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Search */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 20 }}>
              <div style={{ position: "relative", flex: 1, maxWidth: 400 }}>
                <Search style={{ width: 14, height: 14, color: C.textFaint, position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="text"
                  placeholder="Search brand name or slug..."
                  value={searchBrands}
                  onChange={(e) => setSearchBrands(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: 38 }}
                />
              </div>
              <span style={{ fontSize: 12, color: C.textFaint }}>
                Showing {filteredBrands.length} of {brands.length} brands ({filteredBrandPdfs} catalogues)
              </span>
            </div>

            {/* Grid */}
            {loadingBrands ? (
              <div style={{ padding: "80px 0", textAlign: "center", color: C.gold }}>
                <RefreshCw style={{ width: 24, height: 24, margin: "0 auto 8px" }} />
                <div style={{ fontSize: 13, fontWeight: 500 }}>Loading Brand Downloads...</div>
              </div>
            ) : filteredBrands.length === 0 ? (
              <div style={{ backgroundColor: C.white, borderRadius: 20, border: `1px solid ${C.border}`, padding: 48, textAlign: "center" }}>
                <Building2 style={{ width: 40, height: 40, color: C.accent, margin: "0 auto 12px", strokeWidth: 1.5 }} />
                <div style={{ fontSize: 16, fontWeight: 600 }}>No brand folders found</div>
                <div style={{ fontSize: 12, color: C.textFaint, marginTop: 4 }}>Try a different search or click "Add Brand".</div>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 20 }}>
                {filteredBrands.map((brand, idx) => {
                  const count = brand.files?.length || 0;
                  const isDeleting = deletingBrand === (brand.id || brand.slug);
                  return (
                    <div
                      key={brand.id || brand.slug}
                      style={{
                        backgroundColor: C.white,
                        borderRadius: 20,
                        border: `1px solid ${C.border}`,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        opacity: isDeleting ? 0.5 : 1,
                        transition: "all 0.2s ease",
                      }}
                    >
                      {/* Banner */}
                      <div style={{ position: "relative", width: "100%", paddingTop: "43.75%", backgroundColor: "#EAE4D9", overflow: "hidden" }}>
                        {brand.bannerImageUrl ? (
                          <Image src={brand.bannerImageUrl} alt={brand.name} fill sizes="400px" style={{ objectFit: "cover" }} />
                        ) : (
                          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#F3EDE3" }}>
                            <Building2 style={{ width: 32, height: 32, color: C.accent, strokeWidth: 1.5 }} />
                          </div>
                        )}
                        <div style={{ position: "absolute", top: 10, right: 10, padding: "2px 8px", borderRadius: 9999, fontSize: 10, fontWeight: 700, backgroundColor: "rgba(0,0,0,0.7)", color: "#fff" }}>
                          #{idx + 1}
                        </div>
                        {brand.logoUrl && (
                          <div style={{ position: "absolute", bottom: 10, left: 10, padding: 4, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.95)", border: `1px solid ${C.borderLight}` }}>
                            <div style={{ position: "relative", width: 50, height: 24 }}>
                              <Image src={brand.logoUrl} alt={brand.name} fill sizes="50px" style={{ objectFit: "contain" }} />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: C.text }}>{brand.name}</h3>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 9999, backgroundColor: count > 0 ? "rgba(129, 102, 63, 0.12)" : "rgba(0,0,0,0.05)", color: count > 0 ? C.gold : C.textFaint }}>
                            {count} {count === 1 ? "PDF" : "PDFs"}
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: C.textFaint, marginTop: 4, fontFamily: "monospace" }}>
                          /downloads/{brand.slug}
                        </div>
                        {brand.tagline && (
                          <p style={{ fontSize: 12, color: C.textMuted, marginTop: 6, marginBottom: 0, lineClamp: 2, WebkitLineClamp: 2, display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {brand.tagline}
                          </p>
                        )}

                        {/* Actions */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, marginTop: "auto", paddingTop: 14, borderTop: `1px solid ${C.borderLight}` }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <button onClick={() => handleOpenEditBrand(brand)} style={{ ...btnOutline, padding: "6px 12px", fontSize: 11 }}>
                              <Edit style={{ width: 12, height: 12 }} /> Edit
                            </button>
                            <button
                              onClick={() => {
                                const url = `${window.location.origin}/downloads/${brand.slug}`;
                                setQrModal({ isOpen: true, brand, url });
                              }}
                              style={{ ...btnOutline, padding: "6px 10px", fontSize: 11 }}
                              title="QR Code"
                            >
                              <QrCode style={{ width: 12, height: 12 }} />
                            </button>
                            <Link href={`/downloads/${brand.slug}`} target="_blank" style={{ ...btnOutline, padding: "6px 10px", fontSize: 11 }} title="View on Downloads">
                              <ExternalLink style={{ width: 12, height: 12 }} />
                            </Link>
                          </div>

                          <button
                            onClick={() => handleDeleteBrand(brand)}
                            disabled={isDeleting}
                            style={{
                              padding: "6px 10px",
                              borderRadius: 10,
                              backgroundColor: "rgba(220, 38, 38, 0.08)",
                              color: "#DC2626",
                              border: "1px solid rgba(220, 38, 38, 0.2)",
                              cursor: "pointer",
                              fontSize: 11,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                            title="Delete this brand from Downloads page"
                          >
                            <Trash2 style={{ width: 12, height: 12 }} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 2: CATEGORIES DOWNLOADS
            ══════════════════════════════════════════════════════════════ */}
        {activeTab === "categories" && (
          <div>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
              {[
                {
                  label: searchCategories.trim() ? "Matching Categories" : "Total Categories on Downloads",
                  value: searchCategories.trim() ? `${filteredCategories.length} / ${categories.length}` : String(categories.length),
                  sub: "Shown in 'Categories' tab on /downloads",
                },
                {
                  label: searchCategories.trim() ? "PDFs in Results" : "Total Category Catalogues",
                  value: searchCategories.trim() ? `${filteredCatPdfs} / ${totalCatPdfs}` : String(totalCatPdfs),
                  sub: "Downloadable PDF specifications",
                },
                {
                  label: "Public URL Format",
                  value: "/category-downloads/[slug]",
                  sub: "e.g. /category-downloads/wall-coverings",
                  mono: true,
                },
              ].map((s) => (
                <div key={s.label} style={{ backgroundColor: C.white, padding: 20, borderRadius: 16, border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.gold }}>{s.label}</div>
                  <div style={{ fontSize: s.mono ? 13 : 28, fontWeight: 700, color: C.text, marginTop: 4, fontFamily: s.mono ? "monospace" : undefined }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: C.textFaint, marginTop: 2 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Search */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 20 }}>
              <div style={{ position: "relative", flex: 1, maxWidth: 400 }}>
                <Search style={{ width: 14, height: 14, color: C.textFaint, position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="text"
                  placeholder="Search category name or slug..."
                  value={searchCategories}
                  onChange={(e) => setSearchCategories(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: 38 }}
                />
              </div>
              <span style={{ fontSize: 12, color: C.textFaint }}>
                Showing {filteredCategories.length} of {categories.length} categories ({filteredCatPdfs} catalogues)
              </span>
            </div>

            {/* Grid */}
            {loadingCategories ? (
              <div style={{ padding: "80px 0", textAlign: "center", color: C.gold }}>
                <RefreshCw style={{ width: 24, height: 24, margin: "0 auto 8px" }} />
                <div style={{ fontSize: 13, fontWeight: 500 }}>Loading Category Downloads...</div>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div style={{ backgroundColor: C.white, borderRadius: 20, border: `1px solid ${C.border}`, padding: 48, textAlign: "center" }}>
                <Layers style={{ width: 40, height: 40, color: C.accent, margin: "0 auto 12px", strokeWidth: 1.5 }} />
                <div style={{ fontSize: 16, fontWeight: 600 }}>No category folders found</div>
                <div style={{ fontSize: 12, color: C.textFaint, marginTop: 4 }}>Try a different search or click "Add Category Folder".</div>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 20 }}>
                {filteredCategories.map((cat, idx) => {
                  const count = cat.files?.length || 0;
                  const isDeleting = deletingCategory === (cat.id || cat.slug);
                  const displayCover = cat.logoUrl || cat.bannerImageUrl;
                  return (
                    <div
                      key={cat.id || cat.slug}
                      style={{
                        backgroundColor: C.white,
                        borderRadius: 20,
                        border: `1px solid ${C.border}`,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        opacity: isDeleting ? 0.5 : 1,
                        transition: "all 0.2s ease",
                      }}
                    >
                      {/* Banner / Cover */}
                      <div style={{ position: "relative", width: "100%", paddingTop: "43.75%", backgroundColor: "#EAE4D9", overflow: "hidden" }}>
                        {displayCover ? (
                          <Image src={displayCover} alt={cat.name} fill sizes="400px" style={{ objectFit: "cover" }} />
                        ) : (
                          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#F3EDE3" }}>
                            <Layers style={{ width: 32, height: 32, color: C.accent, strokeWidth: 1.5 }} />
                          </div>
                        )}
                        <div style={{ position: "absolute", top: 10, right: 10, padding: "2px 8px", borderRadius: 9999, fontSize: 10, fontWeight: 700, backgroundColor: "rgba(0,0,0,0.7)", color: "#fff" }}>
                          #{idx + 1}
                        </div>
                      </div>

                      {/* Info */}
                      <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: C.text }}>{cat.name}</h3>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 9999, backgroundColor: count > 0 ? "rgba(129, 102, 63, 0.12)" : "rgba(0,0,0,0.05)", color: count > 0 ? C.gold : C.textFaint }}>
                            {count} {count === 1 ? "PDF" : "PDFs"}
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: C.textFaint, marginTop: 4, fontFamily: "monospace" }}>
                          /category-downloads/{cat.slug}
                        </div>
                        {(cat.tagline || cat.description) && (
                          <p style={{ fontSize: 12, color: C.textMuted, marginTop: 6, marginBottom: 0, lineClamp: 2, WebkitLineClamp: 2, display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {cat.tagline || cat.description}
                          </p>
                        )}

                        {/* Actions */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, marginTop: "auto", paddingTop: 14, borderTop: `1px solid ${C.borderLight}` }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <button onClick={() => handleOpenEditCategory(cat)} style={{ ...btnOutline, padding: "6px 12px", fontSize: 11 }}>
                              <Edit style={{ width: 12, height: 12 }} /> Edit
                            </button>
                            <Link href={`/category-downloads/${cat.slug}`} target="_blank" style={{ ...btnOutline, padding: "6px 10px", fontSize: 11 }} title="View on Downloads">
                              <ExternalLink style={{ width: 12, height: 12 }} />
                            </Link>
                          </div>

                          <button
                            onClick={() => handleDeleteCategory(cat)}
                            disabled={isDeleting}
                            style={{
                              padding: "6px 10px",
                              borderRadius: 10,
                              backgroundColor: "rgba(220, 38, 38, 0.08)",
                              color: "#DC2626",
                              border: "1px solid rgba(220, 38, 38, 0.2)",
                              cursor: "pointer",
                              fontSize: 11,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                            title="Delete this category from Downloads page"
                          >
                            <Trash2 style={{ width: 12, height: 12 }} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            DRAWER: EDIT BRAND
            ══════════════════════════════════════════════════════════════ */}
        {isBrandDrawerOpen && editingBrand && (
          <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex" }}>
            <div onClick={handleCloseBrandDrawer} style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} />
            <div
              style={{
                position: "relative",
                marginLeft: "auto",
                width: "100%",
                maxWidth: 620,
                backgroundColor: C.white,
                boxShadow: "-8px 0 30px rgba(0,0,0,0.2)",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                zIndex: 10000,
              }}
            >
              {/* Header */}
              <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: C.text }}>
                    {editingBrand.id?.startsWith("bf-new") ? "Add Brand to Downloads" : `Edit Brand: ${editingBrand.name}`}
                  </h2>
                  <div style={{ fontSize: 11, color: C.gold, marginTop: 2 }}>
                    Changes strictly save to Downloads page (/downloads/{editingBrand.slug})
                  </div>
                </div>
                <button onClick={handleCloseBrandDrawer} style={{ border: "none", background: "none", cursor: "pointer", padding: 6 }}>
                  <X style={{ width: 18, height: 18, color: C.textMuted }} />
                </button>
              </div>

              {/* Body */}
              <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <div>
                    <label style={labelStyle}>Brand Name *</label>
                    <input
                      type="text"
                      value={editingBrand.name}
                      onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
                      style={inputStyle}
                      placeholder="e.g. Falper"
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Slug (URL identifier)</label>
                    <input
                      type="text"
                      value={editingBrand.slug}
                      onChange={(e) => setEditingBrand({ ...editingBrand, slug: e.target.value })}
                      style={inputStyle}
                      placeholder="e.g. falper"
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Tagline / Subtitle</label>
                    <input
                      type="text"
                      value={editingBrand.tagline || ""}
                      onChange={(e) => setEditingBrand({ ...editingBrand, tagline: e.target.value })}
                      style={inputStyle}
                      placeholder="e.g. Italian Luxury Bathroom Design"
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Description</label>
                    <textarea
                      value={editingBrand.description || ""}
                      onChange={(e) => setEditingBrand({ ...editingBrand, description: e.target.value })}
                      style={{ ...inputStyle, minHeight: 70, resize: "vertical" }}
                      placeholder="Brand story and digital brochures summary..."
                    />
                  </div>

                  {/* Banner & Logo */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={labelStyle}>Banner Image</label>
                      <input
                        ref={brandBannerRef}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => handleBrandFileChange(e, "banner")}
                      />
                      <button
                        type="button"
                        onClick={() => brandBannerRef.current?.click()}
                        disabled={uploadingBrandBanner}
                        style={{ ...btnOutline, width: "100%", justifyContent: "center" }}
                      >
                        <Upload style={{ width: 13, height: 13 }} />
                        <span>{uploadingBrandBanner ? "Uploading..." : "Upload Banner"}</span>
                      </button>
                      {editingBrand.bannerImageUrl && (
                        <div style={{ position: "relative", width: "100%", paddingTop: "50%", marginTop: 8, borderRadius: 8, overflow: "hidden", border: `1px solid ${C.border}` }}>
                          <Image src={editingBrand.bannerImageUrl} alt="Banner" fill sizes="300px" style={{ objectFit: "cover" }} />
                        </div>
                      )}
                    </div>

                    <div>
                      <label style={labelStyle}>Brand Logo</label>
                      <input
                        ref={brandLogoRef}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => handleBrandFileChange(e, "logo")}
                      />
                      <button
                        type="button"
                        onClick={() => brandLogoRef.current?.click()}
                        disabled={uploadingBrandLogo}
                        style={{ ...btnOutline, width: "100%", justifyContent: "center" }}
                      >
                        <Upload style={{ width: 13, height: 13 }} />
                        <span>{uploadingBrandLogo ? "Uploading..." : "Upload Logo"}</span>
                      </button>
                      {editingBrand.logoUrl && (
                        <div style={{ position: "relative", width: "100%", height: 60, marginTop: 8, borderRadius: 8, overflow: "hidden", border: `1px solid ${C.border}`, backgroundColor: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 8 }}>
                          <Image src={editingBrand.logoUrl} alt="Logo" fill sizes="100px" style={{ objectFit: "contain" }} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* PDFs list */}
                  <div style={{ borderTop: `1px solid ${C.borderLight}`, paddingTop: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <label style={{ ...labelStyle, margin: 0 }}>PDF Catalogues ({editingBrand.files?.length || 0})</label>
                      <input
                        ref={brandPdfRef}
                        type="file"
                        accept="application/pdf"
                        style={{ display: "none" }}
                        onChange={(e) => handleBrandFileChange(e, "pdf")}
                      />
                      <button
                        type="button"
                        onClick={() => brandPdfRef.current?.click()}
                        disabled={uploadingBrandPdf}
                        style={{ ...btnGold, padding: "5px 12px", fontSize: 11 }}
                      >
                        <Upload style={{ width: 12, height: 12 }} />
                        <span>{uploadingBrandPdf ? "Uploading..." : "Upload PDF"}</span>
                      </button>
                    </div>

                    {/* Link PDF */}
                    <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                      <input
                        type="text"
                        placeholder="Catalogue Title (e.g. Master Catalogue 2026)"
                        value={linkBrandPdfTitle}
                        onChange={(e) => setLinkBrandPdfTitle(e.target.value)}
                        style={{ ...inputStyle, flex: 1, fontSize: 12 }}
                      />
                      <input
                        type="url"
                        placeholder="Direct PDF URL (https://...)"
                        value={linkBrandPdfUrl}
                        onChange={(e) => setLinkBrandPdfUrl(e.target.value)}
                        style={{ ...inputStyle, flex: 1.5, fontSize: 12 }}
                      />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {(editingBrand.files || []).map((file, pIdx) => (
                        <div
                          key={pIdx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "8px 12px",
                            borderRadius: 10,
                            backgroundColor: C.surface,
                            border: `1px solid ${C.borderLight}`,
                            fontSize: 12,
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1 }}>
                            <FileText style={{ width: 14, height: 14, color: C.gold, flexShrink: 0 }} />
                            <span style={{ fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {file.name}
                            </span>
                            <span style={{ fontSize: 10, color: C.textFaint, flexShrink: 0 }}>
                              {file.fileSize || "PDF"}
                            </span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <a href={file.url} target="_blank" rel="noopener noreferrer" style={{ color: C.gold, display: "flex" }}>
                              <ExternalLink style={{ width: 13, height: 13 }} />
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                const nextFiles = (editingBrand.files || []).filter((_, i) => i !== pIdx);
                                setEditingBrand({ ...editingBrand, files: nextFiles });
                              }}
                              style={{ border: "none", background: "none", color: "#DC2626", cursor: "pointer", padding: 2 }}
                            >
                              <Trash2 style={{ width: 13, height: 13 }} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10 }}>
                <button onClick={handleCloseBrandDrawer} style={btnOutline}>
                  Cancel
                </button>
                <button onClick={handleSaveBrand} disabled={savingBrand} style={btnGold}>
                  {savingBrand ? "Saving..." : "Save Brand to Downloads"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            DRAWER: EDIT CATEGORY
            ══════════════════════════════════════════════════════════════ */}
        {isCategoryDrawerOpen && editingCategory && (
          <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex" }}>
            <div onClick={handleCloseCategoryDrawer} style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} />
            <div
              style={{
                position: "relative",
                marginLeft: "auto",
                width: "100%",
                maxWidth: 620,
                backgroundColor: C.white,
                boxShadow: "-8px 0 30px rgba(0,0,0,0.2)",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                zIndex: 10000,
              }}
            >
              {/* Header */}
              <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: C.text }}>
                    {editingCategory.id?.startsWith("cf-new") ? "Add Category to Downloads" : `Edit Category: ${editingCategory.name}`}
                  </h2>
                  <div style={{ fontSize: 11, color: C.gold, marginTop: 2 }}>
                    Changes strictly save to Downloads page (/category-downloads/{editingCategory.slug})
                  </div>
                </div>
                <button onClick={handleCloseCategoryDrawer} style={{ border: "none", background: "none", cursor: "pointer", padding: 6 }}>
                  <X style={{ width: 18, height: 18, color: C.textMuted }} />
                </button>
              </div>

              {/* Body */}
              <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <div>
                    <label style={labelStyle}>Category Name *</label>
                    <input
                      type="text"
                      value={editingCategory.name}
                      onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                      style={inputStyle}
                      placeholder="e.g. Wall Coverings"
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Slug (URL identifier)</label>
                    <input
                      type="text"
                      value={editingCategory.slug}
                      onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                      style={inputStyle}
                      placeholder="e.g. wall-coverings"
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Tagline / Subtitle</label>
                    <input
                      type="text"
                      value={editingCategory.tagline || ""}
                      onChange={(e) => setEditingCategory({ ...editingCategory, tagline: e.target.value })}
                      style={inputStyle}
                      placeholder="e.g. Luxury Architectural Wall Surfaces"
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Description</label>
                    <textarea
                      value={editingCategory.description || ""}
                      onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                      style={{ ...inputStyle, minHeight: 70, resize: "vertical" }}
                      placeholder="Category description and catalogue overview..."
                    />
                  </div>

                  {/* Banner & Logo */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={labelStyle}>Banner Image</label>
                      <input
                        ref={catBannerRef}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => handleCatFileChange(e, "banner")}
                      />
                      <button
                        type="button"
                        onClick={() => catBannerRef.current?.click()}
                        disabled={uploadingCatBanner}
                        style={{ ...btnOutline, width: "100%", justifyContent: "center" }}
                      >
                        <Upload style={{ width: 13, height: 13 }} />
                        <span>{uploadingCatBanner ? "Uploading..." : "Upload Banner"}</span>
                      </button>
                      {editingCategory.bannerImageUrl && (
                        <div style={{ position: "relative", width: "100%", paddingTop: "50%", marginTop: 8, borderRadius: 8, overflow: "hidden", border: `1px solid ${C.border}` }}>
                          <Image src={editingCategory.bannerImageUrl} alt="Banner" fill sizes="300px" style={{ objectFit: "cover" }} />
                        </div>
                      )}
                    </div>

                    <div>
                      <label style={labelStyle}>Logo / Cover Icon</label>
                      <input
                        ref={catLogoRef}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => handleCatFileChange(e, "logo")}
                      />
                      <button
                        type="button"
                        onClick={() => catLogoRef.current?.click()}
                        disabled={uploadingCatLogo}
                        style={{ ...btnOutline, width: "100%", justifyContent: "center" }}
                      >
                        <Upload style={{ width: 13, height: 13 }} />
                        <span>{uploadingCatLogo ? "Uploading..." : "Upload Cover"}</span>
                      </button>
                      {editingCategory.logoUrl && (
                        <div style={{ position: "relative", width: "100%", height: 60, marginTop: 8, borderRadius: 8, overflow: "hidden", border: `1px solid ${C.border}`, backgroundColor: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 8 }}>
                          <Image src={editingCategory.logoUrl} alt="Logo" fill sizes="100px" style={{ objectFit: "contain" }} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* PDFs list */}
                  <div style={{ borderTop: `1px solid ${C.borderLight}`, paddingTop: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <label style={{ ...labelStyle, margin: 0 }}>PDF Catalogues ({editingCategory.files?.length || 0})</label>
                      <input
                        ref={catPdfRef}
                        type="file"
                        accept="application/pdf"
                        style={{ display: "none" }}
                        onChange={(e) => handleCatFileChange(e, "pdf")}
                      />
                      <button
                        type="button"
                        onClick={() => catPdfRef.current?.click()}
                        disabled={uploadingCatPdf}
                        style={{ ...btnGold, padding: "5px 12px", fontSize: 11 }}
                      >
                        <Upload style={{ width: 12, height: 12 }} />
                        <span>{uploadingCatPdf ? "Uploading..." : "Upload PDF"}</span>
                      </button>
                    </div>

                    {/* Link PDF */}
                    <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                      <input
                        type="text"
                        placeholder="Catalogue Title (e.g. Full Specifications)"
                        value={linkCatPdfTitle}
                        onChange={(e) => setLinkCatPdfTitle(e.target.value)}
                        style={{ ...inputStyle, flex: 1, fontSize: 12 }}
                      />
                      <input
                        type="url"
                        placeholder="Direct PDF URL (https://...)"
                        value={linkCatPdfUrl}
                        onChange={(e) => setLinkCatPdfUrl(e.target.value)}
                        style={{ ...inputStyle, flex: 1.5, fontSize: 12 }}
                      />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {(editingCategory.files || []).map((file, pIdx) => (
                        <div
                          key={pIdx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "8px 12px",
                            borderRadius: 10,
                            backgroundColor: C.surface,
                            border: `1px solid ${C.borderLight}`,
                            fontSize: 12,
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1 }}>
                            <FileText style={{ width: 14, height: 14, color: C.gold, flexShrink: 0 }} />
                            <span style={{ fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {file.name}
                            </span>
                            <span style={{ fontSize: 10, color: C.textFaint, flexShrink: 0 }}>
                              {file.fileSize || "PDF"}
                            </span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <a href={file.url} target="_blank" rel="noopener noreferrer" style={{ color: C.gold, display: "flex" }}>
                              <ExternalLink style={{ width: 13, height: 13 }} />
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                const nextFiles = (editingCategory.files || []).filter((_, i) => i !== pIdx);
                                setEditingCategory({ ...editingCategory, files: nextFiles });
                              }}
                              style={{ border: "none", background: "none", color: "#DC2626", cursor: "pointer", padding: 2 }}
                            >
                              <Trash2 style={{ width: 13, height: 13 }} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10 }}>
                <button onClick={handleCloseCategoryDrawer} style={btnOutline}>
                  Cancel
                </button>
                <button onClick={handleSaveCategory} disabled={savingCategory} style={btnGold}>
                  {savingCategory ? "Saving..." : "Save Category to Downloads"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── QR CODE MODAL ── */}
        {qrModal && (
          <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", padding: 20 }}>
            <div style={{ backgroundColor: C.white, borderRadius: 24, padding: 32, maxWidth: 420, width: "100%", boxShadow: "0 20px 50px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
              <button onClick={() => setQrModal(null)} style={{ position: "absolute", top: 16, right: 16, border: "none", background: "none", cursor: "pointer" }}>
                <X style={{ width: 20, height: 20, color: C.textMuted }} />
              </button>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, textAlign: "center" }}>{qrModal.brand.name} Showroom QR</h3>
              <div style={{ marginTop: 20, padding: 12, backgroundColor: "#FAF8F5", borderRadius: 16, border: `1px solid ${C.borderLight}` }}>
                <canvas ref={qrCanvasRef} style={{ width: 240, height: 240, display: "block" }} />
              </div>
              <div style={{ fontSize: 11, color: C.textFaint, marginTop: 12, textAlign: "center", wordBreak: "break-all" }}>
                {qrModal.url}
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 20, width: "100%" }}>
                <button
                  onClick={async () => {
                    if (qrCanvasRef.current) {
                      const link = document.createElement("a");
                      link.download = `${qrModal.brand.slug}-qr.png`;
                      link.href = qrCanvasRef.current.toDataURL("image/png");
                      link.click();
                      showToast("QR Downloaded!");
                    }
                  }}
                  style={{ ...btnGold, flex: 1, justifyContent: "center" }}
                >
                  <Download style={{ width: 14, height: 14 }} /> Download QR
                </button>
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(qrModal.url);
                      setCopiedQr(true);
                      setTimeout(() => setCopiedQr(false), 2000);
                      showToast("URL copied!");
                    } catch {}
                  }}
                  style={{ ...btnOutline, flex: 1, justifyContent: "center" }}
                >
                  {copiedQr ? <Check style={{ width: 14, height: 14 }} /> : <Copy style={{ width: 14, height: 14 }} />}
                  <span>{copiedQr ? "Copied" : "Copy Link"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
