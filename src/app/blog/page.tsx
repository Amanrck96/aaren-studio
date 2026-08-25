import { getBlogsStore, getBlogSettingsStore } from "@/lib/store";
import BlogClient from "./BlogClient";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const [blogs, blogSettings] = await Promise.all([
    getBlogsStore(),
    getBlogSettingsStore(),
  ]);

  const postsList = (blogs || []).map((b: any, idx: number) => {
    const rawSummary = b.excerpt || b.summary || (b.content ? b.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() : "");
    const summary = rawSummary ? (rawSummary.length > 140 ? rawSummary.substring(0, 140) + "..." : rawSummary) : "Explore luxury architectural surface collections and designer interior solutions.";
    return {
      title: b.title,
      slug: b.slug || b.id || `blog-${idx + 1}`,
      summary,
      category: b.category || "Design",
      date: b.publishedAt || b.date || "July 2026",
      readTime: b.readTime || "5 MIN READ",
      author: b.author || "AAREN ATELIER",
      image: b.featuredImage || b.coverImage || b.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      featured: idx === 0,
    };
  });

  return <BlogClient initialPosts={postsList} initialFontSettings={blogSettings} />;
}
