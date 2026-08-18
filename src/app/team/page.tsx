"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const CATEGORIES = ["Leadership", "Sales", "Operations", "Installation", "Accounts", "Support Staff"];

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
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Leadership");
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
                  name: m.name,
                  role: m.designation || m.role || "Team Member",
                  category: cat,
                  code: m.memberCode ? m.memberCode.split(" ")[0] : (cat === "Leadership" ? "MM" : "TM"),
                  num: m.memberCode && m.memberCode.split(" ")[1] ? m.memberCode.split(" ")[1] : String(m.sequenceNumber || idx + 1).padStart(2, "0"),
                  image: m.photoUrl || m.image,
                  bio: m.bio,
                  phone: m.phone,
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
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const filteredMembers = teamMembers.filter(
    (m) => (m.category || "").toLowerCase().trim() === (activeCategory || "").toLowerCase().trim()
  );

  const getCategoryCount = (cat: string) => {
    return teamMembers.filter(
      (m) => (m.category || "").toLowerCase().trim() === cat.toLowerCase().trim()
    ).length;
  };

  return (
    <div className="team-page">
      {/* ── Page Header ── */}
      <div className="team-header">
        <div className="team-header__inner">
          <div className="team-header__meta t-tag" style={{ color: "#81663F", fontWeight: 700, letterSpacing: "0.12em", marginBottom: "1.6rem" }}>
            MEET THE TEAM
          </div>
          <h1 className="team-header__title" style={{ color: "#81663F" }}>OUR TEAM</h1>
          <p className="team-header__desc t-body" style={{ color: "rgba(0,0,0,0.65)", maxWidth: "58rem", fontSize: "1.6rem", lineHeight: 1.6 }}>
            Aaren Intpro is built by a family of dedicated professionals across Leadership, Sales, Operations, Installation, Accountant, and Support Staff, united by a common passion for luxury spatial design.
          </p>
        </div>
      </div>

      {/* ── Sub Category Filter Navigation Bar ── */}
      <div className="team-category-nav-wrapper">
        <div className="team-category-nav">
          <span className="team-category-label">SUB CATEGORIES:</span>
          {CATEGORIES.map((cat) => {
            const count = getCategoryCount(cat);
            const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`team-cat-btn ${isActive ? "active" : ""}`}
              >
                <span>{cat.toUpperCase()}</span>
                <span className="team-cat-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Team Grid ── */}
      <div className="team-grid-container">
        {filteredMembers.length === 0 ? (
          <div style={{ textAlign: "center", padding: "6rem 2rem", color: "rgba(0,0,0,0.5)", fontSize: "1.6rem" }}>
            No team members found in the <strong>{activeCategory}</strong> sub category.
          </div>
        ) : (
          <div className="team-grid">
            {filteredMembers.map((member) => (
              <div
                key={member.name}
                className="team-card"
                onClick={() => setSelectedMember(member)}
                style={{ cursor: "pointer" }}
              >
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
                      <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #1e2230 0%, #0b0c10 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#81663F", fontSize: "4rem", fontWeight: 800, letterSpacing: "0.05em" }}>
                        {member.name ? member.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase() : "AA"}
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
            ))}
          </div>
        )}
      </div>

      {/* ── Modal Pop-up for Member Details ── */}
      {selectedMember && (
        <div
          className="team-modal-backdrop"
          onClick={() => setSelectedMember(null)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <div
            className="team-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#E6E2D8",
              border: "1px solid #81663F",
              borderRadius: "0.8rem",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ position: "relative", height: "28rem", background: "#111" }}>
              {selectedMember.image ? (
                <Image
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  fill
                  style={{ objectFit: "cover", objectPosition: "center 10%", filter: "grayscale(100%)" }}
                />
              ) : (
                <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #1e2230 0%, #0b0c10 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#81663F", fontSize: "5rem", fontWeight: 800 }}>
                  {selectedMember.name ? selectedMember.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase() : "AA"}
                </div>
              )}
              <button
                onClick={() => setSelectedMember(null)}
                style={{
                  position: "absolute",
                  top: "1.2rem",
                  right: "1.2rem",
                  background: "rgba(0,0,0,0.7)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff",
                  width: "3.2rem",
                  height: "3.2rem",
                  borderRadius: "50%",
                  fontSize: "1.6rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: "2.4rem", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ fontSize: "2rem", fontWeight: 800, color: "#81663F", textTransform: "uppercase", margin: 0 }}>
                    {selectedMember.name}
                  </h3>
                  <p style={{ fontSize: "1.3rem", color: "rgba(0,0,0,0.6)", fontWeight: 600, margin: "0.4rem 0 0" }}>
                    {selectedMember.role}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "2.4rem", fontWeight: 800, color: "#81663F" }}>
                    {selectedMember.code}
                  </span>
                  <span style={{ fontSize: "2.2rem", fontWeight: 800, color: "rgba(129,102,63,0.4)", marginLeft: "0.4rem" }}>
                    {selectedMember.num}
                  </span>
                </div>
              </div>

              {selectedMember.bio && (
                <p style={{ fontSize: "1.35rem", lineHeight: 1.6, color: "rgba(0,0,0,0.7)", margin: "0.8rem 0 0" }}>
                  {selectedMember.bio}
                </p>
              )}

              {selectedMember.phone && (
                <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(129,102,63,0.2)" }}>
                  <a href={`tel:${selectedMember.phone}`} style={{ color: "#81663F", fontWeight: 700, textDecoration: "none", fontSize: "1.3rem" }}>
                    📞 {selectedMember.phone}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Call to Action Join Section ── */}
      <div className="team-join-section">
        <h2 className={`team-join-title size-${joinBanner.fontSize || "medium"}`}>
          {joinBanner.title}
        </h2>
        <div className="team-join-info">
          <div className="team-join-circle-icon">i</div>
          <p className="team-join-hours">{joinBanner.hoursText}</p>
          <div className="team-join-contacts">
            <a href={`tel:${joinBanner.phone.replace(/[^0-9+]/g, "")}`} className="team-join-link">{joinBanner.phone}</a>
            <a href={`mailto:${joinBanner.email}`} className="team-join-link">{joinBanner.email}</a>
            <p className="team-join-address">{joinBanner.address}</p>
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
          border-bottom: 0.1rem solid rgba(129, 102, 63, 0.2);
          text-align: left;
        }

        @media (min-width: 768px) {
          .team-header {
            padding: 8rem 2.4rem 5rem;
          }
        }

        .team-header__inner {
          max-width: 1600px;
          margin: 0 auto;
          display: block;
        }

        .team-header__title {
          font-size: clamp(6rem, 15vw, 22rem);
          font-weight: 700;
          letter-spacing: -0.05em;
          line-height: 0.88;
          text-transform: uppercase;
          color: #81663F;
          margin-bottom: 2.8rem;
          text-align: left;
        }

        .team-header__desc {
          font-size: 1.6rem;
          line-height: 1.6;
          color: rgba(0, 0, 0, 0.65);
          max-width: 56rem;
          text-align: left;
        }

        /* ── Sub Category Filter Navigation Bar ── */
        .team-category-nav-wrapper {
          border-bottom: 1px solid rgba(129,102,63,0.18);
          background: #E6E2D8;
          position: relative;
          z-index: 10;
          padding: 1.6rem 2.4rem;
          margin-top: 1rem;
        }

        @media (max-width: 768px) {
          .team-category-nav-wrapper {
            padding: 1rem 1.2rem;
          }
        }

        .team-category-nav {
          max-width: 1600px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 1.2rem;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .team-category-nav {
            flex-wrap: nowrap;
            overflow-x: auto;
            padding-bottom: 0.4rem;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .team-category-nav::-webkit-scrollbar {
            display: none;
          }
          .team-category-label {
            white-space: nowrap;
            flex-shrink: 0;
          }
          .team-cat-btn {
            white-space: nowrap;
            flex-shrink: 0;
          }
        }

        .team-category-label {
          font-size: 1.1rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: #81663F;
          margin-right: 0.8rem;
        }

        .team-cat-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.7rem 1.4rem;
          border-radius: 9999px;
          border: 1px solid rgba(129,102,63,0.25);
          background: #FAF9F6;
          color: #222;
          font-size: 1.2rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: all 0.25s ease;
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
          padding: 0.15rem 0.6rem;
          border-radius: 9999px;
          font-size: 1rem;
          font-weight: 800;
        }

        .team-cat-btn.active .team-cat-count {
          background: rgba(255,255,255,0.25);
          color: #fff;
        }

        /* ── Team Grid with Sturdy-style Spacing & Row Gaps ── */
        .team-grid-container {
          max-width: 1600px;
          margin: 0 auto;
        }

        .team-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 4rem 2.4rem;
          padding: 4rem 1.2rem 8rem;
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
          line-height: 1.0;
          text-transform: uppercase;
          color: #81663F;
        }

        .team-card__caption-role {
          font-size: 1.1rem;
          color: rgba(0,0,0,0.5);
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
          color: #81663F;
        }

        .team-card__caption-num {
          font-size: 2.6rem;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1;
          color: rgba(129,102,63,0.35);
        }

        /* ── Team Join Section Styling & Font Sizing ── */
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
