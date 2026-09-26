import { BrowserRouter, Routes, Route } from "react-router-dom";
import NewsDetail from "./pages/public/NewsDetail";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Executives from "./pages/public/Executives";
import News from "./pages/public/News";
import Events from "./pages/public/Events";
import Gallery from "./pages/public/Gallery";
import Contact from "./pages/public/Contact";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";

import Dashboard from "./pages/portal/Dashboard";
import Profile from "./pages/portal/Profile";
import Resources from "./pages/portal/Resources";
import Announcements from "./pages/portal/Announcements";

import AdminDashboard from "./pages/admin/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="min-h-[70vh]">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/executives" element={<Executives />} />
          <Route path="/news" element={<News />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Member portal */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
          <Route path="/announcements" element={<ProtectedRoute><Announcements /></ProtectedRoute>} />

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