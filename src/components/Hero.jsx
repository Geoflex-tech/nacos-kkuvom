import { Link } from "react-router-dom";
import { SOCIAL } from "../constants/social";

/* ---- Inline SVG icons (no external library needed) ---- */
const Icon = ({ children, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    {children}
  </svg>
);

const SOCIAL_ICONS = {
  instagram: (
    <Icon>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </Icon>
  ),
  twitter: (
    <Icon>
      <path d="M18 2h3l-7 8 8 12h-6l-5-7-6 7H2l8-9-8-11h6l5 6z" />
    </Icon>
  ),
  whatsapp: (
    <Icon>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </Icon>
  ),
  facebook: (
    <Icon>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </Icon>
  ),
  linkedin: (
    <Icon>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </Icon>
  ),
  tiktok: (
    <Icon>
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </Icon>
  ),
  youtube: (
    <Icon>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </Icon>
  ),
  email: (
    <Icon>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </Icon>
  ),
};

const SOCIAL_META = {
  instagram: { label: "Instagram", href: (v) => v },
  twitter: { label: "Twitter / X", href: (v) => v },
  whatsapp: { label: "WhatsApp", href: (v) => v },
  facebook: { label: "Facebook", href: (v) => v },
  linkedin: { label: "LinkedIn", href: (v) => v },
  tiktok: { label: "TikTok", href: (v) => v },
  youtube: { label: "YouTube", href: (v) => v },
  email: { label: "Email", href: (v) => `mailto:${v}` },
};

export default function Footer() {
  const year = new Date().getFullYear();

  // Only render platforms with a value
  const activeSocials = Object.entries(SOCIAL).filter(
    ([, value]) => value && value.trim()
  );

  return (
    <footer className="bg-gradient-to-br from-nacos-blue to-nacos-blue-dark text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <img
              src="/logo.png"
              alt="NACOS"
              className="h-10 w-10 object-contain"
            />
            <h3 className="font-bold text-lg">NACOS KKU VOM</h3>
          </div>
          <p className="text-sm text-white/85 max-w-md leading-relaxed mb-6">
            The Nigeria Association of Computing Students, Karl Kumm
            University, Vom Campus Chapter — building skills, community, and a
            legacy of excellence.
          </p>

          {/* Social icons — only shows filled-in platforms */}
          {activeSocials.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {activeSocials.map(([platform, value]) => {
                const meta = SOCIAL_META[platform];
                const icon = SOCIAL_ICONS[platform];
                if (!meta || !icon) return null;
                return (
                  <a
                    key={platform}
                    href={meta.href(value)}
                    target={platform === "email" ? undefined : "_blank"}
                    rel={platform === "email" ? undefined : "noreferrer"}
                    aria-label={meta.label}
                    title={meta.label}
                    className="h-10 w-10 rounded-full bg-white/10 hover:bg-nacos-gold hover:text-nacos-blue flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
                  >
                    {icon}
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Explore */}
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
                to="/opportunities"
                className="hover:text-nacos-gold transition"
              >
                Opportunities
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
          <p>© {year} NACOS KKU VOM Chapter. All rights reserved.</p>
          <p>Built with ❤️ by the Pioneer Administration</p>
        </div>
      </div>
    </footer>
  );
}