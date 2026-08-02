import re

page_path = 'src/app/products/[slug]/page.tsx'

with open(page_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Check icons import
if "Eye" not in content:
    content = content.replace("ChevronRight,", "ChevronRight, Eye, SlidersHorizontal,")

# Add useRef to imports if missing
if "useRef" not in content:
    content = content.replace('import { useState, useEffect, use } from "react";', 'import { useState, useEffect, useRef, use } from "react";')

# Add allProducts and quickViewProduct states
states_snippet = """  // States
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [allProducts, setAllProducts] = useState<ProductItem[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const sliderRef = useRef<HTMLDivElement>(null);"""

content = content.replace("""  // States
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);""", states_snippet)

# Update fetch to save setAllProducts
fetch_save = """          if (json && json.success && Array.isArray(json.data)) {
            setAllProducts(json.data);"""

content = content.replace("""          if (json && json.success && Array.isArray(json.data)) {""", fetch_save)

# Add recommendation compute logic right before return
comp_logic = """  // Compute Related Products (Same Brand, Category, or Collection)
  const relatedProducts = allProducts.filter(
    (p) =>
      p.id !== product.id &&
      (p.brand === product.brand || p.category === product.category || p.subcategory === product.subcategory)
  );

  // Compute You May Also Like Products (Similar Material, Finish, or Style)
  const youMayAlsoLike = allProducts.filter(
    (p) =>
      p.id !== product.id &&
      !relatedProducts.some((rp) => rp.id === p.id)
  );

  // Scroll Slider Handlers
  const handleScrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };"""

content = content.replace("""  // Gallery array""", comp_logic + "\n\n  // Gallery array")

# Inject Related Products & You May Also Like HTML right after Designer Story section
sections_html = """
      {/* ── SECTION 6 — RELATED PRODUCTS (LUXURY HORIZONTAL SLIDER) ── */}
      <div className="section-container related-products-section" style={{ marginTop: "60px" }}>
        <div className="section-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px" }}>
          <div>
            <h2 className="section-title" style={{ marginBottom: "6px" }}>Related Products</h2>
            <p className="section-subtitle" style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>
              Explore more products from the same brand and category.
            </p>
          </div>
          <div className="slider-nav-btns" style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handleScrollLeft}
              className="slider-arrow-btn"
              aria-label="Scroll left"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "0.5px solid var(--border)",
                background: "var(--surface-1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleScrollRight}
              className="slider-arrow-btn"
              aria-label="Scroll right"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "0.5px solid var(--border)",
                background: "var(--surface-1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Luxury Horizontal Slider */}
        <div
          ref={sliderRef}
          className="related-slider-track"
          style={{
            display: "flex",
            gap: "20px",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingBottom: "16px",
            scrollbarWidth: "none",
            msOverflowStyle: "none"
          }}
        >
          {(relatedProducts.length > 0 ? relatedProducts : allProducts.filter(p => p.id !== product.id)).map((item) => {
            const itemSlug = item.id || item.name.toLowerCase().replace(/\\s+/g, "-");
            return (
              <div
                key={item.id}
                className="related-card-item"
                style={{
                  minWidth: "280px",
                  maxWidth: "320px",
                  flex: "0 0 280px",
                  scrollSnapAlign: "start",
                  background: "var(--surface-1)",
                  border: "0.5px solid var(--border)",
                  borderRadius: "10px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease"
                }}
              >
                {/* Product Image 1:1 */}
                <div style={{ aspectRatio: "1", position: "relative", width: "100%", background: "#f1f5f9" }}>
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="300px"
                    style={{ objectFit: "cover" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      background: "rgba(0,0,0,0.75)",
                      color: "#ffffff",
                      fontSize: "9px",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      textTransform: "uppercase",
                      backdropFilter: "blur(4px)"
                    }}
                  >
                    {item.brand}
                  </div>
                </div>

                {/* Info & Actions */}
                <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ fontSize: "10px", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.05em", fontWeight: 500 }}>
                      Collection · {item.subcategory || item.category}
                    </span>
                    <h3 style={{ fontSize: "15px", fontWeight: 600, marginTop: "4px", marginBottom: "12px", color: "var(--text-main)", lineHeight: 1.3 }}>
                      {item.name}
                    </h3>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "12px" }}>
                    <Link
                      href={`/products/\${itemSlug}`}
                      className="btn-view-prod"
                      style={{
                        padding: "8px 12px",
                        fontSize: "11px",
                        fontWeight: 600,
                        textAlign: "center",
                        borderRadius: "6px",
                        background: "var(--text-main)",
                        color: "#ffffff",
                        textDecoration: "none",
                        display: "inline-block"
                      }}
                    >
                      View Product
                    </Link>
                    <button
                      onClick={() => setQuickViewProduct(item)}
                      style={{
                        padding: "8px 12px",
                        fontSize: "11px",
                        fontWeight: 600,
                        textAlign: "center",
                        borderRadius: "6px",
                        background: "transparent",
                        border: "0.5px solid var(--border)",
                        color: "var(--text-main)",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px"
                      }}
                    >
                      <Eye size={12} /> Quick View
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 8 — YOU MAY ALSO LIKE (4 CARDS DESKTOP, 2 TABLET, 1 MOBILE) ── */}
      <div className="section-container you-may-also-like-section" style={{ marginTop: "60px", marginBottom: "60px" }}>
        <div style={{ marginBottom: "24px" }}>
          <h2 className="section-title" style={{ marginBottom: "6px" }}>You May Also Like</h2>
          <p className="section-subtitle" style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>
            Curated architectural recommendations matching similar style, material &amp; finishes.
          </p>
        </div>

        <div className="you-may-like-grid">
          {(youMayAlsoLike.length > 0 ? youMayAlsoLike : allProducts.filter(p => p.id !== product.id)).slice(0, 4).map((item) => {
            const itemSlug = item.id || item.name.toLowerCase().replace(/\\s+/g, "-");
            return (
              <div key={item.id} className="you-like-card">
                <div className="you-like-thumb">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="you-like-brand-badge">{item.brand}</div>
                </div>

                <div className="you-like-details">
                  <div>
                    <span className="you-like-cat">
                      {item.finish || item.subcategory || item.category}
                    </span>
                    <h3 className="you-like-title">{item.name}</h3>
                  </div>

                  <div className="you-like-actions">
                    <Link href={`/products/\${itemSlug}`} className="btn-view-prod">
                      View Product
                    </Link>
                    <button onClick={() => setQuickViewProduct(item)} className="btn-quick-view">
                      <Eye size={12} /> Quick View
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── QUICK VIEW MODAL ── */}
      {quickViewProduct && (
        <div className="modal-overlay" onClick={() => setQuickViewProduct(null)}>
          <div className="modal-card quick-view-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "800px", width: "90%" }}>
            <button className="modal-close" onClick={() => setQuickViewProduct(null)}>
              <X size={18} />
            </button>

            <div className="quick-view-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", paddingTop: "10px" }}>
              <div style={{ aspectRatio: "1", position: "relative", borderRadius: "8px", overflow: "hidden", background: "#f1f5f9" }}>
                <Image src={quickViewProduct.imageUrl} alt={quickViewProduct.name} fill style={{ objectFit: "cover" }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8c764b", letterSpacing: "0.1em" }}>
                    {quickViewProduct.brand}
                  </span>
                  <h3 style={{ fontSize: "20px", fontWeight: 600, marginTop: "4px", marginBottom: "8px" }}>
                    {quickViewProduct.name}
                  </h3>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "16px" }}>
                    {quickViewProduct.description || "Architectural material surface crafted for luxury interiors."}
                  </p>

                  <div style={{ background: "var(--surface-0)", padding: "12px", borderRadius: "6px", fontSize: "12px", display: "grid", gap: "6px" }}>
                    <div><strong>Category:</strong> {quickViewProduct.category} ({quickViewProduct.subcategory || "Standard"})</div>
                    <div><strong>Finish:</strong> {quickViewProduct.finish || "Natural Grain"}</div>
                    <div><strong>Dimensions:</strong> {quickViewProduct.width || "N/A"} &times; {quickViewProduct.height || "N/A"}</div>
                    <div><strong>Stock:</strong> <span style={{ color: "#10b981", fontWeight: 600 }}>● In Stock ({quickViewProduct.qtyInStock || 50} units)</span></div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "20px" }}>
                  <Link
                    href={`/products/\${quickViewProduct.id}`}
                    className="btn-primary"
                    style={{ textDecoration: "none", textAlign: "center", display: "inline-block", fontSize: "12px" }}
                  >
                    Full Details &rarr;
                  </Link>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setQuickViewProduct(null);
                      setQuoteModalOpen(true);
                    }}
                    style={{ fontSize: "12px" }}
                  >
                    Request Quote
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
"""

content = content.replace("""      {/* ── SECTION 5 — DESIGNER / COLLECTION STORY ── */}
      <div className="section-container story-section">
        <h2 className="section-title">Designer &amp; Collection Story</h2>
        <div className="story-grid">
          <div className="story-left">
            <div className="designer-quote">&ldquo;True luxury materials do not compete for attention; they command the space through architectural precision.&rdquo;</div>
            <div className="designer-author">— {designer}</div>
          </div>

          <div className="story-right">
            <p className="story-text">{collectionStory}</p>
          </div>
        </div>
      </div>""", """      {/* ── SECTION 5 — DESIGNER / COLLECTION STORY ── */}
      <div className="section-container story-section">
        <h2 className="section-title">Designer &amp; Collection Story</h2>
        <div className="story-grid">
          <div className="story-left">
            <div className="designer-quote">&ldquo;True luxury materials do not compete for attention; they command the space through architectural precision.&rdquo;</div>
            <div className="designer-author">— {designer}</div>
          </div>

          <div className="story-right">
            <p className="story-text">{collectionStory}</p>
          </div>
        </div>
      </div>""" + sections_html)

# Add CSS for You May Also Like grid & quick view
extra_css = """
        /* ── SECTION 8 YOU MAY ALSO LIKE RESPONSIVE GRID ── */
        .you-may-like-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        @media (max-width: 992px) {
          .you-may-like-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 576px) {
          .you-may-like-grid {
            grid-template-columns: 1fr;
          }
        }

        .you-like-card {
          background: var(--surface-1);
          border: 0.5px solid var(--border);
          border-radius: 10px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 4px 14px rgba(0,0,0,0.03);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .you-like-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 24px rgba(0,0,0,0.08);
        }

        .you-like-thumb {
          aspect-ratio: 1;
          position: relative;
          width: 100%;
          background: #f1f5f9;
        }

        .you-like-brand-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(0,0,0,0.75);
          color: #ffffff;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.08em;
          padding: 4px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          backdrop-filter: blur(4px);
        }

        .you-like-details {
          padding: 16px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .you-like-cat {
          font-size: 10px;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 0.05em;
          font-weight: 500;
        }

        .you-like-title {
          font-size: 15px;
          font-weight: 600;
          margin-top: 4px;
          margin-bottom: 12px;
          color: var(--text-main);
          line-height: 1.3;
        }

        .you-like-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 12px;
        }

        .btn-view-prod {
          padding: 8px 12px;
          font-size: 11px;
          font-weight: 600;
          text-align: center;
          border-radius: 6px;
          background: var(--text-main);
          color: #ffffff;
          text-decoration: none;
          display: inline-block;
          transition: opacity 0.2s ease;
        }

        .btn-quick-view {
          padding: 8px 12px;
          font-size: 11px;
          font-weight: 600;
          text-align: center;
          border-radius: 6px;
          background: transparent;
          border: 0.5px solid var(--border);
          color: var(--text-main);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          transition: background 0.2s ease;
        }

        .btn-quick-view:hover {
          background: var(--surface-0);
        }
"""

content = content.replace("      `}</style>", extra_css + "\n      `}</style>")

with open(page_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Added Related Products & You May Also Like sections successfully!")
