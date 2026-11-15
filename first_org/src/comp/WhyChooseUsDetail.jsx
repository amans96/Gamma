import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { cardsData, aboutDetails } from "../data/cardsData";
import Footertemp from "./Footertemp";

export default function WhyChooseUsDetail() {
  const { slug } = useParams();

  const card =
    slug === "about"
      ? aboutDetails
      : cardsData.find((item) => item.slug === slug);

  if (!card) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-background">
        <main className="flex items-center justify-center py-20 px-6">
          <div className="text-center max-w-sm">
            <h1 className="text-2xl font-normal text-foreground mb-2">
              Topic not found
            </h1>
            <p className="text-xs text-muted-foreground mb-6">
              The requested feature detail page could not be located.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to home</span>
            </Link>
          </div>
        </main>
        <Footertemp />
      </div>
    );
  }

  const details = card.details || {
    heading: card.title,
    subheading: card.shortDesc,
    description: card.description,
    paragraphs: [card.description],
    features: [],
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background">
      <main className="w-full py-10 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Back button */}
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to overview</span>
            </Link>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider block">
              Operational standard
            </span>
            <h1 className="text-2xl sm:text-4xl font-normal tracking-tight text-foreground">
              {details.heading || card.title}
            </h1>
            {details.subheading && (
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {details.subheading}
              </p>
            )}
          </div>

          {/* Feature Image */}
          {card.image && (
            <div className="aspect-[16/9] w-full rounded-xl overflow-hidden border border-border bg-muted">
              <img
                src={card.image}
                alt={card.imageAlt || card.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Body */}
          <div className="rounded-xl border border-border bg-card p-6 sm:p-10 space-y-6">
            {details.description && (
              <p className="text-sm sm:text-base text-foreground font-normal leading-relaxed">
                {details.description}
              </p>
            )}

            {details.paragraphs && (
              <div className="space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {details.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            )}

            {/* Checklist features */}
            {details.features && details.features.length > 0 && (
              <div className="pt-6 border-t border-border space-y-4">
                <h3 className="text-sm font-medium text-foreground tracking-tight">
                  Key technical standards & guarantees
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {details.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/30 px-3.5 py-2.5 text-xs text-foreground"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footertemp />
    </div>
  );
}
