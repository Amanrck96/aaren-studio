"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminNav from "@/components/AdminNav";
import {
  TrendingUp,
  DollarSign,
  PieChart,
  BarChart3,
  ArrowUpRight,
  Download,
  Calendar,
  Filter,
  Layers,
  ShoppingBag,
  Globe2,
  Sparkles,
  Clock,
  ShieldCheck,
  ExternalLink,
  Users,
  CheckCircle,
  FileSpreadsheet,
} from "lucide-react";

interface ActivityLogItem {
  id: string;
  user: string;
  email?: string;
  action: string;
  details: string;
  timestamp: string;
  timeAgo?: string;
}

export default function ExecutiveAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d");
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);

  const getMultiplier = (tr: string) => {
    switch (tr) {
      case "7d": return 0.25;
      case "90d": return 2.8;
      case "1y": return 11.5;
      default: return 1.0; // 30d
    }
  };

  const mult = getMultiplier(timeRange);
  const totalHours = (329.0 * mult).toFixed(1);
  const billableValue = Math.round(1026000 * mult).toLocaleString("en-IN");
  const specItems = Math.round(128 * mult);
  const gmvPipeline = (14.2 * mult).toFixed(1);

  const BRAND_PERFORMANCE = [
    { name: "NewTechWood Composite", gmv: `₹${(4.8 * mult).toFixed(1)} Cr`, orders: Math.round(142 * mult), growth: "+28.4%", share: "34%" },
    { name: "Formica Decorative Laminates", gmv: `₹${(3.2 * mult).toFixed(1)} Cr`, orders: Math.round(310 * mult), growth: "+18.2%", share: "22%" },
    { name: "Fenix NTM Architectural", gmv: `₹${(2.6 * mult).toFixed(1)} Cr`, orders: Math.round(98 * mult), growth: "+31.0%", share: "18%" },
    { name: "Mirage Italian Porcelain Slabs", gmv: `₹${(2.1 * mult).toFixed(1)} Cr`, orders: Math.round(64 * mult), growth: "+14.5%", share: "15%" },
    { name: "Waltz Glass Partitions", gmv: `₹${(1.5 * mult).toFixed(1)} Cr`, orders: Math.round(42 * mult), growth: "+22.1%", share: "11%" },
  ];

  const DESIGNER_TIME_METRICS = [
    { designer: "Anand M (Principal)", project: "Prestige Villa", hours: `${(142.5 * mult).toFixed(1)} hrs`, billableRate: "₹3,500/hr", billableTotal: `₹${Math.round(498750 * mult).toLocaleString("en-IN")}`, activeStatus: "Tracking Now ⏱️" },
    { designer: "Ananya S (Senior Designer)", project: "Oak Residency Kitchen", hours: `${(88.0 * mult).toFixed(1)} hrs`, billableRate: "₹3,000/hr", billableTotal: `₹${Math.round(264000 * mult).toLocaleString("en-IN")}`, activeStatus: "Active" },
    { designer: "Rohit K (3D Visualizer)", project: "Studio 42 Fitout", hours: `${(64.5 * mult).toFixed(1)} hrs`, billableRate: "₹2,500/hr", billableTotal: `₹${Math.round(161250 * mult).toLocaleString("en-IN")}`, activeStatus: "Idle" },
    { designer: "Meera P (Specification Lead)", project: "Whitepine Reno", hours: `${(34.0 * mult).toFixed(1)} hrs`, billableRate: "₹3,000/hr", billableTotal: `₹${Math.round(102000 * mult).toLocaleString("en-IN")}`, activeStatus: "Active" },
  ];

  useEffect(() => {
    try {
      const saved = localStorage.getItem("aaren_activity_logs");
      if (saved) {
        setLogs(JSON.parse(saved));
      } else {
        // Fallback default audit records
        setLogs([
          { id: "1", user: "Anand M", email: "anand.bj.7@gmail.com", action: "Logged Time (2.5 hrs)", details: "Kitchen & Bathroom Material Sourcing for Prestige Villa", timestamp: "Aug 15, 2026, 3:10 PM" },
          { id: "2", user: "Rohan Mehta", email: "rohan.mehta@gmail.com", action: "Client Approval: Aurora Sofa", details: "Client approved specification item at ₹1,84,000", timestamp: "Aug 15, 2026, 2:45 PM" },
          { id: "3", user: "Anand M", email: "anand.bj.7@gmail.com", action: "Clipped Product Added", details: "ViaVeneto Wall Mounted Vanity added to schedule", timestamp: "Aug 15, 2026, 2:15 PM" },
          { id: "4", user: "Ananya S", email: "ananya.s@aaren.com", action: "Exported PDF Schedule", details: "Generated printable PDF specification sheet for Prestige Villa", timestamp: "Aug 15, 2026, 11:30 AM" },
          { id: "5", user: "Admin", email: "admin@aaren.com", action: "Created Brand Collection", details: "Added 'Kitchen', 'Wardrobe', 'Door Systems' to Slashform", timestamp: "Aug 15, 2026, 9:20 AM" },
        ]);
      }
    } catch (e) {}
  }, []);

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
          --gold: #81663F;
          --purple: #7C3AED;
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
          font-size: 30px;
          font-weight: 900;
          letter-spacing: -0.02em;
          color: var(--white);
          margin: 0 0 6px;
        }

        .os-title-group p {
          font-size: 13.5px;
          color: var(--slate);
          margin: 0;
        }

        .os-nav-tabs {
          display: flex;
          gap: 6px;
          background: var(--navy-2);
          padding: 4px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border);
        }

        .tab-btn {
          background: transparent;
          border: none;
          color: var(--slate);
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 700;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab-btn.active {
          background: #81663F;
          color: #fff;
        }

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-bottom: 32px;
        }

        @media (max-width: 900px) {
          .kpi-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .kpi-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 20px;
          box-shadow: var(--shadow-glass);
        }

        .kpi-label {
          font-size: 11.5px;
          font-weight: 800;
          color: var(--slate);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .kpi-val {
          font-size: 28px;
          font-weight: 900;
          color: var(--white);
          margin-bottom: 4px;
        }

        .kpi-trend {
          font-size: 11.5px;
          font-weight: 700;
          color: #15803D;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .analytics-panel {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 24px;
          margin-bottom: 28px;
          box-shadow: var(--shadow-glass);
        }

        .panel-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--border);
          flex-wrap: wrap;
          gap: 10px;
        }

        .panel-head h3 {
          font-size: 16px;
          font-weight: 800;
          color: var(--white);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .brand-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .brand-table th {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #1E1E1E;
          padding: 12px 14px;
          border-bottom: 1px solid var(--border);
          background: var(--navy-2);
        }

        .brand-table td {
          font-size: 13px;
          color: var(--white);
          padding: 14px;
          border-bottom: 1px solid var(--border);
        }

        .brand-table tr:last-child td { border-bottom: none; }

        .btn-launch-os {
          background: #1E1E1E;
          color: #fff;
          border: none;
          padding: 10px 18px;
          border-radius: var(--radius-sm);
          font-size: 12.5px;
          font-weight: 800;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
        }

        .btn-launch-os:hover { background: #333333; }
      `}</style>

      <div className="container">
        {/* Header Bar */}
        <div className="os-header">
          <div className="os-title-group">
            <h1>⏱️ Designer Time & Activity Audit Hub</h1>
            <p>Admin surveillance & business intelligence: live hours logged, team audit trails, and GMV pipeline.</p>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div className="os-nav-tabs">
              <button onClick={() => setTimeRange("7d")} className={`tab-btn ${timeRange === "7d" ? "active" : ""}`}>7D</button>
              <button onClick={() => setTimeRange("30d")} className={`tab-btn ${timeRange === "30d" ? "active" : ""}`}>30D</button>
              <button onClick={() => setTimeRange("90d")} className={`tab-btn ${timeRange === "90d" ? "active" : ""}`}>90D</button>
              <button onClick={() => setTimeRange("1y")} className={`tab-btn ${timeRange === "1y" ? "active" : ""}`}>1Y</button>
            </div>

            <Link href="/login" target="_blank" className="btn-launch-os">
              <span>🚀 Launch Designer Workspace</span>
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-label">
              <span>Total Designer Hours</span>
              <Clock size={16} color="#81663F" />
            </div>
            <div className="kpi-val">{totalHours} hrs</div>
            <div className="kpi-trend">
              <ArrowUpRight size={14} /> Active timeframe: {timeRange.toUpperCase()}
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">
              <span>Billable Studio Value</span>
              <DollarSign size={16} color="#10B981" />
            </div>
            <div className="kpi-val">₹{billableValue}</div>
            <div className="kpi-trend">
              <ArrowUpRight size={14} /> ₹3,120 avg hourly rate
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">
              <span>Specifications Active</span>
              <FileSpreadsheet size={16} color="#2563EB" />
            </div>
            <div className="kpi-val">{specItems} Items</div>
            <div className="kpi-trend">
              <ArrowUpRight size={14} /> 94% Client approval rate
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">
              <span>Gross Spec Pipeline</span>
              <TrendingUp size={16} color="#EC4899" />
            </div>
            <div className="kpi-val">₹{gmvPipeline} Cr</div>
            <div className="kpi-trend">
              <ArrowUpRight size={14} /> 4 Live Villa projects
            </div>
          </div>
        </div>

        {/* 1. Designer Time Tracking & Project Hours */}
        <div className="analytics-panel">
          <div className="panel-head">
            <h3>
              <Clock size={18} color="#81663F" /> Live Designer Hours & Billable Rate Breakdown
            </h3>
            <span style={{ fontSize: "12px", color: "var(--slate)" }}>Real-time team time tracking logs</span>
          </div>

          <table className="brand-table">
            <thead>
              <tr>
                <th>Designer / Architect</th>
                <th>Assigned Project</th>
                <th>Hours Logged</th>
                <th>Billing Rate</th>
                <th>Billable Value</th>
                <th>Live Status</th>
              </tr>
            </thead>
            <tbody>
              {DESIGNER_TIME_METRICS.map((d, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 700 }}>{d.designer}</td>
                  <td>{d.project}</td>
                  <td>
                    <span style={{ fontWeight: 800, color: "#fff" }}>{d.hours}</span>
                  </td>
                  <td style={{ color: "var(--slate)" }}>{d.billableRate}</td>
                  <td style={{ fontWeight: 800, color: "#81663F" }}>{d.billableTotal}</td>
                  <td>
                    <span style={{
                      display: "inline-block",
                      padding: "3px 8px",
                      borderRadius: "20px",
                      fontSize: "11px",
                      fontWeight: 700,
                      background: d.activeStatus.includes("Tracking") ? "rgba(239, 68, 68, 0.2)" : "rgba(34, 197, 94, 0.15)",
                      color: d.activeStatus.includes("Tracking") ? "#f87171" : "#4ade80",
                    }}>
                      {d.activeStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 2. Admin Activity Audit Trail */}
        <div className="analytics-panel">
          <div className="panel-head">
            <h3>
              <ShieldCheck size={18} color="#10B981" /> Live Studio Audit Trail & Activity Feed
            </h3>
            <span style={{ fontSize: "12px", color: "var(--slate)" }}>Showing latest actions by team & clients</span>
          </div>

          <table className="brand-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User / Designer</th>
                <th>Action Performed</th>
                <th>Details & Changes</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.slice(0, 8).map((l, idx) => (
                <tr key={idx}>
                  <td style={{ fontSize: "11.5px", color: "var(--slate-dim)" }}>{l.timestamp}</td>
                  <td>
                    <strong style={{ color: "#fff" }}>{l.user}</strong>
                    {l.email && <div style={{ fontSize: "10.5px", color: "var(--slate-dim)" }}>{l.email}</div>}
                  </td>
                  <td>
                    <span style={{
                      display: "inline-block",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 700,
                      background: "rgba(129, 102, 63, 0.2)",
                      color: "#e8c89b",
                    }}>
                      {l.action}
                    </span>
                  </td>
                  <td style={{ color: "#cbd5e1", fontSize: "12.5px" }}>{l.details}</td>
                  <td>
                    <span style={{ color: "#22c55e", fontSize: "11px", fontWeight: 700 }}>✓ Verified</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3. Brand Partner Specification GMV */}
        <div className="analytics-panel">
          <div className="panel-head">
            <h3>
              <Layers size={18} color="#7C3AED" /> Brand & Material Revenue Breakdown
            </h3>
            <span style={{ fontSize: "12px", color: "var(--slate)" }}>Sorted by GMV Volume</span>
          </div>

          <table className="brand-table">
            <thead>
              <tr>
                <th>Brand Partner</th>
                <th>Spec GMV</th>
                <th>Order Quantity</th>
                <th>Growth (MoM)</th>
                <th>Market Share</th>
              </tr>
            </thead>
            <tbody>
              {BRAND_PERFORMANCE.map((b, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 700 }}>{b.name}</td>
                  <td style={{ fontWeight: 700, color: "#10B981" }}>{b.gmv}</td>
                  <td>{b.orders} orders</td>
                  <td style={{ color: "#60A5FA", fontWeight: 600 }}>{b.growth}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "80px", height: "6px", background: "var(--surface-2)", borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{ width: b.share, height: "100%", background: "#81663F" }} />
                      </div>
                      <span style={{ fontSize: "12px", color: "var(--slate)" }}>{b.share}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </main>
    </div>
  );
}
