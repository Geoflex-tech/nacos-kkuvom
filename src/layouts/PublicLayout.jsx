/**
 * PublicLayout
 *
 * Wraps every public-facing page with the floating pill Navbar and Footer.
 * The `main` element carries the paddingTop that clears the fixed navbar pill.
 *
 * Used by: Home, About, History, Leadership, Executives, News, Events,
 *          Gallery, Contact, Verify, NotFound, and the 404 fallback.
 */
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PublicLayout() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navbar />
      {/*
        No paddingTop here — every page handles its own top spacing:
        - Hero pages use a negative marginTop to slide under the fixed pill.
        - Inner pages use <PageHeader> which has its own margin-top + padding-top
          (both already account for env(safe-area-inset-top)).
        Adding paddingTop here would double-count the offset on hero pages.
      */}
      <main id="main-content" className="min-h-[70vh]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
