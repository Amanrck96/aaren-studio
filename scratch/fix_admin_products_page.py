import os

code = """"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import * as xlsx from "xlsx";
import AdminNav from "@/components/AdminNav";
import { Search, Plus, Download, Upload, CheckCircle2, AlertCircle, Trash2, Edit3, X, Eye, Menu } from "lucide-react";

type ProductItem = {
  id: string;
  name: string;
  brand: string;
  category: string;
  collection?: string;
  width?: string;
  height?: string;
  thickness?: string;
  finish?: string;
  description: string;
  price?: number;
  priceUnit?: string;
  imageUrl: string;
  galleryImages?: string[];
  catalogPdfUrl?: string;
  applicationTags?: string[];
};

const PREDEFINED_CATEGORIES = [
  "Decking",
  "Cladding",
  "Surfaces",
  "Bathroom",
  "Flooring",
  "Doors",
  "Kitchen",
  "Tiles",
  "Furniture",
  "Lighting",
  "Accessories",
  "Other",
];

const PREDEFINED_PRICE_UNITS = [
  "per SQM",
  "per SLAB",
  "per piece",
  "per SQFT",
  "per METRE",
];

const APPLICATION_TAG_OPTIONS = [
  "Exterior Cladding",
  "Interior Walls",
  "Commercial High-Traffic",
  "Residential Feature",
  "Wet Areas & Shower",
  "Landscape & Decking",
];

export default function AdminProductsPage() {
  const [activeTab, setActiveTab] = useState<"catalog" | "bulk">("catalog");
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [brandsList, setBrandsList] = useState<string[]>([
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
  ]);

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Mobile Sidebar & Layout State
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Manual Add Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "Newtech Wood",
    category: "Decking",
    collection: "",
    width: "",
    height: "",
    thickness: "",
    finish: "",
    description: "",
    price: "",
    priceUnit: "per SQM",
    imageUrl: "",
    galleryImages: [] as string[],
    catalogPdfUrl: "",
    applicationTags: [] as string[],
  });

  // Bulk Upload Preview State
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [previewRows, setPreviewRows] = useState<any[]>([]);
  const [bulkSummary, setBulkSummary] = useState<{ total: number; valid: number; invalid: number } | null>(null);
  const [uploadingBulk, setUploadingBulk] = useState(false);
  const [uploadStatusMsg, setUploadStatusMsg] = useState<string | null>(null);
  const bulkFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.products && Array.isArray(data.products)) {
        setProducts(data.products);
      } else if (Array.isArray(data.data)) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      alert("Product removed from view!");
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Handle Manual Product Submit
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...newProduct,
        price: newProduct.price ? parseFloat(newProduct.price) : undefined,
        id: `prod-${Date.now()}`,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success || data.product) {
        setShowAddModal(false);
        fetchProducts();
        alert("Product added successfully!");
        setNewProduct({
          name: "",
          brand: "Newtech Wood",
          category: "Decking",
          collection: "",
          width: "",
          height: "",
          thickness: "",
          finish: "",
          description: "",
          price: "",
          priceUnit: "per SQM",
          imageUrl: "",
          galleryImages: [],
          catalogPdfUrl: "",
          applicationTags: [],
        });
      }
    } catch (err) {
      console.error("Create product error:", err);
    }
  };

  // Excel Parse & Preview
  const handleExcelSelect = async (file: File) => {
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
            width: r["Width"] || "",
            height: r["Height"] || "",
            thickness: r["Thickness"] || "",
            finish: r["Finish"] || "",
            description: r["Description"] || "",
            price: r["Price"] || "",
            priceUnit: r["Price Unit"] || "per SQM",
            imageUrl: r["Image URL"] || r["Image"] || "",
            catalogPdfUrl: r["PDF URL"] || r["PDF"] || "",
            applicationTags: r["Application Tags"] ? String(r["Application Tags"]).split(",") : [],
            isValid,
          };
        });

        setPreviewRows(parsedRows);
        setBulkSummary({ total: parsedRows.length, valid: validCount, invalid: invalidCount });
      } catch (err) {
        console.error("Excel parse error:", err);
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
        setUploadStatusMsg(`Success summary: ${result.importedCount || bulkSummary?.valid} products added successfully!`);
        fetchProducts();
        setPreviewRows([]);
        setBulkFile(null);
      } else {
        setUploadStatusMsg(`Upload error: ${result.error || "Failed to import"}`);
      }
    } catch (err: any) {
      setUploadStatusMsg(`Import error: ${err.message}`);
    } finally {
      setUploadingBulk(false);
    }
  };

  const filteredBrands = brandsList.filter((b) =>
    b.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchesQuery =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="bg-[#FAF8F5] text-[#1E1E1E] min-h-screen font-['Jost',sans-serif]">
      {/* Mobile Header Bar & Sidebar Toggle */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-10 h-10 rounded-full bg-[#1E1E1E] text-white flex items-center justify-center shadow-lg"
          aria-label="Toggle navigation"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AdminNav />

      <main className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12 py-8 md:py-10">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-[#81663f] text-xs font-bold uppercase tracking-widest block">
              AAREN Studio Admin Control
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-black uppercase tracking-tight">
              Product Catalog Management
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-full bg-[#1E1E1E] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#81663f] transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-4 border-b border-black/10 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap \${
              activeTab === "catalog" ? "border-[#81663f] text-[#81663f]" : "border-transparent text-black/50 hover:text-black"
            }`}
          >
            Product Catalog ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("bulk")}
            className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap \${
              activeTab === "bulk" ? "border-[#81663f] text-[#81663f]" : "border-transparent text-black/50 hover:text-black"
            }`}
          >
            Bulk Excel Upload
          </button>
        </div>

        {/* TAB 1: CATALOG LISTING */}
        {activeTab === "catalog" && (
          <div>
            {/* Search & Category Toolbar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl border border-black/10 shadow-sm">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                <input
                  type="text"
                  placeholder="Search products by name or brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2 rounded-full border border-black/15 bg-[#FAF8F5] text-xs font-medium focus:outline-none focus:border-[#81663f]"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                {["All", ...PREDEFINED_CATEGORIES].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer \${
                      selectedCategory === cat ? "bg-[#1E1E1E] text-white" : "bg-black/5 text-black/70 hover:bg-black/10"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Catalog Table (hidden on mobile <768px) */}
            <div className="hidden md:block bg-white rounded-2xl border border-black/10 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
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
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-black/[0.02] transition-colors">
                      <td className="p-4 font-bold text-black flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                          {p.imageUrl && <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />}
                        </div>
                        <span>{p.name}</span>
                      </td>
                      <td className="p-4 font-semibold text-[#81663f]">{p.brand}</td>
                      <td className="p-4 font-medium">{p.category}</td>
                      <td className="p-4 text-black/60">{p.collection || "—"}</td>
                      <td className="p-4 font-bold">{p.price ? `₹\${p.price.toLocaleString("en-IN")} \${p.priceUnit || ""}` : "Quote Request"}</td>
                      <td className="p-4 flex items-center gap-3">
                        <Link href={`/products/\${p.id}`} className="p-2 rounded-lg bg-black/5 hover:bg-black/10 text-black/70 transition-colors">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Layout Fallback (<768px) */}
            <div className="md:hidden space-y-3">
              {filteredProducts.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-black/10 text-xs text-black/50">
                  No products match your search.
                </div>
              ) : (
                filteredProducts.map((p) => (
                  <div key={p.id} className="p-4 bg-white rounded-2xl border border-black/10 shadow-sm flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-black/5">
                        {p.imageUrl && <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#81663f] block">
                          {p.brand}
                        </span>
                        <h4 className="text-sm font-bold text-black truncate">{p.name}</h4>
                        <span className="text-xs text-black/50">{p.category} {p.collection ? `• \${p.collection}` : ""}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-black/5 text-xs">
                      <span className="font-bold text-black">
                        {p.price ? `₹\${p.price.toLocaleString("en-IN")} \${p.priceUnit || ""}` : "Quote Request"}
                      </span>
                      <div className="flex items-center gap-2">
                        <Link href={`/products/\${p.id}`} className="px-3 py-1.5 rounded-lg bg-black/5 text-black font-semibold">
                          View
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: BULK EXCEL UPLOAD */}
        {activeTab === "bulk" && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/10 shadow-sm max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-black/10">
              <div>
                <h3 className="text-lg font-bold text-black uppercase tracking-tight">Bulk Excel Product Import</h3>
                <p className="text-xs text-black/60 mt-0.5">Upload multiple products simultaneously via standardized .xlsx spreadsheet.</p>
              </div>

              <a
                href="/api/admin/template/excel"
                download
                className="px-4 py-2.5 rounded-full border border-[#81663f] text-[#81663f] hover:bg-[#81663f] hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Download Excel Template</span>
              </a>
            </div>

            {/* Drag and Drop Zone */}
            <div
              onClick={() => bulkFileInputRef.current?.click()}
              className="border-2 border-dashed border-black/20 hover:border-[#81663f] rounded-2xl p-8 sm:p-10 text-center cursor-pointer bg-[#FAF8F5] transition-all mb-6"
            >
              <Upload className="w-8 h-8 text-[#81663f] mx-auto mb-2" />
              <h4 className="text-sm font-bold text-black uppercase tracking-wider">Drag &amp; Drop .xlsx Excel File Here</h4>
              <p className="text-xs text-black/50 mt-1">or click to browse from your device</p>
              <input
                ref={bulkFileInputRef}
                type="file"
                accept=".xlsx, .xls"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleExcelSelect(e.target.files[0])}
              />
            </div>

            {/* Status Message */}
            {uploadStatusMsg && (
              <div className="p-4 rounded-xl bg-black/5 border border-black/10 text-xs font-semibold mb-6 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#81663f]" />
                <span>{uploadStatusMsg}</span>
              </div>
            )}

            {/* Preview Table */}
            {previewRows.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-black">
                    Preview ({bulkSummary?.valid} Valid, {bulkSummary?.invalid} Invalid)
                  </span>

                  <button
                    onClick={handleConfirmBulkInsert}
                    disabled={uploadingBulk || (bulkSummary?.valid === 0)}
                    className="px-6 py-2.5 rounded-full bg-[#1E1E1E] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#81663f] transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {uploadingBulk ? "Importing..." : "Confirm &amp; Import Products &rarr;"}
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

        {/* MANUAL ADD NEW PRODUCT MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#121316] border border-[#81663f]/40 text-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-500 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>

              <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-6">
                Add New Architectural Product
              </h3>

              <form onSubmit={handleCreateProduct} className="flex flex-col gap-4 text-xs">
                {/* Product Name */}
                <div>
                  <label className="block text-white/70 font-semibold mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UltraShield Naturale Decking"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#81663f]"
                  />
                </div>

                {/* Brand Search & Dropdown */}
                <div className="relative">
                  <label className="block text-white/70 font-semibold mb-1">Brand Name *</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search or select brand..."
                      value={brandSearch || newProduct.brand}
                      onFocus={() => setShowBrandDropdown(true)}
                      onChange={(e) => {
                        setBrandSearch(e.target.value);
                        setNewProduct({ ...newProduct, brand: e.target.value });
                        setShowBrandDropdown(true);
                      }}
                      className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#81663f]"
                    />
                    {showBrandDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-[#1e2026] border border-white/20 rounded-xl overflow-hidden z-20 max-h-48 overflow-y-auto shadow-2xl">
                        {filteredBrands.map((b) => (
                          <div
                            key={b}
                            onClick={() => {
                              setNewProduct({ ...newProduct, brand: b });
                              setBrandSearch(b);
                              setShowBrandDropdown(false);
                            }}
                            className="p-3 hover:bg-[#81663f] cursor-pointer text-white text-xs font-semibold"
                          >
                            {b}
                          </div>
                        ))}
                        <div
                          onClick={() => {
                            const custom = prompt("Enter new brand name:");
                            if (custom) {
                              setBrandsList((prev) => [...prev, custom]);
                              setNewProduct({ ...newProduct, brand: custom });
                              setBrandSearch(custom);
                            }
                            setShowBrandDropdown(false);
                          }}
                          className="p-3 bg-[#81663f]/30 hover:bg-[#81663f] cursor-pointer text-[#81663f] hover:text-white text-xs font-bold border-t border-white/10"
                        >
                          + Add Custom Brand
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Category Dropdown */}
                <div>
                  <label className="block text-white/70 font-semibold mb-1">Category *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => {
                      if (e.target.value === "__NEW__") {
                        const customCat = prompt("Enter new category name:");
                        if (customCat) {
                          setNewProduct({ ...newProduct, category: customCat });
                        }
                      } else {
                        setNewProduct({ ...newProduct, category: e.target.value });
                      }
                    }}
                    className="w-full p-3 rounded-xl bg-[#1e2026] border border-white/20 text-white focus:outline-none focus:border-[#81663f]"
                  >
                    {PREDEFINED_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="__NEW__">+ Add New Category...</option>
                  </select>
                </div>

                {/* Collection & Finish */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 font-semibold mb-1">Collection Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Naturale Series"
                      value={newProduct.collection}
                      onChange={(e) => setNewProduct({ ...newProduct, collection: e.target.value })}
                      className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 font-semibold mb-1">Finish</label>
                    <input
                      type="text"
                      placeholder="e.g. Teak Composite"
                      value={newProduct.finish}
                      onChange={(e) => setNewProduct({ ...newProduct, finish: e.target.value })}
                      className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white"
                    />
                  </div>
                </div>

                {/* Price & Unit */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 font-semibold mb-1">Price (INR)</label>
                    <input
                      type="number"
                      placeholder="e.g. 6400"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 font-semibold mb-1">Price Unit</label>
                    <select
                      value={newProduct.priceUnit}
                      onChange={(e) => setNewProduct({ ...newProduct, priceUnit: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#1e2026] border border-white/20 text-white"
                    >
                      {PREDEFINED_PRICE_UNITS.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Image & PDF URLs */}
                <div>
                  <label className="block text-white/70 font-semibold mb-1">Hero Image URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={newProduct.imageUrl}
                    onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1">PDF Catalog URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newProduct.catalogPdfUrl}
                    onChange={(e) => setNewProduct({ ...newProduct, catalogPdfUrl: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-white/70 font-semibold mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Product details, architectural specs..."
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="mt-4 py-3.5 rounded-full bg-[#81663f] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#a38354] transition-all shadow-lg cursor-pointer"
                >
                  Save Product to Catalog &rarr;
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
"""

with open('src/app/admin/products/page.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated src/app/admin/products/page.tsx successfully!")
