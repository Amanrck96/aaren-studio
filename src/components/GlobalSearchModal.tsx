"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X, ArrowRight, Sparkles, Building2, Layers } from "lucide-react";

interface ProductResult {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  shortCode?: string;
  image?: string;
  imageUrl?: string;
  slug?: string;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SUGGESTIONS = [
  "Bespoke Veneer",
  "Composite Facade",
  "Engineered Wood",
  "Sanitary Ware",
  "Architectural Hardware",
  "Fenix Surfaces",
];

export default function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const handler = setTimeout(() => {
      fetch(`/api/products?q=${encodeURIComponent(query.trim())}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success && Array.isArray(json.data)) {
            setResults(json.data.slice(0, 8));
          } else {
            setResults([]);
          }
        })
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(handler);
  }, [query]);

  // Handle enter key submit
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      onClose();
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    }
    if (e.key === "Escape") {
      onClose();
    }
  };

  const handleSelectProduct = (p: ProductResult) => {
    onClose();
    const dest = p.slug ? `/products/${p.slug}` : `/products?q=${encodeURIComponent(p.name)}`;
    router.push(dest);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(8px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "6rem 1.6rem 2rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "680px",
          backgroundColor: "#FAF9F6",
          borderRadius: "1.2rem",
          border: "1px solid rgba(129, 102, 63, 0.3)",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.4)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          animation: "searchFadeIn 0.2s ease-out",
        }}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.2rem",
            padding: "1.8rem 2.4rem",
            borderBottom: "1px solid rgba(129, 102, 63, 0.15)",
            background: "#FFFFFF",
          }}
        >
          <Search size={20} color="#81663F" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search 1,061+ architectural products, brands, or finishes..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "1.6rem",
              color: "#1C1917",
              background: "transparent",
              fontFamily: "inherit",
            }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "0.4rem", color: "#8A8279" }}
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              background: "rgba(129, 102, 63, 0.08)",
              border: "none",
              borderRadius: "0.6rem",
              padding: "0.4rem 0.8rem",
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "#81663F",
              cursor: "pointer",
            }}
          >
            ESC
          </button>
        </div>

        {/* Search Body Content */}
        <div style={{ maxHeight: "60vh", overflowY: "auto", padding: "1.6rem 2.4rem" }}>
          {loading && (
            <div style={{ padding: "2.4rem", textAlign: "center", color: "#81663F", fontSize: "1.3rem", fontWeight: 600 }}>
              Searching catalog...
            </div>
          )}

          {!loading && query.trim() && results.length === 0 && (
            <div style={{ padding: "3rem 1rem", textAlign: "center" }}>
              <p style={{ color: "#81663F", fontSize: "1.5rem", fontWeight: 700, margin: "0 0 0.6rem" }}>
                No products found matching &ldquo;{query}&rdquo;
              </p>
              <p style={{ color: "#5E5852", fontSize: "1.3rem", margin: "0 0 1.6rem" }}>
                Try searching for a category like Veneers, Facades, or a brand name.
              </p>
              <button
                onClick={() => {
                  onClose();
                  router.push(`/products?q=${encodeURIComponent(query)}`);
                }}
                style={{
                  background: "#81663F",
                  color: "#FFFFFF",
                  border: "none",
                  padding: "0.8rem 1.6rem",
                  borderRadius: "0.6rem",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Search all in Products Archive →
              </button>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, letterSpacing: "0.08em", color: "#81663F", textTransform: "uppercase", marginBottom: "1rem" }}>
                Products ({results.length} results)
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {results.map((p) => {
                  const img = p.image || p.imageUrl || "/brands/brand_1_1.png";
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleSelectProduct(p)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1.6rem",
                        padding: "1rem 1.2rem",
                        borderRadius: "0.8rem",
                        backgroundColor: "#FFFFFF",
                        border: "1px solid rgba(129, 102, 63, 0.12)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#F4EFE6";
                        e.currentTarget.style.borderColor = "#81663F";
                        e.currentTarget.style.transform = "translateX(4px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#FFFFFF";
                        e.currentTarget.style.borderColor = "rgba(129, 102, 63, 0.12)";
                        e.currentTarget.style.transform = "translateX(0)";
                      }}
                    >
                      <div style={{ position: "relative", width: "48px", height: "48px", borderRadius: "0.4rem", overflow: "hidden", background: "#eee", flexShrink: 0 }}>
                        <Image src={img} alt={p.name} fill style={{ objectFit: "cover" }} unoptimized />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#1C1917", margin: "0 0 0.3rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {p.name}
                        </h4>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", fontSize: "1.1rem" }}>
                          <span style={{ color: "#81663F", fontWeight: 700, textTransform: "uppercase" }}>{p.brand}</span>
                          <span style={{ color: "rgba(0,0,0,0.2)" }}>•</span>
                          <span style={{ color: "#5E5852" }}>{p.category}</span>
                        </div>
                      </div>
                      <ArrowRight size={16} color="#81663F" />
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: "1.6rem", paddingTop: "1.2rem", borderTop: "1px solid rgba(129, 102, 63, 0.15)", textAlign: "center" }}>
                <button
                  onClick={() => {
                    onClose();
                    router.push(`/products?q=${encodeURIComponent(query)}`);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#81663F",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  View all matching products in catalog →
                </button>
              </div>
            </div>
          )}

          {!query.trim() && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "1.1rem", fontWeight: 800, letterSpacing: "0.08em", color: "#81663F", textTransform: "uppercase", marginBottom: "1.2rem" }}>
                <Sparkles size={14} /> Popular Searches
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", marginBottom: "2rem" }}>
                {POPULAR_SUGGESTIONS.map((item) => (
                  <button
                    key={item}
                    onClick={() => setQuery(item)}
                    style={{
                      padding: "0.6rem 1.2rem",
                      borderRadius: "9999px",
                      background: "#FFFFFF",
                      border: "1px solid rgba(129, 102, 63, 0.25)",
                      color: "#1C1917",
                      fontSize: "1.2rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#81663F";
                      e.currentTarget.style.color = "#81663F";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(129, 102, 63, 0.25)";
                      e.currentTarget.style.color = "#1C1917";
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div
                  onClick={() => {
                    onClose();
                    router.push("/brands");
                  }}
                  style={{
                    padding: "1.4rem",
                    borderRadius: "0.8rem",
                    background: "#FFFFFF",
                    border: "1px solid rgba(129, 102, 63, 0.15)",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", color: "#81663F", fontWeight: 800, fontSize: "1.25rem", marginBottom: "0.4rem" }}>
                    <Building2 size={16} /> Partner Brands
                  </div>
                  <p style={{ margin: 0, fontSize: "1.15rem", color: "#5E5852" }}>Explore all 20+ luxury material partners</p>
                </div>

                <div
                  onClick={() => {
                    onClose();
                    router.push("/products");
                  }}
                  style={{
                    padding: "1.4rem",
                    borderRadius: "0.8rem",
                    background: "#FFFFFF",
                    border: "1px solid rgba(129, 102, 63, 0.15)",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", color: "#81663F", fontWeight: 800, fontSize: "1.25rem", marginBottom: "0.4rem" }}>
                    <Layers size={16} /> Products
                  </div>
                  <p style={{ margin: 0, fontSize: "1.15rem", color: "#5E5852" }}>Browse all 1,061+ curated materials</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
