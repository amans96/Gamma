import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import testimonials from "../data/testimonialData.js";

export default function Testimonial() {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const currentItem = testimonials[current];

  return (
    <section className="w-full py-16 sm:py-24 bg-background border-b border-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1.5">
              Client perspectives
            </p>
            <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-foreground">
              What our partners say
            </h2>
          </div>

          {/* Navigation Controls */}
          {testimonials.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground mr-2 font-mono">
                {String(current + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous testimonial"
                className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next testimonial"
                className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Calm Testimonial Card */}
        {currentItem && (
          <div className="rounded-xl border border-border bg-muted/30 p-1.5">
            <div className="rounded-[calc(0.75rem-3px)] bg-card border border-border/80 p-8 sm:p-12 space-y-6">
              <Quote className="w-8 h-8 text-muted-foreground/40 stroke-1" />

              <blockquote className="text-lg sm:text-2xl font-normal tracking-tight text-foreground leading-relaxed">
                "{currentItem.quote}"
              </blockquote>

              <div className="flex items-center gap-3 pt-2">
                {currentItem.image && (
                  <img
                    src={currentItem.image}
                    alt={currentItem.name}
                    className="w-10 h-10 rounded-full object-cover border border-border"
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {currentItem.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Partner & Contributor
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
