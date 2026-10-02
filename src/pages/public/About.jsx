import { Link } from "react-router-dom";
import {
  Target,
  Eye,
  Users,
  Sparkles,
  Shield,
  Rocket,
  Heart,
  ArrowRight,
} from "lucide-react";

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-nacos-blue via-nacos-blue to-nacos-green text-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-nacos-gold/15 blur-3xl animate-float-slow" />
          <div className="absolute -bottom-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-white/10 blur-3xl animate-float" />
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 py-20 md:py-28 text-center">
          <span className="inline-block bg-white/15 backdrop-blur border border-white/25 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
            About Us
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight">
            NACOS KKU VOM Chapter
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            The Nigeria Association of Computing Students, Karl Kumm
            University, Vom Chapter — raising the next generation of Nigerian
            tech leaders.
          </p>
        </div>
      </section>

      {/* Who we are */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="card-flat p-8 md:p-10">
          <p className="section-eyebrow">Our Story</p>
          <h2 className="section-title mb-5">Who We Are</h2>
          <p className="text-gray-700 leading-relaxed mb-5">
            NACOS KKU VOM Chapter is the official student body representing
            Computing students at Karl Kumm University, Vom, Plateau State. We
            are a community of learners, builders, and innovators — united by
            a shared passion for technology and a commitment to excellence.
          </p>
          <p className="text-gray-700 leading-relaxed">
            As the <strong className="text-nacos-blue">Pioneer Administration</strong>{" "}
            of this chapter, we carry a unique responsibility: to lay the
            foundation upon which every future generation of NACOS KKU
            students will build. Our work today becomes the legacy of tomorrow.
          </p>
        </div>
      </section>

      {/* Mission + Vision */}
      <section className="bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-flat p-8 border-t-4 border-nacos-blue">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-nacos-blue flex items-center justify-center mb-5">
                <Target size={22} />
              </div>
              <p className="section-eyebrow">Our Mission</p>
              <h3 className="text-2xl font-bold text-nacos-blue mb-4">
                Build skills, community, and impact
              </h3>
              <p className="text-gray-700 leading-relaxed">
                To foster academic excellence, professional development, and
                technological innovation among Computing students — equipping
                our members with the skills, network, and mindset to thrive in
                the ever-evolving tech industry.
              </p>
            </div>

            <div className="card-flat p-8 border-t-4 border-nacos-green">
              <div className="h-12 w-12 rounded-xl bg-green-50 text-nacos-green flex items-center justify-center mb-5">
                <Eye size={22} />
              </div>
              <p className="section-eyebrow">Our Vision</p>
              <h3 className="text-2xl font-bold text-nacos-blue mb-4">
                A leading student tech community
              </h3>
              <p className="text-gray-700 leading-relaxed">
                To become a leading student tech community in Nigeria —
                renowned for producing world-class talent, driving innovation,
                and creating a lasting impact within Karl Kumm University and
                the broader Nigerian tech ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <p className="section-eyebrow">What We Stand For</p>
          <h2 className="section-title">Our Core Values</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              Icon: Rocket,
              title: "Excellence",
              desc: "We pursue the highest standards in academics, projects, and character.",
              color: "bg-blue-50 text-nacos-blue",
            },
            {
              Icon: Users,
              title: "Community",
              desc: "We grow together — no member is left behind in their journey.",
              color: "bg-green-50 text-nacos-green",
            },
            {
              Icon: Sparkles,
              title: "Innovation",
              desc: "We build, experiment, and solve real problems with technology.",
              color: "bg-yellow-50 text-yellow-700",
            },
            {
              Icon: Shield,
              title: "Integrity",
              desc: "We lead with honesty, transparency, and accountability.",
              color: "bg-purple-50 text-purple-700",
            },
            {
              Icon: Heart,
              title: "Service",
              desc: "We contribute to our department, university, and society.",
              color: "bg-pink-50 text-pink-700",
            },
            {
              Icon: Eye,
              title: "Legacy",
              desc: "We build systems that outlive our tenure and serve future generations.",
              color: "bg-indigo-50 text-indigo-700",
            },
          ].map((v) => (
            <div key={v.title} className="card p-6">
              <div
                className={`h-11 w-11 rounded-lg flex items-center justify-center mb-4 ${v.color}`}
              >
                <v.Icon size={20} />
              </div>
              <h3 className="font-bold text-nacos-blue text-lg mb-2">
                {v.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What we do */}
      <section className="bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <p className="section-eyebrow">Activities</p>
            <h2 className="section-title">What We Do</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "Organize workshops, seminars, and tech bootcamps",
              "Host coding competitions and hackathons",
              "Facilitate mentorship and career development",
              "Maintain a resource hub for past questions",
              "Represent student interests to the university",
              "Connect members with alumni and industry",
              "Document chapter history and institutional knowledge",
              "Issue verifiable certificates for training and achievements",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 card-flat p-4">
                <span className="text-nacos-gold font-bold mt-0.5 shrink-0">
                  ✓
                </span>
                <span className="text-gray-700 text-sm leading-relaxed">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pioneer note */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="rounded-3xl bg-gradient-to-br from-nacos-blue to-nacos-green text-white p-8 md:p-12 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-nacos-gold/20 blur-3xl" />
          <div className="relative">
            <p className="text-xs uppercase tracking-widest text-nacos-gold font-bold mb-3">
              A Note on Legacy
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
              The Pioneer Administration
            </h2>
            <p className="text-white/90 leading-relaxed mb-4">
              This is the founding administration of NACOS KKU VOM Chapter
              (2026/2027 session). Every system we build — the portal, the
              certificate registry, the resource hub, the chapter history — is
              designed to outlive our tenure.
            </p>
            <p className="text-white/90 leading-relaxed mb-6">
              When future administrations take over, they will inherit a
              functioning digital institution — not a blank slate. Every
              generation that follows will be able to look back and see exactly
              what we built, what we achieved, and how it all began.
            </p>
            <Link
              to="/history"
              className="inline-flex items-center gap-2 bg-white text-nacos-blue px-5 py-2.5 rounded-full font-semibold hover:shadow-lg transition"
            >
              Explore Chapter History <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="text-center">
          <p className="section-eyebrow">Join Us</p>
          <h2 className="section-title mb-4">Ready to be part of it?</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Register as a member, attend our events, and be part of building
            something that lasts.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/register" className="btn-primary text-base px-6 py-3">
              Create Account
            </Link>
            <Link to="/executives" className="btn-outline text-base px-6 py-3">
              Meet Our Executives
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}