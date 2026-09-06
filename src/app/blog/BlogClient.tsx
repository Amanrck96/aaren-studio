"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface BlogPost {
  title: string;
  slug: string;
  summary: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  image: string;
  featured?: boolean;
}

const BLOG_POSTS: BlogPost[] = [
  {
    title: "THE FUTURE OF INTERACTIVE ARCHITECTURAL SHADERS",
    slug: "future-of-interactive-webgl-shaders",
    summary: "How WebGL shaders and modern real-time 3D pipelines are transforming digital material houses and luxury architectural experience centers.",
    category: "Development",
    date: "July 22, 2026",
    readTime: "5 MIN READ",
    author: "AAREN TECH LABS",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    title: "MINIMALIST MATERIALITY & BESPOKE GRAIN ARCHITECTURE",
    slug: "establishing-minimalist-brand-aesthetics",
    summary: "Key design lessons from hand-curating rare veneer flitches and natural wood grains for high-end residential penthouses.",
    category: "Design",
    date: "July 15, 2026",
    readTime: "4 MIN READ",
    author: "AAREN ATELIER",
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "FLUID SCROLL TRIGGERS & SPATIAL CAMERA PIPELINES",
    slug: "introducing-realtime-3d-camera-triggers",
    summary: "Configuring fluid 60fps scroll animations with Lenis, GSAP, and dynamic lighting triggers for digital studio portfolios.",
    category: "Motion Graphics",
    date: "June 28, 2026",
    readTime: "6 MIN READ",
    author: "MOTION LABS",
    image: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "SUSTAINABLE WPC COMPOSITE CLADDING IN TROPICAL CLIMATES",
    slug: "sustainable-wpc-composite-cladding",
    summary: "Engineering weather-resistant exterior facades using Newtech Wood composite technologies engineered for high humidity.",
    category: "Materials",
    date: "June 14, 2026",
    readTime: "8 MIN READ",
    author: "FACADE ADVISORY",
    image: "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80",
  },
];

const CATEGORIES = ["All", "Design", "Development", "Motion Graphics", "Materials"];

interface BlogClientProps {
  initialPosts?: BlogPost[];
  initialFontSettings?: any;
}

export default function BlogClient({ initialPosts, initialFontSettings }: BlogClientProps) {
  const [postsList, setPostsList] = useState<BlogPost[]>(initialPosts && initialPosts.length > 0 ? initialPosts : BLOG_POSTS);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [fontSettings, setFontSettings] = useState<any>(initialFontSettings || {
    cardTitleSize: "1.05rem",
    cardBodySize: "0.85rem",
    cardImageHeight: "200px",
  });

  useEffect(() => {
    if (initialPosts && initialPosts.length > 0) return;

    fetch("/api/blogs?t=" + Date.now(), { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
          setPostsList(
            json.data.map((b: any, idx: number) => {
              const rawSummary = b.excerpt || b.summary || (b.content ? b.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() : "");
              const summary = rawSummary ? (rawSummary.length > 140 ? rawSummary.substring(0, 140) + "..." : rawSummary) : "Explore luxury architectural surface collections and designer interior solutions.";
              return {
                title: b.title,
                slug: b.slug || b.id || `blog-${idx + 1}`,
                summary,
                category: b.category || "Design",
                date: b.publishedAt || b.date || "July 2026",
                readTime: b.readTime || "5 MIN READ",
                author: b.author || "AAREN ATELIER",
                image: b.featuredImage || b.coverImage || b.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
                featured: idx === 0,
              };
            })
          );
        }
      })
      .catch((e) => console.error(e));

    fetch("/api/admin/blog-settings?t=" + Date.now(), { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (json && json.success && json.data) {
          setFontSettings(json.data);
        }
      })
      .catch((e) => console.error(e));
  }, [initialPosts]);

  const featuredPost = postsList.find((post) => post.featured) || postsList[0];

  const filteredPosts = postsList.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="blog-page">
      {/* ── Page Header ── */}
      <div className="blog-header page-header">
        <div className="blog-header__inner page-header__inner">
          <div className="blog-header__meta page-meta">
            JOURNAL &amp; ARCHITECTURAL INSIGHTS
          </div>
          <h1 className="blog-header__title page-title">BLOG</h1>
          <p className="blog-header__desc page-desc">
            Curated dispatches on luxury surfaces, spatial craft, technological innovations, and bespoke material curation.
          </p>

          <div className="blog-controls" style={{ marginTop: "3.2rem" }}>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search articles..."
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

            <div className="category-pills">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`cat-pill ${selectedCategory === cat ? "active" : ""}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="blog-container">
        {/* Featured Post Hero */}
        {featuredPost && (
          <section className="featured-post-section">
            <Link href={`/blog/${featuredPost.slug}`} className="featured-card">
              <div className="featured-fig">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="featured-img"
                />
                <span className="featured-badge">FEATURED ARTICLE</span>
              </div>
              <div className="featured-content">
                <div className="meta-line">
                  <span>{featuredPost.category}</span>
                  <span>•</span>
                  <span>{featuredPost.date}</span>
                  <span>•</span>
                  <span>{featuredPost.readTime}</span>
                </div>
                <h2>{featuredPost.title}</h2>
                <p>{featuredPost.summary}</p>
                <span className="read-more-link">READ ARTICLE →</span>
              </div>
            </Link>
          </section>
        )}

        {/* Main Post Grid */}
        <main className="blog-grid-section">
          {filteredPosts.length === 0 ? (
            <div className="no-posts">
              <h3>No articles found</h3>
              <p>Try refining your search terms or selecting another category.</p>
              <button onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }} className="reset-btn">
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="posts-grid">
              {filteredPosts.map((post) => (
                <article key={post.slug} className="post-card">
                  <Link href={`/blog/${post.slug}`} className="post-card__link">
                    <div className="post-card__fig">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="post-img"
                        style={{ height: fontSettings.cardImageHeight || "200px" }}
                      />
                    </div>
                    <div className="post-card__body">
                      <div className="meta-line">
                        <span className="post-cat">{post.category}</span>
                        <span>•</span>
                        <span>{post.date}</span>
                      </div>
                      <h3 style={{ fontSize: fontSettings.cardTitleSize || "1.05rem" }} className="post-title">{post.title}</h3>
                      <p style={{ fontSize: fontSettings.cardBodySize || "0.85rem" }} className="post-summary">{post.summary}</p>
                      <div className="post-footer">
                        <span className="post-author">By {post.author}</span>
                        <span className="post-read-time">{post.readTime}</span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </main>

        {/* Newsletter Section */}
        <section className="newsletter-section">
          <div className="newsletter-card">
            <h2>SUBSCRIBE TO AAREN</h2>
            <p>Receive monthly curations on architectural materials, spatial trends, and new studio releases directly in your inbox.</p>
            <form onSubmit={(e) => e.preventDefault()} className="newsletter-form">
              <input type="email" placeholder="Enter your email address..." required className="newsletter-input" />
              <button type="submit" className="newsletter-btn">SUBSCRIBE →</button>
            </form>
          </div>
        </section>
      </div>

      <style>{`
        .blog-page {
          background: #E6E2D8;
          color: #1e1e1e;
          min-height: 100vh;
          padding-top: 8rem;
          padding-bottom: 8rem;
          font-family: var(--font-jost), 'Jost', sans-serif;
        }

        .blog-header {
          padding-top: 6rem;
          padding-bottom: 3.5rem;
          padding-left: 0;
          padding-right: 0;
          border-bottom: 0.1rem solid rgba(129,102,63,0.18);
        }

        @media (min-width: 768px) {
          .blog-header {
            padding-top: 8rem;
            padding-bottom: 4rem;
          }
        }

        .blog-container {
          max-width: 1600px;
          margin: 0 auto;
          padding: 4rem 4rem 0;
          box-sizing: border-box;
        }

        @media (max-width: 1024px) {
          .blog-container {
            padding: 4rem 3rem 0;
          }
        }

        @media (max-width: 768px) {
          .blog-container {
            padding: 3rem 2rem 0;
          }
        }

        .blog-controls {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        @media (min-width: 1024px) {
          .blog-controls {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }

        .search-box {
          position: relative;
          min-width: 280px;
        }

        .search-input {
          width: 100%;
          background: #f4f5f7;
          border: 1px solid rgba(0,0,0,0.15);
          color: #111111;
          padding: 0.75rem 1.4rem;
          border-radius: 999px;
          font-size: 0.95rem;
          outline: none;
        }

        .search-input:focus {
          border-color: #80673f;
        }

        .search-clear {
          position: absolute;
          right: 1.2rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(0,0,0,0.4);
          cursor: pointer;
        }

        .category-pills {
          display: flex;
          gap: 0.6rem;
          flex-wrap: wrap;
        }

        .cat-pill {
          background: #f0f2f5;
          border: 1px solid rgba(0,0,0,0.12);
          color: #333333;
          padding: 0.55rem 1.4rem;
          border-radius: 999px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .cat-pill:hover {
          border-color: #80673f;
          color: #80673f;
        }

        .cat-pill.is-active {
          background: #80673f;
          color: #ffffff;
          border-color: #80673f;
        }

        /* Featured Section */
        .featured-post-section {
          margin-bottom: 5rem;
        }

        .featured-card {
          display: grid;
          grid-template-columns: 1fr;
          background: #fdfbf7;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 0.8rem;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          transition: border-color 0.3s ease;
        }

        @media (min-width: 1024px) {
          .featured-card {
            grid-template-columns: 1.2fr 1fr;
          }
        }

        .featured-card:hover {
          border-color: #80673f;
        }

        .featured-fig {
          position: relative;
          min-height: 340px;
          background: #f4f5f7;
        }

        .featured-img {
          object-fit: cover;
          transition: transform 0.7s ease !important;
        }

        .featured-card:hover .featured-img {
          transform: scale(1.04);
        }

        .featured-badge {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          background: #80673f;
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          padding: 0.4rem 1rem;
          border-radius: 0.4rem;
        }

        .featured-content {
          padding: 3rem 2.4rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 1.2rem;
        }

        .meta-line {
          display: flex;
          gap: 0.6rem;
          align-items: center;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #80673f;
          text-transform: uppercase;
        }

        .featured-content h2 {
          font-size: clamp(1.6rem, 2.5vw, 2.4rem);
          font-weight: 800;
          line-height: 1.25;
          color: #80673f;
          margin: 0;
          text-transform: uppercase;
        }

        .featured-content p {
          font-size: 1rem;
          line-height: 1.6;
          color: #444444;
          font-weight: 400;
        }

        .read-more-link {
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: #80673f;
          margin-top: 0.5rem;
        }

        /* Posts Grid */
        .blog-grid-section {
          margin-bottom: 6rem;
        }

        .posts-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 768px) {
          .posts-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1200px) {
          .posts-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .post-card {
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 0.6rem;
          overflow: hidden;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .post-card:hover {
          transform: translateY(-0.4rem);
          border-color: #80673f;
        }

        .post-card__link {
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .post-card__fig {
          position: relative;
          height: 220px;
          background: #f4f5f7;
          overflow: hidden;
        }

        .post-card__img {
          object-fit: cover;
          transition: transform 0.6s ease !important;
        }

        .post-card:hover .post-card__img {
          transform: scale(1.06);
        }

        .post-card__body {
          padding: 1.8rem;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          flex: 1;
        }

        .post-title {
          font-size: 1.25rem;
          font-weight: 700;
          line-height: 1.35;
          color: #111111;
          margin: 0;
          text-transform: uppercase;
        }

        .post-summary {
          font-size: 0.925rem;
          line-height: 1.6;
          color: #555555;
          font-weight: 400;
          margin: 0;
        }

        .post-footer {
          margin-top: auto;
          padding-top: 1.2rem;
          border-top: 1px solid rgba(0,0,0,0.08);
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: #777777;
        }

        /* Newsletter */
        .newsletter-section {
          border-top: 1px solid rgba(0,0,0,0.1);
          padding-top: 6rem;
        }

        .newsletter-card {
          background: #fdfbf7;
          border: 1px solid rgba(128, 103, 63, 0.25);
          border-radius: 1.2rem;
          padding: 5rem 3rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.6rem;
        }

        .newsletter-card h2 {
          font-size: clamp(2.4rem, 4vw, 3.6rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #80673f;
        }

        .newsletter-card p {
          font-size: 1.5rem;
          color: rgba(0,0,0,0.7);
          max-width: 600px;
        }

        .newsletter-form {
          display: flex;
          gap: 1rem;
          width: 100%;
          max-width: 500px;
          margin-top: 1rem;
          flex-direction: column;
        }

        @media (min-width: 640px) {
          .newsletter-form {
            flex-direction: row;
          }
        }

        .newsletter-input {
          flex: 1;
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.2);
          color: #111111;
          padding: 1.2rem 2rem;
          border-radius: 999px;
          font-size: 1.3rem;
          outline: none;
        }

        .newsletter-btn {
          background: #80673f;
          color: #ffffff;
          border: none;
          padding: 1.2rem 2.4rem;
          border-radius: 999px;
          font-weight: 800;
          font-size: 1.1rem;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .newsletter-btn:hover {
          background: #6a5431;
        }

        .no-posts {
          text-align: center;
          padding: 6rem 2rem;
          color: rgba(0,0,0,0.5);
        }

        .reset-btn {
          margin-top: 1.6rem;
          background: #80673f;
          color: #ffffff;
          border: none;
          padding: 1rem 2rem;
          border-radius: 999px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .reset-btn:hover {
          background: #6a5431;
        }
      `}</style>
    </div>
  );
}
