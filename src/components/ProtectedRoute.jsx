import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requireRole }) {
  const { isMember, isExec, isAdmin, loading } = useAuth();

  if (loading) return <div className="p-10 text-center text-gray-500">Loading...</div>;
  if (!isMember) return <Navigate to="/login" replace />;
  if (requireRole === "admin" && !isAdmin) return <Navigate to="/" replace />;
  if (requireRole === "exec" && !isExec) return <Navigate to="/" replace />;

  return children;
}