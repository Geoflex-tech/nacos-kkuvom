import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Award, ArrowRight } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { DashPageStyles } from "./Announcements";

export default function MyCertificates() {
  const { session } = useAuth();
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    supabase
      .from("certificates")
      .select("*")
      .eq("member_id", session.user.id)
      .order("issued_date", { ascending: false })
      .then(({ data }) => {
        setItems(data || []);
        setLoading(false);
      });
  }, [session]);

  return (
    <div className="dp-wrap">
      <div className="dp-page-head">
        <div className="dp-page-icon" aria-hidden="true">
          <Award size={20} />
        </div>
        <div>
          <h1 className="dp-page-title">My Certificates</h1>
          <p className="dp-page-sub">
            Certificates issued to you by NACOS KKU Vom Chapter
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="dp-cert-grid" aria-busy="true">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="dp-card dp-card--skel" aria-hidden="true">
              <div className="dp-skel dp-skel--title" />
              <div className="dp-skel dp-skel--meta"  />
              <div className="dp-skel dp-skel--body"  />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && items.length === 0 && (
        <div className="dp-empty">
          <Award size={36} aria-hidden="true" style={{ color: "#D1D5DB", marginBottom: 12 }} />
          <p className="dp-empty-text">No certificates yet.</p>
          <p className="dp-empty-sub">
            Attend workshops, events, and chapter activities to earn certificates.
          </p>
        </div>
      )}

      {/* Grid */}
      {!loading && items.length > 0 && (
        <div className="dp-cert-grid">
          {items.map((c) => (
            <Link
              key={c.id}
              to={`/certificates/${c.id}`}
              className="dp-cert-card"
            >
              <div className="dp-cert-top">
                <div className="dp-cert-icon" aria-hidden="true">
                  <Award size={20} />
                </div>
                <span
                  className="dp-cert-status"
                  style={
                    c.status === "valid"
                      ? { background: "#D1FAE5", color: "#065F46" }
                      : { background: "#FEE2E2", color: "#991B1B" }
                  }
                >
                  {c.status}
                </span>
              </div>
              <h3 className="dp-cert-title">{c.title}</h3>
              {c.description && (
                <p className="dp-cert-desc">{c.description}</p>
              )}
              <p className="dp-cert-meta">{c.certificate_number}</p>
              <p className="dp-cert-meta" style={{ marginTop: 3 }}>
                Issued {new Date(c.issued_date).toDateString()}
              </p>
              <span className="dp-cert-cta">
                View certificate <ArrowRight size={12} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      )}

      <DashPageStyles />
    </div>
  );
}
