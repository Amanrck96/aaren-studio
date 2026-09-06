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
  "living-ceramica": "/brands/logos/living-ceramica_logo.png",
  "florim": "/brands/logos/florim_logo.png",
  "jacuzzi": "/brands/logos/jacuzzi_logo.png",
  "alex-turco": "/brands/logos/alex-turco_logo.png",
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
      <div className="brands-header page-header">
        <div className="brands-header__inner page-header__inner">
          <div className="brands-header__meta page-meta">
            EXCLUSIVE PARTNERS — {brandsList.length} BRANDS
          </div>
          <h1 className="brands-header__title page-title">BRANDS</h1>
          <p className="brands-header__desc page-desc">
            A curated selection of the world&apos;s finest material and design brands — each chosen for their craft, innovation, and alignment with the Aaren philosophy.
          </p>
        </div>
      </div>

      {/* ── Brand Grid ── */}
      <div
        className="brands-grid"
        style={{
          display: "flex",
          flexWrap: "wrap",
          width: "100%",
          maxWidth: "1600px",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {brandsList.map((brand, index) => (
          <Link
            key={brand.id}
            href={`/brands/${brand.id}`}
            className="brand-card"
            id={`brand-card-${brand.id}`}
            style={{
              display: "flex",
              flexDirection: "column",
              textDecoration: "none",
              color: "inherit",
              overflow: "hidden",
              background: "#E6E2D8",
              boxSizing: "border-box",
            }}
          >
            {/* Hero Image — 1980x1020 Aspect Ratio Container */}
            <div
              className="brand-card__fig-wrapper"
              style={{
                position: "relative",
                overflow: "hidden",
                width: "100%",
                aspectRatio: "1980 / 1020",
                minHeight: "24rem",
                background: "#d8d4c8",
              }}
            >
              <div
                className="brand-card__fig"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                }}
              >
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
                <div
                  className="brand-card__logo-wrap"
                  style={{
                    position: "absolute",
                    bottom: "1.6rem",
                    left: "1.6rem",
                    zIndex: 2,
                  }}
                >
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
    </div>
  );
}
