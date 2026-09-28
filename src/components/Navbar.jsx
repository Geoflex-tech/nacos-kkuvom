import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/executives", label: "Executives" },
  { to: "/history", label: "History" },
  { to: "/news", label: "News" },
  { to: "/events", label: "Events" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isMember, isExec, profile } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-nacos-blue text-white shadow-lg">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <img
            src="/logo.jpeg"
            alt="NACOS KKU VOM"
            className="h-10 w-10 object-contain"
          />
          <span>
            NACOS <span className="text-nacos-gold">KKU VOM</span>
          </span>
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

          {isMember ? (
            <>
              <li>
                <NavLink
                  to={isExec ? "/admin" : "/dashboard"}
                  className="bg-nacos-gold text-nacos-blue px-3 py-1.5 rounded-md font-semibold hover:opacity-90"
                >
                  {isExec ? "Admin" : "Dashboard"}
                </NavLink>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="text-sm text-white/80 hover:text-nacos-gold"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? "text-nacos-gold" : "hover:text-nacos-gold transition"
                  }
                >
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/register"
                  className="bg-nacos-gold text-nacos-blue px-3 py-1.5 rounded-md font-semibold hover:opacity-90"
                >
                  Register
                </NavLink>
              </li>
            </>
          )}
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

          {isMember ? (
            <>
              <li>
                <NavLink
                  to={isExec ? "/admin" : "/dashboard"}
                  onClick={() => setOpen(false)}
                  className="text-nacos-gold font-semibold block"
                >
                  {isExec ? "Admin" : "Dashboard"}
                </NavLink>
              </li>
              <li>
                <button
                  onClick={() => { logout(); setOpen(false); }}
                  className="text-white/80 hover:text-nacos-gold"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login" onClick={() => setOpen(false)} className="block hover:text-nacos-gold">
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink to="/register" onClick={() => setOpen(false)} className="text-nacos-gold font-semibold block">
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>
      )}
    </header>
  );
}
