"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { BlogItem } from "@/lib/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogDetail({ params }: PageProps) {
  const resolvedParams = use(params);
  const targetSlug = resolvedParams.slug;

  const [article, setArticle] = useState<BlogItem | null>(null);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState<{ author: string; text: string; date?: string }[]>([
    {
      author: "Ethan Pierce",
      text: "Stunning analysis of outdoor materials and architectural surface performance.",
      date: "Today",
    },
  ]);
  const [newComment, setNewComment] = useState({ author: "", text: "" });

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          const found = json.data.find(
            (b: BlogItem) =>
              b.slug === targetSlug ||
              b.id === targetSlug ||
              b.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === targetSlug.toLowerCase()
          );
          if (found) {
            setArticle(found);
          }
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [targetSlug]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.author || !newComment.text) return;
    setComments([...comments, { ...newComment, date: "Today" }]);
    setNewComment({ author: "", text: "" });
  };

  if (loading) {
    return (
      <div style={{ background: "#F1ECE1", color: "#1E1B16", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "40px", height: "40px", border: "3px solid #7A4A28", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 1rem" }} />
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A4A28" }}>Loading Journal Article...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const displayTitle = article?.title || targetSlug.replace(/-/g, " ");
  const displayCategory = article?.category || "Materials & Architecture";
  const displayDate = article?.publishDate || article?.createdAt || "August 2026";
  const displayAuthor = article?.author || "Aaren IntPro Editorial & Architectural Design Team";
  const displayImage = article?.featuredImage || "";
  const rawContent = article?.content || "";

  // Dynamic Tags
  const tagsList = article?.tags && article.tags.length > 0
    ? article.tags
    : ["Composite Decking", "Outdoor Living", "Material Specification", "Bengaluru"];

  const reasonsData = [
    { num: "01", title: "Unmatched Weather Resistance & Durability", desc: "Engineered to hold up against sun, rain, and temperature swings without the splitting, cupping, or greying that solid timber decking eventually shows." },
    { num: "02", title: "Zero Maintenance & Eco-Friendly Living", desc: "No sanding, staining, or annual sealing. Boards are made with a high proportion of recycled material, cutting both upkeep and environmental footprint." },
    { num: "03", title: "Natural Wood Grain Aesthetics", desc: "Available in a range of tones and grain patterns that hold their texture and colour far longer than a natural timber finish would in the same conditions." },
    { num: "04", title: "Hidden Fastener Installation System", desc: "A concealed clip system keeps the surface free of visible screws, giving a cleaner sightline and a tighter, more precise board alignment." },
    { num: "05", title: "25-Year Commercial Warranty", desc: "Backed by global testing certifications and a warranty term long enough for architects to specify with confidence on residential and commercial projects alike.", full: true }
  ];

  return (
    <div className="aaren-editorial-page">
      {/* GOOGLE FONTS IMPORT & EXACT STYLES matching user HTML specification */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .aaren-editorial-page {
          --ink: #1E1B16;
          --ink-soft: #4A443B;
          --paper: #F1ECE1;
          --paper-raised: #E7E0D0;
          --walnut: #7A4A28;
          --copper: #B87333;
          --moss: #4B5842;
          --line: #D9D0BC;
          --line-strong: #C4B89E;
          --max: 720px;

          background: var(--paper);
          color: var(--ink);
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
          padding-top: 80px; /* Offset fixed header */
        }

        .grain-mark {
          display: inline-flex;
          align-items: center;
          gap: 2px;
        }
        .grain-mark span {
          display: block;
          width: 14px;
          height: 2px;
          background: currentColor;
          opacity: 0.55;
        }
        .grain-mark span:nth-child(2) { width: 20px; opacity: 0.85; }
        .grain-mark span:nth-child(3) { width: 10px; opacity: 0.4; }

        .grain-divider {
          width: 100%;
          height: 18px;
          margin: 0 auto;
          background-repeat: repeat-x;
          background-size: 60px 18px;
          background-image: repeating-linear-gradient(
            90deg,
            transparent 0px, transparent 26px,
            var(--line-strong) 26px, var(--line-strong) 27px,
            transparent 27px, transparent 40px,
            var(--line-strong) 40px, var(--line-strong) 40.6px
          );
          opacity: 0.7;
        }

        /* Utility Bar */
        .ed-utility-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 24px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: .06em;
          text-transform: uppercase;
          color: var(--ink-soft);
          border-bottom: 1px solid var(--line);
          background: var(--paper);
        }
        .ed-utility-bar .back {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: var(--ink-soft);
          transition: color 0.2s ease;
        }
        .ed-utility-bar .back:hover {
          color: var(--walnut);
        }

        /* Hero */
        .ed-hero {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 8;
          overflow: hidden;
          background:
            radial-gradient(120% 90% at 15% 15%, #C48A4E 0%, transparent 55%),
            radial-gradient(140% 100% at 85% 90%, #3B2A1C 0%, transparent 60%),
            linear-gradient(135deg, #EADFC7 0%, #C9A56C 35%, #8A5A34 70%, #3E2A1B 100%);
        }
        .ed-hero img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .ed-hero svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: .55;
          mix-blend-mode: overlay;
        }
        .ed-hero-caption {
          position: absolute;
          left: 24px;
          bottom: 16px;
          color: #F1ECE1;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: .05em;
          text-shadow: 0 1px 6px rgba(0,0,0,.4);
        }

        /* Article Head */
        .ed-article-head {
          max-width: var(--max);
          margin: 0 auto;
          padding: 48px 24px 0;
        }
        .ed-eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: var(--walnut);
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
        }
        .ed-article-head h1 {
          font-family: 'Fraunces', serif;
          font-optical-sizing: auto;
          font-weight: 600;
          font-size: clamp(32px, 5.2vw, 48px);
          line-height: 1.08;
          letter-spacing: -.01em;
          margin: 0 0 20px;
          color: var(--ink);
        }
        .ed-lede {
          font-family: 'Fraunces', serif;
          font-weight: 400;
          font-style: italic;
          font-size: 20px;
          line-height: 1.55;
          color: var(--ink-soft);
          margin: 0 0 28px;
        }
        .ed-meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          align-items: center;
          padding: 18px 0;
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          font-size: 13px;
          color: var(--ink-soft);
        }
        .ed-meta-row .author {
          font-weight: 600;
          color: var(--ink);
        }
        .ed-meta-row .sep { color: var(--line-strong); }

        /* Article Body */
        .ed-article-body {
          max-width: var(--max);
          margin: 0 auto;
          padding: 40px 24px 0;
        }
        .ed-article-body section { margin-bottom: 44px; }
        .ed-article-body h2 {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 26px;
          line-height: 1.25;
          letter-spacing: -.005em;
          color: var(--ink);
          margin: 0 0 14px;
        }
        .ed-article-body p {
          font-size: 16.5px;
          line-height: 1.75;
          color: #2E2A24;
          margin: 0 0 16px;
        }
        .ed-section-divider {
          display: flex;
          justify-content: center;
          margin: 44px 0;
          color: var(--line-strong);
        }
        .ed-article-body blockquote {
          margin: 32px 0;
          padding: 4px 0 4px 22px;
          border-left: 3px solid var(--copper);
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-weight: 500;
          font-size: 21px;
          line-height: 1.5;
          color: var(--walnut);
        }

        /* Rich Content Support */
        .ed-rich-content {
          font-size: 16.5px;
          line-height: 1.75;
          color: #2E2A24;
        }
        .ed-rich-content h1, .ed-rich-content h2, .ed-rich-content h3 {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          color: var(--ink);
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .ed-rich-content h2 { font-size: 26px; }
        .ed-rich-content h3 { font-size: 20px; }
        .ed-rich-content p { margin-bottom: 16px; }
        .ed-rich-content ul, .ed-rich-content ol { margin: 1.2rem 0 1.2rem 1.8rem; }
        .ed-rich-content li { margin-bottom: 0.4rem; }

        /* 5 Reasons Grid */
        .ed-reasons-intro { text-align: left; }
        .ed-reasons-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: var(--line);
          border: 1px solid var(--line);
          margin-top: 24px;
        }
        .ed-reason-card {
          background: var(--paper);
          padding: 26px 24px;
        }
        .ed-reason-card.full { grid-column: 1 / -1; }
        .ed-reason-num {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          color: var(--copper);
          letter-spacing: .05em;
          margin-bottom: 10px;
          display: block;
        }
        .ed-reason-card h3 {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 18px;
          line-height: 1.3;
          margin: 0 0 8px;
          color: var(--ink);
        }
        .ed-reason-card p {
          font-size: 14.5px;
          line-height: 1.6;
          margin: 0;
          color: var(--ink-soft);
        }

        /* CTA Block */
        .ed-cta-block {
          max-width: var(--max);
          margin: 52px auto 0;
          padding: 0 24px;
        }
        .ed-cta-inner {
          background: var(--ink);
          color: var(--paper);
          padding: 40px 36px;
          position: relative;
          overflow: hidden;
        }
        .ed-cta-inner::before {
          content: "";
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            100deg,
            rgba(184,115,51,.10) 0px, rgba(184,115,51,.10) 1px,
            transparent 1px, transparent 34px
          );
          pointer-events: none;
        }
        .ed-cta-inner .ed-eyebrow { color: var(--copper); }
        .ed-cta-inner h2 {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 26px;
          color: var(--paper);
          margin: 0 0 12px;
        }
        .ed-cta-inner p { color: #CFC7B4; font-size: 15px; line-height: 1.6; margin: 0 0 20px; }
        .ed-cta-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 28px;
          margin: 20px 0 26px;
          font-size: 13.5px;
          color: #CFC7B4;
        }
        .ed-cta-meta strong {
          display: block;
          color: var(--paper);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: .06em;
          text-transform: uppercase;
          margin-bottom: 4px;
          font-weight: 500;
        }
        .ed-cta-button {
          display: inline-block;
          background: var(--copper);
          color: var(--ink);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12.5px;
          letter-spacing: .05em;
          text-transform: uppercase;
          font-weight: 500;
          padding: 13px 26px;
          text-decoration: none;
          position: relative;
          z-index: 1;
          transition: opacity 0.2s ease;
        }
        .ed-cta-button:hover { opacity: 0.9; }

        /* Comments Form & Footer */
        .ed-article-footer {
          max-width: var(--max);
          margin: 52px auto 0;
          padding: 24px 24px 60px;
          border-top: 1px solid var(--line);
        }
        .ed-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 18px 0 28px;
        }
        .ed-tag {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: .04em;
          text-transform: uppercase;
          padding: 6px 12px;
          border: 1px solid var(--line-strong);
          color: var(--ink-soft);
        }

        .ed-comments-section {
          margin-top: 36px;
          padding-top: 24px;
          border-top: 1px dashed var(--line-strong);
        }
        .ed-comments-title {
          font-family: 'Fraunces', serif;
          font-size: 20px;
          font-weight: 600;
          color: var(--ink);
          margin-bottom: 20px;
        }
        .ed-comment-card {
          background: var(--paper-raised);
          border: 1px solid var(--line);
          padding: 18px 20px;
          margin-bottom: 14px;
        }
        .ed-comment-author {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--walnut);
          font-weight: 600;

          display: flex;
          justify-content: space-between;
        }
        .ed-comment-text {
          font-size: 14.5px;
          color: var(--ink);
          margin-top: 6px;
          line-height: 1.55;
        }

        .ed-comment-form {
          margin-top: 28px;
          background: var(--paper-raised);
          border: 1px solid var(--line);
          padding: 24px;
        }
        .ed-form-field {
          margin-bottom: 16px;
        }
        .ed-form-label {
          display: block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--ink-soft);
          margin-bottom: 6px;
        }
        .ed-form-input, .ed-form-textarea {
          width: 100%;
          background: var(--paper);
          border: 1px solid var(--line-strong);
          padding: 10px 14px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: var(--ink);
          outline: none;
        }
        .ed-form-input:focus, .ed-form-textarea:focus {
          border-color: var(--walnut);
        }
        .ed-form-submit {
          background: var(--walnut);
          color: var(--paper);
          border: none;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 12px 24px;
          cursor: pointer;
          font-weight: 500;
        }

        @media (max-width: 600px) {
          .ed-reasons-grid { grid-template-columns: 1fr; }
          .ed-reason-card.full { grid-column: 1; }
          .ed-article-head h1 { font-size: 30px; }
          .ed-lede { font-size: 18px; }
          .ed-cta-inner { padding: 28px 20px; }
        }
      `}</style>

      {/* TOP UTILITY BAR */}
      <div className="ed-utility-bar">
        <Link className="back" href="/blog">
          <span className="grain-mark"><span></span><span></span><span></span></span>
          Back to Journal
        </Link>
        <span>Global Architecture &amp; Design Journal</span>
      </div>

      {/* HERO BANNER */}
      <div className="ed-hero">
        {displayImage ? (
          <img src={displayImage} alt={displayTitle} />
        ) : (
          <svg viewBox="0 0 800 400" preserveAspectRatio="none">
            <g fill="none" stroke="#F1ECE1" strokeWidth="1.4">
              <path d="M -50 380 C 150 320, 250 340, 420 300 S 700 240, 900 260" />
              <path d="M -50 340 C 150 290, 260 300, 430 260 S 700 200, 900 220" />
              <path d="M -50 300 C 150 260, 270 260, 440 220 S 700 160, 900 180" />
              <path d="M -50 260 C 150 230, 280 220, 450 180 S 700 120, 900 140" />
              <path d="M -50 220 C 150 200, 290 180, 460 140 S 700 80, 900 100" />
              <path d="M -50 180 C 150 170, 300 140, 470 100 S 700 40, 900 60" />
            </g>
          </svg>
        )}
        <span className="ed-hero-caption">{displayTitle} — Aaren IntPro Luxury Feature</span>
      </div>

      {/* ARTICLE HEADER BLOCK */}
      <header className="ed-article-head">
        <div className="ed-eyebrow">
          <span className="grain-mark"><span></span><span></span><span></span></span>
          {displayCategory}
        </div>
        <h1>{displayTitle}</h1>
        <p className="ed-lede">
          Composite decking has moved past its budget-material reputation. Engineered to hold the warmth of natural timber without timber's upkeep, it's becoming the material architects reach for when an outdoor space needs to work as hard as it looks good.
        </p>
        <div className="ed-meta-row">
          <span className="author">{displayAuthor}</span>
          <span className="sep">&middot;</span>
          <span>{displayDate}</span>
          <span className="sep">&middot;</span>
          <span>6 min read</span>
        </div>
      </header>

      {/* ARTICLE BODY & SECTIONS */}
      <main className="ed-article-body">
        {rawContent.includes("<") && rawContent.includes(">") ? (
          <div className="ed-rich-content" dangerouslySetInnerHTML={{ __html: rawContent }} />
        ) : (
          <>
            <section>
              <h2>From Balconies to Luxury Villas</h2>
              <p>
                Composite decking now spans a far wider range of settings than its early years suggested. On a compact residential balcony it reads as a warm, low-fuss upgrade from bare concrete. Scaled up, the same system shows up on rooftop decks, poolside walkways, villa terraces, and the outdoor seating areas of restaurants and hotels — anywhere a design brief calls for the look of timber in a space that has to withstand real weather and real foot traffic.
              </p>
            </section>

            <div className="ed-section-divider">
              <div className="grain-divider" style={{ width: "220px" }} />
            </div>

            <section>
              <h2>Built for Everyday Life</h2>
              <p>
                Outdoor flooring takes a harder daily beating than almost anything else in a building — sun, monsoon rain, spilled drinks, bare feet, furniture legs dragged across the surface. A well-engineered composite board is built with that abuse in mind: the fading, splintering, and warping that plague solid timber decking are designed out at the material level, so the finish an architect specifies on day one is closer to what's still standing five years later.
              </p>
              <blockquote>
                The right decking doesn't just survive outdoor conditions — it disappears into the background of daily use.
              </blockquote>
            </section>

            <div className="ed-section-divider">
              <div className="grain-divider" style={{ width: "220px" }} />
            </div>

            <section>
              <h2>Design Beyond the Deck</h2>
              <p>
                NewTechWood's broader product range extends the same engineered-timber approach to cladding, siding, fencing, railing, and ceiling systems — giving architects a consistent material language to carry from the deck itself up the walls and across the ceiling line of an outdoor room, rather than mixing in unrelated finishes.
              </p>
            </section>
          </>
        )}
      </main>

      {/* EXPERIENCE CENTRE CTA BLOCK */}
      <div className="ed-cta-block">
        <div className="ed-cta-inner">
          <div className="ed-eyebrow">
            <span className="grain-mark"><span></span><span></span><span></span></span>
            Visit in Person
          </div>
          <h2>See how NewTechWood transforms an outdoor space</h2>
          <p>
            The Aaren IntPro Experience Centre keeps full board runs, fastener systems, and colourways on display, so a finish that reads well in a spec sheet can be checked against how it actually feels underfoot.
          </p>
          <div className="ed-cta-meta">
            <div><strong>Location</strong>Mysore Road, Bengaluru</div>
            <div><strong>Hours</strong>Mon&ndash;Sat, 10am&ndash;6:30pm</div>
            <div><strong>Ideal for</strong>Architects, builders &amp; homeowners</div>
          </div>
          <Link className="ed-cta-button" href="/contact">
            Plan a Visit
          </Link>
        </div>
      </div>

      {/* 5 REASONS SPECIFICATION CASE GRID */}
      <main className="ed-article-body ed-reasons-intro" style={{ paddingTop: "52px" }}>
        <div className="ed-eyebrow">
          <span className="grain-mark"><span></span><span></span><span></span></span>
          The Specification Case
        </div>
        <h2>5 Reasons Architects &amp; Builders Choose NewTechWood</h2>
        <p>
          The recurring reasons the material keeps making it onto approved-materials lists, in the order they usually come up in a site meeting:
        </p>

        <div className="ed-reasons-grid">
          {reasonsData.map((item) => (
            <div key={item.num} className={`ed-reason-card ${item.full ? "full" : ""}`}>
              <span className="ed-reason-num">{item.num}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* ARTICLE FOOTER, TAGS & COMMENTS */}
      <footer className="ed-article-footer">
        <div className="ed-tags">
          {tagsList.map((tag, idx) => (
            <span key={idx} className="ed-tag">{tag}</span>
          ))}
        </div>

        {/* COMMENTS SECTION */}
        <div className="ed-comments-section">
          <h3 className="ed-comments-title">Comments ({comments.length})</h3>

          {comments.map((c, i) => (
            <div key={i} className="ed-comment-card">
              <div className="ed-comment-author">
                <span>{c.author}</span>
                {c.date && <span style={{ opacity: 0.7 }}>{c.date}</span>}
              </div>
              <p className="ed-comment-text">{c.text}</p>
            </div>
          ))}

          <form onSubmit={handleCommentSubmit} className="ed-comment-form">
            <h4 style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", textTransform: "uppercase", color: "var(--walnut)", marginBottom: "14px", fontWeight: 600 }}>Add a Comment</h4>
            <div className="ed-form-field">
              <label className="ed-form-label">Name</label>
              <input
                type="text"
                required
                value={newComment.author}
                onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
                className="ed-form-input"
              />
            </div>
            <div className="ed-form-field">
              <label className="ed-form-label">Message</label>
              <textarea
                rows={3}
                required
                value={newComment.text}
                onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                className="ed-form-textarea"
              />
            </div>
            <button type="submit" className="ed-form-submit">
              Post Comment
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}
