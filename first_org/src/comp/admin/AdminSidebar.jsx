import { NavLink, useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Wrench,
  FileText,
  Handshake,
  LogOut,
  ExternalLink,
  X,
} from "lucide-react";
import { logout } from "../../utils/auth";
import logo from "../../assets/image.png";

export default function AdminSidebar({ isMobileOpen, onCloseMobile }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: Package,
    },
    {
      name: "Services",
      path: "/admin/services",
      icon: Wrench,
    },
    {
      name: "Blog posts",
      path: "/admin/blog",
      icon: FileText,
    },
    {
      name: "Partners",
      path: "/admin/partners",
      icon: Handshake,
    },
  ];

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-card border-r border-border flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div>
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-border flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg border border-border bg-muted/60 flex items-center justify-center p-1 shrink-0">
              <img src={logo} alt="Gamma" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-foreground tracking-tight">
                Gamma Solutions
              </span>
              <span className="text-[10px] text-muted-foreground">
                Management console
              </span>
            </div>
          </Link>

          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Section */}
        <nav className="p-3 space-y-1">
          <p className="px-3 pt-3 pb-2 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
            Management
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-border space-y-1">
        <Link
          to="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          <span>View live website</span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
