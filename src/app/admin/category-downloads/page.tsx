"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AdminNav from "@/components/AdminNav";
import { CategoryFolderItem, CategoryFolderPdf } from "@/lib/types";
import {
  FileText, Plus, Trash2, Edit, ExternalLink,
  RefreshCw, Search, Upload, Check,
  Download, X, ArrowUp, ArrowDown,
  Layers, AlertCircle, Eye, Link2,
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

export default function AdminCategoryDownloadsPage() {
  return (
    <Suspense fallback={<div style={{ padding: 32, textAlign: "center", color: C.gold }}>Loading...</div>}>
      <AdminCategoryDownloadsContent />
    </Suspense>
  );
}

function AdminCategoryDownloadsContent() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryFolderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [editingCategory, setEditingCategory] = useState<CategoryFolderItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);
  const [linkPdfTitle, setLinkPdfTitle] = useState("");
  const [linkPdfUrl, setLinkPdfUrl] = useState("");

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const session = cookies.find((r) => r.startsWith("aaren_admin_session="));
    if (!session || !session.includes("authenticated")) router.push("/admin/login");
  }, [router]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/category-downloads?t=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) setCategories(json.data);
      }
    } catch {
      showToast("Failed to load category folders", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const filteredCategories = categories.filter((c) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q);
  });

  const totalPdfs = categories.reduce((acc, c) => acc + (c.files?.length || 0), 0);

  const handleOpenEdit = (cat: CategoryFolderItem) => {
    setEditingCategory(JSON.parse(JSON.stringify(cat)));
    setLinkPdfTitle("");
    setLinkPdfUrl("");
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    if (!savingCategory && !uploadingBanner && !uploadingPdf && !uploadingLogo) {
      setEditingCategory(null);
      setLinkPdfTitle("");
      setLinkPdfUrl("");
      setIsDrawerOpen(false);
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
    setLinkPdfTitle("");
    setLinkPdfUrl("");
    setIsDrawerOpen(true);
  };

  const handleDeleteCategory = async (cat: CategoryFolderItem) => {
    if (!confirm(`Delete category folder "${cat.name}"? This cannot be undone.`)) return;
    setDeletingCategory(cat.id || cat.slug);
    try {
      const res = await fetch(`/api/admin/category-downloads?id=${encodeURIComponent(cat.id || cat.slug)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast(`"${cat.name}" deleted.`);
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

  const doUpload = async (file: File, type: "banner" | "pdf" | "logo") => {
    const folder = type === "pdf" ? "aaren_category_catalogs" : type === "logo" ? "aaren_category_logos" : "aaren_category_banners";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type === "pdf" ? "pdf" : "banner");
    formData.append("folder", folder);
    const res = await fetch("/api/admin/category-downloads/upload", { method: "POST", body: formData });
    return res.json();
  };

  const handleBannerFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingCategory) return;
    setUploadingBanner(true);
    try {
      const json = await doUpload(file, "banner");
      if (json.success) {
        setEditingCategory({ ...editingCategory, bannerImageUrl: json.url });
        showToast("Banner uploaded!");
      } else {
        showToast(json.error || "Upload failed", "error");
      }
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setUploadingBanner(false);
      if (bannerInputRef.current) bannerInputRef.current.value = "";
    }
  };

  const handleLogoFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingCategory) return;
    setUploadingLogo(true);
    try {
      const json = await doUpload(file, "logo");
      if (json.success) {
        setEditingCategory({ ...editingCategory, logoUrl: json.url });
        showToast("Cover/Logo uploaded!");
      } else {
        showToast(json.error || "Upload failed", "error");
      }
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  };

  const handlePdfFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingCategory) return;
    setUploadingPdf(true);
    try {
      const json = await doUpload(file, "pdf");
      if (json.success) {
        const cleanTitle = file.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " ");
        const newPdf: CategoryFolderPdf = {
          name: cleanTitle,
          url: json.url,
          publicId: json.publicId,
          order: (editingCategory.files?.length || 0) + 1,
          fileSize: json.fileSize || "PDF",
        };
        setEditingCategory({
          ...editingCategory,
          files: [...(editingCategory.files || []), newPdf],
        });
        showToast(`Added "${cleanTitle}"!`);
      } else {
        showToast(json.error || "PDF upload failed", "error");
      }
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setUploadingPdf(false);
      if (pdfInputRef.current) pdfInputRef.current.value = "";
    }
  };

  const handleMovePdf = (index: number, dir: "up" | "down") => {
    if (!editingCategory?.files) return;
    const f = [...editingCategory.files];
    const t = dir === "up" ? index - 1 : index + 1;
    if (t < 0 || t >= f.length) return;
    [f[index], f[t]] = [f[t], f[index]];
    f.forEach((x, i) => { x.order = i + 1; });
    setEditingCategory({ ...editingCategory, files: f });
  };

  const handleDeletePdf = (index: number) => {
    if (!editingCategory?.files) return;
    const f = editingCategory.files.filter((_, i) => i !== index);
    f.forEach((x, i) => { x.order = i + 1; });
    setEditingCategory({ ...editingCategory, files: f });
  };

  const handlePdfTitleChange = (index: number, title: string) => {
    if (!editingCategory?.files) return;
    const f = [...editingCategory.files];
    f[index] = { ...f[index], name: title };
    setEditingCategory({ ...editingCategory, files: f });
  };

  const handlePdfUrlChange = (index: number, url: string) => {
    if (!editingCategory?.files) return;
    const f = [...editingCategory.files];
    f[index] = { ...f[index], url };
    setEditingCategory({ ...editingCategory, files: f });
  };

  const handleAddPdfByLink = () => {
    if (!editingCategory) return;
    if (!linkPdfUrl.trim()) {
      showToast("Please enter a Firebase PDF link or URL", "error");
      return;
    }
    const cleanUrl = linkPdfUrl.trim();
    // Try to guess a sensible name from URL if title is blank
    let defaultTitle = `Catalogue ${(editingCategory.files?.length || 0) + 1}`;
    if (!linkPdfTitle.trim()) {
      try {
        const urlObj = new URL(cleanUrl);
        const pathPart = decodeURIComponent(urlObj.pathname.split("/").pop() || "");
        if (pathPart && pathPart.endsWith(".pdf")) {
          defaultTitle = pathPart.replace(/\.pdf$/i, "").replace(/[-_]/g, " ");
        }
      } catch (_) {}
    }
    const title = linkPdfTitle.trim() || defaultTitle;

    const newPdf: CategoryFolderPdf = {
      name: title,
      url: cleanUrl,
      order: (editingCategory.files?.length || 0) + 1,
      fileSize: "Firebase PDF",
    };

    setEditingCategory({
      ...editingCategory,
      files: [...(editingCategory.files || []), newPdf],
    });
    setLinkPdfTitle("");
    setLinkPdfUrl("");
    showToast(`Added "${title}" from Firebase link!`);
  };

  const handleSaveCategory = async () => {
    if (!editingCategory) return;
    if (!editingCategory.name.trim()) { showToast("Category name required", "error"); return; }
    if (!editingCategory.slug.trim()) { showToast("Slug required", "error"); return; }
    setSavingCategory(true);
    try {
      const res = await fetch("/api/admin/category-downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCategory),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast(`Saved "${editingCategory.name}"!`);
        setIsDrawerOpen(false);
        setEditingCategory(null);
        fetchCategories();
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

        {/* Toast */}
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
            {toast.type === "success" ? (
              <Check style={{ width: 16, height: 16, color: C.accent }} />
            ) : (
              <AlertCircle style={{ width: 16, height: 16, color: "#FCA5A5" }} />
            )}
            {toast.message}
          </div>
        )}

        {/* Header */}
        <div
          style={{
            display: "flex", alignItems: "flex-start", justifyContent: "space-between",
            gap: 16, paddingBottom: 32, borderBottom: `1px solid ${C.border}`,
            flexWrap: "wrap", marginBottom: 24,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span
                style={{
                  padding: "2px 10px", borderRadius: 9999, fontSize: 10,
                  fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
                  backgroundColor: C.goldLight, color: C.gold,
                }}
              >
                Category Catalogues CMS
              </span>
              <span style={{ fontSize: 11, color: C.textFaint }}>Cloudinary-Powered PDF Engine</span>
            </div>
            <h1 style={{ fontSize: 30, fontWeight: 700, color: C.text, margin: 0 }}>Category Downloads &amp; Catalogues</h1>
            <p style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>
              Upload and manage PDF catalogues, banners, and digital brochures for all architectural categories.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <Link
              href="/category-downloads"
              target="_blank"
              style={{ ...btnOutline, backgroundColor: C.surface }}
            >
              <Eye style={{ width: 14, height: 14, color: C.gold }} />
              <span>Public Showroom ↗</span>
            </Link>
            <button
              onClick={fetchCategories}
              disabled={loading}
              style={{ ...btnOutline, opacity: loading ? 0.6 : 1 }}
            >
              <RefreshCw style={{ width: 14, height: 14 }} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleAddNewCategory}
              style={btnGold}
            >
              <Plus style={{ width: 15, height: 15 }} />
              <span>Add Category Folder</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 24 }}>
          <div style={{ padding: "16px 20px", borderRadius: 14, backgroundColor: C.white, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: C.textMuted, letterSpacing: "0.08em" }}>Total Categories</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: C.gold, marginTop: 4 }}>{categories.length}</div>
          </div>
          <div style={{ padding: "16px 20px", borderRadius: 14, backgroundColor: C.white, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: C.textMuted, letterSpacing: "0.08em" }}>Uploaded Catalogues</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: C.text, marginTop: 4 }}>{totalPdfs}</div>
          </div>
          <div style={{ padding: "16px 20px", borderRadius: 14, backgroundColor: C.white, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: C.textMuted, letterSpacing: "0.08em" }}>PDF Storage Limit</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: C.accent, marginTop: 4 }}>30 MB / file</div>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ position: "relative", marginBottom: 24 }}>
          <Search style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: C.textFaint }} />
          <input
            type="text"
            placeholder="Search categories by name or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...inputStyle, paddingLeft: 38, backgroundColor: C.white }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", border: "none", background: "none", color: C.textFaint, cursor: "pointer", fontSize: 13 }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div style={{ padding: 60, textAlign: "center", color: C.textMuted }}>
            <RefreshCw style={{ width: 24, height: 24, animation: "spin 1s linear infinite", margin: "0 auto 12px", color: C.gold }} />
            <div>Loading category folders...</div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", backgroundColor: C.white, borderRadius: 16, border: `1px solid ${C.border}` }}>
            <Layers style={{ width: 36, height: 36, color: C.gold, margin: "0 auto 12px" }} />
            <div style={{ fontSize: 15, fontWeight: 600 }}>No categories found</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>
              {search ? `No categories match "${search}"` : "Get started by adding your first category folder."}
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {filteredCategories.map((cat) => {
              const fileCount = cat.files?.length || 0;
              return (
                <div
                  key={cat.id || cat.slug}
                  style={{
                    backgroundColor: C.white,
                    borderRadius: 16,
                    border: `1px solid ${C.border}`,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {/* Banner / Cover Preview */}
                  <div
                    style={{
                      position: "relative",
                      height: 120,
                      backgroundColor: C.surface,
                      borderBottom: `1px solid ${C.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    {cat.bannerImageUrl || cat.logoUrl ? (
                      <Image
                        src={cat.bannerImageUrl || cat.logoUrl || ""}
                        alt={cat.name}
                        fill
                        sizes="320px"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, color: C.textFaint }}>
                        <Layers style={{ width: 28, height: 28, color: C.gold }} />
                      </div>
                    )}
                    <div
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        padding: "3px 8px",
                        borderRadius: 8,
                        backgroundColor: "rgba(0,0,0,0.65)",
                        color: C.white,
                        fontSize: 10,
                        fontWeight: 700,
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      {fileCount} {fileCount === 1 ? "PDF" : "PDFs"}
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: 18, flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: 0 }}>
                        {cat.name}
                      </h3>
                    </div>

                    <div style={{ fontSize: 11, color: C.textFaint, marginTop: 4 }}>
                      /{cat.slug}
                    </div>

                    {cat.tagline && (
                      <p style={{ fontSize: 12, color: C.textMuted, marginTop: 8, marginBottom: 0, lineHeight: 1.4 }}>
                        {cat.tagline}
                      </p>
                    )}

                    {/* PDF Badges Preview */}
                    <div style={{ marginTop: 14, flex: 1 }}>
                      {fileCount > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                          {cat.files.slice(0, 3).map((f, i) => (
                            <div
                              key={i}
                              style={{
                                display: "flex", alignItems: "center", gap: 6,
                                fontSize: 11, color: C.textMuted,
                                padding: "4px 8px", borderRadius: 6,
                                backgroundColor: C.surface,
                                border: `1px solid ${C.borderLight}`,
                              }}
                            >
                              <FileText style={{ width: 12, height: 12, color: C.gold, flexShrink: 0 }} />
                              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                                {f.name}
                              </span>
                              {f.fileSize && (
                                <span style={{ fontSize: 9, color: C.textFaint, flexShrink: 0 }}>{f.fileSize}</span>
                              )}
                            </div>
                          ))}
                          {fileCount > 3 && (
                            <div style={{ fontSize: 10, color: C.textFaint, paddingLeft: 4 }}>
                              +{fileCount - 3} more catalogues...
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ fontSize: 11, color: C.textFaint, fontStyle: "italic", padding: "6px 0" }}>
                          No catalogues uploaded yet
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: 18,
                        paddingTop: 14,
                        borderTop: `1px solid ${C.borderLight}`,
                        gap: 8,
                      }}
                    >
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        style={{ ...btnGold, padding: "7px 12px", fontSize: 11 }}
                      >
                        <Edit style={{ width: 12, height: 12 }} />
                        <span>Manage &amp; Upload</span>
                      </button>

                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Link
                          href={`/category-downloads/${cat.slug}`}
                          target="_blank"
                          title="View public category page"
                          style={{
                            padding: "7px 9px",
                            borderRadius: 10,
                            border: `1px solid ${C.borderLight}`,
                            backgroundColor: C.white,
                            color: C.textMuted,
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                        >
                          <ExternalLink style={{ width: 13, height: 13 }} />
                        </Link>
                        <button
                          onClick={() => handleDeleteCategory(cat)}
                          disabled={deletingCategory === (cat.id || cat.slug)}
                          title="Delete category folder"
                          style={{
                            padding: "7px 9px",
                            borderRadius: 10,
                            border: "1px solid #FCA5A5",
                            backgroundColor: "#FEF2F2",
                            color: "#DC2626",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                        >
                          <Trash2 style={{ width: 13, height: 13 }} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Side Drawer for Editing Category & Uploading Catalogues ── */}
        {isDrawerOpen && editingCategory && (
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 9990,
              display: "flex",
              justifyContent: "flex-end",
            }}
            onClick={handleCloseDrawer}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 580,
                backgroundColor: C.white,
                height: "100%",
                overflowY: "auto",
                boxShadow: "-8px 0 32px rgba(0,0,0,0.2)",
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: C.gold, letterSpacing: "0.1em" }}>
                    Category Downloads Manager
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, margin: "2px 0 0" }}>
                    {editingCategory.name || "Edit Category"}
                  </h2>
                </div>
                <button
                  onClick={handleCloseDrawer}
                  style={{
                    border: "none", background: C.surface, borderRadius: 10,
                    width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: C.textMuted,
                  }}
                >
                  <X style={{ width: 16, height: 16 }} />
                </button>
              </div>

              {/* Form Body */}
              <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1 }}>

                {/* Category Name */}
                <div>
                  <label style={labelStyle}>Category Name *</label>
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
                      setEditingCategory({
                        ...editingCategory,
                        name,
                        slug: editingCategory.id.startsWith("cf-new") ? slug : editingCategory.slug,
                      });
                    }}
                    style={inputStyle}
                    placeholder="e.g. Architectural Surfaces"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label style={labelStyle}>URL Slug *</label>
                  <input
                    type="text"
                    value={editingCategory.slug}
                    onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                    style={inputStyle}
                    placeholder="e.g. architectural-surfaces"
                  />
                  <div style={{ fontSize: 11, color: C.textFaint, marginTop: 4 }}>
                    Public page: /category-downloads/{editingCategory.slug}
                  </div>
                </div>

                {/* Tagline */}
                <div>
                  <label style={labelStyle}>Tagline / Subheading</label>
                  <input
                    type="text"
                    value={editingCategory.tagline || ""}
                    onChange={(e) => setEditingCategory({ ...editingCategory, tagline: e.target.value })}
                    style={inputStyle}
                    placeholder="e.g. Italian porcelain slabs and architectural cladding"
                  />
                </div>

                {/* Description */}
                <div>
                  <label style={labelStyle}>Description</label>
                  <textarea
                    rows={3}
                    value={editingCategory.description || ""}
                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                    style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
                    placeholder="Short overview of what is in this category..."
                  />
                </div>

                {/* Cover / Logo Image */}
                <div>
                  <label style={labelStyle}>Category Cover / Logo Image</label>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    {editingCategory.logoUrl ? (
                      <div style={{ position: "relative", width: 72, height: 72, borderRadius: 12, overflow: "hidden", border: `1px solid ${C.borderLight}` }}>
                        <Image src={editingCategory.logoUrl} alt="Logo" fill style={{ objectFit: "cover" }} />
                        <button
                          onClick={() => setEditingCategory({ ...editingCategory, logoUrl: undefined })}
                          style={{ position: "absolute", top: 2, right: 2, background: "rgba(0,0,0,0.6)", color: C.white, border: "none", borderRadius: 4, width: 18, height: 18, cursor: "pointer", fontSize: 10 }}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div style={{ width: 72, height: 72, borderRadius: 12, backgroundColor: C.surface, border: `1px dashed ${C.borderLight}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Layers style={{ width: 22, height: 22, color: C.textFaint }} />
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoFileSelected}
                        style={{ display: "none" }}
                      />
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        disabled={uploadingLogo}
                        style={{ ...btnOutline, width: "100%", justifyContent: "center" }}
                      >
                        <Upload style={{ width: 13, height: 13 }} />
                        <span>{uploadingLogo ? "Uploading Cover..." : "Upload Cover Image"}</span>
                      </button>
                    </div>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <label style={{ ...labelStyle, fontSize: 9, marginBottom: 3, textTransform: "none", letterSpacing: "normal" }}>
                      Or paste Cover image URL directly (Firebase link):
                    </label>
                    <input
                      type="url"
                      value={editingCategory.logoUrl || ""}
                      onChange={(e) => setEditingCategory({ ...editingCategory, logoUrl: e.target.value })}
                      placeholder="https://firebasestorage.googleapis.com/... or image URL"
                      style={{ ...inputStyle, fontSize: 11, fontFamily: "monospace", color: C.gold, backgroundColor: C.surface }}
                    />
                  </div>
                </div>

                {/* Banner Image */}
                <div>
                  <label style={labelStyle}>Hero Banner Image (Optional)</label>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    {editingCategory.bannerImageUrl ? (
                      <div style={{ position: "relative", width: 100, height: 50, borderRadius: 8, overflow: "hidden", border: `1px solid ${C.borderLight}` }}>
                        <Image src={editingCategory.bannerImageUrl} alt="Banner" fill style={{ objectFit: "cover" }} />
                        <button
                          onClick={() => setEditingCategory({ ...editingCategory, bannerImageUrl: undefined })}
                          style={{ position: "absolute", top: 2, right: 2, background: "rgba(0,0,0,0.6)", color: C.white, border: "none", borderRadius: 4, width: 18, height: 18, cursor: "pointer", fontSize: 10 }}
                        >
                          ✕
                        </button>
                      </div>
                    ) : null}
                    <div style={{ flex: 1 }}>
                      <input
                        ref={bannerInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleBannerFileSelected}
                        style={{ display: "none" }}
                      />
                      <button
                        type="button"
                        onClick={() => bannerInputRef.current?.click()}
                        disabled={uploadingBanner}
                        style={{ ...btnOutline, width: "100%", justifyContent: "center" }}
                      >
                        <Upload style={{ width: 13, height: 13 }} />
                        <span>{uploadingBanner ? "Uploading Banner..." : "Upload Hero Banner"}</span>
                      </button>
                    </div>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <label style={{ ...labelStyle, fontSize: 9, marginBottom: 3, textTransform: "none", letterSpacing: "normal" }}>
                      Or paste Banner image URL directly (Firebase link):
                    </label>
                    <input
                      type="url"
                      value={editingCategory.bannerImageUrl || ""}
                      onChange={(e) => setEditingCategory({ ...editingCategory, bannerImageUrl: e.target.value })}
                      placeholder="https://firebasestorage.googleapis.com/... or banner URL"
                      style={{ ...inputStyle, fontSize: 11, fontFamily: "monospace", color: C.gold, backgroundColor: C.surface }}
                    />
                  </div>
                </div>

                {/* ─── PDF Catalogues Upload & Link Section ─── */}
                <div style={{ paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.text, display: "flex", alignItems: "center", gap: 6 }}>
                        <FileText style={{ width: 16, height: 16, color: C.gold }} />
                        <span>PDF Catalogues &amp; Downloads</span>
                      </div>
                      <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
                        Paste your Firebase PDF link directly or upload a PDF file from your device.
                      </div>
                    </div>
                  </div>

                  {/* ── Option 1: Direct Firebase PDF Link Box ── */}
                  <div
                    style={{
                      padding: "16px",
                      borderRadius: 14,
                      backgroundColor: "#FAF6EE",
                      border: `1px solid #D5CEBF`,
                      marginBottom: 16,
                      boxShadow: "0 2px 8px rgba(129, 102, 63, 0.06)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.gold, display: "flex", alignItems: "center", gap: 6 }}>
                        <Link2 style={{ width: 14, height: 14 }} />
                        <span>Add via Firebase PDF Link</span>
                      </div>
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 9999,
                          backgroundColor: "rgba(129, 102, 63, 0.15)",
                          color: C.gold,
                          letterSpacing: "0.05em",
                        }}
                      >
                        Recommended
                      </span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <div>
                        <label style={{ ...labelStyle, fontSize: 10, marginBottom: 3 }}>Catalogue Title</label>
                        <input
                          type="text"
                          value={linkPdfTitle}
                          onChange={(e) => setLinkPdfTitle(e.target.value)}
                          placeholder="e.g. Official Kitchen Specifications 2026"
                          style={{ ...inputStyle, backgroundColor: C.white, fontSize: 12, padding: "7px 12px" }}
                        />
                      </div>

                      <div>
                        <label style={{ ...labelStyle, fontSize: 10, marginBottom: 3 }}>Firebase PDF Link / URL *</label>
                        <input
                          type="url"
                          value={linkPdfUrl}
                          onChange={(e) => setLinkPdfUrl(e.target.value)}
                          placeholder="https://firebasestorage.googleapis.com/... or any PDF link"
                          style={{
                            ...inputStyle,
                            backgroundColor: C.white,
                            fontSize: 11,
                            padding: "7px 12px",
                            fontFamily: "monospace",
                            color: C.gold,
                          }}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleAddPdfByLink}
                        style={{
                          ...btnGold,
                          justifyContent: "center",
                          padding: "9px 14px",
                          borderRadius: 10,
                          marginTop: 4,
                        }}
                      >
                        <Plus style={{ width: 14, height: 14 }} />
                        <span>＋ Add Firebase PDF Link</span>
                      </button>
                    </div>
                  </div>

                  {/* ── Option 2: Upload PDF from Computer ── */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <div style={{ flex: 1, height: 1, backgroundColor: C.borderLight }} />
                      <span style={{ fontSize: 10, fontWeight: 700, color: C.textFaint, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        Or Upload PDF File
                      </span>
                      <div style={{ flex: 1, height: 1, backgroundColor: C.borderLight }} />
                    </div>

                    <input
                      ref={pdfInputRef}
                      type="file"
                      accept="application/pdf"
                      onChange={handlePdfFileSelected}
                      style={{ display: "none" }}
                    />
                    <button
                      type="button"
                      onClick={() => pdfInputRef.current?.click()}
                      disabled={uploadingPdf}
                      style={{
                        ...btnOutline,
                        width: "100%",
                        padding: "10px 16px",
                        borderRadius: 12,
                        justifyContent: "center",
                      }}
                    >
                      <Upload style={{ width: 14, height: 14, color: C.gold }} />
                      <span>{uploadingPdf ? "Uploading PDF..." : "Upload PDF File from Device"}</span>
                    </button>
                  </div>

                  {/* ── Uploaded / Added PDF List ── */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      Catalogues in this Category ({editingCategory.files?.length || 0})
                    </div>

                    {editingCategory.files && editingCategory.files.length > 0 ? (
                      editingCategory.files.map((file, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: 12,
                            borderRadius: 12,
                            backgroundColor: C.surface,
                            border: `1px solid ${C.borderLight}`,
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                          }}
                        >
                          {/* Title Input */}
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: C.gold, fontFamily: "monospace", width: 20 }}>
                              #{idx + 1}
                            </span>
                            <input
                              type="text"
                              value={file.name}
                              onChange={(e) => handlePdfTitleChange(idx, e.target.value)}
                              placeholder="Catalogue display title"
                              style={{ ...inputStyle, padding: "6px 10px", fontSize: 12, flex: 1, backgroundColor: C.white }}
                            />
                          </div>

                          {/* Editable PDF URL (Firebase Link) */}
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Link2 style={{ width: 14, height: 14, color: C.textFaint, flexShrink: 0 }} />
                            <input
                              type="url"
                              value={file.url}
                              onChange={(e) => handlePdfUrlChange(idx, e.target.value)}
                              placeholder="PDF URL / Firebase Link"
                              style={{
                                ...inputStyle,
                                padding: "5px 10px",
                                fontSize: 11,
                                flex: 1,
                                backgroundColor: C.white,
                                fontFamily: "monospace",
                                color: C.gold,
                              }}
                            />
                          </div>

                          {/* Footer with Preview & Actions */}
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 4 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: C.textFaint }}>
                              <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, backgroundColor: C.borderLight, color: C.textMuted }}>
                                {file.fileSize || "PDF"}
                              </span>
                              <span>·</span>
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: C.gold, textDecoration: "underline", display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11 }}
                              >
                                <span>Preview PDF</span>
                                <ExternalLink style={{ width: 11, height: 11 }} />
                              </a>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <button
                                type="button"
                                onClick={() => handleMovePdf(idx, "up")}
                                disabled={idx === 0}
                                title="Move up"
                                style={{ border: `1px solid ${C.borderLight}`, background: C.white, borderRadius: 6, padding: "3px 6px", cursor: idx === 0 ? "not-allowed" : "pointer", opacity: idx === 0 ? 0.4 : 1 }}
                              >
                                <ArrowUp style={{ width: 11, height: 11 }} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMovePdf(idx, "down")}
                                disabled={idx === (editingCategory.files.length - 1)}
                                title="Move down"
                                style={{ border: `1px solid ${C.borderLight}`, background: C.white, borderRadius: 6, padding: "3px 6px", cursor: idx === (editingCategory.files.length - 1) ? "not-allowed" : "pointer", opacity: idx === (editingCategory.files.length - 1) ? 0.4 : 1 }}
                              >
                                <ArrowDown style={{ width: 11, height: 11 }} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePdf(idx)}
                                title="Remove PDF"
                                style={{ border: "1px solid #FCA5A5", background: "#FEF2F2", color: "#DC2626", borderRadius: 6, padding: "3px 6px", cursor: "pointer" }}
                              >
                                <Trash2 style={{ width: 11, height: 11 }} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ textAlign: "center", padding: "18px 12px", border: `1px dashed ${C.borderLight}`, borderRadius: 12, color: C.textFaint, fontSize: 12, backgroundColor: C.surface }}>
                        No catalogues added yet. Paste a Firebase PDF link above or click to upload.
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Drawer Footer Buttons */}
              <div style={{ marginTop: 24, paddingTop: 18, borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <button
                  type="button"
                  onClick={handleCloseDrawer}
                  style={btnOutline}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCategory}
                  disabled={savingCategory}
                  style={{ ...btnGold, padding: "10px 24px", fontSize: 13 }}
                >
                  {savingCategory ? "Saving Changes..." : "Save Category"}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
