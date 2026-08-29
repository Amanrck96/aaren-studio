"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/AdminNav";
import { TeamMemberItem } from "@/lib/types";
import { uploadFileWithCompression } from "@/lib/uploadHelper";

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
  { id: "Accounts", label: "D. ACCOUNTS", match: "account" },
  { id: "Support Staff", label: "E. SUPPORT STAFF", match: "support staff" },
];

export const ALL_SUB_CATEGORIES = ["Leadership", "Sales", "Operations", "Installation", "Accounts", "Support Staff"];

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

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  const fetchTeam = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/team?t=" + Date.now(), { cache: "no-store" });
      const json = await res.json();
      if (json && json.success) {
        const teamList = json.team || (json.data && json.data.team) || (Array.isArray(json.data) ? json.data : []);
        teamList.sort((a: any, b: any) => (a.sequenceNumber || 99) - (b.sequenceNumber || 99));
        setTeam(teamList);
        if (json.joinBanner || (json.data && json.data.joinBanner)) {
          setJoinBanner(json.joinBanner || json.data.joinBanner);
        }
      } else {
        throw new Error(json.error || "Failed to fetch team data");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Error fetching team data.");
    } finally {
      setLoading(false);
    }
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
    try {
      await fetch(`/api/team?id=${id}`, { method: "DELETE" });
      fetchTeam();
    } catch (err) {
      console.error(err);
      alert("Error deleting team member.");
    }
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
    <div style={{ background: "#FAF8F5", color: "#1E1E1E", minHeight: "100vh", display: "flex" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem", background: "#FAF8F5" }}>
        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid #DCD5C6", paddingBottom: "1.2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span style={{ color: "#81663F", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 800 }}>ORGANIZATIONAL DIRECTORY</span>
            <h1 style={{ fontSize: "2.2rem", fontWeight: 900, margin: "0.2rem 0", color: "#1E1E1E" }}>Our Team CMS</h1>
            <p style={{ color: "#555555", fontSize: "0.95rem" }}>
              Manage and organize by <strong>1. Leadership</strong> and <strong>2. Team</strong> (Sales, Operations, Installation, Support Staff).
            </p>
          </div>
          {errorMsg && <div style={{ width: "100%", padding: "1rem", background: "#FEE2E2", color: "#DC2626", borderRadius: "8px", border: "1px solid #FCA5A5", fontWeight: 700 }}>{errorMsg}</div>}
          <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
            <button
              onClick={() => {
                setRearrangeList([...team].sort((a, b) => (a.sequenceNumber || 99) - (b.sequenceNumber || 99)));
                setShowRearrangeModal(true);
              }}
              style={{ padding: "0.75rem 1.4rem", background: "#F4EFE6", color: "#1E1E1E", border: "1px solid #D5CEBF", borderRadius: "8px", fontWeight: 800, cursor: "pointer", fontSize: "0.9rem" }}
            >
              🔀 Rearrange Order
            </button>
            <button
              onClick={() => setShowBannerForm(!showBannerForm)}
              style={{ padding: "0.75rem 1.4rem", background: "#FFFFFF", color: "#81663F", border: "1px solid #D5CEBF", borderRadius: "8px", fontWeight: 800, cursor: "pointer", fontSize: "0.9rem", boxShadow: "0 4px 14px rgba(0,0,0,0.04)" }}
            >
              ⚙️ Join Banner Settings
            </button>
            <button
              onClick={() => setEditing({ name: "", designation: "Sales Consultant", category: "Sales", memberCode: "TM " + String(team.length + 1).padStart(2, "0"), photoUrl: "", bio: "", sequenceNumber: team.length + 1 })}
              style={{ padding: "0.75rem 1.6rem", background: "#1E1E1E", color: "#FFFFFF", border: "none", borderRadius: "8px", fontWeight: 800, cursor: "pointer", fontSize: "0.9rem", boxShadow: "0 4px 14px rgba(0,0,0,0.12)" }}
            >
              + Add Team Member
            </button>
          </div>
        </div>

        {/* Join Banner Settings Drawer/Form */}
        {showBannerForm && (
          <form onSubmit={handleSaveBanner} style={{ background: "#FFFFFF", padding: "2rem", borderRadius: "16px", border: "1px solid #E2DCD2", marginBottom: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.4rem", color: "#81663F" }}>Join Creative Team Banner Settings</h2>
            <p style={{ fontSize: "0.85rem", color: "#555555", marginBottom: "1.5rem" }}>Customize the title text, font size, and contact details shown at the bottom of the Team page.</p>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Banner Heading Text *</label>
                <input
                  type="text"
                  required
                  value={joinBanner.title}
                  onChange={(e) => setJoinBanner({ ...joinBanner, title: e.target.value })}
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Heading Font Size *</label>
                <select
                  value={joinBanner.fontSize || "medium"}
                  onChange={(e) => setJoinBanner({ ...joinBanner, fontSize: e.target.value as any })}
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                >
                  <option value="small">Small (Compact)</option>
                  <option value="medium">Medium (Normal / Balanced - Recommended)</option>
                  <option value="large">Large (Prominent)</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Working Hours</label>
                <input
                  type="text"
                  value={joinBanner.hoursText}
                  onChange={(e) => setJoinBanner({ ...joinBanner, hoursText: e.target.value })}
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Phone Number</label>
                <input
                  type="text"
                  value={joinBanner.phone}
                  onChange={(e) => setJoinBanner({ ...joinBanner, phone: e.target.value })}
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Email Address</label>
                <input
                  type="text"
                  value={joinBanner.email}
                  onChange={(e) => setJoinBanner({ ...joinBanner, email: e.target.value })}
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Physical Address</label>
              <input
                type="text"
                value={joinBanner.address}
                onChange={(e) => setJoinBanner({ ...joinBanner, address: e.target.value })}
                style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                type="submit"
                disabled={savingBanner}
                style={{ padding: "0.75rem 1.6rem", background: "#1E1E1E", color: "#FFFFFF", border: "none", borderRadius: "8px", fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 14px rgba(0,0,0,0.12)" }}
              >
                {savingBanner ? "Saving..." : "Save Banner Settings"}
              </button>
              <button
                type="button"
                onClick={() => setShowBannerForm(false)}
                style={{ padding: "0.75rem 1.6rem", background: "#FAF8F5", color: "#1E1E1E", border: "1px solid #D5CEBF", borderRadius: "8px", cursor: "pointer", fontWeight: 700 }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* PRIMARY GROUP FILTER TABS (1. Leadership vs 2. Team) */}
        <div style={{ display: "flex", gap: "0.8rem", marginBottom: "1.2rem", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ color: "#81663F", fontSize: "0.85rem", fontWeight: 800, marginRight: "0.3rem" }}>ORGANIZATION TIER:</span>
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
                  padding: "0.6rem 1.3rem",
                  borderRadius: "8px",
                  fontSize: "0.88rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  border: "1px solid " + (isActive ? "#81663F" : "#D5CEBF"),
                  background: isActive ? "#81663F" : "#FFFFFF",
                  color: isActive ? "#FFFFFF" : "#1E1E1E",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
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
          <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1.8rem", alignItems: "center", flexWrap: "wrap", padding: "0.8rem 1.2rem", background: "#FFFFFF", borderRadius: "12px", border: "1px solid #E2DCD2", boxShadow: "0 4px 14px rgba(0,0,0,0.04)" }}>
            <span style={{ color: "#6A6359", fontSize: "0.82rem", fontWeight: 700, marginRight: "0.4rem" }}>TEAM DEPARTMENTS:</span>
            {TEAM_DEPARTMENTS.map((dept) => {
              const isActive = selectedDeptFilter === dept.id;
              const count = dept.id === "ALL" ? teamCount : team.filter((m) => (m.category || "").toLowerCase() === dept.match).length;
              return (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDeptFilter(dept.id)}
                  style={{
                    padding: "0.45rem 1rem",
                    borderRadius: "6px",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    border: "1px solid " + (isActive ? "#1E1E1E" : "#D5CEBF"),
                    background: isActive ? "#1E1E1E" : "#FAF8F5",
                    color: isActive ? "#FFFFFF" : "#1E1E1E",
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
          <form onSubmit={handleSave} style={{ background: "#FFFFFF", padding: "2rem", borderRadius: "16px", border: "1px solid #E2DCD2", marginBottom: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "1.2rem", color: "#81663F" }}>
              {editing.id ? "Edit Team Member" : "+ Add New Team Member"}
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Full Name *</label>
                <input
                  type="text"
                  required
                  value={editing.name || ""}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="e.g. Madhusudhan MP"
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Organization Tier &amp; Category *</label>
                <select
                  value={editing.category || "Sales"}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px", fontWeight: 700 }}
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
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Designation / Title *</label>
                <input
                  type="text"
                  required
                  value={editing.designation || ""}
                  onChange={(e) => setEditing({ ...editing, designation: e.target.value })}
                  placeholder="e.g. Sales Specialist / Lead Installer"
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Unique Member Code</label>
                <input
                  type="text"
                  value={editing.memberCode || ""}
                  onChange={(e) => setEditing({ ...editing, memberCode: e.target.value })}
                  placeholder="TM 01"
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Sequence Number</label>
                <input
                  type="number"
                  value={editing.sequenceNumber || ""}
                  onChange={(e) => setEditing({ ...editing, sequenceNumber: Number(e.target.value) })}
                  placeholder="1"
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                />
              </div>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Photo URL (Direct Link or Upload)</label>
              <div style={{ display: "flex", gap: "0.8rem" }}>
                <input
                  type="text"
                  value={editing.photoUrl || ""}
                  onChange={(e) => setEditing({ ...editing, photoUrl: e.target.value })}
                  placeholder="https://..."
                  style={{ flex: 1, padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                />
                <label style={{ padding: "0.75rem 1.4rem", background: isUploading ? "#aaa" : "#1E1E1E", color: "#fff", borderRadius: "8px", cursor: isUploading ? "wait" : "pointer", fontSize: "0.85rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.4rem", boxShadow: "0 4px 14px rgba(0,0,0,0.12)" }}>
                  {isUploading ? "Uploading..." : "Upload Photo"}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    disabled={isUploading}
                    onChange={async (e) => {
                      if (!e.target.files?.[0]) return;
                      setIsUploading(true);
                      try {
                        const result = await uploadFileWithCompression(e.target.files[0], "team");
                        if (result.success && result.url) {
                          setEditing((prev) => (prev ? { ...prev, photoUrl: result.url } : null));
                        } else {
                          alert("Upload error: " + (result.error || "Upload failed"));
                        }
                      } catch (err: any) {
                        alert("Upload failed: " + err.message);
                      } finally {
                        setIsUploading(false);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Phone Number</label>
                <input
                  type="text"
                  value={editing.phone || ""}
                  onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                  placeholder="+91 88844 64444"
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>LinkedIn URL</label>
                <input
                  type="text"
                  value={editing.linkedin || ""}
                  onChange={(e) => setEditing({ ...editing, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                />
              </div>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Biography / Role Description</label>
              <textarea
                rows={3}
                value={editing.bio || ""}
                onChange={(e) => setEditing({ ...editing, bio: e.target.value })}
                placeholder="Describe role, experience, achievements, and responsibilities..."
                style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <button type="submit" style={{ padding: "0.75rem 1.6rem", background: "#1E1E1E", color: "#FFFFFF", border: "none", borderRadius: "8px", fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 14px rgba(0,0,0,0.12)" }}>
                Save Member
              </button>
              <button type="button" onClick={() => setEditing(null)} style={{ padding: "0.75rem 1.6rem", background: "#FAF8F5", color: "#1E1E1E", border: "1px solid #D5CEBF", borderRadius: "8px", cursor: "pointer", fontWeight: 700 }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Member Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {filteredTeam.length === 0 ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem 2rem", background: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2DCD2", color: "#6A6359" }}>
              No team members found in the current selection.
            </div>
          ) : (
            filteredTeam.map((m) => {
              const isLeadership = (m.category || "Sales").toLowerCase() === "leadership";
              return (
                <div key={m.id || m.name} style={{ background: "#FFFFFF", border: isLeadership ? "2px solid #81663F" : "1px solid #E2DCD2", borderRadius: "16px", padding: "1.6rem", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
                  <div>
                    <div style={{ display: "flex", gap: "1.2rem", alignItems: "center", marginBottom: "1rem" }}>
                      {m.photoUrl ? (
                        <img
                          src={m.photoUrl}
                          alt={m.name}
                          style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover", border: isLeadership ? "2px solid #81663F" : "2px solid #1E1E1E" }}
                        />
                      ) : (
                        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: isLeadership ? "#81663F" : "#1E1E1E", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "1.3rem" }}>
                          {m.name ? m.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase() : "TM"}
                        </div>
                      )}
                      <div>
                        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.3rem" }}>
                          <span style={{ fontSize: "0.75rem", background: "rgba(129, 102, 63, 0.12)", color: "#81663F", border: "1px solid rgba(129, 102, 63, 0.25)", padding: "0.2rem 0.6rem", borderRadius: "4px", fontWeight: 800 }}>
                            {m.memberCode || "TM"}
                          </span>
                          <span style={{ fontSize: "0.75rem", background: isLeadership ? "rgba(129,102,63,0.12)" : "#FAF8F5", color: isLeadership ? "#81663F" : "#1E1E1E", border: isLeadership ? "1px solid rgba(129,102,63,0.25)" : "1px solid #D5CEBF", padding: "0.2rem 0.6rem", borderRadius: "4px", fontWeight: 800 }}>
                            {isLeadership ? "1. LEADERSHIP" : `2. TEAM · ${m.category?.toUpperCase() || "SALES"}`}
                          </span>
                          <span style={{ fontSize: "0.75rem", background: "#FAF8F5", color: "#6A6359", border: "1px solid #D5CEBF", padding: "0.2rem 0.5rem", borderRadius: "4px", fontWeight: 700 }}>
                            Pos #{m.sequenceNumber || 1}
                          </span>
                        </div>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#1E1E1E", margin: "0.3rem 0" }}>{m.name}</h3>
                        <div style={{ color: "#81663F", fontSize: "0.88rem", fontWeight: 700 }}>{m.designation}</div>
                      </div>
                    </div>
                    <p style={{ color: "#555555", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.2rem", fontWeight: 400 }}>{m.bio}</p>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem", paddingTop: "0.8rem", borderTop: "1px solid #EAE4D8", flexWrap: "wrap", alignItems: "center" }}>
                    <button
                      onClick={() => handleMoveMember(m.id, "up")}
                      title="Move Up in Display Order"
                      style={{ padding: "0.45rem 0.8rem", background: "#F4EFE6", color: "#1E1E1E", border: "1px solid #D5CEBF", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700 }}
                    >
                      ⬆️ Up
                    </button>
                    <button
                      onClick={() => handleMoveMember(m.id, "down")}
                      title="Move Down in Display Order"
                      style={{ padding: "0.45rem 0.8rem", background: "#F4EFE6", color: "#1E1E1E", border: "1px solid #D5CEBF", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700 }}
                    >
                      ⬇️ Down
                    </button>
                    <button onClick={() => setEditing(m)} style={{ padding: "0.45rem 1rem", background: "#1E1E1E", color: "#FFFFFF", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700 }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(m.id)} style={{ padding: "0.45rem 1rem", background: "#FEE2E2", color: "#DC2626", border: "1px solid #FCA5A5", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700 }}>
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
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: "2rem" }}>
            <div style={{ background: "#FFFFFF", border: "1px solid #DCD5C6", borderRadius: "16px", width: "100%", maxWidth: "800px", maxHeight: "90vh", overflowY: "auto", padding: "2rem", color: "#1E1E1E", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px solid #EAE4D8", paddingBottom: "1rem" }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800, color: "#81663F" }}>🔀 Rearrange Team Display Order</h2>
                  <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.85rem", color: "#555555" }}>Set numerical positions to organize the exact visual flow on the live website.</p>
                </div>
                <button onClick={() => setShowRearrangeModal(false)} style={{ background: "none", border: "none", color: "#6A6359", fontSize: "1.4rem", cursor: "pointer" }}>✕</button>
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
                    border: "1px solid " + (rearrangeCategory === "ALL" ? "#81663F" : "#D5CEBF"),
                    background: rearrangeCategory === "ALL" ? "#81663F" : "#FAF8F5",
                    color: rearrangeCategory === "ALL" ? "#FFFFFF" : "#1E1E1E",
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
                      border: "1px solid " + (rearrangeCategory === cat ? "#81663F" : "#D5CEBF"),
                      background: rearrangeCategory === cat ? "#81663F" : "#FAF8F5",
                      color: rearrangeCategory === cat ? "#FFFFFF" : "#1E1E1E",
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
                        background: "#FAF8F5",
                        border: "1px solid #E2DCD2",
                        borderRadius: "10px",
                        gap: "1rem"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1 }}>
                        <span style={{ fontWeight: 800, color: "#81663F", width: "30px", fontSize: "0.95rem" }}>#{idx + 1}</span>
                        {m.photoUrl ? (
                          <img src={m.photoUrl} alt="" style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#FAF8F5", border: "1px solid #D5CEBF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 800, color: "#81663F" }}>
                            {m.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#1E1E1E" }}>{m.name}</div>
                          <div style={{ fontSize: "0.78rem", color: "#555555" }}>{m.designation} · <span style={{ color: "#81663F" }}>{m.category}</span></div>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <label style={{ fontSize: "0.75rem", color: "#1E1E1E", fontWeight: 600 }}>Pos:</label>
                        <input
                          type="number"
                          value={m.sequenceNumber || (idx + 1)}
                          onChange={(e) => {
                            const val = isNaN(parseInt(e.target.value)) ? 1 : parseInt(e.target.value);
                            setRearrangeList((prev) =>
                              prev.map((item) => (item.id === m.id ? { ...item, sequenceNumber: val } : item))
                            );
                          }}
                          style={{ width: "60px", padding: "0.4rem", background: "#FFFFFF", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "6px", fontWeight: 800, textAlign: "center" }}
                        />
                      </div>
                    </div>
                  ))}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                <button
                  onClick={() => setShowRearrangeModal(false)}
                  style={{ padding: "0.75rem 1.4rem", background: "#FAF8F5", color: "#1E1E1E", border: "1px solid #D5CEBF", borderRadius: "8px", cursor: "pointer", fontWeight: 700 }}
                >
                  Cancel
                </button>
                <button
                  disabled={isSavingOrder}
                  onClick={async () => {
                    setIsSavingOrder(true);
                    try {
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
                    } catch (err) {
                      console.error(err);
                      alert("Error saving order");
                    } finally {
                      setIsSavingOrder(false);
                    }
                  }}
                  style={{ padding: "0.75rem 1.6rem", background: "#1E1E1E", color: "#FFFFFF", border: "none", borderRadius: "8px", fontWeight: 800, cursor: isSavingOrder ? "not-allowed" : "pointer", boxShadow: "0 4px 14px rgba(0,0,0,0.12)" }}
                >
                  {isSavingOrder ? "Saving..." : "Save New Order"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
