import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getIntroPageBySlugStore } from "@/lib/store";
import { ArrowUpRight } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getIntroPageBySlugStore(slug);

  if (!page) {
    return {
      title: "Page Not Found | AAREN",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aarenstudio.vercel.app";

  return {
    title: `${page.title} | AAREN`,
    description: page.tagline || "AAREN Creative Studio & Luxury Material House",
    metadataBase: new URL(siteUrl),
    openGraph: {
      title: `${page.title} | AAREN`,
      description: page.tagline || "AAREN Creative Studio & Luxury Material House",
      images: page.bannerImageUrl ? [{ url: page.bannerImageUrl }] : undefined,
    },
  };
}

export default async function PublicIntroPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getIntroPageBySlugStore(slug);

  if (!page) {
    notFound();
  }

  const ctaButtons = page.ctaButtons && Array.isArray(page.ctaButtons) ? page.ctaButtons.slice(0, 3) : [];

  return (
    <div
      style={{
        background: "#FAF8F5",
        color: "#1E1E1E",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "var(--font-jost), 'Jost', sans-serif",
      }}
    >
      {/* Top Section: Banner + Centered Content */}
      <div style={{ width: "100%" }}>
        
        {/* Full-bleed responsive banner with Next.js image */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "clamp(260px, 45vh, 480px)",
            overflow: "hidden",
            background: "#E6E2D8",
          }}
        >
          <Image
            src={page.bannerImageUrl}
            alt={page.title}
            fill
            priority
            sizes="100vw"
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
          {/* Subtle gradient vignette at bottom of banner */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.35) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Minimalist Floating Logo Badge */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(250, 248, 245, 0.92)",
              backdropFilter: "blur(8px)",
              padding: "6px 18px",
              borderRadius: "30px",
              border: "1px solid rgba(213, 206, 191, 0.8)",
              boxShadow: "0 4px 15px rgba(0,0,0,0.12)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ color: "#81663F", fontSize: "0.75rem" }}>◆</span>
            <span style={{ fontSize: "0.85rem", fontWeight: 900, letterSpacing: "0.15em", color: "#81663F" }}>
              AAREN
            </span>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", color: "#5E5852" }}>
              STUDIO
            </span>
          </div>
        </div>

        {/* Centered Typography & Details Container */}
        <div
          style={{
            maxWidth: "680px",
            margin: "0 auto",
            padding: "2.5rem 1.5rem 1.5rem",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 900,
              color: "#1E1E1E",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              margin: "0 0 0.8rem",
            }}
          >
            {page.title}
          </h1>

          {page.tagline && (
            <p
              style={{
                fontSize: "clamp(1rem, 2.2vw, 1.25rem)",
                color: "#5E5852",
                fontWeight: 500,
                lineHeight: 1.5,
                margin: "0 auto 2.2rem",
                maxWidth: "520px",
              }}
            >
              {page.tagline}
            </p>
          )}

          {/* Up to 3 CTA Buttons */}
          {ctaButtons.length > 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                maxWidth: "420px",
                margin: "0 auto",
              }}
            >
              {ctaButtons.map((cta, index) => {
                const isExternal = cta.destination.startsWith("http");
                const isPrimary = index === 0;

                const baseStyles: React.CSSProperties = {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "1rem 1.4rem",
                  borderRadius: "12px",
                  fontSize: "0.98rem",
                  fontWeight: 800,
                  textDecoration: "none",
                  transition: "all 0.2s ease-in-out",
                  cursor: "pointer",
                  boxShadow: isPrimary
                    ? "0 4px 15px rgba(0,0,0,0.15)"
                    : "0 2px 8px rgba(0,0,0,0.04)",
                  background: isPrimary
                    ? "linear-gradient(135deg, #1E1E1E 0%, #302C27 100%)"
                    : "#FFFFFF",
                  color: isPrimary ? "#FFFFFF" : "#81663F",
                  border: isPrimary ? "1px solid #444" : "1px solid #D5CEBF",
                };

                return isExternal ? (
                  <a
                    key={index}
                    href={cta.destination}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={baseStyles}
                  >
                    <span>{cta.label}</span>
                    <ArrowUpRight size={16} />
                  </a>
                ) : (
                  <Link key={index} href={cta.destination} style={baseStyles}>
                    <span>{cta.label}</span>
                    <ArrowUpRight size={16} />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Minimal Bottom Brand Line */}
      <footer
        style={{
          padding: "2rem 1.5rem",
          textAlign: "center",
          borderTop: "1px solid #EAE4D8",
          marginTop: "2rem",
        }}
      >
        <div style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.12em", color: "#8E887F", textTransform: "uppercase" }}>
          AAREN STUDIO • BENGALURU • ARCHITECTURAL SURFACES &amp; CURATION
        </div>
      </footer>
    </div>
  );
}
