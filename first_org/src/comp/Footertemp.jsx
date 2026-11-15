import { Link } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaYoutube,
  FaDiscord,
} from "react-icons/fa";
import { footerLinks, socialLinks } from "../data/footerData";
import logo from "../assets/image.png";

export default function Footer() {
  const getSocialIcon = (name) => {
    switch (name.toLowerCase()) {
      case "linkedin":
        return <FaLinkedin className="w-4 h-4" />;
      case "youtube":
        return <FaYoutube className="w-4 h-4" />;
      case "discord":
        return <FaDiscord className="w-4 h-4" />;
      case "github":
        return <FaGithub className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <footer className="w-full bg-card border-t border-border text-foreground pt-14 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 pb-12">
          {/* Brand Info Column */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl border border-border bg-muted/60 flex items-center justify-center p-1 shrink-0">
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
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
              Engineered electrical infrastructure, high-voltage transformers, and turnkey substation solutions built for continuous industrial uptime.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {socialLinks?.map((social) => (
                <a
                  key={social.name}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {getSocialIcon(social.name)}
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-foreground tracking-tight">
              Company
            </p>
            <ul className="space-y-2">
              {footerLinks.company?.map((item) => (
                <li key={item.title}>
                  <Link
                    to={item.link}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products Links */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-foreground tracking-tight">
              Products
            </p>
            <ul className="space-y-2">
              {footerLinks.products?.map((item) => (
                <li key={item.title}>
                  <Link
                    to={item.link}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services & Support */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-foreground tracking-tight">
              Services
            </p>
            <ul className="space-y-2">
              {footerLinks.services?.map((item) => (
                <li key={item.title}>
                  <Link
                    to={item.link}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Gamma Solutions. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
            <Link to="/login" className="hover:text-foreground transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
