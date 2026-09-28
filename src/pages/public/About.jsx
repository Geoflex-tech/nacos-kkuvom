import { Link } from "react-router-dom";

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-nacos-blue to-nacos-green text-white">
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <p className="text-sm uppercase tracking-widest text-white/70 mb-3">
            About Us
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            NACOS KKU VOM Chapter
          </h1>
          <p className="text-white/85 text-lg max-w-2xl mx-auto">
            The Nigeria Association of Computing Students,
            Karl Kumm University, Vom Chapter — raising the next generation of
            Nigerian tech leaders.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16 space-y-14">
        {/* Who we are */}
        <div>
          <h2 className="text-2xl font-bold text-nacos-blue mb-4">Who We Are</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            NACOS KKU VOM Chapter is the official student body representing
            Computing students at Karl Kumm University, Vom, Plateau State.
            We are a community of learners, builders, and innovators — united
            by a shared passion for technology and a commitment to excellence.
          </p>
          <p className="text-gray-700 leading-relaxed">
            As the <strong>pioneer administration</strong> of this chapter, we
            carry a unique responsibility: to lay the foundation upon which
            every future generation of NACOS KKU students will build. Our work
            today becomes the legacy of tomorrow.
          </p>
        </div>

        {/* Mission */}
        <div className="card p-6 border-l-4 border-nacos-gold">
          <h2 className="text-2xl font-bold text-nacos-blue mb-3">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            To foster academic excellence, professional development, and
            technological innovation among Computing students — equipping our
            members with the skills, network, and mindset to thrive in the
            ever-evolving tech industry.
          </p>
        </div>

        {/* Vision */}
        <div className="card p-6 border-l-4 border-nacos-green">
          <h2 className="text-2xl font-bold text-nacos-blue mb-3">Our Vision</h2>
          <p className="text-gray-700 leading-relaxed">
            To become a leading student tech community in Nigeria — renowned
            for producing world-class talent, driving innovation, and creating
            a lasting impact within Karl Kumm University and the broader
            Nigerian tech ecosystem.
          </p>
        </div>

        {/* Core values */}
        <div>
          <h2 className="text-2xl font-bold text-nacos-blue mb-5">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: "Excellence",
                desc: "We pursue the highest standards in academics, projects, and character.",
              },
              {
                title: "Community",
                desc: "We grow together — no member is left behind in their journey.",
              },
              {
                title: "Innovation",
                desc: "We build, we experiment, we solve real problems with technology.",
              },
              {
                title: "Integrity",
                desc: "We lead with honesty, transparency, and accountability.",
              },
              {
                title: "Service",
                desc: "We contribute to our department, university, and society.",
              },
              {
                title: "Legacy",
                desc: "We build systems that outlive our tenure and serve future generations.",
              },
            ].map((v, i) => (
              <div key={i} className="card p-5">
                <h3 className="font-bold text-nacos-blue mb-1">{v.title}</h3>
                <p className="text-sm text-gray-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What we do */}
        <div>
          <h2 className="text-2xl font-bold text-nacos-blue mb-5">What We Do</h2>
          <ul className="grid md:grid-cols-2 gap-3">
            {[
              "Organize workshops, seminars, and tech bootcamps",
              "Host coding competitions and hackathons",
              "Facilitate mentorship and career development",
              "Maintain a resource hub for past questions and study materials",
              "Represent student interests to the department and university",
              "Connect members with alumni and industry professionals",
              "Document chapter history and institutional knowledge",
              "Issue verifiable certificates for training and achievements",
            ].map((item, i) => (
              <li key={i} className="card p-4 flex items-start gap-3">
                <span className="text-nacos-gold font-bold mt-0.5">✓</span>
                <span className="text-gray-700 text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pioneer note */}
        <div className="card p-6 bg-gradient-to-br from-nacos-blue/5 to-nacos-green/5 border-2 border-nacos-gold/40">
          <p className="text-xs uppercase tracking-widest text-nacos-green font-bold mb-2">
            A Note on Legacy
          </p>
          <h2 className="text-2xl font-bold text-nacos-blue mb-3">
            The Pioneer Administration
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            This is the founding administration of NACOS KKU VOM Chapter
            (2026/2027 session). Every system we build — the portal, the
            certificate registry, the resource hub, the chapter history — is
            designed to outlive our tenure.
          </p>
          <p className="text-gray-700 leading-relaxed">
            When future administrations take over, they will inherit a
            functioning digital institution — not a blank slate. And every
            generation that follows will be able to look back and see exactly
            what we built, what we achieved, and how it all began.
          </p>
          <Link
            to="/history"
            className="inline-block mt-5 text-nacos-green font-semibold hover:underline"
          >
            Explore Chapter History →
          </Link>
        </div>

        {/* Where we are */}
        <div>
          <h2 className="text-2xl font-bold text-nacos-blue mb-4">
            Where We Are
          </h2>
          <div className="card p-6 space-y-2">
            <p className="text-gray-700">
              <span className="font-semibold text-nacos-blue">Location:</span>{" "}
              Karl Kumm University, Vom, Plateau State, Nigeria
            </p>
            <p className="text-gray-700">
              <span className="font-semibold text-nacos-blue">Email:</span>{" "}
              <a
                href="mailto:nacoskkuvom@gmail.com"
                className="text-nacos-green hover:underline"
              >
                nacoskkuvom@gmail.com
              </a>
            </p>
            <p className="text-gray-700">
              <span className="font-semibold text-nacos-blue">Phone:</span>{" "}
              0908 485 0109
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="card p-8 text-center bg-gradient-to-br from-nacos-blue to-nacos-green text-white">
          <h2 className="text-2xl font-bold mb-3">Join the Chapter</h2>
          <p className="text-white/85 mb-6 max-w-md mx-auto">
            Are you a Computing student at Karl Kumm University? Become a
            registered member today and be part of the foundation.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/register"
              className="bg-nacos-gold text-nacos-blue px-5 py-2.5 rounded-md font-semibold hover:opacity-90"
            >
              Register Now
            </Link>
            <Link
              to="/executives"
              className="border border-white/40 px-5 py-2.5 rounded-md font-semibold hover:bg-white/10"
            >
              Meet Our Executives
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
