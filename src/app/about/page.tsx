"use client";

import { useEffect, useState } from "react";

const DEFAULT_ROADMAP_STEPS = [
  { id: "rm-01", stepNumber: "01", year: "2015", title: "FOUNDATION & ITALIAN PARTNERSHIPS", description: "Established Aaren Intpro on Mysore Road, Bangalore as exclusive partners for luxury Italian surface brands." },
  { id: "rm-02", stepNumber: "02", year: "2019", title: "MATERIAL LAB EXPANSION", description: "Launched the 10,000 sq.ft. interactive Material Lab showcasing full-scale architectural mockups and FENIX nano-tech surfaces." },
  { id: "rm-03", stepNumber: "03", year: "2024", title: "AAREN CREATIVE STUDIO 2.0", description: "Expanded into bespoke furniture, outdoor WPC decking cladding, and automated project specification PDF generators." },
  { id: "rm-04", stepNumber: "04", year: "2026", title: "LOCO Design", description: "Introduction of Loco Design and premier architectural living systems." }
];

export default function AboutPage() {
  const [roadmap, setRoadmap] = useState(DEFAULT_ROADMAP_STEPS);
  const [siteSettings, setSiteSettings] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/team?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.roadmap && Array.isArray(json.roadmap) && json.roadmap.length > 0) {
          setRoadmap(json.roadmap);
        }
      })
      .catch((e) => console.error(e));

    fetch(`/api/site-settings?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setSiteSettings(json.data);
        }
      })
      .catch((e) => console.error(e));

    const items = document.querySelectorAll(".roadmap__item");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [roadmap.length]);

  return (
    <div className="about-page font-['Jost',sans-serif]">
      {/* ── Page Header ── */}
      <div className="about-header">
        <div className="about-header__inner">
          <div className="about-header__meta t-tag" style={{ color: "#81663F", fontWeight: 700, letterSpacing: "0.12em", marginBottom: "1.6rem" }}>THE HOUSE — Est. 1990</div>
          <h1 className="about-header__title" style={{ color: "#81663F" }}>
            {siteSettings?.aboutTitle || "About Us"}
          </h1>
          <p className="about-header__desc">
            {siteSettings?.aboutSubtitle || "Aaren Intpro is Bengaluru's premier material house and luxury lifestyle curator, dedicated to providing world-class interior products under one roof."}
          </p>
        </div>
      </div>

      {/* ── Mission, Vision, Values ── */}
      <div className="about-values">
        <div className="about-values__inner">
          <div className="value-card value-card--0">
            <div className="value-card__top">
              <span className="value-card__num">01</span>
              <span className="value-card__rule"></span>
            </div>
            <h3 className="value-card__title">Our Mission</h3>
            <p className="value-card__text">
              {siteSettings?.aboutMission || "To provide premium, elite, and high-quality lifestyle products under one roof for the global Indian customer."}
            </p>
          </div>

          <div className="value-card value-card--1">
            <div className="value-card__top">
              <span className="value-card__num">02</span>
              <span className="value-card__rule"></span>
            </div>
            <h3 className="value-card__title">Our Vision</h3>
            <p className="value-card__text">
              {siteSettings?.aboutVision || "To remain the primary one-stop destination for architects, interior designers, builders, and homeowners seeking world-class materials."}
            </p>
          </div>

          <div className="value-card value-card--2">
            <div className="value-card__top">
              <span className="value-card__num">03</span>
              <span className="value-card__rule"></span>
            </div>
            <h3 className="value-card__title">Our Values</h3>
            <p className="value-card__text">
              {siteSettings?.aboutValues || "Uniting as a family, prioritizing robust value systems, and providing curated designs focusing on unique client experiences."}
            </p>
          </div>
        </div>
      </div>

      {/* ── Company Timeline — connected roadmap ── */}
      <div className="about-timeline-section">
        <div className="timeline-header">
          <span className="t-tag" style={{ color: "#81663F", fontWeight: 700, letterSpacing: "0.12em", fontSize: "1.3rem" }}>Company Timeline</span>
        </div>

        <div className="roadmap">
          <div className="roadmap__spine" aria-hidden="true"></div>

          {roadmap.map((step, idx) => {
            const isLeft = idx % 2 === 0;
            const code = step.title ? step.title.split(" ").map((w: string) => w[0]).join("").substring(0, 2).toUpperCase() : `0${idx + 1}`;
            const num = step.year ? step.year.slice(-2) : String(idx + 1).padStart(2, "0");
            return (
              <div
                key={step.id || idx}
                className={`roadmap__item ${isLeft ? "roadmap__item--left" : "roadmap__item--right"} is-visible`}
                data-idx={idx}
              >
                <div className="roadmap__node">
                  <span className="roadmap__node-dot"></span>
                  <span className="roadmap__node-code">{code}</span>
                </div>
                <div className="roadmap__card">
                  <div className="roadmap__card-head">
                    <span className="roadmap__year">{step.year || "2026"}</span>
                    <span className="roadmap__num">{num}</span>
                  </div>
                  {step.title && (
                    <h4 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#81663F", textTransform: "uppercase", marginBottom: "0.6rem", letterSpacing: "0.02em" }}>
                      {step.title}
                    </h4>
                  )}
                  <p className="roadmap__event">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── STYLES ── */}
      <style jsx global>{`
        :root {
          --color-aaren-gold: #81663f;
          --color-bg: #E6E2D8;
          --color-text: #1e1e1e;
          --color-border: rgba(129, 102, 63, 0.18);
        }

        .t-tag {
          font-size: 1.2rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .about-page {
          background: var(--color-bg);
          color: #1e1e1e;
          min-height: 100vh;
          padding-top: 8rem;
        }

        /* ── Header ── */
        .about-header {
          padding: 6rem 2rem 4rem;
          border-bottom: 0.1rem solid var(--color-border);
        }

        @media (min-width: 768px) {
          .about-header { padding: 8rem 4rem 4rem; }
        }

        .about-header__title {
          font-size: clamp(6rem, 15vw, 22rem);
          font-weight: 700;
          letter-spacing: -0.05em;
          line-height: 0.88;
          text-transform: uppercase;
          color: #81663F;
          margin-bottom: 3.2rem;
        }

        .about-header__desc {
          font-size: 1.5rem;
          line-height: 1.5;
          letter-spacing: -0.01em;
          max-width: 52rem;
          color: rgba(0,0,0,0.5);
        }

        .about-header__meta {
          color: rgba(0,0,0,0.4);
          margin-bottom: 2.4rem;
        }

        /* ── Values: staggered premium cards ── */
        .about-values {
          border-bottom: 0.1rem solid var(--color-border);
          padding: 5rem 2rem 7rem;
        }

        @media (min-width: 768px) {
          .about-values { padding: 7rem 4rem 9rem; }
        }

        .about-values__inner {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.4rem;
          max-width: 132rem;
          margin: 0 auto;
        }

        @media (min-width: 768px) {
          .about-values__inner {
            grid-template-columns: repeat(3, 1fr);
            gap: 3.2rem;
          }
        }

        .value-card {
          background: #FAF9F6;
          border: 0.1rem solid var(--color-border);
          padding: 3.6rem 3rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease;
        }

        @media (min-width: 768px) {
          .value-card--0 { transform: translateY(0); }
          .value-card--1 { transform: translateY(3.2rem); }
          .value-card--2 { transform: translateY(6.4rem); }
        }

        .value-card:hover {
          box-shadow: 0 2.4rem 5rem -2rem rgba(0,0,0,0.18);
          border-color: rgba(0,0,0,0.28);
        }

        @media (min-width: 768px) {
          .value-card--0:hover { transform: translateY(-0.4rem); }
          .value-card--1:hover { transform: translateY(2.8rem); }
          .value-card--2:hover { transform: translateY(6.0rem); }
        }

        .value-card__top {
          display: flex;
          align-items: center;
          gap: 1.6rem;
        }

        .value-card__num {
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-aaren-gold);
          flex-shrink: 0;
        }

        .value-card__rule {
          height: 0.1rem;
          flex: 1;
          background: var(--color-border);
        }

        .value-card__title {
          font-size: 1.7rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          color: #81663F;
        }

        .value-card__text {
          font-size: 1.4rem;
          line-height: 1.65;
          color: rgba(0,0,0,0.58);
        }

        /* ── Timeline / Roadmap ── */
        .about-timeline-section {
          border-bottom: 0.1rem solid var(--color-border);
        }

        .timeline-header {
          padding: 2.4rem 2rem;
          border-bottom: 0.1rem solid var(--color-border);
        }

        @media (min-width: 768px) {
          .timeline-header { padding: 2.4rem 4rem; }
        }

        .roadmap {
          position: relative;
          max-width: 108rem;
          margin: 0 auto;
          padding: 6rem 2.4rem 8rem;
        }

        @media (min-width: 768px) {
          .roadmap { padding: 8rem 3rem 10rem; }
        }

        .roadmap__spine {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 2.7rem;
          width: 0.1rem;
          background: linear-gradient(to bottom, transparent, var(--color-border) 4%, var(--color-border) 96%, transparent);
        }

        @media (min-width: 768px) {
          .roadmap__spine { left: 50%; transform: translateX(-50%); }
        }

        .roadmap__item {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 2.8rem;
          padding-left: 5.6rem;
          margin-bottom: 5.6rem;
          opacity: 0;
          transform: translateY(2.4rem);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .roadmap__item.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .roadmap__item:last-child { margin-bottom: 0; }

        @media (min-width: 768px) {
          .roadmap__item {
            padding-left: 0;
            width: 50%;
          }
          .roadmap__item--left {
            justify-content: flex-end;
            padding-right: 6rem;
            flex-direction: row;
          }
          .roadmap__item--right {
            justify-content: flex-start;
            padding-left: 6rem;
            margin-left: 50%;
            flex-direction: row-reverse;
          }
        }

        .roadmap__node {
          position: absolute;
          left: 0.8rem;
          top: 0.2rem;
          width: 3.8rem;
          height: 3.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (min-width: 768px) {
          .roadmap__item--left .roadmap__node { left: auto; right: -1.9rem; }
          .roadmap__item--right .roadmap__node { left: -1.9rem; }
        }

        .roadmap__node-dot {
          position: absolute;
          width: 1.1rem;
          height: 1.1rem;
          border-radius: 50%;
          background: var(--color-bg);
          border: 0.2rem solid var(--color-aaren-gold);
        }

        .roadmap__node-code {
          position: relative;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          color: rgba(0,0,0,0.4);
          background: var(--color-bg);
          padding: 0 0.4rem;
          transform: translateY(2.6rem);
        }

        .roadmap__card {
          background: #FAF9F6;
          border: 0.1rem solid var(--color-border);
          padding: 3rem 3.2rem;
          max-width: 46rem;
          width: 100%;
          transition: box-shadow 0.4s ease, border-color 0.4s ease;
        }

        .roadmap__item:hover .roadmap__card {
          box-shadow: 0 2rem 4.4rem -2.4rem rgba(0,0,0,0.2);
          border-color: rgba(0,0,0,0.26);
        }

        .roadmap__card-head {
          display: flex;
          align-items: baseline;
          gap: 1.2rem;
          margin-bottom: 1.6rem;
        }

        .roadmap__year {
          font-size: 3.6rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: #81663F;
        }

        .roadmap__num {
          font-size: 1.6rem;
          font-weight: 700;
          color: rgba(129, 102, 63, 0.4);
        }

        .roadmap__event {
          font-size: 1.4rem;
          line-height: 1.6;
          color: rgba(0,0,0,0.6);
        }

        @media (prefers-reduced-motion: reduce) {
          .roadmap__item {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
