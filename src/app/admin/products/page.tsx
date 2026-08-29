"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import * as xlsx from "xlsx";
import AdminNav from "@/components/AdminNav";
import { ProductItem } from "@/lib/types";
import { uploadFileWithCompression } from "@/lib/uploadHelper";

const CATEGORIES = [
  "All",
  "Furniture",
  "Decking",
  "Cladding",
  "Screening",
  "Fencing",
  "Lighting",
  "Accessories",
  "Flooring",
  "Other",
];

const PREDEFINED_BRANDS = [
  "Slashform",
  "Waltz by JB Glass",
  "Newtech Wood",
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

const PREDEFINED_PRICE_UNITS = [
  "per SQM",
  "per SLAB",
  "per piece",
  "per SQFT",
  "per METRE",
];

export default function AdminProductsPage() {
  const [activeTab, setActiveTab] = useState<"catalog" | "bulk">("catalog");
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Toolbar States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Modal State
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Form State
  const [form, setForm] = useState({
    name: "",
    brand: "Newtech Wood",
    category: "Decking",
    collection: "",
    shortCode: "",
    finish: "",
    width: "",
    height: "",
    depth: "",
    thickness: "",
    measurementType: "mm",
    price: "",
    priceUnit: "per SQM",
    qtyInStock: "50",
    imageUrl: "",
    description: "",
  });

  // Bulk Upload States
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [previewRows, setPreviewRows] = useState<any[]>([]);
  const [bulkSummary, setBulkSummary] = useState<{ total: number; valid: number; invalid: number } | null>(null);
  const [uploadingBulk, setUploadingBulk] = useState<boolean>(false);
  const [uploadStatusMsg, setUploadStatusMsg] = useState<string | null>(null);
  const bulkFileInputRef = useRef<HTMLInputElement>(null);

  // Fetch products live from database with no-cache
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products?t=" + Date.now(), { cache: "no-store" });
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data)) {
        setProducts(data.data);
      } else if (data.products && Array.isArray(data.products)) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Error fetching admin products:", err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const openNewProductModal = () => {
    setEditingProduct(null);
    setForm({
      name: "",
      brand: "Newtech Wood",
      category: "Decking",
      collection: "",
      shortCode: "",
      finish: "",
      width: "",
      height: "",
      depth: "",
      thickness: "",
      measurementType: "mm",
      price: "",
      priceUnit: "per SQM",
      qtyInStock: "50",
      imageUrl: "",
      description: "",
    });
    setModalOpen(true);
  };

  const openEditProductModal = (p: ProductItem) => {
    setEditingProduct(p);
    setForm({
      name: p.name || "",
      brand: p.brand || "Newtech Wood",
      category: p.category || "Decking",
      collection: p.subcategory || (p as any).collection || "",
      shortCode: p.shortCode || "",
      finish: p.finish || "",
      width: p.width || "",
      height: p.height || "",
      depth: p.depth || "",
      thickness: p.thickness || "",
      measurementType: p.measurementType || "mm",
      price: p.price !== undefined ? String(p.price) : "",
      priceUnit: (p as any).priceUnit || "per SQM",
      qtyInStock: p.qtyInStock !== undefined ? String(p.qtyInStock) : "50",
      imageUrl: p.imageUrl || "",
      description: p.description || "",
    });
    setModalOpen(true);
  };

  // Delete product - calls API so it is permanently removed from DB
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        showToast("Delete failed: HTTP " + res.status);
        return;
      }
      const json = await res.json();
      if (json.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showToast("Product permanently deleted from catalog");
      } else {
        showToast("Delete failed: " + (json.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      showToast("Delete failed. Please try again.");
    }
  };

  // Create or Update product submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.price && (isNaN(parseFloat(form.price)) || parseFloat(form.price) < 0)) {
      showToast("Price cannot be negative.");
      return;
    }
    if (form.qtyInStock && (isNaN(parseInt(form.qtyInStock, 10)) || parseInt(form.qtyInStock, 10) < 0)) {
      showToast("Quantity cannot be negative.");
      return;
    }
    setIsSaving(true);
    try {
      const isEdit = Boolean(editingProduct);
      const payload = {
        ...(isEdit && editingProduct ? editingProduct : {}),
        id: isEdit && editingProduct ? editingProduct.id : `prod-${Date.now()}`,
        name: form.name,
        brand: form.brand,
        category: form.category,
        subcategory: form.collection || form.category,
        shortCode: form.shortCode || undefined,
        finish: form.finish,
        width: form.width || undefined,
        height: form.height || undefined,
        depth: form.depth || undefined,
        thickness: form.thickness || undefined,
        measurementType: form.measurementType || "mm",
        description: form.description || `${form.name} by ${form.brand}`,
        price: form.price ? parseFloat(form.price) : undefined,
        priceUnit: form.priceUnit,
        qtyInStock: form.qtyInStock ? parseInt(form.qtyInStock, 10) : 50,
        imageUrl: form.imageUrl,
        galleryImages: isEdit && editingProduct?.galleryImages?.length ? editingProduct.galleryImages : [form.imageUrl],
      };

      const res = await fetch("/api/products", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success || json.product || json.data) {
        setModalOpen(false);
        fetchProducts();
        showToast(isEdit ? "Product details updated successfully!" : "Product added successfully!");
      } else {
        showToast("Failed: " + (json.error || "Save error"));
      }
    } catch (err: any) {
      console.error(err);
      showToast("Failed to save product: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Excel Bulk Select
  const handleExcelSelect = (file: File) => {
    if (!file) return;
    setBulkFile(file);
    setUploadStatusMsg(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target?.result;
        const workbook = xlsx.read(buffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows: any[] = xlsx.utils.sheet_to_json(sheet);

        let validCount = 0;
        let invalidCount = 0;

        const parsedRows = rows.map((r, i) => {
          const name = r["Product Name"] || r["Name"] || r["name"];
          const brand = r["Brand"] || r["brand"];
          const category = r["Category"] || r["category"];

          const isValid = Boolean(name && brand && category);
          if (isValid) validCount++; else invalidCount++;

          return {
            rowNum: i + 2,
            name: name || "",
            brand: brand || "",
            category: category || "",
            collection: r["Collection"] || "",
            price: r["Price"] || "",
            priceUnit: r["Price Unit"] || "per SQM",
            imageUrl: r["Image URL"] || r["Image"] || "",
            isValid,
          };
        });

        setPreviewRows(parsedRows);
        setBulkSummary({ total: parsedRows.length, valid: validCount, invalid: invalidCount });
      } catch (err) {
        setUploadStatusMsg("Error parsing Excel file. Please use valid .xlsx format.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Bulk Insert Confirm
  const handleConfirmBulkInsert = async () => {
    if (!bulkFile) return;
    setUploadingBulk(true);
    setUploadStatusMsg("Inserting valid products into database...");

    const formData = new FormData();
    formData.append("file", bulkFile);

    try {
      const res = await fetch("/api/products/import", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (result.success) {
        setUploadStatusMsg(`Import successful: ${result.importedCount || bulkSummary?.valid} products added!`);
        fetchProducts();
        setPreviewRows([]);
        setBulkFile(null);
        showToast("Bulk import completed!");
      } else {
        setUploadStatusMsg(`Upload error: ${result.error || "Failed to import"}`);
      }
    } catch (err: any) {
      setUploadStatusMsg(`Import error: ${err.message}`);
    } finally {
      setUploadingBulk(false);
    }
  };

  const handleProductImageUpload = async (file: File) => {
    if (!file) return;
    try {
      const result = await uploadFileWithCompression(file, "Products");
      if (result.success && (result.dataUrl || result.url)) {
        setForm((prev) => ({ ...prev, imageUrl: result.dataUrl || result.url || "" }));
        showToast("Product image uploaded successfully to Google Firebase Storage!");
      } else {
        alert("Upload error: " + (result.error || "Upload failed"));
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCat = activeCategory === "All" || p.category === activeCategory;
    const matchesQ =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQ;
  });

  return (
    <div className="admin-page-container font-['Jost',sans-serif]">
      <AdminNav />

      <main className="admin-main-content admin-main">
        {/* Header Bar */}
        <div className="header-bar">
          <div>
            <span className="eyebrow">AAREN Studio Admin Control</span>
            <h1 className="page-title">Product Catalog Management</h1>
          </div>
          <button className="btn-add" onClick={openNewProductModal}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            Add New Product
          </button>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === "catalog" ? "active" : ""}`}
            onClick={() => setActiveTab("catalog")}
          >
            Product Catalog ({products.length})
          </button>
          <button
            className={`tab ${activeTab === "bulk" ? "active" : ""}`}
            onClick={() => setActiveTab("bulk")}
          >
            Bulk Excel Upload
          </button>
        </div>

        {/* CATALOG TAB */}
        {activeTab === "catalog" && (
          <div id="tabCatalog">
            <div className="toolbar">
              <div className="search-wrap">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
                <input
                  type="text"
                  placeholder="Search products by name, brand, or shortcode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="cat-pills">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    className={`cat-pill ${activeCategory === c ? "active" : ""}`}
                    onClick={() => setActiveCategory(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="catalog-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Collection</th>
                    <th>Price</th>
                    <th>Actions & Editor</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr className="empty-row">
                      <td colSpan={6}>No products match your search.</td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <Link href={`/admin/products/${p.id}`} className="prod-cell" title="Click to open master individual product page">
                            <div
                              className="prod-thumb"
                              style={{
                                backgroundImage: p.imageUrl ? `url(${p.imageUrl})` : "linear-gradient(135deg,#d8d2c4,#a89b7f)"
                              }}
                            />
                            <div>
                              <div style={{ color: "#1e1e1e", fontWeight: 700 }}>{p.name}</div>
                              {p.shortCode && <span className="cell-shortcode">{p.shortCode}</span>}
                            </div>
                          </Link>
                        </td>
                        <td className="brand-cell">{p.brand}</td>
                        <td>{p.category}</td>
                        <td>{p.subcategory || (p as any).collection || "—"}</td>
                        <td className="price-cell">
                          {p.price ? `₹${p.price.toLocaleString("en-IN")} ${(p as any).priceUnit || ""}` : "Quote Request"}
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                            <button
                              onClick={() => openEditProductModal(p)}
                              className="btn-action-edit"
                              title="Quick Edit Product Details"
                            >
                              ✏️ Quick Edit
                            </button>
                            <Link
                              href={`/admin/products/${p.id}`}
                              className="btn-action-full"
                              title="Open Full Individual Product Page"
                            >
                              ⚙️ Full Page ↗
                            </Link>
                            <Link href={`/products/${p.id}`} target="_blank" className="action-icon" title="View Live Public Page">
                              👁
                            </Link>
                            <span
                              className="action-icon"
                              title="Delete Product"
                              onClick={() => handleDeleteProduct(p.id)}
                              style={{ color: "#e5484d" }}
                            >
                              🗑️
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BULK UPLOAD TAB */}
        {activeTab === "bulk" && (
          <div id="tabBulk">
            <div className="bulk-panel">
              <div className="bulk-head">
                <div>
                  <h3>Bulk Excel Product Import</h3>
                  <p>Upload multiple products simultaneously via standardized .xlsx spreadsheet.</p>
                </div>
                <a href="/api/admin/template/excel" download className="template-btn">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"/></svg>
                  Download Excel Template
                </a>
              </div>

              <div
                className="dropzone"
                onClick={() => bulkFileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={bulkFileInputRef}
                  accept=".xlsx, .xls"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) handleExcelSelect(e.target.files[0]);
                  }}
                />
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#81663f" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                <h4>{bulkFile ? bulkFile.name : "Click to select or drop Excel file here"}</h4>
                <p>{bulkFile ? `${(bulkFile.size / 1024).toFixed(1)} KB` : "Supports standard .xlsx catalog templates"}</p>
              </div>

              {uploadStatusMsg && (
                <div style={{ marginTop: "16px", padding: "12px 16px", borderRadius: "8px", background: "#f1f5f9", fontSize: "12px", fontWeight: 600 }}>
                  {uploadStatusMsg}
                </div>
              )}

              {previewRows.length > 0 && (
                <div style={{ marginTop: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>
                      Preview ({bulkSummary?.valid} Valid, {bulkSummary?.invalid} Invalid)
                    </span>
                    <button
                      onClick={handleConfirmBulkInsert}
                      disabled={uploadingBulk || bulkSummary?.valid === 0}
                      className="btn-add"
                    >
                      {uploadingBulk ? "Importing..." : "Confirm & Import Products →"}
                    </button>
                  </div>

                  <div className="catalog-table-wrap" style={{ maxHeight: "320px", overflowY: "auto" }}>
                    <table>
                      <thead>
                        <tr>
                          <th>Row</th>
                          <th>Product Name</th>
                          <th>Brand</th>
                          <th>Category</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewRows.map((row, idx) => (
                          <tr key={idx} style={{ background: row.isValid ? "#fff" : "#fff0f0" }}>
                            <td style={{ fontFamily: "monospace" }}>{row.rowNum}</td>
                            <td style={{ fontWeight: 700 }}>{row.name || "<Missing Name>"}</td>
                            <td>{row.brand || "<Missing Brand>"}</td>
                            <td>{row.category || "<Missing Category>"}</td>
                            <td style={{ fontWeight: 700, color: row.isValid ? "#2e7d32" : "#d32f2f" }}>
                              {row.isValid ? "✓ Valid" : "❌ Missing Field"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ADD / EDIT PRODUCT MODAL */}
      <div className={`overlay ${modalOpen ? "open" : ""}`}>
        <div className="modal">
          <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ margin: 0 }}>{editingProduct ? `Edit: ${form.name}` : "Add New Architectural Product"}</h3>
            {editingProduct && (
              <Link
                href={`/admin/products/${editingProduct.id}`}
                className="btn-modal-full"
              >
                Open Full Master Page ↗
              </Link>
            )}
          </div>
          <form id="productForm" onSubmit={handleSubmit}>
            <div className="field">
              <label>Product Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. UltraShield Naturale Decking"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="field-row">
              <div className="field">
                <label>Brand Name *</label>
                <select
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                >
                  {PREDEFINED_BRANDS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Collection Name</label>
                <input
                  type="text"
                  placeholder="e.g. Naturale Series"
                  value={form.collection}
                  onChange={(e) => setForm({ ...form, collection: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Short Code</label>
                <input
                  type="text"
                  placeholder="e.g. NW 10, SF 01"
                  value={form.shortCode}
                  onChange={(e) => setForm({ ...form, shortCode: e.target.value })}
                />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Width</label>
                <input
                  type="text"
                  placeholder="e.g. 140mm"
                  value={form.width}
                  onChange={(e) => setForm({ ...form, width: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Height / Thickness</label>
                <input
                  type="text"
                  placeholder="e.g. 22.5mm"
                  value={form.height}
                  onChange={(e) => setForm({ ...form, height: e.target.value })}
                />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Finish Texture</label>
                <input
                  type="text"
                  placeholder="e.g. Teak Composite"
                  value={form.finish}
                  onChange={(e) => setForm({ ...form, finish: e.target.value })}
                />
              </div>
              <div className="field">
                <label>In-Stock Quantity</label>
                <input
                  type="number"
                  min="0"
                  placeholder="50"
                  value={form.qtyInStock}
                  onChange={(e) => setForm({ ...form, qtyInStock: e.target.value })}
                />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Price (INR)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 6400"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Price Unit</label>
                <select
                  value={form.priceUnit}
                  onChange={(e) => setForm({ ...form, priceUnit: e.target.value })}
                >
                  {PREDEFINED_PRICE_UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="field">
              <label>Hero Image URL *</label>
              <input
                type="text"
                required
                placeholder="https://..."
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                style={{ marginBottom: "0.4rem" }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)" }}>OR Upload Image from computer:</span>
                <input
                  type="file"
                  accept="image/*"
                  id="prodImgUpload"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) handleProductImageUpload(e.target.files[0]);
                  }}
                />
                <label
                  htmlFor="prodImgUpload"
                  style={{
                    padding: "0.4rem 0.8rem",
                    background: "#2563eb",
                    color: "#fff",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  💻 Select Product Image
                </label>
              </div>
            </div>
            <div className="field">
              <label>Description</label>
              <textarea
                rows={3}
                placeholder="Product details, architectural specs..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <button type="submit" className="submit-btn" disabled={isSaving}>
              {isSaving ? "Saving..." : editingProduct ? "Update Product Details →" : "Save Product to Catalog →"}
            </button>
          </form>
        </div>
      </div>

      {/* Floating Toast */}
      <div className={`toast ${toastMsg ? "show" : ""}`}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#81663f" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
        <span>{toastMsg}</span>
      </div>

      {/* ── EXACT MAIN WEBSITE LUXURY THEME STYLES ── */}
      <style jsx global>{`
        .admin-page-container {
          background: #FAF8F5;
          color: #1E1E1E;
          min-height: 100vh;
          font-size: 13px;
        }

        .admin-main {
          max-width: 1360px;
          margin: 0 auto;
          padding: 40px 24px 80px;
        }

        @media (min-width: 640px) {
          .admin-main { padding: 40px 48px 80px; }
        }

        .header-bar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 32px;
          border-bottom: 1px solid #DCD5C6;
          padding-bottom: 20px;
        }

        .eyebrow {
          color: #81663F;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          display: block;
          margin-bottom: 4px;
        }

        h1.page-title {
          font-size: 28px;
          font-weight: 800;
          color: #1E1E1E;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          margin: 0;
        }

        .btn-add {
          padding: 11px 22px;
          border-radius: 999px;
          background: #1E1E1E;
          color: #FFFFFF;
          font-weight: 800;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          display: flex;
          align-items: center;
          gap: 8px;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .btn-add:hover { background: #81663F; transform: translateY(-1px); }

        .tabs {
          display: flex;
          gap: 28px;
          border-bottom: 1px solid #DCD5C6;
          margin-bottom: 28px;
        }

        .tab {
          padding-bottom: 12px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #6A6359;
          border-bottom: 2px solid transparent;
          background: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab.active { color: #81663F; border-color: #81663F; font-weight: 800; }

        .toolbar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          background: #FFFFFF;
          padding: 16px;
          border-radius: 16px;
          border: 1px solid #E2DCD2;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          margin-bottom: 24px;
        }

        .search-wrap { position: relative; flex: 1; max-width: 360px; min-width: 220px; }

        .search-wrap input {
          width: 100%;
          padding: 10px 16px 10px 38px;
          border-radius: 999px;
          border: 1px solid #D5CEBF;
          background: #FAF8F5;
          color: #1E1E1E;
          font-size: 12px;
          font-family: inherit;
        }

        .search-wrap input:focus { outline: none; border-color: #81663F; }
        .search-wrap svg { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); opacity: 0.6; stroke: #81663F; }

        .cat-pills { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 2px; }

        .cat-pill {
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
          background: #F4EFE6;
          color: #4A433B;
          border: 1px solid #DCD5C6;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cat-pill.active { background: #1E1E1E; color: #FFFFFF; font-weight: 800; border-color: #1E1E1E; }

        .catalog-table-wrap {
          background: #FFFFFF;
          border-radius: 16px;
          border: 1px solid #E2DCD2;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
        }

        table { width: 100%; border-collapse: collapse; text-align: left; }
        thead { background: #F2EDE2; border-bottom: 1px solid #DCD5C6; }
        th {
          padding: 14px 16px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #81663F;
        }
        td { padding: 14px 16px; border-top: 1px solid #EAE4D8; font-size: 13px; color: #1E1E1E; background: #FFFFFF; }
        tbody tr:hover td { background: #FAF8F5; }
        .prod-cell { display: flex; align-items: center; gap: 12px; font-weight: 700; color: #1E1E1E; text-decoration: none; }
        .prod-thumb {
          width: 42px; height: 42px; border-radius: 8px; flex-shrink: 0;
          background-size: cover; background-position: center; border: 1px solid #DCD5C6;
        }
        .brand-cell { color: #81663F !important; font-weight: 700 !important; }
        .price-cell { font-weight: 700 !important; color: #1E1E1E !important; }
        .action-icon { color: #8A8279; cursor: pointer; text-decoration: none; font-size: 14px; }
        .action-icon:hover { color: #1E1E1E; }
        .btn-action-edit {
          padding: 6px 12px;
          border-radius: 6px;
          background: #1E1E1E;
          color: #FFFFFF;
          font-size: 11px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .btn-action-edit:hover { background: #81663F; }
        .btn-action-full {
          padding: 6px 12px;
          border-radius: 6px;
          background: #F4EFE6;
          color: #1E1E1E;
          border: 1px solid #D5CEBF;
          font-size: 11px;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
          transition: all 0.2s;
        }
        .btn-action-full:hover { background: #E8E2D5; border-color: #81663F; color: #81663F; }
        .btn-modal-full {
          padding: 6px 12px;
          border-radius: 6px;
          background: #81663F;
          color: #FFFFFF;
          font-size: 11px;
          font-weight: 800;
          text-decoration: none;
          transition: background 0.2s;
        }
        .btn-modal-full:hover { background: #96774B; }
        .cell-shortcode {
          display: inline-block;
          font-size: 10px;
          font-weight: 800;
          color: #81663F;
          background: rgba(129,102,63,0.12);
          border: 1px solid rgba(129,102,63,0.25);
          padding: 2px 6px;
          border-radius: 4px;
          margin-top: 2px;
        }
        .empty-row td { text-align: center; padding: 40px; color: #8A8279; font-style: italic; }

        .bulk-panel {
          background: #FFFFFF;
          padding: 32px;
          border-radius: 24px;
          border: 1px solid #E2DCD2;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          max-width: 760px;
          margin: 0 auto;
        }

        .bulk-head {
          display: flex; align-items: center; justify-content: space-between;
          padding-bottom: 16px; margin-bottom: 24px; border-bottom: 1px solid #EAE4D8;
          gap: 12px; flex-wrap: wrap;
        }
        .bulk-head h3 { font-size: 16px; font-weight: 800; text-transform: uppercase; color: #81663F; }
        .bulk-head p { font-size: 11px; color: #6A6359; margin-top: 2px; }

        .template-btn {
          padding: 10px 18px; border-radius: 999px; border: 1px solid #81663F; color: #81663F;
          font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
          background: rgba(129,102,63,0.08); cursor: pointer; display: flex; align-items: center; gap: 8px;
          text-decoration: none;
        }
        .template-btn:hover { background: #81663F; color: #FFFFFF; }

        .dropzone {
          border: 2px dashed #CFC7B5;
          border-radius: 20px;
          padding: 44px 20px;
          text-align: center;
          background: #FAF8F5;
          cursor: pointer;
          transition: border-color 0.2s ease;
        }
        .dropzone:hover { border-color: #81663F; }
        .dropzone h4 { font-size: 13px; font-weight: 800; text-transform: uppercase; margin-top: 10px; color: #1E1E1E; }
        .dropzone p { font-size: 11px; color: #6A6359; margin-top: 4px; }

        .overlay {
          display: none;
          position: fixed; inset: 0; background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          z-index: 50; align-items: center; justify-content: center; padding: 16px;
          overflow-y: auto;
        }
        .overlay.open { display: flex; }

        .modal {
          background: #FFFFFF;
          border: 1px solid #DCD5C6;
          color: #1E1E1E;
          border-radius: 24px;
          padding: 32px;
          width: 100%;
          max-width: 640px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 30px 80px rgba(0,0,0,0.25);
        }

        .modal-close {
          position: absolute; top: 24px; right: 24px;
          width: 32px; height: 32px; border-radius: 999px;
          background: #FAF8F5;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid #D5CEBF; color: #1E1E1E; cursor: pointer;
        }
        .modal-close:hover { background: #e5484d; color: #fff; border-color: #e5484d; }

        .modal h3 { font-size: 19px; font-weight: 800; text-transform: uppercase; margin-bottom: 24px; color: #81663F; }
        .field { margin-bottom: 16px; }
        .field label { display: block; font-size: 11px; font-weight: 700; color: #1E1E1E; margin-bottom: 6px; }
        .field input, .field select, .field textarea {
          width: 100%; padding: 11px 14px; border-radius: 10px;
          background: #FAF8F5; border: 1px solid #D5CEBF;
          color: #1E1E1E; font-family: inherit; font-size: 12px;
        }
        .field select { background: #FAF8F5; }
        .field input::placeholder, .field textarea::placeholder { color: #8C8275; }
        .field input:focus, .field select:focus, .field textarea:focus { outline: none; border-color: #81663F; box-shadow: 0 0 0 3px rgba(129,102,63,0.15); }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        .submit-btn {
          width: 100%; margin-top: 8px; padding: 14px; border-radius: 999px;
          background: #1E1E1E; color: #FFFFFF; font-weight: 800; font-size: 12px;
          text-transform: uppercase; letter-spacing: 0.05em; border: none; cursor: pointer;
          transition: background 0.2s ease;
        }
        .submit-btn:hover { background: #81663F; }

        .toast {
          position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%) translateY(20px);
          background: #1E1E1E; color: #FFFFFF; padding: 14px 24px; border-radius: 999px;
          font-size: 12px; font-weight: 800; opacity: 0; pointer-events: none;
          transition: all 0.35s cubic-bezier(0.16,1,0.3,1);
          display: flex; align-items: center; gap: 8px; z-index: 60;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        }
        .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
      `}</style>
    </div>
  );
}
