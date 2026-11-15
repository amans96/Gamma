import React from "react";
import { companyData } from "../data/companyData";
import { Target, Eye, Sparkles } from "lucide-react";

export default function CompanyCards() {
  const getIcon = (iconName) => {
    switch (iconName) {
      case "mission":
        return <Target className="w-4 h-4 text-foreground" />;
      case "vision":
        return <Eye className="w-4 h-4 text-foreground" />;
      default:
        return <Sparkles className="w-4 h-4 text-foreground" />;
    }
  };

  return (
    <section id="mission" className="w-full py-16 sm:py-24 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-medium text-muted-foreground mb-1.5">
            Enterprise foundation
          </p>
          <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-foreground">
            Our mission, vision, and core purpose
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {companyData.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-border bg-muted/40 p-1.5 flex flex-col"
            >
              {/* Tinted Title Row */}
              <div className="px-4 py-3 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center shrink-0">
                  {getIcon(item.iconName)}
                </div>
                <h3 className="text-sm font-medium text-foreground tracking-tight">
                  {item.title}
                </h3>
              </div>

              {/* Concentric Full-Bleed Card Body */}
              <div className="flex-1 rounded-[calc(0.75rem-4px)] bg-card border border-border/60 p-6">
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
