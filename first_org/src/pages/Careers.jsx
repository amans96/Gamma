import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, MapPin, Clock, ShieldCheck } from "lucide-react";
import Footertemp from "../comp/Footertemp.jsx";

const openRoles = [
  {
    id: 1,
    title: "Senior power transformer design engineer",
    department: "R&D & Engineering",
    location: "Addis Ababa, Ethiopia",
    type: "Full-time",
    description: "Lead electromagnetic and thermal simulation for 33kV–132kV power transformers, core construction, and loss minimization.",
  },
  {
    id: 2,
    title: "High-voltage testing & commissioning specialist",
    department: "Field Operations",
    location: "Addis Ababa & Regional Sites",
    type: "Full-time",
    description: "Conduct dielectric withstand tests, partial discharge diagnostics, and SF6 gas insulation verification at client substations.",
  },
  {
    id: 3,
    title: "Electrical switchgear manufacturing supervisor",
    department: "Manufacturing Operations",
    location: "Industrial Zone Facility",
    type: "Full-time",
    description: "Oversee medium-voltage cubicle assembly, busbar alignment, and automated wiring quality standards across plant production lines.",
  },
];

export default function Careers() {
  return (
    <div className="w-full bg-background min-h-screen flex flex-col justify-between">
      <main className="w-full py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-2xl mb-12 sm:mb-16">
            <p className="text-xs font-medium text-muted-foreground mb-1.5">
              Engineering careers
            </p>
            <h1 className="text-2xl sm:text-4xl font-normal tracking-tight text-foreground">
              Build the future of regional power systems
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
              Join our team of electrical design specialists, field test engineers, and advanced manufacturing technicians.
            </p>
          </div>

          {/* Open Positions List */}
          <div className="space-y-4 mb-16">
            {openRoles.map((role) => (
              <div
                key={role.id}
                className="rounded-xl border border-border bg-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-colors hover:border-foreground/20"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-foreground bg-muted px-2.5 py-0.5 rounded-md">
                      {role.department}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {role.location}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {role.type}
                    </span>
                  </div>

                  <h3 className="text-base font-medium text-foreground tracking-tight">
                    {role.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {role.description}
                  </p>
                </div>

                <div className="shrink-0">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
                  >
                    <span>Apply for position</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Values Callout */}
          <div className="rounded-xl border border-border bg-muted/30 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-foreground tracking-tight">
                Don't see an exact match for your specialty?
              </h3>
              <p className="text-xs text-muted-foreground">
                We continuously review applications for qualified electrical engineers, AutoCAD draughtsmen, and lab technicians.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-card text-xs font-medium text-foreground hover:bg-muted transition-colors shrink-0"
            >
              <span>Submit general CV</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <Footertemp />
    </div>
  );
}
