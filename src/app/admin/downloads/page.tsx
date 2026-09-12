"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AdminNav from "@/components/AdminNav";
import { BrandFolderItem, BrandFolderPdf } from "@/lib/types";
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
  QrCode,
  Download,
  Copy,
  X,
  ArrowUp,
  ArrowDown,
  Building2,
  Sparkles,
  AlertCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";

export default function AdminBrandDownloadsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#81663F]">Loading Brand Downloads...</div>}>
      <AdminBrandDownloadsContent />
    </Suspense>
  );
}

function AdminBrandDownloadsContent() {
  const router = useRouter();
  const [brands, setBrands] = useState<BrandFolderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Edit Drawer / Modal State
  const [editingBrand, setEditingBrand] = useState<BrandFolderItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [savingBrand, setSavingBrand] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  // 1-Click QR Code Modal State
  const [qrModal, setQrModal] = useState<{
    isOpen: boolean;
    brand: BrandFolderItem;
    url: string;
  } | null>(null);
  const [copiedQr, setCopiedQr] = useState(false);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  // Hidden File Inputs
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Check auth session
  useEffect(() => {
    const checkAuth = () => {
      const cookies = document.cookie.split("; ");
      const session = cookies.find((row) => row.startsWith("aaren_admin_session="));
      if (!session || !session.includes("authenticated")) {
        router.push("/admin/login");
      }
    };
    checkAuth();
  }, [router]);

  // Fetch Brands
  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/brand-downloads?t=${Date.now()}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setBrands(json.data);
        }
      }
    } catch (e) {
      console.error("Error fetching brand folders:", e);
      showToast("Failed to load brand folders", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // Toast Helper
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // QR Canvas Rendering
  useEffect(() => {
    if (qrModal && qrCanvasRef.current) {
      const matchingBrand = BRAND_LOGOS.find((b) =>
        qrModal.brand.name.toLowerCase().includes(b.name.toLowerCase())
      );
      generateQrWithLogo(qrCanvasRef.current, {
        url: qrModal.url,
        size: 1000,
        color: "#1E1E1E",
        bgColor: "#FFFFFF",
        logoType: matchingBrand ? "brand" : "aaren",
        logoUrl: matchingBrand?.file,
        brandName: qrModal.brand.name,
        logoShape: "rounded",
        badgeBorderColor: "#81663F",
      }).catch((e) => console.error("Failed to render QR:", e));
    }
  }, [qrModal]);

  // Filtered Brands
  const filteredBrands = brands.filter((b) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return b.name.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q);
  });

  const totalPdfs = brands.reduce((acc, b) => acc + (b.files?.length || 0), 0);

  // Edit Brand Handler
  const handleOpenEdit = (brand: BrandFolderItem) => {
    // Deep clone to allow safe cancel
    setEditingBrand(JSON.parse(JSON.stringify(brand)));
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    if (!savingBrand && !uploadingBanner && !uploadingPdf) {
      setEditingBrand(null);
      setIsDrawerOpen(false);
    }
  };

  // Banner Upload
  const handleBannerFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingBrand) return;

    setUploadingBanner(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "banner");
      formData.append("folder", "aaren_brand_banners");

      const res = await fetch("/api/admin/brand-downloads/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setEditingBrand({
          ...editingBrand,
          bannerImageUrl: json.url,
        });
        showToast("Banner image uploaded successfully!");
      } else {
        showToast(json.error || "Failed to upload banner", "error");
      }
    } catch (err: any) {
      console.error("Banner upload error:", err);
      showToast(err.message || "Banner upload failed", "error");
    } finally {
      setUploadingBanner(false);
      if (bannerInputRef.current) bannerInputRef.current.value = "";
    }
  };

  // PDF Upload
  const handlePdfFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingBrand) return;

    setUploadingPdf(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "pdf");
      formData.append("folder", "aaren_brand_catalogs");

      const res = await fetch("/api/admin/brand-downloads/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.success) {
        const cleanTitle = file.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " ");
        const newPdf: BrandFolderPdf = {
          name: cleanTitle,
          url: json.url,
          publicId: json.publicId,
          order: (editingBrand.files?.length || 0) + 1,
          fileSize: json.fileSize || "PDF Document",
        };

        const updatedFiles = [...(editingBrand.files || []), newPdf];
        setEditingBrand({
          ...editingBrand,
          files: updatedFiles,
        });
        showToast(`Added "${cleanTitle}" to catalog collection!`);
      } else {
        showToast(json.error || "Failed to upload PDF", "error");
      }
    } catch (err: any) {
      console.error("PDF upload error:", err);
      showToast(err.message || "PDF upload failed", "error");
    } finally {
      setUploadingPdf(false);
      if (pdfInputRef.current) pdfInputRef.current.value = "";
    }
  };

  // Reorder PDFs
  const handleMovePdf = (index: number, direction: "up" | "down") => {
    if (!editingBrand || !editingBrand.files) return;
    const newFiles = [...editingBrand.files];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newFiles.length) return;

    const temp = newFiles[index];
    newFiles[index] = newFiles[targetIdx];
    newFiles[targetIdx] = temp;

    // Normalize order values
    newFiles.forEach((f, i) => {
      f.order = i + 1;
    });

    setEditingBrand({ ...editingBrand, files: newFiles });
  };

  // Delete PDF from list
  const handleDeletePdf = (index: number) => {
    if (!editingBrand || !editingBrand.files) return;
    const newFiles = editingBrand.files.filter((_, i) => i !== index);
    newFiles.forEach((f, i) => {
      f.order = i + 1;
    });
    setEditingBrand({ ...editingBrand, files: newFiles });
  };

  // Update PDF Title
  const handlePdfTitleChange = (index: number, newTitle: string) => {
    if (!editingBrand || !editingBrand.files) return;
    const newFiles = [...editingBrand.files];
    newFiles[index] = { ...newFiles[index], name: newTitle };
    setEditingBrand({ ...editingBrand, files: newFiles });
  };

  // Save Brand
  const handleSaveBrand = async () => {
    if (!editingBrand) return;
    if (!editingBrand.name.trim()) {
      showToast("Brand name cannot be empty", "error");
      return;
    }
    if (!editingBrand.slug.trim()) {
      showToast("Slug cannot be empty", "error");
      return;
    }

    setSavingBrand(true);
    try {
      const res = await fetch("/api/admin/brand-downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingBrand),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast(`Saved changes for ${editingBrand.name}!`);
        setIsDrawerOpen(false);
        setEditingBrand(null);
        fetchBrands();
      } else {
        showToast(json.error || "Failed to save brand", "error");
      }
    } catch (err: any) {
      console.error("Error saving brand:", err);
      showToast(err.message || "Failed to save brand", "error");
    } finally {
      setSavingBrand(false);
    }
  };

  // Open 1-Click QR Code Modal
  const handleOpenQrModal = (brand: BrandFolderItem) => {
    const siteUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SITE_URL || "https://aarenstudio.vercel.app";
    const fullUrl = `${siteUrl}/downloads/${brand.slug}`;
    setQrModal({
      isOpen: true,
      brand,
      url: fullUrl,
    });
    setCopiedQr(false);
  };

  // Copy QR URL
  const handleCopyUrl = async () => {
    if (!qrModal) return;
    try {
      await navigator.clipboard.writeText(qrModal.url);
      setCopiedQr(true);
      setTimeout(() => setCopiedQr(false), 2000);
      showToast("Public URL copied to clipboard!");
    } catch (e) {
      console.error("Copy error:", e);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F5F0] text-[#1E1E1E]">
      <AdminNav />

      <div className="flex-1 overflow-x-hidden p-6 md:p-10 lg:ml-64">
        {/* Toast Notification */}
        {toast && (
          <div
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all ${
              toast.type === "success"
                ? "bg-[#1E1E1E] text-white border-[#81663F]"
                : "bg-red-900 text-white border-red-700"
            }`}
          >
            {toast.type === "success" ? (
              <Check className="w-4 h-4 text-[#C2A378]" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-300" />
            )}
            <span>{toast.message}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-[#E4DCCE]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#E8DFC8] text-[#81663F]">
                Digital Showroom CMS
              </span>
              <span className="text-xs text-[#8A8275]">Cloudinary-Powered</span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#1E1E1E] mt-1">
              Brand Downloads & QR Showrooms
            </h1>
            <p className="text-sm text-[#6A6359] mt-1">
              Manage the 20 European luxury brands, their hero banners, clean QR landing page URLs, and Cloudinary-hosted PDF catalogs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchBrands}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#D5CEBF] bg-white hover:bg-[#FAF8F5] text-xs font-medium text-[#4A453E] transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
            <Link
              href="/admin/qr-code"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#81663F] hover:bg-[#684F2E] text-white text-xs font-semibold tracking-wide shadow-sm transition-all"
            >
              <QrCode className="w-4 h-4" />
              <span>Full QR Studio</span>
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
          <div className="bg-white p-5 rounded-2xl border border-[#E4DCCE] shadow-sm">
            <div className="text-xs uppercase tracking-wider font-semibold text-[#81663F]">
              Total Brands
            </div>
            <div className="text-3xl font-bold text-[#1E1E1E] mt-1 font-serif">
              {brands.length}
            </div>
            <div className="text-xs text-[#8A8275] mt-1">All 20 verified & seeded</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E4DCCE] shadow-sm">
            <div className="text-xs uppercase tracking-wider font-semibold text-[#81663F]">
              Total PDF Catalogs
            </div>
            <div className="text-3xl font-bold text-[#1E1E1E] mt-1 font-serif">
              {totalPdfs}
            </div>
            <div className="text-xs text-[#8A8275] mt-1">Direct Cloudinary downloads</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E4DCCE] shadow-sm">
            <div className="text-xs uppercase tracking-wider font-semibold text-[#81663F]">
              Landing Page Format
            </div>
            <div className="text-sm font-semibold text-[#1E1E1E] mt-2 font-mono truncate">
              /downloads/[clean-slug]
            </div>
            <div className="text-xs text-[#8A8275] mt-1">QRCodeChimp luxury layout</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#8A8275] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search brands or clean slugs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D5CEBF] bg-white text-sm focus:outline-none focus:border-[#81663F] focus:ring-1 focus:ring-[#81663F] text-[#1E1E1E]"
            />
          </div>
          <span className="text-xs text-[#8A8275]">
            Showing {filteredBrands.length} of {brands.length} brands
          </span>
        </div>

        {/* Brand Grid */}
        {loading ? (
          <div className="py-20 text-center text-[#81663F] flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-[#81663F]" />
            <span className="text-sm font-medium">Loading Brand Folders...</span>
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E4DCCE] p-12 text-center space-y-2">
            <Building2 className="w-10 h-10 text-[#B89C74] mx-auto stroke-[1.5]" />
            <h3 className="font-semibold text-lg text-[#1E1E1E]">No brands found</h3>
            <p className="text-xs text-[#8A8275]">Try refining your search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredBrands.map((brand, idx) => {
              const count = brand.files?.length || 0;
              return (
                <div
                  key={brand.id}
                  className="bg-white rounded-2xl border border-[#E4DCCE] hover:border-[#B89C74] transition-all shadow-sm hover:shadow-md overflow-hidden flex flex-col justify-between"
                >
                  {/* Top Thumbnail & Badge */}
                  <div>
                    <div className="relative w-full aspect-[16/7] bg-[#EAE4D9] overflow-hidden">
                      {brand.bannerImageUrl ? (
                        <Image
                          src={brand.bannerImageUrl}
                          alt={brand.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#F3EDE3]">
                          <Building2 className="w-8 h-8 text-[#B89C74] stroke-[1.5]" />
                        </div>
                      )}
                      <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-black/70 text-white backdrop-blur-sm">
                        #{idx + 1}
                      </div>
                    </div>

                    {/* Brand Info */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-serif text-xl font-bold text-[#1E1E1E]">
                            {brand.name}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-1 font-mono text-xs text-[#81663F]">
                            <span>/downloads/{brand.slug}</span>
                          </div>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            count > 0
                              ? "bg-[#EAF3EA] text-[#2E6A38] border border-[#D0E6D2]"
                              : "bg-[#F7EFE2] text-[#81663F] border border-[#EADAC5]"
                          }`}
                        >
                          {count} {count === 1 ? "PDF" : "PDFs"}
                        </span>
                      </div>

                      {brand.description && (
                        <p className="text-xs text-[#6A6359] mt-3 line-clamp-2 leading-relaxed">
                          {brand.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="px-5 py-3.5 bg-[#FAF8F5] border-t border-[#EAE4D9] flex items-center justify-between gap-2">
                    <Link
                      href={`/downloads/${brand.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#81663F] hover:text-[#584325] transition-colors"
                      title="Preview public digital showroom"
                    >
                      <span>Showroom</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenQrModal(brand)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D5CEBF] bg-white hover:bg-[#FAF8F5] text-xs font-medium text-[#4A453E] transition-colors"
                        title="Generate QR code for this brand"
                      >
                        <QrCode className="w-3.5 h-3.5 text-[#81663F]" />
                        <span>QR</span>
                      </button>

                      <button
                        onClick={() => handleOpenEdit(brand)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#81663F] hover:bg-[#684F2E] text-white text-xs font-semibold shadow-sm transition-all"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            BRAND EDIT MODAL / DRAWER
           ══════════════════════════════════════════════════════════ */}
        {isDrawerOpen && editingBrand && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl border border-[#D5CEBF] flex flex-col overflow-hidden">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-[#E4DCCE] flex items-center justify-between bg-[#FAF8F5]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#81663F]" />
                  <h2 className="font-serif text-xl font-bold text-[#1E1E1E]">
                    Edit Brand: {editingBrand.name}
                  </h2>
                </div>
                <button
                  onClick={handleCloseDrawer}
                  className="w-8 h-8 rounded-full hover:bg-[#EAE4D9] flex items-center justify-center text-[#6A6359] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                {/* Brand Name & Slug */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A6359] mb-1.5">
                      Brand Name *
                    </label>
                    <input
                      type="text"
                      value={editingBrand.name}
                      onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#D5CEBF] bg-[#FAF8F5] text-sm focus:outline-none focus:border-[#81663F] text-[#1E1E1E] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A6359] mb-1.5">
                      Clean Slug *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#8A8275] font-mono">
                        /downloads/
                      </span>
                      <input
                        type="text"
                        value={editingBrand.slug}
                        onChange={(e) =>
                          setEditingBrand({
                            ...editingBrand,
                            slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                          })
                        }
                        className="w-full pl-24 pr-3.5 py-2 rounded-xl border border-[#D5CEBF] bg-[#FAF8F5] text-sm font-mono text-[#81663F] font-semibold focus:outline-none focus:border-[#81663F]"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A6359] mb-1.5">
                    Brand Editorial Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingBrand.description || ""}
                    onChange={(e) =>
                      setEditingBrand({ ...editingBrand, description: e.target.value })
                    }
                    placeholder="Describe the brand's architectural focus, materials, and European craftsmanship..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D5CEBF] bg-[#FAF8F5] text-sm focus:outline-none focus:border-[#81663F] text-[#1E1E1E]"
                  />
                </div>

                {/* Banner Image */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6A6359] mb-1.5">
                    Hero Banner Image (Cloudinary Hosted)
                  </label>
                  <div className="relative w-full aspect-[16/7] rounded-xl border border-[#D5CEBF] overflow-hidden bg-[#F3EDE3]">
                    {editingBrand.bannerImageUrl ? (
                      <Image
                        src={editingBrand.bannerImageUrl}
                        alt="Banner Preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[#8A8275]">
                        <Building2 className="w-8 h-8 mb-1 stroke-[1.5]" />
                        <span className="text-xs">No banner image uploaded</span>
                      </div>
                    )}

                    {uploadingBanner && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white text-xs font-medium gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-[#C2A378]" />
                        <span>Uploading banner to Cloudinary...</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-2.5">
                    <input
                      ref={bannerInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/webp, image/svg+xml"
                      onChange={handleBannerFileSelected}
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={uploadingBanner}
                      onClick={() => bannerInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#D5CEBF] bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-[#4A453E] transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#81663F]" />
                      <span>{editingBrand.bannerImageUrl ? "Replace Banner" : "Upload Banner"}</span>
                    </button>

                    {editingBrand.bannerImageUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          setEditingBrand({ ...editingBrand, bannerImageUrl: undefined })
                        }
                        className="text-xs text-red-600 hover:text-red-700 font-medium"
                      >
                        Remove Banner
                      </button>
                    )}
                  </div>
                </div>

                {/* PDF Catalogs Management */}
                <div className="pt-2 border-t border-[#E4DCCE]">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-serif text-lg font-semibold text-[#1E1E1E]">
                        PDF Catalogs & Specifications
                      </h4>
                      <p className="text-xs text-[#8A8275]">
                        Uploaded files are served directly from Cloudinary.
                      </p>
                    </div>

                    <div>
                      <input
                        ref={pdfInputRef}
                        type="file"
                        accept="application/pdf"
                        onChange={handlePdfFileSelected}
                        className="hidden"
                      />
                      <button
                        type="button"
                        disabled={uploadingPdf}
                        onClick={() => pdfInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#81663F] hover:bg-[#684F2E] text-white text-xs font-semibold shadow-sm transition-all"
                      >
                        {uploadingPdf ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading PDF...</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add PDF Catalog</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* PDFs List */}
                  {(!editingBrand.files || editingBrand.files.length === 0) ? (
                    <div className="p-6 rounded-2xl border border-dashed border-[#D5CEBF] bg-[#FAF8F5] text-center space-y-1">
                      <FileText className="w-8 h-8 text-[#B89C74] mx-auto stroke-[1.5]" />
                      <div className="text-xs font-semibold text-[#1E1E1E]">No PDFs yet</div>
                      <p className="text-[11px] text-[#8A8275]">
                        Click "Add PDF Catalog" to upload a PDF from your computer directly to Cloudinary.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {editingBrand.files.map((file, fIdx) => (
                        <div
                          key={`${file.url}-${fIdx}`}
                          className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E4DCCE] flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#81663F] shrink-0">
                            #{fIdx + 1}
                          </div>

                          <div className="flex-1 min-w-0">
                            <input
                              type="text"
                              value={file.name}
                              onChange={(e) => handlePdfTitleChange(fIdx, e.target.value)}
                              className="w-full px-2.5 py-1 rounded-lg border border-[#D5CEBF] bg-white text-xs font-medium text-[#1E1E1E] focus:outline-none focus:border-[#81663F]"
                              placeholder="PDF Title"
                            />
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-[#8A8275]">
                              <span>{file.fileSize || "PDF"}</span>
                              <span>•</span>
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#81663F] hover:underline flex items-center gap-0.5 truncate max-w-[240px]"
                              >
                                <span>Preview file</span>
                                <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                              </a>
                            </div>
                          </div>

                          {/* Reorder and Delete Actions */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              disabled={fIdx === 0}
                              onClick={() => handleMovePdf(fIdx, "up")}
                              className="p-1.5 rounded-lg border border-[#D5CEBF] bg-white hover:bg-[#FAF8F5] disabled:opacity-30 text-[#4A453E]"
                              title="Move up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={fIdx === (editingBrand.files?.length || 0) - 1}
                              onClick={() => handleMovePdf(fIdx, "down")}
                              className="p-1.5 rounded-lg border border-[#D5CEBF] bg-white hover:bg-[#FAF8F5] disabled:opacity-30 text-[#4A453E]"
                              title="Move down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePdf(fIdx)}
                              className="p-1.5 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-red-600 ml-1"
                              title="Delete PDF"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-[#E4DCCE] bg-[#FAF8F5] flex items-center justify-between">
                <Link
                  href={`/downloads/${editingBrand.slug}`}
                  target="_blank"
                  className="text-xs font-semibold text-[#81663F] hover:underline inline-flex items-center gap-1"
                >
                  <span>Test Public Link</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={savingBrand}
                    onClick={handleCloseDrawer}
                    className="px-4 py-2 rounded-xl border border-[#D5CEBF] bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-[#4A453E]"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={savingBrand}
                    onClick={handleSaveBrand}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#81663F] hover:bg-[#684F2E] text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    {savingBrand ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            1-CLICK QR CODE MODAL
           ══════════════════════════════════════════════════════════ */}
        {qrModal && qrModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-[#D5CEBF] p-6 text-center space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#F0EAE1] text-[#81663F]">
                  Branded QR Code
                </span>
                <button
                  onClick={() => setQrModal(null)}
                  className="w-8 h-8 rounded-full hover:bg-[#FAF8F5] flex items-center justify-center text-[#6A6359]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-[#1E1E1E]">
                  {qrModal.brand.name}
                </h3>
                <p className="text-xs text-[#8A8275] mt-0.5">
                  Scan to open the luxury digital showroom
                </p>
              </div>

              {/* QR Canvas */}
              <div className="p-4 bg-white rounded-2xl border border-[#EAE4D9] shadow-inner inline-block mx-auto">
                <canvas
                  ref={qrCanvasRef}
                  className="w-56 h-56 max-w-full rounded-xl"
                  style={{ width: "224px", height: "224px" }}
                />
              </div>

              {/* Target URL */}
              <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E4DCCE] flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-[#81663F] truncate flex-1 text-left">
                  {qrModal.url}
                </span>
                <button
                  onClick={handleCopyUrl}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#D5CEBF] hover:bg-[#FAF8F5] text-xs font-medium text-[#4A453E] shrink-0"
                >
                  {copiedQr ? (
                    <>
                      <Check className="w-3 h-3 text-green-600" />
                      <span className="text-green-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    if (qrCanvasRef.current) {
                      downloadQrCanvas(
                        qrCanvasRef.current,
                        `Aaren_Studio_${qrModal.brand.slug}_QR.png`
                      );
                      showToast("Downloaded high-res PNG!");
                    }
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#81663F] hover:bg-[#684F2E] text-white text-xs font-semibold shadow-sm transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
                </button>

                <Link
                  href={`/admin/qr-code?url=${encodeURIComponent(qrModal.url)}&brand=${encodeURIComponent(
                    qrModal.brand.name
                  )}`}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#D5CEBF] bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-[#4A453E] transition-all"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#81663F]" />
                  <span>Full QR Studio</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
