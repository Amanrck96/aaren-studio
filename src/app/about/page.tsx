"use client";

import Image from "next/image";
import Link from "next/link";

const TEAM = [
  { name: "Aaren Patel", role: "Creative Director", code: "AP", num: "01", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80" },
  { name: "Zoe Chen", role: "Head of 3D Motion", code: "ZC", num: "02", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80" },
  { name: "Marcus Sterling", role: "Lead Interactive Dev", code: "MS", num: "03", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80" },
];

const TIMELINE = [
  { year: "2022", event: "Establishment of Aaren in Bangalore, India.", code: "ES", num: "22" },
  { year: "2024", event: "Expansion of our global virtual motion studios.", code: "EX", num: "24" },
  { year: "2026", event: "Ranked as top immersive premium agency globally.", code: "RN", num: "26" },
];

export default function About() {
  return (
    <div className="about-page">
      {/* ── Page Header ── */}
      <div className="about-header">
        <div className="about-header__inner">
          <div className="about-header__meta t-tag" style={{ color: "rgba(0,0,0,0.4)", marginBottom: "2.4rem" }}>
            THE STUDIO — Est. 2022
          </div>
          <h1 className="about-header__title">About Us</h1>
          <p className="about-header__desc t-body" style={{ color: "rgba(0,0,0,0.5)", maxWidth: "52rem" }}>
            A creative studio and material house dedicated to designing and producing immersive spatial experiences — meant to evoke feeling.
          </p>
        </div>
      </div>

      {/* ── Mission, Vision, Values ── */}
      <div className="about-values">
        <div className="value-card">
          <div className="value-card__header">
            <span className="value-card__title">OUR MISSION</span>
            <span className="value-card__num">01</span>
          </div>
          <p className="value-card__text">
            We design and construct premium digital realities that elevate the standards of visual aesthetics across every medium.
          </p>
        </div>
        <div className="value-card">
          <div className="value-card__header">
            <span className="value-card__title">OUR VISION</span>
            <span className="value-card__num">02</span>
          </div>
          <p className="value-card__text">
            To remain the primary destination for luxury brands seeking custom design architecture, 3D motion, and immersive coding.
          </p>
        </div>
        <div className="value-card">
          <div className="value-card__header">
            <span className="value-card__title">OUR VALUES</span>
            <span className="value-card__num">03</span>
          </div>
          <p className="value-card__text">
            Unyielding precision, premium design frameworks, fast interfaces, and standard production execution.
          </p>
        </div>
      </div>

      {/* ── Timeline Section (Ticket Layout) ── */}
      <div className="about-timeline-section">
        <div className="timeline-header">
          <span className="t-tag" style={{ color: "rgba(0,0,0,0.45)" }}>STUDIO TIMELINE</span>
        </div>
        <div className="timeline-grid">
          {TIMELINE.map((item) => (
            <div key={item.year} className="timeline-card">
              <div className="timeline-card__body">
                <span className="timeline-card__year">{item.year}</span>
                <p className="timeline-card__event">{item.event}</p>
              </div>
              <div className="timeline-card__caption">
                <div className="timeline-card__caption-left">
                  <span className="timeline-card__caption-code">{item.code}</span>
                </div>
                <div className="timeline-card__caption-right">
                  <span className="timeline-card__caption-num">{item.num}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Team Section ── */}
      <div className="about-team-section">
        <div className="team-header">
          <span className="t-tag" style={{ color: "rgba(0,0,0,0.45)" }}>THE TEAM</span>
          <Link href="/team" className="t-tag ul-link" style={{ color: "rgba(0,0,0,0.45)" }}>View all team →</Link>
        </div>
        <div className="team-grid">
          {TEAM.map((member) => (
            <div key={member.name} className="team-card">
              <div className="team-card__fig-wrapper">
                <div className="team-card__fig">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="team-card__img"
                    style={{ objectFit: "cover", filter: "grayscale(100%)" }}
                  />
                </div>
              </div>
              <div className="team-card__caption">
                <div className="team-card__caption-left">
                  <span className="team-card__caption-name">{member.name}</span>
                  <span className="team-card__caption-role t-tag">{member.role}</span>
                </div>
                <div className="team-card__caption-right">
                  <span className="team-card__caption-code">{member.code}</span>
                  <span className="team-card__caption-num">{member.num}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .about-page {
          background: #eaeef4;
          color: #000;
          min-height: 100vh;
          padding-top: 8rem;
        }

        .about-header {
          padding: 6rem 0.8rem 4rem;
          border-bottom: 0.1rem solid rgba(0,0,0,0.12);
        }

        @media (min-width: 768px) {
          .about-header {
            padding: 8rem 1.2rem 4rem;
          }
        }

        .about-header__title {
          font-size: clamp(6rem, 15vw, 22rem);
          font-weight: 700;
          letter-spacing: -0.05em;
          line-height: 0.88;
          text-transform: uppercase;
          color: #000;
          margin-bottom: 3.2rem;
        }

        .about-header__desc {
          font-size: 1.5rem;
          line-height: 1.5;
          letter-spacing: -0.01em;
        }

        /* ── Values ── */
        .about-values {
          display: flex;
          flex-direction: column;
          width: 100%;
          border-bottom: 0.1rem solid rgba(0,0,0,0.12);
        }

        @media (min-width: 768px) {
          .about-values {
            flex-direction: row;
          }
        }

        .value-card {
          flex: 1;
          padding: 4rem 2.4rem;
          border-bottom: 0.1rem solid rgba(0,0,0,0.12);
          display: flex;
          flex-direction: column;
          gap: 2.4rem;
        }

        @media (min-width: 768px) {
          .value-card {
            border-bottom: none;
            border-right: 0.1rem solid rgba(0,0,0,0.12);
          }
          .value-card:last-child {
            border-right: none;
          }
        }

        .value-card__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .value-card__title {
          font-size: 1.6rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          text-transform: uppercase;
        }

        .value-card__num {
          font-size: 2.4rem;
          font-weight: 700;
          color: rgba(0,0,0,0.25);
          font-family: var(--font-geist-mono), monospace;
        }

        .value-card__text {
          font-size: 1.4rem;
          line-height: 1.6;
          color: rgba(0,0,0,0.6);
        }

        /* ── Timeline Section ── */
        .about-timeline-section {
          border-bottom: 0.1rem solid rgba(0,0,0,0.12);
        }

        .timeline-header {
          padding: 2.4rem 0.8rem;
          border-bottom: 0.1rem solid rgba(0,0,0,0.12);
        }

        .timeline-grid {
          display: flex;
          flex-wrap: wrap;
          width: 100%;
        }

        .timeline-card {
          flex: 0 0 100%;
          width: 100%;
          border-bottom: 0.1rem solid rgba(0,0,0,0.12);
          display: flex;
          flex-direction: column;
        }

        @media (min-width: 768px) {
          .timeline-card {
            flex: 0 0 33.333%;
            width: 33.333%;
            border-bottom: none;
            border-right: 0.1rem solid rgba(0,0,0,0.12);
          }
          .timeline-card:last-child {
            border-right: none;
          }
        }

        .timeline-card__body {
          padding: 4rem 2.4rem;
          background: #eaeef4;
          flex: 1;
        }

        .timeline-card__year {
          font-size: 4rem;
          font-weight: 700;
          color: #000;
          display: block;
          margin-bottom: 1.6rem;
          letter-spacing: -0.03em;
        }

        .timeline-card__event {
          font-size: 1.4rem;
          line-height: 1.5;
          color: rgba(0,0,0,0.6);
        }

        .timeline-card__caption {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.2rem 2.4rem;
          border-top: 0.1rem solid rgba(0,0,0,0.08);
          background: #eaeef4;
        }

        .timeline-card__caption-code {
          font-size: 2rem;
          font-weight: 700;
          color: #000;
        }

        .timeline-card__caption-num {
          font-size: 1.8rem;
          font-weight: 700;
          color: rgba(0,0,0,0.25);
        }

        /* ── Team Section ── */
        .about-team-section {
          border-bottom: 0.1rem solid rgba(0,0,0,0.12);
        }

        .team-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2.4rem 0.8rem;
          border-bottom: 0.1rem solid rgba(0,0,0,0.12);
        }

        .team-grid {
          display: flex;
          flex-wrap: wrap;
          width: 100%;
        }

        .team-card {
          display: flex;
          flex-direction: column;
          flex: 0 0 100%;
          width: 100%;
          border-bottom: 0.1rem solid rgba(0,0,0,0.12);
          overflow: hidden;
        }

        @media (min-width: 768px) {
          .team-card {
            flex: 0 0 33.333%;
            width: 33.333%;
            border-bottom: none;
            border-right: 0.1rem solid rgba(0,0,0,0.12);
          }
          .team-card:last-child {
            border-right: none;
          }
        }

        .team-card__fig-wrapper {
          position: relative;
          overflow: hidden;
          height: 32rem;
          background: #111;
        }

        @media (min-width: 768px) {
          .team-card__fig-wrapper {
            height: 38rem;
          }
        }

        .team-card__fig {
          position: absolute;
          inset: 0;
        }

        .team-card__img {
          transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
        }

        .team-card:hover .team-card__img {
          transform: scale(1.04);
        }

        .team-card__caption {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1.6rem;
          padding: 1.6rem 2.4rem;
          background: #eaeef4;
          transition: background 0.25s ease;
        }

        .team-card:hover .team-card__caption {
          background: #dfe3e9;
        }

        .team-card__caption-left {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .team-card__caption-name {
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.0;
          text-transform: uppercase;
        }

        .team-card__caption-role {
          font-size: 1.1rem;
          color: rgba(0,0,0,0.4);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .team-card__caption-right {
          display: flex;
          align-items: center;
          gap: 1.6rem;
          flex-shrink: 0;
        }

        .team-card__caption-code {
          font-size: 3rem;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1;
        }

        .team-card__caption-num {
          font-size: 2.6rem;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1;
          color: rgba(0,0,0,0.25);
        }
      `}</style>
    </div>
  );
}
