import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { cardsData,aboutDetails  } from "../data/cardsData";
import footertemp from "./Footertemp";
export default function WhyChooseUsDetail() {
const { slug } = useParams();

const card =
  slug === "about"
    ? aboutDetails
    : cardsData.find((item) => item.slug === slug);

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h1>

          <Link
            to="/"
            className="text-blue-600 hover:underline"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">

      <div className="max-w-6xl mx-auto">

        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-8"
        >
          <ArrowLeft size={18} />
          Back
        </Link>


        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

          {/* Image */}
          <img
            src={card.image}
            alt={card.imageAlt || card.title}
            className="w-full h-64 md:h-96 object-cover"
          />


          {/* Content */}
          <div className="p-6 md:p-10">

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              {card.details.heading}
            </h1>


            {/* Subtitle */}
            <p className="text-lg text-gray-500 mb-8">
              {card.details.subheading}
            </p>


            {/* Main Description */}
            <p className="text-gray-700 leading-7 mb-8">
              {card.details.description}
            </p>


            {/* Paragraphs */}
            <div className="space-y-5">

              {card.details.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-gray-600 leading-7"
                >
                  {paragraph}
                </p>
              ))}

            </div>


            {/* Features */}
            <div className="mt-10">

              <h2 className="text-2xl font-bold text-gray-800 mb-5">
                What We Offer
              </h2>

              <div className="grid sm:grid-cols-2 gap-3">

                {card.details.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-gray-50 rounded-lg p-3"
                  >
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                      <Check
                        size={16}
                        className="text-blue-600"
                      />
                    </div>

                    <span className="text-gray-700">
                      {feature}
                    </span>
                  </div>
                ))}

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}