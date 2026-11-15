import React from "react";

const strategicValues = [
  {
    id: 1,
    title: "Advanced manufacturing",
    desc: "Establish an efficient, modern manufacturing system utilizing precision automated technologies and rigorous engineering practices.",
  },
  {
    id: 2,
    title: "Power factor correction expertise",
    desc: "Develop Gamma as a recognized specialist in the design and production of reliable, high-efficiency power factor correction systems.",
  },
  {
    id: 3,
    title: "Power distribution equipment",
    desc: "Expand manufacturing into medium and low voltage distribution panels, intelligent motor control centers, and customized enclosures.",
  },
  {
    id: 4,
    title: "Engineering and innovation",
    desc: "Build comprehensive electrical simulation, thermal modeling, and prototype testing labs to continuously advance equipment performance.",
  },
  {
    id: 5,
    title: "Energy efficiency & harmonic suppression",
    desc: "Manufacture equipment that helps industrial facilities eliminate reactive power penalties, reduce transmission losses, and protect downstream assets.",
  },
  {
    id: 6,
    title: "Certified quality and safety",
    desc: "Ensure every manufactured unit rigorously conforms to IEC, IEEE, and ISO electrical equipment quality standards.",
  },
  {
    id: 7,
    title: "Digital automation integration",
    desc: "Incorporate intelligent IoT sensors, SCADA telemetry, and automated switchgear monitoring into next-generation power infrastructure.",
  },
  {
    id: 8,
    title: "Workforce technical development",
    desc: "Invest in structured technical training programs for electrical engineers, precision assemblers, and certified testing specialists.",
  },
  {
    id: 9,
    title: "Regional and global deployment",
    desc: "Maintain a dominant presence in local industrial sectors while scaling supply to regional utility projects and multinational operations.",
  },
  {
    id: 10,
    title: "Sustainable industrial stewardship",
    desc: "Build Gamma into a sustainable engineering institution dedicated to clean grid transitions, equipment longevity, and reduced operational emissions.",
  },
];

export default function StrategicValues() {
  return (
    <section className="w-full py-16 sm:py-24 bg-muted/20 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-medium text-muted-foreground mb-1.5">
            Strategic roadmap
          </p>
          <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-foreground">
            Our ten strategic pillars
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
            The fundamental commitments guiding our manufacturing evolution and infrastructure investments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {strategicValues.map((value) => (
            <div
              key={value.id}
              className="rounded-xl border border-border bg-card p-6 flex items-start gap-4"
            >
              <span className="font-mono text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md shrink-0">
                {String(value.id).padStart(2, "0")}
              </span>
              <div className="space-y-1.5">
                <h3 className="text-sm font-medium text-foreground tracking-tight">
                  {value.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {value.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
