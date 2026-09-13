import React, { useState } from "react";
import { Mail, Phone, User, Send } from "lucide-react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [focused, setFocused] = useState({
    name: false,
    phone: false,
    email: false,
    message: false,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFocus = (field) => {
    setFocused({
      ...focused,
      [field]: true,
    });
  };

  const handleBlur = (field) => {
    setFocused({
      ...focused,
      [field]: false,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your form submission logic here
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100 font-sans p-4 sm:p-6">
      <form
        className="
          w-full
          max-w-6xl
          bg-white/90
          backdrop-blur-sm
          p-6
          sm:p-10
          md:p-14
          rounded-3xl
          shadow-2xl
          flex
          flex-col
          gap-10
          border
          border-white/20
        "
        onSubmit={handleSubmit}
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Get in Touch
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            We'd love to hear from you. Drop us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Form Content */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Inputs Section */}
          <div className="flex flex-col gap-5 w-full lg:w-1/2">
            {/* Name Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <User size={20} />
              </div>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => handleFocus("name")}
                onBlur={() => handleBlur("name")}
                className={`
                  w-full
                  h-[62px]
                  pl-12
                  pr-6
                  text-base
                  border-2
                  rounded-xl
                  transition-all
                  duration-300
                  bg-gray-50
                  hover:bg-white
                  ${focused.name 
                    ? "border-emerald-500 bg-white shadow-lg shadow-emerald-100" 
                    : "border-gray-200 hover:border-gray-300"
                  }
                  focus:outline-none
                  placeholder:text-gray-400
                `}
                required
              />
            </div>

            {/* Phone Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Phone size={20} />
              </div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                onFocus={() => handleFocus("phone")}
                onBlur={() => handleBlur("phone")}
                className={`
                  w-full
                  h-[62px]
                  pl-12
                  pr-6
                  text-base
                  border-2
                  rounded-xl
                  transition-all
                  duration-300
                  bg-gray-50
                  hover:bg-white
                  ${focused.phone 
                    ? "border-emerald-500 bg-white shadow-lg shadow-emerald-100" 
                    : "border-gray-200 hover:border-gray-300"
                  }
                  focus:outline-none
                  placeholder:text-gray-400
                `}
                required
              />
            </div>

            {/* Email Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={20} />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => handleFocus("email")}
                onBlur={() => handleBlur("email")}
                className={`
                  w-full
                  h-[62px]
                  pl-12
                  pr-6
                  text-base
                  border-2
                  rounded-xl
                  transition-all
                  duration-300
                  bg-gray-50
                  hover:bg-white
                  ${focused.email 
                    ? "border-emerald-500 bg-white shadow-lg shadow-emerald-100" 
                    : "border-gray-200 hover:border-gray-300"
                  }
                  focus:outline-none
                  placeholder:text-gray-400
                `}
                required
              />
            </div>
          </div>

          {/* Message Section */}
          <div className="w-full lg:w-1/2 relative">
            <textarea
              name="message"
              placeholder="Your Message..."
              value={formData.message}
              onChange={handleChange}
              onFocus={() => handleFocus("message")}
              onBlur={() => handleBlur("message")}
              className={`
                w-full
                h-[240px]
                p-6
                pt-7
                text-base
                border-2
                rounded-xl
                resize-none
                transition-all
                duration-300
                bg-gray-50
                hover:bg-white
                ${focused.message 
                  ? "border-emerald-500 bg-white shadow-lg shadow-emerald-100" 
                  : "border-gray-200 hover:border-gray-300"
                }
                focus:outline-none
                placeholder:text-gray-400
                leading-relaxed
              `}
              required
            />
          </div>
        </div>

        {/* Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-400 order-2 sm:order-1">
            We'll never share your information
          </p>
          
          <button
            type="submit"
            className="
              group
              w-full
              sm:w-auto
              px-10
              h-[56px]
              bg-gradient-to-r
              from-emerald-500
              to-emerald-600
              hover:from-emerald-600
              hover:to-emerald-700
              text-white
              text-base
              font-semibold
              rounded-xl
              shadow-lg
              shadow-emerald-200
              transition-all
              duration-300
              hover:shadow-xl
              hover:shadow-emerald-300
              hover:-translate-y-0.5
              active:translate-y-0
              flex
              items-center
              justify-center
              gap-2
              order-1
              sm:order-2
            "
          >
            <span>Send Message</span>
            <Send 
              size={18} 
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;