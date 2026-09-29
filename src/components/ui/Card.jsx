/**
 * Card
 * Wraps children in a surface panel with standard border/radius/hover.
 * Pass `as="article"` or `as="li"` etc. for semantic overrides.
 */
export default function Card({ as: Tag = "div", className = "", children, ...props }) {
  return (
    <Tag className={`card${className ? ` ${className}` : ""}`} {...props}>
      {children}
    </Tag>
  );
}
