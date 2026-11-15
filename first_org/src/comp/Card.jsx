import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import * as Icons from "lucide-react";
import { cardsData } from "../data/cardsData";

function WhyChooseUsCard({ card }) {
  const IconComponent = Icons[card.icon] || Icons.CheckCircle;

  return (
    <div className="group rounded-xl border border-border bg-muted/40 p-1.5 transition-colors hover:border-foreground/20">
      {/* Titled Card Tinted Header Band */}
      <div className="px-3.5 py-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-card border border-border flex items-center justify-center text-foreground shrink-0">
            <IconComponent className="w-3.5 h-3.5 text-foreground" />
          </div>
          <span className="text-xs font-medium text-foreground tracking-tight">
            {card.title}
          </span>
        </div>
        {card.badge && (
          <span className="text-[11px] font-medium text-muted-foreground bg-card border border-border px-2 py-0.5 rounded-md">
            {card.badge}
          </span>
        )}
      </div>

      {/* Concentric Full-Bleed Inner Body Panel */}
      <div className="rounded-[calc(0.75rem-4px)] bg-card border border-border/60 overflow-hidden flex flex-col justify-between p-5 space-y-4">
        {card.image && (
          <div className="aspect-[16/9] w-full rounded-lg overflow-hidden bg-muted border border-border/40">
            <img
              src={card.image}
              alt={card.imageAlt || card.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
            />
          </div>
        )}

        <div className="space-y-2">
          <h4 className="text-base font-medium text-foreground tracking-tight">
            {card.shortDesc || card.title}
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
            {card.description}
          </p>
        </div>

        <div className="pt-1">
          <Link
            to={`/why-choose-us/${card.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground hover:text-foreground/80 transition-colors"
          >
            <span>Learn more</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function WhyChooseUs() {
  return (
    <section className="w-full py-16 sm:py-24 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <p className="text-xs font-medium text-muted-foreground mb-1.5">
            Operational reliability
          </p>
          <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-foreground mb-3">
            Why industry leaders choose Gamma
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            From precision power transformers to responsive substation support, our engineering practices ensure continuous uptime and certified quality.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardsData.map((card) => (
            <WhyChooseUsCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
