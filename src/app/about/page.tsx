"use client";

import Image from "next/image";
import Link from "next/link";

const TEAM = [
  { name: "MOHANLAL MP", role: "Founder", code: "MM", num: "01", image: "https://www.aarenintpro.com/wp-content/uploads/2016/08/about-us-1-min.jpg", bio: "He is the face and voice of AAREN. The face that represents AAREN, the voice that tells the story of AAREN. He guides AAREN by guiding its culture, values and the well being of the team." },
  { name: "RAMNIKLAL M VAGADIYA", role: "Founder & Chairman", code: "RV", num: "02", image: "https://www.aarenintpro.com/wp-content/uploads/2016/08/about-us-2-min.jpg", bio: "A chartered accountant who is the backbone of the organization. He keeps the business focused, motivated, and sets concrete business plans for the team to achieve its vision." },
  { name: "MADHUSUDHAN MP", role: "Envisioner & Chief Planner", code: "MP", num: "03", image: "https://www.aarenintpro.com/wp-content/uploads/2016/08/about-us-3-min.jpg", bio: "He is the vision of AAREN. Responsible for creating the strategy, driving the business and scouting for world class products." },
];

const TIMELINE = [
  { year: "1990", event: "Founded as Poonam Timbers, establishing our deep roots in high-quality timber and raw surface materials.", code: "PT", num: "90" },
  { year: "2015", event: "Rebranded as Aaren Intpro, expanding into elite global interior products and architectural solutions.", code: "AI", num: "15" },
  { year: "2026", event: "Bengaluru's primary destination for world-renowned brands, luxury bathroom fixtures, and surfaces.", code: "UD", num: "26" },
];

export default function About() {
  return (
    <div className="about-page">
      {/* ── Page Header ── */}
      <div className="about-header">
        <div className="about-header__inner">
          <div className="about-header__meta t-tag" style={{ color: "rgba(0,0,0,0.4)", marginBottom: "2.4rem" }}>
            THE HOUSE — Est. 1990
          </div>
          <h1 className="about-header__title">About Us</h1>
          <p className="about-header__desc t-body" style={{ color: "rgba(0,0,0,0.5)", maxWidth: "52rem" }}>
            Aaren Intpro is Bengaluru's premier material house and luxury lifestyle curator, dedicated to providing world-class interior products under one roof.
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
            To provide premium, elite, and high-quality lifestyle products under one roof for the global Indian customer.
          </p>
        </div>
        <div className="value-card">
          <div className="value-card__header">
            <span className="value-card__title">OUR VISION</span>
            <span className="value-card__num">02</span>
          </div>
          <p className="value-card__text">
            To remain the primary one-stop destination for architects, interior designers, builders, and homeowners seeking world-class materials.
          </p>
        </div>
        <div className="value-card">
          <div className="value-card__header">
            <span className="value-card__title">OUR VALUES</span>
            <span className="value-card__num">03</span>
          </div>
          <p className="value-card__text">
            Uniting as a family, prioritizing robust value systems, and providing curated designs focusing on unique client experiences.
          </p>
        </div>
      </div>

      {/* ── Timeline Section (Ticket Layout) ── */}
      <div className="about-timeline-section">
        <div className="timeline-header">
          <span className="t-tag" style={{ color: "rgba(0,0,0,0.45)" }}>COMPANY TIMELINE</span>
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
          <span className="t-tag" style={{ color: "#8c764b", fontWeight: 700 }}>LEADERSHIP</span>
          <Link href="/team" className="t-tag ul-link" style={{ color: "#8c764b", fontWeight: 700 }}>View all team →</Link>
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
              <div className="team-card__caption" style={{ display: "flex", flexDirection: "column", gap: "1.2rem", padding: "2.4rem 2rem 3rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%", gap: "1.6rem" }}>
                  <div className="team-card__caption-left">
                    <span className="team-card__caption-name" style={{ color: "#8c764b", fontSize: "1.7rem", fontWeight: 700, letterSpacing: "0.02em" }}>{member.name}</span>
                    <span className="team-card__caption-role t-tag" style={{ marginTop: "0.4rem", color: "#000", fontWeight: 700, fontSize: "1.2rem" }}>{member.role}</span>
                  </div>
                  <div className="team-card__caption-right">
                    <span className="team-card__caption-code">{member.code}</span>
                    <span className="team-card__caption-num">{member.num}</span>
                  </div>
                </div>
                <p style={{ fontSize: "1.35rem", lineHeight: 1.6, color: "rgba(0,0,0,0.6)", margin: 0, fontWeight: 400 }}>
                  {member.bio}
                </p>

                {/* Minimal sharing/profile social media icons */}
                <div style={{ display: "flex", gap: "1rem", marginTop: "0.6rem" }}>
                  <a href="#" className="team-member-social-icon" aria-label="Facebook">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>
                  <a href="#" className="team-member-social-icon" aria-label="Twitter">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                  </a>
                  <a href="#" className="team-member-social-icon" aria-label="LinkedIn">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
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

        .team-member-social-icon {
          width: 2.8rem;
          height: 2.8rem;
          border-radius: 50%;
          border: 0.1rem solid rgba(0,0,0,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(0,0,0,0.45);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .team-member-social-icon:hover {
          border-color: #8c764b;
          color: #8c764b;
          transform: translateY(-0.15rem);
        }
      `}</style>
    </div>
  );
}
