"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";

interface HeroProps {
  items: Array<{
    id: string;
    title: string;
    image: string;
    description?: string;
    rating?: number;
    type?: string;
    genres?: string[];
  }>;
}

export function Hero({ items }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (items.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [items.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  if (!items || items.length === 0) return null;

  const currentItem = items[currentIndex];

  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={currentItem.image}
              alt={currentItem.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/50 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative container mx-auto px-6 h-full flex flex-col justify-center max-w-7xl pt-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-2xl space-y-6"
            >
              <span className="inline-block px-3 py-1 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm font-medium backdrop-blur-sm">
                #{currentIndex + 1} Trending Now
              </span>
              
              <h1 className="text-5xl md:text-7xl font-black text-white leading-tight line-clamp-2">
                {currentItem.title}
              </h1>

              {currentItem.description && (
                <p className="text-lg text-slate-300 leading-relaxed line-clamp-3">
                  {currentItem.description.replace(/<[^>]*>/g, '')}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href={`/anime/${currentItem.id}`}
                  className="flex items-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-violet-600/25"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Watch Now
                </Link>
                <Link
                  href={`/anime/${currentItem.id}`}
                  className="flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold backdrop-blur-md transition-all border border-white/10 hover:border-white/20"
                >
                  <Info className="w-5 h-5" />
                  More Details
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-8 text-sm text-slate-400 font-medium">
                {currentItem.rating && (
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">{currentItem.rating}% Match</span>
                  </div>
                )}
                {currentItem.type && (
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 border border-slate-700 rounded text-xs">{currentItem.type}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-white/10 rounded text-xs">HD</span>
                  <span className="px-2 py-0.5 bg-white/10 rounded text-xs">SUB</span>
                </div>
              </div>

              {currentItem.genres && currentItem.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {currentItem.genres.slice(0, 4).map((genre) => (
                    <span key={genre} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-300">
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      {items.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all hover:scale-110"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all hover:scale-110"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Indicators */}
      {items.length > 1 && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-8 z-20 flex gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-8 bg-violet-500" : "w-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
