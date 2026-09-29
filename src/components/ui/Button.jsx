import { forwardRef } from "react";
import { Link } from "react-router-dom";

/**
 * Button
 * variant: "primary" | "secondary" | "ghost"
 * as: "button" | "a" | Link (pass `to` for router link)
 */
const Button = forwardRef(function Button(
  {
    variant = "primary",
    to,
    href,
    children,
    className = "",
    disabled,
    ...props
  },
  ref
) {
  const base = `btn btn-${variant}${className ? ` ${className}` : ""}`;

  if (to) {
    return (
      <Link ref={ref} to={to} className={base} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a ref={ref} href={href} className={base} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button ref={ref} className={base} disabled={disabled} {...props}>
      {children}
    </button>
  );
});

export default Button;
