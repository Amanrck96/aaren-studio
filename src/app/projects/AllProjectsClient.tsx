"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export interface Project {
  id: string;
  slug: string;
  client: string;
  code: string;
  num: string;
  title: string;
  year: string;
  category: string;
  location: string;
  image: string;
  description: string;
  tags: string[];
}

const CATEGORIES = ["All", "Hospitality", "Residential", "Commercial", "Retail"];

interface Props {
  initialProjects: Project[];
}

export default function AllProjectsClient({ initialProjects }: Props) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [projectsList] = useState<Project[]>(initialProjects || []);

  const filteredProjects = projectsList.filter((project) => {
    const matchesCategory = activeFilter === "All" || project.category === activeFilter;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const hoveredData = projectsList.find((p) => p.slug === hoveredProject);

  return (
    <div className="projects-page" onMouseMove={handleMouseMove}>
      {/* Floating Hover Image Preview for List View */}
      {viewMode === "list" && (
        <div
          className="projects-float-preview"
          style={{
            left: mousePos.x > (typeof window !== "undefined" ? window.innerWidth / 2 : 500) ? "auto" : mousePos.x + 30,
            right: mousePos.x > (typeof window !== "undefined" ? window.innerWidth / 2 : 500) ? (typeof window !== "undefined" ? window.innerWidth - mousePos.x + 30 : 0) : "auto",
            top: mousePos.y - 120,
            opacity: hoveredProject ? 1 : 0,
            transform: hoveredProject ? "translateY(0) scale(1)" : "translateY(12px) scale(0.96)",
          }}
        >
          {hoveredData && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hoveredData.image}
              alt={hoveredData.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
        </div>
      )}

      {/* ── Page Header ── */}
      <section className="projects-header">
        <div className="projects-header__inner">
          <div className="projects-header__meta t-tag" style={{ color: "#81663F", fontWeight: 700, letterSpacing: "0.12em", marginBottom: "1.6rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>CURATED PORTFOLIO</span>
            <span className="projects-count">[{filteredProjects.length} PROJECTS]</span>
          </div>
          <h1 className="projects-title" style={{ color: "#81663F" }}>ALL PROJECTS</h1>
          <p className="projects-desc t-body" style={{ color: "rgba(0,0,0,0.65)", maxWidth: "58rem", fontSize: "1.6rem", lineHeight: 1.6 }}>
            Explore spatial experiences, bespoke interior architectures, and luxury material installations crafted for prestigious clients across India & globally.
          </p>

        {/* Toolbar: Category tabs + Search + View switcher */}
        <div className="projects-toolbar">
          <div className="projects-categories">
            {CATEGORIES.map((cat) => {
              const count = cat === "All" ? projectsList.length : projectsList.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`cat-btn ${activeFilter === cat ? "is-active" : ""}`}
                >
                  {cat} <span className="cat-count">({count})</span>
                </button>
              );
            })}
          </div>

          <div className="projects-actions">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search projects, clients, materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="search-clear">
                  ✕
                </button>
              )}
            </div>

            <div className="view-switcher">
              <button
                onClick={() => setViewMode("grid")}
                className={`view-btn ${viewMode === "grid" ? "is-active" : ""}`}
                title="Grid View"
              >
                GRID
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`view-btn ${viewMode === "list" ? "is-active" : ""}`}
                title="List View"
              >
                LIST
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* ── Content: Grid or List View ── */}
      <section className="projects-content">
        {filteredProjects.length === 0 ? (
          <div className="projects-empty">
            <p>No projects match your filter or search query.</p>
            <button
              onClick={() => {
                setActiveFilter("All");
                setSearchQuery("");
              }}
              className="projects-reset-btn"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <article key={project.id} className="p-card">
                {/* Image Wrap */}
                <div className="p-card__media">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="p-card__img"
                    unoptimized
                  />
                  <div className="p-card__overlay">
                    <span className="p-card__category-tag">{project.category}</span>
                  </div>
                </div>

                {/* Meta & Info */}
                <div className="p-card__info">
                  <div className="p-card__header">
                    <span className="p-card__code-badge">{project.code} {project.num}</span>
                    <span className="p-card__year">{project.year}</span>
                  </div>

                  <h3 className="p-card__title">{project.title}</h3>
                  <p className="p-card__client">{project.client} · {project.location}</p>
                  <p className="p-card__desc">{project.description}</p>

                  {/* Tags */}
                  <div className="p-card__tags">
                    {project.tags.map((tag) => (
                      <span key={tag} className="p-card__tag">#{tag}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="projects-list">
            <div className="p-list-header">
              <span className="col-idx">CODE</span>
              <span className="col-title">PROJECT / CLIENT</span>
              <span className="col-cat">CATEGORY</span>
              <span className="col-loc">LOCATION</span>
              <span className="col-year">YEAR</span>
            </div>

            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="p-list-row"
                onMouseEnter={() => setHoveredProject(project.slug)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <span className="col-idx">{project.code} {project.num}</span>
                <span className="col-title">
                  <strong className="p-list-name">{project.title}</strong>
                  <span className="p-list-sub">{project.client}</span>
                </span>
                <span className="col-cat">{project.category}</span>
                <span className="col-loc">{project.location}</span>
                <span className="col-year">{project.year}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Bottom Section: Call to action ── */}
      <section className="projects-footer-cta">
        <div className="projects-footer-cta__inner">
          <span className="t-tag" style={{ color: "#81663F", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: "1rem" }}>
            SPECIFY FOR YOUR NEXT SPACE
          </span>
          <h2 className="projects-cta-title">HAVE A BESPOKE ARCHITECTURAL REQUIREMENT?</h2>
          <p className="projects-cta-desc">
            Collaborate with Aaren Intpro on materials, full-scale finishes, technical specifications, and delivery coordination.
          </p>
          <div className="projects-cta-actions">
            <Link href="/contact" className="projects-primary-btn">
              DISCUSS YOUR PROJECT →
            </Link>
            <Link href="/brands" className="projects-secondary-btn">
              EXPLORE OUR BRANDS
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .projects-page {
          background: #E6E2D8;
          color: #1e1e1e;
          min-height: 100vh;
          padding-top: 8rem;
        }

        .projects-header {
          padding: 6rem 2.4rem 3rem;
          border-bottom: 0.1rem solid rgba(129, 102, 63, 0.2);
        }

        @media (min-width: 768px) {
          .projects-header {
            padding: 8rem 3.2rem 4rem;
          }
        }

        .projects-header__inner {
          max-width: 1600px;
          margin: 0 auto;
        }

        .projects-title {
          font-size: clamp(5rem, 12vw, 18rem);
          font-weight: 700;
          letter-spacing: -0.05em;
          line-height: 0.88;
          text-transform: uppercase;
          margin-bottom: 2rem;
        }

        .projects-toolbar {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          margin-top: 4rem;
        }

        @media (min-width: 1024px) {
          .projects-toolbar {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }

        .projects-categories {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
        }

        .cat-btn {
          font-family: inherit;
          font-size: 1.2rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 0.8rem 1.6rem;
          background: rgba(129, 102, 63, 0.08);
          border: 0.1rem solid rgba(129, 102, 63, 0.2);
          color: #1e1e1e;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cat-btn:hover {
          background: rgba(129, 102, 63, 0.15);
        }

        .cat-btn.is-active {
          background: #81663F;
          color: #E6E2D8;
          border-color: #81663F;
        }

        .cat-count {
          opacity: 0.6;
          font-size: 1rem;
          margin-left: 0.3rem;
        }

        .projects-actions {
          display: flex;
          align-items: center;
          gap: 1.6rem;
          flex-wrap: wrap;
        }

        .search-box {
          position: relative;
          min-width: 260px;
        }

        .search-input {
          width: 100%;
          font-family: inherit;
          font-size: 1.3rem;
          padding: 0.9rem 3rem 0.9rem 1.4rem;
          background: rgba(255, 255, 255, 0.5);
          border: 0.1rem solid rgba(129, 102, 63, 0.25);
          border-radius: 4px;
          color: #1e1e1e;
          outline: none;
          transition: border-color 0.2s ease, background 0.2s ease;
        }

        .search-input:focus {
          border-color: #81663F;
          background: #fff;
        }

        .search-clear {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: rgba(0, 0, 0, 0.4);
          cursor: pointer;
          font-size: 1.2rem;
        }

        .view-switcher {
          display: flex;
          border: 0.1rem solid rgba(129, 102, 63, 0.3);
          border-radius: 4px;
          overflow: hidden;
        }

        .view-btn {
          font-family: inherit;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          padding: 0.8rem 1.6rem;
          background: transparent;
          border: none;
          color: rgba(0, 0, 0, 0.6);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .view-btn.is-active {
          background: #1e1e1e;
          color: #E6E2D8;
        }

        /* ── Grid View ── */
        .projects-content {
          padding: 4rem 2.4rem 6rem;
          max-width: 1600px;
          margin: 0 auto;
        }

        @media (min-width: 768px) {
          .projects-content {
            padding: 5rem 3.2rem 8rem;
          }
        }

        .projects-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3.2rem;
        }

        @media (min-width: 768px) {
          .projects-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 4rem;
          }
        }

        @media (min-width: 1280px) {
          .projects-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 4.8rem;
          }
        }

        .p-card {
          display: flex;
          flex-direction: column;
          background: #E6E2D8;
          border: 0.1rem solid rgba(129, 102, 63, 0.2);
          border-radius: 6px;
          overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
        }

        .p-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.08);
          border-color: rgba(129, 102, 63, 0.4);
        }

        .p-card__media {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          background: #d8d4c8;
          overflow: hidden;
        }

        .p-card__img {
          object-fit: cover;
          transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        .p-card:hover .p-card__img {
          transform: scale(1.05);
        }

        .p-card__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, transparent 60%);
          display: flex;
          align-items: flex-end;
          padding: 1.6rem;
        }

        .p-card__category-tag {
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: rgba(255, 255, 255, 0.9);
          color: #1e1e1e;
          padding: 0.4rem 1rem;
          border-radius: 4px;
        }

        .p-card__info {
          padding: 2rem 2.2rem 2.4rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          flex: 1;
        }

        .p-card__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .p-card__code-badge {
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #81663F;
        }

        .p-card__year {
          font-size: 1.1rem;
          color: rgba(0, 0, 0, 0.4);
        }

        .p-card__title {
          font-size: 2rem;
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.02em;
          color: #1e1e1e;
          margin: 0;
        }

        .p-card__client {
          font-size: 1.2rem;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.6);
          margin: 0;
        }

        .p-card__desc {
          font-size: 1.3rem;
          line-height: 1.5;
          color: rgba(0, 0, 0, 0.7);
          margin: 0.4rem 0 1rem;
        }

        .p-card__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          margin-top: auto;
        }

        .p-card__tag {
          font-size: 1.1rem;
          color: rgba(129, 102, 63, 0.9);
          font-weight: 500;
        }

        /* ── List View ── */
        .projects-list {
          display: flex;
          flex-direction: column;
          width: 100%;
          border-top: 0.1rem solid rgba(129, 102, 63, 0.2);
        }

        .p-list-header {
          display: grid;
          grid-template-columns: 8rem 2fr 1.2fr 1.2fr 8rem;
          padding: 1.6rem 2rem;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(0, 0, 0, 0.4);
          border-bottom: 0.1rem solid rgba(129, 102, 63, 0.2);
        }

        .p-list-row {
          display: grid;
          grid-template-columns: 8rem 2fr 1.2fr 1.2fr 8rem;
          padding: 2.2rem 2rem;
          align-items: center;
          border-bottom: 0.1rem solid rgba(129, 102, 63, 0.15);
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .p-list-row:hover {
          background: rgba(129, 102, 63, 0.08);
        }

        .col-idx {
          font-size: 1.2rem;
          font-weight: 700;
          color: #81663F;
        }

        .p-list-name {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1e1e1e;
          display: block;
        }

        .p-list-sub {
          font-size: 1.2rem;
          color: rgba(0, 0, 0, 0.5);
        }

        .col-cat {
          font-size: 1.3rem;
          text-transform: uppercase;
          color: rgba(0, 0, 0, 0.7);
        }

        .col-loc {
          font-size: 1.3rem;
          color: rgba(0, 0, 0, 0.6);
        }

        .col-year {
          font-size: 1.3rem;
          color: rgba(0, 0, 0, 0.4);
          text-align: right;
        }

        /* Floating Preview */
        .projects-float-preview {
          position: fixed;
          width: 32rem;
          height: 20rem;
          pointer-events: none;
          z-index: 100;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          transition: opacity 0.25s ease, transform 0.25s ease;
        }

        /* Empty State */
        .projects-empty {
          text-align: center;
          padding: 8rem 2rem;
          color: rgba(0, 0, 0, 0.5);
          font-size: 1.6rem;
        }

        .projects-reset-btn {
          margin-top: 1.6rem;
          font-family: inherit;
          font-size: 1.2rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: #1e1e1e;
          color: #E6E2D8;
          border: none;
          padding: 1.2rem 2.4rem;
          border-radius: 4px;
          cursor: pointer;
        }

        /* ── Footer CTA ── */
        .projects-footer-cta {
          padding: 8rem 2.4rem;
          border-top: 0.1rem solid rgba(129, 102, 63, 0.2);
          background: #dfdacd;
          text-align: center;
        }

        .projects-footer-cta__inner {
          max-width: 80rem;
          margin: 0 auto;
        }

        .projects-cta-title {
          font-size: clamp(2.8rem, 5vw, 4.4rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.15;
          margin-bottom: 1.6rem;
          color: #1e1e1e;
        }

        .projects-cta-desc {
          font-size: 1.6rem;
          line-height: 1.6;
          color: rgba(0, 0, 0, 0.7);
          margin-bottom: 3.2rem;
        }

        .projects-cta-actions {
          display: flex;
          justify-content: center;
          gap: 1.6rem;
          flex-wrap: wrap;
        }

        .projects-primary-btn {
          display: inline-block;
          font-family: inherit;
          font-size: 1.3rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #E6E2D8;
          background: #1e1e1e;
          padding: 1.4rem 3.2rem;
          text-decoration: none;
          border-radius: 4px;
          transition: background 0.2s ease;
        }

        .projects-primary-btn:hover {
          background: #81663F;
        }

        .projects-secondary-btn {
          display: inline-block;
          font-family: inherit;
          font-size: 1.3rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #1e1e1e;
          background: transparent;
          border: 0.1rem solid #1e1e1e;
          padding: 1.4rem 3.2rem;
          text-decoration: none;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .projects-secondary-btn:hover {
          background: rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  );
}
