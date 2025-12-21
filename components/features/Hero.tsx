"use client";

import { motion } from "framer-motion";
import { Play, Info } from "lucide-react";
import Image from "next/image";

export function Hero() {
  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=2670&auto=format&fit=crop"
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-6 h-full flex flex-col justify-center max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl space-y-6"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm font-medium backdrop-blur-sm">
            #1 Trending This Week
          </span>
          
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
            Demon Slayer: <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
              Kimetsu no Yaiba
            </span>
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed line-clamp-3">
            Tanjiro Kamado creates a team of demon slayers to hunt down the demon who murdered his family and turned his sister into a demon. Experience the breathtaking animation and emotional journey.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button className="flex items-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-violet-600/25">
              <Play className="w-5 h-5 fill-current" />
              Watch Now
            </button>
            <button className="flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold backdrop-blur-md transition-all border border-white/10 hover:border-white/20">
              <Info className="w-5 h-5" />
              More Details
            </button>
          </div>

          <div className="flex items-center gap-6 pt-8 text-sm text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <span className="text-green-400">98% Match</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 border border-slate-700 rounded text-xs">TV-14</span>
            </div>
            <div>3 Seasons</div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-white/10 rounded text-xs">HD</span>
              <span className="px-2 py-0.5 bg-white/10 rounded text-xs">CC</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
