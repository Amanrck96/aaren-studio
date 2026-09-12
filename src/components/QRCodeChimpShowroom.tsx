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

  // Determine Title, Tagline, Hero Banner, Logo
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
          await navigator.share({
            title: pageTitle,
            text: pageTagline,
            url,
          });
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
      className="min-h-screen w-full bg-[#FAF8F5] text-[#1E1E1E] antialiased bg-fixed bg-cover bg-center selection:bg-[#81663F] selection:text-white pb-14"
      style={{
        backgroundImage: `url('${WALLPAPER_BG}')`,
      }}
    >
      {/* Centered Profile 5 Shell (Matches mobile viewport width up to 480px on desktop) */}
      <div className="w-full max-w-[480px] mx-auto px-4 pt-3 sm:pt-6 flex flex-col items-center">
        {/* Navigation Breadcrumb when inside a specific brand showroom */}
        {!isHub && (
          <div className="w-full flex items-center justify-between mb-2.5 px-1">
            <Link
              href="/downloads"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-black/10 text-xs font-semibold text-[#81663F] hover:bg-[#81663F] hover:text-white transition-all shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All 20 Brands</span>
            </Link>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-black/10 text-xs font-semibold text-[#81663F] hover:bg-[#81663F] hover:text-white transition-all shadow-xs"
              title="Share this page"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Share"}</span>
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            1. TOP PROFILE CARD (.qrc_profile_5)
            - 380px tall Hero Banner
            - Organic Double-Layered Wave Transition SVG into #81663F body
            - 110x110px Circular Badge overlapping bottom edge at top: 295px
            - Clean White Title & Sand Tagline (Open Sans / Sans-Serif)
           ══════════════════════════════════════════════════════════ */}
        <header className="relative w-full rounded-[18px] overflow-hidden bg-[#81663F] shadow-[0_10px_30px_rgba(0,0,0,0.16)] text-white">
          {/* Hero Banner (380px) */}
          <div className="relative w-full h-[360px] sm:h-[380px] bg-[#EAE2D5] overflow-hidden">
            <Image
              src={heroImage}
              alt={pageTitle}
              fill
              priority
              sizes="(max-width: 640px) 100vw, 480px"
              className="object-cover object-top"
            />
            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/15 pointer-events-none" />

            {/* Exact QRCodeChimp Profile 5 Double-Layered Wave SVG */}
            <svg
              className="absolute -bottom-[1px] left-0 w-full h-[72px] sm:h-[80px] pointer-events-none"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 375 117"
              preserveAspectRatio="none"
            >
              <defs>
                <style>{`.cls-3{fill:#81663F;}.cls-2{opacity:.7;}`}</style>
              </defs>
              <g id="Group_1240" className="cls-2">
                <path
                  id="Path_1471"
                  className="cls-3"
                  d="M.08,81.65l3.11-3.68,3.99,1.3,3.79-2.06,5.68,1.13s.42-.6,2.73,1.42,2.1,3.39,3.99,1.85,3.15-3.23,4.41-1.78c1.26,1.45,6.31,3.2,6.31,3.2l1.89-.19,7.15-2.5,4.42-2.68s0-.22,1.47-.14c1.47,.08,6.52-3.11,6.73-3.8s1.05-.1,2.73,1.3,7.15,.42,9.04-1.11,3.79-3.29,4.63-2.7,2.73-1.39,4.41-2.45,4.62-3.15,5.47-1.43,5.47,.36,5.47,.36v-1.66s4.2,3.73,5.26,4.07,9.46,4.91,10.3,4.61c.83-.42,1.6-.95,2.31-1.57v1.8s3.79,2.55,5.05,2.2,7.78,1.48,7.78,1.48c.66-.34,1.41-.41,2.1-.21,1.26,.33,3.79,2,5.05,.47s7.15,.36,7.15,1.04,10.51,1.89,12.61,.34,3.36,1.24,3.36,1.24c0,0,8.83,.71,9.67,.4s5.88-4.62,8.2-3.95c2.08,.71,4.12,1.57,6.1,2.57,2.61-1.78,5.56-2.92,8.62-3.33,4.63-.45,11.14-6.25,13.67-8.07,2.52-1.82,7.99-5.72,10.3-5.95,2.31-.23,13.26-7.82,15.14-10.11,2.31-2.83,9.88-4.24,11.98-5.79s4.42-3.8,5.05-2.51,9.25-2.7,11.98-4.32c2.73-1.61,5.88,3.02,8.83,3.63s13.03-1.27,15.35-2.17,9.67-2.74,11.35-.21c1.68,2.53,10.09,5.3,10.93,5.22s16.19-.01,18.08-1.09c1.89-1.08,9.46-6.83,11.57-3.97s11.77,3.93,13.03,3.14,6.94-.68,8.83,.48,10.3,2.81,10.3,2.81c0,0-.84,.55,1.47-2.38s2.1-3.81,3.79-2.4c2.08,2.08,4.04,4.29,5.88,6.61l6.26,.29V117.73L.08,117.35v-35.7Z"
                />
              </g>
              <g id="Group_1240-2">
                <path
                  id="Path_1471-2"
                  className="cls-3"
                  d="M.08,83.43l3.11-3.4,3.99,1.27,3.79-1.87,5.68,1.14s.42-.56,2.73,1.37c2.31,1.92,2.1,3.2,3.99,1.79s3.15-2.98,4.41-1.6,6.31,3.09,6.31,3.09l1.89-.15,7.15-2.23,4.42-2.44s0-.21,1.47-.11c1.47,.1,6.52-2.81,6.73-3.46s1.05-.08,2.73,1.26,7.15,.5,9.04-.9,3.79-3.02,4.63-2.46,2.73-1.26,4.41-2.23,4.62-2.88,5.47-1.26,5.47,.42,5.47,.42v-1.56s4.2,3.55,5.26,3.89,9.46,4.74,10.3,4.46c.83-.38,1.6-.87,2.31-1.44v1.68s3.79,2.44,5.05,2.13,7.78,1.5,7.78,1.5c.66-.31,1.41-.37,2.1-.16,1.26,.32,3.79,1.93,5.05,.51s7.15,.44,7.15,1.07,10.51,1.92,12.61,.5,3.36,1.21,3.36,1.21c0,0,8.83,.8,9.67,.52s5.88-4.24,8.2-3.57c2.08,.7,4.12,1.53,6.1,2.49,2.61-1.63,5.56-2.65,8.62-2.99,4.63-.36,11.14-5.69,13.67-7.36,2.52-1.67,7.99-5.24,10.3-5.42s13.26-7.13,15.14-9.24c2.31-2.61,9.88-3.83,11.98-5.25s4.42-3.49,5.05-2.28,9.25-2.39,11.98-3.86,5.88,2.91,8.83,3.53c2.95,.61,13.03-1,15.35-1.81s9.67-2.43,11.35-.03c1.68,2.39,10.09,5.11,10.93,5.05s16.19,.23,18.08-.76,9.46-6.25,11.57-3.55,11.77,3.86,13.03,3.13,6.94-.53,8.83,.58c1.89,1.12,10.3,2.78,10.3,2.78,0,0-.84,.5,1.47-2.21s2.1-3.53,3.79-2.19c2.08,1.98,4.04,4.08,5.88,6.27l6.26,.36v57.43L.08,116.86v-33.43Z"
                />
              </g>
            </svg>
          </div>

          {/* Overlapping Brand Logo Badge (110x110px at top: 295px) */}
          <div className="absolute left-4 sm:left-5 top-[295px] sm:top-[310px] z-10 w-[105px] h-[105px] sm:w-[110px] sm:h-[110px] rounded-full bg-white border-[3px] border-black/5 shadow-[0_6px_20px_rgba(0,0,0,0.18)] flex items-center justify-center overflow-hidden p-1.5">
            <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center">
              <Image
                src={logoImage}
                alt={`${pageTitle} Logo`}
                fill
                sizes="110px"
                className="object-contain"
              />
            </div>
          </div>

          {/* Profile Inner Info (Clean White Title + Sand Tagline) */}
          <div className="pt-14 pb-5 px-5 sm:px-6">
            <h1 className="text-[28px] sm:text-[32px] font-normal leading-[1.15] text-white tracking-tight">
              {pageTitle}
            </h1>
            <p className="text-[14px] sm:text-[15px] text-[#e6e2d8] font-normal leading-relaxed mt-1 max-w-sm">
              {pageTagline}
            </p>
          </div>
        </header>

        {/* ══════════════════════════════════════════════════════════
            2. BRAND COLLECTION LIST (STANDALONE WHITE CARDS)
            - Matches media_1789241035945.png & media_1789241092537.png
            - Each brand is its own separate card
            - Left: Brand Logo (max-w-[72px] h-[34px] object-contain object-left)
            - Center: Brand Name (font-medium text-[#4A3821] text-[17px])
            - Right: Bare ChevronRight in #81663F
           ══════════════════════════════════════════════════════════ */}
        {isHub ? (
          <div className="w-full mt-3.5 space-y-3">
            {brandFolders.map((b) => {
              const displayName = getDisplayBrandName(b);
              const logoSrc = b.logoUrl || DEFAULT_BRAND_LOGO;

              return (
                <Link
                  key={b.id || b.slug}
                  href={`/downloads/${b.slug}`}
                  className="group w-full bg-white rounded-[16px] shadow-[0_7px_29px_rgba(100,100,111,0.2)] border border-black/5 px-5 py-4 flex items-center justify-between gap-4 transition-all duration-150 active:scale-[0.985] hover:shadow-[0_10px_35px_rgba(100,100,111,0.25)]"
                >
                  {/* Left & Center: Brand Logo + Brand Name */}
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="relative w-[72px] h-[34px] shrink-0 flex items-center justify-start">
                      <Image
                        src={logoSrc}
                        alt={displayName}
                        fill
                        sizes="72px"
                        className="object-contain object-left"
                      />
                    </div>
                    <span className="text-[17px] font-medium text-[#4A3821] group-hover:text-[#81663F] transition-colors truncate">
                      {displayName}
                    </span>
                  </div>

                  {/* Right: Bare Chevron Arrow */}
                  <ChevronRight className="w-5 h-5 text-[#81663F] shrink-0 stroke-[1.75]" />
                </Link>
              );
            })}
          </div>
        ) : (
          /* ── BRAND SHOWROOM: PDF CATALOGUES STANDALONE CARDS ── */
          <div className="w-full mt-3.5 space-y-3">
            {files.length > 0 ? (
              files.map((file, idx) => {
                const pdfName = file.name || `Catalogue ${idx + 1}`;

                return (
                  <div
                    key={`${file.url}-${idx}`}
                    className="group w-full bg-white rounded-[16px] shadow-[0_7px_29px_rgba(100,100,111,0.2)] border border-black/5 px-5 py-4 flex items-center justify-between gap-3 transition-all"
                  >
                    {/* Left: PDF Icon + Name */}
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#EAE4D9] flex items-center justify-center shrink-0 text-[#81663F] group-hover:bg-[#81663F] group-hover:text-white transition-colors">
                        <FileText className="w-5 h-5 stroke-[1.75]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-[16px] text-[#4A3821] group-hover:text-[#81663F] transition-colors truncate">
                          {pdfName}
                        </h3>
                        <p className="text-[12px] text-[#8A8275] mt-0.5">
                          {file.fileSize || "PDF Document"}
                        </p>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-xl border border-[#EAE4D9] bg-white hover:bg-[#FAF8F5] text-[#81663F] flex items-center justify-center transition-colors"
                        title="View PDF"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <a
                        href={file.url}
                        download={pdfName.endsWith(".pdf") ? pdfName : `${pdfName}.pdf`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#81663F] hover:bg-[#684F2E] active:scale-95 text-white text-xs font-semibold tracking-wide transition-all shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </a>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="w-full bg-white rounded-[16px] shadow-[0_7px_29px_rgba(100,100,111,0.2)] border border-black/5 p-6 text-center space-y-2">
                <p className="text-sm font-medium text-[#1E1E1E]">Catalogues Updating</p>
                <p className="text-xs text-[#8A8275] max-w-xs mx-auto">
                  The latest specifications for {currentBrand?.name} are being prepared.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#81663F] hover:underline pt-2"
                >
                  <span>Inquire with concierge</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            )}

            {/* Optional Custom CTA Buttons */}
            {currentBrand?.ctaButtons && currentBrand.ctaButtons.length > 0 && (
              <div className="w-full bg-white rounded-[16px] shadow-[0_7px_29px_rgba(100,100,111,0.2)] border border-black/5 p-4 space-y-2.5">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#8A8275] text-center my-1">
                  Explore Further
                </div>
                {currentBrand.ctaButtons.map((cta, i) => (
                  <a
                    key={i}
                    href={cta.destination}
                    className="w-full flex items-center justify-between py-2.5 px-3.5 rounded-xl border border-[#E4DCCE] bg-white hover:bg-[#FAF8F5] text-[#4A453E] hover:text-[#1E1E1E] text-xs font-semibold tracking-wide transition-all shadow-2xs"
                  >
                    <span>{cta.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#81663F]" />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            3. CONTACT US CARD
            - Call Us: 8884464444
            - Email: info@aarenintpro.com
            - Address + Direction button
            - Add to Contact vCard action
           ══════════════════════════════════════════════════════════ */}
        <section className="w-full mt-3.5 bg-white rounded-[16px] shadow-[0_7px_29px_rgba(100,100,111,0.2)] border border-black/5 p-4 sm:p-5">
          {/* Card Header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F0EBE1]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#81663F]/10 text-[#81663F] flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-[#222222]">Contact Us</h2>
            </div>

            <button
              onClick={handleDownloadVCard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#81663F] hover:bg-[#684F2E] text-white text-[11px] font-semibold transition-all shadow-xs active:scale-[0.98]"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add to Contact</span>
            </button>
          </div>

          {/* Contact Details List */}
          <div className="space-y-3 text-xs">
            {/* Phone */}
            <a
              href="tel:8884464444"
              className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF8F5] hover:bg-[#F5F0E8] border border-[#EAE4D9] transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-white border border-[#E4DCCE] flex items-center justify-center text-[#81663F] shrink-0">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] uppercase font-bold text-[#8A8275]">Call Us</div>
                <div className="text-sm font-semibold text-[#1E1E1E] group-hover:text-[#81663F] transition-colors">
                  8884464444
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A8275] group-hover:text-[#81663F]" />
            </a>

            {/* Email */}
            <a
              href="mailto:info@aarenintpro.com"
              className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF8F5] hover:bg-[#F5F0E8] border border-[#EAE4D9] transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-white border border-[#E4DCCE] flex items-center justify-center text-[#81663F] shrink-0">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] uppercase font-bold text-[#8A8275]">Email</div>
                <div className="text-sm font-semibold text-[#1E1E1E] group-hover:text-[#81663F] transition-colors truncate">
                  info@aarenintpro.com
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A8275] group-hover:text-[#81663F]" />
            </a>

            {/* Address & Direction */}
            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EAE4D9] space-y-2.5">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#E4DCCE] flex items-center justify-center text-[#81663F] shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase font-bold text-[#8A8275]">Address</div>
                  <p className="text-xs text-[#2A2824] leading-relaxed mt-0.5">
                    342/8, Mysore Rd, New Guddadahalli, Guddadahalli, Bengaluru, Karnataka, India 560026
                  </p>
                </div>
              </div>

              <div className="pt-1 flex justify-end">
                <a
                  href="https://share.google/43zEv2LW0TFEB1ARs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#81663F] hover:bg-[#684F2E] text-white text-[11px] font-semibold transition-all shadow-2xs"
                >
                  <span>Direction</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            4. SOCIAL LINKS CARD
            - Facebook, Instagram, LinkedIn, Twitter/X
           ══════════════════════════════════════════════════════════ */}
        <section className="w-full mt-3.5 bg-white rounded-[16px] shadow-[0_7px_29px_rgba(100,100,111,0.2)] border border-black/5 p-4 sm:p-5 text-center">
          <h2 className="text-base font-bold text-[#222222] mb-3.5">Social Links</h2>

          <div className="flex items-center justify-center gap-4">
            {/* Facebook */}
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-11 h-11 rounded-full bg-[#81663F] text-white hover:bg-[#684F2E] active:scale-95 transition-all shadow-xs flex items-center justify-center"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-11 h-11 rounded-full bg-[#81663F] text-white hover:bg-[#684F2E] active:scale-95 transition-all shadow-xs flex items-center justify-center"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-11 h-11 rounded-full bg-[#81663F] text-white hover:bg-[#684F2E] active:scale-95 transition-all shadow-xs flex items-center justify-center"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>

            {/* Twitter / X */}
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter / X"
              className="w-11 h-11 rounded-full bg-[#81663F] text-white hover:bg-[#684F2E] active:scale-95 transition-all shadow-xs flex items-center justify-center"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            5. WATERMARK FOOTER
            - Clean luxury signature
           ══════════════════════════════════════════════════════════ */}
        <footer className="mt-8 text-center space-y-1.5 px-4 text-white/90 drop-shadow-sm">
          <div className="font-serif text-xs font-bold tracking-widest uppercase text-[#81663F]">
            AAREN STUDIO
          </div>
          <p className="text-[11px] text-[#4A453E] max-w-xs mx-auto">
            Curated by Aaren Studio · Luxury Surfaces & Architectural Systems
          </p>
          <div className="pt-1">
            <Link
              href="/"
              className="text-[11px] font-semibold text-[#81663F] hover:underline underline-offset-4 transition-colors"
            >
              aarenstudio.com
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
