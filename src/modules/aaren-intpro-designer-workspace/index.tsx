"use client";

import React, { useState, useEffect } from "react";
import {
  ClientData,
  WorkspaceProjectData,
  ScheduleItemData,
  ScheduleStatus,
  ProjectDocumentData,
  InvoiceData,
} from "./types/workspace";
import ClientNav from "./components/ClientNav";
import ClientLoginCard from "./components/ClientLoginCard";
import ProjectsOverviewGrid from "./components/ProjectsOverviewGrid";
import ScheduleApprovalManager from "./components/ScheduleApprovalManager";
import CloudinaryUploadBlock from "./components/CloudinaryUploadBlock";
import InvoiceFinancialList from "./components/InvoiceFinancialList";
import { Layers, CheckSquare, FileText, CreditCard, ArrowLeft, RefreshCw } from "lucide-react";

export default function AarenDesignerWorkspace() {
  const [client, setClient] = useState<ClientData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<WorkspaceProjectData[]>([]);
  const [selectedProject, setSelectedProject] = useState<WorkspaceProjectData | null>(null);
  const [activeTab, setActiveTab] = useState<"approvals" | "documents" | "invoices">("approvals");

  // Load client session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("aaren_client_token");
    const savedClient = localStorage.getItem("aaren_client_data");

    if (savedToken && savedClient) {
      try {
        setClient(JSON.parse(savedClient));
        setToken(savedToken);
        fetchProjects(savedToken);
      } catch (e) {
        checkServerSession();
      }
    } else {
      checkServerSession();
    }
  }, []);

  const checkServerSession = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/workspace/auth");
      const json = await res.json();
      if (json.success && json.authenticated) {
        const cData = json.client || {
          id: json.user.clientId,
          name: json.user.name,
          email: json.user.email,
        };
        setClient(cData);
        setToken(cData.accessCode || cData.id);
        fetchProjects(cData.accessCode || cData.id);
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  const fetchProjects = async (authToken?: string) => {
    setLoading(true);
    try {
      const headers: any = {};
      if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

      const res = await fetch("/api/workspace/projects", { headers });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setProjects(json.data);
        if (json.client && !client) {
          setClient(json.client);
        }
      }
    } catch (e) {
      console.error("Failed to load workspace projects:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (clientData: ClientData, clientToken: string) => {
    setClient(clientData);
    setToken(clientToken);
    fetchProjects(clientToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("aaren_client_token");
    localStorage.removeItem("aaren_client_data");
    setClient(null);
    setToken(null);
    setProjects([]);
    setSelectedProject(null);
  };

  // Schedule status update
  const handleUpdateScheduleStatus = async (
    itemId: string,
    status: ScheduleStatus,
    comment?: string
  ) => {
    const headers: any = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch("/api/workspace/schedule", {
      method: "POST",
      headers,
      body: JSON.stringify({
        action: "update_status",
        scheduleItemId: itemId,
        status,
        comment,
      }),
    });

    const json = await res.json();
    if (json.success) {
      // Update in memory
      setProjects((prev) =>
        prev.map((p) => {
          if (!p.scheduleItems) return p;
          return {
            ...p,
            scheduleItems: p.scheduleItems.map((item) =>
              item.id === itemId ? { ...item, status } : item
            ),
          };
        })
      );

      if (selectedProject) {
        setSelectedProject((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            scheduleItems: (prev.scheduleItems || []).map((item) =>
              item.id === itemId ? { ...item, status } : item
            ),
          };
        });
      }
    }
  };

  // Add threaded comment
  const handleAddScheduleComment = async (itemId: string, text: string) => {
    const headers: any = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    await fetch("/api/workspace/schedule", {
      method: "POST",
      headers,
      body: JSON.stringify({
        action: "comment",
        scheduleItemId: itemId,
        comment: text,
      }),
    });
  };

  // Document upload callback
  const handleDocumentUploaded = (newDoc: ProjectDocumentData) => {
    if (selectedProject) {
      const updated = {
        ...selectedProject,
        documents: [newDoc, ...(selectedProject.documents || [])],
      };
      setSelectedProject(updated);
      setProjects((prev) =>
        prev.map((p) => (p.id === selectedProject.id ? updated : p))
      );
    }
  };

  // Stripe checkout call
  const handlePayInvoice = async (invoiceId: string): Promise<string | null> => {
    const headers: any = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch("/api/workspace/invoices", {
      method: "POST",
      headers,
      body: JSON.stringify({
        action: "pay_stripe",
        invoiceId,
      }),
    });

    const json = await res.json();
    if (json.success && json.url) {
      return json.url;
    }
    return null;
  };

  // Mark as paid
  const handleMarkPaid = async (invoiceId: string) => {
    const headers: any = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    await fetch("/api/workspace/invoices", {
      method: "POST",
      headers,
      body: JSON.stringify({
        action: "mark_paid",
        invoiceId,
      }),
    });

    // Update in memory
    if (selectedProject) {
      setSelectedProject((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          invoices: (prev.invoices || []).map((inv) =>
            inv.id === invoiceId ? { ...inv, status: "PAID" as const, paidAt: new Date() } : inv
          ),
        };
      });
    }

    setProjects((prev) =>
      prev.map((p) => ({
        ...p,
        invoices: (p.invoices || []).map((inv) =>
          inv.id === invoiceId ? { ...inv, status: "PAID" as const, paidAt: new Date() } : inv
        ),
      }))
    );
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#E6E2D8",
          fontFamily: "var(--font-jost), 'Jost', sans-serif",
        }}
      >
        <div style={{ textAlign: "center", color: "#81663F" }}>
          <RefreshCw size={32} className="animate-spin" style={{ margin: "0 auto 1.4rem" }} />
          <h3 style={{ fontSize: "1.8rem", fontWeight: 700, margin: 0 }}>
            Loading Aaren Design Workspace...
          </h3>
        </div>
      </div>
    );
  }

  // Not logged in -> Render login card
  if (!client) {
    return <ClientLoginCard onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#E6E2D8",
        color: "#1C1917",
        fontFamily: "var(--font-jost), 'Jost', sans-serif",
      }}
    >
      {/* Client Header */}
      <ClientNav
        client={client}
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={setSelectedProject}
        onLogout={handleLogout}
      />

      {/* Main Workspace Body */}
      {!selectedProject ? (
        // DASHBOARD OVERVIEW: All Projects Card Grid
        <ProjectsOverviewGrid
          projects={projects}
          onSelectProject={(proj) => {
            setSelectedProject(proj);
            setActiveTab("approvals");
          }}
          onOpenInvoices={() => {
            if (projects.length > 0) {
              setSelectedProject(projects[0]);
              setActiveTab("invoices");
            }
          }}
        />
      ) : (
        // SINGLE PROJECT WORKSPACE (Approvals, Documents, Invoices)
        <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "3rem 2.4rem 6rem" }}>
          {/* Project Title Bar */}
          <div
            style={{
              background: "#FAF9F6",
              borderRadius: "1.4rem",
              border: "1px solid rgba(129, 102, 63, 0.25)",
              padding: "2.4rem 2.8rem",
              marginBottom: "2.4rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1.6rem",
            }}
          >
            <div>
              <button
                onClick={() => setSelectedProject(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#81663F",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  marginBottom: "0.8rem",
                }}
              >
                <ArrowLeft size={14} /> Back to Projects Dashboard
              </button>
              <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#81663F", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {selectedProject.projectCode} • {selectedProject.category}
              </div>
              <h1 style={{ fontSize: "2.8rem", fontWeight: 800, color: "#1C1917", margin: "0.3rem 0 0", letterSpacing: "-0.02em" }}>
                {selectedProject.title}
              </h1>
            </div>

            {/* Tab navigation buttons */}
            <div style={{ display: "flex", background: "rgba(129, 102, 63, 0.08)", padding: "0.4rem", borderRadius: "0.8rem", gap: "0.4rem" }}>
              <button
                onClick={() => setActiveTab("approvals")}
                style={{
                  background: activeTab === "approvals" ? "#81663F" : "transparent",
                  color: activeTab === "approvals" ? "#FFFFFF" : "#5E5852",
                  border: "none",
                  padding: "0.8rem 1.6rem",
                  borderRadius: "0.6rem",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  transition: "all 0.2s ease",
                }}
              >
                <CheckSquare size={16} />
                <span>Approvals ({selectedProject.scheduleItems?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab("documents")}
                style={{
                  background: activeTab === "documents" ? "#81663F" : "transparent",
                  color: activeTab === "documents" ? "#FFFFFF" : "#5E5852",
                  border: "none",
                  padding: "0.8rem 1.6rem",
                  borderRadius: "0.6rem",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  transition: "all 0.2s ease",
                }}
              >
                <FileText size={16} />
                <span>Drawings & Files ({selectedProject.documents?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab("invoices")}
                style={{
                  background: activeTab === "invoices" ? "#81663F" : "transparent",
                  color: activeTab === "invoices" ? "#FFFFFF" : "#5E5852",
                  border: "none",
                  padding: "0.8rem 1.6rem",
                  borderRadius: "0.6rem",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  transition: "all 0.2s ease",
                }}
              >
                <CreditCard size={16} />
                <span>Invoices & Stripe ({selectedProject.invoices?.length || 0})</span>
              </button>
            </div>
          </div>

          {/* Active Tab View */}
          {activeTab === "approvals" && (
            <ScheduleApprovalManager
              items={selectedProject.scheduleItems || []}
              onUpdateStatus={handleUpdateScheduleStatus}
              onAddComment={handleAddScheduleComment}
            />
          )}

          {activeTab === "documents" && (
            <CloudinaryUploadBlock
              projectId={selectedProject.id}
              documents={selectedProject.documents || []}
              onUploadSuccess={handleDocumentUploaded}
            />
          )}

          {activeTab === "invoices" && (
            <InvoiceFinancialList
              invoices={selectedProject.invoices || []}
              onPayInvoice={handlePayInvoice}
              onMarkPaid={handleMarkPaid}
            />
          )}
        </div>
      )}
    </div>
  );
}
