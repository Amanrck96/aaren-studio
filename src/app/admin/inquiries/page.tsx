"use client";

import { useState, useEffect } from "react";
import AdminNav from "@/components/AdminNav";
import { InquiryItem } from "@/lib/types";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchInquiries();
  }, []);

  async function fetchInquiries() {
    setLoading(true);
    try {
      const res = await fetch("/api/inquiries");
      const json = await res.json();
      if (json.success) setInquiries(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function handleExportCSV() {
    window.open("/api/inquiries?format=csv", "_blank");
  }

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesType = filterType === "All" || inq.type === filterType;
    const matchesQuery =
      !searchQuery ||
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.phone.includes(searchQuery);
    return matchesType && matchesQuery;
  });

  return (
    <div style={{ background: "#0a0a0c", color: "#f0f0f2", minHeight: "100vh" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <span style={{ color: "#84cc16", fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>LEAD MANAGEMENT</span>
            <h1 style={{ fontSize: "2.2rem", fontWeight: 800, margin: "0.3rem 0" }}>Inquiries & PDF Download Leads</h1>
            <p style={{ color: "#aaa", fontSize: "0.95rem" }}>View all leads submitted via Contact Form or Protected Catalog PDF Downloads. One-click CSV export.</p>
          </div>
          <button
            onClick={handleExportCSV}
            style={{ padding: "0.8rem 1.6rem", background: "linear-gradient(135deg, #84cc16 0%, #65a30d 100%)", color: "#000", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 800, fontSize: "0.95rem" }}
          >
            📥 Export All Leads to Excel / CSV
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", background: "#141418", padding: "1rem", borderRadius: "8px" }}>
          <input
            type="text"
            placeholder="Search leads by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, padding: "0.7rem 1rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
          />

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ padding: "0.7rem 1rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
          >
            <option value="All">All Lead Types</option>
            <option value="Contact Form">Contact Form Submissions</option>
            <option value="Catalog PDF Gate">Protected Catalog PDF Gate</option>
          </select>
        </div>

        {/* Inquiries Table */}
        <div style={{ background: "#141418", border: "1px solid #222", borderRadius: "10px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ background: "#1a1a20", color: "#888", borderBottom: "1px solid #222", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>
                <th style={{ padding: "1rem" }}>Lead Name</th>
                <th style={{ padding: "1rem" }}>Contact Details</th>
                <th style={{ padding: "1rem" }}>Lead Source</th>
                <th style={{ padding: "1rem" }}>Product / Brand</th>
                <th style={{ padding: "1rem" }}>Message / Subject</th>
                <th style={{ padding: "1rem" }}>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: "3rem", textAlign: "center", color: "#888" }}>
                    Loading leads data...
                  </td>
                </tr>
              ) : filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "3rem", textAlign: "center", color: "#888" }}>
                    No leads recorded yet.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => (
                  <tr key={inq.id} style={{ borderBottom: "1px solid #222" }}>
                    <td style={{ padding: "1rem", fontWeight: 700, color: "#fff" }}>{inq.name}</td>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ color: "#60a5fa" }}>{inq.email}</div>
                      <div style={{ color: "#aaa", fontSize: "0.8rem" }}>📞 {inq.phone}</div>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span
                        style={{
                          padding: "0.3rem 0.6rem",
                          borderRadius: "4px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          background: inq.type === "Catalog PDF Gate" ? "rgba(132, 204, 22, 0.2)" : "rgba(59, 130, 246, 0.2)",
                          color: inq.type === "Catalog PDF Gate" ? "#84cc16" : "#60a5fa",
                        }}
                      >
                        {inq.type}
                      </span>
                    </td>
                    <td style={{ padding: "1rem", color: "#ddd" }}>{inq.productOrBrand || "General Inquiry"}</td>
                    <td style={{ padding: "1rem", color: "#aaa", maxWidth: "250px" }}>
                      {inq.subject && <div style={{ color: "#fff", fontWeight: 600 }}>{inq.subject}</div>}
                      {inq.message || "-"}
                    </td>
                    <td style={{ padding: "1rem", color: "#777", fontSize: "0.8rem" }}>
                      {new Date(inq.createdAt).toLocaleString()}
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
