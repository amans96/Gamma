import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import  card1 from '../assets/card1.jpg';
const AboutHero = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full flex justify-center px-6 py-16">
      <div className="max-w-6xl w-full text-black">
        
        {/* Content Container (Image Left, Text Right on md+ screens) */}
        <div className="flex flex-col md:flex-row items-center gap-12">
          
          {/* Left Side: Image Container */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="w-full md:w-1/2"
          >
            <img 
              src={card1} 
              alt="GAMA Technology Equipment" 
              className="w-full h-auto rounded-2xl shadow-xl object-cover"
            />
          </motion.div>

          {/* Right Side: Heading, Text & Button Container */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="w-full md:w-1/2 flex flex-col items-start text-left"
          >
            {/* Heading - Now directly above the paragraph */}
            <h2 className="text-4xl md:text-5xl tracking-wide font-gloock font-normal mb-4">
              Welcome to GAMA Technology
            </h2>

            {/* Main Text */}
            <p className="text-lg md:text-2xl leading-relaxed font-montserrat mb-8">
              GAMA is building the future of electrical power solutions through
              innovative, reliable, and energy-efficient equipment designed to
              improve modern electrical systems.
            </p>

            {/* See More Button */}
            <button
              onClick={() => navigate("/why-choose-us/about")}
              className="px-8 py-3 rounded-full bg-black text-white font-bold tracking-wide 
              hover:bg-gray-800 hover:scale-105 active:scale-95 
              transition-all duration-300 shadow-md"
            >
              See More
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AboutHero;