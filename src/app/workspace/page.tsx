"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { subscribeToAuth, trackUserActivity, logoutUser } from "@/lib/firebaseAuth";
import { User } from "firebase/auth";
import {
  Layers,
  Sparkles,
  FileSpreadsheet,
  ShoppingBag,
  Cpu,
  Users,
  Building2,
  PackageCheck,
  LogOut,
  FolderPlus,
  Compass,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const WORKSPACE_MODULES = [
  {
    title: "Designer Workspace & Digital Twin",
    desc: "Floor-by-floor project navigator, 3D Digital Twin, room-centric moodboards & task Kanban.",
    href: "/modules/aaren-intpro-designer-workspace.html",
    icon: Layers,
    badge: "Core OS",
    color: "#7C3AED",
  },
  {
    title: "Generative AI Studio",
    desc: "AI-driven texture generator, WebGL 3D material shaders, cost predictor & prompt render engine.",
    href: "/modules/aaren-intpro-ai-studio.html",
    icon: Sparkles,
    badge: "AI Powered",
    color: "#2563EB",
  },
  {
    title: "Moodboard, BOQ & Client Sign-Off",
    desc: "Drag-and-drop moodboards, automated Bill of Quantities (BOQ) with GST & digital client approvals.",
    href: "/modules/aaren-intpro-moodboard-boq-client.html",
    icon: FileSpreadsheet,
    badge: "BOQ Engine",
    color: "#10B981",
  },
  {
    title: "Architectural Product Marketplace",
    desc: "Source 10,000+ luxury veneers, composite decking, tiles & facades directly from Indian & European manufacturers.",
    href: "/modules/aaren-intpro-marketplace.html",
    icon: ShoppingBag,
    badge: "Marketplace",
    color: "#F59E0B",
  },
  {
    title: "Material Intelligence & Swatch Tracker",
    desc: "AI Material Advisor, sustainability score calculator, sample tracking & 2027 trend forecasts.",
    href: "/modules/aaren-intpro-material-intelligence.html",
    icon: Cpu,
    badge: "Intelligence",
    color: "#EC4899",
  },
  {
    title: "Community & Professional Network",
    desc: "Connect with 12,400+ verified architects, interior designers, facade consultants & vendors.",
    href: "/modules/aaren-intpro-community.html",
    icon: Users,
    badge: "Network",
    color: "#8B5CF6",
  },
  {
    title: "Brand Portal & Product Editor",
    desc: "Manufacturer dashboard for catalog management, lead CRM pipeline, product specifications & invoices.",
    href: "/modules/aaren-intpro-brand-portal-extension.html",
    icon: Building2,
    badge: "Brand Mfr",
    color: "#06B6D4",
  },
  {
    title: "Dealer & Distributor ERP",
    desc: "Inventory management, purchase order generation, GST invoices & architect lead dispatch.",
    href: "/modules/aaren-intpro-dealer-portal.html",
    icon: PackageCheck,
    badge: "Dealer ERP",
    color: "#14B8A6",
  },
];

export default function WorkspaceHubPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser?.email) {
        trackUserActivity(currentUser.email, "Launched Workspace Hub");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLaunchModule = (moduleTitle: string, href: string) => {
    if (user?.email) {
      trackUserActivity(user.email, `Opened Module: ${moduleTitle}`, `Path: ${href}`);
    }
    window.location.href = href;
  };

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="bg-[#08111F] text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs font-bold uppercase tracking-widest text-[#7C3AED]">Launching Aaren IntPro OS Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#08111F] text-slate-100 min-h-screen pt-24 pb-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* User Workspace Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 mb-10 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-white bg-[#7C3AED] px-3 py-1 rounded-full shadow-sm">
                AAREN INTPRO OS
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <ShieldCheck size={14} className="text-emerald-400" /> Active Member Session
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Welcome, {user?.displayName || user?.email?.split("@")[0] || "Designer"}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Your central interior architecture OS workspace. Design rooms, generate BOQs, source materials, and run AI studio renders.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleLaunchModule("Designer Workspace", "/modules/aaren-intpro-designer-workspace.html")}
              className="px-6 py-3 bg-[#7C3AED] hover:bg-[#6d28d9] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2"
            >
              <Compass size={15} /> Launch Studio OS →
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-3 bg-[#101C30] hover:bg-[#152238] text-slate-300 border border-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center gap-2"
            >
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </div>

        {/* Quick Action Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <button
            onClick={() => handleLaunchModule("New Project Wizard", "/modules/aaren-intpro-designer-workspace.html")}
            className="p-5 bg-[#101C30] border border-slate-800 hover:border-[#7C3AED] rounded-2xl text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/20 text-[#7C3AED] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FolderPlus size={20} />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Create New Project</h3>
            <p className="text-xs text-slate-400">Setup room digital twin, budget & material selection.</p>
          </button>

          <button
            onClick={() => handleLaunchModule("AI Studio Renders", "/modules/aaren-intpro-ai-studio.html")}
            className="p-5 bg-[#101C30] border border-slate-800 hover:border-[#2563EB] rounded-2xl text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#2563EB]/20 text-[#2563EB] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Sparkles size={20} />
            </div>
            <h3 className="text-base font-bold text-white mb-1">AI Render Studio</h3>
            <p className="text-xs text-slate-400">Generate 3D room renders & material variations.</p>
          </button>

          <button
            onClick={() => handleLaunchModule("Marketplace Catalog", "/modules/aaren-intpro-marketplace.html")}
            className="p-5 bg-[#101C30] border border-slate-800 hover:border-[#F59E0B] rounded-2xl text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ShoppingBag size={20} />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Browse Catalogues</h3>
            <p className="text-xs text-slate-400">Upload, download & spec verified products.</p>
          </button>
        </div>

        {/* Enterprise Modules Grid */}
        <h2 className="text-xl font-black uppercase tracking-wider text-white mb-6">
          ALL ENTERPRISE OS MODULES
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WORKSPACE_MODULES.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                onClick={() => handleLaunchModule(m.title, m.href)}
                className="bg-[#101C30] border border-slate-800 hover:border-slate-600 p-6 rounded-2xl cursor-pointer transition-all hover:-translate-y-1 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      style={{ background: `${m.color}20`, color: m.color }}
                      className="w-11 h-11 rounded-xl flex items-center justify-center font-bold"
                    >
                      <Icon size={22} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 bg-slate-800 px-2.5 py-1 rounded-md">
                      {m.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 leading-snug">{m.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{m.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-[#7C3AED]">
                  <span>Launch Module</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
