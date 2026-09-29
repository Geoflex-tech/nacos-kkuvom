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
        paddingTop clears the fixed floating pill for plain pages
        (Verify, NotFound, NewsDetail, Executives, etc.) that don't
        have their own PageHeader or Hero.

        Hero and PageHeader both apply a negative margin-top equal to
        this value so they slide up behind the pill instead.

        Formula: env(safe-area-inset-top) + 10px offset + 52px pill + 16px gap = 78px
      */}
      <main
        id="main-content"
        className="min-h-[70vh]"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 10px + 52px + 16px)" }}
      >
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
