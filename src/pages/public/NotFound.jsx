import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";

export default function NotFound() {
  return (
    <section className="nf-page" aria-labelledby="nf-heading">

      {/* Big 404 */}
      <p className="nf-code" aria-hidden="true">404</p>

      {/* Heading */}
      <h1 id="nf-heading" className="nf-heading">Page not found</h1>

      <p className="nf-body">
        The page you're looking for doesn't exist, was moved, or the link may be broken.
      </p>

      {/* Actions */}
      <div className="nf-actions">
        <Link to="/" className="btn btn-primary nf-btn">
          <ArrowLeft size={15} aria-hidden="true" />
          Go Home
        </Link>
        <Link to="/contact" className="btn btn-secondary nf-btn">
          <Mail size={15} aria-hidden="true" />
          Contact Us
        </Link>
      </div>

      <style>{`
        .nf-page {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 80px 24px;
          max-width: 480px;
          margin-inline: auto;
        }

        .nf-code {
          font-size: clamp(5rem, 18vw, 9rem);
          font-weight: 700;
          color: var(--color-blue-light);
          line-height: 1;
          margin: 0 0 8px;
          letter-spacing: -4px;
          /* Overlay the number with a blue outline effect */
          -webkit-text-stroke: 3px var(--color-blue);
        }

        .nf-heading {
          font-size: clamp(1.375rem, 4vw, 1.875rem);
          font-weight: 700;
          color: var(--color-blue-dark);
          margin: 0 0 12px;
        }

        .nf-body {
          font-size: var(--text-base);
          color: var(--color-text-muted);
          line-height: 1.7;
          margin: 0 0 36px;
          max-width: 36ch;
        }

        .nf-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .nf-btn {
          min-width: 140px;
          justify-content: center;
        }

        @media (max-width: 480px) {
          .nf-page { padding: 56px 16px; }
          .nf-actions { flex-direction: column; width: 100%; }
          .nf-btn { width: 100%; }
        }
      `}</style>
    </section>
  );
}
