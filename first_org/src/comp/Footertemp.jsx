import {
  FaGithub,
  FaLinkedin,
  FaYoutube,
  FaDiscord,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { footerLinks, socialLinks } from "../data/footerData";

const Footer = () => {
  return (
    <footer className="relative bg-[#020617] overflow-hidden text-white">
      {/* Background Text */}
      <div
        className="
          absolute
          inset-0
          flex
          items-center
          justify-center
          pointer-events-none
          select-none
          overflow-hidden
        "
      >
        <h1
          className="
            text-[45px]
            sm:text-[70px]
            md:text-[110px]
            lg:text-[140px]
            font-black
            uppercase
            tracking-wider
            opacity-10
            blur-[2px]
            leading-[0.9]
            flex
            flex-col
            sm:block
            text-center
          "
        >
          <span className="text-white block sm:inline">Gamma</span>
          <span className="text-[#e78c16] block sm:inline sm:ml-2">SOLUTIONS</span>
        </h1>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {/* Company */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-4 sm:mb-5">
              Company
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-slate-400 text-sm sm:text-base">
              {footerLinks.company?.map((item) => (
                <li
                  key={item.title}
                  className="hover:text-white cursor-pointer transition"
                >
                <Link to={item.link} className="hover:text-white transition">
  {item.title}
</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-4 sm:mb-5">
              Products
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-slate-400 text-sm sm:text-base">
              {footerLinks.products?.map((item) => (
                <li
                  key={item.title}
                  className="hover:text-white cursor-pointer transition"
                >
                 <Link to={item.link} className="hover:text-white transition">
  {item.title}
</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-4 sm:mb-5">
              Services
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-slate-400 text-sm sm:text-base">
              {footerLinks.services?.map((item) => (
                <li
                  key={item.title}
                  className="hover:text-white cursor-pointer transition"
                >
               <Link to={item.link} className="hover:text-white transition">
  {item.title}
</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-4 sm:mb-5">
              Support
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-slate-400 text-sm sm:text-base">
              {footerLinks.support?.map((item) => (
                <li
                  key={item.title}
                  className="hover:text-white cursor-pointer transition"
                >
                  <a href={item.link} className="hover:text-white transition">
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-800 my-10 sm:my-12"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-center md:text-left">
            <h2 className="text-1xl sm:text-3xl font-bold">
              Gamma<span className="text-[#e78c16]"> Solutions</span>
            </h2>
            <p className="text-slate-400 mt-2 text-sm sm:text-base">
              Powering the Future
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {socialLinks?.map((social) => {
              let Icon;
              switch (social.name.toLowerCase()) {
                case "linkedin":
                  Icon = FaLinkedin;
                  break;
                case "youtube":
                  Icon = FaYoutube;
                  break;
                case "discord":
                  Icon = FaDiscord;
                  break;
                case "github":
                  Icon = FaGithub;
                  break;
                default:
                  return null;
              }
              return (
                <a
                  key={social.name}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer hover:scale-110 transition text-slate-400 hover:text-white"
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>
        </div>

        <div className="text-center text-slate-500 mt-10 sm:mt-12 text-sm sm:text-base">
          © 2026 Gamma Solutions. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;