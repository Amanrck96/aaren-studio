"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const PRODUCTS = [
  { id: 1, name: "ORB PENDANT LIGHT", type: "Pendant", sizeClass: "wide", imgOff: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80", imgOn: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80" },
  { id: 2, name: "ARC TABLE LAMP", type: "Table Lamp", sizeClass: "tall", imgOff: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=800&q=80", imgOn: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=80" },
  { id: 3, name: "SLATE WALL SCONCE", type: "Wall Sconce", sizeClass: "tall", imgOff: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80", imgOn: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80" },
  { id: 4, name: "DOME FLOOR LAMP", type: "Floor Lamp", sizeClass: "wide", imgOff: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=80", imgOn: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=800&q=80" },
];

const TYPES = ["All", "Pendant", "Table Lamp", "Wall Sconce", "Floor Lamp"];

export default function TaamaaDemo() {
  const [activeType, setActiveType] = useState("All");
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  const filteredProducts = PRODUCTS.filter((p) => {
    return activeType === "All" || p.type === activeType;
  });

  return (
    <div className="tm-demo">
      {/* Dynamic Style Switcher Top Info Bar */}
      <div className="demo-switcher-bar">
        <span>PREVIEWING LAYOUT 4 OF 5: <strong>TAAMAA STYLE (Lighting)</strong></span>
        <div className="demo-switcher-links">
          <Link href="/products" className="switcher-btn back">← All Products</Link>
          <span className="sep">|</span>
          <Link href="/products/demo-archiproducts" className="switcher-btn">1. Archiproducts</Link>
          <Link href="/products/demo-undomus" className="switcher-btn">2. Undomus</Link>
          <Link href="/products/demo-madheke" className="switcher-btn">3. Madheke</Link>
          <Link href="/products/demo-taamaa" className="switcher-btn active">4. Taamaa</Link>
          <Link href="/products/demo-thecollective" className="switcher-btn">5. The Collective</Link>
        </div>
      </div>

      <div className="tm-container">
        {/* Modern Studio Header */}
        <header className="tm-header">
          <span className="tm-brand-tag">TAAMAA</span>
          <h1 className="tm-title">Lighting collection</h1>
          <p className="tm-desc">A playful, geometric range of lighting objects. Hover over a product tile to illuminate the lamp.</p>
        </header>

        {/* Quick Tag Swapping */}
        <div className="tm-tag-bar">
          {TYPES.map((t) => (
            <button
              key={t}
              className={`tm-tag-btn ${activeType === t ? "active" : ""}`}
              onClick={() => setActiveType(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Mixed sizing grid */}
        <div className="tm-grid">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className={`tm-card ${p.sizeClass}`}
              onMouseEnter={() => setHoveredProduct(p.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div className="tm-card-img-wrap">
                <Image
                  src={hoveredProduct === p.id ? p.imgOn : p.imgOff}
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="tm-img"
                />
                {/* Light State Badge */}
                <div className="light-badge">
                  {hoveredProduct === p.id ? "ILLUMINATED" : "SHADOW"}
                </div>
              </div>
              <div className="tm-card-info">
                <span className="tm-card-type">{p.type}</span>
                <h3 className="tm-card-name">{p.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .tm-demo {
          background: #ffffff;
          min-height: 100vh;
          padding-top: 13rem;
          color: #000000;
          font-family: "Courier New", Courier, monospace;
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
        .tm-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 2rem 8rem;
        }

        .tm-header {
          border-bottom: 0.2rem solid #000000;
          padding-bottom: 3rem;
          margin-bottom: 3rem;
        }

        .tm-brand-tag {
          font-size: 1.2rem;
          font-weight: bold;
          border: 0.2rem solid #000000;
          padding: 0.4rem 0.8rem;
          display: inline-block;
          margin-bottom: 2rem;
        }

        .tm-title {
          font-size: clamp(3rem, 6vw, 6rem);
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          margin-bottom: 1.5rem;
          line-height: 1;
        }

        .tm-desc {
          font-size: 1.4rem;
          line-height: 1.6;
          color: #666;
          max-width: 600px;
        }

        .tm-tag-bar {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 4rem;
          flex-wrap: wrap;
        }

        .tm-tag-btn {
          background: #ffffff;
          border: 0.15rem solid #000000;
          font-family: inherit;
          font-size: 1.2rem;
          font-weight: bold;
          padding: 0.6rem 1.6rem;
          cursor: pointer;
          transition: all 0.25s;
        }

        .tm-tag-btn:hover, .tm-tag-btn.active {
          background: #000000;
          color: #ffffff;
        }

        /* Mixed grid */
        .tm-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 3rem;
        }

        @media (max-width: 640px) {
          .tm-grid {
            grid-template-columns: 1fr;
          }
        }

        .tm-card {
          border: 0.2rem solid #000000;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          background: #ffffff;
          transition: transform 0.3s;
        }

        .tm-card:hover {
          transform: rotate(-1deg);
        }

        .tm-card.wide {
          grid-column: span 1;
        }

        .tm-card.tall {
          grid-column: span 1;
        }

        .tm-card-img-wrap {
          position: relative;
          height: 34rem;
          background: #fcfcfc;
          border: 0.15rem solid #000000;
          overflow: hidden;
        }

        .tm-img {
          object-fit: cover;
        }

        .light-badge {
          position: absolute;
          bottom: 1.2rem;
          right: 1.2rem;
          background: #ffffff;
          border: 0.15rem solid #000000;
          font-size: 0.95rem;
          font-weight: bold;
          padding: 0.3rem 0.6rem;
          z-index: 5;
        }

        .tm-card-info {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .tm-card-type {
          font-size: 1.1rem;
          color: #666;
          text-transform: uppercase;
        }

        .tm-card-name {
          font-size: 1.6rem;
          font-weight: bold;
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
}
