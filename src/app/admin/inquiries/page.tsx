"use client";

import { useState, useEffect } from "react";
import AdminNav from "@/components/AdminNav";
import { InquiryItem } from "@/lib/types";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchInquiries();
    // Auto refresh leads every 8 seconds for real-time live updates
    const interval = setInterval(() => {
      fetchInquiries(true);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  async function fetchInquiries(silent = false) {
    if (!silent) setLoading(true);
    try {
      const res = await fetch(`/api/inquiries?t=${Date.now()}`, { cache: "no-store" });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setInquiries(json.data);
      }
    } catch (e) {
      console.error("Failed to fetch inquiries:", e);
    } finally {
      if (!silent) setLoading(false);
    }
  }

  async function handleDeleteInquiry(id: string) {
    if (!confirm("Are you sure you want to delete this lead inquiry?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/inquiries?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setInquiries((prev) => prev.filter((i) => i.id !== id));
      } else {
        alert("Failed to delete lead: " + json.error);
      }
    } catch (err: any) {
      alert("Error deleting lead: " + err.message);
    } finally {
      setDeletingId(null);
    }
  }

  function handleExportCSV() {
    window.open("/api/inquiries?format=csv", "_blank");
  }

  const pdfLeadsCount = inquiries.filter((i) => i.type === "Catalog PDF Gate").length;
  const contactLeadsCount = inquiries.filter((i) => i.type !== "Catalog PDF Gate").length;

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesType = filterType === "All" || inq.type === filterType;
    const matchesQuery =
      !searchQuery ||
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.phone.includes(searchQuery) ||
      (inq.productOrBrand && inq.productOrBrand.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inq.subject && inq.subject.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesQuery;
  });

  return (
    <div style={{ background: "#ffffff", color: "#111111", minHeight: "100vh", display: "flex" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem", background: "#ffffff" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
          <div>
            <span style={{ color: "#8c764b", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 800 }}>
              LIVE LEAD MANAGEMENT & CATALOGUE ENQUIRIES
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", flexWrap: "wrap" }}>
              <h1 style={{ fontSize: "2.2rem", fontWeight: 800, margin: "0.4rem 0", color: "#8c764b" }}>
                Inquiries & Catalogue Requests ({inquiries.length})
              </h1>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.3rem 0.75rem", background: "#dcfce7", color: "#166534", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700, border: "1px solid #bbf7d0" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }}></span>
                Real-Time Live Sync Active
              </span>
            </div>
            <p style={{ color: "#475569", fontSize: "0.95rem" }}>
              Live exact data of visitors who submitted catalogue enquiries, quote requests, or contact forms. Real-time updated.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
            <button
              onClick={() => fetchInquiries()}
              style={{
                padding: "0.75rem 1.2rem",
                background: "#f1f5f9",
                color: "#1e293b",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              🔄 Refresh Leads
            </button>
            <button
              onClick={handleExportCSV}
              style={{
                padding: "0.75rem 1.4rem",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: 800,
                boxShadow: "0 4px 12px rgba(16,185,129,0.25)",
              }}
            >
              📊 Export CSV / Excel
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.2rem", marginBottom: "2rem" }}>
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "1.2rem 1.5rem", borderRadius: "10px" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Total Leads Captured</div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#8c764b", marginTop: "0.2rem" }}>{inquiries.length}</div>
          </div>
          <div style={{ background: "#fefce8", border: "1px solid #fef08a", padding: "1.2rem 1.5rem", borderRadius: "10px" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#a16207", textTransform: "uppercase" }}>📋 Catalogue Enquiries</div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#ca8a04", marginTop: "0.2rem" }}>{pdfLeadsCount}</div>
          </div>
          <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", padding: "1.2rem 1.5rem", borderRadius: "10px" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0369a1", textTransform: "uppercase" }}>💬 Direct Contact Inquiries</div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#0284c7", marginTop: "0.2rem" }}>{contactLeadsCount}</div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", background: "#f8fafc", border: "1px solid #e2e8f0", padding: "1.2rem", borderRadius: "8px" }}>
          <input
            type="text"
            placeholder="Search by visitor name, email, phone, or enquired catalogue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: "0.75rem 1rem",
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              color: "#111111",
              borderRadius: "6px",
              fontSize: "0.95rem",
            }}
          />

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: "0.75rem 1rem",
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              color: "#111111",
              borderRadius: "6px",
              fontSize: "0.95rem",
              fontWeight: 600,
            }}
          >
            <option value="All">All Lead Sources</option>
            <option value="Catalog Enquiry">📋 Catalogue Enquiries</option>
            <option value="Contact Form">💬 Contact Form</option>
            <option value="Project Debrief">📐 Project Debrief</option>
          </select>
        </div>

        {/* Inquiries Table */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ background: "#f8fafc", color: "#475569", borderBottom: "1px solid #e2e8f0", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.08em" }}>
                <th style={{ padding: "1rem 1.2rem" }}>Lead Visitor</th>
                <th style={{ padding: "1rem 1.2rem" }}>Contact Details</th>
                <th style={{ padding: "1rem 1.2rem" }}>Lead Type</th>
                <th style={{ padding: "1rem 1.2rem" }}>Requested Catalogue / Product</th>
                <th style={{ padding: "1rem 1.2rem" }}>Message / Role</th>
                <th style={{ padding: "1rem 1.2rem" }}>Submitted At</th>
                <th style={{ padding: "1rem 1.2rem", textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                    Loading live lead records...
                  </td>
                </tr>
              ) : filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                    No leads found matching current filter.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => (
                  <tr key={inq.id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.15s ease" }}>
                    <td style={{ padding: "1rem 1.2rem" }}>
                      <div style={{ fontWeight: 800, color: "#1e293b", fontSize: "0.95rem" }}>{inq.name}</div>
                      {inq.profession && (
                        <div style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 600, marginTop: "2px" }}>
                          🏢 {inq.profession}
                        </div>
                      )}
                      {inq.city && (
                        <div style={{ fontSize: "0.75rem", color: "#8c764b", marginTop: "1px" }}>
                          📍 {inq.city}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "1rem 1.2rem" }}>
                      <div style={{ color: "#8c764b", fontWeight: 700 }}>{inq.email}</div>
                      <div style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "2px", fontWeight: 600 }}>📞 {inq.phone}</div>
                    </td>
                    <td style={{ padding: "1rem 1.2rem" }}>
                      <span
                        style={{
                          padding: "0.35rem 0.75rem",
                          borderRadius: "4px",
                          fontSize: "0.75rem",
                          fontWeight: 800,
                          background: inq.type === "Catalog PDF Gate" ? "#fef3c7" : "#e0f2fe",
                          color: inq.type === "Catalog PDF Gate" ? "#b45309" : "#0369a1",
                          border: `1px solid ${inq.type === "Catalog PDF Gate" ? "#fde68a" : "#bae6fd"}`,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        {inq.type?.includes("Catalog") ? "📋 Catalogue Enquiry" : inq.type}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.2rem" }}>
                      <div style={{ color: "#0f172a", fontWeight: 800, fontSize: "0.9rem" }}>
                        📄 {inq.productOrBrand || "General Catalog"}
                      </div>
                      {inq.downloadedFileName && (
                        <div style={{ fontSize: "0.75rem", color: "#64748b", fontFamily: "monospace", marginTop: "2px" }}>
                          File: {inq.downloadedFileName}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "1rem 1.2rem", color: "#475569", maxWidth: "260px" }}>
                      {inq.subject && <div style={{ color: "#1e293b", fontWeight: 700, fontSize: "0.82rem", marginBottom: "2px" }}>{inq.subject}</div>}
                      <div style={{ fontSize: "0.82rem", lineHeight: 1.4, whiteSpace: "pre-line" }}>{inq.message || "-"}</div>
                    </td>
                    <td style={{ padding: "1rem 1.2rem", color: "#64748b", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                      {new Date(inq.createdAt).toLocaleString()}
                    </td>
                    <td style={{ padding: "1rem 1.2rem", textAlign: "right" }}>
                      <button
                        onClick={() => handleDeleteInquiry(inq.id)}
                        disabled={deletingId === inq.id}
                        style={{
                          padding: "0.4rem 0.8rem",
                          background: "#fee2e2",
                          color: "#dc2626",
                          border: "1px solid #fca5a5",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: "0.8rem",
                        }}
                      >
                        {deletingId === inq.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
