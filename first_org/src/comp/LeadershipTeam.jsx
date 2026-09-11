import React, { useState } from "react";
// Replace these with your actual team member image paths
import staff1 from "../assets/pricipal-1.jpg";
import staff2 from "../assets/principal-2.jpg";
import staff3 from "../assets/teach-3.jpg";
import staff4 from "../assets/teach-3.jpg";

const teamMembers = [
  {
    name: "Amanuel Sisay",
    role: "Chief Electrical Engineer",
    desc: "Amanuel leads our power distribution design division, bringing over 15 years of expertise in high-voltage infrastructure and grid modernization.",
    img: staff1,
  },
  {
    name: "Samuel Bekele",
    role: "Head of R&D (Smart Grids)",
    desc: "Samuel spearheads our research into eco-friendly manufacturing and intelligent power-management solutions, continuously driving our technological footprint forward.",
    img: staff2,
  },
  {
    name: "Hana Alemu",
    role: "Director of Quality Assurance",
    desc: "Hana oversees all testing protocols, ensuring that every piece of power factor correction equipment meets rigorous national and international safety standards.",
    img: staff3,
  },
  {
    name: "Natnael Tadesse",
    role: "Operations & Plant Manager",
    desc: "Natnael manages our advanced manufacturing facilities, coordinating production lines to ensure the efficient delivery of durable, high-performance electrical systems.",
    img: staff4,
  },
];

export default function LeadershipTeam() {
  const [activeIndex, setActiveIndex] = useState(null);
  
  // The custom colors you provided
  const colors = ["#2563EB", "#F97316", "#16A34A", "#DC2626"];

  const handleMouseEnter = (index) => {
    // Only trigger hover on devices with a mouse (ignores touchscreens)
    if (window.matchMedia("(hover: hover)").matches) {
      setActiveIndex(index);
    }
  };

  const handleMouseLeave = () => {
    // Only trigger hover leave on devices with a mouse
    if (window.matchMedia("(hover: hover)").matches) {
      setActiveIndex(null);
    }
  };

  const handleClick = (index) => {
    // Toggle functionality for mobile click/tap
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="w-full max-w-5xl mx-auto my-16 md:my-24 px-6 font-montserrat">
      
      {/* HEADING CONTAINER */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-[Georgia] font-semibold text-black  animate-[fadeIn_1s_ease-out_forwards]">
          Our Staff
        </h1>
      </div>

      <div className="flex flex-col gap-2">
        {teamMembers.map((person, index) => {
          // Get the color for the current item
          const activeColor = colors[index % colors.length];
          const isActive = activeIndex === index;

          return (
            <div
              key={index}
              onClick={() => handleClick(index)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              className="flex flex-col md:flex-row items-start md:items-center justify-between py-6 md:py-8 border-b border-gray-200 transition-all duration-300 relative overflow-hidden select-none cursor-pointer group"
            >
              {/* TEXT CONTAINER */}
              <div className="w-full md:w-2/3 z-10">
                <h3
                  style={{ color: isActive ? activeColor : "#111827" }}
                  className={`text-xl sm:text-2xl md:text-3xl font-bold transition-all duration-300 ${
                    isActive ? "md:translate-x-2" : ""
                  }`}
                >
                  {person.name}
                </h3>

                <p className="text-gray-500 font-medium mt-1 md:mt-2 text-sm sm:text-base uppercase tracking-wider">
                  {person.role}
                </p>

                {/* DESCRIPTION - Expands when active */}
                <div
                  className={`grid transition-all duration-500 ease-in-out ${
                    isActive
                      ? "grid-rows-[1fr] opacity-100 mt-4"
                      : "grid-rows-[0fr] opacity-0 mt-0"
                  }`}
                >
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base overflow-hidden">
                    {person.desc}
                  </p>
                </div>
              </div>

              {/* IMAGE CONTAINER - Appears when active */}
              <div className="flex items-center justify-center w-full md:w-auto mt-6 md:mt-0 overflow-hidden pointer-events-none">
                <div
                  style={{ borderColor: isActive ? activeColor : "transparent" }}
                  className={`w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 transition-all duration-700 ease-out ${
                    isActive
                      ? "opacity-100 scale-100 translate-y-0 md:translate-x-0 shadow-lg"
                      : "opacity-0 scale-75 translate-y-8 md:translate-y-0 md:translate-x-16"
                  }`}
                >
                  <img
                    src={person.img}
                    alt={person.name}
                    className="w-full h-full object-cover grayscale transition-all duration-500 hover:grayscale-0"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}