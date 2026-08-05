"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/AdminNav";
import { TeamMemberItem } from "@/lib/types";

const SUB_CATEGORIES = ["Sales", "Operations", "Installation", "Support Staff", "Leadership"];

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<TeamMemberItem> | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("ALL");

  const [joinBanner, setJoinBanner] = useState({
    title: "DO YOU WANT TO JOIN THE CREATIVE TEAM?",
    fontSize: "medium",
    hoursText: "Open 9am to 9pm (All days)",
    phone: "+91 88844 64444",
    email: "info@aarenintpro.com",
    address: "NO. 342/8, NTY LAYOUT, MYSORE ROAD, BENGALURU - 560026",
  });
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [savingBanner, setSavingBanner] = useState(false);

  const fetchTeam = () => {
    fetch("/api/team")
      .then((res) => res.json())
      .then((json) => {
        if (json && json.success) {
          const teamList = json.team || (json.data && json.data.team) || (Array.isArray(json.data) ? json.data : []);
          setTeam(teamList);
          if (json.joinBanner || (json.data && json.data.joinBanner)) {
            setJoinBanner(json.joinBanner || json.data.joinBanner);
          }
        }
        setLoading(false);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.name || !editing?.designation) return alert("Name and Designation are required.");

    const res = await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editing,
        category: editing.category || "Sales",
        memberCode: editing.memberCode || "MM 01",
        photoUrl: editing.photoUrl || "https://www.aarenintpro.com/wp-content/uploads/2016/08/about-us-4-min.jpg",
      }),
    });
    const json = await res.json();
    if (json.success) {
      alert("Team member saved!");
      setEditing(null);
      fetchTeam();
    } else alert("Error: " + json.error);
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingBanner(true);
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "joinBanner", data: joinBanner }),
      });
      const json = await res.json();
      if (json.success) {
        alert("Join Team Banner settings saved!");
        setShowBannerForm(false);
        fetchTeam();
      } else {
        alert("Error: " + json.error);
      }
    } catch (e) {
      console.error(e);
      alert("Error saving banner settings.");
    } finally {
      setSavingBanner(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/team?id=${id}`, { method: "DELETE" });
    fetchTeam();
  };

  const filteredTeam = selectedFilter === "ALL" 
    ? team 
    : team.filter((m) => (m.category || "Sales").toLowerCase() === selectedFilter.toLowerCase());

  return (
    <div style={{ background: "#0b0c10", color: "#f8fafc", minHeight: "100vh", display: "flex" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "1rem" }}>
          <div>
            <span style={{ color: "#d4af37", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 800 }}>TEAM MANAGEMENT</span>
            <h1 style={{ fontSize: "2.2rem", fontWeight: 800, margin: "0.2rem 0", color: "#fff" }}>Our Team CMS</h1>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Manage team members across Sales, Operations, Installation, and Support Staff, plus Join Banner settings.</p>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={() => setShowBannerForm(!showBannerForm)}
              style={{ padding: "0.7rem 1.4rem", background: "#1e2230", color: "#d4af37", border: "1px solid rgba(212,175,55,0.4)", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}
            >
              ⚙️ Join Banner Settings
            </button>
            <button
              onClick={() => setEditing({ name: "", designation: "Sales Specialist", category: "Sales", memberCode: "TM 01", photoUrl: "https://www.aarenintpro.com/wp-content/uploads/2016/08/about-us-4-min.jpg", bio: "", sequenceNumber: team.length + 1 })}
              style={{ padding: "0.7rem 1.4rem", background: "linear-gradient(135deg, #d4af37 0%, #aa820a 100%)", color: "#000", border: "none", borderRadius: "8px", fontWeight: 800, cursor: "pointer" }}
            >
              + Add Team Member
            </button>
          </div>
        </div>

        {/* Join Banner Settings Drawer/Form */}
        {showBannerForm && (
          <form onSubmit={handleSaveBanner} style={{ background: "#12141c", padding: "2rem", borderRadius: "12px", border: "1px solid rgba(212,175,55,0.3)", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.4rem", color: "#d4af37" }}>Join Creative Team Banner Settings</h2>
            <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "1.5rem" }}>Customize the title text, font size, and contact details shown at the bottom of the Team page.</p>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.3rem" }}>Banner Heading Text *</label>
                <input
                  type="text"
                  required
                  value={joinBanner.title}
                  onChange={(e) => setJoinBanner({ ...joinBanner, title: e.target.value })}
                  style={{ width: "100%", padding: "0.75rem", background: "#0b0c10", border: "1px solid #1e2230", color: "#fff", borderRadius: "6px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.3rem" }}>Heading Font Size *</label>
                <select
                  value={joinBanner.fontSize || "medium"}
                  onChange={(e) => setJoinBanner({ ...joinBanner, fontSize: e.target.value as any })}
                  style={{ width: "100%", padding: "0.75rem", background: "#0b0c10", border: "1px solid #1e2230", color: "#fff", borderRadius: "6px" }}
                >
                  <option value="small">Small (Compact & Subtle)</option>
                  <option value="medium">Medium (Normal / Balanced - Recommended)</option>
                  <option value="large">Large (Prominent)</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.3rem" }}>Working Hours</label>
                <input
                  type="text"
                  value={joinBanner.hoursText}
                  onChange={(e) => setJoinBanner({ ...joinBanner, hoursText: e.target.value })}
                  style={{ width: "100%", padding: "0.75rem", background: "#0b0c10", border: "1px solid #1e2230", color: "#fff", borderRadius: "6px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.3rem" }}>Phone Number</label>
                <input
                  type="text"
                  value={joinBanner.phone}
                  onChange={(e) => setJoinBanner({ ...joinBanner, phone: e.target.value })}
                  style={{ width: "100%", padding: "0.75rem", background: "#0b0c10", border: "1px solid #1e2230", color: "#fff", borderRadius: "6px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.3rem" }}>Email Address</label>
                <input
                  type="text"
                  value={joinBanner.email}
                  onChange={(e) => setJoinBanner({ ...joinBanner, email: e.target.value })}
                  style={{ width: "100%", padding: "0.75rem", background: "#0b0c10", border: "1px solid #1e2230", color: "#fff", borderRadius: "6px" }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.3rem" }}>Physical Address</label>
              <input
                type="text"
                value={joinBanner.address}
                onChange={(e) => setJoinBanner({ ...joinBanner, address: e.target.value })}
                style={{ width: "100%", padding: "0.75rem", background: "#0b0c10", border: "1px solid #1e2230", color: "#fff", borderRadius: "6px" }}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                type="submit"
                disabled={savingBanner}
                style={{ padding: "0.75rem 1.6rem", background: "#d4af37", color: "#000", border: "none", borderRadius: "6px", fontWeight: 800, cursor: "pointer" }}
              >
                {savingBanner ? "Saving..." : "Save Banner Settings"}
              </button>
              <button
                type="button"
                onClick={() => setShowBannerForm(false)}
                style={{ padding: "0.75rem 1.6rem", background: "#1e2230", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Sub Category Filter Bar */}
        <div style={{ display: "flex", gap: "0.8rem", marginBottom: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: 700, marginRight: "0.5rem" }}>Filter Sub Category:</span>
          {["ALL", ...SUB_CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              style={{
                padding: "0.4rem 1rem",
                borderRadius: "6px",
                fontSize: "0.85rem",
                fontWeight: 700,
                cursor: "pointer",
                border: "1px solid " + (selectedFilter === cat ? "#d4af37" : "rgba(255,255,255,0.1)"),
                background: selectedFilter === cat ? "#d4af37" : "#12141c",
                color: selectedFilter === cat ? "#000" : "#94a3b8",
                transition: "all 0.2s ease"
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {editing && (
          <form onSubmit={handleSave} style={{ background: "#12141c", padding: "2rem", borderRadius: "12px", border: "1px solid rgba(212,175,55,0.2)", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.2rem", color: "#d4af37" }}>{editing.id ? "Edit Team Member" : "Add Team Member"}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.3rem" }}>Full Name *</label>
                <input
                  type="text"
                  required
                  value={editing.name || ""}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  style={{ width: "100%", padding: "0.75rem", background: "#0b0c10", border: "1px solid #1e2230", color: "#fff", borderRadius: "6px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.3rem" }}>Sub Category *</label>
                <select
                  value={editing.category || "Sales"}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  style={{ width: "100%", padding: "0.75rem", background: "#0b0c10", border: "1px solid #1e2230", color: "#fff", borderRadius: "6px" }}
                >
                  {SUB_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.3rem" }}>Designation / Role *</label>
                <input
                  type="text"
                  required
                  value={editing.designation || ""}
                  onChange={(e) => setEditing({ ...editing, designation: e.target.value })}
                  style={{ width: "100%", padding: "0.75rem", background: "#0b0c10", border: "1px solid #1e2230", color: "#fff", borderRadius: "6px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.3rem" }}>Member Code (e.g. MM 01)</label>
                <input
                  type="text"
                  value={editing.memberCode || ""}
                  onChange={(e) => setEditing({ ...editing, memberCode: e.target.value })}
                  style={{ width: "100%", padding: "0.75rem", background: "#0b0c10", border: "1px solid #1e2230", color: "#fff", borderRadius: "6px" }}
                />
              </div>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.3rem" }}>Member Photo (Upload file or paste URL)</label>
              <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
                <input
                  type="text"
                  placeholder="https://... or choose file on right ->"
                  value={editing.photoUrl || ""}
                  onChange={(e) => setEditing({ ...editing, photoUrl: e.target.value })}
                  style={{ flex: 1, padding: "0.75rem", background: "#0b0c10", border: "1px solid #1e2230", color: "#fff", borderRadius: "6px" }}
                />
                <label style={{ padding: "0.75rem 1.2rem", background: "#d4af37", color: "#000", borderRadius: "6px", cursor: "pointer", fontWeight: 800, whiteSpace: "nowrap", fontSize: "0.85rem" }}>
                  📁 Choose File
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const formData = new FormData();
                      formData.append("file", file);
                      formData.append("folder", "Team");
                      try {
                        const res = await fetch("/api/upload", { method: "POST", body: formData });
                        const json = await res.json();
                        if (json.success) {
                          setEditing((prev) => prev ? { ...prev, photoUrl: json.dataUrl || json.url } : null);
                          alert("Photo uploaded successfully!");
                        } else alert("Upload error: " + json.error);
                      } catch (err: any) {
                        alert("Upload failed: " + err.message);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.3rem" }}>Biography</label>
              <textarea
                rows={3}
                value={editing.bio || ""}
                onChange={(e) => setEditing({ ...editing, bio: e.target.value })}
                style={{ width: "100%", padding: "0.75rem", background: "#0b0c10", border: "1px solid #1e2230", color: "#fff", borderRadius: "6px" }}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <button type="submit" style={{ padding: "0.75rem 1.6rem", background: "#d4af37", color: "#000", border: "none", borderRadius: "6px", fontWeight: 800, cursor: "pointer" }}>
                Save Member
              </button>
              <button type="button" onClick={() => setEditing(null)} style={{ padding: "0.75rem 1.6rem", background: "#1e2230", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {filteredTeam.map((m) => (
            <div key={m.id || m.name} style={{ background: "#12141c", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", gap: "1.2rem", alignItems: "center", marginBottom: "1rem" }}>
                  <img
                    src={m.photoUrl}
                    alt={m.name}
                    style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover", border: "2px solid #d4af37" }}
                  />
                  <div>
                    <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.3rem" }}>
                      <span style={{ fontSize: "0.7rem", background: "rgba(212,175,55,0.15)", color: "#d4af37", padding: "0.15rem 0.5rem", borderRadius: "4px", fontWeight: 800 }}>
                        {m.memberCode || "MM"}
                      </span>
                      <span style={{ fontSize: "0.7rem", background: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", padding: "0.15rem 0.5rem", borderRadius: "4px", fontWeight: 800 }}>
                        {m.category || "Sales"}
                      </span>
                    </div>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#fff", margin: "0.2rem 0" }}>{m.name}</h3>
                    <div style={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: 600 }}>{m.designation}</div>
                  </div>
                </div>
                <p style={{ color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.5, marginBottom: "1.2rem" }}>{m.bio}</p>
              </div>

              <div style={{ display: "flex", gap: "0.8rem", paddingTop: "0.8rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <button onClick={() => setEditing(m)} style={{ padding: "0.45rem 1rem", background: "#1e2230", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(m.id)} style={{ padding: "0.45rem 1rem", background: "rgba(239, 68, 68, 0.15)", color: "#f87171", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
