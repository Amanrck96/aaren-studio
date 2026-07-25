"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const PRODUCTS = [
  {
    id: "queen-sofa",
    name: "QUEEN SOFA",
    brand: "Madheke",
    category: "Sofas",
    designer: "RUMI BOUCHEVICHI",
    shortDesc: "The Queen sofa embodies the harmony of proportion and comfort. More stance in fabric with subtle curves, it invites conversation and repose.",
    fullDesc: "Its walnut form with cast brass legs highlight its silhouette, while cushioned arms and bolster cushions soft-focus its geometry for a welcoming presence.",
    price: 480000,
    mainImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80"
    ],
    finishes: [
      { name: "Palma Teal Natural Leather", label: "Seat: Teal, Frame: Walnut", color: "#2B4C59" },
      { name: "Palma Tan Vintage Leather", label: "Seat: Tan, Frame: Brass", color: "#A0522D" },
      { name: "Cream Wool Boucle", label: "Seat: Ivory, Frame: Walnut", color: "#F3EFE6" },
      { name: "Charcoal Slate Velvet", label: "Seat: Slate, Frame: Black Steel", color: "#2F4F4F" }
    ],
    details: {
      dimensions: "W 280 cm x D 105 cm x H 75 cm (Seat H 42 cm)",
      leadTime: "8 to 10 weeks from order confirmation.",
      shipping: "White-glove installation across India. International freight calculated at inquiry.",
      care: "Professional leather and fabric clean only. Avoid direct exposure to prolonged sunlight."
    }
  },
  {
    id: "queen-armchair",
    name: "QUEEN ARMCHAIR",
    brand: "Madheke",
    category: "Sofas",
    designer: "RUMI BOUCHEVICHI",
    shortDesc: "Sculptural single armchair in deep black calf leather with curved walnut back shell.",
    fullDesc: "Designed to match the Queen Sofa system, featuring high-density acoustic cushioning.",
    price: 185000,
    mainImage: "https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?auto=format&fit=crop&w=800&q=80",
    finishes: [{ name: "Nero Leather", color: "#111111" }],
    details: { dimensions: "W 95 cm x D 90 cm x H 75 cm", leadTime: "6 to 8 weeks", shipping: "Complimentary Delivery", care: "Leather balm application quarterly." }
  },
  {
    id: "madheke-coffee-table",
    name: "MADHEKE BRASS COFFEE TABLE",
    brand: "Madheke",
    category: "Tables",
    designer: "Loco & Madheke",
    shortDesc: "Solid travertine top resting on hand-patinated cast brass legs.",
    fullDesc: "Architectural coffee table with honed stone surfaces.",
    price: 240000,
    mainImage: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80",
    finishes: [{ name: "Roman Travertine", color: "#D2B48C" }],
    details: { dimensions: "W 140 cm x D 80 cm x H 38 cm", leadTime: "4 to 6 weeks", shipping: "Crated Freight", care: "Seal stone surface annually." }
  }
];

export default function MadhekeProductDetailPage() {
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [selectedFinish, setSelectedFinish] = useState(PRODUCTS[0].finishes[0]);
  const [selectedImage, setSelectedImage] = useState(PRODUCTS[0].mainImage);

  const [expandedSection, setExpandedSection] = useState<string | null>("details");
  const [cartCount, setCartCount] = useState(0);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  // Suggestions of same Brand and Category (Image 2 prompt)
  const relatedProducts = PRODUCTS.filter(
    (p) => p.brand === selectedProduct.brand && p.id !== selectedProduct.id
  );

  function toggleSection(sec: string) {
    setExpandedSection(expandedSection === sec ? null : sec);
  }

  return (
    <div className="madheke-page">
      {/* Top Bar Navigation */}
      <div className="madheke-bar">
        <div className="madheke-bar-left">
          <Link href="/products" className="madheke-back">← CATALOGUE</Link>
          <span className="madheke-brand">MADHEKE / {selectedProduct.category.toUpperCase()}</span>
        </div>
        <div className="madheke-bar-right">
          <button className="quote-cart-btn" onClick={() => setShowQuoteModal(true)}>
            QUOTE CART ({cartCount})
          </button>
        </div>
      </div>

      <div className="madheke-content">
        {/* PANEL 1 & 2: Main Product Layout */}
        <div className="madheke-hero-grid">
          {/* Main Visual & Gallery */}
          <div className="madheke-visuals">
            <div className="madheke-main-image-wrap">
              <Image
                src={selectedImage}
                alt={selectedProduct.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            {selectedProduct.gallery && (
              <div className="madheke-gallery-thumbs">
                {selectedProduct.gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`thumb-btn ${selectedImage === img ? "active" : ""}`}
                  >
                    <Image src={img} alt="Gallery" fill style={{ objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Specifications & Swatches */}
          <div className="madheke-info">
            <div className="madheke-title-row">
              <h1 className="madheke-title">{selectedProduct.name}</h1>
              <span className="madheke-designer">DESIGNER: {selectedProduct.designer}</span>
            </div>

            <p className="madheke-desc">{selectedProduct.shortDesc}</p>
            <p className="madheke-full-desc">{selectedProduct.fullDesc}</p>

            {/* Finish Swatches (Image 2 panel 1 reference) */}
            <div className="madheke-finish-section">
              <span className="section-label">FINISH OPTIONS:</span>
              <div className="swatch-grid">
                {selectedProduct.finishes.map((f, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedFinish(f)}
                    className={`swatch-card ${selectedFinish.name === f.name ? "active" : ""}`}
                  >
                    <span className="swatch-color" style={{ background: f.color }} />
                    <span className="swatch-name">{f.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons (Image 2 panel 2 reference) */}
            <div className="madheke-actions">
              <button
                className="btn-request-quote"
                onClick={() => {
                  setCartCount((c) => c + 1);
                  setShowQuoteModal(true);
                }}
              >
                REQUEST QUOTE
              </button>

              <button
                className="btn-add-cart"
                onClick={() => setCartCount((c) => c + 1)}
              >
                + ADD TO QUOTE CART
              </button>
            </div>

            {/* Collapsible Accordion Sections (Details, Dimensions, Leadtime, Shipping, Care) */}
            <div className="madheke-accordion">
              <div className="accordion-item">
                <button className="accordion-header" onClick={() => toggleSection("details")}>
                  <span>DETAILS</span>
                  <span>{expandedSection === "details" ? "-" : "+"}</span>
                </button>
                {expandedSection === "details" && (
                  <div className="accordion-body">
                    Handcrafted in Italy by Madheke master artisans. Internal steel structure with high-resilience polyurethane foam.
                  </div>
                )}
              </div>

              <div className="accordion-item">
                <button className="accordion-header" onClick={() => toggleSection("dimensions")}>
                  <span>DIMENSIONS</span>
                  <span>{expandedSection === "dimensions" ? "-" : "+"}</span>
                </button>
                {expandedSection === "dimensions" && (
                  <div className="accordion-body">
                    {selectedProduct.details.dimensions}
                  </div>
                )}
              </div>

              <div className="accordion-item">
                <button className="accordion-header" onClick={() => toggleSection("leadtime")}>
                  <span>LEADTIME</span>
                  <span>{expandedSection === "leadtime" ? "-" : "+"}</span>
                </button>
                {expandedSection === "leadtime" && (
                  <div className="accordion-body">
                    {selectedProduct.details.leadTime}
                  </div>
                )}
              </div>

              <div className="accordion-item">
                <button className="accordion-header" onClick={() => toggleSection("shipping")}>
                  <span>SHIPPING & RETURNS</span>
                  <span>{expandedSection === "shipping" ? "-" : "+"}</span>
                </button>
                {expandedSection === "shipping" && (
                  <div className="accordion-body">
                    {selectedProduct.details.shipping}
                  </div>
                )}
              </div>

              <div className="accordion-item">
                <button className="accordion-header" onClick={() => toggleSection("care")}>
                  <span>CARE</span>
                  <span>{expandedSection === "care" ? "-" : "+"}</span>
                </button>
                {expandedSection === "care" && (
                  <div className="accordion-body">
                    {selectedProduct.details.care}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* PANEL 3: Suggestions of same Brand and Category (Image 2 panel 3 reference) */}
        <div className="madheke-related-section">
          <div className="related-header">
            <h2 className="related-title">RELATED PRODUCTS</h2>
            <p className="related-sub">Suggestions of same Brand ({selectedProduct.brand}) and Category ({selectedProduct.category})</p>
          </div>

          <div className="related-grid">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                className="related-card"
                onClick={() => {
                  setSelectedProduct(rel);
                  setSelectedFinish(rel.finishes[0]);
                  setSelectedImage(rel.mainImage);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <div className="related-img-wrap">
                  <Image src={rel.mainImage} alt={rel.name} fill style={{ objectFit: "cover" }} />
                </div>
                <div className="related-info">
                  <h3 className="related-card-title">{rel.name}</h3>
                  <span className="related-card-brand">{rel.brand}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quote Request Modal */}
      {showQuoteModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">REQUEST QUOTE — AAREN STUDIO</h3>
            <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "1rem" }}>
              Request official specification quote for <strong>{selectedProduct.name}</strong> ({selectedFinish.name}).
            </p>

            <form onSubmit={(e) => { e.preventDefault(); alert("Quote Request Sent! Our material specialist will contact you shortly."); setShowQuoteModal(false); }}>
              <input type="text" placeholder="Your Name" required className="modal-input" />
              <input type="email" placeholder="Your Email" required className="modal-input" />
              <input type="tel" placeholder="Phone Number" required className="modal-input" />
              <textarea placeholder="Project Details / Quantity" rows={3} className="modal-input" />

              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button type="button" onClick={() => setShowQuoteModal(false)} className="btn-modal-cancel">Cancel</button>
                <button type="submit" className="btn-modal-submit">Submit Inquiry</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .madheke-page {
          background: #fbf9f5;
          color: #1a1a1a;
          min-height: 100vh;
          padding-top: 8rem;
          font-family: serif;
        }

        .madheke-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.2rem 3rem;
          border-bottom: 1px solid rgba(0,0,0,0.08);
          background: #f4efe6;
          font-family: sans-serif;
          font-size: 0.85rem;
          letter-spacing: 0.08em;
        }

        .madheke-back {
          text-decoration: none;
          color: #000;
          font-weight: 700;
          margin-right: 2rem;
        }

        .quote-cart-btn {
          background: #000;
          color: #fff;
          border: none;
          padding: 0.6rem 1.2rem;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          border-radius: 2px;
        }

        .madheke-content {
          max-width: 1350px;
          margin: 0 auto;
          padding: 3rem 2rem 6rem;
        }

        .madheke-hero-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 4rem;
          margin-bottom: 6rem;
        }

        @media (max-width: 960px) {
          .madheke-hero-grid {
            grid-template-columns: 1fr;
          }
        }

        .madheke-main-image-wrap {
          position: relative;
          height: 520px;
          background: #eee;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .madheke-gallery-thumbs {
          display: flex;
          gap: 1rem;
        }

        .thumb-btn {
          position: relative;
          width: 80px;
          height: 80px;
          border: 2px solid transparent;
          cursor: pointer;
          overflow: hidden;
          background: #eee;
        }

        .thumb-btn.active {
          border-color: #000;
        }

        .madheke-title {
          font-size: 3rem;
          font-weight: 400;
          letter-spacing: -0.02em;
          margin-bottom: 0.2rem;
          text-transform: uppercase;
        }

        .madheke-designer {
          font-family: sans-serif;
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          color: #888;
          display: block;
          margin-bottom: 1.5rem;
        }

        .madheke-desc {
          font-size: 1.15rem;
          line-height: 1.6;
          color: #444;
          margin-bottom: 0.8rem;
        }

        .madheke-full-desc {
          font-size: 1rem;
          line-height: 1.6;
          color: #666;
          margin-bottom: 2rem;
          font-style: italic;
        }

        .section-label {
          font-family: sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #888;
          display: block;
          margin-bottom: 0.8rem;
        }

        .swatch-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.8rem;
          margin-bottom: 2rem;
        }

        .swatch-card {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.6rem;
          border: 1px solid #ddd;
          background: #fff;
          cursor: pointer;
          text-align: left;
          font-family: sans-serif;
          font-size: 0.8rem;
        }

        .swatch-card.active {
          border-color: #000;
          background: #f4efe6;
          font-weight: 700;
        }

        .swatch-color {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.1);
        }

        .madheke-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 2.5rem;
        }

        .btn-request-quote {
          flex: 1;
          padding: 1.1rem;
          background: #000;
          color: #fff;
          border: none;
          font-family: sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          cursor: pointer;
        }

        .btn-add-cart {
          flex: 1;
          padding: 1.1rem;
          background: transparent;
          color: #000;
          border: 1px solid #000;
          font-family: sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          cursor: pointer;
        }

        .accordion-item {
          border-top: 1px solid #ddd;
        }

        .accordion-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          padding: 1rem 0;
          background: none;
          border: none;
          font-family: sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          cursor: pointer;
        }

        .accordion-body {
          padding-bottom: 1rem;
          font-family: sans-serif;
          font-size: 0.9rem;
          color: #555;
          line-height: 1.5;
        }

        /* Related Products Section (Panel 3) */
        .madheke-related-section {
          border-top: 1px solid #ddd;
          padding-top: 3rem;
        }

        .related-title {
          font-size: 2rem;
          font-weight: 400;
          margin-bottom: 0.3rem;
        }

        .related-sub {
          font-family: sans-serif;
          font-size: 0.85rem;
          color: #777;
          margin-bottom: 2rem;
        }

        .related-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .related-card {
          cursor: pointer;
        }

        .related-img-wrap {
          position: relative;
          height: 260px;
          background: #eee;
          margin-bottom: 0.8rem;
          overflow: hidden;
        }

        .related-card-title {
          font-size: 1.2rem;
          font-weight: 400;
        }

        .related-card-brand {
          font-family: sans-serif;
          font-size: 0.75rem;
          color: #888;
          letter-spacing: 0.08em;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-box {
          background: #fff;
          padding: 2.5rem;
          max-width: 500px;
          width: 100%;
          border-radius: 4px;
        }

        .modal-title {
          font-size: 1.4rem;
          margin-bottom: 0.5rem;
        }

        .modal-input {
          width: 100%;
          padding: 0.8rem;
          margin-bottom: 0.8rem;
          border: 1px solid #ccc;
          font-family: sans-serif;
          font-size: 0.9rem;
        }

        .btn-modal-cancel {
          flex: 1;
          padding: 0.8rem;
          background: #eee;
          border: none;
          cursor: pointer;
        }

        .btn-modal-submit {
          flex: 1;
          padding: 0.8rem;
          background: #000;
          color: #fff;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
