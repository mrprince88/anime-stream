"use client";

import { useState, useEffect } from "react";
import { Player } from "@/components/features/VideoPlayer";
import { Play, X } from "lucide-react";
import Link from "next/link";

interface Episode {
  id: string;
  number: number;
  url?: string;
  isDubbed?: boolean;
  isSubbed?: boolean;
}

interface AnimePlayerProps {
  animeId: string;
  animeTitle: string;
  episodes: Episode[] | undefined;
}

export function AnimePlayer({ animeId, animeTitle, episodes }: AnimePlayerProps) {
  const [selectedEpisode, setSelectedEpisode] = useState<string | null>(
    episodes && episodes.length > 0 ? episodes[0].id : null
  );
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [availableQualities, setAvailableQualities] = useState<any[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<string>("");



  useEffect(() => {
    if (!selectedEpisode) return;

    const fetchEpisodeSources = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/episode-sources?id=${selectedEpisode}`);
        const data = await res.json();

        // Store all available sources/qualities
        const sources = data?.sources || [];
        setAvailableQualities(sources);

        // Initialize selectedQuality with first source (usually auto) if not set or valid
        // We prefer 'auto' or 'default' if available
        let defaultQuality = "";
        if (sources.length > 0) {
          const auto = sources.find((s: any) => s.quality === "auto");
          const dflt = sources.find((s: any) => s.quality === "default");
          defaultQuality = (auto || dflt || sources[0]).quality;
        }

        // If currently selected quality is not in the new list, reset to default
        // Or if we just loaded
        const currentQualityExists = sources.some((s: any) => s.quality === selectedQuality);
        const qualityToUse = (selectedQuality && currentQualityExists) ? selectedQuality : defaultQuality;

        if (selectedQuality !== qualityToUse) {
          setSelectedQuality(qualityToUse);
        }

        // Find the selected source URL
        const selectedSource = sources.find((s: any) => s.quality === qualityToUse);

        if (selectedSource?.url && data?.headers) {
          const proxyUrl = `/api/proxy?url=${encodeURIComponent(selectedSource.url)}&headers=${encodeURIComponent(JSON.stringify(data.headers))}`;
          setVideoUrl(proxyUrl);
        } else if (selectedSource?.url) {
          setVideoUrl(selectedSource.url);
        }


      } catch (error) {
        console.error("Error fetching episode sources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodeSources();
  }, [selectedEpisode, selectedQuality]);

  if (!episodes || episodes.length === 0) {
    return null;
  }

  const currentEpisode = episodes.find(ep => ep.id === selectedEpisode);
  const currentEpisodeNumber = currentEpisode?.number;

  return (
    <div className="mb-16" id="player-section">
      {selectedEpisode && (
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Video Player */}
            <div className="flex-1">
              <div className="relative">
                {loading ? (
                  <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center">
                    <div className="text-white">Loading episode...</div>
                  </div>
                ) : videoUrl ? (
                  <Player src={videoUrl} subtitles={[]} key={`${selectedEpisode}`} />
                ) : (
                  <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center">
                    <div className="text-white">No video source available</div>
                  </div>
                )}
              </div>

              {/* Episode Info & Controls */}
              <div className="mt-4 flex flex-col gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {animeTitle} - Episode {currentEpisodeNumber}
                  </h3>
                </div>

                {/* Quality Selection */}
                {availableQualities.length > 1 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">Quality:</span>
                    {availableQualities.map((source, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedQuality(source.quality)}
                        className={`px-3 py-1 rounded text-xs font-bold transition-colors ${selectedQuality === source.quality
                          ? 'bg-violet-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                          }`}
                      >
                        {source.quality === 'default' ? 'Default' :
                          source.quality === 'auto' ? 'Auto' :
                            source.quality.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Episodes Sidebar */}
            <div className="w-full lg:w-[350px] shrink-0">
              <div className="bg-slate-900 rounded-xl border border-white/5 overflow-hidden sticky top-24 max-h-[calc(100vh-8rem)] flex flex-col">
                <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0 bg-slate-900 z-10">
                  <h3 className="font-bold text-white">Episodes ({episodes.length})</h3>
                </div>

                <div className="overflow-y-auto custom-scrollbar flex-1 p-2">
                  <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-4 gap-2">
                    {episodes.map((ep) => (
                      <button
                        key={ep.id}
                        onClick={() => setSelectedEpisode(ep.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${ep.id === selectedEpisode
                          ? 'bg-violet-600 border-violet-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                          }`}
                      >
                        <span className="text-sm font-bold">{ep.number}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Episodes Grid (when no episode selected) */}
      {!selectedEpisode && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-violet-500 pl-4">
            Episodes ({episodes.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {episodes.map((ep) => (
              <button
                key={ep.id}
                onClick={() => setSelectedEpisode(ep.id)}
                className="group block p-3 rounded-lg bg-slate-900 border border-white/5 hover:border-violet-500/50 hover:bg-slate-800 transition-all text-center"
              >
                <div className="text-lg font-bold text-slate-200 group-hover:text-violet-400">EP {ep.number}</div>
                <div className="text-xs text-slate-500 mt-1">Episode {ep.number}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
