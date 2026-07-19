"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const PRODUCTS = [
  { id: 1, name: "BRERA SOFA SYSTEM", designer: "Jean-Marie Massaud", desc: "Monolithic modular seating system covered in luxury linen fabric.", space: "Living Room", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80" },
  { id: 2, name: "YOKO AMCHAIR", designer: "Inoda & Staje", desc: "Solid ash wood frame with woven straw seat and soft leather backrest.", space: "Lounge", img: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80" },
  { id: 3, name: "SENDAI LOUNGE SOFA", designer: "Toyo Ito", desc: "Sculptural compact sofa, upholstered in wool blend with bronze feet.", space: "Office", img: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=800&q=80" },
  { id: 4, name: "BELT CORNER SOFA", designer: "Rodolfo Dordoni", desc: "Plush curvilinear modular sofa system in premium velvet.", space: "Living Room", img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80" },
];

const SPACES = ["All", "Living Room", "Lounge", "Office"];

export default function MadhekeDemo() {
  const [activeSpace, setActiveSpace] = useState("All");

  const filteredProducts = PRODUCTS.filter((p) => {
    return activeSpace === "All" || p.space === activeSpace;
  });

  return (
    <div className="ma-demo">
      {/* Dynamic Style Switcher Top Info Bar */}
      <div className="demo-switcher-bar">
        <span>PREVIEWING LAYOUT 3 OF 5: <strong>MADHEKE STYLE (Sofa / Furniture)</strong></span>
        <div className="demo-switcher-links">
          <Link href="/products" className="switcher-btn back">← All Products</Link>
          <span className="sep">|</span>
          <Link href="/products/demo-archiproducts" className="switcher-btn">1. Archiproducts</Link>
          <Link href="/products/demo-undomus" className="switcher-btn">2. Undomus</Link>
          <Link href="/products/demo-madheke" className="switcher-btn active">3. Madheke</Link>
          <Link href="/products/demo-taamaa" className="switcher-btn">4. Taamaa</Link>
          <Link href="/products/demo-thecollective" className="switcher-btn">5. The Collective</Link>
        </div>
      </div>

      <div className="ma-container">
        {/* Editorial Header */}
        <header className="ma-header">
          <div className="ma-header-top">
            <span className="ma-meta">MADHEKE COLLECTION</span>
            <div className="ma-sort">
              <span>SORT BY: POPULARITY</span>
            </div>
          </div>
          <h1 className="ma-title">The Sofa</h1>
          <p className="ma-subtitle">
            An editorial showcase of sculptural seating systems and modular lounging items. Designed for ultimate visual harmony and spatial expression.
          </p>
        </header>

        {/* Space Horizontal Filter Strips */}
        <div className="ma-filters">
          {SPACES.map((space) => (
            <button
              key={space}
              className={`ma-filter-link ${activeSpace === space ? "active" : ""}`}
              onClick={() => setActiveSpace(space)}
            >
              {space.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Spacious 2-Column Grid */}
        <div className="ma-products-grid">
          {filteredProducts.map((p) => (
            <div key={p.id} className="ma-card">
              <div className="ma-card-img-wrap">
                <Image
                  src={p.img}
                  alt={p.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="ma-img"
                />
                <div className="ma-hover-overlay">
                  <span className="ma-view-details">VIEW SPECIFICATIONS</span>
                </div>
              </div>
              <div className="ma-card-info">
                <div className="ma-card-header">
                  <h3 className="ma-card-title">{p.name}</h3>
                  <span className="ma-card-space">{p.space}</span>
                </div>
                <span className="ma-card-designer">BY {p.designer.toUpperCase()}</span>
                <p className="ma-card-desc">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .ma-demo {
          background: #faf8f5;
          min-height: 100vh;
          padding-top: 13rem;
          color: #1e1e1e;
          font-family: serif;
        }

        /* Swither Bar Style */
        .demo-switcher-bar {
          position: fixed;
          top: 8rem;
          left: 0;
          right: 0;
          height: 5rem;
          background: #1c1a17;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          z-index: 100;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 1.2rem;
          border-bottom: 0.1rem solid rgba(255,255,255,0.05);
        }

        .demo-switcher-links {
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }

        .switcher-btn {
          color: #8c8275;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .switcher-btn:hover, .switcher-btn.active {
          color: #faf8f5;
        }

        .switcher-btn.back {
          color: #fff;
          font-weight: bold;
        }

        .demo-switcher-links .sep {
          color: rgba(255,255,255,0.1);
        }

        /* Container */
        .ma-container {
          max-width: 1320px;
          margin: 0 auto;
          padding: 4rem 2rem 8rem;
        }

        .ma-header {
          border-bottom: 0.1rem solid rgba(0,0,0,0.1);
          padding-bottom: 3.5rem;
          margin-bottom: 3rem;
        }

        .ma-header-top {
          display: flex;
          justify-content: space-between;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: rgba(0,0,0,0.4);
          margin-bottom: 2rem;
        }

        .ma-title {
          font-family: "Playfair Display", serif;
          font-size: clamp(4rem, 8vw, 9rem);
          font-weight: 400;
          line-height: 0.9;
          letter-spacing: -0.03em;
          margin-bottom: 2.5rem;
          text-transform: uppercase;
        }

        .ma-subtitle {
          font-family: serif;
          font-size: clamp(1.6rem, 2.5vw, 2.2rem);
          line-height: 1.5;
          color: rgba(0,0,0,0.6);
          max-width: 800px;
          font-style: italic;
        }

        .ma-filters {
          display: flex;
          gap: 3rem;
          margin-bottom: 5rem;
          border-bottom: 0.1rem solid rgba(0,0,0,0.06);
          padding-bottom: 1.5rem;
          overflow-x: auto;
        }

        .ma-filter-link {
          background: none;
          border: none;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 1.2rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: rgba(0,0,0,0.4);
          cursor: pointer;
          transition: color 0.3s;
          padding: 0.5rem 0;
        }

        .ma-filter-link:hover, .ma-filter-link.active {
          color: #8c764b;
        }

        /* 2 Column Grid */
        .ma-products-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 6rem 4rem;
        }

        @media (max-width: 768px) {
          .ma-products-grid {
            grid-template-columns: 1fr;
            gap: 4rem;
          }
        }

        .ma-card {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .ma-card-img-wrap {
          position: relative;
          height: 48rem;
          background: #f5f3f0;
          overflow: hidden;
        }

        @media (max-width: 1024px) {
          .ma-card-img-wrap {
            height: 38rem;
          }
        }

        .ma-img {
          object-fit: cover;
          transition: transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .ma-card:hover .ma-img {
          transform: scale(1.05);
        }

        .ma-hover-overlay {
          position: absolute;
          inset: 0;
          background: rgba(140, 118, 75, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .ma-card:hover .ma-hover-overlay {
          opacity: 1;
        }

        .ma-view-details {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: #fff;
          background: #1e1e1e;
          padding: 1.2rem 2.4rem;
          letter-spacing: 0.1em;
          border-radius: 0.2rem;
        }

        .ma-card-info {
          display: flex;
          flex-direction: column;
        }

        .ma-card-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 0.5rem;
        }

        .ma-card-title {
          font-family: serif;
          font-size: 2.2rem;
          font-weight: 400;
          letter-spacing: -0.01em;
        }

        .ma-card-space {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: rgba(0,0,0,0.35);
          text-transform: uppercase;
        }

        .ma-card-designer {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #8c764b;
          margin-bottom: 1.2rem;
        }

        .ma-card-desc {
          font-size: 1.45rem;
          line-height: 1.5;
          color: rgba(0,0,0,0.65);
        }
      `}</style>
    </div>
  );
}
