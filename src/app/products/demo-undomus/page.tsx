"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const PRODUCTS = [
  { id: 1, name: "CALACATTA EXTRA MARBLE", collection: "Marvel Shine", look: "Marble Look", size: "120x120 cm", finish: "Polished", img: "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=600&q=80" },
  { id: 2, name: "GRIGIO INTENSO STONE", collection: "Brave Stone", look: "Stone Look", size: "60x120 cm", finish: "Matt", img: "https://images.unsplash.com/photo-1502005229762-fc1b2d812ca5?auto=format&fit=crop&w=600&q=80" },
  { id: 3, name: "ROVERE NATURALE WOOD", collection: "Heartwood", look: "Wood Look", size: "20x120 cm", finish: "Matt", img: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=600&q=80" },
  { id: 4, name: "PORTLAND GREY CONCRETE", collection: "Boost Concrete", look: "Concrete Look", size: "120x120 cm", finish: "Matt", img: "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?auto=format&fit=crop&w=600&q=80" },
  { id: 5, name: "STATUARIO LUXURY GLOW", collection: "Marvel Shine", look: "Marble Look", size: "60x60 cm", finish: "Polished", img: "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=600&q=80" },
  { id: 6, name: "DECK ROVERE SCURO", collection: "Heartwood", look: "Wood Look", size: "20x120 cm", finish: "Textured", img: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=600&q=80" },
];

const LOOKS = ["All", "Marble Look", "Stone Look", "Wood Look", "Concrete Look"];
const FINISHES = ["All", "Matt", "Polished", "Textured"];

export default function UndomusDemo() {
  const [activeLook, setActiveLook] = useState("All");
  const [activeFinish, setActiveFinish] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");

  const filteredProducts = PRODUCTS.filter((p) => {
    const lookMatch = activeLook === "All" || p.look === activeLook;
    const finishMatch = activeFinish === "All" || p.finish === activeFinish;
    const sizeMatch = selectedSize === "All" || p.size === selectedSize;
    return lookMatch && finishMatch && sizeMatch;
  });

  return (
    <div className="un-demo">
      {/* Dynamic Style Switcher Top Info Bar */}
      <div className="demo-switcher-bar">
        <span>PREVIEWING LAYOUT 2 OF 5: <strong>UNDOMUS STYLE (Ceramic Tiles)</strong></span>
        <div className="demo-switcher-links">
          <Link href="/products" className="switcher-btn back">← All Products</Link>
          <span className="sep">|</span>
          <Link href="/products/demo-archiproducts" className="switcher-btn">1. Archiproducts</Link>
          <Link href="/products/demo-undomus" className="switcher-btn active">2. Undomus</Link>
          <Link href="/products/demo-madheke" className="switcher-btn">3. Madheke</Link>
          <Link href="/products/demo-taamaa" className="switcher-btn">4. Taamaa</Link>
          <Link href="/products/demo-thecollective" className="switcher-btn">5. The Collective</Link>
        </div>
      </div>

      <div className="un-container">
        {/* Banner */}
        <div className="un-banner">
          <div className="un-banner-left">
            <span className="un-label">CERAMIC SOLUTIONS</span>
            <h1 className="un-title">Ceramic Tiles</h1>
            <p className="un-desc">Architectural porcelain floorings and wall tiles, ideal for residential facades, wellness interiors, and luxury outdoor decks.</p>
          </div>
          <div className="un-banner-right">
            <div className="un-stat">
              <span className="un-stat-val">203</span>
              <span className="un-stat-lbl">ITEMS IN COLLECTION</span>
            </div>
          </div>
        </div>

        {/* Visual category dividing quick filters */}
        <div className="un-looks-grid">
          {LOOKS.map((look) => (
            <button
              key={look}
              className={`look-tile ${activeLook === look ? "active" : ""}`}
              onClick={() => setActiveLook(look)}
            >
              <div className="look-tile-label">{look === "All" ? "ALL LOOKS" : look.toUpperCase()}</div>
            </button>
          ))}
        </div>

        {/* Main Grid Layout */}
        <div className="un-main-layout">
          {/* Sidebar */}
          <aside className="un-sidebar">
            <div className="sidebar-section">
              <h3 className="section-title">Surface Finish</h3>
              <div className="filter-options">
                {FINISHES.map((finish) => (
                  <button
                    key={finish}
                    className={`filter-btn ${activeFinish === finish ? "active" : ""}`}
                    onClick={() => setActiveFinish(finish)}
                  >
                    {finish}
                  </button>
                ))}
              </div>
            </div>

            <div className="sidebar-section">
              <h3 className="section-title">Dimensions</h3>
              <div className="filter-options">
                {["All", "60x60 cm", "60x120 cm", "120x120 cm", "20x120 cm"].map((size) => (
                  <button
                    key={size}
                    className={`filter-btn ${selectedSize === size ? "active" : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="un-grid-area">
            <div className="un-products-grid">
              {filteredProducts.map((p) => (
                <div key={p.id} className="un-card">
                  <div className="un-card-img-wrap">
                    <Image
                      src={p.img}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="un-img"
                    />
                    <div className="un-card-overlay" />
                  </div>
                  <div className="un-card-info">
                    <span className="un-card-collection">{p.collection} · {p.look}</span>
                    <h4 className="un-card-name">{p.name}</h4>
                    <div className="un-card-meta">
                      <span>{p.size}</span>
                      <span>{p.finish}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .un-demo {
          background: #121212;
          min-height: 100vh;
          padding-top: 13rem;
          color: #e5e5e5;
          font-family: "Geist Sans", sans-serif;
        }

        /* Swither Bar Style */
        .demo-switcher-bar {
          position: fixed;
          top: 8rem;
          left: 0;
          right: 0;
          height: 5rem;
          background: #1c1c1c;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          z-index: 100;
          font-size: 1.2rem;
          border-bottom: 0.1rem solid rgba(255,255,255,0.05);
        }

        .demo-switcher-links {
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }

        .switcher-btn {
          color: #8c8c8c;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .switcher-btn:hover, .switcher-btn.active {
          color: #f5f5f5;
        }

        .switcher-btn.back {
          color: #fff;
          font-weight: bold;
        }

        .demo-switcher-links .sep {
          color: rgba(255,255,255,0.1);
        }

        /* Container */
        .un-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 3rem 2rem;
        }

        .un-banner {
          display: flex;
          justify-content: space-between;
          border-bottom: 0.1rem solid rgba(255,255,255,0.1);
          padding-bottom: 4rem;
          margin-bottom: 3rem;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 2rem;
        }

        .un-banner-left {
          max-width: 800px;
        }

        .un-label {
          font-size: 1.2rem;
          letter-spacing: 0.15em;
          color: #8c764b;
          font-weight: 700;
          display: block;
          margin-bottom: 1.2rem;
        }

        .un-title {
          font-size: clamp(3rem, 5vw, 4.8rem);
          font-weight: 800;
          color: #fff;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }

        .un-desc {
          font-size: 1.5rem;
          color: #a3a3a3;
          line-height: 1.6;
        }

        .un-stat {
          text-align: right;
        }

        @media (max-width: 768px) {
          .un-stat {
            text-align: left;
          }
        }

        .un-stat-val {
          font-size: 4.8rem;
          font-weight: 800;
          color: #fff;
          display: block;
          line-height: 1;
        }

        .un-stat-lbl {
          font-size: 1rem;
          letter-spacing: 0.1em;
          color: #737373;
          font-weight: 700;
        }

        /* Look Category Grid */
        .un-looks-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
          margin-bottom: 4rem;
        }

        @media (max-width: 768px) {
          .un-looks-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 480px) {
          .un-looks-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .look-tile {
          background: #1c1c1c;
          border: 0.1rem solid rgba(255,255,255,0.08);
          padding: 2.4rem 1.6rem;
          cursor: pointer;
          transition: all 0.3s;
          text-align: center;
        }

        .look-tile:hover, .look-tile.active {
          background: #8c764b;
          border-color: #8c764b;
        }

        .look-tile:hover .look-tile-label, .look-tile.active .look-tile-label {
          color: #fff;
        }

        .look-tile-label {
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #a3a3a3;
        }

        /* Main layout split */
        .un-main-layout {
          display: grid;
          grid-template-columns: 24rem 1fr;
          gap: 4rem;
        }

        @media (max-width: 1024px) {
          .un-main-layout {
            grid-template-columns: 1fr;
          }
        }

        .un-sidebar {
          display: flex;
          flex-direction: column;
          gap: 3.5rem;
        }

        .sidebar-section {
          border-bottom: 0.1rem solid rgba(255,255,255,0.08);
          padding-bottom: 2.5rem;
        }

        .section-title {
          font-size: 1.2rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #737373;
          margin-bottom: 1.8rem;
        }

        .filter-options {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .filter-btn {
          background: none;
          border: none;
          text-align: left;
          font-size: 1.35rem;
          color: #a3a3a3;
          cursor: pointer;
          transition: color 0.2s;
          padding: 0.4rem 0;
        }

        .filter-btn:hover, .filter-btn.active {
          color: #fff;
          font-weight: 600;
        }

        /* Grid */
        .un-grid-area {
          display: flex;
          flex-direction: column;
        }

        .un-products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 3rem;
        }

        @media (max-width: 1200px) {
          .un-products-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .un-products-grid {
            grid-template-columns: 1fr;
          }
        }

        .un-card {
          border: 0.1rem solid rgba(255,255,255,0.05);
          background: #1a1a1a;
          transition: transform 0.3s, box-shadow 0.3s;
          overflow: hidden;
        }

        .un-card:hover {
          transform: translateY(-0.4rem);
          box-shadow: 0 1.2rem 3rem rgba(0,0,0,0.4);
          border-color: rgba(255,255,255,0.15);
        }

        .un-card-img-wrap {
          position: relative;
          height: 24rem;
          background: #111;
        }

        .un-img {
          object-fit: cover;
          transition: transform 0.8s;
        }

        .un-card:hover .un-img {
          transform: scale(1.03);
        }

        .un-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.3));
        }

        .un-card-info {
          padding: 2rem 1.6rem;
        }

        .un-card-collection {
          font-size: 1rem;
          font-weight: 700;
          color: #8c764b;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 0.8rem;
        }

        .un-card-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 1.2rem;
          letter-spacing: 0.02em;
        }

        .un-card-meta {
          display: flex;
          justify-content: space-between;
          font-size: 1.2rem;
          color: #737373;
          border-top: 0.1rem solid rgba(255,255,255,0.08);
          padding-top: 1rem;
        }
      `}</style>
    </div>
  );
}
