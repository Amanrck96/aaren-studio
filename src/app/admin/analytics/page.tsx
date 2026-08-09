"use client";

import { useState } from "react";
import Link from "next/link";
import { TrendingUp, DollarSign, PieChart, BarChart3, ArrowUpRight, Download, Calendar, Filter, Layers, ShoppingBag, Globe2, Sparkles } from "lucide-react";

export default function ExecutiveAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d");

  const BRAND_PERFORMANCE = [
    { name: "NewTechWood Composite", gmv: "₹4.8 Cr", orders: 142, growth: "+28.4%", share: "34%" },
    { name: "Formica Decorative Laminates", gmv: "₹3.2 Cr", orders: 310, growth: "+18.2%", share: "22%" },
    { name: "Fenix NTM Architectural", gmv: "₹2.6 Cr", orders: 98, growth: "+31.0%", share: "18%" },
    { name: "Mirage Italian Porcelain Slabs", gmv: "₹2.1 Cr", orders: 64, growth: "+14.5%", share: "15%" },
    { name: "Waltz Glass Partitions", gmv: "₹1.5 Cr", orders: 42, growth: "+22.1%", share: "11%" },
  ];

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
          --purple: #7C3AED;
          --purple-soft: rgba(124, 58, 237, 0.14);
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
          padding-top: 90px;
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
        }

        .os-title-group h1 {
          font-size: 32px;
          font-weight: 800;
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
          background: var(--purple);
          color: #fff;
        }

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }

        @media (max-width: 900px) {
          .kpi-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .kpi-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 22px;
        }

        .kpi-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--slate);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .kpi-val {
          font-size: 30px;
          font-weight: 800;
          color: var(--white);
          margin-bottom: 6px;
        }

        .kpi-trend {
          font-size: 12px;
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
          padding: 26px;
          margin-bottom: 28px;
        }

        .panel-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--border);
        }

        .panel-head h3 {
          font-size: 17px;
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
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
        }

        .brand-table td {
          font-size: 14px;
          color: var(--white);
          padding: 16px;
          border-bottom: 1px solid var(--border);
        }

        .brand-table tr:last-child td { border-bottom: none; }

        .btn-export {
          background: var(--purple);
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 14px rgba(124, 58, 237, 0.4);
        }

        .btn-export:hover { background: #6d28d9; }
      `}</style>

      <div className="container">
        {/* Header Bar */}
        <div className="os-header">
          <div className="os-title-group">
            <h1>Executive Analytics & Business Intelligence</h1>
            <p>Real-time GMV pipeline, brand specification conversions & regional revenue metrics across India.</p>
          </div>

          <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
            <div className="os-nav-tabs">
              <button onClick={() => setTimeRange("7d")} className={`tab-btn ${timeRange === "7d" ? "active" : ""}`}>7D</button>
              <button onClick={() => setTimeRange("30d")} className={`tab-btn ${timeRange === "30d" ? "active" : ""}`}>30D</button>
              <button onClick={() => setTimeRange("90d")} className={`tab-btn ${timeRange === "90d" ? "active" : ""}`}>90D</button>
              <button onClick={() => setTimeRange("1y")} className={`tab-btn ${timeRange === "1y" ? "active" : ""}`}>1Y</button>
            </div>

            <button className="btn-export">
              <Download size={15} /> Export Board Deck
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-label">
              <span>Gross Spec GMV</span>
              <TrendingUp size={16} color="#7C3AED" />
            </div>
            <div className="kpi-val">₹14.2 Cr</div>
            <div className="kpi-trend">
              <ArrowUpRight size={14} /> +24.8% vs last month
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">
              <span>Annual Recurring Revenue</span>
              <DollarSign size={16} color="#10B981" />
            </div>
            <div className="kpi-val">₹3.8 Cr</div>
            <div className="kpi-trend">
              <ArrowUpRight size={14} /> +19.2% ARR YoY
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">
              <span>Catalog Download Conversions</span>
              <BarChart3 size={16} color="#2563EB" />
            </div>
            <div className="kpi-val">3,420</div>
            <div className="kpi-trend">
              <ArrowUpRight size={14} /> 68% lead-to-RFI conversion
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">
              <span>Active Studio Accounts</span>
              <Globe2 size={16} color="#EC4899" />
            </div>
            <div className="kpi-val">1,248</div>
            <div className="kpi-trend">
              <ArrowUpRight size={14} /> 5 Metro hubs covered
            </div>
          </div>
        </div>

        {/* Brand Performance Table */}
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
                        <div style={{ width: b.share, height: "100%", background: "#7C3AED" }} />
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
