"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export const TEAM_SECTIONS = [
  { id: "leadership", title: "1. LEADERSHIP", match: "leadership" },
  { id: "sales", title: "A. SALES TEAM", match: "sales" },
  { id: "operations", title: "B. OPERATIONS TEAM", match: "operations" },
  { id: "installation", title: "C. INSTALLATION TEAM", match: "installation" },
  { id: "support", title: "D. SUPPORT STAFF", match: "support staff" },
];

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [joinBanner, setJoinBanner] = useState({
    title: "DO YOU WANT TO JOIN THE CREATIVE TEAM?",
    fontSize: "medium",
    hoursText: "Open 9am to 9pm (All days)",
    phone: "+91 88844 64444",
    email: "info@aarenintpro.com",
    address: "NO. 342/8, NTY LAYOUT, MYSORE ROAD, BENGALURU - 560026",
  });

  useEffect(() => {
    fetch("/api/team?t=" + Date.now(), { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (json && json.success) {
          const list = json.team || (json.data && json.data.team) || (Array.isArray(json.data) ? json.data : null);
          if (list && list.length > 0) {
            const sortedList = [...list].sort((a: any, b: any) => (a.sequenceNumber ?? 999) - (b.sequenceNumber ?? 999));
            setTeamMembers(
              sortedList.map((m: any, idx: number) => {
                const catLower = (m.category || "Sales").toLowerCase();
                const isLeadership = catLower === "leadership" || (m.group && m.group.toLowerCase() === "leadership");
                return {
                  id: m.id,
                  name: m.name,
                  role: m.designation || m.role || "Team Member",
                  category: m.category || (isLeadership ? "Leadership" : "Sales"),
                  group: isLeadership ? "Leadership" : "Team",
                  code: m.memberCode ? m.memberCode.split(" ")[0] : (isLeadership ? "MM" : "TM"),
                  num: m.memberCode && m.memberCode.split(" ")[1] ? m.memberCode.split(" ")[1] : String(m.sequenceNumber || idx + 1).padStart(2, "0"),
                  image: m.photoUrl || m.image,
                  bio: m.bio,
                  sequenceNumber: m.sequenceNumber ?? idx + 1,
                  phone: m.phone,
                  linkedin: m.linkedin,
                  instagram: m.instagram,
                };
              })
            );
          }
          if (json.joinBanner || (json.data && json.data.joinBanner)) {
            setJoinBanner(json.joinBanner || json.data.joinBanner);
          }
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="team-page">
      {/* ── Page Header ── */}
      <div className="team-header">
        <div className="team-header__inner">
          <div className="team-header__meta" style={{ color: "#81663F", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.4rem", fontSize: "1.1rem" }}>
            ORGANIZATIONAL STRUCTURE
          </div>
          <h1 className="team-header__title" style={{ color: "#81663F" }}>OUR TEAM</h1>
          <p className="team-header__desc" style={{ color: "#5E5852", maxWidth: "68rem", fontSize: "1.5rem", lineHeight: 1.6, margin: "0 auto" }}>
            Structured under <strong>1. Leadership</strong> and <strong>2. Team</strong> (comprising <strong>A. Sales</strong>, <strong>B. Operations</strong>, <strong>C. Installation</strong>, and <strong>D. Support Staff</strong>) — delivering world-class architectural solutions across India.
          </p>
        </div>
      </div>

      {/* ── Direct Stacked Sections: No Dropdowns, No Filters ── */}
      <div className="team-sections-container">
        {TEAM_SECTIONS.map((section) => {
          const members = teamMembers.filter((m) => {
            const cat = (m.category || "").toLowerCase();
            if (section.id === "leadership") {
              return cat === "leadership" || m.group === "Leadership";
            }
            if (section.id === "sales") {
              return cat.includes("sales");
            }
            if (section.id === "operations") {
              return cat.includes("operation");
            }
            if (section.id === "installation") {
              return cat.includes("installation");
            }
            if (section.id === "support") {
              return cat.includes("support") || cat.includes("accounts") || cat.includes("finance");
            }
            return false;
          }).sort((a, b) => (a.sequenceNumber ?? 999) - (b.sequenceNumber ?? 999));

          if (members.length === 0 && !loading) return null;

          return (
            <section key={section.id} className="team-department-section" id={`team-${section.id}`}>
              {/* Department Heading */}
              <div className="department-header">
                <div className="department-heading-wrapper">
                  <h2 className="department-title">{section.title}</h2>
                  <span className="department-badge">[{members.length} MEMBERS]</span>
                </div>
                <div className="department-divider" />
              </div>

              {/* Members Photo Grid */}
              <div className="team-grid">
                {members.map((member) => (
                  <div key={member.id} className="team-card">
                    {/* Photo Box */}
                    <div className="team-card__img-wrap">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="team-card__img"
                        />
                      ) : (
                        <div className="team-card__placeholder">
                          <span className="team-card__initials">
                            {member.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </span>
                          <span className="team-card__role-tag">{member.role}</span>
                        </div>
                      )}
                      <div className="team-card__num-tag">{member.num}</div>
                    </div>

                    {/* Member Details */}
                    <div className="team-card__body">
                      <div className="team-card__top">
                        <span className="team-card__dept-tag">{member.category}</span>
                        <span className="team-card__code">{member.code}</span>
                      </div>
                      <h3 className="team-card__name">{member.name}</h3>
                      <p className="team-card__role">{member.role}</p>

                      {member.bio && (
                        <p className="team-card__bio">{member.bio}</p>
                      )}

                      {member.phone && (
                        <div className="team-card__contact">
                          <a href={`tel:${member.phone}`} className="team-card__phone">
                            📞 {member.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* ── Join the Creative Team Banner ── */}
      <section className="join-banner-section">
        <div className="join-banner-inner">
          <span className="join-banner-eyebrow">CAREERS AT AAREN STUDIO</span>
          <h2 className="join-banner-title">{joinBanner.title}</h2>
          <p className="join-banner-subtitle">
            We are always seeking visionary architects, sales consultants, and material specialists to join our Bangalore flagship studio.
          </p>

          <div className="join-banner-details">
            <div className="join-detail-item">
              <span className="join-detail-label">HOURS</span>
              <span className="join-detail-val">{joinBanner.hoursText}</span>
            </div>
            <div className="join-detail-item">
              <span className="join-detail-label">CALL US</span>
              <a href={`tel:${joinBanner.phone}`} className="join-detail-val">
                {joinBanner.phone}
              </a>
            </div>
            <div className="join-detail-item">
              <span className="join-detail-label">EMAIL US</span>
              <a href={`mailto:${joinBanner.email}`} className="join-detail-val">
                {joinBanner.email}
              </a>
            </div>
          </div>

          <div className="join-banner-address">
            📍 {joinBanner.address}
          </div>
        </div>
      </section>

      <style jsx>{`
        .team-page {
          background-color: #E6E2D8;
          color: #1C1917;
          min-height: 100vh;
          padding-top: 8rem;
          font-family: var(--font-jost), 'Jost', sans-serif;
        }

        .team-header {
          padding: 5rem 2.4rem 3.5rem;
          text-align: center;
          border-bottom: 1px solid #D8D0BE;
          background: #E6E2D8;
        }

        .team-header__inner {
          max-width: 1000px;
          margin: 0 auto;
        }

        .team-header__title {
          font-size: clamp(3.5rem, 8vw, 8.5rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 0.95;
          color: #81663F;
          text-transform: uppercase;
          margin-bottom: 1.8rem;
        }

        .team-sections-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 3rem 2.4rem 6rem;
          display: flex;
          flex-direction: column;
          gap: 5rem;
        }

        .team-department-section {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .department-header {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .department-heading-wrapper {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .department-title {
          font-size: clamp(2rem, 3.2vw, 3.4rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #81663F;
          text-transform: uppercase;
          margin: 0;
        }

        .department-badge {
          font-size: 1.1rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: #81663F;
          background: #FAF9F6;
          padding: 0.35rem 1rem;
          border-radius: 999px;
          border: 1px solid #D8D0BE;
        }

        .department-divider {
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, #81663F 0%, rgba(129, 102, 63, 0.2) 60%, transparent 100%);
        }

        .team-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.4rem;
        }

        @media (min-width: 640px) {
          .team-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .team-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 2.8rem;
          }
        }

        @media (min-width: 1280px) {
          .team-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .team-card {
          background: #FAF9F6;
          border: 1px solid #D8D0BE;
          border-radius: 0.8rem;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 6px 20px rgba(0,0,0,0.04);
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .team-card:hover {
          transform: translateY(-0.4rem);
          border-color: #81663F;
          box-shadow: 0 1.2rem 3rem rgba(129, 102, 63, 0.12);
        }

        .team-card__img-wrap {
          position: relative;
          height: 26rem;
          background: #E8E3D7;
          overflow: hidden;
        }

        .team-card__img {
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .team-card:hover .team-card__img {
          transform: scale(1.04);
        }

        .team-card__placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #EDE8DF;
          color: #81663F;
          gap: 0.6rem;
        }

        .team-card__initials {
          font-size: 3.5rem;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        .team-card__role-tag {
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #8A8279;
        }

        .team-card__num-tag {
          position: absolute;
          top: 1.2rem;
          right: 1.2rem;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(6px);
          color: #D4B67D;
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          padding: 0.3rem 0.8rem;
          border-radius: 0.4rem;
          border: 1px solid rgba(212, 182, 125, 0.3);
        }

        .team-card__body {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          flex: 1;
        }

        .team-card__top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .team-card__dept-tag {
          font-size: 0.95rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #81663F;
        }

        .team-card__code {
          font-size: 1rem;
          font-weight: 700;
          color: #8A8279;
        }

        .team-card__name {
          font-size: 1.7rem;
          font-weight: 800;
          line-height: 1.2;
          color: #81663F;
          margin: 0;
        }

        .team-card__role {
          font-size: 1.2rem;
          color: #5E5852;
          font-weight: 600;
          margin: 0;
        }

        .team-card__bio {
          font-size: 1.15rem;
          line-height: 1.5;
          color: #5E5852;
          font-weight: 400;
          margin: 0;
          margin-top: 0.4rem;
        }

        .team-card__contact {
          margin-top: auto;
          padding-top: 1.2rem;
          border-top: 1px solid #E8E3D7;
        }

        .team-card__phone {
          font-size: 1.1rem;
          color: #81663F;
          font-weight: 700;
          text-decoration: none;
          display: inline-block;
          transition: color 0.2s ease;
        }

        .team-card__phone:hover {
          color: #B38E46;
        }

        /* JOIN BANNER */
        .join-banner-section {
          background: #FAF9F6;
          border-top: 1px solid #D8D0BE;
          padding: 6rem 2.4rem;
          text-align: center;
        }

        .join-banner-inner {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.6rem;
        }

        .join-banner-eyebrow {
          font-size: 1.1rem;
          font-weight: 800;
          letter-spacing: 0.15em;
          color: #81663F;
        }

        .join-banner-title {
          font-size: clamp(2.2rem, 3.8vw, 3.6rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #81663F;
          line-height: 1.2;
          margin: 0;
        }

        .join-banner-subtitle {
          font-size: 1.4rem;
          color: #5E5852;
          line-height: 1.5;
          max-width: 700px;
          margin: 0;
        }

        .join-banner-details {
          display: flex;
          justify-content: center;
          gap: 2.4rem;
          flex-wrap: wrap;
          margin-top: 1rem;
          padding: 1.6rem 2.4rem;
          background: #E6E2D8;
          border-radius: 0.8rem;
          border: 1px solid #D8D0BE;
        }

        .join-detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          text-align: center;
        }

        .join-detail-label {
          font-size: 0.9rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: #81663F;
        }

        .join-detail-val {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1C1917;
          text-decoration: none;
        }

        .join-banner-address {
          font-size: 1.2rem;
          color: #8A8279;
          font-weight: 600;
          letter-spacing: 0.02em;
        }
      `}</style>
    </div>
  );
}
