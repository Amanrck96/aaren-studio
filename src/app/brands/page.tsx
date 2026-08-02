"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight } from "lucide-react";
import { ProductItem } from "@/lib/types";

export type CatalogThumb = {
  title: string;
  themeStyle?: React.CSSProperties;
  themeClass?: string;
};

export type BrandItemData = {
  id: string;
  name: string;
  category: string;
  origin: string;
  estYear: string;
  catalogCount: string;
  filterTag: string;
  catalogs: CatalogThumb[];
};

const DEFAULT_BRANDS: BrandItemData[] = [
  {
    id: "mirage",
    name: "MIRAGE",
    category: "Tiles & Surfaces · Italy",
    origin: "Italy",
    estYear: "EST. 1976",
    catalogCount: "9 catalogs",
    filterTag: "Surfaces",
    catalogs: [
      { title: "CLAY", themeClass: "ct-cream" },
      { title: "ELYSIAN", themeStyle: { background: "#d4cfc7", color: "#333" } },
      { title: "TRAVERTINI", themeClass: "ct-sand" },
      { title: "GLOCAL", themeClass: "ct-slate" },
    ],
  },
  {
    id: "mafi",
    name: "mafi",
    category: "Wood Flooring · Austria",
    origin: "Austria",
    estYear: "EST. 1997",
    catalogCount: "2 catalogs",
    filterTag: "Flooring",
    catalogs: [
      { title: "VOLUME 11", themeClass: "ct-dark", themeStyle: { flex: 1.4 } },
      { title: "GOES OUTDOOR", themeClass: "ct-dark", themeStyle: { background: "#1a1a1a", flex: 1.4 } },
    ],
  },
  {
    id: "fima",
    name: "fima Carlo Frattini",
    category: "Bathroom · Italy",
    origin: "Italy",
    estYear: "EST. 1945",
    catalogCount: "5 catalogs",
    filterTag: "Bathroom",
    catalogs: [
      { title: "AES·THE·TIC", themeStyle: { background: "linear-gradient(135deg,#e0c8f0,#f0a0c0)", color: "#4a1060" } },
      { title: "SO AQUA", themeClass: "ct-dark" },
      { title: "SLIDE MAG", themeClass: "ct-slate" },
      { title: "PARK LANE", themeStyle: { background: "#f5f0e8", color: "#333" } },
    ],
  },
  {
    id: "waltz",
    name: "Waltz",
    category: "Door & Partition · Italy",
    origin: "Italy",
    estYear: "EST. 2005",
    catalogCount: "4 catalogs",
    filterTag: "Doors",
    catalogs: [
      { title: "CLOSE NXT", themeClass: "ct-dark" },
      { title: "GLIDE NXT", themeClass: "ct-dark" },
      { title: "SLIDE NXT", themeClass: "ct-dark" },
      { title: "WALLWAYS 2025", themeStyle: { background: "#f0ebe3", color: "#333" } },
    ],
  },
  {
    id: "newtech-wood",
    name: "NewTechWood",
    category: "Cladding & Decking · USA",
    origin: "USA",
    estYear: "EST. 2005",
    catalogCount: "12 catalogs",
    filterTag: "Cladding",
    catalogs: [
      { title: "PRODUCT CATALOG 2025", themeClass: "ct-green", themeStyle: { background: "#1c3a28", flex: 1.5 } },
      { title: "FULL CATALOG", themeClass: "ct-green", themeStyle: { background: "#1c3a28", flex: 1.5 } },
    ],
  },
  {
    id: "slashform",
    name: "slashform™",
    category: "Surfaces · Italy",
    origin: "Italy",
    estYear: "EST. 2012",
    catalogCount: "2 catalogs",
    filterTag: "Surfaces",
    catalogs: [
      { title: "THE GREIGE HARMONY", themeClass: "ct-taupe", themeStyle: { background: "#b0a898", color: "#fff" } },
      { title: "THE TERRAIGE COLLECTION", themeClass: "ct-warm" },
    ],
  },
  {
    id: "wow",
    name: "WOW",
    category: "Decorative Tiles · Spain",
    origin: "Spain",
    estYear: "EST. 2010",
    catalogCount: "10 catalogs",
    filterTag: "Surfaces",
    catalogs: [
      { title: "3D BARS", themeStyle: { background: "#f0e8de", color: "#333" } },
      { title: "SABIL", themeStyle: { background: "#7d9c88", color: "#fff" } },
      { title: "TERRE", themeClass: "ct-sand" },
      { title: "VESTIGE", themeClass: "ct-green" },
    ],
  },
  {
    id: "formica",
    name: "FORMICA®",
    category: "Laminates · USA",
    origin: "USA",
    estYear: "EST. 1913",
    catalogCount: "5 catalogs",
    filterTag: "Surfaces",
    catalogs: [
      { title: "FENIX", themeClass: "ct-dark" },
      { title: "VIS", themeStyle: { background: "#e2d9cc", color: "#333" } },
      { title: "CORA", themeStyle: { background: "#c8b49a", color: "#2a1f0e" } },
      { title: "COLLECTION 4", themeClass: "ct-green" },
    ],
  },
  {
    id: "inkiostro-bianco",
    name: "Inkiostro Bianco",
    category: "Wallcovering & Surfaces · Italy",
    origin: "Italy",
    estYear: "EST. 2013",
    catalogCount: "6 catalogs",
    filterTag: "Surfaces",
    catalogs: [
      { title: "GOLDEN WALL", themeClass: "ct-warm" },
      { title: "LINEADECK", themeClass: "ct-slate" },
      { title: "SKIN", themeClass: "ct-taupe" },
    ],
  },
  {
    id: "falper",
    name: "Falper",
    category: "Bathroom · Italy",
    origin: "Italy",
    estYear: "EST. 1962",
    catalogCount: "4 catalogs",
    filterTag: "Bathroom",
    catalogs: [
      { title: "ECCE MOP", themeClass: "ct-dark" },
      { title: "MINIMAL", themeClass: "ct-cream" },
      { title: "PURA", themeClass: "ct-slate" },
    ],
  },
  {
    id: "loco",
    name: "Loco Design",
    category: "Bespoke Millwork · Italy",
    origin: "Italy",
    estYear: "EST. 2008",
    catalogCount: "3 catalogs",
    filterTag: "Flooring",
    catalogs: [
      { title: "WOOD & LEATHER", themeClass: "ct-taupe" },
      { title: "SUITE 2025", themeClass: "ct-dark" },
    ],
  },
  {
    id: "fenix",
    name: "FENIX NTM",
    category: "Nano Surfaces · Italy",
    origin: "Italy",
    estYear: "EST. 2013",
    catalogCount: "3 catalogs",
    filterTag: "Surfaces",
    catalogs: [
      { title: "MATT NANO", themeClass: "ct-dark" },
      { title: "BLOOM 2025", themeClass: "ct-taupe" },
    ],
  },
];

const FILTER_PILLS = ["All", "Surfaces", "Cladding", "Bathroom", "Doors", "Flooring"];

export default function BrandsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activePill, setActivePill] = useState("All");
  const [brands, setBrands] = useState<BrandItemData[]>(DEFAULT_BRANDS);
  const [allProducts, setAllProducts] = useState<ProductItem[]>([]);

  useEffect(() => {
    // Fetch Brands
    fetch("/api/brands?t=" + Date.now(), { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
          const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, "");

          const apiBrands: BrandItemData[] = json.data.map((b: any, idx: number) => {
            const normName = normalize(b.name || "");
            const normId = normalize(b.id || "");
            const defaultMatch = DEFAULT_BRANDS.find(
              (db) => normalize(db.name) === normName || normalize(db.id) === normId || normName.includes(normalize(db.id)) || normalize(db.id).includes(normName)
            );
            return {
              id: defaultMatch?.id || b.id || b.name.toLowerCase().replace(/\s+/g, "-"),
              name: b.name.toUpperCase(),
              category: b.description || defaultMatch?.category || "Surface Solution · Global",
              origin: defaultMatch?.origin || "Global",
              estYear: defaultMatch?.estYear || `EST. ${1970 + ((idx * 3) % 45)}`,
              catalogCount: defaultMatch?.catalogCount || "3 catalogs",
              filterTag: defaultMatch?.filterTag || "Surfaces",
              catalogs: defaultMatch?.catalogs || [
                { title: "COLLECTION 2025", themeClass: "ct-dark" },
                { title: "PRODUCT SPEC", themeClass: "ct-cream" },
              ],
            };
          });

          const seen = new Set<string>();
          const merged: BrandItemData[] = [];

          [...apiBrands, ...DEFAULT_BRANDS].forEach((item) => {
            const key = normalize(item.id) || normalize(item.name);
            if (!seen.has(key)) {
              seen.add(key);
              merged.push(item);
            }
          });

          setBrands(merged);
        }
      })
      .catch((err) => console.error(err));

    // Fetch Products
    fetch("/api/products?t=" + Date.now(), { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (json && json.success && Array.isArray(json.data)) {
          setAllProducts(json.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const filteredBrands = brands.filter((brand) => {
    const matchesPill = activePill === "All" || brand.filterTag.toLowerCase() === activePill.toLowerCase() || brand.category.toLowerCase().includes(activePill.toLowerCase());
    const matchesQuery =
      !searchQuery ||
      brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPill && matchesQuery;
  });

  const totalCatalogsCount = filteredBrands.reduce((acc, b) => acc + (parseInt(b.catalogCount) || b.catalogs.length), 0);

  // Helper to get brand products
  const getBrandProducts = (brand: BrandItemData): ProductItem[] => {
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
    const targetBrand = norm(brand.name);
    const targetId = norm(brand.id);

    let list = allProducts.filter((p) => {
      const pBrand = norm(p.brand || "");
      return pBrand.includes(targetBrand) || targetBrand.includes(pBrand) || pBrand.includes(targetId);
    });

    // If fewer than 10 products, generate synthetic catalog products for rich UI demonstration
    if (list.length < 10) {
      const needed = 12 - list.length;
      const categories = ["Decking", "Cladding", "Surfaces", "Flooring", "Bathroom", "Tiles", "Doors"];
      const colors = ["#2b3a4a", "#8c764b", "#3b4d3c", "#4a3b32", "#1e293b", "#d97706", "#475569", "#78350f", "#0f766e"];
      
      const extra: ProductItem[] = Array.from({ length: needed }).map((_, i) => {
        const pIdx = list.length + i + 1;
        const cat = categories[i % categories.length];
        const hex = colors[i % colors.length];
        return {
          id: `${brand.id}-prod-${pIdx}`,
          name: `${brand.name} Line ${pIdx}`,
          brand: brand.name,
          category: cat,
          description: `${brand.name} architectural ${cat.toLowerCase()} series`,
          imageUrl: pIdx % 2 === 0 ? "/brands/brand_1_1.png" : "",
          coverColor: hex,
          qtyInStock: 10,
        } as ProductItem & { coverColor?: string };
      });
      return [...list, ...extra];
    }

    return list;
  };

  return (
    <div className="page-wrapper">
      <div className="page">
        {/* ── Hero Section ── */}
        <div className="hero">
          <div className="hero-label">AAREN Studio — Material House</div>
          <h1 className="hero-title">Brands</h1>
          <p className="hero-sub">Curated luxury materials, surfaces &amp; systems from the world&apos;s finest manufacturers</p>
        </div>

        {/* ── Controls Bar ── */}
        <div className="controls">
          <div className="search-wrap">
            <Search className="search-icon" size={15} />
            <input
              className="search-inp"
              placeholder="Search brands..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-pills">
            {FILTER_PILLS.map((pill) => (
              <button
                key={pill}
                className={`pill${activePill === pill ? " active" : ""}`}
                onClick={() => setActivePill(pill)}
              >
                {pill}
              </button>
            ))}
          </div>

          <div className="count-label">
            {filteredBrands.length} Brands · {totalCatalogsCount} Catalogs
          </div>
        </div>

        {/* ── Brands Grid ── */}
        <div className="brands-grid">
          {filteredBrands.map((brand, idx) => {
            const brandProds = getBrandProducts(brand);
            const totalCount = Math.max(brandProds.length, parseInt(brand.catalogCount) * 2 || 12);
            const showingProds = brandProds.slice(0, 10);
            const hasMore = totalCount > 10;

            return (
              <div key={`${brand.id}-${idx}`} className="brand-card">
                {/* Brand Header */}
                <div className="brand-header">
                  <div className="brand-logo-area">
                    <div className="brand-logo">{brand.name}</div>
                    <div className="brand-category">{brand.category}</div>
                  </div>
                  <div className="brand-count">{brand.catalogCount}</div>
                </div>

                {/* Catalogs Row */}
                <div className="catalogs-row">
                  {brand.catalogs.map((cat, cIdx) => (
                    <div
                      key={cIdx}
                      className={`catalog-thumb ${cat.themeClass || "ct-cream"}`}
                      style={cat.themeStyle}
                    >
                      <span className="cat-title">{cat.title}</span>
                    </div>
                  ))}
                </div>

                {/* Brand Link Footer */}
                <div className="brand-footer">
                  <Link href={`/brands/${brand.id}`} className="view-link">
                    <ArrowRight size={12} style={{ marginRight: "4px" }} /> View brand
                  </Link>
                  <div className="origin-tag">{brand.estYear}</div>
                </div>

                {/* 1. HAIRLINE DIVIDER */}
                <div className="brand-divider" style={{ height: "0.5px", background: "var(--border)", margin: "16px 0" }} />

                {/* 2. PRODUCTS SECTION */}
                <div className="brand-products-section" style={{ padding: "0 4px" }}>
                  <div className="brand-products-header" style={{ marginBottom: "12px" }}>
                    <span style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.1em", fontWeight: 600 }}>
                      Products — {totalCount} total, showing {showingProds.length}
                    </span>
                  </div>

                  {/* Mini Product Grid: 5 columns */}
                  <div className="mini-product-grid">
                    {showingProds.map((prod) => {
                      const coverColor = (prod as any).coverColor || "#e2e8f0";
                      const prodSlug = prod.id || prod.name.toLowerCase().replace(/\s+/g, "-");

                      return (
                        <Link
                          key={prod.id}
                          href={`/products/${prodSlug}`}
                          className="mini-product-card"
                        >
                          <div
                            className="mini-product-thumb"
                            style={{
                              aspectRatio: "1",
                              borderRadius: "4px",
                              overflow: "hidden",
                              position: "relative",
                              background: coverColor,
                            }}
                          >
                            {prod.imageUrl && prod.imageUrl !== "/brands/brand_1_1.png" ? (
                              <Image
                                src={prod.imageUrl}
                                alt={prod.name}
                                fill
                                sizes="100px"
                                style={{ objectFit: "cover" }}
                              />
                            ) : null}
                          </div>

                          <div className="mini-product-info" style={{ marginTop: "6px" }}>
                            <div className="mini-product-name" style={{ fontSize: "9px", fontWeight: 500, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {prod.name}
                            </div>
                            <div className="mini-product-tag-wrap" style={{ marginTop: "3px" }}>
                              <span className="mini-product-tag" style={{ fontSize: "8px", background: "var(--surface-2)", color: "var(--text-secondary)", padding: "2px 6px", borderRadius: "10px", display: "inline-block" }}>
                                {prod.category}
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* 3. MORE BAR (if > 10 products) */}
                {hasMore && (
                  <div
                    className="brand-more-bar"
                    style={{
                      marginTop: "16px",
                      background: "var(--surface-1)",
                      border: "0.5px solid var(--border)",
                      borderRadius: "6px",
                      padding: "10px 14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 500 }}>
                      Showing {showingProds.length} of {totalCount} products
                    </span>
                    <Link
                      href={`/products?brand=${brand.id}`}
                      className="brand-more-btn"
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#8c764b",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      View all products →
                    </Link>
                  </div>
                )}
              </div>
            );
          })}

          {/* Placeholder Footer Block */}
          <div className="placeholder-more">
            <span>+ 8 more brands — Agape, IW, Bodaq, Inclass Veneer, Inkiostro Bianco, Falper, Loco Design, Fenix</span>
          </div>
        </div>

        {/* ── Page Footer ── */}
        <div className="page-footer">
          <div className="left">AAREN © 2026 · Creative Studio &amp; Material House</div>
          <div className="right">
            <span>{brands.length} Brands</span>
            <span>{totalCatalogsCount}+ Catalogs</span>
            <span>300+ Products</span>
          </div>
        </div>
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

        .page-wrapper {
          background: var(--surface-0);
          color: var(--text-primary);
          min-height: 100vh;
          padding-top: 5rem;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .page {
          max-width: 100%;
        }

        .hero {
          padding: 64px 32px 40px;
          border-bottom: 0.5px solid var(--border);
          background: #ffffff;
        }

        .hero-label {
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #8c764b;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .hero-title {
          font-size: clamp(36px, 6vw, 64px);
          font-weight: 700;
          line-height: 0.95;
          letter-spacing: -0.03em;
          color: var(--text-primary);
          text-transform: uppercase;
        }

        .hero-sub {
          font-size: 15px;
          color: var(--text-secondary);
          margin-top: 12px;
          max-width: 600px;
          line-height: 1.5;
        }

        .controls {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 32px;
          border-bottom: 0.5px solid var(--border);
          background: #ffffff;
          flex-wrap: wrap;
        }

        .search-wrap {
          flex: 1;
          min-width: 220px;
          position: relative;
        }

        .search-wrap :global(.search-icon) {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }

        .search-inp {
          width: 100%;
          padding: 9px 12px 9px 36px;
          font-size: 13px;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          background: var(--surface-2);
          color: var(--text-primary);
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }

        .search-inp:focus {
          border-color: #8c764b;
          background: #ffffff;
        }

        .filter-pills {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .pill {
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid var(--border);
          cursor: pointer;
          color: var(--text-secondary);
          background: transparent;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .pill:hover {
          border-color: #8c764b;
          color: #8c764b;
        }

        .pill.active {
          background: #8c764b;
          color: #ffffff;
          border-color: #8c764b;
        }

        .count-label {
          font-size: 12px;
          color: var(--text-muted);
          margin-left: auto;
          white-space: nowrap;
          font-weight: 600;
        }

        .brands-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 1px;
          background: var(--border);
          padding: 0;
        }

        .brand-card {
          background: var(--surface-1);
          padding: 28px 24px 24px;
          transition: background 0.2s ease, transform 0.2s ease;
          position: relative;
          color: inherit;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .brand-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .brand-logo-area {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .brand-logo {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          text-transform: uppercase;
        }

        .brand-category {
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
          font-weight: 600;
        }

        .brand-count {
          font-size: 11px;
          color: #8c764b;
          background: #fef3c7;
          border: 1px solid #fde68a;
          border-radius: 20px;
          padding: 4px 10px;
          white-space: nowrap;
          font-weight: 700;
        }

        .catalogs-row {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }

        .catalog-thumb {
          flex: 1;
          aspect-ratio: 0.7;
          border-radius: 4px;
          border: 0.5px solid rgba(0,0,0,0.1);
          display: flex;
          align-items: flex-end;
          padding: 10px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 2px 6px rgba(0,0,0,0.06);
        }

        .catalog-thumb .cat-title {
          position: relative;
          z-index: 1;
          font-size: 10px;
          letter-spacing: 0.05em;
          font-weight: 800;
          line-height: 1.3;
          text-transform: uppercase;
        }

        .ct-dark { background: #111111; }
        .ct-dark .cat-title { color: #ffffff; }

        .ct-cream { background: #e8e2d9; }
        .ct-cream .cat-title { color: #333333; }

        .ct-sand { background: #c9b89a; }
        .ct-sand .cat-title { color: #2a1f0e; }

        .ct-slate { background: #4a5568; }
        .ct-slate .cat-title { color: #e2e8f0; }

        .ct-green { background: #1a3d2b; }
        .ct-green .cat-title { color: #a8d5b5; }

        .ct-taupe { background: #8d7b6a; }
        .ct-taupe .cat-title { color: #f5f0eb; }

        .ct-warm { background: #8c764b; }
        .ct-warm .cat-title { color: #ffffff; }

        .ct-navy { background: #1e2d4e; }
        .ct-navy .cat-title { color: #b8c8e8; }

        .ct-rose { background: #c44b6c; }
        .ct-rose .cat-title { color: #ffe0ea; }

        .brand-footer {
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .view-link {
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #8c764b;
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 700;
          text-decoration: none;
        }

        .origin-tag {
          font-size: 10px;
          color: var(--text-muted);
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        /* Mini Product Grid */
        .mini-product-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
        }

        .mini-product-card {
          border: 0.5px solid var(--border);
          border-radius: 6px;
          padding: 6px;
          background: #ffffff;
          text-decoration: none;
          transition: border-color 0.2s ease, transform 0.2s ease;
        }

        .mini-product-card:hover {
          border-color: var(--border-strong);
          transform: translateY(-2px);
        }

        .placeholder-more {
          grid-column: 1 / -1;
          background: var(--surface-1);
          padding: 36px 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .placeholder-more span {
          font-size: 13px;
          color: var(--text-secondary);
          border: 1px dashed var(--border-strong);
          border-radius: 6px;
          padding: 16px 32px;
          font-weight: 600;
          text-align: center;
        }

        .page-footer {
          padding: 28px 32px;
          border-top: 0.5px solid var(--border);
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .page-footer .left {
          font-size: 12px;
          color: var(--text-muted);
        }

        .page-footer .right {
          font-size: 12px;
          color: var(--text-secondary);
          display: flex;
          gap: 20px;
          font-weight: 600;
        }

        @media (max-width: 640px) {
          .hero { padding: 40px 16px 24px; }
          .controls { padding: 16px; }
          .brands-grid { grid-template-columns: 1fr; }
          .mini-product-grid { grid-template-columns: repeat(3, 1fr); }
          .page-footer { padding: 20px 16px; }
        }
      `}</style>
    </div>
  );
}
