import React from "react";

export default function ContactHero({ image, title = "Contact our engineers" }) {
  return (
    <section className="relative py-16 sm:py-24 overflow-hidden bg-slate-950 text-white">
      {image && (
        <div className="absolute inset-0">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-medium text-slate-400 mb-2">
          Direct engineering communication
        </p>
        <h1 className="text-3xl sm:text-5xl font-normal tracking-tight text-white mb-3">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
          Request technical proposals, substation feasibility evaluations, or emergency maintenance support.
        </p>
      </div>
    </section>
  );
}
