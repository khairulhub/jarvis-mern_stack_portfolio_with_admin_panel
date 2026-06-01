import React, { useState, useEffect, useCallback } from "react";
import { getAdminTeam, createTeamMember, updateTeamMember, deleteTeamMember, toggleTeamMember } from "../../utils/api";
import AdminLayout from "../../components/layout/AdminLayout";
import ImageUpload from "../../components/common/ImageUpload";
import toast from "react-hot-toast";
import {
  HiOutlinePlus, HiOutlinePencil, HiOutlineTrash,
  HiOutlineUsers, HiOutlineX, HiOutlineSave,
} from "react-icons/hi";

const DEPARTMENTS = ["Engineering", "Design", "Marketing", "Sales", "Operations", "Other"];

const emptyMember = {
  name: "", role: "", department: "Engineering", bio: "",
  avatar: "", email: "", social: { linkedin: "", twitter: "", github: "" }, order: 0,
};

const TeamAdmin = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyMember);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminTeam();
      setMembers(res.data);
    } catch {
      toast.error("Failed to load team");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const openCreate = () => { setForm(emptyMember); setEditingId(null); setModalOpen(true); };
  const openEdit = (member) => {
    setForm({
      name: member.name, role: member.role, department: member.department,
      bio: member.bio || "", avatar: member.avatar || "", email: member.email || "",
      social: member.social || { linkedin: "", twitter: "", github: "" },
      order: member.order || 0,
    });
    setEditingId(member._id);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["linkedin", "twitter", "github"].includes(name)) {
      setForm((f) => ({ ...f, social: { ...f.social, [name]: value } }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.role) return toast.error("Name and role are required");
    setSaving(true);
    try {
      if (editingId) {
        await updateTeamMember(editingId, form);
        toast.success("Member updated!");
      } else {
        await createTeamMember(form);
        toast.success("Member added!");
      }
      setModalOpen(false);
      fetchMembers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleTeamMember(id);
      fetchMembers();
    } catch { toast.error("Toggle failed"); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTeamMember(id);
      toast.success("Member deleted");
      setDeleteId(null);
      fetchMembers();
    } catch { toast.error("Delete failed"); }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Team</h1>
            <p className="text-slate-400 text-sm mt-1">{members.length} members</p>
          </div>
          <button onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20">
            <HiOutlinePlus className="w-4 h-4" /> Add Member
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-7 h-7 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-16 text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
            <HiOutlineUsers className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No team members yet</p>
            <button onClick={openCreate} className="text-blue-400 text-sm hover:underline mt-1 inline-block">Add your first member →</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {members.map((member) => (
              <div key={member._id} className={`bg-slate-900 border rounded-2xl p-5 flex flex-col gap-4 transition-all
                ${member.isActive ? "border-slate-800" : "border-slate-800 opacity-50"}`}>
                {/* Avatar + info */}
                <div className="flex items-start gap-3">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{member.name}</p>
                    <p className="text-xs text-slate-400 truncate">{member.role}</p>
                    <span className="inline-block mt-1 text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-lg">{member.department}</span>
                  </div>
                </div>
                {member.bio && <p className="text-xs text-slate-500 line-clamp-2">{member.bio}</p>}

                {/* Actions */}
                <div className="flex items-center gap-2 mt-auto pt-2 border-t border-slate-800">
                  <button onClick={() => handleToggle(member._id)}
                    className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-all
                      ${member.isActive ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"}`}>
                    {member.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => openEdit(member)}
                    className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all">
                    <HiOutlinePencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteId(member._id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h3 className="font-semibold text-white">{editingId ? "Edit Member" : "Add Member"}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Role *</label>
                  <input name="role" value={form.role} onChange={handleChange} placeholder="Senior Developer"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Department</label>
                  <select name="department" value={form.department} onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all">
                    {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
                  <input name="email" value={form.email} onChange={handleChange} placeholder="john@company.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Avatar</label>
                  <ImageUpload
                    value={form.avatar}
                    onChange={(url) => setForm((f) => ({ ...f, avatar: url }))}
                    folder="team"
                    placeholder="Click or drag to upload avatar"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Bio</label>
                  <textarea name="bio" value={form.bio} onChange={handleChange} rows={3}
                    placeholder="Short bio..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">LinkedIn</label>
                  <input name="linkedin" value={form.social.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">GitHub</label>
                  <input name="github" value={form.social.github} onChange={handleChange} placeholder="https://github.com/..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Display Order</label>
                  <input name="order" type="number" value={form.order} onChange={handleChange} min={0}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-700 rounded-xl text-sm text-slate-300 hover:bg-slate-800 transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm text-white font-medium transition-all disabled:opacity-60">
                  <HiOutlineSave className="w-4 h-4" />
                  {saving ? "Saving..." : (editingId ? "Update" : "Add Member")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-2">Remove Member?</h3>
            <p className="text-slate-400 text-sm mb-6">This will permanently remove the team member.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 border border-slate-700 rounded-xl text-sm text-slate-300 hover:bg-slate-800 transition-all">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 rounded-xl text-sm text-white font-medium transition-all">
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default TeamAdmin;
