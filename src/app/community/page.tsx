"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquare, Users, Award, Share2, Search, Filter, Plus, ThumbsUp, Bookmark, Sparkles, Building2, MapPin, CheckCircle2 } from "lucide-react";

interface Post {
  id: string;
  author: string;
  avatar: string;
  role: string;
  location: string;
  time: string;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  verified?: boolean;
}

const COMMUNITY_POSTS: Post[] = [
  {
    id: "1",
    author: "Ar. Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    role: "Principal Architect • Studio Vanya",
    location: "Bengaluru",
    time: "2 hours ago",
    title: "Specifying WPC Composite Decking vs Natural Teak for Monsoon Heavy Terraces",
    content: "We just finished a 4,500 sq.ft rooftop villa terrace in Indiranagar. Switching from solid teak to NewTechWood Ultrashield composite cut maintenance downtime by 90% while keeping exact wood grain geometry. What clip systems are you using for high-wind uplift?",
    tags: ["Material Specification", "Outdoor Living", "BIM Details"],
    likes: 42,
    comments: 18,
    verified: true,
  },
  {
    id: "2",
    author: "Karan Mehta",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
    role: "Lead Interior Designer • Atelier Line",
    location: "Mumbai",
    time: "5 hours ago",
    title: "Looking for Acoustic Wall Panel Vendors with Class-A Fire Rating in Western India",
    content: "Working on a 120-seat luxury auditorium in BKC. Need fluted timber acoustic panels with minimum NRC 0.85 and FR certification. Recommendations for direct manufacturer supply?",
    tags: ["Vendor Sourcing", "Acoustics", "Commercial Interior"],
    likes: 29,
    comments: 12,
    verified: true,
  },
  {
    id: "3",
    author: "Rohan Varma",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    role: "Facade Consultant • Structural Edge",
    location: "Delhi NCR",
    time: "1 day ago",
    title: "Thermal Expansion Coefficients in Ultra-Thin Porcelain Slab Ventilated Facades",
    content: "A detailed technical breakdown of structural silicone vs hidden undercut anchor systems for 6mm large-format porcelain slabs on 15-story residential towers.",
    tags: ["Facade Engineering", "Porcelain Slabs", "Technical RFI"],
    likes: 85,
    comments: 34,
    verified: true,
  },
];

const PRO_DIRECTORY = [
  { name: "Ananya Roy", studio: "Studio Formwork", role: "Architect", city: "Bengaluru", projects: 28, verified: true },
  { name: "Vikramaditya Rao", studio: "Rao Design Co", role: "Interior Designer", city: "Hyderabad", projects: 45, verified: true },
  { name: "Neha Kapoor", studio: "Lumina Lighting", role: "Lighting Consultant", city: "Delhi", projects: 32, verified: true },
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<"feed" | "directory" | "rfis">("feed");
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState(COMMUNITY_POSTS);

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
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab-btn.active {
          background: var(--purple);
          color: #fff;
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
        }

        .grid-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 28px;
        }

        @media (max-width: 1024px) {
          .grid-layout { grid-template-columns: 1fr; }
        }

        .post-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 24px;
          margin-bottom: 20px;
          transition: border-color 0.2s;
        }

        .post-card:hover {
          border-color: var(--border-strong);
        }

        .author-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }

        .author-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--purple);
        }

        .author-info h4 {
          font-size: 15px;
          font-weight: 700;
          color: var(--white);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .author-info p {
          font-size: 12px;
          color: var(--slate);
          margin: 2px 0 0;
        }

        .post-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--white);
          margin: 0 0 10px;
          line-height: 1.4;
        }

        .post-content {
          font-size: 14.5px;
          color: var(--slate);
          line-height: 1.6;
          margin-bottom: 18px;
        }

        .tag-pill {
          display: inline-block;
          background: var(--surface-2);
          color: var(--slate);
          border: 1px solid var(--border);
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          margin-right: 8px;
          margin-bottom: 14px;
        }

        .post-actions {
          display: flex;
          align-items: center;
          gap: 20px;
          padding-top: 14px;
          border-top: 1px solid var(--border);
          font-size: 13px;
          color: var(--slate-dim);
        }

        .action-btn {
          background: transparent;
          border: none;
          color: var(--slate);
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.2s;
        }

        .action-btn:hover {
          color: var(--purple);
        }

        .sidebar-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 22px;
          margin-bottom: 20px;
        }

        .sidebar-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--white);
          margin: 0 0 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .pro-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid var(--border);
        }

        .pro-item:last-child { border-bottom: none; }

        .btn-create {
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

        .btn-create:hover { background: #6d28d9; }
      `}</style>

      <div className="container">
        {/* Header Bar */}
        <div className="os-header">
          <div className="os-title-group">
            <h1>Community & Professional Network</h1>
            <p>Connect with 12,400+ verified architects, interior designers, facade consultants & material vendors across India.</p>
          </div>

          <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
            <div className="os-nav-tabs">
              <button onClick={() => setActiveTab("feed")} className={`tab-btn ${activeTab === "feed" ? "active" : ""}`}>
                Feed & Discussions
              </button>
              <button onClick={() => setActiveTab("directory")} className={`tab-btn ${activeTab === "directory" ? "active" : ""}`}>
                Member Directory
              </button>
              <button onClick={() => setActiveTab("rfis")} className={`tab-btn ${activeTab === "rfis" ? "active" : ""}`}>
                Spec RFIs
              </button>
            </div>

            <button className="btn-create">
              <Plus size={16} /> New Post
            </button>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid-layout">
          {/* Feed Column */}
          <div>
            {posts.map((post) => (
              <div key={post.id} className="post-card">
                <div className="author-header">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.avatar} alt={post.author} className="author-avatar" />
                  <div className="author-info">
                    <h4>
                      {post.author} {post.verified && <CheckCircle2 size={14} className="text-purple-400" fill="#7C3AED" color="#fff" />}
                    </h4>
                    <p>{post.role} • {post.location} • {post.time}</p>
                  </div>
                </div>

                <h3 className="post-title">{post.title}</h3>
                <p className="post-content">{post.content}</p>

                <div>
                  {post.tags.map((t, idx) => (
                    <span key={idx} className="tag-pill">#{t}</span>
                  ))}
                </div>

                <div className="post-actions">
                  <button className="action-btn">
                    <ThumbsUp size={15} /> {post.likes} Likes
                  </button>
                  <button className="action-btn">
                    <MessageSquare size={15} /> {post.comments} Comments
                  </button>
                  <button className="action-btn" style={{ marginLeft: "auto" }}>
                    <Bookmark size={15} /> Save
                  </button>
                  <button className="action-btn">
                    <Share2 size={15} /> Share
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Sidebar */}
          <div>
            <div className="sidebar-card">
              <h3 className="sidebar-title">
                <Users size={16} color="#7C3AED" /> Top Verified Members
              </h3>
              {PRO_DIRECTORY.map((pro, idx) => (
                <div key={idx} className="pro-item">
                  <div>
                    <h5 style={{ fontSize: "14px", fontWeight: 700, margin: 0, color: "var(--white)" }}>{pro.name}</h5>
                    <p style={{ fontSize: "12px", color: "var(--slate)", margin: "2px 0 0" }}>{pro.studio} • {pro.city}</p>
                  </div>
                  <span style={{ marginLeft: "auto", fontSize: "11px", background: "var(--surface-2)", padding: "3px 8px", borderRadius: "4px", color: "var(--slate)" }}>
                    {pro.projects} specs
                  </span>
                </div>
              ))}
            </div>

            <div className="sidebar-card" style={{ background: "linear-gradient(135deg, var(--surface-2) 0%, var(--surface) 100%)" }}>
              <h3 className="sidebar-title" style={{ color: "#7C3AED" }}>
                <Sparkles size={16} /> Aaren Pro Verification
              </h3>
              <p style={{ fontSize: "13px", color: "var(--slate)", lineHeight: 1.5, margin: "0 0 14px" }}>
                Get your architectural studio verified to earn direct client RFI leads, priority swatch dispatch, and trade pricing access.
              </p>
              <button className="btn-create" style={{ width: "100%", justifyContent: "center" }}>
                Apply for Badge
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
