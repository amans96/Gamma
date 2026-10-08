
import React from "react";
import { companyData } from "../data/companyData";
import logo from "../assets/image.png";

// Helper component to render the correct SVG based on the iconName
const CardIcon = ({ name }) => {
  const baseClasses = "w-7 h-7 text-white";

  switch (name) {
    case "mission":
      return (
        <svg
          className={baseClasses}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      );

    case "vision":
      return (
        <svg
          className={baseClasses}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      );

    case "strategy":
      return (
        <svg
          className={baseClasses}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7l6-2.5 5.447 2.724A1 1 0 0121 8.118v10.764a1 1 0 01-1.447.894L15 17l-6 2.5z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 7v13M15 4v13"
          />
        </svg>
      );

    default:
      return null;
  }
};

const CompanyCards = () => {
  return (
    <section
      id="mission"
      className="scroll-mt-24 w-full flex justify-center bg-gray-50 px-6 py-20"
    >
      <div className="max-w-6xl w-full grid grid-cols-1 gap-8 md:grid-cols-3">

        {companyData.map((card) => (
          <div
            key={card.id}
            className="
              group
              relative
              cursor-pointer
              overflow-hidden
              rounded-2xl
              border
              border-gray-100
              bg-white
              p-8
              shadow-sm
              transition-all
              duration-500
              hover:shadow-2xl
            "
          >
            {/* Background Hover Effect */}
            <div
              className="
                absolute
                inset-0
                z-0
                bg-gradient-to-br
                from-transparent
                to-gray-100
                opacity-0
                transition-opacity
                duration-500
                group-hover:opacity-100
              "
            />

            {/* GAMA Logo */}
            <div
              className="
                absolute
                right-8
                top-8
                z-10
                -translate-x-12
                transform
                opacity-0
                transition-all
                duration-700
                ease-out
                delay-75
                group-hover:translate-x-0
                group-hover:opacity-100
              "
            >
              <img
                src={logo}
                alt="GAMA Logo"
                className="h-12 w-12 object-contain"
              />
            </div>

            <div className="relative z-10 flex h-full flex-col">

              {/* Icon */}
              <div
                className="
                  mb-6
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-xl
                  bg-black
                  shadow-md
                  transition-all
                  duration-500
                  group-hover:-translate-x-2
                  group-hover:scale-95
                "
              >
                <CardIcon name={card.iconName} />
              </div>

              {/* Text */}
              <div className="transform transition-all duration-500 group-hover:translate-x-2">
                <h3 className="mb-4 font-gloock text-2xl font-bold tracking-wide text-black">
                  {card.title}
                </h3>

                <p className="font-montserrat leading-relaxed text-gray-600">
                  {card.description}
                </p>
              </div>

            </div>
          </div>
        ))}

      </div>
    </section>
  );
};

export default CompanyCards;

