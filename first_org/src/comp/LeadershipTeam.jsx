import React from "react";
import staff1 from "../assets/pricipal-1.jpg";
import staff2 from "../assets/principal-2.jpg";
import staff3 from "../assets/teach-3.jpg";
import staff4 from "../assets/teach-3.jpg";

const teamMembers = [
  {
    name: "Amanuel Sisay",
    role: "Chief electrical engineer",
    desc: "Leads our power distribution design division with over 15 years of expertise in high-voltage infrastructure and grid modernization.",
    img: staff1,
  },
  {
    name: "Samuel Bekele",
    role: "Head of R&D (Smart grids)",
    desc: "Spearheads research into eco-friendly manufacturing and intelligent power management solutions.",
    img: staff2,
  },
  {
    name: "Hana Alemu",
    role: "Director of quality assurance",
    desc: "Oversees testing protocols ensuring every piece of power factor equipment meets rigorous international safety standards.",
    img: staff3,
  },
  {
    name: "Natnael Tadesse",
    role: "Operations & plant manager",
    desc: "Coordinates production lines to ensure efficient delivery of durable, high-performance electrical systems.",
    img: staff4,
  },
];

export default function LeadershipTeam() {
  return (
    <section id="team" className="w-full py-16 sm:py-24 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12 sm:mb-16">
          <p className="text-xs font-medium text-muted-foreground mb-1.5">
            Engineering governance
          </p>
          <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-foreground">
            Leadership & engineering directors
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
            Decades of combined industrial experience guiding electrical innovation and manufacturing integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="rounded-xl border border-border bg-card p-4 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted border border-border">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-base font-medium text-foreground tracking-tight">
                    {member.name}
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">
                    {member.role}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {member.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
