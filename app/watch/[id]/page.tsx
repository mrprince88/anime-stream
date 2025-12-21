import { getEpisodeSources, getAnimeDetails } from "@/lib/api";
import { Player } from "@/components/features/VideoPlayer";
import { MessageSquare, Share2, ThumbsUp, ThumbsDown, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function WatchPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  // Fetch sources
  const sourcesData = await getEpisodeSources(id);
  
  // We need anime details to show the episode list sidebar.
  // The episode ID usually contains the anime ID, but parsing it is unreliable.
  // For gogoanime, episode ID format is often "anime-slug-episode-N".
  // Let's try to extract the anime slug.
  const animeIdGuess = id.split("-episode-")[0];
  const anime = await getAnimeDetails(animeIdGuess);

  // Find the default source (usually hls)
  const defaultSource = sourcesData?.sources.find((s: any) => s.quality === "default") || sourcesData?.sources[0];
  
  // Construct proxy URL if source exists
  let playUrl = defaultSource?.url;
  if (playUrl && sourcesData?.headers) {
    playUrl = `/api/proxy?url=${encodeURIComponent(playUrl)}&headers=${encodeURIComponent(JSON.stringify(sourcesData.headers))}`;
  }

  if (!sourcesData || !defaultSource) {
    return (
       <div className="min-h-screen flex items-center justify-center text-white">
         <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Video Source Not Found</h1>
            <p className="text-slate-400 mt-2">Could not find a stream for this episode.</p>
            <Link href="/" className="inline-block mt-6 px-6 py-2 bg-violet-600 rounded-lg font-medium">Go Home</Link>
         </div>
       </div>
    );
  }

  return (
    <div className="pt-24 pb-12 px-4 md:px-8 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8 max-w-[1800px] mx-auto">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <Player src={playUrl || ""} />
          
          <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-white mb-2 line-clamp-2">{anime?.title || id}</h1>
              <div className="flex items-center gap-4 text-xs md:text-sm text-slate-400">
                 <span>Episode {id.split("-episode-")[1] || "?"}</span>
                 <span className="hidden md:inline">•</span>
                 <span className="hidden md:inline">HD</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm font-medium transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span className="hidden md:inline">Like</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm font-medium transition-colors">
                <Share2 className="w-4 h-4" />
                <span className="hidden md:inline">Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="bg-slate-900 rounded-xl border border-white/5 overflow-hidden sticky top-24 max-h-[calc(100vh-8rem)] flex flex-col">
            <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0 bg-slate-900 z-10">
              <h3 className="font-bold text-white">Episodes</h3>
            </div>
            
            <div className="overflow-y-auto custom-scrollbar flex-1 p-2">
              <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-3 gap-2">
              {anime?.episodes?.map((ep) => (
                <Link 
                  key={ep.id}
                  href={`/watch/${ep.id}`}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                    ep.id === id 
                    ? 'bg-violet-600 border-violet-500 text-white' 
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                  }`}
                >
                    <span className="text-sm font-bold">{ep.number}</span>
                </Link>
              ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
