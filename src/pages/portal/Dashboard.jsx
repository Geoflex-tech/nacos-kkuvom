import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  BookOpen,
  Megaphone,
  Wallet,
  Award,
  Calendar,
  ArrowRight,
} from "lucide-react";
import {
  User,
  BookOpen,
  Megaphone,
  Wallet,
  Award,
  Calendar,
  ArrowRight,
  Briefcase,
  FolderKanban,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const { profile, session } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);

  useEffect(() => {
    (async () => {
      const { data: events } = await supabase
        .from("events")
        .select("*")
        .gte("event_date", new Date().toISOString())
        .order("event_date", { ascending: true })
        .limit(3);
      setUpcomingEvents(events || []);

      const { data: anns } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      setRecentAnnouncements(anns || []);
    })();
  }, [session]);

  const initials = (profile?.full_name || profile?.email || "M")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const actions = [
    {
      to: "/profile",
      label: "Edit Profile",
      desc: "Update your info",
      Icon: User,
      color: "bg-blue-50 text-nacos-blue",
    },
    {
      to: "/resources",
      label: "Resources",
      desc: "Past questions & materials",
      Icon: BookOpen,
      color: "bg-green-50 text-nacos-green",
    },
    {
      to: "/announcements",
      label: "Announcements",
      desc: "Chapter news & updates",
      Icon: Megaphone,
      color: "bg-yellow-50 text-yellow-700",
    },
    {
      to: "/certificates",
      label: "My Certificates",
      desc: "View & print your certificates",
      Icon: Award,
      color: "bg-purple-50 text-purple-700",
    },
    {
      to: "/dues",
      label: "Pay Dues",
      desc: profile?.dues_paid ? "Paid ✅" : "Click to pay",
      Icon: Wallet,
      color: "bg-orange-50 text-orange-700",
    },
  ];

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      {/* Welcome header */}
      <div className="bg-gradient-to-br from-nacos-blue to-nacos-green text-white rounded-2xl p-6 md:p-8 mb-8">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-white/15 backdrop-blur border-2 border-nacos-gold flex items-center justify-center text-2xl md:text-3xl font-bold shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-white/70 text-sm">Welcome back,</p>
            <h1 className="text-2xl md:text-3xl font-bold truncate">
              {profile?.full_name || "Member"}
            </h1>
            <p className="text-white/80 text-sm mt-1">
              NACOS KKU VOM Chapter · Member Portal
            </p>
          </div>
        </div>
      </div>

      {/* Membership stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Matric No.
          </p>
          <p className="text-lg font-bold text-nacos-blue mt-1">
            {profile?.matric_no || "—"}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Level</p>
          <p className="text-lg font-bold text-nacos-blue mt-1">
            {profile?.level || "—"}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Membership Status
          </p>
          <p className="mt-1">
            <span
              className={`inline-block text-sm font-bold px-3 py-1 rounded-full ${
                profile?.status === "approved"
                  ? "bg-green-100 text-green-700"
                  : profile?.status === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {profile?.status || "pending"}
            </span>
          </p>
        </div>
      </div>

      {/* Quick actions */}
      
      <div className="mb-8">
        <h2 className="text-lg font-bold text-nacos-blue mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map(({ to, label, desc, Icon, color }) => (
        {
  to: "/my-projects",
  label: "My Projects",
  desc: "Submit your work to the showcase",
  Icon: FolderKanban,
  color: "bg-pink-50 text-pink-700",
},
      <Link
              key={to}
              to={to}
              className="card p-5 flex items-center gap-4 hover:shadow-md group"
            >
              <div
                className={`h-12 w-12 rounded-lg flex items-center justify-center shrink-0 ${color}`}
              >
                <Icon size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-nacos-blue truncate">{label}</p>
                <p className="text-xs text-gray-500 truncate">{desc}</p>
              </div>
              <ArrowRight
                size={18}
                className="text-gray-300 group-hover:text-nacos-blue transition shrink-0"
              />
            </Link>
          ))}
        </div>
      </div>
      
      {/* Two-column: upcoming events + announcements */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Upcoming events */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-nacos-blue">Upcoming Events</h2>
            <Link
              to="/events"
              className="text-xs text-nacos-green font-semibold hover:underline"
            >
              View all
            </Link>
          </div>
          {upcomingEvents.length === 0 ? (
            <div className="card p-5 text-center text-sm text-gray-500">
              No upcoming events.
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((e) => (
                <div key={e.id} className="card p-4 flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-nacos-blue text-white flex items-center justify-center shrink-0">
                    <Calendar size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-nacos-blue truncate">
                      {e.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(e.event_date).toDateString()}
                      {e.location ? ` · ${e.location}` : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Announcements */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-nacos-blue">Announcements</h2>
            <Link
              to="/announcements"
              className="text-xs text-nacos-green font-semibold hover:underline"
            >
              View all
            </Link>
          </div>
          {recentAnnouncements.length === 0 ? (
            <div className="card p-5 text-center text-sm text-gray-500">
              No announcements yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentAnnouncements.map((a) => (
                <div key={a.id} className="card p-4">
                  <p className="font-semibold text-nacos-blue truncate">
                    {a.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(a.created_at).toDateString()}
                  </p>
                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                    {a.body}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
