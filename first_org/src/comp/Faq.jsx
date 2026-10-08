import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import faqData from "../data/faqsData.js";

const Faq = () => {
  const [activeId, setActiveId] = useState(null);

  const handleToggle = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <section
      id="faqs"
      className="w-full py-20 text-white bg-gradient-to-b from-transparent via-transparent via-50% to-[#030619]"
    >
      <div className="max-w-4xl mx-auto px-4">

        <h2 className="text-4xl md:text-5xl font-bold text-center text-black mb-4">
          Frequently Asked Questions
        </h2>

        <p className="text-center text-gray-400 mb-12">
          Everything you need to know before starting your coding journey.
        </p>

        <div className="space-y-4">
          {faqData.map((faq) => (
            <div
              key={faq.id}
              className="border border-white/10 bg-[#030619]/80 backdrop-blur-md rounded-xl overflow-hidden shadow-lg"
            >
              <button
                onClick={() => handleToggle(faq.id)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition"
              >
                <span className="font-semibold text-lg">
                  {faq.question}
                </span>

                {activeId === faq.id ? (
                  <ChevronUp size={24} />
                ) : (
                  <ChevronDown size={24} />
                )}
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  activeId === faq.id
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-gray-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Faq;