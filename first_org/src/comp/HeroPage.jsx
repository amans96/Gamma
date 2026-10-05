import React, { useRef, useState, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ArrowDown,
} from "lucide-react";

const HeroPage = ({
  pageName,
  subtitle,
  media,
  mediaType = "image",
}) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const toggleMute = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="group relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-black"
    >
      {/* =========================
          BACKGROUND MEDIA
      ========================== */}
      <div className="absolute inset-0 overflow-hidden">
        {mediaType === "video" ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="
              h-full
              w-full
              object-cover
              scale-105
              transition-transform
              duration-[3000ms]
              ease-out
              group-hover:scale-110
            "
          >
            <source src={media} type="video/mp4" />
          </video>
        ) : (
          <img
            src={media}
            alt={pageName}
            className="
              h-full
              w-full
              object-cover
              scale-105
              transition-transform
              duration-[3000ms]
              ease-out
              group-hover:scale-110
            "
          />
        )}

        {/* Cinematic gradient */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-b
            from-black/20
            via-black/35
            to-black/80
          "
        />

        {/* Side vignette */}
        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.65)_100%)]
          "
        />

        {/* Animated glow */}
        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[500px]
            w-[500px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-white/5
            blur-[120px]
            animate-pulse
          "
        />
      </div>

      {/* =========================
          HERO CONTENT
      ========================== */}
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 text-center">
        
        {/* Eyebrow */}
    

        {/* Main heading */}
        <h1
          className="
            max-w-5xl
            text-5xl
            font-semibold
            tracking-[-0.04em]
            text-white
            drop-shadow-2xl

            sm:text-6xl
            md:text-7xl
            lg:text-8xl

            animate-[fadeUp_1s_ease-out]
          "
        >
          {pageName}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p
            className="
              mt-6
              max-w-2xl
              text-base
              leading-relaxed
              text-white/65
              sm:text-lg
              md:text-xl
              animate-[fadeUp_1.2s_ease-out]
            "
          >
            {subtitle}
          </p>
        )}

        {/* CTA */}
        <div
          className="
            mt-10
            flex
            flex-col
            gap-3
            sm:flex-row
            animate-[fadeUp_1.4s_ease-out]
          "
        >
         

         
        </div>
      </div>

      {/* =========================
          VIDEO CONTROLS
      ========================== */}
      {mediaType === "video" && (
        <div
          className="
            absolute
            bottom-6
            left-6
            z-20

            flex
            items-center
            gap-1

            rounded-full
            border
            border-white/15
            bg-black/30
            p-1.5

            shadow-2xl
            backdrop-blur-2xl

            md:bottom-8
            md:left-8

            transition-all
            duration-300
            hover:border-white/30
            hover:bg-black/50
          "
        >
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause video" : "Play video"}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              text-white
              transition-all
              duration-200
              hover:bg-white/15
              hover:scale-105
            "
          >
            {isPlaying ? (
              <Pause size={19} className="fill-current" />
            ) : (
              <Play size={19} className="ml-0.5 fill-current" />
            )}
          </button>

          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              text-white
              transition-all
              duration-200
              hover:bg-white/15
              hover:scale-105
            "
          >
            {isMuted ? (
              <VolumeX size={19} />
            ) : (
              <Volume2 size={19} />
            )}
          </button>

          <div className="mx-1 h-5 w-px bg-white/15" />

          <button
            onClick={toggleFullscreen}
            aria-label={
              isFullscreen
                ? "Exit fullscreen"
                : "Enter fullscreen"
            }
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              text-white
              transition-all
              duration-200
              hover:bg-white/15
              hover:scale-105
            "
          >
            {isFullscreen ? (
              <Minimize size={18} />
            ) : (
              <Maximize size={18} />
            )}
          </button>
        </div>
      )}

      {/* =========================
          SCROLL INDICATOR
      ========================== */}
    
       

       
      
    </section>
  );
};

export default HeroPage;