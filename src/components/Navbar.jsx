import { useState, useEffect, useRef, useCallback } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LayoutDashboard, LogOut, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

const PUBLIC_LINKS = [
  { to: "/",         label: "Home"       },
  { to: "/about",    label: "About"      },
  { to: "/history",  label: "History"    },
  { to: "/executives", label: "Executives" },
  { to: "/news",     label: "News"       },
  { to: "/events",   label: "Events"     },
  { to: "/gallery",  label: "Gallery"    },
  { to: "/contact",  label: "Contact"    },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isMember, isExec, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const drawerRef = useRef(null);
  const burgerRef = useRef(null);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleDrawerKey = useCallback((e) => {
    if (e.key === "Escape") {
      setOpen(false);
      burgerRef.current?.focus();
      return;
    }
    if (e.key !== "Tab") return;
    const drawer = drawerRef.current;
    if (!drawer) return;
    const focusable = Array.from(drawer.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex="0"]'
    ));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        drawerRef.current?.querySelector('a[href], button:not([disabled])')?.focus();
      }, 50);
    }
  }, [open]);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/");
    setOpen(false);
  };

  const initials = (profile?.full_name || profile?.email || "M")
    .split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  const dashboardLink = isExec ? "/admin" : "/dashboard";
  const dashboardLabel = isExec ? "Admin" : "Dashboard";

  return (
    <>
      <div className="pill-wrap">
        <nav className={`pill${scrolled ? " pill--shadow" : ""}`} aria-label="Primary navigation">
          <Link to="/" className="pill-logo" aria-label="NACOS KKU VOM home">
            <img src="/logo.png" alt="" aria-hidden="true" className="pill-logo__img" />
            <span className="pill-logo__text">
              NACOS <span className="pill-logo__accent">KKU VOM</span>
            </span>
          </Link>

          <ul className="pill-links" role="list">
            {PUBLIC_LINKS.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === "/"}
                  className={({ isActive }) =>
                    `pill-link${isActive ? " pill-link--active" : ""}`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="pill-actions">
            {isMember ? (
              <>
                <Link to="/profile" className="pill-avatar" title="My Profile">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile?.full_name || "Profile"} className="pill-avatar__img" />
                  ) : (
                    <span className="pill-avatar__initials">{initials}</span>
                  )}
                </Link>
                <Link to={dashboardLink} className="pill-cta">
                  {isExec ? <Shield size={14} /> : <LayoutDashboard size={14} />}
                  {dashboardLabel}
                </Link>
                <button onClick={logout} className="pill-logout" aria-label="Log out" title="Log out">
                  <LogOut size={15} />
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="pill-login">Log in</NavLink>
                <Link to="/register" className="pill-cta">Join Now</Link>
              </>
            )}
          </div>

          <button
            ref={burgerRef}
            className="pill-burger"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mob-menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </div>

      {open && (
        <>
          <div className="mob-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />

          <div
            id="mob-menu"
            ref={drawerRef}
            className="mob-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            onKeyDown={handleDrawerKey}
          >
            {isMember && (
              <Link to="/profile" onClick={() => setOpen(false)} className="mob-user">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="mob-user__img" />
                ) : (
                  <span className="pill-avatar__initials">{initials}</span>
                )}
                <div>
                  <p className="mob-user__name">{profile?.full_name || "Member"}</p>
                  <p className="mob-user__email">{profile?.email}</p>
                </div>
              </Link>
            )}

            <ul className="mob-links" role="list">
              {PUBLIC_LINKS.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.to === "/"}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `mob-link${isActive ? " mob-link--active" : ""}`
                    }
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
              {isMember && (
                <li>
                  <NavLink
                    to={dashboardLink}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `mob-link${isActive ? " mob-link--active" : ""}`
                    }
                  >
                    {dashboardLabel}
                  </NavLink>
                </li>
              )}
            </ul>

            <div className="mob-auth">
              {isMember ? (
                <button onClick={logout} className="mob-logout">
                  <LogOut size={15} /> Log out
                </button>
              ) : (
                <>
                  <NavLink to="/login" onClick={() => setOpen(false)} className="mob-link">Log in</NavLink>
                  <Link to="/register" onClick={() => setOpen(false)} className="pill-cta mob-cta-full">Join Now</Link>
                </>
              )}
            </div>
          </div>
        </>
      )}

      <style>{`
        /* ---- CSS Variables ---- */
        :root {
          --color-blue: #1E40AF;
          --color-blue-dark: #1E3A8A;
          --color-blue-hover: #1E3A8A;
          --color-blue-light: #DBEAFE;
          --color-green: #059669;
          --color-green-light: #D1FAE5;
          --color-yellow: #D97706;
          --color-yellow-light: #FEF3C7;
          --color-error: #DC2626;
          --color-border: #E5E7EB;
          --color-text-primary: #111827;
          --color-text-muted: #6B7280;
        }

        /* ---- Floating pill wrapper ---- */
        .pill-wrap {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: transparent;
          padding-top: calc(env(safe-area-inset-top, 0px) + 10px);
          padding-inline: 16px;
          padding-left: max(16px, env(safe-area-inset-left));
          padding-right: max(16px, env(safe-area-inset-right));
          pointer-events: none;
        }

        /* ---- Pill ---- */
        .pill {
          pointer-events: all;
          max-width: 1040px;
          margin-inline: auto;
          height: 52px;
          background: #ffffff;
          border: 1px solid #E3E7F0;
          border-radius: 999px;
          padding: 6px 8px 6px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          transition: box-shadow 200ms ease-out, height 200ms ease-out;
        }
        .pill--shadow {
          box-shadow: 0 4px 24px rgba(0,0,0,0.10);
          height: 48px;
        }

        /* ---- Logo ---- */
        .pill-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .pill-logo__img {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          object-fit: contain;
          flex-shrink: 0;
        }
        .pill-logo__text {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--color-blue-dark);
          white-space: nowrap;
        }
        .pill-logo__accent { color: var(--color-blue-dark); }

        /* ---- Centre links ---- */
        .pill-links {
          display: flex;
          align-items: center;
          gap: 2px;
          list-style: none;
          margin: 0;
          padding: 0;
          flex: 1;
          justify-content: center;
          flex-wrap: nowrap;
          overflow: hidden;
        }

        .pill-link {
          display: inline-block;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: clamp(0.7rem, 1.1vw, 0.8125rem);
          font-weight: 400;
          color: #4B5563;
          text-decoration: none;
          transition: color 150ms ease-out, background 150ms ease-out;
          white-space: nowrap;
        }
        .pill-link:hover {
          color: var(--color-blue);
          background: #EFF4FF;
        }
        .pill-link--active {
          color: var(--color-blue) !important;
          font-weight: 600;
          background: #F3F4F6;
        }

        /* ---- Right actions ---- */
        .pill-actions {
          display: flex;
          align-items: center;
          gap: 2px;
          flex-shrink: 0;
        }
        .pill-login {
          padding: 6px 10px;
          font-size: 0.84375rem;
          font-weight: 500;
          color: #4B5563;
          text-decoration: none;
          border-radius: 999px;
          transition: color 150ms ease-out;
          white-space: nowrap;
        }
        .pill-login:hover { color: var(--color-blue); }

        .pill-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 34px;
          padding: 0 16px;
          border-radius: 999px;
          background: var(--color-blue);
          color: #fff !important;
          font-size: 0.8125rem;
          font-weight: 600;
          text-decoration: none;
          border: none;
          cursor: pointer;
          white-space: nowrap;
          transition: background 150ms ease-out, transform 150ms ease-out;
        }
        .pill-cta:hover {
          background: var(--color-blue-hover);
          transform: translateY(-1px);
        }

        .pill-avatar {
          display: flex;
          align-items: center;
          text-decoration: none;
          margin-right: 4px;
        }
        .pill-avatar__img {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #E3E7F0;
        }
        .pill-avatar__initials {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--color-blue);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.6875rem;
          font-weight: 700;
        }

        .pill-logout {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: none;
          border: none;
          cursor: pointer;
          color: #9CA3AF;
          transition: color 150ms ease-out, background 150ms ease-out;
        }
        .pill-logout:hover { color: var(--color-error); background: #FEE2E2; }

        .pill-burger {
          display: none;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: none;
          cursor: pointer;
          color: var(--color-blue-dark);
          transition: background 150ms ease-out;
          flex-shrink: 0;
        }
        .pill-burger:hover { background: #F3F4F6; }

        .pill-link:focus-visible,
        .pill-login:focus-visible,
        .pill-cta:focus-visible,
        .pill-logout:focus-visible,
        .pill-avatar:focus-visible,
        .pill-burger:focus-visible {
          outline: 2px solid var(--color-blue);
          outline-offset: 2px;
        }

        /* ---- Mobile drawer ---- */
        .mob-backdrop {
          position: fixed;
          inset: 0;
          z-index: 98;
          background: rgba(15,23,42,0.35);
          backdrop-filter: blur(2px);
        }
        .mob-drawer {
          position: fixed;
          left: 16px;
          right: 16px;
          z-index: 99;
          max-width: 480px;
          margin-inline: auto;
          background: #fff;
          border: 1px solid #E3E7F0;
          border-radius: 24px;
          padding: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          display: flex;
          flex-direction: column;
          gap: 4px;
          max-height: calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 80px);
          max-height: calc(100vh - 80px);
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }

        .mob-user {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
          border-radius: 12px;
          text-decoration: none;
          transition: background 150ms ease-out;
          margin-bottom: 4px;
        }
        .mob-user:hover { background: #F9FAFB; }
        .mob-user__img {
          width: 40px; height: 40px;
          border-radius: 50%; object-fit: cover;
          border: 2px solid var(--color-blue);
          flex-shrink: 0;
        }
        .mob-user__name  { font-size: 0.875rem; font-weight: 600; color: var(--color-text-primary); margin: 0; }
        .mob-user__email { font-size: 0.75rem;  color: var(--color-text-muted); margin: 0; }

        .mob-links {
          list-style: none; margin: 0; padding: 0;
          display: flex; flex-direction: column; gap: 2px;
        }
        .mob-link {
          display: flex;
          align-items: center;
          padding: 10px 14px;
          min-height: 44px;
          border-radius: 12px;
          font-size: 0.9375rem;
          font-weight: 400;
          color: #374151;
          text-decoration: none;
          transition: color 150ms ease-out, background 150ms ease-out;
        }
        .mob-link:hover   { color: var(--color-blue); background: #EFF4FF; }
        .mob-link--active { color: var(--color-blue) !important; font-weight: 600; background: #F3F4F6; }
        .mob-link:focus-visible { outline: 2px solid var(--color-blue); outline-offset: 2px; }

        .mob-auth {
          display: flex; flex-direction: column; gap: 6px;
          padding-top: 12px;
          border-top: 1px solid #F3F4F6;
          margin-top: 4px;
        }
        .mob-cta-full { justify-content: center; }
        .mob-logout {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          min-height: 44px; font-size: 0.875rem;
          color: var(--color-error);
          background: none; border: none; cursor: pointer;
          border-radius: 12px;
          transition: background 150ms ease-out;
        }
        .mob-logout:hover { background: #FEE2E2; }
        .mob-logout:focus-visible { outline: 2px solid #DC2626; outline-offset: 2px; }

        /* ---- Responsive ---- */
        @media (max-width: 1099px) {
          .pill-links   { display: none; }
          .pill-actions { display: none; }
          .pill-burger  { display: flex; }
          .pill { padding: 6px 6px 6px 14px; height: 48px; }
          .pill-wrap { padding-inline: 16px; }
        }
        .mob-drawer {
          top: calc(env(safe-area-inset-top, 0px) + 10px + 48px + 8px);
        }
        @media (min-width: 1100px) {
          .pill-wrap { padding-inline: 24px; }
        }
        @media (min-width: 1280px) {
          .pill-link { padding: 6px 12px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .pill-cta:hover { transform: none; }
        }
      `}</style>
    </>
  );
}