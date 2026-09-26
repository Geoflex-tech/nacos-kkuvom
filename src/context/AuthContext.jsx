import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) loadProfile(data.session.user.id);
      else setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s) loadProfile(s.user.id);
      else { setProfile(null); setLoading(false); }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const loadProfile = async (id) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", id).single();
    setProfile(data);
    setLoading(false);
  };

  const isAdmin = profile?.role === "admin";
  const isExec = profile?.role === "exec" || isAdmin;
  const isMember = !!profile;

  return (
    <AuthContext.Provider value={{ session, profile, loading, isAdmin, isExec, isMember }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);