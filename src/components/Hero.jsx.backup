import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-nacos-blue via-nacos-blue to-nacos-green">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-nacos-gold/15 blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 -right-32 w-[28rem] h-[28rem] rounded-full bg-white/10 blur-3xl animate-float" />
        <div className="absolute -bottom-32 left-1/3 w-80 h-80 rounded-full bg-nacos-gold/10 blur-3xl animate-float-slow" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="text-white text-center lg:text-left animate-fade-in-up">
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/25 text-xs md:text-sm font-semibold px-3 py-1.5 rounded-full mb-6">
              <Sparkles size={14} className="text-nacos-gold" />
              Official Chapter Portal · 2026/2027
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight mb-6">
              Welcome to{" "}
              <span className="text-gradient">NACOS KKU VOM</span>{" "}
              Chapter
            </h1>

            <p className="text-white/90 text-lg md:text-xl mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              The official digital home of Computing students at Karl Kumm
              University, Vom. Building skills, community, and a legacy of
              excellence — one generation at a time.
            </p>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <Link
                to="/register"
                className="btn-gold text-base px-6 py-3 inline-flex items-center gap-2"
              >
                Join NACOS
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/tech-hub"
                className="inline-flex items-center gap-2 border-2 border-white/40 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/15 transition-all duration-200"
              >
                Explore Tech Hub
              </Link>
            </div>

            <p className="text-white/70 text-sm mt-8">
              Free to join · Open to all Computing students
            </p>
          </div>

          {/* Logo visual */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute inset-0 bg-nacos-gold/30 rounded-full blur-3xl animate-pulse" />
              <div className="relative h-64 w-64 md:h-80 md:w-80 rounded-full bg-white/10 backdrop-blur border-2 border-white/30 flex items-center justify-center p-8">
                <img
                  src="/logo.png"
                  alt="NACOS KKU VOM"
                  className="h-full w-full object-contain rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-8 md:h-12"
        >
          <path
            d="M0 30L60 25C120 20 240 10 360 10C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0V30Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
