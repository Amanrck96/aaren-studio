"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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

  const [comments, setComments] = useState<{ author: string; text: string }[]>([
    { author: "Ethan Pierce", text: "Stunning analysis of outdoor materials and design performance." },
  ]);
  const [newComment, setNewComment] = useState({ author: "", text: "" });

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
    setComments([...comments, newComment]);
    setNewComment({ author: "", text: "" });
  };

  if (loading) {
    return (
      <div className="bg-white text-neutral-900 pt-32 pb-24 px-6 md:px-12 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#80673f] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-bold uppercase tracking-widest text-neutral-500">Loading Article...</p>
        </div>
      </div>
    );
  }

  const displayTitle = article?.title || targetSlug.replace(/-/g, " ");
  const displayCategory = article?.category || "Outdoor Architecture & Surfaces";
  const displayDate = article?.publishDate || article?.createdAt || "August 2026";
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

  // Parse raw content string into structured paragraphs and headings
  const blocks = rawContent.split("\n\n").map((block) => block.trim()).filter(Boolean);

  return (
    <div className="bg-white text-neutral-900 pt-28 pb-24 px-6 md:px-12 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-[#80673f] transition-colors mb-8 text-xs uppercase tracking-widest font-bold"
        >
          <ArrowLeft size={14} /> Back to journal
        </Link>

        <article className="mb-16">
          <div className="mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#80673f]">
              {displayCategory} • {displayDate}
            </span>
          </div>

          {/* Dynamic Article Title Font Size */}
          <h1
            style={{ fontSize: article?.titleSize || fontSettings.articleTitleSize || "1.75rem" }}
            className="font-extrabold tracking-tight mt-2 mb-6 leading-tight text-[#80673f]"
          >
            {displayTitle}
          </h1>

          <div
            style={{ height: article?.imageHeight || (fontSettings as any).articleImageHeight || "320px" }}
            className="w-full bg-neutral-100 overflow-hidden mb-10 rounded-lg border border-neutral-200 shadow-sm relative"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={displayImage} alt={displayTitle} className="w-full h-full object-cover" />
          </div>

          {/* Dynamic Article Body Content Font Size */}
          <div className="article-body space-y-4">
            {blocks.map((block, idx) => {
              const isHeading =
                block.length < 65 &&
                !block.endsWith(".") &&
                !block.includes("\n") &&
                !block.match(/^[0-9]\./);

              if (isHeading) {
                return (
                  <h3 key={idx} className="text-base md:text-lg font-bold text-neutral-900 mt-6 mb-2 leading-snug">
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
        </article>

        {/* Comments Section */}
        <div className="border-t border-neutral-200 pt-10">
          <h3 className="text-lg font-bold uppercase tracking-wider mb-6 text-[#80673f]">
            COMMENTS ({comments.length})
          </h3>

          <div className="space-y-4 mb-10">
            {comments.map((c, i) => (
              <div key={i} className="bg-[#fdfbf7] border border-neutral-200 p-5 rounded-lg">
                <span className="text-xs font-bold uppercase tracking-wider text-[#80673f]">{c.author}</span>
                <p className="text-neutral-800 text-sm mt-1 font-normal">{c.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleCommentSubmit} className="space-y-5 bg-[#fdfbf7] border border-neutral-200 p-6 rounded-lg">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#80673f]">Add a Comment</h4>
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold mb-1.5 text-neutral-700">Name</label>
              <input
                type="text"
                required
                value={newComment.author}
                onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
                className="w-full bg-white border border-neutral-300 p-3 text-neutral-900 text-sm outline-none focus:border-[#80673f] rounded"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold mb-1.5 text-neutral-700">Message</label>
              <textarea
                rows={3}
                required
                value={newComment.text}
                onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                className="w-full bg-white border border-neutral-300 p-3 text-neutral-900 text-sm outline-none focus:border-[#80673f] rounded"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#80673f] text-white font-bold uppercase tracking-wider text-xs hover:bg-[#6a5431] transition-colors rounded-full"
            >
              Post Comment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
