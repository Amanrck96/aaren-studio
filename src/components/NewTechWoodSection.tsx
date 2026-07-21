"use client";

import React from "react";
import Image from "next/image";

/* Catalog Pages 7, 8, 9, 10 Project Showcase Data */
const CATALOG_PAGES = [
  {
    pageLabel: "PDF Page 7",
    title: "Antique Decking in Canada",
    img: "/brands/newtechwood/page_7.png",
    category: "Decking",
    location: "Canada",
    description: "Featured Antique Decking project showcasing natural wood aesthetics in a serene forest retreat.",
  },
  {
    pageLabel: "PDF Page 8",
    title: "Ipe Cladding in Australia",
    img: "/brands/newtechwood/page_8.png",
    category: "Cladding",
    location: "Australia",
    description: "Architectural villa exterior wrapped in durable, weather-resistant Ipe composite cladding.",
  },
  {
    pageLabel: "PDF Page 9",
    title: "Ipe & Teak Cladding",
    img: "/brands/newtechwood/page_9.png",
    category: "Cladding",
    location: "South America & Australia",
    description: "Modern commercial and residential cladding installations using Ipe and Teak finishes.",
  },
  {
    pageLabel: "PDF Page 10",
    title: "Antique Decking Showcase",
    img: "/brands/newtechwood/page_10.png",
    category: "Decking",
    location: "South Africa & Australia",
    description: "Premium pool deck and patio outdoor living environments with low-maintenance Antique Decking.",
  },
];

/* PDF Page 13 Certifications Data */
const CERTIFICATIONS = [
  {
    title: "LEED",
    name: "Leadership in Energy & Environmental Design",
    desc: "Helps earn credits in green building rating schemes worldwide.",
    code: "LEED Certified",
    icon: "🌱",
  },
  {
    title: "HQE",
    name: "High Environmental Quality Certification",
    desc: "Certified for durable environmental building performance.",
    code: "HQE Durable",
    icon: "🏛️",
  },
  {
    title: "ISO 9001",
    name: "System Certification",
    desc: "Quality management system certified by SGS.",
    code: "Certification No.: CN06/01765",
    icon: "🛡️",
  },
  {
    title: "IPMS",
    name: "IPMS Certificate",
    desc: "International property measurement compliance.",
    code: "Certification No.: BOHANIPMS210032",
    icon: "📏",
  },
  {
    title: "SCS Recycled",
    name: "SCS Recycled Content Certification",
    desc: "Verified post-consumer recycled plastic and wood fiber.",
    code: "Certification No.: SCS-RC-06525",
    icon: "♻️",
  },
  {
    title: "ICC-ES",
    name: "ICC-ES Certification",
    desc: "Evaluation service compliance for safety and building codes.",
    code: "Certification No.: ESR-3487, ESR-3923, ESL-1288",
    icon: "🏗️",
  },
  {
    title: "FSC®",
    name: "Forest Stewardship Council",
    desc: "Responsible forest management and wood sourcing.",
    code: "Certification No.: SGSHK-COC-011736",
    icon: "🌲",
  },
  {
    title: "EPD®",
    name: "Environmental Product Declaration",
    desc: "Verified environmental impact lifecycle reporting.",
    code: "NEPD-6566-5815-EN, NEPD-6567-5815-EN, NEPD-6569-5815-EN, S-P-02183",
    icon: "📜",
  },
  {
    title: "BREEAM®",
    name: "BREEAM International New Construction",
    desc: "Leading sustainability rating method for infrastructure.",
    code: "BREEAM Verified",
    icon: "🌿",
  },
];

export default function NewTechWoodSection() {
  return (
    <section className="ntw-catalog-section" id="catalog-pages-section">
      {/* ── Section Header ── */}
      <div className="ntw-cat-header">
        <div className="ntw-cat-tag">Product Catalog 2025 • Featured Pages</div>
        <h2 className="ntw-cat-title">Catalog Highlights (Pages 7, 8, 9, 10, 13 &amp; 14)</h2>
        <p className="ntw-cat-subtitle">
          Curated content directly from the official 2025 NewTechWood<sup>®</sup> Product Catalog, covering global project references, international environmental certifications, and sustainability commitments.
        </p>
      </div>

      {/* ── PDF Pages 7, 8, 9, 10: Projects Showcase ── */}
      <div className="ntw-showcase-grid">
        {CATALOG_PAGES.map((page) => (
          <div key={page.pageLabel} className="ntw-showcase-card">
            <div className="ntw-showcase-media">
              <Image
                src={page.img}
                alt={page.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
              <div className="ntw-page-pill">{page.pageLabel}</div>
            </div>
            <div className="ntw-showcase-body">
              <div className="ntw-showcase-meta">
                <span className="ntw-cat-badge">{page.category}</span>
                <span className="ntw-loc-badge">📍 {page.location}</span>
              </div>
              <h4>{page.title}</h4>
              <p>{page.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── PDF Page 13: WE ARE NEWTECHWOOD & 9 Certifications ── */}
      <div className="ntw-p13-block">
        <div className="ntw-p13-badge">PDF Page 13 • Brand Heritage &amp; Certifications</div>
        <h3 className="ntw-p13-title">WE ARE NEWTECHWOOD</h3>
        <p className="ntw-p13-text">
          NewTechWood has pioneered the development of composite manufacturing and has been a leader in wood-plastic composite technology since 2004. With every product it developed and manufactured, NewTechWood has committed itself to creating beautiful, useful and dependable products that enhance your outdoor living space.
        </p>

        <div className="ntw-certs-grid">
          {CERTIFICATIONS.map((cert) => (
            <div key={cert.title} className="ntw-cert-box">
              <div className="ntw-cert-box__head">
                <span className="ntw-cert-icon">{cert.icon}</span>
                <span className="ntw-cert-name">{cert.title}</span>
              </div>
              <h5>{cert.name}</h5>
              <p>{cert.desc}</p>
              <div className="ntw-cert-code">{cert.code}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PDF Page 14: Sustainability & Environmental Commitment ── */}
      <div className="ntw-p14-block">
        <div className="ntw-p14-inner">
          <div className="ntw-p14-content">
            <div className="ntw-p14-badge">PDF Page 14 • Eco Commitment</div>
            <h3>Sustainability &amp; Ocean Plastic Reduction</h3>
            <p className="ntw-p14-lead">
              Sustainability sits at the heart of NewTechWood research and development. By utilizing recycled goods for manufacturing composite timber products, every year NewTechWood saves over <strong>30,000 tons of plastic</strong> from being buried in landfills or washed into oceans forever.
            </p>
            <div className="ntw-p14-stats">
              <div className="ntw-stat-item">
                <span className="ntw-stat-val">30,000+ Tons</span>
                <span className="ntw-stat-lbl">Plastic Saved Annually</span>
              </div>
              <div className="ntw-stat-item">
                <span className="ntw-stat-val">100% Recyclable</span>
                <span className="ntw-stat-lbl">Closed Loop Life Cycle</span>
              </div>
            </div>
          </div>

          <div className="ntw-p14-media">
            <Image
              src="/brands/newtechwood/page_14.png"
              alt="NewTechWood PDF Page 14 Environmental Protection"
              width={540}
              height={640}
              className="ntw-p14-img"
            />
            <div className="ntw-p14-overlay-card">
              <span>🌊 PDF Page 14</span>
              <p>Protecting marine ecosystems through recycled composite innovation.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Scoped Styling ── */}
      <style jsx>{`
        .ntw-catalog-section {
          padding: 8rem 1.2rem;
          background: #eaeef4;
          color: #000;
        }

        .ntw-cat-header {
          max-width: 80rem;
          margin: 0 auto 5rem;
          text-align: center;
        }

        .ntw-cat-tag {
          display: inline-block;
          font-size: 1.1rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #8fa07a;
          font-weight: 700;
          margin-bottom: 1.6rem;
        }

        .ntw-cat-title {
          font-size: clamp(3rem, 5vw, 5.2rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1.05;
          margin-bottom: 1.6rem;
          color: #000000;
        }

        .ntw-cat-subtitle {
          font-size: clamp(1.5rem, 2vw, 1.8rem);
          color: rgba(0, 0, 0, 0.65);
          line-height: 1.6;
        }

        /* Showcase Grid */
        .ntw-showcase-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          max-width: 120rem;
          margin: 0 auto 8rem;
        }

        @media (min-width: 768px) {
          .ntw-showcase-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .ntw-showcase-card {
          background: #ffffff;
          border: 0.1rem solid rgba(0, 0, 0, 0.1);
          border-radius: 1.6rem;
          overflow: hidden;
          box-shadow: 0 0.4rem 2rem rgba(0, 0, 0, 0.04);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .ntw-showcase-card:hover {
          transform: translateY(-0.4rem);
          box-shadow: 0 1.2rem 3.6rem rgba(0, 0, 0, 0.08);
        }

        .ntw-showcase-media {
          position: relative;
          height: 32rem;
        }

        .ntw-page-pill {
          position: absolute;
          top: 1.6rem;
          left: 1.6rem;
          padding: 0.4rem 1.2rem;
          background: rgba(0, 0, 0, 0.85);
          color: #ffffff;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          border-radius: 999px;
          backdrop-filter: blur(4px);
        }

        .ntw-showcase-body {
          padding: 2.4rem;
        }

        .ntw-showcase-meta {
          display: flex;
          gap: 1rem;
          align-items: center;
          margin-bottom: 1rem;
        }

        .ntw-cat-badge {
          font-size: 1rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.3rem 0.8rem;
          background: rgba(143, 160, 122, 0.15);
          color: #5c704a;
          font-weight: 700;
          border-radius: 0.4rem;
        }

        .ntw-loc-badge {
          font-size: 1.2rem;
          color: rgba(0, 0, 0, 0.5);
          font-weight: 600;
        }

        .ntw-showcase-body h4 {
          font-size: 2.2rem;
          font-weight: 800;
          color: #000;
          margin-bottom: 0.8rem;
        }

        .ntw-showcase-body p {
          font-size: 1.4rem;
          color: rgba(0, 0, 0, 0.7);
          line-height: 1.5;
        }

        /* Page 13 Certifications */
        .ntw-p13-block {
          max-width: 120rem;
          margin: 0 auto 8rem;
          background: #0f172a;
          color: #ffffff;
          border-radius: 2rem;
          padding: 6rem 3rem;
        }

        .ntw-p13-badge {
          font-size: 1.1rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #8fa07a;
          font-weight: 700;
          margin-bottom: 1.6rem;
        }

        .ntw-p13-title {
          font-size: clamp(3rem, 5vw, 4.8rem);
          font-weight: 900;
          margin-bottom: 2rem;
          color: #ffffff;
        }

        .ntw-p13-text {
          font-size: clamp(1.5rem, 2vw, 1.8rem);
          color: #94a3b8;
          line-height: 1.6;
          max-width: 88rem;
          margin-bottom: 4rem;
        }

        .ntw-certs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(28rem, 1fr));
          gap: 2rem;
        }

        .ntw-cert-box {
          background: rgba(255, 255, 255, 0.05);
          border: 0.1rem solid rgba(255, 255, 255, 0.1);
          border-radius: 1.2rem;
          padding: 2.4rem;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .ntw-cert-box:hover {
          transform: translateY(-0.3rem);
          border-color: #8fa07a;
          background: rgba(255, 255, 255, 0.08);
        }

        .ntw-cert-box__head {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .ntw-cert-icon {
          font-size: 2rem;
        }

        .ntw-cert-name {
          font-size: 1.6rem;
          font-weight: 800;
          color: #8fa07a;
        }

        .ntw-cert-box h5 {
          font-size: 1.4rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.6rem;
        }

        .ntw-cert-box p {
          font-size: 1.2rem;
          color: #94a3b8;
          line-height: 1.5;
          margin-bottom: 1.4rem;
        }

        .ntw-cert-code {
          font-size: 1rem;
          font-weight: 700;
          color: #cbd5e1;
          padding: 0.4rem 0.8rem;
          background: rgba(0, 0, 0, 0.35);
          border-radius: 0.4rem;
          display: inline-block;
        }

        /* Page 14 Sustainability */
        .ntw-p14-block {
          max-width: 120rem;
          margin: 0 auto;
          background: #ffffff;
          border: 0.1rem solid rgba(0, 0, 0, 0.1);
          border-radius: 2rem;
          padding: 5rem 3rem;
          box-shadow: 0 0.8rem 3rem rgba(0, 0, 0, 0.04);
        }

        .ntw-p14-inner {
          display: grid;
          grid-template-columns: 1fr;
          gap: 4rem;
          align-items: center;
        }

        @media (min-width: 900px) {
          .ntw-p14-inner {
            grid-template-columns: 1.2fr 1fr;
          }
        }

        .ntw-p14-badge {
          font-size: 1.1rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #15803d;
          font-weight: 700;
          margin-bottom: 1.4rem;
        }

        .ntw-p14-content h3 {
          font-size: clamp(2.8rem, 4vw, 4.4rem);
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 1.6rem;
        }

        .ntw-p14-lead {
          font-size: 1.6rem;
          color: #475569;
          line-height: 1.6;
          margin-bottom: 3.2rem;
        }

        .ntw-p14-stats {
          display: flex;
          gap: 3rem;
          flex-wrap: wrap;
        }

        .ntw-stat-item {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          padding: 1.8rem 2.4rem;
          background: #f0fdf4;
          border: 0.1rem solid #bbf7d0;
          border-radius: 1.2rem;
        }

        .ntw-stat-val {
          font-size: 2.4rem;
          font-weight: 900;
          color: #166534;
        }

        .ntw-stat-lbl {
          font-size: 1.2rem;
          font-weight: 600;
          color: #15803d;
        }

        .ntw-p14-media {
          position: relative;
          display: flex;
          justify-content: center;
        }

        .ntw-p14-img {
          width: 100%;
          height: auto;
          border-radius: 1.6rem;
          object-fit: cover;
          box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.08);
        }

        .ntw-p14-overlay-card {
          position: absolute;
          bottom: 2rem;
          left: 2rem;
          right: 2rem;
          padding: 1.6rem;
          background: rgba(15, 23, 42, 0.88);
          backdrop-filter: blur(8px);
          border-radius: 1rem;
          color: #ffffff;
        }

        .ntw-p14-overlay-card span {
          font-size: 1.1rem;
          font-weight: 700;
          color: #4ade80;
        }

        .ntw-p14-overlay-card p {
          font-size: 1.2rem;
          color: #cbd5e1;
          margin: 0.4rem 0 0;
        }
      `}</style>
    </section>
  );
}
