import { useState } from "react";
import { ChevronDown } from "lucide-react";
import faqData from "../data/faqsData.js";

export default function Faq() {
  const [activeId, setActiveId] = useState(null);

  const handleToggle = (id) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faqs" className="w-full py-16 sm:py-24 bg-background border-b border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="text-xs font-medium text-muted-foreground mb-1.5">
            Knowledge base
          </p>
          <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-foreground mb-3">
            Frequently asked questions
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Essential information regarding equipment specifications, testing procedures, and deployment support.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {faqData.map((faq) => {
            const isOpen = activeId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-xl border border-border bg-card overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => handleToggle(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-medium text-foreground hover:bg-muted/40 transition-colors gap-4"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
