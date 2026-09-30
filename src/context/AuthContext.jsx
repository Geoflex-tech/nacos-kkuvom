import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async (id) => {
    const { data: profileRow } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    setProfile(profileRow);

    if (profileRow?.role) {
      const { data: perms } = await supabase
        .from("role_permissions")
        .select("permission_code")
        .eq("role", profileRow.role);
      setPermissions((perms || []).map((p) => p.permission_code));
    } else {
      setPermissions([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) loadUser(data.session.user.id);
      else setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s) loadUser(s.user.id);
      else {
        setProfile(null);
        setPermissions([]);
        setLoading(false);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, [loadUser]);

  const refreshProfile = useCallback(async () => {
    if (session?.user?.id) await loadUser(session.user.id);
  }, [session, loadUser]);

  const hasPermission = (code) => permissions.includes(code);

  const isAdmin =
    profile?.role === "admin" ||
    profile?.role === "president" ||
    profile?.role === "super_admin";
  const isExec = permissions.length > 0;
  const isMember = !!profile;

  return (
    <AuthContext.Provider
      value={{
        session,
        profile,
        permissions,
        loading,
        hasPermission,
        isAdmin,
        isExec,
        isMember,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
