"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Project {
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

const ALL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    slug: "oberoi-lobby",
    client: "The Oberoi Group",
    code: "OB",
    num: "01",
    title: "Presidential Suite & Grand Lobby",
    year: "2025",
    category: "Hospitality",
    location: "Mumbai, India",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    description: "Full spatial overhaul using custom Italian marble cladding, bespoke veneer panelling, and integrated indirect lighting.",
    tags: ["Marble", "Veneer", "Lighting"],
  },
  {
    id: "proj-2",
    slug: "ratan-hq",
    client: "Ratan Corporate",
    code: "RG",
    num: "02",
    title: "Global Headquarters",
    year: "2025",
    category: "Commercial",
    location: "BKC, Mumbai",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    description: "Multi-floor workspace featuring acoustic wooden acoustic partitions, aluminum frame systems, and custom executive suites.",
    tags: ["Acoustics", "Glass", "Wood"],
  },
  {
    id: "proj-3",
    slug: "alibaug-villa",
    client: "Private Residence",
    code: "PV",
    num: "03",
    title: "Coastal Luxury Sanctuary",
    year: "2024",
    category: "Residential",
    location: "Alibaug",
    image: "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80",
    description: "Seamless indoor-outdoor living with Newtech Wood composite decking, solid teak facades, and minimalist glass walls.",
    tags: ["Decking", "Teak", "Glass"],
  },
  {
    id: "proj-4",
    slug: "taj-spa",
    client: "Taj Hotels & Resorts",
    code: "TJ",
    num: "04",
    title: "Heritage Spa & Wellness Pavilion",
    year: "2024",
    category: "Hospitality",
    location: "Udaipur",
    image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80",
    description: "Tranquil spa environment with Falper sanitary fittings, water-resistant thermory wood, and hand-carved stone basins.",
    tags: ["Sanitary", "Thermory", "Stone"],
  },
  {
    id: "proj-5",
    slug: "godrej-worli",
    client: "Godrej Properties",
    code: "GP",
    num: "05",
    title: "Experience Center & Penthouse",
    year: "2024",
    category: "Residential",
    location: "Worli, Mumbai",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
    description: "Curated sales gallery showcasing high-end Italian tiles, bespoke Slashform wardrobes, and automated screen partitions.",
    tags: ["Slashform", "Tiles", "Screens"],
  },
  {
    id: "proj-6",
    slug: "nykaa-retail",
    client: "Nykaa Beauty",
    code: "NK",
    num: "06",
    title: "Flagship Beauty & Luxe Store",
    year: "2023",
    category: "Retail",
    location: "Delhi NCR",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    description: "High-contrast retail store featuring brushed metallic surfaces, illuminated glass showcases, and polished concrete flooring.",
    tags: ["Retail", "Metal", "Lighting"],
  },
  {
    id: "proj-7",
    slug: "birla-penthouse",
    client: "Birla Estates",
    code: "BE",
    num: "07",
    title: "Sky Penthouse Residence",
    year: "2023",
    category: "Residential",
    location: "New Delhi",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
    description: "Architectural masterpiece incorporating Mafi engineered oak floors, Inkiostro Bianco wall coverings, and custom brass accents.",
    tags: ["Oak Floor", "Wallcovering", "Brass"],
  },
  {
    id: "proj-8",
    slug: "lodha-club",
    client: "Lodha Group",
    code: "LG",
    num: "08",
    title: "Clubhouse & Sky Lounge",
    year: "2023",
    category: "Commercial",
    location: "Lower Parel, Mumbai",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
    description: "Exclusive social club featuring Formica premium laminate paneling, custom lounge seating, and acoustic ceiling baffles.",
    tags: ["Laminates", "Acoustics", "Lounge"],
  },
  {
    id: "proj-9",
    slug: "hiranandani-atrium",
    client: "Hiranandani Group",
    code: "HI",
    num: "09",
    title: "Grand Atrium & Corporate Tower",
    year: "2022",
    category: "Commercial",
    location: "Powai, Mumbai",
    image: "https://images.unsplash.com/photo-1504615755583-2916b52192a3?auto=format&fit=crop&w=1200&q=80",
    description: "Monumental triple-height glass atrium with integrated green walls, porcelain tile cladding, and automated shading screens.",
    tags: ["Glass", "Tiles", "Facade"],
  },
  {
    id: "proj-10",
    slug: "piramal-gallery",
    client: "Piramal Realty",
    code: "PR",
    num: "10",
    title: "Sales Pavilion & Design Gallery",
    year: "2022",
    category: "Retail",
    location: "Mahalaxmi, Mumbai",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
    description: "Interactive material gallery featuring sample displays, architectural mockups, and client presentation lounges.",
    tags: ["Gallery", "Wood", "Metal"],
  },
];

const CATEGORIES = ["All", "Hospitality", "Residential", "Commercial", "Retail"];

export default function AllProjectsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const filteredProjects = ALL_PROJECTS.filter((project) => {
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

  const hoveredData = ALL_PROJECTS.find((p) => p.slug === hoveredProject);

  return (
    <div className="projects-page" onMouseMove={handleMouseMove}>
      {/* Floating Hover Image Preview for List View */}
      {viewMode === "list" && (
        <div
          className="projects-float-preview"
          style={{
            left: mousePos.x > window.innerWidth / 2 ? "auto" : mousePos.x + 30,
            right: mousePos.x > window.innerWidth / 2 ? window.innerWidth - mousePos.x + 30 : "auto",
            top: mousePos.y - 120,
            opacity: hoveredProject ? 1 : 0,
            transform: hoveredProject ? "translateY(0) scale(1)" : "translateY(12px) scale(0.96)",
          }}
        >
          {hoveredData && (
            <img
              src={hoveredData.image}
              alt={hoveredData.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
        </div>
      )}

      {/* Header */}
      <section className="projects-header">
        <div className="projects-header__top">
          <span className="projects-tag">CURATED PORTFOLIO</span>
          <span className="projects-count">[{filteredProjects.length} PROJECTS]</span>
        </div>
        <h1 className="projects-title">ALL PROJECTS</h1>
        <p className="projects-desc">
          Explore spatial experiences, bespoke interior architectures, and luxury material installations crafted for prestigious clients across India & globally.
        </p>

        {/* Toolbar: Category tabs + Search + View switcher */}
        <div className="projects-toolbar">
          <div className="projects-categories">
            {CATEGORIES.map((cat) => {
              const count = cat === "All" ? ALL_PROJECTS.length : ALL_PROJECTS.filter((p) => p.category === cat).length;
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
      </section>

      {/* Main Content */}
      <main className="projects-main">
        {filteredProjects.length === 0 ? (
          <div className="no-results">
            <h3>No projects found</h3>
            <p>Try refining your search terms or selecting another category.</p>
            <button onClick={() => { setActiveFilter("All"); setSearchQuery(""); }} className="reset-btn">
              Reset Filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          /* GRID VIEW */
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/work/${project.slug}`}
                className="project-card"
              >
                <div className="project-card__img-wrap">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="project-card__img"
                  />
                  <div className="project-card__overlay">
                    <span className="view-project-badge">EXPLORE PROJECT →</span>
                  </div>
                  <span className="project-card__code-badge">{project.code} {project.num}</span>
                </div>

                <div className="project-card__body">
                  <div className="project-card__top">
                    <span className="project-card__client">{project.client}</span>
                    <span className="project-card__year">{project.year}</span>
                  </div>
                  <h3 className="project-card__title">{project.title}</h3>
                  <p className="project-card__desc">{project.description}</p>
                  
                  <div className="project-card__footer">
                    <span className="project-card__location">📍 {project.location}</span>
                    <div className="project-card__tags">
                      {project.tags.map((tag) => (
                        <span key={tag} className="tag-chip">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* LIST VIEW */
          <div className="projects-list">
            <div className="list-header">
              <span>INDEX</span>
              <span>CLIENT & PROJECT</span>
              <span>CATEGORY & LOCATION</span>
              <span>YEAR</span>
            </div>
            {filteredProjects.map((project, idx) => (
              <Link
                key={project.id}
                href={`/work/${project.slug}`}
                className="list-row"
                onMouseEnter={() => setHoveredProject(project.slug)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <span className="list-idx">{String(idx + 1).padStart(2, "0")}</span>
                <div className="list-main">
                  <span className="list-client">{project.client}</span>
                  <h3 className="list-title">{project.title}</h3>
                </div>
                <div className="list-meta">
                  <span className="list-cat">{project.category}</span>
                  <span className="list-loc">{project.location}</span>
                </div>
                <span className="list-year">{project.year}</span>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* CTA Footer */}
      <section className="projects-cta">
        <div className="projects-cta__inner">
          <h2>HAVE A SPATIAL OR MATERIAL PROJECT IN MIND?</h2>
          <p>Let&apos;s collaborate to design and deliver unprecedented architectural experiences.</p>
          <Link href="/contact" className="cta-link">
            START A CONSULTATION →
          </Link>
        </div>
      </section>

      <style>{`
        .projects-page {
          background-color: #0d0d0d;
          color: #f2f2f2;
          min-height: 100vh;
          padding-top: 9rem;
          font-family: var(--font-jost), 'Jost', sans-serif;
        }

        .projects-float-preview {
          position: fixed;
          pointer-events: none;
          z-index: 999;
          width: 340px;
          height: 240px;
          border-radius: 0.4rem;
          overflow: hidden;
          box-shadow: 0 2rem 4rem rgba(0,0,0,0.6);
          border: 1px solid rgba(255,255,255,0.15);
          transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .projects-header {
          padding: 6rem 2.4rem 4rem;
          max-width: 1400px;
          margin: 0 auto;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .projects-header__top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 1.1rem;
          letter-spacing: 0.12em;
          color: rgba(255,255,255,0.4);
          font-weight: 700;
          margin-bottom: 1.6rem;
        }

        .projects-title {
          font-size: clamp(4rem, 11vw, 15rem);
          font-weight: 800;
          letter-spacing: -0.05em;
          line-height: 0.9;
          color: #ffffff;
          text-transform: uppercase;
          margin-bottom: 2.4rem;
        }

        .projects-desc {
          font-size: clamp(1.4rem, 2vw, 2rem);
          line-height: 1.5;
          color: rgba(255,255,255,0.6);
          max-width: 72rem;
          margin-bottom: 4rem;
          font-weight: 300;
        }

        .projects-toolbar {
          display: flex;
          flex-direction: column;
          gap: 2rem;
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
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.7);
          padding: 0.8rem 1.6rem;
          border-radius: 999px;
          font-size: 1.2rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .cat-btn:hover {
          background: rgba(255,255,255,0.15);
          color: #ffffff;
        }

        .cat-btn.is-active {
          background: #ffffff;
          color: #000000;
          border-color: #ffffff;
        }

        .cat-count {
          opacity: 0.6;
          font-size: 1rem;
        }

        .projects-actions {
          display: flex;
          gap: 1.2rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-box {
          position: relative;
          flex: 1;
          min-width: 240px;
        }

        .search-input {
          width: 100%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.15);
          color: #ffffff;
          padding: 1rem 1.6rem;
          border-radius: 999px;
          font-size: 1.2rem;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .search-input:focus {
          border-color: rgba(255,255,255,0.5);
        }

        .search-clear {
          position: absolute;
          right: 1.2rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255,255,255,0.4);
          cursor: pointer;
        }

        .view-switcher {
          display: flex;
          background: rgba(255,255,255,0.06);
          border-radius: 999px;
          padding: 0.3rem;
          border: 1px solid rgba(255,255,255,0.12);
        }

        .view-btn {
          background: none;
          border: none;
          color: rgba(255,255,255,0.5);
          padding: 0.6rem 1.4rem;
          border-radius: 999px;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .view-btn.is-active {
          background: rgba(255,255,255,0.2);
          color: #ffffff;
        }

        .projects-main {
          max-width: 1400px;
          margin: 0 auto;
          padding: 4rem 2.4rem 8rem;
        }

        /* GRID VIEW */
        .projects-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3.2rem;
        }

        @media (min-width: 768px) {
          .projects-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1200px) {
          .projects-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 4rem;
          }
        }

        .project-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 0.6rem;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
        }

        .project-card:hover {
          transform: translateY(-0.6rem);
          border-color: rgba(255,255,255,0.25);
          box-shadow: 0 2rem 4rem rgba(0,0,0,0.5);
        }

        .project-card__img-wrap {
          position: relative;
          height: 32rem;
          background: #151515;
          overflow: hidden;
        }

        .project-card__img {
          object-fit: cover;
          transition: transform 0.7s cubic-bezier(0.25, 1, 0.5, 1) !important;
        }

        .project-card:hover .project-card__img {
          transform: scale(1.06);
        }

        .project-card__overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .project-card:hover .project-card__overlay {
          opacity: 1;
        }

        .view-project-badge {
          background: #ffffff;
          color: #000000;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          padding: 1rem 2.2rem;
          border-radius: 999px;
        }

        .project-card__code-badge {
          position: absolute;
          top: 1.6rem;
          left: 1.6rem;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          color: #ffffff;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          padding: 0.4rem 1rem;
          border-radius: 0.4rem;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .project-card__body {
          padding: 2.8rem;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          flex: 1;
        }

        .project-card__top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .project-card__client {
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
        }

        .project-card__year {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.3);
          font-weight: 600;
        }

        .project-card__title {
          font-size: 2.2rem;
          font-weight: 700;
          line-height: 1.2;
          color: #ffffff;
          margin: 0;
        }

        .project-card__desc {
          font-size: 1.3rem;
          line-height: 1.6;
          color: rgba(255,255,255,0.55);
          font-weight: 300;
          margin: 0;
        }

        .project-card__footer {
          margin-top: auto;
          padding-top: 1.6rem;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .project-card__location {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.4);
        }

        .project-card__tags {
          display: flex;
          gap: 0.6rem;
        }

        .tag-chip {
          font-size: 1rem;
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.7);
          padding: 0.2rem 0.8rem;
          border-radius: 0.3rem;
          letter-spacing: 0.04em;
        }

        /* LIST VIEW */
        .projects-list {
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .list-header {
          display: grid;
          grid-template-columns: 80px 1fr 1fr 100px;
          padding: 1.6rem 2rem;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.3);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .list-row {
          display: grid;
          grid-template-columns: 80px 1fr 1fr 100px;
          align-items: center;
          padding: 2.4rem 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          text-decoration: none;
          color: inherit;
          transition: background 0.2s ease;
        }

        .list-row:hover {
          background: rgba(255,255,255,0.04);
        }

        .list-idx {
          font-size: 1.2rem;
          color: rgba(255,255,255,0.3);
          font-weight: 700;
        }

        .list-main {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .list-client {
          font-size: 1.1rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
        }

        .list-title {
          font-size: 1.8rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
        }

        .list-meta {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          font-size: 1.2rem;
          color: rgba(255,255,255,0.5);
        }

        .list-year {
          font-size: 1.3rem;
          font-weight: 600;
          color: rgba(255,255,255,0.4);
          text-align: right;
        }

        .no-results {
          text-align: center;
          padding: 8rem 2rem;
          color: rgba(255,255,255,0.5);
        }

        .no-results h3 {
          font-size: 2.4rem;
          color: #ffffff;
          margin-bottom: 1rem;
        }

        .reset-btn {
          margin-top: 2rem;
          background: #ffffff;
          color: #000000;
          border: none;
          padding: 1rem 2.4rem;
          border-radius: 999px;
          font-weight: 700;
          cursor: pointer;
        }

        /* CTA */
        .projects-cta {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding: 8rem 2.4rem;
          background: #111111;
          text-align: center;
        }

        .projects-cta__inner {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }

        .projects-cta h2 {
          font-size: clamp(2.4rem, 4vw, 4.2rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #ffffff;
          line-height: 1.1;
        }

        .projects-cta p {
          font-size: 1.6rem;
          color: rgba(255,255,255,0.5);
          line-height: 1.5;
        }

        .cta-link {
          margin-top: 1rem;
          display: inline-block;
          background: #ffffff;
          color: #000000;
          padding: 1.4rem 3.2rem;
          border-radius: 999px;
          font-weight: 700;
          font-size: 1.2rem;
          letter-spacing: 0.08em;
          text-decoration: none;
          transition: transform 0.25s ease, background 0.25s ease;
        }

        .cta-link:hover {
          transform: translateY(-0.2rem);
          background: #e0e0e0;
        }
      `}</style>
    </div>
  );
}
