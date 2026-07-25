"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductItem } from "@/lib/store";

import AdminNav from "@/components/AdminNav";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");

  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "Aaren",
    category: "Furniture",
    subcategory: "",
    width: "",
    height: "",
    depth: "",
    thickness: "",
    material: "",
    finish: "",
    image: "",
    description: "",
    price: "",
    qtyInStock: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.products) setProducts(data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    setUploadMessage("Processing Excel file...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/products/import", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (result.success) {
        setUploadMessage(`Success! Added ${result.count} products from Excel.`);
        fetchProducts();
      } else {
        setUploadMessage(`Error: ${result.error || "Failed to import"}`);
      }
    } catch (err: any) {
      setUploadMessage(`Error: ${err.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price) || 0,
          qtyInStock: parseInt(newProduct.qtyInStock, 10) || 0,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setNewProduct({
          name: "",
          brand: "Aaren",
          category: "Furniture",
          subcategory: "",
          width: "",
          height: "",
          depth: "",
          material: "",
          finish: "",
          image: "",
          description: "",
          price: "",
          qtyInStock: "",
        });
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];
  const brands = ["All", ...Array.from(new Set(products.map((p) => p.brand)))];

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchesBrand = selectedBrand === "All" || p.brand === selectedBrand;
    const matchesQuery =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesBrand && matchesQuery;
  });

  return (
    <div style={{ background: "#0a0a0c", color: "#f0f0f2", minHeight: "100vh" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid #222", paddingBottom: "1.5rem" }}>
        <div>
          <div style={{ fontSize: "0.85rem", color: "#888", letterSpacing: "0.1em", textTransform: "uppercase" }}>AAREN STUDIO ADMIN</div>
          <h1 style={{ fontSize: "2.4rem", fontWeight: 700, margin: "0.2rem 0" }}>Product Management</h1>
          <p style={{ color: "#aaa", fontSize: "0.95rem" }}>Upload Excel catalogs, manage products, finishes, and dimensions.</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link href="/admin/projects" style={{ padding: "0.8rem 1.4rem", background: "#222", color: "#fff", textDecoration: "none", borderRadius: "6px", fontSize: "0.9rem", fontWeight: 600 }}>
            Go to Projects PDF Generator →
          </Link>
          <button
            onClick={() => setShowAddModal(true)}
            style={{ padding: "0.8rem 1.4rem", background: "#fff", color: "#000", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.9rem", fontWeight: 600 }}
          >
            + Add Product Manually
          </button>
        </div>
      </div>

      {/* Excel Upload Card */}
      <div style={{ background: "#141418", border: "1px dashed #333", borderRadius: "12px", padding: "2rem", marginBottom: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "0.5rem" }}>Bulk Product Import (Excel / CSV)</div>
        <p style={{ color: "#888", fontSize: "0.9rem", marginBottom: "1.5rem", maxWidth: "600px", margin: "0 auto 1.5rem" }}>
          Upload your <code>Aaren Product list for website.xlsx</code> file directly. Product names, brands, sizes, finishes, descriptions, and categories will automatically parse into the database.
        </p>

        <input
          type="file"
          accept=".xlsx, .xls, .csv"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileUpload(e.target.files[0]);
            }
          }}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          style={{
            padding: "0.9rem 2rem",
            background: uploading ? "#444" : "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: uploading ? "not-allowed" : "pointer",
            fontWeight: 600,
            fontSize: "0.95rem",
          }}
        >
          {uploading ? "Uploading & Processing..." : "📁 Upload Excel File (.xlsx)"}
        </button>

        {uploadMessage && (
          <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: uploadMessage.startsWith("Error") ? "#f87171" : "#4ade80" }}>
            {uploadMessage}
          </div>
        )}
      </div>

      {/* Filter & Search Controls */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem", background: "#141418", padding: "1rem", borderRadius: "8px" }}>
        <input
          type="text"
          placeholder="Search products by name, brand, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, minWidth: "240px", padding: "0.7rem 1rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px", fontSize: "0.9rem" }}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ padding: "0.7rem 1rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px", fontSize: "0.9rem" }}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              Category: {c}
            </option>
          ))}
        </select>

        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          style={{ padding: "0.7rem 1rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px", fontSize: "0.9rem" }}
        >
          {brands.map((b) => (
            <option key={b} value={b}>
              Brand: {b}
            </option>
          ))}
        </select>
      </div>

      {/* Product List Table */}
      <div style={{ background: "#141418", border: "1px solid #222", borderRadius: "8px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ background: "#1a1a20", color: "#888", borderBottom: "1px solid #222", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>
              <th style={{ padding: "1rem" }}>Product</th>
              <th style={{ padding: "1rem" }}>Brand</th>
              <th style={{ padding: "1rem" }}>Category</th>
              <th style={{ padding: "1rem" }}>Finish</th>
              <th style={{ padding: "1rem" }}>Dimensions / Size</th>
              <th style={{ padding: "1rem" }}>Thickness</th>
              <th style={{ padding: "1rem" }}>Stock</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "#888" }}>
                  Loading catalog products...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "#888" }}>
                  No products found matching filters.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid #222" }}>
                  <td style={{ padding: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ position: "relative", width: "48px", height: "48px", borderRadius: "4px", overflow: "hidden", background: "#222" }}>
                      <Image src={p.imageUrl} alt={p.name} fill style={{ objectFit: "cover" }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: "#fff" }}>{p.name}</div>
                      <div style={{ fontSize: "0.8rem", color: "#777" }}>{p.description.slice(0, 50)}...</div>
                    </div>
                  </td>
                  <td style={{ padding: "1rem", color: "#3b82f6", fontWeight: 600 }}>{p.brand}</td>
                  <td style={{ padding: "1rem", color: "#aaa" }}>{p.category}</td>
                  <td style={{ padding: "1rem", color: "#ccc" }}>{p.finish || "Standard"}</td>
                  <td style={{ padding: "1rem", color: "#888" }}>
                    {p.width ? `${p.width} x ${p.height || "-"} x ${p.depth || "-"}` : "Standard"}
                  </td>
                  <td style={{ padding: "1rem", color: "#888" }}>{p.thickness || "-"}</td>
                  <td style={{ padding: "1rem", color: "#4ade80" }}>{p.qtyInStock ?? 10} pcs</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Manual Add Product Modal */}
      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ background: "#141418", border: "1px solid #333", borderRadius: "12px", width: "100%", maxWidth: "600px", padding: "2rem", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Add New Product</h2>
            <form onSubmit={handleCreateProduct} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#888", marginBottom: "0.3rem" }}>Product Name *</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#888", marginBottom: "0.3rem" }}>Brand *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#888", marginBottom: "0.3rem" }}>Category *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#888", marginBottom: "0.3rem" }}>Width</label>
                  <input
                    type="text"
                    value={newProduct.width}
                    onChange={(e) => setNewProduct({ ...newProduct, width: e.target.value })}
                    style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#888", marginBottom: "0.3rem" }}>Height</label>
                  <input
                    type="text"
                    value={newProduct.height}
                    onChange={(e) => setNewProduct({ ...newProduct, height: e.target.value })}
                    style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#888", marginBottom: "0.3rem" }}>Thickness</label>
                  <input
                    type="text"
                    value={newProduct.thickness}
                    onChange={(e) => setNewProduct({ ...newProduct, thickness: e.target.value })}
                    style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#888", marginBottom: "0.3rem" }}>Finish</label>
                <input
                  type="text"
                  value={newProduct.finish}
                  onChange={(e) => setNewProduct({ ...newProduct, finish: e.target.value })}
                  style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#888", marginBottom: "0.3rem" }}>Description</label>
                <textarea
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: "0.7rem 1.2rem", background: "#222", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "0.7rem 1.4rem", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 600 }}
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </main>
    </div>
  );
}
