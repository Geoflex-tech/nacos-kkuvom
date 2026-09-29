import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute
 *
 * Redirects unauthenticated visitors to /login, preserving the intended path
 * as a `returnTo` query param so the login page can redirect back after sign-in.
 *
 * Props:
 *   requireRole       — "admin" | "exec" (role-level gate)
 *   requirePermission — string | string[] (permission-code gate)
 */
export default function ProtectedRoute({ children, requireRole, requirePermission }) {
  const { isMember, isExec, isAdmin, hasPermission, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading...</div>;
  }

  // Not logged in — redirect to /login with returnTo
  if (!isMember) {
    const returnTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?returnTo=${returnTo}`} replace />;
  }

  // Role-level check (backwards compatibility)
  if (requireRole === "admin" && !isAdmin) return <Navigate to="/dashboard" replace />;
  if (requireRole === "exec"  && !isExec)  return <Navigate to="/dashboard" replace />;

  // Permission-level check (preferred, more granular)
  if (requirePermission) {
    const codes = Array.isArray(requirePermission)
      ? requirePermission
      : [requirePermission];
    const ok = codes.some(hasPermission);
    if (!ok) return <Navigate to="/dashboard" replace />;
  }

  return children;
}
