import { useEffect, useState } from "react";
import { Camera, X, Save } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { compressImage } from "../../utils/compressImage";

export default function Profile() {
  const { profile, session, refreshProfile } = useAuth();
  const [form, setForm] = useState({
    full_name: "",
    matric_no: "",
    level: "",
    phone: "",
    department: "Computer Science",
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || "",
        matric_no: profile.matric_no || "",
        level: profile.level || "",
        phone: profile.phone || "",
        department: profile.department || "Computer Science",
      });
      setAvatarPreview(profile.avatar_url || null);
    }
  }, [profile]);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleAvatarPick = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Error: Please choose an image file.");
      return;
    }

    setMessage("Compressing photo...");

    try {
      const compressed = await compressImage(file, 800, 0.82);
      setAvatarFile(compressed);
      setAvatarPreview(URL.createObjectURL(compressed));
      setMessage("");
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  const cancelAvatarChange = () => {
    setAvatarFile(null);
    setAvatarPreview(profile?.avatar_url || null);
    setMessage("");
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    let newAvatarUrl = profile?.avatar_url || null;

    if (avatarFile) {
      setUploading(true);
      const ext = "jpg";
      const fileName = `member-${session.user.id}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, avatarFile, { upsert: true });

      setUploading(false);

      if (uploadError) {
        setMessage("Photo upload failed: " + uploadError.message);
        setSaving(false);
        return;
      }

      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);
      newAvatarUrl = data.publicUrl;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        ...form,
        avatar_url: newAvatarUrl,
      })
      .eq("id", session.user.id);

    setSaving(false);

    if (profileError) {
      setMessage("Error: " + profileError.message);
      return;
    }

    setMessage("Profile updated ✅");
    setAvatarFile(null);
    await refreshProfile();
  };

  const initials = (form.full_name || profile?.email || "M")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="section-eyebrow">Account</p>
        <h1 className="section-title text-2xl md:text-3xl">My Profile</h1>
        <p className="text-gray-500 mt-2">
          Manage your personal information and profile photo
        </p>
      </div>

      <form onSubmit={save} className="space-y-6">
        <div className="card-flat p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="h-28 w-28 rounded-full object-cover border-4 border-nacos-gold shadow-card"
                />
              ) : (
                <div className="h-28 w-28 rounded-full bg-gradient-to-br from-nacos-blue to-nacos-green text-white flex items-center justify-center text-4xl font-bold border-4 border-nacos-gold">
                  {initials}
                </div>
              )}

              <label className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-nacos-blue text-white flex items-center justify-center cursor-pointer hover:bg-nacos-blue-light transition shadow-md border-2 border-white">
                <Camera size={16} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarPick}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <p className="font-bold text-nacos-blue text-lg">
                {form.full_name || "Member"}
              </p>
              <p className="text-sm text-gray-500">{profile?.email}</p>
              <p className="text-xs text-gray-400 mt-1">
                {profile?.matric_no || "No matric yet"}
              </p>

              <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
                <label className="text-xs text-nacos-blue font-semibold hover:underline cursor-pointer">
                  Change photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarPick}
                    className="hidden"
                  />
                </label>
                {avatarFile && (
                  <button
                    type="button"
                    onClick={cancelAvatarChange}
                    className="text-xs text-red-600 font-semibold hover:underline flex items-center gap-1"
                  >
                    <X size={12} /> Cancel
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-400 mt-2">
                Any size accepted · Auto-compressed on upload
              </p>
            </div>
          </div>
        </div>

        <div className="card-flat p-6 space-y-4">
          <h2 className="font-bold text-nacos-blue">Personal Information</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              className="input"
              value={form.full_name}
              onChange={update("full_name")}
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Matric Number
              </label>
              <input
                className="input"
                value={form.matric_no}
                onChange={update("matric_no")}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level
              </label>
              <select
                className="input"
                value={form.level}
                onChange={update("level")}
                required
              >
                <option value="">Select level</option>
                <option value="100L">100L</option>
                <option value="200L">200L</option>
                <option value="300L">300L</option>
                <option value="400L">400L</option>
                <option value="500L">500L</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              className="input"
              value={form.phone}
              onChange={update("phone")}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <input
              className="input bg-gray-50 cursor-not-allowed"
              value={form.department}
              disabled
            />
            <p className="text-xs text-gray-400 mt-1">
              Department is fixed to Computer Science
            </p>
          </div>
        </div>

        {message && (
          <p
            className={`text-sm rounded-md p-3 ${
              message.startsWith("Error")
                ? "text-red-600 bg-red-50 border border-red-100"
                : message.includes("Compressing")
                ? "text-blue-600 bg-blue-50 border border-blue-100"
                : "text-green-600 bg-green-50 border border-green-100"
            }`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={saving || uploading}
          className="btn-primary w-full py-3"
        >
          {uploading ? (
            "Uploading photo..."
          ) : saving ? (
            "Saving..."
          ) : (
            <>
              <Save size={16} />
              Save Changes
            </>
          )}
        </button>
      </form>
    </section>
  );
}