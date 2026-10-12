import React, { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface VideoSectionProps {
  videoUrl: string;
  posterUrl: string;
}

export const VideoSection: React.FC<VideoSectionProps> = ({
  videoUrl,
  posterUrl,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const safeVideoUrl = videoUrl || "";
  const isYouTube = Boolean(safeVideoUrl && (safeVideoUrl.includes("youtube.com") || safeVideoUrl.includes("youtu.be")));
  const isVimeo = Boolean(safeVideoUrl && safeVideoUrl.includes("vimeo.com"));

  const getYouTubeEmbedUrl = (url: string) => {
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
    } else if (url.includes("watch?v=")) {
      videoId = url.split("watch?v=")[1]?.split("&")[0] || "";
    } else if (url.includes("embed/")) {
      return url;
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1` : url;
  };

  const togglePlay = () => {
    if (!videoRef.current || !safeVideoUrl) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play();
          setIsPlaying(true);
        }
      });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 1;
    setProgress((current / duration) * 100);
  };

  return (
    <section
      id="video"
      className="relative w-full h-[100dvh] min-h-[100dvh] bg-stone-950 flex items-center justify-center overflow-hidden"
    >
      {/* Container mobile 9:16 vertical fullscreen */}
      <div className="relative w-full h-full max-w-md mx-auto overflow-hidden bg-black flex items-center justify-center shadow-2xl">
        {isYouTube ? (
          <iframe
            src={getYouTubeEmbedUrl(videoUrl)}
            title="Vídeo Institucional"
            className="w-full h-full border-0 object-cover"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : isVimeo ? (
          <iframe
            src={videoUrl}
            title="Vídeo Institucional"
            className="w-full h-full border-0 object-cover"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div
            onClick={togglePlay}
            className="relative w-full h-full cursor-pointer select-none"
          >
            {/* HTML5 Native Video element in vertical mode */}
            <video
              ref={videoRef}
              src={videoUrl}
              poster={posterUrl}
              playsInline
              loop
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-cover select-none"
            />

            {/* Subtle scrim for controls visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />

            {/* Top Sound Toggle Button */}
            <div className="absolute top-4 right-4 z-20 pointer-events-auto">
              <button
                onClick={toggleMute}
                className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:scale-105 active:scale-95 transition-transform shadow-lg"
                aria-label={isMuted ? "Ativar som" : "Desativar som"}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-white" />
                ) : (
                  <Volume2 className="w-4 h-4 text-[#F4E3A1]" />
                )}
              </button>
            </div>

            {/* Central Play Button Overlay (quando pausado) */}
            {!isPlaying && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                <div className="w-20 h-20 rounded-full bg-black/60 backdrop-blur-md border-2 border-[#D4AF37] flex items-center justify-center shadow-2xl transition-transform transform hover:scale-105">
                  <Play className="w-9 h-9 text-[#F4E3A1] fill-[#F4E3A1] ml-1" />
                </div>
                <div className="mt-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-[11px] font-medium text-white tracking-wider uppercase border border-white/10">
                  Toque para assistir
                </div>
              </div>
            )}

            {/* Bottom Stories Bar: Progress Line */}
            <div className="absolute bottom-5 left-4 right-4 z-20 pointer-events-none">
              <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden shadow-xs">
                <div
                  className="h-full bg-gradient-to-r from-[#D4AF37] to-[#FFF1BC] transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
