"use client";

import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import { defaultLayoutIcons, DefaultVideoLayout } from "@vidstack/react/player/layouts/default";

interface PlayerProps {
  src: string;
}

export function Player({ src }: PlayerProps) {
  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/5">
      <MediaPlayer src={src} title="Details" aspectRatio="16/9">
        <MediaProvider />
        <DefaultVideoLayout icons={defaultLayoutIcons} />
      </MediaPlayer>
    </div>
  );
}
