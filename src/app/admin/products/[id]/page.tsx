"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AdminNav from "@/components/AdminNav";
import { ProductItem } from "@/lib/types";
import { uploadFileWithCompression } from "@/lib/uploadHelper";
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
  DollarSign,
  Maximize2,
  Image as ImageIcon,
  Tag,
  Palette,
  CheckCircle,
  FileText,
} from "lucide-react";

const PREDEFINED_BRANDS = [
  "Newtech Wood",
  "Slashform",
  "Waltz by JB Glass",
  "Formica",
  "Mirage",
  "Falper",
  "Fima",
  "Mafi",
  "WOW",
  "Agape",
  "Bodaq",
  "Inclass",
];

const PREDEFINED_CATEGORIES = [
  "Decking",
  "Cladding",
  "Screening",
  "Fencing",
  "Furniture",
  "Lighting",
  "Accessories",
  "Flooring",
  "Bathroom",
  "Kitchen",
  "Tiles",
  "Surfaces",
  "Doors",
  "Windows",
  "Other",
];

const PREDEFINED_PRICE_UNITS = [
  "per SQM",
  "per SLAB",
  "per piece",
  "per SQFT",
  "per METRE",
  "per Box",
  "per Set",
];

type Props = { params: Promise<{ id: string }> };

export default function AdminIndividualProductPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [uploadingHero, setUploadingHero] = useState<boolean>(false);
  const [uploadingGallery, setUploadingGallery] = useState<boolean>(false);
  const [uploadingPdf, setUploadingPdf] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"general" | "specs" | "pricing" | "media" | "swatches" | "description">("general");

  // Form State for every product detail
  const [formData, setFormData] = useState<ProductItem>({
    id: id,
    name: "",
    brand: "Newtech Wood",
    category: "Decking",
    subcategory: "",
    shortCode: "",
    sku: "",
    width: "",
    height: "",
    depth: "",
    thickness: "",
    measurementType: "mm",
    finish: "",
    material: "",
    origin: "Italy",
    leadTime: "2 - 3 Weeks",
    warranty: "",
    features: [],
    applicationAreas: [],
    description: "",
    tags: [],
    imageUrl: "",
    galleryImages: [],
    catalogPdfUrl: "",
    qtyInStock: 50,
    price: undefined,
    priceUnit: "per SQM",
    finishOptions: [],
  });

  // Helper inputs
  const [tagInput, setTagInput] = useState<string>("");
  const [featureInput, setFeatureInput] = useState<string>("");
  const [newGalleryUrl, setNewGalleryUrl] = useState<string>("");
  const [collectionsList, setCollectionsList] = useState<any[]>([]);

  useEffect(() => {
    fetchProduct();
    fetch("/api/collections?t=" + Date.now())
      .then((r) => r.json())
      .then((json) => {
        if (json && json.success && Array.isArray(json.data)) {
          setCollectionsList(json.data);
        }
      })
      .catch(() => {});
  }, [id]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?id=${encodeURIComponent(id)}&t=${Date.now()}`, { cache: "no-store" });
      const json = await res.json();
      if (json && json.success && json.data) {
        const p = json.data;
        setFormData({
          id: p.id || id,
          name: p.name || "",
          brand: p.brand || "Newtech Wood",
          category: p.category || "Decking",
          subcategory: p.subcategory || (p as any).collection || "",
          shortCode: p.shortCode || "",
          sku: p.sku || "",
          width: p.width || "",
          height: p.height || "",
          depth: p.depth || "",
          thickness: p.thickness || "",
          measurementType: p.measurementType || "mm",
          finish: p.finish || "",
          material: p.material || "",
          origin: p.origin || "Italy",
          leadTime: p.leadTime || "2 - 3 Weeks",
          warranty: p.warranty || "",
          features: Array.isArray(p.features) ? p.features : [],
          applicationAreas: Array.isArray(p.applicationAreas) ? p.applicationAreas : [],
          description: p.description || "",
          tags: Array.isArray(p.tags) ? p.tags : [],
          imageUrl: p.imageUrl || "",
          galleryImages: Array.isArray(p.galleryImages) ? p.galleryImages : [],
          catalogPdfUrl: p.catalogPdfUrl || "",
          qtyInStock: p.qtyInStock ?? 50,
          price: p.price !== undefined ? p.price : undefined,
          priceUnit: p.priceUnit || (p as any).price_unit || "per SQM",
          finishOptions: Array.isArray(p.finishOptions) ? p.finishOptions : [],
        });
      } else {
        // Create new skeleton product with this ID
        setFormData((prev) => ({
          ...prev,
          id: id,
          name: id.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        }));
      }
    } catch (err) {
      console.error("Error loading product:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Product name is required.");
      return;
    }
    if (formData.price !== undefined && (isNaN(Number(formData.price)) || Number(formData.price) < 0)) {
      showToast("Price cannot be negative.");
      return;
    }
    if (formData.qtyInStock !== undefined && (isNaN(Number(formData.qtyInStock)) || Number(formData.qtyInStock) < 0)) {
      showToast("Quantity cannot be negative.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        showToast("✓ Product details saved successfully!");
      } else {
        showToast("Error saving: " + (json.error || "Unknown error"));
      }
    } catch (err: any) {
      showToast("Failed to save product: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to permanently delete "${formData.name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) {
        alert("Delete failed: HTTP " + res.status);
        return;
      }
      const json = await res.json();
      if (json.success) {
        alert("Product deleted successfully.");
        router.push("/admin/products");
      } else {
        alert("Delete failed: " + (json.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  // Hero Image Upload
  const handleHeroImageUpload = async (file: File) => {
    if (!file) return;
    setUploadingHero(true);
    try {
      const uploadRes = await uploadFileWithCompression(file, "Products");
      if (uploadRes.success && (uploadRes.url || uploadRes.dataUrl)) {
        const finalUrl = uploadRes.url || uploadRes.dataUrl || "";
        setFormData((prev) => ({ ...prev, imageUrl: finalUrl }));
        showToast("Primary product photo uploaded!");
      } else {
        alert("Upload error: " + (uploadRes.error || "Could not upload image"));
      }
    } catch (e: any) {
      alert("Upload failed: " + e.message);
    } finally {
      setUploadingHero(false);
    }
  };

  // Gallery Image Upload
  const handleGalleryUpload = async (file: File) => {
    if (!file) return;
    setUploadingGallery(true);
    try {
      const uploadRes = await uploadFileWithCompression(file, "Products/Gallery");
      if (uploadRes.success && (uploadRes.url || uploadRes.dataUrl)) {
        const finalUrl = uploadRes.url || uploadRes.dataUrl || "";
        setFormData((prev) => ({
          ...prev,
          galleryImages: [...(prev.galleryImages || []), finalUrl],
        }));
        showToast("Added image to product gallery!");
      } else {
        alert("Upload error: " + (uploadRes.error || "Could not upload image"));
      }
    } catch (e: any) {
      alert("Upload failed: " + e.message);
    } finally {
      setUploadingGallery(false);
    }
  };

  // PDF Spec Sheet Upload
  const handlePdfUpload = async (file: File) => {
    if (!file) return;
    setUploadingPdf(true);
    try {
      const uploadRes = await uploadFileWithCompression(file, "Catalogues");
      if (uploadRes.success && (uploadRes.url || uploadRes.dataUrl)) {
        const finalUrl = uploadRes.url || uploadRes.dataUrl || "";
        setFormData((prev) => ({ ...prev, catalogPdfUrl: finalUrl }));
        showToast("PDF Specification sheet uploaded!");
      } else {
        alert("PDF Upload error: " + (uploadRes.error || "Could not upload file"));
      }
    } catch (e: any) {
      alert("PDF Upload failed: " + e.message);
    } finally {
      setUploadingPdf(false);
    }
  };

  // Swatch Manager Helpers
  const addFinishSwatch = () => {
    const defaultSwatch = { name: "New Finish", hex: "#8c764b" };
    setFormData((prev) => ({
      ...prev,
      finishOptions: [...(prev.finishOptions || []), defaultSwatch],
    }));
  };

  const updateFinishSwatch = (index: number, field: "name" | "hex" | "image", value: string) => {
    setFormData((prev) => {
      const updated = [...(prev.finishOptions || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, finishOptions: updated };
    });
  };

  const removeFinishSwatch = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      finishOptions: (prev.finishOptions || []).filter((_, i) => i !== index),
    }));
  };

  // Tag helper
  const addTag = () => {
    if (!tagInput.trim()) return;
    if (!formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({ ...prev, tags: [...(prev.tags || []), tagInput.trim()] }));
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((t) => t !== tagToRemove),
    }));
  };

  // Feature helper
  const addFeature = () => {
    if (!featureInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      features: [...(prev.features || []), featureInput.trim()],
    }));
    setFeatureInput("");
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="admin-page-container font-['Jost',sans-serif]">
        <AdminNav />
        <main className="admin-main-content admin-main" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh" }}>
          <div style={{ textAlign: "center", color: "#8c764b" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📦</div>
            <div style={{ fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>Loading Product Details...</div>
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
            <Link href="/admin/products" className="back-link">
              <ArrowLeft size={16} />
              <span>Back to Product Catalog</span>
            </Link>
            <div className="title-row">
              <h1 className="editor-title">{formData.name || "Untitled Product"}</h1>
              <span className="id-pill">ID: {formData.id}</span>
              {formData.shortCode && <span className="code-badge">{formData.shortCode}</span>}
            </div>
          </div>

          <div className="action-buttons">
            <Link href={`/products/${formData.id}`} target="_blank" className="btn-secondary">
              <ExternalLink size={15} />
              <span>View Live on Website</span>
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
          {/* LEFT 68%: TABBED FORM SECTIONS */}
          <div className="form-column">
            {/* Tabs Bar */}
            <div className="nav-tabs">
              <button
                className={`tab-item ${activeTab === "general" ? "active" : ""}`}
                onClick={() => setActiveTab("general")}
              >
                <Layers size={15} />
                <span>General Info</span>
              </button>
              <button
                className={`tab-item ${activeTab === "specs" ? "active" : ""}`}
                onClick={() => setActiveTab("specs")}
              >
                <Maximize2 size={15} />
                <span>Specs & Dimensions</span>
              </button>
              <button
                className={`tab-item ${activeTab === "pricing" ? "active" : ""}`}
                onClick={() => setActiveTab("pricing")}
              >
                <DollarSign size={15} />
                <span>Pricing & Stock</span>
              </button>
              <button
                className={`tab-item ${activeTab === "media" ? "active" : ""}`}
                onClick={() => setActiveTab("media")}
              >
                <ImageIcon size={15} />
                <span>Visual Media & Gallery</span>
              </button>
              <button
                className={`tab-item ${activeTab === "swatches" ? "active" : ""}`}
                onClick={() => setActiveTab("swatches")}
              >
                <Palette size={15} />
                <span>Finishes & Swatches</span>
              </button>
              <button
                className={`tab-item ${activeTab === "description" ? "active" : ""}`}
                onClick={() => setActiveTab("description")}
              >
                <Tag size={15} />
                <span>Description & Tags</span>
              </button>
            </div>

            {/* TAB 1: GENERAL INFO */}
            {activeTab === "general" && (
              <div className="section-card">
                <h3 className="section-title">General Product Information</h3>
                <p className="section-sub">Define core naming, brand affiliation, and architectural classification.</p>

                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Product Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. UltraShield Naturale Decking Planks"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Brand Affiliation *</label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <select
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        style={{ flex: 1 }}
                      >
                        {PREDEFINED_BRANDS.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Or custom brand"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Architectural Category *</label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        style={{ flex: 1 }}
                      >
                        {PREDEFINED_CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Or custom category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <label style={{ margin: 0 }}>Collection / Brand Group</label>
                      <Link
                        href="/admin/collections"
                        target="_blank"
                        style={{ fontSize: "11px", color: "#81663F", fontWeight: 700, textDecoration: "underline" }}
                      >
                        Manage Brand Collections ↗
                      </Link>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <select
                        value={formData.subcategory || ""}
                        onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                        style={{ flex: 1 }}
                      >
                        <option value="">-- Select Collection --</option>
                        {collectionsList
                          .filter((c) => {
                            const norm = (s: string) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
                            const pBrand = norm(formData.brand);
                            return norm(c.brandId) === pBrand || norm(c.brandName || "") === pBrand || norm(c.brandId) === "general";
                          })
                          .map((c) => (
                            <option key={c.id} value={c.name}>
                              {c.name} ({c.brandName || c.brandId})
                            </option>
                          ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Or custom collection..."
                        value={formData.subcategory || ""}
                        onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Short Code (Specification Pill)</label>
                    <input
                      type="text"
                      placeholder="e.g. NW 10, SF 01, PR 25"
                      value={formData.shortCode || ""}
                      onChange={(e) => setFormData({ ...formData, shortCode: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Internal SKU / Model Code</label>
                    <input
                      type="text"
                      placeholder="e.g. NTW-DEC-140-IP"
                      value={formData.sku || ""}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Catalog Display Sequence</label>
                    <input
                      type="number"
                      placeholder="e.g. 1"
                      value={formData.slNo || ""}
                      onChange={(e) => setFormData({ ...formData, slNo: e.target.value ? parseInt(e.target.value, 10) : undefined })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SPECS & DIMENSIONS */}
            {activeTab === "specs" && (
              <div className="section-card">
                <h3 className="section-title">Technical Specifications & Dimensions</h3>
                <p className="section-sub">Define exact physical dimensions, material science, and origin details.</p>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Width</label>
                    <input
                      type="text"
                      placeholder="e.g. 140mm or 14cm"
                      value={formData.width || ""}
                      onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Height / Thickness</label>
                    <input
                      type="text"
                      placeholder="e.g. 22.5mm"
                      value={formData.height || ""}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Depth / Length</label>
                    <input
                      type="text"
                      placeholder="e.g. 2900mm or 2.9m"
                      value={formData.depth || ""}
                      onChange={(e) => setFormData({ ...formData, depth: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Thickness Profile</label>
                    <input
                      type="text"
                      placeholder="e.g. 22.5mm Capped Profile"
                      value={formData.thickness || ""}
                      onChange={(e) => setFormData({ ...formData, thickness: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Measurement Units</label>
                    <select
                      value={formData.measurementType || "mm"}
                      onChange={(e) => setFormData({ ...formData, measurementType: e.target.value })}
                    >
                      <option value="mm">Millimeters (mm)</option>
                      <option value="cm">Centimeters (cm)</option>
                      <option value="m">Meters (m)</option>
                      <option value="inches">Inches (in)</option>
                      <option value="ft">Feet (ft)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Surface Finish / Texture</label>
                    <input
                      type="text"
                      placeholder="e.g. Antique Ipe Wood Grain, Matte Powdercoat"
                      value={formData.finish || ""}
                      onChange={(e) => setFormData({ ...formData, finish: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Material Composition</label>
                    <input
                      type="text"
                      placeholder="e.g. 95% Recycled High-Density WPC Composite"
                      value={formData.material || ""}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Country of Origin</label>
                    <input
                      type="text"
                      placeholder="e.g. Italy, Germany, India, USA"
                      value={formData.origin || ""}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Lead Time / Dispatch</label>
                    <input
                      type="text"
                      placeholder="e.g. 2 - 3 Weeks, In Stock (24h)"
                      value={formData.leadTime || ""}
                      onChange={(e) => setFormData({ ...formData, leadTime: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Commercial Warranty</label>
                    <input
                      type="text"
                      placeholder="e.g. 25-Year Limited Residential / Commercial"
                      value={formData.warranty || ""}
                      onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PRICING & STOCK */}
            {activeTab === "pricing" && (
              <div className="section-card">
                <h3 className="section-title">Commercial Pricing & Inventory</h3>
                <p className="section-sub">Configure unit pricing, commercial quotation terms, and warehouse quantities.</p>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Unit Price (INR ₹)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 6400 (Leave blank for 'Quote on Request')"
                      value={formData.price !== undefined ? formData.price : ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: e.target.value ? parseFloat(e.target.value) : undefined,
                        })
                      }
                    />
                    <small style={{ color: "#666", fontSize: "11px", marginTop: "4px" }}>
                      Leave blank or 0 to show official &quot;Request Commercial Quote&quot; button.
                    </small>
                  </div>

                  <div className="form-group">
                    <label>Price Unit</label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <select
                        value={formData.priceUnit || "per SQM"}
                        onChange={(e) => setFormData({ ...formData, priceUnit: e.target.value })}
                        style={{ flex: 1 }}
                      >
                        {PREDEFINED_PRICE_UNITS.map((u) => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Or custom unit"
                        value={formData.priceUnit || ""}
                        onChange={(e) => setFormData({ ...formData, priceUnit: e.target.value })}
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Warehouse In-Stock Quantity</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 50"
                      value={formData.qtyInStock ?? 50}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          qtyInStock: e.target.value ? parseInt(e.target.value, 10) : 0,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Stock Availability Status</label>
                    <div className="status-badge-preview">
                      <span className="dot" style={{ background: (formData.qtyInStock ?? 0) > 0 ? "#16a34a" : "#dc2626" }} />
                      <span style={{ fontWeight: 600 }}>
                        {(formData.qtyInStock ?? 0) > 0 ? `In Stock (${formData.qtyInStock} units ready)` : "Made to Order / Lead Time applies"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: VISUAL MEDIA & GALLERY */}
            {activeTab === "media" && (
              <div className="section-card">
                <h3 className="section-title">Visual Media, High-Res Photos & Catalog PDF</h3>
                <p className="section-sub">Upload primary feature photos, multi-angle gallery photos, and technical PDF specification downloads.</p>

                {/* Primary Feature Image */}
                <div className="media-block">
                  <label className="block-label">Primary Hero Feature Image *</label>
                  <div className="hero-upload-wrap">
                    <div
                      className="hero-preview-box"
                      style={{
                        backgroundImage: formData.imageUrl ? `url(${formData.imageUrl})` : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {!formData.imageUrl && <span style={{ color: "#999", fontSize: "12px" }}>No Hero Image</span>}
                    </div>
                    <div className="upload-controls">
                      <input
                        type="text"
                        placeholder="https://... direct image URL"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        style={{ width: "100%", marginBottom: "8px" }}
                      />
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <input
                          type="file"
                          accept="image/*"
                          id="heroImgFile"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) handleHeroImageUpload(e.target.files[0]);
                          }}
                        />
                        <label htmlFor="heroImgFile" className="btn-upload">
                          <Upload size={14} />
                          <span>{uploadingHero ? "Uploading..." : "Upload from Computer"}</span>
                        </label>
                        {formData.imageUrl && (
                          <button
                            type="button"
                            className="btn-outline-danger"
                            onClick={() => setFormData({ ...formData, imageUrl: "" })}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="divider" />

                {/* Gallery Images List */}
                <div className="media-block">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <div>
                      <label className="block-label" style={{ margin: 0 }}>Additional High-Res Gallery Photos ({formData.galleryImages?.length || 0})</label>
                      <span style={{ fontSize: "12px", color: "#666" }}>Displayed in product slideshow and zoomable lightbox.</span>
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        id="galleryImgFile"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) handleGalleryUpload(e.target.files[0]);
                        }}
                      />
                      <label htmlFor="galleryImgFile" className="btn-upload">
                        <Upload size={14} />
                        <span>{uploadingGallery ? "Uploading..." : "Upload New Gallery Photo"}</span>
                      </label>
                    </div>
                  </div>

                  {/* Add URL input */}
                  <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                    <input
                      type="text"
                      placeholder="Or paste direct image URL and click Add"
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      className="btn-add-item"
                      onClick={() => {
                        if (newGalleryUrl.trim()) {
                          setFormData((prev) => ({
                            ...prev,
                            galleryImages: [...(prev.galleryImages || []), newGalleryUrl.trim()],
                          }));
                          setNewGalleryUrl("");
                        }
                      }}
                    >
                      <Plus size={14} /> Add URL
                    </button>
                  </div>

                  {/* Gallery Thumbnails Grid */}
                  <div className="gallery-grid">
                    {(formData.galleryImages || []).length === 0 ? (
                      <div className="empty-notice">No additional gallery photos added yet.</div>
                    ) : (
                      formData.galleryImages?.map((img, idx) => (
                        <div key={idx} className="gallery-card">
                          <div
                            className="gallery-thumb"
                            style={{ backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center" }}
                          />
                          <div className="gallery-footer">
                            <span className="img-num">Photo #{idx + 1}</span>
                            <button
                              type="button"
                              className="btn-trash"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  galleryImages: (prev.galleryImages || []).filter((_, i) => i !== idx),
                                }));
                              }}
                              title="Delete Photo"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <hr className="divider" />

                {/* Catalog PDF */}
                <div className="media-block">
                  <label className="block-label">Official Specification PDF / Technical Sheet</label>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
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
                      id="pdfUploadInput"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) handlePdfUpload(e.target.files[0]);
                      }}
                    />
                    <label htmlFor="pdfUploadInput" className="btn-upload">
                      <Upload size={14} />
                      <span>{uploadingPdf ? "Uploading PDF..." : "Upload PDF"}</span>
                    </label>
                    {formData.catalogPdfUrl && (
                      <a href={formData.catalogPdfUrl} target="_blank" rel="noreferrer" className="btn-secondary">
                        <FileText size={14} /> View PDF
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: FINISHES & SWATCHES */}
            {activeTab === "swatches" && (
              <div className="section-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <div>
                    <h3 className="section-title" style={{ margin: 0 }}>Available Finishes & Color Swatches</h3>
                    <p className="section-sub">Enable interactive finish switching and color variants for clients.</p>
                  </div>
                  <button type="button" onClick={addFinishSwatch} className="btn-add-item">
                    <Plus size={14} /> Add New Swatch
                  </button>
                </div>

                <div className="swatches-table">
                  {(formData.finishOptions || []).length === 0 ? (
                    <div className="empty-notice">
                      No swatches configured. Click &quot;Add New Swatch&quot; to provide color / texture choices.
                    </div>
                  ) : (
                    formData.finishOptions?.map((swatch, idx) => (
                      <div key={idx} className="swatch-row">
                        <div className="swatch-color-picker-wrap">
                          <input
                            type="color"
                            value={swatch.hex || "#8c764b"}
                            onChange={(e) => updateFinishSwatch(idx, "hex", e.target.value)}
                            className="color-input"
                          />
                          <span className="hex-text">{swatch.hex || "#8c764b"}</span>
                        </div>

                        <div style={{ flex: 1 }}>
                          <input
                            type="text"
                            placeholder="Finish Name (e.g. Antique Ipe, Matte Charcoal)"
                            value={swatch.name}
                            onChange={(e) => updateFinishSwatch(idx, "name", e.target.value)}
                            style={{ width: "100%" }}
                          />
                        </div>

                        <div style={{ flex: 1 }}>
                          <input
                            type="text"
                            placeholder="Optional Texture Photo URL"
                            value={swatch.image || ""}
                            onChange={(e) => updateFinishSwatch(idx, "image", e.target.value)}
                            style={{ width: "100%" }}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFinishSwatch(idx)}
                          className="btn-trash"
                          title="Remove Swatch"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 6: DESCRIPTION & TAGS */}
            {activeTab === "description" && (
              <div className="section-card">
                <h3 className="section-title">Architectural Description & Filter Tags</h3>
                <p className="section-sub">Describe key features, engineering highlights, and catalog search keywords.</p>

                <div className="form-group full-width" style={{ marginBottom: "20px" }}>
                  <label>Full Product Description</label>
                  <textarea
                    rows={6}
                    placeholder="Enter comprehensive architectural copy, structural qualities, finishes, and applications..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="form-group full-width" style={{ marginBottom: "24px" }}>
                  <label>Key Architectural Highlights / Features</label>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                    <input
                      type="text"
                      placeholder="e.g. 360-degree Co-Extruded PolyShield Coating"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFeature(); } }}
                      style={{ flex: 1 }}
                    />
                    <button type="button" onClick={addFeature} className="btn-add-item">
                      <Plus size={14} /> Add Feature
                    </button>
                  </div>
                  <div className="chips-wrap">
                    {formData.features?.map((feat, idx) => (
                      <span key={idx} className="chip">
                        <CheckCircle size={12} color="#16a34a" />
                        <span>{feat}</span>
                        <button type="button" onClick={() => removeFeature(idx)}>✕</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Search & Filter Tags</label>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                    <input
                      type="text"
                      placeholder="e.g. Decking, Exterior, Anti-Slip, UV-Proof"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                      style={{ flex: 1 }}
                    />
                    <button type="button" onClick={addTag} className="btn-add-item">
                      <Plus size={14} /> Add Tag
                    </button>
                  </div>
                  <div className="chips-wrap">
                    {formData.tags?.map((t, idx) => (
                      <span key={idx} className="chip">
                        <span>#{t}</span>
                        <button type="button" onClick={() => removeTag(t)}>✕</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT 32%: LIVE PREVIEW & QUICK STATS */}
          <div className="preview-column">
            <div className="preview-card">
              <div className="preview-header">
                <Sparkles size={14} color="#8c764b" />
                <span>Live Catalog Card Preview</span>
              </div>

              <div className="mock-card">
                <div
                  className="mock-image"
                  style={{
                    backgroundImage: formData.imageUrl ? `url(${formData.imageUrl})` : "linear-gradient(135deg,#d8d2c4,#a89b7f)",
                  }}
                >
                  <div className="mock-brand-pill">{formData.brand || "Brand"}</div>
                  {formData.shortCode && <div className="mock-code-pill">{formData.shortCode}</div>}
                </div>

                <div className="mock-body">
                  <div className="mock-cat">{formData.category} • {formData.subcategory || "Collection"}</div>
                  <h4 className="mock-title">{formData.name || "Product Name"}</h4>
                  <p className="mock-desc">
                    {formData.description ? formData.description.slice(0, 100) + "..." : "Product description will appear here on the public website."}
                  </p>

                  {/* Swatches preview */}
                  {(formData.finishOptions || []).length > 0 && (
                    <div className="mock-swatches">
                      {formData.finishOptions?.slice(0, 5).map((s, idx) => (
                        <span
                          key={idx}
                          className="mock-swatch"
                          title={s.name}
                          style={{ background: s.hex || "#333" }}
                        />
                      ))}
                      {(formData.finishOptions || []).length > 5 && (
                        <span style={{ fontSize: "10px", color: "#666" }}>+{(formData.finishOptions || []).length - 5}</span>
                      )}
                    </div>
                  )}

                  <div className="mock-footer">
                    <div className="mock-price">
                      {formData.price
                        ? `₹${formData.price.toLocaleString("en-IN")} ${formData.priceUnit || ""}`
                        : "Quote Request"}
                    </div>
                    <span className="mock-btn">View Product →</span>
                  </div>
                </div>
              </div>

              <div className="meta-summary-box">
                <div className="summary-row">
                  <span>Category:</span>
                  <strong>{formData.category}</strong>
                </div>
                <div className="summary-row">
                  <span>Brand:</span>
                  <strong>{formData.brand}</strong>
                </div>
                <div className="summary-row">
                  <span>Gallery Images:</span>
                  <strong>{formData.galleryImages?.length || 0} Photos</strong>
                </div>
                <div className="summary-row">
                  <span>Finish Swatches:</span>
                  <strong>{formData.finishOptions?.length || 0} Variants</strong>
                </div>
                <div className="summary-row">
                  <span>Specification PDF:</span>
                  <strong>{formData.catalogPdfUrl ? "Attached ✓" : "None"}</strong>
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
          background: #0b0f19;
          color: #f8fafc;
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
          border-bottom: 1px solid #1e293b;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #d4af37;
          margin-bottom: 6px;
          transition: color 0.2s;
        }
        .back-link:hover { color: #ffffff; }

        .title-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .editor-title {
          font-size: 26px;
          font-weight: 800;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          margin: 0;
        }

        .id-pill {
          background: #1e293b;
          color: #94a3b8;
          font-size: 11px;
          font-family: monospace;
          padding: 3px 8px;
          border-radius: 6px;
          font-weight: 600;
          border: 1px solid #334155;
        }

        .code-badge {
          background: linear-gradient(135deg, #d4af37 0%, #aa820a 100%);
          color: #000000;
          font-size: 11px;
          font-weight: 800;
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
          background: linear-gradient(135deg, #d4af37 0%, #aa820a 100%);
          color: #000000;
          border-radius: 8px;
          font-weight: 800;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: none;
          cursor: pointer;
          transition: transform 0.2s;
          box-shadow: 0 4px 14px rgba(212, 175, 55, 0.35);
        }
        .btn-primary:hover { transform: translateY(-1px); }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: #1e293b;
          color: #f8fafc;
          border: 1px solid #334155;
          border-radius: 8px;
          font-weight: 700;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-secondary:hover { background: #334155; }

        .btn-danger {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 14px;
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          font-weight: 700;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-danger:hover { background: rgba(239, 68, 68, 0.3); }

        .editor-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        @media (min-width: 1024px) {
          .editor-layout {
            grid-template-columns: 68% 32%;
          }
        }

        .nav-tabs {
          display: flex;
          overflow-x: auto;
          gap: 6px;
          background: #151c2c;
          padding: 6px;
          border-radius: 12px;
          border: 1px solid #28334e;
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
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
          color: #94a3b8;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }
        .tab-item.active {
          background: #d4af37;
          color: #000000;
          font-weight: 800;
        }

        .section-card {
          background: #151c2c;
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          border: 1px solid #28334e;
          color: #f8fafc;
        }

        .section-title {
          font-size: 18px;
          font-weight: 800;
          color: #d4af37;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          margin-bottom: 4px;
        }

        .section-sub {
          font-size: 12px;
          color: #cbd5e1;
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
          color: #f1f5f9;
          margin-bottom: 6px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid #334155;
          background: #0f172a;
          font-size: 13px;
          font-family: inherit;
          color: #ffffff;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: #d4af37;
          background: #111827;
        }

        .media-block {
          margin-bottom: 24px;
        }

        .block-label {
          display: block;
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #ffffff;
          margin-bottom: 12px;
        }

        .hero-upload-wrap {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .hero-preview-box {
          width: 120px;
          height: 120px;
          border-radius: 10px;
          border: 2px dashed #334155;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: #0f172a;
        }

        .upload-controls {
          flex: 1;
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
          transition: background 0.2s;
        }
        .btn-upload:hover { background: #1d4ed8; }

        .btn-outline-danger {
          padding: 8px 14px;
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-add-item {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: #d4af37;
          color: #000000;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 800;
          border: none;
          cursor: pointer;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 12px;
        }

        .gallery-card {
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #28334e;
          background: #0f172a;
        }

        .gallery-thumb {
          width: 100%;
          height: 90px;
        }

        .gallery-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 8px;
          background: #151c2c;
        }

        .img-num {
          font-size: 10px;
          font-weight: 700;
          color: #94a3b8;
        }

        .btn-trash {
          background: transparent;
          border: none;
          color: #f87171;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
        }
        .btn-trash:hover { background: rgba(239, 68, 68, 0.2); }

        .divider {
          margin: 24px 0;
          border: none;
          border-top: 1px solid #1e293b;
        }

        .swatches-table {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .swatch-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          background: #0f172a;
          border-radius: 8px;
          border: 1px solid #334155;
        }

        .swatch-color-picker-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .color-input {
          width: 36px;
          height: 36px;
          border: 1px solid #334155;
          border-radius: 6px;
          cursor: pointer;
          padding: 0;
          background: none;
        }

        .hex-text {
          font-family: monospace;
          font-size: 12px;
          font-weight: 700;
          color: #94a3b8;
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
          background: #1e293b;
          border: 1px solid #334155;
          color: #f8fafc;
          padding: 4px 10px;
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
        .chip button:hover { color: #f87171; }

        .empty-notice {
          padding: 20px;
          text-align: center;
          color: #94a3b8;
          font-size: 13px;
          background: #0f172a;
          border-radius: 8px;
          border: 1px dashed #334155;
        }

        /* LIVE PREVIEW COLUMN */
        .preview-card {
          background: #151c2c;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          border: 1px solid #28334e;
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
          color: #d4af37;
          margin-bottom: 14px;
        }

        .mock-card {
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #28334e;
          background: #0f172a;
          margin-bottom: 16px;
        }

        .mock-image {
          height: 180px;
          background-size: cover;
          background-position: center;
          position: relative;
          padding: 10px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .mock-brand-pill {
          background: rgba(0,0,0,0.85);
          color: #ffffff;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .mock-code-pill {
          background: #d4af37;
          color: #000000;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 800;
        }

        .mock-body {
          padding: 14px;
        }

        .mock-cat {
          font-size: 10px;
          font-weight: 700;
          color: #d4af37;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }

        .mock-title {
          font-size: 14px;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 6px;
        }

        .mock-desc {
          font-size: 11px;
          color: #cbd5e1;
          line-height: 1.4;
          margin-bottom: 10px;
        }

        .mock-swatches {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 12px;
        }

        .mock-swatch {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .mock-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #1e293b;
          padding-top: 10px;
        }

        .mock-price {
          font-weight: 800;
          font-size: 12px;
          color: #ffffff;
        }

        .mock-btn {
          font-size: 11px;
          font-weight: 800;
          color: #d4af37;
        }

        .meta-summary-box {
          background: #0f172a;
          border-radius: 8px;
          padding: 12px;
          font-size: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          border: 1px solid #28334e;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #cbd5e1;
        }
        .summary-row strong { color: #ffffff; }

        .status-badge-preview {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          background: #0f172a;
          border-radius: 8px;
          border: 1px solid #334155;
          color: #f8fafc;
        }
        .status-badge-preview .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        /* Floating Toast */
        .toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: #d4af37;
          color: #000000;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 800;
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
