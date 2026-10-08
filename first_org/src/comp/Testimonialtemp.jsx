
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
    <section className="w-full overflow-hidden bg-slate-50 py-16 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">

        {/* ================= HEADER ================= */}
        <div className="mb-10 text-center sm:mb-12 md:mb-14">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 sm:text-sm sm:tracking-wider">
            Testimonials
          </p>

          <h2 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl md:text-5xl">
            What Our Clients Say
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base md:text-lg">
            See what our clients have to say about their
            experience working with us.
          </p>
        </div>

        {/* ================= TESTIMONIAL AREA ================= */}
        <div className="relative flex items-center justify-center">

          {/* ================= PREVIOUS BUTTON ================= */}
          <button
            type="button"
            onClick={prevSlide}
            className="
              absolute
              left-0
              top-1/2
              z-20
              flex
              h-9
              w-9
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-slate-200
              bg-white
              shadow-sm
              transition-all
              duration-300
              hover:bg-slate-50
              hover:shadow-md
              sm:h-11
              sm:w-11
              md:h-12
              md:w-12
            "
            aria-label="Previous testimonial"
          >
            <ChevronLeft
              size={20}
              className="text-slate-700 sm:size-[22px]"
            />
          </button>

          {/* ================= CARDS ================= */}
          <div
            className="
              flex
              w-full
              items-center
              justify-center
              px-11
              sm:px-14
              md:gap-7
              md:px-16
            "
          >

            {/* ================= LEFT CARD ================= */}
            <div
              className="
                hidden
                h-[280px]
                w-[240px]
                shrink-0
                rounded-2xl
                border
                border-slate-200
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
                  className="
                    h-10
                    w-10
                    shrink-0
                    rounded-full
                    object-cover
                  "
                />

                <span className="truncate text-sm font-semibold text-slate-800">
                  {leftCard.name}
                </span>
              </div>
            </div>

            {/* ================= CENTER CARD ================= */}
            <div
              className="
                relative
                w-full
                max-w-[480px]
                rounded-2xl
                bg-[#003B7A]
                px-6
                py-7
                text-white
                shadow-xl
                transition-all
                duration-300
                sm:px-8
                sm:py-9
                md:min-h-[360px]
                md:px-10
                md:py-10
              "
            >
              {/* Quote Icon */}
              <Quote
                size={36}
                className="mb-4 text-white/25 sm:mb-5 sm:size-[42px]"
              />

              {/* Stars */}
              <div className="mb-5 flex gap-1 sm:mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={15}
                    className="
                      fill-orange-400
                      text-orange-400
                      sm:size-[16px]
                    "
                  />
                ))}
              </div>

              {/* ================= QUOTE ================= */}
              <div
                className="
                  min-h-[170px]
                  sm:min-h-[190px]
                  md:min-h-0
                "
              >
                <p
                  className="
                    text-base
                    font-medium
                    leading-7
                    sm:text-lg
                    sm:leading-8
                    md:text-2xl
                    md:leading-relaxed
                  "
                >
                  "{centerCard.quote}"
                </p>
              </div>

              {/* ================= PERSON ================= */}
              <div
                className="
                  mt-10
                  flex
                  items-center
                  gap-3
                  border-t
                  border-white/10
                  pt-6
                  sm:mt-12
                  sm:pt-7
                  md:absolute
                  md:bottom-9
                  md:left-10
                  md:right-10
                  md:mt-0
                  md:border-0
                  md:pt-0
                "
              >
                <img
                  src={centerCard.image}
                  alt={centerCard.name}
                  className="
                    h-11
                    w-11
                    shrink-0
                    rounded-full
                    border-2
                    border-white/50
                    object-cover
                    sm:h-12
                    sm:w-12
                  "
                />

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold sm:text-base">
                    {centerCard.name}
                  </p>

                  <p className="text-xs text-white/60 sm:text-sm">
                    Client
                  </p>
                </div>
              </div>
            </div>

            {/* ================= RIGHT CARD ================= */}
            <div
              className="
                hidden
                h-[280px]
                w-[240px]
                shrink-0
                rounded-2xl
                border
                border-slate-200
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
                  className="
                    h-10
                    w-10
                    shrink-0
                    rounded-full
                    object-cover
                  "
                />

                <span className="truncate text-sm font-semibold text-slate-800">
                  {rightCard.name}
                </span>
              </div>
            </div>
          </div>

          {/* ================= NEXT BUTTON ================= */}
          <button
            type="button"
            onClick={nextSlide}
            className="
              absolute
              right-0
              top-1/2
              z-20
              flex
              h-9
              w-9
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-slate-200
              bg-white
              shadow-sm
              transition-all
              duration-300
              hover:bg-slate-50
              hover:shadow-md
              sm:h-11
              sm:w-11
              md:h-12
              md:w-12
            "
            aria-label="Next testimonial"
          >
            <ChevronRight
              size={20}
              className="text-slate-700 sm:size-[22px]"
            />
          </button>
        </div>

        {/* ================= DOTS ================= */}
        <div className="mt-8 flex justify-center gap-2 sm:mt-10">
          {testimonials.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrent(index)}
              className={`
                h-1.5
                rounded-full
                transition-all
                duration-300
                sm:h-2
                ${
                  current === index
                    ? "w-6 bg-blue-600 sm:w-7"
                    : "w-1.5 bg-slate-300 hover:bg-slate-400 sm:w-2"
                }
              `}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;


