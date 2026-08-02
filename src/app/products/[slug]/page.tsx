"use client";

import { useState, useEffect, useRef, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight, Eye, SlidersHorizontal,
  ZoomIn,
  X,
  Heart,
  Share2,
  Download,
  Send,
  ChevronLeft,
  Check,
} from "lucide-react";
import { ProductItem } from "@/lib/types";

type Props = { params: Promise<{ slug: string }> };

export default function ProductDetailPage({ params }: Props) {
  const { slug } = use(params);

  // States
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [allProducts, setAllProducts] = useState<ProductItem[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Gallery state
  const [selectedImgIdx, setSelectedImgIdx] = useState<number>(0);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxIdx, setLightboxIdx] = useState<number>(0);
  const [activeFinishIdx, setActiveFinishIdx] = useState<number>(0);

  // Wishlist & Toast
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modals
  const [quoteModalOpen, setQuoteModalOpen] = useState<boolean>(false);
  const [pdfModalOpen, setPdfModalOpen] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  // Form input state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  // Fetch product data
  useEffect(() => {
    fetch("/api/products?t=" + Date.now(), { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (json && json.success && Array.isArray(json.data)) {
          const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
          const match = json.data.find(
            (p: ProductItem) =>
              p.id === slug ||
              norm(p.id) === norm(slug) ||
              norm(p.name) === norm(slug) ||
              norm(p.name).includes(norm(slug))
          );

          if (match) {
            setProduct(match);
          } else {
            // Fallback product model
            setProduct({
              id: slug,
              name: slug
                .replace(/-/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase()),
              brand: "NewTechWood",
              category: "Decking",
              subcategory: "WPC Composite",
              shortCode: "NW 10",
              width: "140mm",
              height: "22.5mm",
              depth: "2900mm",
              thickness: "22.5mm",
              finish: "Antique Ipe Grain",
              description:
                "Ultra-durable 360-degree co-extruded capped composite decking engineered for luxury outdoor spaces. Features class-leading UV stabilization, anti-fade surface layer, and slip-resistant wood grain texturing.",
              tags: ["Outdoor", "WPC", "Decking", "Weather-Proof"],
              imageUrl: "/brands/newtechwood/product_p10_sa.png",
              galleryImages: [
                "/brands/newtechwood/product_p14_eco.png",
                "/brands/newtechwood/product_p14_ocean.png",
                "/brands/brand_1_1.png",
              ],
              catalogPdfUrl: "/catalogues/NewTechWood/NewTechWood-Product-Catalog-2025.pdf",
              qtyInStock: 120,
              price: 680,
              finishOptions: [
                { name: "Antique Ipe", hex: "#4a3b32" },
                { name: "Teak Wood", hex: "#8c764b" },
                { name: "Charcoal Grey", hex: "#2b3a4a" },
              ],
            } as any);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Check wishlist state from localStorage
    try {
      const saved = localStorage.getItem(`aaren_fav_${slug}`);
      if (saved === "true") setIsSaved(true);
    } catch (e) {}
  }, [slug]);

  // ESC key for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "120px 32px", textAlign: "center", minHeight: "80vh" }}>
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: "120px 32px", textAlign: "center", minHeight: "80vh" }}>
        <h2>Product not found</h2>
        <Link href="/products" style={{ color: "#8c764b", marginTop: "16px", display: "inline-block" }}>
          ← Back to all products
        </Link>
      </div>
    );
  }

  // Compute Related Products (Same Brand, Category, or Collection)
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
  };

  // Gallery array
  const allImages = [product.imageUrl, ...(product.galleryImages || [])].filter(Boolean);

  // Additional detail fields or fallbacks
  const pAny = product as any;
  const coverColor = pAny.coverColor || "#e2e8f0";
  const pdfPage = pAny.pdfPage || "Page 14";
  const designer = pAny.designer || "Studio Aaren Design Lab";
  const countryOfOrigin = pAny.countryOfOrigin || "Italy / USA";
  const leadTime = pAny.leadTime || "2–4 Weeks";
  const material = pAny.material || "Wood-Plastic Composite (WPC) / Ultra-Dense Core";
  const collectionStory = pAny.collectionStory || "Designed at the intersection of natural architectural beauty and modern engineering resilience.";

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setToastMsg("URL copied to clipboard!");
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  const handleSaveToggle = () => {
    const nextState = !isSaved;
    setIsSaved(nextState);
    try {
      localStorage.setItem(`aaren_fav_${slug}`, String(nextState));
    } catch (e) {}
    setToastMsg(nextState ? "Saved to your wishlist!" : "Removed from wishlist");
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          type: "Quote Request",
          productOrBrand: `${product.brand} - ${product.name}`,
          message: `Company: ${formData.company || "N/A"}. Note: ${formData.message}`,
        }),
      });
      setFormSubmitted(true);
      setTimeout(() => {
        setQuoteModalOpen(false);
        setFormSubmitted(false);
      }, 2000);
    } catch (err) {
      alert("Failed to submit request. Please try again.");
    }
  };

  return (
    <div className="product-page">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="toast-notification">
          <Check size={14} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ── SECTION 1 — PREMIUM HERO (Two-column) ── */}
      <div className="hero-section">
        {/* LEFT COLUMN — Gallery (58%) */}
        <div className="gallery-col">
          {/* Main Image Area */}
          <div className="main-image-wrap" style={{ background: coverColor }}>
            {allImages[selectedImgIdx] ? (
              <Image
                src={allImages[selectedImgIdx]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                style={{ objectFit: "cover" }}
                className="main-img"
              />
            ) : null}

            {/* PDF Page Badge */}
            {pdfPage && (
              <div className="pdf-badge">{pdfPage}</div>
            )}

            {/* Zoom Icon Button */}
            <button
              className="zoom-btn"
              onClick={() => {
                setLightboxIdx(selectedImgIdx);
                setLightboxOpen(true);
              }}
              title="Open Lightbox"
            >
              <ZoomIn size={16} />
            </button>
          </div>

          {/* Thumbnail Strip */}
          {allImages.length > 1 && (
            <div className="thumb-strip">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  className={`thumb-btn ${selectedImgIdx === idx ? "active" : ""}`}
                  onClick={() => setSelectedImgIdx(idx)}
                >
                  <Image src={img} alt={`Thumb ${idx}`} fill sizes="52px" style={{ objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN — Product Info (42%, Sticky) */}
        <div className="info-col">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <Link href="/products">Products</Link>
            <ChevronRight size={10} />
            <span>{product.brand}</span>
            <ChevronRight size={10} />
            <span>{product.category}</span>
          </div>

          {/* Product Name & Collection */}
          <h1 className="product-name">{product.name}</h1>
          <div className="collection-name">{product.brand} COLLECTION</div>

          {/* Tags Row */}
          <div className="tags-row">
            <span className="stock-badge">● In Stock</span>
            <span className="cat-pill">{product.category}</span>
            {product.tags?.map((t) => (
              <span key={t} className="app-tag">{t}</span>
            ))}
          </div>

          {/* Description */}
          <p className="short-desc">{product.description}</p>

          <div className="hairline-divider" />

          {/* Meta Grid (2-column) */}
          <div className="meta-grid">
            <div className="meta-item">
              <span className="label">Brand</span>
              <span className="value">{product.brand}</span>
            </div>
            <div className="meta-item">
              <span className="label">Product Code</span>
              <span className="value">{product.shortCode || "AA-101"}</span>
            </div>
            <div className="meta-item">
              <span className="label">Material</span>
              <span className="value">{material}</span>
            </div>
            <div className="meta-item">
              <span className="label">Lead Time</span>
              <span className="value">{leadTime}</span>
            </div>
            <div className="meta-item">
              <span className="label">Designer</span>
              <span className="value">{designer}</span>
            </div>
            <div className="meta-item">
              <span className="label">Country of Origin</span>
              <span className="value">{countryOfOrigin}</span>
            </div>
          </div>

          <div className="hairline-divider" />

          {/* Finish Options (if exist) */}
          {product.finishOptions && product.finishOptions.length > 0 && (
            <div className="finish-options-block">
              <div className="finish-label">
                Finish Options — {product.finishOptions.length} available
              </div>
              <div className="swatches-row">
                {product.finishOptions.map((f, fIdx) => (
                  <div
                    key={f.name}
                    className={`swatch-card ${activeFinishIdx === fIdx ? "active" : ""}`}
                    onClick={() => {
                      setActiveFinishIdx(fIdx);
                      if (allImages[fIdx % allImages.length]) {
                        setSelectedImgIdx(fIdx % allImages.length);
                      }
                    }}
                  >
                    <div
                      className="swatch-color"
                      style={{ background: f.hex || "#333" }}
                    />
                    <div className="swatch-name">{f.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="btn-primary" onClick={() => setQuoteModalOpen(true)}>
              Request Quote
            </button>

            <button className="btn-secondary" onClick={() => setPdfModalOpen(true)}>
              <Download size={14} /> Download Brochure
            </button>

            <div className="icon-row">
              <button className={`icon-btn ${isSaved ? "saved" : ""}`} onClick={handleSaveToggle}>
                <Heart size={14} fill={isSaved ? "#c44b6c" : "none"} color={isSaved ? "#c44b6c" : "currentColor"} />
                <span>{isSaved ? "Saved" : "Save / Wishlist"}</span>
              </button>

              <button className="icon-btn" onClick={handleShare}>
                <Share2 size={14} />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 2 — GALLERY & CLOSEUPS ── */}
      <div className="section-container gallery-closeups-section">
        <h2 className="section-title">Gallery &amp; Closeups</h2>
        <div className="editorial-gallery-grid">
          {allImages.map((img, idx) => {
            const labels = ["Hero Perspective", "Front View", "Detail Closeup", "Texture", "Lifestyle"];
            const labelText = labels[idx % labels.length];
            return (
              <div
                key={idx}
                className={`gallery-tile ${idx === 0 ? "span-2" : ""}`}
                onClick={() => {
                  setLightboxIdx(idx);
                  setLightboxOpen(true);
                }}
              >
                <Image src={img} alt={`View ${idx}`} fill sizes="50vw" style={{ objectFit: "cover" }} />
                <div className="tile-label">{labelText}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 3 — SPECIFICATIONS & CARE ── */}
      <div className="section-container specs-section">
        <h2 className="section-title">Specifications &amp; Details</h2>
        <div className="specs-table-wrap">
          <div className="specs-row">
            <div className="spec-key">MATERIAL</div>
            <div className="spec-val">{material}</div>
          </div>
          <div className="specs-row">
            <div className="spec-key">FINISH</div>
            <div className="spec-val">{product.finish || "Antique Grain"}</div>
          </div>
          <div className="specs-row">
            <div className="spec-key">THICKNESS</div>
            <div className="spec-val">{product.thickness || "25 mm"}</div>
          </div>
          <div className="specs-row">
            <div className="spec-key">WIDTH</div>
            <div className="spec-val">{product.width || "140 mm"}</div>
          </div>
          <div className="specs-row">
            <div className="spec-key">LENGTH</div>
            <div className="spec-val">{product.depth || "3600 mm / 5400 mm"}</div>
          </div>
          <div className="specs-row">
            <div className="spec-key">APPLICATION</div>
            <div className="spec-val">{product.category} / Interior &amp; Exterior</div>
          </div>
          <div className="specs-row">
            <div className="spec-key">UV PROTECTION</div>
            <div className="spec-val">Yes — Ultra-stabilized anti-fade coating</div>
          </div>
          <div className="specs-row">
            <div className="spec-key">FIRE RATING</div>
            <div className="spec-val">Class B Fire Resistant</div>
          </div>
          <div className="specs-row">
            <div className="spec-key">WARRANTY</div>
            <div className="spec-val">25 years structural warranty</div>
          </div>
          <div className="specs-row">
            <div className="spec-key">MAINTENANCE</div>
            <div className="spec-val">Low maintenance — clean with damp cloth</div>
          </div>
        </div>
      </div>

      
        </div>
      </div>

      {/* ── SECTION 5 — DESIGNER / COLLECTION STORY ── */}
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
      </div>
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
            const itemSlug = item.id || item.name.toLowerCase().replace(/\s+/g, "-");
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
            const itemSlug = item.id || item.name.toLowerCase().replace(/\s+/g, "-");
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


      {/* ── LIGHTBOX OVERLAY ── */}
      {lightboxOpen && (
        <div className="lightbox-overlay">
          <button className="lightbox-close" onClick={() => setLightboxOpen(false)}>
            <X size={24} />
          </button>

          <button
            className="lightbox-nav left"
            onClick={() => setLightboxIdx((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}
          >
            <ChevronLeft size={28} />
          </button>

          <div className="lightbox-content">
            <Image
              src={allImages[lightboxIdx]}
              alt={`Lightbox ${lightboxIdx}`}
              width={1000}
              height={800}
              style={{ objectFit: "contain", maxHeight: "80vh" }}
            />
          </div>

          <button
            className="lightbox-nav right"
            onClick={() => setLightboxIdx((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}
          >
            <ChevronRight size={28} />
          </button>

          <div className="lightbox-thumbs">
            {allImages.map((img, idx) => (
              <div
                key={idx}
                className={`lb-thumb ${lightboxIdx === idx ? "active" : ""}`}
                onClick={() => setLightboxIdx(idx)}
              >
                <Image src={img} alt="Thumb" fill style={{ objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── QUOTE REQUEST MODAL ── */}
      {quoteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <button className="modal-close" onClick={() => setQuoteModalOpen(false)}>
              <X size={18} />
            </button>

            <h3 className="modal-title">Request a Quote</h3>
            <p className="modal-sub">Direct inquiry to Aaren Studio creative directors</p>

            {formSubmitted ? (
              <div className="form-success">
                <Check size={32} color="#10b981" />
                <p>Thank you! Your quote request has been sent.</p>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="modal-form">
                <div className="form-group">
                  <label>Product</label>
                  <input type="text" value={`${product.brand} - ${product.name}`} readOnly className="inp-readonly" />
                </div>

                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your Full Name"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@domain.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Company / Studio</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Architectural Firm / Company"
                  />
                </div>

                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Project details, quantity required, timeline..."
                  />
                </div>

                <button type="submit" className="submit-btn">
                  <Send size={14} /> Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── PDF BROCHURE MODAL ── */}
      {pdfModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <button className="modal-close" onClick={() => setPdfModalOpen(false)}>
              <X size={18} />
            </button>

            <h3 className="modal-title">Download Digital Catalogue</h3>
            <p className="modal-sub">Get official architectural catalog for {product.name}</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Downloading Catalogue PDF...");
                setPdfModalOpen(false);
                if (product.catalogPdfUrl) {
                  window.open(product.catalogPdfUrl, "_blank");
                }
              }}
              className="modal-form"
            >
              <div className="form-group">
                <label>Email *</label>
                <input type="email" required placeholder="Enter your email to download" />
              </div>
              <button type="submit" className="submit-btn">
                <Download size={14} /> Download PDF Catalog
              </button>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        .product-page {
          background: #ffffff;
          color: #0f172a;
          min-height: 100vh;
          padding-top: 5rem;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .toast-notification {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: #0f172a;
          color: #ffffff;
          padding: 12px 20px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        /* ── SECTION 1 — HERO ── */
        .hero-section {
          display: grid;
          grid-template-columns: 58% 42%;
          border-bottom: 0.5px solid #e2e8f0;
          align-items: start;
        }

        .gallery-col {
          border-right: 0.5px solid #e2e8f0;
          padding: 24px;
        }

        .main-image-wrap {
          aspect-ratio: 1;
          position: relative;
          border-radius: 6px;
          overflow: hidden;

        }

        .pdf-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(15, 23, 42, 0.85);
          color: #ffffff;
          font-size: 10px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 4px;
          letter-spacing: 0.05em;
        }

        .zoom-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #ffffff;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        }

        .thumb-strip {
          display: flex;
          gap: 8px;
          padding-top: 12px;
        }

        .thumb-btn {
          width: 52px;
          height: 52px;
          border-radius: 4px;
          position: relative;
          overflow: hidden;
          border: 1px solid #cbd5e1;
          cursor: pointer;
          background: #f1f5f9;
        }

        .thumb-btn.active {
          border: 2px solid #8c764b;
        }

        .info-col {
          padding: 32px;
          position: sticky;
          top: 5rem;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 12px;
        }

        .breadcrumb a {
          color: #94a3b8;
          text-decoration: none;
        }

        .product-name {
          font-size: 24px;
          font-family: Georgia, serif;
          font-weight: 500;
          letter-spacing: -0.02em;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .collection-name {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #94a3b8;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .tags-row {
          display: flex;
          gap: 6px;
          align-items: center;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .stock-badge {
          font-size: 10px;
          color: #10b981;
          font-weight: 700;
        }

        .cat-pill, .app-tag {
          font-size: 10px;
          background: #f1f5f9;
          padding: 2px 8px;
          border-radius: 10px;
          color: #475569;
        }

        .short-desc {
          font-size: 12px;
          line-height: 1.7;
          color: #475569;
          margin-bottom: 16px;
        }

        .hairline-divider {
          height: 0.5px;
          background: #e2e8f0;
          margin: 16px 0;
        }

        .meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px 16px;
        }

        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .meta-item .label {
          font-size: 9px;
          text-transform: uppercase;
          color: #94a3b8;
          letter-spacing: 0.05em;
          font-weight: 600;
        }

        .meta-item .value {
          font-size: 12px;
          font-weight: 500;
          color: #0f172a;
        }

        .finish-label {
          font-size: 10px;
          text-transform: uppercase;
          color: #94a3b8;
          letter-spacing: 0.05em;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .swatches-row {
          display: flex;
          gap: 8px;
        }

        .swatch-card {
          width: 56px;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          padding: 4px;
          cursor: pointer;
          text-align: center;
        }

        .swatch-card.active {
          border-color: #8c764b;
        }

        .swatch-color {
          height: 36px;
          border-radius: 2px;
          margin-bottom: 4px;
        }

        .swatch-name {
          font-size: 8px;
          color: #475569;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 20px;
        }

        .btn-primary {
          width: 100%;
          padding: 12px;
          background: #8c764b;
          color: #ffffff;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
        }

        .btn-secondary {
          width: 100%;
          padding: 10px;
          background: transparent;
          color: #0f172a;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
        }

        .icon-row {
          display: flex;
          gap: 12px;
          margin-top: 4px;
        }

        .icon-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 11px;
          color: #475569;
          background: none;
          border: none;
          cursor: pointer;
        }

        /* ── SECTION CONTAINERS ── */
        .section-container {
          padding: 48px 32px;
          border-bottom: 0.5px solid #e2e8f0;
        }

        .section-title {
          font-size: 18px;
          font-family: Georgia, serif;
          font-weight: 500;
          margin-bottom: 24px;
        }

        .editorial-gallery-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .gallery-tile {
          position: relative;
          aspect-ratio: 1.2;
          border-radius: 6px;
          overflow: hidden;
          cursor: pointer;
          background: #f1f5f9;
        }

        .gallery-tile.span-2 {
          grid-column: span 2;
          aspect-ratio: 2;
        }

        .tile-label {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: rgba(15,23,42,0.8);
          color: #ffffff;
          font-size: 10px;
          padding: 4px 8px;
          border-radius: 4px;
        }

        /* Specs table */
        .specs-table-wrap {
          border: 0.5px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
        }

        .specs-row {
          display: grid;
          grid-template-columns: 200px 1fr;
          padding: 12px 16px;
          border-bottom: 0.5px solid #e2e8f0;
        }

        .specs-row:nth-child(even) { background: #f8fafc; }

        .spec-key {
          font-size: 10px;
          text-transform: uppercase;
          color: #94a3b8;
          letter-spacing: 0.05em;
          font-weight: 700;
        }

        .spec-val {
          font-size: 12px;
          font-weight: 500;
          color: #0f172a;
        }

        /* Blueprint Section */
        .blueprint-box {
          display: grid;
          grid-template-columns: 60% 40%;
          gap: 24px;
          background: #f8fafc;
          padding: 24px;
          border-radius: 8px;
          border: 0.5px solid #e2e8f0;
        }

        .stats-area {
          display: flex;
          flex-direction: column;
          gap: 16px;
          justify-content: center;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .s-label { font-size: 9px; text-transform: uppercase; color: #94a3b8; font-weight: 700; }
        .s-val { font-size: 15px; font-weight: 600; color: #0f172a; }

        /* Story Section */
        .story-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }

        .designer-quote {
          font-size: 18px;
          font-family: Georgia, serif;
          font-style: italic;
          color: #8c764b;
          line-height: 1.5;
        }

        .designer-author {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #94a3b8;
          margin-top: 12px;
          font-weight: 600;
        }

        .story-text {
          font-size: 13px;
          line-height: 1.8;
          color: #475569;
        }

        /* Lightbox Overlay */
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.92);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lightbox-close {
          position: absolute;
          top: 24px;
          right: 24px;
          background: none;
          border: none;
          color: #ffffff;
          cursor: pointer;
        }

        .lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.1);
          border: none;
          color: #ffffff;
          padding: 12px;
          border-radius: 50%;
          cursor: pointer;
        }

        .lightbox-nav.left { left: 24px; }
        .lightbox-nav.right { right: 24px; }

        .lightbox-thumbs {
          position: absolute;
          bottom: 24px;
          display: flex;
          gap: 8px;
        }

        .lb-thumb {
          width: 48px;
          height: 48px;
          border-radius: 4px;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.3);
        }

        .lb-thumb.active { border-color: #ffffff; }

        /* Modal Overlay */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15,23,42,0.6);
          backdrop-filter: blur(4px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .modal-card {
          background: #ffffff;
          width: 100%;
          max-width: 480px;
          border-radius: 8px;
          padding: 24px;
          position: relative;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }

        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          cursor: pointer;
          color: #94a3b8;
        }

        .modal-title { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
        .modal-sub { font-size: 12px; color: #64748b; margin-bottom: 20px; }

        .modal-form { display: flex; flex-direction: column; gap: 12px; }
        .form-group { display: flex; flex-direction: column; gap: 4px; }
        .form-group label { font-size: 10px; text-transform: uppercase; font-weight: 700; color: #64748b; }
        .form-group input, .form-group textarea {
          padding: 8px 12px;
          font-size: 12px;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          outline: none;
        }
        .inp-readonly { background: #f1f5f9; color: #475569; font-weight: 600; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        .submit-btn {
          margin-top: 8px;
          padding: 10px;
          background: #8c764b;
          color: #ffffff;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
        }

        .form-success {
          text-align: center;
          padding: 32px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        @media (max-width: 1024px) {
          .hero-section { grid-template-columns: 1fr; }
          .gallery-col { border-right: none; border-bottom: 0.5px solid #e2e8f0; }
          .info-col { position: static; }
          .blueprint-box { grid-template-columns: 1fr; }
          .story-grid { grid-template-columns: 1fr; }
          .specs-row { grid-template-columns: 140px 1fr; }
        }

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

      `}</style>
    </div>
  );
}
