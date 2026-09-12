import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrandFolderBySlugStore } from "@/lib/store";
import {
  FileText,
  Download,
  ExternalLink,
  Building2,
  Clock,
  ArrowUpRight,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandFolderBySlugStore(slug);

  if (!brand) {
    return {
      title: "Brand Showroom Not Found | Aaren Studio",
      description: "The requested brand showroom could not be found.",
    };
  }

  const title = `${brand.name} | Official Catalogues & Specifications | Aaren Studio`;
  const description =
    brand.tagline ||
    brand.description ||
    `Official architectural catalogues, finish specifications, and technical brochures for ${brand.name}. Curated by Aaren Studio.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: brand.bannerImageUrl ? [{ url: brand.bannerImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: brand.bannerImageUrl ? [brand.bannerImageUrl] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BrandDownloadPage({ params }: Props) {
  const { slug } = await params;
  const brand = await getBrandFolderBySlugStore(slug);

  if (!brand) {
    notFound();
  }

  const files = (brand.files || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0));

  // Default secondary CTAs if brand doesn't have custom ones
  const ctaButtons =
    brand.ctaButtons && brand.ctaButtons.length > 0
      ? brand.ctaButtons.slice(0, 3)
      : [
          { label: "Showcase Projects", destination: "/projects" },
          { label: "Contact Design Concierge", destination: "/contact" },
        ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1E1E] antialiased selection:bg-[#81663F] selection:text-white flex flex-col items-center">
      {/* Mobile-First Showroom Shell: full-width on mobile (360px-412px), elegant max-w-lg container on desktop */}
      <div className="w-full max-w-lg bg-white min-h-screen sm:min-h-0 sm:my-6 sm:rounded-3xl sm:border sm:border-[#E8E2D9] sm:shadow-lg overflow-hidden flex flex-col">
        {/* ══════════════════════════════════════════════════════════
            1. TOP / HERO: Large full-width brand image
            - Reaches edges of the mobile viewport with 0 margins
            - High-quality Cloudinary image via next/image
            - Responsive aspect ratio
           ══════════════════════════════════════════════════════════ */}
        <section className="relative w-full aspect-[16/9] sm:aspect-[16/9] bg-[#EAE4D9] overflow-hidden shrink-0">
          {brand.bannerImageUrl ? (
            <Image
              src={brand.bannerImageUrl}
              alt={`${brand.name} Hero`}
              fill
              priority
              sizes="(max-width: 640px) 100vw, 512px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#EAE2D5] via-[#F4EDE3] to-[#DFD3C1]">
              <Building2 className="w-12 h-12 text-[#B89C74] mb-2 stroke-[1.5]" />
              <span className="font-serif text-xl tracking-wider text-[#81663F] uppercase font-bold px-4 text-center">
                {brand.name}
              </span>
            </div>
          )}

          {/* Subtle gradient scrim at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

          {/* Subtle Brand Tag Badge */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider uppercase bg-black/60 text-white backdrop-blur-md border border-white/20">
              Showroom
            </span>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            2. BRAND CONTENT: Centered brand title & short tagline
           ══════════════════════════════════════════════════════════ */}
        <section className="px-5 pt-6 pb-4 sm:px-8 text-center shrink-0">
          {/* Brand Name in elegant serif typography */}
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1E1E]">
            {brand.name}
          </h1>

          {/* Short tagline / description */}
          <p className="text-[#6A6359] text-xs sm:text-sm leading-relaxed mt-2 max-w-sm mx-auto font-light">
            {brand.tagline ||
              brand.description ||
              "Explore our latest collections, catalogues and product resources."}
          </p>

          {/* Subtle Aaren Warm Sand divider */}
          <div className="w-12 h-0.5 bg-[#81663F] mx-auto mt-4 rounded-full" />
        </section>

        {/* ══════════════════════════════════════════════════════════
            3. DOWNLOAD / RESOURCE BUTTONS
            - Mobile-friendly stacked cards/buttons
            - Comfortable touch height (min 56px)
            - Clean PDF title, icon, and download/view actions
           ══════════════════════════════════════════════════════════ */}
        <section className="px-5 sm:px-8 py-2 space-y-3 flex-1">
          {files.length > 0 ? (
            <div className="space-y-3">
              {files.map((file, idx) => {
                const pdfName = file.name || `Catalogue ${idx + 1}`;
                return (
                  <div
                    key={`${file.url}-${idx}`}
                    className="group bg-[#FAF8F5] hover:bg-[#F5F0E8] border border-[#EAE4D9] hover:border-[#B89C74] rounded-2xl p-3.5 sm:p-4 transition-all duration-200 shadow-2xs flex items-center justify-between gap-3 min-h-[64px]"
                  >
                    {/* PDF Icon & Title */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#E4DCCE] flex items-center justify-center shrink-0 text-[#81663F] group-hover:bg-[#81663F] group-hover:text-white transition-colors shadow-2xs">
                        <FileText className="w-5 h-5 stroke-[1.75]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="font-medium text-sm sm:text-base text-[#1E1E1E] group-hover:text-[#81663F] transition-colors truncate">
                          {pdfName}
                        </h2>
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

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* View Button */}
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${pdfName} online`}
                        className="w-9 h-9 rounded-xl border border-[#D5CEBF] bg-white hover:bg-[#F2ECE1] text-[#4A453E] hover:text-[#1E1E1E] flex items-center justify-center text-xs transition-colors"
                        title="View PDF online"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      {/* Download Button */}
                      <a
                        href={file.url}
                        download={pdfName.endsWith(".pdf") ? pdfName : `${pdfName}.pdf`}
                        aria-label={`Download ${pdfName}`}
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#81663F] hover:bg-[#684F2E] active:scale-[0.98] text-white text-xs font-semibold tracking-wide transition-all shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden xs:inline">Download</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-[#FAF8F5] rounded-2xl border border-[#EAE4D9] p-6 text-center space-y-3">
              <div className="w-11 h-11 rounded-full bg-white border border-[#E8DCCF] flex items-center justify-center mx-auto text-[#81663F]">
                <Clock className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div className="space-y-1">
                <h2 className="font-serif text-base font-semibold text-[#1E1E1E]">
                  Catalogues Updating
                </h2>
                <p className="text-xs text-[#7A7265] leading-relaxed max-w-xs mx-auto">
                  The latest architectural specifications and brochures for {brand.name} are currently being updated.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#81663F] hover:bg-[#684F2E] text-white text-xs font-semibold transition-all shadow-xs"
              >
                <span>Inquire With Concierge</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              4. OPTIONAL CTA BUTTONS (Up to 3)
              - Visually secondary to the main brand/resources
              - Links to portfolio, concierge, or brand pages
             ══════════════════════════════════════════════════════════ */}
          {ctaButtons.length > 0 && (
            <div className="pt-4 space-y-2 w-full">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#8A8275] text-center mb-1">
                Explore Studio
              </div>
              {ctaButtons.map((cta, i) => (
                <a
                  key={i}
                  href={cta.destination}
                  className="w-full flex items-center justify-between py-3 px-4 rounded-xl border border-[#E4DCCE] bg-white hover:bg-[#FAF8F5] text-[#4A453E] hover:text-[#1E1E1E] text-xs font-semibold tracking-wide transition-all shadow-2xs"
                >
                  <span>{cta.label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#81663F]" />
                </a>
              ))}
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════════════════════
            5. FOOTER / WHITESPACE
            - Minimal luxury signature
           ══════════════════════════════════════════════════════════ */}
        <footer className="px-5 py-8 text-center space-y-2 border-t border-[#F0EBE1] bg-[#FAF8F5] shrink-0 mt-6">
          <div className="font-serif text-xs font-bold tracking-widest uppercase text-[#81663F]">
            AAREN STUDIO
          </div>
          <p className="text-[11px] text-[#8A8275] max-w-xs mx-auto">
            Authorized curation & architectural specifications for European luxury interior surfaces.
          </p>
          <div className="pt-1">
            <Link
              href="/"
              className="text-[11px] font-medium text-[#7A7265] hover:text-[#81663F] underline underline-offset-2 transition-colors"
            >
              aarenstudio.com
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
