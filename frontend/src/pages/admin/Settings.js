import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateProfile } from "../../utils/api";
import AdminLayout from "../../components/layout/AdminLayout";
import toast from "react-hot-toast";
import { HiOutlineSave, HiOutlineUser } from "react-icons/hi";

const Settings = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", avatar: user?.avatar || "" });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateProfile(form);
      setUser(res.user);
      localStorage.setItem("user", JSON.stringify(res.user));
      toast.success("Profile updated!");
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your admin profile</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
            <HiOutlineUser className="w-4 h-4 text-blue-400" /> Profile Information
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Display Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
              <input value={user?.email || ""} disabled
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Avatar URL</label>
              <input value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                placeholder="https://..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
              {form.avatar && (
                <img src={form.avatar} alt="avatar" className="mt-2 w-16 h-16 rounded-full object-cover border border-slate-700" />
              )}
            </div>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-60 shadow-lg shadow-blue-500/20">
              <HiOutlineSave className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-4">API Information</h2>
          <div className="space-y-3 text-sm">
            {[
              ["Backend URL", process.env.REACT_APP_API_URL || "http://localhost:5000/api"],
              ["Role", user?.role || "admin"],
              ["Auth", "JWT + Firebase"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-slate-800 last:border-0">
                <span className="text-slate-400">{label}</span>
                <span className="text-slate-200 font-mono text-xs bg-slate-800 px-2.5 py-1 rounded-lg">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
