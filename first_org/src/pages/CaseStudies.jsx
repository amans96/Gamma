import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Footertemp from "../comp/Footertemp.jsx";
import card1 from "../assets/card1.jpg";
import card2 from "../assets/card2.jpg";
import card3 from "../assets/card3.jpg";

const caseStudies = [
  {
    id: 1,
    title: "132kV Substation transformer deployment for heavy steel mills",
    client: "Eastern Heavy Industries",
    metric: "99.98% uptime",
    metricLabel: "Operational reliability across 24 months",
    image: card1,
    summary: "Complete engineering supply, oil filtration, and on-load tap changer integration, resolving critical voltage drop issues during arc furnace cycling.",
    deliverables: ["Two 40MVA 132/33kV power transformers", "Digital temperature & winding monitoring telemetry", "Differential protection relay commissioning"],
  },
  {
    id: 2,
    title: "Dynamic power factor correction in continuous chemical manufacturing",
    client: "National Polymers Corporation",
    metric: "+0.21 PF gain",
    metricLabel: "Facility power factor improved from 0.77 to 0.98",
    image: card2,
    summary: "Installation of detuned capacitor banks and active harmonic filters, mitigating high-frequency motor drive resonance and lowering utility bills.",
    deliverables: ["10 MVAR total dynamic compensation", "7% detuned copper-wound reactors", "Centralized automatic power factor controller"],
  },
  {
    id: 3,
    title: "Turnkey electrical substation upgrade for regional textile park",
    client: "Hawassa Industrial Cluster",
    metric: "-35% outage rate",
    metricLabel: "Downtime reduced in first year of service",
    image: card3,
    summary: "Replacement of obsolete oil breakers with modern vacuum switchgear and SF6 insulated ring main units with SCADA remote switching.",
    deliverables: ["Medium voltage vacuum circuit breakers", "Automated reclosers and sectionalizers", "Custom indoor control panels"],
  },
];

export default function CaseStudies() {
  return (
    <div className="w-full bg-background min-h-screen flex flex-col justify-between">
      <main className="w-full py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-2xl mb-12 sm:mb-16">
            <p className="text-xs font-medium text-muted-foreground mb-1.5">
              Verified performance
            </p>
            <h1 className="text-2xl sm:text-4xl font-normal tracking-tight text-foreground">
              Industrial case studies & field results
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
              Documented engineering outcomes demonstrating how Gamma equipment solves grid stability and efficiency challenges.
            </p>
          </div>

          {/* Case Studies List */}
          <div className="space-y-8">
            {caseStudies.map((study) => (
              <div
                key={study.id}
                className="rounded-xl border border-border bg-card p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                {/* Media */}
                <div className="lg:col-span-5">
                  <div className="aspect-[16/10] rounded-lg overflow-hidden bg-muted border border-border">
                    <img
                      src={study.image}
                      alt={study.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      Client: {study.client}
                    </span>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted border border-border text-xs font-mono font-medium text-foreground">
                      <span className="text-emerald-600 font-bold">{study.metric}</span>
                      <span className="text-muted-foreground">• {study.metricLabel}</span>
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-medium text-foreground tracking-tight leading-snug">
                    {study.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {study.summary}
                  </p>

                  <div className="pt-2 border-t border-border/60">
                    <p className="text-xs font-medium text-foreground mb-2">
                      Delivered scope of work:
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                      {study.deliverables.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footertemp />
    </div>
  );
}
