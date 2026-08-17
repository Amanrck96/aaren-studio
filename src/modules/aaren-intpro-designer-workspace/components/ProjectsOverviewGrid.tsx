"use client";

import React from "react";
import Image from "next/image";
import { WorkspaceProjectData } from "../types/workspace";
import { Layers, Clock, CheckCircle2, AlertCircle, FileText, ArrowRight, DollarSign } from "lucide-react";

interface ProjectsOverviewGridProps {
  projects: WorkspaceProjectData[];
  onSelectProject: (proj: WorkspaceProjectData) => void;
  onOpenInvoices: () => void;
}

export default function ProjectsOverviewGrid({
  projects,
  onSelectProject,
  onOpenInvoices,
}: ProjectsOverviewGridProps) {
  // Aggregate stats
  const totalProjects = projects.length;
  const allItems = projects.flatMap((p) => p.scheduleItems || []);
  const pendingApprovals = allItems.filter((i) => i.status === "PENDING" || i.status === "NEEDS_REVIEW").length;
  const approvedItems = allItems.filter((i) => i.status === "APPROVED").length;
  const allInvoices = projects.flatMap((p) => p.invoices || []);
  const unpaidInvoices = allInvoices.filter((inv) => inv.status === "UNPAID");
  const unpaidAmount = unpaidInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "3rem 2.4rem 6rem" }}>
      {/* Overview Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.6rem",
          marginBottom: "3.6rem",
        }}
      >
        <div
          style={{
            background: "#FAF9F6",
            border: "1px solid rgba(129, 102, 63, 0.2)",
            borderRadius: "1.2rem",
            padding: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "1.6rem",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "1rem",
              background: "rgba(129, 102, 63, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#81663F",
            }}
          >
            <Layers size={24} />
          </div>
          <div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#5E5852", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Active Projects
            </div>
            <div style={{ fontSize: "2.6rem", fontWeight: 800, color: "#81663F", lineHeight: 1.1 }}>
              {totalProjects}
            </div>
          </div>
        </div>

        <div
          style={{
            background: "#FAF9F6",
            border: "1px solid rgba(129, 102, 63, 0.2)",
            borderRadius: "1.2rem",
            padding: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "1.6rem",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "1rem",
              background: "rgba(245, 158, 11, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#D97706",
            }}
          >
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#5E5852", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Pending Approvals
            </div>
            <div style={{ fontSize: "2.6rem", fontWeight: 800, color: "#D97706", lineHeight: 1.1 }}>
              {pendingApprovals}
            </div>
          </div>
        </div>

        <div
          style={{
            background: "#FAF9F6",
            border: "1px solid rgba(129, 102, 63, 0.2)",
            borderRadius: "1.2rem",
            padding: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "1.6rem",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "1rem",
              background: "rgba(16, 185, 129, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#059669",
            }}
          >
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#5E5852", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Approved Specs
            </div>
            <div style={{ fontSize: "2.6rem", fontWeight: 800, color: "#059669", lineHeight: 1.1 }}>
              {approvedItems}
            </div>
          </div>
        </div>

        <div
          onClick={onOpenInvoices}
          style={{
            background: "#FAF9F6",
            border: "1px solid rgba(129, 102, 63, 0.2)",
            borderRadius: "1.2rem",
            padding: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "1.6rem",
            cursor: "pointer",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "1rem",
              background: "rgba(129, 102, 63, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#81663F",
            }}
          >
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#5E5852", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Pending Invoices ({unpaidInvoices.length})
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#81663F", lineHeight: 1.1 }}>
              ₹{unpaidAmount.toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div>
          <h2
            style={{
              fontFamily: "var(--font-jost), 'Jost', sans-serif",
              fontSize: "2.4rem",
              fontWeight: 700,
              color: "#81663F",
              margin: "0 0 0.4rem",
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
            }}
          >
            Your Curated Projects
          </h2>
          <p style={{ fontSize: "1.35rem", color: "#5E5852", margin: 0 }}>
            Select a project to review specification schedules, architectural drawings, and milestone sign-offs.
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div
          style={{
            background: "#FAF9F6",
            borderRadius: "1.2rem",
            border: "1px solid rgba(129, 102, 63, 0.2)",
            padding: "6rem 2rem",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "1.6rem", color: "#81663F", fontWeight: 700, margin: "0 0 0.8rem" }}>
            No Projects Linked Yet
          </p>
          <p style={{ fontSize: "1.35rem", color: "#5E5852", maxWidth: "42rem", margin: "0 auto 1.8rem" }}>
            Your Aaren Studio design team is preparing your project space. Please check back shortly or reach out to your lead architect.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
            gap: "2.4rem",
          }}
        >
          {projects.map((proj) => {
            const items = proj.scheduleItems || [];
            const pending = items.filter((i) => i.status === "PENDING" || i.status === "NEEDS_REVIEW").length;
            const approved = items.filter((i) => i.status === "APPROVED").length;
            const progress = items.length > 0 ? Math.round((approved / items.length) * 100) : 10;
            const img = proj.imageUrl || "/brands/brand_1_1.png";

            return (
              <div
                key={proj.id}
                onClick={() => onSelectProject(proj)}
                style={{
                  background: "#FAF9F6",
                  borderRadius: "1.2rem",
                  border: "1px solid rgba(129, 102, 63, 0.25)",
                  overflow: "hidden",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = "#81663F";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(129, 102, 63, 0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(129, 102, 63, 0.25)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.04)";
                }}
              >
                {/* Image Aspect Ratio 1920/1080 Container */}
                <div style={{ position: "relative", width: "100%", aspectRatio: "1920 / 1080", background: "#d8d4c8" }}>
                  <Image src={img} alt={proj.title} fill style={{ objectFit: "cover" }} unoptimized />
                  <div
                    style={{
                      position: "absolute",
                      top: "1.2rem",
                      left: "1.2rem",
                      background: "rgba(0, 0, 0, 0.75)",
                      backdropFilter: "blur(6px)",
                      color: "#FFFFFF",
                      padding: "0.4rem 0.8rem",
                      borderRadius: "0.4rem",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                    }}
                  >
                    {proj.projectCode}
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: "2rem", display: "flex", flexDirection: "column", flex: 1, gap: "1.4rem" }}>
                  <div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#81663F", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>
                      {proj.category}
                    </div>
                    <h3 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#1C1917", margin: 0, letterSpacing: "-0.01em" }}>
                      {proj.title}
                    </h3>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.15rem", fontWeight: 700, color: "#5E5852", marginBottom: "0.6rem" }}>
                      <span>Specification Approvals</span>
                      <span style={{ color: "#81663F" }}>{progress}% Complete</span>
                    </div>
                    <div style={{ height: "6px", width: "100%", background: "rgba(129, 102, 63, 0.15)", borderRadius: "999px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${progress}%`, background: "#81663F", borderRadius: "999px", transition: "width 0.5s ease" }} />
                    </div>
                  </div>

                  {/* Footer metadata */}
                  <div style={{ marginTop: "auto", paddingTop: "1.4rem", borderTop: "1px solid rgba(129, 102, 63, 0.15)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", gap: "1.2rem", fontSize: "1.15rem" }}>
                      {pending > 0 && (
                        <span style={{ color: "#D97706", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                          <AlertCircle size={13} /> {pending} Pending
                        </span>
                      )}
                      <span style={{ color: "#059669", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                        <CheckCircle2 size={13} /> {approved} Approved
                      </span>
                    </div>

                    <span style={{ color: "#81663F", fontWeight: 800, fontSize: "1.2rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                      Open Workspace <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
