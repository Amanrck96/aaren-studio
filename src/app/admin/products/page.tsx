"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import * as xlsx from "xlsx";
import AdminNav from "@/components/AdminNav";
import { Search, Plus, Download, Upload, CheckCircle2, AlertCircle, Trash2, Eye, X, Check } from "lucide-react";
import { ProductItem } from "@/lib/types";

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
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    name: "",
    brand: "Newtech Wood",
    category: "Decking",
    collection: "",
    finish: "",
    price: "",
    priceUnit: "per SQM",
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

  // Delete product live
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast("Product deleted from database");
    } catch (err) {
      console.error(err);
    }
  };

  // Create product submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        id: `prod-${Date.now()}`,
        name: form.name,
        brand: form.brand,
        category: form.category,
        subcategory: form.collection || form.category,
        finish: form.finish,
        description: form.description || `${form.name} by ${form.brand}`,
        price: form.price ? parseFloat(form.price) : undefined,
        priceUnit: form.priceUnit,
        imageUrl: form.imageUrl,
        galleryImages: [form.imageUrl],
        qtyInStock: 50,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success || json.product) {
        setModalOpen(false);
        setForm({
          name: "",
          brand: "Newtech Wood",
          category: "Decking",
          collection: "",
          finish: "",
          price: "",
          priceUnit: "per SQM",
          imageUrl: "",
          description: "",
        });
        fetchProducts();
        showToast("Product added successfully!");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to create product");
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

  const filteredProducts = products.filter((p) => {
    const matchesCat = activeCategory === "All" || p.category === activeCategory;
    const matchesQ =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQ;
  });

  return (
    <div className="bg-[#FAF8F5] text-[#1E1E1E] min-h-screen font-['Jost',sans-serif]">
      <AdminNav />

      <main className="max-w-[1360px] mx-auto px-6 sm:px-12 py-10">
        {/* Header Bar */}
        <div className="header-bar flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <span className="eyebrow text-[#81663f] text-xs font-bold uppercase tracking-widest block mb-1">
              AAREN Studio Admin Control
            </span>
            <h1 className="page-title text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-black">
              Product Catalog Management
            </h1>
          </div>
          <button onClick={() => setModalOpen(true)} className="btn-add">
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="tabs flex items-center gap-7 border-b border-black/10 mb-7 overflow-x-auto">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`tab pb-3 text-xs font-bold uppercase tracking-wider border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === "catalog" ? "active border-[#81663f] text-[#81663f]" : "border-transparent text-black/45"
            }`}
          >
            Product Catalog ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("bulk")}
            className={`tab pb-3 text-xs font-bold uppercase tracking-wider border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === "bulk" ? "active border-[#81663f] text-[#81663f]" : "border-transparent text-black/45"
            }`}
          >
            Bulk Excel Upload
          </button>
        </div>

        {/* CATALOG TAB */}
        {activeTab === "catalog" && (
          <div>
            {/* Toolbar */}
            <div className="toolbar flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-black/10 shadow-xs mb-6">
              <div className="search-wrap relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                <input
                  type="text"
                  placeholder="Search products by name or brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-black/15 bg-[#FAF8F5] text-xs font-medium focus:outline-none focus:border-[#81663f]"
                />
              </div>

              <div className="cat-pills flex items-center gap-2.5 overflow-x-auto pb-1">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveCategory(c)}
                    className={`cat-pill px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer ${
                      activeCategory === c ? "active bg-[#1E1E1E] text-white" : "bg-black/5 text-black/70 hover:bg-black/10"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Catalog Table */}
            <div className="catalog-table-wrap bg-white rounded-2xl border border-black/10 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#FAF8F5] border-b border-black/10 text-black/50 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-4">Product Name</th>
                    <th className="p-4">Brand</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Collection</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-black/40 italic">
                        No products match your search.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-black/[0.015] transition-colors">
                        <td className="p-4 font-bold text-black flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-black/5">
                            {p.imageUrl && <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />}
                          </div>
                          <span>{p.name}</span>
                        </td>
                        <td className="p-4 font-bold text-[#81663f]">{p.brand}</td>
                        <td className="p-4 font-medium">{p.category}</td>
                        <td className="p-4 text-black/60">{p.subcategory || (p as any).collection || "—"}</td>
                        <td className="p-4 font-bold">
                          {p.price ? `₹${p.price.toLocaleString("en-IN")} ${p.priceUnit || ""}` : "Quote Request"}
                        </td>
                        <td className="p-4 flex items-center gap-3">
                          <Link href={`/products/${p.id}`} className="text-black/60 hover:text-black">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="text-red-500 hover:text-red-700 cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
          <div className="bulk-panel bg-white p-8 rounded-3xl border border-black/10 shadow-xs max-w-3xl mx-auto">
            <div className="bulk-head flex flex-wrap items-center justify-between pb-4 mb-6 border-b border-black/10 gap-3">
              <div>
                <h3 className="text-base font-extrabold uppercase tracking-tight text-black">Bulk Excel Product Import</h3>
                <p className="text-xs text-black/60 mt-0.5">Upload multiple products simultaneously via standardized .xlsx spreadsheet.</p>
              </div>
              <a
                href="/api/admin/template/excel"
                download
                className="template-btn px-4 py-2 rounded-full border border-[#81663f] text-[#81663f] hover:bg-[#81663f] hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Excel Template
              </a>
            </div>

            <div
              onClick={() => bulkFileInputRef.current?.click()}
              className="dropzone border-2 border-dashed border-black/20 hover:border-[#81663f] rounded-2xl p-10 text-center cursor-pointer bg-[#FAF8F5] transition-all mb-6"
            >
              <Upload className="w-8 h-8 text-[#81663f] mx-auto mb-2" />
              <h4 className="text-sm font-extrabold uppercase text-black">Drag &amp; Drop .xlsx Excel File Here</h4>
              <p className="text-xs text-black/50 mt-1">or click to browse from your device</p>
              <input
                ref={bulkFileInputRef}
                type="file"
                accept=".xlsx, .xls"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleExcelSelect(e.target.files[0])}
              />
            </div>

            {uploadStatusMsg && (
              <div className="p-4 rounded-xl bg-black/5 border border-black/10 text-xs font-semibold mb-6 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#81663f]" />
                <span>{uploadStatusMsg}</span>
              </div>
            )}

            {previewRows.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-black">
                    Preview ({bulkSummary?.valid} Valid, {bulkSummary?.invalid} Invalid)
                  </span>

                  <button
                    onClick={handleConfirmBulkInsert}
                    disabled={uploadingBulk || bulkSummary?.valid === 0}
                    className="px-6 py-2.5 rounded-full bg-[#1E1E1E] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#81663f] transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {uploadingBulk ? "Importing..." : "Confirm & Import Products →"}
                  </button>
                </div>

                <div className="border border-black/10 rounded-2xl overflow-hidden max-h-80 overflow-y-auto text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-[#FAF8F5] border-b border-black/10 font-bold uppercase text-black/60">
                      <tr>
                        <th className="p-3">Row</th>
                        <th className="p-3">Product Name</th>
                        <th className="p-3">Brand</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {previewRows.map((row, idx) => (
                        <tr key={idx} className={row.isValid ? "bg-white" : "bg-red-50"}>
                          <td className="p-3 font-mono">{row.rowNum}</td>
                          <td className="p-3 font-bold">{row.name || "<Missing Name>"}</td>
                          <td className="p-3">{row.brand || "<Missing Brand>"}</td>
                          <td className="p-3">{row.category || "<Missing Category>"}</td>
                          <td className="p-3 font-bold">
                            {row.isValid ? (
                              <span className="text-green-600 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                              </span>
                            ) : (
                              <span className="text-red-600">❌ Missing Required Field</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ADD PRODUCT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121316] border border-[#81663f]/40 text-white rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-500 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-6">
              Add New Architectural Product
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
              <div>
                <label className="block text-white/70 font-semibold mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UltraShield Naturale Decking"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#81663f]"
                />
              </div>

              <div>
                <label className="block text-white/70 font-semibold mb-1">Brand Name *</label>
                <select
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#1e2026] border border-white/20 text-white focus:outline-none focus:border-[#81663f]"
                >
                  {PREDEFINED_BRANDS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/70 font-semibold mb-1">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#1e2026] border border-white/20 text-white focus:outline-none focus:border-[#81663f]"
                >
                  {CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 font-semibold mb-1">Collection Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Naturale Series"
                    value={form.collection}
                    onChange={(e) => setForm({ ...form, collection: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/70 font-semibold mb-1">Finish</label>
                  <input
                    type="text"
                    placeholder="e.g. Teak Composite"
                    value={form.finish}
                    onChange={(e) => setForm({ ...form, finish: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 font-semibold mb-1">Price (INR)</label>
                  <input
                    type="number"
                    placeholder="e.g. 6400"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/70 font-semibold mb-1">Price Unit</label>
                  <select
                    value={form.priceUnit}
                    onChange={(e) => setForm({ ...form, priceUnit: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#1e2026] border border-white/20 text-white"
                  >
                    {PREDEFINED_PRICE_UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/70 font-semibold mb-1">Hero Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white"
                />
              </div>

              <div>
                <label className="block text-white/70 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Product details, architectural specs..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white"
                />
              </div>

              <button
                type="submit"
                className="mt-4 py-3.5 rounded-full bg-[#81663f] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#a38354] transition-all shadow-lg cursor-pointer"
              >
                Save Product to Catalog →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast */}
      {toastMsg && (
        <div className="fixed bottom-7 left-1/2 -translate-x-1/2 bg-[#1E1E1E] text-white px-6 py-3 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 z-50">
          <Check className="w-4 h-4 text-[#81663f]" />
          <span>{toastMsg}</span>
        </div>
      )}

      <style jsx>{`
        .btn-add {
          padding: 11px 22px;
          border-radius: 999px;
          background: #1E1E1E;
          color: #fff;
          font-weight: 700;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          display: flex;
          align-items: center;
          gap: 8px;
          border: none;
          cursor: pointer;
          box-shadow: 0 6px 16px rgba(0,0,0,0.12);
          transition: background 0.25s ease;
        }
        .btn-add:hover { background: #81663f; }
      `}</style>
    </div>
  );
}
