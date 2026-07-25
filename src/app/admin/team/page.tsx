"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AdminNav from "@/components/AdminNav";
import { TeamMemberItem } from "@/lib/types";

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMemberItem[]>([]);
  const [pageDesc, setPageDesc] = useState("Meet the visionary leaders, surface specialists, and design engineers behind Aaren Studio.");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Partial<TeamMemberItem>>({
    name: "",
    designation: "Surface Specialist",
    memberCode: "MM 01",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    phone: "+91 98800 12345",
    bio: "",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    sequenceNumber: 1,
  });

  useEffect(() => {
    fetchTeam();
  }, []);

  async function fetchTeam() {
    setLoading(true);
    try {
      const res = await fetch("/api/team");
      const json = await res.json();
      if (json.success) setTeam(json.team);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "team", data: editingMember }),
      });
      const json = await res.json();
      if (json.success) {
        setShowModal(false);
        fetchTeam();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this team member?")) return;
    try {
      await fetch(`/api/team?id=${id}&type=team`, { method: "DELETE" });
      fetchTeam();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div style={{ background: "#0a0a0c", color: "#f0f0f2", minHeight: "100vh" }}>
      <AdminNav />

      <div style={{ maxWidth: "1200px", margin: "3rem auto", padding: "0 2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <span style={{ color: "#6366f1", fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>TEAM CONTROLS</span>
            <h1 style={{ fontSize: "2.2rem", fontWeight: 800, margin: "0.3rem 0" }}>Our Team Manager</h1>
            <p style={{ color: "#aaa", fontSize: "0.95rem" }}>Manage team member profiles, designations, member codes (MM 01), phone, bios, and social links.</p>
          </div>
          <button
            onClick={() => {
              setEditingMember({
                name: "",
                designation: "Surface Specialist",
                memberCode: `MM 0${team.length + 1}`,
                photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
                phone: "+91 98800 12345",
                bio: "",
                sequenceNumber: team.length + 1,
              });
              setShowModal(true);
            }}
            style={{ padding: "0.8rem 1.4rem", background: "#6366f1", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 700 }}
          >
            + Add Team Member
          </button>
        </div>

        {/* Intro Text Form */}
        <div style={{ background: "#141418", border: "1px solid #222", borderRadius: "10px", padding: "1.5rem", marginBottom: "2rem" }}>
          <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.4rem", fontWeight: 600 }}>Page Intro Description *</label>
          <input
            type="text"
            value={pageDesc}
            onChange={(e) => setPageDesc(e.target.value)}
            style={{ width: "100%", padding: "0.8rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
          />
        </div>

        {/* Team Grid */}
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#888" }}>Loading team profiles...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {team.map((member) => (
              <div key={member.id} style={{ background: "#141418", border: "1px solid #222", borderRadius: "10px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ position: "relative", height: "240px", background: "#222" }}>
                  <Image src={member.photoUrl} alt={member.name} fill style={{ objectFit: "cover" }} />
                  <span style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(0,0,0,0.8)", color: "#6366f1", padding: "0.3rem 0.6rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700 }}>
                    {member.memberCode}
                  </span>
                </div>
                <div style={{ padding: "1.2rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 0.2rem" }}>{member.name}</h3>
                    <div style={{ fontSize: "0.85rem", color: "#6366f1", fontWeight: 600, marginBottom: "0.6rem" }}>{member.designation}</div>
                    <p style={{ color: "#888", fontSize: "0.85rem", lineHeight: 1.4, margin: "0 0 0.8rem" }}>{member.bio}</p>
                    {member.phone && <div style={{ fontSize: "0.8rem", color: "#aaa" }}>📞 {member.phone}</div>}
                  </div>

                  <div style={{ display: "flex", gap: "0.8rem", borderTop: "1px solid #222", paddingTop: "0.8rem", marginTop: "1rem" }}>
                    <button
                      onClick={() => {
                        setEditingMember(member);
                        setShowModal(true);
                      }}
                      style={{ flex: 1, padding: "0.5rem", background: "#222", color: "#fff", border: "1px solid #333", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      style={{ padding: "0.5rem 0.8rem", background: "rgba(239,68,68,0.2)", color: "#f87171", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ background: "#141418", border: "1px solid #333", borderRadius: "12px", width: "100%", maxWidth: "550px", padding: "2rem", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>{editingMember.id ? "Edit Member" : "Add Team Member"}</h2>
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingMember.name || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Designation *</label>
                  <input
                    type="text"
                    required
                    value={editingMember.designation || ""}
                    onChange={(e) => setEditingMember({ ...editingMember, designation: e.target.value })}
                    style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Member Code (e.g. MM 01) *</label>
                  <input
                    type="text"
                    required
                    value={editingMember.memberCode || ""}
                    onChange={(e) => setEditingMember({ ...editingMember, memberCode: e.target.value })}
                    style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Photo URL *</label>
                <input
                  type="text"
                  required
                  value={editingMember.photoUrl || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, photoUrl: e.target.value })}
                  style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Contact / Phone Number</label>
                <input
                  type="text"
                  value={editingMember.phone || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                  style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.3rem" }}>Bio / Description</label>
                <textarea
                  rows={3}
                  value={editingMember.bio || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                  style={{ width: "100%", padding: "0.7rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: "0.7rem 1.2rem", background: "#222", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: "0.7rem 1.4rem", background: "#6366f1", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 700 }}>
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
