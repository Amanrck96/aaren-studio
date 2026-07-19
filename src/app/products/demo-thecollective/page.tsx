"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const PRODUCTS = [
  { id: 1, brand: "FORMICA", name: "FENIX NTM® SURFACE", price: "₹12,500", color: "Nero Ingo", imgFront: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80", imgBack: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80" },
  { id: 2, brand: "ALPI", name: "ALPI SIGNATURE VENEER", price: "₹24,000", color: "Smoked Oak", imgFront: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80", imgBack: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80" },
  { id: 3, brand: "INCLASS", name: "INCLASS HPL LAMINATE", price: "₹8,500", color: "Brushed Brass", imgFront: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80", imgBack: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80" },
  { id: 4, brand: "FORMICA", name: "DECOMETAL SURFACING", price: "₹16,500", color: "Rose Gold", imgFront: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80", imgBack: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80" },
];

export default function TheCollectiveDemo() {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>("All");

  const filteredProducts = PRODUCTS.filter((p) => {
    return selectedBrand === "All" || p.brand === selectedBrand;
  });

  return (
    <div className="tc-demo">
      {/* Dynamic Style Switcher Top Info Bar */}
      <div className="demo-switcher-bar">
        <span>PREVIEWING LAYOUT 5 OF 5: <strong>THE COLLECTIVE STYLE (Fashion / Women Shirts)</strong></span>
        <div className="demo-switcher-links">
          <Link href="/products" className="switcher-btn back">← All Products</Link>
          <span className="sep">|</span>
          <Link href="/products/demo-archiproducts" className="switcher-btn">1. Archiproducts</Link>
          <Link href="/products/demo-undomus" className="switcher-btn">2. Undomus</Link>
          <Link href="/products/demo-madheke" className="switcher-btn">3. Madheke</Link>
          <Link href="/products/demo-taamaa" className="switcher-btn">4. Taamaa</Link>
          <Link href="/products/demo-thecollective" className="switcher-btn active">5. The Collective</Link>
        </div>
      </div>

      <div className="tc-container">
        {/* Breadcrumb */}
        <div className="tc-breadcrumb">
          <Link href="#">HOME</Link> / <Link href="#">SURFACES</Link> / <span className="active">LAMINATES &amp; VENEERS</span>
        </div>

        {/* Fashion Header */}
        <header className="tc-header">
          <div className="tc-header-inner">
            <h1 className="tc-title">LAMINATES &amp; VENEERS</h1>
            <div className="tc-sort-dropdown">
              <span>SORT BY: NEW IN ▾</span>
            </div>
          </div>
        </header>

        {/* Layout: Sidebar + Fashion Grid */}
        <div className="tc-main-layout">
          {/* Sidebar */}
          <aside className="tc-sidebar">
            <div className="sidebar-accordion">
              <h3 className="accordion-header">BRAND</h3>
              <div className="accordion-content">
                {["All", "FORMICA", "ALPI", "INCLASS"].map((brand) => (
                  <button
                    key={brand}
                    className={`accordion-btn ${selectedBrand === brand ? "active" : ""}`}
                    onClick={() => setSelectedBrand(brand)}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            <div className="sidebar-accordion">
              <h3 className="accordion-header">COLOR</h3>
              <div className="accordion-content">
                <span className="color-swatch-lbl">All Colors</span>
              </div>
            </div>
          </aside>

          {/* Grid Area */}
          <div className="tc-grid-area">
            <div className="tc-products-grid">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="tc-card"
                  onMouseEnter={() => setHoveredProduct(p.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <div className="tc-card-img-wrap">
                    <Image
                      src={hoveredProduct === p.id ? p.imgBack : p.imgFront}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="tc-img"
                    />
                  </div>
                  <div className="tc-card-info">
                    <span className="tc-card-brand">{p.brand}</span>
                    <h3 className="tc-card-name">{p.name}</h3>
                    <div className="tc-card-bottom">
                      <span className="tc-card-price">{p.price}</span>
                      <span className="tc-card-color">{p.color}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .tc-demo {
          background: #ffffff;
          min-height: 100vh;
          padding-top: 13rem;
          color: #1a1a1a;
          font-family: "Futura", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        /* Swither Bar Style */
        .demo-switcher-bar {
          position: fixed;
          top: 8rem;
          left: 0;
          right: 0;
          height: 5rem;
          background: #000000;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          z-index: 100;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 1.2rem;
          border-bottom: 0.1rem solid rgba(255,255,255,0.1);
        }

        .demo-switcher-links {
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }

        .switcher-btn {
          color: #888888;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .switcher-btn:hover, .switcher-btn.active {
          color: #ffffff;
        }

        .switcher-btn.back {
          color: #fff;
          font-weight: bold;
        }

        .demo-switcher-links .sep {
          color: rgba(255,255,255,0.2);
        }

        /* Container */
        .tc-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 3rem 2rem 8rem;
        }

        .tc-breadcrumb {
          font-size: 1.1rem;
          letter-spacing: 0.08em;
          color: #888;
          margin-bottom: 2rem;
        }

        .tc-breadcrumb a {
          color: #888;
          text-decoration: none;
        }

        .tc-breadcrumb .active {
          color: #000;
          font-weight: 500;
        }

        .tc-header {
          border-bottom: 0.1rem solid #e5e5e5;
          padding-bottom: 2rem;
          margin-bottom: 3rem;
        }

        .tc-header-inner {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .tc-title {
          font-size: 2.8rem;
          font-weight: 300;
          letter-spacing: 0.05em;
        }

        .tc-sort-dropdown {
          font-size: 1.2rem;
          letter-spacing: 0.05em;
          cursor: pointer;
        }

        /* Layout Split */
        .tc-main-layout {
          display: grid;
          grid-template-columns: 24rem 1fr;
          gap: 4rem;
        }

        @media (max-width: 1024px) {
          .tc-main-layout {
            grid-template-columns: 1fr;
          }
        }

        .tc-sidebar {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .sidebar-accordion {
          border-bottom: 0.1rem solid #e5e5e5;
          padding-bottom: 2rem;
        }

        .accordion-header {
          font-size: 1.2rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: #000;
          margin-bottom: 1.5rem;
        }

        .accordion-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .accordion-btn {
          background: none;
          border: none;
          text-align: left;
          font-size: 1.25rem;
          color: #666;
          cursor: pointer;
          transition: color 0.2s;
        }

        .accordion-btn:hover, .accordion-btn.active {
          color: #000;
          font-weight: 500;
        }

        .color-swatch-lbl {
          font-size: 1.25rem;
          color: #888;
        }

        /* Grid */
        .tc-grid-area {
          display: flex;
          flex-direction: column;
        }

        .tc-products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 3.5rem 2.4rem;
        }

        @media (max-width: 1200px) {
          .tc-products-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .tc-products-grid {
            grid-template-columns: 1fr;
          }
        }

        .tc-card {
          display: flex;
          flex-direction: column;
          cursor: pointer;
        }

        .tc-card-img-wrap {
          position: relative;
          height: 42rem;
          background: #fcfcfc;
          overflow: hidden;
          margin-bottom: 1.6rem;
        }

        @media (max-width: 1024px) {
          .tc-card-img-wrap {
            height: 34rem;
          }
        }

        .tc-img {
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .tc-card-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .tc-card-brand {
          font-size: 1.15rem;
          font-weight: bold;
          letter-spacing: 0.08em;
          color: #000;
        }

        .tc-card-name {
          font-size: 1.25rem;
          font-weight: 300;
          letter-spacing: 0.04em;
          color: #444;
          line-height: 1.3;
        }

        .tc-card-bottom {
          display: flex;
          justify-content: space-between;
          font-size: 1.25rem;
          margin-top: 0.4rem;
        }

        .tc-card-price {
          font-weight: 600;
        }

        .tc-card-color {
          color: #888;
        }
      `}</style>
    </div>
  );
}
