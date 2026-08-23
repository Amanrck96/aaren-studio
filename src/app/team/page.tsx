"use client";

import { useEffect, useState } from "react";

const INITIAL_DEFAULT_TEAM = [
  { id: "tm-01", name: "MOHANLAL MP", role: "Founder", category: "Leadership", code: "MM", num: "01", image: "https://www.aarenintpro.com/wp-content/uploads/2016/08/about-us-4-min.jpg", phone: "+91 88844 64444", bio: "He is the face and voice of AAREN. The face that represents AAREN, the voice that tells the story of AAREN. He guides AAREN by guiding its culture, values and the well being of the team.", sequenceNumber: 1 },
  { id: "tm-02", name: "Late RAMNIKLAL M VAGADIYA", role: "Founder & Chairman", category: "Leadership", code: "RV", num: "02", image: "https://www.aarenintpro.com/wp-content/uploads/2016/08/about-us-6-min.jpg", phone: "+91 88844 64444", bio: "A chartered accountant who is the backbone of the organization. He keeps the business focused, motivated, and sets concrete business plans for the team to achieve its vision.", sequenceNumber: 2 },
  { id: "tm-03", name: "MADHUSUDHAN MP", role: "Envisioner & Chief Planner", category: "Leadership", code: "MP", num: "03", image: "https://www.aarenintpro.com/wp-content/uploads/2016/08/about-us-2-min.jpg", phone: "+91 88844 64444", bio: "He is the vision of AAREN. Responsible for creating the strategy, driving the business and scouting for world class products.", sequenceNumber: 3 },
  { id: "tm-04", name: "KOUSHIK", role: "Director", category: "Leadership", code: "KS", num: "04", image: "https://www.aarenintpro.com/wp-content/uploads/2016/08/about-us-1-min.jpg", phone: "+91 88844 64444", bio: "Directs client solutions, space optimization, and luxury architectural interior curation across premium projects.", sequenceNumber: 4 },
  { id: "tm-05", name: "ASHWIN", role: "Director", category: "Leadership", code: "AW", num: "05", image: "https://www.aarenintpro.com/wp-content/uploads/2016/08/about-us-3-min.jpg", phone: "+91 88844 64444", bio: "Directs architectural partnerships, surface technology consulting, developer alliances, and luxury material innovation.", sequenceNumber: 5 },
  { id: "tm-06", name: "MUKUND", role: "Director", category: "Leadership", code: "MK", num: "06", image: "https://www.aarenintpro.com/wp-content/uploads/2016/08/about-us-5-min.jpg", phone: "+91 88844 64444", bio: "Directs world-class brand curation, premium material experiences, and state-of-the-art gallery displays.", sequenceNumber: 6 },
  { id: "tm-07", name: "JIGNESH", role: "Director", category: "Leadership", code: "JG", num: "07", image: "https://www.aarenintpro.com/wp-content/uploads/2016/08/about-us-7-min.jpg", phone: "+91 88844 64444", bio: "Directs strategic channel operations, Bagno & Surface architectural solutions, and pan-India client relations.", sequenceNumber: 7 },
  { id: "tm-08", name: "SURESH KUMAR", role: "Operations Head", category: "Operations", code: "SK", num: "08", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80", phone: "+91 88844 64444", bio: "Oversees supply chain, warehouse inventory, logistics, and smooth project timeline executions across all client sites.", sequenceNumber: 8 },
  { id: "tm-09", name: "PRAVEEN NAIR", role: "Lead Installation Specialist", category: "Installation", code: "PN", num: "09", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80", phone: "+91 88844 64444", bio: "Expert technician directing site measurements, precision zero-joint tile fitting, and high-end surface installations.", sequenceNumber: 9 },
  { id: "tm-10", name: "ANITHA REDDY", role: "Client Support & Relations", category: "Support Staff", code: "AR", num: "10", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80", phone: "+91 88844 64444", bio: "Coordinates post-installation support, warranty assistance, client inquiries, and ensures customer satisfaction.", sequenceNumber: 10 },
  { id: "tm-11", name: "HARSHITHA N", role: "Sales Executive", category: "Sales", code: "HN", num: "11", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80", phone: "+91 88844 64444", bio: "Dedicated sales professional specializing in luxury surface presentations and client consultations.", sequenceNumber: 11 },
  { id: "tm-12", name: "VISHWAS GEORGE", role: "Sales Consultant", category: "Sales", code: "VG", num: "12", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80", phone: "+91 88844 64444", bio: "Experienced consultant guiding clients through premium architectural product selections.", sequenceNumber: 12 },
  { id: "tm-13", name: "PRASHANTH M S", role: "Technical Support Staff", category: "Support Staff", code: "PM", num: "13", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80", phone: "+91 88844 64444", bio: "Provides comprehensive after-sales support and technical assistance to clients.", sequenceNumber: 13 },
  { id: "tm-14", name: "LOKESH G V", role: "Client Support Staff", category: "Support Staff", code: "LG", num: "14", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80", phone: "+91 88844 64444", bio: "Ensures seamless client experience through dedicated support and coordination.", sequenceNumber: 14 },
  { id: "tm-15", name: "KISHORE P", role: "Accounts & Finance Support", category: "Support Staff", code: "KP", num: "15", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80", phone: "+91 88844 64444", bio: "Manages financial operations, billing, and accounts to ensure smooth business transactions.", sequenceNumber: 15 },
  { id: "tm-16", name: "NARASIMHA PRASAD B S", role: "Sales Executive", category: "Sales", code: "NP", num: "16", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80", phone: "+91 88844 64444", bio: "Proactive sales executive focused on building client relationships and driving revenue growth.", sequenceNumber: 16 },
  { id: "tm-17", name: "ROOPA C B", role: "Accounts & Support Executive", category: "Support Staff", code: "RC", num: "17", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80", phone: "+91 88844 64444", bio: "Handles financial records, invoicing, and accounting processes with precision and accuracy.", sequenceNumber: 17 },
  { id: "tm-18", name: "ABDUL REHMAN KHAN", role: "Sales Executive", category: "Sales", code: "AR", num: "18", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80", phone: "+91 88844 64444", bio: "Dynamic sales professional with expertise in luxury material presentations and client engagement.", sequenceNumber: 18 },
  { id: "tm-19", name: "UTKALIKA NAYAK", role: "Sales Executive", category: "Sales", code: "UN", num: "19", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80", phone: "+91 88844 64444", bio: "Result-oriented sales professional dedicated to delivering exceptional client experiences.", sequenceNumber: 19 },
  { id: "tm-20", name: "AMBUJA MATHAPATI", role: "Sales Executive", category: "Sales", code: "AM", num: "20", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80", phone: "+91 88844 64444", bio: "Passionate about connecting clients with world-class architectural solutions.", sequenceNumber: 20 },
  { id: "tm-21", name: "SAWAN VISHWAKARMA", role: "Operations Executive", category: "Operations", code: "SV", num: "21", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80", phone: "+91 88844 64444", bio: "Manages day-to-day operational workflows ensuring timely delivery and project coordination.", sequenceNumber: 21 },
  { id: "tm-22", name: "D S SHANKAR", role: "Operations Coordinator", category: "Operations", code: "DS", num: "22", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80", phone: "+91 88844 64444", bio: "Coordinates operational activities and logistics to maintain smooth project execution.", sequenceNumber: 22 },
  { id: "tm-23", name: "JABIR KHAN", role: "Operations Logistics", category: "Operations", code: "JK", num: "23", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80", phone: "+91 88844 64444", bio: "Supports operations with efficient handling and coordination of project requirements.", sequenceNumber: 23 },
  { id: "tm-24", name: "NARASIMHA RAJU", role: "Accountant", category: "Support Staff", code: "NR", num: "24", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80", phone: "+91 88844 64444", bio: "Manages financial records and supports the accounts team with diligent accounting operations", sequenceNumber: 24 },
];

const DEPARTMENTS_ORDER = [
  "Sales",
  "Operations",
  "Installation",
  "Support Staff",
];

function normalizeCategory(m: any): string {
  const cat = (m.category || "").trim();
  const catLower = cat.toLowerCase();
  const nameLower = (m.name || "").toLowerCase();
  const desigLower = (m.designation || m.role || "").toLowerCase();
  const codeLower = (m.memberCode || "").toLowerCase();

  // Leadership check
  if (
    catLower === "leadership" ||
    catLower.includes("leader") ||
    desigLower.includes("founder") ||
    desigLower.includes("chairman") ||
    desigLower.includes("director") ||
    desigLower.includes("envisioner") ||
    desigLower.includes("chief planner") ||
    nameLower.includes("mohanlal") ||
    nameLower.includes("ramniklal") ||
    nameLower.includes("madhusudhan") ||
    nameLower.includes("koushik") ||
    nameLower.includes("kou shik") ||
    nameLower.includes("ashwin") ||
    nameLower.includes("mukund") ||
    nameLower.includes("jignesh") ||
    codeLower.startsWith("mm") ||
    codeLower.startsWith("rv") ||
    codeLower.startsWith("mp") ||
    codeLower.startsWith("ks") ||
    codeLower.startsWith("aw") ||
    codeLower.startsWith("mk") ||
    codeLower.startsWith("jg")
  ) {
    return "Leadership";
  }

  // Installation check
  if (catLower.includes("install") || desigLower.includes("install") || nameLower.includes("praveen")) {
    return "Installation";
  }

  // Operations check
  if (
    catLower.includes("operation") ||
    desigLower.includes("operation") ||
    desigLower.includes("logistics") ||
    nameLower.includes("suresh") ||
    nameLower.includes("sawan") ||
    nameLower.includes("shankar") ||
    nameLower.includes("jabir")
  ) {
    return "Operations";
  }

  // Support Staff & Accounts check (All 6 members)
  if (
    catLower.includes("support") ||
    catLower.includes("account") ||
    desigLower.includes("support") ||
    desigLower.includes("relations") ||
    desigLower.includes("account") ||
    desigLower.includes("finance") ||
    nameLower.includes("anitha") ||
    nameLower.includes("prashanth") ||
    nameLower.includes("lokesh") ||
    nameLower.includes("kishore") ||
    nameLower.includes("roopa") ||
    nameLower.includes("raju")
  ) {
    return "Support Staff";
  }

  return "Sales";
}

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<any[]>(INITIAL_DEFAULT_TEAM);
  const [activeMainView, setActiveMainView] = useState<"LEADERSHIP" | "TEAM">("LEADERSHIP");
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
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
            const sorted = [...list].sort((a: any, b: any) => (a.sequenceNumber ?? 999) - (b.sequenceNumber ?? 999));
            setTeamMembers(
              sorted.map((m: any, idx: number) => {
                const cat = normalizeCategory(m);
                return {
                  id: m.id || `tm-${idx + 1}`,
                  name: m.name,
                  role: m.designation || m.role || "Team Member",
                  category: cat,
                  code: m.memberCode ? m.memberCode.split(" ")[0] : (cat === "Leadership" ? "MM" : "TM"),
                  num: m.memberCode && m.memberCode.split(" ")[1] ? m.memberCode.split(" ")[1] : String(m.sequenceNumber || idx + 1).padStart(2, "0"),
                  image: m.photoUrl || m.image || "",
                  bio: m.bio || "",
                  phone: m.phone || "",
                  sequenceNumber: m.sequenceNumber ?? idx + 1,
                };
              })
            );
          }
          if (json.joinBanner || (json.data && json.data.joinBanner)) {
            setJoinBanner(json.joinBanner || json.data.joinBanner);
          }
        }
      })
      .catch((e) => console.error(e));
  }, []);

  const leadershipMembers = teamMembers.filter((m) => m.category === "Leadership");
  const nonLeadershipMembers = teamMembers.filter((m) => m.category !== "Leadership");

  // Collect unique non-leadership departments in specified order
  const presentDepartments = Array.from(new Set(nonLeadershipMembers.map((m) => m.category)));
  const orderedDepartments = [
    ...DEPARTMENTS_ORDER.filter((d) => presentDepartments.includes(d)),
    ...presentDepartments.filter((d) => !DEPARTMENTS_ORDER.includes(d)),
  ];

  const renderCard = (member: any, idx: number) => (
    <div
      key={member.id || member.name + idx}
      className="team-card"
      onClick={() => setSelectedMember(member)}
      style={{ cursor: "pointer" }}
    >
      <div className="team-card__fig-wrapper">
        <div className="team-card__fig">
          {member.image ? (
            <img
              src={member.image}
              alt={member.name}
              className="team-card__img"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="team-card__placeholder">
              {member.name
                ? member.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()
                : "AA"}
            </div>
          )}
        </div>
        {/* Category Pill Overlay */}
        <div className="team-card__category-badge">
          {member.category}
        </div>
      </div>

      <div className="team-card__caption">
        <div className="team-card__caption-left">
          <h2 className="team-card__caption-name">{member.name}</h2>
          <p className="team-card__caption-role">{member.role}</p>
        </div>
        <div className="team-card__caption-right">
          <span className="team-card__caption-code">{member.code}</span>
          <span className="team-card__caption-num">{member.num}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="team-page">
      {/* ── Page Header ── */}
      <div className="team-header">
        <div className="team-header__inner">
          <div className="team-header__meta t-tag">
            MEET THE TEAM
          </div>
          <h1 className="team-header__title">OUR TEAM</h1>
          <p className="team-header__desc t-body">
            Aaren Intpro is built by a family of dedicated professionals across Leadership, Sales, Operations, Installation, and Support Staff, united by a common passion for luxury spatial design.
          </p>
        </div>
      </div>

      {/* ── Only Two Buttons: LEADERSHIP and TEAM ── */}
      <div className="team-category-nav-wrapper">
        <div className="team-category-nav">
          <span className="team-category-label">DEPARTMENTS:</span>
          <button
            type="button"
            onClick={() => setActiveMainView("LEADERSHIP")}
            className={`team-cat-btn ${activeMainView === "LEADERSHIP" ? "active" : ""}`}
          >
            <span>LEADERSHIP</span>
            <span className="team-cat-count">{leadershipMembers.length}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMainView("TEAM")}
            className={`team-cat-btn ${activeMainView === "TEAM" ? "active" : ""}`}
          >
            <span>TEAM</span>
            <span className="team-cat-count">{nonLeadershipMembers.length}</span>
          </button>
        </div>
      </div>

      {/* ── Main Content Container ── */}
      <div className="team-grid-container">
        {activeMainView === "LEADERSHIP" && (
          <div className="team-grid">
            {leadershipMembers.map((member, idx) => renderCard(member, idx))}
          </div>
        )}

        {/* ── All Departments Displayed on ONE Page Sequentially (Without sub-tabs) ── */}
        {activeMainView === "TEAM" && (
          <div className="team-departments-wrapper">
            {orderedDepartments.map((dept) => {
              const deptMembers = nonLeadershipMembers.filter(
                (m) => (m.category || "").toLowerCase() === dept.toLowerCase()
              );
              if (deptMembers.length === 0) return null;

              return (
                <section key={dept} className="team-department-section">
                  <div className="team-department-header">
                    <h3 className="team-department-title">
                      {dept.toUpperCase()}{" "}
                      <span className="team-department-count">({deptMembers.length})</span>
                    </h3>
                    <div className="team-department-line" />
                  </div>
                  <div className="team-grid">
                    {deptMembers.map((member, idx) => renderCard(member, idx))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Modal Pop-up for Member Details ── */}
      {selectedMember && (
        <div
          className="team-modal-backdrop"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="team-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMember(null)}
              className="team-modal-close"
              aria-label="Close modal"
            >
              ✕
            </button>

            <div className="team-modal-photo-wrapper">
              {selectedMember.image ? (
                <img
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  className="team-modal-photo"
                />
              ) : (
                <div className="team-modal-placeholder">
                  {selectedMember.name ? selectedMember.name.substring(0, 2).toUpperCase() : "AA"}
                </div>
              )}
            </div>

            <div className="team-modal-body">
              <div className="team-modal-header-row">
                <div>
                  <h3 className="team-modal-name">{selectedMember.name}</h3>
                  <p className="team-modal-role">{selectedMember.role}</p>
                </div>
                <div className="team-modal-codes">
                  <span className="team-modal-code-main">{selectedMember.code}</span>
                  <span className="team-modal-code-sub">{selectedMember.num}</span>
                </div>
              </div>

              {selectedMember.bio && (
                <p className="team-modal-bio">{selectedMember.bio}</p>
              )}

              {selectedMember.phone && (
                <div className="team-modal-contact-row">
                  <span className="team-modal-contact-label">Contact:</span>
                  <a href={`tel:${selectedMember.phone}`} className="team-modal-contact-link">
                    📞 {selectedMember.phone}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Team Join Section ── */}
      <section className="team-join-section">
        <h2 className={`team-join-title size-${joinBanner.fontSize || "medium"}`}>
          {joinBanner.title}
        </h2>
        <div className="team-join-info">
          <div className="team-join-circle-icon">i</div>
          {joinBanner.hoursText && <p className="team-join-hours">{joinBanner.hoursText}</p>}
          <div className="team-join-contacts">
            {joinBanner.phone && (
              <a href={`tel:${joinBanner.phone.replace(/[^0-9+]/g, "")}`} className="team-join-link">
                {joinBanner.phone}
              </a>
            )}
            {joinBanner.email && (
              <a href={`mailto:${joinBanner.email}`} className="team-join-link">
                {joinBanner.email}
              </a>
            )}
            {joinBanner.address && <div className="team-join-address">{joinBanner.address}</div>}
          </div>
        </div>
      </section>

      {/* ── Scoped Styling Restoring the Older Layout & Proportions ── */}
      <style>{`
        .team-page {
          background: #FAF9F6;
          color: #111;
          min-height: 100vh;
        }

        /* ── Header ── */
        .team-header {
          padding: 12rem 2.4rem 3.5rem;
          max-width: 1600px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .team-header {
            padding: 9rem 1.6rem 2.5rem;
          }
        }

        .team-header__meta {
          color: #81663F;
          font-weight: 700;
          letter-spacing: 0.14em;
          margin-bottom: 1.2rem;
          font-size: 1.3rem;
          text-transform: uppercase;
        }

        .team-header__title {
          color: #81663F;
          font-size: clamp(3.6rem, 6vw, 6.4rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 1.6rem;
          line-height: 1.05;
        }

        .team-header__desc {
          color: rgba(0,0,0,0.65);
          max-width: 58rem;
          font-size: 1.6rem;
          line-height: 1.6;
        }

        /* ── Sub Categories / Departments Nav Bar ── */
        .team-category-nav-wrapper {
          padding: 1.5rem 2.4rem 2rem;
          max-width: 1600px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .team-category-nav-wrapper {
            padding: 1rem 1.6rem 1.5rem;
          }
        }

        .team-category-nav {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .team-category-nav {
            flex-wrap: nowrap;
            overflow-x: auto;
            padding-bottom: 0.5rem;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .team-category-nav::-webkit-scrollbar {
            display: none;
          }
        }

        .team-category-label {
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: #81663F;
          margin-right: 0.8rem;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .team-cat-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.75rem 1.6rem;
          border-radius: 9999px;
          border: 1px solid rgba(129,102,63,0.25);
          background: #FAF9F6;
          color: #222;
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: all 0.25s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .team-cat-btn:hover {
          border-color: #81663F;
          color: #81663F;
          transform: translateY(-1px);
        }

        .team-cat-btn.active {
          background: #81663F;
          color: #fff;
          border-color: #81663F;
          box-shadow: 0 4px 14px rgba(129, 102, 63, 0.25);
        }

        .team-cat-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.06);
          color: inherit;
          padding: 0.15rem 0.65rem;
          border-radius: 9999px;
          font-size: 1.05rem;
          font-weight: 800;
        }

        .team-cat-btn.active .team-cat-count {
          background: rgba(255,255,255,0.25);
          color: #fff;
        }

        /* ── Departments Organized Sections ── */
        .team-departments-wrapper {
          display: flex;
          flex-direction: column;
          gap: 5rem;
          padding-bottom: 8rem;
        }

        .team-department-section {
          display: flex;
          flex-direction: column;
        }

        .team-department-header {
          display: flex;
          align-items: center;
          gap: 1.8rem;
          margin-bottom: 2.5rem;
          padding: 0 2.4rem;
        }

        @media (max-width: 768px) {
          .team-department-header {
            padding: 0 1.6rem;
            margin-bottom: 1.8rem;
          }
        }

        .team-department-title {
          font-size: 2rem;
          font-weight: 800;
          color: #81663F;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin: 0;
          white-space: nowrap;
        }

        .team-department-count {
          font-size: 1.5rem;
          color: rgba(129,102,63,0.6);
          font-weight: 700;
          margin-left: 0.4rem;
        }

        .team-department-line {
          flex: 1;
          height: 1px;
          background: rgba(129,102,63,0.2);
        }

        /* ── Team Grid with Older Layout Spacing & Card Dimensions ── */
        .team-grid-container {
          max-width: 1600px;
          margin: 0 auto;
        }

        .team-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 4rem 2.4rem;
          padding: 1.5rem 2.4rem 6rem;
        }

        @media (min-width: 768px) {
          .team-grid {
            grid-template-columns: repeat(2, 1fr);
            padding: 2rem 2.4rem 6rem;
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
          background: #E6E2D8;
          border: 0.1rem solid rgba(129, 102, 63, 0.2);
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
          width: 100%;
          height: 100%;
        }

        .team-card__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 15%;
          filter: grayscale(100%);
          transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.4s ease;
          display: block;
        }

        .team-card:hover .team-card__img {
          transform: scale(1.04);
          filter: grayscale(0%);
        }

        .team-card__placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #1e2230 0%, #0b0c10 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #81663F;
          font-size: 4rem;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        .team-card__category-badge {
          position: absolute;
          top: 1.2rem;
          right: 1.2rem;
          z-index: 2;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          color: #d4af37;
          border: 1px solid rgba(212, 175, 55, 0.4);
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.4rem 1rem;
          border-radius: 4px;
        }

        .team-card__caption {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1.6rem;
          padding: 1.6rem 2.4rem;
          background: #FAF9F6;
          border-top: 1px solid rgba(129,102,63,0.12);
          transition: background 0.25s ease;
        }

        .team-card:hover .team-card__caption {
          background: #F2EFE8;
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
          line-height: 1.1;
          text-transform: uppercase;
          color: #81663F;
          margin: 0;
        }

        .team-card__caption-role {
          font-size: 1.1rem;
          color: rgba(0,0,0,0.5);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin: 0;
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
          color: #81663F;
        }

        .team-card__caption-num {
          font-size: 2.6rem;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1;
          color: rgba(129,102,63,0.35);
        }

        /* ── Modal Pop-up ── */
        .team-modal-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(6px);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .team-modal-content {
          background-color: #FAF9F6;
          border: 1px solid rgba(129, 102, 63, 0.3);
          border-radius: 8px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .team-modal-close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: rgba(0,0,0,0.6);
          border: none;
          border-radius: 50%;
          width: 3.2rem;
          height: 3.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          cursor: pointer;
          z-index: 10;
          color: #fff;
          font-weight: bold;
          transition: background 0.2s ease;
        }

        .team-modal-close:hover {
          background: rgba(0,0,0,0.85);
        }

        .team-modal-photo-wrapper {
          position: relative;
          width: 100%;
          height: 32rem;
          background: #111;
        }

        .team-modal-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 15%;
          display: block;
        }

        .team-modal-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #1e2230 0%, #0b0c10 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #81663F;
          font-size: 5rem;
          font-weight: 800;
        }

        .team-modal-body {
          padding: 2.8rem 2.4rem;
        }

        .team-modal-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.6rem;
          gap: 1.6rem;
        }

        .team-modal-name {
          font-size: 2.2rem;
          font-weight: 800;
          color: #81663F;
          text-transform: uppercase;
          margin: 0;
        }

        .team-modal-role {
          font-size: 1.3rem;
          color: rgba(0,0,0,0.6);
          text-transform: uppercase;
          margin: 0.4rem 0 0;
          font-weight: 600;
        }

        .team-modal-codes {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .team-modal-code-main {
          font-size: 2.8rem;
          font-weight: 800;
          color: #81663F;
        }

        .team-modal-code-sub {
          font-size: 2.4rem;
          font-weight: 800;
          color: rgba(129,102,63,0.35);
        }

        .team-modal-bio {
          font-size: 1.4rem;
          line-height: 1.7;
          color: rgba(0,0,0,0.75);
          margin: 0 0 2rem;
        }

        .team-modal-contact-row {
          border-top: 1px solid rgba(129,102,63,0.15);
          padding-top: 1.6rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .team-modal-contact-label {
          font-size: 1.3rem;
          color: #81663F;
          font-weight: 700;
        }

        .team-modal-contact-link {
          font-size: 1.35rem;
          color: #222;
          text-decoration: none;
          font-weight: 600;
        }

        /* ── Team Join Section ── */
        .team-join-section {
          padding: 6rem 2.4rem;
          background: #FAF9F6;
          border-top: 1px solid rgba(129,102,63,0.18);
          text-align: center;
        }

        .team-join-title {
          color: #81663F;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.25;
          text-transform: uppercase;
          margin: 0 auto 2.5rem;
          max-width: 900px;
        }

        .team-join-title.size-small {
          font-size: clamp(1.6rem, 3vw, 2.2rem);
        }

        .team-join-title.size-medium {
          font-size: clamp(2rem, 3.8vw, 3rem);
        }

        .team-join-title.size-large {
          font-size: clamp(2.6rem, 5vw, 4.2rem);
        }

        .team-join-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.6rem;
        }

        .team-join-circle-icon {
          width: 3.6rem;
          height: 3.6rem;
          border-radius: 50%;
          border: 1px solid #81663F;
          color: #81663F;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: Georgia, serif;
          font-style: italic;
          font-size: 1.8rem;
          font-weight: 700;
        }

        .team-join-hours {
          font-size: 1.4rem;
          color: rgba(0,0,0,0.6);
          font-weight: 600;
          margin: 0;
        }

        .team-join-contacts {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.8rem;
        }

        .team-join-link {
          font-size: 1.6rem;
          color: #81663F;
          font-weight: 700;
          text-decoration: none;
          transition: opacity 0.2s ease;
        }

        .team-join-link:hover {
          opacity: 0.8;
        }

        .team-join-address {
          font-size: 1.2rem;
          color: rgba(0,0,0,0.45);
          letter-spacing: 0.05em;
          margin-top: 0.8rem;
          max-width: 500px;
        }
      `}</style>
    </div>
  );
}
