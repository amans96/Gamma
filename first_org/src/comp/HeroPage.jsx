import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";

const HeroPage = ({
  pageName,
  media,
  mediaType = "image",
}) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true); // Autoplay usually requires starting muted
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ==========================================
  // PLAY / PAUSE
  // ==========================================
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // ==========================================
  // AUDIO (MUTE / UNMUTE)
  // ==========================================
  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  // ==========================================
  // FULLSCREEN
  // ==========================================
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Listen for 'Esc' key fullscreen exits to update the icon
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative flex min-h-[100dvh] w-full flex-col justify-center overflow-hidden bg-black"
    >
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        {mediaType === "video" ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="h-full w-full object-cover"
          >
            <source src={media} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={media}
            alt={pageName}
            className="h-full w-full object-cover"
          />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      {/* Page Name */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4">
        <h1 className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-lg">
          {pageName}
        </h1>
      </div>

      {/* Aesthetic Video Controls Pill */}
      {mediaType === "video" && (
        <div className="absolute bottom-6 left-6 z-20 md:bottom-10 md:left-10 flex items-center gap-2 rounded-full border border-white/20 bg-black/40 p-2 backdrop-blur-md shadow-xl transition-all">
          
          {/* Play / Pause */}
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause video" : "Play video"}
            className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full text-white transition-colors duration-200 hover:bg-white/20"
          >
            {isPlaying ? (
              <Pause size={22} className="fill-current" />
            ) : (
              <Play size={22} className="ml-1 fill-current" />
            )}
          </button>

          {/* Audio Toggle */}
          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
            className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full text-white transition-colors duration-200 hover:bg-white/20"
          >
            {isMuted ? (
              <VolumeX size={24} strokeWidth={2} />
            ) : (
              <Volume2 size={24} strokeWidth={2} />
            )}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full text-white transition-colors duration-200 hover:bg-white/20"
          >
            {isFullscreen ? (
              <Minimize size={22} strokeWidth={2.5} />
            ) : (
              <Maximize size={22} strokeWidth={2.5} />
            )}
          </button>

        </div>
      )}

    </section>
  );
};

export default HeroPage;