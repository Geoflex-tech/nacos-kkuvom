import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export default function App() {
  const [status, setStatus] = useState("Checking...");

  useEffect(() => {
    supabase.auth.getSession().then(({ error }) => {
      setStatus(error ? "Error: " + error.message : "Supabase connected ✅");
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-nacos-blue text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">NACOS KKU VOM</h1>
        <p className="text-nacos-gold text-lg">{status}</p>
      </div>
    </div>
  );
}