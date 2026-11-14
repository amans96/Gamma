import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X, ArrowUpRight } from "lucide-react";
import { bottomNav } from "../data/navData";
import { isAuthenticated } from "../utils/auth";
import logo from "../assets/image.png";

export default function Nav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [desktopDropdown, setDesktopDropdown] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);

  // Sync auth state
  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, [location.pathname]);

  // Close menus on route navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
    setDesktopDropdown(null);
  }, [location.pathname]);

  // Click outside and escape key handling
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
        setDesktopDropdown(null);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setDesktopDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const toggleMobileDropdown = (index) => {
    setOpenDropdown((prev) => (prev === index ? null : index));
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const toSentenceCase = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Calm UI: four-sided tint on active, no single-side accent rule or shadow
  const navLinkClasses = ({ isActive }) =>
    `px-3 py-1.5 text-sm font-medium rounded-xl transition-colors ${
      isActive
        ? "text-foreground bg-muted"
        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
    }`;

  return (
    <header
      ref={navRef}
      id="main-nav"
      className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b border-border shadow-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 rounded-xl"
        >
          <div className="w-9 h-9 rounded-xl border border-border bg-muted/60 flex items-center justify-center p-1.5 shrink-0">
            <img
              src={logo}
              alt="Gamma Solutions"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-base font-medium tracking-tight text-foreground">
            Gamma Solutions
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden lg:flex items-center gap-1"
          aria-label="Primary navigation"
        >
          <NavLink to="/" end className={navLinkClasses}>
            Home
          </NavLink>
          <NavLink to="/about" className={navLinkClasses}>
            About
          </NavLink>

          {/* Dropdown menus (Products, Services, Resources) */}
          {bottomNav.map((menu, index) => {
            const isOpen = desktopDropdown === index;
            return (
              <div
                key={menu.title}
                className="relative"
                onMouseEnter={() => setDesktopDropdown(index)}
                onMouseLeave={() => setDesktopDropdown(null)}
              >
                <button
                  type="button"
                  onClick={() =>
                    setDesktopDropdown((prev) => (prev === index ? null : index))
                  }
                  aria-expanded={isOpen}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-xl transition-colors ${
                    isOpen
                      ? "text-foreground bg-muted"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  <span>{menu.title}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Floating Popover (Elevation allowed for floating layers per Calm UI) */}
                {isOpen && (
                  <div className="absolute left-0 top-full pt-1.5 w-60 z-50">
                    <div className="bg-popover border border-border rounded-xl shadow-lg p-1.5">
                      {menu.dropdown.map((item) => (
                        <Link
                          key={item.title}
                          to={item.path}
                          className="block px-3 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                          onClick={() => setDesktopDropdown(null)}
                        >
                          {toSentenceCase(item.title)}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <NavLink to="/projects" className={navLinkClasses}>
            Projects
          </NavLink>
          <NavLink to="/contact" className={navLinkClasses}>
            Contact
          </NavLink>
        </nav>

        {/* Right Actions (Auth / CTA) */}
        <div className="hidden lg:flex items-center gap-2">
          {loggedIn ? (
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-primary-foreground bg-primary rounded-xl hover:opacity-90 transition-opacity"
            >
              <span>Dashboard</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
            </Link>
          ) : (
            <Link
              to="/contact"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-xl hover:opacity-90 transition-opacity"
            >
              Contact us
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="lg:hidden p-2 rounded-xl text-foreground hover:bg-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden border-t border-border bg-background px-4 py-4 space-y-3 max-h-[calc(100vh-4rem)] overflow-y-auto"
        >
          <div className="flex flex-col space-y-1">
            <NavLink
              to="/"
              end
              className={navLinkClasses}
              onClick={closeMobileMenu}
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={navLinkClasses}
              onClick={closeMobileMenu}
            >
              About
            </NavLink>

            {/* Mobile Accordions */}
            {bottomNav.map((menu, index) => {
              const isExpanded = openDropdown === index;
              return (
                <div key={menu.title} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => toggleMobileDropdown(index)}
                    aria-expanded={isExpanded}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-foreground rounded-xl hover:bg-muted transition-colors text-left"
                  >
                    <span>{menu.title}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="pl-3 space-y-1 border-l-2 border-border ml-3 my-1">
                      {menu.dropdown.map((item) => (
                        <Link
                          key={item.title}
                          to={item.path}
                          className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors"
                          onClick={closeMobileMenu}
                        >
                          {toSentenceCase(item.title)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <NavLink
              to="/projects"
              className={navLinkClasses}
              onClick={closeMobileMenu}
            >
              Projects
            </NavLink>
            <NavLink
              to="/contact"
              className={navLinkClasses}
              onClick={closeMobileMenu}
            >
              Contact
            </NavLink>
          </div>

          {/* Mobile CTA / Auth */}
          <div className="pt-3 border-t border-border flex flex-col gap-2">
            {loggedIn ? (
              <Link
                to="/admin/dashboard"
                className="flex items-center justify-center gap-1.5 w-full py-2.5 px-4 text-sm font-medium text-primary-foreground bg-primary rounded-xl hover:opacity-90 transition-opacity"
                onClick={closeMobileMenu}
              >
                <span>Dashboard</span>
                <ArrowUpRight className="w-4 h-4 opacity-70" />
              </Link>
            ) : (
              <Link
                to="/contact"
                className="flex items-center justify-center w-full py-2.5 px-4 text-sm font-medium text-primary-foreground bg-primary rounded-xl hover:opacity-90 transition-opacity"
                onClick={closeMobileMenu}
              >
                Contact us
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Backdrop overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 top-16 bg-black/20 backdrop-blur-[2px] -z-10"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}
    </header>
  );
}
