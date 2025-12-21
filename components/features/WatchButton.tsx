"use client";

import { Play } from "lucide-react";

interface WatchButtonProps {
  hasEpisodes: boolean;
}

export function WatchButton({ hasEpisodes }: WatchButtonProps) {
  const handleClick = () => {
    const playerSection = document.getElementById('player-section');
    if (playerSection) {
      playerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!hasEpisodes) {
    return (
      <button disabled className="px-8 py-3.5 bg-slate-700 text-slate-400 rounded-xl font-bold cursor-not-allowed">
        No Episodes Available
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-3 px-8 py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-violet-600/25"
    >
      <Play className="w-5 h-5 fill-current" />
      Watch Episode 1
    </button>
  );
}
