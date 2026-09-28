import { useEffect, useState } from "react";
import { Pencil, Trash2, X, Upload } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function ManageGallery() {
  const [items, setItems] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editCaption, setEditCaption] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("gallery")
      .select("*")
      .order("uploaded_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => {
    load();
  }, []);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const clearFile = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  };

  const upload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);

    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from("gallery")
      .upload(fileName, file);

    if (upErr) {
      alert(upErr.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("gallery")
      .getPublicUrl(fileName);

    const { error: insErr } = await supabase.from("gallery").insert([
      { image_url: urlData.publicUrl, caption },
    ]);

    setUploading(false);
    if (insErr) return alert(insErr.message);

    clearFile();
    setCaption("");
    load();
  };

  const startEdit = (item) => {
    setEditing(item.id);
    setEditCaption(item.caption || "");
  };

  const saveCaption = async (id) => {
    setSavingEdit(true);
    await supabase
      .from("gallery")
      .update({ caption: editCaption })
      .eq("id", id);
    setSavingEdit(false);
    setEditing(null);
    setEditCaption("");
    load();
  };

  const remove = async (item) => {
    if (!confirm("Delete this photo?")) return;
    const path = item.image_url.split("/").pop();
    await supabase.storage.from("gallery").remove([path]);
    await supabase.from("gallery").delete().eq("id", item.id);
    load();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={upload} className="card p-5 space-y-3">
        <h3 className="font-bold text-nacos-blue">Upload Photo</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image file
          </label>
          <div className="flex items-center gap-3">
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="h-16 w-16 rounded-lg object-cover border-2 border-nacos-gold"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-nacos-blue file:text-white file:font-semibold hover:file:opacity-90"
              required
            />
            {preview && (
              <button
                type="button"
                onClick={clearFile}
                className="text-red-500 hover:text-red-700"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        <input
          className="input"
          placeholder="Caption (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <button disabled={uploading || !file} className="btn-primary">
          {uploading ? (
            "Uploading..."
          ) : (
            <>
              <Upload size={16} />
              Upload Photo
            </>
          )}
        </button>
      </form>

      <div>
        <h3 className="font-bold text-nacos-blue mb-3">
          Gallery ({items.length})
        </h3>

        {items.length === 0 ? (
          <p className="text-gray-500 text-sm">No photos uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map((img) => (
              <div key={img.id} className="relative group">
                <img
                  src={img.image_url}
                  alt={img.caption || ""}
                  className="w-full aspect-square object-cover rounded-lg"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-lg flex flex-col justify-between p-2">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => startEdit(img)}
                      className="h-7 w-7 rounded-full bg-white/90 text-nacos-blue flex items-center justify-center hover:bg-white transition"
                      title="Edit caption"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => remove(img)}
                      className="h-7 w-7 rounded-full bg-white/90 text-red-600 flex items-center justify-center hover:bg-white transition"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  {img.caption && (
                    <p className="text-white text-xs line-clamp-2">
                      {img.caption}
                    </p>
                  )}
                </div>

                {/* Inline editing form */}
                {editing === img.id && (
                  <div className="absolute inset-0 bg-white/95 rounded-lg p-3 flex flex-col justify-center gap-2 z-10">
                    <input
                      className="input text-xs"
                      placeholder="Caption"
                      value={editCaption}
                      onChange={(e) => setEditCaption(e.target.value)}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveCaption(img.id)}
                        disabled={savingEdit}
                        className="btn-primary text-xs flex-1 py-1"
                      >
                        {savingEdit ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => {
                          setEditing(null);
                          setEditCaption("");
                        }}
                        className="btn-outline text-xs flex-1 py-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}