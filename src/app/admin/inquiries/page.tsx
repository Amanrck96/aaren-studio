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
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const poll = async () => {
      if (!isMounted) return;
      await fetchInquiries(true);
      if (isMounted) timeoutId = setTimeout(poll, 8000);
    };

    fetchInquiries().then(() => {
      if (isMounted) timeoutId = setTimeout(poll, 8000);
    });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
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

  const loggedInLeadsCount = inquiries.filter(
    (i) => i.source === "auto-logged-in" || i.isLoggedIn || i.type?.includes("Logged In")
  ).length;
  const formCatalogLeadsCount = inquiries.filter(
    (i) => i.type?.includes("Catalog") && i.source !== "auto-logged-in" && !i.isLoggedIn && !i.type?.includes("Logged In")
  ).length;
  const contactLeadsCount = inquiries.filter((i) => !i.type?.includes("Catalog")).length;

  const filteredInquiries = inquiries.filter((inq) => {
    const isLoggedInLead = inq.source === "auto-logged-in" || inq.isLoggedIn || inq.type?.includes("Logged In");
    let matchesType = true;

    if (filterType === "Logged In") {
      matchesType = isLoggedInLead;
    } else if (filterType === "Catalog Enquiry") {
      matchesType = inq.type?.includes("Catalog") && !isLoggedInLead;
    } else if (filterType === "Contact Form") {
      matchesType = inq.type === "Contact Form";
    } else if (filterType !== "All") {
      matchesType = inq.type === filterType;
    }

    const matchesQuery =
      !searchQuery ||
      (inq.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inq.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inq.phone || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inq.productOrBrand && inq.productOrBrand.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inq.subject && inq.subject.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesQuery;
  });

  return (
    <div style={{ background: "#FAF8F5", color: "#1E1E1E", minHeight: "100vh", display: "flex" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem", background: "#FAF8F5" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", borderBottom: "1px solid #DCD5C6", paddingBottom: "1.5rem" }}>
          <div>
            <span style={{ color: "#81663F", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 800 }}>
              LIVE LEAD MANAGEMENT & CATALOGUE ENQUIRIES
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", flexWrap: "wrap" }}>
              <h1 style={{ fontSize: "2.2rem", fontWeight: 900, margin: "0.4rem 0", color: "#1E1E1E" }}>
                Inquiries & Catalogue Requests ({inquiries.length})
              </h1>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.3rem 0.75rem", background: "rgba(16, 185, 129, 0.15)", color: "#065f46", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 800, border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }}></span>
                Real-Time Live Sync Active
              </span>
            </div>
            <p style={{ color: "#555555", fontSize: "0.95rem", margin: "2px 0 0" }}>
              Live exact data of visitors who submitted catalogue enquiries or logged-in users who accessed architectural PDF specifications.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
            <button
              onClick={() => fetchInquiries()}
              style={{
                padding: "0.75rem 1.2rem",
                background: "#F4EFE6",
                color: "#1E1E1E",
                border: "1px solid #D5CEBF",
                borderRadius: "8px",
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
                background: "#10b981",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.2rem", marginBottom: "2rem" }}>
          <div style={{ background: "#FFFFFF", border: "1px solid #E2DCD2", padding: "1.2rem 1.5rem", borderRadius: "14px", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#6A6359", textTransform: "uppercase" }}>Total Leads</div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#1E1E1E", marginTop: "0.2rem" }}>{inquiries.length}</div>
          </div>
          <div style={{ background: "#FFFFFF", border: "1px solid #A7F3D0", padding: "1.2rem 1.5rem", borderRadius: "14px", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#065f46", textTransform: "uppercase" }}>🟢 Logged-In User Views</div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#059669", marginTop: "0.2rem" }}>{loggedInLeadsCount}</div>
          </div>
          <div style={{ background: "#FFFFFF", border: "1px solid #E2DCD2", padding: "1.2rem 1.5rem", borderRadius: "14px", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#81663F", textTransform: "uppercase" }}>📋 Form Submissions</div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#81663F", marginTop: "0.2rem" }}>{formCatalogLeadsCount}</div>
          </div>
          <div style={{ background: "#FFFFFF", border: "1px solid #E2DCD2", padding: "1.2rem 1.5rem", borderRadius: "14px", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2563eb", textTransform: "uppercase" }}>💬 Direct Contact</div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#2563eb", marginTop: "0.2rem" }}>{contactLeadsCount}</div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", background: "#FFFFFF", border: "1px solid #E2DCD2", padding: "1.2rem", borderRadius: "14px", boxShadow: "0 4px 20px rgba(0,0,0,0.04)", flexWrap: "wrap" }}>
          <input
            type="text"
            aria-label="Search inquiries"
            placeholder="Search by visitor name, email, phone, or enquired catalogue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: "1 1 300px",
              padding: "0.75rem 1rem",
              background: "#FAF8F5",
              border: "1px solid #D5CEBF",
              color: "#1E1E1E",
              borderRadius: "8px",
              fontSize: "0.95rem",
            }}
          />

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: "0.75rem 1rem",
              background: "#FAF8F5",
              border: "1px solid #D5CEBF",
              color: "#1E1E1E",
              borderRadius: "8px",
              fontSize: "0.95rem",
              fontWeight: 700,
            }}
          >
            <option value="All">All Lead Sources ({inquiries.length})</option>
            <option value="Logged In">🟢 👤 Logged In User Views ({loggedInLeadsCount})</option>
            <option value="Catalog Enquiry">📋 Form Catalogue Enquiries ({formCatalogLeadsCount})</option>
            <option value="Contact Form">💬 Direct Contact Form ({contactLeadsCount})</option>
            <option value="Project Debrief">📐 Project Debrief</option>
          </select>
        </div>

        {/* Inquiries Table */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E2DCD2", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ background: "#F4EFE6", color: "#81663F", borderBottom: "1px solid #DCD5C6", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.08em" }}>
                <th style={{ padding: "1rem 1.2rem" }}>Lead Visitor</th>
                <th style={{ padding: "1rem 1.2rem" }}>Contact Details</th>
                <th style={{ padding: "1rem 1.2rem" }}>Lead Type / Status</th>
                <th style={{ padding: "1rem 1.2rem" }}>Requested Catalogue / Product</th>
                <th style={{ padding: "1rem 1.2rem" }}>Message / Note</th>
                <th style={{ padding: "1rem 1.2rem" }}>Captured At</th>
                <th style={{ padding: "1rem 1.2rem", textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "#6A6359" }}>
                    Loading live lead records...
                  </td>
                </tr>
              ) : filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "#6A6359" }}>
                    No leads found matching current filter.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => {
                  const isLoggedIn = inq.source === "auto-logged-in" || inq.isLoggedIn || inq.type?.includes("Logged In");

                  return (
                    <tr
                      key={inq.id}
                      style={{
                        borderBottom: "1px solid #EAE4D8",
                        background: isLoggedIn ? "rgba(16, 185, 129, 0.02)" : "#FFFFFF",
                        transition: "background 0.15s ease",
                      }}
                    >
                      <td style={{ padding: "1rem 1.2rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <div style={{ fontWeight: 800, color: "#1E1E1E", fontSize: "0.95rem" }}>{inq.name}</div>
                          {isLoggedIn && (
                            <span style={{ fontSize: "0.68rem", fontWeight: 800, background: "#d1fae5", color: "#065f46", padding: "1px 6px", borderRadius: "4px", border: "1px solid #a7f3d0" }}>
                              Logged In
                            </span>
                          )}
                        </div>
                        {inq.profession && (
                          <div style={{ fontSize: "0.78rem", color: "#6A6359", fontWeight: 600, marginTop: "2px" }}>
                            🏢 {inq.profession}
                          </div>
                        )}
                        {inq.city && (
                          <div style={{ fontSize: "0.75rem", color: "#81663F", marginTop: "1px", fontWeight: 700 }}>
                            📍 {inq.city}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "1rem 1.2rem" }}>
                        <div style={{ color: "#81663F", fontWeight: 700 }}>{inq.email}</div>
                        <div style={{ color: "#555555", fontSize: "0.85rem", marginTop: "2px", fontWeight: 600 }}>📞 {inq.phone}</div>
                      </td>
                      <td style={{ padding: "1rem 1.2rem" }}>
                        {isLoggedIn ? (
                          <span
                            style={{
                              padding: "0.35rem 0.75rem",
                              borderRadius: "6px",
                              fontSize: "0.75rem",
                              fontWeight: 800,
                              background: "#d1fae5",
                              color: "#065f46",
                              border: "1px solid #a7f3d0",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.3rem",
                            }}
                          >
                            🟢 👤 User Logged In
                          </span>
                        ) : (
                          <span
                            style={{
                              padding: "0.35rem 0.75rem",
                              borderRadius: "6px",
                              fontSize: "0.75rem",
                              fontWeight: 800,
                              background: inq.type === "Catalog PDF Gate" || inq.type?.includes("Catalog") ? "rgba(129,102,63,0.12)" : "rgba(37,99,235,0.1)",
                              color: inq.type === "Catalog PDF Gate" || inq.type?.includes("Catalog") ? "#81663F" : "#2563eb",
                              border: `1px solid ${inq.type === "Catalog PDF Gate" || inq.type?.includes("Catalog") ? "rgba(129,102,63,0.25)" : "rgba(37,99,235,0.25)"}`,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.3rem",
                            }}
                          >
                            {inq.type?.includes("Catalog") ? "📋 Catalogue Enquiry" : inq.type}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "1rem 1.2rem" }}>
                        <div style={{ color: "#1E1E1E", fontWeight: 800, fontSize: "0.9rem" }}>
                          📄 {inq.productOrBrand || "General Catalog"}
                        </div>
                        {inq.downloadedFileName && (
                          <div style={{ fontSize: "0.75rem", color: "#6A6359", fontFamily: "monospace", marginTop: "2px" }}>
                            File: {inq.downloadedFileName}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "1rem 1.2rem", color: "#555555", maxWidth: "260px" }}>
                        {inq.subject && <div style={{ color: "#1E1E1E", fontWeight: 700, fontSize: "0.82rem", marginBottom: "2px" }}>{inq.subject}</div>}
                        <div style={{ fontSize: "0.82rem", lineHeight: 1.4, whiteSpace: "pre-line" }}>{inq.message || "-"}</div>
                      </td>
                      <td style={{ padding: "1rem 1.2rem", color: "#6A6359", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                        {new Date(inq.createdAt).toLocaleString()}
                      </td>
                    <td style={{ padding: "1rem 1.2rem", textAlign: "right" }}>
                      <button
                        onClick={() => handleDeleteInquiry(inq.id)}
                        disabled={deletingId === inq.id}
                        style={{
                          padding: "0.4rem 0.8rem",
                          background: "#FEE2E2",
                          color: "#DC2626",
                          border: "1px solid #FCA5A5",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: 700,
                          fontSize: "0.8rem",
                        }}
                      >
                        {deletingId === inq.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </main>
  </div>
);
}
