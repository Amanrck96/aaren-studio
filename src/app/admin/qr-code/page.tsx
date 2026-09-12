"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import AdminNav from "@/components/AdminNav";
import { BRAND_LOGOS } from "@/utils/qrWithLogo";
import { QrCodeItem } from "@/lib/types";
import {
  QrCode as QrIcon,
  Download,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Upload,
  Trash2,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  ArrowDownToLine,
  Sliders,
  Palette,
  FileCode,
  FileImage,
  FolderOpen,
  Eye,
} from "lucide-react";

// Official AAREN luxury emblem monogram badge (inline SVG data URL)
const AAREN_EMBLEM_DATA_URL = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect width="200" height="200" rx="40" fill="%23FAF8F5" stroke="%2381663F" stroke-width="8"/><rect x="16" y="16" width="168" height="168" rx="30" fill="none" stroke="%23D5CEBF" stroke-width="3"/><polygon points="100,42 114,56 100,70 86,56" fill="%2381663F"/><text x="100" y="112" font-family="Georgia, serif" font-size="34" font-weight="900" fill="%231E1E1E" text-anchor="middle" letter-spacing="3">AAREN</text><text x="100" y="142" font-family="sans-serif" font-size="16" font-weight="800" fill="%2381663F" text-anchor="middle" letter-spacing="5">STUDIO</text></svg>`;

interface DocumentOption {
  title: string;
  brand: string;
  url: string;
  source: "page" | "catalog" | "download";
}

const LUXURY_PALETTES = [
  { name: "Classic Onyx", fg: "#1E1E1E", bg: "#FFFFFF" },
  { name: "Aaren Bronze", fg: "#81663F", bg: "#FAF8F5" },
  { name: "Deep Charcoal", fg: "#121417", bg: "#F5F3EF" },
  { name: "Tuscan Gold", fg: "#6E4C1E", bg: "#FFFDF9" },
];

export default function AdminQrCodePage() {
  const qrContainerRef = useRef<HTMLDivElement>(null);
  const qrCodeInstanceRef = useRef<any>(null);

  // Form State
  const [text, setText] = useState<string>("https://aarenstudio.com");
  const [title, setTitle] = useState<string>("Aaren Studio Website");
  const [fgColor, setFgColor] = useState<string>("#1E1E1E");
  const [bgColor, setBgColor] = useState<string>("#FFFFFF");
  const [size, setSize] = useState<number>(1200);
  const [dotType, setDotType] = useState<"rounded" | "dots" | "classy" | "square">("rounded");
  const [cornerSquareType, setCornerSquareType] = useState<"extra-rounded" | "dot" | "square">("extra-rounded");

  // Logo State
  const [logoMode, setLogoMode] = useState<"none" | "aaren" | "brand" | "custom">("aaren");
  const [selectedBrandLogo, setSelectedBrandLogo] = useState<string>(BRAND_LOGOS[0]?.file || "");
  const [customLogoUrl, setCustomLogoUrl] = useState<string>("");
  const [customLogoName, setCustomLogoName] = useState<string>("");
  const [uploadingLogo, setUploadingLogo] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // UI / Status State
  const [documents, setDocuments] = useState<DocumentOption[]>([]);
  const [savedCodes, setSavedCodes] = useState<QrCodeItem[]>([]);
  const [loadingSaved, setLoadingSaved] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [downloadingFormat, setDownloadingFormat] = useState<"png" | "svg" | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Determine active logo URL
  const getActiveLogoUrl = useCallback((): string | undefined => {
    if (logoMode === "none") return undefined;
    if (logoMode === "aaren") return AAREN_EMBLEM_DATA_URL;
    if (logoMode === "brand") return selectedBrandLogo || undefined;
    if (logoMode === "custom") return customLogoUrl || undefined;
    return undefined;
  }, [logoMode, selectedBrandLogo, customLogoUrl]);

  const activeLogo = getActiveLogoUrl();
  const hasLogo = Boolean(activeLogo);
  // Error correction level constraint: Always use 'H' (highest, ~30% tolerance) if logo is present
  const errorCorrectionLevel = hasLogo ? "H" : "M";

  // 1. Fetch pre-indexed website pages & catalogs for 1-click select
  useEffect(() => {
    async function fetchOptions() {
      const docs: DocumentOption[] = [
        { title: "Homepage Live Showcase", brand: "AAREN", url: "/", source: "page" },
        { title: "Shop & Specimens (/shop)", brand: "AAREN", url: "/shop", source: "page" },
        { title: "Brands Directory (/brands)", brand: "AAREN", url: "/brands", source: "page" },
        { title: "PDF Catalogs Portal (/catalogs)", brand: "AAREN", url: "/catalogs", source: "page" },
        { title: "Downloads Repository (/downloads)", brand: "AAREN", url: "/downloads", source: "page" },
        { title: "Showcase Projects (/projects)", brand: "AAREN", url: "/projects", source: "page" },
        { title: "About Studio (/about)", brand: "AAREN", url: "/about", source: "page" },
        { title: "Contact Concierge (/contact)", brand: "AAREN", url: "/contact", source: "page" },
      ];

      try {
        const catRes = await fetch(`/api/catalogs?t=${Date.now()}`);
        if (catRes.ok) {
          const catJson = await catRes.json();
          if (catJson.success && Array.isArray(catJson.data)) {
            catJson.data.forEach((c: any) => {
              const u = c.fileUrl || c.pdfUrl;
              if (u) {
                docs.push({
                  title: c.title || c.name || "Catalog",
                  brand: c.brand || "Partner Brand",
                  url: u,
                  source: "catalog",
                });
              }
            });
          }
        }
      } catch (e) {
        // Silently continue
      }

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
                      source: "download",
                    });
                  }
                });
              }
            });
          }
        }
      } catch (e) {
        // Silently continue
      }

      setDocuments(docs);
    }

    fetchOptions();
  }, []);

  // 2. Fetch saved QR codes from database
  const loadSavedQrCodes = useCallback(async () => {
    setLoadingSaved(true);
    try {
      const res = await fetch(`/api/qr-code?t=${Date.now()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setSavedCodes(json.data);
        }
      }
    } catch (err) {
      console.warn("Could not load saved QR codes:", err);
    } finally {
      setLoadingSaved(false);
    }
  }, []);

  useEffect(() => {
    loadSavedQrCodes();
  }, [loadSavedQrCodes]);

  // 3. Initialize and dynamically update qr-code-styling
  useEffect(() => {
    let isMounted = true;

    async function setupQr() {
      if (!qrContainerRef.current) return;

      const trimmedText = text.trim();
      if (!trimmedText) {
        // Empty state: clear container
        if (qrContainerRef.current) {
          qrContainerRef.current.innerHTML = "";
        }
        qrCodeInstanceRef.current = null;
        return;
      }

      try {
        const { default: QRCodeStyling } = await import("qr-code-styling");
        if (!isMounted || !qrContainerRef.current) return;

        const options = {
          width: 320,
          height: 320,
          data: trimmedText,
          image: activeLogo || undefined,
          dotsOptions: {
            color: fgColor,
            type: dotType,
          },
          backgroundOptions: {
            color: bgColor,
          },
          imageOptions: {
            crossOrigin: "anonymous",
            margin: 4,
            // Strict constraint: logo overlay capped at 20-22% of QR area
            imageSize: 0.22,
            hideBackgroundDots: true,
          },
          cornersSquareOptions: {
            type: cornerSquareType,
            color: fgColor,
          },
          cornersDotOptions: {
            type: (cornerSquareType === "square" ? "square" : "dot") as "dot" | "square",
            color: fgColor,
          },
          qrOptions: {
            // Strict constraint: 'H' whenever logo is present
            errorCorrectionLevel: errorCorrectionLevel as "L" | "M" | "Q" | "H",
          },
        };

        if (!qrCodeInstanceRef.current) {
          const qrInstance = new QRCodeStyling(options);
          qrContainerRef.current.innerHTML = "";
          qrInstance.append(qrContainerRef.current);
          qrCodeInstanceRef.current = qrInstance;
        } else {
          qrCodeInstanceRef.current.update(options);
        }
      } catch (err) {
        console.error("Failed to render QR Code:", err);
      }
    }

    setupQr();

    return () => {
      isMounted = false;
    };
  }, [text, activeLogo, fgColor, bgColor, dotType, cornerSquareType, errorCorrectionLevel]);

  // 4. Logo File Upload via server-side Cloudinary integration
  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Validate file type
    const validMimes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml"];
    if (!validMimes.includes(file.type.toLowerCase())) {
      setUploadError("Invalid image type. Please select a PNG, JPEG, WebP, or SVG file.");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max 5MB allowed.`);
      return;
    }

    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/qr-code/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to upload logo to Cloudinary");
      }

      setCustomLogoUrl(json.url);
      setCustomLogoName(file.name);
      setLogoMode("custom");
      showToast("Logo uploaded successfully via Cloudinary!");
    } catch (err: any) {
      console.error("Logo upload failed:", err);
      setUploadError(err.message || "Upload error");
    } finally {
      setUploadingLogo(false);
      // Reset input value so same file can be re-selected if desired
      e.target.value = "";
    }
  };

  // 5. Download Handlers (PNG & SVG)
  const handleDownload = async (format: "png" | "svg") => {
    const trimmedText = text.trim();
    if (!trimmedText) {
      showToast("Please enter a valid URL or text before downloading.");
      return;
    }

    setDownloadingFormat(format);
    try {
      const safeName = (title.trim() || "aaren_qr_code")
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "_");

      const { default: QRCodeStyling } = await import("qr-code-styling");

      // Instantiate a high-res instance configured with target export resolution
      const exportInstance = new QRCodeStyling({
        width: size,
        height: size,
        data: trimmedText,
        image: activeLogo || undefined,
        dotsOptions: {
          color: fgColor,
          type: dotType,
        },
        backgroundOptions: {
          color: bgColor,
        },
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 4,
          imageSize: 0.22, // Strict 22% cap
          hideBackgroundDots: true,
        },
        cornersSquareOptions: {
          type: cornerSquareType,
          color: fgColor,
        },
        cornersDotOptions: {
          type: (cornerSquareType === "square" ? "square" : "dot") as "dot" | "square",
          color: fgColor,
        },
        qrOptions: {
          errorCorrectionLevel: errorCorrectionLevel as "L" | "M" | "Q" | "H",
        },
      });

      await exportInstance.download({
        name: `${safeName}_${size}px`,
        extension: format,
      });

      showToast(`Downloaded ${format.toUpperCase()} (${size}x${size}px) successfully!`);
    } catch (err: any) {
      console.error(`Download ${format} error:`, err);
      showToast(`Failed to download ${format.toUpperCase()}: ${err.message}`);
    } finally {
      setDownloadingFormat(null);
    }
  };

  // 6. Save QR code to database persistence
  const handleSaveToDatabase = async () => {
    const trimmedText = text.trim();
    if (!trimmedText) {
      showToast("Please enter a URL or text before saving.");
      return;
    }

    setSaving(true);
    try {
      // Capture preview image blob
      let previewDataUrl: string | undefined = undefined;
      if (qrCodeInstanceRef.current) {
        try {
          const blob = await qrCodeInstanceRef.current.getRawData("png");
          if (blob) {
            previewDataUrl = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(blob as Blob);
            });
          }
        } catch (e) {
          console.warn("Could not extract preview image blob:", e);
        }
      }

      const res = await fetch("/api/qr-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || "Aaren QR Code",
          url: trimmedText,
          imageUrl: previewDataUrl,
          fgColor: fgColor,
          bgColor: bgColor,
          logoUrl: activeLogo || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save QR code");
      }

      showToast("QR code saved to admin records!");
      loadSavedQrCodes();
    } catch (err: any) {
      console.error("Save QR code error:", err);
      showToast(`Failed to save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // 7. Delete saved QR code
  const handleDeleteSaved = async (id: string, qrTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${qrTitle}"?`)) return;

    try {
      const res = await fetch(`/api/qr-code?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      const json = await res.json();
      if (json.success) {
        setSavedCodes((prev) => prev.filter((item) => item.id !== id));
        showToast("QR code deleted from records.");
      } else {
        throw new Error(json.error || "Delete failed");
      }
    } catch (err: any) {
      console.error("Delete error:", err);
      showToast(`Failed to delete: ${err.message}`);
    }
  };

  // 8. Load a saved QR code back into the editor
  const handleLoadSavedIntoEditor = (item: QrCodeItem) => {
    setText(item.url);
    setTitle(item.title || "QR Code");
    if (item.fgColor) setFgColor(item.fgColor);
    if (item.bgColor) setBgColor(item.bgColor);

    if (item.logoUrl) {
      if (item.logoUrl === AAREN_EMBLEM_DATA_URL) {
        setLogoMode("aaren");
      } else if (BRAND_LOGOS.some((b) => b.file === item.logoUrl)) {
        setLogoMode("brand");
        setSelectedBrandLogo(item.logoUrl);
      } else {
        setLogoMode("custom");
        setCustomLogoUrl(item.logoUrl);
        setCustomLogoName("Saved Logo");
      }
    } else {
      setLogoMode("none");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast(`Loaded "${item.title || "QR Code"}" into editor`);
  };

  // 9. Quick Copy Link
  const handleCopyLink = () => {
    if (!text.trim()) return;
    navigator.clipboard.writeText(text.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isTextEmpty = !text.trim();

  return (
    <div style={{ background: "#FAF8F5", color: "#1E1E1E", minHeight: "100vh", fontFamily: "var(--font-jost), 'Jost', sans-serif" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem", background: "#FAF8F5", maxWidth: "1500px", margin: "0 auto" }}>
        
        {/* Toast Notification */}
        {toastMessage && (
          <div
            style={{
              position: "fixed",
              bottom: "24px",
              right: "24px",
              zIndex: 9999,
              background: "#1E1E1E",
              color: "#FFFFFF",
              padding: "0.9rem 1.4rem",
              borderRadius: "10px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "0.9rem",
              fontWeight: 700,
            }}
          >
            <CheckCircle size={18} color="#10B981" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  background: "#81663F",
                  color: "#FFFFFF",
                  padding: "8px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <QrIcon size={24} />
              </div>
              <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#81663F", margin: 0 }}>
                QR Code Generator
              </h1>
            </div>
            <p style={{ color: "#5E5852", fontSize: "0.95rem", margin: "6px 0 0" }}>
              Generate high-resolution, luxury branded QR codes with live preview, error-correction scannability guardrails, Cloudinary logo uploads, and direct PNG/SVG exports.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => loadSavedQrCodes()}
              disabled={loadingSaved}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "0.7rem 1.2rem",
                background: "#FAF8F5",
                border: "1px solid #D5CEBF",
                borderRadius: "8px",
                fontWeight: 700,
                color: "#1E1E1E",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              <RefreshCw size={14} className={loadingSaved ? "animate-spin" : ""} />
              <span>Refresh Records</span>
            </button>
          </div>
        </div>

        {/* Scannability Guarantee Notice */}
        <div
          style={{
            background: "linear-gradient(135deg, #FFFDF8 0%, #F5EFE6 100%)",
            border: "1px solid #D4B67D",
            borderRadius: "12px",
            padding: "1rem 1.4rem",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <div
            style={{
              background: "#81663F",
              color: "#FFFFFF",
              borderRadius: "8px",
              padding: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={20} />
          </div>
          <div style={{ flex: 1, fontSize: "0.86rem", color: "#4A433A", lineHeight: 1.4 }}>
            <strong style={{ color: "#81663F" }}>Scannability Architecture:</strong> QR codes automatically apply{" "}
            <span style={{ fontWeight: 800, color: "#1E1E1E" }}>
              Error Correction Level {errorCorrectionLevel} ({hasLogo ? "Highest ~30% recovery tolerance" : "Standard ~15% recovery tolerance"})
            </span>
            {hasLogo && ", and the center logo is capped at 22% of code area"} to ensure immediate phone camera scans.
          </div>
        </div>

        {/* WORKSPACE GRID: CONTROLS (LEFT) + LIVE PREVIEW (RIGHT) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "2rem", alignItems: "flex-start" }}>
          
          {/* LEFT COLUMN: GENERATOR CONTROLS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            {/* Card 1: Content & Target URL */}
            <div style={{ background: "#FFFFFF", padding: "1.6rem", borderRadius: "14px", border: "1px solid #E2DCD2", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
                <span style={{ fontSize: "1.2rem" }}>🎯</span>
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#1E1E1E" }}>
                  1. Target Content or Destination URL
                </h3>
              </div>

              {/* Pre-indexed Select from Website / Catalogs / Downloads */}
              {documents.length > 0 && (
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#81663F", marginBottom: "6px" }}>
                    Quick Select from Website Pages or Catalogs:
                  </label>
                  <select
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) return;
                      const chosen = documents.find((d) => d.url === val);
                      if (chosen) {
                        const origin = typeof window !== "undefined" ? window.location.origin : "https://aarenstudio.com";
                        const fullUrl = chosen.url.startsWith("/") ? `${origin}${chosen.url}` : chosen.url;
                        setText(fullUrl);
                        setTitle(chosen.title);
                        // Auto match brand logo if applicable
                        const matchedBrand = BRAND_LOGOS.find((b) => chosen.brand.toLowerCase().includes(b.name.toLowerCase()));
                        if (matchedBrand) {
                          setSelectedBrandLogo(matchedBrand.file);
                          setLogoMode("brand");
                        }
                      }
                    }}
                    defaultValue=""
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
                    <option value="" disabled>-- Select existing project asset (optional) --</option>
                    <optgroup label="🌐 Live Website Pages">
                      {documents.filter((d) => d.source === "page").map((d, i) => (
                        <option key={`p-${i}`} value={d.url}>
                          {d.title} ({d.url})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="📄 PDF Catalogs">
                      {documents.filter((d) => d.source === "catalog").map((d, i) => (
                        <option key={`c-${i}`} value={d.url}>
                          [{d.brand}] {d.title}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="📁 Brand Downloads">
                      {documents.filter((d) => d.source === "download").map((d, i) => (
                        <option key={`d-${i}`} value={d.url}>
                          [{d.brand}] {d.title}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              )}

              {/* Text / URL input */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#81663F", marginBottom: "6px" }}>
                  URL or Arbitrary Text: <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="https://aarenstudio.com/shop or arbitrary text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    border: isTextEmpty ? "1px solid #F87171" : "1px solid #D5CEBF",
                    background: "#FAF8F5",
                    fontSize: "0.88rem",
                    color: "#1E1E1E",
                    boxSizing: "border-box",
                  }}
                />
                {isTextEmpty && (
                  <p style={{ margin: "6px 0 0", color: "#DC2626", fontSize: "0.78rem", fontWeight: 600 }}>
                    Please enter a URL or text. Generation is paused until text is provided.
                  </p>
                )}
              </div>

              {/* Code Title (for record & download file name) */}
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#6A6359", marginBottom: "6px" }}>
                  Title / Label (Used for Download Filename &amp; Saved Records):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Falper Autumn Catalogue 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.9rem",
                    borderRadius: "8px",
                    border: "1px solid #D5CEBF",
                    background: "#FAF8F5",
                    fontSize: "0.84rem",
                    color: "#1E1E1E",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Card 2: Logo & Emblem Customization */}
            <div style={{ background: "#FFFFFF", padding: "1.6rem", borderRadius: "14px", border: "1px solid #E2DCD2", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
                <span style={{ fontSize: "1.2rem" }}>🎨</span>
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#1E1E1E" }}>
                  2. Center Logo &amp; Overlay
                </h3>
              </div>

              {/* Logo Mode Selection Tabs */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: "1.2rem" }}>
                {[
                  { id: "aaren", label: "AAREN Emblem" },
                  { id: "brand", label: "Brand Logo" },
                  { id: "custom", label: "Upload Custom" },
                  { id: "none", label: "No Logo" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setLogoMode(tab.id as any)}
                    style={{
                      padding: "0.65rem 0.4rem",
                      borderRadius: "8px",
                      border: logoMode === tab.id ? "2px solid #81663F" : "1px solid #D5CEBF",
                      background: logoMode === tab.id ? "#FAF8F5" : "#FFFFFF",
                      fontWeight: 800,
                      fontSize: "0.78rem",
                      color: logoMode === tab.id ? "#81663F" : "#555555",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Brand Logo Dropdown */}
              {logoMode === "brand" && (
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#81663F", marginBottom: "6px" }}>
                    Select Partner Brand Logo:
                  </label>
                  <select
                    value={selectedBrandLogo}
                    onChange={(e) => setSelectedBrandLogo(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.7rem 0.9rem",
                      borderRadius: "8px",
                      border: "1px solid #D5CEBF",
                      background: "#FAF8F5",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "#1E1E1E",
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

              {/* Custom Logo Upload via Cloudinary */}
              {logoMode === "custom" && (
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#81663F", marginBottom: "6px" }}>
                    Upload Custom Logo Image (Cloudinary Integration):
                  </label>
                  <div
                    style={{
                      border: "2px dashed #D5CEBF",
                      borderRadius: "10px",
                      padding: "1.2rem",
                      textAlign: "center",
                      background: "#FAF8F5",
                    }}
                  >
                    {customLogoUrl ? (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <img
                            src={customLogoUrl}
                            alt="Uploaded Logo"
                            style={{ width: "42px", height: "42px", objectFit: "contain", borderRadius: "6px", background: "#FFFFFF", border: "1px solid #E2DCD2" }}
                          />
                          <div style={{ textAlign: "left" }}>
                            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1E1E1E" }}>{customLogoName || "Uploaded Logo"}</div>
                            <div style={{ fontSize: "0.75rem", color: "#10B981", fontWeight: 600 }}>Ready on Cloudinary</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setCustomLogoUrl("");
                            setCustomLogoName("");
                            setLogoMode("none");
                          }}
                          style={{
                            background: "#FEE2E2",
                            border: "1px solid #FCA5A5",
                            color: "#DC2626",
                            padding: "0.4rem 0.8rem",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          id="qr-logo-upload"
                          accept="image/png,image/jpeg,image/webp,image/svg+xml"
                          onChange={handleLogoFileChange}
                          disabled={uploadingLogo}
                          style={{ display: "none" }}
                        />
                        <label
                          htmlFor="qr-logo-upload"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "0.65rem 1.2rem",
                            background: "#81663F",
                            color: "#FFFFFF",
                            borderRadius: "8px",
                            fontWeight: 700,
                            fontSize: "0.84rem",
                            cursor: uploadingLogo ? "wait" : "pointer",
                          }}
                        >
                          {uploadingLogo ? (
                            <>
                              <RefreshCw size={15} className="animate-spin" />
                              <span>Uploading to Cloudinary...</span>
                            </>
                          ) : (
                            <>
                              <Upload size={15} />
                              <span>Choose Logo File (PNG, JPG, SVG - Max 5MB)</span>
                            </>
                          )}
                        </label>
                        <p style={{ margin: "8px 0 0", color: "#6A6359", fontSize: "0.75rem" }}>
                          Uses project&apos;s server-side Cloudinary integration. Secrets remain protected.
                        </p>
                      </div>
                    )}

                    {uploadError && (
                      <div style={{ marginTop: "10px", color: "#DC2626", fontSize: "0.78rem", fontWeight: 600 }}>
                        ⚠️ {uploadError}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Card 3: Colors & Styling Options */}
            <div style={{ background: "#FFFFFF", padding: "1.6rem", borderRadius: "14px", border: "1px solid #E2DCD2", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
                <span style={{ fontSize: "1.2rem" }}>⚙️</span>
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#1E1E1E" }}>
                  3. Color Palette &amp; Shapes
                </h3>
              </div>

              {/* Luxury Palette Presets */}
              <div style={{ marginBottom: "1.2rem" }}>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#6A6359", marginBottom: "6px" }}>
                  Quick Luxury Palettes:
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                  {LUXURY_PALETTES.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => {
                        setFgColor(p.fg);
                        setBgColor(p.bg);
                      }}
                      style={{
                        padding: "0.5rem 0.8rem",
                        borderRadius: "8px",
                        border: fgColor === p.fg && bgColor === p.bg ? "2px solid #81663F" : "1px solid #D5CEBF",
                        background: "#FAF8F5",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        color: "#1E1E1E",
                      }}
                    >
                      <span style={{ width: "16px", height: "16px", borderRadius: "4px", background: p.fg, border: "1px solid #CCCCCC" }} />
                      <span style={{ width: "16px", height: "16px", borderRadius: "4px", background: p.bg, border: "1px solid #CCCCCC" }} />
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Color Pickers */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "1.2rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#6A6359", marginBottom: "4px" }}>
                    Foreground Color:
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      style={{ width: "40px", height: "40px", border: "none", borderRadius: "8px", cursor: "pointer", background: "none" }}
                    />
                    <input
                      type="text"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "0.5rem 0.7rem",
                        borderRadius: "6px",
                        border: "1px solid #D5CEBF",
                        background: "#FAF8F5",
                        fontSize: "0.82rem",
                        fontFamily: "monospace",
                        color: "#1E1E1E",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#6A6359", marginBottom: "4px" }}>
                    Background Color:
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      style={{ width: "40px", height: "40px", border: "none", borderRadius: "8px", cursor: "pointer", background: "none" }}
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "0.5rem 0.7rem",
                        borderRadius: "6px",
                        border: "1px solid #D5CEBF",
                        background: "#FAF8F5",
                        fontSize: "0.82rem",
                        fontFamily: "monospace",
                        color: "#1E1E1E",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Dot Shape Selector */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#6A6359", marginBottom: "6px" }}>
                  Dots Shape:
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" }}>
                  {[
                    { id: "rounded", label: "Rounded" },
                    { id: "dots", label: "Dots" },
                    { id: "classy", label: "Classy" },
                    { id: "square", label: "Square" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setDotType(s.id as any)}
                      style={{
                        padding: "0.5rem",
                        borderRadius: "6px",
                        border: dotType === s.id ? "2px solid #81663F" : "1px solid #D5CEBF",
                        background: dotType === s.id ? "#FAF8F5" : "#FFFFFF",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        color: dotType === s.id ? "#81663F" : "#555555",
                        cursor: "pointer",
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Corner Square Shape */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#6A6359", marginBottom: "6px" }}>
                  Corner Eyes Shape:
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
                  {[
                    { id: "extra-rounded", label: "Curved" },
                    { id: "dot", label: "Circle" },
                    { id: "square", label: "Square" },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCornerSquareType(c.id as any)}
                      style={{
                        padding: "0.5rem",
                        borderRadius: "6px",
                        border: cornerSquareType === c.id ? "2px solid #81663F" : "1px solid #D5CEBF",
                        background: cornerSquareType === c.id ? "#FAF8F5" : "#FFFFFF",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        color: cornerSquareType === c.id ? "#81663F" : "#555555",
                        cursor: "pointer",
                      }}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resolution / Size */}
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#6A6359", marginBottom: "6px" }}>
                  Export Resolution (For Downloads):
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                  {[
                    { res: 600, label: "600px (Digital)" },
                    { res: 1200, label: "1200px (HD)" },
                    { res: 2400, label: "2400px (Print Master)" },
                  ].map((r) => (
                    <button
                      key={r.res}
                      type="button"
                      onClick={() => setSize(r.res)}
                      style={{
                        padding: "0.55rem 0.4rem",
                        borderRadius: "6px",
                        border: size === r.res ? "2px solid #81663F" : "1px solid #D5CEBF",
                        background: size === r.res ? "#FAF8F5" : "#FFFFFF",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        color: size === r.res ? "#81663F" : "#555555",
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

          {/* RIGHT COLUMN: LIVE PREVIEW & DOWNLOAD ACTIONS */}
          <div style={{ position: "sticky", top: "2rem" }}>
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: "16px",
                border: "1px solid #E2DCD2",
                padding: "2rem 2.2rem",
                boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  background: "rgba(129, 102, 63, 0.12)",
                  color: "#81663F",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "0.6rem",
                }}
              >
                Live Interactive Preview
              </div>

              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1E1E1E", margin: "0 0 1.2rem", lineHeight: 1.3 }}>
                {title || "Custom QR Code"}
              </h2>

              {/* QR Code Container */}
              <div
                style={{
                  background: bgColor,
                  padding: "1rem",
                  borderRadius: "16px",
                  border: "1px solid #E8E2D7",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
                  maxWidth: "100%",
                  minHeight: "340px",
                  minWidth: "320px",
                }}
              >
                {isTextEmpty ? (
                  <div style={{ padding: "2rem", color: "#8E887F", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                    <QrIcon size={48} strokeWidth={1.5} color="#D5CEBF" />
                    <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 600 }}>Enter text or a URL on the left</p>
                    <p style={{ margin: 0, fontSize: "0.78rem", color: "#A39C91" }}>Live QR code will appear here instantly</p>
                  </div>
                ) : (
                  <div
                    ref={qrContainerRef}
                    style={{
                      width: "320px",
                      height: "320px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  />
                )}
              </div>

              {/* Scannability and Error Correction Indicator */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", margin: "1rem 0 0.5rem", color: "#81663F", fontSize: "0.8rem", fontWeight: 700 }}>
                <ShieldCheck size={16} />
                <span>
                  Error Correction: Level {errorCorrectionLevel} {hasLogo ? "(High ~30% recovery)" : "(Standard ~15% recovery)"}
                </span>
              </div>

              {/* URL Preview Box */}
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
                  Destination URL:
                </div>
                <div
                  style={{
                    fontSize: "0.78rem",
                    color: "#1E1E1E",
                    wordBreak: "break-all",
                    fontFamily: "monospace",
                    maxHeight: "50px",
                    overflowY: "auto",
                  }}
                >
                  {text.trim() || "(None entered)"}
                </div>
              </div>

              {/* Quick Action Links: Copy & Open */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  disabled={isTextEmpty}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "0.7rem",
                    background: copied ? "#15803d" : "#FAF8F5",
                    border: "1px solid #D5CEBF",
                    color: copied ? "#FFFFFF" : "#1E1E1E",
                    borderRadius: "8px",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    cursor: isTextEmpty ? "not-allowed" : "pointer",
                    opacity: isTextEmpty ? 0.5 : 1,
                  }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? "Copied URL!" : "Copy URL"}</span>
                </button>

                <a
                  href={text.trim() || "#"}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "0.7rem",
                    background: "#FAF8F5",
                    border: "1px solid #D5CEBF",
                    color: "#81663F",
                    borderRadius: "8px",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    textDecoration: "none",
                    pointerEvents: isTextEmpty ? "none" : "auto",
                    opacity: isTextEmpty ? 0.5 : 1,
                  }}
                >
                  <ExternalLink size={14} />
                  <span>Test Link ↗</span>
                </a>
              </div>

              {/* DOWNLOAD BUTTONS (PNG & SVG) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => handleDownload("png")}
                  disabled={isTextEmpty || downloadingFormat === "png"}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "0.85rem",
                    background: "linear-gradient(135deg, #1E1E1E 0%, #333333 100%)",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: 800,
                    fontSize: "0.88rem",
                    cursor: isTextEmpty ? "not-allowed" : "pointer",
                    opacity: isTextEmpty ? 0.5 : 1,
                    boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                  }}
                >
                  <FileImage size={16} />
                  <span>{downloadingFormat === "png" ? "Preparing..." : "Download PNG"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownload("svg")}
                  disabled={isTextEmpty || downloadingFormat === "svg"}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "0.85rem",
                    background: "linear-gradient(135deg, #81663F 0%, #684F2E 100%)",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: 800,
                    fontSize: "0.88rem",
                    cursor: isTextEmpty ? "not-allowed" : "pointer",
                    opacity: isTextEmpty ? 0.5 : 1,
                    boxShadow: "0 4px 14px rgba(129, 102, 63, 0.25)",
                  }}
                >
                  <FileCode size={16} />
                  <span>{downloadingFormat === "svg" ? "Preparing..." : "Download SVG"}</span>
                </button>
              </div>

              {/* Save to Database Button */}
              <button
                type="button"
                onClick={handleSaveToDatabase}
                disabled={isTextEmpty || saving}
                style={{
                  width: "100%",
                  marginTop: "10px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "0.75rem",
                  background: "#FAF8F5",
                  color: "#81663F",
                  border: "1px solid #D4B67D",
                  borderRadius: "10px",
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  cursor: isTextEmpty || saving ? "not-allowed" : "pointer",
                  opacity: isTextEmpty ? 0.5 : 1,
                  transition: "all 0.2s",
                }}
              >
                {saving ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    <span>Saving to records...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={15} />
                    <span>Save QR Code to Records</span>
                  </>
                )}
              </button>

            </div>
          </div>

        </div>

        {/* BOTTOM SECTION: SAVED QR CODES MANAGEMENT */}
        <div style={{ marginTop: "3.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#81663F", margin: 0 }}>
                Saved QR Code Records
              </h2>
              <p style={{ color: "#5E5852", fontSize: "0.88rem", margin: "4px 0 0" }}>
                Re-download, inspect, reload into the generator, or manage previously saved QR codes.
              </p>
            </div>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#81663F", background: "#FAF8F5", padding: "6px 14px", borderRadius: "20px", border: "1px solid #D5CEBF" }}>
              Total Saved: {savedCodes.length}
            </div>
          </div>

          {loadingSaved ? (
            <div style={{ background: "#FFFFFF", padding: "3rem", borderRadius: "14px", textAlign: "center", border: "1px solid #E2DCD2" }}>
              <RefreshCw size={24} className="animate-spin" style={{ margin: "0 auto 10px", color: "#81663F" }} />
              <div style={{ fontSize: "0.9rem", color: "#6A6359", fontWeight: 600 }}>Loading saved QR codes...</div>
            </div>
          ) : savedCodes.length === 0 ? (
            <div style={{ background: "#FFFFFF", padding: "3.5rem 2rem", borderRadius: "14px", textAlign: "center", border: "1px dashed #D5CEBF" }}>
              <FolderOpen size={42} color="#D5CEBF" style={{ margin: "0 auto 12px" }} />
              <h3 style={{ margin: "0 0 6px", fontSize: "1.1rem", fontWeight: 800, color: "#1E1E1E" }}>
                No Saved QR Codes Yet
              </h3>
              <p style={{ color: "#6A6359", fontSize: "0.85rem", maxWidth: "420px", margin: "0 auto" }}>
                Generate a code above and click &quot;Save QR Code to Records&quot; to keep it accessible here for quick re-downloads and team reference.
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
              {savedCodes.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "14px",
                    border: "1px solid #E2DCD2",
                    padding: "1.4rem",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px", marginBottom: "0.8rem" }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#1E1E1E" }}>
                          {item.title || "QR Code"}
                        </h4>
                        <div style={{ fontSize: "0.72rem", color: "#81663F", marginTop: "2px" }}>
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent"}
                        </div>
                      </div>

                      {/* Color dots badge */}
                      <div style={{ display: "flex", gap: "4px", background: "#FAF8F5", padding: "4px 8px", borderRadius: "20px", border: "1px solid #E2DCD2" }}>
                        <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: item.fgColor || "#1E1E1E", border: "1px solid #D5CEBF" }} title="Foreground" />
                        <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: item.bgColor || "#FFFFFF", border: "1px solid #D5CEBF" }} title="Background" />
                      </div>
                    </div>

                    {/* Preview Thumbnail */}
                    {item.imageUrl && (
                      <div
                        style={{
                          background: item.bgColor || "#FFFFFF",
                          padding: "0.8rem",
                          borderRadius: "10px",
                          border: "1px solid #E8E2D7",
                          marginBottom: "0.8rem",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title || "QR Preview"}
                          style={{ width: "140px", height: "140px", objectFit: "contain", borderRadius: "6px" }}
                        />
                      </div>
                    )}

                    {/* Target URL */}
                    <div
                      style={{
                        background: "#FAF8F5",
                        padding: "0.6rem 0.8rem",
                        borderRadius: "8px",
                        border: "1px solid #E8E2D7",
                        fontSize: "0.75rem",
                        fontFamily: "monospace",
                        color: "#3D3730",
                        wordBreak: "break-all",
                        marginBottom: "1rem",
                      }}
                    >
                      {item.url}
                    </div>
                  </div>

                  {/* Actions Grid */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={() => handleLoadSavedIntoEditor(item)}
                        style={{
                          padding: "0.55rem",
                          background: "#FAF8F5",
                          border: "1px solid #D5CEBF",
                          color: "#81663F",
                          borderRadius: "6px",
                          fontWeight: 700,
                          fontSize: "0.78rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4px",
                        }}
                      >
                        <Sliders size={13} />
                        <span>Edit / Load</span>
                      </button>

                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          padding: "0.55rem",
                          background: "#FAF8F5",
                          border: "1px solid #D5CEBF",
                          color: "#1E1E1E",
                          borderRadius: "6px",
                          fontWeight: 700,
                          fontSize: "0.78rem",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4px",
                        }}
                      >
                        <ExternalLink size={13} />
                        <span>Test URL</span>
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteSaved(item.id, item.title || "QR Code")}
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        background: "#FFF5F5",
                        border: "1px solid #FED7D7",
                        color: "#DC2626",
                        borderRadius: "6px",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <Trash2 size={13} />
                      <span>Delete Record</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
