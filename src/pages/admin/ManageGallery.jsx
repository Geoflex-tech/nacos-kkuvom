import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ManageGallery() {
  const [items, setItems] = useState([]);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("gallery")
      .select("*")
      .order("uploaded_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { load(); }, []);

  const upload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);

    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(fileName, file);

    if (uploadError) {
      alert(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(fileName);

    const { error: insertError } = await supabase.from("gallery").insert([
      { image_url: urlData.publicUrl, caption },
    ]);

    setUploading(false);
    if (insertError) return alert(insertError.message);

    setFile(null);
    setCaption("");
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image file
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-nacos-blue file:text-white file:font-semibold hover:file:opacity-90"
            required
          />
        </div>
        <input
          className="input"
          placeholder="Caption (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <button disabled={uploading || !file} className="btn-primary">
          {uploading ? "Uploading..." : "Upload Photo"}
        </button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((img) => (
          <div key={img.id} className="relative group">
            <img
              src={img.image_url}
              alt={img.caption || ""}
              className="w-full aspect-square object-cover rounded-lg"
            />
            <button
              onClick={() => remove(img)}
              className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <p className="text-gray-500 text-sm text-center py-6">No photos uploaded yet.</p>
      )}
    </div>
  );
}