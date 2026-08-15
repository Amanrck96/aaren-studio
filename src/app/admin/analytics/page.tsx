"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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

  const BRAND_PERFORMANCE = [
    { name: "NewTechWood Composite", gmv: "₹4.8 Cr", orders: 142, growth: "+28.4%", share: "34%" },
    { name: "Formica Decorative Laminates", gmv: "₹3.2 Cr", orders: 310, growth: "+18.2%", share: "22%" },
    { name: "Fenix NTM Architectural", gmv: "₹2.6 Cr", orders: 98, growth: "+31.0%", share: "18%" },
    { name: "Mirage Italian Porcelain Slabs", gmv: "₹2.1 Cr", orders: 64, growth: "+14.5%", share: "15%" },
    { name: "Waltz Glass Partitions", gmv: "₹1.5 Cr", orders: 42, growth: "+22.1%", share: "11%" },
  ];

  const DESIGNER_TIME_METRICS = [
    { designer: "Anand M (Principal)", project: "Prestige Villa", hours: "142.5 hrs", billableRate: "₹3,500/hr", billableTotal: "₹4,98,750", activeStatus: "Tracking Now ⏱️" },
    { designer: "Ananya S (Senior Designer)", project: "Oak Residency Kitchen", hours: "88.0 hrs", billableRate: "₹3,000/hr", billableTotal: "₹2,64,000", activeStatus: "Active" },
    { designer: "Rohit K (3D Visualizer)", project: "Studio 42 Fitout", hours: "64.5 hrs", billableRate: "₹2,500/hr", billableTotal: "₹1,61,250", activeStatus: "Idle" },
    { designer: "Meera P (Specification Lead)", project: "Whitepine Reno", hours: "34.0 hrs", billableRate: "₹3,000/hr", billableTotal: "₹1,02,000", activeStatus: "Active" },
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
    <div className="aaren-os-root">
      <style jsx global>{`
        :root {
          --navy: #08111F;
          --navy-2: #0D1929;
          --surface: #101C30;
          --surface-2: #152238;
          --border: rgba(255, 255, 255, 0.08);
          --border-strong: rgba(255, 255, 255, 0.14);
          --white: #F8FAFC;
          --slate: #93A2B8;
          --slate-dim: #5E6E85;
          --gold: #81663F;
          --purple: #7C3AED;
          --blue: #2563EB;
          --radius-lg: 20px;
          --radius-md: 16px;
          --radius-sm: 10px;
          --shadow-glass: 0 8px 40px rgba(0, 0, 0, 0.45);
        }

        .aaren-os-root {
          background: var(--navy);
          color: var(--white);
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          padding-top: 40px;
          padding-bottom: 60px;
        }

        .container {
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 24px;
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
          font-weight: 800;
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
          font-weight: 600;
          border-radius: 4px;
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
        }

        .kpi-label {
          font-size: 11.5px;
          font-weight: 700;
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
          font-weight: 600;
          color: #10B981;
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
          font-weight: 700;
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
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--slate);
          padding: 12px 14px;
          border-bottom: 1px solid var(--border);
          background: var(--surface-2);
        }

        .brand-table td {
          font-size: 13px;
          color: var(--white);
          padding: 14px;
          border-bottom: 1px solid var(--border);
        }

        .brand-table tr:last-child td { border-bottom: none; }

        .btn-launch-os {
          background: #81663F;
          color: #fff;
          border: none;
          padding: 10px 18px;
          border-radius: var(--radius-sm);
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(129, 102, 63, 0.35);
        }

        .btn-launch-os:hover { background: #96774a; }
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

            <Link href="/modules/aaren-intpro-designer-workspace.html" target="_blank" className="btn-launch-os">
              <span>🚀 Launch Designer OS (Programa)</span>
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
            <div className="kpi-val">329.0 hrs</div>
            <div className="kpi-trend">
              <ArrowUpRight size={14} /> +42 hrs this week
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">
              <span>Billable Studio Value</span>
              <DollarSign size={16} color="#10B981" />
            </div>
            <div className="kpi-val">₹10,26,000</div>
            <div className="kpi-trend">
              <ArrowUpRight size={14} /> ₹3,120 avg hourly rate
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">
              <span>Specifications Active</span>
              <FileSpreadsheet size={16} color="#2563EB" />
            </div>
            <div className="kpi-val">128 Items</div>
            <div className="kpi-trend">
              <ArrowUpRight size={14} /> 94% Client approval rate
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">
              <span>Gross Spec Pipeline</span>
              <TrendingUp size={16} color="#EC4899" />
            </div>
            <div className="kpi-val">₹14.2 Cr</div>
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
    </div>
  );
}
