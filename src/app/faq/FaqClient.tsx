"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  brand?: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: "faq-1",
    category: "General & Showroom",
    question: "What is Aaren Intpro?",
    answer: "Aaren Intpro is a premium interior solutions company in Bangalore that offers world-class interior products, luxury surfaces, architectural hardware, modular kitchen solutions, wardrobes, bathroom fittings, flooring, veneers, and décor materials from leading international brands."
  },
  {
    id: "faq-2",
    category: "General & Showroom",
    question: "Where is Aaren Intpro located?",
    answer: "Aaren Intpro is located at #342/8, NTY Layout, Mysore Road, Bangalore - 560026. The showroom serves homeowners, architects, interior designers, builders, and commercial projects across India."
  },
  {
    id: "faq-3",
    category: "Surfaces & Materials",
    question: "What products are available at Aaren Intpro?",
    answer: "Aaren Intpro offers luxury laminates, veneers & natural surface materials, modular kitchens, wardrobe solutions, architectural hardware, bathroom fittings & sanitaryware, hardwood & SPC flooring, decorative wall panels, and premium imported interior products."
  },
  {
    id: "faq-4",
    category: "Kitchens & Wardrobes",
    question: "Does Aaren Intpro provide modular kitchen solutions?",
    answer: "Yes. Aaren Intpro offers customized modular kitchen solutions with premium finishes, accessories, storage systems, and international-quality materials designed for modern homes."
  },
  {
    id: "faq-5",
    category: "Kitchens & Wardrobes",
    question: "Does Aaren Intpro offer wardrobe solutions?",
    answer: "Yes. Aaren Intpro provides stylish and functional wardrobe solutions with customized layouts, finishes, storage accessories, and modern designs to suit different interior styles."
  },
  {
    id: "faq-6",
    category: "Surfaces & Materials",
    question: "What types of surface materials are available at Aaren Intpro?",
    answer: "Aaren Intpro offers premium laminates, veneers, decorative surfaces, hardwood flooring, and designer materials sourced from leading global brands."
  },
  {
    id: "faq-7",
    category: "Hardware & Fittings",
    question: "Does Aaren Intpro supply architectural hardware?",
    answer: "Yes. Aaren Intpro provides high-quality architectural hardware including door hardware, furniture fittings, bathroom accessories, handles, hinges, drawer systems, and home improvement products."
  },
  {
    id: "faq-8",
    category: "Architects & Commercial",
    question: "Can architects and interior designers collaborate with Aaren Intpro?",
    answer: "Yes. Aaren Intpro works closely with architects, interior designers, builders, developers, and homeowners to provide premium products and customized interior solutions."
  },
  {
    id: "faq-9",
    category: "Hardware & Fittings",
    question: "Does Aaren Intpro offer bathroom solutions?",
    answer: "Yes. Aaren Intpro offers luxury bathroom fittings, sanitaryware, shower systems, accessories, and premium bagno collections sourced from international manufacturers."
  },
  {
    id: "faq-10",
    category: "Architects & Commercial",
    question: "Does Aaren Intpro provide products for commercial projects?",
    answer: "Yes. Aaren Intpro caters to residential, commercial, hospitality, and large-scale architectural projects."
  },
  {
    id: "faq-11",
    category: "General & Showroom",
    question: "Why choose Aaren Intpro for luxury interior products in Bangalore?",
    answer: "Aaren Intpro is known for representing premium global brands, supplying high-quality materials under one roof, offering expert consultations, delivering customized solutions, and establishing trusted partnerships with architects and designers."
  },
  {
    id: "faq-12",
    category: "Surfaces & Materials",
    question: "Does Aaren Intpro offer imported interior products?",
    answer: "Yes. Aaren Intpro brings internationally recognized brands and premium products from Europe and other global markets to provide luxury interior solutions."
  },
  {
    id: "faq-13",
    category: "General & Showroom",
    question: "Can homeowners visit the Aaren Intpro showroom?",
    answer: "Yes. Homeowners can visit the Aaren Intpro showroom on Mysore Road, Bengaluru, to explore various interior products, materials, finishes, and design inspirations."
  },
  {
    id: "faq-14",
    category: "General & Showroom",
    question: "Does Aaren Intpro help with product selection?",
    answer: "Yes. The team at Aaren Intpro assists customers in selecting the right materials, finishes, hardware, and interior products based on their design preferences and project requirements."
  },
  {
    id: "faq-15",
    category: "Architects & Commercial",
    question: "What industries does Aaren Intpro serve?",
    answer: "Aaren Intpro serves residential projects (villas and penthouses), hospitality projects, commercial interiors, corporate offices, builders & developers, and architects & interior designers."
  },
  {
    id: "faq-16",
    category: "Surfaces & Materials",
    question: "Does Aaren Intpro offer flooring solutions?",
    answer: "Yes. Aaren Intpro provides premium flooring options including hardwood flooring, engineered wood, SPC, and luxury surface solutions."
  },
  {
    id: "faq-17",
    category: "Surfaces & Materials",
    question: "What brands are available at Aaren Intpro?",
    answer: "Aaren Intpro offers products from renowned international brands across categories such as surfaces, hardware, kitchens, wardrobes, and bathroom solutions."
  },
  {
    id: "faq-18",
    category: "Architects & Commercial",
    question: "Can Aaren Intpro handle custom interior requirements?",
    answer: "Yes. Aaren Intpro offers customized solutions tailored to the design preferences and functional requirements of each project."
  },
  {
    id: "faq-19",
    category: "General & Showroom",
    question: "Does Aaren Intpro provide solutions for luxury homes?",
    answer: "Yes. Aaren Intpro specializes in premium and luxury interior products designed for villas, apartments, and upscale residential spaces."
  },
  {
    id: "faq-20",
    category: "General & Showroom",
    question: "How can I contact Aaren Intpro?",
    answer: "You can contact Aaren Intpro through:\nPhone: +91 888 446 4444\nEmail: info@aarenintpro.com / hello@aarenstudio.com\nShowroom: Mysore Road, Bengaluru, Karnataka"
  },
  {
    id: "faq-21",
    category: "General & Showroom",
    question: "Which is the best interior products showroom in Bangalore?",
    answer: "Aaren Intpro is one of the leading interior products showrooms in Bangalore, offering premium surfaces, hardware, kitchen solutions, wardrobes, and luxury bathroom collections."
  },
  {
    id: "faq-22",
    category: "Surfaces & Materials",
    question: "Where can I buy luxury interior materials in Bangalore?",
    answer: "Aaren Intpro provides a wide range of luxury interior materials including laminates, veneers, decorative panels, hardware, flooring, and premium finishes."
  },
  {
    id: "faq-23",
    category: "Surfaces & Materials",
    question: "Which showroom in Bangalore offers premium interior brands under one roof?",
    answer: "Aaren Intpro brings together globally recognized interior brands, making it convenient for homeowners, architects, and designers to source premium products from a single destination."
  },
  {
    id: "faq-24",
    category: "Surfaces & Materials",
    question: "Where can I find premium laminates in Bangalore?",
    answer: "Aaren Intpro offers designer laminates in various textures, colors, and finishes suitable for kitchens, wardrobes, offices, and residential interiors."
  },
  {
    id: "faq-25",
    category: "Surfaces & Materials",
    question: "Where can I buy decorative veneers in Bangalore?",
    answer: "Aaren Intpro supplies premium veneers and natural surface solutions that add elegance and warmth to residential and commercial spaces."
  },
  {
    id: "faq-26",
    category: "Kitchens & Wardrobes",
    question: "Which company provides modular kitchen solutions in Bangalore?",
    answer: "Aaren Intpro offers customized modular kitchen solutions with high-quality finishes, intelligent storage options, and premium accessories."
  },
  {
    id: "faq-27",
    category: "Kitchens & Wardrobes",
    question: "Where can I find luxury wardrobe solutions in Bangalore?",
    answer: "Aaren Intpro provides modern wardrobe systems designed for functionality, aesthetics, and efficient space utilization."
  },
  {
    id: "faq-28",
    category: "Hardware & Fittings",
    question: "Which is the best place to buy architectural hardware in Bangalore?",
    answer: "Aaren Intpro offers premium architectural hardware including handles, hinges, drawer systems, and furniture fittings from international brands."
  },
  {
    id: "faq-29",
    category: "Architects & Commercial",
    question: "Where can architects source premium interior products in Bangalore?",
    answer: "Architects and interior designers can visit Aaren Intpro to explore luxury surfaces, hardware, kitchens, wardrobes, flooring, and bathroom collections."
  },
  {
    id: "faq-30",
    category: "Surfaces & Materials",
    question: "Which showroom offers imported interior products in Bangalore?",
    answer: "Aaren Intpro supplies imported interior products sourced from internationally reputed manufacturers and brands."
  },
  {
    id: "faq-31",
    category: "Architects & Commercial",
    question: "Where can builders and developers buy interior materials in Bangalore?",
    answer: "Aaren Intpro serves builders and developers with premium interior products suitable for residential and commercial projects."
  },
  {
    id: "faq-32",
    category: "General & Showroom",
    question: "Which company offers complete interior product solutions in Bangalore?",
    answer: "Aaren Intpro provides end-to-end interior product solutions including surfaces, kitchens, wardrobes, bathroom fittings, hardware, and flooring."
  },
  {
    id: "faq-33",
    category: "Hardware & Fittings",
    question: "Where can I buy luxury bathroom fittings in Bangalore?",
    answer: "Aaren Intpro offers premium bathroom fittings, sanitaryware, shower systems, and accessories for modern homes and commercial projects."
  },
  {
    id: "faq-34",
    category: "Surfaces & Materials",
    question: "Which showroom offers premium flooring solutions in Bangalore?",
    answer: "Aaren Intpro provides high-quality flooring solutions that combine durability with elegant design."
  },
  {
    id: "faq-35",
    category: "Kitchens & Wardrobes",
    question: "Where can I find modern kitchen accessories in Bangalore?",
    answer: "Aaren Intpro offers innovative kitchen accessories and storage systems that improve convenience and organization."
  },
  {
    id: "faq-36",
    category: "Architects & Commercial",
    question: "Which interior showroom in Bangalore is preferred by architects?",
    answer: "Many architects and interior designers choose Aaren Intpro because of its extensive product range and premium international brands."
  },
  {
    id: "faq-37",
    category: "Kitchens & Wardrobes",
    question: "Where can I get premium wardrobe accessories in Bangalore?",
    answer: "Aaren Intpro provides wardrobe accessories designed to maximize storage and enhance functionality."
  },
  {
    id: "faq-38",
    category: "Architects & Commercial",
    question: "Which company supplies interior products for luxury villas in Bangalore?",
    answer: "Aaren Intpro offers premium products suitable for luxury villas, apartments, and upscale residential projects."
  },
  {
    id: "faq-39",
    category: "Architects & Commercial",
    question: "Where can I find interior products for office spaces in Bangalore?",
    answer: "Aaren Intpro provides modern interior solutions for corporate offices, commercial spaces, and hospitality projects."
  },
  {
    id: "faq-40",
    category: "Surfaces & Materials",
    question: "Which showroom offers premium wall panels in Bangalore?",
    answer: "Aaren Intpro supplies decorative wall panels and surface materials that enhance interior aesthetics."
  },
  {
    id: "faq-41",
    category: "Surfaces & Materials",
    question: "Where can I buy designer surface materials in Bangalore?",
    answer: "Aaren Intpro offers designer surface solutions for kitchens, wardrobes, living spaces, and commercial interiors."
  },
  {
    id: "faq-42",
    category: "Architects & Commercial",
    question: "Which interior products company works with interior designers in Bangalore?",
    answer: "Aaren Intpro collaborates closely with interior designers to provide customized solutions and premium materials."
  },
  {
    id: "faq-43",
    category: "General & Showroom",
    question: "Where can I find luxury home improvement products in Bangalore?",
    answer: "Aaren Intpro offers a wide range of luxury home improvement products for modern living spaces."
  },
  {
    id: "faq-44",
    category: "General & Showroom",
    question: "Which showroom offers premium solutions for new home interiors?",
    answer: "Aaren Intpro helps homeowners select the right products for kitchens, wardrobes, bathrooms, flooring, and decorative surfaces."
  },
  {
    id: "faq-45",
    category: "General & Showroom",
    question: "Where can I get inspiration for luxury home interiors in Bangalore?",
    answer: "Aaren Intpro's showroom showcases the latest trends, finishes, and premium products to inspire homeowners and designers."
  },
  {
    id: "faq-46",
    category: "General & Showroom",
    question: "Which is the best destination for premium interior products near Mysore Road Bangalore?",
    answer: "Aaren Intpro on Mysore Road is a preferred destination for homeowners, architects, and builders looking for luxury interior solutions."
  },
  {
    id: "faq-47",
    category: "Surfaces & Materials",
    question: "Where can I find international interior brands in Bangalore?",
    answer: "Aaren Intpro offers access to globally recognized brands across multiple interior categories."
  },
  {
    id: "faq-48",
    category: "Architects & Commercial",
    question: "Who provides premium interior solutions for apartments and villas in Bangalore?",
    answer: "Aaren Intpro supplies products and solutions for apartments, villas, penthouses, and luxury residences."
  },
  {
    id: "faq-49",
    category: "Architects & Commercial",
    question: "Which company provides high-end interior materials for commercial projects?",
    answer: "Aaren Intpro caters to commercial projects, hospitality spaces, offices, and premium developments with world-class products."
  },
  {
    id: "faq-50",
    category: "Architects & Commercial",
    question: "Why do architects recommend Aaren Intpro?",
    answer: "Architects prefer Aaren Intpro for its premium product range, quality standards, trusted brands, and customer support."
  }
];

interface FaqClientProps {
  initialFaqs?: FaqItem[];
}

export default function FaqClient({ initialFaqs }: FaqClientProps) {
  const [faqList, setFaqList] = useState<FaqItem[]>(initialFaqs && initialFaqs.length > 0 ? initialFaqs : FAQ_DATA);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({ "faq-1": true });

  useEffect(() => {
    if (initialFaqs && initialFaqs.length > 0) return;

    fetch("/api/faq?t=" + Date.now(), { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
          setFaqList(data.data);
        }
      })
      .catch(() => {});
  }, [initialFaqs]);

  const categories = useMemo(() => {
    const fromData = faqList.map((f) => f.category).filter(Boolean);
    return Array.from(new Set(["All", ...fromData]));
  }, [faqList]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFaqs = faqList.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category.toLowerCase() === activeCategory.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q) ||
      (item.brand && item.brand.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="faq-page">
      {/* ── Page Header — full-bleed, matches site-wide standard ── */}
      <div className="faq-header page-header">
        <div className="faq-header__inner page-header__inner">
          <div className="faq-header__meta page-meta">
            FREQUENTLY ASKED QUESTIONS — KNOWLEDGE BASE
          </div>
          <h1 className="faq-title page-title">FAQ</h1>
          <p className="faq-desc page-desc">
            Explore official answers regarding Aaren Intpro showroom, luxury surfaces, modular kitchens, wardrobes, architectural hardware, and project collaborations.
          </p>

          {/* Search Box */}
          <div className="faq-search">
            <input
              type="text"
              placeholder="Search questions or keywords (e.g. Bangalore, Freedom Screens, FIMA, Falper, laminates, hardware)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="search-clear">
                ✕
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="faq-categories">
            {categories.map((cat) => {
              const count = cat === "All" ? faqList.length : faqList.filter((f) => f.category.toLowerCase() === cat.toLowerCase()).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`cat-btn ${activeCategory === cat ? "is-active" : ""}`}
                >
                  {cat} <span className="cat-count">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── FAQ Content ── */}
      <div className="faq-container page-content-container">
        {/* Accordion List */}
        <main className="faq-list">
          {filteredFaqs.length === 0 ? (
            <div className="no-faqs">
              <h3>No matching questions found</h3>
              <p>Try searching with different terms or contact our advisory team directly.</p>
              <button onClick={() => { setActiveCategory("All"); setSearchQuery(""); }} className="reset-btn">
                Clear Filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = !!openItems[faq.id];
              return (
                <div key={faq.id} className={`faq-item ${isOpen ? "is-open" : ""}`}>
                  <button
                    className="faq-question-btn"
                    onClick={() => toggleItem(faq.id)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-idx">{String(idx + 1).padStart(2, "0")}</span>
                    <h3 className="faq-question-text">{faq.question}</h3>
                    <span className="faq-cat-badge">{faq.category}</span>
                    <span className="faq-icon">{isOpen ? "−" : "+"}</span>
                  </button>

                  {isOpen && (
                    <div className="faq-answer-panel">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </main>

        {/* Contact CTA */}
        <section className="faq-cta">
          <div className="faq-cta__card">
            <h2>VISIT AAREN INTPRO SHOWROOM</h2>
            <p>Mysore Road, Bengaluru, Karnataka | Call: +91 888 446 4444</p>
            <div className="faq-cta__buttons">
              <Link href="/contact" className="cta-btn primary">
                SCHEDULE VISIT →
              </Link>
              <a href="mailto:info@aarenintpro.com" className="cta-btn secondary">
                EMAIL INFO@AARENINTPRO.COM
              </a>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .faq-page {
          background-color: #E6E2D8;
          color: #1e1e1e;
          min-height: 100vh;
          padding-top: 8rem;
          padding-bottom: 8rem;
          font-family: var(--font-jost), 'Jost', sans-serif;
        }

        /* ── Full-bleed page header — matches About Us / Our Team / Contact Us ── */
        .faq-header {
          padding-top: 8rem;
          padding-bottom: 4rem;
          padding-left: 0;
          padding-right: 0;
          border-bottom: 0.1rem solid rgba(129, 102, 63, 0.18);
        }

        .faq-desc {
          font-size: 1.6rem;
          line-height: 1.6;
          color: rgba(0,0,0,0.65);
          max-width: 58rem;
          margin-bottom: 3.2rem;
          font-weight: 400;
        }

        .faq-search {
          position: relative;
          margin-bottom: 2.4rem;
        }

        .search-input {
          width: 100%;
          background: #f0ece3;
          border: 1px solid rgba(129,102,63,0.22);
          color: #1e1e1e;
          padding: 1.4rem 2rem;
          border-radius: 999px;
          font-size: 1.3rem;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .search-input:focus {
          border-color: #81663F;
        }

        .search-clear {
          position: absolute;
          right: 1.6rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(0,0,0,0.4);
          font-size: 1.4rem;
          cursor: pointer;
        }

        .faq-categories {
          display: flex;
          gap: 0.8rem;
          flex-wrap: wrap;
        }

        .cat-btn {
          background: #f0ece3;
          border: 1px solid rgba(129,102,63,0.2);
          color: #1e1e1e;
          padding: 0.8rem 1.6rem;
          border-radius: 999px;
          font-size: 1.2rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cat-btn:hover {
          border-color: #81663F;
          color: #81663F;
        }

        .cat-btn.is-active {
          background: #81663F;
          color: #ffffff;
          border-color: #81663F;
        }

        .cat-count {
          opacity: 0.75;
          font-size: 1rem;
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          margin-bottom: 6rem;
        }

        .faq-item {
          background: #f1ede5;
          border: 1px solid rgba(129,102,63,0.18);
          border-radius: 0.6rem;
          overflow: hidden;
          transition: border-color 0.25s ease, background 0.25s ease;
        }

        .faq-item.is-open {
          border-color: #81663F;
          background: #fbf9f4;
        }

        .faq-question-btn {
          width: 100%;
          padding: 2.2rem 2.4rem;
          background: none;
          border: none;
          color: #1e1e1e;
          text-align: left;
          display: grid;
          grid-template-columns: 40px 1fr auto auto;
          gap: 1.6rem;
          align-items: center;
          cursor: pointer;
        }

        .faq-idx {
          font-size: 1.2rem;
          font-weight: 700;
          color: #81663F;
        }

        .faq-cat-badge {
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: rgba(128, 103, 63, 0.1);
          color: #80673f;
          padding: 0.4rem 0.8rem;
          border-radius: 0.4rem;
          white-space: nowrap;
        }

        .faq-question-text {
          font-size: 1.6rem;
          font-weight: 600;
          margin: 0;
          line-height: 1.3;
          text-transform: none;
          color: #111111;
        }

        .faq-icon {
          font-size: 2.2rem;
          font-weight: 400;
          color: #80673f;
          line-height: 1;
        }

        .faq-answer-panel {
          padding: 1.6rem 2.4rem 2.4rem 8rem;
          font-size: 1.45rem;
          line-height: 1.7;
          color: #222222;
          border-top: 1px solid rgba(0,0,0,0.06);
          white-space: pre-line;
        }

        .no-faqs {
          text-align: center;
          padding: 6rem 2rem;
          color: rgba(0,0,0,0.5);
        }

        .reset-btn {
          margin-top: 1.6rem;
          background: #80673f;
          color: #ffffff;
          border: none;
          padding: 1rem 2rem;
          border-radius: 999px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .reset-btn:hover {
          background: #6a5431;
        }

        .faq-cta {
          border-top: 1px solid rgba(0,0,0,0.1);
          padding-top: 6rem;
        }

        .faq-cta__card {
          background: #fdfbf7;
          border: 1px solid rgba(128, 103, 63, 0.25);
          border-radius: 1.2rem;
          padding: 4rem 3rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.6rem;
        }

        .faq-cta__card h2 {
          font-size: 2.8rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #80673f;
        }

        .faq-cta__card p {
          font-size: 1.5rem;
          color: rgba(0,0,0,0.7);
          max-width: 600px;
        }

        .faq-cta__buttons {
          display: flex;
          gap: 1.2rem;
          flex-wrap: wrap;
          margin-top: 1rem;
          justify-content: center;
        }

        .cta-btn {
          padding: 1.2rem 2.8rem;
          border-radius: 999px;
          font-weight: 700;
          font-size: 1.2rem;
          letter-spacing: 0.06em;
          text-decoration: none;
          transition: transform 0.2s ease, background 0.2s ease;
        }

        .cta-btn:hover {
          transform: translateY(-0.2rem);
        }

        .cta-btn.primary {
          background: #80673f;
          color: #ffffff;
        }

        .cta-btn.primary:hover {
          background: #6a5431;
        }

        .cta-btn.secondary {
          background: #ffffff;
          color: #80673f;
          border: 1px solid #80673f;
        }

        .cta-btn.secondary:hover {
          background: #fdfbf7;
        }
      `}</style>
    </div>
  );
}
