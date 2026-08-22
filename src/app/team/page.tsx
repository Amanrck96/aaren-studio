"use client";

import { useEffect, useState } from "react";

const INITIAL_DEFAULT_TEAM = [
  { id: "tm-01", name: "MOHANLAL MP", role: "Founder", category: "Leadership", code: "MM", num: "01", image: "https://www.aarenintpro.com/wp-content/uploads/2016/08/about-us-4-min.jpg", phone: "+91 88844 64444", bio: "He is the face and voice of AAREN. The face that represents AAREN, the voice that tells the story of AAREN. He guides AAREN by guiding its culture, values and the well being of the team.", sequenceNumber: 1 },
  { id: "tm-02", name: "RAMNIKLAL M VAGADIYA", role: "Founder & Chairman", category: "Leadership", code: "RV", num: "02", image: "https://www.aarenintpro.com/wp-content/uploads/2016/08/about-us-6-min.jpg", phone: "+91 88844 64444", bio: "A chartered accountant who is the backbone of the organization. He keeps the business focused, motivated, and sets concrete business plans for the team to achieve its vision.", sequenceNumber: 2 },
  { id: "tm-03", name: "MADHUSUDHAN MP", role: "Envisioner & Chief Planner", category: "Leadership", code: "MP", num: "03", image: "https://www.aarenintpro.com/wp-content/uploads/2016/08/about-us-2-min.jpg", phone: "+91 88844 64444", bio: "He is the vision of AAREN. Responsible for creating the strategy, driving the business and scouting for world class products.", sequenceNumber: 3 },
  { id: "tm-04", name: "KOU SHIK", role: "Sales Specialist", category: "Sales", code: "KS", num: "04", image: "https://www.aarenintpro.com/wp-content/uploads/2016/08/about-us-1-min.jpg", phone: "+91 88844 64444", bio: "He guides customers to optimize space utility, is abreast with market trends, and coordinates layouts for luxury projects.", sequenceNumber: 4 },
  { id: "tm-05", name: "ASHWIN", role: "Architectural Sales Consultant", category: "Sales", code: "AW", num: "05", image: "https://www.aarenintpro.com/wp-content/uploads/2016/08/about-us-3-min.jpg", phone: "+91 88844 64444", bio: "Consults with architects and developers to find surface and material solutions, manages customer relations and outreach.", sequenceNumber: 5 },
  { id: "tm-06", name: "MUKUND", role: "Sales & Curation", category: "Sales", code: "MK", num: "06", image: "https://www.aarenintpro.com/wp-content/uploads/2016/08/about-us-5-min.jpg", phone: "+91 88844 64444", bio: "Curates the products, educates customers on the product mix and manages the store display.", sequenceNumber: 6 },
  { id: "tm-07", name: "JIGNESH", role: "Channel Sales Manager", category: "Sales", code: "JG", num: "07", image: "https://www.aarenintpro.com/wp-content/uploads/2016/08/about-us-7-min.jpg", phone: "+91 88844 64444", bio: "Maintains communication narratives, manages sales channels, and reaches out to clients for Bagno & Surface solutions.", sequenceNumber: 7 },
  { id: "tm-08", name: "SURESH KUMAR", role: "Operations Head", category: "Operations", code: "SK", num: "08", image: "", phone: "+91 88844 64444", bio: "Oversees supply chain, warehouse inventory, logistics, and smooth project timeline executions across all client sites.", sequenceNumber: 8 },
  { id: "tm-09", name: "PRAVEEN NAIR", role: "Lead Installation Specialist", category: "Installation", code: "PN", num: "09", image: "", phone: "+91 88844 64444", bio: "Expert technician directing site measurements, precision zero-joint tile fitting, and high-end surface installations.", sequenceNumber: 9 },
  { id: "tm-10", name: "ANITHA REDDY", role: "Client Support & Relations", category: "Support Staff", code: "AR", num: "10", image: "", phone: "+91 88844 64444", bio: "Coordinates post-installation support, warranty assistance, client inquiries, and ensures customer satisfaction.", sequenceNumber: 10 },
  { id: "tm-11", name: "HARSHITHA N", role: "Sales Executive", category: "Sales", code: "HN", num: "11", image: "", phone: "+91 88844 64444", bio: "Dedicated sales professional specializing in luxury surface presentations and client consultations.", sequenceNumber: 11 },
  { id: "tm-12", name: "VISHWAS GEORGE", role: "Sales Consultant", category: "Sales", code: "VG", num: "12", image: "", phone: "+91 88844 64444", bio: "Experienced consultant guiding clients through premium architectural product selections.", sequenceNumber: 12 },
  { id: "tm-13", name: "PRASHANTH M S", role: "Technical Support Staff", category: "Support Staff", code: "PM", num: "13", image: "", phone: "+91 88844 64444", bio: "Provides comprehensive after-sales support and technical assistance to clients.", sequenceNumber: 13 },
  { id: "tm-14", name: "LOKESH G V", role: "Client Support Staff", category: "Support Staff", code: "LG", num: "14", image: "", phone: "+91 88844 64444", bio: "Ensures seamless client experience through dedicated support and coordination.", sequenceNumber: 14 },
  { id: "tm-15", name: "KISHORE P", role: "Accounts & Finance Support", category: "Accounts", code: "KP", num: "15", image: "", phone: "+91 88844 64444", bio: "Manages financial operations, billing, and accounts to ensure smooth business transactions.", sequenceNumber: 15 },
  { id: "tm-16", name: "NARASIMHA PRASAD B S", role: "Sales Executive", category: "Sales", code: "NP", num: "16", image: "", phone: "+91 88844 64444", bio: "Proactive sales executive focused on building client relationships and driving revenue growth.", sequenceNumber: 16 },
  { id: "tm-17", name: "ROOPA C B", role: "Accounts & Support Executive", category: "Accounts", code: "RC", num: "17", image: "", phone: "+91 88844 64444", bio: "Handles financial records, invoicing, and accounting processes with precision and accuracy.", sequenceNumber: 17 },
  { id: "tm-18", name: "ABDUL REHMAN KHAN", role: "Sales Executive", category: "Sales", code: "AR", num: "18", image: "", phone: "+91 88844 64444", bio: "Dynamic sales professional with expertise in luxury material presentations and client engagement.", sequenceNumber: 18 },
  { id: "tm-19", name: "UTKALIKA NAYAK", role: "Sales Executive", category: "Sales", code: "UN", num: "19", image: "", phone: "+91 88844 64444", bio: "Result-oriented sales professional dedicated to delivering exceptional client experiences.", sequenceNumber: 19 },
  { id: "tm-20", name: "AMBUJA MATHAPATI", role: "Sales Executive", category: "Sales", code: "AM", num: "20", image: "", phone: "+91 88844 64444", bio: "Passionate about connecting clients with world-class architectural solutions.", sequenceNumber: 20 },
  { id: "tm-21", name: "SAWAN VISHWAKARMA", role: "Operations Executive", category: "Operations", code: "SV", num: "21", image: "", phone: "+91 88844 64444", bio: "Manages day-to-day operational workflows ensuring timely delivery and project coordination.", sequenceNumber: 21 },
  { id: "tm-22", name: "D S SHANKAR", role: "Operations Coordinator", category: "Operations", code: "DS", num: "22", image: "", phone: "+91 88844 64444", bio: "Coordinates operational activities and logistics to maintain smooth project execution.", sequenceNumber: 22 },
  { id: "tm-23", name: "JABIR KHAN", role: "Operations Logistics", category: "Operations", code: "JK", num: "23", image: "", phone: "+91 88844 64444", bio: "Supports operations with efficient handling and coordination of project requirements.", sequenceNumber: 23 },
  { id: "tm-24", name: "NARASIMHA RAJU", role: "Accountant", category: "Accounts", code: "NR", num: "24", image: "", phone: "+91 88844 64444", bio: "Manages financial records and supports the accounts team with diligent accounting operations", sequenceNumber: 24 },
];

const KNOWN_DEPARTMENTS = ["Sales", "Operations", "Installation", "Accounts", "Support Staff"];

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
    desigLower.includes("envisioner") ||
    desigLower.includes("chief planner") ||
    nameLower.includes("mohanlal") ||
    nameLower.includes("ramniklal") ||
    nameLower.includes("madhusudhan") ||
    codeLower.startsWith("mm") ||
    codeLower.startsWith("rv") ||
    codeLower.startsWith("mp")
  ) {
    return "Leadership";
  }

  // Accounts check
  if (
    catLower === "accounts" ||
    catLower === "accountant" ||
    catLower.includes("account") ||
    desigLower.includes("account") ||
    desigLower.includes("finance") ||
    nameLower.includes("raju") ||
    nameLower.includes("kishore") ||
    nameLower.includes("roopa")
  ) {
    return "Accounts";
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

  // Support Staff check
  if (
    catLower.includes("support") ||
    desigLower.includes("support") ||
    desigLower.includes("relations") ||
    nameLower.includes("anitha") ||
    nameLower.includes("prashanth") ||
    nameLower.includes("lokesh")
  ) {
    return "Support Staff";
  }

  return "Sales";
}

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<any[]>(INITIAL_DEFAULT_TEAM);
  const [view, setView] = useState<"leadership" | "team">("leadership");
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [selectedMember, setSelectedMember] = useState<any | null>(null);

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
        }
      })
      .catch((e) => console.error(e));
  }, []);

  const leadershipMembers = teamMembers.filter(
    (m) => m.category === "Leadership"
  );

  const nonLeadershipMembers = teamMembers.filter(
    (m) => m.category !== "Leadership"
  );

  // Collect all unique departments present in data
  const existingDepartments = Array.from(
    new Set(nonLeadershipMembers.map((m) => m.category))
  );

  // Order them nicely by KNOWN_DEPARTMENTS first, then any additional categories
  const orderedDepartments = [
    ...KNOWN_DEPARTMENTS.filter((d) => existingDepartments.includes(d)),
    ...existingDepartments.filter((d) => !KNOWN_DEPARTMENTS.includes(d)),
  ];

  return (
    <div className="aaren-team-wrapper">
      <main className="team-page-content">
        {/* ── Top Bar ── */}
        <header className="topbar">
          <div>
            <div className="eyebrow">AAREN INTPRO</div>
            <h1 id="page-heading">
              {view === "leadership" ? "Leadership." : "Team."}
            </h1>
          </div>
          <nav className="nav" aria-label="Team navigation">
            <button
              type="button"
              className={view === "leadership" ? "active" : ""}
              onClick={() => setView("leadership")}
            >
              Leadership
            </button>
            <button
              type="button"
              className={view === "team" ? "active" : ""}
              onClick={() => setView("team")}
            >
              Team
            </button>
          </nav>
        </header>

        {/* ── LEADERSHIP VIEW ── */}
        {view === "leadership" && (
          <section id="leadership" className="view active">
            <h2 className="section-title">Leadership</h2>
            <div className="people-grid">
              {leadershipMembers.map((member) => {
                const hasImage = Boolean(member.image) && !imageErrors[member.id];
                return (
                  <article
                    key={member.id || member.name}
                    className="person-card"
                    onClick={() => setSelectedMember(member)}
                  >
                    <div className={`person-photo ${!hasImage ? "img-fallback" : ""}`}>
                      {hasImage ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          onError={() =>
                            setImageErrors((prev) => ({ ...prev, [member.id]: true }))
                          }
                        />
                      ) : null}
                    </div>
                    <div className="person-info">
                      <div className="person-name">{member.name}</div>
                      <div className="person-role">{member.role}</div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* ── TEAM VIEW ── */}
        {view === "team" && (
          <section id="team" className="view active">
            {orderedDepartments.map((dept) => {
              const deptMembers = nonLeadershipMembers.filter((m) => m.category === dept);
              if (deptMembers.length === 0) return null;

              return (
                <section key={dept} className="department">
                  <div className="department-title">
                    <h3>{dept}</h3>
                  </div>
                  <div className="people-grid">
                    {deptMembers.map((member) => {
                      const hasImage = Boolean(member.image) && !imageErrors[member.id];
                      return (
                        <article
                          key={member.id || member.name}
                          className="person-card"
                          onClick={() => setSelectedMember(member)}
                        >
                          <div className={`person-photo ${!hasImage ? "img-fallback" : ""}`}>
                            {hasImage ? (
                              <img
                                src={member.image}
                                alt={member.name}
                                onError={() =>
                                  setImageErrors((prev) => ({ ...prev, [member.id]: true }))
                                }
                              />
                            ) : null}
                          </div>
                          <div className="person-info">
                            <div className="person-name">{member.name}</div>
                            <div className="person-role">{member.role}</div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </section>
        )}
      </main>

      {/* ── Optional Detail Modal for Member ── */}
      {selectedMember && (
        <div
          className="team-modal-overlay"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="team-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="team-modal-header-photo">
              {selectedMember.image && !imageErrors[selectedMember.id] ? (
                <img
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div className="team-modal-photo-placeholder">
                  {selectedMember.name ? selectedMember.name.substring(0, 2).toUpperCase() : "AA"}
                </div>
              )}
              <button
                type="button"
                className="team-modal-close-btn"
                onClick={() => setSelectedMember(null)}
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>
            <div className="team-modal-body">
              <div className="team-modal-topline">
                <div>
                  <h3 className="team-modal-name">{selectedMember.name}</h3>
                  <p className="team-modal-role">{selectedMember.role}</p>
                </div>
                {selectedMember.code && (
                  <div className="team-modal-codes">
                    <span className="team-modal-code-main">{selectedMember.code}</span>
                    <span className="team-modal-code-sub">{selectedMember.num}</span>
                  </div>
                )}
              </div>

              {selectedMember.bio && (
                <p className="team-modal-bio">{selectedMember.bio}</p>
              )}

              {selectedMember.phone && (
                <div className="team-modal-phone-row">
                  <a href={`tel:${selectedMember.phone}`} className="team-modal-phone-link">
                    📞 {selectedMember.phone}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Scoped Styling matching provided design ── */}
      <style>{`
        :root {
          --team-bg: #f7f5f0;
          --team-surface: #ffffff;
          --team-text: #171717;
          --team-muted: #77736c;
          --team-line: #d8d4cc;
          --team-accent: #9a8b72;
          --team-radius: 18px;
        }

        .aaren-team-wrapper {
          min-height: 100vh;
          background: var(--team-bg);
          color: var(--team-text);
          font-family: Inter, Arial, Helvetica, sans-serif !important;
          padding-top: 60px;
        }

        .team-page-content {
          width: min(1200px, 100%);
          margin: 0 auto;
          padding: 56px 48px 100px;
          box-sizing: border-box;
        }

        /* ---------- top bar ---------- */
        .topbar {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 24px;
          margin-bottom: 60px;
          padding-bottom: 28px;
          border-bottom: 1px solid var(--team-line);
        }

        .eyebrow {
          margin-bottom: 10px;
          color: var(--team-muted) !important;
          font-family: Inter, Arial, Helvetica, sans-serif !important;
          font-size: 12px !important;
          font-weight: 600 !important;
          letter-spacing: 0.18em !important;
          text-transform: uppercase !important;
        }

        .topbar h1 {
          font-family: Georgia, "Times New Roman", serif !important;
          font-size: clamp(38px, 5vw, 64px) !important;
          font-weight: 400 !important;
          line-height: 0.95 !important;
          letter-spacing: -0.04em !important;
          text-transform: none !important;
          color: var(--team-text) !important;
          margin: 0 !important;
        }

        .nav {
          display: inline-flex;
          gap: 6px;
          border: 1px solid var(--team-line);
          border-radius: 999px;
          padding: 4px;
          background: var(--team-surface);
        }

        .nav button {
          display: inline-flex;
          align-items: center;
          padding: 10px 22px;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: var(--team-muted) !important;
          cursor: pointer;
          font-family: Inter, Arial, Helvetica, sans-serif !important;
          font-size: 13px !important;
          font-weight: 600 !important;
          letter-spacing: 0.02em !important;
          transition: background 0.2s ease, color 0.2s ease;
        }

        .nav button:hover {
          color: var(--team-text) !important;
        }

        .nav button.active {
          background: var(--team-text) !important;
          color: var(--team-bg) !important;
        }

        /* ---------- views ---------- */
        .view {
          display: block;
        }

        .section-title {
          display: inline-flex;
          align-items: center;
          min-height: 54px;
          padding: 0 22px;
          border: 1px solid var(--team-text) !important;
          border-radius: 999px;
          margin-bottom: 42px;
          font-family: Georgia, "Times New Roman", serif !important;
          font-size: 24px !important;
          font-weight: 400 !important;
          text-transform: none !important;
          color: var(--team-text) !important;
        }

        .department {
          margin-bottom: 58px;
        }
        .department:last-child {
          margin-bottom: 0;
        }

        .department-title {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-bottom: 24px;
        }

        .department-title h3 {
          font-family: Georgia, "Times New Roman", serif !important;
          font-size: 29px !important;
          font-weight: 400 !important;
          letter-spacing: -0.025em !important;
          text-transform: none !important;
          color: var(--team-text) !important;
          margin: 0 !important;
        }

        .department-title::after {
          content: "";
          height: 1px;
          flex: 1;
          background: var(--team-line);
        }

        /* ---------- card grid ---------- */
        .people-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 30px 24px;
        }

        .person-card {
          min-width: 0;
          cursor: pointer;
          transition: transform 0.25s ease;
        }

        .person-card:hover {
          transform: translateY(-3px);
        }

        .person-photo {
          position: relative;
          width: 100%;
          aspect-ratio: 0.82;
          overflow: hidden;
          border: 1px solid var(--team-line);
          border-radius: var(--team-radius);
          background: linear-gradient(135deg, rgba(154, 139, 114, 0.14), rgba(255, 255, 255, 0.9));
        }

        .person-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }

        .person-card:hover .person-photo img {
          transform: scale(1.03);
        }

        /* shown automatically if a photo file isn't found yet */
        .person-photo.img-fallback {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .person-photo.img-fallback img {
          display: none;
        }

        .person-photo.img-fallback::after {
          content: "";
          width: 42%;
          height: 42%;
          background: rgba(23, 23, 23, 0.28);
          -webkit-mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/></svg>') center/contain no-repeat;
          mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/></svg>') center/contain no-repeat;
        }

        .person-info {
          padding-top: 13px;
        }

        .person-name {
          font-family: Inter, Arial, Helvetica, sans-serif !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          line-height: 1.25 !important;
          color: var(--team-text) !important;
          letter-spacing: normal !important;
          text-transform: none !important;
        }

        .person-role {
          margin-top: 4px;
          color: var(--team-muted) !important;
          font-family: Inter, Arial, Helvetica, sans-serif !important;
          font-size: 11px !important;
          line-height: 1.4 !important;
          letter-spacing: normal !important;
          text-transform: none !important;
        }

        /* Modal styling */
        .team-modal-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(6px);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .team-modal-box {
          background: #ffffff;
          border: 1px solid var(--team-line);
          border-radius: var(--team-radius);
          max-width: 520px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          display: flex;
          flex-direction: column;
        }

        .team-modal-header-photo {
          position: relative;
          height: 280px;
          background: linear-gradient(135deg, rgba(154, 139, 114, 0.18), rgba(255, 255, 255, 0.9));
        }

        .team-modal-photo-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          font-weight: 700;
          color: var(--team-accent);
        }

        .team-modal-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(0, 0, 0, 0.6);
          border: 0;
          color: #ffffff;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }

        .team-modal-close-btn:hover {
          background: rgba(0, 0, 0, 0.85);
        }

        .team-modal-body {
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .team-modal-topline {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
        }

        .team-modal-name {
          font-family: Georgia, "Times New Roman", serif !important;
          font-size: 24px !important;
          font-weight: 600 !important;
          color: var(--team-text) !important;
          margin: 0 !important;
          line-height: 1.2 !important;
          text-transform: none !important;
        }

        .team-modal-role {
          font-family: Inter, Arial, Helvetica, sans-serif !important;
          font-size: 13px !important;
          color: var(--team-muted) !important;
          font-weight: 500 !important;
          margin-top: 4px !important;
        }

        .team-modal-codes {
          text-align: right;
          font-family: Inter, Arial, Helvetica, sans-serif !important;
        }

        .team-modal-code-main {
          font-size: 20px;
          font-weight: 700;
          color: var(--team-accent);
        }

        .team-modal-code-sub {
          font-size: 18px;
          font-weight: 700;
          color: var(--team-muted);
          margin-left: 4px;
        }

        .team-modal-bio {
          font-family: Inter, Arial, Helvetica, sans-serif !important;
          font-size: 14px !important;
          line-height: 1.6 !important;
          color: #4a4742 !important;
          margin: 6px 0 0 !important;
        }

        .team-modal-phone-row {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--team-line);
        }

        .team-modal-phone-link {
          font-family: Inter, Arial, Helvetica, sans-serif !important;
          color: var(--team-text) !important;
          font-weight: 600 !important;
          text-decoration: none !important;
          font-size: 13px !important;
        }

        /* ---------- tablet ---------- */
        @media (max-width: 900px) {
          .team-page-content {
            padding: 44px 28px 80px;
          }
          .people-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 22px 16px;
          }
          .section-title {
            font-size: 21px !important;
            padding: 0 18px;
          }
        }

        /* ---------- mobile ---------- */
        @media (max-width: 680px) {
          .team-page-content {
            padding: 36px 18px 70px;
          }
          .topbar {
            align-items: flex-start;
          }
          .nav {
            width: 100%;
          }
          .nav button {
            flex: 1;
            justify-content: center;
          }
          .people-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 26px 14px;
          }
          .department-title h3 {
            font-size: 26px !important;
          }
        }

        @media (max-width: 420px) {
          .person-name {
            font-size: 13px !important;
          }
          .person-role {
            font-size: 10px !important;
          }
        }
      `}</style>
    </div>
  );
}
