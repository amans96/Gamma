import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Wrench,
  FileText,
  Handshake,
  LogOut,
} from "lucide-react";
import { logout } from "../../utils/auth";

const AdminSidebar = () => {
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
      name: "Blog Posts",
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
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white">
      {/* Logo */}
      <div className="flex h-20 items-center border-b px-6">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Management
        </p>

        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-black"
                  }`
                }
              >
                <Icon className="h-5 w-5" />

                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="absolute bottom-0 w-full border-t p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;