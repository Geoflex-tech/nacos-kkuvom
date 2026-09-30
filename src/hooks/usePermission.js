import { useAuth } from "../context/AuthContext";

/**
 * Usage:
 *   const canCreate = usePermission("events.create");
 *   const canManage  = usePermission(["members.manage", "members.approve"], "any");
 */
export function usePermission(codes, mode = "any") {
  const { hasPermission } = useAuth();

  if (typeof codes === "string") return hasPermission(codes);

  if (Array.isArray(codes)) {
    if (mode === "all") return codes.every(hasPermission);
    return codes.some(hasPermission);
  }

  return false;
}