"use client";

import { useEffect, useRef, useState } from "react";
import AdminNav from "@/components/AdminNav";
import {
  generateQrWithLogo,
  downloadQrCanvas,
  BRAND_LOGOS,
  QrCodeOptions,
} from "@/utils/qrWithLogo";
import {
  QrCode,
  Download,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Info,
  Upload,
  Layers,
  FileText,
  Smartphone,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

interface DocumentOption {
  title: string;
  brand: string;
  url: string;
  category?: string;
  source: "catalogs" | "downloads" | "page";
}

export default function AdminQrGeneratorPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Data sources
  const [documents, setDocuments] = useState<DocumentOption[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Form State
  const [selectedDocUrl, setSelectedDocUrl] = useState<string>("");
  const [customUrl, setCustomUrl] = useState<string>("");
  const [title, setTitle] = useState<string>("Aaren Studio QR Code");
  const [brandName, setBrandName] = useState<string>("AAREN");

  // Logo & Styling State
  const [logoType, setLogoType] = useState<"aaren" | "brand" | "custom" | "none">("aaren");
  const [selectedBrandLogo, setSelectedBrandLogo] = useState<string>(BRAND_LOGOS[0]?.file || "");
  const [customLogoUrl, setCustomLogoUrl] = useState<string>("");
  const [logoShape, setLogoShape] = useState<"rounded" | "circle" | "square">("rounded");
  const [qrColor, setQrColor] = useState<string>("#1E1E1E");
  const [qrBgColor, setQrBgColor] = useState<string>("#FFFFFF");
  const [badgeBorderColor, setBadgeBorderColor] = useState<string>("#81663F");
  const [resolution, setResolution] = useState<number>(1200);
  const [useGoRedirect, setUseGoRedirect] = useState<boolean>(false);

  // UI status
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrGenerated, setQrGenerated] = useState(false);

  // Fetch catalogs and download PDFs to populate the document selector
  useEffect(() => {
    async function loadDocuments() {
      setLoadingData(true);
      const docs: DocumentOption[] = [];

      // 1. Built-in website pages
      const websitePages: DocumentOption[] = [
        { title: "Homepage (Live Showcase)", brand: "AAREN", url: "/", source: "page" },
        { title: "Shop & Specimens (/shop)", brand: "AAREN", url: "/shop", source: "page" },
        { title: "Brands Directory (/brands)", brand: "AAREN", url: "/brands", source: "page" },
        { title: "PDF Catalogs Portal (/catalogs)", brand: "AAREN", url: "/catalogs", source: "page" },
        { title: "Downloads Repository (/downloads)", brand: "AAREN", url: "/downloads", source: "page" },
        { title: "Showcase Projects (/projects)", brand: "AAREN", url: "/projects", source: "page" },
        { title: "About Studio (/about)", brand: "AAREN", url: "/about", source: "page" },
        { title: "Contact & Concierge (/contact)", brand: "AAREN", url: "/contact", source: "page" },
      ];
      docs.push(...websitePages);

      // 2. Fetch Catalogs
      try {
        const catRes = await fetch(`/api/catalogs?t=${Date.now()}`);
        if (catRes.ok) {
          const catJson = await catRes.json();
          if (catJson.success && Array.isArray(catJson.data)) {
            catJson.data.forEach((c: any) => {
              const url = c.fileUrl || c.pdfUrl;
              if (url) {
                docs.push({
                  title: c.title || "Catalog",
                  brand: c.brand || "Partner Brand",
                  url: url,
                  category: c.category || "Catalog",
                  source: "catalogs",
                });
              }
            });
          }
        }
      } catch (err) {
        console.warn("Could not fetch catalogs for QR generator:", err);
      }

      // 3. Fetch Brand Downloads
      try {
        const dlRes = await fetch(`/api/downloads?t=${Date.now()}`);
        if (dlRes.ok) {
          const dlJson = await dlRes.json();
          if (dlJson.success && Array.isArray(dlJson.data)) {
            dlJson.data.forEach((folder: any) => {
              if (Array.isArray(folder.files)) {
                folder.files.forEach((f: any) => {
                  if (f.fileUrl) {
                    docs.push({
                      title: `${folder.brandName} - ${f.title}`,
                      brand: folder.brandName,
                      url: f.fileUrl,
                      category: f.category || "Brand Asset",
                      source: "downloads",
                    });
                  }
                });
              }
            });
          }
        }
      } catch (err) {
        console.warn("Could not fetch downloads for QR generator:", err);
      }

      setDocuments(docs);
      if (docs.length > 0) {
        setSelectedDocUrl(docs[0].url);
        setTitle(docs[0].title);
        setBrandName(docs[0].brand);
      }
      setLoadingData(false);
    }

    loadDocuments();
  }, []);

  // Compute final effective URL to encode in QR
  const getEffectiveUrl = (): string => {
    let raw = customUrl.trim() || selectedDocUrl.trim() || "/";
    const origin = typeof window !== "undefined" ? window.location.origin : "https://aarenstudio.vercel.app";

    if (useGoRedirect) {
      if (raw.startsWith("/") && !raw.startsWith("http")) {
        return `${origin}${raw}`;
      }
      return `${origin}/go?pdf=${encodeURIComponent(raw)}`;
    }

    if (raw.startsWith("/") && !raw.startsWith("http")) {
      return `${origin}${raw}`;
    }
    return raw;
  };

  const activeUrl = getEffectiveUrl();

  // Render QR code to canvas whenever settings change
  const renderQr = async () => {
    if (!canvasRef.current || !activeUrl) return;

    setGenerating(true);
    try {
      let logoUrlToUse: string | undefined = undefined;
      if (logoType === "brand") {
        logoUrlToUse = selectedBrandLogo;
      } else if (logoType === "custom") {
        logoUrlToUse = customLogoUrl;
      }

      const options: QrCodeOptions = {
        url: activeUrl,
        size: resolution,
        color: qrColor,
        bgColor: qrBgColor,
        logoType: logoType,
        logoUrl: logoUrlToUse,
        brandName: brandName,
        logoShape: logoShape,
        logoScale: 0.22,
        badgeBorderColor: badgeBorderColor,
      };

      await generateQrWithLogo(canvasRef.current, options);
      setQrGenerated(true);
    } catch (err: any) {
      console.error("QR Generation error:", err);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    if (!loadingData && activeUrl) {
      renderQr();
    }
  }, [
    activeUrl,
    logoType,
    selectedBrandLogo,
    customLogoUrl,
    logoShape,
    qrColor,
    qrBgColor,
    badgeBorderColor,
    resolution,
    loadingData,
  ]);

  // Handle custom logo file upload
  const handleCustomLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCustomLogoUrl(dataUrl);
        setLogoType("custom");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const fileName = `${brandName.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${title.toLowerCase().replace(/[^a-z0-9]/g, "_")}_QR`;
    downloadQrCanvas(canvasRef.current, fileName);
  };

  return (
    <div style={{ background: "#FAF8F5", color: "#1E1E1E", minHeight: "100vh", fontFamily: "var(--font-jost), 'Jost', sans-serif" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem", background: "#FAF8F5", maxWidth: "1500px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.8rem" }}>📱</span>
              <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#81663F", margin: 0 }}>
                Direct QR Code Generator with Logo
              </h1>
            </div>
            <p style={{ color: "#5E5852", fontSize: "0.95rem", margin: "6px 0 0" }}>
              Create luxury, high-resolution QR codes with the official AAREN emblem or brand logos. Scans instantly with <strong>zero third-party redirect warnings</strong>.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => renderQr()}
              disabled={generating}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "0.7rem 1.3rem",
                background: "#FAF8F5",
                border: "1px solid #D5CEBF",
                borderRadius: "8px",
                fontWeight: 700,
                color: "#1E1E1E",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              <RefreshCw size={14} className={generating ? "spin" : ""} />
              <span>Regenerate Preview</span>
            </button>
          </div>
        </div>

        {/* EXPLANATION & WARNING FIX BANNER */}
        <div
          style={{
            background: "linear-gradient(135deg, #FFFDF8 0%, #F5EFE6 100%)",
            border: "1px solid #D4B67D",
            borderRadius: "14px",
            padding: "1.2rem 1.6rem",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "14px",
            boxShadow: "0 4px 15px rgba(129, 102, 63, 0.08)",
          }}
        >
          <div
            style={{
              background: "#81663F",
              color: "#FFFFFF",
              borderRadius: "10px",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: "0 0 4px", fontSize: "1rem", fontWeight: 800, color: "#81663F" }}>
              Why did QRCodeChimp show a redirect warning?
            </h3>
            <p style={{ margin: "0 0 8px", fontSize: "0.85rem", color: "#4A433A", lineHeight: 1.5 }}>
              On QRCodeChimp free accounts, dynamic QR codes route through <code>qrcodechimp.page/u/...</code>, which forces an interstitial warning page asking users to copy &amp; paste.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontSize: "0.82rem" }}>
              <div style={{ background: "#FFFFFF", padding: "6px 12px", borderRadius: "6px", border: "1px solid #E2DCD2" }}>
                ✨ <strong>Aaren Built-in Generator:</strong> 100% Direct. Connects straight to your Firebase Storage PDFs and website pages. ZERO middleman warning screens.
              </div>
              <div style={{ background: "#FFFFFF", padding: "6px 12px", borderRadius: "6px", border: "1px solid #E2DCD2" }}>
                💡 <strong>If using QRCodeChimp:</strong> Always uncheck <em>&quot;Make dynamic&quot;</em> to make the QR code static.
              </div>
            </div>
          </div>
        </div>

        {/* WORKSPACE GRID: CONTROLS (LEFT) + LIVE PREVIEW (RIGHT) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "2rem", alignItems: "flex-start" }}>
          
          {/* LEFT COLUMN: CONTROLS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            {/* 1. Destination Document / Link */}
            <div style={{ background: "#FFFFFF", padding: "1.6rem", borderRadius: "14px", border: "1px solid #E2DCD2", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
                <span style={{ fontSize: "1.2rem" }}>🎯</span>
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#1E1E1E" }}>
                  1. Select Destination Document or Page
                </h3>
              </div>

              {/* Pre-indexed Document Selector */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#81663F", marginBottom: "6px" }}>
                  Choose from Firebase Storage PDFs or Website Pages:
                </label>
                <select
                  value={selectedDocUrl}
                  onChange={(e) => {
                    const chosen = documents.find((d) => d.url === e.target.value);
                    setSelectedDocUrl(e.target.value);
                    setCustomUrl("");
                    if (chosen) {
                      setTitle(chosen.title);
                      setBrandName(chosen.brand);
                      // Auto-match brand logo if available
                      const matchingLogo = BRAND_LOGOS.find((b) => chosen.brand.toLowerCase().includes(b.name.toLowerCase()));
                      if (matchingLogo) {
                        setSelectedBrandLogo(matchingLogo.file);
                        setLogoType("brand");
                      } else {
                        setLogoType("aaren");
                      }
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    border: "1px solid #D5CEBF",
                    background: "#FAF8F5",
                    fontSize: "0.88rem",
                    color: "#1E1E1E",
                    fontWeight: 600,
                  }}
                >
                  <optgroup label="🌐 Live Website Pages">
                    {documents.filter((d) => d.source === "page").map((d, i) => (
                      <option key={`page-${i}`} value={d.url}>
                        {d.title} ({d.url})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="📄 PDF Catalogs">
                    {documents.filter((d) => d.source === "catalogs").map((d, i) => (
                      <option key={`cat-${i}`} value={d.url}>
                        [{d.brand}] {d.title}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="📁 Brand Downloads (Firebase Storage)">
                    {documents.filter((d) => d.source === "downloads").map((d, i) => (
                      <option key={`dl-${i}`} value={d.url}>
                        [{d.brand}] {d.title}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* OR Custom URL Input */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#81663F", marginBottom: "6px" }}>
                  Or Paste Any Custom PDF / Webpage URL:
                </label>
                <input
                  type="text"
                  placeholder="https://firebasestorage.googleapis.com/... or https://..."
                  value={customUrl}
                  onChange={(e) => {
                    setCustomUrl(e.target.value);
                  }}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    border: "1px solid #D5CEBF",
                    background: "#FAF8F5",
                    fontSize: "0.88rem",
                    color: "#1E1E1E",
                  }}
                />
              </div>

              {/* Document Title & Brand Tag */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "0.5rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#6A6359", marginBottom: "4px" }}>
                    Document Title (For Filename)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.8rem",
                      borderRadius: "6px",
                      border: "1px solid #D5CEBF",
                      background: "#FAF8F5",
                      fontSize: "0.84rem",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#6A6359", marginBottom: "4px" }}>
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.8rem",
                      borderRadius: "6px",
                      border: "1px solid #D5CEBF",
                      background: "#FAF8F5",
                      fontSize: "0.84rem",
                    }}
                  />
                </div>
              </div>

              {/* Clean Redirect Toggle */}
              <div style={{ marginTop: "1rem", paddingTop: "0.8rem", borderTop: "1px solid #F0ECE4" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.82rem", color: "#1E1E1E", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={useGoRedirect}
                    onChange={(e) => setUseGoRedirect(e.target.checked)}
                    style={{ width: "16px", height: "16px", accentColor: "#81663F" }}
                  />
                  <span>
                    Use branded clean shortlink (<code>/go?pdf=...</code>) instead of direct URL
                  </span>
                </label>
              </div>
            </div>

            {/* 2. Center Logo Selection */}
            <div style={{ background: "#FFFFFF", padding: "1.6rem", borderRadius: "14px", border: "1px solid #E2DCD2", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
                <span style={{ fontSize: "1.2rem" }}>🎨</span>
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#1E1E1E" }}>
                  2. Center Logo &amp; Emblem
                </h3>
              </div>

              {/* Logo Mode Buttons */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: "1.2rem" }}>
                <button
                  type="button"
                  onClick={() => setLogoType("aaren")}
                  style={{
                    padding: "0.65rem 0.4rem",
                    borderRadius: "8px",
                    border: logoType === "aaren" ? "2px solid #81663F" : "1px solid #D5CEBF",
                    background: logoType === "aaren" ? "#FAF8F5" : "#FFFFFF",
                    fontWeight: 800,
                    fontSize: "0.8rem",
                    color: logoType === "aaren" ? "#81663F" : "#555555",
                    cursor: "pointer",
                  }}
                >
                  AAREN Emblem
                </button>
                <button
                  type="button"
                  onClick={() => setLogoType("brand")}
                  style={{
                    padding: "0.65rem 0.4rem",
                    borderRadius: "8px",
                    border: logoType === "brand" ? "2px solid #81663F" : "1px solid #D5CEBF",
                    background: logoType === "brand" ? "#FAF8F5" : "#FFFFFF",
                    fontWeight: 800,
                    fontSize: "0.8rem",
                    color: logoType === "brand" ? "#81663F" : "#555555",
                    cursor: "pointer",
                  }}
                >
                  Brand Logo
                </button>
                <button
                  type="button"
                  onClick={() => setLogoType("custom")}
                  style={{
                    padding: "0.65rem 0.4rem",
                    borderRadius: "8px",
                    border: logoType === "custom" ? "2px solid #81663F" : "1px solid #D5CEBF",
                    background: logoType === "custom" ? "#FAF8F5" : "#FFFFFF",
                    fontWeight: 800,
                    fontSize: "0.8rem",
                    color: logoType === "custom" ? "#81663F" : "#555555",
                    cursor: "pointer",
                  }}
                >
                  Upload Logo
                </button>
                <button
                  type="button"
                  onClick={() => setLogoType("none")}
                  style={{
                    padding: "0.65rem 0.4rem",
                    borderRadius: "8px",
                    border: logoType === "none" ? "2px solid #81663F" : "1px solid #D5CEBF",
                    background: logoType === "none" ? "#FAF8F5" : "#FFFFFF",
                    fontWeight: 800,
                    fontSize: "0.8rem",
                    color: logoType === "none" ? "#81663F" : "#555555",
                    cursor: "pointer",
                  }}
                >
                  No Logo
                </button>
              </div>

              {/* Sub-options based on logo type */}
              {logoType === "brand" && (
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#81663F", marginBottom: "6px" }}>
                    Select Partner Brand Logo:
                  </label>
                  <select
                    value={selectedBrandLogo}
                    onChange={(e) => setSelectedBrandLogo(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.9rem",
                      borderRadius: "8px",
                      border: "1px solid #D5CEBF",
                      background: "#FAF8F5",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                    }}
                  >
                    {BRAND_LOGOS.map((b) => (
                      <option key={b.name} value={b.file}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {logoType === "custom" && (
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#81663F", marginBottom: "6px" }}>
                    Upload Custom Logo Image (PNG / JPEG):
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCustomLogoUpload}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      borderRadius: "6px",
                      border: "1px dashed #D5CEBF",
                      background: "#FAF8F5",
                      fontSize: "0.82rem",
                    }}
                  />
                </div>
              )}

              {/* Logo Badge Shape */}
              {logoType !== "none" && (
                <div style={{ marginTop: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#6A6359", marginBottom: "6px" }}>
                    Badge Shape:
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {[
                      { id: "rounded", label: "Rounded Squircle" },
                      { id: "circle", label: "Circle" },
                      { id: "square", label: "Square" },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setLogoShape(s.id as any)}
                        style={{
                          flex: 1,
                          padding: "0.5rem 0.6rem",
                          borderRadius: "6px",
                          border: logoShape === s.id ? "2px solid #81663F" : "1px solid #D5CEBF",
                          background: logoShape === s.id ? "#FAF8F5" : "#FFFFFF",
                          fontWeight: 700,
                          fontSize: "0.78rem",
                          color: logoShape === s.id ? "#81663F" : "#555555",
                          cursor: "pointer",
                        }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Color & Quality Settings */}
            <div style={{ background: "#FFFFFF", padding: "1.6rem", borderRadius: "14px", border: "1px solid #E2DCD2", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
                <span style={{ fontSize: "1.2rem" }}>⚙️</span>
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#1E1E1E" }}>
                  3. Colors &amp; Print Quality
                </h3>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "1.2rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#6A6359", marginBottom: "4px" }}>
                    QR Color
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <input
                      type="color"
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      style={{ width: "36px", height: "36px", border: "none", borderRadius: "6px", cursor: "pointer" }}
                    />
                    <span style={{ fontSize: "0.78rem", fontFamily: "monospace", color: "#1E1E1E" }}>{qrColor}</span>
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#6A6359", marginBottom: "4px" }}>
                    Background
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <input
                      type="color"
                      value={qrBgColor}
                      onChange={(e) => setQrBgColor(e.target.value)}
                      style={{ width: "36px", height: "36px", border: "none", borderRadius: "6px", cursor: "pointer" }}
                    />
                    <span style={{ fontSize: "0.78rem", fontFamily: "monospace", color: "#1E1E1E" }}>{qrBgColor}</span>
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#6A6359", marginBottom: "4px" }}>
                    Badge Border
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <input
                      type="color"
                      value={badgeBorderColor}
                      onChange={(e) => setBadgeBorderColor(e.target.value)}
                      style={{ width: "36px", height: "36px", border: "none", borderRadius: "6px", cursor: "pointer" }}
                    />
                    <span style={{ fontSize: "0.78rem", fontFamily: "monospace", color: "#1E1E1E" }}>{badgeBorderColor}</span>
                  </div>
                </div>
              </div>

              {/* Resolution selection */}
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#6A6359", marginBottom: "6px" }}>
                  Download Resolution:
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[
                    { res: 600, label: "Web / Digital (600px)" },
                    { res: 1200, label: "High Definition (1200px)" },
                    { res: 2400, label: "Print Master (2400px)" },
                  ].map((r) => (
                    <button
                      key={r.res}
                      type="button"
                      onClick={() => setResolution(r.res)}
                      style={{
                        flex: 1,
                        padding: "0.55rem 0.5rem",
                        borderRadius: "6px",
                        border: resolution === r.res ? "2px solid #81663F" : "1px solid #D5CEBF",
                        background: resolution === r.res ? "#FAF8F5" : "#FFFFFF",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        color: resolution === r.res ? "#81663F" : "#555555",
                        cursor: "pointer",
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: LIVE INTERACTIVE PREVIEW & ACTIONS */}
          <div style={{ position: "sticky", top: "2rem" }}>
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: "16px",
                border: "1px solid #E2DCD2",
                padding: "2rem 2.4rem",
                boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                textAlign: "center",
              }}
            >
              <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: "20px", background: "rgba(129, 102, 63, 0.12)", color: "#81663F", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.6rem" }}>
                {brandName} • Live Preview
              </div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#1E1E1E", margin: "0 0 1.2rem", lineHeight: 1.3 }}>
                {title}
              </h2>

              {/* QR Code Canvas Display Box */}
              <div
                style={{
                  background: "#FAF8F5",
                  padding: "1.2rem",
                  borderRadius: "16px",
                  border: "1px solid #E8E2D7",
                  display: "inline-block",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
                  maxWidth: "100%",
                }}
              >
                <canvas
                  ref={canvasRef}
                  style={{
                    width: "280px",
                    height: "280px",
                    maxWidth: "100%",
                    display: "block",
                    borderRadius: "8px",
                  }}
                />
              </div>

              {/* Scan with Camera Prompt */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", margin: "1rem 0 0.5rem", color: "#81663F", fontSize: "0.82rem", fontWeight: 700 }}>
                <Smartphone size={15} />
                <span>Scan this screen right now with your phone camera to test!</span>
              </div>

              {/* Direct Target URL Display */}
              <div
                style={{
                  background: "#FAF8F5",
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid #E2DCD2",
                  textAlign: "left",
                  marginTop: "0.8rem",
                }}
              >
                <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#81663F", textTransform: "uppercase", marginBottom: "4px" }}>
                  Destination URL (Direct Access — Zero Warning Screens):
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#1E1E1E",
                    wordBreak: "break-all",
                    fontFamily: "monospace",
                    maxHeight: "60px",
                    overflowY: "auto",
                  }}
                >
                  {activeUrl}
                </div>
              </div>

              {/* Actions Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "1.4rem" }}>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "0.8rem",
                    background: copied ? "#15803d" : "#FAF8F5",
                    border: "1px solid #D5CEBF",
                    color: copied ? "#FFFFFF" : "#1E1E1E",
                    borderRadius: "8px",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  <span>{copied ? "Copied!" : "Copy Direct URL"}</span>
                </button>

                <a
                  href={activeUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "0.8rem",
                    background: "#FAF8F5",
                    border: "1px solid #D5CEBF",
                    color: "#81663F",
                    borderRadius: "8px",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    textDecoration: "none",
                  }}
                >
                  <ExternalLink size={15} />
                  <span>Test Open URL</span>
                </a>
              </div>

              {/* Master Download Button */}
              <button
                type="button"
                onClick={handleDownload}
                style={{
                  width: "100%",
                  marginTop: "10px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "0.95rem 1.4rem",
                  background: "linear-gradient(135deg, #1E1E1E 0%, #333333 100%)",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: 800,
                  fontSize: "0.92rem",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                }}
              >
                <Download size={16} />
                <span>Download Print-Ready PNG ({resolution}x{resolution} px)</span>
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
