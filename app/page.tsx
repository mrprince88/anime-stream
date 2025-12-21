import { Hero } from "@/components/features/Hero";
import { AnimeCard } from "@/components/features/AnimeCard";
import { getTrendingAnime, getRecentEpisodes, getTVAnime, getOVAAnime, getSpecialAnime } from "@/lib/api";

export default async function Home() {
  const [trending, recent, tv, ova, special] = await Promise.all([
    getTrendingAnime(),
    getRecentEpisodes(),
    getTVAnime(),
    getOVAAnime(),
    getSpecialAnime()
  ]);

  const Section = ({ title, items }: { title: string; items: any[] }) => (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="w-1.5 h-8 bg-violet-600 rounded-full" />
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {items.slice(0, 12).map((anime) => (
          <AnimeCard 
            key={anime.id} 
            id={anime.id} 
            title={anime.title} 
            image={anime.image} 
            rating={anime.rating || 0}
            episode={anime.episodeNumber || 0}
            type={anime.type || "TV"} 
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="pb-20">
      <Hero items={trending.slice(0, 5)} />
      
      <div className="container mx-auto px-6 mt-12 relative z-10">
        <Section title="Recently Added" items={recent} />
        <Section title="TV Series" items={tv} />
        <Section title="OVA" items={ova} />
        <Section title="Specials" items={special} />
      </div>
    </div>
  );
}
