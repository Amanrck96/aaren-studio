"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export const TEAM_GROUPS = [
  { id: "all", label: "ALL MEMBERS" },
  { id: "leadership", label: "1. LEADERSHIP" },
  { id: "team", label: "2. TEAM" },
];

export const TEAM_DEPARTMENTS = [
  { id: "all", label: "ALL DEPARTMENTS" },
  { id: "sales", label: "A. SALES", match: "sales" },
  { id: "operations", label: "B. OPERATIONS", match: "operations" },
  { id: "installation", label: "C. INSTALLATION", match: "installation" },
  { id: "support", label: "D. SUPPORT STAFF", match: "support staff" },
];

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<"all" | "leadership" | "team">("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

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

  // Filter members based on selected Group and Department
  const filteredMembers = teamMembers.filter((m) => {
    const isLeadership = m.group === "Leadership" || m.category?.toLowerCase() === "leadership";

    if (selectedGroup === "leadership") {
      return isLeadership;
    }

    if (selectedGroup === "team") {
      if (isLeadership) return false;
      if (selectedDepartment === "all") return true;
      const deptObj = TEAM_DEPARTMENTS.find((d) => d.id === selectedDepartment);
      if (!deptObj || !deptObj.match) return true;
      return m.category?.toLowerCase() === deptObj.match;
    }

    // "all" mode
    if (selectedDepartment !== "all") {
      const deptObj = TEAM_DEPARTMENTS.find((d) => d.id === selectedDepartment);
      if (deptObj && deptObj.match) {
        return m.category?.toLowerCase() === deptObj.match;
      }
    }

    return true;
  }).sort((a, b) => (a.sequenceNumber ?? 999) - (b.sequenceNumber ?? 999));

  // Counts helpers
  const leadershipCount = teamMembers.filter((m) => m.group === "Leadership" || m.category?.toLowerCase() === "leadership").length;
  const teamCount = teamMembers.filter((m) => m.group === "Team" && m.category?.toLowerCase() !== "leadership").length;

  const getDepartmentCount = (matchStr: string) => {
    return teamMembers.filter((m) => m.category?.toLowerCase() === matchStr.toLowerCase()).length;
  };

  return (
    <div className="team-page">
      {/* ── Page Header ── */}
      <div className="team-header">
        <div className="team-header__inner">
          <div className="team-header__meta t-tag" style={{ color: "#81663F", fontWeight: 700, letterSpacing: "0.14em", marginBottom: "1.6rem" }}>
            ORGANIZATIONAL STRUCTURE
          </div>
          <h1 className="team-header__title" style={{ color: "#81663F" }}>OUR TEAM</h1>
          <p className="team-header__desc t-body" style={{ color: "rgba(0,0,0,0.7)", maxWidth: "64rem", fontSize: "1.6rem", lineHeight: 1.6 }}>
            Structured under <strong>1. Leadership</strong> and <strong>2. Team</strong> (comprising <strong>A. Sales</strong>, <strong>B. Operations</strong>, <strong>C. Installation</strong>, and <strong>D. Support Staff</strong>) — delivering world-class architectural solutions across India.
          </p>
        </div>
      </div>

      {/* ── Primary Tier Selector (1. Leadership vs 2. Team) ── */}
      <div className="team-tier-nav-wrapper">
        <div className="team-tier-nav">
          <span className="team-tier-label">ORGANIZATION:</span>
          
          <button
            onClick={() => {
              setSelectedGroup("all");
              setSelectedDepartment("all");
            }}
            className={`team-tier-btn ${selectedGroup === "all" ? "active" : ""}`}
          >
            <span>ALL MEMBERS</span>
            <span className="team-tier-count">{teamMembers.length}</span>
          </button>

          <button
            onClick={() => {
              setSelectedGroup("leadership");
              setSelectedDepartment("all");
            }}
            className={`team-tier-btn ${selectedGroup === "leadership" ? "active" : ""}`}
          >
            <span>1. LEADERSHIP</span>
            <span className="team-tier-count">{leadershipCount}</span>
          </button>

          <button
            onClick={() => {
              setSelectedGroup("team");
              setSelectedDepartment("all");
            }}
            className={`team-tier-btn ${selectedGroup === "team" ? "active" : ""}`}
          >
            <span>2. TEAM</span>
            <span className="team-tier-count">{teamCount}</span>
          </button>
        </div>
      </div>

      {/* ── Sub Department Filter Bar (Sales, Operations, Installation, Support Staff) ── */}
      {(selectedGroup === "team" || selectedGroup === "all") && (
        <div className="team-dept-nav-wrapper">
          <div className="team-dept-nav">
            <span className="team-dept-label">TEAM DEPARTMENTS:</span>
            {TEAM_DEPARTMENTS.map((dept) => {
              const isActive = selectedDepartment === dept.id;
              const count = dept.id === "all" ? teamCount : (dept.match ? getDepartmentCount(dept.match) : 0);
              return (
                <button
                  key={dept.id}
                  onClick={() => {
                    setSelectedDepartment(dept.id);
                  }}
                  className={`team-dept-btn ${isActive ? "active" : ""}`}
                >
                  <span>{dept.label}</span>
                  <span className="team-dept-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Team Grid ── */}
      <div className="team-grid-container">
        {loading ? (
          <div style={{ textAlign: "center", padding: "6rem 2rem", color: "rgba(0,0,0,0.5)", fontSize: "1.6rem" }}>
            Loading team directory…
          </div>
        ) : filteredMembers.length === 0 ? (
          <div style={{ textAlign: "center", padding: "6rem 2rem", color: "rgba(0,0,0,0.5)", fontSize: "1.6rem" }}>
            No team members found in the selected section.
          </div>
        ) : (
          <div className="team-grid">
            {filteredMembers.map((member) => {
              const isLeadership = member.group === "Leadership" || member.category?.toLowerCase() === "leadership";
              return (
                <div key={member.id || member.name} className={`team-card ${isLeadership ? "team-card--leadership" : ""}`}>
                  <div className="team-card__fig-wrapper">
                    <div className="team-card__fig">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="team-card__img"
                          style={{ objectFit: "cover", objectPosition: "center 10%", filter: "grayscale(100%)" }}
                        />
                      ) : (
                        <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #1e2230 0%, #0b0c10 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#C8A96E", fontSize: "4rem", fontWeight: 800, letterSpacing: "0.05em" }}>
                          {member.name ? member.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase() : "AA"}
                        </div>
                      )}
                    </div>

                    {/* Hierarchy & Department Badge */}
                    <div className="team-card__category-badge">
                      {isLeadership ? "1. LEADERSHIP" : `2. TEAM · ${member.category?.toUpperCase() || "SALES"}`}
                    </div>
                  </div>

                  <div className="team-card__caption" style={{ display: "flex", flexDirection: "column", gap: "1.2rem", padding: "2.4rem 2rem 3rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%", gap: "1.6rem" }}>
                      <div className="team-card__caption-left">
                        <span className="team-card__caption-name" style={{ color: "#81663F", fontSize: "1.7rem", fontWeight: 700, letterSpacing: "0.02em" }}>
                          {member.name}
                        </span>
                        <span className="team-card__caption-role t-tag" style={{ marginTop: "0.4rem", color: "#1C1917", fontWeight: 700, fontSize: "1.2rem" }}>
                          {member.role}
                        </span>
                      </div>
                      <div className="team-card__caption-right">
                        <span className="team-card__caption-code">{member.code}</span>
                        <span className="team-card__caption-num">{member.num}</span>
                      </div>
                    </div>

                    <p style={{ fontSize: "1.35rem", lineHeight: 1.6, color: "rgba(0,0,0,0.65)", margin: 0, fontWeight: 400 }}>
                      {member.bio}
                    </p>

                    {/* Social & Contact links */}
                    <div style={{ display: "flex", gap: "1rem", marginTop: "0.6rem" }}>
                      {member.phone && (
                        <a href={`tel:${member.phone.replace(/[^+0-9]/g, "")}`} className="team-member-social-icon" aria-label="Phone" title={member.phone}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                          </svg>
                        </a>
                      )}
                      <a href={member.linkedin || "#"} className="team-member-social-icon" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                          <rect x="2" y="9" width="4" height="12"></rect>
                          <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                      </a>
                      <a href="#" className="team-member-social-icon" aria-label="Share profile">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="18" cy="5" r="3"></circle>
                          <circle cx="6" cy="12" r="3"></circle>
                          <circle cx="18" cy="19" r="3"></circle>
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Call to Action Join Section ── */}
      <div className="team-join-section">
        <h2 className={`team-join-title size-${joinBanner.fontSize || "medium"}`}>
          {joinBanner.title || "DO YOU WANT TO JOIN THE CREATIVE TEAM?"}
        </h2>
        <div className="team-join-info">
          <div className="team-join-circle-icon">i</div>
          <p className="team-join-hours">{joinBanner.hoursText || "Open 9am to 9pm (All days)"}</p>
          <div className="team-join-contacts">
            <a href={`tel:${(joinBanner.phone || "+918884464444").replace(/[^+0-9]/g, "")}`} className="team-join-link">{joinBanner.phone || "+91 88844 64444"}</a>
            <a href={`mailto:${joinBanner.email || "info@aarenintpro.com"}`} className="team-join-link">{joinBanner.email || "info@aarenintpro.com"}</a>
            <p className="team-join-address">{joinBanner.address || "NO. 342/8, NTY LAYOUT, MYSORE ROAD, BENGALURU - 560026"}</p>
          </div>
        </div>
      </div>

      <style>{`
        .team-page {
          background: #E6E2D8;
          color: #1e1e1e;
          min-height: 100vh;
          padding-top: 8rem;
        }

        .team-header {
          padding: 6rem 1.6rem 4rem;
          border-bottom: 0.1rem solid rgba(129,102,63,0.18);
        }

        @media (min-width: 768px) {
          .team-header {
            padding: 8rem 2.4rem 5rem;
          }
        }

        .team-header__title {
          font-size: clamp(5rem, 12vw, 16rem);
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 0.9;
          text-transform: uppercase;
          color: #81663F;
          margin-bottom: 2.4rem;
        }

        .team-header__desc {
          font-size: 1.5rem;
          line-height: 1.5;
          letter-spacing: -0.01em;
          color: rgba(0,0,0,0.7);
        }

        /* ── Tier Selector Navigation ── */
        .team-tier-nav-wrapper {
          border-bottom: 1px solid rgba(129,102,63,0.18);
          background: #DDD8CB;
          position: relative;
          z-index: 10;
          padding: 1.4rem 2.4rem;
        }

        .team-tier-nav {
          max-width: 1600px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 1.2rem;
          flex-wrap: wrap;
        }

        .team-tier-label {
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: #81663F;
          margin-right: 0.6rem;
        }

        .team-tier-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.75rem 1.6rem;
          border-radius: 9999px;
          border: 1px solid rgba(129,102,63,0.25);
          background: #FFFFFF;
          color: #1C1917;
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .team-tier-btn:hover {
          border-color: #81663F;
          color: #81663F;
          transform: translateY(-1px);
        }

        .team-tier-btn.active {
          background: linear-gradient(135deg, #D4B67D 0%, #C8A96E 40%, #B38E46 100%);
          border-color: #B38E46;
          color: #FFFFFF;
          box-shadow: 0 4px 14px rgba(184, 147, 85, 0.35);
        }

        .team-tier-count {
          font-size: 1rem;
          background: rgba(0,0,0,0.08);
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
          font-weight: 700;
        }
        .team-tier-btn.active .team-tier-count {
          background: rgba(255,255,255,0.25);
          color: #FFFFFF;
        }

        /* ── Department Sub Filter Navigation ── */
        .team-dept-nav-wrapper {
          border-bottom: 1px solid rgba(129,102,63,0.18);
          background: #E6E2D8;
          padding: 1.2rem 2.4rem;
        }

        .team-dept-nav {
          max-width: 1600px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .team-dept-label {
          font-size: 1.05rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #81663F;
          margin-right: 0.4rem;
        }

        .team-dept-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 1.2rem;
          border-radius: 8px;
          border: 1px solid rgba(0,0,0,0.12);
          background: #FFFFFF;
          color: #333333;
          font-size: 1.15rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .team-dept-btn:hover {
          border-color: #81663F;
          color: #81663F;
        }

        .team-dept-btn.active {
          background: #81663F;
          border-color: #81663F;
          color: #FFFFFF;
        }

        .team-dept-count {
          font-size: 0.95rem;
          background: rgba(0,0,0,0.06);
          padding: 0.15rem 0.5rem;
          border-radius: 999px;
        }
        .team-dept-btn.active .team-dept-count {
          background: rgba(255,255,255,0.22);
          color: #FFFFFF;
        }

        /* ── Team Grid Layout ── */
        .team-grid-container {
          max-width: 1600px;
          margin: 0 auto;
          padding: 4rem 2.4rem 6rem;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 3rem;
        }

        @media (min-width: 640px) {
          .team-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2.5rem;
          }
        }

        @media (min-width: 1024px) {
          .team-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 3rem;
          }
        }

        .team-card {
          background: #FFFFFF;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          border: 1px solid rgba(129,102,63,0.15);
          display: flex;
          flex-direction: column;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .team-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.08);
          border-color: #C8A96E;
        }

        .team-card--leadership {
          border: 2px solid rgba(200, 169, 110, 0.4);
        }

        .team-card__fig-wrapper {
          position: relative;
          width: 100%;
          padding-top: 115%;
          background: #151824;
          overflow: hidden;
        }

        .team-card__fig {
          position: absolute;
          inset: 0;
        }

        .team-card__category-badge {
          position: absolute;
          bottom: 1.2rem;
          left: 1.2rem;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(8px);
          color: #81663F;
          font-size: 1.05rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          padding: 0.4rem 1rem;
          border-radius: 6px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        }

        .team-card__caption-code {
          font-size: 1.2rem;
          font-weight: 800;
          background: rgba(129,102,63,0.1);
          color: #81663F;
          padding: 0.3rem 0.7rem;
          border-radius: 4px;
          margin-right: 0.4rem;
        }

        .team-card__caption-num {
          font-size: 1.2rem;
          font-weight: 800;
          color: #8A8279;
        }

        .team-member-social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          background: #FAF9F6;
          border: 1px solid #D8D0BE;
          color: #81663F;
          transition: all 0.2s ease;
        }

        .team-member-social-icon:hover {
          background: #81663F;
          color: #FFFFFF;
          border-color: #81663F;
          transform: translateY(-2px);
        }

        /* ── Join Team Section ── */
        .team-join-section {
          background: #DDD8CB;
          border-top: 1px solid rgba(129,102,63,0.2);
          padding: 6rem 2.4rem;
          text-align: center;
        }

        .team-join-title {
          font-weight: 800;
          color: #81663F;
          margin-bottom: 3rem;
          letter-spacing: -0.02em;
          line-height: 1.15;
          text-transform: uppercase;
        }

        .team-join-title.size-small { font-size: clamp(2.4rem, 4vw, 3.6rem); }
        .team-join-title.size-medium { font-size: clamp(3rem, 5.5vw, 5.2rem); }
        .team-join-title.size-large { font-size: clamp(3.6rem, 7vw, 7rem); }

        .team-join-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.2rem;
        }

        .team-join-circle-icon {
          width: 3.2rem;
          height: 3.2rem;
          border-radius: 50%;
          border: 2px solid #81663F;
          color: #81663F;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.4rem;
        }

        .team-join-hours {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1C1917;
        }

        .team-join-contacts {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
          font-size: 1.4rem;
        }

        .team-join-link {
          color: #81663F;
          font-weight: 700;
          text-decoration: underline;
        }

        .team-join-address {
          color: rgba(0,0,0,0.65);
          font-size: 1.3rem;
          margin-top: 0.8rem;
          max-width: 50rem;
        }
      `}</style>
    </div>
  );
}
