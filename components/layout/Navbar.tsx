"use client";

import Link from "next/link";
import { Search, Menu, User } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 py-4 ${
        isScrolled
          ? "bg-slate-950/80 backdrop-blur-md border-b border-white/5"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow">
            A
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            AnimeVibe
          </span>
        </Link>

        {/* Desktop Navigation */}
        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link href="/search" className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors">
            <Search className="w-5 h-5" />
          </Link>
          <button className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors">
            <User className="w-5 h-5" />
          </button>
          <button className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
