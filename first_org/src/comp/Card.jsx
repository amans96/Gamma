
import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import * as Icons from "lucide-react";
import { Link } from "react-router-dom";
import { cardsData } from "../data/cardsData";

function Card({ card, delay }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const IconComponent = Icons[card.icon];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const timer = setTimeout(() => {
            setIsVisible(true);
          }, delay);

          observer.unobserve(cardRef.current);

          return () => clearTimeout(timer);
        }
      },
      {
        threshold: 0.15,
        rootMargin: "50px",
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className={`
        group relative
        transition-all duration-700 ease-out
        ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-12"
        }
      `}
      style={{
        transitionDelay: `${delay}ms`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Soft glow */}
      <div
        className={`
          absolute -inset-1 rounded-3xl
          bg-gradient-to-r ${card.color}
          blur-xl
          transition-all duration-700
          ${
            isHovered
              ? "opacity-30 scale-105"
              : "opacity-0 scale-95"
          }
        `}
      />

      {/* Card */}
      <div
        className="
          relative
          overflow-hidden
          rounded-3xl
          bg-gray-900
          aspect-[4/3]
          min-h-[300px]
          shadow-lg
          transition-all duration-500
          group-hover:-translate-y-2
          group-hover:shadow-2xl
        "
      >
        {/* =========================
            BACKGROUND IMAGE
        ========================== */}
        <div
          className={`
            absolute inset-0
            transition-all duration-700 ease-out
            ${
              isHovered
                ? "scale-110"
                : "scale-100"
            }
          `}
        >
          <img
            src={card.image}
            alt={card.imageAlt || card.title}
            className="
              w-full h-full
              object-cover
              transition-transform duration-1000
            "
          />
        </div>

        {/* Dark cinematic overlay */}
        <div
          className={`
            absolute inset-0
            bg-gradient-to-t
            from-black/85
            via-black/25
            to-black/5
            transition-all duration-700
            ${
              isHovered
                ? "opacity-40"
                : "opacity-100"
            }
          `}
        />

        {/* Hover color atmosphere */}
        <div
          className={`
            absolute inset-0
            bg-gradient-to-br ${card.color}
            transition-all duration-700
            ${
              isHovered
                ? "opacity-90"
                : "opacity-0"
            }
          `}
        />

        {/* Subtle shine */}
        <div
          className={`
            absolute inset-0
            bg-gradient-to-r
            from-transparent
            via-white/10
            to-transparent
            -translate-x-full
            transition-transform duration-1000
            ${
              isHovered
                ? "translate-x-full"
                : ""
            }
          `}
        />

        {/* =========================
            DEFAULT CONTENT
        ========================== */}
        <div
          className={`
            absolute inset-0
            flex flex-col justify-end
            p-6 md:p-7
            transition-all duration-500
            ${
              isHovered
                ? "opacity-0 translate-y-4"
                : "opacity-100 translate-y-0"
            }
          `}
        >
          <div className="relative z-10">
            {/* Small label */}
            <div className="flex items-center gap-2 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />

              <span className="text-xs uppercase tracking-[0.2em] font-medium text-white/70">
                Why us
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {card.title}
            </h3>

            <p className="text-sm md:text-base text-white/75 max-w-md">
              {card.shortDesc}
            </p>

            {/* Explore hint */}
            <div className="mt-5 flex items-center gap-2 text-sm font-medium text-white/80">
          
          

              <ArrowRight
                size={16}
                className="
                  transition-transform duration-300
                  group-hover:translate-x-1
                "
              />
            </div>
          </div>
        </div>

        {/* =========================
            HOVER CONTENT
        ========================== */}
        <div
          className={`
            absolute inset-0
            flex items-center justify-center
            p-6 md:p-8
            transition-all duration-500
            ${
              isHovered
                ? "opacity-100 scale-100"
                : "opacity-0 scale-90"
            }
          `}
        >
          <div className="relative z-10 text-center text-white max-w-sm">
            {/* Icon */}
            <div
              className="
                inline-flex
                items-center
                justify-center
                w-16 h-16
                mb-5
                rounded-2xl
                bg-white/15
                border border-white/20
                backdrop-blur-xl
                shadow-xl
              "
            >
              {IconComponent && (
                <IconComponent
                  size={32}
                  strokeWidth={1.8}
                  className="text-white"
                />
              )}
            </div>

            {/* Title */}
            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              {card.title}
            </h3>

            {/* Description */}
            <p className="text-sm md:text-base text-white/85 leading-relaxed mb-6">
              {card.description}
            </p>

            {/* CTA */}
            <Link
              to={`/why-choose-us/${card.slug}`}
              className="
                group/button
                inline-flex
                items-center
                gap-2
                px-5
                py-3
                rounded-full
                bg-white
                text-gray-900
                text-sm
                font-semibold
                shadow-lg
                transition-all
                duration-300
                hover:gap-3
                hover:scale-105
              "
            >
              <span>See More</span>

              <ArrowRight
                size={17}
                className="
                  transition-transform
                  duration-300
                  group-hover/button:translate-x-1
                "
              />
            </Link>
          </div>
        </div>

        {/* Top-right decorative icon */}
        <div
          className={`
            absolute top-5 right-5
            transition-all duration-500
            ${
              isHovered
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 rotate-45 scale-75"
            }
          `}
        >
          <Sparkles
            size={20}
            className="text-white/80"
          />
        </div>
      </div>
    </div>
  );
}

export default function WhyChooseUs() {
  const getDelay = (index) => index * 120;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50 py-20 md:py-28 px-4 md:px-8 lg:px-16">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-blue-100/30 blur-3xl" />
      </div>

      {/* =========================
          SECTION HEADER
      ========================== */}
      <div className="relative z-10 max-w-7xl mx-auto mb-14 md:mb-16 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm">
          <Sparkles
            size={15}
            className="text-orange-500"
          />

          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-600">
            What makes us different
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-5">
          Why Choose{" "}
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">
            Us
          </span>
        </h2>

        {/* Description */}
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Discover what sets us apart and why industry leaders
          trust us for their electrical needs.
        </p>
      </div>

      {/* =========================
          CARDS
      ========================== */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
          {cardsData.map((card, index) => (
            <Card
              key={card.id}
              card={card}
              delay={getDelay(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

