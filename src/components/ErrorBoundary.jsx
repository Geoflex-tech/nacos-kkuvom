/**
 * ErrorBoundary — catches unhandled render errors and shows a fallback UI
 * instead of a blank screen.
 *
 * Usage (class-based, required for componentDidCatch):
 *
 *   <ErrorBoundary>
 *     <SomePage />
 *   </ErrorBoundary>
 *
 *   // Custom fallback:
 *   <ErrorBoundary fallback={<p>Something went wrong.</p>}>
 *     <SomePage />
 *   </ErrorBoundary>
 *
 *   // Reset boundary from outside using a key:
 *   <ErrorBoundary key={location.pathname}>
 *     <SomePage />
 *   </ErrorBoundary>
 */

import { Component } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to console in dev; swap for a real error reporter (Sentry etc.) in prod
    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary] Uncaught error:", error, info.componentStack);
    }
  }

  handleReset() {
    this.setState({ hasError: false, error: null });
  }

  render() {
    const { hasError, error } = this.state;
    const { fallback, children } = this.props;

    if (!hasError) return children;

    // Custom fallback supplied by parent
    if (fallback) return fallback;

    // Default fallback UI
    return (
      <section className="eb-page" role="alert" aria-live="assertive">
        <span className="eb-icon" aria-hidden="true">
          <AlertTriangle size={48} strokeWidth={1.5} />
        </span>

        <h1 className="eb-heading">Something went wrong</h1>

        <p className="eb-body">
          An unexpected error occurred while rendering this page.
          {import.meta.env.DEV && error?.message && (
            <span className="eb-detail"> ({error.message})</span>
          )}
        </p>

        <div className="eb-actions">
          <button
            type="button"
            className="btn btn-primary eb-btn"
            onClick={this.handleReset}
          >
            <RefreshCw size={15} aria-hidden="true" />
            Try again
          </button>
          <Link to="/" className="btn btn-secondary eb-btn">
            Go to homepage
          </Link>
        </div>

        <style>{`
          .eb-page {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 80px 24px;
            max-width: 480px;
            margin-inline: auto;
          }
          .eb-icon {
            color: var(--color-yellow, #f59e0b);
            margin-bottom: 16px;
          }
          .eb-heading {
            font-size: clamp(1.25rem, 4vw, 1.75rem);
            font-weight: 700;
            color: var(--color-blue-dark);
            margin: 0 0 10px;
          }
          .eb-body {
            font-size: var(--text-base);
            color: var(--color-text-muted);
            line-height: 1.7;
            margin: 0 0 32px;
          }
          .eb-detail {
            display: block;
            margin-top: 6px;
            font-family: monospace;
            font-size: 0.8em;
            color: #dc2626;
          }
          .eb-actions {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            justify-content: center;
          }
          .eb-btn { min-width: 140px; justify-content: center; }
          @media (max-width: 480px) {
            .eb-page { padding: 56px 16px; }
            .eb-actions { flex-direction: column; width: 100%; }
            .eb-btn { width: 100%; }
          }
        `}</style>
      </section>
    );
  }
}
