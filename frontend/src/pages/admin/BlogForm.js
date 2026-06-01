import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createBlog, updateBlog, getBlogById } from "../../utils/api";
import AdminLayout from "../../components/layout/AdminLayout";
import ImageUpload from "../../components/common/ImageUpload";
import toast from "react-hot-toast";
import { HiOutlineArrowLeft, HiOutlineSave } from "react-icons/hi";

const CATEGORIES = ["Technology", "Business", "Design", "Marketing", "Other"];

const initialForm = {
  title: "", excerpt: "", content: "", coverImage: "",
  category: "Technology", tags: "", status: "draft",
};

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    const fetch = async () => {
      try {
        const res = await getBlogById(id);
        const { title, excerpt, content, coverImage, category, tags, status } = res.data;
        setForm({ title, excerpt, content, coverImage, category, tags: tags?.join(", ") || "", status });
      } catch {
        toast.error("Failed to load blog");
        navigate("/admin/blogs");
      } finally {
        setFetching(false);
      }
    };
    fetch();
  }, [id, isEdit, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e, status) => {
    e.preventDefault();
    if (!form.title || !form.content || !form.excerpt) {
      return toast.error("Title, excerpt and content are required");
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        status: status || form.status,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      };
      if (isEdit) {
        await updateBlog(id, payload);
        toast.success("Blog updated!");
      } else {
        await createBlog(payload);
        toast.success("Blog created!");
      }
      navigate("/admin/blogs");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/admin/blogs")}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
            <HiOutlineArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{isEdit ? "Edit Blog" : "Create Blog"}</h1>
            <p className="text-slate-400 text-sm mt-0.5">{isEdit ? "Update your post" : "Write a new post"}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Title *</label>
                  <input name="title" value={form.title} onChange={handleChange}
                    placeholder="Enter blog title..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Excerpt *</label>
                  <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={3}
                    placeholder="Brief description (max 300 chars)..."
                    maxLength={300}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all resize-none" />
                  <p className="text-xs text-slate-600 mt-1 text-right">{form.excerpt.length}/300</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Content *</label>
                  <textarea name="content" value={form.content} onChange={handleChange} rows={16}
                    placeholder="Write your blog content here... (Markdown supported)"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all resize-none font-mono" />
                </div>
              </div>
            </div>

            {/* Sidebar options */}
            <div className="space-y-5">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-semibold text-white">Publish</h3>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Status</label>
                  <select name="status" value={form.status} onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-60 shadow-lg shadow-blue-500/20">
                    <HiOutlineSave className="w-4 h-4" />
                    {loading ? "Saving..." : (isEdit ? "Update Blog" : "Save Blog")}
                  </button>
                  {!isEdit && (
                    <button type="button" disabled={loading}
                      onClick={(e) => handleSubmit(e, "published")}
                      className="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-60">
                      Publish Now
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-semibold text-white">Details</h3>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Category *</label>
                  <select name="category" value={form.category} onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Tags</label>
                  <input name="tags" value={form.tags} onChange={handleChange}
                    placeholder="react, node, mongodb"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all" />
                  <p className="text-xs text-slate-600 mt-1">Comma-separated</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Cover Image</label>
                  <ImageUpload
                    value={form.coverImage}
                    onChange={(url) => setForm({ ...form, coverImage: url })}
                    folder="blogs"
                    placeholder="Click or drag to upload cover image"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default BlogForm;
