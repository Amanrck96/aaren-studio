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

interface ProductsClientProps {
  initialProducts?: ProductItem[];
}

function ProductsContent({ initialProducts }: ProductsClientProps) {
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

  const [loading, setLoading] = useState<boolean>(!initialProducts || initialProducts.length === 0);
  const [products, setProducts] = useState<ProductItem[]>(initialProducts || []);

  const [brandsList, setBrandsList] = useState<{ id: string; name: string; count: number }[]>(() => {
    if (!initialProducts || initialProducts.length === 0) return [];
    const counts: Record<string, { name: string; count: number }> = {};
    initialProducts.forEach((p: ProductItem) => {
      const bName = p.brand || "Curated";
      const bId = bName.toLowerCase().replace(/[^a-z0-9]/g, "-");
      if (!counts[bId]) {
        counts[bId] = { name: bName, count: 0 };
      }
      counts[bId].count += 1;
    });
    return Object.entries(counts).map(([id, val]) => ({
      id,
      name: val.name,
      count: val.count,
    }));
  });

  // Sync state with URL params when URL changes
  useEffect(() => {
    const bp = searchParams.get("brand") || "";
    const cp = searchParams.get("category") || "All";
    const qp = searchParams.get("q") || searchParams.get("search") || "";

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

  // Fetch products & brands from API only if not passed from server
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) return;

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
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [initialProducts]);

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
      const normCatQuery = (selectedCategory || "").toLowerCase().trim();
      let matchesCategory = selectedCategory === "All" || !normCatQuery;

      if (!matchesCategory) {
        const normBrandLower = (p.brand || "").toLowerCase();
        const normSubCat = (p.subcategory || "").toLowerCase();

        if (normCat.includes(normCatQuery) || normCatQuery.includes(normCat)) {
          matchesCategory = true;
        } else if (normSubCat && (normSubCat.includes(normCatQuery) || normCatQuery.includes(normSubCat))) {
          matchesCategory = true;
        } else if (Boolean(p.tags && p.tags.some((t) => t.toLowerCase().includes(normCatQuery) || normCatQuery.includes(t.toLowerCase())))) {
          matchesCategory = true;
        } else if (normCatQuery.includes("plywood") || normCatQuery === "ply") {
          matchesCategory = normName.includes("ply") || normCat.includes("ply") || normBrandLower.includes("peelply") || Boolean(p.tags && p.tags.some((t) => t.toLowerCase().includes("ply")));
        } else if (normCatQuery.includes("facade")) {
          matchesCategory = normCat.includes("cladding") || normCat.includes("decking") || normName.includes("facade") || normName.includes("beam") || normName.includes("cladding") || Boolean(p.tags && p.tags.some((t) => t.toLowerCase().includes("facade")));
        } else if (normCatQuery.includes("laminate") || normCatQuery.includes("decorative")) {
          matchesCategory = normCat.includes("surface") || normCat.includes("laminate") || normName.includes("laminate") || normName.includes("fenix") || normName.includes("vis") || normBrandLower.includes("formica");
        } else if (normCatQuery.includes("floor") || normCatQuery.includes("wood")) {
          matchesCategory = normCat.includes("floor") || normName.includes("floor") || normBrandLower.includes("mafi");
        } else if (normCatQuery.includes("screen") || normCatQuery.includes("zipline")) {
          matchesCategory = normCat.includes("screen") || normName.includes("screen") || normBrandLower.includes("freedom");
        } else if (normCatQuery.includes("door")) {
          matchesCategory = normCat.includes("door") || normName.includes("door") || Boolean(normSubCat && normSubCat.includes("door"));
        } else if (normCatQuery.includes("window")) {
          matchesCategory = normCat.includes("window") || normName.includes("window");
        } else if (normCatQuery.includes("kitchen")) {
          matchesCategory = normCat.includes("kitchen") || normName.includes("kitchen") || Boolean(normSubCat && normSubCat.includes("kitchen"));
        } else if (normCatQuery.includes("wardrobe")) {
          matchesCategory = normCat.includes("wardrobe") || normName.includes("wardrobe");
        } else if (normCatQuery.includes("tile")) {
          matchesCategory = normCat.includes("tile") || normName.includes("tile") || normName.includes("slab") || normBrandLower.includes("mirage") || normBrandLower.includes("wow") || normBrandLower.includes("living");
        } else if (normCatQuery.includes("bath") || normCatQuery.includes("sanitary")) {
          matchesCategory = normCat.includes("bath") || normCat.includes("basin") || normCat.includes("shower") || normBrandLower.includes("falper") || normBrandLower.includes("fima");
        } else if (normCatQuery.includes("mirror")) {
          matchesCategory = normCat.includes("mirror") || normName.includes("mirror") || normBrandLower.includes("waltz");
        } else if (normCatQuery.includes("ital")) {
          matchesCategory =
            normName.includes("ital") ||
            normCat.includes("ital") ||
            Boolean(p.origin && p.origin.toLowerCase().includes("ital")) ||
            Boolean((p as any).origin && (p as any).origin.toLowerCase().includes("ital")) ||
            normBrandLower.includes("falper") ||
            normBrandLower.includes("fima") ||
            normBrandLower.includes("loco") ||
            normBrandLower.includes("mirage") ||
            normBrandLower.includes("inkiostro") ||
            normBrandLower.includes("florim") ||
            normBrandLower.includes("gelli") ||
            normBrandLower.includes("jacuzzi") ||
            normBrandLower.includes("alex turco") ||
            normBrandLower.includes("slashform") ||
            Boolean(p.tags && p.tags.some((t) => t.toLowerCase().includes("ital")));
        } else {
          matchesCategory =
            normName.includes(normCatQuery) ||
            Boolean(p.description && p.description.toLowerCase().includes(normCatQuery)) ||
            Boolean(p.origin && p.origin.toLowerCase().includes(normCatQuery)) ||
            Boolean((p as any).origin && (p as any).origin.toLowerCase().includes(normCatQuery));
        }
      }

      // Query filter
      const q = debouncedQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        normName.includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        normCat.includes(q) ||
        Boolean(p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
        Boolean(p.origin && p.origin.toLowerCase().includes(q)) ||
        Boolean((p as any).origin && (p as any).origin.toLowerCase().includes(q)) ||
        Boolean(p.tags && p.tags.some((t) => t.toLowerCase().includes(q))) ||
        Boolean(p.description && p.description.toLowerCase().includes(q));

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

    const defaultCategories = [
      "All",
      "Plywood",
      "Laminate",
      "Facade",
      "Decking",
      "Cladding",
      "Surfaces",
      "Wooden Flooring",
      "Flooring",
      "Screens",
      "Doors",
      "Door System",
      "Windows",
      "Kitchen",
      "Wardrobe",
      "Tiles",
      "Bathroom Fittings",
      "Sanitary Ware",
      "Mirrors",
      "Bathroom",
    ];
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

  // Truncated pagination range with dots (...)
  const paginationRange = useMemo(() => {
    const delta = 2;
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l !== undefined) {
        if (typeof i === "number" && i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (typeof i === "number" && i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      if (typeof i === "number") l = i;
    }

    return rangeWithDots;
  }, [currentPage, totalPages]);

  const visibleBrands = showAllBrands ? brandsList : brandsList.slice(0, 7);

  return (
    <div className="products-container">
      {/* ── PAGE HEADER ── */}
      <div className="products-page-header page-header">
        <div className="products-header__inner page-header__inner">
          <div className="eyebrow page-meta">AAREN STUDIO — MATERIAL LAB</div>
          <h1 className="title page-title">PRODUCTS</h1>
          <p className="subtitle page-desc">
            All materials, surfaces and systems — {products.length}+ products across {brandsList.length || 16} brands
          </p>
        </div>
      </div>

      {/* ── MOBILE FILTER BACKDROP & TOGGLE ── */}
      <div 
        className={`mobile-sidebar-backdrop ${mobileSidebarOpen ? "is-open" : ""}`}
        onClick={() => setMobileSidebarOpen(false)}
      />

      <div className="mobile-filter-bar">
        <button
          className="mobile-filter-btn"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        >
          <SlidersHorizontal size={14} />
          <span>Filters {selectedBrands.length > 0 || selectedCategory !== "All" ? `(${selectedBrands.length + (selectedCategory !== "All" ? 1 : 0)})` : ""}</span>
        </button>
        <span className="mobile-filter-count-label">
          {sortedProducts.length} items
        </span>
      </div>

      {/* ── LAYOUT: TWO-COLUMN (SIDEBAR + MAIN) ── */}
      <div className="products-layout">
        {/* ── LEFT SIDEBAR (200px fixed on desktop, drawer on mobile) ── */}
        <aside className={`products-sidebar ${mobileSidebarOpen ? "is-open" : ""}`}>
          {/* Mobile Drawer Header */}
          <div className="mobile-sidebar-header">
            <div className="mobile-sidebar-title">
              <SlidersHorizontal size={14} />
              <span>FILTERS</span>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              {(selectedBrands.length > 0 || selectedCategory !== "All" || debouncedQuery) && (
                <button className="mobile-clear-btn" onClick={clearAllFilters}>
                  Clear all
                </button>
              )}
              <button className="mobile-close-btn" onClick={() => setMobileSidebarOpen(false)} aria-label="Close filters">
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="sidebar-inner-scroll">
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
          </div>

          {/* Mobile Drawer Footer CTA */}
          <div className="mobile-sidebar-footer">
            <button 
              className="mobile-apply-btn"
              onClick={() => setMobileSidebarOpen(false)}
            >
              Show {sortedProducts.length} Results
            </button>
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

          {/* Product Grid (4 columns on desktop, 3 on tablet, 2 on mobile) */}
          <div className="product-grid">
            {loading && paginatedProducts.length === 0 ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="product-card skeleton-card" style={{ opacity: 0.7, pointerEvents: "none" }}>
                  <div className="card-image-wrap" style={{ background: "#e2e8f0", animation: "pulse 1.5s infinite" }} />
                  <div className="card-body">
                    <div style={{ height: "14px", width: "40%", background: "#e2e8f0", borderRadius: "4px", marginBottom: "8px" }} />
                    <div style={{ height: "18px", width: "80%", background: "#cbd5e1", borderRadius: "4px", marginBottom: "8px" }} />
                    <div style={{ height: "12px", width: "60%", background: "#f1f5f9", borderRadius: "4px" }} />
                  </div>
                </div>
              ))
            ) : paginatedProducts.length === 0 ? (
              <div className="no-results">
                <p>No products match your current filters.</p>
                <button onClick={clearAllFilters} className="reset-btn">
                  Clear Filters
                </button>
              </div>
            ) : (
              paginatedProducts.map((prod) => {
                const prodSlug = (prod as any).slug || (prod.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || prod.id;
                const coverColor = (prod as any).coverColor || "#e2e8f0";

                return (
                  <Link href={`/products/${prodSlug}`} key={prod.id} className="product-card">
                    <div className="card-image-wrap" style={{ background: coverColor }}>
                      {prod.imageUrl ? (
                        <Image
                          src={prod.imageUrl}
                          alt={prod.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                          className="card-img"
                          style={{ objectFit: "cover" }}
                          loading="lazy"
                        />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%)", color: "#64748b", padding: "1.2rem", textAlign: "center" }}>
                          <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(140,118,75,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#8c764b", fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                            {(prod.brand || "A")[0].toUpperCase()}
                          </div>
                          <span style={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8c764b" }}>{prod.brand || "AAREN"}</span>
                          <span style={{ fontSize: "0.68rem", color: "#94a3b8", marginTop: "2px", fontWeight: 600 }}>Material Surface</span>
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

          {/* Clean Truncated Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((prev) => Math.max(1, prev - 1));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Prev
              </button>

              {paginationRange.map((item, idx) => {
                if (item === "...") {
                  return (
                    <span key={`dots-${idx}`} className="page-dots">
                      ...
                    </span>
                  );
                }
                const pageNum = item as number;
                return (
                  <button
                    key={pageNum}
                    className={`page-num-btn ${currentPage === pageNum ? "active" : ""}`}
                    onClick={() => {
                      setCurrentPage(pageNum);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                className="page-btn"
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>

      <style jsx global>{`
        :root {
          --surface-0: #E6E2D8;
          --surface-1: #FAF9F6;
          --surface-2: #EDE8DF;
          --border: rgba(129, 102, 63, 0.18);
          --border-strong: rgba(129, 102, 63, 0.35);
          --text-primary: #1C1917;
          --text-secondary: #5E5852;
          --text-muted: rgba(129, 102, 63, 0.6);
          --radius: 6px;
        }

        .products-container {
          background: var(--surface-0);
          color: var(--text-primary);
          min-height: 100vh;
          padding-top: 8rem;
          font-family: var(--font-jost), 'Jost', system-ui, sans-serif;
        }

        .products-page-header {
          padding-top: 8rem;
          padding-bottom: 4rem;
          padding-left: 0;
          padding-right: 0;
          border-bottom: 0.1rem solid rgba(129, 102, 63, 0.18);
          background: #E6E2D8;
        }

        .products-layout {
          display: grid;
          grid-template-columns: 220px 1fr;
          min-height: 80vh;
          max-width: 1600px;
          margin: 0 auto;
          padding-left: 4rem;
          padding-right: 4rem;
          box-sizing: border-box;
        }

        @media (max-width: 1024px) {
          .products-layout {
            padding-left: 3rem;
            padding-right: 3rem;
          }
        }

        @media (max-width: 768px) {
          .products-layout {
            grid-template-columns: 1fr;
            padding-left: 2rem;
            padding-right: 2rem;
          }
        }

        /* ── SIDEBAR ── */
        .products-sidebar {
          width: 220px;
          padding: 24px 20px 24px 0;
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
          padding: 24px 0 24px 32px;
          background: var(--surface-0);
        }

        @media (max-width: 768px) {
          .products-main {
            padding: 20px 0;
          }
        }

        .top-bar {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .search-box {
          flex: 1;
          min-width: 220px;
          position: relative;
        }

        .search-box :global(.search-icon) {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .search-input {
          width: 100%;
          padding: 10px 14px 10px 36px;
          font-size: 13px;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          background: #ffffff;
          outline: none;
        }

        .sort-select {
          padding: 10px 14px;
          font-size: 12px;
          font-weight: 600;
          border: 1px solid var(--border);
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
          font-weight: 600;
        }

        /* Filter Tags */
        .active-filter-tags {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .filter-pill {
          font-size: 11px;
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 5px 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-secondary);
          font-weight: 600;
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
          font-weight: 700;
          margin-left: 4px;
        }

        /* ── PRODUCT GRID (Clean 4-column layout) ── */
        .product-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .product-card {
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.06);
          border-color: rgba(140, 118, 75, 0.4);
        }

        .card-image-wrap {
          aspect-ratio: 1.1;
          position: relative;
          overflow: hidden;
          background: #f8fafc;
        }

        .card-img {
          transition: transform 0.5s ease !important;
        }

        .product-card:hover .card-img {
          transform: scale(1.05);
        }

        .card-content {
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: #ffffff;
          flex: 1;
        }

        .brand-name-tag {
          font-size: 10px;
          text-transform: uppercase;
          color: #8c764b;
          letter-spacing: 0.08em;
          font-weight: 800;
        }

        .product-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.35;

          /* Ellipsis after 2 lines */
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .category-pill {
          margin-top: 8px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          color: var(--text-secondary);
          background: var(--surface-2);
          border: 1px solid var(--border);
          padding: 3px 8px;
          border-radius: 12px;
          width: fit-content;
          font-weight: 600;
        }

        /* ── CLEAN PAGINATION ── */
        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid var(--border);
          flex-wrap: wrap;
        }

        .page-btn, .page-num-btn {
          font-size: 13px;
          font-weight: 600;
          padding: 8px 14px;
          min-width: 38px;
          height: 38px;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          background: #ffffff;
          cursor: pointer;
          color: var(--text-secondary);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .page-btn:hover:not(:disabled), .page-num-btn:hover {
          border-color: #8c764b;
          color: #8c764b;
        }

        .page-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .page-num-btn.active {
          background: #8c764b;
          color: #ffffff;
          border-color: #8c764b;
          box-shadow: 0 2px 8px rgba(140, 118, 75, 0.25);
        }

        .page-dots {
          font-size: 14px;
          color: var(--text-muted);
          padding: 0 6px;
          font-weight: 700;
          letter-spacing: 0.1em;
        }

        .no-results {
          grid-column: 1 / -1;
          padding: 48px;
          text-align: center;
          background: #ffffff;
          border-radius: 8px;
          border: 1px solid var(--border);
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
          font-weight: 700;
        }

        .mobile-sidebar-header,
        .mobile-sidebar-footer,
        .mobile-sidebar-backdrop {
          display: none;
        }

        .mobile-filter-count-label {
          font-size: 11px;
          color: var(--text-muted);
          font-weight: 600;
        }

        @media (max-width: 1200px) {
          .product-grid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 840px) {
          .product-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .products-layout { grid-template-columns: 1fr; }
          .mobile-filter-bar { 
            display: flex; 
            align-items: center; 
            justify-content: space-between; 
            max-width: 1600px;
            margin: 0 auto;
            padding: 12px 2rem;
            box-sizing: border-box;
            border-bottom: 0.5px solid var(--border);
            background: #ffffff;
            position: sticky;
            top: 4.5rem;
            z-index: 10;
          }

          .mobile-sidebar-backdrop.is-open {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            z-index: 99;
          }

          .products-sidebar {
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            width: 85%;
            max-width: 340px;
            height: 100vh;
            height: 100dvh;
            z-index: 100;
            background: #ffffff;
            border-left: 1px solid var(--border);
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: -4px 0 24px rgba(0,0,0,0.15);
            padding: 0;
            overflow: hidden;
          }

          .products-sidebar.is-open {
            transform: translateX(0);
          }

          .mobile-sidebar-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 20px;
            border-bottom: 1px solid var(--border);
            background: #ffffff;
            flex-shrink: 0;
          }

          .mobile-sidebar-title {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 0.1em;
            color: #8c764b;
          }

          .mobile-clear-btn {
            background: none;
            border: none;
            color: #8c764b;
            font-size: 11px;
            font-weight: 700;
            cursor: pointer;
            text-decoration: underline;
          }

          .mobile-close-btn {
            background: rgba(0,0,0,0.05);
            border: none;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-primary);
            cursor: pointer;
          }

          .sidebar-inner-scroll {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            -webkit-overflow-scrolling: touch;
          }

          .mobile-sidebar-footer {
            display: block;
            padding: 16px 20px;
            border-top: 1px solid var(--border);
            background: #ffffff;
            flex-shrink: 0;
          }

          .mobile-apply-btn {
            width: 100%;
            padding: 12px;
            background: #8c764b;
            color: #ffffff;
            border: none;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.05em;
            cursor: pointer;
            box-shadow: 0 4px 14px rgba(140, 118, 75, 0.35);
          }

          .products-main { padding: 16px; }
        }

        @media (max-width: 520px) {
          .product-grid { grid-template-columns: repeat(1, 1fr); }
        }
      `}</style>
    </div>
  );
}

export default function ProductsClient({ initialProducts }: ProductsClientProps) {
  return (
    <Suspense fallback={<div style={{ padding: "100px 32px", textAlign: "center" }}>Loading Products...</div>}>
      <ProductsContent initialProducts={initialProducts} />
    </Suspense>
  );
}
