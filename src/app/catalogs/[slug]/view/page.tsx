"use client";

import { useEffect, useRef, useState, use } from "react";
import Link from "next/link";
import { useSearchParams, useParams } from "next/navigation";

declare global {
  interface Window {
    pdfjsLib?: any;
  }
}

export default function CatalogViewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = (params?.slug as string) || "";
  const token = searchParams.get("token") || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.25);
  const [viewMode, setViewMode] = useState<"continuous" | "single">("continuous");
  const [viewerName, setViewerName] = useState<string>("");
  const [viewerEmail, setViewerEmail] = useState<string>("");

  const containerRef = useRef<HTMLDivElement>(null);
  const singleCanvasRef = useRef<HTMLCanvasElement>(null);
  const pdfDocRef = useRef<any>(null);

  // Decode basic user info from JWT payload for watermark (without verifying client-side)
  useEffect(() => {
    if (token) {
      try {
        const parts = token.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          if (payload.name) setViewerName(payload.name);
          if (payload.email) setViewerEmail(payload.email);
        }
      } catch (e) {
        // ignore decode errors
      }
    }
  }, [token]);

  // Anti-download security listeners: block right click & print/save key combinations
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Ctrl+S / Cmd+S (Save), Ctrl+P / Cmd+P (Print), Ctrl+U (View Source)
      if (
        (e.ctrlKey || e.metaKey) &&
        ["s", "p", "u", "c"].includes(e.key.toLowerCase())
      ) {
        if (["s", "p", "u"].includes(e.key.toLowerCase())) {
          e.preventDefault();
        }
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Load PDF.js from CDN and initialize Document stream
  useEffect(() => {
    if (!slug || !token) {
      setError("Unauthorized: Access token is missing. Please submit the catalog enquiry form first.");
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function initPdf() {
      try {
        setLoading(true);
        setError(null);

        // Load PDF.js from CDN if not already on window
        if (!window.pdfjsLib) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
            script.onload = () => {
              if (window.pdfjsLib) {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
                resolve();
              } else {
                reject(new Error("PDF.js failed to initialize"));
              }
            };
            script.onerror = () => reject(new Error("Failed to load PDF.js script"));
            document.head.appendChild(script);
          });
        }

        const streamUrl = `/api/catalogs/${slug}/stream?token=${encodeURIComponent(token)}`;

        const loadingTask = window.pdfjsLib.getDocument({
          url: streamUrl,
          cMapUrl: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/",
          cMapPacked: true,
        });

        const doc = await loadingTask.promise;
        if (!isMounted) return;

        pdfDocRef.current = doc;
        setNumPages(doc.numPages);
        setLoading(false);
      } catch (err: any) {
        console.error("PDF stream loader error:", err);
        if (isMounted) {
          setError(
            err.message?.includes("401") || err.message?.includes("403")
              ? "Access expired or unauthorized. Please request access again."
              : err.message || "Failed to load protected PDF document."
          );
          setLoading(false);
        }
      }
    }

    initPdf();

    return () => {
      isMounted = false;
    };
  }, [slug, token]);

  // Render Continuous Scroll View
  useEffect(() => {
    if (loading || error || !pdfDocRef.current || viewMode !== "continuous" || !containerRef.current) {
      return;
    }

    let cancelRender = false;
    const container = containerRef.current;
    container.innerHTML = "";

    async function renderAllPages() {
      const doc = pdfDocRef.current;
      if (!doc) return;

      for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
        if (cancelRender) break;

        try {
          const page = await doc.getPage(pageNum);
          if (cancelRender) break;

          const viewport = page.getViewport({ scale });

          // Container card for each page
          const pageCard = document.createElement("div");
          pageCard.style.position = "relative";
          pageCard.style.marginBottom = "28px";
          pageCard.style.borderRadius = "8px";
          pageCard.style.boxShadow = "0 12px 35px rgba(0,0,0,0.5)";
          pageCard.style.background = "#FFFFFF";
          pageCard.style.display = "flex";
          pageCard.style.flexDirection = "column";
          pageCard.style.alignItems = "center";
          pageCard.style.overflow = "hidden";
          pageCard.style.border = "1px solid rgba(212, 182, 125, 0.3)";

          // Canvas Element
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          canvas.style.maxWidth = "100%";
          canvas.style.height = "auto";
          canvas.style.display = "block";
          canvas.oncontextmenu = (e) => e.preventDefault();

          // Render Page
          await page.render({ canvasContext: ctx!, viewport }).promise;
          if (cancelRender) break;

          // Draw Anti-Leak Watermark
          if (ctx) {
            drawWatermark(ctx, viewport.width, viewport.height, viewerName, viewerEmail, pageNum, doc.numPages);
          }

          // Page Number Indicator Banner
          const pageBadge = document.createElement("div");
          pageBadge.innerText = `PAGE ${pageNum} OF ${doc.numPages} — AAREN ARCHITECTURAL CATALOGUE`;
          pageBadge.style.fontSize = "0.72rem";
          pageBadge.style.fontWeight = "800";
          pageBadge.style.letterSpacing = "0.08em";
          pageBadge.style.color = "#81663F";
          pageBadge.style.background = "#FAF9F6";
          pageBadge.style.width = "100%";
          pageBadge.style.textAlign = "center";
          pageBadge.style.padding = "8px 0";
          pageBadge.style.borderTop = "1px solid #E8E3D7";

          pageCard.appendChild(canvas);
          pageCard.appendChild(pageBadge);
          container.appendChild(pageCard);
        } catch (pageErr) {
          console.error(`Error rendering page ${pageNum}:`, pageErr);
        }
      }
    }

    renderAllPages();

    return () => {
      cancelRender = true;
    };
  }, [loading, error, scale, viewMode, viewerName, viewerEmail]);

  // Render Single Page View
  useEffect(() => {
    if (loading || error || !pdfDocRef.current || viewMode !== "single" || !singleCanvasRef.current) {
      return;
    }

    let cancelRender = false;

    async function renderSinglePage() {
      const doc = pdfDocRef.current;
      if (!doc) return;

      try {
        const page = await doc.getPage(currentPage);
        if (cancelRender) return;

        const viewport = page.getViewport({ scale: scale * 1.15 });
        const canvas = singleCanvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;
        canvas.style.maxWidth = "100%";
        canvas.style.height = "auto";

        await page.render({ canvasContext: ctx, viewport }).promise;
        if (cancelRender) return;

        drawWatermark(ctx, viewport.width, viewport.height, viewerName, viewerEmail, currentPage, doc.numPages);
      } catch (singleErr) {
        console.error("Single page render error:", singleErr);
      }
    }

    renderSinglePage();

    return () => {
      cancelRender = true;
    };
  }, [loading, error, currentPage, scale, viewMode, viewerName, viewerEmail]);

  // Helper to draw faint diagonal watermark
  function drawWatermark(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    name: string,
    email: string,
    page: number,
    total: number
  ) {
    ctx.save();
    ctx.font = "bold 15px sans-serif";
    ctx.fillStyle = "rgba(180, 150, 100, 0.12)";
    ctx.translate(width / 2, height / 2);
    ctx.rotate(-Math.PI / 6);
    const watermarkText = `AAREN STUDIO • ${name || email || "CONFIDENTIAL SPECIFICATION"} • ${new Date().toISOString().split("T")[0]}`;
    ctx.textAlign = "center";
    ctx.fillText(watermarkText, 0, -80);
    ctx.fillText(watermarkText, 0, 0);
    ctx.fillText(watermarkText, 0, 80);
    ctx.restore();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0B0C10",
        color: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* ── TOP CONTROL BAR ── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(17, 19, 26, 0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(212, 182, 125, 0.25)",
          padding: "0.8rem 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        {/* Left: Back Link & Catalog Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link
            href="/catalogs"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "rgba(255, 255, 255, 0.08)",
              color: "#E2E8F0",
              textDecoration: "none",
              padding: "0.45rem 0.9rem",
              borderRadius: "6px",
              fontSize: "0.85rem",
              fontWeight: 700,
              transition: "all 0.15s ease",
            }}
          >
            ← All Catalogs
          </Link>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <h1 style={{ fontSize: "1.05rem", fontWeight: 800, margin: 0, color: "#FFFFFF", letterSpacing: "-0.01em" }}>
                {slug.toUpperCase().replace(/[-_]/g, " ")}
              </h1>
              <span
                style={{
                  background: "linear-gradient(135deg, #D4B67D 0%, #B38E46 100%)",
                  color: "#000000",
                  fontSize: "0.68rem",
                  fontWeight: 900,
                  padding: "0.2rem 0.5rem",
                  borderRadius: "4px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                🔒 Protected View
              </span>
            </div>
            {numPages > 0 && (
              <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "2px" }}>
                {numPages} Total Pages {viewerEmail && `• Licensed to ${viewerEmail}`}
              </div>
            )}
          </div>
        </div>

        {/* Center: Viewer Controls (Zoom & Mode) */}
        {!loading && !error && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", flexWrap: "wrap" }}>
            {/* View Mode Switcher */}
            <div style={{ display: "flex", background: "#08090C", borderRadius: "6px", padding: "2px", border: "1px solid #2D3139" }}>
              <button
                onClick={() => setViewMode("continuous")}
                style={{
                  background: viewMode === "continuous" ? "#D4B67D" : "transparent",
                  color: viewMode === "continuous" ? "#000000" : "#94A3B8",
                  border: "none",
                  padding: "0.35rem 0.8rem",
                  borderRadius: "4px",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                📜 All Pages Scroll
              </button>
              <button
                onClick={() => setViewMode("single")}
                style={{
                  background: viewMode === "single" ? "#D4B67D" : "transparent",
                  color: viewMode === "single" ? "#000000" : "#94A3B8",
                  border: "none",
                  padding: "0.35rem 0.8rem",
                  borderRadius: "4px",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                📄 Single Page
              </button>
            </div>

            {/* Pagination Controls in Single Mode */}
            {viewMode === "single" && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  style={{
                    background: "#1E222D",
                    color: "#FFFFFF",
                    border: "1px solid #3A3F4D",
                    padding: "0.35rem 0.7rem",
                    borderRadius: "4px",
                    cursor: currentPage <= 1 ? "not-allowed" : "pointer",
                    opacity: currentPage <= 1 ? 0.4 : 1,
                    fontSize: "0.8rem",
                    fontWeight: 700,
                  }}
                >
                  ◀
                </button>
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#D4B67D", minWidth: "60px", textAlign: "center" }}>
                  {currentPage} / {numPages}
                </span>
                <button
                  disabled={currentPage >= numPages}
                  onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
                  style={{
                    background: "#1E222D",
                    color: "#FFFFFF",
                    border: "1px solid #3A3F4D",
                    padding: "0.35rem 0.7rem",
                    borderRadius: "4px",
                    cursor: currentPage >= numPages ? "not-allowed" : "pointer",
                    opacity: currentPage >= numPages ? 0.4 : 1,
                    fontSize: "0.8rem",
                    fontWeight: 700,
                  }}
                >
                  ▶
                </button>
              </div>
            )}

            {/* Zoom Adjustments */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <button
                onClick={() => setScale((s) => Math.max(0.6, s - 0.2))}
                style={{
                  background: "#1E222D",
                  color: "#FFFFFF",
                  border: "1px solid #3A3F4D",
                  width: "30px",
                  height: "30px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                }}
                title="Zoom Out"
              >
                −
              </button>
              <span style={{ fontSize: "0.78rem", color: "#94A3B8", minWidth: "44px", textAlign: "center" }}>
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={() => setScale((s) => Math.min(2.2, s + 0.2))}
                style={{
                  background: "#1E222D",
                  color: "#FFFFFF",
                  border: "1px solid #3A3F4D",
                  width: "30px",
                  height: "30px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                }}
                title="Zoom In"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Right Status */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{ fontSize: "0.75rem", color: "#81663F", fontWeight: 700 }}>
            🔒 DRM View-Only
          </span>
        </div>
      </header>

      {/* ── MAIN CANVAS VIEWPORT ── */}
      <main
        style={{
          flex: 1,
          padding: "2rem 1.5rem 4rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "#08090C",
        }}
      >
        {loading && (
          <div style={{ textAlign: "center", padding: "6rem 2rem", color: "#D4B67D" }}>
            <div style={{ fontSize: "2.8rem", marginBottom: "1rem" }}>📖</div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, margin: "0 0 0.5rem 0", color: "#FFFFFF" }}>
              Initializing Protected On-Screen Canvas Reader...
            </h2>
            <p style={{ color: "#94A3B8", fontSize: "0.9rem", maxWidth: "480px", margin: "0 auto" }}>
              Verifying security token and rendering high-resolution specification pages directly into canvas memory.
            </p>
          </div>
        )}

        {error && (
          <div
            style={{
              maxWidth: "540px",
              margin: "4rem auto",
              background: "#161922",
              padding: "2.5rem",
              borderRadius: "14px",
              border: "1px solid #EF4444",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔒</div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 0.6rem 0" }}>
              Catalogue Access Restricted
            </h2>
            <p style={{ color: "#94A3B8", fontSize: "0.9rem", lineHeight: 1.5, margin: "0 0 1.5rem 0" }}>
              {error}
            </p>
            <Link
              href="/catalogs"
              style={{
                display: "inline-block",
                padding: "0.75rem 1.4rem",
                background: "linear-gradient(135deg, #D4B67D 0%, #B38E46 100%)",
                color: "#000000",
                borderRadius: "8px",
                fontWeight: 800,
                textDecoration: "none",
                fontSize: "0.9rem",
              }}
            >
              Request Access on Catalogs Portal →
            </Link>
          </div>
        )}

        {/* Continuous Scroll View */}
        {!loading && !error && viewMode === "continuous" && (
          <div
            ref={containerRef}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              maxWidth: "960px",
            }}
          />
        )}

        {/* Single Page View */}
        {!loading && !error && viewMode === "single" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: "8px",
              boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
              background: "#FFFFFF",
              overflow: "hidden",
              border: "1px solid rgba(212, 182, 125, 0.3)",
              maxWidth: "960px",
            }}
          >
            <canvas ref={singleCanvasRef} style={{ display: "block" }} onContextMenu={(e) => e.preventDefault()} />
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 800,
                letterSpacing: "0.08em",
                color: "#81663F",
                background: "#FAF9F6",
                width: "100%",
                textAlign: "center",
                padding: "10px 0",
                borderTop: "1px solid #E8E3D7",
              }}
            >
              PAGE {currentPage} OF {numPages} — AAREN ARCHITECTURAL CATALOGUE
            </div>
          </div>
        )}
      </main>

      {/* Inline print style blocking */}
      <style jsx global>{`
        @media print {
          body {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
