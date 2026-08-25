import Image from "next/image";
import Link from "next/link";
import { getBrandsStore } from "@/lib/store";

export const dynamic = "force-dynamic";

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

export default async function BrandsPage() {
  const brands = await getBrandsStore();

  const brandsList = (brands || []).map((b: any) => {
    const explicitLogo = b.logoUrl && !b.logoUrl.includes("brand_") && !b.logoUrl.endsWith("_2.png") ? b.logoUrl : "";
    const resolvedLogo = explicitLogo || LOGO_MAP[b.id] || LOGO_MAP[b.id?.toLowerCase()] || "";

    return {
      id: b.id,
      name: b.name,
      code: b.shortCode ? b.shortCode.split(" ")[0] : "BR",
      num: b.sequenceNumber ? String(b.sequenceNumber).padStart(2, "0") : (b.shortCode && b.shortCode.split(" ")[1] ? b.shortCode.split(" ")[1] : "01"),
      hero: b.bannerUrl || b.hero || b.imageUrl || b.image || "/brands/brand_1_1.png",
      logo: resolvedLogo,
      category: b.category || b.tagline || b.description || "Architectural Brand",
      origin: b.origin || "Global",
      tagline: b.tagline || b.description || "Partner Brand",
    };
  });

  return (
    <div className="brands-page">
      {/* ── Page Header ── */}
      <div className="brands-header">
        <div className="brands-header__inner">
          <div className="brands-header__meta t-tag" style={{ color: "#81663F", fontWeight: 700, letterSpacing: "0.12em", marginBottom: "1.6rem" }}>
            EXCLUSIVE PARTNERS — {brandsList.length} BRANDS
          </div>
          <h1 className="brands-header__title">BRANDS</h1>
          <p className="brands-header__desc t-body" style={{ color: "rgba(0,0,0,0.65)", maxWidth: "56rem", fontSize: "1.6rem", lineHeight: 1.6 }}>
            A curated selection of the world&apos;s finest material and design brands — each chosen for their craft, innovation, and alignment with the Aaren philosophy.
          </p>
        </div>
      </div>

      {/* ── Brand Grid ── */}
      <div className="brands-grid">
        {brandsList.map((brand) => (
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
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="brand-card__img"
                  style={{ objectFit: "cover" }}
                  unoptimized
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
                    className="brand-card__logo"
                    style={{ objectFit: "contain", objectPosition: "left center", maxHeight: "36px" }}
                    unoptimized
                  />
                </div>
              ) : null}
            </div>

            {/* Bottom caption bar — luxury ticket style */}
            <div className="brand-card__caption">
              <div className="brand-card__caption-left">
                <span className="brand-card__caption-name">{brand.name}</span>
                <span className="brand-card__caption-cat">{brand.category}</span>
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
          text-transform: uppercase;
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

        .brand-card__logo-wrap {
          position: absolute;
          bottom: 1.6rem;
          left: 1.6rem;
          z-index: 2;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          padding: 0.6rem 1.2rem;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justifyContent: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
        }

        /* Caption */
        .brand-card__caption {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 1.8rem 2rem 2.2rem;
          border-top: 0.1rem solid rgba(129, 102, 63, 0.15);
          background: #E6E2D8;
        }

        .brand-card__caption-left {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .brand-card__caption-name {
          font-family: inherit;
          font-size: 1.8rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          color: #1e1e1e;
        }

        .brand-card__caption-cat {
          font-family: inherit;
          font-size: 1.1rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(0, 0, 0, 0.5);
        }

        .brand-card__caption-right {
          display: flex;
          align-items: baseline;
          gap: 0.4rem;
        }

        .brand-card__caption-code {
          font-family: inherit;
          font-size: 1.3rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #1e1e1e;
        }

        .brand-card__caption-num {
          font-family: inherit;
          font-size: 1.1rem;
          letter-spacing: 0.08em;
          color: rgba(0, 0, 0, 0.4);
        }

        /* ── CTA ── */
        .brands-cta {
          padding: 6rem 1.6rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 2.4rem;
          border-top: 0.1rem solid rgba(129, 102, 63, 0.2);
        }

        @media (min-width: 768px) {
          .brands-cta {
            padding: 8rem 2.4rem;
          }
        }

        .brands-cta__text {
          font-family: inherit;
          font-size: 1.8rem;
          color: rgba(0, 0, 0, 0.65);
          max-width: 50rem;
          line-height: 1.5;
          margin: 0;
        }

        .brands-cta__btn {
          display: inline-block;
          font-family: inherit;
          font-size: 1.3rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #E6E2D8;
          background: #1e1e1e;
          padding: 1.4rem 3.2rem;
          text-decoration: none;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .brands-cta__btn:hover {
          background: #81663F;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
