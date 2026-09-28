import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Upload, X, User as UserIcon } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { compressImage } from "../../utils/compressImage";
export default function Register() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    matric_no: "",
    level: "",
    phone: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleAvatarChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    setError("Profile photo must be an image file (JPG, PNG).");
    return;
  }

  setError("");
  try {
    const compressed = await compressImage(file, 800, 0.82);
    setAvatar(compressed);
    setAvatarPreview(URL.createObjectURL(compressed));
  } catch (err) {
    setError("Could not process photo: " + err.message);
  }
};
  const clearAvatar = () => {
    setAvatar(null);
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(null);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!avatar) {
      setError("Profile photo is required.");
      return;
    }

    setLoading(true);

    // 1. Create auth user
    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.full_name } },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError("Registration failed. Please try again.");
      setLoading(false);
      return;
    }

    // 2. Upload avatar to Supabase Storage
    const ext = avatar.name.split(".").pop().toLowerCase();
    const fileName = `member-${data.user.id}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, avatar, { upsert: true });

    if (uploadError) {
      setError("Photo upload failed: " + uploadError.message);
      setLoading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    // 3. Update profile with extra fields + avatar
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name,
        matric_no: form.matric_no,
        level: form.level,
        phone: form.phone,
        department: "Computer Science",
        avatar_url: urlData.publicUrl,
      })
      .eq("id", data.user.id);

    setLoading(false);

    if (profileError) {
      setError(profileError.message);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <section className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-nacos-blue mb-2 text-center">
        Member Registration
      </h1>
      <p className="text-center text-gray-500 text-sm mb-8">
        Join NACOS KKU VOM Chapter · Open to Computing students only
      </p>

      <form onSubmit={handleRegister} className="card-flat p-6 space-y-4">
        {/* Avatar upload */}
        <div className="text-center">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Profile Photo <span className="text-red-500">*</span>
          </label>

          {avatarPreview ? (
            <div className="relative inline-block">
              <img
                src={avatarPreview}
                alt="Preview"
                className="h-24 w-24 rounded-full object-cover border-4 border-nacos-gold mx-auto"
              />
              <button
                type="button"
                onClick={clearAvatar}
                className="absolute -top-1 -right-1 h-7 w-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <label className="cursor-pointer inline-flex flex-col items-center justify-center h-24 w-24 rounded-full bg-gray-100 hover:bg-gray-200 border-2 border-dashed border-gray-300 text-gray-500 transition mx-auto">
              <UserIcon size={24} />
              <span className="text-xs mt-1">Upload</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          )}

          <p className="text-xs text-gray-400 mt-2">
            JPG or PNG · Max 2 MB
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            className="input"
            placeholder="e.g. Ezekiel Geoffrey Izam"
            value={form.full_name}
            onChange={update("full_name")}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            className="input"
            placeholder="you@example.com"
            value={form.email}
            onChange={update("email")}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            className="input"
            placeholder="Min 6 characters"
            value={form.password}
            onChange={update("password")}
            minLength={6}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Matric Number
          </label>
          <input
            className="input"
            placeholder="e.g. KKU/2023/SC/003"
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            className="input"
            placeholder="e.g. 09084850109"
            value={form.phone}
            onChange={update("phone")}
            required
          />
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-2">
          <span className="text-blue-600 shrink-0">ℹ️</span>
          <p className="text-xs text-blue-800 leading-relaxed">
            Registration is limited to students of the{" "}
            <strong>Computer Science Department</strong>, Karl Kumm University,
            Vom. Your profile photo is required and will be visible to
            executives.
          </p>
        </div>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-md p-2.5">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-nacos-blue font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </section>
  );
}
