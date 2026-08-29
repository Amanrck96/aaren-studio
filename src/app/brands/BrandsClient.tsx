"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { applyTextCase } from "@/lib/textCase";

const LOGO_MAP: Record<string, string> = {
  "slashform": "/brands/logos/slashform_logo.png",
  "waltz": "/brands/logos/waltz_logo.png",
  "newtech-wood": "/brands/logos/newtechwood_logo.png",
  "newtechwood": "/brands/logos/newtechwood_logo.png",
  "formica": "/brands/logos/formica_logo.png",
  "loco": "/brands/logos/loco_logo.png",
  "falper": "/brands/logos/falper_logo.png",
  "fima": "/brands/logos/fima_logo.png",
  "inkiostro-bianco": "/brands/logos/inkiostro_bianco_logo.png",
  "mafi": "/brands/logos/mafi_logo.png",
  "mirage": "/brands/logos/mirage_logo.png",
  "freedom-screens": "/brands/logos/freedom_screens_logo.jpg",
  "peelply": "/brands/logos/peelply_logo.png",
  "inclass": "/brands/logos/inclass_logo.png",
  "wow": "/brands/logos/wow_logo.png",
  "iww": "/brands/logos/iww_logo.png",
};

export type MappedBrand = {
  id: string;
  name: string;
  code: string;
  num: string;
  hero: string;
  logo: string;
  category: string;
  origin: string;
  tagline: string;
};

interface BrandsClientProps {
  initialBrands: MappedBrand[];
}

export default function BrandsClient({ initialBrands }: BrandsClientProps) {
  const [brandsList] = useState<MappedBrand[]>(initialBrands || []);
  const [textCase, setTextCase] = useState<"proper" | "uppercase" | "lowercase">("proper");

  useEffect(() => {
    fetch("/api/site-settings?t=" + Date.now(), { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (j?.success && j?.data?.textCase) {
          setTextCase(j.data.textCase);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="brands-page">
      {/* ── Page Header ── */}
      <div className="brands-header">
        <div className="brands-header__inner">
          <div className="brands-header__meta t-tag" style={{ color: "#81663F", fontWeight: 700, letterSpacing: "0.12em", marginBottom: "1.6rem" }}>
            EXCLUSIVE PARTNERS — {brandsList.length} BRANDS
          </div>
          <h1 className="brands-header__title">{applyTextCase("Brands", textCase, "title")}</h1>
          <p className="brands-header__desc t-body" style={{ color: "rgba(0,0,0,0.65)", maxWidth: "56rem", fontSize: "1.6rem", lineHeight: 1.6 }}>
            A curated selection of the world&apos;s finest material and design brands — each chosen for their craft, innovation, and alignment with the Aaren philosophy.
          </p>
        </div>
      </div>

      {/* ── Brand Grid ── */}
      <div className="brands-grid">
        {brandsList.map((brand, index) => (
          <Link
            key={brand.id}
            href={`/brands/${brand.id}`}
            className="brand-card"
            id={`brand-card-${brand.id}`}
          >
            {/* Hero Image — 1980x1020 Aspect Ratio Container */}
            <div className="brand-card__fig-wrapper">
              <div className="brand-card__fig">
                <Image
                  src={brand.hero}
                  alt={brand.name}
                  fill
                  priority={index < 4}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="brand-card__img"
                  style={{ objectFit: "cover" }}
                  onError={(e: any) => {
                    e.currentTarget.src = "/brands/brand_1_1.jpg";
                  }}
                />
              </div>

              {/* Logo overlay — bottom-left of image */}
              {brand.logo ? (
                <div className="brand-card__logo-wrap">
                  <Image
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    width={90}
                    height={36}
                    priority={index < 4}
                    className="brand-card__logo"
                    style={{ objectFit: "contain", objectPosition: "left center", maxHeight: "36px" }}
                    onError={(e: any) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              ) : null}
            </div>

            {/* Bottom caption bar — luxury ticket style */}
            <div className="brand-card__caption">
              <div className="brand-card__caption-left">
                <span className="brand-card__caption-name">
                  {applyTextCase(brand.name, textCase, "title")}
                </span>
                <span className="brand-card__caption-cat">
                  {applyTextCase(brand.category, textCase, "sentence")}
                </span>
              </div>
              <div className="brand-card__caption-right">
                <span className="brand-card__caption-code">{brand.code}</span>
                <span className="brand-card__caption-num">{brand.num}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── CTA ── */}
      <div className="brands-cta">
        <p className="brands-cta__text">
          Interested in a specific brand or product line? Let&apos;s discuss your project requirements.
        </p>
        <Link href="/contact" className="brands-cta__btn" id="brands-cta-enquire">
          ENQUIRE NOW →
        </Link>
      </div>

      <style>{`
        /* ── Brands Page ── */
        .brands-page {
          background: #E6E2D8;
          color: #1e1e1e;
          min-height: 100vh;
          padding-top: 8rem;
        }

        .brands-header {
          padding: 6rem 1.6rem 4rem;
          border-bottom: 0.1rem solid rgba(129, 102, 63, 0.2);
        }

        @media (min-width: 768px) {
          .brands-header {
            padding: 8rem 2.4rem 5rem;
          }
        }

        .brands-header__inner {
          max-width: 1600px;
          margin: 0 auto;
        }

        .brands-header__title {
          font-size: clamp(6rem, 15vw, 22rem);
          font-weight: 700;
          letter-spacing: -0.05em;
          line-height: 0.88;
          color: #81663F;
          margin-bottom: 2.8rem;
        }

        /* ── Grid ── */
        .brands-grid {
          display: flex;
          flex-wrap: wrap;
          width: 100%;
        }

        /* ── Brand Card ── */
        .brand-card {
          display: flex;
          flex-direction: column;
          flex: 0 0 100%;
          width: 100%;
          border-bottom: 0.1rem solid rgba(129, 102, 63, 0.2);
          text-decoration: none;
          color: inherit;
          overflow: hidden;
          background: #E6E2D8;
        }

        @media (min-width: 768px) {
          .brand-card {
            flex: 0 0 50%;
            width: 50%;
            border-right: 0.1rem solid rgba(129, 102, 63, 0.2);
          }
          .brand-card:nth-child(2n) {
            border-right: none;
          }
        }

        /* Image wrapper — 1980x1020 resolution aspect ratio (1.94:1) */
        .brand-card__fig-wrapper {
          position: relative;
          overflow: hidden;
          width: 100%;
          aspect-ratio: 1980 / 1020;
          min-height: 24rem;
          background: #d8d4c8;
        }

        .brand-card__fig {
          position: absolute;
          inset: 0;
        }

        .brand-card__img {
          transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
        }

        .brand-card:hover .brand-card__img {
          transform: scale(1.04);
        }

        /* Logo overlay */
        .brand-card__logo-wrap {
          position: absolute;
          bottom: 1.6rem;
          left: 1.6rem;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          padding: 0.8rem 1.4rem;
          border-radius: 4px;
          border: 1px solid rgba(129, 102, 63, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          max-width: 15rem;
          height: 4.8rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }

        /* Caption bar — luxury ticket style */
        .brand-card__caption {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1.6rem;
          padding: 1.8rem 2.4rem;
          background: #FAF9F6;
          border-top: 1px solid rgba(129, 102, 63, 0.15);
          transition: background 0.25s ease;
        }

        .brand-card:hover .brand-card__caption {
          background: #F2EFE8;
        }

        .brand-card__caption-left {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .brand-card__caption-name {
          font-size: clamp(1.4rem, 1.8vw, 1.9rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.1;
          color: #81663F;
        }

        .brand-card__caption-cat {
          font-size: 1.15rem;
          color: #5E5852;
          letter-spacing: 0.05em;
          font-weight: 600;
          line-height: 1.25;
        }

        .brand-card__caption-right {
          display: flex;
          align-items: center;
          gap: 1.6rem;
          flex-shrink: 0;
        }

        .brand-card__caption-code {
          font-size: clamp(2.2rem, 4vw, 4.2rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1;
          color: #81663F;
          font-family: var(--font-geist), sans-serif;
        }

        .brand-card__caption-num {
          font-size: clamp(2rem, 3.6vw, 3.8rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1;
          color: rgba(129, 102, 63, 0.35);
          font-family: var(--font-geist), sans-serif;
        }

        /* ── CTA ── */
        .brands-cta {
          padding: 8rem 2.4rem 10rem;
          border-top: 0.1rem solid rgba(129, 102, 63, 0.2);
          background: #FAF9F6;
          display: flex;
          flex-direction: column;
          gap: 2.4rem;
          align-items: center;
          text-align: center;
        }

        @media (min-width: 768px) {
          .brands-cta {
            padding: 8rem 4rem 10rem;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            text-align: left;
          }
        }

        .brands-cta__text {
          font-size: clamp(1.6rem, 2.2vw, 2.4rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #81663F;
          max-width: 54rem;
          line-height: 1.35;
          margin: 0;
        }

        .brands-cta__btn {
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          padding: 1.4rem 2.8rem;
          background: #81663F;
          color: #ffffff;
          border-radius: 9999px;
          font-size: 1.3rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-decoration: none;
          transition: all 0.25s ease;
          box-shadow: 0 4px 14px rgba(129, 102, 63, 0.25);
        }

        .brands-cta__btn:hover {
          background: #6a5332;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(129, 102, 63, 0.35);
        }
      `}</style>
    </div>
  );
}
