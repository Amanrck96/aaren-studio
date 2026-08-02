import os

code = """"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Compass, Award, CheckCircle2, ChevronRight, Layers, ArrowRight, ShieldCheck, Gem } from "lucide-react";

const TIMELINE = [
  {
    year: "1990",
    title: "Founded as Poonam Timbers",
    subtitle: "Raw Material Foundations",
    event: "Established in Bengaluru as Poonam Timbers, laying deep roots in sourcing raw timber, solid wood, and foundational architectural materials.",
    code: "PT",
    num: "90",
    tag: "INCEPTION",
    image: "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=800&q=80"
  },
  {
    year: "2015",
    title: "Rebranded as Aaren Intpro",
    subtitle: "Luxury European Distribution",
    event: "Evolved into Aaren Intpro, expanding into elite European interior products, WPC decking, engineered hardwood, and decorative surfaces.",
    code: "AI",
    num: "15",
    tag: "EXPANSION",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
  },
  {
    year: "2021",
    title: "AAREN Design Experience Studio",
    subtitle: "Flagship Showroom in Bengaluru",
    event: "Unveiled the multi-floor state-of-the-art AAREN Experience Studio in Bengaluru, giving architects a tactile space to explore 15+ world-renowned brands.",
    code: "AS",
    num: "21",
    tag: "STUDIO",
    image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=800&q=80"
  },
  {
    year: "2026",
    title: "Bengaluru's Premier Material Destination",
    subtitle: "100% Curated Global Brands",
    event: "Bengaluru's primary destination for world-renowned brands, luxury bathroom fixtures, Italian travertine porcelain, and high-performance exterior surfaces.",
    code: "UD",
    num: "26",
    tag: "PRESENT",
    image: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80"
  },
];

const VALUES = [
  {
    num: "01",
    title: "OUR MISSION",
    subtitle: "Global Standards Under One Roof",
    text: "To provide premium, elite, and high-quality lifestyle products under one roof for the global Indian customer, setting new benchmarks in architectural craftsmanship.",
    icon: Compass,
  },
  {
    num: "02",
    title: "OUR VISION",
    subtitle: "The Premier Destination for Designers",
    text: "To remain the primary one-stop destination for architects, interior designers, builders, and discerning homeowners seeking world-class luxury materials.",
    icon: Gem,
  },
  {
    num: "03",
    title: "OUR VALUES",
    subtitle: "Authenticity & Client Trust",
    text: "Uniting as a family, prioritizing robust value systems, and providing curated design consultations focusing on unique, uncompromised client experiences.",
    icon: ShieldCheck,
  },
];

export default function About() {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className="about-page font-['Jost',sans-serif]">
      {/* ── Editorial Header ── */}
      <div className="about-header">
        <div className="about-header__inner">
          <div className="about-header__meta">
            <span className="t-tag">THE HOUSE — Est. 1990</span>
            <span className="h-dot">•</span>
            <span className="t-tag">BENGALURU, INDIA</span>
          </div>
          <h1 className="about-header__title">About Us</h1>
          <p className="about-header__desc">
            AAREN Studio is Bengaluru's premier material house and luxury lifestyle curator, dedicated to bringing world-class European architectural surfaces, timber, tapware, and partitions under one refined roof.
          </p>
        </div>
      </div>

      {/* ── Mission, Vision, Values Section ── */}
      <div className="about-section max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="section-label-row text-center mb-12">
          <span className="t-tag">FOUNDATIONAL PILLARS</span>
          <h2 className="section-heading">Mission, Vision &amp; Core Values</h2>
          <p className="section-sub">Driven by material excellence, technical precision, and enduring client relationships.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {VALUES.map((item) => {
            const IconComp = item.icon;
            return (
              <div key={item.num} className="value-card">
                <div className="value-card__top">
                  <span className="value-card__num">{item.num}</span>
                  <div className="value-card__icon-wrap">
                    <IconComp className="w-5 h-5 text-[#8c764b]" />
                  </div>
                </div>

                <div className="value-card__body">
                  <span className="value-card__tag">{item.subtitle}</span>
                  <h3 className="value-card__title">{item.title}</h3>
                  <p className="value-card__text">{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Interactive Journey Timeline (History Styling) ── */}
      <div className="about-timeline-wrapper">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20">
          <div className="section-label-row text-center mb-16">
            <span className="t-tag">COMPANY TIMELINE</span>
            <h2 className="section-heading">Our 35-Year Heritage</h2>
            <p className="section-sub">From a trusted timber supplier in 1990 to South India's premier luxury material destination.</p>
          </div>

          <div className="timeline-grid">
            {TIMELINE.map((item, idx) => (
              <div key={item.year} className="timeline-ticket-card">
                <div className="timeline-card__img-box">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="timeline-card__year-badge">{item.year}</div>
                  <div className="timeline-card__tag-badge">{item.tag}</div>
                </div>

                <div className="timeline-card__content">
                  <span className="timeline-card__code">{item.code} — {item.num}</span>
                  <h3 className="timeline-card__title">{item.title}</h3>
                  <span className="timeline-card__sub">{item.subtitle}</span>
                  <p className="timeline-card__desc">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA Footer Banner ── */}
      <div className="about-cta-banner">
        <div className="max-w-4xl mx-auto text-center px-4">
          <span className="t-tag mb-3 block text-[#8c764b]">VISIT OUR BENGALURU STUDIO</span>
          <h2 className="text-3xl sm:text-4xl font-light text-black mb-4">
            Experience World-Class Materials Firsthand
          </h2>
          <p className="text-black/60 text-sm mb-8 max-w-xl mx-auto">
            Book a private design consultation with our material specialists and explore over 60+ European brand catalogs.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact" className="btn-cta-primary">
              Book Studio Consultation &rarr;
            </Link>
            <Link href="/products" className="btn-cta-secondary">
              Browse Material Catalog
            </Link>
          </div>
        </div>
      </div>

      {/* ── Styles ── */}
      <style jsx>{`
        .about-page {
          background: #eaeef4;
          color: #0f172a;
          min-height: 100vh;
          padding-top: 80px;
        }

        .t-tag {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: rgba(0,0,0,0.45);
        }

        .h-dot {
          color: rgba(0,0,0,0.3);
          font-size: 12px;
        }

        .about-header {
          padding: 80px 24px 60px;
          border-bottom: 0.5px solid rgba(0,0,0,0.12);
          text-align: center;
          background: rgba(255,255,255,0.4);
          backdrop-filter: blur(8px);
        }

        .about-header__inner {
          max-width: 800px;
          margin: 0 auto;
        }

        .about-header__meta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .about-header__title {
          font-family: var(--font-jost), serif;
          font-size: 48px;
          font-weight: 300;
          letter-spacing: -0.02em;
          color: #0f172a;
          margin: 0 0 16px;
        }

        @media (max-width: 768px) {
          .about-header__title {
            font-size: 34px;
          }
        }

        .about-header__desc {
          font-size: 15px;
          line-height: 1.7;
          color: rgba(0,0,0,0.6);
          margin: 0;
        }

        /* Section Headings */
        .section-heading {
          font-family: var(--font-jost), serif;
          font-size: 32px;
          font-weight: 300;
          color: #0f172a;
          margin: 6px 0;
        }

        .section-sub {
          font-size: 13px;
          color: rgba(0,0,0,0.5);
          margin: 0;
        }

        /* Value Cards with Glassmorphism */
        .value-card {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(12px);
          border: 0.5px solid rgba(0,0,0,0.08);
          border-radius: 16px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }

        .value-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.08);
          border-color: #8c764b;
        }

        .value-card__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .value-card__num {
          font-family: var(--font-jost), serif;
          font-size: 28px;
          font-weight: 600;
          color: #8c764b;
        }

        .value-card__icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(140,118,75,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .value-card__tag {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(0,0,0,0.4);
          display: block;
          margin-bottom: 4px;
        }

        .value-card__title {
          font-family: var(--font-jost), serif;
          font-size: 20px;
          font-weight: 500;
          color: #0f172a;
          margin: 0 0 12px;
        }

        .value-card__text {
          font-size: 13px;
          line-height: 1.6;
          color: rgba(0,0,0,0.6);
          margin: 0;
        }

        /* Timeline Section */
        .about-timeline-wrapper {
          background: rgba(255,255,255,0.5);
          border-top: 0.5px solid rgba(0,0,0,0.08);
          border-bottom: 0.5px solid rgba(0,0,0,0.08);
        }

        .timeline-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        @media (max-width: 768px) {
          .timeline-grid {
            grid-template-columns: 1fr;
          }
        }

        .timeline-ticket-card {
          background: #ffffff;
          border: 0.5px solid rgba(0,0,0,0.1);
          border-radius: 16px;
          overflow: hidden;
          display: grid;
          grid-template-columns: 220px 1fr;
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        @media (max-width: 576px) {
          .timeline-ticket-card {
            grid-template-columns: 1fr;
          }
        }

        .timeline-ticket-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
        }

        .timeline-card__img-box {
          position: relative;
          min-height: 200px;
          background: #f1f5f9;
        }

        .timeline-card__year-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(0,0,0,0.75);
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 6px;
          backdrop-filter: blur(4px);
        }

        .timeline-card__tag-badge {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: rgba(140,118,75,0.9);
          color: #ffffff;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.1em;
          padding: 3px 8px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .timeline-card__content {
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .timeline-card__code {
          font-size: 10px;
          font-weight: 700;
          color: #8c764b;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .timeline-card__title {
          font-family: var(--font-jost), serif;
          font-size: 18px;
          font-weight: 600;
          color: #0f172a;
          margin: 4px 0 2px;
        }

        .timeline-card__sub {
          font-size: 11px;
          color: rgba(0,0,0,0.45);
          display: block;
          margin-bottom: 12px;
        }

        .timeline-card__desc {
          font-size: 12px;
          line-height: 1.6;
          color: rgba(0,0,0,0.6);
          margin: 0;
        }

        /* Banner CTA */
        .about-cta-banner {
          padding: 80px 24px;
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(10px);
        }

        .btn-cta-primary {
          background: #0f172a;
          color: #ffffff;
          padding: 14px 28px;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: opacity 0.2s ease;
        }

        .btn-cta-primary:hover {
          opacity: 0.9;
        }

        .btn-cta-secondary {
          background: transparent;
          color: #0f172a;
          border: 0.5px solid rgba(0,0,0,0.2);
          padding: 13px 28px;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s ease;
        }

        .btn-cta-secondary:hover {
          background: rgba(0,0,0,0.05);
        }
      `}</style>
    </div>
  );
}
"""

with open('src/app/about/page.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated src/app/about/page.tsx successfully!")
