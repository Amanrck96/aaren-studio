"use client";

import { useState, useEffect } from "react";

const positions = [
  { id: "1", title: "3D Generalist", department: "Motion Design", location: "Remote / Bangalore" },
  { id: "2", title: "Senior Creative Developer", department: "Engineering", location: "Bangalore, India" },
  { id: "3", title: "Art Director", department: "Creative", location: "Hybrid / Bangalore" },
];

export default function Careers() {
  const [positionsList, setPositionsList] = useState(positions);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    position: "1",
    portfolio: "",
    resume: "",
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/careers?t=" + Date.now(), { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
          setPositionsList(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: "Career Applicant",
          type: "Career Application",
          subject: `Career Application: ${formData.position}`,
          message: `Portfolio: ${formData.portfolio || "N/A"}\nResume: ${formData.resume}`,
          productOrBrand: formData.position,
        }),
      });
    } catch (e) {}
    setSuccess(true);
  };

  return (
    <div style={{ background: "#E6E2D8", color: "#1C1917", minHeight: "100vh", paddingTop: "8rem", paddingBottom: "6rem" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2rem" }}>
        <h4 style={{ color: "#81663F", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 800, fontSize: "0.85rem", marginBottom: "1rem" }}>
          JOIN US — ARCHITECTURAL TALENT
        </h4>
        <h1 style={{ color: "#81663F", fontSize: "clamp(3rem, 7vw, 6rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.03em", marginBottom: "4rem" }}>
          CAREERS.
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "3rem" }}>
          {/* Job listings */}
          <div>
            <h2 style={{ color: "#81663F", fontSize: "1.8rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "-0.02em", marginBottom: "2rem" }}>
              OPEN POSITIONS
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {positionsList.map((pos) => (
                <div
                  key={pos.id}
                  style={{
                    border: "1px solid rgba(129,102,63,0.2)",
                    background: "#FAF9F6",
                    padding: "1.8rem",
                    borderRadius: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: "1.3rem", fontWeight: 800, textTransform: "uppercase", color: "#81663F", margin: 0 }}>
                      {pos.title}
                    </h3>
                    <p style={{ fontSize: "0.85rem", color: "#5E5852", marginTop: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                      {pos.department} • {pos.location}
                    </p>
                  </div>
                  <button
                    onClick={() => setFormData({ ...formData, position: pos.id })}
                    style={{
                      padding: "0.6rem 1.4rem",
                      border: "1px solid #81663F",
                      background: formData.position === pos.id ? "#81663F" : "transparent",
                      color: formData.position === pos.id ? "#ffffff" : "#81663F",
                      fontSize: "0.8rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      borderRadius: "4px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {formData.position === pos.id ? "Selected" : "Apply"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div
            style={{
              border: "1px solid rgba(129,102,63,0.2)",
              background: "#FAF9F6",
              padding: "2.5rem",
              borderRadius: "8px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
            }}
          >
            <h2 style={{ color: "#81663F", fontSize: "1.8rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "-0.02em", marginBottom: "2rem" }}>
              APPLY NOW
            </h2>
            {success ? (
              <div style={{ padding: "2rem", background: "rgba(129,102,63,0.1)", border: "1px solid #81663F", borderRadius: "6px", textAlign: "center" }}>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, textTransform: "uppercase", color: "#81663F" }}>Application Submitted</h3>
                <p style={{ color: "#5E5852", fontSize: "0.95rem", marginTop: "0.6rem" }}>Thank you! Our recruitment team will be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, color: "#5E5852", marginBottom: "0.4rem" }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: "100%", background: "#ffffff", border: "1px solid rgba(129,102,63,0.25)", padding: "0.85rem 1rem", color: "#1C1917", fontSize: "0.95rem", outline: "none", borderRadius: "4px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, color: "#5E5852", marginBottom: "0.4rem" }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: "100%", background: "#ffffff", border: "1px solid rgba(129,102,63,0.25)", padding: "0.85rem 1rem", color: "#1C1917", fontSize: "0.95rem", outline: "none", borderRadius: "4px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, color: "#5E5852", marginBottom: "0.4rem" }}>
                    Select Position
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    style={{ width: "100%", background: "#ffffff", border: "1px solid rgba(129,102,63,0.25)", padding: "0.85rem 1rem", color: "#1C1917", fontSize: "0.95rem", outline: "none", borderRadius: "4px" }}
                  >
                    {positionsList.map((pos) => (
                      <option key={pos.id} value={pos.id}>
                        {pos.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, color: "#5E5852", marginBottom: "0.4rem" }}>
                    Portfolio Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://"
                    value={formData.portfolio}
                    onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                    style={{ width: "100%", background: "#ffffff", border: "1px solid rgba(129,102,63,0.25)", padding: "0.85rem 1rem", color: "#1C1917", fontSize: "0.95rem", outline: "none", borderRadius: "4px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, color: "#5E5852", marginBottom: "0.4rem" }}>
                    Resume Drive Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://"
                    required
                    value={formData.resume}
                    onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                    style={{ width: "100%", background: "#ffffff", border: "1px solid rgba(129,102,63,0.25)", padding: "0.85rem 1rem", color: "#1C1917", fontSize: "0.95rem", outline: "none", borderRadius: "4px" }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "1rem",
                    background: "#81663F",
                    color: "#ffffff",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(129,102,63,0.25)",
                    transition: "all 0.2s ease",
                  }}
                >
                  Submit Application
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
