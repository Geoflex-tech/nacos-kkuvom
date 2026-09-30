import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import AdminOverview from "./AdminOverview";
import ManageAdministrations from "./ManageAdministrations";
import ManageNews from "./ManageNews";
import ManageEvents from "./ManageEvents";
import ManageExecutives from "./ManageExecutives";
import ManageAnnouncements from "./ManageAnnouncements";
import ManageResources from "./ManageResources";
import ManageGallery from "./ManageGallery";
import ManageMembers from "./ManageMembers";
import ManageCertificates from "./ManageCertificates";
import Messages from "./Messages";
import ManageTechHub from "./ManageTechHub";
export default function AdminDashboard() {
  const { profile } = useAuth();
  const [tab, setTab] = useState("overview");

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const tabs = [
  { id: "overview", label: "Overview" },
  { id: "administrations", label: "Administrations" },
  { id: "news", label: "News" },
  { id: "events", label: "Events" },
  { id: "executives", label: "Executives" },
  { id: "announcements", label: "Announcements" },
  { id: "resources", label: "Resources" },
  { id: "techhub", label: "Tech Hub" },
  { id: "gallery", label: "Gallery" },
  { id: "members", label: "Members" },
  { id: "certificates", label: "Certificates" },
  { id: "messages", label: "Messages" },
];
  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-nacos-blue">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">
            Welcome, {profile?.full_name || profile?.email}
          </p>
        </div>
        <button
          onClick={logout}
          className="text-sm text-red-600 font-semibold hover:underline"
        >
          Logout
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 border-b overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 font-semibold border-b-2 -mb-px transition whitespace-nowrap ${
              tab === t.id
                ? "border-nacos-blue text-nacos-blue"
                : "border-transparent text-gray-500 hover:text-nacos-blue"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && <AdminOverview />}
      {tab === "administrations" && <ManageAdministrations />}
      {tab === "news" && <ManageNews />}
      {tab === "events" && <ManageEvents />}
      {tab === "executives" && <ManageExecutives />}
      {tab === "announcements" && <ManageAnnouncements />}
      {tab === "resources" && <ManageResources />}
      {tab === "gallery" && <ManageGallery />}
      {tab === "members" && <ManageMembers />}
      {tab === "certificates" && <ManageCertificates />}
      {tab === "messages" && <Messages />}
      {tab === "techhub" && <ManageTechHub />}
    </section>
  );
}
