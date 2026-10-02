import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Public
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Executives from "./pages/public/Executives";
import History from "./pages/public/History";
import AdministrationDetail from "./pages/public/AdministrationDetail";
import News from "./pages/public/News";
import NewsDetail from "./pages/public/NewsDetail";
import Events from "./pages/public/Events";
import Gallery from "./pages/public/Gallery";
import TechHub from "./pages/public/TechHub";
import Verify from "./pages/public/Verify";
import Opportunities from "./pages/public/Opportunities";
import Contact from "./pages/public/Contact";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import NotFound from "./pages/public/NotFound";
import ForgotPassword from "./pages/public/ForgotPassword";
import ResetPassword from "./pages/public/ResetPassword";
// Member portal
import Dashboard from "./pages/portal/Dashboard";
import Profile from "./pages/portal/Profile";
import Resources from "./pages/portal/Resources";
import Announcements from "./pages/portal/Announcements";
import MyCertificates from "./pages/portal/MyCertificates";
import CertificateView from "./pages/portal/CertificateView";
import Dues from "./pages/portal/Dues";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="min-h-[70vh]">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/executives" element={<Executives />} />
          <Route path="/history" element={<History />} />
          <Route path="/history/:id" element={<AdministrationDetail />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/tech-hub" element={<TechHub />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />

          {/* Member portal */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources"
            element={
              <ProtectedRoute>
                <Resources />
              </ProtectedRoute>
            }
          />
          <Route
            path="/announcements"
            element={
              <ProtectedRoute>
                <Announcements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/certificates"
            element={
              <ProtectedRoute>
                <MyCertificates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/certificates/:id"
            element={
              <ProtectedRoute>
                <CertificateView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dues"
            element={
              <ProtectedRoute>
                <Dues />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireRole="exec">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 — must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
