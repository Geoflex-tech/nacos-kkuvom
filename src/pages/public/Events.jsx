import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Events() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    supabase.from("events").select("*").order("event_date")
      .then(({ data }) => setItems(data || []));
  }, []);
  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-nacos-blue mb-6">Events</h1>
      {items.length === 0 ? <p className="text-gray-500">No events yet.</p> : (
        <div className="space-y-6">
          {items.map((ev) => (
            <div key={ev.id} className="card p-5">
              <p className="text-xs text-nacos-green font-bold uppercase">{new Date(ev.event_date).toDateString()}</p>
              <h2 className="text-xl font-semibold text-nacos-blue mt-1">{ev.title}</h2>
              <p className="text-sm text-gray-500">{ev.location}</p>
              <p className="text-gray-700 mt-2">{ev.description}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}