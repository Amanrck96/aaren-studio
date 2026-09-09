"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AdminNav from "@/components/AdminNav";
import { BrandDownloadFolder, DownloadPdfItem } from "@/lib/types";
import { getPdfThumbnail, resolveCatalogDetails } from "@/utils/pdfThumbnail";
import { generateQrWithLogo, downloadQrCanvas, BRAND_LOGOS } from "@/utils/qrWithLogo";
import {
  Folder,
  FileText,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  RefreshCw,
  Search,
  Upload,
  Link as LinkIcon,
  Check,
  Eye,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  QrCode,
  Download,
  Copy,
  X,
} from "lucide-react";

function AdminDownloadsContent() {
  const searchParams = useSearchParams();
  const initialBrandId = searchParams.get("brandId");

  const [folders, setFolders] = useState<BrandDownloadFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolderId, setSelectedFolderId] = useState<string>(initialBrandId || "");
  const [search, setSearch] = useState("");

  // Modal / Form state
  const [showModal, setShowModal] = useState(false);
  const [editingPdf, setEditingPdf] = useState<Partial<DownloadPdfItem> | null>(null);
  const [targetBrandId, setTargetBrandId] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Direct QR Code Modal State
  const [qrModal, setQrModal] = useState<{
    isOpen: boolean;
    title: string;
    brand: string;
    url: string;
  } | null>(null);
  const [copiedQr, setCopiedQr] = useState(false);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (qrModal && qrCanvasRef.current) {
      const matchingBrand = BRAND_LOGOS.find((b) =>
        qrModal.brand.toLowerCase().includes(b.name.toLowerCase())
      );
      generateQrWithLogo(qrCanvasRef.current, {
        url: qrModal.url,
        size: 1000,
        color: "#1E1E1E",
        bgColor: "#FFFFFF",
        logoType: matchingBrand ? "brand" : "aaren",
        logoUrl: matchingBrand?.file,
        brandName: qrModal.brand,
        logoShape: "rounded",
        badgeBorderColor: "#81663F",
      }).catch((e) => console.error("Failed to render QR:", e));
    }
  }, [qrModal]);

  const fetchFolders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/downloads?t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setFolders(json.data);
          if (!selectedFolderId && json.data.length > 0) {
            setSelectedFolderId(json.data[0].id);
          }
        }
      }
    } catch (e) {
      console.error("Error fetching folders in admin:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  useEffect(() => {
    if (initialBrandId) {
      setSelectedFolderId(initialBrandId);
    }
  }, [initialBrandId]);

  const selectedFolder = folders.find((f) => f.id === selectedFolderId) || folders[0];

  const handleOpenAddModal = (brandId?: string) => {
    const bId = brandId || selectedFolderId || (folders[0] ? folders[0].id : "");
    const folder = folders.find((f) => f.id === bId);
    setTargetBrandId(bId);
    setEditingPdf({
      title: "",
      fileUrl: "",
      fileName: "",
      coverImage: "",
      category: folder?.brandCategory || "Catalog",
      fileSize: "PDF Document",
      description: "",
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (brandId: string, pdf: DownloadPdfItem) => {
    setTargetBrandId(brandId);
    setEditingPdf({ ...pdf });
    setShowModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "Brand_Assets");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const finalUrl = data.url || data.dataUrl;
      if (data.success && finalUrl) {
        setEditingPdf((prev) => ({
          ...prev,
          fileUrl: finalUrl,
          fileName: file.name,
          title: prev?.title || file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "),
          fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        }));
        setToast("✅ PDF uploaded successfully to Firebase Storage!");
        setTimeout(() => setToast(null), 4000);
      } else {
        alert("Upload error: " + (data.error || "Failed to upload"));
      }
    } catch (err: any) {
      alert("Error uploading file: " + err.message);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "Thumbnails");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const finalUrl = data.url || data.dataUrl;
      if (data.success && finalUrl) {
        setEditingPdf((prev) => ({
          ...prev,
          coverImage: finalUrl,
        }));
        setToast("✅ Cover thumbnail uploaded to Firebase Storage!");
        setTimeout(() => setToast(null), 4000);
      } else {
        alert("Upload error: " + (data.error || "Failed to upload"));
      }
    } catch (err: any) {
      alert("Error uploading cover: " + err.message);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSavePdf = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetBrandId) {
      alert("Please select a brand folder.");
      return;
    }
    if (!editingPdf?.fileUrl) {
      alert("Please enter or upload a Firebase PDF URL.");
      return;
    }
    if (!editingPdf?.title) {
      alert("Please enter a title for the PDF catalog.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandId: targetBrandId,
          pdf: editingPdf,
        }),
      });

      if (!res.ok) {
        alert("Save failed with status " + res.status);
        return;
      }

      const json = await res.json();
      if (json.success) {
        const savedPdf = json.data;
        if (savedPdf && targetBrandId) {
          setFolders((prev) => {
            return prev.map((f) => {
              if (f.id === targetBrandId || f.brandName.toLowerCase() === targetBrandId.toLowerCase()) {
                const files = Array.isArray(f.files) ? [...f.files] : [];
                const idx = files.findIndex((file) => file.id === savedPdf.id);
                if (idx >= 0) {
                  files[idx] = savedPdf;
                } else {
                  files.unshift(savedPdf);
                }
                return { ...f, files };
              }
              return f;
            });
          });
        }
        setShowModal(false);
        setToast("✨ PDF link saved permanently to brand folder!");
        setTimeout(() => setToast(null), 5000);
        fetchFolders();
      } else {
        alert("Save error: " + (json.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error saving PDF: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePdf = async (brandId: string, pdfId: string, title: string) => {
    if (!confirm(`Are you sure you want to remove "${title}" from this brand folder?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/downloads?brandId=${brandId}&pdfId=${pdfId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setToast("🗑️ PDF removed from folder");
        setTimeout(() => setToast(null), 4000);
        fetchFolders();
      } else {
        alert("Delete error: " + (json.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error deleting PDF: " + err.message);
    }
  };

  const filteredFolders = folders.filter((f) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return f.brandName.toLowerCase().includes(q) || (f.brandCategory && f.brandCategory.toLowerCase().includes(q));
  });

  return (
    <div style={{ background: "#FAF8F5", color: "#1E1E1E", minHeight: "100vh", fontFamily: "var(--font-jost), 'Jost', sans-serif" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem", background: "#FAF8F5" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.8rem" }}>📁</span>
              <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#81663F", margin: 0 }}>
                Brand Downloads &amp; Firebase PDF Repository
              </h1>
            </div>
            <p style={{ color: "#5E5852", fontSize: "0.92rem", margin: "4px 0 0" }}>
              Manage open-access PDF catalog links for all 20 European luxury brands. All changes save live to Firebase.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            {toast && (
              <span style={{ background: "#d1fae5", color: "#065f46", padding: "8px 14px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 700, border: "1px solid #a7f3d0" }}>
                {toast}
              </span>
            )}

            <button
              onClick={fetchFolders}
              disabled={loading}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "0.65rem 1.2rem",
                background: "#FFFFFF",
                border: "1px solid #D5CEBF",
                borderRadius: "8px",
                fontWeight: 700,
                color: "#1E1E1E",
                cursor: loading ? "wait" : "pointer",
                fontSize: "0.85rem",
              }}
            >
              <RefreshCw size={14} className={loading ? "spin" : ""} />
              <span>Refresh</span>
            </button>

            <Link
              href="/downloads"
              target="_blank"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "0.65rem 1.2rem",
                background: "#FAF8F5",
                color: "#81663F",
                border: "1px solid #D5CEBF",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 800,
                fontSize: "0.85rem",
              }}
            >
              <span>View Live /downloads</span>
              <ExternalLink size={13} />
            </Link>

            <button
              onClick={() => handleOpenAddModal()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "0.65rem 1.4rem",
                background: "#81663F",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                fontWeight: 800,
                fontSize: "0.85rem",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(129,102,63,0.25)",
              }}
            >
              <Plus size={15} />
              <span>Add PDF to Brand</span>
            </button>
          </div>
        </div>

        {/* Brand Folders Quick Switcher & Manager */}
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "2rem", alignItems: "start" }}>
          {/* Left Sidebar: 20 Folders List */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "14px",
              border: "1px solid #E2DCD2",
              padding: "1.2rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ marginBottom: "1rem", position: "relative" }}>
              <input
                type="text"
                placeholder="Search 20 brand folders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.55rem 0.8rem 0.55rem 2rem",
                  borderRadius: "8px",
                  border: "1px solid #D5CEBF",
                  background: "#FAF8F5",
                  fontSize: "0.85rem",
                  color: "#1E1E1E",
                }}
              />
              <Search size={13} style={{ position: "absolute", left: "0.7rem", top: "50%", transform: "translateY(-50%)", color: "#81663F" }} />
            </div>

            <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#81663F", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 0.4rem 0.6rem" }}>
              Brand Folders ({folders.length})
            </div>

            <div style={{ maxHeight: "calc(100vh - 300px)", overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px" }}>
              {filteredFolders.map((f, idx) => {
                const isSelected = f.id === selectedFolder?.id;
                const count = Array.isArray(f.files) ? f.files.length : 0;
                return (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFolderId(f.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.7rem 0.8rem",
                      borderRadius: "8px",
                      border: isSelected ? "1px solid #81663F" : "1px solid transparent",
                      background: isSelected ? "#FAF8F5" : "transparent",
                      color: isSelected ? "#81663F" : "#1E1E1E",
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          background: isSelected ? "#81663F" : "rgba(129, 102, 63, 0.1)",
                          color: isSelected ? "#FFFFFF" : "#81663F",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          fontSize: "0.75rem",
                          fontWeight: 800,
                        }}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </div>
                      <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        <div style={{ fontWeight: 800, fontSize: "0.88rem", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {f.brandName}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "#8A8275" }}>
                          {f.brandCategory || "Brand"}
                        </div>
                      </div>
                    </div>

                    <span
                      style={{
                        padding: "2px 7px",
                        borderRadius: "999px",
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        background: count > 0 ? "rgba(16, 185, 129, 0.15)" : "#FAF8F5",
                        color: count > 0 ? "#065f46" : "#8A8275",
                        flexShrink: 0,
                      }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Main Area: Selected Brand Folder Details & Files */}
          <div>
            {selectedFolder ? (
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: "14px",
                  border: "1px solid #E2DCD2",
                  padding: "1.8rem 2rem",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                }}
              >
                {/* Brand Folder Top Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #EAE4D8", paddingBottom: "1.2rem", marginBottom: "1.8rem", flexWrap: "wrap", gap: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ width: "56px", height: "56px", borderRadius: "10px", background: "#FAF8F5", border: "1px solid #D5CEBF", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {selectedFolder.brandLogo ? (
                        <img src={selectedFolder.brandLogo} alt={selectedFolder.brandName} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                      ) : (
                        <Folder size={28} color="#81663F" />
                      )}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#1E1E1E", margin: 0 }}>
                          {selectedFolder.brandName} Folder
                        </h2>
                        <span style={{ background: "rgba(129, 102, 63, 0.12)", color: "#81663F", padding: "3px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 800 }}>
                          {selectedFolder.brandCategory || "Category"}
                        </span>
                      </div>
                      <p style={{ color: "#5E5852", fontSize: "0.85rem", margin: "2px 0 0" }}>
                        {selectedFolder.description || "Manage PDF brochures and catalogs for this brand."}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <Link
                      href={`/downloads/All%2020%20Brand%20Folders/${encodeURIComponent(selectedFolder.brandName)}/${selectedFolder.files?.length || 0}%20PDFs`}
                      target="_blank"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "0.65rem 1.2rem",
                        background: "#FAF8F5",
                        color: "#81663F",
                        border: "1px solid #D5CEBF",
                        borderRadius: "8px",
                        textDecoration: "none",
                        fontWeight: 800,
                        fontSize: "0.85rem",
                      }}
                    >
                      <span>View Live Brand Downloads</span>
                      <ExternalLink size={13} />
                    </Link>

                    <button
                      onClick={() => handleOpenAddModal(selectedFolder.id)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "0.65rem 1.3rem",
                        background: "#1E1E1E",
                        color: "#FFFFFF",
                        borderRadius: "8px",
                        border: "none",
                        fontWeight: 800,
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      }}
                    >
                      <Plus size={14} />
                      <span>Upload / Add PDF to {selectedFolder.brandName}</span>
                    </button>
                  </div>
                </div>

                {/* Direct Shareable Link Strip */}
                <div
                  style={{
                    background: "#FAF8F5",
                    borderRadius: "8px",
                    border: "1px solid #E2DCD2",
                    padding: "0.8rem 1.2rem",
                    marginBottom: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "0.8rem",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 800, color: "#81663F" }}>Full Link:</span>
                      <code style={{ background: "#FFFFFF", padding: "3px 8px", borderRadius: "4px", border: "1px solid #D5CEBF", color: "#1E1E1E", fontWeight: 700 }}>
                        /downloads/All 20 Brand Folders/{selectedFolder.brandName}/{selectedFolder.files?.length || 0} PDFs
                      </code>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.82rem", color: "#6A6359", flexWrap: "wrap" }}>
                      <span>Short Link:</span>
                      <code style={{ background: "#FFFFFF", padding: "2px 6px", borderRadius: "4px", border: "1px solid #D5CEBF", color: "#81663F" }}>
                        /downloads/brands/{selectedFolder.id}
                      </code>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <button
                      onClick={() => {
                        const url = `${window.location.origin}/downloads/All%2020%20Brand%20Folders/${encodeURIComponent(selectedFolder.brandName)}/${selectedFolder.files?.length || 0}%20PDFs`;
                        navigator.clipboard.writeText(url);
                        setToast(`✅ Copied Full Link: ${url}`);
                        setTimeout(() => setToast(null), 3000);
                      }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        background: "#FFFFFF",
                        border: "1px solid #D5CEBF",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        fontSize: "0.78rem",
                        fontWeight: 800,
                        color: "#81663F",
                        cursor: "pointer",
                      }}
                    >
                      <Check size={12} />
                      <span>Copy Full Link</span>
                    </button>
                  </div>
                </div>

                {/* PDF Files List in this Folder */}
                {(!selectedFolder.files || selectedFolder.files.length === 0) ? (
                  <div style={{ padding: "4rem 2rem", textAlign: "center", background: "#FAF8F5", borderRadius: "10px", border: "1px dashed #D5CEBF" }}>
                    <Folder size={38} color="#81663F" style={{ margin: "0 auto 0.8rem", display: "block" }} />
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1E1E1E", margin: 0 }}>
                      No PDF Catalogs in this Brand Folder yet
                    </h3>
                    <p style={{ color: "#5E5852", fontSize: "0.85rem", margin: "4px 0 1rem" }}>
                      Click the button below to link a Firebase Storage URL or upload a PDF document.
                    </p>
                    <button
                      onClick={() => handleOpenAddModal(selectedFolder.id)}
                      style={{
                        padding: "0.6rem 1.4rem",
                        background: "#81663F",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: 800,
                        fontSize: "0.85rem",
                        cursor: "pointer",
                      }}
                    >
                      + Add Firebase PDF URL
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {selectedFolder.files.map((pdf, idx) => {
                      const resolved = resolveCatalogDetails({
                        catalogPdfUrl: pdf.fileUrl,
                        title: pdf.title,
                        brand: selectedFolder.brandName,
                        coverImage: pdf.coverImage,
                      });
                      const coverThumb = resolved.coverThumb || pdf.coverImage || getPdfThumbnail(pdf.fileUrl, { title: pdf.title, brandId: selectedFolder.brandName });

                      return (
                        <div
                          key={pdf.id || idx}
                          style={{
                            background: "#FAF8F5",
                            borderRadius: "10px",
                            border: "1px solid #E2DCD2",
                            padding: "1rem 1.4rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: "1rem",
                          }}
                        >
                          {/* Left: Thumbnail & Title */}
                          <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: "1 1 300px" }}>
                            <div
                              style={{
                                width: "46px",
                                height: "62px",
                                borderRadius: "4px",
                                overflow: "hidden",
                                background: "#181920",
                                border: "1px solid #D5CEBF",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              {coverThumb ? (
                                <img src={coverThumb} alt={pdf.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              ) : (
                                <FileText size={20} color="#81663F" />
                              )}
                            </div>

                            <div>
                              <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#1E1E1E" }}>
                                {pdf.title}
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "3px" }}>
                                <span style={{ fontSize: "0.72rem", color: "#81663F", fontWeight: 700 }}>
                                  {pdf.category || "Specification"}
                                </span>
                                {pdf.fileSize && (
                                  <span style={{ fontSize: "0.72rem", color: "#8A8275" }}>
                                    • {pdf.fileSize}
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: "0.72rem", color: "#8A8275", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "450px" }}>
                                <a href={pdf.fileUrl} target="_blank" rel="noreferrer" style={{ color: "#81663F", textDecoration: "underline" }}>
                                  {pdf.fileUrl}
                                </a>
                              </div>
                            </div>
                          </div>

                          {/* Right: Action Buttons */}
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <a
                              href={pdf.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                padding: "6px 12px",
                                background: "#FFFFFF",
                                border: "1px solid #D5CEBF",
                                borderRadius: "6px",
                                color: "#1E1E1E",
                                fontWeight: 700,
                                fontSize: "0.78rem",
                                textDecoration: "none",
                              }}
                            >
                              <ExternalLink size={12} />
                              <span>Open in New Tab</span>
                            </a>

                            <button
                              onClick={() => {
                                setQrModal({
                                  isOpen: true,
                                  title: pdf.title,
                                  brand: selectedFolder.brandName,
                                  url: pdf.fileUrl,
                                });
                                setCopiedQr(false);
                              }}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                padding: "6px 12px",
                                background: "#81663F",
                                border: "1px solid #81663F",
                                borderRadius: "6px",
                                color: "#FFFFFF",
                                fontWeight: 700,
                                fontSize: "0.78rem",
                                cursor: "pointer",
                              }}
                            >
                              <QrCode size={12} />
                              <span>QR Code</span>
                            </button>

                            <button
                              onClick={() => handleOpenEditModal(selectedFolder.id, pdf)}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                padding: "6px 12px",
                                background: "#FFFFFF",
                                border: "1px solid #D5CEBF",
                                borderRadius: "6px",
                                color: "#81663F",
                                fontWeight: 700,
                                fontSize: "0.78rem",
                                cursor: "pointer",
                              }}
                            >
                              <Edit size={12} />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => handleDeletePdf(selectedFolder.id, pdf.id, pdf.title)}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                padding: "6px 12px",
                                background: "#fee2e2",
                                border: "1px solid #fca5a5",
                                borderRadius: "6px",
                                color: "#b91c1c",
                                fontWeight: 700,
                                fontSize: "0.78rem",
                                cursor: "pointer",
                              }}
                            >
                              <Trash2 size={12} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding: "4rem", textAlign: "center", color: "#81663F", fontWeight: 700 }}>
                Select a brand folder on the left.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Upload / Add / Edit PDF Modal */}
      {showModal && editingPdf && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "2rem",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              border: "1px solid #E2DCD2",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.4rem", borderBottom: "1px solid #EAE4D8", paddingBottom: "0.8rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(129, 102, 63, 0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FileText size={18} color="#81663F" />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#1E1E1E", margin: 0 }}>
                    {editingPdf.id ? "Edit Brand PDF" : "Add Brand PDF Document"}
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "#5E5852", margin: "2px 0 0" }}>
                    Paste a Firebase Storage URL or upload directly.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowModal(false)}
                style={{ background: "none", border: "none", fontSize: "1.2rem", color: "#8A8275", cursor: "pointer", fontWeight: 700 }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePdf} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              {/* Target Brand Selection */}
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 800, color: "#81663F", marginBottom: "0.4rem" }}>
                  Brand Folder *
                </label>
                <select
                  value={targetBrandId}
                  onChange={(e) => setTargetBrandId(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "0.65rem",
                    borderRadius: "8px",
                    border: "1px solid #D5CEBF",
                    background: "#FAF8F5",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    color: "#1E1E1E",
                  }}
                >
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.brandName} ({f.brandCategory || "Category"})
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 800, color: "#81663F", marginBottom: "0.4rem" }}>
                  Document Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Slide NXT Specification Manual 2026"
                  value={editingPdf.title || ""}
                  onChange={(e) => setEditingPdf({ ...editingPdf, title: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "0.65rem",
                    borderRadius: "8px",
                    border: "1px solid #D5CEBF",
                    background: "#FAF8F5",
                    fontSize: "0.88rem",
                    color: "#1E1E1E",
                  }}
                />
              </div>

              {/* Firebase PDF URL */}
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 800, color: "#81663F", marginBottom: "0.4rem" }}>
                  Firebase PDF URL Link *
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="url"
                    placeholder="https://firebasestorage.googleapis.com/v0/b/... or /catalogues/..."
                    value={editingPdf.fileUrl || ""}
                    onChange={(e) => setEditingPdf({ ...editingPdf, fileUrl: e.target.value })}
                    required
                    style={{
                      flex: 1,
                      padding: "0.65rem",
                      borderRadius: "8px",
                      border: "1px solid #D5CEBF",
                      background: "#FAF8F5",
                      fontSize: "0.85rem",
                      color: "#1E1E1E",
                    }}
                  />
                  <label
                    style={{
                      padding: "0.65rem 1rem",
                      background: "#FAF8F5",
                      border: "1px solid #D5CEBF",
                      borderRadius: "8px",
                      cursor: uploadingFile ? "wait" : "pointer",
                      fontSize: "0.82rem",
                      fontWeight: 800,
                      color: "#81663F",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Upload size={14} />
                    <span>{uploadingFile ? "Uploading..." : "Upload File"}</span>
                    <input type="file" accept="application/pdf" onChange={handleFileUpload} style={{ display: "none" }} disabled={uploadingFile} />
                  </label>
                </div>
                <small style={{ color: "#8A8275", fontSize: "0.72rem", marginTop: "4px", display: "block" }}>
                  Paste any Firebase Storage download URL, Google Cloud link, or upload directly.
                </small>
              </div>

              {/* Cover Image URL / Page 1 Cover */}
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 800, color: "#81663F", marginBottom: "0.4rem" }}>
                  Page 1 Cover Thumbnail URL (Optional)
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    placeholder="Auto-resolved from catalog or paste thumbnail image URL"
                    value={editingPdf.coverImage || ""}
                    onChange={(e) => setEditingPdf({ ...editingPdf, coverImage: e.target.value })}
                    style={{
                      flex: 1,
                      padding: "0.65rem",
                      borderRadius: "8px",
                      border: "1px solid #D5CEBF",
                      background: "#FAF8F5",
                      fontSize: "0.85rem",
                      color: "#1E1E1E",
                    }}
                  />
                  <label
                    style={{
                      padding: "0.65rem 1rem",
                      background: "#FAF8F5",
                      border: "1px solid #D5CEBF",
                      borderRadius: "8px",
                      cursor: uploadingFile ? "wait" : "pointer",
                      fontSize: "0.82rem",
                      fontWeight: 800,
                      color: "#81663F",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Upload size={14} />
                    <span>Upload Cover</span>
                    <input type="file" accept="image/*" onChange={handleCoverUpload} style={{ display: "none" }} disabled={uploadingFile} />
                  </label>
                </div>
                <small style={{ color: "#8A8275", fontSize: "0.72rem", marginTop: "4px", display: "block" }}>
                  If left blank, the system automatically resolves the official brand catalog Page 1 cover thumbnail.
                </small>
              </div>

              {/* Category & File Size Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 800, color: "#81663F", marginBottom: "0.4rem" }}>
                    Category / Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Master Catalog, Finishes"
                    value={editingPdf.category || ""}
                    onChange={(e) => setEditingPdf({ ...editingPdf, category: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.65rem",
                      borderRadius: "8px",
                      border: "1px solid #D5CEBF",
                      background: "#FAF8F5",
                      fontSize: "0.88rem",
                      color: "#1E1E1E",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 800, color: "#81663F", marginBottom: "0.4rem" }}>
                    File Size
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 12.4 MB"
                    value={editingPdf.fileSize || ""}
                    onChange={(e) => setEditingPdf({ ...editingPdf, fileSize: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.65rem",
                      borderRadius: "8px",
                      border: "1px solid #D5CEBF",
                      background: "#FAF8F5",
                      fontSize: "0.88rem",
                      color: "#1E1E1E",
                    }}
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "1rem", borderTop: "1px solid #EAE4D8", paddingTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "0.65rem 1.3rem",
                    background: "#FAF8F5",
                    border: "1px solid #D5CEBF",
                    borderRadius: "8px",
                    color: "#1E1E1E",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: "0.65rem 1.6rem",
                    background: "#81663F",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    cursor: saving ? "wait" : "pointer",
                    boxShadow: "0 4px 12px rgba(129,102,63,0.25)",
                  }}
                >
                  {saving ? "Saving to Firebase..." : "Save PDF to Brand"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Direct QR Code Generator Modal */}
      {qrModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
          onClick={() => setQrModal(null)}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              padding: "2rem 2.4rem",
              maxWidth: "480px",
              width: "100%",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              border: "1px solid #D5CEBF",
              textAlign: "center",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setQrModal(null)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "#FAF8F5",
                border: "1px solid #D5CEBF",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#1E1E1E",
              }}
            >
              <X size={16} />
            </button>

            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#81663F", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {qrModal.brand}
            </span>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1E1E1E", margin: "0.4rem 0 1.2rem", lineHeight: 1.3 }}>
              {qrModal.title}
            </h3>

            {/* QR Code Canvas */}
            <div
              style={{
                background: "#FAF8F5",
                padding: "1rem",
                borderRadius: "12px",
                border: "1px solid #E2DCD2",
                display: "inline-block",
                boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
              }}
            >
              <canvas
                ref={qrCanvasRef}
                style={{ width: "240px", height: "240px", display: "block", borderRadius: "8px" }}
              />
            </div>

            {/* Direct Link Info */}
            <div style={{ marginTop: "1rem", background: "#FAF8F5", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid #E2DCD2", textAlign: "left" }}>
              <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#81663F", textTransform: "uppercase", marginBottom: "4px" }}>
                Direct PDF Access (Zero Warning Screens):
              </div>
              <div style={{ fontSize: "0.75rem", color: "#1E1E1E", wordBreak: "break-all", fontFamily: "monospace", maxHeight: "50px", overflowY: "auto" }}>
                {qrModal.url}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "10px", marginTop: "1.2rem" }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(qrModal.url);
                  setCopiedQr(true);
                  setTimeout(() => setCopiedQr(false), 2000);
                }}
                style={{
                  flex: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "0.75rem",
                  background: copiedQr ? "#15803d" : "#FAF8F5",
                  border: "1px solid #D5CEBF",
                  color: copiedQr ? "#FFFFFF" : "#1E1E1E",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                {copiedQr ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedQr ? "Copied!" : "Copy URL"}</span>
              </button>

              <button
                onClick={() => {
                  if (qrCanvasRef.current) {
                    downloadQrCanvas(qrCanvasRef.current, `${qrModal.brand}_${qrModal.title}_QR`);
                  }
                }}
                style={{
                  flex: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "0.75rem",
                  background: "#1E1E1E",
                  color: "#FFFFFF",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <Download size={14} />
                <span>Download PNG</span>
              </button>
            </div>

            <div style={{ marginTop: "1rem", paddingTop: "0.8rem", borderTop: "1px solid #F0ECE4" }}>
              <Link
                href="/admin/qr-generator"
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#81663F",
                  textDecoration: "underline",
                }}
              >
                Customize colors &amp; logos in QR Generator Studio →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDownloadsPage() {
  return (
    <Suspense
      fallback={
        <div style={{ background: "#FAF8F5", color: "#81663F", minHeight: "100vh", padding: "4rem", textAlign: "center", fontWeight: 800 }}>
          Loading Downloads Repository...
        </div>
      }
    >
      <AdminDownloadsContent />
    </Suspense>
  );
}

