/**
 * Executives — deprecated.
 * The /leadership page supersedes this one.
 * This component simply redirects any visitor to /leadership.
 */
import { Navigate } from "react-router-dom";

export default function Executives() {
  return <Navigate to="/leadership" replace />;
}
