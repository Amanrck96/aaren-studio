"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([
    { id: "1", title: "THE FUTURE OF INTERACTIVE WEBGL SHADERS", category: "Development", date: "July 8, 2026" },
    { id: "2", title: "ESTABLISHING MINIMALIST BRAND AESTHETICS", category: "Design", date: "July 2, 2026" },
  ]);

  const [newBlog, setNewBlog] = useState({ title: "", category: "" });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlog.title) return;
    setBlogs([...blogs, { id: String(blogs.length + 1), ...newBlog, date: "Today" }]);
    setNewBlog({ title: "", category: "" });
  };

  const handleDelete = (id: string) => {
    setBlogs(blogs.filter((b) => b.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black uppercase tracking-tight mb-12">MANAGE JOURNAL POSTS</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Add form */}
          <div className="border border-neutral-900 bg-neutral-950 p-8">
            <h2 className="text-xl font-bold uppercase mb-6">Create Post</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold mb-2">Post Title</label>
                <input
                  type="text"
                  required
                  value={newBlog.title}
                  onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                  className="w-full bg-[#080808] border border-neutral-800 p-4 text-white text-sm outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold mb-2">Category</label>
                <input
                  type="text"
                  required
                  value={newBlog.category}
                  onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                  className="w-full bg-[#080808] border border-neutral-800 p-4 text-white text-sm outline-none focus:border-accent"
                />
              </div>
              <button type="submit" className="w-full py-4 bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-accent hover:text-white transition-colors flex items-center justify-center gap-2">
                <Plus size={16} /> Publish Post
              </button>
            </form>
          </div>

          {/* List panel */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold uppercase mb-6">Journal Records ({blogs.length})</h2>
            <div className="space-y-4">
              {blogs.map((blog) => (
                <div key={blog.id} className="border border-neutral-900 bg-neutral-950 p-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold uppercase">{blog.title}</h3>
                    <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">
                      {blog.category} • Published: {blog.date}
                    </p>
                  </div>
                  <button onClick={() => handleDelete(blog.id)} className="text-red-500 hover:text-red-400 p-2">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
