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
    <div className="min-h-screen bg-[#080808] text-white pt-24 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-900 bg-neutral-950 p-6 hidden md:block">
        <div className="mb-10">
          <h2 className="text-xl font-black uppercase tracking-tight">AAREN CMS</h2>
          <span className="text-[10px] text-accent uppercase font-bold tracking-widest">{role} session active</span>
        </div>

        <nav className="space-y-4 text-sm font-semibold uppercase tracking-wider text-neutral-400">
          <a href="/admin/dashboard" className="flex items-center gap-3 text-white">
            <LayoutDashboard size={18} /> Dashboard
          </a>
          <a href="/admin/projects" className="flex items-center gap-3 hover:text-white transition-colors">
            <FolderKanban size={18} /> Projects
          </a>
          <a href="/admin/blogs" className="flex items-center gap-3 hover:text-white transition-colors">
            <FileEdit size={18} /> Journal Posts
          </a>
          <a href="/admin/careers" className="flex items-center gap-3 hover:text-white transition-colors">
            <Briefcase size={18} /> Open Roles
          </a>
          <button onClick={handleLogout} className="flex items-center gap-3 text-red-500 hover:text-red-400 mt-12">
            <LogOut size={18} /> Exit CMS
          </button>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 md:p-12">
        <h1 className="text-4xl font-black uppercase tracking-tight mb-8">DASHBOARD</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {dashboardStats.map((stat, idx) => (
            <div key={idx} className="border border-neutral-900 bg-neutral-950 p-6">
              <h4 className="text-xs uppercase tracking-wider font-bold text-neutral-500">{stat.title}</h4>
              <p className="text-3xl font-black mt-2 text-white">{stat.count}</p>
            </div>
          ))}
        </div>

        {/* Quick Operations Mocks */}
        <div className="border border-neutral-900 bg-neutral-950 p-8">
          <h2 className="text-xl font-bold uppercase mb-4">SYSTEM CONTROLS</h2>
          <p className="text-neutral-400 text-sm leading-relaxed mb-6 font-light">
            All dashboard databases are active. You can modify layouts, configure SEO parameters, edit project details, or add new articles.
          </p>
          <div className="flex gap-4">
            <a href="/admin/projects" className="px-6 py-3 bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-accent hover:text-white transition-colors">
              Manage Projects
            </a>
            <a href="/admin/blogs" className="px-6 py-3 border border-white/20 text-white font-bold uppercase tracking-wider text-xs hover:border-accent hover:text-accent transition-colors">
              Write New Blog
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
