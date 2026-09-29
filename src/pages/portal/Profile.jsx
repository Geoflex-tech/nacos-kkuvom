import { useEffect, useState } from "react";
import { Camera, X, Save, User, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { compressImage } from "../../utils/compressImage";
import ChangePasswordCard from "../../components/ChangePasswordCard";
import { DashPageStyles } from "./Announcements";

export default function Profile() {
  const { profile, session, refreshProfile } = useAuth();
  const [form, setForm] = useState({
    full_name: "", matric_no: "", level: "",
    phone: "", department: "Computer Science",
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile]       = useState(null);
  const [saving, setSaving]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg]           = useState({ text: "", type: "" });

  useEffect(() => {
    if (profile) {
      setForm({
        full_name:  profile.full_name  || "",
        matric_no:  profile.matric_no  || "",
        level:      profile.level      || "",
        phone:      profile.phone      || "",
        department: profile.department || "Computer Science",
      });
      setAvatarPreview(profile.avatar_url || null);
    }
  }, [profile]);

  const update = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleAvatarPick = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMsg({ text: "Please choose a JPG or PNG image.", type: "err" });
      return;
    }
    setMsg({ text: "Compressing photo…", type: "inf" });
    try {
      const compressed = await compressImage(file, 800, 0.82);
      setAvatarFile(compressed);
      setAvatarPreview(URL.createObjectURL(compressed));
      setMsg({ text: "", type: "" });
    } catch (err) {
      setMsg({ text: "Could not process photo: " + err.message, type: "err" });
    }
  };

  const cancelAvatarChange = () => {
    setAvatarFile(null);
    setAvatarPreview(profile?.avatar_url || null);
    setMsg({ text: "", type: "" });
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ text: "", type: "" });

    let avatarUrl = profile?.avatar_url || null;

    if (avatarFile) {
      setUploading(true);
      const fileName = `member-${session.user.id}-${Date.now()}.jpg`;
      const { error: uploadErr } = await supabase.storage
        .from("avatars")
        .upload(fileName, avatarFile, { upsert: true });
      setUploading(false);
      if (uploadErr) {
        setMsg({ text: "Photo upload failed: " + uploadErr.message, type: "err" });
        setSaving(false);
        return;
      }
      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
      avatarUrl = data.publicUrl;
    }

    const { error: profileErr } = await supabase
      .from("profiles")
      .update({ ...form, avatar_url: avatarUrl })
      .eq("id", session.user.id);

    setSaving(false);
    if (profileErr) {
      setMsg({ text: profileErr.message, type: "err" });
      return;
    }

    setMsg({ text: "Profile updated successfully.", type: "ok" });
    setAvatarFile(null);
    await refreshProfile();
  };

  const initials = (form.full_name || profile?.email || "M")
    .split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  const busy = saving || uploading;

  return (
    <div className="dp-wrap">
      {/* Page header */}
      <div className="dp-page-head">
        <div className="dp-page-icon" aria-hidden="true">
          <User size={20} />
        </div>
        <div>
          <h1 className="dp-page-title">My Profile</h1>
          <p className="dp-page-sub">Manage your personal information and profile photo</p>
        </div>
      </div>

      <form onSubmit={save}>
        {/* ── Avatar card ─────────────────────────────── */}
        <div className="dp-form-card" style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile photo"
                  style={{
                    width: 80, height: 80, borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid #F59E0B",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 80, height: 80, borderRadius: "50%",
                    background: "#1E40AF", color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.25rem", fontWeight: 700,
                    border: "3px solid #F59E0B",
                  }}
                  aria-label={`Initials: ${initials}`}
                >
                  {initials}
                </div>
              )}
              {/* Camera overlay */}
              <label
                style={{
                  position: "absolute", bottom: 0, right: 0,
                  width: 28, height: 28, borderRadius: "50%",
                  background: "#1E40AF", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", border: "2px solid #fff",
                }}
                aria-label="Change profile photo"
              >
                <Camera size={13} aria-hidden="true" />
                <input
                  type="file" accept="image/*"
                  onChange={handleAvatarPick}
                  style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}
                  tabIndex={-1}
                />
              </label>
            </div>

            {/* Info */}
            <div>
              <p style={{ fontWeight: 600, color: "#1E3A8A", margin: "0 0 2px" }}>
                {form.full_name || "Member"}
              </p>
              <p style={{ fontSize: "0.8125rem", color: "#6B7280", margin: 0 }}>
                {profile?.email}
              </p>
              <p style={{ fontSize: "0.75rem", color: "#9CA3AF", margin: "4px 0 0" }}>
                {profile?.matric_no || "No matric number yet"}
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
                <label
                  style={{ fontSize: "0.8125rem", color: "#1E40AF", fontWeight: 500, cursor: "pointer" }}
                >
                  Change photo
                  <input
                    type="file" accept="image/*"
                    onChange={handleAvatarPick}
                    style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}
                    tabIndex={-1}
                  />
                </label>
                {avatarFile && (
                  <button
                    type="button"
                    onClick={cancelAvatarChange}
                    style={{
                      background: "none", border: "none",
                      fontSize: "0.8125rem", color: "#DC2626", fontWeight: 500,
                      cursor: "pointer", padding: 0,
                      display: "flex", alignItems: "center", gap: 4,
                    }}
                  >
                    <X size={12} aria-hidden="true" /> Cancel
                  </button>
                )}
              </div>
              <p style={{ fontSize: "0.75rem", color: "#9CA3AF", margin: "4px 0 0" }}>
                Any size · Auto-compressed on upload
              </p>
            </div>
          </div>
        </div>

        {/* ── Personal info card ───────────────────────── */}
        <div className="dp-form-card" style={{ marginBottom: 12 }}>
          <h2 className="dp-form-section-title">Personal Information</h2>

          <div className="dp-field">
            <label htmlFor="prof-name" className="dp-label">Full name</label>
            <input
              id="prof-name"
              className="dp-input"
              value={form.full_name}
              onChange={update("full_name")}
              required
              disabled={busy}
            />
          </div>

          <div className="dp-grid-2">
            <div className="dp-field">
              <label htmlFor="prof-matric" className="dp-label">Matric number</label>
              <input
                id="prof-matric"
                className="dp-input"
                value={form.matric_no}
                onChange={update("matric_no")}
                required
                disabled={busy}
              />
            </div>
            <div className="dp-field">
              <label htmlFor="prof-level" className="dp-label">Level</label>
              <select
                id="prof-level"
                className="dp-select"
                value={form.level}
                onChange={update("level")}
                required
                disabled={busy}
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

          <div className="dp-field">
            <label htmlFor="prof-phone" className="dp-label">Phone number</label>
            <input
              id="prof-phone"
              type="tel"
              className="dp-input"
              value={form.phone}
              onChange={update("phone")}
              required
              disabled={busy}
            />
          </div>

          <div className="dp-field">
            <label htmlFor="prof-dept" className="dp-label">Department</label>
            <input
              id="prof-dept"
              className="dp-input"
              value={form.department}
              disabled
            />
            <p className="dp-input-hint">Department is fixed to Computer Science.</p>
          </div>
        </div>

        {/* Status message */}
        {msg.text && (
          <div
            className={`dp-msg dp-msg--${msg.type}`}
            role="alert"
            aria-live="polite"
            style={{ marginBottom: 12 }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {msg.type === "ok"
                ? <CheckCircle2 size={15} aria-hidden="true" />
                : <AlertCircle  size={15} aria-hidden="true" />}
              {msg.text}
            </span>
          </div>
        )}

        {/* Save button */}
        <button
          type="submit"
          className="dp-save-btn"
          disabled={busy}
          aria-busy={busy}
        >
          {busy ? (
            <><span className="dp-pay-spinner" aria-hidden="true" />
              {uploading ? "Uploading photo…" : "Saving…"}</>
          ) : (
            <><Save size={15} aria-hidden="true" /> Save Changes</>
          )}
        </button>
      </form>

      {/* Password change */}
      <div style={{ marginTop: 4 }}>
        <ChangePasswordCard />
      </div>

      <DashPageStyles />
    </div>
  );
}
