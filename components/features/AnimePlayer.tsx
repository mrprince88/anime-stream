"use client";

import { useState, useEffect } from "react";
import { Player } from "@/components/features/VideoPlayer";
import { Play, X } from "lucide-react";
import Link from "next/link";

interface Episode {
  id: string;
  number: number;
  url?: string;
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
  const [subtitles, setSubtitles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDub, setIsDub] = useState(false);
  const [availableServers, setAvailableServers] = useState<any[]>([]);
  const [selectedServer, setSelectedServer] = useState<string>("default");

  useEffect(() => {
    if (!selectedEpisode) return;

    const fetchEpisodeSources = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/episode-sources?id=${selectedEpisode}&dub=${isDub}`);
        const data = await res.json();
        
        // Store all available sources/servers
        const sources = data?.sources || [];
        setAvailableServers(sources);
        console.log('Available servers:', sources); // Debug log
        
        // Initialize selectedServer with first server if not set
        if (!selectedServer && sources.length > 0) {
          setSelectedServer(sources[0].quality);
        }
        
        // Find the selected server or default
        const selectedSource = sources.find((s: any) => s.quality === selectedServer) 
          || sources.find((s: any) => s.quality === "default") 
          || sources.find((s: any) => s.quality === "auto")
          || sources[0];
        
        if (selectedSource?.url && data?.headers) {
          const proxyUrl = `/api/proxy?url=${encodeURIComponent(selectedSource.url)}&headers=${encodeURIComponent(JSON.stringify(data.headers))}`;
          setVideoUrl(proxyUrl);
        } else if (selectedSource?.url) {
          setVideoUrl(selectedSource.url);
        }

        // Extract and process subtitles
        const trackList = data?.tracks || data?.subtitles || [];
        const subs = trackList
          .filter((t: any) => t.kind !== 'thumbnails' && (t.file || t.url))
          .map((t: any) => ({
            url: t.file || t.url,
            lang: t.label || t.lang || 'English',
            label: t.label || t.lang || 'English',
            kind: 'subtitles' as const
          }));
        setSubtitles(subs);
        
        console.log('Loaded subtitles:', subs); // Debug log
      } catch (error) {
        console.error("Error fetching episode sources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodeSources();
  }, [selectedEpisode, isDub, selectedServer]);

  if (!episodes || episodes.length === 0) {
    return null;
  }

  const currentEpisodeNumber = episodes.find(ep => ep.id === selectedEpisode)?.number;

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
                  <Player src={videoUrl} subtitles={subtitles} key={`${selectedEpisode}-${isDub}`} />
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
                
                {/* Sub/Dub Toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Language:</span>
                  <button
                    onClick={() => setIsDub(false)}
                    className={`px-3 py-1 rounded text-xs font-bold transition-colors ${!isDub ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                  >
                    SUB
                  </button>
                  <button
                    onClick={() => setIsDub(true)}
                    className={`px-3 py-1 rounded text-xs font-bold transition-colors ${isDub ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                  >
                    DUB
                  </button>
                </div>

                {/* Server Selection & Subtitle Info */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Server Selection */}
                  {availableServers.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-medium">Server:</span>
                      {availableServers.map((server, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedServer(server.quality)}
                          className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                            selectedServer === server.quality 
                              ? 'bg-violet-600 text-white' 
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                          }`}
                        >
                          {server.quality === 'default' ? 'Default' : 
                           server.quality === 'auto' ? 'Auto' :
                           server.quality.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Subtitle Count Indicator */}
                  {subtitles.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <span>📝</span>
                      <span>{subtitles.length} subtitle{subtitles.length > 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
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
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                          ep.id === selectedEpisode
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
