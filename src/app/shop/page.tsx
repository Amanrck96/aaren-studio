"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, X, Send, ShoppingBag } from "lucide-react";

const SHOP_ITEMS = [
  { id: "oak-veneer", name: "Premium Oak Veneer", category: "Veneers", code: "OV", num: "01", price: "₹1,400 / sqm", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80", spec: "Natural European White Oak grain, 0.6mm thickness, FSC certified." },
  { id: "terrazzo-slab", name: "Terrazzo Outdoor Slab", category: "Tiles", code: "TO", num: "02", price: "₹3,200 / slab", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", spec: "Engineered aggregate terrazzo, anti-slip R11 finish, weather resistant." },
  { id: "brushed-gold-tap", name: "Brushed Gold Tap", category: "Fittings", code: "BG", num: "03", price: "₹18,500 / unit", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80", spec: "Solid brass body, PVD titanium coating, ceramic disc cartridge." },
  { id: "acoustic-panel", name: "Acoustic Wool Panel", category: "Screens", code: "AW", num: "04", price: "₹4,800 / panel", image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80", spec: "NRC 0.85 sound absorption, recycled PET felt, flame retardant class A." },
  { id: "fluted-panel", name: "Fluted Wall Panel", category: "Surfaces", code: "FW", num: "05", price: "₹2,600 / sqm", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80", spec: "Thermo-treated architectural polymer, seamless interlocking joints." },
  { id: "pivot-door", name: "Minimalist Pivot Door", category: "Doors", code: "PD", num: "06", price: "₹95,000 / unit", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80", spec: "Slimline aluminum frame, hydraulic pivot hinge, sound insulated core." },
];

export default function ShopPage() {
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [inquiryData, setInquiryData] = useState({ name: "", email: "", phone: "", quantity: "1", notes: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleInquire = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !inquiryData.name || !inquiryData.email) return;
    setSubmitting(true);
    try {
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: inquiryData.name,
          email: inquiryData.email,
          phone: inquiryData.phone || "Direct Shop Inquiry",
          type: "Quotation / Spec Request",
          subject: `Shop Inquiry: ${selectedItem.name} (${selectedItem.code}-${selectedItem.num})`,
          message: `Product: ${selectedItem.name}\nPrice: ${selectedItem.price}\nRequested Qty: ${inquiryData.quantity}\nClient Notes: ${inquiryData.notes || "None"}`,
          productOrBrand: selectedItem.name,
        }),
      });
      setSubmitted(true);
    } catch (e) {
      alert("Error submitting request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="shop-page">
      {/* ── Page Header ── */}
      <div className="shop-header page-header">
        <div className="shop-header__inner page-header__inner">
          <div className="shop-header__meta page-meta">
            ARCHITECTURAL SPECIFICATION &amp; SOURCING — {SHOP_ITEMS.length} SAMPLE SPECIMENS
          </div>
          <h1 className="shop-header__title page-title">SHOP</h1>
          <p className="shop-header__desc page-desc">
            Direct access to material specifications, sample sets, fixtures, and custom components curated for luxury architectural projects across India.
          </p>
          <div style={{ marginTop: "2.4rem" }}>
            <Link
              href="/products"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.8rem",
                padding: "0.9rem 1.8rem",
                background: "#81663F",
                color: "#ffffff",
                borderRadius: "9999px",
                fontSize: "1.15rem",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              <ShoppingBag size={16} /> Explore All 1,000+ Materials in Full Catalog
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Shop Grid ── */}
      <div className="shop-grid">
        {SHOP_ITEMS.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              setSelectedItem(item);
              setSubmitted(false);
            }}
            className="shop-card"
            style={{ cursor: "pointer" }}
          >
            <div className="shop-card__fig-wrapper">
              <div className="shop-card__fig">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="shop-card__img"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="shop-card__price-badge t-tag">
                {item.price}
              </div>
            </div>
            <div className="shop-card__caption">
              <div className="shop-card__caption-left">
                <span className="shop-card__caption-name">{item.name}</span>
                <span className="shop-card__caption-cat t-tag">{item.category} • Click for Sample Quote</span>
              </div>
              <div className="shop-card__caption-right">
                <span className="shop-card__caption-code">{item.code}</span>
                <span className="shop-card__caption-num">{item.num}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Direct Specification & Quote Modal ── */}
      {selectedItem && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100000,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.6rem",
          }}
          onClick={() => setSelectedItem(null)}
        >
          <div
            style={{
              background: "#FAF9F6",
              borderRadius: "16px",
              maxWidth: "540px",
              width: "100%",
              padding: "2.4rem",
              boxShadow: "0 24px 48px rgba(0,0,0,0.3)",
              color: "#1e1e1e",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              style={{
                position: "absolute",
                top: "1.6rem",
                right: "1.6rem",
                background: "rgba(0,0,0,0.06)",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X size={18} />
            </button>

            {submitted ? (
              <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
                <CheckCircle2 size={48} color="#81663F" style={{ margin: "0 auto 1.2rem" }} />
                <h3 style={{ fontSize: "1.8rem", fontWeight: 800, textTransform: "uppercase", color: "#81663F" }}>
                  Quote Request Sent
                </h3>
                <p style={{ marginTop: "0.8rem", color: "#5E5852", fontSize: "1.1rem" }}>
                  Our architectural material specialist will prepare specifications and pricing for <strong>{selectedItem.name}</strong> and contact you promptly.
                </p>
                <button
                  onClick={() => setSelectedItem(null)}
                  style={{
                    marginTop: "1.8rem",
                    padding: "0.8rem 2rem",
                    background: "#81663F",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#81663F", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {selectedItem.category} • SPECIFICATION INQUIRY
                </span>
                <h2 style={{ fontSize: "2rem", fontWeight: 900, textTransform: "uppercase", color: "#1e1e1e", margin: "0.4rem 0" }}>
                  {selectedItem.name}
                </h2>
                <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "#81663F", marginBottom: "0.8rem" }}>
                  Estimate: {selectedItem.price}
                </p>
                <p style={{ fontSize: "0.95rem", color: "#5E5852", marginBottom: "1.6rem", background: "rgba(129,102,63,0.08)", padding: "0.8rem 1rem", borderRadius: "6px" }}>
                  {selectedItem.spec}
                </p>

                <form onSubmit={handleInquire} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name *"
                    value={inquiryData.name}
                    onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
                    style={{ padding: "0.85rem 1rem", border: "1px solid rgba(0,0,0,0.15)", borderRadius: "6px", fontSize: "1rem" }}
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Address *"
                    value={inquiryData.email}
                    onChange={(e) => setInquiryData({ ...inquiryData, email: e.target.value })}
                    style={{ padding: "0.85rem 1rem", border: "1px solid rgba(0,0,0,0.15)", borderRadius: "6px", fontSize: "1rem" }}
                  />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
                    <input
                      type="tel"
                      placeholder="Phone (Optional)"
                      value={inquiryData.phone}
                      onChange={(e) => setInquiryData({ ...inquiryData, phone: e.target.value })}
                      style={{ padding: "0.85rem 1rem", border: "1px solid rgba(0,0,0,0.15)", borderRadius: "6px", fontSize: "1rem" }}
                    />
                    <input
                      type="text"
                      placeholder="Est. Quantity / Sqm"
                      value={inquiryData.quantity}
                      onChange={(e) => setInquiryData({ ...inquiryData, quantity: e.target.value })}
                      style={{ padding: "0.85rem 1rem", border: "1px solid rgba(0,0,0,0.15)", borderRadius: "6px", fontSize: "1rem" }}
                    />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Project details / finish requirements..."
                    value={inquiryData.notes}
                    onChange={(e) => setInquiryData({ ...inquiryData, notes: e.target.value })}
                    style={{ padding: "0.85rem 1rem", border: "1px solid rgba(0,0,0,0.15)", borderRadius: "6px", fontSize: "1rem" }}
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      padding: "1rem",
                      background: "#81663F",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.6rem",
                    }}
                  >
                    <Send size={16} /> {submitting ? "Sending Request..." : "Request Official Quote & Sample"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .shop-page {
          background: #E6E2D8;
          color: #1e1e1e;
          min-height: 100vh;
          padding-top: 8rem;
        }

        .shop-header {
          padding-top: 8rem;
          padding-bottom: 4rem;
          padding-left: 0;
          padding-right: 0;
          border-bottom: 0.1rem solid rgba(129,102,63,0.18);
        }

        .shop-header__inner {
          max-width: 1600px;
          margin: 0 auto;
          padding-left: 4rem;
          padding-right: 4rem;
          box-sizing: border-box;
        }

        @media (max-width: 1024px) {
          .shop-header__inner {
            padding-left: 3rem;
            padding-right: 3rem;
          }
        }

        @media (max-width: 768px) {
          .shop-header__inner {
            padding-left: 2rem;
            padding-right: 2rem;
          }
        }

        .shop-header__title {
          font-size: clamp(6rem, 15vw, 22rem);
          font-weight: 700;
          letter-spacing: -0.05em;
          line-height: 0.88;
          text-transform: uppercase;
          color: #81663F;
          margin-bottom: 2.8rem;
        }

        /* ── Shop Grid ── */
        .shop-grid {
          display: flex;
          flex-wrap: wrap;
          width: 100%;
          max-width: 1600px;
          margin: 0 auto;
          padding-left: 4rem;
          padding-right: 4rem;
          box-sizing: border-box;
        }

        @media (max-width: 1024px) {
          .shop-grid {
            padding-left: 3rem;
            padding-right: 3rem;
          }
        }

        @media (max-width: 768px) {
          .shop-grid {
            padding-left: 2rem;
            padding-right: 2rem;
          }
        }

        /* ── Shop Card ── */
        .shop-card {
          display: flex;
          flex-direction: column;
          flex: 0 0 100%;
          width: 100%;
          border-bottom: 0.1rem solid rgba(129,102,63,0.18);
          text-decoration: none;
          color: inherit;
          overflow: hidden;
        }

        @media (min-width: 768px) {
          .shop-card {
            flex: 0 0 50%;
            width: 50%;
            border-right: 0.1rem solid rgba(129,102,63,0.18);
          }
        }

        @media (min-width: 1240px) {
          .shop-card {
            flex: 0 0 33.333333%;
            width: 33.333333%;
            border-right: 0.1rem solid rgba(129,102,63,0.18);
          }
        }

        .shop-card__fig-wrapper {
          position: relative;
          width: 100%;
          padding-top: 65%;
          background: #111;
          overflow: hidden;
        }

        .shop-card__fig {
          position: absolute;
          inset: 0;
        }

        .shop-card__img {
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .shop-card:hover .shop-card__img {
          transform: scale(1.05);
        }

        .shop-card__price-badge {
          position: absolute;
          top: 1.4rem;
          left: 1.4rem;
          background: #81663F;
          color: #fff;
          padding: 0.5rem 1rem;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          border-radius: 4px;
        }

        .shop-card__caption {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1.6rem;
          padding: 1.6rem 2.4rem;
          background: #E6E2D8;
          transition: background 0.25s ease;
        }

        .shop-card:hover .shop-card__caption {
          background: #dbd6ca;
        }

        .shop-card__caption-left {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .shop-card__caption-name {
          font-size: 1.4rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.1;
          text-transform: uppercase;
        }

        .shop-card__caption-cat {
          font-size: 1.1rem;
          color: rgba(0,0,0,0.5);
          letter-spacing: 0.04em;
        }

        .shop-card__caption-right {
          display: flex;
          align-items: center;
          gap: 1.6rem;
          flex-shrink: 0;
        }

        .shop-card__caption-code {
          font-size: 2.4rem;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1;
        }

        .shop-card__caption-num {
          font-size: 2.2rem;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1;
          color: rgba(0,0,0,0.25);
        }
      `}</style>
    </div>
  );
}
