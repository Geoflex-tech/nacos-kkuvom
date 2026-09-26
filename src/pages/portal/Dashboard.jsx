import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { profile } = useAuth();

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-nacos-blue mb-2">
        Welcome, {profile?.full_name || "Member"}
      </h1>
      <p className="text-gray-500 mb-8">NACOS KKU VOM Chapter · Member Portal</p>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-5">
          <h3 className="text-sm text-gray-500">Matric No.</h3>
          <p className="text-lg font-bold text-nacos-blue mt-1">
            {profile?.matric_no || "—"}
          </p>
        </div>
        <div className="card p-5">
          <h3 className="text-sm text-gray-500">Level</h3>
          <p className="text-lg font-bold text-nacos-blue mt-1">
            {profile?.level || "—"}
          </p>
        </div>
        <div className="card p-5">
          <h3 className="text-sm text-gray-500">Status</h3>
          <p className="text-lg font-bold mt-1">
            <span
              className={
                profile?.status === "approved"
                  ? "text-green-600"
                  : profile?.status === "rejected"
                  ? "text-red-600"
                  : "text-yellow-600"
              }
            >
              {profile?.status || "pending"}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <Link to="/profile" className="card p-5 hover:shadow-md">
          <h3 className="font-bold text-nacos-blue">Edit Profile →</h3>
          <p className="text-sm text-gray-500 mt-1">
            Update your info, phone, level
          </p>
        </Link>
        <Link to="/resources" className="card p-5 hover:shadow-md">
          <h3 className="font-bold text-nacos-blue">Resources →</h3>
          <p className="text-sm text-gray-500 mt-1">
            Past questions & study materials
          </p>
        </Link>
        <Link to="/announcements" className="card p-5 hover:shadow-md">
          <h3 className="font-bold text-nacos-blue">Announcements →</h3>
          <p className="text-sm text-gray-500 mt-1">
            Chapter news & updates
          </p>
        </Link>
      </div>
    </section>
  );
}