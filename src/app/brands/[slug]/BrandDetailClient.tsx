"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import CatalogPdfGateModal from "@/components/CatalogPdfGateModal";
import { getPdfThumbnail } from "@/utils/pdfThumbnail";

type Props = {
  slug: string;
  initialBrand: any;
  initialProducts: any[];
  initialCollections: any[];
};

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

export default function BrandDetailClient({
  slug,
  initialBrand,
  initialProducts,
  initialCollections,
}: Props) {
  const [activeCollection, setActiveCollection] = useState("All");
  const [mounted, setMounted] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<{ url: string; title: string; coverImage?: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeBrand = useMemo(() => {
    const explicitLogo = initialBrand?.logoUrl && !initialBrand.logoUrl.includes("brand_") && !initialBrand.logoUrl.endsWith("_2.png") ? initialBrand.logoUrl : "";
    const resolvedLogo = explicitLogo || LOGO_MAP[slug] || LOGO_MAP[slug?.toLowerCase()] || initialBrand?.logo || "";

    return {
      ...(initialBrand || {}),
      id: initialBrand?.id || slug,
      name: initialBrand?.name || slug.replace(/[-_]/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
      code: initialBrand?.shortCode ? initialBrand.shortCode.split(" ")[0] : (initialBrand?.code || "SF"),
      num: initialBrand?.shortCode ? initialBrand.shortCode.split(" ")[1] || "01" : (initialBrand?.num || "01"),
      hero: initialBrand?.bannerUrl || initialBrand?.hero || "/brands/brand_1_1.png",
      logo: resolvedLogo,
      category: initialBrand?.category || "Architectural Products",
      origin: initialBrand?.origin || "International",
      tagline: initialBrand?.tagline !== undefined ? initialBrand.tagline : (initialBrand?.description ? initialBrand.description.slice(0, 80) : ""),
      description: initialBrand?.description || "",
      founded: initialBrand?.founded !== undefined ? initialBrand.founded : "",
      collections: Array.isArray(initialBrand?.collections) && initialBrand.collections.length > 0 ? initialBrand.collections : ["All"],
      pdfCatalogs: initialBrand?.pdfCatalogs || [],
      catalogPdfUrl: initialBrand?.catalogPdfUrl || "",
      accentColor: initialBrand?.accentColor || undefined,
    };
  }, [initialBrand, slug]);

  const displayCatalogues = useMemo(() => {
    const norm = (activeBrand.id || slug || "").toLowerCase();
    
    // 1. Dynamic PDF Catalogs from database / Firebase
    const dynamicCatalogs = initialBrand?.pdfCatalogs && initialBrand.pdfCatalogs.length > 0 ? initialBrand.pdfCatalogs : null;

    if (Array.isArray(dynamicCatalogs) && dynamicCatalogs.length > 0) {
      return dynamicCatalogs.map((c: any) => ({
        title: c.title || `${activeBrand.name} Specification Catalog`,
        url: c.pdfUrl || c.url || c.file || "",
        coverImage: c.coverImage || "",
        year: "2026",
        pages: "Full Edition",
        category: "PDF Catalog",
        featured: true,
      }));
    }

    if (initialBrand?.catalogPdfUrl) {
      return [{
        title: `${activeBrand.name} Specification Catalog`,
        url: initialBrand.catalogPdfUrl,
        coverImage: initialBrand.coverImage || "",
        year: "2026",
        pages: "Full Edition",
        category: "PDF Catalog",
        featured: true,
      }];
    }

    // 2. Default fallback catalogues for brands
    let baseList: any[] = [];
    if (norm === "wow") {
      baseList = [
        { title: "60 Degrees Ceramic Tile Collection", url: "/catalogs/catalogo60grados.pdf", coverImage: "/catalogs/thumbnails/catalogo60grados_thumb.jpg", year: "2026", pages: "Full Edition", category: "PDF Catalog", featured: true },
        { title: "Bejmat Handcrafted Tile Collection", url: "/catalogs/catalogobejmat.pdf", coverImage: "/catalogs/thumbnails/catalogobejmat_thumb.jpg", year: "2026", pages: "Full Edition", category: "PDF Catalog", featured: true },
        { title: "Nouvelle Inja Ceramic Collection", url: "/catalogs/catalogo-nouvelle.pdf", coverImage: "/catalogs/thumbnails/catalogo-nouvelle_thumb.jpg", year: "2026", pages: "Full Edition", category: "PDF Catalog", featured: true },
        { title: "Sabil Inja Luxury Wall Tile Collection", url: "/catalogs/catalogo-sabil.pdf", coverImage: "/catalogs/thumbnails/catalogo-sabil_thumb.jpg", year: "2026", pages: "Full Edition", category: "PDF Catalog", featured: true },
        { title: "Terre Volumetric Architectural Tile Collection", url: "/catalogs/catalogo-terre.pdf", coverImage: "/catalogs/thumbnails/catalogo-terre_thumb.jpg", year: "2026", pages: "Full Edition", category: "PDF Catalog", featured: true },
        { title: "Aquarelle & Bits Decorative Series", url: "/catalogs/aquarelle.pdf", coverImage: "/catalogs/thumbnails/aquarelle_thumb.jpg", year: "2026", pages: "Full Edition", category: "PDF Catalog", featured: true }
      ];
    } else if (norm === "mirage") {
      baseList = [
        { title: "Mirage Clay Collection Porcelain Slabs", url: "/catalogs/catalogue-clay-pdf.pdf", coverImage: "/catalogs/thumbnails/catalogue-clay-pdf_thumb.jpg", year: "2026", pages: "Full Edition", category: "PDF Catalog", featured: true },
        { title: "Mirage Elysian Travertine Porcelain Slabs", url: "/catalogs/catalogue-clay-pdf.pdf", coverImage: "/catalogs/thumbnails/catalogue-clay-pdf_thumb.jpg", year: "2026", pages: "Full Edition", category: "PDF Catalog", featured: true }
      ];
    } else if (norm === "inkiostro-bianco" || norm === "inkiostrobianco") {
      baseList = [
        { title: "Materia Prima 2026 Wallcoverings", url: "/catalogs/catalogo_materiaprima_2026_2a.pdf", coverImage: "/catalogs/thumbnails/catalogo_materiaprima_2026_2a_thumb.jpg", year: "2026", pages: "Full Edition", category: "PDF Catalog", featured: true }
      ];
    } else if (norm === "formica" || norm === "newtech-wood" || norm === "newtechwood") {
      baseList = [
        { title: "FENIX & VIS Architectural Surfaces", url: "/catalogs/arpa-vis-brochure_250122.pdf", coverImage: "/catalogs/thumbnails/arpa-vis-brochure_250122_thumb.jpg", year: "2026", pages: "Full Edition", category: "PDF Catalog", featured: true }
      ];
    }

    if (baseList.length > 0) return baseList;
    return initialBrand?.catalogues || [];
  }, [initialBrand, activeBrand, slug]);

  const allBrandProducts = useMemo(() => {
    if (initialProducts && initialProducts.length > 0) {
      return initialProducts.map((p: any) => ({
        id: p.id,
        name: p.name,
        collection: p.subcategory || p.category || "Collection",
        finish: p.finish || p.description || "",
        image: p.imageUrl,
        tag: p.shortCode || p.category,
      }));
    }
    return activeBrand.products || [];
  }, [initialProducts, activeBrand.products]);

  const effectiveCollections = useMemo(() => {
    const fromApi = (initialCollections || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      iconUrl: c.iconUrl || "",
    }));

    const fromBrand = (activeBrand.collections || []).map((cName: string) => ({
      id: cName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: cName,
      iconUrl: "",
    }));

    const seen = new Set<string>();
    const list: Array<{ id: string; name: string; iconUrl: string }> = [{ id: "all", name: "All", iconUrl: "" }];
    const sourceList: Array<{ id: string; name: string; iconUrl: string }> = fromApi.length > 0 ? fromApi : fromBrand;

    sourceList.forEach((c: { id: string; name: string; iconUrl: string }) => {
      const k = c.name.toLowerCase();
      if (k !== "all" && !seen.has(k)) {
        seen.add(k);
        list.push(c);
      }
    });
    return list;
  }, [initialCollections, activeBrand.collections]);

  const filteredProducts = useMemo(() => {
    if (activeCollection === "All" || activeCollection === "all") return allBrandProducts;
    const norm = (s: string) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const target = norm(activeCollection);
    return allBrandProducts.filter((p: any) => {
      const pCol = norm(p.collection);
      const pTag = norm(p.tag || "");
      const pName = norm(p.name);
      return pCol === target || pCol.includes(target) || target.includes(pCol) || pTag.includes(target) || pName.includes(target);
    });
  }, [activeCollection, allBrandProducts]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage]);

  /* Accent colours per brand */
  const accentMap: Record<string, string> = {
    formica: "#c8a96e",
    "inkiostro-bianco": "#7b8fa3",
    mirage: "#9b8ea6",
    falper: "#8aada8",
    fima: "#a8956a",
    mafi: "#8fa07a",
    slashform: "#6b8caa",
    waltz: "#7a9bab",
    "newtech-wood": "#8a9e78",
    loco: "#b89a6e",
    "freedom-screens": "#6b9e7a",
    peelply: "#a07850",
    inclass: "#7a8fa0",
    wow: "#c87a5a",
    iww: "#8a7aab",
    "living-ceramica": "#9ab08a",
    florim: "#7a9ab0",
    gelli: "#b09a7a",
    jacuzzi: "#6a9ab0",
    "alex-turco": "#c8a06a",
  };
  const accent = activeBrand.accentColor || accentMap[activeBrand.id] || "#d4af37";

  return (
    <div className="brand-detail">
      {/* ── Hero ── */}
      <div className="bd-hero">
        <div className="bd-hero__img-wrap">
          <Image
            src={activeBrand.hero || "/brands/brand_1_1.png"}
            alt={activeBrand.name}
            fill
            priority
            unoptimized
            sizes="100vw"
            className="bd-hero__img"
            style={{ objectFit: "cover" }}
          />
          <div className="bd-hero__gradient" />
        </div>

        {/* Hero overlay content */}
        <div className="bd-hero__content">
          <div className="bd-hero__breadcrumbs">
            <Link href="/" className="bd-hero__crumb">Home</Link>
            <span className="bd-hero__sep">/</span>
            <Link href="/brands" className="bd-hero__crumb">Brands</Link>
            <span className="bd-hero__sep">/</span>
            <span className="bd-hero__crumb bd-hero__crumb--active">{activeBrand.name}</span>
          </div>

          <div className="bd-hero__badge">
            <span className="bd-hero__code">{activeBrand.code}</span>
            <span className="bd-hero__num">{activeBrand.num}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap", margin: "1rem 0" }}>
            {activeBrand.logo && (
              <div style={{
                background: "rgba(255, 255, 255, 0.95)",
                padding: "0.6rem 1.4rem",
                borderRadius: "8px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(4px)"
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeBrand.logo}
                  alt={`${activeBrand.name} Logo`}
                  style={{ maxHeight: "42px", maxWidth: "160px", objectFit: "contain", filter: "none" }}
                />
              </div>
            )}
            <h1 className="bd-hero__title" style={{ margin: 0 }}>{activeBrand.name}</h1>
          </div>

          <p className="bd-hero__tagline">{activeBrand.tagline}</p>
        </div>
      </div>

      {/* ── Brand Story & Editorial Section ── */}
      <div className="bd-story" style={{ background: "#ffffff", padding: "5rem 2rem", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "4rem", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: "0.85rem", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: accent, display: "block", marginBottom: "0.8rem" }}>
              ARCHITECTURAL EXCELLENCE
            </span>
            <h2 style={{ fontSize: "2.4rem", fontWeight: 800, color: "#1e1e1e", lineHeight: 1.2, marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
              About {activeBrand.name}
            </h2>
            <div style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "#4b5563", whiteSpace: "pre-line" }}>
              {activeBrand.description || `${activeBrand.name} represents the pinnacle of material craftsmanship and architectural innovation. Integrated with Aaren Studio to provide bespoke, uncompromising interior solutions.`}
            </div>
            
            <div style={{ display: "flex", gap: "2.5rem", marginTop: "2.5rem", borderTop: "1px solid #f0f0f0", paddingTop: "1.5rem" }}>
              <div>
                <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#9ca3af", display: "block" }}>ORIGIN</span>
                <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827" }}>{activeBrand.origin}</span>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#9ca3af", display: "block" }}>CATEGORY</span>
                <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827" }}>{activeBrand.category}</span>
              </div>
              {activeBrand.founded && (
                <div>
                  <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#9ca3af", display: "block" }}>ESTABLISHED</span>
                  <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827" }}>{activeBrand.founded}</span>
                </div>
              )}
            </div>
          </div>

          <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.08)", minHeight: "380px" }}>
            <Image
              src={activeBrand.hero || "/brands/brand_1_1.png"}
              alt={`${activeBrand.name} Showcase`}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </div>

      {/* ── Official PDF Catalogues & Lookbooks Section ── */}
      {displayCatalogues && displayCatalogues.length > 0 && (
        <div className="bd-catalogues" style={{ padding: "5rem 2rem", background: "#f8fafc", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", marginBottom: "3rem", textAlign: "center" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#81663F", display: "block", marginBottom: "0.5rem" }}>
              TECHNICAL SPECIFICATIONS & LOOKBOOKS
            </span>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
              Official Catalogues ({displayCatalogues.length})
            </h2>
            <p style={{ color: "#64748b", fontSize: "1.05rem", maxWidth: "600px", margin: "0.5rem auto 0" }}>
              Explore comprehensive finish guides, technical blueprints, and high-resolution collections for {activeBrand.name}.
            </p>
          </div>

          <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
            {displayCatalogues.map((cat: any, i: number) => {
              const rawPdf = cat.url || cat.file || "";
              let pdfUrl = rawPdf;
              
              if (rawPdf.includes("drive.google.com")) {
                pdfUrl = rawPdf;
              } else if (rawPdf.startsWith("http")) {
                pdfUrl = rawPdf;
              } else if (rawPdf) {
                const lowerTitle = (cat.title || "").toLowerCase();
                if (lowerTitle.includes("60 grados")) pdfUrl = "/catalogs/catalogo60grados.pdf";
                else if (lowerTitle.includes("bejmat")) pdfUrl = "/catalogs/catalogobejmat.pdf";
                else if (lowerTitle.includes("nouvelle")) pdfUrl = "/catalogs/catalogo-nouvelle.pdf";
                else if (lowerTitle.includes("sabil") || lowerTitle.includes("sahli")) pdfUrl = "/catalogs/catalogo-sabil.pdf";
                else if (lowerTitle.includes("terre")) pdfUrl = "/catalogs/catalogo-terre.pdf";
                else if (lowerTitle.includes("vestige")) pdfUrl = "/catalogs/catalogo-vestige.pdf";
                else if (lowerTitle.includes("aquarelle")) pdfUrl = "/catalogs/aquarelle.pdf";
                else if (lowerTitle.includes("bits")) pdfUrl = "/catalogs/bits.pdf";
              }

              // Exact Page 1 Thumbnail or Custom Cover resolver
              const coverThumbUrl = cat.coverImage || getPdfThumbnail(pdfUrl || rawPdf || cat.title, { title: cat.title, coverImage: cat.coverImage, brandId: slug });

              return (
                <div
                  key={i}
                  className="bd-pdf-luxury-card"
                  onClick={() => {
                    setSelectedPdf({ url: pdfUrl, title: `${activeBrand.name} - ${cat.title}`, coverImage: coverThumbUrl });
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    background: "#ffffff",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid rgba(0,0,0,0.12)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                    position: "relative",
                    cursor: "pointer",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                >
                  {/* Luxury Catalogue Badge */}
                  <span
                    style={{
                      position: "absolute",
                      top: "14px",
                      right: "14px",
                      background: "linear-gradient(135deg, #d4af37 0%, #aa820a 100%)",
                      color: "#000000",
                      fontSize: "0.75rem",
                      fontWeight: 900,
                      padding: "0.28rem 0.75rem",
                      borderRadius: "6px",
                      letterSpacing: "0.08em",
                      boxShadow: "0 4px 14px rgba(212, 175, 55, 0.4)",
                      zIndex: 25,
                    }}
                  >
                    OFFICIAL CATALOGUE
                  </span>

                  {/* 1st Page Cover Preview Image Container */}
                  <div
                    style={{
                      height: "320px",
                      background: "#181920",
                      position: "relative",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {coverThumbUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={coverThumbUrl}
                        alt={`${cat.title} Cover`}
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.style.display = "none";
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = "flex";
                        }}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "top center",
                          transition: "transform 0.5s ease",
                        }}
                      />
                    ) : null}

                    {/* Luxury Branded Fallback Card */}
                    <div
                      style={{
                        display: coverThumbUrl ? "none" : "flex",
                        width: "100%",
                        height: "100%",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "linear-gradient(145deg, #181920 0%, #0d0e12 100%)",
                        borderTop: `3px solid ${activeBrand.accentColor || "#d4af37"}`,
                        color: "#ffffff",
                        padding: "2rem",
                        textAlign: "center",
                      }}
                    >
                      {activeBrand.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={activeBrand.logo}
                          alt={activeBrand.name}
                          style={{ maxHeight: "42px", maxWidth: "160px", objectFit: "contain", marginBottom: "1.2rem" }}
                        />
                      ) : (
                        <span style={{ fontSize: "1.1rem", color: activeBrand.accentColor || "#d4af37", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.8rem" }}>
                          {activeBrand.name}
                        </span>
                      )}
                      <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff", lineHeight: 1.3 }}>{cat.title}</span>
                      <span style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "0.6rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        Architectural Specification PDF
                      </span>
                    </div>
                  </div>

                  {/* Card Title & Meta Info */}
                  <div style={{ padding: "1.4rem 1.2rem", background: "#ffffff", display: "flex", flexDirection: "column", gap: "0.4rem", position: "relative", zIndex: 20 }}>
                    <span style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", lineHeight: 1.3 }}>
                      {cat.title}
                    </span>
                    {cat.subtitle && (
                      <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 500 }}>
                        {cat.subtitle}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPdf({ url: pdfUrl, title: `${activeBrand.name} - ${cat.title}`, coverImage: coverThumbUrl });
                      }}
                      style={{
                        fontSize: "0.85rem",
                        color: "#ffffff",
                        background: "linear-gradient(135deg, #1e2235 0%, #12141f 100%)",
                        border: "1px solid rgba(212,175,55,0.3)",
                        borderRadius: "6px",
                        padding: "0.7rem 1rem",
                        fontWeight: 800,
                        cursor: "pointer",
                        marginTop: "0.6rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        boxShadow: "0 4px 12px rgba(15, 23, 42, 0.2)",
                      }}
                    >
                      View Catalog ↗
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Collections Tab Filter Bar ── */}
      {effectiveCollections.length > 1 && (
        <div className="bd-filter" style={{ background: "#ffffff", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 30 }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1rem 2rem", display: "flex", gap: "0.8rem", overflowX: "auto" }}>
            {effectiveCollections.map((col) => (
              <button
                key={col.id}
                onClick={() => {
                  setActiveCollection(col.name);
                  setCurrentPage(1);
                }}
                style={{
                  padding: "0.6rem 1.4rem",
                  borderRadius: "30px",
                  fontSize: "0.85rem",
                  fontWeight: activeCollection.toLowerCase() === col.name.toLowerCase() ? 700 : 500,
                  background: activeCollection.toLowerCase() === col.name.toLowerCase() ? "#1e1e1e" : "#f3f4f6",
                  color: activeCollection.toLowerCase() === col.name.toLowerCase() ? "#ffffff" : "#4b5563",
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease"
                }}
              >
                {col.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Products Grid Section ── */}
      <div className="bd-products" style={{ padding: "4rem 2rem", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e1e1e" }}>
              {activeCollection === "All" ? "Curated Products" : activeCollection}
            </h3>
            <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
              Showing {filteredProducts.length} architectural items
            </p>
          </div>
        </div>

        {paginatedProducts.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "2rem" }}>
            {paginatedProducts.map((prod: any) => (
              <Link
                key={prod.id}
                href={`/products/${prod.id}`}
                className="bd-product-card"
                style={{
                  background: "#ffffff",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  display: "flex",
                  flexDirection: "column",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div style={{ height: "240px", position: "relative", background: "#f3f4f6" }}>
                  {prod.image ? (
                    <Image
                      src={prod.image}
                      alt={prod.name}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 300px"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#9ca3af", fontSize: "0.85rem" }}>
                      No Image Preview
                    </div>
                  )}
                  {prod.tag && (
                    <span style={{ position: "absolute", top: "10px", left: "10px", background: "rgba(0,0,0,0.75)", color: "#fff", fontSize: "0.7rem", padding: "0.2rem 0.6rem", borderRadius: "4px", fontWeight: 600, backdropFilter: "blur(4px)" }}>
                      {prod.tag}
                    </span>
                  )}
                </div>

                <div style={{ padding: "1.2rem", display: "flex", flexDirection: "column", gap: "0.4rem", flex: 1 }}>
                  <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#9ca3af", fontWeight: 600, letterSpacing: "0.05em" }}>
                    {prod.collection}
                  </span>
                  <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#111827", margin: 0 }}>
                    {prod.name}
                  </h4>
                  {prod.finish && (
                    <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                      {prod.finish}
                    </span>
                  )}
                  <span style={{ marginTop: "auto", paddingTop: "0.8rem", fontSize: "0.85rem", fontWeight: 600, color: accent }}>
                    Explore Details →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "5rem 2rem", background: "#ffffff", borderRadius: "12px", border: "1px dashed #d1d5db" }}>
            <p style={{ fontSize: "1.1rem", color: "#6b7280", margin: 0 }}>
              No products found in the &ldquo;{activeCollection}&rdquo; collection.
            </p>
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "3rem" }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  border: pageNum === currentPage ? "none" : "1px solid #d1d5db",
                  background: pageNum === currentPage ? "#1e1e1e" : "#ffffff",
                  color: pageNum === currentPage ? "#ffffff" : "#374151",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {pageNum}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── CTA ── */}
      <div className="bd-cta">
        <div className="bd-cta__inner">
          <div className="bd-cta__left">
            <p className="bd-cta__label t-tag" style={{ color: "rgba(0,0,0,0.35)", marginBottom: "1.2rem" }}>
              Let&apos;s work together
            </p>
            <p className="bd-cta__text">
              Interested in {activeBrand.name} for your project? We&apos;ll discuss specifications, samples, and lead times.
            </p>
          </div>
          <div className="bd-cta__actions">
            <Link href="/contact" className="ul-link t-cta-1" id={`brand-${activeBrand.id}-enquire`}>
              Enquire Now →
            </Link>
            <Link href="/brands" className="bd-cta__back">
              ← All Brands
            </Link>
          </div>
        </div>
      </div>

      {/* ── PDF Gate Modal ── */}
      {selectedPdf && (
        <CatalogPdfGateModal
          catalogPdfUrl={selectedPdf.url}
          itemTitle={selectedPdf.title}
          coverImage={selectedPdf.coverImage}
          onClose={() => setSelectedPdf(null)}
        />
      )}

      <style>{`
        /* ── Brand Detail Page ── */
        .brand-detail {
          background: #E6E2D8;
          color: #1e1e1e;
          min-height: 100vh;
          padding-top: 8rem;
        }

        /* ── Hero ── */
        .bd-hero {
          position: relative;
          min-height: 52vh;
          display: flex;
          align-items: flex-end;
          padding: 4rem 4.8rem;
          overflow: hidden;
          background: #111;
        }

        .bd-hero__img-wrap {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .bd-hero__img {
          opacity: 0.65;
          transform: scale(1.03);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .bd-hero__gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.88) 0%,
            rgba(0, 0, 0, 0.45) 50%,
            rgba(0, 0, 0, 0.2) 100%
          );
        }

        .bd-hero__content {
          position: relative;
          z-index: 1;
          max-width: 80rem;
        }

        .bd-hero__breadcrumbs {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 2rem;
        }

        .bd-hero__crumb {
          font-family: inherit;
          font-size: 1.1rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.55);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .bd-hero__crumb:hover {
          color: #fff;
        }

        .bd-hero__crumb--active {
          color: rgba(255, 255, 255, 0.85);
        }

        .bd-hero__sep {
          color: rgba(255, 255, 255, 0.3);
          font-size: 1.1rem;
        }

        .bd-hero__badge {
          display: inline-flex;
          align-items: baseline;
          gap: 0.6rem;
          margin-bottom: 1.2rem;
        }

        .bd-hero__code {
          font-family: inherit;
          font-size: 1.2rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: #fff;
        }

        .bd-hero__num {
          font-family: inherit;
          font-size: 1rem;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.5);
        }

        .bd-hero__title {
          font-family: inherit;
          font-size: clamp(3.6rem, 6.5vw, 6.8rem);
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          line-height: 0.95;
          color: #fff;
          margin-bottom: 1.6rem;
        }

        .bd-hero__tagline {
          font-family: inherit;
          font-size: 1.5rem;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.4;
          max-width: 50rem;
          margin: 0;
        }

        /* ── CTA ── */
        .bd-cta {
          padding: 6rem 4.8rem;
          background: #E6E2D8;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }

        .bd-cta__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 4rem;
          flex-wrap: wrap;
        }

        .bd-cta__label {
          margin-bottom: 0.8rem;
        }

        .bd-cta__text {
          font-family: inherit;
          font-size: 1.6rem;
          line-height: 1.5;
          color: rgba(0, 0, 0, 0.75);
          max-width: 48rem;
          margin: 0;
        }

        .bd-cta__actions {
          display: flex;
          align-items: center;
          gap: 2.4rem;
          flex-shrink: 0;
        }

        .bd-cta__back {
          font-family: inherit;
          font-size: 1.3rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(0, 0, 0, 0.5);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .bd-cta__back:hover {
          color: #1e1e1e;
        }

        @media (max-width: 768px) {
          .bd-hero {
            padding: 3rem 2rem;
            min-height: 44vh;
          }
          .bd-cta {
            padding: 4rem 2rem;
          }
        }
      `}</style>
    </div>
  );
}
