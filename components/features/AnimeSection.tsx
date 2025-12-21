"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Anime } from "@/lib/api";
import { AnimeCard } from "./AnimeCard";

interface AnimeSectionProps {
  title: string;
  items: Anime[];
}

export function AnimeSection({ title, items }: AnimeSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = direction === "left" ? -current.clientWidth : current.clientWidth;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!items?.length) return null;

  return (
    <div className="mb-16 relative section-hover">
      <div className="flex items-center justify-between mb-8 px-6 md:px-0">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="w-1.5 h-8 bg-violet-600 rounded-full" />
          {title}
        </h2>
      </div>

      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-violet-600/80 p-2 rounded-full text-white opacity-0 [.section-hover:hover_&]:opacity-100 transition-all duration-300 disabled:opacity-0 backdrop-blur-sm"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-6 md:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((anime) => (
            <div key={anime.id} className="min-w-[160px] w-[160px] md:min-w-[200px] md:w-[200px] flex-shrink-0">
              <AnimeCard
                id={anime.id}
                title={anime.title}
                image={anime.image}
                rating={anime.rating || 0}
                episode={anime.episodeNumber || 0}
                type={anime.type || "TV"}
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-violet-600/80 p-2 rounded-full text-white opacity-0 [.section-hover:hover_&]:opacity-100 transition-all duration-300 disabled:opacity-0 backdrop-blur-sm"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
