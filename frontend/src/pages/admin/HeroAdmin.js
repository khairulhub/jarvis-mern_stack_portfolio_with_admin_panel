import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import AdminLayout from "../../components/layout/AdminLayout";
import { getHero, updateHero } from "../../utils/api";
import API from "../../utils/api";

// Upload image via existing /api/upload/image → imgBB pipeline
const uploadImageToServer = async (file) => {
  const form = new FormData();
  form.append("image", file);
  const { data } = await API.post("/upload/image", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (!data.success) throw new Error(data.message || "Upload failed");
  return data.data.url; // imgBB public URL
};

const FIELD_META = [
  { key: "tagline",    label: "Tagline",          placeholder: "FULL STACK DEVELOPER & NETWORK ENGINEER" },
  { key: "name",       label: "Name",             placeholder: "KHAIRUL" },
  { key: "subtitle",   label: "Subtitle",         placeholder: "// SYSTEM ONLINE" },
  { key: "description",label: "Description",      placeholder: "Short bio...", multiline: true },
  { key: "location",   label: "Location",         placeholder: "DHAKA, BANGLADESH" },
  { key: "statusText", label: "Status Text",      placeholder: "AVAILABLE FOR HIRE" },
  { key: "cvLink",     label: "CV / Resume Link", placeholder: "https://..." },
];

const HeroAdmin = () => {
  const [form, setForm] = useState({
    tagline: "", name: "", subtitle: "", description: "",
    location: "", statusText: "", cvLink: "",
    profileImage: "", chips: [],
  });
  const [chipsInput, setChipsInput]     = useState("");
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [imgUploading, setImgUploading] = useState(false);
  const [preview, setPreview]           = useState("");
  const fileRef = useRef(null);

  // ── Load existing hero data from DB ──────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getHero();
        if (res.success && res.data) {
          const d = res.data;
          setForm({
            tagline:      d.tagline      || "",
            name:         d.name         || "",
            subtitle:     d.subtitle     || "",
            description:  d.description  || "",
            location:     d.location     || "",
            statusText:   d.statusText   || "",
            cvLink:       d.cvLink       || "",
            profileImage: d.profileImage || "",
            chips:        Array.isArray(d.chips) ? d.chips : [],
          });
          setChipsInput(Array.isArray(d.chips) ? d.chips.join(", ") : "");
          setPreview(d.profileImage || "");
        }
      } catch (err) {
        toast.error("Failed to load hero data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // ── Image upload ──────────────────────────────────────────────
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file)); // instant local preview

    setImgUploading(true);
    try {
      const url = await uploadImageToServer(file);
      setForm((prev) => ({ ...prev, profileImage: url }));
      setPreview(url);
      toast.success("Image uploaded!");
    } catch (err) {
      toast.error(err.message || "Image upload failed");
      setPreview(form.profileImage); // revert on error
    } finally {
      setImgUploading(false);
    }
  };

  // ── Save to DB ────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const chipsArray = chipsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await updateHero({ ...form, chips: chipsArray });
      setForm((prev) => ({ ...prev, chips: chipsArray }));
      toast.success("Hero section saved!");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  // ── Loading state ─────────────────────────────────────────────
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  // ── UI ────────────────────────────────────────────────────────
  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Hero Section</h1>
          <p className="text-slate-400 text-sm mt-1">
            Edit the homepage hero content. Changes are saved to MongoDB and appear instantly on the site.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── Profile Image ── */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-4">Profile Image</h2>
            <div className="flex items-start gap-6">

              {/* preview box */}
              <div className="flex-shrink-0">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-28 h-36 object-cover object-top rounded-xl border border-slate-700"
                  />
                ) : (
                  <div className="w-28 h-36 rounded-xl border border-dashed border-slate-600 flex items-center justify-center text-slate-500 text-xs text-center px-2">
                    No image
                  </div>
                )}
              </div>

              {/* upload controls */}
              <div className="flex-1 space-y-3">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={imgUploading}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all"
                >
                  {imgUploading ? "Uploading…" : "Upload New Image"}
                </button>
                <p className="text-xs text-slate-500">
                  JPG / PNG / WebP · max 5 MB · uploaded to imgBB, URL saved in MongoDB.
                </p>
                {form.profileImage && (
                  <p className="text-xs text-slate-400 break-all">
                    Current:{" "}
                    <a
                      href={form.profileImage}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:underline"
                    >
                      {form.profileImage}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Text Fields ── */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            <h2 className="text-white font-semibold">Text Content</h2>

            {FIELD_META.map(({ key, label, placeholder, multiline }) => (
              <div key={key}>
                <label className="block text-sm text-slate-400 mb-1.5">
                  {label}
                </label>
                {multiline ? (
                  <textarea
                    name={key}
                    value={form[key]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    rows={4}
                    className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 resize-none"
                  />
                ) : (
                  <input
                    type="text"
                    name={key}
                    value={form[key]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500"
                  />
                )}
              </div>
            ))}
          </div>

          {/* ── Skill Chips ── */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-white font-semibold">Skill Chips</h2>
            <p className="text-xs text-slate-500">
              Comma দিয়ে আলাদা করো। Hero section এ badge হিসেবে দেখাবে।
            </p>
            <textarea
              value={chipsInput}
              onChange={(e) => setChipsInput(e.target.value)}
              placeholder="MERN STACK, PHP / LARAVEL, .NET, CISCO, CCNA, Mikrotik"
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 resize-none"
            />

            {/* live chip preview */}
            <div className="flex flex-wrap gap-1.5">
              {chipsInput
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
                .map((chip) => (
                  <span
                    key={chip}
                    className="px-2.5 py-0.5 rounded-full text-[10px] border"
                    style={{
                      borderColor: "rgba(0,229,255,0.3)",
                      color: "#00b8cc",
                      fontFamily: "'Share Tech Mono', monospace",
                    }}
                  >
                    {chip}
                  </span>
                ))}
            </div>
          </div>

          {/* ── Save Button ── */}
          <div className="flex justify-end pb-6">
            <button
              type="submit"
              disabled={saving || imgUploading}
              className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-medium rounded-xl transition-all"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </AdminLayout>
  );
};

export default HeroAdmin;