import React from "react";
import { motion } from "framer-motion";

const strategicValues = [
  { id: 1, title: "Advanced Manufacturing", desc: "Establish an efficient and modern manufacturing system using updated technologies, equipment, and engineering practices." },
  { id: 2, title: "Power Factor Correction Expertise", desc: "Develop GAMA as a recognized specialist in the design and manufacturing of reliable and highly effective power factor correction equipment and systems." },
  { id: 3, title: "Power Distribution Equipment", desc: "Expand manufacturing into related electrical power distribution equipment, control systems, panels, and other engineered electrical solutions." },
  { id: 4, title: "Engineering and Innovation", desc: "Build strong electrical engineering, product design, research, testing, and development capabilities to continuously improve GAMA's products." },
  { id: 5, title: "Energy Efficiency", desc: "Manufacture equipment that helps customers reduce electrical losses, improve power quality, increase system efficiency, and use energy more effectively." },
  { id: 6, title: "Quality and Reliability", desc: "Produce safe, durable, reliable, and high-performance electrical equipment that meets applicable national and international engineering and quality standards." },
  { id: 7, title: "Technology Development", desc: "Continuously adopt modern technologies, automation, digital controls, monitoring systems, and intelligent power-management solutions." },
  { id: 8, title: "Skilled Workforce Development", desc: "Develop highly skilled engineers, technicians, production specialists, and future leaders capable of supporting advanced electrical equipment manufacturing." },
  { id: 9, title: "Market Growth", desc: "Build a strong position in the domestic market and progressively expand into regional and international markets." },
  { id: 10, title: "Long-Term Industrial Development", desc: "Build GAMA into a sustainable electrical engineering and manufacturing company capable of developing increasingly sophisticated products and contributing to the growth of the electrical and power infrastructure sector." },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const StrategicValues = () => {
  return (
    <section className="w-full flex justify-center px-6 py-20 bg-white">
      <div className="max-w-6xl w-full">
        
        {/* Underlined Heading - Centered */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-gloock text-black inline-block relative">
            Strategic Values
            <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-black"></span>
          </h2>
        </div>

        {/* Minimalistic Grid Layout */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10"
        >
          {strategicValues.map((item) => (
            <motion.div 
              key={item.id} 
              variants={itemVariants}
              className="flex gap-5 items-start group"
            >
              {/* Subtle Numbering */}
              <span className="text-2xl md:text-3xl font-montserrat font-light text-gray-300 group-hover:text-black transition-colors duration-300 pt-1">
                {item.id.toString().padStart(2, '0')}
              </span>
              
              {/* Content */}
              <div>
                <h3 className="text-lg font-bold font-montserrat text-black mb-2 tracking-wide">
                  {item.title}
                </h3>
                <p className="text-gray-600 font-montserrat leading-relaxed text-sm md:text-base">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default StrategicValues;