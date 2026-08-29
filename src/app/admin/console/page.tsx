"use client";

import { useState } from "react";
import Link from "next/link";
import AdminNav from "@/components/AdminNav";
import { ShieldAlert, Server, Activity, Users, Key, ToggleLeft, ToggleRight, FileText, CheckCircle, RefreshCw, Cpu, Database } from "lucide-react";

export default function AdminConsolePage() {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "feature-flags" | "logs">("overview");

  const [featureFlags, setFeatureFlags] = useState({
    aiStudioGen: true,
    directFirebaseUpload: true,
    boqEngineV2: true,
    dealerMarginCalculator: true,
    cloudflareMcpBridge: true,
  });

  const toggleFlag = async (key: keyof typeof featureFlags) => {
    const enabled = !featureFlags[key];
    setFeatureFlags((prev) => ({ ...prev, [key]: enabled }));
    try {
      await fetch("/api/site-settings", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ action: "toggle_flag", key, enabled }) 
      });
    } catch (e) {
      console.error("Failed to toggle flag", e);
    }
  };

  const fetchAuditLogs = () => {
    // Dummy function as requested
    console.log('Fetching logs...');
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#FAF8F5" }}>
      <AdminNav />

      <main className="admin-main-content aaren-os-root" style={{ flex: 1, padding: "2.5rem 3rem", background: "#FAF8F5" }}>
      <style jsx global>{`
        :root {
          --navy: #FAF8F5;
          --navy-2: #F4EFE6;
          --surface: #FFFFFF;
          --surface-2: #FAF8F5;
          --border: #E2DCD2;
          --border-strong: #D5CEBF;
          --white: #1E1E1E;
          --slate: #555555;
          --slate-dim: #777777;
          --purple: #81663F;
          --purple-soft: rgba(129, 102, 63, 0.12);
          --blue: #1E1E1E;
          --radius-lg: 16px;
          --radius-md: 14px;
          --radius-sm: 8px;
          --shadow-glass: 0 4px 20px rgba(0, 0, 0, 0.04);
        }

        .aaren-os-root {
          background: var(--navy);
          color: var(--white);
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
        }

        .container {
          max-width: 1320px;
          margin: 0 auto;
          padding: 0;
        }

        .os-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border);
          flex-wrap: wrap;
          gap: 16px;
        }

        .os-title-group h1 {
          font-size: 32px;
          font-weight: 900;
          letter-spacing: -0.02em;
          color: var(--white);
          margin: 0 0 6px;
        }

        .os-title-group p {
          font-size: 14px;
          color: var(--slate);
          margin: 0;
        }

        .os-nav-tabs {
          display: flex;
          gap: 8px;
          background: var(--navy-2);
          padding: 6px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border);
        }

        .tab-btn {
          background: transparent;
          border: none;
          color: var(--slate);
          padding: 8px 18px;
          font-size: 13px;
          font-weight: 700;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab-btn.active {
          background: #81663F;
          color: #fff;
          box-shadow: 0 4px 12px rgba(129, 102, 63, 0.2);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }

        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .stat-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 20px;
          box-shadow: var(--shadow-glass);
        }

        .stat-card .label {
          font-size: 12px;
          font-weight: 800;
          color: var(--slate);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stat-card .val {
          font-size: 28px;
          font-weight: 900;
          color: var(--white);
        }

        .stat-card .sub {
          font-size: 12px;
          font-weight: 700;
          color: #15803D;
          margin-top: 6px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .panel-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: var(--shadow-glass);
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--border);
        }

        .panel-title {
          font-size: 16px;
          font-weight: 800;
          color: var(--white);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .flag-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 0;
          border-bottom: 1px solid var(--border);
        }

        .flag-row:last-child { border-bottom: none; }

        .flag-info h5 {
          font-size: 14px;
          font-weight: 800;
          color: var(--white);
          margin: 0 0 4px;
        }

        .flag-info p {
          font-size: 12px;
          color: var(--slate);
          margin: 0;
        }

        .toggle-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          color: #D5CEBF;
          transition: color 0.2s;
        }

        .toggle-btn.active {
          color: #81663F;
        }
      `}</style>

      <div className="container">
        {/* Header */}
        <div className="os-header">
          <div className="os-title-group">
            <h1>Admin Console & Tenant Control</h1>
            <p>System health monitoring, RBAC authorization, feature flags & audit trails for Aaren IntPro OS.</p>
          </div>

          <div className="os-nav-tabs">
            <button onClick={() => setActiveTab("overview")} className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}>
              Overview
            </button>
            <button onClick={() => setActiveTab("feature-flags")} className={`tab-btn ${activeTab === "feature-flags" ? "active" : ""}`}>
              Feature Flags
            </button>
            <button onClick={() => setActiveTab("users")} className={`tab-btn ${activeTab === "users" ? "active" : ""}`}>
              Tenant RBAC
            </button>
            <button onClick={() => setActiveTab("logs")} className={`tab-btn ${activeTab === "logs" ? "active" : ""}`}>
              Audit Logs
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="label">
              <Activity size={14} color="#7C3AED" /> System Status
            </div>
            <div className="val" style={{ color: "#10B981" }}>99.98%</div>
            <div className="sub">
              <CheckCircle size={12} /> All Nodes Operational
            </div>
          </div>

          <div className="stat-card">
            <div className="label">
              <Database size={14} color="#2563EB" /> Firebase RTDB Ping
            </div>
            <div className="val">24 ms</div>
            <div className="sub">
              <CheckCircle size={12} /> Sync Online
            </div>
          </div>

          <div className="stat-card">
            <div className="label">
              <Server size={14} color="#F59E0B" /> Storage Payload
            </div>
            <div className="val">Direct FB</div>
            <div className="sub">
              <CheckCircle size={12} /> Vercel Bypassed
            </div>
          </div>

          <div className="stat-card">
            <div className="label">
              <Users size={14} color="#EC4899" /> Active Tenants
            </div>
            <div className="val">1,248</div>
            <div className="sub">
              <CheckCircle size={12} /> +14 Today
            </div>
          </div>
        </div>

        {/* Panel Card: Feature Flags */}
        {activeTab === "feature-flags" || activeTab === "overview" ? (
          <div className="panel-card">
            <div className="panel-header">
              <h3 className="panel-title">
                <ToggleRight size={18} color="#7C3AED" /> Enterprise Feature Flags & Module Toggles
              </h3>
              <span style={{ fontSize: "12px", color: "var(--slate)" }}>Live Hot-Reload Enabled</span>
            </div>

            <div className="flag-row">
              <div className="flag-info">
                <h5>AI Studio & Generative Texture Pipeline</h5>
                <p>Enable AI interior rendering, material variation generator & WebGL shader tools.</p>
              </div>
              <button onClick={() => toggleFlag("aiStudioGen")} className={`toggle-btn ${featureFlags.aiStudioGen ? "active" : ""}`}>
                {featureFlags.aiStudioGen ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
              </button>
            </div>

            <div className="flag-row">
              <div className="flag-info">
                <h5>Direct Client-Side Firebase Storage Upload</h5>
                <p>Bypasses Vercel serverless 4.5MB limits, streaming PDFs up to 50MB+ directly from browser.</p>
              </div>
              <button onClick={() => toggleFlag("directFirebaseUpload")} className={`toggle-btn ${featureFlags.directFirebaseUpload ? "active" : ""}`}>
                {featureFlags.directFirebaseUpload ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
              </button>
            </div>

            <div className="flag-row">
              <div className="flag-info">
                <h5>BOQ & Specification Engine V2</h5>
                <p>Automated Bill of Quantities breakdown, margin calculations & multi-currency export.</p>
              </div>
              <button onClick={() => toggleFlag("boqEngineV2")} className={`toggle-btn ${featureFlags.boqEngineV2 ? "active" : ""}`}>
                {featureFlags.boqEngineV2 ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
              </button>
            </div>

            <div className="flag-row">
              <div className="flag-info">
                <h5>Cloudflare MCP Connector Bridge</h5>
                <p>OAuth2 S256 token bridge (stk_FGqjViXvW3nT8rcJTNfeGs) for automated AI tool invocation.</p>
              </div>
              <button onClick={() => toggleFlag("cloudflareMcpBridge")} className={`toggle-btn ${featureFlags.cloudflareMcpBridge ? "active" : ""}`}>
                {featureFlags.cloudflareMcpBridge ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
              </button>
            </div>
          </div>
        ) : null}

        {/* Panel Card: Audit Log */}
        {activeTab === "logs" || activeTab === "overview" ? (
          <div className="panel-card">
            <div className="panel-header">
              <h3 className="panel-title">
                <FileText size={18} color="#2563EB" /> System Audit Trail & Realtime Log Stream
              </h3>
              <button onClick={() => fetchAuditLogs()} style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--slate)", padding: "4px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                <RefreshCw size={12} /> Refresh Log
              </button>
            </div>

            <div style={{ fontFamily: "monospace", fontSize: "12.5px", color: "var(--slate)", background: "var(--navy-2)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border)" }}>
              <p style={{ margin: "0 0 8px", color: "#10B981" }}>[2026-08-09 16:29:40] AUTH_SUCCESS: User Google OAuth login succeeded for info@aarenintpro.com</p>
              <p style={{ margin: "0 0 8px", color: "#60A5FA" }}>[2026-08-09 16:25:12] STORAGE_UPLOAD: Direct Firebase REST upload success (catalogs/brand_catalog_formica.pdf, 18.4MB)</p>
              <p style={{ margin: "0 0 8px", color: "#A78BFA" }}>[2026-08-09 16:15:02] BLOG_REORDER: Admin sequence number updated for 6 active articles</p>
              <p style={{ margin: 0, color: "#F59E0B" }}>[2026-08-09 16:02:44] CLOUDFLARE_MCP: Token refresh cycle verified (stk_FGqjViXvW3nT8rcJTNfeGs)</p>
            </div>
          </div>
        ) : null}
      </div>
      </main>
    </div>
  );
}
