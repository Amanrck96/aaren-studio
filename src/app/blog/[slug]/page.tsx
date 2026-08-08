"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, User, Share2, Bookmark } from "lucide-react";
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
    { author: "Ethan Pierce", text: "Stunning analysis of outdoor materials and architectural surface performance.", date: "Today" },
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
    setComments([...comments, { ...newComment, date: "Just now" }]);
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
          <p className="text-xs font-bold uppercase tracking-widest text-[#80673f]">Loading Journal Article...</p>
        </div>
      </div>
    );
  }

  const displayTitle = article?.title || targetSlug.replace(/-/g, " ");
  const displayCategory = article?.category || "Outdoor Architecture & Surfaces";
  const displayDate = article?.publishDate || article?.createdAt || "August 2026";
  const displayAuthor = article?.author || "AAREN ATELIER";
  const displayImage =
    article?.featuredImage ||
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80";
  const rawContent =
    article?.content ||
    `NewTechWood represents the pinnacle of composite wood technology for luxury outdoor living spaces. Engineered with an advanced Ultrashield co-extrusion technology, NewTechWood delivers an ultra-durable outer shell that protects against moisture, UV rays, fading, scratches, and severe weather elements.

5 Key Reasons Architects & Builders Choose NewTechWood:

1. Unmatched Weather Resistance & Durability: Unlike traditional wood that warps, splinters, or rots over time, NewTechWood withstands extreme summer heat and heavy monsoons without expanding or splitting.
2. Zero Maintenance & Eco-Friendly Living: Manufactured using 95% recycled materials (including plastic bottles and reclaimed wood fibers), NewTechWood requires zero staining, sanding, or oiling.
3. Natural Wood Grain Aesthetics: Available in luxury teak, ipe, walnut, and charcoal finishes, it matches the rich texture of natural timber while maintaining perfect geometric alignment.
4. Hidden Fastener Installation System: Enjoy clean, seamless deck surfaces with concealed clip locking systems that hide screws and hardware.
5. 25-Year Commercial Warranty: Backed by global testing certifications, guaranteeing long-term value for residential villas, hotels, pool decks, and commercial facades.`;

  // Parse raw content string into structured paragraphs and headings if plain text
  const blocks = rawContent.split("\n\n").map((block) => block.trim()).filter(Boolean);

  return (
    <div className="bg-[#fcfbf9] text-neutral-900 pt-28 pb-24 px-6 md:px-12 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Top Breadcrumb & Share Bar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-200">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-[#80673f] transition-colors text-xs uppercase tracking-widest font-bold"
          >
            <ArrowLeft size={14} /> Back to Journal
          </Link>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#80673f] hover:text-neutral-900 transition-colors bg-[#f4f0ea] px-3 py-1.5 rounded-full border border-[#e5decb]"
          >
            <Share2 size={13} /> {copied ? "Link Copied!" : "Share Article"}
          </button>
        </div>

        <article className="mb-16">
          {/* Category Pill & Date */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="text-[11px] font-black uppercase tracking-widest text-white bg-[#80673f] px-3 py-1 rounded-sm shadow-sm">
              {displayCategory}
            </span>
            <span className="text-xs font-semibold text-neutral-400">•</span>
            <span className="text-xs font-semibold text-neutral-500 flex items-center gap-1">
              <Calendar size={13} /> {displayDate}
            </span>
            <span className="text-xs font-semibold text-neutral-400">•</span>
            <span className="text-xs font-semibold text-neutral-500 flex items-center gap-1">
              <Clock size={13} /> 4 MIN READ
            </span>
          </div>

          {/* Article Title */}
          <h1
            style={{ fontSize: article?.titleSize || fontSettings.articleTitleSize || "1.85rem" }}
            className="font-black tracking-tight mt-3 mb-6 leading-tight text-[#80673f] capitalize"
          >
            {displayTitle}
          </h1>

          {/* Author Byline Bar */}
          <div className="flex items-center gap-3 mb-8 p-3 bg-[#f5f1eb] rounded-lg border border-[#e8dfd1]">
            <div className="w-9 h-9 rounded-full bg-[#80673f] text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {displayAuthor.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-900 uppercase tracking-wider">{displayAuthor}</p>
              <p className="text-[11px] text-neutral-500 font-medium">Aaren Studio Editorial & Architectural Design Team</p>
            </div>
          </div>

          {/* Featured Cover Image */}
          <div
            style={{ height: article?.imageHeight || (fontSettings as any).articleImageHeight || "340px" }}
            className="w-full bg-neutral-100 overflow-hidden mb-10 rounded-xl border border-neutral-200 shadow-md relative"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={displayImage} alt={displayTitle} className="w-full h-full object-cover" />
          </div>

          {/* Formatted Article Body */}
          {rawContent.includes("<") && rawContent.includes(">") ? (
            <>
              <style jsx global>{`
                .article-rich-content {
                  color: #262626;
                  line-height: 1.8;
                }
                .article-rich-content h1,
                .article-rich-content h2,
                .article-rich-content h3,
                .article-rich-content h4 {
                  color: #80673f;
                  font-weight: 800;
                  margin-top: 2rem;
                  margin-bottom: 0.8rem;
                  line-height: 1.3;
                }
                .article-rich-content p {
                  margin-bottom: 1.25rem;
                }
                .article-rich-content ul,
                .article-rich-content ol {
                  margin: 1.2rem 0 1.2rem 1.8rem;
                  padding-left: 0.5rem;
                }
                .article-rich-content ul {
                  list-style-type: disc;
                }
                .article-rich-content ol {
                  list-style-type: decimal;
                }
                .article-rich-content li {
                  margin-bottom: 0.4rem;
                }
                .article-rich-content blockquote {
                  border-left: 4px solid #80673f;
                  background: #f7f3eb;
                  padding: 1rem 1.4rem;
                  margin: 1.5rem 0;
                  border-radius: 0 8px 8px 0;
                  font-style: italic;
                  color: #444;
                }
                .article-rich-content img {
                  display: block;
                  max-width: 100%;
                  height: auto;
                  margin: 1.8rem auto;
                  transition: all 0.3s ease;
                }
                .article-rich-content img.img-float-left {
                  float: left;
                  margin: 0.5rem 1.5rem 1.5rem 0;
                  max-width: 50%;
                }
                .article-rich-content img.img-float-right {
                  float: right;
                  margin: 0.5rem 0 1.5rem 1.5rem;
                  max-width: 50%;
                }
                .article-rich-content img.img-center {
                  margin: 1.8rem auto;
                  clear: both;
                }
                .article-rich-content .pic-style-frame {
                  border: 4px solid #ffffff;
                  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
                  padding: 4px;
                  background: #fff;
                }
                .article-rich-content .pic-style-rounded {
                  border-radius: 14px;
                  overflow: hidden;
                }
                .article-rich-content .pic-style-gold {
                  border: 2px solid #80673f;
                  box-shadow: 0 10px 30px rgba(128, 103, 63, 0.25);
                  border-radius: 8px;
                }
                .article-rich-content .pic-style-shadow {
                  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.18);
                  border-radius: 6px;
                }
                .article-rich-content figure {
                  margin: 1.8rem 0;
                  text-align: center;
                }
                .article-rich-content figcaption {
                  font-size: 0.825rem;
                  color: #80673f;
                  font-weight: 600;
                  margin-top: 0.5rem;
                  font-style: italic;
                }
              `}</style>
              <div
                style={{ fontSize: article?.bodySize || fontSettings.articleBodySize || "0.9rem" }}
                className="article-rich-content"
                dangerouslySetInnerHTML={{ __html: rawContent }}
              />
            </>
          ) : (
            <div className="article-body space-y-4">
              {blocks.map((block, idx) => {
                const isHeading =
                  block.length < 65 &&
                  !block.endsWith(".") &&
                  !block.includes("\n") &&
                  !block.match(/^[0-9]\./);

                if (isHeading) {
                  return (
                    <h3 key={idx} className="text-base md:text-lg font-bold text-[#80673f] mt-8 mb-2 leading-snug">
                      {block}
                    </h3>
                  );
                }

                return (
                  <p
                    key={idx}
                    style={{ fontSize: article?.bodySize || fontSettings.articleBodySize || "0.9rem" }}
                    className="text-neutral-700 leading-relaxed font-normal whitespace-pre-line"
                  >
                    {block}
                  </p>
                );
              })}
            </div>
          )}
        </article>

        {/* Editorial Footer & Experience Centre Card */}
        <div className="bg-[#f4efe6] border border-[#e5decb] p-6 rounded-xl mb-12 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#80673f]">VISIT US IN BENGALURU</span>
            <h4 className="text-base font-extrabold text-neutral-900 mt-1">Aaren Intpro Experience Centre</h4>
            <p className="text-xs text-neutral-600 mt-1">Explore physical samples, swatches & outdoor decking materials at Mysore Road, Bengaluru.</p>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2.5 bg-[#80673f] text-white font-bold uppercase tracking-wider text-xs hover:bg-[#685331] transition-colors rounded-full shadow-sm"
          >
            Book Visit
          </Link>
        </div>

        {/* Comments Section */}
        <div className="border-t border-neutral-200 pt-10">
          <h3 className="text-lg font-extrabold uppercase tracking-wider mb-6 text-[#80673f]">
            COMMENTS ({comments.length})
          </h3>

          <div className="space-y-4 mb-10">
            {comments.map((c, i) => (
              <div key={i} className="bg-white border border-neutral-200 p-5 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#80673f]">{c.author}</span>
                  {c.date && <span className="text-[11px] text-neutral-400 font-medium">{c.date}</span>}
                </div>
                <p className="text-neutral-800 text-sm font-normal leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleCommentSubmit} className="space-y-4 bg-white border border-neutral-200 p-6 rounded-xl shadow-sm">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#80673f]">Add a Comment</h4>
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold mb-1.5 text-neutral-700">Name</label>
              <input
                type="text"
                required
                value={newComment.author}
                onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
                className="w-full bg-[#fdfcfb] border border-neutral-300 p-3 text-neutral-900 text-sm outline-none focus:border-[#80673f] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold mb-1.5 text-neutral-700">Message</label>
              <textarea
                rows={3}
                required
                value={newComment.text}
                onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                className="w-full bg-[#fdfcfb] border border-neutral-300 p-3 text-neutral-900 text-sm outline-none focus:border-[#80673f] rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#80673f] text-white font-bold uppercase tracking-wider text-xs hover:bg-[#685331] transition-colors rounded-full shadow-sm"
            >
              Post Comment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
