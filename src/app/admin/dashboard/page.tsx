"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, FolderKanban, FileEdit, Briefcase, Settings, LogOut } from "lucide-react";

export default function AdminDashboard() {
  const [role, setRole] = useState("");
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem("aaren_admin_session");
    if (!session) {
      router.push("/admin/login");
    } else {
      setRole(session);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("aaren_admin_session");
    router.push("/admin/login");
  };

  const dashboardStats = [
    { title: "Active Projects", count: "12" },
    { title: "Journal Posts", count: "8" },
    { title: "Careers Openings", count: "3" },
    { title: "Job Applications", count: "14" },
  ];

  return (
    <div className="min-h-screen bg-[#eaeef4] text-[#1e1e1e] flex font-sans">
      {/* Sidebar */}
      <aside className="w-72 border-r border-black/10 bg-white/60 backdrop-blur-md p-8 hidden md:flex flex-col justify-between">
        <div>
          <div className="mb-12">
            <h2 className="text-2xl font-black uppercase tracking-tight text-[#1e1e1e] mb-1">AAREN CMS</h2>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/5 border border-black/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] text-black/60 uppercase font-black tracking-widest">{role || "Editor"}</span>
            </div>
          </div>

          <nav className="space-y-2 text-xs font-black uppercase tracking-widest">
            <a href="/admin/dashboard" className="flex items-center gap-3.5 px-4 py-3.5 rounded-lg bg-black text-white transition-all">
              <LayoutDashboard size={16} /> Dashboard
            </a>
            <a href="/admin/projects" className="flex items-center gap-3.5 px-4 py-3.5 rounded-lg text-black/60 hover:text-black hover:bg-black/5 transition-all">
              <FolderKanban size={16} /> Projects
            </a>
            <a href="/admin/blogs" className="flex items-center gap-3.5 px-4 py-3.5 rounded-lg text-black/60 hover:text-black hover:bg-black/5 transition-all">
              <FileEdit size={16} /> Journal Posts
            </a>
            <a href="/admin/careers" className="flex items-center gap-3.5 px-4 py-3.5 rounded-lg text-black/60 hover:text-black hover:bg-black/5 transition-all">
              <Briefcase size={16} /> Open Roles
            </a>
          </nav>
        </div>

        <button 
          onClick={handleLogout} 
          className="flex items-center justify-center gap-3 w-full py-3.5 border border-red-200 hover:border-red-500 bg-red-50/50 hover:bg-red-500 hover:text-white text-red-500 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
        >
          <LogOut size={16} /> Exit Portal
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 md:p-16 max-w-7xl mx-auto w-full">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12 pb-6 border-b border-black/10">
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#1e1e1e]">DASHBOARD</h1>
            <p className="text-xs uppercase tracking-wider text-black/40 mt-1 font-mono">Overview & administrative controls</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="md:hidden px-4 py-2 bg-red-500 text-white rounded text-xs font-bold uppercase tracking-wider"
          >
            Logout
          </button>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {dashboardStats.map((stat, idx) => (
            <div key={idx} className="bg-white border border-black/10 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <h4 className="text-[10px] uppercase tracking-widest font-black text-black/40">{stat.title}</h4>
              <p className="text-4xl font-black mt-3 text-[#1e1e1e] tracking-tight">{stat.count}</p>
            </div>
          ))}
        </section>

        {/* System controls */}
        <section className="bg-white border border-black/10 rounded-2xl p-8 md:p-12 shadow-sm">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-black uppercase tracking-tight text-[#1e1e1e] mb-4">SYSTEM CONTROLS</h2>
            <p className="text-black/60 text-sm leading-relaxed mb-8 font-medium">
              All active database grids are online. You can quickly add/remove items from your website, update current open job profiles, or compose new journal blogs using standard content editor panels.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="/admin/projects" className="px-8 py-4 bg-black text-white hover:bg-black/80 font-black uppercase tracking-wider text-xs rounded-lg transition-all shadow-sm">
                Manage Projects
              </a>
              <a href="/admin/blogs" className="px-8 py-4 border border-black/20 text-black hover:bg-black hover:text-white font-black uppercase tracking-wider text-xs rounded-lg transition-all">
                Write New Blog
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
