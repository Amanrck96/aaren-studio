"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight, Compass, Award, CheckCircle2, ChevronRight, Layers } from "lucide-react";

type HistoryMilestone = {
  stepNum: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  color: string;
  bgGradient: string;
  hexColor: string;
  image: string;
};

const MILESTONES: HistoryMilestone[] = [
  {
    stepNum: "01",
    year: "1990",
    title: "Inception & Timber Foundations",
    subtitle: "Founded as Poonam Timbers",
    description: "Established in Bengaluru as Poonam Timbers, building deep roots in sourcing raw timber, solid wood, and foundational architectural materials.",
    details: ["Imported natural teak & oak timber", "Bulk supplier for premier South Indian joineries", "Established core values of material authenticity"],
    color: "#3b82f6",
    bgGradient: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
    hexColor: "#3b82f6",
    image: "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=800&q=80"
  },
  {
    stepNum: "02",
    year: "2010",
    title: "Surface & Panel Expansion",
    subtitle: "Introduction of Architectural Panels",
    description: "Expanded portfolio to include high-pressure decorative laminates, engineered wooden flooring, and outdoor composite decking systems.",
    details: ["Pioneered WPC capped composite decking in Bengaluru", "Partnered with premium decorative laminate manufacturers", "Built a 10,000 sq.ft material warehouse"],
    color: "#f59e0b",
    bgGradient: "linear-gradient(135deg, #b45309, #f59e0b)",
    hexColor: "#f59e0b",
    image: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80"
  },
  {
    stepNum: "03",
    year: "2015",
    title: "Rebranding to AAREN INTPRO",
    subtitle: "Transition to Luxury Material House",
    description: "Evolved and rebranded as Aaren Intpro, shifting focus toward elite European interior products, luxury surfaces, and architectural solutions.",
    details: ["Established Aaren Intpro identity", "Exclusive distribution rights for premier global brands", "Serviced luxury residential & commercial projects"],
    color: "#00b4d8",
    bgGradient: "linear-gradient(135deg, #03045e, #00b4d8)",
    hexColor: "#00b4d8",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
  },
  {
    stepNum: "04",
    year: "2019",
    title: "European Partnerships & Italian Porcelain",
    subtitle: "Partnerships with Mirage & Mafi",
    description: "Secured direct partnerships with Italian porcelain giants (Mirage) and Austrian natural hardwood master-crafters (Mafi Austria).",
    details: ["Introduced 1200x2700mm Italian Travertine slabs", "Natural oil-finished Austrian oak floor planks", "Expanded client footprint across Pan-India"],
    color: "#ec4899",
    bgGradient: "linear-gradient(135deg, #831843, #ec4899)",
    hexColor: "#ec4899",
    image: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80"
  },
  {
    stepNum: "05",
    year: "2021",
    title: "AAREN Design Experience Studio",
    subtitle: "Flagship Showroom in Bengaluru",
    description: "Unveiled the multi-floor state-of-the-art AAREN Experience Studio in Bengaluru, giving architects a tactile space to explore materials.",
    details: ["Interactive material library and sample lab", "Dedicated zones for FIMA tapware and Falper vanities", "In-house design consultants & technical team"],
    color: "#10b981",
    bgGradient: "linear-gradient(135deg, #064e3b, #10b981)",
    hexColor: "#10b981",
    image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=800&q=80"
  },
  {
    stepNum: "06",
    year: "2023",
    title: "Digital Catalog & Portfolio Expansion",
    subtitle: "15+ Global European Brands",
    description: "Integrated 15+ world-class brands into the AAREN portfolio, including Formica FENIX NTM, Inkiostro Bianco, WOW Spain, and FIMA Carlo Frattini.",
    details: ["Digitized 60+ PDF brand catalogs with live synced links", "Launched automated inquiry & quote management system", "Expanded into luxury modular kitchen surfaces"],
    color: "#8b5cf6",
    bgGradient: "linear-gradient(135deg, #4c1d95, #8b5cf6)",
    hexColor: "#8b5cf6",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
  },
  {
    stepNum: "07",
    year: "2024",
    title: "Smart Systems & Modular Living",
    subtitle: "Waltz Partitions & Slashform Kitchens",
    description: "Introduced motorized architectural glass partitions (Waltz) and liquid ceramic kitchen living systems (Slashform Italian Systems).",
    details: ["Top-hung motorized fluted glass sliding doors", "Liquid-patterned ceramic island countertops", "Expanded architectural hardware solutions"],
    color: "#d4af37",
    bgGradient: "linear-gradient(135deg, #78350f, #d4af37)",
    hexColor: "#d4af37",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80"
  },
  {
    stepNum: "08",
    year: "2026",
    title: "Bengaluru's Premier Material Destination",
    subtitle: "36+ Years of Architectural Innovation",
    description: "Celebrating over 36 years of heritage, standing as South India's foremost destination for luxury surfaces, sanitaryware, and interior solutions.",
    details: ["48+ static & dynamic product catalog routes", "Integrated live quotation & brochure download gates", "Expanding into sustainable circular material curation"],
    color: "#059669",
    bgGradient: "linear-gradient(135deg, #022c22, #059669)",
    hexColor: "#059669",
    image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80"
  }
];

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<"both" | "vertical" | "journey">("both");
  const [selectedMilestone, setSelectedMilestone] = useState<HistoryMilestone>(MILESTONES[MILESTONES.length - 1]);

  return (
    <div className="history-page">
      {/* ── Page Hero Header ── */}
      <section className="history-hero">
        <div className="history-hero__inner">
          <div className="history-hero__eyebrow t-tag">
            OUR LEGACY & EVOLUTION — EST. 1990
          </div>
          <h1 className="history-hero__title">
            Our Journey & History
          </h1>
          <p className="history-hero__desc">
            From humble beginnings as Poonam Timbers in 1990 to Bengaluru&apos;s primary luxury material house and curator for 15+ world-class European brands.
          </p>

          {/* View Filter Buttons */}
          <div className="history-tabs">
            <button
              className={`history-tab ${activeTab === "both" ? "active" : ""}`}
              onClick={() => setActiveTab("both")}
            >
              <Layers size={14} style={{ marginRight: "6px" }} /> Complete History
            </button>
            <button
              className={`history-tab ${activeTab === "vertical" ? "active" : ""}`}
              onClick={() => setActiveTab("vertical")}
            >
              <CheckCircle2 size={14} style={{ marginRight: "6px" }} /> Step Roadmap View
            </button>
            <button
              className={`history-tab ${activeTab === "journey" ? "active" : ""}`}
              onClick={() => setActiveTab("journey")}
            >
              <Compass size={14} style={{ marginRight: "6px" }} /> Winding S-Road Journey
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats Highlight Bar ── */}
      <section className="history-stats-bar">
        <div className="history-stats-inner">
          <div className="stat-item">
            <span className="stat-num">36+</span>
            <span className="stat-lbl">Years of Legacy (Since 1990)</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">15+</span>
            <span className="stat-lbl">Global European Brands</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">10,000+</span>
            <span className="stat-lbl">Completed Architectural Projects</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">60+</span>
            <span className="stat-lbl">Curated Brand PDF Catalogs</span>
          </div>
        </div>
      </section>

      <div className="history-content-container">
        {/* ══ VIEW MODE 1 & BOTH: VERTICAL STEPPED ROADMAP (Design 1) ══ */}
        {(activeTab === "both" || activeTab === "vertical") && (
          <section className="vertical-timeline-section">
            <div className="section-title-wrap">
              <span className="t-tag">PHASED ROADMAP</span>
              <h2>Step-by-Step Company Milestones</h2>
              <p>Connected milestone steps from foundation in 1990 to present day.</p>
            </div>

            <div className="vertical-timeline-list">
              {MILESTONES.map((item, idx) => {
                const isLast = idx === MILESTONES.length - 1;
                return (
                  <div key={item.stepNum} className="vertical-step-row">
                    {/* Left Column: Numbered Circle Badge & Line */}
                    <div className="step-circle-col">
                      <div
                        className="step-circle-badge"
                        style={{
                          borderColor: item.hexColor,
                          boxShadow: `0 0 16px ${item.hexColor}33`,
                        }}
                      >
                        <span style={{ color: item.hexColor, fontWeight: 700, fontSize: "16px" }}>
                          {item.stepNum}
                        </span>
                      </div>
                      {!isLast && <div className="step-connecting-line" style={{ background: `linear-gradient(to bottom, ${item.hexColor}, ${MILESTONES[idx + 1].hexColor})` }} />}
                    </div>

                    {/* Right Card */}
                    <div
                      className="step-card-box"
                      onClick={() => setSelectedMilestone(item)}
                    >
                      <div className="step-card-header">
                        <div className="step-card-header-left">
                          <span className="step-year-pill" style={{ background: `${item.hexColor}15`, color: item.hexColor, border: `0.5px solid ${item.hexColor}40` }}>
                            <Calendar size={12} style={{ marginRight: "4px" }} /> {item.year}
                          </span>
                          <h3 className="step-title">{item.title}</h3>
                        </div>
                        <span className="step-subtitle-tag">{item.subtitle}</span>
                      </div>

                      <p className="step-desc">{item.description}</p>

                      {/* Detail Bullets */}
                      <div className="step-details-grid">
                        {item.details.map((d, dIdx) => (
                          <div key={dIdx} className="step-bullet-item">
                            <span className="bullet-dot" style={{ background: item.hexColor }} />
                            <span>{d}</span>
                          </div>
                        ))}
                      </div>

                      {/* Pure Architectural Image */}
                      <div className="step-image-strip">
                        <div className="step-img-wrapper">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 400px"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        <div className="step-img-caption">
                          <span>Architectural Material Spec — {item.year}</span>
                          <span style={{ color: item.hexColor, fontWeight: 600 }}>{item.subtitle} →</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ══ VIEW MODE 2 & BOTH: WINDING ROAD S-CURVE TIMELINE (Design 2) ══ */}
        {(activeTab === "both" || activeTab === "journey") && (
          <section className="winding-highway-section">
            <div className="section-title-wrap" style={{ textAlign: "center", marginBottom: "40px" }}>
              <span className="t-tag">INTERACTIVE ROADWAY</span>
              <h2>Visual Journey Highway</h2>
              <p>Follow the curved trajectory of AAREN through time (2026 back to 1990).</p>
            </div>

            {/* Winding S-Road Visual Canvas */}
            <div className="winding-road-container">
              {/* S-Road SVG Track */}
              <svg className="road-svg-path" viewBox="0 0 1200 600" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#cbd5e1" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#64748b" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
                <path
                  d="M 50 100 C 350 100, 350 250, 600 250 C 850 250, 850 420, 1150 420"
                  fill="none"
                  stroke="url(#roadGrad)"
                  strokeWidth="36"
                  strokeLinecap="round"
                />
                <path
                  d="M 50 100 C 350 100, 350 250, 600 250 C 850 250, 850 420, 1150 420"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="3"
                  strokeDasharray="12 12"
                  strokeLinecap="round"
                />
              </svg>

              {/* Milestones Hexagon Stand Grid */}
              <div className="highway-milestones-grid">
                {MILESTONES.slice().reverse().map((m) => (
                  <div
                    key={m.stepNum}
                    className={`highway-pin-card ${selectedMilestone.stepNum === m.stepNum ? "active" : ""}`}
                    onClick={() => setSelectedMilestone(m)}
                  >
                    {/* Hexagon Top Banner */}
                    <div
                      className="hexagon-banner"
                      style={{ background: m.bgGradient, boxShadow: `0 8px 24px ${m.hexColor}40` }}
                    >
                      <span className="hex-year">{m.year}</span>
                    </div>

                    {/* Pole Stem */}
                    <div className="pin-pole-line" style={{ background: m.hexColor }} />

                    {/* Ground Anchor Point */}
                    <div className="pin-ground-dot" style={{ background: m.hexColor, boxShadow: `0 0 12px ${m.hexColor}` }} />

                    {/* Milestone Card Overlay */}
                    <div className="pin-info-box">
                      <div className="pin-info-title">{m.title}</div>
                      <div className="pin-info-sub">{m.subtitle}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Milestone Detail Spotlight Box */}
            <div className="milestone-spotlight-card">
              <div className="spotlight-header" style={{ borderBottom: `2px solid ${selectedMilestone.hexColor}` }}>
                <div>
                  <span className="spotlight-tag" style={{ color: selectedMilestone.hexColor }}>
                    MILESTONE {selectedMilestone.stepNum} · {selectedMilestone.year}
                  </span>
                  <h3 className="spotlight-title">{selectedMilestone.title}</h3>
                </div>
                <div className="spotlight-year-badge" style={{ background: selectedMilestone.bgGradient }}>
                  {selectedMilestone.year}
                </div>
              </div>

              <div className="spotlight-body">
                <div className="spotlight-text-col">
                  <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "8px" }}>
                    {selectedMilestone.subtitle}
                  </h4>
                  <p style={{ fontSize: "13px", lineHeight: "1.6", color: "var(--text-main)", marginBottom: "16px" }}>
                    {selectedMilestone.description}
                  </p>

                  <div className="spotlight-bullets">
                    {selectedMilestone.details.map((bullet, i) => (
                      <div key={i} className="spotlight-bullet">
                        <Award size={14} style={{ color: selectedMilestone.hexColor, marginRight: "8px", flexShrink: 0 }} />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="spotlight-img-col">
                  <div className="spotlight-img-frame">
                    <Image
                      src={selectedMilestone.image}
                      alt={selectedMilestone.title}
                      fill
                      sizes="400px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* ── CTA Banner ── */}
      <section className="history-cta-section">
        <div className="history-cta-inner">
          <h2>Experience Our History Firsthand</h2>
          <p>Visit the AAREN Design Experience Studio in Bengaluru or explore our curated product catalog.</p>
          <div className="history-cta-buttons">
            <Link href="/products" className="btn-cta-primary">
              Explore Products <ArrowRight size={14} style={{ marginLeft: "6px" }} />
            </Link>
            <Link href="/contact" className="btn-cta-secondary">
              Book Showroom Visit <ChevronRight size={14} style={{ marginLeft: "4px" }} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Page Styles ── */}
      <style jsx>{`
        .history-page {
          background: var(--surface-0, #f8fafc);
          color: var(--text-main, #0f172a);
          min-height: 100vh;
          padding-top: 80px;
        }

        .history-hero {
          background: linear-gradient(180deg, var(--surface-1, #ffffff) 0%, var(--surface-0, #f8fafc) 100%);
          border-bottom: 0.5px solid var(--border, #e2e8f0);
          padding: 60px 20px 40px;
          text-align: center;
        }

        .history-hero__inner {
          max-width: 900px;
          margin: 0 auto;
        }

        .history-hero__eyebrow {
          color: var(--text-muted, #64748b);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.15em;
          margin-bottom: 12px;
        }

        .history-hero__title {
          font-family: var(--font-jost), serif;
          font-size: clamp(2.2rem, 5vw, 3.8rem);
          font-weight: 300;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .history-hero__desc {
          font-size: 15px;
          color: var(--text-muted, #64748b);
          max-width: 680px;
          margin: 0 auto 32px;
          line-height: 1.6;
        }

        .history-tabs {
          display: inline-flex;
          gap: 8px;
          background: var(--surface-1, #ffffff);
          padding: 6px;
          border-radius: 30px;
          border: 0.5px solid var(--border, #cbd5e1);
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .history-tab {
          display: flex;
          align-items: center;
          padding: 8px 18px;
          border-radius: 20px;
          border: none;
          background: transparent;
          font-size: 12px;
          font-weight: 500;
          color: var(--text-muted, #64748b);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .history-tab.active {
          background: var(--text-main, #0f172a);
          color: #ffffff;
        }

        .history-stats-bar {
          background: var(--surface-1, #ffffff);
          border-bottom: 0.5px solid var(--border, #e2e8f0);
          padding: 24px 20px;
        }

        .history-stats-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          text-align: center;
        }

        .stat-num {
          display: block;
          font-size: 28px;
          font-weight: 700;
          color: var(--text-main, #0f172a);
          letter-spacing: -0.02em;
        }

        .stat-lbl {
          font-size: 11px;
          color: var(--text-muted, #64748b);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .history-content-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 50px 20px;
        }

        /* ── SECTION 1: VERTICAL TIMELINE ── */
        .vertical-timeline-section {
          margin-bottom: 70px;
        }

        .section-title-wrap {
          margin-bottom: 36px;
        }

        .section-title-wrap h2 {
          font-size: 26px;
          font-weight: 400;
          letter-spacing: 0.02em;
          margin-top: 4px;
        }

        .section-title-wrap p {
          font-size: 13px;
          color: var(--text-muted, #64748b);
        }

        .vertical-timeline-list {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .vertical-step-row {
          display: grid;
          grid-template-columns: 70px 1fr;
          gap: 20px;
          position: relative;
        }

        .step-circle-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .step-circle-badge {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--surface-1, #ffffff);
          border: 3px solid #3b82f6;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          transition: transform 0.2s ease;
        }

        .vertical-step-row:hover .step-circle-badge {
          transform: scale(1.1);
        }

        .step-connecting-line {
          width: 3px;
          flex: 1;
          margin-top: 6px;
          border-radius: 2px;
          min-height: 80px;
        }

        .step-card-box {
          background: var(--surface-1, #ffffff);
          border: 0.5px solid var(--border, #cbd5e1);
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.03);
          cursor: pointer;
          transition: transform 0.2s ease, boxShadow 0.2s ease;
        }

        .step-card-box:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 28px rgba(0,0,0,0.08);
        }

        .step-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 12px;
        }

        .step-card-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .step-year-pill {
          display: inline-flex;
          align-items: center;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 16px;
        }

        .step-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-main, #0f172a);
          margin: 0;
        }

        .step-subtitle-tag {
          font-size: 11px;
          color: var(--text-muted, #64748b);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 500;
        }

        .step-desc {
          font-size: 13px;
          color: var(--text-muted, #475569);
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .step-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 8px;
          margin-bottom: 16px;
        }

        .step-bullet-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--text-main, #1e293b);
        }

        .bullet-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .step-image-strip {
          border-top: 0.5px solid var(--border, #e2e8f0);
          padding-top: 14px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .step-img-wrapper {
          width: 80px;
          height: 56px;
          border-radius: 6px;
          overflow: hidden;
          position: relative;
          flex-shrink: 0;
        }

        .step-img-caption {
          font-size: 11px;
          color: var(--text-muted, #64748b);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        /* ── SECTION 2: WINDING HIGHWAY S-ROAD ── */
        .winding-highway-section {
          margin-top: 40px;
        }

        .winding-road-container {
          position: relative;
          width: 100%;
          min-height: 380px;
          margin-bottom: 30px;
          overflow: hidden;
        }

        .road-svg-path {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }

        .highway-milestones-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
          gap: 10px;
          padding-top: 30px;
        }

        .highway-pin-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .highway-pin-card:hover, .highway-pin-card.active {
          transform: translateY(-8px);
        }

        .hexagon-banner {
          width: 76px;
          height: 70px;
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
        }

        .hex-year {
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        .pin-pole-line {
          width: 2px;
          height: 50px;
          margin-top: 4px;
        }

        .pin-ground-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-top: -2px;
        }

        .pin-info-box {
          margin-top: 8px;
          text-align: center;
        }

        .pin-info-title {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-main, #0f172a);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 110px;
        }

        .pin-info-sub {
          font-size: 9px;
          color: var(--text-muted, #64748b);
        }

        /* Spotlight Card */
        .milestone-spotlight-card {
          background: var(--surface-1, #ffffff);
          border: 0.5px solid var(--border, #cbd5e1);
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 6px 24px rgba(0,0,0,0.05);
        }

        .spotlight-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 16px;
          margin-bottom: 20px;
        }

        .spotlight-tag {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .spotlight-title {
          font-size: 20px;
          font-weight: 600;
          margin: 4px 0 0;
        }

        .spotlight-year-badge {
          font-size: 18px;
          font-weight: 800;
          color: #ffffff;
          padding: 8px 18px;
          border-radius: 20px;
        }

        .spotlight-body {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 24px;
          align-items: center;
        }

        @media (max-width: 768px) {
          .spotlight-body {
            grid-template-columns: 1fr;
          }
        }

        .spotlight-bullet {
          display: flex;
          align-items: center;
          font-size: 12px;
          color: var(--text-main, #1e293b);
          margin-bottom: 8px;
        }

        .spotlight-img-frame {
          width: 100%;
          height: 180px;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
        }

        /* ── CTA SECTION ── */
        .history-cta-section {
          background: var(--text-main, #0f172a);
          color: #ffffff;
          padding: 60px 20px;
          text-align: center;
          margin-top: 60px;
        }

        .history-cta-inner h2 {
          font-size: 26px;
          font-weight: 300;
          letter-spacing: 0.05em;
          margin-bottom: 12px;
        }

        .history-cta-inner p {
          font-size: 14px;
          color: #94a3b8;
          max-width: 540px;
          margin: 0 auto 28px;
        }

        .history-cta-buttons {
          display: flex;
          justify-content: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .btn-cta-primary {
          display: inline-flex;
          align-items: center;
          background: #ffffff;
          color: #0f172a;
          padding: 12px 24px;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: transform 0.2s ease;
        }

        .btn-cta-primary:hover {
          transform: translateY(-2px);
        }

        .btn-cta-secondary {
          display: inline-flex;
          align-items: center;
          background: rgba(255,255,255,0.1);
          color: #ffffff;
          padding: 12px 24px;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          border: 0.5px solid rgba(255,255,255,0.2);
          transition: background 0.2s ease;
        }

        .btn-cta-secondary:hover {
          background: rgba(255,255,255,0.2);
        }
      `}</style>
    </div>
  );
}
