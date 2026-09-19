"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { CategoryItem } from "@/lib/types";

// ─── Design tokens ───────────────────────────────────────────────
const BG = "#0d0f12";
const SURFACE = "#12151a";
const CARD_BG = "#161a20";
const GOLD = "#D4AF37";
const GOLD_DARK = "#81663F";
const GOLD_LIGHT = "rgba(212,175,55,0.12)";
const BORDER = "rgba(212,175,55,0.18)";
const BORDER_HOVER = "rgba(212,175,55,0.45)";
const TEXT = "#f0ece3";
const TEXT_MUTED = "#8a8275";
const TEXT_FAINT = "#5a5550";

interface Props {
  initialCategories: CategoryItem[];
}

export default function CategoriesClient({ initialCategories }: Props) {
  const [search, setSearch] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return initialCategories;
    return initialCategories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.shortCode.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }, [initialCategories, search]);

  return (
    <div style={{ background: BG, minHeight: "100vh", color: TEXT, fontFamily: "inherit" }}>
      {/* ── Hero ────────────────────────────────────────────────── */}
      <div
        style={{
          background: `linear-gradient(160deg, ${SURFACE} 0%, #0a0c10 60%, ${BG} 100%)`,
          borderBottom: `1px solid ${BORDER}`,
          padding: "80px 24px 60px",
          textAlign: "center",
        }}
      >
        {/* Eyebrow */}
        <span
          style={{
            display: "inline-block",
            padding: "4px 16px",
            borderRadius: 9999,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: GOLD,
            background: GOLD_LIGHT,
            border: `1px solid ${BORDER}`,
            marginBottom: 24,
          }}
        >
          Browse by Category
        </span>

        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            color: TEXT,
            margin: "0 auto 16px",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          Explore Our{" "}
          <span
            style={{
              background: `linear-gradient(90deg, ${GOLD}, #b8902a)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Collections
          </span>
        </h1>

        <p
          style={{
            fontSize: 16,
            color: TEXT_MUTED,
            maxWidth: 540,
            margin: "0 auto 40px",
            lineHeight: 1.7,
          }}
        >
          Discover premium architectural product categories — curated for
          design excellence across every interior typology.
        </p>

        {/* Stats pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 20px",
            borderRadius: 9999,
            background: SURFACE,
            border: `1px solid ${BORDER}`,
            fontSize: 13,
            color: TEXT_MUTED,
          }}
        >
          <span style={{ color: GOLD, fontWeight: 700 }}>{initialCategories.length}</span>
          {" "}categories available
        </div>
      </div>

      {/* ── Search bar ──────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "32px 24px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: SURFACE,
            border: `1px solid ${BORDER}`,
            borderRadius: 16,
            padding: "12px 20px",
            maxWidth: 560,
            margin: "0 auto",
          }}
        >
          {/* Search icon */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={TEXT_FAINT}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0 }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search categories, codes, or descriptions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: TEXT,
              fontSize: 14,
              fontFamily: "inherit",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                background: "none",
                border: "none",
                color: TEXT_FAINT,
                cursor: "pointer",
                fontSize: 18,
                lineHeight: 1,
                padding: 0,
              }}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* Result count */}
        {search && (
          <p
            style={{
              textAlign: "center",
              fontSize: 13,
              color: TEXT_FAINT,
              marginTop: 12,
            }}
          >
            Showing{" "}
            <span style={{ color: GOLD, fontWeight: 600 }}>{filtered.length}</span> of{" "}
            {initialCategories.length} categories
          </p>
        )}
      </div>

      {/* ── Grid ────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "32px 24px 80px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 24,
        }}
      >
        {filtered.length === 0 ? (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "80px 24px",
              color: TEXT_FAINT,
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: TEXT_MUTED, marginBottom: 8 }}>
              No categories found
            </div>
            <div style={{ fontSize: 14 }}>
              Try a different search term.
            </div>
          </div>
        ) : (
          filtered.map((cat) => {
            const isHovered = hoveredId === cat.id;
            return (
              <Link
                key={cat.id}
                href={`/products?category=${encodeURIComponent(cat.name)}`}
                style={{ textDecoration: "none", display: "block" }}
                onMouseEnter={() => setHoveredId(cat.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div
                  style={{
                    background: CARD_BG,
                    border: `1px solid ${isHovered ? BORDER_HOVER : BORDER}`,
                    borderRadius: 20,
                    overflow: "hidden",
                    transition: "all 0.25s ease",
                    transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                    boxShadow: isHovered
                      ? `0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px ${BORDER_HOVER}`
                      : "0 4px 16px rgba(0,0,0,0.2)",
                  }}
                >
                  {/* Cover image */}
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      paddingTop: "56.25%", // 16:9
                      background: "linear-gradient(135deg, #1a1e24, #0d0f12)",
                      overflow: "hidden",
                    }}
                  >
                    {cat.coverImage ? (
                      <Image
                        src={cat.coverImage}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{
                          objectFit: "cover",
                          filter: isHovered ? "brightness(0.85)" : "brightness(0.7)",
                          transition: "filter 0.25s ease, transform 0.25s ease",
                          transform: isHovered ? "scale(1.04)" : "scale(1)",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 48,
                          opacity: 0.3,
                        }}
                      >
                        🏷️
                      </div>
                    )}

                    {/* Sequence badge */}
                    <div
                      style={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        padding: "3px 10px",
                        borderRadius: 9999,
                        fontSize: 10,
                        fontWeight: 700,
                        backgroundColor: "rgba(0,0,0,0.7)",
                        color: GOLD,
                        letterSpacing: "0.05em",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      #{cat.sequenceNumber.toString().padStart(2, "0")}
                    </div>

                    {/* Short code badge */}
                    {cat.shortCode && (
                      <div
                        style={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          padding: "3px 10px",
                          borderRadius: 9999,
                          fontSize: 10,
                          fontWeight: 700,
                          background: GOLD_LIGHT,
                          color: GOLD,
                          border: `1px solid ${BORDER}`,
                          backdropFilter: "blur(4px)",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {cat.shortCode}
                      </div>
                    )}

                    {/* Gradient overlay */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "50%",
                        background: "linear-gradient(to top, rgba(13,15,18,0.9), transparent)",
                      }}
                    />
                  </div>

                  {/* Card body */}
                  <div style={{ padding: "20px 22px 22px" }}>
                    <h3
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: TEXT,
                        margin: "0 0 8px",
                        letterSpacing: "0.02em",
                        textTransform: "uppercase",
                        lineHeight: 1.3,
                      }}
                    >
                      {cat.name}
                    </h3>

                    {cat.description && (
                      <p
                        style={{
                          fontSize: 13,
                          color: TEXT_MUTED,
                          margin: "0 0 16px",
                          lineHeight: 1.6,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical" as React.CSSProperties["WebkitBoxOrient"],
                          overflow: "hidden",
                        }}
                      >
                        {cat.description}
                      </p>
                    )}

                    {/* CTA row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: 14,
                        borderTop: `1px solid ${BORDER}`,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          color: TEXT_FAINT,
                          fontWeight: 500,
                        }}
                      >
                        Browse Products
                      </span>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 12,
                          fontWeight: 700,
                          color: GOLD_DARK,
                          transition: "color 0.2s",
                        }}
                      >
                        View{" "}
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={isHovered ? GOLD : GOLD_DARK}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ transition: "stroke 0.2s, transform 0.2s", transform: isHovered ? "translateX(3px)" : "none" }}
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* ── Global styles ──────────────────────────────────────── */}
      <style>{`
        @media (max-width: 640px) {
          .categories-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
