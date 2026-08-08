"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Share2, MapPin } from "lucide-react";
import { BlogItem } from "@/lib/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogDetail({ params }: PageProps) {
  const resolvedParams = use(params);
  const targetSlug = resolvedParams.slug;

  const [article, setArticle] = useState<BlogItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [fontSettings, setFontSettings] = useState({
    articleTitleSize: "1.75rem",
    articleBodySize: "0.9rem",
  });

  const [comments, setComments] = useState<{ author: string; text: string; date?: string }[]>([
    {
      author: "Ethan Pierce",
      text: "Stunning analysis of outdoor materials and architectural surface performance.",
      date: "Today",
    },
  ]);
  const [newComment, setNewComment] = useState({ author: "", text: "" });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          const found = json.data.find(
            (b: BlogItem) =>
              b.slug === targetSlug ||
              b.id === targetSlug ||
              b.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === targetSlug.toLowerCase()
          );
          if (found) {
            setArticle(found);
          }
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));

    fetch("/api/blog-settings")
      .then((res) => res.json())
      .then((json) => {
        if (json && json.success && json.data) {
          setFontSettings(json.data);
        }
      })
      .catch(() => {});
  }, [targetSlug]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.author || !newComment.text) return;
    setComments([...comments, { ...newComment, date: "Today" }]);
    setNewComment({ author: "", text: "" });
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#fcfbf9] text-neutral-900 pt-32 pb-24 px-6 md:px-12 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#80673f] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs font-bold uppercase tracking-widest text-[#80673f]">Loading Editorial Article...</p>
        </div>
      </div>
    );
  }

  const displayTitle = article?.title || targetSlug.replace(/-/g, " ");
  const displayCategory = article?.category || "Outdoor Architecture & Surfaces";
  const displayDate = article?.publishDate || article?.createdAt || "August 2026";
  const displayAuthor = article?.author || "Aaren Studio Editorial & Architectural Design Team";
  const displayImage =
    article?.featuredImage ||
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80";
  const rawContent =
    article?.content ||
    `Imagine stepping out from your living room onto a beautifully finished terrace, relaxing beside a pool on a warm wood-look deck, or enjoying an evening with family in a landscaped outdoor space.

The right flooring can transform these spaces completely.

NewTechWood composite decking is designed to bring the visual appeal of timber to outdoor environments while offering the benefits of engineered composite technology.

From Balconies to Luxury Villas

Composite decking can be used to enhance:
• Residential balconies
• Rooftop terraces
• Garden decks
• Poolside areas
• Villa exteriors
• Outdoor restaurants
• Hospitality spaces

The result is an outdoor environment that feels warm, sophisticated and connected to nature.

Built for Everyday Life

Outdoor flooring has to deal with sunlight, rain, dirt, furniture and regular foot traffic.

NewTechWood's UltraShield® technology is designed to provide protection against stains, fading, scratches, moisture and mould while reducing the maintenance normally associated with outdoor wood surfaces.

The decking is available in different profiles and can be installed using conventional screws or hidden fastening systems, depending on the product and project requirements.

Design Beyond the Deck

NewTechWood's product portfolio extends beyond decking to include composite wall cladding, siding, fencing, railing and other outdoor solutions.

This makes it possible to create a cohesive outdoor design rather than treating the deck as a standalone element.

Visit the Experience Centre

Want to see how NewTechWood can transform your outdoor space?

Visit the NewTechWood Experience Centre at Aaren Intpro, Mysore Road, Bengaluru, and explore the colours, textures and applications in person.

Step outside. Experience better outdoor living with NewTechWood.`;

  // Parse raw content string into structured blocks
  const blocks = rawContent.split("\n\n").map((block) => block.trim()).filter(Boolean);

  // Check if content has the 5 key reasons or structured list items
  const keyReasonsList = [
    { title: "Unmatched Weather Resistance & Durability", desc: "Unlike traditional wood that warps, splinters, or rots over time, NewTechWood withstands extreme summer heat and heavy monsoons without expanding or splitting." },
    { title: "Zero Maintenance & Eco-Friendly Living", desc: "Manufactured using 95% recycled materials (including plastic bottles and reclaimed wood fibers), NewTechWood requires zero staining, sanding, or oiling." },
    { title: "Natural Wood Grain Aesthetics", desc: "Available in luxury teak, ipe, walnut, and charcoal finishes, it matches the rich texture of natural timber while maintaining perfect geometric alignment." },
    { title: "Hidden Fastener Installation System", desc: "Enjoy clean, seamless deck surfaces with concealed clip locking systems that hide screws and hardware." },
    { title: "25-Year Commercial Warranty", desc: "Backed by global testing certifications, guaranteeing long-term value for residential villas, hotels, pool decks, and commercial facades." }
  ];

  return (
    <div className="bg-[#fdfcfb] text-neutral-900 min-h-screen pt-28 md:pt-36 pb-24 border-t border-neutral-100">
      {/* GLOBAL CONTAINER: MAX-WIDTH 1400px */}
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
        
        {/* 1. ARTICLE HEADER / HERO SECTION (MAX-WIDTH 1200px) */}
        <header className="max-w-[1200px] mx-auto mb-10">
          
          {/* Top Bar: Back Link & Share Action */}
          <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-neutral-200/70">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-extrabold text-neutral-500 hover:text-[#80673f] transition-colors"
            >
              <ArrowLeft size={15} /> Back to Journal
            </Link>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#80673f] bg-[#f5f1ea] hover:bg-[#ede5d6] px-3.5 py-1.5 rounded-full border border-[#e2d8c3] transition-colors"
            >
              <Share2 size={13} /> {copied ? "Link Copied!" : "Share Article"}
            </button>
          </div>

          {/* Category & Date Metadata */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="text-xs font-black uppercase tracking-widest text-[#80673f]">
              {displayCategory}
            </span>
            <span className="text-xs text-neutral-300">•</span>
            <span className="text-xs md:text-sm text-neutral-500 font-medium flex items-center gap-1">
              <Calendar size={13} className="text-[#80673f]" /> {displayDate}
            </span>
            <span className="text-xs text-neutral-300">•</span>
            <span className="text-xs md:text-sm text-neutral-500 font-medium flex items-center gap-1">
              <Clock size={13} className="text-[#80673f]" /> 4 MIN READ
            </span>
          </div>

          {/* Large Editorial Title */}
          <h1
            style={{ fontSize: article?.titleSize || fontSettings.articleTitleSize || "clamp(2rem, 4vw, 3.5rem)" }}
            className="font-extrabold tracking-tight text-[#80673f] uppercase leading-[1.12] mb-6 max-w-[1100px]"
          >
            {displayTitle}
          </h1>

          {/* Author Byline Bar */}
          <div className="flex items-center gap-3 py-3 border-y border-neutral-200/80 my-6">
            <div className="w-8 h-8 rounded-full bg-[#80673f] text-white flex items-center justify-center font-black text-xs shadow-xs">
              A
            </div>
            <span className="text-xs md:text-sm font-bold text-neutral-800 uppercase tracking-wider">
              {displayAuthor}
            </span>
          </div>
        </header>

        {/* 3. FEATURED IMAGE CONTAINER (MAX-WIDTH 1200px, ASPECT 16:9 / 21:9) */}
        <div className="max-w-[1200px] mx-auto mb-16 rounded-2xl overflow-hidden shadow-lg border border-neutral-200/80 aspect-[16/9] md:aspect-[21/9] bg-neutral-100 relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayImage}
            alt={displayTitle}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]"
          />
        </div>

        {/* 4. NARROW EDITORIAL READING COLUMN (MAX-WIDTH 820px) */}
        <main className="max-w-[820px] mx-auto">
          
          {/* Formatted Article Body */}
          {rawContent.includes("<") && rawContent.includes(">") ? (
            <>
              <style jsx global>{`
                .article-rich-content {
                  color: #262626;
                  font-size: 18px;
                  line-height: 1.85;
                }
                .article-rich-content h1,
                .article-rich-content h2,
                .article-rich-content h3,
                .article-rich-content h4 {
                  color: #80673f;
                  font-weight: 800;
                  margin-top: 2.2rem;
                  margin-bottom: 0.9rem;
                  line-height: 1.25;
                }
                .article-rich-content p {
                  margin-bottom: 1.75rem;
                }
                .article-rich-content ul,
                .article-rich-content ol {
                  margin: 1.5rem 0 1.5rem 1.8rem;
                  padding-left: 0.5rem;
                }
                .article-rich-content ul {
                  list-style-type: disc;
                }
                .article-rich-content ol {
                  list-style-type: decimal;
                }
                .article-rich-content li {
                  margin-bottom: 0.5rem;
                }
                .article-rich-content blockquote {
                  border-left: 4px solid #80673f;
                  background: #f7f3eb;
                  padding: 1.2rem 1.6rem;
                  margin: 1.8rem 0;
                  border-radius: 0 10px 10px 0;
                  font-style: italic;
                  color: #333;
                }
                .article-rich-content img {
                  display: block;
                  max-width: 100%;
                  height: auto;
                  margin: 2rem auto;
                  border-radius: 12px;
                }
              `}</style>
              <div
                style={{ fontSize: article?.bodySize || fontSettings.articleBodySize || "18px" }}
                className="article-rich-content"
                dangerouslySetInnerHTML={{ __html: rawContent }}
              />
            </>
          ) : (
            <div className="article-body space-y-7 text-[18px] text-neutral-800 leading-[1.85] font-normal">
              {blocks.map((block, idx) => {
                const isHeading =
                  block.length < 65 &&
                  !block.endsWith(".") &&
                  !block.includes("\n") &&
                  !block.match(/^[0-9]\./);

                if (isHeading) {
                  return (
                    <h3
                      key={idx}
                      className="text-xl md:text-2xl font-black text-[#80673f] uppercase mt-10 mb-3 leading-snug tracking-tight"
                    >
                      {block}
                    </h3>
                  );
                }

                return (
                  <p key={idx} className="whitespace-pre-line text-neutral-800">
                    {block}
                  </p>
                );
              })}
            </div>
          )}

          {/* 5. 5 KEY REASONS ARCHITECTS & BUILDERS CHOOSE NEWTECHWOOD SECTION */}
          {targetSlug.includes("newtechwood") && (
            <section className="my-14 p-8 md:p-10 bg-[#f7f3eb] rounded-2xl border border-[#e5decb] shadow-xs">
              <h3 className="text-lg md:text-xl font-black text-[#80673f] uppercase tracking-tight mb-8 pb-4 border-b border-[#e1d5c2] leading-tight">
                5 KEY REASONS ARCHITECTS & BUILDERS<br className="hidden md:block" /> CHOOSE NEWTECHWOOD
              </h3>

              <div className="space-y-6">
                {keyReasonsList.map((reason, rIdx) => (
                  <div key={rIdx} className="flex items-start gap-4 p-4 rounded-xl bg-white border border-[#eae3d5] shadow-xs">
                    <span className="text-xl md:text-2xl font-black text-[#80673f] shrink-0 font-mono">
                      0{rIdx + 1}
                    </span>
                    <div>
                      <h4 className="text-base font-extrabold text-neutral-900 leading-snug">
                        {reason.title}
                      </h4>
                      <p className="text-sm text-neutral-600 font-normal mt-1 leading-relaxed">
                        {reason.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 6. EXPERIENCE CENTRE CTA BANNER */}
          <section className="my-14 p-8 md:p-10 bg-[#80673f] text-white rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#e8dfce] bg-[#655231] px-3 py-1 rounded-sm">
                EXPERIENCE CENTRE
              </span>
              <h3 className="text-xl md:text-2xl font-extrabold mt-3 text-white">
                Aaren Intpro Experience Centre
              </h3>
              <p className="text-sm text-[#e6ded0] mt-2 max-w-xl font-normal leading-relaxed">
                Explore physical samples, swatches & outdoor decking materials at Mysore Road, Bengaluru.
              </p>
            </div>
            <Link
              href="/contact"
              className="px-7 py-3.5 bg-white text-[#80673f] hover:bg-[#f5efe6] font-bold text-xs uppercase tracking-widest rounded-full transition-all shadow-md shrink-0 flex items-center gap-2"
            >
              <MapPin size={14} /> Book a Visit →
            </Link>
          </section>

          {/* 7. CLEAN EDITORIAL COMMENTS SECTION */}
          <section className="border-t border-neutral-200/80 pt-12 mt-16">
            
            {/* Header with Counter */}
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-neutral-200">
              <h3 className="text-lg font-black uppercase tracking-wider text-[#80673f]">
                COMMENTS ({comments.length})
              </h3>
            </div>

            {/* Comment List */}
            <div className="space-y-4 mb-12">
              {comments.map((c, i) => (
                <div key={i} className="bg-white border border-neutral-200/90 p-6 rounded-xl shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#80673f]">
                      {c.author}
                    </span>
                    {c.date && <span className="text-[11px] text-neutral-400 font-medium">{c.date}</span>}
                  </div>
                  <p className="text-neutral-800 text-sm font-normal leading-relaxed">
                    {c.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Editorial Add Comment Form */}
            <form onSubmit={handleCommentSubmit} className="space-y-5 bg-white border border-neutral-200/90 p-8 rounded-xl shadow-xs">
              <h4 className="text-xs font-black uppercase tracking-widest text-[#80673f]">
                ADD A COMMENT
              </h4>
              
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold mb-2 text-neutral-700">
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your full name"
                  value={newComment.author}
                  onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
                  className="w-full bg-[#fdfcfb] border border-neutral-300 p-3.5 text-neutral-900 text-sm outline-none focus:border-[#80673f] rounded-lg transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold mb-2 text-neutral-700">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share your thoughts on this article..."
                  value={newComment.text}
                  onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                  className="w-full bg-[#fdfcfb] border border-neutral-300 p-3.5 text-neutral-900 text-sm outline-none focus:border-[#80673f] rounded-lg transition-colors"
                />
              </div>

              <button
                type="submit"
                className="px-8 py-3.5 bg-[#80673f] text-white font-extrabold uppercase tracking-widest text-xs hover:bg-[#685331] transition-colors rounded-full shadow-md cursor-pointer"
              >
                POST COMMENT
              </button>
            </form>
          </section>

        </main>
      </div>
    </div>
  );
}
