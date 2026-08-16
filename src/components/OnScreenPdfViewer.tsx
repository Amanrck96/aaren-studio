"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  pdfUrl: string;
  title: string;
  onClose?: () => void;
}

declare global {
  interface Window {
    pdfjsLib?: any;
  }
}

export default function OnScreenPdfViewer({ pdfUrl, title, onClose }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [viewMode, setViewMode] = useState<"continuous" | "single">("continuous");
  
  const containerRef = useRef<HTMLDivElement>(null);
  const pdfDocRef = useRef<any>(null);
  const singleCanvasRef = useRef<HTMLCanvasElement>(null);

  // Check if it's a Google Drive preview link
  const driveMatch = pdfUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || pdfUrl.match(/id=([a-zA-Z0-9_-]+)/);
  const isGoogleDrive = Boolean(driveMatch && driveMatch[1]);
  const driveEmbedUrl = isGoogleDrive ? `https://drive.google.com/file/d/${driveMatch![1]}/preview` : null;

  // Load PDF.js from CDN dynamically
  useEffect(() => {
    if (isGoogleDrive) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function loadPdfJsAndDoc() {
      try {
        setLoading(true);
        setError(null);

        // Load PDF.js script if not present
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
                reject(new Error("PDF.js library failed to initialize"));
              }
            };
            script.onerror = () => reject(new Error("Failed to load PDF.js from CDN"));
            document.head.appendChild(script);
          });
        }

        // Clean relative URL
        const cleanUrl = pdfUrl.startsWith("/") || pdfUrl.startsWith("http")
          ? pdfUrl.split("#")[0]
          : `/catalogs/${pdfUrl.split("#")[0]}`;

        const loadingTask = window.pdfjsLib.getDocument({
          url: cleanUrl,
          cMapUrl: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/",
          cMapPacked: true,
        });

        const doc = await loadingTask.promise;
        if (!isMounted) return;

        pdfDocRef.current = doc;
        setNumPages(doc.numPages);
        setLoading(false);
      } catch (err: any) {
        console.error("PDF.js loading error:", err);
        if (isMounted) {
          setError(err.message || "Failed to render PDF pages");
          setLoading(false);
        }
      }
    }

    loadPdfJsAndDoc();

    return () => {
      isMounted = false;
    };
  }, [pdfUrl, isGoogleDrive]);

  // Render All Pages in Continuous Scroll Mode
  useEffect(() => {
    if (loading || isGoogleDrive || !pdfDocRef.current || viewMode !== "continuous" || !containerRef.current) return;

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

          // Wrapper for each page card
          const pageCard = document.createElement("div");
          pageCard.style.position = "relative";
          pageCard.style.marginBottom = "24px";
          pageCard.style.borderRadius = "8px";
          pageCard.style.boxShadow = "0 8px 30px rgba(0,0,0,0.3)";
          pageCard.style.background = "#ffffff";
          pageCard.style.display = "flex";
          pageCard.style.flexDirection = "column";
          pageCard.style.alignItems = "center";
          pageCard.style.overflow = "hidden";
          pageCard.style.border = "1px solid #E8E3D7";

          // Canvas element
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          canvas.style.maxWidth = "100%";
          canvas.style.height = "auto";
          canvas.style.display = "block";
          canvas.oncontextmenu = (e) => e.preventDefault();

          // Page Number Badge
          const pageBadge = document.createElement("div");
          pageBadge.innerText = `PAGE ${pageNum} OF ${doc.numPages}`;
          pageBadge.style.fontSize = "0.7rem";
          pageBadge.style.fontWeight = "800";
          pageBadge.style.letterSpacing = "0.08em";
          pageBadge.style.color = "#81663F";
          pageBadge.style.background = "#FAF9F6";
          pageBadge.style.width = "100%";
          pageBadge.style.textAlign = "center";
          pageBadge.style.padding = "6px 0";
          pageBadge.style.borderTop = "1px solid #E8E3D7";

          pageCard.appendChild(canvas);
          pageCard.appendChild(pageBadge);
          container.appendChild(pageCard);

          const renderContext = {
            canvasContext: context!,
            viewport: viewport,
          };

          await page.render(renderContext).promise;
        } catch (pageErr) {
          console.error(`Error rendering page ${pageNum}:`, pageErr);
        }
      }
    }

    renderAllPages();

    return () => {
      cancelRender = true;
    };
  }, [loading, isGoogleDrive, scale, viewMode, numPages]);

  // Render Single Page Mode
  useEffect(() => {
    if (loading || isGoogleDrive || !pdfDocRef.current || viewMode !== "single" || !singleCanvasRef.current) return;

    let cancelRender = false;

    async function renderSinglePage() {
      const doc = pdfDocRef.current;
      if (!doc) return;

      try {
        const page = await doc.getPage(currentPage);
        if (cancelRender) return;

        const viewport = page.getViewport({ scale: scale * 1.2 });
        const canvas = singleCanvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        canvas.style.maxWidth = "100%";
        canvas.style.height = "auto";

        const renderContext = {
          canvasContext: context!,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
      } catch (e) {
        console.error("Single page render error:", e);
      }
    }

    renderSinglePage();

    return () => {
      cancelRender = true;
    };
  }, [loading, isGoogleDrive, currentPage, scale, viewMode]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        background: "#0F1117",
        borderRadius: "12px",
        overflow: "hidden",
        color: "#FFFFFF",
        userSelect: "none",
        position: "relative",
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* ── TOP LUXURY TOOLBAR ── */}
      <div
        style={{
          background: "#181A22",
          borderBottom: "1px solid rgba(212, 182, 125, 0.25)",
          padding: "0.75rem 1.2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.8rem",
          zIndex: 10,
        }}
      >
        {/* Left Title & Status */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
          <span
            style={{
              background: "linear-gradient(135deg, #D4B67D 0%, #B38E46 100%)",
              color: "#000000",
              fontWeight: 800,
              fontSize: "0.72rem",
              padding: "0.2rem 0.6rem",
              borderRadius: "4px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            ✓ ON-SCREEN VIEWER
          </span>
          <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#FFFFFF" }}>{title}</span>
          {numPages > 0 && (
            <span style={{ color: "#D4B67D", fontSize: "0.8rem", fontWeight: 600 }}>
              ({numPages} Pages)
            </span>
          )}
        </div>

        {/* Center Controls (Zoom & View Mode) */}
        {!isGoogleDrive && !loading && !error && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            {/* View Mode Toggle */}
            <div style={{ display: "flex", background: "#0F1117", borderRadius: "6px", padding: "2px", border: "1px solid #333" }}>
              <button
                onClick={() => setViewMode("continuous")}
                style={{
                  background: viewMode === "continuous" ? "#D4B67D" : "transparent",
                  color: viewMode === "continuous" ? "#000000" : "#AAAAAA",
                  border: "none",
                  padding: "0.3rem 0.75rem",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
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
                  color: viewMode === "single" ? "#000000" : "#AAAAAA",
                  border: "none",
                  padding: "0.3rem 0.75rem",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                📄 Single Page
              </button>
            </div>

            {/* Single Page Pagination */}
            {viewMode === "single" && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  style={{
                    background: "#2A2D3A",
                    color: "#FFFFFF",
                    border: "none",
                    padding: "0.3rem 0.6rem",
                    borderRadius: "4px",
                    cursor: currentPage <= 1 ? "not-allowed" : "pointer",
                    opacity: currentPage <= 1 ? 0.4 : 1,
                    fontSize: "0.8rem",
                    fontWeight: 700,
                  }}
                >
                  ◀ Prev
                </button>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#D4B67D" }}>
                  {currentPage} / {numPages}
                </span>
                <button
                  disabled={currentPage >= numPages}
                  onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
                  style={{
                    background: "#2A2D3A",
                    color: "#FFFFFF",
                    border: "none",
                    padding: "0.3rem 0.6rem",
                    borderRadius: "4px",
                    cursor: currentPage >= numPages ? "not-allowed" : "pointer",
                    opacity: currentPage >= numPages ? 0.4 : 1,
                    fontSize: "0.8rem",
                    fontWeight: 700,
                  }}
                >
                  Next ▶
                </button>
              </div>
            )}

            {/* Zoom Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <button
                onClick={() => setScale((s) => Math.max(0.6, s - 0.2))}
                style={{
                  background: "#2A2D3A",
                  color: "#FFFFFF",
                  border: "none",
                  width: "28px",
                  height: "28px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: 800,
                }}
                title="Zoom Out"
              >
                −
              </button>
              <span style={{ fontSize: "0.75rem", color: "#AAAAAA", minWidth: "40px", textAlign: "center" }}>
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={() => setScale((s) => Math.min(2.0, s + 0.2))}
                style={{
                  background: "#2A2D3A",
                  color: "#FFFFFF",
                  border: "none",
                  width: "28px",
                  height: "28px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: 800,
                }}
                title="Zoom In"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Right Status & Done Button */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
          <span style={{ fontSize: "0.75rem", color: "#8A8279", fontWeight: 600 }}>
            🔒 View-Only Mode (Download Disabled)
          </span>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: "linear-gradient(135deg, #D4B67D 0%, #B38E46 100%)",
                color: "#000000",
                border: "none",
                padding: "0.4rem 1rem",
                borderRadius: "6px",
                fontWeight: 800,
                cursor: "pointer",
                fontSize: "0.82rem",
              }}
            >
              Done / Close
            </button>
          )}
        </div>
      </div>

      {/* ── MAIN CANVAS / PREVIEW VIEWPORT ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "auto",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "#0a0a0e",
          minHeight: "65vh",
          maxHeight: "82vh",
        }}
      >
        {loading && (
          <div style={{ padding: "4rem 2rem", textAlign: "center", color: "#D4B67D" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem", animation: "spin 1.5s linear infinite" }}>⏳</div>
            <h4 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 0.5rem 0", color: "#FFFFFF" }}>
              Rendering High-Resolution Specification Pages...
            </h4>
            <p style={{ color: "#8A8279", fontSize: "0.85rem" }}>
              Loading all pages into protected on-screen canvas reader.
            </p>
          </div>
        )}

        {error && (
          <div style={{ width: "100%", height: "100%", minHeight: "65vh", display: "flex", flexDirection: "column" }}>
            {/* Fallback to Native Protected Embed if PDF.js had cross-origin or local parsing note */}
            <iframe
              title={`${title} Protected Reader`}
              src={`${pdfUrl.startsWith("/") || pdfUrl.startsWith("http") ? pdfUrl.split("#")[0] : `/catalogs/${pdfUrl.split("#")[0]}`}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
              width="100%"
              height="100%"
              style={{ border: 0, flex: 1, minHeight: "65vh", borderRadius: "8px" }}
              allowFullScreen={true}
            />
          </div>
        )}

        {isGoogleDrive && driveEmbedUrl && (
          <div style={{ width: "100%", height: "100%", minHeight: "68vh" }}>
            <iframe
              title={`${title} Google Drive Protected Reader`}
              src={driveEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "68vh", borderRadius: "8px" }}
              allowFullScreen={true}
            />
          </div>
        )}

        {/* Continuous All Pages Container (Rendered by PDF.js into HTML5 Canvases) */}
        {!loading && !error && !isGoogleDrive && viewMode === "continuous" && (
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

        {/* Single Page Canvas View */}
        {!loading && !error && !isGoogleDrive && viewMode === "single" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: "8px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
              background: "#ffffff",
              overflow: "hidden",
              border: "1px solid #E8E3D7",
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
                padding: "8px 0",
                borderTop: "1px solid #E8E3D7",
              }}
            >
              PAGE {currentPage} OF {numPages}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
