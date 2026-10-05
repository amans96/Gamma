
import React from "react";
import { motion } from "framer-motion";

const strategicValues = [
  {
    id: 1,
    title: "Advanced Manufacturing",
    desc: "Establish an efficient and modern manufacturing system using updated technologies, equipment, and engineering practices.",
  },
  {
    id: 2,
    title: "Power Factor Correction Expertise",
    desc: "Develop GAMA as a recognized specialist in the design and manufacturing of reliable and highly effective power factor correction equipment and systems.",
  },
  {
    id: 3,
    title: "Power Distribution Equipment",
    desc: "Expand manufacturing into related electrical power distribution equipment, control systems, panels, and other engineered electrical solutions.",
  },
  {
    id: 4,
    title: "Engineering and Innovation",
    desc: "Build strong electrical engineering, product design, research, testing, and development capabilities to continuously improve GAMA's products.",
  },
  {
    id: 5,
    title: "Energy Efficiency",
    desc: "Manufacture equipment that helps customers reduce electrical losses, improve power quality, increase system efficiency, and use energy more effectively.",
  },
  {
    id: 6,
    title: "Quality and Reliability",
    desc: "Produce safe, durable, reliable, and high-performance electrical equipment that meets applicable national and international engineering and quality standards.",
  },
  {
    id: 7,
    title: "Technology Development",
    desc: "Continuously adopt modern technologies, automation, digital controls, monitoring systems, and intelligent power-management solutions.",
  },
  {
    id: 8,
    title: "Skilled Workforce Development",
    desc: "Develop highly skilled engineers, technicians, production specialists, and future leaders capable of supporting advanced electrical equipment manufacturing.",
  },
  {
    id: 9,
    title: "Market Growth",
    desc: "Build a strong position in the domestic market and progressively expand into regional and international markets.",
  },
  {
    id: 10,
    title: "Long-Term Industrial Development",
    desc: "Build GAMA into a sustainable electrical engineering and manufacturing company capable of developing increasingly sophisticated products and contributing to the growth of the electrical and power infrastructure sector.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

const StrategicValues = () => {
  return (
    <section className="w-full bg-white px-6 py-24 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">

        {/* Section heading */}
        <div className="mb-16 max-w-2xl">
          <p className="mb-4 font-montserrat text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
            Our Direction
          </p>

          <h2 className="font-gloock text-4xl leading-tight text-black md:text-5xl">
            Strategic Values
          </h2>

          <div className="mt-6 h-px w-16 bg-black" />
        </div>

        {/* Values */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="border-t border-gray-200"
        >
          {strategicValues.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="group border-b border-gray-200 py-8 md:py-10"
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-[80px_280px_1fr] md:gap-8 lg:grid-cols-[90px_320px_1fr]">

                {/* Number */}
                <div>
                  <span className="font-montserrat text-sm tracking-wide text-gray-400 transition-colors duration-300 group-hover:text-black">
                    {String(item.id).padStart(2, "0")}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h3 className="font-montserrat text-lg font-semibold leading-snug text-black md:text-xl">
                    {item.title}
                  </h3>
                </div>

                {/* Description */}
                <div className="max-w-2xl">
                  <p className="font-montserrat text-sm leading-7 text-gray-600 md:text-base">
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default StrategicValues;

