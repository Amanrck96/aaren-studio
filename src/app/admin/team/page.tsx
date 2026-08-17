"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/AdminNav";
import { TeamMemberItem } from "@/lib/types";

export const TEAM_GROUPS = [
  { id: "ALL", label: "ALL MEMBERS" },
  { id: "Leadership", label: "1. LEADERSHIP" },
  { id: "Team", label: "2. TEAM" },
];

export const TEAM_DEPARTMENTS = [
  { id: "ALL", label: "ALL DEPARTMENTS", match: "all" },
  { id: "Sales", label: "A. SALES", match: "sales" },
  { id: "Operations", label: "B. OPERATIONS", match: "operations" },
  { id: "Installation", label: "C. INSTALLATION", match: "installation" },
  { id: "Accountant", label: "D. ACCOUNTANT", match: "account" },
  { id: "Support Staff", label: "E. SUPPORT STAFF", match: "support staff" },
];

export const ALL_SUB_CATEGORIES = ["Leadership", "Sales", "Operations", "Installation", "Accountant", "Support Staff"];

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<TeamMemberItem> | null>(null);
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<"ALL" | "Leadership" | "Team">("ALL");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>("ALL");

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

  const [showRearrangeModal, setShowRearrangeModal] = useState(false);
  const [rearrangeCategory, setRearrangeCategory] = useState("ALL");
  const [rearrangeList, setRearrangeList] = useState<TeamMemberItem[]>([]);

  const fetchTeam = () => {
    fetch("/api/team?t=" + Date.now(), { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (json && json.success) {
          const teamList = json.team || (json.data && json.data.team) || (Array.isArray(json.data) ? json.data : []);
          teamList.sort((a: any, b: any) => (a.sequenceNumber || 99) - (b.sequenceNumber || 99));
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

  // 1-click Move Up / Move Down handler within current active filter
  const handleMoveMember = async (memberId: string, direction: "up" | "down") => {
    const listToReorder = team.filter((m) => {
      const isLeadership = (m.category || "Sales").toLowerCase() === "leadership";
      if (selectedGroupFilter === "Leadership") return isLeadership;
      if (selectedGroupFilter === "Team") {
        if (isLeadership) return false;
        if (selectedDeptFilter === "ALL") return true;
        return (m.category || "").toLowerCase() === selectedDeptFilter.toLowerCase();
      }
      if (selectedDeptFilter !== "ALL") {
        return (m.category || "").toLowerCase() === selectedDeptFilter.toLowerCase();
      }
      return true;
    }).sort((a, b) => (a.sequenceNumber ?? 99) - (b.sequenceNumber ?? 99));

    const index = listToReorder.findIndex((m) => m.id === memberId);
    if (index === -1) return;
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === listToReorder.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    const movedList = [...listToReorder];
    const [removed] = movedList.splice(index, 1);
    movedList.splice(targetIndex, 0, removed);

    const reindexedMoved = movedList.map((m, i) => ({
      ...m,
      sequenceNumber: i + 1,
    }));

    const movedIds = new Set(reindexedMoved.map((m) => m.id));
    const otherMembers = team.filter((m) => !movedIds.has(m.id));
    const updatedTeam = [...otherMembers, ...reindexedMoved].sort((a, b) => (a.sequenceNumber ?? 99) - (b.sequenceNumber ?? 99));

    setTeam(updatedTeam);

    await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "reorder", team: updatedTeam }),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.name || !editing?.designation) return alert("Name and Designation are required.");

    const res = await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editing,
        category: editing.category || "Sales",
        memberCode: editing.memberCode || "TM 01",
        photoUrl: editing.photoUrl || "",
        sequenceNumber: editing.sequenceNumber ?? (team.length + 1),
      }),
    });
    const json = await res.json();
    if (json.success) {
      alert("Team member saved successfully!");
      setEditing(null);
      fetchTeam();
    } else {
      alert("Error: " + json.error);
    }
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
    if (!confirm("Are you sure you want to delete this team member?")) return;
    await fetch(`/api/team?id=${id}`, { method: "DELETE" });
    fetchTeam();
  };

  // Filtered members list for admin display
  const filteredTeam = team.filter((m) => {
    const isLeadership = (m.category || "Sales").toLowerCase() === "leadership";

    if (selectedGroupFilter === "Leadership") {
      return isLeadership;
    }

    if (selectedGroupFilter === "Team") {
      if (isLeadership) return false;
      if (selectedDeptFilter === "ALL") return true;
      return (m.category || "").toLowerCase() === selectedDeptFilter.toLowerCase();
    }

    if (selectedDeptFilter !== "ALL") {
      return (m.category || "").toLowerCase() === selectedDeptFilter.toLowerCase();
    }

    return true;
  });

  const leadershipCount = team.filter((m) => (m.category || "Sales").toLowerCase() === "leadership").length;
  const teamCount = team.filter((m) => (m.category || "Sales").toLowerCase() !== "leadership").length;

  return (
    <div style={{ background: "#0b0c10", color: "#f8fafc", minHeight: "100vh", display: "flex" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem" }}>
        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "1.2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span style={{ color: "#d4af37", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 800 }}>ORGANIZATIONAL DIRECTORY</span>
            <h1 style={{ fontSize: "2.2rem", fontWeight: 800, margin: "0.2rem 0", color: "#fff" }}>Our Team CMS</h1>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              Manage and organize by <strong>1. Leadership</strong> and <strong>2. Team</strong> (Sales, Operations, Installation, Support Staff).
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
            <button
              onClick={() => {
                setRearrangeList([...team].sort((a, b) => (a.sequenceNumber || 99) - (b.sequenceNumber || 99)));
                setShowRearrangeModal(true);
              }}
              style={{ padding: "0.7rem 1.4rem", background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 800, cursor: "pointer" }}
            >
              🔀 Rearrange Order
            </button>
            <button
              onClick={() => setShowBannerForm(!showBannerForm)}
              style={{ padding: "0.7rem 1.4rem", background: "#1e2230", color: "#d4af37", border: "1px solid rgba(212,175,55,0.4)", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}
            >
              ⚙️ Join Banner Settings
            </button>
            <button
              onClick={() => setEditing({ name: "", designation: "Sales Consultant", category: "Sales", memberCode: "TM " + String(team.length + 1).padStart(2, "0"), photoUrl: "", bio: "", sequenceNumber: team.length + 1 })}
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
                  <option value="small">Small (Compact)</option>
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

        {/* PRIMARY GROUP FILTER TABS (1. Leadership vs 2. Team) */}
        <div style={{ display: "flex", gap: "0.8rem", marginBottom: "1.2rem", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ color: "#d4af37", fontSize: "0.85rem", fontWeight: 800, marginRight: "0.3rem" }}>ORGANIZATION TIER:</span>
          {TEAM_GROUPS.map((grp) => {
            const isActive = selectedGroupFilter === grp.id;
            const count = grp.id === "ALL" ? team.length : (grp.id === "Leadership" ? leadershipCount : teamCount);
            return (
              <button
                key={grp.id}
                onClick={() => {
                  setSelectedGroupFilter(grp.id as any);
                  setSelectedDeptFilter("ALL");
                }}
                style={{
                  padding: "0.55rem 1.2rem",
                  borderRadius: "8px",
                  fontSize: "0.88rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  border: "1px solid " + (isActive ? "#d4af37" : "rgba(255,255,255,0.15)"),
                  background: isActive ? "linear-gradient(135deg, #d4af37 0%, #aa820a 100%)" : "#12141c",
                  color: isActive ? "#000" : "#cbd5e1",
                  transition: "all 0.2s ease"
                }}
              >
                {grp.label} ({count})
              </button>
            );
          })}
        </div>

        {/* SUB DEPARTMENT FILTER BAR (A. Sales, B. Operations, C. Installation, D. Support Staff) */}
        {(selectedGroupFilter === "Team" || selectedGroupFilter === "ALL") && (
          <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1.8rem", alignItems: "center", flexWrap: "wrap", padding: "0.8rem 1.2rem", background: "rgba(255,255,255,0.03)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ color: "#94a3b8", fontSize: "0.82rem", fontWeight: 700, marginRight: "0.4rem" }}>TEAM DEPARTMENTS:</span>
            {TEAM_DEPARTMENTS.map((dept) => {
              const isActive = selectedDeptFilter === dept.id;
              const count = dept.id === "ALL" ? teamCount : team.filter((m) => (m.category || "").toLowerCase() === dept.match).length;
              return (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDeptFilter(dept.id)}
                  style={{
                    padding: "0.4rem 0.9rem",
                    borderRadius: "6px",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    border: "1px solid " + (isActive ? "#3b82f6" : "rgba(255,255,255,0.1)"),
                    background: isActive ? "#3b82f6" : "#0b0c10",
                    color: isActive ? "#fff" : "#94a3b8",
                    transition: "all 0.2s ease"
                  }}
                >
                  {dept.label} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* ADD / EDIT MODAL / FORM */}
        {editing && (
          <form onSubmit={handleSave} style={{ background: "#12141c", padding: "2rem", borderRadius: "12px", border: "1px solid rgba(212,175,55,0.3)", marginBottom: "2rem", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "1.2rem", color: "#d4af37" }}>
              {editing.id ? "Edit Team Member" : "+ Add New Team Member"}
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.3rem" }}>Full Name *</label>
                <input
                  type="text"
                  required
                  value={editing.name || ""}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="e.g. Madhusudhan MP"
                  style={{ width: "100%", padding: "0.75rem", background: "#0b0c10", border: "1px solid #1e2230", color: "#fff", borderRadius: "6px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.3rem" }}>Organization Tier &amp; Category *</label>
                <select
                  value={editing.category || "Sales"}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  style={{ width: "100%", padding: "0.75rem", background: "#0b0c10", border: "1px solid #1e2230", color: "#fff", borderRadius: "6px", fontWeight: 700 }}
                >
                  <optgroup label="1. LEADERSHIP">
                    <option value="Leadership">1. Leadership</option>
                  </optgroup>
                  <optgroup label="2. TEAM (DEPARTMENTS)">
                    <option value="Sales">A. Sales</option>
                    <option value="Operations">B. Operations</option>
                    <option value="Installation">C. Installation</option>
                    <option value="Support Staff">D. Support Staff</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.3rem" }}>Designation / Title *</label>
                <input
                  type="text"
                  required
                  value={editing.designation || ""}
                  onChange={(e) => setEditing({ ...editing, designation: e.target.value })}
                  placeholder="e.g. Sales Specialist / Lead Installer"
                  style={{ width: "100%", padding: "0.75rem", background: "#0b0c10", border: "1px solid #1e2230", color: "#fff", borderRadius: "6px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.3rem" }}>Member Code (e.g. MM 01, KS 04)</label>
                <input
                  type="text"
                  value={editing.memberCode || ""}
                  onChange={(e) => setEditing({ ...editing, memberCode: e.target.value })}
                  placeholder="e.g. MM 01"
                  style={{ width: "100%", padding: "0.75rem", background: "#0b0c10", border: "1px solid #1e2230", color: "#fff", borderRadius: "6px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#d4af37", fontWeight: 700, marginBottom: "0.3rem" }}>Sequence # (Display Order)</label>
                <input
                  type="number"
                  value={editing.sequenceNumber ?? 1}
                  onChange={(e) => setEditing({ ...editing, sequenceNumber: parseInt(e.target.value) || 1 })}
                  style={{ width: "100%", padding: "0.75rem", background: "#0b0c10", border: "1px solid #d4af37", color: "#fff", borderRadius: "6px", fontWeight: 700 }}
                />
              </div>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.3rem" }}>Member Photo (Upload file or paste image URL)</label>
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

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.3rem" }}>Phone Number</label>
                <input
                  type="text"
                  value={editing.phone || ""}
                  onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                  placeholder="+91 88844 64444"
                  style={{ width: "100%", padding: "0.75rem", background: "#0b0c10", border: "1px solid #1e2230", color: "#fff", borderRadius: "6px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.3rem" }}>LinkedIn URL</label>
                <input
                  type="text"
                  value={editing.linkedin || ""}
                  onChange={(e) => setEditing({ ...editing, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                  style={{ width: "100%", padding: "0.75rem", background: "#0b0c10", border: "1px solid #1e2230", color: "#fff", borderRadius: "6px" }}
                />
              </div>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.3rem" }}>Biography / Role Description</label>
              <textarea
                rows={3}
                value={editing.bio || ""}
                onChange={(e) => setEditing({ ...editing, bio: e.target.value })}
                placeholder="Describe role, experience, achievements, and responsibilities..."
                style={{ width: "100%", padding: "0.75rem", background: "#0b0c10", border: "1px solid #1e2230", color: "#fff", borderRadius: "6px" }}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <button type="submit" style={{ padding: "0.75rem 1.6rem", background: "linear-gradient(135deg, #d4af37 0%, #aa820a 100%)", color: "#000", border: "none", borderRadius: "6px", fontWeight: 800, cursor: "pointer" }}>
                Save Member
              </button>
              <button type="button" onClick={() => setEditing(null)} style={{ padding: "0.75rem 1.6rem", background: "#1e2230", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Member Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {filteredTeam.length === 0 ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem 2rem", background: "#12141c", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)", color: "#94a3b8" }}>
              No team members found in the current selection.
            </div>
          ) : (
            filteredTeam.map((m) => {
              const isLeadership = (m.category || "Sales").toLowerCase() === "leadership";
              return (
                <div key={m.id || m.name} style={{ background: "linear-gradient(145deg, #1e2235 0%, #12141f 100%)", border: isLeadership ? "2px solid rgba(212,175,55,0.5)" : "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", padding: "1.6rem", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 10px 25px rgba(0,0,0,0.4)" }}>
                  <div>
                    <div style={{ display: "flex", gap: "1.2rem", alignItems: "center", marginBottom: "1rem" }}>
                      {m.photoUrl ? (
                        <img
                          src={m.photoUrl}
                          alt={m.name}
                          style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover", border: isLeadership ? "2px solid #d4af37" : "2px solid #3b82f6" }}
                        />
                      ) : (
                        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: isLeadership ? "linear-gradient(135deg, #d4af37 0%, #aa820a 100%)" : "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)", color: isLeadership ? "#000" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "1.3rem" }}>
                          {m.name ? m.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase() : "TM"}
                        </div>
                      )}
                      <div>
                        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.3rem" }}>
                          <span style={{ fontSize: "0.75rem", background: "linear-gradient(135deg, #d4af37 0%, #aa820a 100%)", color: "#000", padding: "0.2rem 0.6rem", borderRadius: "4px", fontWeight: 900 }}>
                            {m.memberCode || "TM"}
                          </span>
                          <span style={{ fontSize: "0.75rem", background: isLeadership ? "rgba(212,175,55,0.2)" : "rgba(59, 130, 246, 0.2)", color: isLeadership ? "#d4af37" : "#60a5fa", border: isLeadership ? "1px solid rgba(212,175,55,0.4)" : "1px solid rgba(59,130,246,0.4)", padding: "0.2rem 0.6rem", borderRadius: "4px", fontWeight: 800 }}>
                            {isLeadership ? "1. LEADERSHIP" : `2. TEAM · ${m.category?.toUpperCase() || "SALES"}`}
                          </span>
                          <span style={{ fontSize: "0.75rem", background: "rgba(255, 255, 255, 0.1)", color: "#cbd5e1", padding: "0.2rem 0.5rem", borderRadius: "4px", fontWeight: 700 }}>
                            Pos #{m.sequenceNumber || 1}
                          </span>
                        </div>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#ffffff", margin: "0.3rem 0" }}>{m.name}</h3>
                        <div style={{ color: "#d4af37", fontSize: "0.88rem", fontWeight: 700 }}>{m.designation}</div>
                      </div>
                    </div>
                    <p style={{ color: "#cbd5e1", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.2rem", fontWeight: 400 }}>{m.bio}</p>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem", paddingTop: "0.8rem", borderTop: "1px solid rgba(255,255,255,0.06)", flexWrap: "wrap", alignItems: "center" }}>
                    <button
                      onClick={() => handleMoveMember(m.id, "up")}
                      title="Move Up in Display Order"
                      style={{ padding: "0.45rem 0.8rem", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700 }}
                    >
                      ⬆️ Up
                    </button>
                    <button
                      onClick={() => handleMoveMember(m.id, "down")}
                      title="Move Down in Display Order"
                      style={{ padding: "0.45rem 0.8rem", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700 }}
                    >
                      ⬇️ Down
                    </button>
                    <button onClick={() => setEditing(m)} style={{ padding: "0.45rem 1rem", background: "#1e2230", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(m.id)} style={{ padding: "0.45rem 1rem", background: "rgba(239, 68, 68, 0.15)", color: "#f87171", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}>
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* REARRANGE TEAM ORDER MODAL */}
        {showRearrangeModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: "2rem" }}>
            <div style={{ background: "#12141c", border: "1px solid rgba(59, 130, 246, 0.4)", borderRadius: "14px", width: "100%", maxWidth: "800px", maxHeight: "90vh", overflowY: "auto", padding: "2rem", color: "#fff", boxShadow: "0 20px 50px rgba(0,0,0,0.9)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "1rem" }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800, color: "#60a5fa" }}>🔀 Rearrange Team Display Order</h2>
                  <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.85rem", color: "#94a3b8" }}>Set numerical positions to organize the exact visual flow on the live website.</p>
                </div>
                <button onClick={() => setShowRearrangeModal(false)} style={{ background: "none", border: "none", color: "#aaa", fontSize: "1.4rem", cursor: "pointer" }}>✕</button>
              </div>

              {/* Category selector within modal */}
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                <button
                  onClick={() => setRearrangeCategory("ALL")}
                  style={{
                    padding: "0.4rem 0.9rem",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    border: "1px solid " + (rearrangeCategory === "ALL" ? "#3b82f6" : "rgba(255,255,255,0.1)"),
                    background: rearrangeCategory === "ALL" ? "#3b82f6" : "#0b0c10",
                    color: "#fff",
                  }}
                >
                  ALL CATEGORIES
                </button>
                {ALL_SUB_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setRearrangeCategory(cat)}
                    style={{
                      padding: "0.4rem 0.9rem",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      border: "1px solid " + (rearrangeCategory === cat ? "#3b82f6" : "rgba(255,255,255,0.1)"),
                      background: rearrangeCategory === cat ? "#3b82f6" : "#0b0c10",
                      color: "#fff",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Reorder Table */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.5rem" }}>
                {rearrangeList
                  .filter((m) => rearrangeCategory === "ALL" || (m.category || "Sales").toLowerCase() === rearrangeCategory.toLowerCase())
                  .map((m, idx) => (
                    <div
                      key={m.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.8rem 1rem",
                        background: "#0b0c10",
                        border: "1px solid #1e2230",
                        borderRadius: "8px",
                        gap: "1rem"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1 }}>
                        <span style={{ fontWeight: 800, color: "#d4af37", width: "30px", fontSize: "0.95rem" }}>#{idx + 1}</span>
                        {m.photoUrl ? (
                          <img src={m.photoUrl} alt="" style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#1e2230", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 800, color: "#d4af37" }}>
                            {m.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{m.name}</div>
                          <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{m.designation} · <span style={{ color: "#60a5fa" }}>{m.category}</span></div>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <label style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Pos:</label>
                        <input
                          type="number"
                          value={m.sequenceNumber || (idx + 1)}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            setRearrangeList((prev) =>
                              prev.map((item) => (item.id === m.id ? { ...item, sequenceNumber: val } : item))
                            );
                          }}
                          style={{ width: "60px", padding: "0.4rem", background: "#12141c", border: "1px solid #3b82f6", color: "#fff", borderRadius: "4px", fontWeight: 800, textAlign: "center" }}
                        />
                      </div>
                    </div>
                  ))}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                <button
                  onClick={() => setShowRearrangeModal(false)}
                  style={{ padding: "0.75rem 1.4rem", background: "#1e2230", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    const sorted = [...rearrangeList].sort((a, b) => (a.sequenceNumber || 99) - (b.sequenceNumber || 99));
                    const normalized = sorted.map((m, i) => ({ ...m, sequenceNumber: i + 1 }));
                    setTeam(normalized);
                    await fetch("/api/team", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ type: "reorder", team: normalized }),
                    });
                    setShowRearrangeModal(false);
                    alert("Display order updated and saved live!");
                  }}
                  style={{ padding: "0.75rem 1.6rem", background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)", color: "#fff", border: "none", borderRadius: "6px", fontWeight: 800, cursor: "pointer" }}
                >
                  Save New Order
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
