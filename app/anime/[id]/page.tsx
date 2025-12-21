import { getAnimeDetails } from "@/lib/api";
import { AnimeCard } from "@/components/features/AnimeCard";
import { Play, Star, Calendar, Clock, Share2, Heart, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// Server Component (no "use client")
export default async function AnimeDetail({ params }: { params: { id: string } }) {
  // Await params first (Next.js 15+ requirement style, good practice)
  const { id } = await params;
  
  const anime = await getAnimeDetails(id);

  if (!anime) {
    return notFound();
  }

  // Fallback for missing images
  const coverImage = anime.image || "https://images.unsplash.com/photo-1620553630925-b46e330f6d62?q=80&w=600&auto=format&fit=crop";

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Header */}
      <div className="relative h-[60vh] w-full">
        <div className="absolute inset-0">
          <Image
            src={coverImage}
            alt={anime.title}
            fill
            className="object-cover opacity-50 blur-sm"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/30" />
        </div>
      </div>

      <div className="container mx-auto px-6 relative -mt-64 z-10">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Poster */}
          <div className="shrink-0 w-64 md:w-80 rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/5 mx-auto md:mx-0">
            <div className="relative aspect-[2/3]">
              <Image
                src={coverImage}
                alt={anime.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pt-4 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
              {anime.title}
            </h1>
            <p className="text-slate-400 text-lg mb-6 max-w-2xl mx-auto md:mx-0">{anime.otherName}</p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-8">
              <div className="px-3 py-1 bg-white/10 rounded-lg text-sm font-medium">{anime.status}</div>
              <div className="px-3 py-1 bg-white/10 rounded-lg text-sm font-medium">{anime.releaseDate}</div>
              <div className="px-3 py-1 bg-violet-600/20 text-violet-300 border border-violet-600/30 rounded-lg text-sm font-medium">{anime.subOrDub?.toUpperCase()}</div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-10">
              {anime.episodes && anime.episodes.length > 0 ? (
                <Link
                  href={`/watch/${anime.episodes[0].id}`}
                  className="flex items-center gap-3 px-8 py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-violet-600/25"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Watch Episode 1
                </Link>
              ) : (
                <button disabled className="px-8 py-3.5 bg-slate-700 text-slate-400 rounded-xl font-bold cursor-not-allowed">
                  No Episodes Available
                </button>
              )}
              
              <button className="p-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>

            <div className="prose prose-invert max-w-4xl mx-auto md:mx-0 mb-10">
              <p className="text-slate-300 leading-relaxed text-lg">
                {anime.description}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-8 justify-center md:justify-start">
               {anime.genres?.map(genre => (
                 <span key={genre} className="px-3 py-1 rounded-full border border-slate-700 text-xs text-slate-400">
                   {genre}
                 </span>
               ))}
            </div>
          </div>
        </div>

        {/* Episodes Section */}
        {anime.episodes && anime.episodes.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-violet-500 pl-4">Episodes ({anime.episodes.length})</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {anime.episodes.map((ep) => (
                <Link 
                  key={ep.id}
                  href={`/watch/${ep.id}`}
                  className="group block p-3 rounded-lg bg-slate-900 border border-white/5 hover:border-violet-500/50 hover:bg-slate-800 transition-all text-center"
                >
                  <div className="text-lg font-bold text-slate-200 group-hover:text-violet-400">EP {ep.number}</div>
                  <div className="text-xs text-slate-500 mt-1">Episode {ep.number}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations Section */}
        {anime.recommendations && anime.recommendations.length > 0 && (
          <div className="mt-20 mb-10">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
              <span className="w-1.5 h-8 bg-violet-600 rounded-full" />
              You Might Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {anime.recommendations.map((rec) => (
                <AnimeCard 
                  key={rec.id} 
                  id={rec.id} 
                  title={rec.title} 
                  image={rec.image} 
                  rating={rec.rating || 0}
                  episode={rec.episodeNumber || 0}
                  type={rec.type || "TV"}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
