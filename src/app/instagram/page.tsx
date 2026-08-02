"use client";

import { useState } from "react";
import Image from "next/image";

interface InstaPost {
  id: string;
  image: string;
  likes: string;
  comments: string;
  caption: string;
  type: "Photo" | "Reel" | "Carousel";
  tag: "Materials" | "Projects" | "Behind The Scenes" | "Design Inspiration";
  date: string;
}

const INSTA_POSTS: InstaPost[] = [
  {
    id: "post-1",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    likes: "1,248",
    comments: "42",
    caption: "Sculptural Italian marble details seamlessly integrated with ambient warm glow. A peak into the Presidential Suite lobby project.",
    type: "Photo",
    tag: "Projects",
    date: "2 DAYS AGO",
  },
  {
    id: "post-2",
    image: "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=800&q=80",
    likes: "2,094",
    comments: "89",
    caption: "Newtech Wood composite cladding in coastal humidity. Built to weather gracefully while maintaining architectural purity.",
    type: "Reel",
    tag: "Materials",
    date: "4 DAYS AGO",
  },
  {
    id: "post-3",
    image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80",
    likes: "3,110",
    comments: "114",
    caption: "Harmonizing raw tactile stone with precision Falper sanitary fittings. The essence of spa wellness design.",
    type: "Carousel",
    tag: "Design Inspiration",
    date: "1 WEEK AGO",
  },
  {
    id: "post-4",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80",
    likes: "982",
    comments: "31",
    caption: "Inside our Milan design safari: inspecting handcrafted veneer flitches before export to our Mumbai atelier.",
    type: "Photo",
    tag: "Behind The Scenes",
    date: "1 WEEK AGO",
  },
  {
    id: "post-5",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    likes: "1,850",
    comments: "67",
    caption: "Mafi natural wood flooring laying process in a Delhi penthouse residence. Zero toxins, pure craft.",
    type: "Reel",
    tag: "Materials",
    date: "2 WEEKS AGO",
  },
  {
    id: "post-6",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    likes: "1,430",
    comments: "53",
    caption: "Architectural glass screens by Waltz creating subtle acoustic separation in open-plan executive suites.",
    type: "Photo",
    tag: "Projects",
    date: "2 WEEKS AGO",
  },
  {
    id: "post-7",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
    likes: "2,760",
    comments: "98",
    caption: "Formica surface textures under directional spot lighting. A study in shadow and tactile depth.",
    type: "Carousel",
    tag: "Design Inspiration",
    date: "3 WEEKS AGO",
  },
  {
    id: "post-8",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
    likes: "1,120",
    comments: "44",
    caption: "Material mockups ready for presentation at Aaren Studio Material House. Crafting tactile journeys.",
    type: "Photo",
    tag: "Behind The Scenes",
    date: "3 WEEKS AGO",
  },
  {
    id: "post-9",
    image: "https://images.unsplash.com/photo-1504615755583-2916b52192a3?auto=format&fit=crop&w=800&q=80",
    likes: "3,400",
    comments: "152",
    caption: "Triple-height glass atrium illuminated by custom architectural linear downlights.",
    type: "Reel",
    tag: "Projects",
    date: "1 MONTH AGO",
  },
];

const TAGS = ["All", "Projects", "Materials", "Design Inspiration", "Behind The Scenes"];

export default function InstagramPage() {
  const [activeTag, setActiveTag] = useState("All");
  const [selectedPost, setSelectedPost] = useState<InstaPost | null>(null);

  const filteredPosts = INSTA_POSTS.filter(
    (post) => activeTag === "All" || post.tag === activeTag
  );

  return (
    <div className="insta-page">
      {/* Profile Header */}
      <section className="insta-header">
        <div className="insta-header__inner">
          <div className="insta-avatar-wrap">
            <div className="insta-avatar">
              <span>AAREN</span>
            </div>
          </div>

          <div className="insta-profile-info">
            <div className="insta-profile-title">
              <h1>aaren.studio</h1>
              <a
                href="https://www.instagram.com/aaren.studio/"
                target="_blank"
                rel="noopener noreferrer"
                className="insta-follow-btn"
              >
                Follow on Instagram →
              </a>
            </div>

            <div className="insta-stats">
              <span><strong>482</strong> posts</span>
              <span><strong>24.8K</strong> followers</span>
              <span><strong>190</strong> following</span>
            </div>

            <div className="insta-bio">
              <h2>AAREN | Creative Studio & Material House</h2>
              <p>📍 Mumbai | New Delhi | Milan</p>
              <p>Designing & producing immersive spatial experiences — meant to evoke feeling.</p>
              <p className="bio-link">aarenstudio.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="insta-tabs-section">
        <div className="insta-tabs">
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`tab-btn ${activeTag === tag ? "is-active" : ""}`}
            >
              {tag.toUpperCase()}
            </button>
          ))}
        </div>
      </section>

      {/* Instagram Grid */}
      <main className="insta-main">
        <div className="insta-grid">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="insta-card"
              onClick={() => setSelectedPost(post)}
            >
              <div className="insta-card__fig">
                <Image
                  src={post.image}
                  alt={post.caption}
                  fill
                  sizes="(max-width: 768px) 33vw, 33vw"
                  className="insta-img"
                />
                
                {/* Type Badge */}
                {post.type !== "Photo" && (
                  <span className="type-badge">{post.type === "Reel" ? "🎥 REEL" : "📸 GALLERY"}</span>
                )}

                {/* Hover Overlay */}
                <div className="insta-overlay">
                  <div className="overlay-metrics">
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                  </div>
                  <p className="overlay-caption">{post.caption.slice(0, 70)}...</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Post Modal Lightbox */}
      {selectedPost && (
        <div className="modal-backdrop" onClick={() => setSelectedPost(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedPost(null)}>
              ✕
            </button>
            <div className="modal-grid">
              <div className="modal-media">
                <img src={selectedPost.image} alt="" />
              </div>
              <div className="modal-details">
                <div className="modal-user">
                  <div className="user-avatar">A</div>
                  <div>
                    <span className="user-handle">aaren.studio</span>
                    <span className="user-location">Aaren Studio Material House</span>
                  </div>
                </div>

                <div className="modal-body">
                  <p className="modal-caption">{selectedPost.caption}</p>
                  <div className="modal-tags">
                    <span className="tag-badge">#{selectedPost.tag.replace(/\s+/g, "")}</span>
                    <span className="tag-badge">#AarenStudio</span>
                    <span className="tag-badge">#Architecture</span>
                  </div>
                  <span className="modal-date">{selectedPost.date}</span>
                </div>

                <div className="modal-footer">
                  <div className="modal-stats">
                    <span>❤️ {selectedPost.likes} likes</span>
                    <span>💬 {selectedPost.comments} comments</span>
                  </div>
                  <a
                    href="https://www.instagram.com/aaren.studio/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-cta"
                  >
                    View Original Post on Instagram ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="insta-cta">
        <h2>JOIN OUR DESIGN COMMUNITY</h2>
        <p>Follow @aaren.studio for daily material inspiration, project reveals, and behind-the-scenes craft.</p>
        <a
          href="https://www.instagram.com/aaren.studio/"
          target="_blank"
          rel="noopener noreferrer"
          className="cta-btn"
        >
          FOLLOW @AAREN.STUDIO →
        </a>
      </section>

      <style>{`
        .insta-page {
          background-color: #000000;
          color: #ffffff;
          min-height: 100vh;
          padding-top: 9rem;
          font-family: var(--font-jost), 'Jost', sans-serif;
        }

        .insta-header {
          max-width: 935px;
          margin: 0 auto;
          padding: 4rem 2rem 3rem;
          border-bottom: 1px solid rgba(255,255,255,0.12);
        }

        .insta-header__inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3rem;
          text-align: center;
        }

        @media (min-width: 768px) {
          .insta-header__inner {
            flex-direction: row;
            text-align: left;
            align-items: flex-start;
            gap: 6rem;
          }
        }

        .insta-avatar-wrap {
          flex-shrink: 0;
        }

        .insta-avatar {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .insta-avatar span {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #000000;
          border: 3px solid #000000;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 1.4rem;
          letter-spacing: 0.1em;
          color: #ffffff;
        }

        .insta-profile-info {
          display: flex;
          flex-direction: column;
          gap: 1.6rem;
        }

        .insta-profile-title {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 2rem;
          justify-content: center;
        }

        @media (min-width: 768px) {
          .insta-profile-title {
            justify-content: flex-start;
          }
        }

        .insta-profile-title h1 {
          font-size: 2.8rem;
          font-weight: 300;
          letter-spacing: -0.02em;
          margin: 0;
          text-transform: none;
        }

        .insta-follow-btn {
          background: #ffffff;
          color: #000000;
          padding: 0.8rem 2rem;
          border-radius: 0.6rem;
          font-size: 1.2rem;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.2s ease;
        }

        .insta-follow-btn:hover {
          background: #e0e0e0;
        }

        .insta-stats {
          display: flex;
          gap: 3rem;
          font-size: 1.4rem;
          color: rgba(255,255,255,0.7);
          justify-content: center;
        }

        @media (min-width: 768px) {
          .insta-stats {
            justify-content: flex-start;
          }
        }

        .insta-stats strong {
          color: #ffffff;
        }

        .insta-bio {
          font-size: 1.3rem;
          line-height: 1.5;
          color: rgba(255,255,255,0.85);
        }

        .insta-bio h2 {
          font-size: 1.4rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.4rem;
          text-transform: none;
        }

        .bio-link {
          color: #3897f0;
          font-weight: 600;
        }

        .insta-tabs-section {
          max-width: 935px;
          margin: 0 auto;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .insta-tabs {
          display: flex;
          justify-content: center;
          gap: 2rem;
          overflow-x: auto;
          padding: 0 1rem;
        }

        .tab-btn {
          background: none;
          border: none;
          color: rgba(255,255,255,0.4);
          padding: 1.6rem 1rem;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          cursor: pointer;
          border-top: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .tab-btn.is-active {
          color: #ffffff;
          border-top-color: #ffffff;
        }

        .insta-main {
          max-width: 935px;
          margin: 0 auto;
          padding: 3rem 1rem 6rem;
        }

        .insta-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.4rem;
        }

        @media (min-width: 768px) {
          .insta-grid {
            gap: 2.4rem;
          }
        }

        .insta-card {
          aspect-ratio: 1 / 1;
          position: relative;
          cursor: pointer;
          overflow: hidden;
          background: #111111;
        }

        .insta-card__fig {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .insta-img {
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .insta-card:hover .insta-img {
          transform: scale(1.05);
        }

        .type-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(4px);
          font-size: 0.9rem;
          font-weight: 700;
          padding: 0.3rem 0.8rem;
          border-radius: 0.4rem;
        }

        .insta-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          opacity: 0;
          transition: opacity 0.25s ease;
          padding: 2rem;
          text-align: center;
        }

        .insta-card:hover .insta-overlay {
          opacity: 1;
        }

        .overlay-metrics {
          display: flex;
          gap: 2rem;
          font-size: 1.6rem;
          font-weight: 700;
        }

        .overlay-caption {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.7);
          line-height: 1.4;
        }

        /* Modal */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .modal-content {
          background: #121212;
          border: 1px solid rgba(255,255,255,0.15);
          width: 100%;
          max-width: 900px;
          max-height: 85vh;
          border-radius: 0.8rem;
          overflow: hidden;
          position: relative;
        }

        .modal-close {
          position: absolute;
          top: 1.2rem;
          right: 1.2rem;
          background: rgba(0,0,0,0.6);
          border: none;
          color: #ffffff;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          z-index: 10;
        }

        .modal-grid {
          display: grid;
          grid-template-columns: 1fr;
          height: 100%;
        }

        @media (min-width: 768px) {
          .modal-grid {
            grid-template-columns: 1.2fr 1fr;
          }
        }

        .modal-media img {
          width: 100%;
          height: 100%;
          max-height: 70vh;
          object-fit: cover;
          display: block;
        }

        .modal-details {
          padding: 2.4rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 2rem;
        }

        .modal-user {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          padding-bottom: 1.6rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: #ffffff;
          color: #000000;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
        }

        .user-handle {
          display: block;
          font-weight: 700;
          font-size: 1.4rem;
        }

        .user-location {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.4);
        }

        .modal-body {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .modal-caption {
          font-size: 1.3rem;
          line-height: 1.6;
          color: rgba(255,255,255,0.85);
        }

        .modal-tags {
          display: flex;
          gap: 0.8rem;
          flex-wrap: wrap;
        }

        .tag-badge {
          font-size: 1.1rem;
          color: #3897f0;
        }

        .modal-date {
          font-size: 1rem;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.05em;
        }

        .modal-footer {
          padding-top: 1.6rem;
          border-top: 1px solid rgba(255,255,255,0.1);
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .modal-stats {
          display: flex;
          justify-content: space-between;
          font-size: 1.3rem;
          font-weight: 700;
        }

        .modal-cta {
          background: #ffffff;
          color: #000000;
          text-align: center;
          padding: 1rem;
          border-radius: 0.4rem;
          font-weight: 700;
          font-size: 1.2rem;
          text-decoration: none;
        }

        /* CTA Section */
        .insta-cta {
          background: #111111;
          border-top: 1px solid rgba(255,255,255,0.1);
          padding: 6rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.6rem;
        }

        .insta-cta h2 {
          font-size: 2.8rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .insta-cta p {
          font-size: 1.5rem;
          color: rgba(255,255,255,0.6);
          max-width: 600px;
        }

        .cta-btn {
          background: #ffffff;
          color: #000000;
          padding: 1.2rem 2.8rem;
          border-radius: 999px;
          font-weight: 800;
          font-size: 1.2rem;
          letter-spacing: 0.08em;
          text-decoration: none;
          margin-top: 1rem;
          transition: transform 0.25s ease;
        }

        .cta-btn:hover {
          transform: translateY(-0.2rem);
        }
      `}</style>
    </div>
  );
}
