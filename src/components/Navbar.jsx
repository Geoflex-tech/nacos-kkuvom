import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LayoutDashboard, LogOut, Shield } from "lucide-react";
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
  { to: "/tech-hub", label: "Tech Hub" },
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

  const initials = (profile?.full_name || profile?.email || "M")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const dashboardLink = isExec ? "/admin" : "/dashboard";
  const dashboardLabel = isExec ? "Admin" : "Dashboard";

  return (
    <header className="sticky top-0 z-50 bg-nacos-blue text-white shadow-lg">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
          <img
            src="/logo.jpeg"
            alt="NACOS KKU VOM"
            className="h-10 w-10 object-contain"
          />
          <span className="hidden sm:inline">
            NACOS <span className="text-nacos-gold">KKU VOM</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-5 text-sm font-medium">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  isActive
                    ? "text-nacos-gold"
                    : "hover:text-nacos-gold transition"
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop auth area */}
        <div className="hidden lg:flex items-center gap-3">
          {isMember ? (
            <>
              {/* Avatar + name */}
              <Link
                to="/profile"
                className="flex items-center gap-2 hover:opacity-90 transition group"
                title="My Profile"
              >
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile?.full_name || "Profile"}
                    className="h-9 w-9 rounded-full object-cover border-2 border-nacos-gold"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-white/20 border-2 border-nacos-gold flex items-center justify-center text-xs font-bold">
                    {initials}
                  </div>
                )}
                <span className="text-sm font-medium max-w-[100px] truncate hidden xl:inline">
                  {profile?.full_name?.split(" ")[0] || "Member"}
                </span>
              </Link>

              {/* Dashboard/Admin button */}
              <NavLink
                to={dashboardLink}
                className="inline-flex items-center gap-1.5 bg-nacos-gold text-nacos-blue px-3 py-1.5 rounded-md font-semibold hover:opacity-90 transition text-sm"
              >
                {isExec ? <Shield size={14} /> : <LayoutDashboard size={14} />}
                {dashboardLabel}
              </NavLink>

              {/* Logout */}
              <button
                onClick={logout}
                className="text-sm text-white/70 hover:text-nacos-gold transition inline-flex items-center gap-1"
                title="Logout"
              >
                <LogOut size={14} />
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? "text-nacos-gold text-sm font-medium"
                    : "hover:text-nacos-gold transition text-sm font-medium"
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="bg-nacos-gold text-nacos-blue px-3 py-1.5 rounded-md font-semibold hover:opacity-90 text-sm"
              >
                Register
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 -mr-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-nacos-blue border-t border-white/10">
          {/* Mobile user block */}
          {isMember && (
            <div className="px-4 pt-4 pb-3 border-b border-white/10">
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3"
              >
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt=""
                    className="h-11 w-11 rounded-full object-cover border-2 border-nacos-gold"
                  />
                ) : (
                  <div className="h-11 w-11 rounded-full bg-white/20 border-2 border-nacos-gold flex items-center justify-center text-sm font-bold">
                    {initials}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">
                    {profile?.full_name || "Member"}
                  </p>
                  <p className="text-xs text-white/60 truncate">
                    {profile?.email}
                  </p>
                </div>
              </Link>
            </div>
          )}

          <ul className="px-4 py-3 space-y-1">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block py-2 px-2 rounded-md transition ${
                      isActive
                        ? "bg-white/10 text-nacos-gold"
                        : "hover:bg-white/5 hover:text-nacos-gold"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Mobile auth actions */}
          <div className="px-4 pb-4 pt-2 border-t border-white/10 space-y-2">
            {isMember ? (
              <>
                <Link
                  to={dashboardLink}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 bg-nacos-gold text-nacos-blue px-4 py-2.5 rounded-md font-semibold justify-center"
                >
                  {isExec ? <Shield size={16} /> : <LayoutDashboard size={16} />}
                  {dashboardLabel}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-center justify-center text-red-300 hover:text-red-200 py-2.5 transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="block text-center py-2.5 rounded-md hover:bg-white/5 transition"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="block text-center bg-nacos-gold text-nacos-blue py-2.5 rounded-md font-semibold hover:opacity-90 transition"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}