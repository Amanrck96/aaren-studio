"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AdminNav from "@/components/AdminNav";
import { BrandItem } from "@/lib/types";
import { uploadFileWithCompression } from "@/lib/uploadHelper";
import { extractFirstPageAsImage, extractFirstPageWithDetails } from "@/utils/pdfCoverExtractor";
import {
  ArrowLeft,
  Save,
  Trash2,
  ExternalLink,
  Upload,
  Plus,
  X,
  Layers,
  Sparkles,
  Image as ImageIcon,
  BookOpen,
  FileText,
  Palette,
  CheckCircle,
  Tag,
} from "lucide-react";

type Props = { params: Promise<{ id: string }> };

export default function AdminIndividualBrandPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [uploadingLogo, setUploadingLogo] = useState<boolean>(false);
  const [uploadingBanner, setUploadingBanner] = useState<boolean>(false);
  const [uploadingPdf, setUploadingPdf] = useState<boolean>(false);
  const [uploadingIndex, setUploadingIndex] = useState<{ idx: number; type: "pdf" | "cover" } | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"general" | "editorial" | "media" | "collections" | "catalogs">("editorial");

  // Brand Form State
  const [formData, setFormData] = useState<BrandItem>({
    id: id,
    name: "",
    logoUrl: "",
    bannerUrl: "",
    description: "",
    shortCode: "BR 01",
    sequenceNumber: 1,
    category: "Outdoor Screens",
    origin: "Australia",
    tagline: "",
    founded: "2008",
    website: "",
    collections: ["All"],
    accentColor: "#6b9e7a",
    catalogPdfUrl: "",
    pdfCatalogs: [],
  });

  // Helpers
  const [collectionInput, setCollectionInput] = useState<string>("");
  const [tagInput, setTagInput] = useState<string>("");

  useEffect(() => {
    fetchBrand();
  }, [id]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const fetchBrand = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/brands?id=${encodeURIComponent(id)}&t=${Date.now()}`, { cache: "no-store" });
      const json = await res.json();
      if (json && json.success && json.data) {
        const b = json.data;
        setFormData({
          id: b.id || id,
          name: b.name || "",
          logoUrl: b.logoUrl || "",
          bannerUrl: b.bannerUrl || "",
          description: b.description || "",
          shortCode: b.shortCode || "BR 01",
          sequenceNumber: b.sequenceNumber ?? 1,
          category: b.category || "Architectural Products",
          origin: b.origin || "Italy",
          tagline: b.tagline || "",
          founded: b.founded || "",
          website: b.website || "",
          collections: Array.isArray(b.collections) && b.collections.length > 0 ? b.collections : ["All"],
          accentColor: b.accentColor || "#8c764b",
          catalogPdfUrl: b.catalogPdfUrl || "",
          pdfCatalogs: Array.isArray(b.pdfCatalogs) ? b.pdfCatalogs : [],
          tags: Array.isArray(b.tags) ? b.tags : [],
        });
      } else {
        // Fallback default skeleton
        setFormData((prev) => ({
          ...prev,
          id: id,
          name: id.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        }));
      }
    } catch (err) {
      console.error("Error loading brand:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Brand Name is required.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/brands", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        showToast("Error saving: HTTP " + res.status);
        return;
      }
      const json = await res.json();
      if (json.success) {
        showToast("✓ Brand page details updated successfully!");
      } else {
        showToast("Error saving: " + (json.error || "Unknown error"));
      }
    } catch (err: any) {
      showToast("Failed to save brand: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete brand "${formData.name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/brands?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) {
        alert("Delete failed: HTTP " + res.status);
        return;
      }
      const json = await res.json();
      if (json.success) {
        alert("Brand deleted successfully.");
        router.push("/admin/brands");
      } else {
        alert("Delete failed: " + (json.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  // Logo Upload
  const handleLogoUpload = async (file: File) => {
    if (!file) return;
    setUploadingLogo(true);
    try {
      const uploadRes = await uploadFileWithCompression(file, "Brands/Logos");
      if (uploadRes.success && (uploadRes.url || uploadRes.dataUrl)) {
        const finalUrl = uploadRes.url || uploadRes.dataUrl || "";
        setFormData((prev) => ({ ...prev, logoUrl: finalUrl }));
        showToast("Brand logo uploaded successfully!");
      } else {
        alert("Upload error: " + (uploadRes.error || "Could not upload image"));
      }
    } catch (e: any) {
      alert("Upload failed: " + e.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  // Banner Upload
  const handleBannerUpload = async (file: File) => {
    if (!file) return;
    setUploadingBanner(true);
    try {
      const uploadRes = await uploadFileWithCompression(file, "Brands/Banners");
      if (uploadRes.success && (uploadRes.url || uploadRes.dataUrl)) {
        const finalUrl = uploadRes.url || uploadRes.dataUrl || "";
        setFormData((prev) => ({ ...prev, bannerUrl: finalUrl }));
        showToast("Brand hero banner photo uploaded!");
      } else {
        alert("Upload error: " + (uploadRes.error || "Could not upload image"));
      }
    } catch (e: any) {
      alert("Upload failed: " + e.message);
    } finally {
      setUploadingBanner(false);
    }
  };

  // PDF Catalog Upload with Automatic Page-1 Cover Thumbnail Capture
  const handlePdfUpload = async (file: File, catalogIndex?: number) => {
    if (!file) return;
    if (catalogIndex !== undefined) {
      setUploadingIndex({ idx: catalogIndex, type: "pdf" });
    } else {
      setUploadingPdf(true);
    }
    try {
      showToast("⏳ Uploading PDF & extracting Page-1 cover thumbnail...");
      
      // 1. Concurrently start Page-1 cover extraction from in-memory File object
      const coverExtractPromise = (async () => {
        try {
          console.log(`[Admin Brand Detail] Starting auto cover extraction for "${file.name}"...`);
          const coverFile = await extractFirstPageAsImage(file);
          if (coverFile) {
            const coverRes = await uploadFileWithCompression(coverFile, "Catalog_Covers");
            if (coverRes.success && (coverRes.url || coverRes.dataUrl)) {
              return coverRes.url || coverRes.dataUrl || "";
            }
          }
        } catch (cErr) {
          console.warn("[Admin Brand Detail] Auto cover extraction note:", cErr);
        }
        return "";
      })();

      // 2. Upload PDF to Firebase Storage (Any Size)
      const uploadRes = await uploadFileWithCompression(file, "Catalogues");
      if (uploadRes.success && (uploadRes.url || uploadRes.dataUrl)) {
        const finalPdfUrl = uploadRes.url || uploadRes.dataUrl || "";
        const autoCoverUrl = await coverExtractPromise;

        if (catalogIndex !== undefined) {
          setFormData((prev) => {
            const list = [...(prev.pdfCatalogs || [])];
            if (list[catalogIndex]) {
              list[catalogIndex].pdfUrl = finalPdfUrl;
              if (autoCoverUrl && !list[catalogIndex].coverImage) {
                list[catalogIndex].coverImage = autoCoverUrl;
              }
            }
            return { ...prev, pdfCatalogs: list };
          });
        } else {
          setFormData((prev) => ({ ...prev, catalogPdfUrl: finalPdfUrl }));
        }

        showToast(
          autoCoverUrl
            ? "✅ PDF uploaded & Page-1 cover thumbnail captured automatically!"
            : "✅ PDF catalog uploaded to Firebase Storage!"
        );
      } else {
        showToast("⚠️ PDF Upload note: " + (uploadRes.error || "Could not upload file to Firebase."));
      }
    } catch (e: any) {
      showToast("❌ PDF Upload error: " + e.message);
    } finally {
      setUploadingPdf(false);
      setUploadingIndex(null);
    }
  };

  // Cover Image Upload for individual PDF catalog
  const handleCoverUpload = async (file: File, catalogIndex: number) => {
    if (!file) return;
    setUploadingIndex({ idx: catalogIndex, type: "cover" });
    try {
      const uploadRes = await uploadFileWithCompression(file, "Catalog_Covers");
      if (uploadRes.success && (uploadRes.url || uploadRes.dataUrl)) {
        const finalUrl = uploadRes.url || uploadRes.dataUrl || "";
        setFormData((prev) => {
          const list = [...(prev.pdfCatalogs || [])];
          if (list[catalogIndex]) list[catalogIndex].coverImage = finalUrl;
          return { ...prev, pdfCatalogs: list };
        });
        showToast("✓ Catalog cover thumbnail updated!");
      } else {
        showToast("⚠️ Cover upload error: " + (uploadRes.error || "Could not upload image"));
      }
    } catch (e: any) {
      showToast("❌ Cover upload failed: " + e.message);
    } finally {
      setUploadingIndex(null);
    }
  };

  // On-demand auto extraction of Page 1 from PDF URL
  const handleAutoExtractCover = async (catalogIndex: number) => {
    const cat = formData.pdfCatalogs?.[catalogIndex];
    if (!cat?.pdfUrl) {
      showToast("⚠️ Please provide or upload a PDF first.");
      return;
    }
    setUploadingIndex({ idx: catalogIndex, type: "cover" });
    try {
      showToast(`⏳ Extracting Page 1 cover for "${cat.title || "Catalog"}"...`);
      const details = await extractFirstPageWithDetails(cat.pdfUrl, cat.title || "catalog");
      let coverFile = details.file;

      if (!coverFile) {
        console.warn(`[Admin Brand Detail] First attempt failed at [${details.step}]: ${details.error}. Retrying extraction...`);
        const retryDetails = await extractFirstPageWithDetails(cat.pdfUrl, cat.title || "catalog");
        coverFile = retryDetails.file;

        if (!coverFile) {
          console.error("[Admin Brand Detail] Extraction failed after retry:", retryDetails);
          showToast(`⚠️ Page 1 capture issue (${retryDetails.step || "Error"}: ${retryDetails.error || "Unknown"}). You can upload a cover image manually.`);
          return;
        }
      }

      const uploadRes = await uploadFileWithCompression(coverFile, "Catalog_Covers");
      if (uploadRes.success && (uploadRes.url || uploadRes.dataUrl)) {
        const finalUrl = uploadRes.url || uploadRes.dataUrl || "";
        setFormData((prev) => {
          const list = [...(prev.pdfCatalogs || [])];
          if (list[catalogIndex]) list[catalogIndex].coverImage = finalUrl;
          return { ...prev, pdfCatalogs: list };
        });
        showToast("✅ Page 1 cover thumbnail captured & saved successfully!");
      } else {
        showToast("⚠️ Cover storage note: " + uploadRes.error);
      }
    } catch (e: any) {
      showToast("❌ Cover capture note: " + e.message);
    } finally {
      setUploadingIndex(null);
    }
  };

  // Batch extract covers for all catalogs in this brand missing a cover
  const handleAutoExtractAllCovers = async () => {
    const list = formData.pdfCatalogs || [];
    const missing = list.filter((c) => c.pdfUrl && (!c.coverImage || c.coverImage.startsWith("/categories/cat_")));
    if (missing.length === 0) {
      showToast("✓ All catalogs already have valid cover thumbnails!");
      return;
    }

    showToast(`⏳ Auto-generating covers for ${missing.length} catalog(s)...`);
    let updatedCount = 0;
    const updatedList = [...list];

    for (let i = 0; i < updatedList.length; i++) {
      const cat = updatedList[i];
      if (cat.pdfUrl && (!cat.coverImage || cat.coverImage.startsWith("/categories/cat_"))) {
        try {
          const coverFile = await extractFirstPageAsImage(cat.pdfUrl, cat.title || "catalog");
          if (coverFile) {
            const uploadRes = await uploadFileWithCompression(coverFile, "Catalog_Covers");
            if (uploadRes.success && (uploadRes.url || uploadRes.dataUrl)) {
              updatedList[i].coverImage = uploadRes.url || uploadRes.dataUrl || "";
              updatedCount++;
            }
          }
        } catch (err) {
          console.warn(`[Batch Cover] Error for catalog "${cat.title}":`, err);
        }
      }
    }

    setFormData((prev) => ({ ...prev, pdfCatalogs: updatedList }));
    showToast(`✅ Generated & attached ${updatedCount} cover thumbnail(s)! Click "Save Brand Page" to persist.`);
  };

  // Collection Chip Helpers
  const addCollectionChip = () => {
    if (!collectionInput.trim()) return;
    if (!formData.collections?.includes(collectionInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        collections: [...(prev.collections || []), collectionInput.trim()],
      }));
    }
    setCollectionInput("");
  };

  const removeCollectionChip = (chipToRemove: string) => {
    if (chipToRemove === "All") return; // Keep "All"
    setFormData((prev) => ({
      ...prev,
      collections: (prev.collections || []).filter((c) => c !== chipToRemove),
    }));
  };

  // Add PDF catalog entry
  const addPdfCatalogEntry = () => {
    const newEntry = {
      id: `cat-${Date.now()}`,
      title: `${formData.name} Architectural Specification Catalog`,
      pdfUrl: "",
    };
    setFormData((prev) => ({
      ...prev,
      pdfCatalogs: [...(prev.pdfCatalogs || []), newEntry],
    }));
  };

  const removePdfCatalogEntry = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      pdfCatalogs: (prev.pdfCatalogs || []).filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="admin-page-container font-['Jost',sans-serif]">
        <AdminNav />
        <main className="admin-main-content admin-main" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh" }}>
          <div style={{ textAlign: "center", color: "#8c764b" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🏢</div>
            <div style={{ fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>Loading Brand Details...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-page-container font-['Jost',sans-serif]">
      <AdminNav />

      <main className="admin-main-content admin-main">
        {/* TOP HEADER BAR */}
        <div className="top-header-nav">
          <div className="left-meta">
            <Link href="/admin/brands" className="back-link">
              <ArrowLeft size={16} />
              <span>Back to Brand Section Manager</span>
            </Link>
            <div className="title-row">
              <h1 className="editor-title">{formData.name || "Untitled Brand"}</h1>
              <span className="id-pill">Slug: {formData.id}</span>
              {formData.shortCode && <span className="code-badge">{formData.shortCode}</span>}
              {formData.category && <span className="category-badge">{formData.category}</span>}
            </div>
          </div>

          <div className="action-buttons">
            <Link href={`/brands/${formData.id}`} target="_blank" className="btn-secondary">
              <ExternalLink size={15} />
              <span>View Live Brand Page</span>
            </Link>
            <button onClick={handleDelete} className="btn-danger" title="Permanently Delete">
              <Trash2 size={15} />
              <span>Delete</span>
            </button>
            <button onClick={() => handleSave()} disabled={saving} className="btn-primary">
              <Save size={16} />
              <span>{saving ? "Saving Changes..." : "Save All Changes"}</span>
            </button>
          </div>
        </div>

        {/* WORKSPACE GRID */}
        <div className="editor-layout">
          {/* LEFT COLUMN: EDIT TABS */}
          <div className="form-column">
            {/* Tabs Navigation */}
            <div className="nav-tabs">
              <button
                className={`tab-item ${activeTab === "editorial" ? "active" : ""}`}
                onClick={() => setActiveTab("editorial")}
              >
                <BookOpen size={15} />
                <span>Story & Editorial Details</span>
              </button>
              <button
                className={`tab-item ${activeTab === "general" ? "active" : ""}`}
                onClick={() => setActiveTab("general")}
              >
                <Layers size={15} />
                <span>Identity & Meta</span>
              </button>
              <button
                className={`tab-item ${activeTab === "media" ? "active" : ""}`}
                onClick={() => setActiveTab("media")}
              >
                <ImageIcon size={15} />
                <span>Hero Banner & Logo</span>
              </button>
              <button
                className={`tab-item ${activeTab === "collections" ? "active" : ""}`}
                onClick={() => setActiveTab("collections")}
              >
                <Tag size={15} />
                <span>Filter Collections</span>
              </button>
              <button
                className={`tab-item ${activeTab === "catalogs" ? "active" : ""}`}
                onClick={() => setActiveTab("catalogs")}
              >
                <FileText size={15} />
                <span>PDF Catalogs</span>
              </button>
            </div>

            {/* TAB 1: EDITORIAL & STORY (The exact circled fields from user screenshot) */}
            {activeTab === "editorial" && (
              <div className="section-card">
                <h3 className="section-title">Brand Page Editorial & Story Content</h3>
                <p className="section-sub">
                  Customize the tagline quote, stats bar (Category, Origin, Founded Year), and the full &ldquo;About the brand&rdquo; story description.
                </p>

                <div className="form-grid">
                  {/* Hero Tagline */}
                  <div className="form-group full-width">
                    <label>Brand Hero Tagline / Quote *</label>
                    <input
                      type="text"
                      placeholder='e.g. "Infinite Zipline retractable screen systems"'
                      value={formData.tagline || ""}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    />
                    <small style={{ color: "#64748b", fontSize: "11px", marginTop: "4px", display: "block" }}>
                      Displayed in large italics below the hero banner on the brand page.
                    </small>
                  </div>

                  {/* Category */}
                  <div className="form-group">
                    <label>Brand Category *</label>
                    <input
                      type="text"
                      placeholder="e.g. Outdoor Screens, Kitchen & Wardrobe, Laminates"
                      value={formData.category || ""}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>

                  {/* Country of Origin */}
                  <div className="form-group">
                    <label>Country of Origin *</label>
                    <input
                      type="text"
                      placeholder="e.g. Australia, Italy, Germany, USA, India"
                      value={formData.origin || ""}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    />
                  </div>

                  {/* Established / Founded Year */}
                  <div className="form-group">
                    <label>Established / Founded Year</label>
                    <input
                      type="text"
                      placeholder="e.g. 2008"
                      value={formData.founded || ""}
                      onChange={(e) => setFormData({ ...formData, founded: e.target.value })}
                    />
                  </div>

                  {/* Accent Color */}
                  <div className="form-group">
                    <label>Brand Accent Color</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <input
                        type="color"
                        value={formData.accentColor || "#6b9e7a"}
                        onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                        style={{ width: "40px", height: "40px", padding: 0, border: "none", borderRadius: "6px", cursor: "pointer", background: "none" }}
                      />
                      <input
                        type="text"
                        placeholder="#6b9e7a"
                        value={formData.accentColor || ""}
                        onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>

                  {/* Full About Story */}
                  <div className="form-group full-width">
                    <label>About the Brand (Full Story Description) *</label>
                    <textarea
                      rows={6}
                      placeholder="Enter comprehensive brand story, architectural engineering strengths, and craftsmanship heritage..."
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    <small style={{ color: "#64748b", fontSize: "11px", marginTop: "4px", display: "block" }}>
                      Displayed in the &ldquo;ABOUT THE BRAND&rdquo; paragraph section beside the vertical accent bar.
                    </small>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: GENERAL & IDENTITY */}
            {activeTab === "general" && (
              <div className="section-card">
                <h3 className="section-title">Brand Identity & Navigation Meta</h3>
                <p className="section-sub">Define core naming, shortcode pill, sequence order, and external website.</p>

                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Brand Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Freedom Screens"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Short Code (e.g. FS 11, WB 02, SF 01) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. FS 11"
                      value={formData.shortCode || ""}
                      onChange={(e) => setFormData({ ...formData, shortCode: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Catalog Display Sequence</label>
                    <input
                      type="number"
                      placeholder="1"
                      value={formData.sequenceNumber ?? 1}
                      onChange={(e) => setFormData({ ...formData, sequenceNumber: parseInt(e.target.value, 10) || 1 })}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Official Manufacturer Website URL</label>
                    <input
                      type="text"
                      placeholder="https://freedomscreens.com.au"
                      value={formData.website || ""}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: VISUAL MEDIA & ASSETS */}
            {activeTab === "media" && (
              <div className="section-card">
                <h3 className="section-title">Hero Banner Photo & Official Logo</h3>
                <p className="section-sub">Upload high-resolution architectural lifestyle banner photos and vector/PNG logos.</p>

                {/* Hero Banner */}
                <div className="media-block">
                  <label className="block-label">Brand Hero Banner Image *</label>
                  <div
                    className="banner-preview-box"
                    style={{
                      backgroundImage: formData.bannerUrl ? `url(${formData.bannerUrl})` : "linear-gradient(135deg, #1e293b, #0f172a)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {!formData.bannerUrl && <span style={{ color: "#94a3b8" }}>No Hero Banner uploaded</span>}
                  </div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "10px" }}>
                    <input
                      type="text"
                      placeholder="https://... direct image URL"
                      value={formData.bannerUrl}
                      onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                      style={{ flex: 1 }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      id="brandBannerUpload"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) handleBannerUpload(e.target.files[0]);
                      }}
                    />
                    <label htmlFor="brandBannerUpload" className="btn-upload">
                      <Upload size={14} />
                      <span>{uploadingBanner ? "Uploading..." : "Upload Banner"}</span>
                    </label>
                  </div>
                </div>

                <hr className="divider" />

                {/* Logo */}
                <div className="media-block">
                  <label className="block-label">Brand Logo (PNG / SVG) *</label>
                  <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <div className="logo-preview-box">
                      {formData.logoUrl ? (
                        <Image src={formData.logoUrl} alt="Logo" width={100} height={40} unoptimized style={{ objectFit: "contain", maxHeight: "40px" }} />
                      ) : (
                        <span style={{ fontSize: "11px", color: "#94a3b8" }}>No Logo</span>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <input
                        type="text"
                        placeholder="https://... logo URL"
                        value={formData.logoUrl}
                        onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                        style={{ width: "100%", marginBottom: "8px" }}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        id="brandLogoUpload"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) handleLogoUpload(e.target.files[0]);
                        }}
                      />
                      <label htmlFor="brandLogoUpload" className="btn-upload">
                        <Upload size={14} />
                        <span>{uploadingLogo ? "Uploading..." : "Upload Logo"}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: FILTER COLLECTIONS */}
            {activeTab === "collections" && (
              <div className="section-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div>
                    <h3 className="section-title" style={{ margin: 0 }}>Brand Subcategory / Collection Filter Chips</h3>
                    <p className="section-sub" style={{ margin: "4px 0 0" }}>
                      Configure the interactive circular collection filter pills shown above the product grid on the brand page.
                    </p>
                  </div>
                  <Link
                    href="/admin/collections"
                    target="_blank"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "#81663F",
                      color: "#fff",
                      padding: "8px 14px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    <span>🗃️ Collection Studio & Icons</span>
                    <ExternalLink size={12} />
                  </Link>
                </div>

                <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                  <input
                    type="text"
                    placeholder="e.g. Infinite Zip line, Smart Motorised, Smart Manual"
                    value={collectionInput}
                    onChange={(e) => setCollectionInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCollectionChip(); } }}
                    style={{ flex: 1 }}
                  />
                  <button type="button" onClick={addCollectionChip} className="btn-add-item">
                    <Plus size={14} /> Add Collection
                  </button>
                </div>

                <div className="chips-wrap">
                  {(formData.collections || []).map((col, idx) => (
                    <span key={idx} className="chip">
                      <CheckCircle size={12} color="#16a34a" />
                      <span>{col}</span>
                      {col !== "All" && (
                        <button type="button" onClick={() => removeCollectionChip(col)}>✕</button>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: PDF CATALOGS */}
            {activeTab === "catalogs" && (
              <div className="section-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <h3 className="section-title" style={{ margin: 0 }}>Official PDF Specification Catalogs</h3>
                    <p className="section-sub">Attach downloadable / viewable digital architectural specification PDFs and custom covers.</p>
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={handleAutoExtractAllCovers}
                      className="btn-upload"
                      style={{ background: "linear-gradient(135deg, #d4af37 0%, #aa820a 100%)", color: "#000", border: "none", fontWeight: 800, cursor: "pointer" }}
                      title="Auto-render Page 1 cover thumbnails for all catalogs missing a cover"
                    >
                      <Sparkles size={14} />
                      <span>⚡ Auto-Generate All Missing Covers</span>
                    </button>
                    <button type="button" onClick={addPdfCatalogEntry} className="btn-add-item">
                      <Plus size={14} /> Add PDF Catalog
                    </button>
                  </div>
                </div>

                {/* Info Helper Box */}
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontSize: "12px", color: "#166534", lineHeight: 1.5 }}>
                  <strong>💡 Automatic Page-1 Cover Extraction:</strong> Whenever you upload a PDF file from your computer or paste a PDF link, the system will automatically extract Page 1 as a crisp cover thumbnail and host it in Firebase Storage! You can also paste Google Drive links or upload custom cover photos.
                </div>

                {/* Primary PDF */}
                <div className="form-group full-width" style={{ marginBottom: "20px", background: "#f8fafc", padding: "14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <label style={{ fontWeight: 700, color: "#1e293b", marginBottom: "6px" }}>Primary Default PDF Catalog URL</label>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input
                      type="text"
                      placeholder="https://... PDF URL or Google Drive link"
                      value={formData.catalogPdfUrl || ""}
                      onChange={(e) => setFormData({ ...formData, catalogPdfUrl: e.target.value })}
                      style={{ flex: 1 }}
                    />
                    <input
                      type="file"
                      accept=".pdf"
                      id="primaryPdfFile"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) handlePdfUpload(e.target.files[0]);
                      }}
                    />
                    <label htmlFor="primaryPdfFile" className="btn-upload" style={{ cursor: "pointer" }}>
                      <Upload size={14} />
                      <span>{uploadingPdf ? "Uploading..." : "Upload PDF"}</span>
                    </label>
                  </div>
                </div>

                {/* Extra Multiple Catalogs */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {(formData.pdfCatalogs || []).length === 0 ? (
                    <div style={{ padding: "24px", textAlign: "center", background: "#f8fafc", borderRadius: "8px", border: "1px dashed #cbd5e1", color: "#64748b", fontSize: "13px" }}>
                      No multiple catalogs added yet. Click &quot;Add PDF Catalog&quot; above to add specific series catalogs (e.g. Slide NXT, Swing NXT, Kitchens, etc.).
                    </div>
                  ) : (
                    (formData.pdfCatalogs || []).map((cat, idx) => {
                      const isUploadingThisPdf = uploadingIndex?.idx === idx && uploadingIndex?.type === "pdf";
                      const isUploadingThisCover = uploadingIndex?.idx === idx && uploadingIndex?.type === "cover";
                      const hasCover = cat.coverImage && !cat.coverImage.startsWith("/categories/cat_");

                      return (
                        <div key={idx} className="pdf-catalog-card" style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span style={{ fontSize: "12px", fontWeight: 700, color: "#8c764b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                Catalog #{idx + 1}
                              </span>
                              {hasCover ? (
                                <span style={{ fontSize: "11px", background: "#dcfce7", color: "#166534", padding: "2px 8px", borderRadius: "4px", fontWeight: 700 }}>
                                  ✓ Cover Active
                                </span>
                              ) : cat.pdfUrl ? (
                                <span style={{ fontSize: "11px", background: "#fef3c7", color: "#92400e", padding: "2px 8px", borderRadius: "4px", fontWeight: 700 }}>
                                  ⚠️ Needs Cover (Using Branded Fallback)
                                </span>
                              ) : null}
                            </div>
                            <button
                              type="button"
                              onClick={() => removePdfCatalogEntry(idx)}
                              className="btn-trash"
                              title="Remove Catalog"
                              style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", padding: "4px 8px" }}
                            >
                              <X size={14} /> Remove
                            </button>
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
                            {/* Catalog Title */}
                            <div>
                              <label style={{ fontSize: "11px", fontWeight: 700, color: "#475569", display: "block", marginBottom: "4px" }}>
                                Catalog Title *
                              </label>
                              <input
                                type="text"
                                value={cat.title}
                                onChange={(e) => {
                                  const updated = [...(formData.pdfCatalogs || [])];
                                  updated[idx] = { ...updated[idx], title: e.target.value };
                                  setFormData({ ...formData, pdfCatalogs: updated });
                                }}
                                placeholder="e.g. Slide NXT Specification Guide"
                                style={{ width: "100%" }}
                              />
                            </div>

                            {/* PDF URL & Upload */}
                            <div>
                              <label style={{ fontSize: "11px", fontWeight: 700, color: "#475569", display: "block", marginBottom: "4px" }}>
                                PDF File URL or Google Drive Link *
                              </label>
                              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                <input
                                  type="text"
                                  value={cat.pdfUrl}
                                  onChange={(e) => {
                                    const updated = [...(formData.pdfCatalogs || [])];
                                    updated[idx] = { ...updated[idx], pdfUrl: e.target.value };
                                    setFormData({ ...formData, pdfCatalogs: updated });
                                  }}
                                  placeholder="https://... PDF URL or Google Drive share link"
                                  style={{ flex: 1 }}
                                />
                                <input
                                  type="file"
                                  accept=".pdf"
                                  id={`pdf_upload_${idx}`}
                                  style={{ display: "none" }}
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) handlePdfUpload(e.target.files[0], idx);
                                  }}
                                />
                                <label htmlFor={`pdf_upload_${idx}`} className="btn-upload" style={{ cursor: "pointer", whiteSpace: "nowrap" }}>
                                  <Upload size={13} />
                                  <span>{isUploadingThisPdf ? "Uploading..." : "Upload PDF"}</span>
                                </label>
                              </div>
                            </div>

                            {/* Cover Thumbnail Image */}
                            <div>
                              <label style={{ fontSize: "11px", fontWeight: 700, color: "#475569", display: "block", marginBottom: "4px" }}>
                                Cover Thumbnail Image (Auto-captured from Page 1, or upload custom)
                              </label>
                              <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                                <input
                                  type="text"
                                  value={cat.coverImage || ""}
                                  onChange={(e) => {
                                    const updated = [...(formData.pdfCatalogs || [])];
                                    updated[idx] = { ...updated[idx], coverImage: e.target.value };
                                    setFormData({ ...formData, pdfCatalogs: updated });
                                  }}
                                  placeholder="https://... Image URL (auto-generated upon PDF upload)"
                                  style={{ flex: 1, minWidth: "200px" }}
                                />
                                <input
                                  type="file"
                                  accept="image/*"
                                  id={`cover_upload_${idx}`}
                                  style={{ display: "none" }}
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) handleCoverUpload(e.target.files[0], idx);
                                  }}
                                />
                                <label htmlFor={`cover_upload_${idx}`} className="btn-upload" style={{ cursor: "pointer", whiteSpace: "nowrap", background: "#475569" }}>
                                  <ImageIcon size={13} />
                                  <span>{isUploadingThisCover ? "Uploading..." : "Upload Custom Cover"}</span>
                                </label>

                                <button
                                  type="button"
                                  onClick={() => handleAutoExtractCover(idx)}
                                  disabled={!cat.pdfUrl || isUploadingThisCover}
                                  className="btn-upload"
                                  style={{ cursor: "pointer", whiteSpace: "nowrap", background: "#8c764b", border: "none", color: "#fff" }}
                                  title="Automatically render Page 1 of this PDF as cover thumbnail"
                                >
                                  <Sparkles size={13} />
                                  <span>{isUploadingThisCover ? "Capturing..." : "⚡ Auto Page 1"}</span>
                                </button>

                                {cat.coverImage && (
                                  <div style={{ width: "36px", height: "46px", borderRadius: "4px", overflow: "hidden", border: "1px solid #cbd5e1", flexShrink: 0, background: "#f1f5f9" }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={cat.coverImage} alt="Cover Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: LIVE BRAND PAGE PREVIEW */}
          <div className="preview-column">
            <div className="preview-card">
              <div className="preview-header">
                <Sparkles size={14} color="#8c764b" />
                <span>Live Brand Page Preview</span>
              </div>

              {/* Mock Brand Hero */}
              <div className="mock-brand-hero">
                <div
                  className="mock-hero-bg"
                  style={{
                    backgroundImage: formData.bannerUrl ? `url(${formData.bannerUrl})` : "linear-gradient(135deg, #1e293b, #0f172a)",
                  }}
                >
                  <div className="mock-hero-overlay" />
                  <div className="mock-hero-text">
                    <div className="mock-shortcode">{formData.shortCode || "SF 01"}</div>
                    <div className="mock-brand-title">{formData.name || "Brand Name"}</div>
                    <div className="mock-hero-badges">
                      <span>{formData.category || "Category"}</span>
                      <span>{formData.origin || "Origin"}</span>
                      {formData.founded && <span>Est. {formData.founded}</span>}
                    </div>
                  </div>
                </div>

                {/* Mock Info Bar */}
                <div className="mock-info-bar">
                  <div className="mock-tagline">&ldquo;{formData.tagline || "Brand Tagline Quote will appear here..."}&rdquo;</div>
                  <div className="mock-stats-row">
                    <div>
                      <span className="lbl">Category</span>
                      <span className="val">{formData.category || "General"}</span>
                    </div>
                    <div>
                      <span className="lbl">Origin</span>
                      <span className="val">{formData.origin || "Italy"}</span>
                    </div>
                    {formData.founded && (
                      <div>
                        <span className="lbl">Est.</span>
                        <span className="val">{formData.founded}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mock About Section */}
                <div className="mock-about-section">
                  <div className="mock-about-label">ABOUT THE BRAND</div>
                  <p className="mock-about-text">
                    {formData.description || "Brand story description will appear here on the public brand page."}
                  </p>
                  <div className="mock-accent-bar" style={{ background: formData.accentColor || "#8c764b" }} />
                </div>
              </div>

              <div className="meta-summary-box">
                <div className="summary-row">
                  <span>Category:</span>
                  <strong>{formData.category}</strong>
                </div>
                <div className="summary-row">
                  <span>Origin:</span>
                  <strong>{formData.origin}</strong>
                </div>
                <div className="summary-row">
                  <span>Collections:</span>
                  <strong>{formData.collections?.length || 0} Filter Chips</strong>
                </div>
                <div className="summary-row">
                  <span>PDF Catalogs:</span>
                  <strong>{formData.catalogPdfUrl || formData.pdfCatalogs?.length ? "Attached ✓" : "None"}</strong>
                </div>
              </div>

              <button
                onClick={() => handleSave()}
                disabled={saving}
                className="btn-primary"
                style={{ width: "100%", justifyContent: "center", marginTop: "16px" }}
              >
                <Save size={16} />
                <span>{saving ? "Saving Changes..." : "Save All Changes"}</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* FLOATING TOAST */}
      <div className={`toast ${toastMsg ? "show" : ""}`}>
        <span>{toastMsg}</span>
      </div>

      {/* STYLES */}
      <style jsx global>{`
        .admin-page-container {
          background: #FAF8F5;
          color: #1E1E1E;
          min-height: 100vh;
          font-size: 13px;
        }

        .admin-main {
          max-width: 1400px;
          margin: 0 auto;
          padding: 32px 24px 80px;
        }

        @media (min-width: 640px) {
          .admin-main { padding: 36px 48px 80px; }
        }

        .top-header-nav {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 28px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(0,0,0,0.08);
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #8c764b;
          margin-bottom: 6px;
          transition: color 0.2s;
        }
        .back-link:hover { color: #1e1e1e; }

        .title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .editor-title {
          font-size: 24px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          margin: 0;
        }

        .id-pill {
          background: #e2e8f0;
          color: #475569;
          font-size: 11px;
          font-family: monospace;
          padding: 3px 8px;
          border-radius: 6px;
          font-weight: 600;
        }

        .code-badge {
          background: #8c764b;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 6px;
        }

        .category-badge {
          background: #1e1e1e;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 6px;
        }

        .action-buttons {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #1e1e1e;
          color: #ffffff;
          border-radius: 8px;
          font-weight: 700;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-primary:hover { background: #8c764b; }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: #ffffff;
          color: #1e1e1e;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-weight: 700;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-secondary:hover { background: #f3f4f6; border-color: #9ca3af; }

        .btn-danger {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 14px;
          background: #fee2e2;
          color: #dc2626;
          border: 1px solid #fca5a5;
          border-radius: 8px;
          font-weight: 700;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-danger:hover { background: #dc2626; color: #fff; }

        .editor-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        @media (min-width: 1024px) {
          .editor-layout {
            grid-template-columns: 65% 35%;
          }
        }

        .nav-tabs {
          display: flex;
          overflow-x: auto;
          gap: 6px;
          background: #ffffff;
          padding: 6px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          margin-bottom: 20px;
        }

        .tab-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 14px;
          border-radius: 8px;
          border: none;
          background: transparent;
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }
        .tab-item.active {
          background: #1e1e1e;
          color: #ffffff;
        }

        .section-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.05);
        }

        .section-title {
          font-size: 18px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          margin-bottom: 4px;
        }

        .section-sub {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 24px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        @media (min-width: 640px) {
          .form-grid {
            grid-template-columns: 1fr 1fr;
          }
          .form-grid .full-width {
            grid-column: span 2;
          }
        }

        .form-group label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #475569;
          margin-bottom: 6px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          background: #f8fafc;
          font-size: 13px;
          font-family: inherit;
          color: #1e1e1e;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: #8c764b;
          background: #ffffff;
        }

        .media-block {
          margin-bottom: 20px;
        }

        .block-label {
          display: block;
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #1e1e1e;
          margin-bottom: 10px;
        }

        .banner-preview-box {
          width: 100%;
          height: 160px;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-preview-box {
          width: 120px;
          height: 70px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
        }

        .btn-upload {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: #2563eb;
          color: #ffffff;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.2s;
        }
        .btn-upload:hover { background: #1d4ed8; }

        .btn-add-item {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: #8c764b;
          color: #ffffff;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          white-space: nowrap;
        }

        .chips-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
        }

        .chip button {
          border: none;
          background: none;
          cursor: pointer;
          color: #94a3b8;
          font-size: 12px;
          margin-left: 2px;
        }
        .chip button:hover { color: #dc2626; }

        .pdf-catalog-row {
          display: flex;
          gap: 12px;
          align-items: center;
          padding: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
        }

        .btn-trash {
          background: transparent;
          border: none;
          color: #dc2626;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
        }
        .btn-trash:hover { background: #fee2e2; }

        .divider {
          margin: 24px 0;
          border: none;
          border-top: 1px solid #e2e8f0;
        }

        /* PREVIEW COLUMN */
        .preview-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.05);
          position: sticky;
          top: 24px;
        }

        .preview-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #8c764b;
          margin-bottom: 14px;
        }

        .mock-brand-hero {
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          background: #FAF8F5;
          margin-bottom: 16px;
        }

        .mock-hero-bg {
          height: 160px;
          position: relative;
          background-size: cover;
          background-position: center;
          padding: 16px;
          display: flex;
          align-items: flex-end;
        }

        .mock-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 100%);
        }

        .mock-hero-text {
          position: relative;
          z-index: 2;
          color: #ffffff;
        }

        .mock-shortcode {
          font-size: 10px;
          font-weight: 800;
          color: #8c764b;
          text-transform: uppercase;
        }

        .mock-brand-title {
          font-size: 20px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          margin: 2px 0 6px;
        }

        .mock-hero-badges {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .mock-hero-badges span {
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(4px);
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .mock-info-bar {
          padding: 12px 14px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          background: #ffffff;
        }

        .mock-tagline {
          font-size: 12px;
          font-style: italic;
          color: #1e1e1e;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .mock-stats-row {
          display: flex;
          gap: 16px;
        }

        .mock-stats-row .lbl {
          display: block;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          color: #94a3b8;
        }

        .mock-stats-row .val {
          font-size: 11px;
          font-weight: 800;
          color: #1e1e1e;
        }

        .mock-about-section {
          padding: 14px;
          position: relative;
        }

        .mock-about-label {
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #94a3b8;
          margin-bottom: 4px;
        }

        .mock-about-text {
          font-size: 11px;
          color: #475569;
          line-height: 1.4;
          padding-right: 12px;
        }

        .mock-accent-bar {
          position: absolute;
          right: 0;
          top: 14px;
          bottom: 14px;
          width: 3px;
          border-radius: 2px;
        }

        .meta-summary-box {
          background: #f8fafc;
          border-radius: 8px;
          padding: 12px;
          font-size: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #64748b;
        }
        .summary-row strong { color: #1e1e1e; }

        /* Floating Toast */
        .toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: #1e1e1e;
          color: #fff;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 13px;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
          z-index: 9999;
        }
        .toast.show {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
