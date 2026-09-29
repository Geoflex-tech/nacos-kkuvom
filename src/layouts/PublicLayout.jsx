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
        paddingTop clears the fixed floating pill:
          14px top offset + 52px pill height + 16px gap = 82px
        Must match the value used inside PageHeader's margin-top.
      */}
      <main
        id="main-content"
        className="min-h-[70vh]"
        style={{ paddingTop: "calc(14px + 52px + 16px)" }}
      >
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
