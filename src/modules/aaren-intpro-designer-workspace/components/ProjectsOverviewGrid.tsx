"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { WorkspaceProjectData, ClientData } from "../types/workspace";
import {
  Layers,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowRight,
  DollarSign,
  Plus,
  Sparkles,
  Building,
  Mail,
  X,
} from "lucide-react";

interface ProjectsOverviewGridProps {
  projects: WorkspaceProjectData[];
  client?: ClientData | null;
  token?: string | null;
  onSelectProject: (proj: WorkspaceProjectData) => void;
  onOpenInvoices: () => void;
  onProjectCreated?: (proj: WorkspaceProjectData) => void;
}

export default function ProjectsOverviewGrid({
  projects,
  client,
  token,
  onSelectProject,
  onOpenInvoices,
  onProjectCreated,
}: ProjectsOverviewGridProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Residential Architecture");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [creating, setCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Close modal on Escape key (M6 fix)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  // Aggregate stats
  const totalProjects = projects.length;
  const allItems = projects.flatMap((p) => p.scheduleItems || []);
  const pendingApprovals = allItems.filter((i) => i.status === "PENDING" || i.status === "NEEDS_REVIEW").length;
  const approvedItems = allItems.filter((i) => i.status === "APPROVED").length;
  const allInvoices = projects.flatMap((p) => p.invoices || []);
  const unpaidInvoices = allInvoices.filter((inv) => inv.status === "UNPAID");
  const unpaidAmount = unpaidInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg("Please enter a project title.");
      return;
    }

    let parsedBudget: number | undefined = undefined;
    if (budget.trim()) {
      const num = parseFloat(budget.trim());
      if (isNaN(num) || num < 0) {
        setErrorMsg("Please enter a valid positive number for the budget.");
        return;
      }
      parsedBudget = num;
    }

    setCreating(true);
    setErrorMsg(null);

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/workspace/projects", {
        method: "POST",
        headers,
        body: JSON.stringify({
          title: title.trim(),
          category,
          description: description.trim(),
          budget: parsedBudget,
        }),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok || !json || !json.success) {
        setErrorMsg(json?.error || "Failed to create project workspace.");
      } else {
        setIsModalOpen(false);
        setTitle("");
        setDescription("");
        setBudget("");
        if (onProjectCreated) {
          onProjectCreated(json.data);
        }
      }
    } catch {
      setErrorMsg("Network error while creating project.");
    } finally {
      setCreating(false);
    }
  };

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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2.4rem", flexWrap: "wrap", gap: "1.6rem" }}>
        <div>
          <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#81663F", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>
            {client?.name ? `Client: ${client.name}` : "Client Portfolio"}
          </div>
          <h2
            style={{
              fontFamily: "var(--font-jost), 'Jost', sans-serif",
              fontSize: "2.6rem",
              fontWeight: 800,
              color: "#1C1917",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Your Curated Workspaces
          </h2>
          <p style={{ fontSize: "1.35rem", color: "#5E5852", margin: "0.4rem 0 0" }}>
            Review material specification schedules, approve drawing packages, and sign off milestones.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            background: "#81663F",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "0.8rem",
            padding: "1.2rem 2.2rem",
            fontSize: "1.3rem",
            fontWeight: 700,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.8rem",
            boxShadow: "0 4px 14px rgba(129, 102, 63, 0.25)",
            transition: "all 0.2s ease",
          }}
        >
          <Plus size={18} />
          <span>+ Create New Project</span>
        </button>
      </div>

      {/* Projects Grid or New User Empty State */}
      {projects.length === 0 ? (
        <div
          style={{
            background: "#FAF9F6",
            borderRadius: "1.6rem",
            border: "1px solid rgba(129, 102, 63, 0.25)",
            padding: "5rem 3rem",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(129, 102, 63, 0.05)",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "rgba(129, 102, 63, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#81663F",
              margin: "0 auto 2rem",
            }}
          >
            <Sparkles size={32} />
          </div>

          <h3 style={{ fontSize: "2.4rem", fontWeight: 800, color: "#1C1917", margin: "0 0 1rem", letterSpacing: "-0.01em" }}>
            Welcome to Your Private Design Portal, {client?.name?.split(" ")[0] || "Client"}!
          </h3>

          <p style={{ fontSize: "1.45rem", color: "#5E5852", maxWidth: "56rem", margin: "0 auto 2.8rem", lineHeight: 1.6 }}>
            You do not have any active project workspaces yet. You can start your first project space right now to begin collaborating on 3D drawings, luxury material schedules, and milestone approvals.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "1.4rem", flexWrap: "wrap" }}>
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                background: "#81663F",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "0.8rem",
                padding: "1.4rem 3rem",
                fontSize: "1.4rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.8rem",
              }}
            >
              <Plus size={20} />
              <span>Start Your First Project Workspace</span>
            </button>

            <a
              href="mailto:leadarchitect@aarenstudio.com"
              style={{
                background: "#FFFFFF",
                color: "#81663F",
                border: "1px solid rgba(129, 102, 63, 0.4)",
                borderRadius: "0.8rem",
                padding: "1.4rem 2.4rem",
                fontSize: "1.35rem",
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.8rem",
              }}
            >
              <Mail size={18} />
              <span>Email Lead Architect Desk</span>
            </a>
          </div>
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
            const progress = items.length > 0 ? Math.round((approved / items.length) * 100) : 0;
            const img = proj.imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

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
                {/* Image Container */}
                <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", background: "#d8d4c8" }}>
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

      {/* CREATE PROJECT MODAL */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <div
            style={{
              background: "#FAF9F6",
              borderRadius: "1.6rem",
              border: "1px solid rgba(129, 102, 63, 0.3)",
              maxWidth: "540px",
              width: "100%",
              padding: "3.2rem",
              boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.6rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", color: "#81663F", fontWeight: 800, textTransform: "uppercase", fontSize: "1.1rem" }}>
                <Building size={16} /> New Design Workspace
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#5E5852" }}
              >
                <X size={20} />
              </button>
            </div>

            <h3 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#1C1917", margin: "0 0 0.8rem" }}>
              Start New Project Workspace
            </h3>
            <p style={{ fontSize: "1.3rem", color: "#5E5852", margin: "0 0 2rem" }}>
              Set up your private project to collaborate on drawings, approvals, and milestone invoices.
            </p>

            {errorMsg && (
              <div
                style={{
                  background: "rgba(220, 38, 38, 0.08)",
                  border: "1px solid rgba(220, 38, 38, 0.3)",
                  color: "#991B1B",
                  padding: "1rem",
                  borderRadius: "0.8rem",
                  fontSize: "1.2rem",
                  marginBottom: "1.6rem",
                }}
              >
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "1.15rem", fontWeight: 700, color: "#1C1917", marginBottom: "0.4rem" }}>
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Indiranagar Luxury Villa / BKC Corporate Suite"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "1.2rem",
                    borderRadius: "0.8rem",
                    border: "1px solid rgba(129, 102, 63, 0.3)",
                    background: "#FFFFFF",
                    fontSize: "1.3rem",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "1.15rem", fontWeight: 700, color: "#1C1917", marginBottom: "0.4rem" }}>
                  Space Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "1.2rem",
                    borderRadius: "0.8rem",
                    border: "1px solid rgba(129, 102, 63, 0.3)",
                    background: "#FFFFFF",
                    fontSize: "1.3rem",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="Residential Architecture">Residential Architecture & Villa</option>
                  <option value="Hospitality Architecture">Hospitality & Penthouse</option>
                  <option value="Commercial Architecture">Commercial Workspace & Corporate</option>
                  <option value="Retail & Showroom">Retail & Luxury Showroom</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "1.15rem", fontWeight: 700, color: "#1C1917", marginBottom: "0.4rem" }}>
                  Brief / Description (Optional)
                </label>
                <textarea
                  placeholder="Tell us about the scope, rooms, or spatial requirements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "1.2rem",
                    borderRadius: "0.8rem",
                    border: "1px solid rgba(129, 102, 63, 0.3)",
                    background: "#FFFFFF",
                    fontSize: "1.3rem",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "1.15rem", fontWeight: 700, color: "#1C1917", marginBottom: "0.4rem" }}>
                  Estimated Spatial Budget (INR)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 5000000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "1.2rem",
                    borderRadius: "0.8rem",
                    border: "1px solid rgba(129, 102, 63, 0.3)",
                    background: "#FFFFFF",
                    fontSize: "1.3rem",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    flex: 1,
                    background: "transparent",
                    color: "#5E5852",
                    border: "1px solid rgba(129, 102, 63, 0.3)",
                    borderRadius: "0.8rem",
                    padding: "1.2rem",
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  style={{
                    flex: 2,
                    background: "#81663F",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "0.8rem",
                    padding: "1.2rem",
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    cursor: creating ? "not-allowed" : "pointer",
                  }}
                >
                  {creating ? "Creating Workspace..." : "Create Workspace"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
