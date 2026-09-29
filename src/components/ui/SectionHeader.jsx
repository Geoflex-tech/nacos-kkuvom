/**
 * SectionHeader
 * eyebrow  — small uppercase label (accent color)
 * heading  — main title
 * sub      — optional muted subtitle sentence
 * center   — center-align (default: left)
 */
export default function SectionHeader({ eyebrow, heading, sub, center = false }) {
  const align = center ? "text-center items-center" : "";
  return (
    <div className={`flex flex-col gap-1 ${align}`}>
      {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
      {heading && <h2 className="section-heading">{heading}</h2>}
      {sub && <p className="section-sub">{sub}</p>}
    </div>
  );
}
