"use client";

import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { MediaPlayer, MediaProvider, Track } from "@vidstack/react";
import { defaultLayoutIcons, DefaultVideoLayout } from "@vidstack/react/player/layouts/default";

export interface Subtitle {
  url: string;
  lang: string;
  label: string;
  kind: "subtitles" | "captions" | "chapters" | "descriptions" | "metadata"; 
}

interface PlayerProps {
  src: string;
  subtitles?: Subtitle[];
}

export function Player({ src, subtitles = [] }: PlayerProps) {
  
  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/5">
      <MediaPlayer 
        src={src} 
        title="Anime Episode" 
        aspectRatio="16/9"
        crossOrigin="anonymous"
        playsInline
        onLoadedMetadata={(event: any) => {
          // Metadata loaded
        }}
        onTextTracksChange={(tracks: any) => {
          // Text tracks changed
        }}
      >
        <MediaProvider />
        {/* Only add Track components if subtitles have URLs */}
        {subtitles.length > 0 && subtitles.map((track, index) => (
          <Track
            key={String(index)}
            src={track.url}
            kind={track.kind}
            label={track.label}
            lang={track.lang}
            default={index === 0} 
          />
        ))}
        <DefaultVideoLayout 
          icons={defaultLayoutIcons}
          thumbnails=""
          noScrubGesture={false}
        />
      </MediaPlayer>
    </div>
  );
}
