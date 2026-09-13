import React from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const ContactInfo = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        Contact Information
      </h3>
      
      {/* Grid layout - horizontal on desktop, vertical on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Email */}
        <div className="group flex items-start gap-4 p-3 rounded-xl transition-all duration-300 hover:bg-emerald-50 hover:-translate-y-1 hover:shadow-md">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
            <Mail size={22} className="text-emerald-600 transition-colors duration-300 group-hover:text-emerald-700" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium transition-colors duration-300 group-hover:text-emerald-600">Email</p>
            <a 
              href="mailto:info@company.com" 
              className="text-gray-800 hover:text-emerald-600 transition text-sm"
            >
              info@company.com
            </a>
          </div>
        </div>

        {/* Phone */}
        <div className="group flex items-start gap-4 p-3 rounded-xl transition-all duration-300 hover:bg-emerald-50 hover:-translate-y-1 hover:shadow-md">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
            <Phone size={22} className="text-emerald-600 transition-colors duration-300 group-hover:text-emerald-700" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium transition-colors duration-300 group-hover:text-emerald-600">Phone</p>
            <a 
              href="tel:+1234567890" 
              className="text-gray-800 hover:text-emerald-600 transition text-sm"
            >
              +1 (234) 567-890
            </a>
          </div>
        </div>

        {/* Address */}
        <div className="group flex items-start gap-4 p-3 rounded-xl transition-all duration-300 hover:bg-emerald-50 hover:-translate-y-1 hover:shadow-md">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
            <MapPin size={22} className="text-emerald-600 transition-colors duration-300 group-hover:text-emerald-700" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium transition-colors duration-300 group-hover:text-emerald-600">Address</p>
            <p className="text-gray-800 text-sm transition-colors duration-300 group-hover:text-emerald-700">
              123 Main Street, Suite 100
              <br />
              New York, NY 10001
            </p>
          </div>
        </div>

        {/* Working Hours */}
        <div className="group flex items-start gap-4 p-3 rounded-xl transition-all duration-300 hover:bg-emerald-50 hover:-translate-y-1 hover:shadow-md">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
            <Clock size={22} className="text-emerald-600 transition-colors duration-300 group-hover:text-emerald-700" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium transition-colors duration-300 group-hover:text-emerald-600">Hours</p>
            <p className="text-gray-800 text-sm transition-colors duration-300 group-hover:text-emerald-700">
              Mon - Fri: 9AM - 6PM
              <br />
              Sat: 10AM - 4PM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;