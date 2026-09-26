export default function Footer() {
  return (
    <footer className="bg-nacos-blue text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-2">NACOS KKU VOM Chapter</h3>
          <p className="text-sm text-white/80">
            Nigeria Association of Computer Science Students  Karl Kumm University, Vom Campus Chapter
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <ul className="text-sm space-y-1 text-white/80">
            <li><a href="/about" className="hover:text-nacos-gold">About</a></li>
            <li><a href="/executives" className="hover:text-nacos-gold">Executives</a></li>
            <li><a href="/news" className="hover:text-nacos-gold">News</a></li>
            <li><a href="/contact" className="hover:text-nacos-gold">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Connect</h4>
          <p className="text-sm text-white/80">Email: nacoskkuvom@gmail.com</p>
          <p className="text-sm text-white/80">Phone: +234 XXX XXX XXXX</p>
        </div>
      </div>
      <div className="border-t border-white/10 text-center text-xs py-4 text-white/60">
        © {new Date().getFullYear()} NACOS KKU VOM Chapter. Built by Geoflex.
      </div>
    </footer>
  );
}