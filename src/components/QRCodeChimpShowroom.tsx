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
  UserPlus,
  ArrowLeft,
  ArrowUpRight,
  Share2,
  Check,
} from "lucide-react";
import { BrandFolderItem, BrandFolderPdf } from "@/lib/types";

interface QRCodeChimpShowroomProps {
  mode: "hub" | "brand";
  brandFolders: BrandFolderItem[];
  currentBrand?: BrandFolderItem;
}

const DEFAULT_HERO_IMAGE =
  "https://cdn0030.qrcodechimp.com/qr/PROD/6378687803027531b00d39f3/fm/aaren_showrrom.jpg?v=1787116547849";
const DEFAULT_BRAND_LOGO =
  "https://cdn0030.qrcodechimp.com/qr/PROD/6378687803027531b00d39f3/fm/untitled_design_9.jpg?v=1787116561385";
const WALLPAPER_BG =
  "https://cdn0070.qrcodechimp.com/images/digitalCard/bg/background_10.jpg?v=1786078860";

function getDisplayBrandName(b: BrandFolderItem): string {
  const name = b.name || "";
  const lower = name.toLowerCase().trim();
  if (lower.startsWith("waltz")) return "Waltz";
  if (lower.startsWith("slashform")) return "Slashform";
  if (lower.startsWith("newtech")) return "NewTechWood";
  if (lower.startsWith("formica")) return "Formica";
  if (lower.startsWith("loco")) return "Loco";
  if (lower.startsWith("falper")) return "Falper";
  if (lower.startsWith("fima")) return "Fima";
  if (lower.startsWith("inkio")) return "Inkiostro Bianco";
  if (lower.startsWith("mafi")) return "mafi";
  if (lower.startsWith("mirage")) return "Mirage";
  if (lower.startsWith("freedom")) return "Freedom Screens";
  if (lower.startsWith("peelply")) return "Peelply";
  if (lower.startsWith("inclass")) return "Inclass";
  if (lower.startsWith("wow")) return "WOW";
  if (lower.startsWith("iww")) return "IWW";
  if (lower.startsWith("living")) return "Living Ceramics";
  if (lower.startsWith("florim")) return "Florim";
  if (lower.startsWith("gelli")) return "Gelli";
  if (lower.startsWith("jacuzzi")) return "Jacuzzi";
  if (lower.startsWith("alex")) return "Alex Turco";
  return name;
}

export default function QRCodeChimpShowroom({
  mode,
  brandFolders,
  currentBrand,
}: QRCodeChimpShowroomProps) {
  const [copied, setCopied] = useState(false);

  const isHub = mode === "hub" || !currentBrand;
  const pageTitle = isHub ? "Aaren Intpro" : currentBrand.name;
  const pageTagline = isHub
    ? "i am Where Design Is"
    : currentBrand.tagline || currentBrand.description || "Official Catalogues & Specifications";
  const heroImage = isHub
    ? DEFAULT_HERO_IMAGE
    : currentBrand.bannerImageUrl || DEFAULT_HERO_IMAGE;
  const logoImage = isHub
    ? DEFAULT_BRAND_LOGO
    : currentBrand.logoUrl || DEFAULT_BRAND_LOGO;

  const files: BrandFolderPdf[] = currentBrand
    ? (currentBrand.files || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0))
    : [];

  const handleDownloadVCard = () => {
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "FN:Aaren Intpro",
      "ORG:Aaren Studio - Luxury Surfaces & Architectural Systems",
      "TEL;TYPE=WORK,VOICE:8884464444",
      "EMAIL;TYPE=WORK,INTERNET:info@aarenintpro.com",
      "ADR;TYPE=WORK:;;342/8, Mysore Rd, New Guddadahalli, Guddadahalli;Bengaluru;Karnataka;560026;India",
      "URL:https://aarenstudio.vercel.app",
      "END:VCARD",
    ].join("\r\n");

    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Aaren_Intpro.vcf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      const url = window.location.href;
      if (navigator.share) {
        try {
          await navigator.share({ title: pageTitle, text: pageTagline, url });
          return;
        } catch {
          // ignore share cancel
        }
      }
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundImage: `url('${WALLPAPER_BG}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundColor: "#FAF8F5",
        color: "#1E1E1E",
        WebkitFontSmoothing: "antialiased",
        paddingBottom: "56px",
        boxSizing: "border-box",
      }}
    >
      {/* Centered shell — max 480px, mobile-first */}
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          margin: "0 auto",
          padding: "12px 16px 0",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* ── Brand sub-page back nav ── */}
        {!isHub && (
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <Link
              href="/downloads"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "9999px",
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(0,0,0,0.1)",
                fontSize: "12px",
                fontWeight: 600,
                color: "#81663F",
                textDecoration: "none",
              }}
            >
              <ArrowLeft style={{ width: 14, height: 14 }} />
              <span>All 20 Brands</span>
            </Link>

            <button
              onClick={handleShare}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "9999px",
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(0,0,0,0.1)",
                fontSize: "12px",
                fontWeight: 600,
                color: "#81663F",
                cursor: "pointer",
              }}
            >
              {copied ? <Check style={{ width: 14, height: 14 }} /> : <Share2 style={{ width: 14, height: 14 }} />}
              <span>{copied ? "Copied" : "Share"}</span>
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════
            1. HERO PROFILE CARD
            ══════════════════════════════════════ */}
        <header
          style={{
            position: "relative",
            width: "100%",
            borderRadius: "18px",
            overflow: "hidden",
            backgroundColor: "#81663F",
            boxShadow: "0 10px 30px rgba(0,0,0,0.16)",
            color: "#fff",
          }}
        >
          {/* Hero Banner — 360px tall */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "360px",
              backgroundColor: "#EAE2D5",
              overflow: "hidden",
            }}
          >
            <Image
              src={heroImage}
              alt={pageTitle}
              fill
              priority
              sizes="(max-width: 640px) 100vw, 480px"
              style={{ objectFit: "cover", objectPosition: "top" }}
            />
            {/* Scrim */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%, rgba(0,0,0,0.15) 100%)",
                pointerEvents: "none",
              }}
            />

            {/* Exact QRCodeChimp Profile 5 Double-Layered Wave SVG */}
            <svg
              style={{
                position: "absolute",
                bottom: "-1px",
                left: 0,
                width: "100%",
                height: "72px",
                pointerEvents: "none",
                display: "block",
              }}
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 375 117"
              preserveAspectRatio="none"
            >
              {/* Dark layer (70% opacity) */}
              <g id="Group_1240" style={{ opacity: 0.7 }}>
                <path
                  id="Path_1471"
                  fill="#81663F"
                  d="M.08,81.65l3.11-3.68,3.99,1.3,3.79-2.06,5.68,1.13s.42-.6,2.73,1.42,2.1,3.39,3.99,1.85,3.15-3.23,4.41-1.78c1.26,1.45,6.31,3.2,6.31,3.2l1.89-.19,7.15-2.5,4.42-2.68s0-.22,1.47-.14c1.47,.08,6.52-3.11,6.73-3.8s1.05-.1,2.73,1.3,7.15,.42,9.04-1.11,3.79-3.29,4.63-2.7,2.73-1.39,4.41-2.45,4.62-3.15,5.47-1.43,5.47,.36,5.47,.36v-1.66s4.2,3.73,5.26,4.07,9.46,4.91,10.3,4.61c.83-.42,1.6-.95,2.31-1.57v1.8s3.79,2.55,5.05,2.2,7.78,1.48,7.78,1.48c.66-.34,1.41-.41,2.1-.21,1.26,.33,3.79,2,5.05,.47s7.15,.36,7.15,1.04,10.51,1.89,12.61,.34,3.36,1.24,3.36,1.24c0,0,8.83,.71,9.67,.4s5.88-4.62,8.2-3.95c2.08,.71,4.12,1.57,6.1,2.57,2.61-1.78,5.56-2.92,8.62-3.33,4.63-.45,11.14-6.25,13.67-8.07,2.52-1.82,7.99-5.72,10.3-5.95,2.31-.23,13.26-7.82,15.14-10.11,2.31-2.83,9.88-4.24,11.98-5.79s4.42-3.8,5.05-2.51,9.25-2.7,11.98-4.32c2.73-1.61,5.88,3.02,8.83,3.63s13.03-1.27,15.35-2.17,9.67-2.74,11.35-.21c1.68,2.53,10.09,5.3,10.93,5.22s16.19-.01,18.08-1.09c1.89-1.08,9.46-6.83,11.57-3.97s11.77,3.93,13.03,3.14,6.94-.68,8.83,.48,10.3,2.81,10.3,2.81c0,0-.84,.55,1.47-2.38s2.1-3.81,3.79-2.4c2.08,2.08,4.04,4.29,5.88,6.61l6.26,.29V117.73L.08,117.35v-35.7Z"
                />
              </g>
              {/* Solid foreground layer */}
              <g id="Group_1240-2">
                <path
                  id="Path_1471-2"
                  fill="#81663F"
                  d="M.08,83.43l3.11-3.4,3.99,1.27,3.79-1.87,5.68,1.14s.42-.56,2.73,1.37c2.31,1.92,2.1,3.2,3.99,1.79s3.15-2.98,4.41-1.6,6.31,3.09,6.31,3.09l1.89-.15,7.15-2.23,4.42-2.44s0-.21,1.47-.11c1.47,.1,6.52-2.81,6.73-3.46s1.05-.08,2.73,1.26,7.15,.5,9.04-.9,3.79-3.02,4.63-2.46,2.73-1.26,4.41-2.23,4.62-2.88,5.47-1.26,5.47,.42,5.47,.42v-1.56s4.2,3.55,5.26,3.89,9.46,4.74,10.3,4.46c.83-.38,1.6-.87,2.31-1.44v1.68s3.79,2.44,5.05,2.13,7.78,1.5,7.78,1.5c.66-.31,1.41-.37,2.1-.16,1.26,.32,3.79,1.93,5.05,.51s7.15,.44,7.15,1.07,10.51,1.92,12.61,.5,3.36,1.21,3.36,1.21c0,0,8.83,.8,9.67,.52s5.88-4.24,8.2-3.57c2.08,.7,4.12,1.53,6.1,2.49,2.61-1.63,5.56-2.65,8.62-2.99,4.63-.36,11.14-5.69,13.67-7.36,2.52-1.67,7.99-5.24,10.3-5.42s13.26-7.13,15.14-9.24c2.31-2.61,9.88-3.83,11.98-5.25s4.42-3.49,5.05-2.28,9.25-2.39,11.98-3.86,5.88,2.91,8.83,3.53c2.95,.61,13.03-1,15.35-1.81s9.67-2.43,11.35-.03c1.68,2.39,10.09,5.11,10.93,5.05s16.19,.23,18.08-.76,9.46-6.25,11.57-3.55,11.77,3.86,13.03,3.13,6.94-.53,8.83,.58c1.89,1.12,10.3,2.78,10.3,2.78,0,0-.84,.5,1.47-2.21s2.1-3.53,3.79-2.19c2.08,1.98,4.04,4.08,5.88,6.27l6.26,.36v57.43L.08,116.86v-33.43Z"
                />
              </g>
            </svg>
          </div>

          {/* Circular Brand Logo Badge */}
          <div
            style={{
              position: "absolute",
              left: "16px",
              top: "295px",
              zIndex: 10,
              width: "105px",
              height: "105px",
              borderRadius: "50%",
              backgroundColor: "#fff",
              border: "3px solid rgba(0,0,0,0.05)",
              boxShadow: "0 6px 20px rgba(0,0,0,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              padding: "6px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src={logoImage}
                alt={`${pageTitle} Logo`}
                fill
                sizes="105px"
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>

          {/* Title & Tagline */}
          <div style={{ paddingTop: "56px", paddingBottom: "20px", paddingLeft: "20px", paddingRight: "20px" }}>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: 400,
                lineHeight: 1.15,
                color: "#fff",
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              {pageTitle}
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "#e6e2d8",
                fontWeight: 400,
                lineHeight: 1.6,
                marginTop: "4px",
                maxWidth: "320px",
              }}
            >
              {pageTagline}
            </p>
          </div>
        </header>

        {/* ══════════════════════════════════════
            2. HUB: Brand Cards List
               BRAND: PDF Catalogues List
            ══════════════════════════════════════ */}
        {isHub ? (
          <div style={{ width: "100%", marginTop: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {brandFolders.map((b) => {
              const displayName = getDisplayBrandName(b);
              const logoSrc = b.logoUrl || DEFAULT_BRAND_LOGO;

              return (
                <Link
                  key={b.id || b.slug}
                  href={`/downloads/${b.slug}`}
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
                  {/* Logo + Brand Name */}
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        position: "relative",
                        width: "72px",
                        height: "34px",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}
                    >
                      <Image
                        src={logoSrc}
                        alt={displayName}
                        fill
                        sizes="72px"
                        style={{ objectFit: "contain", objectPosition: "left center" }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: "17px",
                        fontWeight: 500,
                        color: "#4A3821",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {displayName}
                    </span>
                  </div>

                  {/* Bare Chevron */}
                  <ChevronRight style={{ width: 20, height: 20, color: "#81663F", flexShrink: 0, strokeWidth: 1.75 }} />
                </Link>
              );
            })}
          </div>
        ) : (
          /* ── BRAND SHOWROOM: PDF CATALOGUES ── */
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
                    {/* Icon + Name */}
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
                          flexShrink: 0,
                          color: "#81663F",
                        }}
                      >
                        <FileText style={{ width: 20, height: 20, strokeWidth: 1.75 }} />
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <h3
                          style={{
                            fontWeight: 500,
                            fontSize: "16px",
                            color: "#4A3821",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            margin: 0,
                          }}
                        >
                          {pdfName}
                        </h3>
                        <p style={{ fontSize: "12px", color: "#8A8275", marginTop: "2px" }}>
                          {file.fileSize || "PDF Document"}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "12px",
                          border: "1px solid #EAE4D9",
                          backgroundColor: "#fff",
                          color: "#81663F",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        title="View PDF"
                      >
                        <ExternalLink style={{ width: 16, height: 16 }} />
                      </a>
                      <a
                        href={file.url}
                        download={pdfName.endsWith(".pdf") ? pdfName : `${pdfName}.pdf`}
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
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#1E1E1E", margin: 0 }}>Catalogues Updating</p>
                <p style={{ fontSize: "12px", color: "#8A8275", marginTop: "8px" }}>
                  The latest specifications for {currentBrand?.name} are being prepared.
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

            {/* Custom CTA Buttons */}
            {currentBrand?.ctaButtons && currentBrand.ctaButtons.length > 0 && (
              <div
                style={{
                  width: "100%",
                  backgroundColor: "#fff",
                  borderRadius: "16px",
                  boxShadow: "0 7px 29px rgba(100,100,111,0.2)",
                  border: "1px solid rgba(0,0,0,0.05)",
                  padding: "16px",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: "#8A8275",
                    textAlign: "center",
                  }}
                >
                  Explore Further
                </div>
                {currentBrand.ctaButtons.map((cta, i) => (
                  <a
                    key={i}
                    href={cta.destination}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      borderRadius: "12px",
                      border: "1px solid #E4DCCE",
                      backgroundColor: "#fff",
                      color: "#4A453E",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      textDecoration: "none",
                      boxSizing: "border-box",
                    }}
                  >
                    <span>{cta.label}</span>
                    <ArrowUpRight style={{ width: 14, height: 14, color: "#81663F" }} />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════
            3. CONTACT CARD
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
          {/* Card Header */}
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
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#222", margin: 0 }}>Contact Us</h2>
            </div>

            <button
              onClick={handleDownloadVCard}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "9999px",
                backgroundColor: "#81663F",
                color: "#fff",
                fontSize: "11px",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
              }}
            >
              <UserPlus style={{ width: 14, height: 14 }} />
              <span>Add to Contact</span>
            </button>
          </div>

          {/* Contact Items */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "12px" }}>
            {/* Phone */}
            <a
              href="tel:8884464444"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                borderRadius: "12px",
                backgroundColor: "#FAF8F5",
                border: "1px solid #EAE4D9",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "10px",
                  backgroundColor: "#fff",
                  border: "1px solid #E4DCCE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#81663F",
                  flexShrink: 0,
                }}
              >
                <Phone style={{ width: 14, height: 14 }} />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: "10px", textTransform: "uppercase", fontWeight: 700, color: "#8A8275" }}>Call Us</div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#1E1E1E" }}>8884464444</div>
              </div>
              <ChevronRight style={{ width: 16, height: 16, color: "#8A8275" }} />
            </a>

            {/* Email */}
            <a
              href="mailto:info@aarenintpro.com"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                borderRadius: "12px",
                backgroundColor: "#FAF8F5",
                border: "1px solid #EAE4D9",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "10px",
                  backgroundColor: "#fff",
                  border: "1px solid #E4DCCE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#81663F",
                  flexShrink: 0,
                }}
              >
                <Mail style={{ width: 14, height: 14 }} />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: "10px", textTransform: "uppercase", fontWeight: 700, color: "#8A8275" }}>Email</div>
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
                  info@aarenintpro.com
                </div>
              </div>
              <ChevronRight style={{ width: 16, height: 16, color: "#8A8275" }} />
            </a>

            {/* Address */}
            <div
              style={{
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: "#FAF8F5",
                border: "1px solid #EAE4D9",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "10px",
                    backgroundColor: "#fff",
                    border: "1px solid #E4DCCE",
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
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: "10px", textTransform: "uppercase", fontWeight: 700, color: "#8A8275" }}>Address</div>
                  <p style={{ fontSize: "12px", color: "#2A2824", lineHeight: 1.6, marginTop: "2px" }}>
                    342/8, Mysore Rd, New Guddadahalli, Guddadahalli, Bengaluru, Karnataka, India 560026
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
                <a
                  href="https://share.google/43zEv2LW0TFEB1ARs"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    borderRadius: "10px",
                    backgroundColor: "#81663F",
                    color: "#fff",
                    fontSize: "11px",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  <span>Direction</span>
                  <ExternalLink style={{ width: 12, height: 12 }} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            4. SOCIAL LINKS CARD
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
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#222", marginBottom: "14px", margin: "0 0 14px" }}>
            Social Links
          </h2>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" }}>
            {/* Facebook */}
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: "#81663F",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
              }}
            >
              <svg style={{ width: 20, height: 20, fill: "currentColor" }} viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: "#81663F",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
              }}
            >
              <svg style={{ width: 20, height: 20, fill: "currentColor" }} viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: "#81663F",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
              }}
            >
              <svg style={{ width: 20, height: 20, fill: "currentColor" }} viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>

            {/* Twitter/X */}
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter / X"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: "#81663F",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
              }}
            >
              <svg style={{ width: 20, height: 20, fill: "currentColor" }} viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
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
            AAREN STUDIO
          </div>
          <p style={{ fontSize: "11px", color: "#4A453E", marginTop: "4px", maxWidth: "280px", margin: "4px auto 0" }}>
            Curated by Aaren Studio · Luxury Surfaces & Architectural Systems
          </p>
          <div style={{ marginTop: "6px" }}>
            <Link
              href="/"
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#81663F",
                textDecoration: "underline",
                textUnderlineOffset: "4px",
              }}
            >
              aarenstudio.com
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
