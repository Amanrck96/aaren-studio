"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Download,
  ChevronRight,
  FileText,
  ArrowLeft,
  ArrowUpRight,
  Share2,
  Check,
  Layers,
  Search,
} from "lucide-react";
import { CategoryFolderItem, CategoryFolderPdf } from "@/lib/types";

interface CategoryShowroomProps {
  mode: "hub" | "category";
  categoryFolders: CategoryFolderItem[];
  currentCategory?: CategoryFolderItem;
}

const DEFAULT_HERO_IMAGE =
  "https://cdn0030.qrcodechimp.com/qr/PROD/6378687803027531b00d39f3/fm/aaren_showrrom.jpg?v=1787116547849";
const WALLPAPER_BG =
  "https://cdn0070.qrcodechimp.com/images/digitalCard/bg/background_10.jpg?v=1786078860";

export default function CategoryShowroom({
  mode,
  categoryFolders,
  currentCategory,
}: CategoryShowroomProps) {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isHub = mode === "hub" || !currentCategory;

  const filteredCategories = categoryFolders.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const name = (c.name || "").toLowerCase();
    const desc = (c.description || "").toLowerCase();
    const tagline = (c.tagline || "").toLowerCase();
    return name.includes(q) || desc.includes(q) || tagline.includes(q);
  });

  const pageTitle = isHub ? "Aaren Intpro" : currentCategory.name;
  const pageTagline = isHub
    ? "Curated Architectural Categories"
    : currentCategory.tagline || currentCategory.description || "Official Catalogues & Technical Specifications";
  const heroImage = isHub
    ? DEFAULT_HERO_IMAGE
    : currentCategory.bannerImageUrl || currentCategory.logoUrl || DEFAULT_HERO_IMAGE;

  const files: CategoryFolderPdf[] = currentCategory?.files || [];

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: pageTitle,
          text: `Explore official architectural catalogues for ${pageTitle} — curated by Aaren Intpro.`,
          url,
        });
        return;
      } catch (_) {}
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (_) {}
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        backgroundImage: `url(${WALLPAPER_BG})`,
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          minHeight: "100vh",
          padding: "20px 16px 40px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Top bar (Share / Back) */}
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          {!isHub ? (
            <Link
              href="/category-downloads"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "#81663F",
                fontSize: "12px",
                fontWeight: 600,
                textDecoration: "none",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(8px)",
                padding: "6px 14px",
                borderRadius: "9999px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                border: "1px solid rgba(129, 102, 63, 0.15)",
              }}
            >
              <ArrowLeft style={{ width: 14, height: 14 }} />
              <span>All Categories</span>
            </Link>
          ) : (
            <Link
              href="/downloads"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "#81663F",
                fontSize: "12px",
                fontWeight: 600,
                textDecoration: "none",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(8px)",
                padding: "6px 14px",
                borderRadius: "9999px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                border: "1px solid rgba(129, 102, 63, 0.15)",
              }}
            >
              <ArrowLeft style={{ width: 14, height: 14 }} />
              <span>Brand Downloads</span>
            </Link>
          )}

          <button
            onClick={handleShare}
            type="button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: copied ? "#2E7D32" : "#81663F",
              fontSize: "12px",
              fontWeight: 600,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(129, 102, 63, 0.15)",
              padding: "6px 14px",
              borderRadius: "9999px",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              transition: "all 0.2s ease",
            }}
          >
            {copied ? (
              <>
                <Check style={{ width: 14, height: 14 }} />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 style={{ width: 14, height: 14 }} />
                <span>Share</span>
              </>
            )}
          </button>
        </div>

        {/* ══════════════════════════════════════
            1. HERO CARD
            ══════════════════════════════════════ */}
        <div
          style={{
            width: "100%",
            backgroundColor: "#fff",
            borderRadius: "20px",
            boxShadow: "0 7px 29px rgba(100,100,111,0.2)",
            border: "1px solid rgba(0,0,0,0.05)",
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          {/* Hero Banner */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "220px",
              backgroundColor: "#EFECE6",
            }}
          >
            <Image
              src={heroImage}
              alt={pageTitle}
              fill
              priority
              sizes="(max-width: 480px) 100vw, 480px"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>

          {/* Profile Details Container */}
          <div
            style={{
              position: "relative",
              padding: "0 24px 28px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Round Avatar / Cover */}
            <div
              style={{
                position: "relative",
                width: "92px",
                height: "92px",
                borderRadius: "50%",
                backgroundColor: "#fff",
                border: "4px solid #fff",
                boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                marginTop: "-46px",
                overflow: "hidden",
                zIndex: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {currentCategory?.logoUrl ? (
                <Image
                  src={currentCategory.logoUrl}
                  alt={pageTitle}
                  fill
                  sizes="92px"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(129, 102, 63, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Layers style={{ width: 38, height: 38, color: "#81663F" }} />
                </div>
              )}
            </div>

            {/* Title & Tagline */}
            <h1
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#1E1E1E",
                marginTop: "14px",
                marginBottom: "0",
                letterSpacing: "-0.01em",
              }}
            >
              {pageTitle}
            </h1>
            <p
              style={{
                fontSize: "13px",
                color: "#6A6359",
                marginTop: "6px",
                marginBottom: "0",
                lineHeight: "1.4",
                maxWidth: "340px",
              }}
            >
              {pageTagline}
            </p>

            {/* Quick stats pill */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                marginTop: "12px",
                padding: "4px 12px",
                borderRadius: "9999px",
                backgroundColor: "rgba(129, 102, 63, 0.08)",
                fontSize: "11px",
                fontWeight: 700,
                color: "#81663F",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              <Layers style={{ width: 12, height: 12 }} />
              <span>
                {isHub
                  ? `${categoryFolders.length} Categories Available`
                  : `${files.length} Official Catalogues`}
              </span>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            2. HUB VIEW: CATEGORIES LIST
            ══════════════════════════════════════ */}
        {isHub ? (
          <div style={{ width: "100%", marginTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>

            {/* Search Input */}
            <div style={{ position: "relative", width: "100%" }}>
              <Search
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 15,
                  height: 15,
                  color: "#8A8275",
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                placeholder={`Search ${categoryFolders.length} categories...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px 10px 38px",
                  borderRadius: "14px",
                  border: "1px solid rgba(129, 102, 63, 0.15)",
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(8px)",
                  fontSize: "13px",
                  color: "#1E1E1E",
                  outline: "none",
                  boxSizing: "border-box",
                  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.04)",
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    color: "#8A8275",
                    fontSize: "12px",
                    cursor: "pointer",
                    padding: "4px",
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Categories List Cards */}
            {filteredCategories.length > 0 ? (
              filteredCategories.map((c) => {
                const pdfCount = c.files?.length || 0;
                return (
                  <Link
                    key={c.id || c.slug}
                    href={`/category-downloads/${c.slug}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "16px",
                      width: "100%",
                      backgroundColor: "#fff",
                      borderRadius: "16px",
                      boxShadow: "0 7px 29px rgba(100,100,111,0.2)",
                      border: "1px solid rgba(0,0,0,0.05)",
                      padding: "16px 20px",
                      boxSizing: "border-box",
                      textDecoration: "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          position: "relative",
                          width: "56px",
                          height: "56px",
                          borderRadius: "12px",
                          overflow: "hidden",
                          backgroundColor: "#FAF8F5",
                          border: "1px solid #EAE4D9",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {c.logoUrl || c.bannerImageUrl ? (
                          <Image
                            src={c.logoUrl || c.bannerImageUrl || ""}
                            alt={c.name}
                            fill
                            sizes="56px"
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <Layers style={{ width: 24, height: 24, color: "#81663F" }} />
                        )}
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: 600,
                              color: "#4A3821",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {c.name}
                          </span>
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: 700,
                              padding: "2px 6px",
                              borderRadius: "4px",
                              backgroundColor: "rgba(129, 102, 63, 0.1)",
                              color: "#81663F",
                              letterSpacing: "0.04em",
                              flexShrink: 0,
                            }}
                          >
                            {pdfCount} {pdfCount === 1 ? "Catalogue" : "Catalogues"}
                          </span>
                        </div>
                        {c.tagline && (
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#8A8275",
                              margin: "2px 0 0",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {c.tagline}
                          </p>
                        )}
                      </div>
                    </div>

                    <ChevronRight style={{ width: 20, height: 20, color: "#81663F", flexShrink: 0, strokeWidth: 1.75 }} />
                  </Link>
                );
              })
            ) : (
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "16px",
                  padding: "24px",
                  textAlign: "center",
                  boxShadow: "0 7px 29px rgba(100,100,111,0.2)",
                  border: "1px solid rgba(0,0,0,0.05)",
                }}
              >
                <p style={{ margin: 0, fontSize: "14px", color: "#6A6359" }}>
                  No categories found matching "{searchQuery}"
                </p>
              </div>
            )}

            {/* Direct link to Categories Directory */}
            <div style={{ textAlign: "center", marginTop: "4px" }}>
              <Link
                href="/categories"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#81663F",
                  textDecoration: "none",
                  padding: "8px 16px",
                  borderRadius: "9999px",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid rgba(129, 102, 63, 0.2)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                }}
              >
                <span>View Full Categories Grid</span>
                <ArrowUpRight style={{ width: 13, height: 13 }} />
              </Link>
            </div>
          </div>
        ) : (
          /* ══════════════════════════════════════
              3. CATEGORY SHOWROOM: PDF CATALOGUES
              ══════════════════════════════════════ */
          <div style={{ width: "100%", marginTop: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {files.length > 0 ? (
              files.map((file, idx) => {
                const pdfName = file.name || `Catalogue ${idx + 1}`;
                return (
                  <div
                    key={`${file.url}-${idx}`}
                    style={{
                      width: "100%",
                      backgroundColor: "#fff",
                      borderRadius: "16px",
                      boxShadow: "0 7px 29px rgba(100,100,111,0.2)",
                      border: "1px solid rgba(0,0,0,0.05)",
                      padding: "16px 20px",
                      boxSizing: "border-box",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "12px",
                          backgroundColor: "#FAF8F5",
                          border: "1px solid #EAE4D9",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#81663F",
                          flexShrink: 0,
                        }}
                      >
                        <FileText style={{ width: 20, height: 20 }} />
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#1E1E1E",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {pdfName}
                        </div>
                        <div style={{ fontSize: "11px", color: "#8A8275", marginTop: "2px" }}>
                          {file.fileSize || "Official Specification PDF"}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "8px 14px",
                          borderRadius: "12px",
                          backgroundColor: "#81663F",
                          color: "#fff",
                          fontSize: "12px",
                          fontWeight: 600,
                          textDecoration: "none",
                        }}
                      >
                        <Download style={{ width: 14, height: 14 }} />
                        <span>Download</span>
                      </a>
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  width: "100%",
                  backgroundColor: "#fff",
                  borderRadius: "16px",
                  boxShadow: "0 7px 29px rgba(100,100,111,0.2)",
                  border: "1px solid rgba(0,0,0,0.05)",
                  padding: "24px",
                  boxSizing: "border-box",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#1E1E1E", margin: 0 }}>
                  Catalogues Updating
                </p>
                <p style={{ fontSize: "12px", color: "#8A8275", marginTop: "8px" }}>
                  The latest specifications for {currentCategory?.name} are being prepared.
                </p>
                <Link
                  href="/contact"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#81663F",
                    textDecoration: "none",
                    marginTop: "12px",
                  }}
                >
                  <span>Inquire with concierge</span>
                  <ArrowUpRight style={{ width: 12, height: 12 }} />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════
            4. CONTACT & CONCIERGE CARD
            ══════════════════════════════════════ */}
        <section
          style={{
            width: "100%",
            marginTop: "14px",
            backgroundColor: "#fff",
            borderRadius: "16px",
            boxShadow: "0 7px 29px rgba(100,100,111,0.2)",
            border: "1px solid rgba(0,0,0,0.05)",
            padding: "16px 20px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
              paddingBottom: "12px",
              borderBottom: "1px solid #F0EBE1",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(129,102,63,0.1)",
                  color: "#81663F",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Phone style={{ width: 16, height: 16 }} />
              </div>
              <div>
                <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#1E1E1E", margin: 0 }}>
                  Contact Details
                </h2>
                <p style={{ fontSize: "11px", color: "#8A8275", margin: 0 }}>
                  Aaren Intpro Concierge
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* Phone */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  backgroundColor: "#FAF8F5",
                  border: "1px solid #EAE4D9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#81663F",
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              >
                <Phone style={{ width: 14, height: 14 }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: "11px", color: "#8A8275", display: "block" }}>Phone</span>
                <a
                  href="tel:+918076027960"
                  style={{ fontSize: "13px", fontWeight: 600, color: "#1E1E1E", textDecoration: "none" }}
                >
                  +91 80760 27960
                </a>
              </div>
              <a
                href="tel:+918076027960"
                style={{
                  padding: "6px 12px",
                  borderRadius: "10px",
                  backgroundColor: "#81663F",
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Call
              </a>
            </div>

            {/* Email */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  backgroundColor: "#FAF8F5",
                  border: "1px solid #EAE4D9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#81663F",
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              >
                <Mail style={{ width: 14, height: 14 }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: "11px", color: "#8A8275", display: "block" }}>Email</span>
                <a
                  href="mailto:concierge@aarenintpro.com"
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#1E1E1E",
                    textDecoration: "none",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "block",
                  }}
                >
                  concierge@aarenintpro.com
                </a>
              </div>
              <a
                href="mailto:concierge@aarenintpro.com"
                style={{
                  padding: "6px 12px",
                  borderRadius: "10px",
                  backgroundColor: "#81663F",
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Email
              </a>
            </div>

            {/* Address */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  backgroundColor: "#FAF8F5",
                  border: "1px solid #EAE4D9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#81663F",
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              >
                <MapPin style={{ width: 14, height: 14 }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: "11px", color: "#8A8275", display: "block" }}>Address</span>
                <p style={{ fontSize: "12px", color: "#1E1E1E", margin: "2px 0 0", lineHeight: "1.4" }}>
                  Plot No. 368, MG Road, Sultanpur, New Delhi 110030
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            5. FOOTER WATERMARK
            ══════════════════════════════════════ */}
        <footer
          style={{
            marginTop: "32px",
            textAlign: "center",
            padding: "0 16px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#81663F",
            }}
          >
            Aaren Intpro
          </div>
          <p style={{ fontSize: "11px", color: "#4A453E", marginTop: "4px", maxWidth: "280px", margin: "4px auto 0" }}>
            Curated by Aaren Intpro · Luxury Surfaces &amp; Architectural Systems
          </p>
          <div style={{ marginTop: "6px" }}>
            <a
              href="https://www.aarenintpro.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#81663F",
                textDecoration: "underline",
                textUnderlineOffset: "4px",
              }}
            >
              www.aarenintpro.com
            </a>
          </div>
        </footer>

      </div>
    </div>
  );
}
