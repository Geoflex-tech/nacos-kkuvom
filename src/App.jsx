import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// ── Layouts ──────────────────────────────────────────────────
import PublicLayout    from "./layouts/PublicLayout";
import AuthLayout      from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// ── Public pages ─────────────────────────────────────────────
import Home               from "./pages/public/Home";
import About              from "./pages/public/About";
import Executives         from "./pages/public/Executives";
import Leadership         from "./pages/public/Leadership";
import History            from "./pages/public/History";
import AdministrationDetail from "./pages/public/AdministrationDetail";
import News               from "./pages/public/News";
import NewsDetail         from "./pages/public/NewsDetail";
import Events             from "./pages/public/Events";
import Gallery            from "./pages/public/Gallery";
import Verify             from "./pages/public/Verify";
import Contact            from "./pages/public/Contact";
import Opportunities      from "./pages/public/Opportunities";
import NotFound           from "./pages/public/NotFound";

// ── Auth pages (no nav/footer) ────────────────────────────────
import Login          from "./pages/public/Login";
import Register       from "./pages/public/Register";
import ForgotPassword from "./pages/public/ForgotPassword";
import ResetPassword  from "./pages/public/ResetPassword";

// ── Member portal (no public nav/footer) ─────────────────────
import Dashboard         from "./pages/portal/Dashboard";
import Profile           from "./pages/portal/Profile";
import DashboardResources from "./pages/portal/DashboardResources";
import DashboardTechHub  from "./pages/portal/DashboardTechHub";
import Announcements     from "./pages/portal/Announcements";
import MyCertificates    from "./pages/portal/MyCertificates";
import CertificateView   from "./pages/portal/CertificateView";
import Dues              from "./pages/portal/Dues";

// ── Admin ─────────────────────────────────────────────────────
import AdminDashboard from "./pages/admin/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ════════════════════════════════════════════════
            PUBLIC — navbar + footer via PublicLayout
            ════════════════════════════════════════════════ */}
        <Route element={<PublicLayout />}>
          <Route path="/"               element={<Home />} />
          <Route path="/about"          element={<About />} />
          <Route path="/executives"     element={<Executives />} />
          <Route path="/leadership"     element={<Leadership />} />
          <Route path="/leadership/:slug" element={<Leadership />} />
          <Route path="/history"        element={<History />} />
          <Route path="/history/:id"    element={<AdministrationDetail />} />
          <Route path="/news"           element={<News />} />
          <Route path="/news/:slug"     element={<NewsDetail />} />
          <Route path="/events"         element={<Events />} />
          <Route path="/gallery"        element={<Gallery />} />
          <Route path="/opportunities"  element={<Opportunities />} />
          <Route path="/verify"         element={<Verify />} />
          <Route path="/contact"        element={<Contact />} />
          {/* 404 also gets public layout */}
          <Route path="*"              element={<NotFound />} />
        </Route>

        {/* ════════════════════════════════════════════════
            AUTH — no navbar, no footer via AuthLayout
            ════════════════════════════════════════════════ */}
        <Route element={<AuthLayout />}>
          <Route path="/login"            element={<Login />} />
          <Route path="/register"         element={<Register />} />
          <Route path="/forgot-password"  element={<ForgotPassword />} />
          <Route path="/reset-password"   element={<ResetPassword />} />
        </Route>

        {/* ════════════════════════════════════════════════
            REDIRECTS — old public URLs → dashboard
            (no layout needed; Navigate renders nothing)
            ════════════════════════════════════════════════ */}
        <Route
          path="/resources"
          element={<Navigate to="/dashboard/resources" replace />}
        />
        <Route
          path="/tech-hub"
          element={<Navigate to="/dashboard/tech-hub" replace />}
        />

        {/* ════════════════════════════════════════════════
            MEMBER PORTAL — own shell via DashboardLayout
            Every child is wrapped in ProtectedRoute so
            unauthenticated visitors are sent to /login
            with a returnTo param before the layout even
            renders — preventing any flash of the public nav.
            ════════════════════════════════════════════════ */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard"              element={<Dashboard />} />
          <Route path="/dashboard/resources"    element={<DashboardResources />} />
          <Route path="/dashboard/tech-hub"     element={<DashboardTechHub />} />
          <Route path="/profile"                element={<Profile />} />
          <Route path="/announcements"          element={<Announcements />} />
          <Route path="/certificates"           element={<MyCertificates />} />
          <Route path="/certificates/:id"       element={<CertificateView />} />
          <Route path="/dues"                   element={<Dues />} />
        </Route>

        {/* ════════════════════════════════════════════════
            ADMIN — same DashboardLayout, exec-only gate
            ════════════════════════════════════════════════ */}
        <Route
          element={
            <ProtectedRoute requireRole="exec">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
