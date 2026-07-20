"use client";

import Image from "next/image";

const TEAM = [
  { 
    name: "MOHANLAL MP", 
    role: "Founder", 
    code: "MM", 
    num: "01", 
    image: "https://www.aarenintpro.com/wp-content/uploads/2016/08/about-us-4-min.jpg", 
    bio: "He is the face and voice of AAREN. The face that represents AAREN, the voice that tells the story of AAREN. He guides AAREN by guiding its culture, values and the well being of the team." 
  },
  { 
    name: "RAMNIKLAL M VAGADIYA", 
    role: "Founder & Chairman", 
    code: "RV", 
    num: "02", 
    image: "https://www.aarenintpro.com/wp-content/uploads/2016/08/about-us-6-min.jpg", 
    bio: "A chartered accountant who is the backbone of the organization. He keeps the business focused, motivated, and sets concrete business plans for the team to achieve its vision." 
  },
  { 
    name: "MADHUSUDHAN MP", 
    role: "Envisioner & Chief Planner", 
    code: "MP", 
    num: "03", 
    image: "https://www.aarenintpro.com/wp-content/uploads/2016/08/about-us-2-min.jpg", 
    bio: "He is the vision of AAREN. Responsible for creating the strategy, driving the business and scouting for world class products." 
  },
  { 
    name: "KOU SHIK", 
    role: "Sales", 
    code: "KS", 
    num: "04", 
    image: "https://www.aarenintpro.com/wp-content/uploads/2016/08/about-us-1-min.jpg", 
    bio: "He guides customers to optimize the space utility, is abreast with market trends, and coordinates layouts for projects." 
  },
  { 
    name: "ASHWIN", 
    role: "Sales", 
    code: "AW", 
    num: "05", 
    image: "https://www.aarenintpro.com/wp-content/uploads/2016/08/about-us-3-min.jpg", 
    bio: "Consults with architects and developers to find surface and material solutions, manages customer relations and outreach." 
  },
  { 
    name: "MUKUND", 
    role: "Sales", 
    code: "MK", 
    num: "06", 
    image: "https://www.aarenintpro.com/wp-content/uploads/2016/08/about-us-5-min.jpg", 
    bio: "Curates the products, educates customers on the product mix and manages the store display." 
  },
  { 
    name: "JIGNESH", 
    role: "Sales", 
    code: "JG", 
    num: "07", 
    image: "https://www.aarenintpro.com/wp-content/uploads/2016/08/about-us-7-min.jpg", 
    bio: "Maintains communication narratives, manages the sales channels, and reaches out to customers for Bagno & Surface solutions." 
  },
];

export default function TeamPage() {
  return (
    <div className="team-page">
      {/* ── Page Header ── */}
      <div className="team-header">
        <div className="team-header__inner">
          <div className="team-header__meta t-tag" style={{ color: "#8c764b", fontWeight: 700, letterSpacing: "0.12em", marginBottom: "1.6rem" }}>
            MEET THE TEAM
          </div>
          <h1 className="team-header__title" style={{ color: "#8c764b" }}>OUR TEAM</h1>
          <p className="team-header__desc t-body" style={{ color: "rgba(0,0,0,0.65)", maxWidth: "58rem", fontSize: "1.6rem", lineHeight: 1.6 }}>
            Aaren Intpro is built by a family of people who are united by a common dream to create a luxury brand that serves the global customer by providing world class products under one roof.
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
                  style={{ objectFit: "cover", objectPosition: "center 10%", filter: "grayscale(100%)" }}
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

      {/* ── Call to Action Join Section ── */}
      <div className="team-join-section">
        <h2 className="team-join-title">DO YOU WANT TO JOIN THE CREATIVE TEAM?</h2>
        <div className="team-join-info">
          <div className="team-join-circle-icon">i</div>
          <p className="team-join-hours">Open 9am to 9pm (All days)</p>
          <div className="team-join-contacts">
            <a href="tel:+918884464444" className="team-join-link">+91 88844 64444</a>
            <a href="mailto:info@aarenintpro.com" className="team-join-link">info@aarenintpro.com</a>
            <p className="team-join-address">NO. 342/8, NTY LAYOUT, MYSORE ROAD, BENGALURU - 560026</p>
          </div>
        </div>
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
            padding: 8rem 1.2rem 5rem;
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

        /* ── Team Grid with Sturdy-style Spacing & Row Gaps ── */
        .team-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 4rem 2.4rem;
          padding: 4rem 1.2rem 8rem;
          max-width: 1600px;
          margin: 0 auto;
        }

        @media (min-width: 768px) {
          .team-grid {
            grid-template-columns: repeat(2, 1fr);
            padding: 6rem 2.4rem 10rem;
            gap: 5rem 3.2rem;
          }
        }

        @media (min-width: 1200px) {
          .team-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 6rem 3.6rem;
          }
        }

        .team-card {
          display: flex;
          flex-direction: column;
          background: #eaeef4;
          border: 0.1rem solid rgba(0, 0, 0, 0.12);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .team-card:hover {
          transform: translateY(-0.4rem);
          box-shadow: 0 1.2rem 3.2rem rgba(0,0,0,0.08);
        }

        .team-card__fig-wrapper {
          position: relative;
          overflow: hidden;
          height: 38rem;
          background: #111;
        }

        @media (min-width: 768px) {
          .team-card__fig-wrapper {
            height: 44rem;
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
