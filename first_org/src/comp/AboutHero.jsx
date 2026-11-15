import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import card1 from "../assets/card1.jpg";

export default function AboutHero() {
  return (
    <section className="w-full py-16 sm:py-24 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Image Column */}
          <div className="lg:col-span-6">
            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-border bg-muted">
              <img
                src={card1}
                alt="Gamma industrial facility"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Copy Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-muted text-foreground text-xs font-medium border border-border">
              <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />
              <span>About our enterprise</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-normal tracking-tight text-foreground leading-[1.2]">
              Pioneering advanced electrical equipment and industrial power systems.
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Gamma Solutions designs, manufactures, and integrates modern electrical power distribution equipment. From specialized power factor correction systems to turnkey substation panels, our engineering focus ensures safety, efficiency, and continuous industrial uptime.
            </p>

            <div className="pt-2">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <span>Partner with our team</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
