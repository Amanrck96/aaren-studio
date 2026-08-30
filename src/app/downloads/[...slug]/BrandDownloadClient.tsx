"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Folder,
  FileText,
  ExternalLink,
  Download,
  Search,
  ChevronRight,
  ArrowLeft,
  Share2,
  Check,
  Eye,
  RefreshCw,
  FolderOpen,
  Sparkles,
  Copy,
} from "lucide-react";
import { BrandDownloadFolder, DownloadPdfItem } from "@/lib/types";
import { getPdfThumbnail, resolveCatalogDetails } from "@/utils/pdfThumbnail";

interface Props {
  slug: string | string[];
}

function parseSegments(rawSlug: string | string[]) {
  const parts = (Array.isArray(rawSlug) ? rawSlug : [rawSlug])
    .map((s) => {
      try {
        return decodeURIComponent(s).trim();
      } catch {
        return s.trim();
      }
    })
    .filter(Boolean);

  let brandQuery = "";
  let subQuery = "";

  if (parts.length === 0) {
    brandQuery = "";
  } else if (parts[0].toLowerCase() === "brands" && parts[1]) {
    brandQuery = parts[1];
    subQuery = parts.slice(2).join(" / ");
  } else {
    brandQuery = parts[0];
    subQuery = parts.slice(1).join(" / ");
  }

  return { parts, brandQuery, subQuery };
}

export default function BrandDownloadClient({ slug }: Props) {
  const { brandQuery, subQuery } = useMemo(() => parseSegments(slug), [slug]);

  const [folder, setFolder] = useState<BrandDownloadFolder | null>(null);
  const [allFolders, setAllFolders] = useState<BrandDownloadFolder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pageUrlCopied, setPageUrlCopied] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resBrand, resAll] = await Promise.all([
        fetch(`/api/downloads?slug=${encodeURIComponent(brandQuery)}&t=${Date.now()}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" },
        }),
        fetch(`/api/downloads?t=${Date.now()}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" },
        }),
      ]);

      if (resBrand.ok) {
        const json = await resBrand.json();
        if (json.success && json.data) {
          setFolder(json.data);
        }
      }

      if (resAll.ok) {
        const jsonAll = await resAll.json();
        if (jsonAll.success && Array.isArray(jsonAll.data)) {
          setAllFolders(jsonAll.data);
          // Fallback matching if single lookup missed
          if (!folder) {
            const norm = (s: string) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
            const matched = jsonAll.data.find(
              (f: BrandDownloadFolder) =>
                f.id.toLowerCase() === brandQuery.toLowerCase() ||
                f.brandName.toLowerCase() === brandQuery.toLowerCase() ||
                norm(f.id) === norm(brandQuery) ||
                norm(f.brandName) === norm(brandQuery)
            );
            if (matched) setFolder(matched);
          }
        }
      }
    } catch (e) {
      console.error("Error fetching brand downloads:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [brandQuery]);

  const currentUrl = typeof window !== "undefined"
    ? window.location.href
    : `https://aarenstudio.vercel.app/downloads/${encodeURIComponent(folder?.brandName || brandQuery)}/${folder?.files?.length || 0}%20PDFs`;

  const handleCopyPageUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setPageUrlCopied(true);
    setTimeout(() => setPageUrlCopied(false), 3000);
  };

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const filteredFiles = (folder?.files || []).filter((pdf) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      pdf.title.toLowerCase().includes(q) ||
      (pdf.category && pdf.category.toLowerCase().includes(q)) ||
      (pdf.tags && pdf.tags.some((t) => t.toLowerCase().includes(q))) ||
      (pdf.description && pdf.description.toLowerCase().includes(q))
    );
  });

  const otherFolders = allFolders.filter((f) => f.id !== folder?.id).slice(0, 6);

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
          height: "260px",
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
            <FileText size={52} strokeWidth={1.2} />
            <div style={{ fontSize: "0.75rem", fontWeight: 700, marginTop: "8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              PDF Document
            </div>
          </div>
        )}

        {/* 1st Page Badge */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            background: "rgba(30, 30, 30, 0.85)",
            backdropFilter: "blur(6px)",
            color: "#FFFFFF",
            padding: "4px 9px",
            borderRadius: "4px",
            fontSize: "0.68rem",
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <Eye size={11} color="#E2DCD2" />
          <span>Page 1 Cover</span>
        </div>

        {/* Open Access Badge */}
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            right: "12px",
            background: "#81663F",
            color: "#FFFFFF",
            padding: "4px 10px",
            borderRadius: "4px",
            fontSize: "0.68rem",
            fontWeight: 800,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          Open in New Tab ↗
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
          padding: "2rem 2rem 2.5rem",
        }}
      >
        <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
          {/* Breadcrumb Bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", fontWeight: 700, marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <Link
              href="/downloads"
              style={{
                color: "#81663F",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Folder size={14} />
              <span>All 20 Brand Folders</span>
            </Link>
            <ChevronRight size={13} color="#A0988C" />
            <span style={{ color: "#1E1E1E", fontWeight: 800 }}>
              {folder ? folder.brandName : brandQuery.toUpperCase()}
            </span>
            {subQuery && (
              <>
                <ChevronRight size={13} color="#A0988C" />
                <span style={{ color: "#81663F", fontWeight: 800, background: "rgba(129, 102, 63, 0.12)", padding: "2px 8px", borderRadius: "4px" }}>
                  {subQuery}
                </span>
              </>
            )}
          </div>

          {loading ? (
            <div style={{ padding: "3rem 0", color: "#81663F", fontWeight: 800 }}>
              <RefreshCw size={24} className="spin" style={{ display: "inline-block", marginRight: "8px" }} />
              Loading brand catalog folder...
            </div>
          ) : folder ? (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1.5rem" }}>
              {/* Brand Info */}
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "14px",
                    background: "#FFFFFF",
                    border: "1px solid #D5CEBF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    padding: "8px",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
                  }}
                >
                  {folder.brandLogo ? (
                    <img src={folder.brandLogo} alt={folder.brandName} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                  ) : (
                    <FolderOpen size={36} color="#81663F" />
                  )}
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <h1 style={{ fontSize: "2.2rem", fontWeight: 900, color: "#1E1E1E", margin: 0, letterSpacing: "-0.02em" }}>
                      {folder.brandName}
                    </h1>
                    <span style={{ background: "rgba(129, 102, 63, 0.12)", color: "#81663F", fontSize: "0.78rem", fontWeight: 800, padding: "3px 10px", borderRadius: "6px" }}>
                      {folder.brandCategory || "Luxury Surfaces"}
                    </span>
                    <span style={{ background: "#FFFFFF", color: "#10b981", border: "1px solid #A7F3D0", fontSize: "0.75rem", fontWeight: 800, padding: "3px 8px", borderRadius: "6px" }}>
                      {folder.files?.length || 0} PDF {folder.files?.length === 1 ? "Catalogue" : "Catalogues"}
                    </span>
                  </div>

                  <p style={{ color: "#5E5852", fontSize: "0.95rem", margin: "6px 0 0", maxWidth: "750px", lineHeight: 1.5 }}>
                    {folder.description || "Official architectural brochures, finish palettes, and technical specifications."}
                  </p>
                </div>
              </div>

              {/* Action Buttons & Shareable Link */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-end" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                  <button
                    onClick={handleCopyPageUrl}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "0.65rem 1.2rem",
                      background: pageUrlCopied ? "#d1fae5" : "#FFFFFF",
                      color: pageUrlCopied ? "#065f46" : "#1E1E1E",
                      border: pageUrlCopied ? "1px solid #10b981" : "1px solid #D5CEBF",
                      borderRadius: "8px",
                      fontWeight: 800,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {pageUrlCopied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{pageUrlCopied ? "Brand Link Copied!" : "Copy Brand Share Link"}</span>
                  </button>

                  <Link
                    href={`/admin/downloads?brandId=${folder.id}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "0.65rem 1.3rem",
                      background: "#81663F",
                      color: "#FFFFFF",
                      borderRadius: "8px",
                      textDecoration: "none",
                      fontWeight: 800,
                      fontSize: "0.85rem",
                      boxShadow: "0 4px 12px rgba(129,102,63,0.25)",
                    }}
                  >
                    <span>Manage in Admin</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>

                <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ fontSize: "0.75rem", color: "#8A8275", background: "#FFFFFF", padding: "4px 10px", borderRadius: "6px", border: "1px solid #E2DCD2" }}>
                    URL: <code style={{ color: "#81663F", fontWeight: 700 }}>/downloads/{folder.brandName}/{folder.files?.length || 0} PDFs</code>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: "2rem 0", color: "#b91c1c" }}>
              <h3>Brand folder "{brandQuery}" was not found.</h3>
              <Link href="/downloads" style={{ color: "#81663F", fontWeight: 700, textDecoration: "underline" }}>
                ← View all 20 brand folders
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Files Area */}
      <main style={{ maxWidth: "1320px", margin: "0 auto", padding: "2.5rem 2rem 4rem" }}>
        {folder && (
          <>
            {/* Search & Filter Bar */}
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: "14px",
                border: "1px solid #E2DCD2",
                padding: "1rem 1.5rem",
                marginBottom: "2rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
                boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ position: "relative", flex: "1 1 300px" }}>
                <input
                  type="text"
                  placeholder={`Search ${folder.brandName} catalogues & specifications...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.65rem 1rem 0.65rem 2.2rem",
                    borderRadius: "8px",
                    border: "1px solid #D5CEBF",
                    background: "#FAF8F5",
                    fontSize: "0.88rem",
                    color: "#1E1E1E",
                    fontFamily: "inherit",
                  }}
                />
                <Search size={14} style={{ position: "absolute", left: "0.8rem", top: "50%", transform: "translateY(-50%)", color: "#81663F" }} />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Link
                  href="/downloads"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "0.6rem 1.1rem",
                    background: "#FAF8F5",
                    border: "1px solid #D5CEBF",
                    borderRadius: "8px",
                    color: "#1E1E1E",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    textDecoration: "none",
                  }}
                >
                  <ArrowLeft size={13} />
                  <span>All 20 Folders</span>
                </Link>
              </div>
            </div>

            {/* Files Grid */}
            {filteredFiles.length === 0 ? (
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: "14px",
                  border: "1px solid #E2DCD2",
                  padding: "4rem 2rem",
                  textAlign: "center",
                }}
              >
                <FileText size={38} color="#81663F" style={{ margin: "0 auto 0.8rem", display: "block" }} />
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#1E1E1E", margin: 0 }}>
                  {search ? "No documents match your search" : "No PDF catalogues in this brand folder yet"}
                </h3>
                <p style={{ color: "#5E5852", fontSize: "0.88rem", marginTop: "4px" }}>
                  {search ? "Try searching for a different keyword or view all documents." : "Use the Admin Portal to upload or link Firebase PDF URLs to this brand folder."}
                </p>
                <Link
                  href={`/admin/downloads?brandId=${folder.id}`}
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
                  + Add PDF in Admin
                </Link>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "1.6rem" }}>
                {filteredFiles.map((pdf) => (
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
                    {/* PDF Target Link */}
                    <a
                      href={pdf.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none", color: "inherit", display: "block" }}
                    >
                      {renderPdfCover(pdf, folder.brandName)}

                      <div style={{ padding: "1.3rem" }}>
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
                        <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1E1E1E", margin: 0, lineHeight: 1.35 }}>
                          {pdf.title}
                        </h4>
                        {pdf.description && (
                          <p style={{ color: "#5E5852", fontSize: "0.82rem", margin: "6px 0 0", lineHeight: 1.4 }}>
                            {pdf.description}
                          </p>
                        )}
                      </div>
                    </a>

                    {/* Action Bar */}
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

            {/* Other Brand Folders Explorer Strip */}
            {otherFolders.length > 0 && (
              <div style={{ marginTop: "4rem", borderTop: "1px solid #E2DCD2", paddingTop: "2.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#81663F", margin: 0 }}>
                    Explore Other Brand Folders
                  </h3>
                  <Link href="/downloads" style={{ color: "#81663F", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "2px" }}>
                    <span>View All 20 Folders</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
                  {otherFolders.map((of) => (
                    <Link
                      key={of.id}
                      href={`/downloads/${encodeURIComponent(of.brandName)}/${of.files?.length || 0}%20PDFs`}
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid #E2DCD2",
                        borderRadius: "10px",
                        padding: "1rem",
                        textDecoration: "none",
                        color: "inherit",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                      }}
                    >
                      <div style={{ width: "32px", height: "32px", borderRadius: "6px", background: "#FAF8F5", border: "1px solid #D5CEBF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, padding: "3px" }}>
                        {of.brandLogo ? (
                          <img src={of.brandLogo} alt={of.brandName} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                        ) : (
                          <Folder size={16} color="#81663F" />
                        )}
                      </div>
                      <div style={{ overflow: "hidden" }}>
                        <div style={{ fontWeight: 800, fontSize: "0.85rem", color: "#1E1E1E", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {of.brandName}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "#8A8275" }}>
                          {of.files?.length || 0} PDFs
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
