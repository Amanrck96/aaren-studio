import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrandFolderBySlugStore } from "@/lib/store";
import {
  FileText,
  Download,
  ExternalLink,
  ShieldCheck,
  Building2,
  Clock,
  ArrowLeft,
  Share2,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandFolderBySlugStore(slug);

  if (!brand) {
    return {
      title: "Brand Not Found | Aaren Studio",
      description: "The requested brand showroom was not found.",
    };
  }

  const title = `${brand.name} | Official Catalogues & Specifications | Aaren Studio`;
  const description =
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

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1E1E] antialiased selection:bg-[#81663F] selection:text-white">
      {/* Top Luxury Micro-Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EAE4D9]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href="/downloads"
            className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wider uppercase text-[#81663F] hover:text-[#5C4528] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Brands</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-[#F0EAE1] text-[#81663F] border border-[#E3D9CC]">
              <ShieldCheck className="w-3 h-3 text-[#81663F]" />
              Official Brand Showroom
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Container (QRCodeChimp Luxury Digital Showroom Style) */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-6 md:space-y-8">
        {/* Hero Card Container */}
        <section className="bg-white rounded-3xl border border-[#EAE4D9] shadow-sm overflow-hidden">
          {/* Banner Image / Fallback */}
          <div className="relative w-full aspect-[16/8] sm:aspect-[16/7] md:aspect-[21/9] bg-[#EAE4D9] overflow-hidden">
            {brand.bannerImageUrl ? (
              <Image
                src={brand.bannerImageUrl}
                alt={`${brand.name} Banner`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#ECE5DA] via-[#F3EDE3] to-[#E3D8C8]">
                <Building2 className="w-12 h-12 text-[#B89C74] mb-2 stroke-[1.5]" />
                <span className="font-serif text-xl tracking-wider text-[#81663F] uppercase font-bold">
                  {brand.name}
                </span>
              </div>
            )}
            {/* Subtle Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Brand Header Identity */}
          <div className="px-6 sm:px-8 pt-6 pb-8 text-center">
            {/* Luxury Monogram / Category Indicator */}
            <div className="inline-block px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#EAE4D9] text-[11px] font-medium tracking-widest uppercase text-[#81663F] mb-3">
              Architectural Catalogue Collection
            </div>

            {/* Brand Title */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1E1E1E]">
              {brand.name}
            </h1>

            {/* Subtle Warm Sand Divider */}
            <div className="w-12 h-0.5 bg-[#81663F] mx-auto my-4 rounded-full" />

            {/* Brand Description */}
            {brand.description ? (
              <p className="text-[#5E584F] text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-light">
                {brand.description}
              </p>
            ) : (
              <p className="text-[#7A7265] text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-light italic">
                Official specifications, finish libraries, and architectural documentation curated for design professionals.
              </p>
            )}
          </div>
        </section>

        {/* Catalog Resources Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#1E1E1E] flex items-center gap-2">
              <span>Official Documents</span>
              <span className="text-xs font-sans font-medium px-2 py-0.5 rounded-full bg-[#EAE4D9] text-[#5E584F]">
                {files.length}
              </span>
            </h2>
            <span className="text-xs text-[#8A8275]">PDF Format · Instant Access</span>
          </div>

          {files.length > 0 ? (
            <div className="space-y-3">
              {files.map((file, idx) => {
                const pdfName = file.name || `Catalogue ${idx + 1}`;
                return (
                  <div
                    key={`${file.url}-${idx}`}
                    className="group bg-white rounded-2xl border border-[#EAE4D9] hover:border-[#B89C74] p-4 sm:p-5 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    {/* PDF Info */}
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#FAF6F0] border border-[#E8DCCF] flex items-center justify-center shrink-0 text-[#81663F] group-hover:bg-[#81663F] group-hover:text-white transition-colors">
                        <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-base sm:text-lg text-[#1E1E1E] group-hover:text-[#81663F] transition-colors truncate">
                          {pdfName}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-[#7A7265]">
                          <span className="uppercase tracking-wider font-semibold text-[#81663F]">PDF</span>
                          {file.fileSize && (
                            <>
                              <span>•</span>
                              <span>{file.fileSize}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>Architectural Edition</span>
                        </div>
                      </div>
                    </div>

                    {/* CTAs */}
                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F0EBE1]">
                      {/* View Online CTA */}
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#D9D0C1] hover:border-[#81663F] text-[#4A4338] hover:text-[#1E1E1E] bg-[#FAF8F5] hover:bg-white text-xs font-semibold tracking-wide transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View ↗</span>
                      </a>

                      {/* Download CTA */}
                      <a
                        href={file.url}
                        download={pdfName.endsWith(".pdf") ? pdfName : `${pdfName}.pdf`}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#81663F] hover:bg-[#684F2E] text-white text-xs font-semibold tracking-wide transition-all shadow-sm hover:shadow"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF ↓</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-[#EAE4D9] p-8 sm:p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#FAF6F0] border border-[#E8DCCF] flex items-center justify-center mx-auto text-[#81663F]">
                <Clock className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#1E1E1E]">
                  Catalogues Updating
                </h3>
                <p className="text-xs sm:text-sm text-[#7A7265] leading-relaxed">
                  The latest architectural specifications and brochures for {brand.name} are currently being curated by our design team.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#81663F] hover:bg-[#684F2E] text-white text-xs font-semibold tracking-wide transition-all shadow-sm"
                >
                  Contact Design Concierge
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Showroom Footer Info */}
        <footer className="pt-8 pb-12 text-center space-y-4 border-t border-[#EAE4D9]">
          <div className="space-y-1">
            <p className="text-[11px] font-bold tracking-widest uppercase text-[#81663F]">
              Aaren Studio · Architectural Curation
            </p>
            <p className="text-xs text-[#8A8275] max-w-sm mx-auto">
              Authorized distribution & architectural specification portal for European luxury interior surfaces.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs font-medium text-[#7A7265] pt-2">
            <Link href="/downloads" className="hover:text-[#81663F] transition-colors">
              Brand Directory
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-[#81663F] transition-colors">
              Concierge
            </Link>
            <span>•</span>
            <Link href="/" className="hover:text-[#81663F] transition-colors">
              Studio Home
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
