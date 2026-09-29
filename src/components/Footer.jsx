import { Link } from "react-router-dom";

const explore = [
  { to: "/about",         label: "About"        },
  { to: "/executives",    label: "Executives"   },
  { to: "/history",       label: "History"      },
  { to: "/news",          label: "News"         },
  { to: "/events",        label: "Events"       },
  { to: "/gallery",       label: "Gallery"      },
  { to: "/opportunities", label: "Opportunities"},
];

const getInvolved = [
  { to: "/register",  label: "Register"          },
  { to: "/login",     label: "Member Login"       },
  { to: "/dashboard", label: "Member Portal"      },
  { to: "/verify",    label: "Verify Certificate" },
  { to: "/contact",   label: "Contact"            },
];

export default function Footer() {
  return (
    <footer
      style={{ background: "var(--color-footer)", marginTop: "auto" }}
      aria-label="Site footer"
    >
      <div
        className="container footer-grid"
        style={{
          paddingBlock: "var(--space-8)",
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr",
          gap: "var(--space-6)",
        }}
      >
        {/* Brand */}
        <div>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "var(--space-2)", textDecoration: "none" }}>
            <img src="/logo.jpeg" alt="" aria-hidden="true"
              style={{ width: "2.5rem", height: "2.5rem", borderRadius: "50%", objectFit: "contain" }} />
            <span style={{ fontWeight: "var(--weight-bold)", fontSize: "var(--text-md)", color: "#fff" }}>
              NACOS <span style={{ color: "#FCD34D" }}>KKU VOM</span>
            </span>
          </Link>
          <p style={{ fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.70)", lineHeight: 1.7, maxWidth: "36ch" }}>
            The Nigeria Association of Computing Students, Karl Kumm University, Vom Campus Chapter — building skills, community, and a legacy of excellence.
          </p>
        </div>

        {/* Explore */}
        <nav aria-label="Explore links">
          <h3 style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "#fff", marginBottom: "var(--space-2)" }}>Explore</h3>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }} role="list">
            {explore.map((l) => (
              <li key={l.to}>
                <Link to={l.to}
                  style={{ fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.65)", transition: "color 150ms ease-out" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#FCD34D"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Get Involved */}
        <nav aria-label="Get involved links">
          <h3 style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "#fff", marginBottom: "var(--space-2)" }}>Get Involved</h3>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }} role="list">
            {getInvolved.map((l) => (
              <li key={l.to}>
                <Link to={l.to}
                  style={{ fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.65)", transition: "color 150ms ease-out" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#FCD34D"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Divider + copyright */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
        <div className="container" style={{ paddingBlock: "var(--space-2)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "var(--space-1)" }}>
          <p style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.45)" }}>
            © {new Date().getFullYear()} NACOS KKU VOM Chapter. All rights reserved.
          </p>
          <p style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.45)" }}>
            Built with ♥ by the Pioneer Administration
          </p>
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          .footer-grid{grid-template-columns:1fr 1fr!important;}
          .footer-grid>div:first-child{grid-column:1/-1;}
        }
        @media(max-width:480px){
          .footer-grid{grid-template-columns:1fr!important;}
        }
      `}</style>
    </footer>
  );
}
