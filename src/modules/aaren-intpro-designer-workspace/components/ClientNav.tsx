"use client";

import React from "react";
import Link from "next/link";
import { ClientData, WorkspaceProjectData } from "../types/workspace";
import { Building2, Layers, LogOut, ChevronDown, Sparkles } from "lucide-react";

interface ClientNavProps {
  client: ClientData | null;
  projects: WorkspaceProjectData[];
  selectedProject: WorkspaceProjectData | null;
  onSelectProject: (proj: WorkspaceProjectData | null) => void;
  onLogout: () => void;
}

export default function ClientNav({
  client,
  projects,
  selectedProject,
  onSelectProject,
  onLogout,
}: ClientNavProps) {
  return (
    <header
      style={{
        background: "#FAF9F6",
        borderBottom: "1px solid rgba(129, 102, 63, 0.2)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
      }}
    >
      <div
        style={{
          maxWidth: "1600px",
          margin: "0 auto",
          padding: "1.4rem 2.4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.4rem",
        }}
      >
        {/* Brand & Client Identity */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <Link
            href="/"
            style={{
              textDecoration: "none",
              color: "#81663F",
              fontFamily: "var(--font-jost), 'Jost', sans-serif",
              fontWeight: 700,
              fontSize: "1.4rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
            }}
          >
            AAREN <span style={{ fontSize: "1.1rem", color: "rgba(0,0,0,0.4)", fontWeight: 500 }}>| CLIENT PORTAL</span>
          </Link>

          {/* Client badge */}
          {client && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                background: "rgba(129, 102, 63, 0.08)",
                border: "1px solid rgba(129, 102, 63, 0.2)",
                padding: "0.4rem 1rem",
                borderRadius: "999px",
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "#81663F",
              }}
            >
              <Building2 size={13} />
              <span>{client.name}</span>
            </div>
          )}
        </div>

        {/* Project Selector & Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
          {projects.length > 0 && (
            <div style={{ position: "relative" }}>
              <select
                value={selectedProject?.id || "all"}
                onChange={(e) => {
                  if (e.target.value === "all") onSelectProject(null);
                  else {
                    const found = projects.find((p) => p.id === e.target.value);
                    if (found) onSelectProject(found);
                  }
                }}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(129, 102, 63, 0.3)",
                  borderRadius: "0.6rem",
                  padding: "0.7rem 2.8rem 0.7rem 1.2rem",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "#1C1917",
                  cursor: "pointer",
                  outline: "none",
                  appearance: "none",
                }}
              >
                <option value="all">📁 All Projects Dashboard</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    🏛️ {p.title} ({p.projectCode})
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                color="#81663F"
                style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
              />
            </div>
          )}

          <button
            onClick={onLogout}
            style={{
              background: "#FAF9F6",
              border: "1px solid rgba(129, 102, 63, 0.25)",
              color: "#81663F",
              padding: "0.7rem 1.4rem",
              borderRadius: "0.6rem",
              fontSize: "1.15rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              transition: "all 0.2s ease",
            }}
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
