import { Link } from "react-router-dom";

export default function About() {
  return (
    <>
      <section className="bg-gradient-to-br from-nacos-blue to-nacos-green text-white">
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">About NACOS KKU VOM CHAPTER</h1>
          <p className="text-white/85 text-lg max-w-2xl mx-auto">
            The Nigeria Association of Computer Science Students, Karl Kumm University,
            Vom Campus Chapter — uniting students, building skills, shaping the future of tech.
          </p>
        </div>
      </section>
      <div>
  <h2 className="text-2xl font-bold text-nacos-blue mb-4">Where We Are</h2>
  <div className="card p-6 space-y-2">
    <p className="text-gray-700">
      <span className="font-semibold text-nacos-blue">Location:</span>{" "}
      Karl Kumm University, Vom,Jos South Plateau State, Nigeria
    </p>
    <p className="text-gray-700">
      <span className="font-semibold text-nacos-blue">Email:</span>{" "}
      <a href="mailto:nacoskkuvom@gmail.com" className="text-nacos-green hover:underline">
        nacoskkuvom@gmail.com
      </a>
    </p>
    <p className="text-gray-700">
      <span className="font-semibold text-nacos-blue">Phone:</span> 0908 485 0109
    </p>
  </div>
</div>

      <section className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        <div>
          <h2 className="text-2xl font-bold text-nacos-blue mb-4">Who We Are</h2>
          <p className="text-gray-700 leading-relaxed">
            NACOS KKU VOM Chapter is the official student body representing Computer Science
            students at Karl Kumm University, Vom Campus. We are a community of learners,
            builders, and innovators committed to excellence in technology, academics, and
            leadership.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-nacos-blue mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            To foster academic excellence, professional development, and technological
            innovation among Computer Science students — equipping our members with the
            skills, network, and mindset to thrive in the ever-evolving tech industry.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-nacos-blue mb-4">Our Vision</h2>
          <p className="text-gray-700 leading-relaxed">
            To be a leading student chapter renowned for producing world-class tech talents,
            driving innovation, and creating a lasting impact within the university and the
            wider Nigerian tech ecosystem.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-nacos-blue mb-4">What We Do</h2>
          <ul className="grid md:grid-cols-2 gap-4">
            {[
              "Organize workshops, seminars, and tech bootcamps",
              "Host coding competitions and hackathons",
              "Facilitate mentorship and career development",
              "Provide a resource hub for past questions and materials",
              "Represent student interests to the department and university",
              "Connect members with alumni and industry professionals",
            ].map((item, i) => (
              <li key={i} className="card p-4 flex items-start gap-3">
                <span className="text-nacos-gold font-bold mt-0.5">✓</span>
                <span className="text-gray-700 text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-8 text-center bg-gray-50">
          <h2 className="text-2xl font-bold text-nacos-blue mb-3">Join the Chapter</h2>
          <p className="text-gray-600 mb-6">
            Are you a Computer Science student at KKU Vom? Become a registered member today.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/register" className="btn-primary">Register Now</Link>
            <Link to="/executives" className="btn-outline">Meet Our Executives</Link>
          </div>
        </div>
      </section>
    </>
  );
}