import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-nacos-blue to-nacos-blue-dark text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
        {/* Brand column */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <img
              src="/logo.png"
              alt="NACOS"
              className="h-10 w-10 object-contain"
            />
            <h3 className="font-bold text-lg">NACOS KKU VOM</h3>
          </div>
          <p className="text-sm text-white/85 max-w-md leading-relaxed">
            The Nigeria Association of Computing Students, Karl Kumm
            University, Vom Campus Chapter — building skills, community, and a
            legacy of excellence.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-3">Explore</h4>
          <ul className="text-sm space-y-2 text-white/85">
            <li>
              <Link to="/about" className="hover:text-nacos-gold transition">
                About
              </Link>
            </li>
            <li>
              <Link
                to="/executives"
                className="hover:text-nacos-gold transition"
              >
                Executives
              </Link>
            </li>
            <li>
              <Link to="/history" className="hover:text-nacos-gold transition">
                History
              </Link>
            </li>
            <li>
              <Link to="/news" className="hover:text-nacos-gold transition">
                News
              </Link>
            </li>
            <li>
              <Link to="/events" className="hover:text-nacos-gold transition">
                Events
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="hover:text-nacos-gold transition">
                Gallery
              </Link>
            </li>
          </ul>
        </div>

        {/* Get Involved */}
        <div>
          <h4 className="font-semibold mb-3">Get Involved</h4>
          <ul className="text-sm space-y-2 text-white/85">
            <li>
              <Link
                to="/register"
                className="hover:text-nacos-gold transition"
              >
                Register
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-nacos-gold transition">
                Member Login
              </Link>
            </li>
            <li>
              <Link
                to="/tech-hub"
                className="hover:text-nacos-gold transition"
              >
                Tech Hub
              </Link>
            </li>
            <li>
              <Link
                to="/verify"
                className="hover:text-nacos-gold transition"
              >
                Verify Certificate
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-nacos-gold transition"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/60">
          <p>
            © {new Date().getFullYear()} NACOS KKU VOM Chapter. All rights
            reserved.
          </p>
          <p>
            Built with ❤️ by the Pioneer Administration
          </p>
        </div>
      </div>
    </footer>
  );
}
