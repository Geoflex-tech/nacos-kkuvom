import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requireRole, requirePermission }) {
  const { isMember, isExec, isAdmin, hasPermission, loading } = useAuth();

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading...</div>;
  }

  // Must be logged in
  if (!isMember) return <Navigate to="/login" replace />;

  // Role-level check (kept for backwards compatibility)
  if (requireRole === "admin" && !isAdmin) return <Navigate to="/dashboard" replace />;
  if (requireRole === "exec" && !isExec) return <Navigate to="/dashboard" replace />;

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