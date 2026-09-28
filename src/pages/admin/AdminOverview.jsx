import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Calendar,
  Newspaper,
  Award,
  Image as ImageIcon,
  BookOpen,
  Megaphone,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

export default function AdminOverview() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    members: 0,
    pending: 0,
    events: 0,
    upcomingEvents: 0,
    news: 0,
    certificates: 0,
    gallery: 0,
    resources: 0,
    announcements: 0,
    messages: 0,
    unreadMessages: 0,
  });
  const [recentMembers, setRecentMembers] = useState([]);
  const [recentCertificates, setRecentCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const now = new Date().toISOString();

      const [
        membersRes,
        pendingRes,
        eventsRes,
        upcomingRes,
        newsRes,
        certsRes,
        galleryRes,
        resourcesRes,
        annsRes,
        messagesRes,
        unreadRes,
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase.from("events").select("*", { count: "exact", head: true }),
        supabase
          .from("events")
          .select("*", { count: "exact", head: true })
          .gte("event_date", now),
        supabase.from("news").select("*", { count: "exact", head: true }),
        supabase.from("certificates").select("*", { count: "exact", head: true }),
        supabase.from("gallery").select("*", { count: "exact", head: true }),
        supabase.from("resources").select("*", { count: "exact", head: true }),
        supabase.from("announcements").select("*", { count: "exact", head: true }),
        supabase
          .from("contact_messages")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("contact_messages")
          .select("*", { count: "exact", head: true })
          .eq("read", false),
      ]);

      setStats({
        members: membersRes.count || 0,
        pending: pendingRes.count || 0,
        events: eventsRes.count || 0,
        upcomingEvents: upcomingRes.count || 0,
        news: newsRes.count || 0,
        certificates: certsRes.count || 0,
        gallery: galleryRes.count || 0,
        resources: resourcesRes.count || 0,
        announcements: annsRes.count || 0,
        messages: messagesRes.count || 0,
        unreadMessages: unreadRes.count || 0,
      });

      const { data: rm } = await supabase
        .from("profiles")
        .select("id, full_name, email, matric_no, status, created_at, role")
        .order("created_at", { ascending: false })
        .limit(5);
      setRecentMembers(rm || []);

      const { data: rc } = await supabase
        .from("certificates")
        .select(
          "id, certificate_number, title, issued_date, status, profiles(full_name)"
        )
        .order("created_at", { ascending: false })
        .limit(5);
      setRecentCertificates(rc || []);

      setLoading(false);
    })();
  }, []);

  const initials = (profile?.full_name || profile?.email || "A")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const statCards = [
    {
      label: "Total Members",
      value: stats.members,
      sub: stats.pending > 0 ? `${stats.pending} pending approval` : "All approved",
      Icon: Users,
      color: "bg-blue-50 text-nacos-blue",
    },
    {
      label: "Events",
      value: stats.events,
      sub: `${stats.upcomingEvents} upcoming`,
      Icon: Calendar,
      color: "bg-green-50 text-nacos-green",
    },
    {
      label: "News Posts",
      value: stats.news,
      sub: "Published",
      Icon: Newspaper,
      color: "bg-yellow-50 text-yellow-700",
    },
    {
      label: "Certificates",
      value: stats.certificates,
      sub: "Issued",
      Icon: Award,
      color: "bg-purple-50 text-purple-700",
    },
    {
      label: "Gallery Photos",
      value: stats.gallery,
      sub: "Uploaded",
      Icon: ImageIcon,
      color: "bg-pink-50 text-pink-700",
    },
    {
      label: "Resources",
      value: stats.resources,
      sub: "Available",
      Icon: BookOpen,
      color: "bg-indigo-50 text-indigo-700",
    },
    {
      label: "Announcements",
      value: stats.announcements,
      sub: "Posted",
      Icon: Megaphone,
      color: "bg-orange-50 text-orange-700",
    },
    {
      label: "Messages",
      value: stats.messages,
      sub:
        stats.unreadMessages > 0
          ? `${stats.unreadMessages} unread`
          : "All read",
      Icon: MessageSquare,
      color: "bg-red-50 text-red-700",
    },
  ];

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">Loading overview...</div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="bg-gradient-to-br from-nacos-blue to-nacos-green text-white rounded-2xl p-6 flex items-center gap-5">
        <div className="h-14 w-14 rounded-full bg-white/15 backdrop-blur border-2 border-nacos-gold flex items-center justify-center text-xl font-bold shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-white/70 text-sm">Welcome back,</p>
          <h2 className="text-xl md:text-2xl font-bold truncate">
            {profile?.full_name || "Administrator"}
          </h2>
          <p className="text-white/80 text-xs mt-0.5">
            Here's what's happening with your chapter
          </p>
        </div>
        <div className="ml-auto hidden md:flex items-center gap-2 text-white/80 text-sm">
          <TrendingUp size={16} />
          <span>Live stats</span>
        </div>
      </div>

      {/* Stats grid */}
      <div>
        <h3 className="font-bold text-nacos-blue mb-4">Chapter at a Glance</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {statCards.map((s) => {
            const Icon = s.Icon;
            return (
              <div key={s.label} className="card p-4">
                <div
                  className={`h-10 w-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}
                >
                  <Icon size={18} />
                </div>
                <p className="text-2xl font-bold text-nacos-blue">{s.value}</p>
                <p className="text-xs font-medium text-gray-700 mt-0.5">
                  {s.label}
                </p>
                <p className="text-[11px] text-gray-500 mt-1">{s.sub}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-column: recent members + recent certificates */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent members */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-nacos-blue">Recent Members</h3>
            <span className="text-xs text-gray-500">
              Latest 5 registrations
            </span>
          </div>
          {recentMembers.length === 0 ? (
            <div className="card p-6 text-center text-sm text-gray-500">
              No members yet.
            </div>
          ) : (
            <div className="space-y-2">
              {recentMembers.map((m) => (
                <div
                  key={m.id}
                  className="card p-3 flex items-center gap-3"
                >
                  <div className="h-10 w-10 rounded-full bg-nacos-blue text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {(m.full_name || m.email || "?")[0].toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-nacos-blue truncate text-sm">
                      {m.full_name || m.email}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {m.matric_no || "—"} · {m.role}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold shrink-0 ${
                      m.status === "approved"
                        ? "text-green-600"
                        : m.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent certificates */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-nacos-blue">Recent Certificates</h3>
            <span className="text-xs text-gray-500">Latest 5 issued</span>
          </div>
          {recentCertificates.length === 0 ? (
            <div className="card p-6 text-center text-sm text-gray-500">
              No certificates issued yet.
            </div>
          ) : (
            <div className="space-y-2">
              {recentCertificates.map((c) => (
                <div key={c.id} className="card p-3">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-mono text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                      {c.certificate_number}
                    </span>
                    <span
                      className={`text-[10px] font-semibold ${
                        c.status === "valid"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <p className="font-medium text-nacos-blue text-sm truncate">
                    {c.title}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {c.profiles?.full_name || "Unknown"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="font-bold text-nacos-blue mb-4">Quick Actions</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            to="/admin?tab=members"
            className="card p-4 hover:shadow-md text-center"
          >
            <Users size={20} className="mx-auto text-nacos-blue mb-2" />
            <p className="font-semibold text-nacos-blue text-sm">
              Manage Members
            </p>
          </Link>
          <Link
            to="/admin?tab=events"
            className="card p-4 hover:shadow-md text-center"
          >
            <Calendar size={20} className="mx-auto text-nacos-green mb-2" />
            <p className="font-semibold text-nacos-blue text-sm">
              Create Event
            </p>
          </Link>
          <Link
            to="/admin?tab=certificates"
            className="card p-4 hover:shadow-md text-center"
          >
            <Award size={20} className="mx-auto text-purple-600 mb-2" />
            <p className="font-semibold text-nacos-blue text-sm">
              Issue Certificate
            </p>
          </Link>
          <Link
            to="/admin?tab=messages"
            className="card p-4 hover:shadow-md text-center"
          >
            <MessageSquare size={20} className="mx-auto text-red-600 mb-2" />
            <p className="font-semibold text-nacos-blue text-sm">
              View Messages
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}