import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Executives() {
  const [execs, setExecs] = useState([]);
  useEffect(() => {
    supabase.from("executives").select("*").order("order_index")
      .then(({ data }) => setExecs(data || []));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-nacos-blue mb-6">Chapter Executives</h1>
      {execs.length === 0 ? <p className="text-gray-500">No executives added yet.</p> : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {execs.map((e) => (
            <div key={e.id} className="card p-4 text-center">
              <div className="h-24 w-24 mx-auto rounded-full bg-nacos-blue text-white flex items-center justify-center text-3xl font-bold">
                {e.name?.[0]}
              </div>
              <h3 className="mt-3 font-bold text-nacos-blue">{e.name}</h3>
              <p className="text-sm text-nacos-green font-semibold">{e.position}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}