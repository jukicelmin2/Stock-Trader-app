import type { FC } from "react";
import { NavLink } from "react-router-dom";

type NavItem = {
  label: string;
  to: string;
};

const navItems: NavItem[] = [
  { label: "Dashboard", to: "/" },
  { label: "Watchlist", to: "/watchlist" },
  { label: "Trade Ideas", to: "/trade-ideas" },
];

const Navbar: FC = () => {
  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-black text-white font-bold">
            ↗
          </div>
          <span className="text-lg font-semibold text-gray-900">
            Stock Trader
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-gray-600">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `transition ${
                  isActive ? "text-black font-medium" : "hover:text-black"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
