"use client";

import { motion } from "framer-motion";
import { Star, PlayCircle, PlayIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface AnimeCardProps {
  id: string;
  title: string;
  image: string;
  rating: number;
  episode: number;
  type: string;
}

export function AnimeCard({ id, title, image, rating, episode, type }: AnimeCardProps) {
  return (
    <Link href={`/anime/${id}`} className="group block relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-slate-900 border border-white/5 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/20">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

      {/* Play Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-12 h-12 rounded-full bg-violet-600 flex items-center justify-center text-white shadow-lg transform scale-50 group-hover:scale-100 transition-transform">
          <PlayIcon className="w-6 h-6 fill-current" />
        </div>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
        <div className="flex items-center justify-between text-xs font-medium text-slate-300 mb-2">
          <span className="bg-white/10 backdrop-blur-md px-2 py-0.5 rounded text-white border border-white/10 uppercase tracking-wider">
            {type}
          </span>
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="w-3 h-3 fill-current" />
            <span>{rating}</span>
          </div>
        </div>
        
        <h3 className="text-white font-bold leading-tight group-hover:text-violet-300 transition-colors line-clamp-2">
          {title}
        </h3>
        
        <div className="mt-2 text-xs text-slate-400 font-medium">
          Ep {episode} Released
        </div>
      </div>
    </Link>
  );
}
