import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { cardsData } from '../data/cardsData';


function Card({ card, delay }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  
  // Dynamically get the icon component
  const IconComponent = Icons[card.icon];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          observer.unobserve(cardRef.current);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className={`
        relative overflow-hidden rounded-2xl transition-all duration-700
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}
        hover:shadow-2xl hover:-translate-y-2
      `}
      style={{
        transitionDelay: `${delay}ms`,
        transitionProperty: 'all',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        aspectRatio: '4/3',
        minHeight: '300px',
        backgroundColor: 'white'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image - Fades out on hover */}
      <div 
        className={`
          absolute inset-0 transition-all duration-700 ease-in-out
          ${isHovered ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}
        `}
      >
        <img 
          src={card.image} 
          alt={card.title}
          className="w-full h-full object-cover"
        />
        {/* Dark overlay on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
      </div>

      {/* Default Content - Visible when not hovered */}
      <div className={`
        absolute inset-0 flex flex-col justify-end p-6 transition-all duration-700
        ${isHovered ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
      `}>
        <div className="text-white">
          <h3 className="text-xl font-bold mb-2">{card.title}</h3>
          <p className="text-sm text-white/80">{card.shortDesc}</p>
        </div>
      </div>

      {/* Hover Content - Visible when hovered */}
      <div className={`
        absolute inset-0 flex flex-col justify-center items-center p-6 transition-all duration-700
        ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
      `}>
        {/* Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${card.color}`}></div>
        
        {/* Content */}
        <div className="relative z-10 text-center text-white">
          {/* Icon */}
          <div className="mb-4 inline-block p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
            {IconComponent && (
              <IconComponent 
                size={40} 
                className="text-white"
              />
            )}
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold mb-3">{card.title}</h3>
          
          {/* Description */}
          <p className="text-sm text-white/90 leading-relaxed mb-4 max-w-xs mx-auto">
            {card.description}
          </p>

          {/* See More Button */}
          <button className="group inline-flex items-center gap-2 px-6 py-2.5 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold transition-all hover:bg-white/30 hover:gap-3">
            <span>See More</span>
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WhyChooseUs() {
  const getDelay = (index) => {
    if (index < 3) return index * 150;
    return index * 150;
  };

  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-gray-50 to-white">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Why Choose <span className="bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent">Us</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover what sets us apart and why industry leaders trust us for their electrical needs
        </p>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {cardsData.map((card, index) => (
            <Card 
              key={card.id}
              card={card}
              delay={getDelay(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}