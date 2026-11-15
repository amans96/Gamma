import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Zap } from "lucide-react";
import Footertemp from "../comp/Footertemp.jsx";
import card2 from "../assets/card2.jpg";
import card3 from "../assets/card3.jpg";
import card4 from "../assets/card4.jpg";
import card5 from "../assets/card5.jpg";
import card6 from "../assets/card6.jpg";

const projectsData = [
  {
    id: 1,
    title: "50MVA Substation transformer modernization",
    category: "Substations",
    location: "Eastern Industrial Zone",
    capacity: "50 MVA | 132/33 kV",
    image: card2,
    description: "Turnkey supply, commissioning, and SCADA automation of high-voltage step-down transformers delivering reliable power to 40+ heavy manufacturing plants.",
    status: "Operational",
    year: "2025",
  },
  {
    id: 2,
    title: "Industrial cement plant power factor correction",
    category: "Power quality",
    location: "Mugher Industrial Corridor",
    capacity: "12 MVAR dynamic bank",
    image: card3,
    description: "Automated harmonic filtration and capacitor bank installation, increasing facility power factor from 0.78 to 0.98 and eliminating utility peak surcharges.",
    status: "Commissioned",
    year: "2025",
  },
  {
    id: 3,
    title: "Regional utility distribution switchyard",
    category: "Grid integration",
    location: "Addis North Substation",
    capacity: "33 kV / 15 kV feeder",
    image: card4,
    description: "Medium-voltage vacuum circuit breakers and SF6 gas-insulated switchgear deployment for high-density municipal grid distribution.",
    status: "Operational",
    year: "2026",
  },
  {
    id: 4,
    title: "Commercial solar grid tie-in substation",
    category: "Renewable energy",
    location: "Rift Valley Energy Park",
    capacity: "25 MW solar array",
    image: card5,
    description: "Custom step-up transformer units, grid synchronization switchboards, and protection relay integration for clean solar generation.",
    status: "Operational",
    year: "2026",
  },
  {
    id: 5,
    title: "Manufacturing park low-voltage distribution network",
    category: "Industrial panels",
    location: "Bole Lemi Industrial Park",
    capacity: "10,000 kVA distribution",
    image: card6,
    description: "Intelligent motor control centers and compartmentalized power distribution panels with integrated digital metering and thermal trip protection.",
    status: "Commissioned",
    year: "2026",
  },
];

const categories = ["All projects", "Substations", "Power quality", "Grid integration", "Renewable energy", "Industrial panels"];

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState("All projects");

  const filteredProjects = projectsData.filter((p) =>
    selectedCategory === "All projects" ? true : p.category === selectedCategory
  );

  return (
    <div className="w-full bg-background min-h-screen flex flex-col justify-between">
      <main className="w-full py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-medium text-muted-foreground mb-1.5">
              Engineering track record
            </p>
            <h1 className="text-2xl sm:text-4xl font-normal tracking-tight text-foreground">
              Major infrastructure projects
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
              High-voltage electrical installations, grid synchronization projects, and specialized power quality deployments engineered by Gamma.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-border">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-xl border border-border bg-card overflow-hidden flex flex-col justify-between transition-colors hover:border-foreground/20"
              >
                <div>
                  <div className="aspect-[16/10] w-full bg-muted border-b border-border overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {project.capacity}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{project.status}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-medium text-foreground tracking-tight leading-snug">
                      {project.title}
                    </h3>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-border/40 mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{project.location}</span>
                  <span className="font-mono">{project.year}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="mt-16 rounded-xl border border-border bg-muted/30 p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-foreground tracking-tight">
                Planning a substation or power distribution project?
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Consult with our engineering directors for equipment specifications and feasibility studies.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity shrink-0"
            >
              <span>Consult our team</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footertemp />
    </div>
  );
}
