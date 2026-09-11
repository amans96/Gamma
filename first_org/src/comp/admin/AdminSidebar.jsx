
import { NavLink, useNavigate } from "react-router-dom";
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
  icon: "⌂",
},
    {
      name: "Products",
      path: "/admin/products",
      icon: "▣",
    },
    {
      name: "Services",
      path: "/admin/services",
      icon: "⚙",
    },
    {
      name: "Blog Posts",
      path: "/admin/blog",
      icon: "▤",
    },
    {
      name: "Partners",
      path: "/admin/partners",
      icon: "♧",
    },
    {
      name: "Website Content",
      path: "/admin/content",
      icon: "◈",
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white">
      
      {/* Logo */}
      <div className="flex h-20 items-center border-b px-6">
        <h1 className="text-xl font-bold">
          Admin Panel
        </h1>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Management
        </p>

        <div className="space-y-1">
          {navItems.map((item) => (
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
              <span className="w-5 text-center text-lg">
                {item.icon}
              </span>

              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom */}
      <div className="absolute bottom-0 w-full border-t p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <span className="w-5 text-center">
            ↪
          </span>

          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

