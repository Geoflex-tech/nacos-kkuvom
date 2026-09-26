import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-nacos-blue via-nacos-blue to-nacos-green text-white">
      <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-block bg-nacos-gold text-nacos-blue text-xs font-bold px-3 py-1 rounded-full mb-4">
            Official Chapter Website
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Welcome to <span className="text-nacos-gold">NACOS KKU VOM</span> Chapter
          </h1>
          <p className="text-white/85 mb-6 text-lg">
           Uniting Computer Science students of Karl Kumm University, Vom Campus  building skills, community, and a legacy of excellence.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/about" className="bg-nacos-gold text-nacos-blue px-5 py-2.5 rounded-md font-semibold hover:opacity-90">
              Learn More
            </Link>
            <Link to="/executives" className="border border-white/40 px-5 py-2.5 rounded-md font-semibold hover:bg-white/10">
              Meet Executives
            </Link>
          </div>
        </div>
        <div className="hidden md:flex justify-center">
          <div className="h-48 w-48 rounded-full bg-white/10 border-4 border-nacos-gold flex items-center justify-center text-6xl font-bold">
            N
          </div>
        </div>
      </div>
    </section>
  );
}