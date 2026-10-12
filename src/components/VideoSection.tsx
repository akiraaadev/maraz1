import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Sparkles } from "lucide-react";
import { INITIAL_CLINIC_DATA } from "../data/initialClinicData";

interface VideoSectionProps {
  videoUrl?: string;
  posterUrl?: string;
}

export const VideoSection: React.FC<VideoSectionProps> = ({
  videoUrl,
  posterUrl,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Default muted to ensure seamless browser autoplay
  const [progress, setProgress] = useState(0);
  const [showTapHint, setShowTapHint] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const safeVideoUrl = videoUrl || INITIAL_CLINIC_DATA.video.videoUrl;
  const safePosterUrl = posterUrl || INITIAL_CLINIC_DATA.video.poster;
  const isYouTube = Boolean(safeVideoUrl && (safeVideoUrl.includes("youtube.com") || safeVideoUrl.includes("youtu.be")));
  const isVimeo = Boolean(safeVideoUrl && safeVideoUrl.includes("vimeo.com"));

  const getYouTubeEmbedUrl = (url: string) => {
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
    } else if (url.includes("watch?v=")) {
      videoId = url.split("watch?v=")[1]?.split("&")[0] || "";
    } else if (url.includes("embed/")) {
      return `${url}?autoplay=1&mute=1&controls=1&playsinline=1&loop=1`;
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&playsinline=1&loop=1` : url;
  };

  // Reprodução automática imediata ao carregar a página e ao entrar no viewport
  useEffect(() => {
    const video = videoRef.current;
    if (!video || isYouTube || isVimeo) return;

    // Garantir muted para liberar autoplay no iOS/Android sem bloqueio
    video.muted = isMuted;

    const startPlayback = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Se o navegador bloquear por qualquer motivo, força muted e tenta novamente
            video.muted = true;
            setIsMuted(true);
            video.play()
              .then(() => setIsPlaying(true))
              .catch((e) => console.log("Autoplay aguardando interação:", e));
          });
      }
    };

    startPlayback();

    // IntersectionObserver para continuar tocando sempre que a seção estiver visível
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startPlayback();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [safeVideoUrl, isYouTube, isVimeo, isMuted]);

  // Esconder a dica de áudio após 6 segundos se já começou a rodar
  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        setShowTapHint(false);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [isPlaying]);

  const handleVideoTap = () => {
    if (!videoRef.current || !safeVideoUrl) return;

    // Se o vídeo estiver com som mudo, o primeiro toque ativa o som
    if (isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
      setShowTapHint(false);
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true));
      }
      return;
    }

    // Se já estiver com som, alterna entre play e pause
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    setShowTapHint(false);
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true));
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 1;
    setProgress((current / duration) * 100);
  };

  return (
    <section
      ref={sectionRef}
      id="video"
      className="relative w-full h-[100dvh] min-h-[100dvh] bg-stone-950 flex items-center justify-center overflow-hidden"
    >
      {/* Container mobile 9:16 vertical fullscreen */}
      <div className="relative w-full h-full max-w-md mx-auto overflow-hidden bg-black flex items-center justify-center shadow-2xl">
        {isYouTube ? (
          <iframe
            src={getYouTubeEmbedUrl(safeVideoUrl)}
            title="Vídeo Institucional"
            className="w-full h-full border-0 object-cover"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : isVimeo ? (
          <iframe
            src={`${safeVideoUrl}?autoplay=1&muted=1&loop=1`}
            title="Vídeo Institucional"
            className="w-full h-full border-0 object-cover"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div
            onClick={handleVideoTap}
            className="relative w-full h-full cursor-pointer select-none"
          >
            {/* HTML5 Native Video element in vertical mode with AUTOPLAY and MUTED */}
            <video
              ref={videoRef}
              src={safeVideoUrl}
              poster={safePosterUrl}
              autoPlay
              muted={isMuted}
              playsInline
              loop
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-cover select-none"
            />

            {/* Subtle scrim for controls visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

            {/* Top Bar: Pill com status de áudio e botão interativo */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] text-white/90">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-medium text-xs tracking-wide">Clínica Mara Mendes</span>
              </div>

              {/* Botão de Som no topo */}
              <button
                onClick={toggleMute}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md text-xs font-semibold transition-all shadow-lg active:scale-95 ${
                  isMuted
                    ? "bg-[#D4AF37] text-stone-950 border border-[#F4E3A1]"
                    : "bg-black/70 text-white border border-white/20 hover:bg-black/90"
                }`}
                aria-label={isMuted ? "Ativar som do vídeo" : "Desativar som do vídeo"}
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-stone-950 shrink-0" />
                    <span>Ativar Som</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#F4E3A1] shrink-0" />
                    <span>Com Áudio</span>
                  </>
                )}
              </button>
            </div>

            {/* Indicador suave de toque para ouvir som (desaparece gradualmente ou ao tocar) */}
            {isMuted && showTapHint && (
              <div className="absolute bottom-16 left-4 right-4 z-20 flex justify-center pointer-events-none transition-opacity duration-500">
                <div className="px-4 py-2 rounded-full bg-black/75 backdrop-blur-md border border-[#D4AF37]/60 text-white text-[11px] font-medium flex items-center gap-2 shadow-xl animate-bounce">
                  <Volume2 className="w-3.5 h-3.5 text-[#F4E3A1]" />
                  <span>Vídeo reproduzindo · Toque na tela para ouvir</span>
                </div>
              </div>
            )}

            {/* Pause indicator (aparece somente se o usuário pausar manualmente) */}
            {!isPlaying && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-black/70 backdrop-blur-md border border-[#D4AF37] flex items-center justify-center shadow-2xl">
                  <Play className="w-8 h-8 text-[#F4E3A1] fill-[#F4E3A1] ml-1" />
                </div>
                <div className="mt-2.5 px-3 py-1 rounded-full bg-black/70 text-[11px] font-medium text-white/90">
                  Vídeo pausado · Toque para continuar
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
