"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Folder,
  FileText,
  ExternalLink,
  Download,
  Search,
  ChevronRight,
  ArrowLeft,
  Grid,
  Layers,
  Sparkles,
  Share2,
  Check,
  Eye,
  RefreshCw,
  FolderOpen,
} from "lucide-react";
import { BrandDownloadFolder, DownloadPdfItem } from "@/lib/types";
import { getPdfThumbnail, resolveCatalogDetails } from "@/utils/pdfThumbnail";

export default function DownloadsClient() {
  const [folders, setFolders] = useState<BrandDownloadFolder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [viewMode, setViewMode] = useState<"folders" | "all">("folders");
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
        }
      }
    } catch (e) {
      console.error("Error fetching download folders:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const totalFiles = folders.reduce((sum, f) => sum + (Array.isArray(f.files) ? f.files.length : 0), 0);

  const selectedFolder = folders.find((f) => f.id === selectedFolderId);

  // Filtered files for search
  const allFilesWithBrand: (DownloadPdfItem & { brandName: string; brandLogo?: string; folderId: string })[] = [];
  folders.forEach((f) => {
    if (Array.isArray(f.files)) {
      f.files.forEach((pdf) => {
        allFilesWithBrand.push({
          ...pdf,
          brandName: f.brandName,
          brandLogo: f.brandLogo,
          folderId: f.id,
        });
      });
    }
  });

  const filteredAllFiles = allFilesWithBrand.filter((file) => {
    const q = search.toLowerCase();
    return (
      file.title.toLowerCase().includes(q) ||
      file.brandName.toLowerCase().includes(q) ||
      (file.category && file.category.toLowerCase().includes(q)) ||
      (file.tags && file.tags.some((t) => t.toLowerCase().includes(q)))
    );
  });

  const filteredFolders = folders.filter((folder) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const matchesBrand =
      folder.brandName.toLowerCase().includes(q) ||
      (folder.brandCategory && folder.brandCategory.toLowerCase().includes(q));
    const matchesFiles =
      Array.isArray(folder.files) &&
      folder.files.some((f) => f.title.toLowerCase().includes(q) || (f.category && f.category.toLowerCase().includes(q)));
    return matchesBrand || matchesFiles;
  });

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const renderPdfCover = (pdf: DownloadPdfItem, brandName: string) => {
    const resolved = resolveCatalogDetails({
      catalogPdfUrl: pdf.fileUrl,
      title: pdf.title,
      brand: brandName,
      coverImage: pdf.coverImage,
    });
    const coverThumb = resolved.coverThumb || pdf.coverImage || getPdfThumbnail(pdf.fileUrl, { title: pdf.title, brandId: brandName });

    return (
      <div
        style={{
          width: "100%",
          height: "240px",
          background: "#181920",
          borderRadius: "10px 10px 0 0",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid #E2DCD2",
        }}
      >
        {coverThumb ? (
          <img
            src={coverThumb}
            alt={pdf.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div style={{ textAlign: "center", color: "#81663F" }}>
            <FileText size={48} strokeWidth={1.2} />
            <div style={{ fontSize: "0.75rem", fontWeight: 700, marginTop: "8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              PDF Document
            </div>
          </div>
        )}

        {/* 1st Page Badge */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: "rgba(30, 30, 30, 0.85)",
            backdropFilter: "blur(6px)",
            color: "#FFFFFF",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "0.65rem",
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <Eye size={10} color="#E2DCD2" />
          <span>Page 1 Cover</span>
        </div>

        {/* Open Access Badge */}
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            background: "#81663F",
            color: "#FFFFFF",
            padding: "3px 8px",
            borderRadius: "4px",
            fontSize: "0.65rem",
            fontWeight: 800,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          Open Access ↗
        </div>
      </div>
    );
  };

  return (
    <div style={{ background: "#FAF8F5", color: "#1E1E1E", minHeight: "100vh", fontFamily: "var(--font-jost), 'Jost', sans-serif" }}>
      {/* Top Banner Header */}
      <header
        style={{
          borderBottom: "1px solid #E2DCD2",
          background: "linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)",
          padding: "2.5rem 2rem 2rem",
        }}
      >
        <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1.5rem" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(129, 102, 63, 0.12)", color: "#81663F", padding: "4px 12px", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.8rem" }}>
                <Sparkles size={13} />
                <span>Architectural Assets Repository</span>
              </div>
              <h1 style={{ fontSize: "2.4rem", fontWeight: 900, color: "#1E1E1E", margin: 0, letterSpacing: "-0.02em" }}>
                Brand Specifications &amp; PDF Downloads
              </h1>
              <p style={{ color: "#5E5852", fontSize: "0.95rem", marginTop: "0.4rem", maxWidth: "700px", lineHeight: 1.5 }}>
                Open-access digital architectural catalogues, technical finish manuals, and CAD specifications across our 20 European luxury surface partner brands.
              </p>
            </div>

            {/* Quick Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
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
                  fontSize: "0.85rem",
                  color: "#1E1E1E",
                  cursor: loading ? "wait" : "pointer",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                }}
              >
                <RefreshCw size={14} className={loading ? "spin" : ""} />
                <span>Refresh Repository</span>
              </button>

              <Link
                href="/admin/downloads"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "0.65rem 1.3rem",
                  background: "#1E1E1E",
                  color: "#FFFFFF",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                }}
              >
                <span>Admin CMS Portal</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div
            style={{
              marginTop: "2rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            <div style={{ background: "#FFFFFF", padding: "1rem 1.4rem", borderRadius: "10px", border: "1px solid #E2DCD2", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "8px", background: "rgba(129, 102, 63, 0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Folder size={20} color="#81663F" />
              </div>
              <div>
                <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#1E1E1E" }}>{folders.length}</div>
                <div style={{ fontSize: "0.75rem", color: "#6A6359", fontWeight: 700, textTransform: "uppercase" }}>Brand Folders</div>
              </div>
            </div>

            <div style={{ background: "#FFFFFF", padding: "1rem 1.4rem", borderRadius: "10px", border: "1px solid #E2DCD2", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "8px", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FileText size={20} color="#10b981" />
              </div>
              <div>
                <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#1E1E1E" }}>{totalFiles}</div>
                <div style={{ fontSize: "0.75rem", color: "#6A6359", fontWeight: 700, textTransform: "uppercase" }}>Active PDF Files</div>
              </div>
            </div>

            <div style={{ background: "#FFFFFF", padding: "1rem 1.4rem", borderRadius: "10px", border: "1px solid #E2DCD2", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "8px", background: "rgba(59, 130, 246, 0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ExternalLink size={20} color="#3b82f6" />
              </div>
              <div>
                <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#1E1E1E" }}>100% Free</div>
                <div style={{ fontSize: "0.75rem", color: "#6A6359", fontWeight: 700, textTransform: "uppercase" }}>Open Digital Access</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: "1320px", margin: "0 auto", padding: "2.5rem 2rem 4rem" }}>
        {/* Navigation & Search Controls */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "14px",
            border: "1px solid #E2DCD2",
            padding: "1.2rem 1.6rem",
            marginBottom: "2.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
          }}
        >
          {/* Breadcrumbs */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem", fontWeight: 700 }}>
            <button
              onClick={() => setSelectedFolderId(null)}
              style={{
                background: "none",
                border: "none",
                color: selectedFolderId ? "#81663F" : "#1E1E1E",
                cursor: selectedFolderId ? "pointer" : "default",
                fontWeight: 800,
                padding: 0,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Folder size={16} />
              <span>All 20 Brand Folders</span>
            </button>

            {selectedFolder && (
              <>
                <ChevronRight size={14} color="#A0988C" />
                <span style={{ color: "#1E1E1E", fontWeight: 800 }}>{selectedFolder.brandName}</span>
                <span style={{ background: "rgba(129, 102, 63, 0.12)", color: "#81663F", fontSize: "0.75rem", padding: "2px 8px", borderRadius: "999px", fontWeight: 800 }}>
                  {selectedFolder.files?.length || 0} PDFs
                </span>
              </>
            )}
          </div>

          {/* Search & View Switcher */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <div style={{ position: "relative", minWidth: "260px" }}>
              <input
                type="text"
                placeholder="Search folders or PDFs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.6rem 1rem 0.6rem 2.2rem",
                  borderRadius: "8px",
                  border: "1px solid #D5CEBF",
                  background: "#FAF8F5",
                  color: "#1E1E1E",
                  fontSize: "0.88rem",
                  fontFamily: "inherit",
                }}
              />
              <Search size={14} style={{ position: "absolute", left: "0.8rem", top: "50%", transform: "translateY(-50%)", color: "#81663F" }} />
            </div>

            {!selectedFolderId && (
              <div style={{ display: "inline-flex", background: "#FAF8F5", padding: "3px", borderRadius: "8px", border: "1px solid #D5CEBF" }}>
                <button
                  onClick={() => setViewMode("folders")}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "none",
                    background: viewMode === "folders" ? "#FFFFFF" : "transparent",
                    color: viewMode === "folders" ? "#81663F" : "#6A6359",
                    fontWeight: 800,
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    boxShadow: viewMode === "folders" ? "0 2px 4px rgba(0,0,0,0.06)" : "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Folder size={13} />
                  <span>20 Folders</span>
                </button>
                <button
                  onClick={() => setViewMode("all")}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "none",
                    background: viewMode === "all" ? "#FFFFFF" : "transparent",
                    color: viewMode === "all" ? "#81663F" : "#6A6359",
                    fontWeight: 800,
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    boxShadow: viewMode === "all" ? "0 2px 4px rgba(0,0,0,0.06)" : "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Grid size={13} />
                  <span>All Documents</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div style={{ padding: "5rem 2rem", textAlign: "center", color: "#81663F", fontWeight: 800, fontSize: "1.1rem" }}>
            <RefreshCw size={28} className="spin" style={{ margin: "0 auto 1rem", display: "block" }} />
            Loading 20 brand specification folders...
          </div>
        ) : selectedFolder ? (
          /* ── INSIDE SINGLE BRAND FOLDER VIEW ── */
          <div>
            {/* Folder Header */}
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: "14px",
                border: "1px solid #E2DCD2",
                padding: "1.8rem 2rem",
                marginBottom: "2rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1.5rem",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                <div
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "12px",
                    background: "#FAF8F5",
                    border: "1px solid #D5CEBF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    padding: "8px",
                  }}
                >
                  {selectedFolder.brandLogo ? (
                    <img src={selectedFolder.brandLogo} alt={selectedFolder.brandName} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                  ) : (
                    <FolderOpen size={34} color="#81663F" />
                  )}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <h2 style={{ fontSize: "1.7rem", fontWeight: 900, color: "#1E1E1E", margin: 0 }}>
                      {selectedFolder.brandName}
                    </h2>
                    <span style={{ background: "rgba(129, 102, 63, 0.12)", color: "#81663F", fontSize: "0.75rem", fontWeight: 800, padding: "2px 8px", borderRadius: "6px" }}>
                      {selectedFolder.brandCategory || "Luxury Surfaces"}
                    </span>
                  </div>
                  <p style={{ color: "#5E5852", fontSize: "0.9rem", margin: "4px 0 0" }}>
                    {selectedFolder.description || "Official architectural brochures and specifications."}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => setSelectedFolderId(null)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "0.6rem 1.2rem",
                    background: "#FAF8F5",
                    border: "1px solid #D5CEBF",
                    borderRadius: "8px",
                    color: "#1E1E1E",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  <ArrowLeft size={14} />
                  <span>Back to 20 Folders</span>
                </button>

                <Link
                  href={`/admin/downloads?brandId=${selectedFolder.id}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "0.6rem 1.2rem",
                    background: "#81663F",
                    color: "#FFFFFF",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                  }}
                >
                  <span>Upload PDF to this Folder</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* Folder PDF Files Grid */}
            {(!selectedFolder.files || selectedFolder.files.length === 0) ? (
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: "14px",
                  border: "1px solid #E2DCD2",
                  padding: "4rem 2rem",
                  textAlign: "center",
                }}
              >
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(129, 102, 63, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                  <FileText size={30} color="#81663F" />
                </div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#1E1E1E", margin: 0 }}>
                  No PDF documents in this brand folder yet
                </h3>
                <p style={{ color: "#5E5852", fontSize: "0.88rem", marginTop: "4px" }}>
                  Use the Admin Portal to upload or link Firebase PDF URLs to this folder.
                </p>
                <Link
                  href={`/admin/downloads?brandId=${selectedFolder.id}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "0.65rem 1.4rem",
                    background: "#81663F",
                    color: "#FFFFFF",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    marginTop: "1rem",
                  }}
                >
                  + Add First PDF in Admin
                </Link>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
                {selectedFolder.files.map((pdf) => (
                  <div
                    key={pdf.id}
                    style={{
                      background: "#FFFFFF",
                      borderRadius: "12px",
                      border: "1px solid #E2DCD2",
                      overflow: "hidden",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                  >
                    {/* PDF Card Click Target */}
                    <a
                      href={pdf.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none", color: "inherit", display: "block" }}
                    >
                      {renderPdfCover(pdf, selectedFolder.brandName)}

                      <div style={{ padding: "1.2rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "0.4rem" }}>
                          <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#81663F", textTransform: "uppercase" }}>
                            {pdf.category || "Specification"}
                          </span>
                          {pdf.fileSize && (
                            <span style={{ fontSize: "0.72rem", color: "#8A8275" }}>
                              • {pdf.fileSize}
                            </span>
                          )}
                        </div>
                        <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#1E1E1E", margin: 0, lineHeight: 1.3 }}>
                          {pdf.title}
                        </h4>
                        {pdf.description && (
                          <p style={{ color: "#5E5852", fontSize: "0.82rem", margin: "6px 0 0", lineHeight: 1.4 }}>
                            {pdf.description}
                          </p>
                        )}
                      </div>
                    </a>

                    {/* Actions Bar */}
                    <div
                      style={{
                        padding: "0.8rem 1.2rem",
                        borderTop: "1px solid #F0ECE4",
                        background: "#FAF8F5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "8px",
                      }}
                    >
                      <button
                        onClick={() => handleCopyLink(pdf.fileUrl, pdf.id)}
                        title="Copy direct PDF link"
                        style={{
                          background: "#FFFFFF",
                          border: "1px solid #D5CEBF",
                          borderRadius: "6px",
                          padding: "6px 10px",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          color: copiedId === pdf.id ? "#059669" : "#5E5852",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {copiedId === pdf.id ? <Check size={13} /> : <Share2 size={13} />}
                        <span>{copiedId === pdf.id ? "Link Copied" : "Share"}</span>
                      </button>

                      <a
                        href={pdf.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: "#1E1E1E",
                          color: "#FFFFFF",
                          borderRadius: "6px",
                          padding: "6px 14px",
                          fontSize: "0.78rem",
                          fontWeight: 800,
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        }}
                      >
                        <span>Open PDF</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : viewMode === "folders" ? (
          /* ── 20 BRAND FOLDERS GRID ── */
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.4rem" }}>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#81663F", margin: 0 }}>
                20 Brand Folders ({filteredFolders.length} Active)
              </h2>
              <span style={{ fontSize: "0.82rem", color: "#6A6359", fontWeight: 600 }}>
                Click any brand folder to view documents
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.4rem" }}>
              {filteredFolders.map((folder, index) => {
                const count = Array.isArray(folder.files) ? folder.files.length : 0;
                return (
                  <div
                    key={folder.id}
                    onClick={() => setSelectedFolderId(folder.id)}
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E2DCD2",
                      borderRadius: "14px",
                      padding: "1.4rem 1.6rem",
                      cursor: "pointer",
                      transition: "all 0.2s ease-in-out",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      position: "relative",
                    }}
                  >
                    <div>
                      {/* Top Bar with Folder Icon and Sequence */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <div
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "10px",
                            background: "rgba(129, 102, 63, 0.12)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Folder size={22} color="#81663F" />
                        </div>

                        <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#8A8275", background: "#FAF8F5", padding: "2px 8px", borderRadius: "6px", border: "1px solid #E2DCD2" }}>
                          Folder #{String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Brand Logo & Name */}
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "0.6rem" }}>
                        {folder.brandLogo ? (
                          <div style={{ width: "36px", height: "36px", borderRadius: "6px", background: "#FAF8F5", border: "1px solid #D5CEBF", padding: "3px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <img src={folder.brandLogo} alt={folder.brandName} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                          </div>
                        ) : null}
                        <div>
                          <h3 style={{ fontSize: "1.15rem", fontWeight: 900, color: "#1E1E1E", margin: 0 }}>
                            {folder.brandName}
                          </h3>
                          <span style={{ fontSize: "0.75rem", color: "#81663F", fontWeight: 700 }}>
                            {folder.brandCategory || "Luxury Surfaces"}
                          </span>
                        </div>
                      </div>

                      <p style={{ color: "#5E5852", fontSize: "0.82rem", lineHeight: 1.4, margin: "0.4rem 0 0" }}>
                        {folder.description || "Architectural catalogues and specification sheets."}
                      </p>
                    </div>

                    {/* Bottom Count & Action */}
                    <div
                      style={{
                        marginTop: "1.4rem",
                        paddingTop: "0.8rem",
                        borderTop: "1px solid #F0ECE4",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 800,
                          color: count > 0 ? "#10b981" : "#8A8275",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <FileText size={13} />
                        {count} {count === 1 ? "PDF File" : "PDF Files"}
                      </span>

                      <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#81663F", display: "inline-flex", alignItems: "center", gap: "2px" }}>
                        <span>Open Folder</span>
                        <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ── ALL DOCUMENTS GRID VIEW ── */
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.4rem" }}>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#81663F", margin: 0 }}>
                All Architectural Documents ({filteredAllFiles.length} Total)
              </h2>
              <span style={{ fontSize: "0.82rem", color: "#6A6359", fontWeight: 600 }}>
                Click any card to open the PDF in a new tab
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {filteredAllFiles.map((pdf) => (
                <div
                  key={pdf.id}
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid #E2DCD2",
                    overflow: "hidden",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <a
                    href={pdf.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none", color: "inherit", display: "block" }}
                  >
                    {renderPdfCover(pdf, pdf.brandName)}

                    <div style={{ padding: "1.2rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "0.4rem" }}>
                        <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#81663F", background: "rgba(129, 102, 63, 0.12)", padding: "2px 6px", borderRadius: "4px" }}>
                          {pdf.brandName}
                        </span>
                        <span style={{ fontSize: "0.72rem", color: "#8A8275" }}>
                          {pdf.category || "Catalog"}
                        </span>
                      </div>
                      <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#1E1E1E", margin: 0, lineHeight: 1.3 }}>
                        {pdf.title}
                      </h4>
                    </div>
                  </a>

                  <div
                    style={{
                      padding: "0.8rem 1.2rem",
                      borderTop: "1px solid #F0ECE4",
                      background: "#FAF8F5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <button
                      onClick={() => handleCopyLink(pdf.fileUrl, pdf.id)}
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid #D5CEBF",
                        borderRadius: "6px",
                        padding: "6px 10px",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        color: copiedId === pdf.id ? "#059669" : "#5E5852",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      {copiedId === pdf.id ? <Check size={13} /> : <Share2 size={13} />}
                      <span>{copiedId === pdf.id ? "Copied" : "Share"}</span>
                    </button>

                    <a
                      href={pdf.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: "#1E1E1E",
                        color: "#FFFFFF",
                        borderRadius: "6px",
                        padding: "6px 14px",
                        fontSize: "0.78rem",
                        fontWeight: 800,
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <span>Open PDF</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
