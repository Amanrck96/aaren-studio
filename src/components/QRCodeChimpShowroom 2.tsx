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
      className="min-h-screen w-full bg-[#FAF8F5] text-[#1E1E1E] antialiased bg-fixed bg-cover bg-center selection:bg-[#81663F] selection:text-white pb-12"
      style={{
        backgroundImage: `url('${WALLPAPER_BG}')`,
      }}
    >
      {/* Centered Profile 5 Shell (Matches mobile viewport width up to 480px on desktop) */}
      <div className="w-full max-w-[480px] mx-auto px-3.5 sm:px-4 pt-3 sm:pt-6 flex flex-col items-center">
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
            - Wave Transition SVG into #81663F body
            - 110x110px Circular Badge overlapping bottom edge
            - White Title & Sand Tagline
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

            {/* Organic Wave Transition SVG at bottom edge */}
            <svg
              className="absolute -bottom-[1px] left-0 w-full h-12 text-[#81663F] fill-current pointer-events-none"
              viewBox="0 0 500 80"
              preserveAspectRatio="none"
            >
              <path d="M0,35 C150,85 350,-5 500,45 L500,80 L0,80 Z" />
            </svg>
          </div>

          {/* Overlapping Brand Logo Badge (110x110px) */}
          <div className="absolute left-4 sm:left-5 top-[305px] sm:top-[325px] z-10 w-[105px] h-[105px] sm:w-[110px] sm:h-[110px] rounded-full bg-white border-[3px] border-black/10 shadow-[0_6px_20px_rgba(0,0,0,0.2)] flex items-center justify-center overflow-hidden p-1.5">
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

          {/* Profile Inner Info (White Title + Sand Tagline) */}
          <div className="pt-16 pb-5 px-5 sm:px-6">
            <h1 className="text-[28px] sm:text-[32px] font-serif font-normal leading-[1.15] text-white tracking-tight">
              {pageTitle}
            </h1>
            <p className="text-[14px] sm:text-[15px] text-[#e6e2d8] font-light leading-relaxed mt-1.5 max-w-sm">
              {pageTagline}
            </p>
          </div>
        </header>

        {/* ══════════════════════════════════════════════════════════
            2. COLLECTION CARDS
            - On Hub: List of 20 Brand cards with image, title, arrow
            - On Brand: PDF Catalog cards with download and view actions
           ══════════════════════════════════════════════════════════ */}
        {isHub ? (
          /* ── SHOWROOM HUB: 20 BRANDS CARD ── */
          <section className="w-full mt-4 bg-white rounded-[16px] shadow-[0_7px_29px_rgba(100,100,111,0.18)] border border-black/5 overflow-hidden">
            <div className="px-4 py-3 border-b border-[#F0EBE1] bg-[#FAF8F5]/80 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#81663F]">
                Partner Brands ({brandFolders.length})
              </span>
              <span className="text-[11px] text-[#8A8275]">Tap to view catalogues</span>
            </div>

            <div className="divide-y divide-[#F0EBE1]">
              {brandFolders.map((b) => {
                const brandThumb =
                  b.logoUrl ||
                  b.bannerImageUrl ||
                  DEFAULT_BRAND_LOGO;

                return (
                  <Link
                    key={b.id || b.slug}
                    href={`/downloads/${b.slug}`}
                    className="group flex items-center justify-between gap-3.5 p-3 sm:p-3.5 hover:bg-[#FAF8F5] transition-colors"
                  >
                    {/* Left: Thumbnail */}
                    <div className="relative w-14 h-14 rounded-[12px] overflow-hidden bg-[#FAF8F5] border border-black/5 shrink-0 flex items-center justify-center p-1">
                      <Image
                        src={brandThumb}
                        alt={b.name}
                        fill
                        sizes="56px"
                        className="object-contain"
                      />
                    </div>

                    {/* Center: Title & Specs count */}
                    <div className="min-w-0 flex-1">
                      <h2 className="text-[#222222] font-semibold text-[15px] sm:text-[16px] group-hover:text-[#81663F] transition-colors truncate">
                        {b.name}
                      </h2>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#8A8275] mt-0.5">
                        <span className="font-medium text-[#81663F]">
                          {b.files?.length || 0} {b.files?.length === 1 ? "PDF" : "PDFs"}
                        </span>
                        {b.tagline && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-[170px]">{b.tagline}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Right: Circle chevron arrow */}
                    <div className="w-8 h-8 rounded-full bg-[#FAF8F5] text-[#81663F] group-hover:bg-[#81663F] group-hover:text-white transition-all flex items-center justify-center shrink-0 border border-[#EAE4D9]">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : (
          /* ── BRAND SHOWROOM: PDF CATALOGUES CARD ── */
          <section className="w-full mt-4 bg-white rounded-[16px] shadow-[0_7px_29px_rgba(100,100,111,0.18)] border border-black/5 overflow-hidden">
            <div className="px-4 py-3 border-b border-[#F0EBE1] bg-[#FAF8F5]/80 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#81663F]">
                Catalogues & Specifications ({files.length})
              </span>
              <span className="text-[11px] text-[#8A8275]">Direct Download</span>
            </div>

            <div className="p-3.5 sm:p-4 space-y-3">
              {files.length > 0 ? (
                files.map((file, idx) => {
                  const pdfName = file.name || `Catalogue ${idx + 1}`;

                  return (
                    <div
                      key={`${file.url}-${idx}`}
                      className="group bg-[#FAF8F5] hover:bg-[#F5F0E8] border border-[#EAE4D9] hover:border-[#B89C74] rounded-2xl p-3 sm:p-3.5 transition-all duration-200 shadow-2xs flex items-center justify-between gap-3 min-h-[64px]"
                    >
                      {/* Left: PDF Icon + Name */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-white border border-[#E4DCCE] flex items-center justify-center shrink-0 text-[#81663F] group-hover:bg-[#81663F] group-hover:text-white transition-colors shadow-2xs">
                          <FileText className="w-5 h-5 stroke-[1.75]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-[14px] sm:text-[15px] text-[#1E1E1E] group-hover:text-[#81663F] transition-colors truncate">
                            {pdfName}
                          </h3>
                          <div className="flex items-center gap-1.5 text-[11px] text-[#8A8275] mt-0.5">
                            <span className="font-bold text-[#81663F] uppercase">PDF</span>
                            {file.fileSize && (
                              <>
                                <span>•</span>
                                <span>{file.fileSize}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* View in new tab */}
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View ${pdfName}`}
                          className="w-9 h-9 rounded-xl border border-[#D5CEBF] bg-white hover:bg-[#F2ECE1] text-[#4A453E] hover:text-[#1E1E1E] flex items-center justify-center text-xs transition-colors"
                          title="View PDF"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>

                        {/* Download button */}
                        <a
                          href={file.url}
                          download={pdfName.endsWith(".pdf") ? pdfName : `${pdfName}.pdf`}
                          aria-label={`Download ${pdfName}`}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#81663F] hover:bg-[#684F2E] active:scale-[0.98] text-white text-xs font-semibold tracking-wide transition-all shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </a>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 px-4 space-y-2">
                  <p className="text-sm font-serif text-[#1E1E1E]">Catalogues Updating</p>
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
            </div>

            {/* Optional Custom CTA Buttons */}
            {currentBrand?.ctaButtons && currentBrand.ctaButtons.length > 0 && (
              <div className="px-3.5 pb-4 pt-1 space-y-2 border-t border-[#F0EBE1]">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#8A8275] text-center my-2">
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
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════
            3. CONTACT US CARD
            - Call Us: 8884464444
            - Email: info@aarenintpro.com
            - Address + Direction button
            - Add to Contact vCard action
           ══════════════════════════════════════════════════════════ */}
        <section className="w-full mt-4 bg-white rounded-[16px] shadow-[0_7px_29px_rgba(100,100,111,0.18)] border border-black/5 p-4 sm:p-5">
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
          <div className="space-y-3.5 text-xs">
            {/* Phone */}
            <a
              href="tel:8884464444"
              className="flex items-center gap-3 p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F5F0E8] border border-[#EAE4D9] transition-colors group"
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
              className="flex items-center gap-3 p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F5F0E8] border border-[#EAE4D9] transition-colors group"
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
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE4D9] space-y-2">
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
        <section className="w-full mt-4 bg-white rounded-[16px] shadow-[0_7px_29px_rgba(100,100,111,0.18)] border border-black/5 p-4 sm:p-5 text-center">
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
