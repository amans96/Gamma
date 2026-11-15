import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Play, Pause, Volume2, VolumeX, ArrowRight } from "lucide-react";

export default function HeroPage({
  pageName,
  subtitle,
  media,
  mediaType = "image",
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

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

  const isLandingHero = !pageName || pageName.trim() === "";

  const titleText = isLandingHero
    ? "Powering industrial infrastructure with precision engineering."
    : pageName;

  const subtitleText = isLandingHero
    ? "High-performance power transformers, distribution solutions, and turnkey electrical engineering services built for demanding operations."
    : subtitle;

  return (
    <section className="relative w-full overflow-hidden bg-slate-950 text-white min-h-[75vh] lg:min-h-[82vh] flex items-center">
      {/* Background Media */}
      <div className="absolute inset-0 overflow-hidden">
        {mediaType === "video" && media ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="h-full w-full object-cover opacity-45"
          >
            <source src={media} type="video/mp4" />
          </video>
        ) : media ? (
          <img
            src={media}
            alt={titleText}
            className="h-full w-full object-cover opacity-40"
          />
        ) : null}

        {/* Calm tinted overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/10 text-white/90 text-xs font-medium border border-white/15">
            <span>Engineering Excellence</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-[1.12]">
            {titleText}
          </h1>

          {subtitleText && (
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              {subtitleText}
            </p>
          )}

          {isLandingHero && (
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 font-medium text-sm hover:bg-slate-100 transition-colors"
              >
                <span>Explore products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center px-5 py-2.5 rounded-xl bg-white/10 text-white font-medium text-sm hover:bg-white/15 border border-white/20 transition-colors"
              >
                Contact our engineers
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Video controls (calm squircle pill in bottom right) */}
      {mediaType === "video" && media && (
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-1.5 rounded-xl bg-slate-900/80 border border-white/15 p-1 backdrop-blur-sm">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause background video" : "Play background video"}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      )}
    </section>
  );
}
