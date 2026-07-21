import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  BarChart3,
  Map,
  Info,
  Leaf,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    title: "Prediction",
    icon: Activity,
    path: "/prediction",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    path: "/analytics",
  },
  {
    title: "Map",
    icon: Map,
    path: "/map",
  },
  {
    title: "About",
    icon: Info,
    path: "/about",
  },
];

function Sidebar() {
  return (
    <aside className="w-72 bg-slate-950 text-white flex flex-col border-r border-slate-800">

      {/* Logo */}

      <div className="px-8 py-8 border-b border-slate-800">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg">

            <Leaf size={24} />

          </div>

          <div>

            <h1 className="text-2xl font-bold tracking-wide">
              SmartAQI
            </h1>

            <p className="text-sm text-slate-400">
              Urban Intelligence
            </p>

          </div>

        </div>

      </div>

      {/* Navigation */}

      <nav className="flex-1 px-5 py-8 space-y-2">

        {menuItems.map((item) => {

          const Icon = item.icon;

          return (

            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`
              }
            >
              <Icon size={22} />

              <span className="font-medium text-[16px]">
                {item.title}
              </span>

            </NavLink>

          );
        })}

      </nav>

      {/* Footer */}

      <div className="p-6 border-t border-slate-800">

        <div className="rounded-2xl bg-slate-900 p-5">

          <div className="text-xs uppercase tracking-widest text-teal-400">
            AI Powered
          </div>

          <h3 className="mt-2 font-semibold">
            Smart City Platform
          </h3>

          <p className="mt-2 text-sm text-slate-400 leading-6">
            AI-powered Urban Air Quality Intelligence Platform.
          </p>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;