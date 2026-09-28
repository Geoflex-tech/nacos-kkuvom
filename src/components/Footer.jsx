import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-nacos-blue text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <img src="/logo.jpeg" alt="NACOS" className="h-10 w-10 object-contain" />
            <h3 className="font-bold text-lg">NACOS KKU VOM</h3>
          </div>
          <p className="text-sm text-white/80 max-w-md">
            The Nigeria Association of Computer Science Students, Karl Kumm University,
            Vom Campus Chapter — building skills, community, and a legacy of excellence.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="text-sm space-y-2 text-white/80">
  <li><Link to="/about" className="hover:text-nacos-gold">About</Link></li>
  <li><Link to="/executives" className="hover:text-nacos-gold">Executives</Link></li>
  <li><Link to="/history" className="hover:text-nacos-gold">History</Link></li>
  <li><Link to="/news" className="hover:text-nacos-gold">News</Link></li>
  <li><Link to="/events" className="hover:text-nacos-gold">Events</Link></li>
  <li><Link to="/contact" className="hover:text-nacos-gold">Contact</Link></li>
</ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Get Involved</h4>
          <ul className="text-sm space-y-2 text-white/80">
            <li><Link to="/register" className="hover:text-nacos-gold">Register</Link></li>
            <li><Link to="/login" className="hover:text-nacos-gold">Member Login</Link></li>
            <li><Link to="/resources" className="hover:text-nacos-gold">Resources</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/60">
          <p>© {new Date().getFullYear()} NACOS KKU VOM Chapter. All rights reserved.</p>
          <p>Built with ❤️ by Geoflex</p>
        </div>
      </div>
    </footer>
  );
}