import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="max-w-2xl mx-auto px-4 py-24 text-center">
      <h1 className="text-6xl font-extrabold text-nacos-blue mb-4">404</h1>
      <h2 className="text-2xl font-bold text-nacos-blue mb-3">Page not found</h2>
      <p className="text-gray-600 mb-8">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link to="/" className="btn-primary">Go Home</Link>
        <Link to="/contact" className="btn-outline">Contact Us</Link>
      </div>
    </section>
  );
}
