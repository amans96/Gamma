
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Quote,
  Star,
} from "lucide-react";
import testimonials from "../data/testimonialData.js";

const Testimonial = () => {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent(
      (prev) =>
        (prev - 1 + testimonials.length) %
        testimonials.length
    );
  };

  const nextSlide = () => {
    setCurrent(
      (prev) => (prev + 1) % testimonials.length
    );
  };

  const getIndex = (offset) => {
    return (
      (current + offset + testimonials.length) %
      testimonials.length
    );
  };

  const leftCard = testimonials[getIndex(-1)];
  const centerCard = testimonials[current];
  const rightCard = testimonials[getIndex(1)];

  return (
    <section className="w-full bg-slate-50 py-20 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Header */}
        <div className="mb-12 text-center md:mb-14">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Testimonials
          </p>

          <h2 className="text-4xl font-bold text-slate-900 md:text-5xl">
            What Our Clients Say
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 md:text-lg">
            See what our clients have to say about their
            experience working with us.
          </p>
        </div>

        {/* Testimonials */}
        <div className="relative flex items-center justify-center">
          {/* Previous */}
          <button
            onClick={prevSlide}
            className="
              absolute left-0 z-20
              flex h-11 w-11 items-center justify-center
              rounded-full
              border border-slate-200
              bg-white
              shadow-sm
              transition
              hover:bg-slate-50
              hover:shadow-md
              md:h-12 md:w-12
            "
            aria-label="Previous testimonial"
          >
            <ChevronLeft
              size={22}
              className="text-slate-700"
            />
          </button>

          <div className="flex items-center justify-center gap-5 px-10 md:gap-7 md:px-16">
            {/* Left */}
            <div
              className="
                hidden
                h-[280px]
                w-[240px]
                rounded-2xl
                border border-slate-200
                bg-white
                p-6
                opacity-70
                shadow-sm
                transition-all
                duration-300
                md:block
                lg:w-[270px]
              "
            >
              <Quote
                size={24}
                className="mb-4 text-blue-200"
              />

              <p className="line-clamp-5 text-sm leading-relaxed text-slate-600 lg:text-base">
                "{leftCard.quote}"
              </p>

              <div className="mt-6 flex items-center gap-3">
                <img
                  src={leftCard.image}
                  alt={leftCard.name}
                  className="h-10 w-10 rounded-full object-cover"
                />

                <span className="text-sm font-semibold text-slate-800">
                  {leftCard.name}
                </span>
              </div>
            </div>

            {/* Center */}
            <div
              className="
                relative
                min-h-[330px]
                w-full
                max-w-[480px]
                rounded-2xl
                bg-[#003B7A]
                p-7
                text-white
                shadow-xl
                transition-all
                duration-300
                sm:p-9
                md:min-h-[360px]
                md:p-10
              "
            >
              {/* Quote icon */}
              <Quote
                size={42}
                className="mb-5 text-white/30"
              />

              {/* Stars */}
              <div className="mb-5 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className="fill-orange-400 text-orange-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-xl font-medium leading-relaxed sm:text-2xl">
                "{centerCard.quote}"
              </p>

              {/* Person */}
              <div className="absolute bottom-7 left-7 flex items-center gap-3 sm:bottom-9 sm:left-9">
                <img
                  src={centerCard.image}
                  alt={centerCard.name}
                  className="
                    h-12
                    w-12
                    rounded-full
                    border-2
                    border-white/50
                    object-cover
                  "
                />

                <div>
                  <p className="font-semibold">
                    {centerCard.name}
                  </p>

                  <p className="text-sm text-white/60">
                    Client
                  </p>
                </div>
              </div>
            </div>

            {/* Right */}
            <div
              className="
                hidden
                h-[280px]
                w-[240px]
                rounded-2xl
                border border-slate-200
                bg-white
                p-6
                opacity-70
                shadow-sm
                transition-all
                duration-300
                md:block
                lg:w-[270px]
              "
            >
              <Quote
                size={24}
                className="mb-4 text-blue-200"
              />

              <p className="line-clamp-5 text-sm leading-relaxed text-slate-600 lg:text-base">
                "{rightCard.quote}"
              </p>

              <div className="mt-6 flex items-center gap-3">
                <img
                  src={rightCard.image}
                  alt={rightCard.name}
                  className="h-10 w-10 rounded-full object-cover"
                />

                <span className="text-sm font-semibold text-slate-800">
                  {rightCard.name}
                </span>
              </div>
            </div>
          </div>

          {/* Next */}
          <button
            onClick={nextSlide}
            className="
              absolute right-0 z-20
              flex h-11 w-11 items-center justify-center
              rounded-full
              border border-slate-200
              bg-white
              shadow-sm
              transition
              hover:bg-slate-50
              hover:shadow-md
              md:h-12 md:w-12
            "
            aria-label="Next testimonial"
          >
            <ChevronRight
              size={22}
              className="text-slate-700"
            />
          </button>
        </div>

        {/* Dots */}
        <div className="mt-10 flex justify-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`
                h-2
                rounded-full
                transition-all
                duration-300
                ${
                  current === index
                    ? "w-7 bg-blue-600"
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }
              `}
              aria-label={`Go to testimonial ${
                index + 1
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;

