
import React, { useRef, useState } from "react";
import { Play, Pause, Maximize } from "lucide-react";

const HeroPage = ({
  pageName,
  media,
  mediaType = "image",
}) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  // Play / Pause video
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

  // Fullscreen video
  const handleFullscreen = () => {
    if (!videoRef.current) return;

    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if (videoRef.current.webkitRequestFullscreen) {
      // Safari
      videoRef.current.webkitRequestFullscreen();
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden">

      {/* Background Media */}
      <div className="absolute inset-0">

        {mediaType === "video" ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full h-full object-cover"
          >
            <source src={media} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={media}
            alt={pageName}
            className="w-full h-full object-cover"
          />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Page Name */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white">
          {pageName}
        </h1>
      </div>

      {/* Video Controls */}
      {mediaType === "video" && (
        <div className="absolute bottom-8 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-10">

          {/* Play / Pause */}
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause video" : "Play video"}
            className="
              flex items-center justify-center
              w-11 h-11
              rounded-full
              bg-black/50
              backdrop-blur-sm
              text-white
              border border-white/30
              hover:bg-white hover:text-black
              transition-all duration-300
              shadow-lg
            "
          >
            {isPlaying ? (
              <Pause size={20} />
            ) : (
              <Play size={20} className="ml-0.5" />
            )}
          </button>

          {/* Fullscreen */}
          <button
            onClick={handleFullscreen}
            aria-label="Fullscreen video"
            className="
              flex items-center justify-center
              w-11 h-11
              rounded-full
              bg-black/50
              backdrop-blur-sm
              text-white
              border border-white/30
              hover:bg-white hover:text-black
              transition-all duration-300
              shadow-lg
            "
          >
            <Maximize size={20} />
          </button>

        </div>
      )}

    </section>
  );
};

export default HeroPage;

