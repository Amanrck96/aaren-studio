"use client";

import Image from "next/image";

const TEAM = [
  { name: "Aaren Patel", role: "Creative Director", code: "AP", num: "01", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80" },
  { name: "Zoe Chen", role: "Head of 3D Motion", code: "ZC", num: "02", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80" },
  { name: "Marcus Sterling", role: "Lead Interactive Dev", code: "MS", num: "03", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80" },
  { name: "Sofia Rodriguez", role: "Interior Architect", code: "SR", num: "04", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80" },
  { name: "Yuki Tanaka", role: "Visual Researcher", code: "YT", num: "05", image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80" },
  { name: "Liam Bennett", role: "Lead Spatial Designer", code: "LB", num: "06", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80" },
];

export default function TeamPage() {
  return (
    <div className="team-page">
      {/* ── Page Header ── */}
      <div className="team-header">
        <div className="team-header__inner">
          <div className="team-header__meta t-tag" style={{ color: "rgba(0,0,0,0.4)", marginBottom: "2.4rem" }}>
            CREATIVE UNIT — {TEAM.length} Specialists
          </div>
          <h1 className="team-header__title">Our Team</h1>
          <p className="team-header__desc t-body" style={{ color: "rgba(0,0,0,0.5)", maxWidth: "52rem" }}>
            A curated collective of architects, 3D artists, designers, and developers working at the intersection of material innovation and digital experience.
          </p>
        </div>
      </div>

      {/* ── Team Grid ── */}
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

      <style>{`
        .team-page {
          background: #eaeef4;
          color: #000;
          min-height: 100vh;
          padding-top: 8rem;
        }

        .team-header {
          padding: 6rem 0.8rem 4rem;
          border-bottom: 0.1rem solid rgba(0,0,0,0.12);
        }

        @media (min-width: 768px) {
          .team-header {
            padding: 8rem 1.2rem 4rem;
          }
        }

        .team-header__title {
          font-size: clamp(6rem, 15vw, 22rem);
          font-weight: 700;
          letter-spacing: -0.05em;
          line-height: 0.88;
          text-transform: uppercase;
          color: #000;
          margin-bottom: 3.2rem;
        }

        .team-header__desc {
          font-size: 1.5rem;
          line-height: 1.5;
          letter-spacing: -0.01em;
        }

        /* ── Team Grid ── */
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
            flex: 0 0 50%;
            width: 50%;
            border-right: 0.1rem solid rgba(0,0,0,0.12);
          }
          .team-card:nth-child(2n) {
            border-right: none;
          }
        }

        @media (min-width: 1200px) {
          .team-card {
            flex: 0 0 33.333%;
            width: 33.333%;
            border-right: 0.1rem solid rgba(0,0,0,0.12) !important;
          }
          .team-card:nth-child(3n) {
            border-right: none !important;
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
