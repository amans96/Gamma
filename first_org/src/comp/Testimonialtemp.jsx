import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import testimonials from "../data/testimonialData.js";

const Testimonial = () => {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const getIndex = (offset) => {
    return (
      (current + offset + testimonials.length) % testimonials.length
    );
  };

  const leftCard = testimonials[getIndex(-1)];
  const centerCard = testimonials[current];
  const rightCard = testimonials[getIndex(1)];

  return (
    <section className="w-full py-20 bg-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center text-5xl font-bold text-slate-900 mb-16">
          Testimonial
        </h2>

        <div className="relative flex items-center justify-center px-12 sm:px-16">
          {/* Left Button - Transparent and positioned outside */}
          <button
            onClick={prevSlide}
            className="absolute left-0 z-20 bg-white/80 backdrop-blur-sm shadow-lg rounded-full p-3 hover:bg-white hover:scale-110 transition-all duration-300"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={28} className="text-slate-700" />
          </button>

          <div className="flex items-center justify-center gap-4 md:gap-8">
            {/* Left Card - Hidden on mobile */}
            <div className="hidden md:block relative w-[220px] lg:w-[280px] h-[280px] lg:h-[320px] bg-orange-200 rounded-3xl p-6
                            scale-90 opacity-60 blur-[1px]
                            transition-all duration-500 shadow-lg">
              <p className="text-slate-700 text-base lg:text-lg line-clamp-5">
                "{leftCard.quote}"
              </p>

              <div className="absolute bottom-6 flex items-center gap-3">
                <img
                  src={leftCard.image}
                  alt={leftCard.name}
                  className="w-10 h-10 lg:w-14 lg:h-14 rounded-full object-cover"
                />
                <span className="font-medium text-sm lg:text-base">{leftCard.name}</span>
              </div>
            </div>

            {/* Main Card - Responsive */}
            <div className="relative w-[280px] sm:w-[340px] md:w-[380px] lg:w-[420px] 
                            min-h-[320px] sm:min-h-[340px] lg:min-h-[380px]
                            bg-[#003B7A] text-white
                            rounded-3xl p-6 sm:p-8
                            scale-100 z-10
                            transition-all duration-500
                            shadow-2xl">

              <p className="text-xl sm:text-2xl lg:text-3xl leading-relaxed font-semibold">
                "{centerCard.quote}"
              </p>

              <div className="absolute bottom-6 sm:bottom-8 flex items-center gap-3 sm:gap-4">
                <img
                  src={centerCard.image}
                  alt={centerCard.name}
                  className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full object-cover border-2 border-white"
                />

                <span className="text-xl sm:text-2xl lg:text-3xl font-bold">
                  {centerCard.name}
                </span>
              </div>
            </div>

            {/* Right Card - Hidden on mobile */}
            <div className="hidden md:block relative w-[220px] lg:w-[280px] h-[280px] lg:h-[320px]
                            bg-orange-200 rounded-3xl p-6
                            scale-90 opacity-60 blur-[1px]
                            transition-all duration-500 shadow-lg">
              <p className="text-slate-700 text-base lg:text-lg line-clamp-5">
                "{rightCard.quote}"
              </p>

              <div className="absolute bottom-6 flex items-center gap-3">
                <img
                  src={rightCard.image}
                  alt={rightCard.name}
                  className="w-10 h-10 lg:w-14 lg:h-14 rounded-full object-cover"
                />
                <span className="font-medium text-sm lg:text-base">{rightCard.name}</span>
              </div>
            </div>
          </div>

          {/* Right Button - Transparent and positioned outside */}
          <button
            onClick={nextSlide}
            className="absolute right-0 z-20 bg-white/80 backdrop-blur-sm shadow-lg rounded-full p-3 hover:bg-white hover:scale-110 transition-all duration-300"
            aria-label="Next testimonial"
          >
            <ChevronRight size={28} className="text-slate-700" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition ${
                current === index
                  ? "bg-blue-600 w-8"
                  : "bg-gray-300"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;