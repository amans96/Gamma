import React from "react";

const HeroPage = ({
  pageName,
  media,
  mediaType = "image",
}) => {
  return (
    <section className="relative min-h-screen overflow-hidden">

      {/* Background Media */}
      <div className="absolute inset-0">

        {mediaType === "video" ? (
          <video
            autoPlay
            loop
            muted
            playsInline
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

    </section>
  );
};

export default HeroPage;