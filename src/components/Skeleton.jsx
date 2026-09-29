/**
 * Skeleton loading placeholders.
 *
 * Usage:
 *   <Skeleton />                     — inline block (default)
 *   <Skeleton variant="text" />      — single text line
 *   <Skeleton variant="card" />      — card placeholder with avatar + lines
 *   <Skeleton variant="avatar" />    — circular avatar
 *   <Skeleton width="100%" height={120} />  — custom dimensions
 *   <SkeletonGroup count={3} variant="card" />  — repeat N times
 */

import "./Skeleton.css";

export function Skeleton({ variant = "block", width, height, className = "" }) {
  const style = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  if (variant === "text") {
    return (
      <span
        className={`skeleton skeleton--text ${className}`}
        style={style}
        aria-hidden="true"
      />
    );
  }

  if (variant === "avatar") {
    return (
      <span
        className={`skeleton skeleton--avatar ${className}`}
        style={style}
        aria-hidden="true"
      />
    );
  }

  if (variant === "card") {
    return (
      <div className={`skeleton-card ${className}`} aria-hidden="true">
        <span className="skeleton skeleton--avatar skeleton-card__avatar" />
        <div className="skeleton-card__lines">
          <span className="skeleton skeleton--text skeleton-card__line skeleton-card__line--wide" />
          <span className="skeleton skeleton--text skeleton-card__line skeleton-card__line--mid" />
          <span className="skeleton skeleton--text skeleton-card__line skeleton-card__line--short" />
        </div>
      </div>
    );
  }

  // default "block"
  return (
    <span
      className={`skeleton skeleton--block ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

/**
 * Render `count` skeleton items of the given variant.
 */
export function SkeletonGroup({ count = 3, variant = "card", ...props }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} variant={variant} {...props} />
      ))}
    </>
  );
}
