import { Hero } from "@/components/features/Hero";
import { AnimeSection } from "@/components/features/AnimeSection";
import { 
  getTrendingAnime, 
  getTVAnime, 
  getOVAAnime, 
  getSpecialAnime,
  getRecentEpisodes,
  getRecentAdded,
  getMovies,
  getONA
} from "@/lib/api";

export default async function Home() {
  const [trending, tv, ova, special, recentEpisodes, recentAdded, movies, ona] = await Promise.all([
    getTrendingAnime(),
    getTVAnime(),
    getOVAAnime(),
    getSpecialAnime(),
    getRecentEpisodes(),
    getRecentAdded(),
    getMovies(),
    getONA()
  ]);

  return (
    <div className="pb-20">
      <Hero items={trending.slice(0, 5)} />
      
      <div className="container mx-auto px-6 mt-12 relative z-10">
        <AnimeSection title="Recent Episodes" items={recentEpisodes} />
        <AnimeSection title="Recently Added" items={recentAdded} />
        <AnimeSection title="Movies" items={movies} />
        <AnimeSection title="TV Series" items={tv} />
        <AnimeSection title="OVA" items={ova} />
        <AnimeSection title="ONA" items={ona} />
        <AnimeSection title="Specials" items={special} />
      </div>
    </div>
  );
}
