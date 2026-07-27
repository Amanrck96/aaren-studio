"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const blogDetails: Record<string, {
  title: string;
  category: string;
  date: string;
  image: string;
  content: string;
}> = {
  "future-of-interactive-webgl-shaders": {
    title: "THE FUTURE OF INTERACTIVE WEBGL SHADERS",
    category: "Development",
    date: "July 8, 2026",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    content: "WebGL represents a massive step forward in website animation design pipelines. By allowing designers to draw directly onto canvas contexts using hardware acceleration tools, websites transition from static layouts to responsive interactive art pieces. Combined with Framer Motion and GSAP scroll triggers, premium studio interfaces become highly immersive structures. In this post, we explore compiling custom vertex shaders and mapping motion dynamics with spring physics.",
  },
  "establishing-minimalist-brand-aesthetics": {
    title: "ESTABLISHING MINIMALIST BRAND AESTHETICS",
    category: "Design",
    date: "July 2, 2026",
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80",
    content: "Minimalism is not about removing assets; it is about absolute clarity of purpose. In luxury agency designs inspired by systems like STURDY.CO, massive sans-serif headers paired with plenty of negative space and black backdrops draw direct attention. Using dynamic video previews, smooth easing curves, and clean margins ensures the client portfolio stands out perfectly.",
  },
  "introducing-realtime-3d-camera-triggers": {
    title: "INTRODUCING REALTIME 3D CAMERA TRIGGERS",
    category: "Motion Graphics",
    date: "June 24, 2026",
    image: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=800&q=80",
    content: "Linking active browser scroll triggers directly to virtual cameras inside 3D canvas files creates an incredibly premium effect. By configuring custom lerp limits, we prevent sudden jumps during scroll actions, allowing Lenis to smoothly control rotation coordinates. Here, we outline setup steps for react-three-fiber canvas wrappers.",
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogDetail({ params }: PageProps) {
  const resolvedParams = use(params);
  const article = blogDetails[resolvedParams.slug] || blogDetails["future-of-interactive-webgl-shaders"];

  const [comments, setComments] = useState<{ author: string; text: string }[]>([
    { author: "Ethan Pierce", text: "Stunning analysis of WebGL limits." },
  ]);
  const [newComment, setNewComment] = useState({ author: "", text: "" });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.author || !newComment.text) return;
    setComments([...comments, newComment]);
    setNewComment({ author: "", text: "" });
  };

  return (
    <div className="bg-white text-neutral-900 pt-32 pb-24 px-6 md:px-12 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-2 text-neutral-500 hover:text-[#80673f] transition-colors mb-12 text-sm uppercase tracking-widest font-bold">
          <ArrowLeft size={16} /> Back to journal
        </Link>

        <article className="mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#80673f]">{article.category} • {article.date}</span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mt-4 mb-8 leading-none text-[#80673f]">
            {article.title}
          </h1>

          <div className="w-full aspect-[21/9] bg-neutral-100 overflow-hidden mb-12 rounded-lg border border-neutral-200">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          </div>

          <p className="text-neutral-800 text-lg leading-relaxed font-normal whitespace-pre-line mb-12">
            {article.content}
          </p>
        </article>

        {/* Comments Section */}
        <div className="border-t border-neutral-200 pt-12">
          <h3 className="text-2xl font-black uppercase tracking-tight mb-8 text-[#80673f]">COMMENTS ({comments.length})</h3>
          
          <div className="space-y-6 mb-12">
            {comments.map((c, i) => (
              <div key={i} className="bg-[#fdfbf7] border border-neutral-200 p-6 rounded-lg">
                <span className="text-xs font-bold uppercase tracking-wider text-[#80673f]">{c.author}</span>
                <p className="text-neutral-800 text-sm mt-2 font-normal">{c.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleCommentSubmit} className="space-y-6 bg-[#fdfbf7] border border-neutral-200 p-8 rounded-lg">
            <h4 className="text-lg font-bold uppercase text-[#80673f]">Add a Comment</h4>
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold mb-2 text-neutral-700">Name</label>
              <input
                type="text"
                required
                value={newComment.author}
                onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
                className="w-full bg-white border border-neutral-300 p-4 text-neutral-900 text-sm outline-none focus:border-[#80673f] rounded"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold mb-2 text-neutral-700">Message</label>
              <textarea
                rows={4}
                required
                value={newComment.text}
                onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                className="w-full bg-white border border-neutral-300 p-4 text-neutral-900 text-sm outline-none focus:border-[#80673f] rounded"
              />
            </div>
            <button type="submit" className="px-8 py-4 bg-[#80673f] text-white font-bold uppercase tracking-wider text-xs hover:bg-[#6a5431] transition-colors rounded-full">
              Post Comment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
