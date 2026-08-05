"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ChevronRight, SlidersHorizontal } from "lucide-react";
import { ProductItem } from "@/lib/types";

// Categories data for Section 2
const CATEGORIES_FILTER_LIST = [
  { id: "All", label: "All", symbol: "A", count: 300 },
  { id: "Decking", label: "Decking", symbol: "D", count: 45 },
  { id: "Cladding", label: "Cladding", symbol: "C", count: 38 },
  { id: "Surfaces", label: "Surfaces", symbol: "S", count: 90 },
  { id: "Bathroom", label: "Bathroom", symbol: "B", count: 62 },
  { id: "Flooring", label: "Flooring", symbol: "F", count: 55 },
  { id: "Doors", label: "Doors", symbol: "W", count: 24 },
  { id: "Kitchen", label: "Kitchen", symbol: "K", count: 18 },
  { id: "Tiles", label: "Tiles", symbol: "T", count: 40 },
];

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state
  const brandParam = searchParams.get("brand") || "";
  const categoryParam = searchParams.get("category") || "All";
  const queryParam = searchParams.get("q") || "";

  // Local state
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    brandParam ? brandParam.split(",").map((s) => s.trim().toLowerCase()) : []
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [searchQuery, setSearchQuery] = useState<string>(queryParam);
  const [debouncedQuery, setDebouncedQuery] = useState<string>(queryParam);
  const [sortOption, setSortOption] = useState<"featured" | "newest" | "az">("featured");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showAllBrands, setShowAllBrands] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [brandsList, setBrandsList] = useState<{ id: string; name: string; count: number }[]>([]);

  // Sync state with URL params when URL changes
  useEffect(() => {
    const bp = searchParams.get("brand") || "";
    const cp = searchParams.get("category") || "All";
    const qp = searchParams.get("q") || "";

    setSelectedBrands(bp ? bp.split(",").map((s) => s.trim().toLowerCase()) : []);
    setSelectedCategory(cp);
    setSearchQuery(qp);
    setDebouncedQuery(qp);
  }, [searchParams]);

  // Debounce search query 200ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 200);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch products & brands from API
  useEffect(() => {
    fetch("/api/products?t=" + Date.now(), { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (json && json.success && Array.isArray(json.data)) {
          setProducts(json.data);

          // Calculate brand counts
          const counts: Record<string, { name: string; count: number }> = {};
          json.data.forEach((p: ProductItem) => {
            const bName = p.brand || "Curated";
            const bId = bName.toLowerCase().replace(/[^a-z0-9]/g, "-");
            if (!counts[bId]) {
              counts[bId] = { name: bName, count: 0 };
            }
            counts[bId].count += 1;
          });

          const list = Object.entries(counts).map(([id, val]) => ({
            id,
            name: val.name,
            count: val.count,
          }));
          setBrandsList(list);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Update URL params without page reload
  const updateUrl = (newBrands: string[], newCat: string, newQ: string) => {
    const params = new URLSearchParams();
    if (newBrands.length > 0) params.set("brand", newBrands.join(","));
    if (newCat && newCat !== "All") params.set("category", newCat);
    if (newQ) params.set("q", newQ);

    const queryString = params.toString();
    const newPath = queryString ? `/products?${queryString}` : "/products";
    router.push(newPath, { scroll: false });
  };

  // Toggle brand selection (multi-select)
  const toggleBrand = (brandId: string) => {
    const norm = brandId.toLowerCase();
    let updated: string[];
    if (selectedBrands.includes(norm)) {
      updated = selectedBrands.filter((b) => b !== norm);
    } else {
      updated = [...selectedBrands, norm];
    }
    setSelectedBrands(updated);
    setCurrentPage(1);
    updateUrl(updated, selectedCategory, debouncedQuery);
  };

  // Single-select category
  const selectCategory = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
    updateUrl(selectedBrands, catId, debouncedQuery);
  };

  // Search input change handler
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
    updateUrl(selectedBrands, selectedCategory, val);
  };

  // Clear single filter
  const removeBrandFilter = (brandId: string) => {
    const updated = selectedBrands.filter((b) => b !== brandId);
    setSelectedBrands(updated);
    setCurrentPage(1);
    updateUrl(updated, selectedCategory, debouncedQuery);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedCategory("All");
    setSearchQuery("");
    setDebouncedQuery("");
    setCurrentPage(1);
    router.push("/products", { scroll: false });
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const normBrand = (p.brand || "").toLowerCase().replace(/[^a-z0-9]/g, "-");
      const normName = (p.name || "").toLowerCase();
      const normCat = (p.category || "").toLowerCase();

      // Brand filter
      const matchesBrand =
        selectedBrands.length === 0 ||
        selectedBrands.some((sb) => normBrand.includes(sb) || sb.includes(normBrand));

      // Category & Collection/Tags filter
      const matchesCategory =
        selectedCategory === "All" ||
        normCat.includes(selectedCategory.toLowerCase()) ||
        selectedCategory.toLowerCase().includes(normCat) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(selectedCategory.toLowerCase())) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(selectedCategory.toLowerCase())));

      // Query filter
      const matchesQuery =
        !debouncedQuery ||
        normName.includes(debouncedQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        normCat.includes(debouncedQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(debouncedQuery.toLowerCase()));

      return matchesBrand && matchesCategory && matchesQuery;
    });
  }, [products, selectedBrands, selectedCategory, debouncedQuery]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortOption === "newest") {
      return list.reverse();
    }
    if (sortOption === "az") {
      return list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [filteredProducts, sortOption]);

  // Calculate dynamic category counts from loaded products
  const categoriesList = useMemo(() => {
    const counts: Record<string, number> = { All: products.length };
    products.forEach((p) => {
      const c = (p.category || "Other").trim();
      counts[c] = (counts[c] || 0) + 1;
    });

    const defaultCategories = ["All", "Decking", "Cladding", "Surfaces", "Bathroom", "Flooring", "Doors", "Kitchen", "Tiles"];
    const allCatNames = Array.from(new Set([...defaultCategories, ...Object.keys(counts)]));

    return allCatNames.map((catName) => ({
      id: catName,
      label: catName,
      symbol: catName.charAt(0).toUpperCase(),
      count: counts[catName] || 0,
    }));
  }, [products]);

  // Pagination (20 per page)
  const pageSize = 20;
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / pageSize));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedProducts.slice(start, start + pageSize);
  }, [sortedProducts, currentPage]);

  const visibleBrands = showAllBrands ? brandsList : brandsList.slice(0, 7);

  return (
    <div className="products-container">
      {/* ── PAGE HEADER ── */}
      <div className="products-page-header">
        <div className="eyebrow">AAREN Studio</div>
        <h1 className="title">Products</h1>
        <p className="subtitle">
          All materials, surfaces and systems — {products.length}+ products across {brandsList.length || 16} brands
        </p>
      </div>

      {/* ── MOBILE FILTER TOGGLE BUTTON ── */}
      <div className="mobile-filter-bar">
        <button
          className="mobile-filter-btn"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        >
          <SlidersHorizontal size={14} />
          <span>Filters {selectedBrands.length > 0 || selectedCategory !== "All" ? `(${selectedBrands.length + (selectedCategory !== "All" ? 1 : 0)})` : ""}</span>
        </button>
      </div>

      {/* ── LAYOUT: TWO-COLUMN (SIDEBAR + MAIN) ── */}
      <div className="products-layout">
        {/* ── LEFT SIDEBAR (200px fixed, sticky on scroll) ── */}
        <aside className={`products-sidebar ${mobileSidebarOpen ? "is-open" : ""}`}>
          {/* Section 1: BRAND FILTER */}
          <div className="sidebar-section">
            <div className="sidebar-label">Brand</div>
            <div className="brand-list">
              {visibleBrands.map((b) => {
                const isActive = selectedBrands.includes(b.id);
                return (
                  <button
                    key={b.id}
                    className={`brand-item ${isActive ? "active" : ""}`}
                    onClick={() => toggleBrand(b.id)}
                  >
                    <span className={`dot ${isActive ? "filled" : "hollow"}`} />
                    <span className="brand-name">{b.name}</span>
                    <span className="brand-count">{b.count}</span>
                  </button>
                );
              })}
            </div>

            {brandsList.length > 7 && (
              <button
                className="toggle-more-brands"
                onClick={() => setShowAllBrands(!showAllBrands)}
              >
                {showAllBrands ? "— Show less" : `+ ${brandsList.length - 7} more brands`}
              </button>
            )}
          </div>

          {/* Section 2: CATEGORY FILTER */}
          <div className="sidebar-section" style={{ marginTop: "24px" }}>
            <div className="sidebar-label">Category</div>
            <div className="category-stack">
              {categoriesList.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    className={`cat-btn ${isActive ? "active" : ""}`}
                    onClick={() => selectCategory(cat.id)}
                  >
                    <span className="cat-circle">{cat.symbol}</span>
                    <span className="cat-text">{cat.label}</span>
                    <span className="cat-badge">{cat.count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ── MAIN AREA ── */}
        <main className="products-main">
          {/* Top Bar */}
          <div className="top-bar">
            <div className="search-box">
              <Search size={14} className="search-icon" />
              <input
                className="search-input"
                placeholder="Search products..."
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>

            <div className="sort-box">
              <select
                className="sort-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="az">A–Z</option>
              </select>
            </div>

            <div className="result-count">
              Showing {sortedProducts.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}–
              {Math.min(currentPage * pageSize, sortedProducts.length)} of {sortedProducts.length}
            </div>
          </div>

          {/* Active Filter Tags */}
          {(selectedBrands.length > 0 || selectedCategory !== "All" || debouncedQuery) && (
            <div className="active-filter-tags">
              {selectedBrands.map((bId) => {
                const bObj = brandsList.find((b) => b.id === bId);
                const label = bObj ? bObj.name : bId;
                return (
                  <span key={bId} className="filter-pill">
                    {label}
                    <X size={12} className="remove-icon" onClick={() => removeBrandFilter(bId)} />
                  </span>
                );
              })}

              {selectedCategory !== "All" && (
                <span className="filter-pill">
                  {selectedCategory}
                  <X size={12} className="remove-icon" onClick={() => selectCategory("All")} />
                </span>
              )}

              {debouncedQuery && (
                <span className="filter-pill">
                  &quot;{debouncedQuery}&quot;
                  <X size={12} className="remove-icon" onClick={() => handleSearchChange("")} />
                </span>
              )}

              <button className="clear-all-btn" onClick={clearAllFilters}>
                Clear all
              </button>
            </div>
          )}

          {/* Product Grid (4 items per row, 20 items per page) */}
          <div className="product-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.5rem" }}>
            {paginatedProducts.length === 0 ? (
              <div className="no-results">
                <p>No products match your current filters.</p>
                <button onClick={clearAllFilters} className="reset-btn">
                  Clear Filters
                </button>
              </div>
            ) : (
              paginatedProducts.map((prod) => {
                const prodSlug = prod.id || prod.name.toLowerCase().replace(/\s+/g, "-");
                const coverColor = (prod as any).coverColor || "#e2e8f0";

                return (
                  <Link href={`/products/${prodSlug}`} key={prod.id} className="product-card">
                    <div className="card-image-wrap" style={{ background: coverColor }}>
                      {prod.imageUrl ? (
                        <Image
                          src={prod.imageUrl}
                          alt={prod.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="card-img"
                          style={{ objectFit: "cover" }}
                          loading="lazy"
                        />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f8fafc", color: "#64748b", padding: "1.5rem", textAlign: "center", border: "1px solid rgba(0,0,0,0.06)" }}>
                          <span style={{ fontSize: "1.8rem", marginBottom: "0.4rem", opacity: 0.6 }}>📦</span>
                          <span style={{ fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8c764b" }}>{prod.brand || "AAREN"}</span>
                          <span style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "2px", fontWeight: 600 }}>Image Pending Upload</span>
                        </div>
                      )}
                    </div>

                    <div className="card-content">
                      <div className="brand-name-tag">{prod.brand || "AAREN"}</div>
                      <div className="product-title">{prod.name}</div>
                      <div className="category-pill">
                        <span>{prod.category}</span>
                        <ChevronRight size={10} />
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    className={`page-num-btn ${currentPage === pageNum ? "active" : ""}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                className="page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>

      <style jsx global>{`
        :root {
          --surface-0: #f8fafc;
          --surface-1: #ffffff;
          --surface-2: #f1f5f9;
          --border: #e2e8f0;
          --border-strong: #cbd5e1;
          --text-primary: #0f172a;
          --text-secondary: #475569;
          --text-muted: #94a3b8;
          --radius: 6px;
        }

        .products-container {
          background: var(--surface-0);
          color: var(--text-primary);
          min-height: 100vh;
          padding-top: 5rem;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .products-page-header {
          padding: 48px 32px 24px;
          border-bottom: 0.5px solid var(--border);
          background: #ffffff;
        }

        .products-page-header .eyebrow {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #8c764b;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .products-page-header .title {
          font-size: 30px;
          font-family: Georgia, serif;
          font-weight: 500;
          letter-spacing: -0.02em;
          color: var(--text-primary);
        }

        .products-page-header .subtitle {
          font-size: 13px;
          color: var(--text-secondary);
          margin-top: 6px;
        }

        .mobile-filter-bar {
          display: none;
          padding: 12px 16px;
          border-bottom: 0.5px solid var(--border);
          background: #ffffff;
        }

        .mobile-filter-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          padding: 8px 14px;
          border: 0.5px solid var(--border);
          border-radius: var(--radius);
          background: var(--surface-2);
          cursor: pointer;
        }

        .products-layout {
          display: grid;
          grid-template-columns: 200px 1fr;
          min-height: 80vh;
        }

        /* ── SIDEBAR ── */
        .products-sidebar {
          width: 200px;
          padding: 24px 16px;
          border-right: 0.5px solid var(--border);
          background: #ffffff;
          position: sticky;
          top: 5rem;
          height: calc(100vh - 5rem);
          overflow-y: auto;
        }

        .sidebar-label {
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-muted);
          font-weight: 700;
          margin-bottom: 12px;
        }

        .brand-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .brand-item {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 0;
          text-align: left;
          width: 100%;
        }

        .brand-item .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .brand-item .dot.filled {
          background: var(--text-primary);
        }

        .brand-item .dot.hollow {
          border: 1px solid var(--text-muted);
        }

        .brand-item .brand-name {
          font-size: 12px;
          color: var(--text-secondary);
          flex: 1;
        }

        .brand-item.active .brand-name {
          color: var(--text-primary);
          font-weight: 700;
        }

        .brand-item .brand-count {
          font-size: 10px;
          color: var(--text-muted);
        }

        .toggle-more-brands {
          margin-top: 10px;
          background: none;
          border: none;
          font-size: 11px;
          color: #8c764b;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
        }

        /* Category Stack */
        .category-stack {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .cat-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px 8px;
          border-radius: 20px;
          transition: background 0.15s ease;
          width: 100%;
          text-align: left;
        }

        .cat-btn:hover {
          background: var(--surface-2);
        }

        .cat-btn.active {
          background: var(--text-primary);
          color: #ffffff;
        }

        .cat-circle {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .cat-btn.active .cat-circle {
          background: #ffffff;
          color: var(--text-primary);
          border-color: #ffffff;
        }

        .cat-text {
          font-size: 12px;
          color: var(--text-secondary);
          flex: 1;
        }

        .cat-btn.active .cat-text {
          color: #ffffff;
          font-weight: 600;
        }

        .cat-badge {
          font-size: 10px;
          color: var(--text-muted);
        }

        .cat-btn.active .cat-badge {
          color: rgba(255,255,255,0.7);
        }

        /* ── MAIN AREA ── */
        .products-main {
          padding: 24px 32px;
          background: var(--surface-0);
        }

        .top-bar {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .search-box {
          flex: 1;
          min-width: 200px;
          position: relative;
        }

        .search-box :global(.search-icon) {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .search-input {
          width: 100%;
          padding: 8px 12px 8px 32px;
          font-size: 13px;
          border: 0.5px solid var(--border);
          border-radius: var(--radius);
          background: #ffffff;
          outline: none;
        }

        .sort-select {
          padding: 8px 12px;
          font-size: 12px;
          border: 0.5px solid var(--border);
          border-radius: var(--radius);
          background: #ffffff;
          outline: none;
          cursor: pointer;
        }

        .result-count {
          font-size: 12px;
          color: var(--text-muted);
          margin-left: auto;
          white-space: nowrap;
        }

        /* Filter Tags */
        .active-filter-tags {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .filter-pill {
          font-size: 11px;
          background: #ffffff;
          border: 0.5px solid var(--border);
          border-radius: 16px;
          padding: 4px 10px;
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-secondary);
        }

        .filter-pill :global(.remove-icon) {
          cursor: pointer;
          color: var(--text-muted);
        }

        .filter-pill :global(.remove-icon):hover {
          color: var(--text-primary);
        }

        .clear-all-btn {
          font-size: 11px;
          color: #8c764b;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 600;
          margin-left: 4px;
        }

        /* Product Grid (Hairline Border 3 Columns) */
        .product-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--border);
          border: 0.5px solid var(--border);
          border-radius: 6px;
          overflow: hidden;
        }

        .product-card {
          background: var(--surface-2);
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          transition: background 0.15s ease;
        }

        .product-card:hover {
          background: var(--surface-1);
        }

        .card-image-wrap {
          aspect-ratio: 1;
          position: relative;
          overflow: hidden;
        }

        .card-img {
          transition: transform 0.4s ease;
        }

        .product-card:hover .card-img {
          transform: scale(1.04);
        }

        .card-content {
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .brand-name-tag {
          font-size: 9px;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 0.08em;
          font-weight: 600;
        }

        .product-title {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-primary);
        }

        .category-pill {
          margin-top: 6px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          color: var(--text-secondary);
          background: var(--surface-0);
          border: 0.5px solid var(--border);
          padding: 2px 8px;
          border-radius: 12px;
          width: fit-content;
        }

        /* Pagination */
        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 36px;
        }

        .page-btn, .page-num-btn {
          font-size: 12px;
          padding: 6px 12px;
          border: 0.5px solid var(--border);
          border-radius: var(--radius);
          background: #ffffff;
          cursor: pointer;
          color: var(--text-secondary);
        }

        .page-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .page-num-btn.active {
          background: var(--text-primary);
          color: #ffffff;
          border-color: var(--text-primary);
        }

        .no-results {
          grid-column: 1 / -1;
          padding: 48px;
          text-align: center;
          background: #ffffff;
        }

        .no-results p {
          font-size: 14px;
          color: var(--text-muted);
          margin-bottom: 12px;
        }

        .reset-btn {
          font-size: 12px;
          padding: 8px 16px;
          background: #8c764b;
          color: #ffffff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        @media (max-width: 1024px) {
          .product-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .products-layout { grid-template-columns: 1fr; }
          .mobile-filter-bar { display: block; }

          .products-sidebar {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100vh;
            z-index: 100;
          }

          .products-sidebar.is-open {
            display: block;
          }

          .product-grid { grid-template-columns: 1fr; }
          .products-main { padding: 16px; }
        }
      `}</style>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div style={{ padding: "100px 32px", textAlign: "center" }}>Loading Products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
