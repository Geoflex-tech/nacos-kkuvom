/**
 * AuthLayout
 *
 * Bare full-viewport wrapper for authentication pages.
 * No public Navbar, no Footer, no paddingTop.
 * Pages render exactly what they need — full-screen split layouts, etc.
 *
 * Used by: /login, /register, /forgot-password, /reset-password
 */
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    /*
      "auth-root" gives pages a flex column anchor at full viewport height
      so the split-screen layout can stretch to 100vh without extra wrappers.
    */
    <div className="auth-root">
      <Outlet />
      <style>{`
        .auth-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #fff;
        }
      `}</style>
    </div>
  );
}
