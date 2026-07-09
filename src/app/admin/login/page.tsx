"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@aaren.com" && password === "admin123") {
      // Simulate successful admin state
      localStorage.setItem("aaren_admin_session", "admin");
      router.push("/admin/dashboard");
    } else if (email === "editor@aaren.com" && password === "editor123") {
      localStorage.setItem("aaren_admin_session", "editor");
      router.push("/admin/dashboard");
    } else {
      setError("Invalid administrative credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md border border-neutral-900 bg-neutral-950 p-8 md:p-12">
        <h1 className="text-3xl font-black tracking-tighter text-center uppercase mb-2">
          AAREN CMS<span className="text-accent">.</span>
        </h1>
        <p className="text-xs text-neutral-500 text-center uppercase tracking-widest mb-8">
          Administrative Portal Access
        </p>

        {error && (
          <div className="p-4 bg-accent/20 border border-accent text-xs font-bold text-center uppercase mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@aaren.com"
              className="w-full bg-[#080808] border border-neutral-800 p-4 text-white text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#080808] border border-neutral-800 p-4 text-white text-sm outline-none focus:border-accent"
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-accent hover:text-white transition-colors"
          >
            Authenticate Portal
          </button>
        </form>

        <div className="mt-8 border-t border-neutral-900 pt-6 text-center text-xs text-neutral-600">
          <p>Mock login: admin@aaren.com / admin123</p>
        </div>
      </div>
    </div>
  );
}
