import { BrowserRouter, Routes, Route } from "react-router-dom";
import NewsDetail from "./pages/public/NewsDetail";
import Dues from "./pages/portal/Dues";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/public/NotFound";
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Executives from "./pages/public/Executives";
import News from "./pages/public/News";
import Events from "./pages/public/Events";
import Gallery from "./pages/public/Gallery";
import Contact from "./pages/public/Contact";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import History from "./pages/public/History";
import AdministrationDetail from "./pages/public/AdministrationDetail";
import Dashboard from "./pages/portal/Dashboard";
import Profile from "./pages/portal/Profile";
import Resources from "./pages/portal/Resources";
import Announcements from "./pages/portal/Announcements";
import Verify from "./pages/public/Verify";
import AdminDashboard from "./pages/admin/AdminDashboard";
import MyCertificates from "./pages/portal/MyCertificates";
import CertificateView from "./pages/portal/CertificateView";
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="min-h-[70vh]">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
          <Route path="/dues" element={<ProtectedRoute><Dues /></ProtectedRoute>} />
          <Route path="/about" element={<About />} />
          <Route path="/executives" element={<Executives />} />
          <Route path="/news" element={<News />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/history" element={<History />} />
          <Route path="/administration/:id" element={<AdministrationDetail />} />
          <Route path="/verify" element={<Verify />} />
          {/* Member portal */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
          <Route path="/announcements" element={<ProtectedRoute><Announcements /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
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

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireRole="exec">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
