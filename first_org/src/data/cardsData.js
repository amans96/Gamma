// data/cardsData.js
import card1 from '../assets/card1.jpg';
import card2 from '../assets/card2.jpg';
import card3 from '../assets/card3.jpg';
import card4 from '../assets/card4.jpg';
import card5 from '../assets/card5.jpg';
import card6 from '../assets/card6.jpg';

export const cardsData = [
  {
    id: 1,
    image: card1,
    imageAlt: "Quality assurance team inspecting electrical equipment in industrial facility",
    icon: "Shield",
    title: "Quality Assurance",
    shortDesc: "Premium Electrical Equipment",
    description: "We ensure every product meets international quality standards with rigorous testing and certification processes. Our commitment to excellence guarantees reliable performance in every application.",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    badge: "ISO Certified",
    link: "/services/quality-assurance"
  },
  {
    id: 2,
    image: card2,
    imageAlt: "Customer support team providing 24/7 technical assistance for electrical systems",
    icon: "Clock",
    title: "24/7 Support",
    shortDesc: "Always Available",
    description: "Our dedicated support team is available around the clock to assist with technical queries, emergency repairs, and maintenance services. We're here when you need us most.",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50",
    badge: "24/7 Service",
    link: "/services/support"
  },
  {
    id: 3,
    image: card3,
    imageAlt: "Electrical engineer with 15 years of experience working on complex power distribution systems",
    icon: "Award",
    title: "Industry Expertise",
    shortDesc: "15+ Years Experience",
    description: "With over a decade of experience in electrical distribution, we bring unparalleled knowledge and expertise to every project. Trust our proven track record of successful deliveries.",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
    badge: "15+ Years",
    link: "/about/experience"
  },
  {
    id: 4,
    image: card4,
    imageAlt: "Global network of manufacturing partners collaborating on electrical solutions",
    icon: "Users",
    title: "Trusted Partners",
    shortDesc: "Global Network",
    description: "We've built strong relationships with leading manufacturers worldwide, ensuring access to the best products and technologies for your specific needs.",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    badge: "50+ Partners",
    link: "/partners"
  },
  {
    id: 5,
    image: card5,
    imageAlt: "Customized electrical solutions being developed for specific industrial requirements",
    icon: "Settings",
    title: "Custom Solutions",
    shortDesc: "Tailored Approach",
    description: "Every project is unique. We work closely with our clients to develop customized electrical solutions that perfectly match their requirements and budget constraints.",
    color: "from-rose-500 to-pink-500",
    bgColor: "bg-rose-50",
    badge: "Tailored Design",
    link: "/services/custom-solutions"
  },
  {
    id: 6,
    image: card6,
    imageAlt: "Innovative electrical technology and sustainable solutions for modern industrial applications",
    icon: "TrendingUp",
    title: "Innovation Focus",
    shortDesc: "Future-Ready",
    description: "We stay ahead of industry trends, incorporating the latest technologies and sustainable practices to deliver forward-thinking electrical solutions.",
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-50",
    badge: "Innovation Leader",
    link: "/innovation"
  }
];