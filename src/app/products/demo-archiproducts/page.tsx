"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const PRODUCTS = [
  { id: 1, brand: "FIMA CARLO FRATTINI", name: "FIMA TAPWARE SYSTEM", desc: "Complete luxury brass mixer and tapware range", category: "Shower Fittings", tags: ["New", "BIM", "CAD"], img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80" },
  { id: 2, brand: "FALPER", name: "FALPER VIA VENETO VANITY", desc: "Italian designer timber vanity unit with integrated washbasin", category: "Bathroom Vanities", tags: ["BIM"], img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80" },
  { id: 3, brand: "MILDUE", name: "MILDUE SPA ACCESSORIES", desc: "Luxury solid brass shelves, towel rails, and bath hooks", category: "Accessories", tags: ["Eco", "CAD"], img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80" },
  { id: 4, brand: "ANTONIOLUPI", name: "ANTONIOLUPI ECLIPSE BATH", desc: "Sculptural solid surface freestanding bathtub", category: "Bathtubs", tags: ["New", "BIM"], img: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=600&q=80" },
  { id: 5, brand: "FIMA CARLO FRATTINI", name: "THERMOSTATIC SHOWER COLUMN", desc: "Sleek wall-mounted thermostatic shower with rain head", category: "Shower Fittings", tags: ["CAD"], img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80" },
  { id: 6, brand: "FALPER", name: "MAESTRO WASHBASIN", desc: "Pedestal washbasin in luxury matte marble composite", category: "Bathroom Vanities", tags: ["New", "Eco"], img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80" },
];

const CATEGORIES = ["All", "Shower Fittings", "Bathroom Vanities", "Accessories", "Bathtubs"];

export default function ArchiproductsDemo() {
  const [activeCat, setActiveCat] = useState("All");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const filteredProducts = PRODUCTS.filter((p) => {
    const catMatch = activeCat === "All" || p.category === activeCat;
    const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
    return catMatch && brandMatch;
  });

  return (
    <div className="ap-demo">
      {/* Dynamic Style Switcher Top Info Bar */}
      <div className="demo-switcher-bar">
        <span>PREVIEWING LAYOUT 1 OF 5: <strong>ARCHIPRODUCTS STYLE (Shower Panels)</strong></span>
        <div className="demo-switcher-links">
          <Link href="/products" className="switcher-btn back">← All Products</Link>
          <span className="sep">|</span>
          <Link href="/products/demo-archiproducts" className="switcher-btn active">1. Archiproducts</Link>
          <Link href="/products/demo-undomus" className="switcher-btn">2. Undomus</Link>
          <Link href="/products/demo-madheke" className="switcher-btn">3. Madheke</Link>
          <Link href="/products/demo-taamaa" className="switcher-btn">4. Taamaa</Link>
          <Link href="/products/demo-thecollective" className="switcher-btn">5. The Collective</Link>
        </div>
      </div>

      <div className="ap-container">
        {/* Breadcrumb */}
        <div className="ap-breadcrumb">
          <Link href="#">Home</Link> / <Link href="#">Products</Link> / <Link href="#">Bathroom</Link> / <span className="active">Bathroom Fittings</span>
        </div>

        {/* Header Title */}
        <div className="ap-header">
          <h1 className="ap-title">BATHROOM FITTINGS</h1>
          <p className="ap-subtitle">Explore a premium catalog of luxury Italian bathroom vanities, shower tapware, and designer accessories.</p>
        </div>

        {/* Main Content Grid */}
        <div className="ap-main-grid">
          {/* Sidebar */}
          <aside className="ap-sidebar">
            <div className="sidebar-section">
              <h3 className="section-title">Category</h3>
              <div className="cat-options">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    className={`cat-btn ${activeCat === cat ? "active" : ""}`}
                    onClick={() => setActiveCat(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="sidebar-section">
              <h3 className="section-title">Brands</h3>
              <div className="brand-options">
                {["FIMA CARLO FRATTINI", "FALPER", "MILDUE", "ANTONIOLUPI"].map((brand) => (
                  <label key={brand} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="ap-grid-area">
            {/* Filter tags header */}
            <div className="grid-header">
              <span className="results-count">{filteredProducts.length} Products Found</span>
            </div>

            <div className="ap-products-grid">
              {filteredProducts.map((p) => (
                <div key={p.id} className="ap-card">
                  <div className="ap-card-img-wrap">
                    <Image
                      src={p.img}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="ap-img"
                    />
                    {/* BIM / CAD Badges */}
                    <div className="tag-badges">
                      {p.tags.map((t) => (
                        <span key={t} className={`badge-tag ${t.toLowerCase()}`}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="ap-card-info">
                    <span className="card-brand">{p.brand}</span>
                    <h4 className="card-name">{p.name}</h4>
                    <p className="card-desc">{p.desc}</p>
                    <div className="card-footer">
                      <span className="tech-available">BIM & CAD files available</span>
                      <button className="inquire-btn">Request Quote</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ap-demo {
          background: #f7f9fb;
          min-height: 100vh;
          padding-top: 13rem;
          color: #1e293b;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        /* Swither Bar Style */
        .demo-switcher-bar {
          position: fixed;
          top: 8rem;
          left: 0;
          right: 0;
          height: 5rem;
          background: #1e293b;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          z-index: 100;
          font-size: 1.2rem;
          border-bottom: 0.1rem solid rgba(255,255,255,0.1);
        }

        .demo-switcher-links {
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }

        .switcher-btn {
          color: #94a3b8;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .switcher-btn:hover, .switcher-btn.active {
          color: #38bdf8;
        }

        .switcher-btn.back {
          color: #fff;
          font-weight: bold;
        }

        .demo-switcher-links .sep {
          color: rgba(255,255,255,0.2);
        }

        /* Main Container */
        .ap-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 3rem 2rem;
        }

        .ap-breadcrumb {
          font-size: 1.2rem;
          color: #64748b;
          margin-bottom: 2rem;
        }

        .ap-breadcrumb a {
          color: #64748b;
          text-decoration: none;
        }

        .ap-breadcrumb a:hover {
          color: #0f172a;
        }

        .ap-breadcrumb .active {
          color: #0f172a;
          font-weight: 500;
        }

        .ap-header {
          margin-bottom: 4rem;
        }

        .ap-title {
          font-size: 3.6rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin-bottom: 1rem;
        }

        .ap-subtitle {
          font-size: 1.6rem;
          color: #475569;
          max-width: 700px;
          line-height: 1.5;
        }

        /* Layout */
        .ap-main-grid {
          display: grid;
          grid-template-columns: 26rem 1fr;
          gap: 4rem;
        }

        @media (max-width: 1024px) {
          .ap-main-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Sidebar */
        .ap-sidebar {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .sidebar-section {
          border-bottom: 0.1rem solid #e2e8f0;
          padding-bottom: 2.5rem;
        }

        .section-title {
          font-size: 1.4rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #0f172a;
          margin-bottom: 1.5rem;
        }

        .cat-options {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .cat-btn {
          background: none;
          border: none;
          text-align: left;
          font-size: 1.4rem;
          color: #475569;
          padding: 0.4rem 0;
          cursor: pointer;
          transition: color 0.2s;
        }

        .cat-btn:hover, .cat-btn.active {
          color: #0f172a;
          font-weight: 600;
        }

        .brand-options {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 1.35rem;
          color: #475569;
          cursor: pointer;
        }

        .checkbox-label input {
          width: 1.6rem;
          height: 1.6rem;
          cursor: pointer;
        }

        /* Products list */
        .ap-grid-area {
          display: flex;
          flex-direction: column;
        }

        .grid-header {
          display: flex;
          justify-content: space-between;
          border-bottom: 0.1rem solid #e2e8f0;
          padding-bottom: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .results-count {
          font-size: 1.4rem;
          color: #64748b;
          font-weight: 500;
        }

        .ap-products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2.4rem;
        }

        @media (max-width: 1200px) {
          .ap-products-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .ap-products-grid {
            grid-template-columns: 1fr;
          }
        }

        .ap-card {
          background: #fff;
          border: 0.1rem solid #e2e8f0;
          border-radius: 0.4rem;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.3s;
        }

        .ap-card:hover {
          box-shadow: 0 1rem 2.5rem rgba(0,0,0,0.06);
        }

        .ap-card-img-wrap {
          position: relative;
          height: 22rem;
          background: #f1f5f9;
        }

        .ap-img {
          object-fit: cover;
        }

        .tag-badges {
          position: absolute;
          top: 1.2rem;
          left: 1.2rem;
          display: flex;
          gap: 0.6rem;
          z-index: 5;
        }

        .badge-tag {
          font-size: 1rem;
          font-weight: 700;
          padding: 0.3rem 0.6rem;
          border-radius: 0.2rem;
          text-transform: uppercase;
        }

        .badge-tag.new {
          background: #10b981;
          color: #fff;
        }

        .badge-tag.bim {
          background: #3b82f6;
          color: #fff;
        }

        .badge-tag.cad {
          background: #64748b;
          color: #fff;
        }

        .badge-tag.eco {
          background: #84cc16;
          color: #fff;
        }

        .ap-card-info {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .card-brand {
          font-size: 1.1rem;
          font-weight: 800;
          color: #94a3b8;
          letter-spacing: 0.08em;
          margin-bottom: 0.6rem;
          display: block;
        }

        .card-name {
          font-size: 1.6rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.8rem;
          line-height: 1.2;
        }

        .card-desc {
          font-size: 1.3rem;
          color: #64748b;
          margin-bottom: 2rem;
          line-height: 1.4;
          flex: 1;
        }

        .card-footer {
          border-top: 0.1rem solid #f1f5f9;
          padding-top: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .tech-available {
          font-size: 1.1rem;
          color: #94a3b8;
        }

        .inquire-btn {
          background: #0f172a;
          color: #fff;
          border: none;
          padding: 0.7rem 1.4rem;
          font-size: 1.2rem;
          font-weight: 600;
          cursor: pointer;
          border-radius: 0.3rem;
          transition: background 0.2s;
        }

        .inquire-btn:hover {
          background: #334155;
        }
      `}</style>
    </div>
  );
}
