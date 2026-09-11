import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { topNav, bottomNav } from "../data/navData";
import { Link } from "react-router-dom";
import logo from "../assets/image.png";

export default function Nav() {
  const colors = ["#2563EB", "#F97316", "#16A34A", "#DC2626"];

  const [colorIndex, setColorIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colors.length);
    }, 1200);

    return () => clearInterval(timer);
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      const navElement = document.getElementById("main-nav");
      const mobileMenu = document.getElementById("mobile-menu");

      if (isMobileMenuOpen && navElement && mobileMenu) {
        const isClickInsideNav = navElement.contains(e.target);
        const isClickInsideMobileMenu = mobileMenu.contains(e.target);

        if (!isClickInsideNav && !isClickInsideMobileMenu) {
          setIsMobileMenuOpen(false);
          setOpenDropdown(null);
        }
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  return (
    <nav id="main-nav" className="relative z-[100] w-full px-4 sm:px-6 md:px-12 py-4">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-slate-900/95 border-b border-blue-500/30 shadow-lg"></div>

      <div className="relative flex justify-between items-center">
        {/* LEFT - Logo */}
        <div className="flex items-center gap-3 sm:gap-5">
          <div
            className="w-12 h-12 sm:w-16 sm:h-16 p-[4px] rounded-md transition-all duration-700 flex items-center justify-center flex-shrink-0 shadow-lg"
            style={{
              backgroundColor: colors[colorIndex],
            }}
          >
            <div className="w-full h-full bg-white rounded-sm flex items-center justify-center">
              <img
                src={logo}
                alt="Company Logo"
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              />
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-wide text-white drop-shadow-lg">
            Company Name
          </h1>
        </div>

        {/* RIGHT - Desktop Navigation */}
        <div className="hidden lg:flex flex-col items-end gap-3">
          {/* Top Navigation */}
          <div className="flex gap-6 xl:gap-10">
            {topNav.map((item, i) => (
              <Link
                key={item.title}
                to={item.link}
                className="font-semibold transition-colors duration-300 text-white/90 hover:text-white drop-shadow"
                style={{ color: "#ffffff" }}
                onMouseEnter={(e) =>
                  (e.target.style.color = colors[i % colors.length])
                }
                onMouseLeave={(e) =>
                  (e.target.style.color = "#ffffff")
                }
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* Bottom Navigation */}
          <div className="flex gap-6 xl:gap-12">
            {bottomNav.map((menu, index) => (
              <div key={menu.title} className="relative group">
                <button className="flex items-center gap-1 font-semibold text-white/90 hover:text-white drop-shadow whitespace-nowrap transition-colors">
                  {menu.title}
                  <ChevronDown
                    size={18}
                    className="group-hover:rotate-180 transition-transform text-white/70"
                  />
                </button>

                <div className="absolute right-0 pt-2 w-full min-w-[220px] hidden group-hover:block">
                  <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg overflow-hidden border border-white/20">
                    {menu.dropdown.map((item) => (
                      <Link
                        key={item.title}
                        to={item.path}
                        className="block px-5 py-3 hover:bg-blue-50 transition text-gray-800"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hamburger Menu Button - Mobile */}
        <button
          className="lg:hidden p-2 rounded-md hover:bg-white/10 transition text-white relative z-[60]"
          onClick={(e) => {
            e.stopPropagation();
            setIsMobileMenuOpen((prev) => !prev);
          }}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu - Vertical Dropdowns */}
      <div
        id="mobile-menu"
        className={`lg:hidden absolute left-0 right-0 transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "max-h-[calc(100vh-72px)] opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
        style={{
          top: "calc(100% + 4px)",
          overflowY: "auto",
          zIndex: 60,
        }}
      >
        <div className="bg-gradient-to-b from-blue-900/95 to-slate-900/95 backdrop-blur-md shadow-2xl rounded-lg p-4 space-y-4 border border-blue-500/20">
          {/* Top Navigation - Mobile */}
          <div className="flex flex-col gap-1 border-b border-white/10 pb-4">
            {topNav.map((item, i) => (
              <Link
                key={item.title}
                to={item.link}
                className="font-semibold transition-colors duration-300 text-white/90 hover:text-white py-3 px-3 rounded hover:bg-white/10"
                onClick={closeMobileMenu}
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* Bottom Navigation - Mobile with vertical accordion */}
          <div className="flex flex-col gap-1">
            {bottomNav.map((menu, index) => (
              <div key={menu.title} className="border-b border-white/10 pb-2 last:border-0">
                <button
                  className="flex items-center justify-between w-full font-semibold text-white/90 hover:text-white py-3 px-3 rounded hover:bg-white/10 transition"
                  onClick={() => toggleDropdown(index)}
                >
                  <span>{menu.title}</span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform text-white/70 ${
                      openDropdown === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openDropdown === index ? "max-h-[500px]" : "max-h-0"
                  }`}
                >
                  <div className="ml-4 mt-1 space-y-1 flex flex-col">
                    {menu.dropdown.map((item) => (
                      <Link
                        key={item.title}
                        to={item.path}
                        className="text-white/80 hover:text-white py-2.5 px-4 rounded hover:bg-white/10 transition pl-6"
                        onClick={closeMobileMenu}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50"
          style={{ zIndex: 55 }}
          onClick={closeMobileMenu}
        />
      )}
    </nav>
  );
}