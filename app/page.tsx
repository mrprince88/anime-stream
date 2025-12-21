import { Hero } from "@/components/features/Hero";
import { AnimeCard } from "@/components/features/AnimeCard";
import { getTrendingAnime, getRecentEpisodes } from "@/lib/api";

export default async function Home() {
  const [trending, recent] = await Promise.all([
    getTrendingAnime(),
    getRecentEpisodes()
  ]);

  return (
    <div className="pb-20">
      <Hero />
      
      <div className="container mx-auto px-6 mt-12 relative z-10">
        {/* Trending Section */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-1.5 h-8 bg-violet-600 rounded-full" />
            Threading Now
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
          {trending.slice(0, 6).map((anime) => (
            <AnimeCard 
              key={anime.id} 
              id={anime.id} 
              title={anime.title} 
              image={anime.image} 
              rating={0} // API doesn't return rating for this endpoint
              episode={0} 
              type="TV" 
            />
          ))}
        </div>

        {/* Recent Episodes Section */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-1.5 h-8 bg-violet-600 rounded-full" />
            Recent Episodes
          </h2>
          <a href="/search?sort=recent" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
            View All
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {recent.map((anime) => (
            <AnimeCard 
              key={anime.id} 
              id={anime.id} 
              title={anime.title} 
              image={anime.image} 
              rating={0}
              episode={anime.episodeNumber || 0}
              type="TV" 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
