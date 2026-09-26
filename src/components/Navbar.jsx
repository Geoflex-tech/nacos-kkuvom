import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/executives", label: "Executives" },
  { to: "/news", label: "News" },
  { to: "/events", label: "Events" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-nacos-blue text-white shadow-lg">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
  <img
  src="/logo.jpeg"
  alt="NACOS KKU VOM"
  className="h-10 w-10 object-contain"
/>
  <span>NACOS <span className="text-nacos-gold">KKU VOM</span></span>
</Link>

        <ul className="hidden md:flex items-center gap-6 text-sm font-medium">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  isActive ? "text-nacos-gold" : "hover:text-nacos-gold transition"
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <ul className="md:hidden bg-nacos-blue border-t border-white/10 px-4 pb-4 space-y-3">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  isActive ? "text-nacos-gold block" : "block hover:text-nacos-gold"
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}