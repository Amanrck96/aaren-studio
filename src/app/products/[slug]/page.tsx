"use client";

import { useState, useEffect, useRef, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Eye,
  SlidersHorizontal,
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
import { DEFAULT_PRODUCTS } from "@/lib/client_constants";
import CatalogPdfGateModal from "@/components/CatalogPdfGateModal";

type Props = { params: Promise<{ slug: string }> };

export default function ProductDetailPage({ params }: Props) {
  const { slug } = use(params);

  // Core States
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [allProducts, setAllProducts] = useState<ProductItem[]>(DEFAULT_PRODUCTS);
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Gallery state
  const [selectedImgIdx, setSelectedImgIdx] = useState<number>(0);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxIdx, setLightboxIdx] = useState<number>(0);
  const [activeFinishIdx, setActiveFinishIdx] = useState<number>(0);

  // Wishlist & Toast
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modals & Drawer State
  const [quoteModalOpen, setQuoteModalOpen] = useState<boolean>(false);
  const [pdfModalOpen, setPdfModalOpen] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  // Slider Ref & Pointer Drag state
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const scrollLeftRef = useRef<number>(0);
  const [atStart, setAtStart] = useState<boolean>(true);
  const [atEnd, setAtEnd] = useState<boolean>(false);

  // Form input state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  // Fetch product & all catalog data
  useEffect(() => {
    try {
      setIsAdmin(localStorage.getItem("aaren_admin_auth") === "true" || localStorage.getItem("aaren_admin_logged_in") === "true");
    } catch(e) {}

    fetch("/api/products?t=" + Date.now(), { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (json && json.success && Array.isArray(json.data)) {
          const mergedMap = new Map<string, ProductItem>();
          DEFAULT_PRODUCTS.forEach((p) => mergedMap.set(p.id, p));
          json.data.forEach((p: ProductItem) => mergedMap.set(p.id, p));
          const mergedList = Array.from(mergedMap.values());
          setAllProducts(mergedList);

          const cleanSlug = decodeURIComponent(slug).toLowerCase().trim();
          const slugNorm = cleanSlug.replace(/[^a-z0-9]/g, "");

          const match = mergedList.find((p: ProductItem) => {
            const pId = (p.id || "").toLowerCase();
            const pName = (p.name || "").toLowerCase();
            const pSlug = (p as any).slug ? (p as any).slug.toLowerCase() : pName.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
            const pNameNorm = pName.replace(/[^a-z0-9]/g, "");
            const pIdNorm = pId.replace(/[^a-z0-9]/g, "");

            return (
              pId === cleanSlug ||
              pSlug === cleanSlug ||
              pNameNorm === slugNorm ||
              pIdNorm === slugNorm ||
              (slugNorm.length > 5 && pNameNorm.includes(slugNorm)) ||
              (slugNorm.length > 5 && slugNorm.includes(pNameNorm))
            );
          });

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

  // ESC key for Lightbox & Quick View Drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxOpen(false);
        setQuickViewProduct(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Update slider arrow state on scroll
  const handleSliderScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setAtStart(scrollLeft <= 10);
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - 10);
  };

  // Slider Arrow Navigation (Scroll 1-2 cards ~ 260px)
  const handleScrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -280, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 280, behavior: "smooth" });
    }
  };

  // Mouse Drag Events for Desktop Slider
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    scrollLeftRef.current = sliderRef.current.scrollLeft;
    sliderRef.current.style.cursor = "grabbing";
    sliderRef.current.style.userSelect = "none";
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !sliderRef.current) return;
    const x = e.clientX;
    const walk = (x - startXRef.current) * 1.5;
    sliderRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handlePointerUp = () => {
    if (!sliderRef.current) return;
    isDraggingRef.current = false;
    sliderRef.current.style.cursor = "grab";
    sliderRef.current.style.removeProperty("user-select");
  };

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
          &larr; Back to all products
        </Link>
      </div>
    );
  }

  // ── RECOMMENDATION QUERY LOGIC ──

  // 1. Related Products (Priority: Same Brand + Same Category + Same Collection)
  const norm = (s?: string) => (s || "").toLowerCase().trim();
  const cBrand = norm(product.brand);
  const cCat = norm(product.category);
  const cSub = norm(product.subcategory);

  const candidates = allProducts.filter((p) => p.id !== product.id);

  const p1 = candidates.filter(
    (p) => norm(p.brand) === cBrand && norm(p.category) === cCat && norm(p.subcategory) === cSub
  );
  const p2 = candidates.filter(
    (p) => norm(p.brand) === cBrand && norm(p.category) === cCat && !p1.some((i) => i.id === p.id)
  );
  const p3 = candidates.filter(
    (p) => norm(p.brand) === cBrand && norm(p.subcategory) === cSub && !p1.some((i) => i.id === p.id) && !p2.some((i) => i.id === p.id)
  );
  const p4 = candidates.filter(
    (p) => norm(p.brand) === cBrand && !p1.some((i) => i.id === p.id) && !p2.some((i) => i.id === p.id) && !p3.some((i) => i.id === p.id)
  );
  const p5 = candidates.filter(
    (p) => norm(p.category) === cCat && norm(p.brand) !== cBrand
  );

  const relatedProducts = [...p1, ...p2, ...p3, ...p4, ...p5].slice(0, 8);

  // 2. You May Also Like (Scoring Logic: Material +3, Finish +2, Collection +1, Style +0.5)
  const cMat = norm((product as any).material || product.category);
  const cFinish = norm(product.finish);
  const cTags = (product.tags || []).map((t) => norm(t));
  const excludeIds = [product.id, ...relatedProducts.map((p) => p.id)];

  const youMayAlsoLikeScored = candidates
    .filter((p) => !excludeIds.includes(p.id))
    .map((p) => {
      let score = 0;
      const pMat = norm((p as any).material || p.category);
      const pFinish = norm(p.finish);
      const pSub = norm(p.subcategory);
      const pTags = (p.tags || []).map((t) => norm(t));

      if (pMat && cMat && (pMat === cMat || pMat.includes(cMat) || cMat.includes(pMat))) score += 3;
      if (pFinish && cFinish && (pFinish === cFinish || pFinish.includes(cFinish) || cFinish.includes(pFinish))) score += 2;
      if (pSub && cSub && pSub === cSub) score += 1;
      pTags.forEach((t) => {
        if (cTags.includes(t)) score += 0.5;
      });

      return { product: p, score };
    });

  youMayAlsoLikeScored.sort((a, b) => b.score - a.score);
  const youMayAlsoLikeProducts = (
    youMayAlsoLikeScored.length >= 4
      ? youMayAlsoLikeScored.map((i) => i.product)
      : candidates.filter((p) => p.id !== product.id && !relatedProducts.some((r) => r.id === p.id))
  ).slice(0, 8);

  // Gallery array
  const allImages = [product.imageUrl, ...(product.galleryImages || [])].filter(Boolean);
  const pAny = product as any;
  const finishList = product.finishOptions || [];
  const material = pAny.material || "High-Density Wood Composite / Porcelain";
  const designer = pAny.designer || "Studio Aaren Design Lab";
  const collectionStory =
    pAny.story ||
    `${product.name} is part of Aaren's signature luxury series, designed to harmonize architectural precision with raw tactile texture. Engineered for high-traffic environments, it delivers unparalleled resilience and enduring aesthetic appeal.`;

  // Handlers
  const handleSaveToggle = () => {
    const next = !isSaved;
    setIsSaved(next);
    try {
      localStorage.setItem(`aaren_fav_${slug}`, String(next));
    } catch (e) {}
    setToastMsg(next ? "Saved to your wishlist" : "Removed from wishlist");
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setToastMsg("Product link copied to clipboard");
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "Not provided",
        company: formData.company,
        message: formData.message,
        productOrBrand: product ? `${product.brand} - ${product.name}` : "Product Quote",
        subject: `Product Quote Request for ${product ? product.name : "Product"}${formData.company ? ` (${formData.company})` : ""}`,
        type: "Product Quote Request",
      };
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Failed to post live inquiry:", err);
    }
    setFormSubmitted(true);
    setTimeout(() => {
      setQuoteModalOpen(false);
      setFormSubmitted(false);
      setFormData({ name: "", email: "", phone: "", company: "", message: "" });
    }, 2000);
  };

  return (
    <div className="product-detail-page">
      {/* Toast Notification */}
      {toastMsg && <div className="toast-notification">{toastMsg}</div>}

      {/* ── SECTION 1 — HERO & SPECS ── */}
      <div className="hero-split-container">
        {/* LEFT 58%: GALLERY & LIGHTBOX */}
        <div className="gallery-left-col">
          <div className="main-image-viewport">
            {allImages.length > 0 ? (
              <Image
                src={allImages[selectedImgIdx] || product.imageUrl}
                alt={product.name}
                fill
                priority
                sizes="60vw"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f8fafc", color: "#64748b", padding: "2rem", textAlign: "center" }}>
                <span style={{ fontSize: "3rem", marginBottom: "0.8rem", opacity: 0.5 }}>📦</span>
                <span style={{ fontSize: "0.9rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8c764b" }}>{product.brand || "AAREN"}</span>
                <span style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "4px" }}>Product Photo Pending Upload</span>
              </div>
            )}

            <button
              className="zoom-btn"
              onClick={() => {
                setLightboxIdx(selectedImgIdx);
                setLightboxOpen(true);
              }}
              aria-label="Expand image"
            >
              <ZoomIn size={16} />
            </button>
          </div>

          {/* Thumbnail Strip */}
          <div className="thumbnail-strip">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                className={`thumb-btn ${selectedImgIdx === idx ? "active" : ""}`}
                onClick={() => setSelectedImgIdx(idx)}
              >
                <Image src={img} alt={`Thumb ${idx}`} fill style={{ objectFit: "cover" }} />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT 42%: STICKY INFO PANEL */}
        <div className="info-right-col">
          {/* Breadcrumb & Admin Edit Access */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
            <div className="breadcrumb" style={{ margin: 0 }}>
              <Link href="/">Home</Link>
              <ChevronRight size={10} />
              <Link href="/products">Products</Link>
              <ChevronRight size={10} />
              <span>{product.brand}</span>
            </div>
          </div>

          <h1 className="product-title">{product.name}</h1>

          <div className="collection-meta">
            <span className="brand-tag">{product.brand}</span>
            <span className="dot">•</span>
            <span>{product.subcategory || product.category}</span>
            {product.shortCode && <span className="code-pill">{product.shortCode}</span>}
          </div>

          {/* Stock badge hidden as per user directive */}

          <p className="product-desc">{product.description}</p>

          {/* Key Meta Grid */}
          <div className="meta-grid">
            <div className="meta-item">
              <span className="meta-lbl">Category</span>
              <span className="meta-val">{product.category}</span>
            </div>
            <div className="meta-item">
              <span className="meta-lbl">Material</span>
              <span className="meta-val">{material}</span>
            </div>
            <div className="meta-item">
              <span className="meta-lbl">Origin</span>
              <span className="meta-val">{pAny.origin || "Italy"}</span>
            </div>
            <div className="meta-item">
              <span className="meta-lbl">Lead Time</span>
              <span className="meta-val">{pAny.leadTime || "2 - 3 Weeks"}</span>
            </div>
          </div>

          {/* Finish Swatches */}
          {finishList.length > 0 && (
            <div className="finish-swatches-wrap">
              <div className="swatch-lbl">AVAILABLE FINISHES</div>
              <div className="swatch-list">
                {finishList.map((f: any, idx: number) => (
                  <button
                    key={idx}
                    className={`swatch-btn ${activeFinishIdx === idx ? "active" : ""}`}
                    onClick={() => {
                      setActiveFinishIdx(idx);
                      if (allImages[idx]) setSelectedImgIdx(idx);
                    }}
                  >
                    <span className="swatch-color" style={{ background: f.hex || "#333" }} />
                    <span className="swatch-name">{f.name}</span>
                  </button>
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
              <Eye size={14} /> View Digital Catalogue
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
            <div className="spec-val">{product.warranty || "25 years structural warranty"}</div>
          </div>
          <div className="specs-row">
            <div className="spec-key">MAINTENANCE</div>
            <div className="spec-val">Low maintenance — clean with damp cloth</div>
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

      {/* ── SECTION 4 — RELATED PRODUCTS (EDITORIAL SLIDER WITH ARROWS & MOUSE DRAG) ── */}
      {relatedProducts.length > 0 && (
        <div className="section-container recommendation-section">
          <div className="recommendation-header">
            <div>
              <span className="recommendation-label">RECOMMENDATIONS</span>
              <h2 className="recommendation-title">Related Products</h2>
              <p className="recommendation-subtitle">Same brand, category &amp; collection</p>
            </div>

            {/* Navigation Arrow Controls */}
            <div className="slider-controls">
              <button
                className={`slider-arrow-btn ${atStart ? "disabled" : ""}`}
                onClick={handleScrollLeft}
                disabled={atStart}
                aria-label="Previous"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                className={`slider-arrow-btn ${atEnd ? "disabled" : ""}`}
                onClick={handleScrollRight}
                disabled={atEnd}
                aria-label="Next"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Horizontal Drag/Scroll Track */}
          <div
            ref={sliderRef}
            className="recommendation-slider-track"
            onScroll={handleSliderScroll}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {relatedProducts.map((item) => {
              const itemSlug = item.id || item.name.toLowerCase().replace(/\s+/g, "-");
              return (
                <div key={item.id} className="recommendation-card">
                  {/* Image Container Aspect 0.85 */}
                  <div className="card-thumb-wrap">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="300px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>

                  {/* Card Content */}
                  <div className="card-content">
                    <span className="card-brand">{item.brand}</span>
                    <h3 className="card-name">{item.name}</h3>
                    <span className="card-collection">{item.subcategory || item.category}</span>

                    <div className="card-actions">
                      <Link href={`/products/${itemSlug}`} className="btn-card-view">
                        View
                      </Link>
                      <button className="btn-card-quick" onClick={() => setQuickViewProduct(item)}>
                        Quick
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── SECTION 5 — YOU MAY ALSO LIKE (4-COL / 2-COL / 1-COL RESPONSIVE GRID) ── */}
      {youMayAlsoLikeProducts.length > 0 && (
        <div className="section-container recommendation-section">
          <div className="recommendation-header">
            <div>
              <span className="recommendation-label">SIMILAR PRODUCTS</span>
              <h2 className="recommendation-title">You May Also Like</h2>
              <p className="recommendation-subtitle">Similar material, finish &amp; style</p>
            </div>
          </div>

          <div className="recommendation-grid-layout">
            {youMayAlsoLikeProducts.map((item) => {
              const itemSlug = item.id || item.name.toLowerCase().replace(/\s+/g, "-");
              return (
                <div key={item.id} className="recommendation-card">
                  <div className="card-thumb-wrap">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>

                  <div className="card-content">
                    <span className="card-brand">{item.brand}</span>
                    <h3 className="card-name">{item.name}</h3>
                    <span className="card-collection">{item.finish || item.subcategory || item.category}</span>

                    <div className="card-actions">
                      <Link href={`/products/${itemSlug}`} className="btn-card-view">
                        View
                      </Link>
                      <button className="btn-card-quick" onClick={() => setQuickViewProduct(item)}>
                        Quick
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── QUICK VIEW DRAWER (SLIDE IN FROM RIGHT) ── */}
      {quickViewProduct && (
        <div className="quick-view-backdrop" onClick={() => setQuickViewProduct(null)}>
          <div className="quick-view-drawer" onClick={(e) => e.stopPropagation()}>
            <button className="drawer-close-btn" onClick={() => setQuickViewProduct(null)}>
              <X size={18} />
            </button>

            <div className="drawer-body">
              <div className="drawer-img-wrap">
                <Image
                  src={quickViewProduct.imageUrl}
                  alt={quickViewProduct.name}
                  fill
                  sizes="400px"
                  style={{ objectFit: "cover" }}
                />
              </div>

              <div className="drawer-info">
                <span className="drawer-brand">{quickViewProduct.brand}</span>
                <h3 className="drawer-title">{quickViewProduct.name}</h3>
                <span className="drawer-collection">{quickViewProduct.subcategory || quickViewProduct.category}</span>

                <p className="drawer-desc">
                  {quickViewProduct.description || "Architectural material surface engineered for high-performance luxury interior & exterior spaces."}
                </p>

                <div className="drawer-tags">
                  <span className="d-tag">Material: {quickViewProduct.category}</span>
                  <span className="d-tag">Finish: {quickViewProduct.finish || "Natural Grain"}</span>
                  {quickViewProduct.shortCode && <span className="d-tag">Code: {quickViewProduct.shortCode}</span>}
                </div>

                <div className="drawer-actions">
                  <Link
                    href={`/products/${quickViewProduct.id}`}
                    className="drawer-btn-primary"
                    onClick={() => setQuickViewProduct(null)}
                  >
                    View Full Page &rarr;
                  </Link>
                  <button
                    className="drawer-btn-secondary"
                    onClick={() => {
                      setQuickViewProduct(null);
                      setQuoteModalOpen(true);
                    }}
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
                  <label>Company / Project Name</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Studio or Residence name"
                  />
                </div>

                <div className="form-group">
                  <label>Project Message / Quantity Requirements</label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Specify total area (sq.ft / sq.m) or special finish requirements..."
                  />
                </div>

                <button type="submit" className="btn-modal-submit">
                  <Send size={14} /> Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── BROCHURE LEAD GATE & VIEW-ONLY MODAL ── */}
      {pdfModalOpen && (
        <CatalogPdfGateModal
          catalogPdfUrl={product.catalogPdfUrl || "/catalogues/NewTechWood/NewTechWood-Product-Catalog-2025.pdf"}
          itemTitle={product.name}
          onClose={() => setPdfModalOpen(false)}
        />
      )}

      {/* ── STYLES ── */}
      <style jsx>{`
        .product-detail-page {
          background: var(--surface-0);
          color: var(--text-main);
          min-height: 100vh;
          padding-top: 80px;
          padding-bottom: 80px;
        }

        .toast-notification {
          position: fixed;
          bottom: 30px;
          right: 30px;
          background: #0f172a;
          color: #ffffff;
          padding: 12px 20px;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 500;
          z-index: 9999;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        /* ── HERO SPLIT LAYOUT (58% / 42%) ── */
        .hero-split-container {
          display: grid;
          grid-template-columns: 58% 42%;
          min-height: calc(100vh - 80px);
          border-bottom: 0.5px solid var(--border);
        }

        @media (max-width: 992px) {
          .hero-split-container {
            grid-template-columns: 1fr;
          }
        }

        .gallery-left-col {
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          border-right: 0.5px solid var(--border);
          background: var(--surface-1);
        }

        .main-image-viewport {
          position: relative;
          aspect-ratio: 1;
          width: 100%;
          border-radius: 8px;
          overflow: hidden;
          background: #f1f5f9;
        }

        .pdf-page-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          background: rgba(0,0,0,0.75);
          color: #ffffff;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          padding: 4px 10px;
          border-radius: 4px;
          backdrop-filter: blur(4px);
        }

        .zoom-btn {
          position: absolute;
          bottom: 16px;
          right: 16px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.9);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .zoom-btn:hover {
          transform: scale(1.1);
        }

        .thumbnail-strip {
          display: flex;
          gap: 12px;
          overflow-x: auto;
        }

        .thumb-btn {
          position: relative;
          width: 52px;
          height: 52px;
          border-radius: 6px;
          overflow: hidden;
          border: 1.5px solid transparent;
          cursor: pointer;
          flex-shrink: 0;
        }

        .thumb-btn.active {
          border-color: #8c764b;
        }

        .info-right-col {
          padding: 40px;
          position: sticky;
          top: 80px;
          height: fit-content;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--text-muted);
        }

        .breadcrumb a {
          color: var(--text-muted);
          text-decoration: none;
        }

        .product-title {
          font-family: var(--font-jost), serif;
          font-size: 28px;
          font-weight: 400;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .collection-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--text-muted);
        }

        .brand-tag {
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .code-pill {
          background: var(--surface-0);
          border: 0.5px solid var(--border);
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
        }

        .stock-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #10b981;
          font-weight: 500;
        }

        .green-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
        }

        .product-desc {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.6;
          margin: 0;
        }

        .meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          padding: 16px;
          background: var(--surface-1);
          border: 0.5px solid var(--border);
          border-radius: 8px;
        }

        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .meta-lbl {
          font-size: 10px;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .meta-val {
          font-size: 13px;
          font-weight: 500;
        }

        .finish-swatches-wrap {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .swatch-lbl {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          font-weight: 600;
        }

        .swatch-list {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .swatch-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 20px;
          border: 0.5px solid var(--border);
          background: var(--surface-1);
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s ease;
        }

        .swatch-btn.active {
          border-color: #8c764b;
          box-shadow: 0 0 0 1px #8c764b;
        }

        .swatch-color {
          width: 14px;
          height: 14px;
          border-radius: 50%;
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 10px;
        }

        .btn-primary {
          background: var(--text-main);
          color: #ffffff;
          border: none;
          padding: 14px 24px;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .btn-primary:hover {
          opacity: 0.9;
        }

        .btn-secondary {
          background: transparent;
          color: var(--text-main);
          border: 0.5px solid var(--border);
          padding: 12px 24px;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .icon-row {
          display: flex;
          gap: 16px;
          margin-top: 4px;
        }

        .icon-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        /* ── SECTION CONTAINERS (EDITORIAL ABOUT PAGE STYLE) ── */
        .section-container {
          max-width: 1200px;
          margin: 60px auto 0;
          padding: 0 24px;
        }

        .section-title {
          font-family: var(--font-jost), serif;
          font-size: 24px;
          font-weight: 400;
          margin-bottom: 24px;
        }

        /* Editorial Gallery Grid */
        .editorial-gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        @media (max-width: 768px) {
          .editorial-gallery-grid {
            grid-template-columns: 1fr;
          }
        }

        .gallery-tile {
          position: relative;
          aspect-ratio: 1.2;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          background: #f1f5f9;
        }

        .gallery-tile.span-2 {
          grid-column: span 2;
        }

        @media (max-width: 768px) {
          .gallery-tile.span-2 {
            grid-column: span 1;
          }
        }

        .tile-label {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: rgba(0,0,0,0.7);
          color: #ffffff;
          font-size: 10px;
          font-weight: 500;
          padding: 4px 10px;
          border-radius: 4px;
          backdrop-filter: blur(4px);
        }

        /* Specs Table */
        .specs-table-wrap {
          border: 0.5px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
        }

        .specs-row {
          display: grid;
          grid-template-columns: 240px 1fr;
          padding: 14px 20px;
          border-bottom: 0.5px solid var(--border);
          font-size: 13px;
        }

        .specs-row:nth-child(even) {
          background: var(--surface-1);
        }

        .specs-row:last-child {
          border-bottom: none;
        }

        .spec-key {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          font-weight: 600;
        }

        /* Story Section */
        .story-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 40px;
          background: var(--surface-1);
          padding: 40px;
          border-radius: 12px;
          border: 0.5px solid var(--border);
        }

        @media (max-width: 768px) {
          .story-grid {
            grid-template-columns: 1fr;
          }
        }

        .designer-quote {
          font-family: var(--font-jost), serif;
          font-size: 20px;
          font-style: italic;
          line-height: 1.4;
        }

        .designer-author {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 12px;
          font-weight: 600;
        }

        .story-text {
          font-size: 14px;
          line-height: 1.7;
          color: var(--text-muted);
          margin: 0;
        }

        /* ── SECTION 4 & 5 RECOMMENDATION EDITORIAL STYLING ── */
        .recommendation-section {
          margin-top: 70px;
        }

        .recommendation-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 24px;
        }

        .recommendation-label {
          font-size: 9px;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 0.15em;
          font-weight: 700;
          display: block;
          margin-bottom: 4px;
        }

        .recommendation-title {
          font-family: var(--font-jost), serif;
          font-size: 28px;
          font-weight: 300;
          letter-spacing: -0.02em;
          margin: 0 0 4px;
        }

        .recommendation-subtitle {
          font-size: 12px;
          color: var(--text-muted);
          margin: 0;
        }

        .slider-controls {
          display: flex;
          gap: 8px;
        }

        .slider-arrow-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 0.5px solid var(--border);
          background: var(--surface-1);
          color: var(--text-main);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .slider-arrow-btn.disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .slider-arrow-btn:not(.disabled):hover {
          background: var(--text-main);
          color: #ffffff;
        }

        .recommendation-slider-track {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding-bottom: 12px;
          cursor: grab;
          scrollbar-width: thin;
          scrollbar-color: var(--border) transparent;
        }

        .recommendation-slider-track::-webkit-scrollbar {
          height: 6px;
        }

        .recommendation-slider-track::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 3px;
        }

        .recommendation-card {
          min-width: 240px;
          max-width: 280px;
          flex: 0 0 240px;
          scroll-snap-align: start;
          background: var(--surface-1);
          border: 0.5px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: border-color 0.2s ease, transform 0.2s ease;
        }

        .recommendation-card:hover {
          border-color: #8c764b;
          transform: translateY(-3px);
        }

        .card-thumb-wrap {
          position: relative;
          aspect-ratio: 0.85;
          width: 100%;
          background: #f1f5f9;
        }

        .card-content {
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .card-brand {
          font-size: 8px;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 0.08em;
          font-weight: 700;
        }

        .card-name {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-main);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-collection {
          font-size: 9px;
          color: var(--text-muted);
          display: block;
          margin-bottom: 10px;
        }

        .card-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .btn-card-view {
          padding: 6px 10px;
          font-size: 11px;
          font-weight: 600;
          text-align: center;
          background: var(--text-main);
          color: #ffffff;
          border-radius: 4px;
          text-decoration: none;
        }

        .btn-card-quick {
          padding: 6px 10px;
          font-size: 11px;
          font-weight: 500;
          text-align: center;
          background: transparent;
          border: 0.5px solid var(--border);
          color: var(--text-main);
          border-radius: 4px;
          cursor: pointer;
        }

        /* ── SECTION 5 GRID LAYOUT (4 DESKTOP, 2 TABLET, 1 MOBILE) ── */
        .recommendation-grid-layout {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        @media (max-width: 1024px) {
          .recommendation-grid-layout {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .recommendation-grid-layout {
            grid-template-columns: 1fr;
          }
        }

        /* ── QUICK VIEW DRAWER (SLIDE IN RIGHT) ── */
        .quick-view-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          z-index: 9999;
          display: flex;
          justify-content: flex-end;
        }

        .quick-view-drawer {
          width: 380px;
          max-width: 100vw;
          height: 100vh;
          background: var(--surface-1);
          padding: 24px;
          position: relative;
          overflow-y: auto;
          box-shadow: -10px 0 40px rgba(0,0,0,0.2);
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .drawer-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--text-main);
        }

        .drawer-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 20px;
        }

        .drawer-img-wrap {
          position: relative;
          aspect-ratio: 1;
          width: 100%;
          border-radius: 8px;
          overflow: hidden;
          background: #f1f5f9;
        }

        .drawer-brand {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #8c764b;
          font-weight: 700;
        }

        .drawer-title {
          font-size: 18px;
          font-weight: 600;
          margin: 4px 0;
        }

        .drawer-collection {
          font-size: 11px;
          color: var(--text-muted);
          display: block;
        }

        .drawer-desc {
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .drawer-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .d-tag {
          font-size: 10px;
          background: var(--surface-0);
          border: 0.5px solid var(--border);
          padding: 4px 8px;
          border-radius: 4px;
          color: var(--text-main);
        }

        .drawer-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 12px;
        }

        .drawer-btn-primary {
          background: var(--text-main);
          color: #ffffff;
          padding: 12px;
          text-align: center;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
        }

        .drawer-btn-secondary {
          background: transparent;
          border: 0.5px solid var(--border);
          color: var(--text-main);
          padding: 10px;
          text-align: center;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
        }

        /* Modals & Lightbox */
        .lightbox-overlay, .modal-overlay {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          background: rgba(0, 0, 0, 0.88) !important;
          backdrop-filter: blur(8px) !important;
          -webkit-backdrop-filter: blur(8px) !important;
          z-index: 999999 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 16px !important;
        }

        .lightbox-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: transparent;
          border: none;
          color: #ffffff;
          cursor: pointer;
        }
        .modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 50%;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .modal-close:hover { background: #e5484d; color: #fff; }

        .modal-card {
          background: #121316 !important;
          border: 1px solid rgba(140, 118, 75, 0.4) !important;
          padding: 36px 32px !important;
          border-radius: 20px !important;
          max-width: 540px !important;
          width: 100% !important;
          max-height: 90vh !important;
          overflow-y: auto !important;
          color: #ffffff !important;
          position: relative !important;
          box-shadow: 0 30px 80px rgba(0,0,0,0.8) !important;
        }

        .modal-title {
          font-size: 22px !important;
          font-weight: 800 !important;
          text-transform: uppercase !important;
          letter-spacing: -0.01em !important;
          color: #ffffff !important;
          margin-bottom: 4px !important;
        }

        .modal-sub {
          font-size: 12px !important;
          color: rgba(255, 255, 255, 0.6) !important;
          margin-bottom: 24px !important;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: rgba(255, 255, 255, 0.75);
        }

        .form-group input, .form-group textarea {
          padding: 12px 14px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          font-size: 13px;
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          font-family: inherit;
        }

        .form-group input::placeholder, .form-group textarea::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }

        .form-group input:focus, .form-group textarea:focus {
          outline: none;
          border-color: #8c764b;
        }

        .inp-readonly {
          background: rgba(255, 255, 255, 0.15) !important;
          font-weight: 700 !important;
          color: #8c764b !important;
          border-color: rgba(140, 118, 75, 0.5) !important;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .btn-modal-submit {
          background: #8c764b;
          color: #ffffff;
          padding: 14px;
          border: none;
          border-radius: 999px;
          font-weight: 800;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 8px 20px rgba(140, 118, 75, 0.3);
          transition: background 0.25s ease;
        }

        .btn-modal-submit:hover {
          background: #a38959;
        }

        .pdf-download-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 20px 0;
        }

        .btn-download-now {
          background: #8c764b;
          color: #ffffff;
          padding: 12px 24px;
          border-radius: 20px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
