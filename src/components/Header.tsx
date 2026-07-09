"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Dark mode default for premium STURDY feel
  const pathname = usePathname();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Work", href: "/work" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 mix-blend-difference px-6 md:px-12 py-6 flex justify-between items-center text-white">
        <Link href="/" className="text-2xl font-black tracking-tighter">
          AAREN<span className="text-accent font-bold">.</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold tracking-wider uppercase">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`hover:text-accent transition-colors ${
                pathname === link.href ? "text-accent" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={toggleTheme}
            className="p-1 rounded-full border border-white/20 hover:border-accent transition-colors flex items-center justify-center"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </nav>

        <div className="md:hidden flex items-center space-x-4">
          <button onClick={toggleTheme} className="p-1 rounded-full border border-white/20">
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Fullscreen Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 bg-[#080808] z-40 flex flex-col justify-center px-8 md:px-16"
          >
            <div className="flex flex-col space-y-6">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-5xl md:text-7xl font-black uppercase tracking-tighter hover:text-accent transition-colors ${
                      pathname === link.href ? "text-accent" : "text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="absolute bottom-8 left-8 text-xs text-muted-foreground">
              <p>© {new Date().getFullYear()} Aaren Creative Studio. All Rights Reserved.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
