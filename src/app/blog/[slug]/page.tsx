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
    <div className="bg-[#080808] text-white pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-12 text-sm uppercase tracking-widest font-bold">
          <ArrowLeft size={16} /> Back to journal
        </Link>

        <article className="mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-accent">{article.category} • {article.date}</span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mt-4 mb-8 leading-none">
            {article.title}
          </h1>

          <div className="w-full aspect-[21/9] bg-neutral-900 overflow-hidden mb-12">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          </div>

          <p className="text-neutral-300 text-lg leading-relaxed font-light whitespace-pre-line mb-12">
            {article.content}
          </p>
        </article>

        {/* Comments Section */}
        <div className="border-t border-neutral-900 pt-12">
          <h3 className="text-2xl font-black uppercase tracking-tight mb-8">COMMENTS ({comments.length})</h3>
          
          <div className="space-y-6 mb-12">
            {comments.map((c, i) => (
              <div key={i} className="bg-neutral-950 border border-neutral-900 p-6">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">{c.author}</span>
                <p className="text-neutral-300 text-sm mt-2 font-light">{c.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleCommentSubmit} className="space-y-6 bg-neutral-950 border border-neutral-900 p-8">
            <h4 className="text-lg font-bold uppercase">Add a Comment</h4>
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold mb-2">Name</label>
              <input
                type="text"
                required
                value={newComment.author}
                onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
                className="w-full bg-[#080808] border border-neutral-800 p-4 text-white text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold mb-2">Message</label>
              <textarea
                rows={4}
                required
                value={newComment.text}
                onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                className="w-full bg-[#080808] border border-neutral-800 p-4 text-white text-sm outline-none focus:border-accent"
              />
            </div>
            <button type="submit" className="px-8 py-4 bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-accent hover:text-white transition-colors">
              Post Comment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
