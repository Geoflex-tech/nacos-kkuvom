/**
 * DashboardLayout
 *
 * Shell for all member-portal and admin pages.
 * No public Navbar or Footer.
 *
 * Desktop (≥1024px): fixed 240px sidebar + scrollable main area
 * Mobile (<1024px):  slide-in drawer opened by a burger in the top bar
 *
 * Sidebar nav items
 *   Overview, Profile, Resources, Tech Hub, Announcements, Certificates, Dues
 *   — bottom section (separated by line): Admin (exec only), Log out
 *
 * Top bar: 56px, page title (derived from current route), avatar menu
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { Outlet, NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, User, BookOpen, Cpu, Megaphone,
  Award, Wallet, Shield, LogOut, Menu, X, ChevronDown,
  Home, ExternalLink, Briefcase,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

/* ── Nav items ──────────────────────────────────────────────── */
const NAV_ITEMS = [
  { to: "/dashboard",                label: "Overview",      Icon: LayoutDashboard, end: true },
  { to: "/profile",                  label: "Profile",       Icon: User             },
  { to: "/dashboard/resources",      label: "Resources",     Icon: BookOpen         },
  { to: "/dashboard/tech-hub",       label: "Tech Hub",      Icon: Cpu              },
  { to: "/dashboard/opportunities",  label: "Opportunities", Icon: Briefcase        },
  { to: "/announcements",            label: "Announcements", Icon: Megaphone        },
  { to: "/certificates",             label: "Certificates",  Icon: Award            },
  { to: "/dues",                     label: "Dues",          Icon: Wallet           },
];

/* ── Route → page title map ─────────────────────────────────── */
const PAGE_TITLES = {
  "/dashboard":                   "Overview",
  "/profile":                     "My Profile",
  "/dashboard/resources":         "Resources",
  "/dashboard/tech-hub":          "Tech Hub",
  "/dashboard/opportunities":     "Opportunities",
  "/announcements":               "Announcements",
  "/certificates":                "My Certificates",
  "/dues":                        "Pay Dues",
  "/admin":                       "Admin",
};

/* ── Avatar initials ─────────────────────────────────────────── */
function getInitials(profile) {
  return (profile?.full_name || profile?.email || "M")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/* ═══════════════════════════════════════════════════════════════
   SIDEBAR CONTENT — shared between desktop sidebar and mobile drawer
   ═══════════════════════════════════════════════════════════════ */
function SidebarContent({ onClose, isExec }) {
  const navigate   = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/");
    onClose?.();
  };

  return (
    <div className="dl-sidebar-inner">
      {/* Logo */}
      <div className="dl-sidebar-logo">
        <Link to="/" className="dl-logo-link" onClick={onClose}>
          <img src="/logo.jpeg" alt="" className="dl-logo-img" />
          <span className="dl-logo-text">
            NACOS <span className="dl-logo-accent">KKU</span>
          </span>
        </Link>
      </div>

      {/* Main nav */}
      <nav className="dl-nav" aria-label="Dashboard navigation">
        <ul role="list">
          {NAV_ITEMS.map(({ to, label, Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={onClose}
                className={({ isActive }) =>
                  `dl-nav-item${isActive ? " dl-nav-item--active" : ""}`
                }
              >
                <Icon size={17} aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom: admin + logout */}
      <div className="dl-sidebar-foot">
        {isExec && (
          <NavLink
            to="/admin"
            end
            onClick={onClose}
            className={({ isActive }) =>
              `dl-nav-item${isActive ? " dl-nav-item--active" : ""}`
            }
          >
            <Shield size={17} aria-hidden="true" />
            Admin
          </NavLink>
        )}
        <button
          type="button"
          className="dl-nav-item dl-logout-btn"
          onClick={logout}
        >
          <LogOut size={17} aria-hidden="true" />
          Log out
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   AVATAR MENU
   ═══════════════════════════════════════════════════════════════ */
function AvatarMenu({ profile }) {
  const [open, setOpen]   = useState(false);
  const menuRef           = useRef(null);
  const navigate          = useNavigate();

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const fn = (e) => { if (!menuRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const fn = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [open]);

  const logout = async () => {
    setOpen(false);
    await supabase.auth.signOut();
    navigate("/");
  };

  const initials = getInitials(profile);

  return (
    <div className="dl-avatar-menu" ref={menuRef}>
      <button
        type="button"
        className="dl-avatar-btn"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Account menu"
      >
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile?.full_name || "Profile"}
            className="dl-avatar-img"
          />
        ) : (
          <span className="dl-avatar-initials">{initials}</span>
        )}
        <ChevronDown
          size={14}
          aria-hidden="true"
          style={{
            transition: "transform 150ms ease-out",
            transform: open ? "rotate(180deg)" : "rotate(0)",
          }}
        />
      </button>

      {open && (
        <div className="dl-avatar-dropdown" role="menu">
          <div className="dl-avatar-dd-header">
            <p className="dl-avatar-dd-name">
              {profile?.full_name || "Member"}
            </p>
            <p className="dl-avatar-dd-email">{profile?.email}</p>
          </div>
          <Link
            to="/profile"
            className="dl-avatar-dd-item"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <User size={14} aria-hidden="true" /> Profile
          </Link>
          <button
            type="button"
            className="dl-avatar-dd-item dl-avatar-dd-item--danger"
            role="menuitem"
            onClick={logout}
          >
            <LogOut size={14} aria-hidden="true" /> Log out
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN LAYOUT
   ═══════════════════════════════════════════════════════════════ */
export default function DashboardLayout() {
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const { profile, isExec }           = useAuth();
  const location                      = useLocation();
  const drawerRef                     = useRef(null);
  const burgerRef                     = useRef(null);

  const pageTitle =
    PAGE_TITLES[location.pathname] ||
    (location.pathname.startsWith("/certificates/") ? "Certificate" : "Dashboard");

  /* Lock body scroll when drawer is open */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  /* Focus trap in drawer */
  const handleDrawerKey = useCallback((e) => {
    if (e.key === "Escape") {
      setDrawerOpen(false);
      burgerRef.current?.focus();
      return;
    }
    if (e.key !== "Tab") return;
    const focusable = drawerRef.current?.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex="0"]'
    );
    if (!focusable?.length) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }, []);

  /* Move focus into drawer when it opens */
  useEffect(() => {
    if (drawerOpen) {
      setTimeout(() => {
        drawerRef.current
          ?.querySelector('a[href], button:not([disabled])')
          ?.focus();
      }, 50);
    }
  }, [drawerOpen]);

  return (
    <div className="dl-shell">

      {/* ── Desktop sidebar ─────────────────────────── */}
      <aside className="dl-sidebar" aria-label="Dashboard sidebar">
        <SidebarContent isExec={isExec} />
      </aside>

      {/* ── Main column ─────────────────────────────── */}
      <div className="dl-main-col">

        {/* Top bar */}
        <header className="dl-topbar">
          {/* Burger (mobile only) */}
          <button
            ref={burgerRef}
            type="button"
            className="dl-burger"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={drawerOpen}
            aria-controls="dl-drawer"
          >
            <Menu size={20} aria-hidden="true" />
          </button>

          {/* Page title */}
          <h1 className="dl-page-title">{pageTitle}</h1>

          {/* Right cluster */}
          <div className="dl-topbar-right">
            <Link to="/" className="dl-back-site">
              <Home size={13} aria-hidden="true" />
              <span>Website</span>
              <ExternalLink size={11} aria-hidden="true" />
            </Link>
            <AvatarMenu profile={profile} />
          </div>
        </header>

        {/* Page content */}
        <main
          id="main-content"
          className="dl-content"
          tabIndex={-1}
        >
          <Outlet />
        </main>
      </div>

      {/* ── Mobile drawer overlay ────────────────────── */}
      {drawerOpen && (
        <div
          className="dl-overlay"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile drawer ────────────────────────────── */}
      <div
        id="dl-drawer"
        ref={drawerRef}
        className={`dl-drawer${drawerOpen ? " dl-drawer--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        onKeyDown={drawerOpen ? handleDrawerKey : undefined}
      >
        <button
          type="button"
          className="dl-drawer-close"
          onClick={() => setDrawerOpen(false)}
          aria-label="Close navigation menu"
        >
          <X size={18} aria-hidden="true" />
        </button>
        <SidebarContent
          isExec={isExec}
          onClose={() => setDrawerOpen(false)}
        />
      </div>

      {/* ── Styles ───────────────────────────────────── */}
      <style>{`
        /* ── Shell ─────────────────────────────────── */
        .dl-shell {
          display: flex;
          min-height: 100vh;
          background: #F4F7FC;
        }

        /* ── Sidebar (desktop) ──────────────────────── */
        .dl-sidebar {
          display: none;
          width: 240px;
          flex-shrink: 0;
          position: fixed;
          top: 0; bottom: 0; left: 0;
          background: #fff;
          border-right: 1px solid #E2E6EF;
          z-index: 40;
          overflow-y: auto;
        }

        .dl-sidebar-inner {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 0;
        }

        /* Logo */
        .dl-sidebar-logo {
          padding: 18px 20px 14px;
          border-bottom: 1px solid #F1F4FA;
        }
        .dl-logo-link {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none;
        }
        .dl-logo-img {
          width: 28px; height: 28px; border-radius: 50%;
          object-fit: contain; flex-shrink: 0;
          border: 1.5px solid #E2E6EF;
        }
        .dl-logo-text {
          font-size: 0.9375rem; font-weight: 700;
          color: #1E3A8A;
        }
        .dl-logo-accent { color: #F59E0B; }

        /* Nav */
        .dl-nav { flex: 1; padding: 12px 12px 0; overflow-y: auto; }
        .dl-nav ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }

        .dl-nav-item {
          display: flex; align-items: center; gap: 10px;
          height: 40px; padding: 0 12px;
          border-radius: 8px;
          font-size: 0.875rem; font-weight: 400;
          color: #374151; text-decoration: none;
          background: none; border: none;
          cursor: pointer; width: 100%; text-align: left;
          font-family: inherit;
          transition: background 150ms ease-out, color 150ms ease-out;
        }
        .dl-nav-item:hover { background: #F5F7FB; color: #1E3A8A; }
        .dl-nav-item--active {
          background: #EEF1F8 !important;
          color: #1E40AF !important;
          font-weight: 500;
        }
        .dl-nav-item:focus-visible {
          outline: 2px solid #1E40AF; outline-offset: -2px;
        }

        /* Bottom section */
        .dl-sidebar-foot {
          padding: 12px;
          border-top: 1px solid #F1F4FA;
          display: flex; flex-direction: column; gap: 2px;
        }
        .dl-logout-btn { color: #6B7280; }
        .dl-logout-btn:hover { color: #DC2626; background: #FEF2F2; }

        /* ── Main column ────────────────────────────── */
        .dl-main-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          min-height: 100vh;
        }

        /* ── Top bar ────────────────────────────────── */
        .dl-topbar {
          position: sticky; top: 0; z-index: 30;
          height: 56px;
          background: #fff;
          border-bottom: 1px solid #E2E6EF;
          display: flex; align-items: center;
          padding: 0 16px;
          gap: 12px;
        }

        .dl-burger {
          display: flex; align-items: center; justify-content: center;
          width: 36px; height: 36px; border-radius: 8px;
          background: none; border: none; cursor: pointer;
          color: #374151;
          transition: background 150ms ease-out;
          flex-shrink: 0;
        }
        .dl-burger:hover { background: #F3F4F6; }
        .dl-burger:focus-visible { outline: 2px solid #1E40AF; outline-offset: 2px; }

        .dl-page-title {
          font-size: 0.9375rem; font-weight: 600;
          color: #0F172A; margin: 0; flex: 1;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        .dl-topbar-right {
          display: flex; align-items: center; gap: 8px; flex-shrink: 0;
        }

        .dl-back-site {
          display: none; /* shown on desktop only */
          align-items: center; gap: 5px;
          font-size: 0.8125rem; font-weight: 500;
          color: #6B7280; text-decoration: none;
          padding: 6px 10px; border-radius: 6px;
          transition: color 150ms ease-out, background 150ms ease-out;
        }
        .dl-back-site:hover { color: #1E3A8A; background: #F5F7FB; }
        .dl-back-site:focus-visible { outline: 2px solid #1E40AF; outline-offset: 2px; border-radius: 6px; }

        /* ── Content area ───────────────────────────── */
        .dl-content {
          flex: 1;
          padding: 24px 16px;
          max-width: 1040px;
          width: 100%;
          margin-inline: auto;
          box-sizing: border-box;
          outline: none;
        }

        /* ── Avatar menu ────────────────────────────── */
        .dl-avatar-menu { position: relative; }

        .dl-avatar-btn {
          display: flex; align-items: center; gap: 6px;
          background: none; border: none; cursor: pointer;
          padding: 4px;
          border-radius: 999px;
          transition: background 150ms ease-out;
        }
        .dl-avatar-btn:hover { background: #F3F4F6; }
        .dl-avatar-btn:focus-visible { outline: 2px solid #1E40AF; outline-offset: 2px; border-radius: 999px; }

        .dl-avatar-img {
          width: 32px; height: 32px; border-radius: 50%;
          object-fit: cover; border: 2px solid #E2E6EF;
        }
        .dl-avatar-initials {
          width: 32px; height: 32px; border-radius: 50%;
          background: #1E40AF; color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.6875rem; font-weight: 700;
          flex-shrink: 0;
        }

        .dl-avatar-dropdown {
          position: absolute; top: calc(100% + 8px); right: 0;
          width: 200px;
          background: #fff;
          border: 1px solid #E2E6EF;
          border-radius: 10px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.10);
          overflow: hidden;
          z-index: 50;
        }
        .dl-avatar-dd-header {
          padding: 12px 14px 10px;
          border-bottom: 1px solid #F1F4FA;
        }
        .dl-avatar-dd-name {
          font-size: 0.875rem; font-weight: 600;
          color: #0F172A; margin: 0 0 2px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .dl-avatar-dd-email {
          font-size: 0.75rem; color: #6B7280; margin: 0;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .dl-avatar-dd-item {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 14px;
          font-size: 0.875rem; color: #374151;
          text-decoration: none; background: none;
          border: none; cursor: pointer; width: 100%;
          font-family: inherit; text-align: left;
          transition: background 150ms ease-out, color 150ms ease-out;
        }
        .dl-avatar-dd-item:hover { background: #F5F7FB; color: #1E3A8A; }
        .dl-avatar-dd-item--danger:hover { background: #FEF2F2; color: #DC2626; }
        .dl-avatar-dd-item:focus-visible { outline: 2px solid #1E40AF; outline-offset: -2px; }

        /* ── Mobile drawer + overlay ─────────────────── */
        .dl-overlay {
          position: fixed; inset: 0; z-index: 49;
          background: rgba(15,23,42,0.40);
          backdrop-filter: blur(2px);
        }

        .dl-drawer {
          position: fixed; top: 0; left: 0; bottom: 0;
          width: 260px; z-index: 50;
          background: #fff;
          border-right: 1px solid #E2E6EF;
          transform: translateX(-100%);
          transition: transform 250ms ease-out;
          overflow-y: auto;
        }
        .dl-drawer--open { transform: translateX(0); }

        .dl-drawer-close {
          position: absolute; top: 14px; right: 14px;
          width: 32px; height: 32px; border-radius: 8px;
          background: #F3F4F6; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #374151;
          transition: background 150ms ease-out;
          z-index: 1;
        }
        .dl-drawer-close:hover { background: #E5E7EB; }
        .dl-drawer-close:focus-visible { outline: 2px solid #1E40AF; outline-offset: 2px; }

        /* ── Responsive ─────────────────────────────── */
        @media (min-width: 1024px) {
          .dl-sidebar   { display: flex; }
          .dl-main-col  { margin-left: 240px; }
          .dl-burger    { display: none; }
          .dl-back-site { display: flex; }
          .dl-content   { padding: 28px 24px; }
          /* Drawer never shown on desktop */
          .dl-drawer    { display: none; }
          .dl-overlay   { display: none; }
        }

        @media (max-width: 1023px) {
          .dl-sidebar { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .dl-drawer { transition: none; }
          .dl-nav-item, .dl-avatar-btn,
          .dl-avatar-dd-item, .dl-back-site { transition: none; }
        }
      `}</style>
    </div>
  );
}
